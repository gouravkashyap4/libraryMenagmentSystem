import { useState, useEffect, useCallback } from 'react'
import { getMyIssues, returnBook } from '../api/axios'
import Spinner from '../components/Spinner'
import toast from 'react-hot-toast'

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'

const isOverdue = (dueDate, status) => status === 'issued' && new Date(dueDate) < new Date()

const MyBooks = () => {
  const [issues,  setIssues]  = useState([])
  const [loading, setLoading] = useState(true)
  const [returning, setReturning] = useState(null) // issueId being returned

  const fetchMyIssues = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await getMyIssues()
      setIssues(data.data)
    } catch {
      toast.error('Failed to load your books')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchMyIssues() }, [fetchMyIssues])

  const handleReturn = async (issueId, bookTitle) => {
    setReturning(issueId)
    try {
      await returnBook(issueId)
      toast.success(`"${bookTitle}" returned successfully!`)
      fetchMyIssues()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to return book')
    } finally {
      setReturning(null)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8 animate-fade-in">
        <p className="section-label mb-1">Currently issued</p>
        <h1 className="page-title">My Books</h1>
        <p className="text-parchment-200/50 text-sm mt-1 font-body">
          Books you have checked out and their due dates
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-24"><Spinner size="lg" /></div>
      ) : issues.length === 0 ? (
        <div className="card p-12 text-center animate-fade-in">
          <div className="text-5xl mb-4">🔖</div>
          <p className="font-display text-xl text-parchment-200/40">No active issues</p>
          <p className="font-body text-sm text-parchment-200/30 mt-2">
            You don't have any books checked out right now
          </p>
        </div>
      ) : (
        <div className="space-y-3 animate-stagger">
          {issues.map(issue => {
            const overdue = isOverdue(issue.dueDate, issue.status)
            return (
              <div key={issue._id}
                className={`card p-5 flex flex-col sm:flex-row sm:items-center gap-4
                  ${overdue ? 'border-red-800/40' : ''}`}>

                {/* ── Book info ─────────────────────────────────── */}
                <div className="flex gap-3 flex-1 min-w-0">
                  <div className={`w-1 rounded-full flex-shrink-0 ${overdue ? 'bg-red-500' : 'bg-amber-500'}`} />
                  <div className="min-w-0">
                    <h3 className="font-display text-base font-semibold text-parchment-50 truncate">
                      {issue.book?.title}
                    </h3>
                    <p className="font-body text-sm text-parchment-200/50">{issue.book?.author}</p>
                    {issue.book?.isbn && (
                      <p className="font-mono text-[11px] text-ink-600/70 mt-0.5">ISBN: {issue.book.isbn}</p>
                    )}
                  </div>
                </div>

                {/* ── Dates ─────────────────────────────────────── */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-1 text-xs font-body">
                  <div>
                    <p className="section-label text-[10px]">Issued</p>
                    <p className="text-parchment-200/70 mt-0.5">{formatDate(issue.issueDate)}</p>
                  </div>
                  <div>
                    <p className="section-label text-[10px]">Due</p>
                    <p className={`mt-0.5 font-medium ${overdue ? 'text-red-400' : 'text-parchment-200/70'}`}>
                      {formatDate(issue.dueDate)}
                      {overdue && <span className="ml-1 text-red-500">Overdue!</span>}
                    </p>
                  </div>
                </div>

                {/* ── Return button ──────────────────────────────── */}
                <button
                  onClick={() => handleReturn(issue._id, issue.book?.title)}
                  disabled={returning === issue._id}
                  className="btn-success flex items-center gap-1.5 flex-shrink-0"
                >
                  {returning === issue._id
                    ? <><Spinner size="sm" /> Returning...</>
                    : '↩ Return'}
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default MyBooks
