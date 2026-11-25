const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  author: { type: String, required: true, trim: true, maxlength: 150 },
  category: { type: String, required: true, trim: true, maxlength: 100 },
  isbn: { type: String, required: true, unique: true, trim: true, maxlength: 20 },
  publishedYear: { type: Number, min: 0, max: 9999 },
  description: { type: String, trim: true, maxlength: 5000, default: '' },
  availableCopies: { type: Number, required: true, min: 0, default: 1 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
