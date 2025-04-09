const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  shiftId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shift', required: true },
  check_in_time: Date,
  check_out_time: Date,
  worked_hours: Number,
  calculated_salary: Number
});

module.exports = mongoose.model('Attendance', attendanceSchema);
