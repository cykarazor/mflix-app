// backend/models/Movie.js
const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId, // allow MongoDB native ObjectId or use .createIndex() if using legacy string IDs

  plot: String,
  fullplot: String,
  genres: [String],
  runtime: Number,

  cast: [String],
  num_mflix_comments: { type: Number, default: 0 },

  poster: String,
  title: { type: String, required: true },

  countries: [String],
  released: Date,

  directors: [String],
  writers: [String],

  awards: {
    wins: Number,
    nominations: Number,
    text: String,
  },

  lastupdated: String, // keep it as-is if it's a legacy import string

  year: Number,

  imdb: {
    rating: Number,
    votes: Number,
    id: Number,
  },

  tomatoes: mongoose.Schema.Types.Mixed, // Accept anything: ratings, viewer, critic, etc.

  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);
