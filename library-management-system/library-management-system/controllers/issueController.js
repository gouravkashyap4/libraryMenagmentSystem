const Issue = require('../models/Issue');
const Book  = require('../models/Book');

// ─── @desc    Issue a book to the logged-in user
// ─── @route   POST /api/issues/:bookId
// ─── @access  Private
const issueBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);

    // Check book exists
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    // Check availability
    if (book.availableCopies <= 0) {
      return res.status(400).json({ success: false, message: 'No copies of this book are currently available' });
    }

    // Prevent duplicate active issue (same user + same book)
    const alreadyIssued = await Issue.findOne({
      book:   req.params.bookId,
      user:   req.user._id,
      status: 'issued',
    });
    if (alreadyIssued) {
      return res.status(400).json({ success: false, message: 'You have already issued this book and not returned it yet' });
    }

    // Create issue record
    const issue = await Issue.create({
      book: req.params.bookId,
      user: req.user._id,
    });

    // Decrement availableCopies atomically
    await Book.findByIdAndUpdate(req.params.bookId, { $inc: { availableCopies: -1 } });

    // Populate for response
    const populated = await issue.populate([
      { path: 'book', select: 'title author isbn' },
      { path: 'user', select: 'name email' },
    ]);

    res.status(201).json({
      success: true,
      message: 'Book issued successfully',
      data:    populated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── @desc    Return a book
// ─── @route   PUT /api/issues/:issueId/return
// ─── @access  Private
const returnBook = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.issueId);

    if (!issue) {
      return res.status(404).json({ success: false, message: 'Issue record not found' });
    }

    // Only the user who issued OR an admin can return the book
    if (issue.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to return this book' });
    }

    // Check if already returned
    if (issue.status === 'returned') {
      return res.status(400).json({ success: false, message: 'This book has already been returned' });
    }

    // Update issue record
    issue.status     = 'returned';
    issue.returnDate = Date.now();
    await issue.save();

    // Increment availableCopies atomically
    await Book.findByIdAndUpdate(issue.book, { $inc: { availableCopies: 1 } });

    const populated = await issue.populate([
      { path: 'book', select: 'title author isbn' },
      { path: 'user', select: 'name email' },
    ]);

    res.status(200).json({
      success: true,
      message: 'Book returned successfully',
      data:    populated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── @desc    Get all issue records (Admin: all; User: own only)
// ─── @route   GET /api/issues
// ─── @access  Private
const getAllIssues = async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { user: req.user._id };

    const issues = await Issue.find(filter)
      .populate('book', 'title author isbn genre')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count:   issues.length,
      data:    issues,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── @desc    Get a single issue record
// ─── @route   GET /api/issues/:issueId
// ─── @access  Private
const getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.issueId)
      .populate('book', 'title author isbn genre')
      .populate('user', 'name email');

    if (!issue) {
      return res.status(404).json({ success: false, message: 'Issue record not found' });
    }

    // Non-admin can only view their own issues
    if (req.user.role !== 'admin' && issue.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this issue' });
    }

    res.status(200).json({ success: true, data: issue });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── @desc    Get currently issued (active) books for logged-in user
// ─── @route   GET /api/issues/my-books
// ─── @access  Private
const getMyIssuedBooks = async (req, res) => {
  try {
    const issues = await Issue.find({ user: req.user._id, status: 'issued' })
      .populate('book', 'title author isbn genre')
      .sort({ issueDate: -1 });

    res.status(200).json({
      success: true,
      count:   issues.length,
      data:    issues,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { issueBook, returnBook, getAllIssues, getIssueById, getMyIssuedBooks };
