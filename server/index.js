const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const movieRoutes = require('./routes/movies');
const userRoutes = require('./routes/users');
const bookingRoutes = require('./routes/bookings');
const { sourceList } = require('./data/sampleMovies');
const Movie = require('./models/Movie');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) =>
  res.json({
    status: 'ok',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  })
);
app.use('/api/movies', movieRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);

// Central error handler — never let an unhandled error crash the process.
app.use((err, req, res, _next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'Server error', detail: err.message });
});

const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL || process.env.MONGO_URI;

// Start listening immediately so the API is always reachable, even while
// the database connection is still being established or retried.
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

let seedAttempted = false;
async function connectWithRetry(attempt = 1) {
  if (!MONGO_URL) {
    console.warn('MONGO_URL is not set — running with sample-data fallback only.');
    return;
  }
  try {
    await mongoose.connect(MONGO_URL);
    console.log('MongoDB connected');
    if (!seedAttempted) {
      seedAttempted = true;
      try {
        const count = await Movie.countDocuments();
        if (count === 0) {
          await Movie.insertMany(sourceList);
          console.log(`Auto-seeded ${sourceList.length} sample movies`);
        }
      } catch (seedErr) {
        console.warn('Auto-seed failed (non-fatal):', seedErr.message);
      }
    }
  } catch (err) {
    console.warn(`MongoDB connection attempt ${attempt} failed: ${err.message}`);
    const delay = Math.min(1000 * attempt, 5000);
    setTimeout(() => connectWithRetry(attempt + 1), delay);
  }
}

connectWithRetry();
