const SalarySetting = require('../models/SalarySetting');

exports.createSalarySetting = async (req, res) => {
  try {
    const { base_hourly_rate, night_shift_bonus } = req.body;

    const salary = new SalarySetting({
      base_hourly_rate,
      night_shift_bonus
    });

    await salary.save();
    res.status(201).json({ message: 'Tạo cấu hình lương thành công', salary });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSalarySetting = async (req, res) => {
  try {
    const salary = await SalarySetting.findOne();
    res.status(200).json({ data: salary });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};