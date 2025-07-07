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
   likes: { type: Number, default: 0 },
  likedBy: { type: [String], default: [] },
  dislikes: { type: Number, default: 0 },
  dislikedBy: { type: [String], default: [] },
}, {
  collection: 'comments', // ✅ use existing collection name
});

module.exports = mongoose.model('Comment', commentSchema);
