const mongoose = require('mongoose');

const borrowSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  borrowDate: { type: Date, default: Date.now },
  returnDate: { type: Date, default: null },
  status: { type: String, enum: ['BORROWED', 'RETURNED'], default: 'BORROWED' }
}, { timestamps: true });

borrowSchema.index({ user: 1, borrowDate: -1 });
borrowSchema.index({ book: 1, status: 1 });

module.exports = mongoose.model('Borrow', borrowSchema);
