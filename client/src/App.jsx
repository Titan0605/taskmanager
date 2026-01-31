import { useState } from 'react'
import './index.css'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

/**
 * Main App Component
 * Handles authentication state and routing between Login/Dashboard
 */
function App() {
  const [user, setUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogin = (response) => {
    setUser({
      username: response.username,
      token: response.token
    })
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setUser(null)
    setIsLoggedIn(false)
  }

  // Render Login or Dashboard based on auth state
  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />
  }

  return <Dashboard user={user} onLogout={handleLogout} />
}

export default App
