const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  movie_id: {
    type: mongoose.Schema.Types.ObjectId, // 👈 this is the correct type
    required: true,
    index: true,
  },
  name: { type: String, required: true },
  email: { type: String, required: true },
  text: { type: String, required: true },
  date: { type: Date, default: Date.now },
}, {
  collection: 'comments', // ✅ use existing collection name
});

module.exports = mongoose.model('Comment', commentSchema);
