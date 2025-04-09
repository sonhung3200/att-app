const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import model User

// Middleware xác thực người dùng
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Không có token, truy cập bị từ chối' });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');

      if (!user) {
        return res.status(404).json({ message: 'Người dùng không tồn tại' });
      }

      req.user = user; // Gắn thông tin người dùng vào req
      next();
    } catch (err) {
      console.error('Lỗi xác thực:', err);
      return res.status(401).json({ message: 'Token không hợp lệ' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

// Middleware kiểm tra quyền admin
const isAdmin = (req, res, next) => {
  if (req.user?.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Chỉ admin được phép truy cập' });
  }
};

module.exports = {
  authMiddleware,
  isAdmin,
};
