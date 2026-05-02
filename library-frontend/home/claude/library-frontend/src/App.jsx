import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute'
import Navbar from './components/Navbar'

// ── Pages ─────────────────────────────────────────────────────────────────────
import Login          from './pages/Login'
import Signup         from './pages/Signup'
import UserDashboard  from './pages/UserDashboard'
import MyBooks        from './pages/MyBooks'
import AdminDashboard from './pages/AdminDashboard'
import AdminBooks     from './pages/AdminBooks'
import AdminIssues    from './pages/AdminIssues'
import Spinner        from './components/Spinner'

// ── Root redirect: sends / to the right dashboard ─────────────────────────────
const RootRedirect = () => {
  const { user, loading } = useAuth()
  if (loading) return <Spinner fullscreen />
  if (!user)   return <Navigate to="/login"     replace />
  return           <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />
}

const App = () => {
  return (
    <div className="min-h-screen bg-ink-900">
      <Navbar />
      <main>
        <Routes>
          {/* ── Public ───────────────────────────────────────────── */}
          <Route path="/"       element={<RootRedirect />} />
          <Route path="/login"  element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* ── Protected (any logged-in user) ───────────────────── */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/my-books"  element={<MyBooks />} />
          </Route>

          {/* ── Admin only ───────────────────────────────────────── */}
          <Route element={<AdminRoute />}>
            <Route path="/admin"        element={<AdminDashboard />} />
            <Route path="/admin/books"  element={<AdminBooks />} />
            <Route path="/admin/issues" element={<AdminIssues />} />
          </Route>

          {/* ── 404 ──────────────────────────────────────────────── */}
          <Route path="*" element={
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
              <p className="font-mono text-amber-500 text-sm mb-2">404</p>
              <h1 className="font-display text-4xl font-bold text-parchment-50 mb-3">Page Not Found</h1>
              <p className="text-parchment-200/50 text-sm mb-6">This page seems to have been checked out.</p>
              <a href="/" className="btn-primary">Go Home</a>
            </div>
          } />
        </Routes>
      </main>
    </div>
  )
}

export default App
