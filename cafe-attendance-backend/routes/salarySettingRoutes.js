const express = require('express');
const router = express.Router();
const salarySettingController = require('../controllers/salarySettingController');

router.post('/create', salarySettingController.createSalarySetting);
router.get('/get', salarySettingController.getSalarySetting);

module.exports = router;