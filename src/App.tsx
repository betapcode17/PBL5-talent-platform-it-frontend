import { BrowserRouter } from 'react-router-dom'
import './App.css'
import { AppRoutes } from './routes/AppRoutes'

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
    </BrowserRouter>
  )
}

export default App
