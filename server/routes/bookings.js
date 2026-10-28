const express = require('express');
const Booking = require('../models/Booking');

const router = express.Router();

// GET /api/bookings?email=...
router.get('/', async (req, res) => {
  try {
    const { email } = req.query;
    const filter = email ? { userEmail: String(email).toLowerCase() } : {};
    const bookings = await Booking.find(filter).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookings', detail: err.message });
  }
});

// POST /api/bookings
router.post('/', async (req, res) => {
  try {
    const { userEmail, movieTitle, theater, showtime, seats, total, movieId } = req.body;
    if (!userEmail || !movieTitle || !theater || !showtime)
      return res.status(400).json({ error: 'Missing booking fields' });

    const booking = await Booking.create({
      userEmail: userEmail.toLowerCase(),
      movieId,
      movieTitle,
      theater,
      showtime,
      seats: seats || [],
      total: total || 0,
    });
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create booking', detail: err.message });
  }
});

// DELETE /api/bookings/:id
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Booking.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Booking not found' });
    res.json({ message: 'Booking cancelled', id: req.params.id });
  } catch (err) {
    res.status(400).json({ error: 'Failed to cancel booking', detail: err.message });
  }
});

module.exports = router;
