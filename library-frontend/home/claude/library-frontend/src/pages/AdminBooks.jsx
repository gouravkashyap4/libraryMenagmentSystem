import { useState, useEffect, useCallback } from 'react'
import { getAllBooks, addBook, updateBook, deleteBook } from '../api/axios'
import BookForm from '../components/BookForm'
import Spinner from '../components/Spinner'
import toast from 'react-hot-toast'

const AdminBooks = () => {
  const [books,       setBooks]       = useState([])
  const [loading,     setLoading]     = useState(true)
  const [formLoading, setFormLoading] = useState(false)
  const [editBook,    setEditBook]    = useState(null)   // null = add mode, object = edit mode
  const [showForm,    setShowForm]    = useState(false)
  const [deleting,    setDeleting]    = useState(null)   // bookId being deleted

  const fetchBooks = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await getAllBooks()
      setBooks(data.data)
    } catch { toast.error('Failed to load books') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchBooks() }, [fetchBooks])

  const handleSubmit = async (formData) => {
    setFormLoading(true)
    try {
      if (editBook) {
        await updateBook(editBook._id, formData)
        toast.success('Book updated successfully!')
      } else {
        await addBook(formData)
        toast.success('Book added to catalogue!')
      }
      setShowForm(false)
      setEditBook(null)
      fetchBooks()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async (book) => {
    if (!window.confirm(`Delete "${book.title}"? This cannot be undone.`)) return
    setDeleting(book._id)
    try {
      await deleteBook(book._id)
      toast.success('Book deleted')
      fetchBooks()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed')
    } finally {
      setDeleting(null)
    }
  }

  const openEdit = (book) => {
    setEditBook(book)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openAdd = () => {
    setEditBook(null)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const closeForm = () => {
    setShowForm(false)
    setEditBook(null)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-8 animate-fade-in">
        <div>
          <p className="section-label mb-1">Admin</p>
          <h1 className="page-title">Manage Books</h1>
          <p className="text-parchment-200/50 text-sm mt-1 font-body">
            {books.length} book{books.length !== 1 ? 's' : ''} in catalogue
          </p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <span className="text-lg leading-none">+</span>
          Add Book
        </button>
      </div>

      {/* ── Form Panel ─────────────────────────────────────────────── */}
      {showForm && (
        <div className="card p-6 mb-8 border-amber-500/20 animate-slide-up">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="section-label">{editBook ? 'Edit Book' : 'New Book'}</p>
              <h2 className="font-display text-xl font-semibold text-parchment-50 mt-0.5">
                {editBook ? `Editing: ${editBook.title}` : 'Add to catalogue'}
              </h2>
            </div>
            <button onClick={closeForm}
              className="p-2 rounded-lg text-parchment-200/50 hover:text-parchment-100 hover:bg-ink-700 transition-all">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </div>
          <BookForm
            initial={editBook || {}}
            onSubmit={handleSubmit}
            loading={formLoading}
            submitLabel={editBook ? 'Save Changes' : 'Add Book'}
          />
        </div>
      )}

      {/* ── Books Table ─────────────────────────────────────────────── */}
      {loading ? (
        <div className="flex justify-center py-24"><Spinner size="lg" /></div>
      ) : books.length === 0 ? (
        <div className="card p-12 text-center animate-fade-in">
          <div className="text-5xl mb-4">📭</div>
          <p className="font-display text-xl text-parchment-200/40">No books yet</p>
          <p className="font-body text-sm text-parchment-200/30 mt-2">Add your first book to get started</p>
        </div>
      ) : (
        <div className="card overflow-hidden animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-ink-700/60">
                  <th className="text-left p-4 section-label font-medium">Title / Author</th>
                  <th className="text-left p-4 section-label font-medium hidden md:table-cell">Genre</th>
                  <th className="text-left p-4 section-label font-medium hidden lg:table-cell">ISBN</th>
                  <th className="text-center p-4 section-label font-medium">Copies</th>
                  <th className="text-center p-4 section-label font-medium">Available</th>
                  <th className="text-right p-4 section-label font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-700/40">
                {books.map((book) => (
                  <tr key={book._id} className="hover:bg-ink-700/20 transition-colors group">
                    <td className="p-4">
                      <p className="font-display text-sm font-semibold text-parchment-50 leading-snug">
                        {book.title}
                      </p>
                      <p className="font-body text-xs text-parchment-200/50 mt-0.5">{book.author}</p>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      {book.genre
                        ? <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-ink-700 text-ink-600/80 border border-ink-600/50">{book.genre}</span>
                        : <span className="text-ink-600/40 text-xs">—</span>}
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      <span className="font-mono text-xs text-ink-600/60">{book.isbn || '—'}</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="font-mono text-sm text-parchment-200/70">{book.totalCopies}</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={book.availableCopies > 0 ? 'badge-available' : 'badge-unavailable'}>
                        {book.availableCopies}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(book)}
                          className="btn-secondary text-xs py-1.5 px-3">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(book)}
                          disabled={deleting === book._id}
                          className="btn-danger flex items-center gap-1">
                          {deleting === book._id ? <Spinner size="sm" /> : null}
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminBooks
