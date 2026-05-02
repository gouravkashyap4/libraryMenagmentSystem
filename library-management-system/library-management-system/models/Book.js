const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: {
      type:     String,
      required: [true, 'Book title is required'],
      trim:     true,
    },
    author: {
      type:     String,
      required: [true, 'Author name is required'],
      trim:     true,
    },
    isbn: {
      type:   String,
      unique: true,
      trim:   true,
    },
    genre: {
      type:  String,
      trim:  true,
    },
    description: {
      type: String,
    },
    totalCopies: {
      type:    Number,
      default: 1,
      min:     [1, 'Total copies must be at least 1'],
    },
    availableCopies: {
      type: Number,
      min:  [0, 'Available copies cannot be negative'],
    },
    publishedYear: {
      type: Number,
    },
  },
  { timestamps: true }
);

// ─── Pre-save: sync availableCopies with totalCopies on first create ──────────
bookSchema.pre('save', function (next) {
  if (this.isNew && this.availableCopies === undefined) {
    this.availableCopies = this.totalCopies;
  }
  next();
});

// ─── Virtual: isAvailable ─────────────────────────────────────────────────────
bookSchema.virtual('isAvailable').get(function () {
  return this.availableCopies > 0;
});

module.exports = mongoose.model('Book', bookSchema);
