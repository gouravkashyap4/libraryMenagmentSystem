import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAllBooks, getAllIssues } from '../api/axios'
import Spinner from '../components/Spinner'

const StatCard = ({ label, value, icon, color }) => (
  <div className="card card-hover p-5">
    <div className="flex items-start justify-between">
      <div>
        <p className="section-label">{label}</p>
        <p className={`font-display text-4xl font-bold mt-2 ${color}`}>{value}</p>
      </div>
      <div className={`text-3xl`}>{icon}</div>
    </div>
  </div>
)

const AdminDashboard = () => {
  const [books,   setBooks]   = useState([])
  const [issues,  setIssues]  = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [b, i] = await Promise.all([getAllBooks(), getAllIssues()])
        setBooks(b.data.data)
        setIssues(i.data.data)
      } catch { /* handled by axios interceptor */ }
      finally { setLoading(false) }
    }
    load()
  }, [])

  const totalBooks    = books.length
  const availBooks    = books.filter(b => b.availableCopies > 0).length
  const activeIssues  = issues.filter(i => i.status === 'issued').length
  const overdueIssues = issues.filter(i => i.status === 'issued' && new Date(i.dueDate) < new Date()).length

  if (loading) return <div className="flex justify-center py-24"><Spinner size="lg" /></div>

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8 animate-fade-in">
        <p className="section-label mb-1">Admin Panel</p>
        <h1 className="page-title">Library Overview</h1>
        <p className="text-parchment-200/50 text-sm mt-1 font-body">
          Manage your entire library from one place
        </p>
      </div>

      {/* ── Stats ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10 animate-stagger">
        <StatCard label="Total Books"     value={totalBooks}   icon="📚" color="text-parchment-50" />
        <StatCard label="Available"       value={availBooks}   icon="✅" color="text-emerald-400"  />
        <StatCard label="Active Issues"   value={activeIssues} icon="📤" color="text-amber-400"    />
        <StatCard label="Overdue"         value={overdueIssues}icon="⚠️" color="text-red-400"      />
      </div>

      {/* ── Quick Actions ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-stagger">
        {[
          { to: '/admin/books', icon: '📖', title: 'Manage Books',   desc: 'Add, edit, or delete books from the catalogue' },
          { to: '/admin/issues', icon: '📋', title: 'All Issues',     desc: 'View all current and past book issues' },
        ].map(({ to, icon, title, desc }) => (
          <Link key={to} to={to}
            className="card card-hover p-5 flex gap-4 items-start group">
            <div className="text-2xl flex-shrink-0">{icon}</div>
            <div>
              <h3 className="font-display text-base font-semibold text-parchment-50
                             group-hover:text-amber-400 transition-colors">{title}</h3>
              <p className="font-body text-xs text-parchment-200/50 mt-1 leading-relaxed">{desc}</p>
            </div>
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-ink-600 group-hover:text-amber-500 ml-auto flex-shrink-0 transition-colors mt-0.5">
              <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default AdminDashboard
