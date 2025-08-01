const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'], // your roles
    default: 'user',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: {
    type: Date,
    default: null, // ✅ Default to null if not set
  },
}, {
  timestamps: true, // ✅ Automatically adds createdAt & updatedAt
});

// ✅ Pre-save hook to hash password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Skip if password not changed
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ✅ Method to compare passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ✅ Export model as SampleUser for consistency
const SampleUser = mongoose.model('User', userSchema);
module.exports = SampleUser;
