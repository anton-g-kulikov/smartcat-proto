import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import HomePage from './pages/HomePage'
import OrgSettingsPage from './pages/OrgSettingsPage'
import OrgManagementPage from './pages/OrgManagementPage'
import ChatsPage from './pages/ChatsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/org/settings" element={<OrgSettingsPage />} />
          <Route path="/org/management" element={<OrgManagementPage />} />
          <Route path="/chats" element={<ChatsPage />} />
          <Route path="/chats/:chatId" element={<ChatsPage />} />
          {/* Hub and Work sub-navigation routes to be added per feature */}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

