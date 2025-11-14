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
    // Format: /smartcat-proto/?/org/management
    const search = location.search
    
    if (search.startsWith('?/')) {
      // Extract the path from ?/path format
      const path = search.slice(2) // Remove '?/'
      // Handle additional query params (if any) - they would be after & or #
      const pathParts = path.split('&')
      const actualPath = pathParts[0].split('#')[0]
      
      // Decode the path (replace ~and~ with &)
      const decodedPath = actualPath.replace(/~and~/g, '&')
      
      // Ensure path starts with /
      const finalPath = decodedPath.startsWith('/') ? decodedPath : '/' + decodedPath
      
      // Navigate to the correct path
      navigate(finalPath + (location.hash || ''), { replace: true })
    }
  }, [location.search, location.hash, navigate])

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

