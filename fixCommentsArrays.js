// scripts/fixCommentsArrays.js
const mongoose = require('mongoose');

const uri = 'mongodb+srv://shawnmohammed:R639aUE08szCEii1@sdemo.xm6mnoi.mongodb.net/sample_mflix?retryWrites=true&w=majority'; // replace with your connection string

const commentSchema = new mongoose.Schema({
  likedBy: { type: [String], default: [] },
  dislikedBy: { type: [String], default: [] },
}, { collection: 'comments' });

const Comment = mongoose.model('Comment', commentSchema);

async function fixComments() {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    const result1 = await Comment.updateMany(
      { likedBy: { $exists: false } },
      { $set: { likedBy: [] } }
    );
    console.log(`Updated likedBy in ${result1.modifiedCount} documents`);

    const result2 = await Comment.updateMany(
      { dislikedBy: { $exists: false } },
      { $set: { dislikedBy: [] } }
    );
    console.log(`Updated dislikedBy in ${result2.modifiedCount} documents`);

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

fixComments();
