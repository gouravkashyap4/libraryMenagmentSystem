import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Spinner from './Spinner'

// ── ProtectedRoute: blocks unauthenticated users ─────────────────────────────
export const ProtectedRoute = () => {
  const { user, loading } = useAuth()
  if (loading) return <Spinner fullscreen />
  return user ? <Outlet /> : <Navigate to="/login" replace />
}

// ── AdminRoute: blocks non-admin users ───────────────────────────────────────
export const AdminRoute = () => {
  const { user, isAdmin, loading } = useAuth()
  if (loading) return <Spinner fullscreen />
  if (!user)    return <Navigate to="/login"     replace />
  if (!isAdmin) return <Navigate to="/dashboard" replace />
  return <Outlet />
}
