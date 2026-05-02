import { useState } from 'react'
import { issueBook } from '../api/axios'
import toast from 'react-hot-toast'
import Spinner from './Spinner'

const BookCard = ({ book, onIssued }) => {
  const [loading, setLoading] = useState(false)

  const handleIssue = async () => {
    setLoading(true)
    try {
      await issueBook(book._id)
      toast.success(`"${book.title}" issued successfully!`)
      onIssued?.()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to issue book')
    } finally {
      setLoading(false)
    }
  }

  const available = book.availableCopies > 0

  return (
    <div className="card card-hover flex flex-col p-5 gap-4 animate-slide-up">

      {/* ── Book spine accent ──────────────────────────────────────── */}
      <div className="flex gap-3">
        <div className={`w-1 rounded-full flex-shrink-0 ${available ? 'bg-amber-500' : 'bg-ink-600'}`} />

        <div className="flex-1 min-w-0">
          <h3 className="font-display text-base font-semibold text-parchment-50 leading-snug line-clamp-2">
            {book.title}
          </h3>
          <p className="font-body text-sm text-parchment-200/60 mt-0.5">{book.author}</p>
        </div>
      </div>

      {/* ── Meta ───────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2">
        {book.genre && (
          <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-ink-700 text-ink-600/80 border border-ink-600/50">
            {book.genre}
          </span>
        )}
        {book.publishedYear && (
          <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-ink-700 text-ink-600/80 border border-ink-600/50">
            {book.publishedYear}
          </span>
        )}
      </div>

      {/* ── Description ────────────────────────────────────────────── */}
      {book.description && (
        <p className="font-body text-xs text-parchment-200/50 line-clamp-2 leading-relaxed">
          {book.description}
        </p>
      )}

      {/* ── Footer: availability + action ──────────────────────────── */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-ink-700/60">
        <span className={available ? 'badge-available' : 'badge-unavailable'}>
          {available ? `${book.availableCopies} available` : 'Unavailable'}
        </span>

        <button
          onClick={handleIssue}
          disabled={!available || loading}
          className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5"
        >
          {loading ? <Spinner size="sm" /> : null}
          {loading ? 'Issuing...' : 'Issue Book'}
        </button>
      </div>
    </div>
  )
}

export default BookCard
