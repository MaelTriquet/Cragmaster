import re
import pdfplumber
from pdf2image import convert_from_path
import pytesseract

GRADE_PATTERN = r'[3-9][abcABC]\+?'


FRENCH_ORDER = []
for n in range(3, 10):
    for l in ['a', 'b', 'c']:
        FRENCH_ORDER.append(f'{n}{l}')
        FRENCH_ORDER.append(f'{n}{l}+')

def grade_sort_key(grade):
    try: return FRENCH_ORDER.index(grade.lower())
    except ValueError: return -1

# Fixed newline syntax error
ROUTE_LINE_RE = re.compile(
    r'(?:^|\n)\s*(?:\d{1,3}[\.\)]\s+)?'
    r'([A-ZÀ-Ÿa-zà-ÿ][A-ZÀ-Ÿa-zà-ÿ0-9 \'\-\.]{2,50}?)\s+'
    r'([3-9][abcABC]\+?|V\d{1,2}|5\.\d{1,2}[abcd]?)'
    r'(?:\s|$)',
    re.MULTILINE
)

def parse_routes(text, topo_id):
    routes_text = extract_routes(text)
    routes = []
    for line in routes_text:
        grade = ''
        length = ''
        index = ''
        for i in range(len(line)-1, -1, -1):
            if re.match(GRADE_PATTERN, line[i]):
                grade = line[i]
                del line[i]
                continue
            if re.match(r'[0-9]+m', line[i]):
                length = line[i][:-1]
                del line[i]
                continue
            if re.match(r'[0-9]+', line[i]) and i == 0:
                index = line[i]
                del line[i]
                continue

        name = ' '.join(line)
        routes.append({'index': index, 'name': name, 'grade': grade, 'sorting_grade': grade_sort_key(grade), 'topo_id': topo_id, 'length':length})
    return routes

def extract_routes(text):
    routes = []
    for line in text.split('\n'):
        words = line.split(' ')
        for word in words:
            if re.match(GRADE_PATTERN, word):
                routes.append(words)
                break
    return routes

def extract_text_from_pdf(filepath):
    text_parts = []
    page_count = 0
    try:
        with pdfplumber.open(filepath) as pdf:
            page_count = len(pdf.pages)
            for page in pdf.pages:
                t = page.extract_text()
                if t: text_parts.append(t)
    except Exception as e: print(f'pdfplumber error: {e}')
    full_text = '\n'.join(text_parts)
    if len(full_text.strip()) < 100:
        try:
            images = convert_from_path(filepath, dpi=150, first_page=1, last_page=min(page_count or 10, 10))
            for img in images:
                text_parts.append(pytesseract.image_to_string(img, lang='fra+eng'))
            full_text = '\n'.join(text_parts)
        except Exception as e: print(f'OCR error: {e}')
    return full_text
