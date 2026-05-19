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
import Footer from './components/Footer'
import Profile from './pages/Profile'
import Stats from './pages/Stats'
import Query from './pages/Query'
import Notifications from './pages/Notifications'
import Map from './pages/Map'
import About from './pages/About'
const PAGE_WRAPPER = {
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
}

const MAIN = {
  flex: 1,
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={PAGE_WRAPPER}>
          <Navbar />
          <main style={MAIN}>
            <Routes>
              <Route path="/login" element={<Login />} />

              <Route path="/topos"        element={<PrivateRoute><Topos /></PrivateRoute>} />
              <Route path="/topos/:id"    element={<PrivateRoute><TopoDetail /></PrivateRoute>} />
              <Route path="/routes/:id"   element={<PrivateRoute><RouteDetail /></PrivateRoute>} />
              <Route path="/search"       element={<PrivateRoute><Search /></PrivateRoute>} />
              <Route path="/upload"       element={<PrivateRoute><Upload /></PrivateRoute>} />
              <Route path="/admin"        element={<PrivateRoute adminOnly><Notifications /></PrivateRoute>} />
              <Route path="/profile"      element={<PrivateRoute><Profile /></PrivateRoute>} />
              <Route path="/stats"        element={<PrivateRoute><Stats /></PrivateRoute>} />
              <Route path="/stats/:userId" element={<PrivateRoute><Stats /></PrivateRoute>} />
              <Route path="/query"        element={<PrivateRoute><Query /></PrivateRoute>} />
              <Route path="/map"          element={<PrivateRoute><Map /></PrivateRoute>} />
              <Route path="/about"       element={<About />} />

              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}
