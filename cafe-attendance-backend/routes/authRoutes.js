const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRole');


// Đăng ký tài khoản
router.post('/register', authController.register);

// Đăng nhập
router.post('/login', authController.login);

// Route chỉ dành cho admin
router.get('/admin-only', authMiddleware, isAdmin, (req, res) => {
  res.json({ message: 'Chào admin!' });
});


// Route dành cho cả admin và employee
router.get('/employee-or-admin', authMiddleware, checkRole('admin', 'employee'), (req, res) => {
  res.json({ message: `Xin chào ${req.user.role} ${req.user.userId}! Truy cập được phép.` });
});

module.exports = router;