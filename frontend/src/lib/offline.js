import { get, set, del, keys } from 'idb-keyval'
import api from '../api/client'

const TOPO_PREFIX = 'offline-topo-'
const ROUTE_PREFIX = 'offline-route-'
const IDS_KEY = 'offline-topo-ids'

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

export async function saveTopoForOffline(topoId) {
  const topoRes = await api.get(`/topos/${topoId}`)
  const { topo, routes, parking_location, routes_location } = topoRes.data

  const topoData = { topo, routes, parking_location, routes_location, savedAt: Date.now() }

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
}

export async function getOfflineTopoIds() {
  return getTopoIds()
}

export function isOnline() {
  return navigator.onLine
}
