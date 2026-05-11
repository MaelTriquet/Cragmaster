import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import Login from './pages/Login'
import Upload from './pages/Upload'
import Topos from './pages/Topos'
import TopoDetail from './pages/Topo-details'
import RouteDetail from './pages/Route-details'
import Search from './pages/Search'
import Navbar from './components/Navbar'
import Profile from './pages/Profile'
import Stats from './pages/Stats'

function ComingSoon({ name }) {
  return (
    <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
      <h2 style={{ fontFamily: 'Barlow Condensed', fontSize: '2rem', color: 'var(--muted)' }}>
        {name} — coming soon
      </h2>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
		<Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/topos"        element={<PrivateRoute><Topos /></PrivateRoute>} />
          <Route path="/topos/:id"    element={<PrivateRoute><TopoDetail /></PrivateRoute>} />
          <Route path="/routes/:id"   element={<PrivateRoute><RouteDetail /></PrivateRoute>} />
          <Route path="/search"       element={<PrivateRoute><Search /></PrivateRoute>} />
          <Route path="/upload"       element={<PrivateRoute><Upload /></PrivateRoute>} />
          <Route path="/admin"        element={<PrivateRoute adminOnly><ComingSoon name="Admin" /></PrivateRoute>} />
		  <Route path="/profile"      element={<PrivateRoute><Profile /></PrivateRoute>} />
		  <Route path="/stats"        element={<PrivateRoute><Stats /></PrivateRoute>} />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
