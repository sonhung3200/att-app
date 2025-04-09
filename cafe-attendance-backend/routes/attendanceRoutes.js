const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

router.post('/checkin', attendanceController.checkIn);
router.post('/checkout', attendanceController.checkOut);
router.get('/history/:userId', attendanceController.getAttendanceByUser);
router.get('/salary/monthly', attendanceController.getMonthlySalary);
router.get('/filter', attendanceController.filterAttendanceByDate);
router.get('/summary', attendanceController.getSummaryByDateRange);
router.get('/top-employees', attendanceController.getTopEmployees);
router.get('/daily-salary', attendanceController.getDailySalary);

module.exports = router;