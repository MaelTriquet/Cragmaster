# Cragmaster

A climbing topo manager — browse, upload, annotate, and track progress on climbing routes.

---

## Home dashboard

The **Home** page shows site-wide statistics (topos, routes, users), completion scores for parking, route-base locations, tags, and photos, a list of recently added topos, and a leaderboard of top contributors.

---

## Upload PDF topos

Import PDF climbing guides on the **Upload** page. Drag-and-drop one or more PDFs, and the app extracts route names and French grades (`3a`–`9c+`) automatically using OCR (pdfplumber with Tesseract fallback). Each topo gets a title from its filename and becomes available immediately. Duplicate filenames are rejected.

---

## Browse topos and routes

The **Topos** page lists every uploaded guide — filter by sector or grade range. Click any topo to open its detail page, where routes are displayed in two modes:

- **By Grade** — a sideways histogram showing how many routes exist at each grade. Click a grade row to expand and see those routes.
- **By Index** — a flat list ordered by route number (`#1`, `#2`, …), handy for following the PDF page order.

Each route shows its name, grade (color-coded), and length in meters.

On the topo detail page you can also download the original PDF, upload a topo photo, add routes manually, rename the topo, and **set parking and route-base locations** using your browser's geolocation — once set, a button opens Google Maps / Apple Maps directions straight to the crag.

---

## Track attempts

Head to any **Route** detail page to log your climbing progress:

- Click **"+ Attempt"** to log a try.
- Click **"Mark Sent"** to log a try and mark the route as sent.
- The route shows one of three statuses: *Not attempted*, *Working*, or *Sent*.

---

## Project routes

Bookmark any route as a **project** with a single toggle on its detail page. Track which routes you're working on.

---

## Dashboard and stats

The **Stats** page gives you a personal climbing dashboard:

- Summary cards for routes sent, total attempts, and routes in progress.
- Your hardest grade sent, with a miniature grade pyramid.
- Full grade pyramid (sends per grade) as a vertical bar chart.
- Average attempts to send per grade.
- Flash rate by grade.
- Tag breakdown of your sends.
- A **Working routes** list — every route you've tried but haven't sent yet, with a link straight to its detail page.

You can also view another climber's stats by navigating to their stats URL.

---

## Comment and share beta

On any route detail page, leave a comment with:

- A star rating (0–5 in half-star steps).
- A perceived grade (defaults to the route's listed grade).
- A visible note and an optional **hidden beta** field — beta text is hidden behind a "Show beta" toggle, so you can share crux moves without spoiling others.

One comment per user per route; posting again overwrites your previous one. You can also delete your own comments.

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

## Edit routes

On a route's detail page, use the **"Edit Route"** form to change its name, grade, length, and index number. Upload a route photo.

---

## Profile and account

The **Profile** page lets you change your username, set or update your email address (for password recovery), and change your password.

---

## Feature voting

The **Coming Soon** page lists planned features. Upvote or downvote the ones you'd like to see — this helps prioritise development.

---

## Report issues

Use the **Report an issue** button in the footer to submit bug reports, suggestions, or other feedback (rate-limited to once per day).

---

## Audit log

The **My Changes** page shows your past contributions — route additions, edits, and other actions — with the ability to restore a previous version.

---

## Forgot password

If you've set an email address on your profile, use the **Forgot Password** page to receive a reset link.

---

## Language

The interface is available in **English** and **French** — toggle between them in the navigation bar.

---

## Offline support

Cragmaster caches content for offline use and queues your actions when you're disconnected. Pending changes sync automatically when the connection returns.

---

## Mobile app

Cragmaster can be built as an Android app via Capacitor. See `build_apk.sh` for instructions.

---

Cragmaster is free software released under the [GNU General Public License v3.0](LICENSE). Report issues at the [GitHub repository](https://github.com/anomalyco/topo-manager).
