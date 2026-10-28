const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true, lowercase: true, trim: true },
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
    movieTitle: { type: String, required: true },
    theater: { type: String, required: true },
    showtime: { type: String, required: true },
    seats: { type: [String], default: [] },
    total: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', BookingSchema);
