import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { loginUser, registerUser } from '../api/axios'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true) // true on mount to check localStorage

  // ── Rehydrate from localStorage on app load ─────────────────────────────
  useEffect(() => {
    const storedUser  = localStorage.getItem('user')
    const storedToken = localStorage.getItem('token')
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  // ── Login ────────────────────────────────────────────────────────────────
  const login = useCallback(async (credentials) => {
    const { data } = await loginUser(credentials)
    const { token, ...userData } = data.data
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
    toast.success(`Welcome back, ${userData.name}!`)
    return userData
  }, [])

  // ── Register ─────────────────────────────────────────────────────────────
  const register = useCallback(async (formData) => {
    const { data } = await registerUser(formData)
    const { token, ...userData } = data.data
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
    toast.success(`Welcome, ${userData.name}! Account created.`)
    return userData
  }, [])

  // ── Logout ───────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    toast.success('Logged out successfully')
  }, [])

  const isAdmin = user?.role === 'admin'

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook for consuming auth context
export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
