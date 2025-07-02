const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  movie_id: {
    type: String,
    required: true,
    index: true,
  },
  name: { type: String, required: true },
  email: { type: String, required: true },
  text: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Comment', commentSchema);
