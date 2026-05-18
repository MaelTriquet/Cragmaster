import re
import sys
from pathlib import Path
from urllib.request import urlopen, Request
from bs4 import BeautifulSoup


FRENCH_ORDER = []
for n in range(3, 10):
    for l in ['a', 'b', 'c']:
        FRENCH_ORDER.append(f'{n}{l}')
        FRENCH_ORDER.append(f'{n}{l}+')


def grade_sort_key(grade):
    try:
        return FRENCH_ORDER.index(grade.lower())
    except ValueError:
        return -1

TITLE_RE = re.compile(r'^(.+?),\s*(?:Sport|Trad|Boulder|Mixed|Ice|Aid)\s+climbing\s*\|?\s*theCrag\s*$')

USER_AGENT = 'Mozilla/5.0 (compatible; TopoManager/1.0)'


def _parse_soup(soup):
    title_tag = soup.find('title')
    if not title_tag:
        raise ValueError('No <title> tag found in HTML')
    title_text = title_tag.get_text(strip=True)

    m = TITLE_RE.match(title_text)
    sector_name = m.group(1).strip() if m else title_text.split(',')[0].strip()

    parent_location = None
    crumb_spans = soup.find_all('span', class_='crumb__long')
    if len(crumb_spans) >= 2:
        last = crumb_spans[-1].get_text(strip=True)
        if last == sector_name:
            parent_location = crumb_spans[-2].get_text(strip=True)
        else:
            parent_location = last
    elif crumb_spans:
        parent_location = crumb_spans[-1].get_text(strip=True)

    topo_title = f'{parent_location}-{sector_name}'.replace(' ', '-') if parent_location else sector_name.replace(' ', '-')

    routes = []
    for div in soup.find_all('div', class_='route'):
        cls = div.get('class', [])
        if 'header' in cls:
            continue
        num_span = div.find('span', class_='toponum') or div.find('span', class_='num')
        if num_span is None:
            continue
        try:
            route_index = int(num_span.get_text(strip=True))
        except ValueError:
            continue

        name_span = div.find('span', class_='primary-node-name')
        if name_span is None:
            continue
        name = name_span.get_text(strip=True)

        grade_span = div.find('span', class_='r-grade')
        grade = ''
        if grade_span:
            inner = grade_span.find('span', recursive=False)
            if inner:
                grade = inner.get_text(strip=True)

        routes.append({
            'name': name,
            'grade': grade,
            'sorting_grade': grade_sort_key(grade),
            'route_index': route_index,
            'length': -1,
        })

    return {
        'topo': {'title': topo_title},
        'routes': routes,
    }


def parse_thecrag_html(filepath_or_content):
    if isinstance(filepath_or_content, (str, Path)) and Path(filepath_or_content).is_file():
        with open(filepath_or_content, 'r', encoding='utf-8') as f:
            soup = BeautifulSoup(f.read(), 'html.parser')
    else:
        soup = BeautifulSoup(filepath_or_content, 'html.parser')
    return _parse_soup(soup)


def fetch_thecrag_html(url):
    req = Request(url, headers={'User-Agent': USER_AGENT})
    with urlopen(req, timeout=30) as resp:
        content = resp.read().decode('utf-8')
    soup = BeautifulSoup(content, 'html.parser')
    return content, _parse_soup(soup)


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('Usage: python thecrag_parser.py <path-to-html|url>', file=sys.stderr)
        sys.exit(1)
    arg = sys.argv[1]
    if arg.startswith('http://') or arg.startswith('https://'):
        _, result = fetch_thecrag_html(arg)
    else:
        result = parse_thecrag_html(arg)
    print(f"Topo: {result['topo']}")
    print(f"Routes ({len(result['routes'])}):")
    for r in result['routes']:
        print(f"  #{r['route_index']:2d}: {r['name']:<40s} [{r['grade']:6s}]  sorting={r['sorting_grade']}")
