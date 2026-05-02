import { useState, useEffect, useCallback } from 'react'
import { getAllIssues, returnBook } from '../api/axios'
import Spinner from '../components/Spinner'
import toast from 'react-hot-toast'

const formatDate = (d) => d
  ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  : '—'

const isOverdue = (issue) =>
  issue.status === 'issued' && new Date(issue.dueDate) < new Date()

const AdminIssues = () => {
  const [issues,    setIssues]    = useState([])
  const [filtered,  setFiltered]  = useState([])
  const [loading,   setLoading]   = useState(true)
  const [returning, setReturning] = useState(null)
  const [filter,    setFilter]    = useState('all') // all | issued | returned

  const fetchIssues = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await getAllIssues()
      setIssues(data.data)
    } catch { toast.error('Failed to load issues') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchIssues() }, [fetchIssues])

  useEffect(() => {
    if (filter === 'all')      setFiltered(issues)
    else if (filter === 'overdue') setFiltered(issues.filter(isOverdue))
    else setFiltered(issues.filter(i => i.status === filter))
  }, [filter, issues])

  const handleReturn = async (issueId, bookTitle) => {
    setReturning(issueId)
    try {
      await returnBook(issueId)
      toast.success(`"${bookTitle}" returned successfully`)
      fetchIssues()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to return')
    } finally {
      setReturning(null)
    }
  }

  const counts = {
    all:      issues.length,
    issued:   issues.filter(i => i.status === 'issued').length,
    returned: issues.filter(i => i.status === 'returned').length,
    overdue:  issues.filter(isOverdue).length,
  }

  const FILTERS = [
    { key: 'all',      label: 'All' },
    { key: 'issued',   label: 'Active' },
    { key: 'returned', label: 'Returned' },
    { key: 'overdue',  label: 'Overdue' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8 animate-fade-in">
        <p className="section-label mb-1">Admin</p>
        <h1 className="page-title">All Issues</h1>
        <p className="text-parchment-200/50 text-sm mt-1 font-body">
          Track and manage every book issue across users
        </p>
      </div>

      {/* ── Filter tabs ─────────────────────────────────────────────── */}
      <div className="flex gap-2 mb-6 animate-fade-in">
        {FILTERS.map(({ key, label }) => (
          <button key={key} onClick={() => setFilter(key)}
            className={`font-mono text-xs px-3 py-1.5 rounded-lg border transition-all
              ${filter === key
                ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                : 'bg-ink-800 text-parchment-200/50 border-ink-600/50 hover:border-ink-500'}`}>
            {label}
            <span className="ml-1.5 opacity-60">({counts[key]})</span>
          </button>
        ))}
      </div>

      {/* ── Issues list ─────────────────────────────────────────────── */}
      {loading ? (
        <div className="flex justify-center py-24"><Spinner size="lg" /></div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center animate-fade-in">
          <div className="text-5xl mb-4">🗒️</div>
          <p className="font-display text-xl text-parchment-200/40">No records found</p>
        </div>
      ) : (
        <div className="card overflow-hidden animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-ink-700/60">
                  <th className="text-left p-4 section-label">Book</th>
                  <th className="text-left p-4 section-label hidden md:table-cell">User</th>
                  <th className="text-left p-4 section-label hidden lg:table-cell">Issued</th>
                  <th className="text-left p-4 section-label">Due</th>
                  <th className="text-left p-4 section-label hidden lg:table-cell">Returned</th>
                  <th className="text-center p-4 section-label">Status</th>
                  <th className="text-right p-4 section-label">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-700/40">
                {filtered.map(issue => {
                  const overdue = isOverdue(issue)
                  return (
                    <tr key={issue._id} className={`hover:bg-ink-700/20 transition-colors
                      ${overdue ? 'bg-red-950/10' : ''}`}>
                      <td className="p-4">
                        <p className="font-display text-sm font-semibold text-parchment-50 leading-snug">
                          {issue.book?.title}
                        </p>
                        <p className="font-mono text-[11px] text-ink-600/60">{issue.book?.isbn || ''}</p>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <p className="font-body text-sm text-parchment-200/80">{issue.user?.name}</p>
                        <p className="font-body text-xs text-parchment-200/40">{issue.user?.email}</p>
                      </td>
                      <td className="p-4 hidden lg:table-cell">
                        <span className="font-mono text-xs text-parchment-200/60">
                          {formatDate(issue.issueDate)}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`font-mono text-xs font-medium
                          ${overdue ? 'text-red-400' : 'text-parchment-200/60'}`}>
                          {formatDate(issue.dueDate)}
                        </span>
                      </td>
                      <td className="p-4 hidden lg:table-cell">
                        <span className="font-mono text-xs text-parchment-200/60">
                          {formatDate(issue.returnDate)}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={
                          overdue ? 'badge bg-red-900/30 text-red-400 border-red-800/50' :
                          issue.status === 'issued'   ? 'badge-issued'   :
                          issue.status === 'returned' ? 'badge-returned' : 'badge'}>
                          {overdue ? 'overdue' : issue.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {issue.status === 'issued' ? (
                          <button onClick={() => handleReturn(issue._id, issue.book?.title)}
                            disabled={returning === issue._id}
                            className="btn-success flex items-center gap-1.5 ml-auto">
                            {returning === issue._id ? <Spinner size="sm" /> : null}
                            Return
                          </button>
                        ) : (
                          <span className="font-mono text-[11px] text-ink-600/40">—</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminIssues
