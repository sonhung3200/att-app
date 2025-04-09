// middleware/checkRole.js

module.exports = (...roles) => {
    return function (req, res, next) {
      if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Bạn không có quyền truy cập' });
      }
      next();
    };
  };
  