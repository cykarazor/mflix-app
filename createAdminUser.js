const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

const uri = "mongodb+srv://shawnmohammed:R639aUE08szCEii1@sdemo.xm6mnoi.mongodb.net/sample_mflix?retryWrites=true&w=majority&tls=true";
const dbName = "sample_mflix";

async function createAdmin() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');

    const db = client.db(dbName);
    const users = db.collection('users');

    const adminEmail = "shawn.admin@gmail.com";  // change to your admin email
    const adminName = "Admin User";
    const plainPassword = "Shawn$Gmail$";  // change to a secure password

    // Check if user already exists
    const existing = await users.findOne({ email: adminEmail });
    if (existing) {
      console.log('User with this email already exists:', adminEmail);
      return;
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

    // Prepare admin user doc
    const now = new Date();
    const adminUser = {
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };

    // Insert admin user
    const result = await users.insertOne(adminUser);
    console.log('Admin user created with ID:', result.insertedId);
  } catch (err) {
    console.error('Error creating admin user:', err);
  } finally {
    await client.close();
  }
}

createAdmin();

{/* 
 _id
6886eed8eb1597130f48f316
name
"Admin User"
email
"shawn.admin@gmail.com"
password
"$2b$10$uEz.W4KFcVRlVVquTfR.BuR6nFNJknsxPiv0LO5TjHG9AGJRyfhK."
role
"admin"
isActive
true
createdAt
2025-07-28T03:30:32.596+00:00
updatedAt
2025-07-28T03:30:32.596+00:00 */}