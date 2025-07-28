const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://shawnmohammed:R639aUE08szCEii1@sdemo.xm6mnoi.mongodb.net/sample_mflix?retryWrites=true&w=majority&tls=true";

const dbName = "sample_mflix";

async function updateUsers() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");

    const db = client.db(dbName);
    const users = db.collection('users');

    const now = new Date();

    // Update role if missing
    const roleResult = await users.updateMany(
      { role: { $exists: false } },
      { $set: { role: "user" } }
    );
    console.log(`Updated role for ${roleResult.modifiedCount} users`);

    // Update isActive if missing
    const activeResult = await users.updateMany(
      { isActive: { $exists: false } },
      { $set: { isActive: true } }
    );
    console.log(`Updated isActive for ${activeResult.modifiedCount} users`);

    // Update createdAt if missing
    const createdResult = await users.updateMany(
      { createdAt: { $exists: false } },
      { $set: { createdAt: now } }
    );
    console.log(`Updated createdAt for ${createdResult.modifiedCount} users`);

    // Update updatedAt if missing
    const updatedResult = await users.updateMany(
      { updatedAt: { $exists: false } },
      { $set: { updatedAt: now } }
    );
    console.log(`Updated updatedAt for ${updatedResult.modifiedCount} users`);

    console.log("All updates completed safely.");
  } catch (err) {
    console.error("Error updating users:", err);
  } finally {
    await client.close();
  }
}

updateUsers();
