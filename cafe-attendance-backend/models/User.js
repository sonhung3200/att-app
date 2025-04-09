const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  full_name: String,
  role: { type: String, enum: ['admin', 'employee'], default: 'employee' },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);