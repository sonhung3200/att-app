const express = require('express');
const router = express.Router();
const User = require('../models/User'); // đảm bảo model User tồn tại đúng tên
const {
    getAllUsers,
    deleteUser
  } = require('../controllers/userController');
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware'); // ✅ sửa lại

// Lấy danh sách toàn bộ user
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}, 'full_name username role'); // chỉ lấy một vài trường cần thiết
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách người dùng' });
  }
});

router.delete('/:id', authMiddleware, isAdmin, deleteUser);


module.exports = router;
