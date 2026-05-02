const Book = require('../models/Book');

// ─── @desc    Get all books (with optional search/filter)
// ─── @route   GET /api/books
// ─── @access  Public
const getAllBooks = async (req, res) => {
  try {
    const { title, author, genre, available } = req.query;
    const filter = {};

    if (title)     filter.title  = { $regex: title,  $options: 'i' };
    if (author)    filter.author = { $regex: author, $options: 'i' };
    if (genre)     filter.genre  = { $regex: genre,  $options: 'i' };
    if (available === 'true')  filter.availableCopies = { $gt: 0 };
    if (available === 'false') filter.availableCopies = 0;

    const books = await Book.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count:   books.length,
      data:    books,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── @desc    Get single book by ID
// ─── @route   GET /api/books/:id
// ─── @access  Public
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    res.status(200).json({ success: true, data: book });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── @desc    Add a new book
// ─── @route   POST /api/books
// ─── @access  Private/Admin
const addBook = async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Book added successfully',
      data:    book,
    });
  } catch (error) {
    // Handle duplicate ISBN
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'A book with this ISBN already exists' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── @desc    Update a book
// ─── @route   PUT /api/books/:id
// ─── @access  Private/Admin
const updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Book updated successfully',
      data:    book,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── @desc    Delete a book
// ─── @route   DELETE /api/books/:id
// ─── @access  Private/Admin
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Book deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllBooks, getBookById, addBook, updateBook, deleteBook };
