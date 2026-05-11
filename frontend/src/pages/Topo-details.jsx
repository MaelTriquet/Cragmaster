import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from '../api/client'
import axios from 'axios'

const getGradeColor = (grade) => {
  if (grade < 0) return 'hsl(0, 0%, 50%)'
  // Keyframe stops: [sorting_grade_index, hue, saturation%, lightness%]
const stops = [
  [0,  105, 55, 48],  // 3a  — muted green
  [11.5, 88,  60, 46],  // between 4c+ and 5a
  [17.5, 65,  70, 46],  // between 5c+ and 6a
  [19.5, 45,  75, 48],  // between 6a+ and 6b
  [21.5, 30,  78, 46],  // between 6b+ and 6c
  [23.5, 18,  80, 45],  // between 6c+ and 7a
  [25.5, 6,   82, 44],  // between 7a+ and 7b
  [27.5, 352, 80, 42],  // between 7b+ and 7c
  [29.5, 330, 75, 38],  // between 7c+ and 8a
  [35,   285, 70, 32],  // 8b+ — dark purple
]
  // Clamp to range
  if (grade <= stops[0][0]) {
    return `hsl(${stops[0][1]}, ${stops[0][2]}%, ${stops[0][3]}%)`
  }
  if (grade >= stops[stops.length - 1][0]) {
    const s = stops[stops.length - 1]
    return `hsl(${s[1]}, ${s[2]}%, ${s[3]}%)`
  }

  // Find surrounding stops and interpolate
  let lo, hi
  for (let i = 0; i < stops.length - 1; i++) {
    if (grade >= stops[i][0] && grade <= stops[i + 1][0]) {
      lo = stops[i]
      hi = stops[i + 1]
      break
    }
  }

  const t = (grade - lo[0]) / (hi[0] - lo[0])
  // Interpolate hue the short way around the color wheel
  let dh = hi[1] - lo[1]
  if (dh > 180)  dh -= 360
  if (dh < -180) dh += 360
  const h = lo[1] + dh * t
  const s = lo[2] + (hi[2] - lo[2]) * t
  const l = lo[3] + (hi[3] - lo[3]) * t

  return `hsl(${h.toFixed(1)}, ${s.toFixed(1)}%, ${l.toFixed(1)}%)`
}

