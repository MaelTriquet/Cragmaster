from fuzzysearch import find_near_matches

def fuzzy_search(query, l):
    max_dist = 3
    results = []
    results_dist = []
    for el in l:
        fuzzy = find_near_matches(query, el, max_l_dist=max_dist)
        if fuzzy:
            results.append((el, fuzzy))

    for dist in range(max_dist):
        results_dist.append([])
        for el in results:
            if el[1][0].dist == dist:
                results_dist[dist].append(el)
        results_dist[dist].sort(key=lambda x: len(x[1]), reverse=True)

    results = []
    for dist in range(max_dist):
        for el in results_dist[dist]:
            results.append(el[0])
    return results


