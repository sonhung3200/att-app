const Attendance = require('../models/Attendance');
const User = require('../models/User');
const moment = require('moment');

// Dashboard mặc định
exports.getDefaultDashboard = (req, res) => {
  res.json({ message: 'Chào mừng đến với Dashboard hệ thống chấm công!' });
};

// Dashboard cho Admin
exports.getAdminDashboard = async (req, res) => {
  try {
    const { month, year } = req.query;

    const start = new Date(`${year}-${month}-01`);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);

    const attendances = await Attendance.find({
      check_in_time: { $gte: start, $lt: end },
    })
      .populate('userId', 'full_name')
      .populate('shiftId');

    const totalAttendance = attendances.length;
    let totalHours = 0;
    let totalSalary = 0;
    let totalNightShifts = 0;

    const employeeMap = new Map();

    attendances.forEach(att => {
      if (!att.userId || !att.userId._id) return;
      const userId = att.userId._id.toString();

      if (!employeeMap.has(userId)) {
        employeeMap.set(userId, {
          userId,
          full_name: att.userId.full_name,
          total_hours: 0,
          total_salary: 0,
          night_shifts: 0,
        });
      }

      const data = employeeMap.get(userId);
      data.total_hours += att.worked_hours || 0;
      data.total_salary += att.calculated_salary || 0;
      if (att.shiftId?.is_night_shift) {
        data.night_shifts += 1;
        totalNightShifts += 1;
      }

      totalHours += att.worked_hours || 0;
      totalSalary += att.calculated_salary || 0;
    });

    const topEmployees = Array.from(employeeMap.values())
      .sort((a, b) => b.total_hours - a.total_hours)
      .slice(0, 5);

    res.json({
      totalAttendance,
      totalHours,
      totalSalary,
      totalNightShifts,
      topEmployees,
    });
  } catch (error) {
    console.error('❌ Lỗi ở getAdminDashboard:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Dashboard cho Nhân viên
exports.getEmployeeDashboard = async (req, res) => {
  try {
    const userId = req.user._id;
    const attendances = await Attendance.find({ userId }).populate('shiftId');

    const totalHours = attendances.reduce((sum, a) => sum + (a.worked_hours || 0), 0);
    const totalSalary = attendances.reduce((sum, a) => sum + (a.calculated_salary || 0), 0);
    const nightShifts = attendances.filter(a => a.shiftId?.is_night_shift).length;

    res.json({
      totalHours: +totalHours.toFixed(2),
      totalSalary,
      nightShifts,
      message: `Dashboard của nhân viên ${req.user.username}`,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Thống kê từng ngày
exports.getDailySummary = async (req, res) => {
  try {
    const { month, year } = req.query;
    const start = moment({ year, month: month - 1 }).startOf('month');
    const end = moment(start).endOf('month');

    const attendances = await Attendance.find({
      check_in_time: { $gte: start.toDate(), $lte: end.toDate() }
    }).populate('userId');

    const grouped = {};
    attendances.forEach(att => {
      const date = moment(att.check_in_time).format('YYYY-MM-DD');
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(att);
    });

    const summary = Object.entries(grouped).map(([date, records]) => {
      const stats = {};
      records.forEach(record => {
        const userId = record.userId._id;
        if (!stats[userId]) {
          stats[userId] = {
            userId,
            full_name: record.userId.full_name,
            total_hours: 0,
            total_salary: 0
          };
        }
        stats[userId].total_hours += record.worked_hours || 0;
        stats[userId].total_salary += record.calculated_salary || 0;
      });

      return {
        date,
        summary: Object.values(stats)
      };
    });

    res.json(summary);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