const S = {
  root: {
    minHeight: "100vh",
    background: "var(--rock)",
    padding: "3rem 2rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },

  noise: {
    position: "fixed",
    inset: 0,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
    backgroundSize: "128px",
    pointerEvents: "none",
    opacity: 0.5,
    zIndex: 0,
  },

  container: {
    width: "100%",
    maxWidth: "800px",
    position: "relative",
    zIndex: 1,
  },

  // ── BACK ──
  backBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.4rem",
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.75rem",
    fontWeight: 600,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "var(--muted)",
    cursor: "pointer",
    background: "none",
    border: "none",
    padding: "0",
    marginBottom: "1.75rem",
    transition: "color 0.15s",
  },

  // ── HEADER ──
  header: {
    borderLeft: "4px solid var(--hold)",
    paddingLeft: "1.5rem",
    marginBottom: "2rem",
  },

  eyebrow: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.68rem",
    fontWeight: 600,
    letterSpacing: "0.2em",
    color: "var(--hold)",
    textTransform: "uppercase",
    display: "block",
    marginBottom: "0.4rem",
  },

  title: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "3.5rem",
    fontWeight: 800,
    letterSpacing: "0.02em",
    textTransform: "uppercase",
    color: "var(--chalk)",
    margin: "0 0 0.5rem 0",
    lineHeight: 0.95,
  },

  metaRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    flexWrap: "wrap",
    marginTop: "0.75rem",
  },

  metaText: {
    fontFamily: "Barlow, sans-serif",
    fontSize: "0.9rem",
    color: "var(--muted)",
  },

  routeCount: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.72rem",
    fontWeight: 700,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "var(--chalk)",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid var(--line)",
    padding: "0.2rem 0.6rem",
  },

  // ── TOOLBAR ──
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "1.75rem",
    gap: "1rem",
    flexWrap: "wrap",
  },

  toggleGroup: {
    display: "flex",
    border: "1px solid var(--line)",
    overflow: "hidden",
  },

  toggleBtn: (active) => ({
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.78rem",
    fontWeight: 700,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    padding: "0.5rem 1.1rem",
    cursor: "pointer",
    border: "none",
    background: active ? "var(--hold)" : "transparent",
    color: active ? "var(--chalk)" : "var(--muted)",
    transition: "background 0.15s, color 0.15s",
    borderRight: "1px solid var(--line)",
  }),

  downloadBtn: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.78rem",
    fontWeight: 700,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    padding: "0.5rem 1.1rem",
    cursor: "pointer",
    background: "transparent",
    color: "var(--muted)",
    border: "1px solid var(--line)",
    transition: "border-color 0.15s, color 0.15s",
  },

  // ── HISTOGRAM ──
  histogramSection: {
    display: "flex",
    flexDirection: "column",
    gap: "0",
  },

  histogramRow: {
    display: "flex",
    alignItems: "center",
    gap: "0",
    cursor: "pointer",
    padding: "0.5rem 0",
    borderBottom: "1px solid var(--line)",
    transition: "background 0.1s",
  },

  gradeLabel: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.85rem",
    fontWeight: 700,
    letterSpacing: "0.08em",
    color: "var(--chalk)",
    width: "52px",
    flexShrink: 0,
  },

  barTrack: {
    flex: 1,
    height: "8px",
    background: "rgba(255,255,255,0.04)",
    position: "relative",
    marginRight: "0.75rem",
  },

  bar: (width, color) => ({
    position: "absolute",
    left: 0,
    top: 0,
    height: "100%",
    width: `${width}%`,
    background: color,
    transition: "width 0.3s ease",
  }),

  countLabel: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.72rem",
    fontWeight: 600,
    letterSpacing: "0.1em",
    color: "var(--muted)",
    width: "28px",
    textAlign: "right",
    flexShrink: 0,
  },

  chevron: (expanded) => ({
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.75rem",
    color: "var(--muted)",
    marginLeft: "0.75rem",
    transition: "transform 0.2s",
    transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
    display: "inline-block",
    width: "14px",
    flexShrink: 0,
  }),

  // ── EXPANDED ROUTES ──
  routeDrawer: {
    background: "var(--granite)",
    borderBottom: "1px solid var(--line)",
    padding: "0.5rem 0 0.75rem 52px",
    display: "flex",
    flexDirection: "column",
    gap: "0",
  },

  routeRow: {
    display: "flex",
    alignItems: "center",
    padding: "0.45rem 0.75rem 0.45rem 0",
    cursor: "pointer",
    gap: "0.75rem",
    transition: "background 0.1s",
  },

  routeName: {
    fontFamily: "Barlow, sans-serif",
    fontSize: "0.9rem",
    fontWeight: 400,
    color: "var(--chalk)",
    flex: 1,
    transition: "color 0.15s",
  },

  routeNameHover: {
    color: "var(--hold-lt)",
  },

  routeLength: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.72rem",
    fontWeight: 600,
    letterSpacing: "0.08em",
    color: "var(--muted)",
  },

  routeArrow: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.75rem",
    color: "var(--line)",
    transition: "color 0.15s",
  },

  // ── INDEX VIEW ──
  indexList: {
    display: "flex",
    flexDirection: "column",
  },

  indexRow: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    padding: "0.65rem 0",
    borderBottom: "1px solid var(--line)",
    cursor: "pointer",
    transition: "background 0.1s",
  },

  indexNum: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.72rem",
    fontWeight: 700,
    letterSpacing: "0.08em",
    color: "var(--muted)",
    width: "36px",
    flexShrink: 0,
    textAlign: "right",
  },

  indexName: {
    fontFamily: "Barlow, sans-serif",
    fontSize: "0.9rem",
    color: "var(--chalk)",
    flex: 1,
    transition: "color 0.15s",
  },

  indexGrade: (color) => ({
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.72rem",
    fontWeight: 700,
    letterSpacing: "0.1em",
    color: "var(--chalk)",
    background: color,
    padding: "0.15rem 0.5rem",
    flexShrink: 0,
  }),

  // ── ADD ROUTE FORM ────────────────────────────────────────────────────────────────────
   btnRow: {
    display: "flex",
    gap: "0.75rem",
    marginTop: "1.25rem",
    flexWrap: "wrap",
  },

  btnGhost: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.85rem",
    fontWeight: 700,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    padding: "0.6rem 1.2rem",
    background: "transparent",
    color: "var(--chalk)",
    border: "1px solid var(--line)",
    cursor: "pointer",
    transition: "border-color 0.15s, color 0.15s",
  },

  card: {
    background: "var(--granite)",
    borderLeft: "2px solid var(--line)",
    padding: "1.5rem 1.75rem",
    marginBottom: "1.5rem",
  },

  cardTitle: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.72rem",
    fontWeight: 600,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: "var(--hold)",
    marginBottom: "1.25rem",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "0.85rem",
    marginBottom: "0.85rem",
  },

  formField: {
    display: "flex",
    flexDirection: "column",
    gap: "0.35rem",
  },

  formFieldFull: {
    display: "flex",
    flexDirection: "column",
    gap: "0.35rem",
    gridColumn: "1 / -1",
  },

  formLabel: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.65rem",
    fontWeight: 600,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "var(--muted)",
  },

  formInput: {
    background: "var(--rock)",
    border: "1px solid var(--line)",
    color: "var(--chalk)",
    fontFamily: "Barlow, sans-serif",
    fontSize: "0.95rem",
    padding: "0.55rem 0.75rem",
    outline: "none",
    transition: "border-color 0.15s",
    width: "100%",
    boxSizing: "border-box",
  },

  formTextarea: {
    background: "var(--rock)",
    border: "1px solid var(--line)",
    color: "var(--chalk)",
    fontFamily: "Barlow, sans-serif",
    fontSize: "0.95rem",
    padding: "0.55rem 0.75rem",
    outline: "none",
    transition: "border-color 0.15s",
    width: "100%",
    boxSizing: "border-box",
    resize: "vertical",
    minHeight: "90px",
  },

  divider: {
    height: "1px",
    background: "var(--line)",
    margin: "1.25rem 0",
  },


  btnPrimary: {
    fontFamily: "Barlow Condensed, sans-serif",
    fontSize: "0.85rem",
    fontWeight: 700,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    padding: "0.6rem 1.2rem",
    background: "var(--hold)",
    color: "var(--chalk)",
    border: "none",
    cursor: "pointer",
    transition: "background 0.15s",
  },

}

