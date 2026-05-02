# 📚 Bibliotheca — Library Management Frontend

A production-grade React frontend for the Library Management System, built with Vite, Tailwind CSS, and React Router.

---

## 🗂 Folder Structure

```
library-frontend/
├── public/
├── src/
│   ├── api/
│   │   └── axios.js           # Axios instance + all API functions + JWT interceptor
│   ├── context/
│   │   └── AuthContext.jsx    # Global auth state (user, login, logout, register)
│   ├── components/
│   │   ├── Navbar.jsx         # Sticky navbar, role-aware links, mobile menu
│   │   ├── BookCard.jsx       # Book display card with issue action
│   │   ├── BookForm.jsx       # Reusable add/edit book form
│   │   ├── ProtectedRoute.jsx # ProtectedRoute + AdminRoute wrappers
│   │   └── Spinner.jsx        # Loading spinner (fullscreen / inline)
│   ├── pages/
│   │   ├── Login.jsx          # Login page
│   │   ├── Signup.jsx         # Signup page with role selector
│   │   ├── UserDashboard.jsx  # Browse + search + issue books
│   │   ├── MyBooks.jsx        # User's active issued books + return
│   │   ├── AdminDashboard.jsx # Stats overview + quick links
│   │   ├── AdminBooks.jsx     # Full book CRUD with inline form
│   │   └── AdminIssues.jsx    # All issues with filter tabs + return
│   ├── App.jsx                # Route tree
│   ├── main.jsx               # Entry point + providers
│   └── index.css              # Tailwind + global design system
├── index.html                 # Root HTML with Google Fonts
├── vite.config.js             # Vite + proxy config
├── tailwind.config.js         # Custom design tokens
└── package.json
```

---

## ⚙️ Setup

### Prerequisites
- Node.js 18+
- Backend server running on port 5000

### Install & Run

```bash
# Install dependencies
npm install

# Start dev server (port 3000)
npm run dev

# Build for production
npm run build
```

### Environment
The Vite dev server proxies `/api/*` → `http://localhost:5000`. No `.env` file needed in dev. For production, update `vite.config.js` or set `VITE_API_BASE_URL`.

---

## 🎨 Design System

The UI uses a custom dark editorial aesthetic defined in `tailwind.config.js`:

| Token | Value | Usage |
|-------|-------|-------|
| `ink-950` | `#080b10` | Deepest background |
| `ink-900` | `#0f1117` | Main background |
| `ink-800` | `#161b27` | Card background |
| `amber-500` | `#f59e0b` | Primary accent |
| `parchment-50` | `#fefdf8` | Headings |
| `font-display` | Playfair Display | Headings, titles |
| `font-body` | DM Sans | Body text |
| `font-mono` | DM Mono | Labels, badges, IDs |

**Reusable CSS classes** (defined in `index.css`):
- `.btn-primary`, `.btn-secondary`, `.btn-danger`, `.btn-success`
- `.input-field`, `.card`, `.card-hover`
- `.section-label`, `.page-title`
- `.badge`, `.badge-available`, `.badge-unavailable`, `.badge-issued`, `.badge-returned`
- `.animate-fade-in`, `.animate-slide-up`, `.animate-stagger`

---

## 🔐 Auth Flow

1. User logs in → JWT stored in `localStorage` as `token`, user object as `user`
2. `AuthContext` rehydrates from localStorage on app boot
3. Axios interceptor adds `Authorization: Bearer <token>` to every request automatically
4. 401 responses → auto-logout + redirect to `/login`
5. `ProtectedRoute` guards all private pages
6. `AdminRoute` additionally checks `role === 'admin'`

---

## 📋 Route Map

| Route | Component | Access |
|-------|-----------|--------|
| `/` | Redirect | Auto |
| `/login` | Login | Public |
| `/signup` | Signup | Public |
| `/dashboard` | UserDashboard | User |
| `/my-books` | MyBooks | User |
| `/admin` | AdminDashboard | Admin |
| `/admin/books` | AdminBooks | Admin |
| `/admin/issues` | AdminIssues | Admin |

---

## 🔌 API Functions (`src/api/axios.js`)

```js
// Auth
registerUser(data)     → POST /api/auth/register
loginUser(data)        → POST /api/auth/login
getProfile()           → GET  /api/auth/profile

// Books
getAllBooks(params)     → GET  /api/books?title=&author=&genre=&available=
getBookById(id)        → GET  /api/books/:id
addBook(data)          → POST /api/books
updateBook(id, data)   → PUT  /api/books/:id
deleteBook(id)         → DELETE /api/books/:id

// Issues
issueBook(bookId)      → POST /api/issues/:bookId
returnBook(issueId)    → PUT  /api/issues/:issueId/return
getAllIssues()          → GET  /api/issues
getMyIssues()          → GET  /api/issues/my-books
```
