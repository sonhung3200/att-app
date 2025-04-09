const mongoose = require('mongoose');

const shiftSchema = new mongoose.Schema({
  name: String,
  start_time: String, // ví dụ "22:00"
  end_time: String,   // ví dụ "06:00"
  is_night_shift: Boolean
});

module.exports = mongoose.model('Shift', shiftSchema);