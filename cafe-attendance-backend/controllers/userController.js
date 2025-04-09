// controllers/userController.js
const User = require('../models/User');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'full_name username role');
    res.json(users);
  } catch (err) {
    console.error('Lỗi khi lấy danh sách người dùng:', err);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách người dùng' });
  }
};

const deleteUser = async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await User.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
      res.json({ message: 'Đã xoá người dùng' });
    } catch (err) {
      console.error('Lỗi khi xoá user:', err);
      res.status(500).json({ message: 'Lỗi server khi xoá user' });
    }
  };
  

module.exports = {
    getAllUsers,
    deleteUser
  };
  
