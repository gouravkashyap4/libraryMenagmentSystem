const express = require('express');
const router  = express.Router();
const {
  getAllBooks,
  getBookById,
  addBook,
  updateBook,
  deleteBook,
} = require('../controllers/bookController');
const { protect, authorize } = require('../middleware/authMiddleware');

// GET  /api/books          — public
// POST /api/books          — admin only
router
  .route('/')
  .get(getAllBooks)
  .post(protect, authorize('admin'), addBook);

// GET    /api/books/:id    — public
// PUT    /api/books/:id    — admin only
// DELETE /api/books/:id    — admin only
router
  .route('/:id')
  .get(getBookById)
  .put(protect,    authorize('admin'), updateBook)
  .delete(protect, authorize('admin'), deleteBook);

module.exports = router;
