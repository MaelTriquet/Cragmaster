# Cragmaster - climbing topo manager
# Copyright (C) 2026  mtriquet
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <https://www.gnu.org/licenses/>.

import unicodedata

def _norm(s):
    return unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode('ascii').lower()

def fuzzy_search(query, l):
    MAX_DIST = 0
    buckets = [[] for _ in range(MAX_DIST + 1)]
    q_norm = _norm(query)
    window_len = len(q_norm)

    for s in l:
        s_norm = _norm(s)
        best = None
        best_pos = None
        for i in range(len(s_norm) - window_len + 1):
            window = s_norm[i:i + window_len]
            dist = sum(a != b for a, b in zip(q_norm, window))
            if best is None or dist < best:
                best = dist
                best_pos = i
            if best == 0:
                break

        if best is not None and best <= MAX_DIST:
            buckets[best].append((s, best_pos))

    result = []
    for bucket in buckets:
        bucket.sort(key=lambda x: x[1])
        result.extend(bucket)
    return result
