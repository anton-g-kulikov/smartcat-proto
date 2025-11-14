import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { AppLayout } from './components/layout/AppLayout'
import HomePage from './pages/HomePage'
import OrgSettingsPage from './pages/OrgSettingsPage'
import OrgManagementPage from './pages/OrgManagementPage'
import ChatsPage from './pages/ChatsPage'
import LoginPage from './pages/LoginPage'

// Component to handle GitHub Pages 404.html redirect
function RedirectHandler() {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    // Check if we have the query string format from 404.html redirect
    const queryParams = new URLSearchParams(location.search)
    const path = queryParams.get('/')
    
    if (path) {
      // Convert the path back from the query string format
      const decodedPath = path.replace(/~and~/g, '&')
      navigate(decodedPath + location.hash, { replace: true })
    }
  }, [location, navigate])

  return null
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename="/smartcat-proto">
        <RedirectHandler />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<HomePage />} />
            <Route path="/org/settings" element={<OrgSettingsPage />} />
            <Route path="/org/management" element={<OrgManagementPage />} />
            <Route path="/chats" element={<ChatsPage />} />
            <Route path="/chats/:chatId" element={<ChatsPage />} />
            {/* Hub and Work sub-navigation routes to be added per feature */}
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

