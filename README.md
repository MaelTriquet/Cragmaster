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
- filename

### Route

- id
- index
- name
- grade
- sorting_grade
- length
- topo_id

### Comment

- id
- user_id
- route_id
- stars
- body
- perceived_grade
- created_at

### Attempt

- id
- user_id
- route_id
- sent
- amount

### Tag

- id
- name

### RouteTag

- id
- route_id
- tag_id

## Uploads

All PDFs are uploaded to this folder

## Pages

### Login

a login page, asking for username and password. First page presented to user.

### Topos

a page listing all topos in alphabetical order. Each topo has a link to its detail page.

### Topo detail

a page detailing a topo. It shows the topo's info from the database, and the routes it contains.
By default, the routes are shown as a sideways histogram of grades. Clicking on a grade will show the routes with that grade, clicking again will hide them.
The routes can also be shown orderd by index.
Each route has a link to its detail page.

### Route detail

a page detailing a route. It shows the route's info from the database, its tags, its attempts and the comments it contains.
you can add a comment by clicking on the "Add Comment" button, presenting a form to write the comment.

### Search

a search page, with a search bar. a search query is sent when there are at least 3 characters in the search bar, and whenever a character is added to the search bar. 
the results show as 2 columns: the topos and the routes.

### Upload

an upload page, asking for a PDF file. The file is uploaded to the uploads folder, and the topo and routes are parsed and added to the database.
