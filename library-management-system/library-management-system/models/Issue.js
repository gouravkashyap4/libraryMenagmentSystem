const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema(
  {
    book: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Book',
      required: [true, 'Book reference is required'],
    },
    user: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: [true, 'User reference is required'],
    },
    issueDate: {
      type:    Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      // Default: 14 days from today
      default: () => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    },
    returnDate: {
      type:    Date,
      default: null,
    },
    status: {
      type:    String,
      enum:    ['issued', 'returned', 'overdue'],
      default: 'issued',
    },
  },
  { timestamps: true }
);

// ─── Compound index: one active issue per book per user ───────────────────────
// Prevents the same user from issuing the same book twice simultaneously
issueSchema.index(
  { book: 1, user: 1, status: 1 },
  { unique: false } // we enforce this in the controller instead for better error messages
);

module.exports = mongoose.model('Issue', issueSchema);
