const mongoose = require('mongoose');
require('dotenv').config();
const Movie = require('./models/Movie');
const { sourceList } = require('./data/sampleMovies');

(async () => {
  const url = process.env.MONGO_URL || process.env.MONGO_URI;
  if (!url) {
    console.error('MONGO_URL is not set');
    process.exit(1);
  }
  try {
    await mongoose.connect(url);
    await Movie.deleteMany({});
    await Movie.insertMany(sourceList);
    console.log('Seeded', sourceList.length, 'movies');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  }
})();
