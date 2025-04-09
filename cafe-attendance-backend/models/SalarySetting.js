const mongoose = require('mongoose');

const salarySettingSchema = new mongoose.Schema({
  base_hourly_rate: Number,
  night_shift_bonus: Number
});

module.exports = mongoose.model('SalarySetting', salarySettingSchema);