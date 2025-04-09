const Shift = require('../models/Shift');
const Attendance = require('../models/Attendance');

exports.getAllShifts = async (req, res) => {
  try {
    const shifts = await Shift.find();
    res.status(200).json({ data: shifts });
  } catch (error) {
    console.error('Lỗi khi lấy ca làm:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách ca làm' });
  }
};

exports.createShift = async (req, res) => {
  try {
    const { name, start_time, end_time, is_night_shift, hourly_rate } = req.body;
    const shift = new Shift({ name, start_time, end_time, is_night_shift, hourly_rate });
    await shift.save();
    res.status(201).json({ message: 'Tạo ca làm thành công', data: shift });
  } catch (error) {
    console.error('Lỗi khi tạo ca làm:', error);
    res.status(500).json({ message: 'Lỗi server khi tạo ca làm' });
  }
};

exports.updateShift = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, start_time, end_time, is_night_shift, hourly_rate } = req.body;

    const shift = await Shift.findByIdAndUpdate(
      id,
      { name, start_time, end_time, is_night_shift, hourly_rate },
      { new: true, runValidators: true }
    );

    if (!shift) {
      return res.status(404).json({ message: 'Không tìm thấy ca làm' });
    }

    res.json({ message: 'Cập nhật ca làm thành công', data: shift });
  } catch (error) {
    console.error('Lỗi khi cập nhật ca làm:', error);
    res.status(500).json({ message: 'Lỗi server khi cập nhật ca làm' });
  }
};

exports.deleteShift = async (req, res) => {
  try {
    const { id } = req.params;
    const isUsed = await Attendance.findOne({ shift_id: id });

    if (isUsed) {
      return res.status(400).json({ message: 'Ca làm đang được sử dụng, không thể xoá.' });
    }

    const result = await Shift.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: 'Không tìm thấy ca làm để xoá' });
    }

    res.json({ message: '🗑️ Xoá ca làm thành công!' });
  } catch (error) {
    console.error('Lỗi khi xoá ca làm:', error);
    res.status(500).json({ message: 'Lỗi server khi xoá ca làm' });
  }
};
