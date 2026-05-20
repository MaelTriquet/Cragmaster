# Cragmaster — Functionalities

A climbing topo manager: browse, upload, annotate, and track progress on climbing routes.

---

## Login (`/login`)

- Sign in with username and password
- JWT token stored in `localStorage`, auto-refreshed on page load
- Default credentials: **admin / admin** (created automatically)

---

## Topos (`/topos`)

Alphabetical list of all uploaded topos.

- See total count
- Click a topo to open its detail page
- "+ Upload" button navigates to the upload page

---

## Topo Detail (`/topos/:id`)

View a single topo and its routes.

**Route display modes:**
- **By Grade** — sideways histogram showing route count per grade. Click a grade row to expand and see individual routes. Each route shows name, length, and a color-coded grade
- **By Index** — flat list sorted by route index (`#1`, `#2`, …). Shows index number, name, length, and grade badge

**Actions:**
- Download the original PDF
- **Add Route** manually (name, grade, length in meters, index number)
- **Edit topo name** — click the "Edit" button next to the title to rename inline (Enter to save, Escape to cancel)
- **Set Parking Location** — uses browser geolocation to tag the parking spot (one-time per topo). Once set, shows "Go to Parking Location" which opens Google Maps / Apple Maps / geo URI depending on device
- **Set Routes Location** — same as above, for the base of the routes

---

## Route Detail (`/routes/:id`)

View a single route, track attempts, and discuss.

**Info:**
- Route name, grade (colored badge), topo name, length

**Attempts:**
- "+ Attempt" button logs a try (increments counter)
- "Mark Sent" button logs a try and marks the route as sent
- Shows attempt count and status: *Not attempted*, *Working*, or *Sent*

**Editing:**
- "Edit Route" form to change name, grade, length, and route index

**Tags:**
- Tags displayed per category (Route profile, Hold, Approach, Exposure, Style, Other)
- Remove a tag by clicking the ✕ on its chip
- Click the **"+ Add Tags"** button at the bottom of the section to open a modal showing all available tags grouped by category. Already-assigned tags are highlighted; click any unassigned tag to add it

**Comments:**
- View all comments from other users (username, star rating, perceived grade, body text)
- "+ Add Comment" opens a form with stars (0–5, 0.5 steps), perceived grade (defaults to the route's grade), a free-text body, and an optional hidden beta/spoiler field
- One comment per user per route (subsequent submissions overwrite)
- Beta text is hidden by default; each comment has a "Show beta" toggle

---

## Search (`/search`)

Search the route and topo library.

- Input triggers fuzzy search when 3+ characters are entered (180 ms debounce)
- Results split into two columns: **Topos** and **Routes**
- Each result is clickable, navigating to its detail page
- Empty state guides the user to start typing

*Note: tag filtering exists in the backend (`?tag_ids=`) but the tag filter bar is currently disabled in the frontend.*

---

## Stats (`/stats`)

Personal climbing dashboard.

- **Summary cards:** routes sent, total attempts, routes in progress
- **Hardest grade sent** hero card with color-coded display and a miniature grade pyramid
- **Grade pyramid** (sends per grade) — vertical bar chart
- **Average attempts to send per grade** — horizontal bar chart
- **Working routes list** — routes attempted but not yet sent (grade, name, topo, attempt count). Clickable to navigate to route detail

---

## Upload (`/upload`)

Import PDF climbing topos.

- Drag-and-drop or click to browse (multiple files supported)
- Accepts `application/pdf` only
- Per-file progress: *Pending → Uploading → OCR → Done / Failed*
- OCR: extracts text with pdfplumber, falls back to Tesseract OCR if text is sparse (< 100 chars)
- Parses French climbing grades (`3a`–`9c+`) and route names automatically
- Auto-titles each topo from the filename (without `.pdf`)
- Rejects duplicate filenames (returns 409)
- Final summary shows total routes parsed and a link to the topo list

---

## Map (`/map`)

Interactive geographic map of topos with Leaflet.

- Three tile layers: **Topo (relief + trails)**, **Street (OSM)**, **Satellite**
- Blue markers = parking locations, Orange markers = routes locations
- Click a marker to see the topo name and a link to its detail page
- **Right-click** on any empty area to open a context menu listing all topos that are missing a parking or routes location. Pick a topo to assign the clicked coordinates
- Shows marker count and empty-state guidance
- Toast notifications confirm or report errors when setting locations

---

## Profile (`/profile`)

User account management.

- Change username
- Change password (leave blank to keep current)
- Passwords must match confirmation field

**Admin-only** (visible if logged-in user has `is_admin = true`):
- **Create New User** form: username, password, optional admin toggle, and a "Generate a passphrase" button that concatenates 2 random route names (lowercased, no spaces) into a password
- New user summary shown on successful creation

---

## Query (`/query`)

SQL query console. **Admin only.**

- Execute arbitrary SQL against the database
- Supports SELECT, INSERT, UPDATE, DELETE
- Results rendered in an HTML table
- Errors displayed inline

---

## Admin-only endpoints (API only, no UI)

The following exist on the backend but have no frontend page:
- **Delete topo** — `DELETE /api/topos/:id`
- **Delete user** — `DELETE /api/users/:uid`
- **List users** — `GET /api/users`
- **Tags CRUD** — create, list, assign, and unassign tags (frontend component exists but is currently disabled via comments)
