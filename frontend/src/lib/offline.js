// Cragmaster - climbing topo manager
// Copyright (C) 2026  mtriquet
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { get, set, del, keys } from 'idb-keyval'
import { baseURL } from '../api/client'
import api from '../api/client'

const TOPO_PREFIX = 'offline-topo-'
const ROUTE_PREFIX = 'offline-route-'
const IDS_KEY = 'offline-topo-ids'
const PENDING_KEY = 'offline-pending'
const SEARCH_INDEX_KEY = 'offline-search-index'

let _syncListeners = []
let _connListeners = []

/* ── connection status (0=unknown, 1=online, 2=offline) ── */

let _connectionStatus = 0

export function getConnectionStatus() {
  return _connectionStatus
}

export function isOnline() {
  return _connectionStatus === 1
}

let _pingPromise = null

export async function ping() {
  if (_pingPromise) return _pingPromise
  _pingPromise = _doPing()
  try {
    return await _pingPromise
  } finally {
    _pingPromise = null
  }
}

async function _doPing() {
  try {
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), 1000)
    await fetch(`${baseURL}/ping`, { signal: controller.signal, credentials: 'include' })
    clearTimeout(id)
    if (_connectionStatus !== 1) {
      _connectionStatus = 1
      notifyConnListeners()
    }
  } catch {
    if (_connectionStatus !== 2) {
      _connectionStatus = 2
      notifyConnListeners()
    }
  }
  return _connectionStatus
}

export function checkConnection() {
  return ping()
}

export function onConnectionChange(fn) {
  _connListeners.push(fn)
  return () => { _connListeners = _connListeners.filter(f => f !== fn) }
}

function notifyConnListeners() {
  _connListeners.forEach(fn => fn(_connectionStatus))
}

if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    if (_connectionStatus !== 0) {
      _connectionStatus = 0
      notifyConnListeners()
    }
  })
  window.addEventListener('offline', () => {
    if (_connectionStatus !== 2) {
      _connectionStatus = 2
      notifyConnListeners()
    }
  })
}

/* ── helpers ─────────────────────────────────────── */

async function getTopoIds() {
  return (await get(IDS_KEY)) || []
}

async function addTopoId(id) {
  const ids = await getTopoIds()
  if (!ids.includes(id)) {
    ids.push(id)
    await set(IDS_KEY, ids)
  }
}

/* ── save / load / remove topo ───────────────────── */

export async function saveTopoForOffline(topoId) {
  const topoRes = await api.get(`/topos/${topoId}`)
  const { topo, routes, tags, parking_location, routes_location } = topoRes.data

  const topoData = { topo, routes, tags, parking_location, routes_location, savedAt: Date.now() }
  await set(`${TOPO_PREFIX}${topoId}`, topoData)
  await addTopoId(topoId)

  const routeDetails = []
  for (const route of routes) {
    try {
      const routeRes = await api.get(`/routes/${route.id}`)
      const rd = routeRes.data
      await set(`${ROUTE_PREFIX}${route.id}`, rd)
      routeDetails.push(rd)
    } catch {
    }
  }

  await buildSearchIndex()
  return { topoData, routeDetails }
}

export async function getOfflineTopo(topoId) {
  return get(`${TOPO_PREFIX}${topoId}`)
}

export async function getOfflineRoute(routeId) {
  return get(`${ROUTE_PREFIX}${routeId}`)
}

export async function removeOfflineTopo(topoId) {
  const data = await getOfflineTopo(topoId)
  if (data?.routes) {
    for (const route of data.routes) {
      await del(`${ROUTE_PREFIX}${route.id}`)
    }
  }
  await del(`${TOPO_PREFIX}${topoId}`)
  const ids = await getTopoIds()
  await set(IDS_KEY, ids.filter(id => id !== topoId))
  await buildSearchIndex()
}

export async function getOfflineTopoIds() {
  return getTopoIds()
}

/* ── local cache updates (for user-level mutations) ── */

