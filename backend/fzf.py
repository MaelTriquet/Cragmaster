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
