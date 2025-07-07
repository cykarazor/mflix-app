const mongoose = require('mongoose');
const Comment = require('./backend/models/Comment');
const { ObjectId } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://shawnmohammed:R639aUE08szCEii1@sdemo.xm6mnoi.mongodb.net/sample_mflix?retryWrites=true&w=majority';

async function migrateMovieId() {
  try {
    await mongoose.connect(MONGODB_URI, {
      
    });
    await mongoose.connection.asPromise();
    console.log('✅ Connected to MongoDB');

    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📂 Available collections:', collections.map(c => c.name));

    console.log('✅ Mongoose connection state:', mongoose.connection.readyState);

    await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay before running query


    const commentsToUpdate = await Comment.find({ movie_id: { $type: 'string' } });
    console.log(`🔍 Found ${commentsToUpdate.length} comments with string movie_id`);

    for (const comment of commentsToUpdate) {
      try {
        comment.movie_id = new ObjectId(comment.movie_id);
        await comment.save();
        console.log(`✅ Updated comment ${comment._id}`);
      } catch (err) {
        console.error(`❌ Failed to update comment ${comment._id}:`, err);
      }
    }

    console.log('🎉 Migration complete');
  } catch (err) {
    console.error('❌ Error during migration:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

migrateMovieId();
