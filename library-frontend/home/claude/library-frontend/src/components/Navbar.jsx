import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const BookIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
)

const NavLink = ({ to, children }) => {
  const { pathname } = useLocation()
  const active = pathname === to
  return (
    <Link
      to={to}
      className={`font-body text-sm px-3 py-1.5 rounded-lg transition-all duration-200
        ${active
          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
          : 'text-parchment-200/70 hover:text-parchment-100 hover:bg-ink-700'}`}
    >
      {children}
    </Link>
  )
}

const Navbar = () => {
  const { user, isAdmin, logout } = useAuth()
  const navigate   = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-ink-700/60 bg-ink-900/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ─────────────────────────────────────────────────── */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="p-1.5 bg-amber-500/10 border border-amber-500/30 rounded-lg
                            group-hover:bg-amber-500/20 transition-colors text-amber-500">
              <BookIcon />
            </div>
            <span className="font-display text-lg font-semibold text-parchment-50 tracking-tight">
              Bibliotheca
            </span>
          </Link>

          {/* ── Desktop Nav ──────────────────────────────────────────── */}
          {user && (
            <nav className="hidden md:flex items-center gap-1">
              {isAdmin ? (
                <>
                  <NavLink to="/admin">Dashboard</NavLink>
                  <NavLink to="/admin/books">Manage Books</NavLink>
                  <NavLink to="/admin/issues">All Issues</NavLink>
                </>
              ) : (
                <>
                  <NavLink to="/dashboard">Browse Books</NavLink>
                  <NavLink to="/my-books">My Books</NavLink>
                </>
              )}
            </nav>
          )}

          {/* ── Right: user pill + logout ────────────────────────────── */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="hidden sm:flex flex-col items-end">
                  <span className="font-body text-sm font-medium text-parchment-100 leading-tight">
                    {user.name}
                  </span>
                  <span className={`font-mono text-[10px] uppercase tracking-wider leading-tight
                    ${isAdmin ? 'text-amber-500' : 'text-ink-600/80'}`}>
                    {user.role}
                  </span>
                </div>
                <button onClick={handleLogout} className="btn-secondary text-sm py-2 px-4">
                  Logout
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link to="/login"  className="btn-secondary text-sm py-2">Login</Link>
                <Link to="/signup" className="btn-primary  text-sm py-2">Sign Up</Link>
              </div>
            )}

            {/* ── Mobile hamburger ─────────────────────────────────── */}
            {user && (
              <button
                onClick={() => setOpen(!open)}
                className="md:hidden p-2 rounded-lg text-parchment-200 hover:bg-ink-700 transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                  {open
                    ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* ── Mobile menu ──────────────────────────────────────────────── */}
        {open && user && (
          <div className="md:hidden pb-4 border-t border-ink-700/60 pt-3 flex flex-col gap-1 animate-fade-in">
            {isAdmin ? (
              <>
                <NavLink to="/admin">Dashboard</NavLink>
                <NavLink to="/admin/books">Manage Books</NavLink>
                <NavLink to="/admin/issues">All Issues</NavLink>
              </>
            ) : (
              <>
                <NavLink to="/dashboard">Browse Books</NavLink>
                <NavLink to="/my-books">My Books</NavLink>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar
