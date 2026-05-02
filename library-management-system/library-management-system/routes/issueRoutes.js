const express = require('express');
const router  = express.Router();
const {
  issueBook,
  returnBook,
  getAllIssues,
  getIssueById,
  getMyIssuedBooks,
} = require('../controllers/issueController');
const { protect } = require('../middleware/authMiddleware');

// All issue routes require authentication
router.use(protect);

// GET /api/issues              — Admin: all issues; User: own issues
router.get('/', getAllIssues);

// GET /api/issues/my-books     — Currently issued books for logged-in user
router.get('/my-books', getMyIssuedBooks);

// GET /api/issues/:issueId     — Single issue record
router.get('/:issueId', getIssueById);

// POST /api/issues/:bookId     — Issue a book
router.post('/:bookId', issueBook);

// PUT  /api/issues/:issueId/return  — Return a book
router.put('/:issueId/return', returnBook);

module.exports = router;
