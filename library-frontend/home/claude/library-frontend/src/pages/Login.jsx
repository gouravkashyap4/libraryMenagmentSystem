import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import Spinner from '../components/Spinner'

const Login = () => {
  const { login } = useAuth()
  const navigate   = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(form)
      navigate(user.role === 'admin' ? '/admin' : '/dashboard', { replace: true })
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ink-950 bg-grid-pattern flex items-center justify-center px-4">
      {/* ── Decorative glow ──────────────────────────────────────────── */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96
                      bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md animate-slide-up">
        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12
                          bg-amber-500/10 border border-amber-500/30 rounded-xl mb-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
              className="w-6 h-6 text-amber-500">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <h1 className="font-display text-3xl font-bold text-parchment-50">Welcome back</h1>
          <p className="font-body text-sm text-parchment-200/50 mt-2">Sign in to your Bibliotheca account</p>
        </div>

        {/* ── Card ────────────────────────────────────────────────────── */}
        <div className="card p-6 sm:p-8">
          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-red-900/20 border border-red-800/40 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="section-label">Email Address</label>
              <input
                type="email" name="email" autoComplete="email"
                value={form.email} onChange={handleChange}
                placeholder="you@example.com" required
                className="input-field"
              />
            </div>

            <div className="space-y-1.5">
              <label className="section-label">Password</label>
              <input
                type="password" name="password" autoComplete="current-password"
                value={form.password} onChange={handleChange}
                placeholder="••••••••" required
                className="input-field"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
              {loading && <Spinner size="sm" />}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center font-body text-sm text-parchment-200/50">
            Don't have an account?{' '}
            <Link to="/signup" className="text-amber-500 hover:text-amber-400 transition-colors font-medium">
              Create one
            </Link>
          </p>
        </div>

        {/* ── Demo credentials hint ────────────────────────────────────── */}
        <p className="text-center mt-4 font-mono text-[11px] text-ink-600/80">
          Backend must be running on port 5000
        </p>
      </div>
    </div>
  )
}

export default Login
