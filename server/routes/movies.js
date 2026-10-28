const express = require('express');
const mongoose = require('mongoose');
const Movie = require('../models/Movie');
const sampleMovies = require('../data/sampleMovies');

const router = express.Router();

// Whether Mongoose is connected to MongoDB.
const dbReady = () => mongoose.connection.readyState === 1;

// GET /api/movies
router.get('/', async (req, res) => {
  try {
    if (!dbReady()) {
      return res.json(sampleMovies);
    }
    const movies = await Movie.find().sort({ createdAt: -1 });
    if (!movies || movies.length === 0) {
      return res.json(sampleMovies);
    }
    res.json(movies);
  } catch (err) {
    console.error('GET /api/movies failed, returning fallback:', err.message);
    res.json(sampleMovies);
  }
});

// GET /api/movies/:id
router.get('/:id', async (req, res) => {
  try {
    if (!dbReady()) {
      const found = sampleMovies.find((m) => m._id === req.params.id);
      return found
        ? res.json(found)
        : res.status(404).json({ error: 'Movie not found' });
    }
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ error: 'Movie not found' });
    res.json(movie);
  } catch (err) {
    const found = sampleMovies.find((m) => m._id === req.params.id);
    if (found) return res.json(found);
    res.status(500).json({ error: 'Failed to fetch movie', detail: err.message });
  }
});

// POST /api/movies
router.post('/', async (req, res) => {
  try {
    const { title, genre, duration, image, desc } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });
    if (!dbReady()) {
      return res.status(503).json({
        error: 'Database unavailable — start MongoDB to add movies.',
      });
    }
    const movie = await Movie.create({ title, genre, duration, image, desc });
    res.status(201).json(movie);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create movie', detail: err.message });
  }
});

// PUT /api/movies/:id
router.put('/:id', async (req, res) => {
  try {
    if (!dbReady()) {
      return res.status(503).json({
        error: 'Database unavailable — start MongoDB to edit movies.',
      });
    }
    const updated = await Movie.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title: req.body.title,
          genre: req.body.genre,
          duration: req.body.duration,
          image: req.body.image,
          desc: req.body.desc,
        },
      },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Movie not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update movie', detail: err.message });
  }
});

// DELETE /api/movies/:id
router.delete('/:id', async (req, res) => {
  try {
    if (!dbReady()) {
      return res.status(503).json({
        error: 'Database unavailable — start MongoDB to delete movies.',
      });
    }
    const deleted = await Movie.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Movie not found' });
    res.json({ message: 'Movie deleted', id: req.params.id });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete movie', detail: err.message });
  }
});

module.exports = router;
