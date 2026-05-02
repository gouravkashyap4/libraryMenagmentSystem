import { useState, useEffect } from 'react'
import Spinner from './Spinner'

const INITIAL = {
  title: '', author: '', isbn: '', genre: '',
  description: '', totalCopies: 1, publishedYear: '',
}

const BookForm = ({ initial = {}, onSubmit, loading, submitLabel = 'Save Book' }) => {
  const [form, setForm] = useState({ ...INITIAL, ...initial })

  // Sync if parent passes new initial (edit mode)
  useEffect(() => {
    setForm({ ...INITIAL, ...initial })
  }, [initial._id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="section-label">Title *</label>
          <input name="title" value={form.title} onChange={handleChange}
            required placeholder="e.g. Clean Code"
            className="input-field" />
        </div>
        <div className="space-y-1.5">
          <label className="section-label">Author *</label>
          <input name="author" value={form.author} onChange={handleChange}
            required placeholder="e.g. Robert C. Martin"
            className="input-field" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="section-label">ISBN</label>
          <input name="isbn" value={form.isbn} onChange={handleChange}
            placeholder="978-0132350884"
            className="input-field" />
        </div>
        <div className="space-y-1.5">
          <label className="section-label">Genre</label>
          <input name="genre" value={form.genre} onChange={handleChange}
            placeholder="e.g. Programming"
            className="input-field" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="section-label">Total Copies</label>
          <input name="totalCopies" type="number" min="1"
            value={form.totalCopies} onChange={handleChange}
            className="input-field" />
        </div>
        <div className="space-y-1.5">
          <label className="section-label">Published Year</label>
          <input name="publishedYear" type="number" min="1000" max="2099"
            value={form.publishedYear} onChange={handleChange}
            placeholder="e.g. 2008"
            className="input-field" />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="section-label">Description</label>
        <textarea name="description" value={form.description} onChange={handleChange}
          rows={3} placeholder="Brief description of the book..."
          className="input-field resize-none" />
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
        {loading && <Spinner size="sm" />}
        {loading ? 'Saving...' : submitLabel}
      </button>
    </form>
  )
}

export default BookForm