export default function TopoDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [topo, setTopo] = useState(null)
  const [routes, setRoutes] = useState([])
  const [parkingLocation, setParkingLocation] = useState(null)
  const [routesLocation, setRoutesLocation] = useState(null)
  const [view, setView] = useState("grades")
  const [expandedGrades, setExpandedGrades] = useState({})
  const [hoveredBtn, setHoveredBtn] = useState(null)
  const [hoveredRoute, setHoveredRoute] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)

  const [addForm, setAddForm] = useState({
    name: "",
    grade: "",
    length: "",
    route_index: "",
  })

  useEffect(() => {
    api.get(`/topos/${id}`)
      .then(res => {
        setTopo(res.data.topo)
        setRoutes(res.data.routes)
		setParkingLocation(res.data.parking_location)
		setRoutesLocation(res.data.routes_location)
      })
      .catch(err => console.error(err))
  }, [id])

  const submitRouteAdd = () => {
    api.post(`/topos/${id}/add_route`, addForm)
      .then(res => {
        setRoutes(res.data.routes)
        setShowAddForm(false)
        setAddForm({ name: "", grade: "", length: "", route_index: "" })
      })
  }

  if (!topo) return (
    <div style={{ ...S.root, justifyContent: "center" }}>
      <span style={{ fontFamily: "Barlow Condensed", fontSize: "1.2rem", letterSpacing: "0.1em", color: "var(--muted)" }}>
        LOADING…
      </span>
    </div>
  )

  const gradesMap = routes.reduce((acc, r) => {
    if (!acc[r.grade]) acc[r.grade] = []
    acc[r.grade].push(r)
    return acc
  }, {})

  // Sort grades by sorting_grade value for proper climbing grade order
  const grades = Object.keys(gradesMap).sort((a, b) => {
    const sa = gradesMap[a][0].sorting_grade
    const sb = gradesMap[b][0].sorting_grade
    return sa - sb
  })

  const maxCount = Math.max(...grades.map(g => gradesMap[g].length), 1)

  const toggleGrade = (g) => {
    setExpandedGrades(prev => ({ ...prev, [g]: !prev[g] }))
  }

  const sendLocationParking = () => {
    // Check if browser supports geolocation
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    // Get current position
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        try {
          // Send POST request
          const response = await api.post(
            `/topos/${id}/set_location_parking`,
            {
			  lat: latitude,
              lon: longitude,
            }
          );

		  setParkingLocation({ lat: latitude, lon: longitude });
        } catch (error) {
          console.error("Error sending location:", error);
        }
      },

      // Error callback
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to retrieve your location");
      }
    );
  };

  
  const sendLocationRoutes = () => {
    // Check if browser supports geolocation
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    // Get current position
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        try {
          // Send POST request
          const response = await api.post(
            `/topos/${id}/set_location_routes`,
            {
			  lat: latitude,
              lon: longitude,
            }
          );

		  setRoutesLocation({ lat: latitude, lon: longitude });
        } catch (error) {
          console.error("Error sending location:", error);
        }
      },

      // Error callback
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to retrieve your location");
      }
    );
  };

  const openGPS = (position) => {
    const url =
      `https://www.google.com/maps/dir/?api=1&destination=${position.lat},${position.lon}`;

    window.open(url, "_blank");
  };

  return (
    <div style={S.root}>
      <div style={S.noise} />

      <div style={S.container}>

        {/* ── BACK ── */}
        <button
          style={{
            ...S.backBtn,
            color: hoveredBtn === "back" ? "var(--chalk)" : "var(--muted)",
          }}
          onMouseEnter={() => setHoveredBtn("back")}
          onMouseLeave={() => setHoveredBtn(null)}
          onClick={() => navigate("/topos")}
        >
          ← All Topos
        </button>

        {/* ── HEADER ── */}
        <div style={S.header}>
          <span style={S.eyebrow}>Topo</span>
          <h1 style={S.title}>{topo.title}</h1>
          <div style={S.metaRow}>
            <span style={S.routeCount}>{routes.length} route{routes.length !== 1 ? "s" : ""}</span>
          </div>

  		  <div style={S.btnRow}>
  		    <button
  		  	style={{
  		  	  ...S.btnGhost,
  		  	  borderColor: hoveredBtn === "addRoute" ? "var(--hold)" : "var(--line)",
  		  	  color: hoveredBtn === "addRoute" ? "var(--hold)" : "var(--chalk)",
  		  	}}
  		  	onMouseEnter={() => setHoveredBtn("addRoute")}
  		  	onMouseLeave={() => setHoveredBtn(null)}
  		  	onClick={() => setShowAddForm(v => !v)}
  		    >
  		  	{showAddForm ? "Cancel Add" : "Add Route"}
  		    </button>
  		  </div>
			{showAddForm && (
			  <div style={{ ...S.card, marginTop: "1.5rem" }}>
				<div style={S.cardTitle}>Add Route</div>

				<div style={S.formGrid}>
				  <div style={S.formField}>
					<label style={S.formLabel}>Name</label>
					<input
					  type="text"
					  style={S.formInput}
					  value={addForm.name}
					  onChange={e =>
						setAddForm({ ...addForm, name: e.target.value })
					  }
					  onFocus={e => e.target.style.borderColor = "var(--hold)"}
					  onBlur={e => e.target.style.borderColor = "var(--line)"}
					/>
				  </div>

				  <div style={S.formField}>
					<label style={S.formLabel}>Grade</label>
					<input
					  type="text"
					  style={S.formInput}
					  value={addForm.grade}
					  onChange={e =>
						setAddForm({ ...addForm, grade: e.target.value })
					  }
					  onFocus={e => e.target.style.borderColor = "var(--hold)"}
					  onBlur={e => e.target.style.borderColor = "var(--line)"}
					/>
				  </div>

				  <div style={S.formField}>
					<label style={S.formLabel}>Length (m)</label>
					<input
					  type="number"
					  style={S.formInput}
					  value={addForm.length}
					  onChange={e =>
						setAddForm({ ...addForm, length: e.target.value })
					  }
					  onFocus={e => e.target.style.borderColor = "var(--hold)"}
					  onBlur={e => e.target.style.borderColor = "var(--line)"}
					/>
				  </div>

				  <div style={S.formField}>
					<label style={S.formLabel}>Route Index</label>
					<input
					  type="number"
					  style={S.formInput}
					  value={addForm.route_index}
					  onChange={e =>
						setAddForm({ ...addForm, route_index: e.target.value })
					  }
					  onFocus={e => e.target.style.borderColor = "var(--hold)"}
					  onBlur={e => e.target.style.borderColor = "var(--line)"}
					/>
				  </div>
				</div>

				<button
				  style={{
					...S.btnPrimary,
					marginTop: "1rem",
					background:
					  hoveredBtn === "addRoute"
						? "var(--hold-lt)"
						: "var(--hold)",
				  }}
				  onMouseEnter={() => setHoveredBtn("addRoute")}
				  onMouseLeave={() => setHoveredBtn(null)}
				  onClick={submitRouteAdd}
				>
				  Add Route
				</button>
			  </div>
			)}


        </div>

		{ parkingLocation.lat !== null ? (<button
		  style={{
				  	  ...S.btnGhost,
				  	  borderColor: hoveredBtn === "setParkingLocation" ? "var(--hold)" : "var(--line)",
				  	  color: hoveredBtn === "setParkingLocation" ? "var(--hold)" : "var(--chalk)",
				  }}
		  onMouseEnter={() => setHoveredBtn("setParkingLocation")}
		  onMouseLeave={() => setHoveredBtn(null)}
		  onClick={() => openGPS(parkingLocation)}
		>
		  Go to Parking Location
		</button>):
		(<button
		  style={{
  		  	  ...S.btnGhost,
  		  	  borderColor: hoveredBtn === "setParkingLocation" ? "var(--hold)" : "var(--line)",
  		  	  color: hoveredBtn === "setParkingLocation" ? "var(--hold)" : "var(--chalk)",
  		  }}
		  onMouseEnter={() => setHoveredBtn("setParkingLocation")}
		  onMouseLeave={() => setHoveredBtn(null)}
		  onClick={sendLocationParking}
		>
		  Set Parking Location
		</button>)}


		{ routesLocation.lat !== null ? (<button
		  style={{
				  	  ...S.btnGhost,
				  	  borderColor: hoveredBtn === "setRoutesLocation" ? "var(--hold)" : "var(--line)",
				  	  color: hoveredBtn === "setRoutesLocation" ? "var(--hold)" : "var(--chalk)",
					  marginBottom: "1rem",
				  }}
		  onMouseEnter={() => setHoveredBtn("setRoutesLocation")}
		  onMouseLeave={() => setHoveredBtn(null)}
		  onClick={() => openGPS(routesLocation)}
		>
		  Go to Routes Location
		</button>):
		(<button
		  style={{
  		  	  ...S.btnGhost,
  		  	  borderColor: hoveredBtn === "setRoutesLocation" ? "var(--hold)" : "var(--line)",
  		  	  color: hoveredBtn === "setRoutesLocation" ? "var(--hold)" : "var(--chalk)",
			  marginBottom: "1rem",
			
  		  	}}
		  onMouseEnter={() => setHoveredBtn("setRoutesLocation")}
		  onMouseLeave={() => setHoveredBtn(null)}
		  onClick={sendLocationRoutes}
		>
		  Set Routes Location
		</button>)}


        {/* ── TOOLBAR ── */}
        <div style={S.toolbar}>
          <div style={S.toggleGroup}>
            <button
              style={S.toggleBtn(view === "grades")}
              onClick={() => setView("grades")}
            >
              By Grade
            </button>
            <button
              style={{ ...S.toggleBtn(view === "index"), borderRight: "none" }}
              onClick={() => setView("index")}
            >
              By Index
            </button>
          </div>

          <button
            style={{
              ...S.downloadBtn,
              borderColor: hoveredBtn === "dl" ? "var(--hold)" : "var(--line)",
              color: hoveredBtn === "dl" ? "var(--hold)" : "var(--muted)",
            }}
            onMouseEnter={() => setHoveredBtn("dl")}
            onMouseLeave={() => setHoveredBtn(null)}
            onClick={() => window.open(`/api/topos/${id}/download`, "_blank")}
          >
            ↓ PDF
          </button>
        </div>

        {/* ── GRADES VIEW ── */}
        {view === "grades" && (
          <div style={S.histogramSection}>
            {grades.map(g => {
              const count = gradesMap[g].length
              const barWidth = (count / maxCount) * 85
              const color = getGradeColor(gradesMap[g][0].sorting_grade)
              const expanded = expandedGrades[g]

              return (
                <div key={g}>
                  <div
                    style={{
                      ...S.histogramRow,
                      background: hoveredBtn === `grade-${g}` ? "rgba(255,255,255,0.02)" : "transparent",
                    }}
                    onMouseEnter={() => setHoveredBtn(`grade-${g}`)}
                    onMouseLeave={() => setHoveredBtn(null)}
                    onClick={() => toggleGrade(g)}
                  >
                    <span style={S.gradeLabel}>{g}</span>
                    <div style={S.barTrack}>
                      <div style={S.bar(barWidth, color)} />
                    </div>
                    <span style={S.countLabel}>{count}</span>
                    <span style={S.chevron(expanded)}>›</span>
                  </div>

                  {expanded && (
                    <div style={S.routeDrawer}>
                      {gradesMap[g].map(route => (
                        <div
                          key={route.id}
                          style={{
                            ...S.routeRow,
                            background: hoveredRoute === route.id ? "rgba(255,255,255,0.03)" : "transparent",
                          }}
                          onMouseEnter={() => setHoveredRoute(route.id)}
                          onMouseLeave={() => setHoveredRoute(null)}
                          onClick={() => navigate("/routes/" + route.id)}
                        >
                          <span style={{
                            ...S.routeName,
                            ...(hoveredRoute === route.id ? S.routeNameHover : {}),
                          }}>
                            {route.name}
                          </span>
                          {route.length > 0 && (
                            <span style={S.routeLength}>{route.length}m</span>
                          )}
                          <span style={{
                            ...S.routeArrow,
                            color: hoveredRoute === route.id ? "var(--hold)" : "var(--line)",
                          }}>›</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* ── INDEX VIEW ── */}
        {view === "index" && (
          <div style={S.indexList}>
            {[...routes]
              .sort((a, b) => (a.route_index ?? 0) - (b.route_index ?? 0))
              .map(route => (
                <div
                  key={route.id}
                  style={{
                    ...S.indexRow,
                    background: hoveredRoute === route.id ? "rgba(255,255,255,0.02)" : "transparent",
                  }}
                  onMouseEnter={() => setHoveredRoute(route.id)}
                  onMouseLeave={() => setHoveredRoute(null)}
                  onClick={() => navigate("/routes/" + route.id)}
                >
                  <span style={S.indexNum}>
                    {route.route_index >= 0 ? `#${route.route_index}` : "—"}
                  </span>
                  <span style={{
                    ...S.indexName,
                    color: hoveredRoute === route.id ? "var(--hold-lt)" : "var(--chalk)",
                  }}>
                    {route.name}
                  </span>
                  {route.length > 0 && (
                    <span style={S.routeLength}>{route.length}m</span>
                  )}
                  <span style={S.indexGrade(getGradeColor(route.sorting_grade))}>
                    {route.grade}
                  </span>
                </div>
              ))}
          </div>
        )}

      </div>
    </div>
  )
}
