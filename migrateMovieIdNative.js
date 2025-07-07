const { MongoClient, ObjectId } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://shawnmohammed:R639aUE08szCEii1@sdemo.xm6mnoi.mongodb.net/sample_mflix?retryWrites=true&w=majority';
const DB_NAME = 'sample_mflix';

async function migrateMovieIds() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB via native driver');

    const db = client.db(DB_NAME);
    const comments = db.collection('comments');

    const stringComments = await comments.find({ movie_id: { $type: 'string' } }).toArray();
    console.log(`🔍 Found ${stringComments.length} comments with string movie_id`);

    for (const comment of stringComments) {
      try {
        const updatedId = new ObjectId(comment.movie_id);
        await comments.updateOne(
          { _id: comment._id },
          { $set: { movie_id: updatedId } }
        );
        console.log(`✅ Updated comment ${comment._id}`);
      } catch (err) {
        console.error(`❌ Failed to update comment ${comment._id}:`, err.message);
      }
    }

    console.log('🏁 Migration complete');
  } catch (err) {
    console.error('❌ Migration error:', err.message);
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

migrateMovieIds();
