import axios from 'axios'

// Base instance — all API calls go through here
// const API = axios.create({
//   baseURL: '/api',
//   headers: { 'Content-Type': 'application/json' },
// })
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // ✅ FIXED 
  headers: { 'Content-Type': 'application/json' },
})
console.log("API URL:", import.meta.env.VITE_API_URL);
// ── Request interceptor: attach JWT from localStorage ────────────────────────
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ── Response interceptor: handle 401 globally ────────────────────────────────
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ── Auth ─────────────────────────────────────────────────────────────────────
export const registerUser = (data)  => API.post('/auth/register', data)
export const loginUser    = (data)  => API.post('/auth/login', data)
export const getProfile   = ()      => API.get('/auth/profile')

// ── Books ────────────────────────────────────────────────────────────────────
export const getAllBooks   = (params) => API.get('/books', { params })
export const getBookById  = (id)      => API.get(`/books/${id}`)
export const addBook      = (data)    => API.post('/books', data)
export const updateBook   = (id, data)=> API.put(`/books/${id}`, data)
export const deleteBook   = (id)      => API.delete(`/books/${id}`)

// ── Issues ───────────────────────────────────────────────────────────────────
export const issueBook      = (bookId)   => API.post(`/issues/${bookId}`)
export const returnBook     = (issueId)  => API.put(`/issues/${issueId}/return`)
export const getAllIssues    = ()         => API.get('/issues')
export const getMyIssues    = ()         => API.get('/issues/my-books')

export default API
