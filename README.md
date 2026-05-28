# Cragmaster

A climbing topo manager — browse, annotate, and track progress on climbing routes.

---

## Upload PDF topos

Import PDF climbing guides on the **Upload** page. Drag-and-drop one or more PDFs, and the app extracts route names and French grades (`3a`–`9c+`) automatically using OCR. Each topo gets a title from its filename and becomes available immediately. Duplicate filenames are rejected.

---

## Browse topos and routes

The **Topos** page lists every uploaded guide in alphabetical order. Click any topo to open its detail page, where routes are displayed in two modes:

- **By Grade** — a sideways histogram showing how many routes exist at each grade. Click a grade row to expand and see those routes.
- **By Index** — a flat list ordered by route number (`#1`, `#2`, …), handy for following the PDF page order.

Each route shows its name, grade (color-coded), and length in meters.

On the topo detail page you can also download the original PDF, add routes manually, rename the topo, and **set parking and route-base locations** using your browser's geolocation — once set, a button opens Google Maps / Apple Maps directions straight to the crag.

---

## Track attempts

Head to any **Route** detail page to log your climbing progress:

- Click **"+ Attempt"** to log a try.
- Click **"Mark Sent"** to log a try and mark the route as sent.
- The route shows one of three statuses: *Not attempted*, *Working*, or *Sent*.

---

## Dashboard and stats

The **Stats** page gives you a personal climbing dashboard:

- Summary cards for routes sent, total attempts, and routes in progress.
- Your hardest grade sent, with a miniature grade pyramid.
- Full grade pyramid (sends per grade) as a vertical bar chart.
- Average attempts to send per grade.
- A **Working routes** list — every route you've tried but haven't sent yet, with a link straight to its detail page.

---

## Comment and share beta

On any route detail page, leave a comment with:

- A star rating (0–5 in half-star steps).
- A perceived grade (defaults to the route's listed grade).
- A visible note and an optional **hidden beta** field — beta text is hidden behind a "Show beta" toggle, so you can share crux moves without spoiling others.

One comment per user per route; posting again overwrites your previous one.

---

## Tag routes

Routes can have tags organized by category: **Route profile** (overhang, slab, …), **Hold** (crimp, jug, sloper, …), **Approach** (approach time, exposure, …), **Exposure**, **Style** (power, endurance, technical, …), and **Other** (classic, project, …). Add or remove tags on a route's detail page.

---

## Search

The **Search** page lets you find topos and routes by name — starts searching as soon as you type 3 characters. Results are split into two columns (topos and routes), and each result is clickable to go straight to its detail page.

---

## Map

The **Map** page shows all topos with geographic coordinates on an interactive Leaflet map. Three tile layers: **Topo** (relief + trails), **Street** (OSM), and **Satellite**. Blue markers are parking spots, orange markers are route-base locations. Click any marker to see the topo name and navigate to its detail page.

**Right-click** on empty map space to see a menu of topos that are missing a parking or route-base location — pick one to assign the clicked coordinates.

---

## Profile and account

The **Profile** page lets you change your username and password.

**Admin users** also see a user creation form with a "Generate a passphrase" button that creates random route-name passwords. An **SQL query console** (`/query`) lets admins run arbitrary SELECT/INSERT/UPDATE/DELETE statements against the database with results shown in a table.

---

Cragmaster is free software. Report issues at the [GitHub repository](https://github.com/anomalyco/topo-manager).
