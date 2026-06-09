import { BrowserRouter, useLocation } from 'react-router-dom'
import './App.css'
import { AppRoutes } from './routes/AppRoutes'
import ChatWidget from './components/chatbot/ChatbotWidget'
import ChatWidgetToggle from './components/chatbot/ChatbotWidgetToggle'
import { ScrollToTop } from './hooks/useScrollToTop'

const ChatOverlay = () => {
  const { pathname } = useLocation()
  const hiddenPrefixes = ['/chatbot', '/admin', '/employer']

  if (hiddenPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    return null
  }

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
      <ScrollToTop />
      <AppRoutes />
      <ChatOverlay />
    </BrowserRouter>
  )
}

export default App
