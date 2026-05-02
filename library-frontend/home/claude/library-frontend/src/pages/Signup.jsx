import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import Spinner from '../components/Spinner'

const Signup = () => {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' })
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      const user = await register(form)
      navigate(user.role === 'admin' ? '/admin' : '/dashboard', { replace: true })
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed.'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ink-950 bg-grid-pattern flex items-center justify-center px-4">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96
                      bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12
                          bg-amber-500/10 border border-amber-500/30 rounded-xl mb-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
              className="w-6 h-6 text-amber-500">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
          <h1 className="font-display text-3xl font-bold text-parchment-50">Create account</h1>
          <p className="font-body text-sm text-parchment-200/50 mt-2">Join Bibliotheca today</p>
        </div>

        <div className="card p-6 sm:p-8">
          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-red-900/20 border border-red-800/40 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="section-label">Full Name</label>
              <input type="text" name="name" autoComplete="name"
                value={form.name} onChange={handleChange}
                placeholder="John Doe" required className="input-field" />
            </div>

            <div className="space-y-1.5">
              <label className="section-label">Email Address</label>
              <input type="email" name="email" autoComplete="email"
                value={form.email} onChange={handleChange}
                placeholder="you@example.com" required className="input-field" />
            </div>

            <div className="space-y-1.5">
              <label className="section-label">Password</label>
              <input type="password" name="password" autoComplete="new-password"
                value={form.password} onChange={handleChange}
                placeholder="Min. 6 characters" required className="input-field" />
            </div>

            {/* ── Role selector ──────────────────────────────────────── */}
            <div className="space-y-2">
              <label className="section-label">Account Type</label>
              <div className="grid grid-cols-2 gap-3">
                {['user', 'admin'].map((r) => (
                  <label key={r}
                    className={`flex items-center gap-2.5 p-3 rounded-lg border cursor-pointer transition-all
                      ${form.role === r
                        ? 'border-amber-500/50 bg-amber-500/10 text-amber-400'
                        : 'border-ink-600 bg-ink-800 text-parchment-200/60 hover:border-ink-500'}`}>
                    <input type="radio" name="role" value={r}
                      checked={form.role === r} onChange={handleChange}
                      className="accent-amber-500" />
                    <span className="font-body text-sm capitalize font-medium">{r}</span>
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
              {loading && <Spinner size="sm" />}
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center font-body text-sm text-parchment-200/50">
            Already have an account?{' '}
            <Link to="/login" className="text-amber-500 hover:text-amber-400 transition-colors font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup
