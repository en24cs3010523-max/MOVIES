const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    genre: { type: String, trim: true, default: 'Drama' },
    duration: { type: String, trim: true, default: '2h 0min' },
    image: { type: String, trim: true, default: '' },
    desc: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Movie', MovieSchema);