export async function updateCachedRoute(routeId, updater) {
  const data = await get(`${ROUTE_PREFIX}${routeId}`)
  if (!data) return false
  const updated = updater(data)
  await set(`${ROUTE_PREFIX}${routeId}`, updated)
  return true
}

export async function updateCachedTopo(topoId, updater) {
  const data = await get(`${TOPO_PREFIX}${topoId}`)
  if (!data) return false
  const updated = updater(data)
  await set(`${TOPO_PREFIX}${topoId}`, updated)
  return true
}

/* ── pending action queue ─────────────────────────── */

let actionCounter = 0

export async function addPendingAction(action) {
  const queue = await get(PENDING_KEY) || []
  const entry = { id: `${Date.now()}-${++actionCounter}`, ...action, retries: 0, timestamp: Date.now() }
  queue.push(entry)
  await set(PENDING_KEY, queue)
  notifyListeners()
  return entry
}

export async function getPendingActions() {
  return (await get(PENDING_KEY)) || []
}

export async function getPendingCount() {
  const queue = await get(PENDING_KEY)
  return queue ? queue.length : 0
}

export async function removePendingAction(id) {
  const queue = await get(PENDING_KEY)
  if (!queue) return
  await set(PENDING_KEY, queue.filter(a => a.id !== id))
  notifyListeners()
}

export async function clearPendingActions() {
  await set(PENDING_KEY, [])
  notifyListeners()
}

/* ── sync engine ──────────────────────────────────── */

export async function processSyncQueue() {
  const queue = await getPendingActions()
  if (queue.length === 0) return { synced: 0, failed: 0, total: 0 }

  let synced = 0, failed = 0
  const remaining = []

  for (const action of queue) {
    try {
      const cfg = { method: action.method, url: action.endpoint }
      if (action.body) cfg.data = action.body
      await api(cfg)
      synced++
    } catch (err) {
      if (err.response?.status === 409) {
        failed++
        continue
      }
      action.retries = (action.retries || 0) + 1
      if (action.retries > 5) failed++
      else remaining.push(action)
    }
  }

  await set(PENDING_KEY, remaining)
  notifyListeners()
  return { synced, failed, total: queue.length }
}

export function onSyncChange(fn) {
  _syncListeners.push(fn)
  return () => { _syncListeners = _syncListeners.filter(f => f !== fn) }
}

function notifyListeners() {
  getPendingCount().then(count => {
    _syncListeners.forEach(fn => fn(count))
  })
}

/* ── search index ─────────────────────────────────── */

export async function buildSearchIndex() {
  const ids = await getTopoIds()
  const index = []
  for (const topoId of ids) {
    const data = await get(`${TOPO_PREFIX}${topoId}`)
    if (!data) continue
    for (const route of (data.routes || [])) {
      index.push({
        id: route.id,
        name: route.name,
        grade: route.grade,
        sorting_grade: route.sorting_grade,
        topo_id: topoId,
        topo_title: data.topo?.title || '',
      })
    }
  }
  await set(SEARCH_INDEX_KEY, index)
  return index
}

export async function searchOffline(query, filters = {}) {
  let index = (await get(SEARCH_INDEX_KEY)) || []
  if (!query && !filters.tag_ids?.length && !filters.grade_min_sort && !filters.grade_max_sort) return { routes: [] }

  const q = (query || '').toLowerCase().trim()

  let results = index

  if (q) {
    results = results.filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.topo_title.toLowerCase().includes(q)
    )
  }

  if (filters.grade_min_sort != null) {
    results = results.filter(r => r.sorting_grade >= filters.grade_min_sort)
  }
  if (filters.grade_max_sort != null) {
    results = results.filter(r => r.sorting_grade <= filters.grade_max_sort)
  }

  return {
    routes: results.slice(0, 100).map(r => ({
      ...r,
      match_pos: r.name.toLowerCase().indexOf(q),
      topo_id: r.topo_id,
    })),
    topos: [],
  }
}
