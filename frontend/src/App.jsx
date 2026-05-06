import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import Login from './pages/Login'
import Upload from './pages/Upload'

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
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/topos"        element={<PrivateRoute><ComingSoon name="Topos" /></PrivateRoute>} />
          <Route path="/topos/:id"    element={<PrivateRoute><ComingSoon name="Topo Detail" /></PrivateRoute>} />
          <Route path="/routes/:id"   element={<PrivateRoute><ComingSoon name="Route Detail" /></PrivateRoute>} />
          <Route path="/search"       element={<PrivateRoute><ComingSoon name="Search" /></PrivateRoute>} />
          <Route path="/upload"       element={<PrivateRoute><Upload /></PrivateRoute>} />
          <Route path="/admin"        element={<PrivateRoute adminOnly><ComingSoon name="Admin" /></PrivateRoute>} />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
