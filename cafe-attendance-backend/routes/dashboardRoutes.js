const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authMiddleware } = require('../middleware/authMiddleware'); // ✅ sửa lại
const checkRole = require('../middleware/checkRole'); // ✅ đúng

router.get('/', dashboardController.getDefaultDashboard);
router.get('/admin', authMiddleware, checkRole('admin'), dashboardController.getAdminDashboard);
router.get('/employee', authMiddleware, checkRole('employee'), dashboardController.getEmployeeDashboard);
router.get('/daily-summary', authMiddleware, checkRole('admin'), dashboardController.getDailySummary);

module.exports = router;
