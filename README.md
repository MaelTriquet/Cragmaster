# Cragmaster

A climbing topo manager

## DB

### User

- id
- username
- password_hash
- is_admin

### Topo

- id
- title
- location
- ocr_text
- uploaded_by

### Route

- id
- name
- grade
- length
- topo_id

### Comment

- id
- user_id
- route_id
- stars
- body
- perceived_grade

## Uploads

All PDFs are uploaded to this folder
