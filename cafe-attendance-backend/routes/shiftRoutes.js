const express = require('express');
const router = express.Router();
const shiftController = require('../controllers/shiftController');

router.post('/create', shiftController.createShift);
router.get('/all', shiftController.getAllShifts);
router.delete('/:id', shiftController.deleteShift); // Xóa ca làm việc theo ID
router.put('/:id', shiftController.updateShift); // Cập nhật ca làm việc theo ID


module.exports = router;