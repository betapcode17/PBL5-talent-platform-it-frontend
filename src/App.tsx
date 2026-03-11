import { BrowserRouter, useLocation } from 'react-router-dom'
import './App.css'
import { AppRoutes } from './routes/AppRoutes'
import ChatWidget from './components/chat/ChatWidget'
import ChatWidgetToggle from './components/chat/ChatWidgetToggle'

const ChatOverlay = () => {
  const { pathname } = useLocation()
  // Ẩn widget khi đang ở trang chat full-screen
  if (pathname === '/chat') return null
  return (
    <>
      <ChatWidget />
      <ChatWidgetToggle />
    </>
  )
}

function App() {
  if (typeof window !== 'undefined') {
    const hash = window.location.hash
    if (hash.startsWith('/')) {
      const normalizedPath = hash.slice(1)
      const currentPath = window.location.pathname + window.location.search

      if (currentPath !== normalizedPath) {
        window.history.replaceState(null, '', normalizedPath)
      }
    }
  }

  return (
    <BrowserRouter>
      <AppRoutes />
      <ChatOverlay />
    </BrowserRouter>
  )
}

export default App
