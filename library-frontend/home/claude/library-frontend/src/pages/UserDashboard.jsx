import { useState, useEffect, useCallback } from 'react'
import { getAllBooks } from '../api/axios'
import { useAuth } from '../context/AuthContext'
import BookCard from '../components/BookCard'
import Spinner from '../components/Spinner'
import toast from 'react-hot-toast'

const UserDashboard = () => {
  const { user } = useAuth()
  const [books,   setBooks]   = useState([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState({ title: '', author: '', genre: '', available: '' })

  const fetchBooks = useCallback(async () => {
    setLoading(true)
    try {
      // Remove empty keys before sending
      const params = Object.fromEntries(Object.entries(search).filter(([, v]) => v !== ''))
      const { data } = await getAllBooks(params)
      setBooks(data.data)
    } catch {
      toast.error('Failed to load books')
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => { fetchBooks() }, [fetchBooks])

  const handleSearchChange = (e) =>
    setSearch(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const clearSearch = () =>
    setSearch({ title: '', author: '', genre: '', available: '' })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="mb-8 animate-fade-in">
        <p className="section-label mb-1">Welcome back</p>
        <h1 className="page-title">{user?.name}'s Library</h1>
        <p className="text-parchment-200/50 text-sm mt-1 font-body">
          Browse and issue books from the collection
        </p>
      </div>

      {/* ── Search / Filter bar ─────────────────────────────────────────── */}
      <div className="card p-4 mb-8 animate-fade-in">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <input name="title" value={search.title} onChange={handleSearchChange}
            placeholder="Search by title..." className="input-field text-sm py-2" />
          <input name="author" value={search.author} onChange={handleSearchChange}
            placeholder="Search by author..." className="input-field text-sm py-2" />
          <input name="genre" value={search.genre} onChange={handleSearchChange}
            placeholder="Filter by genre..." className="input-field text-sm py-2" />
          <select name="available" value={search.available} onChange={handleSearchChange}
            className="input-field text-sm py-2">
            <option value="">All availability</option>
            <option value="true">Available only</option>
            <option value="false">Unavailable</option>
          </select>
        </div>
        <div className="flex items-center justify-between mt-3">
          <p className="font-mono text-xs text-ink-600/80">
            {loading ? 'Loading...' : `${books.length} book${books.length !== 1 ? 's' : ''} found`}
          </p>
          <button onClick={clearSearch} className="font-mono text-xs text-amber-500 hover:text-amber-400 transition-colors">
            Clear filters
          </button>
        </div>
      </div>

      {/* ── Books grid ──────────────────────────────────────────────────── */}
      {loading ? (
        <div className="flex justify-center py-24">
          <Spinner size="lg" />
        </div>
      ) : books.length === 0 ? (
        <div className="text-center py-24 animate-fade-in">
          <div className="text-6xl mb-4">📚</div>
          <p className="font-display text-xl text-parchment-200/40">No books found</p>
          <p className="font-body text-sm text-parchment-200/30 mt-2">Try adjusting your search filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 animate-stagger">
          {books.map(book => (
            <BookCard key={book._id} book={book} onIssued={fetchBooks} />
          ))}
        </div>
      )}
    </div>
  )
}

export default UserDashboard
