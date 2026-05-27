import { useEffect } from 'react'
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ToastProvider } from './contexts/ToastContext'
import PrivateRoute from './components/PrivateRoute'
import { App as CapApp } from '@capacitor/app'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import Upload from './pages/Upload'
import Topos from './pages/Topos'
import TopoDetail from './pages/Topo-details'
import Routes from './pages/Routes'
import RouteDetail from './pages/Route-details'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import EmailPrompt from './components/EmailPrompt'
import Profile from './pages/Profile'
import Stats from './pages/Stats'
import Query from './pages/Query'
import Notifications from './pages/Notifications'
import Map from './pages/Map'
import About from './pages/About'
import FAQ from './pages/FAQ'
import ComingSoon from './pages/ComingSoon'
import AuditLog from './pages/AuditLog'
import Home from './pages/Home'
const PAGE_WRAPPER = {
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
}

const MAIN = {
  flex: 1,
}

function AppLayout() {
  const location = useLocation()
  const hideFooter = location.pathname === '/login'

  useEffect(() => {
    if (window.Capacitor?.isNativePlatform()) {
      CapApp.addListener('backButton', ({ canGoBack }) => {
        if (canGoBack) {
          window.history.back()
        } else {
          CapApp.exitApp()
        }
      })
    }
  }, [])

  return (
    <div style={PAGE_WRAPPER}>
      <Navbar />
      <main style={MAIN}>
        <RouterRoutes>
          <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/topos"        element={<PrivateRoute><Topos /></PrivateRoute>} />
          <Route path="/topos/:id"    element={<PrivateRoute><TopoDetail /></PrivateRoute>} />
          <Route path="/routes"       element={<PrivateRoute><Routes /></PrivateRoute>} />
          <Route path="/routes/:id"   element={<PrivateRoute><RouteDetail /></PrivateRoute>} />
          <Route path="/upload"       element={<PrivateRoute><Upload /></PrivateRoute>} />
          <Route path="/admin"        element={<PrivateRoute adminOnly><Notifications /></PrivateRoute>} />
          <Route path="/profile"      element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/stats"        element={<PrivateRoute><Stats /></PrivateRoute>} />
          <Route path="/stats/:userId" element={<PrivateRoute><Stats /></PrivateRoute>} />
          <Route path="/query"        element={<PrivateRoute><Query /></PrivateRoute>} />
          <Route path="/map"          element={<PrivateRoute><Map /></PrivateRoute>} />
          <Route path="/about"       element={<PrivateRoute><About /></PrivateRoute>} />
          <Route path="/faq"        element={<PrivateRoute><FAQ /></PrivateRoute>} />
          <Route path="/coming-soon" element={<PrivateRoute><ComingSoon /></PrivateRoute>} />
          <Route path="/audit-log" element={<PrivateRoute><AuditLog /></PrivateRoute>} />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </RouterRoutes>
      </main>
      {!hideFooter && <Footer />}
      <EmailPrompt />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  )
}
