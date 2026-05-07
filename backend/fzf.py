from fuzzysearch import find_near_matches

# def fuzzy_search(query, l):
#     max_dist = 3
#     results = []
#     results_dist = []
#     for el in l:
#         fuzzy = find_near_matches(query, el, max_l_dist=max_dist)
#         if fuzzy:
#             results.append((el, fuzzy))
#
#     for dist in range(max_dist):
#         results_dist.append([])
#         for el in results:
#             if el[1][0].dist == dist:
#                 results_dist[dist].append(el)
#         results_dist[dist].sort(key=lambda x: len(x[1]), reverse=True)
#
#     results = []
#     for dist in range(max_dist):
#         for el in results_dist[dist]:
#             results.append(el[0])
#     return results

def fuzzy_search(query, l):
    MAX_DIST = 1
    buckets = [[] for _ in range(MAX_DIST + 1)]

    for s in l:
        best = None
        # Slide a window of len(query) across the string
        window_len = len(query)
        for i in range(len(s) - window_len + 1):
            window = s[i:i + window_len]
            dist = sum(a != b for a, b in zip(query.lower(), window.lower()))
            if best is None or dist < best:
                best = dist
            if best == 0:
                break  # can't do better, stop early

        if best is not None and best <= MAX_DIST:
            buckets[best].append(s)

    # Flatten buckets: dist=0 first, then 1, 2, 3
    return [s for bucket in buckets for s in bucket]
