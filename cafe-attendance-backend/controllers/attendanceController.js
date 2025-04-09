const Attendance = require('../models/Attendance');
const Shift = require('../models/Shift');
const SalarySetting = require('../models/SalarySetting');

// Hàm tính số giờ làm (làm tròn 2 chữ số thập phân)
function calculateHours(start, end) {
  const diff = (new Date(end) - new Date(start)) / (1000 * 60 * 60); // ms → h
  return Math.round(diff * 100) / 100;
}

// 📥 Check-in
exports.checkIn = async (req, res) => {
  try {
    const { userId, shiftId } = req.body;

    if (!userId || !shiftId) {
      return res.status(400).json({ message: 'Thiếu userId hoặc shiftId' });
    }

    const existing = await Attendance.findOne({ userId, check_out_time: null });
    if (existing) {
      return res.status(400).json({ message: 'Bạn đã check-in rồi, chưa check-out!' });
    }

    const attendance = new Attendance({
      userId: userId,
      shiftId: shiftId,
      check_in_time: new Date()
    });

    await attendance.save();
    res.status(201).json({ message: 'Check-in thành công', attendance });

  } catch (err) {
    console.error('Lỗi check-in:', err);
    res.status(500).json({ error: err.message });
  }
};


// 📤 Check-out
exports.checkOut = async (req, res) => {
  try {
    const { userId } = req.body;

    const attendance = await Attendance.findOne({ userId, check_out_time: null }).populate('shiftId');
    if (!attendance) {
      return res.status(400).json({ message: 'Không tìm thấy ca đang làm!' });
    }

    attendance.check_out_time = new Date();

    const hours = calculateHours(attendance.check_in_time, attendance.check_out_time);

    // Lấy lương từ salary setting
    const salarySetting = await SalarySetting.findOne();
    const baseRate = salarySetting.base_hourly_rate;
    const nightBonus = salarySetting.night_shift_bonus;

    const isNight = attendance.shiftId?.is_night_shift || false;
    const salary = hours * baseRate + (isNight ? hours * nightBonus : 0);

    // Cập nhật lại giờ làm và lương
    attendance.worked_hours = hours;
    attendance.calculated_salary = salary;

    await attendance.save();

    res.status(200).json({
      message: 'Check-out thành công',
      worked_hours: hours,
      calculated_salary: salary,
      attendance
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📅 Lịch sử chấm công
exports.getAttendanceByUser = async (req, res) => {
    try {
      const userId = req.params.userId;
  
      const attendanceList = await Attendance.find({ userId })
        .populate('shiftId') // lấy thêm thông tin ca làm
        .sort({ check_in_time: -1 }); // sắp xếp mới nhất trước
  
      res.status(200).json({ data: attendanceList });
  
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

// Tính tổng lương theo tháng
exports.getMonthlySalary = async (req, res) => {
    try {
      const { userId, month, year } = req.query;
  
      // Tạo khoảng thời gian đầu/tháng và cuối/tháng
      const startDate = new Date(year, month - 1, 1); // ví dụ: tháng 4 -> 3
      const endDate = new Date(year, month, 1);       // tháng tiếp theo
  
      const records = await Attendance.find({
        userId,
        check_out_time: { $gte: startDate, $lt: endDate }
      });
  
      let totalHours = 0;
      let totalSalary = 0;
  
      records.forEach(rec => {
        totalHours += rec.worked_hours || 0;
        totalSalary += rec.calculated_salary || 0;
      });
  
      res.status(200).json({
        userId,
        month,
        year,
        total_hours: Math.round(totalHours * 100) / 100,
        total_salary: Math.round(totalSalary)
      });
  
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  exports.filterAttendanceByDate = async (req, res) => {
    try {
      const { userId, month, year } = req.query;
  
      if (!userId || !month || !year) {
        return res.status(400).json({ message: 'Thiếu thông tin lọc (userId, month, year)' });
      }
  
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 1); // đầu tháng tiếp theo
  
      const records = await Attendance.find({
        userId,
        check_in_time: { $gte: start, $lt: end }
      })
        .populate('shiftId')
        .sort({ check_in_time: -1 });
  
      const result = records.map(r => ({
        check_in_time: r.check_in_time,
        check_out_time: r.check_out_time,
        worked_hours: r.worked_hours,
        calculated_salary: r.calculated_salary,
        shift_name: r.shiftId?.name || 'Không rõ'
      }));
  
      res.status(200).json(result);
  
    } catch (err) {
      console.error('Lỗi filterAttendanceByDate:', err);
      res.status(500).json({ error: err.message });
    }
  };
  

// Tổng hợp tổng giờ và lương theo khoảng thời gian (cho admin)
exports.getSummaryByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const records = await Attendance.find({
      check_out_time: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).populate('userId', 'full_name');

    let totalHours = 0;
    let totalSalary = 0;

    const summaryByUser = {};

    records.forEach(rec => {
      const userId = rec.userId._id.toString();
      const name = rec.userId.full_name;
      const hours = rec.worked_hours || 0;
      const salary = rec.calculated_salary || 0;

      totalHours += hours;
      totalSalary += salary;

      if (!summaryByUser[userId]) {
        summaryByUser[userId] = {
          full_name: name,
          total_hours: 0,
          total_salary: 0
        };
      }

      summaryByUser[userId].total_hours += hours;
      summaryByUser[userId].total_salary += salary;
    });

    res.status(200).json({
      startDate,
      endDate,
      totalHours: Math.round(totalHours * 100) / 100,
      totalSalary: Math.round(totalSalary),
      summary: Object.values(summaryByUser)
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Top 3 nhân viên làm việc nhiều nhất theo giờ (theo khoảng thời gian)
exports.getTopEmployees = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const topEmployees = await Attendance.aggregate([
      {
        $match: {
          check_out_time: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          }
        }
      },
      {
        $group: {
          _id: "$userId",
          total_hours: { $sum: "$worked_hours" }
        }
      },
      { $sort: { total_hours: -1 } },
      { $limit: 3 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 0,
          userId: "$user._id",
          full_name: "$user.full_name",
          total_hours: 1
        }
      }
    ]);

    res.status(200).json({ topEmployees });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Tính lương cho từng nhân viên theo từng ngày
exports.getDailySalary = async (req, res) => {
  try {
    const { userId, date } = req.query;

    const start = new Date(date);
    const end = new Date(date);
    end.setDate(end.getDate() + 1);

    const records = await Attendance.find({
      userId,
      check_in_time: { $gte: start, $lt: end },
    }).populate('shiftId');

    if (records.length === 0) {
      return res.status(404).json({ message: 'Không có dữ liệu chấm công' });
    }

    const salarySetting = await SalarySetting.findOne();
    let totalSalary = 0;

    records.forEach(record => {
      let rate = salarySetting.hourly_rate;
      if (record.shiftId.name.toLowerCase().includes('đêm')) {
        rate += salarySetting.night_bonus;
      }
      totalSalary += record.worked_hours * rate;
    });

    res.status(200).json({ userId, date, totalSalary });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Tính lương theo ngày cho từng user
const moment = require('moment');

exports.getDailySalary = async (req, res) => {
  try {
    const { userId, date } = req.query;
    if (!userId || !date) {
      return res.status(400).json({ message: 'Missing userId or date' });
    }

    const startOfDay = moment(date).startOf('day').toDate();
    const endOfDay = moment(date).endOf('day').toDate();

    const attendances = await Attendance.find({
      userId,
      check_in_time: { $gte: startOfDay, $lte: endOfDay },
    }).populate('shiftId');

    let totalHours = 0;
    let totalSalary = 0;

    attendances.forEach((item) => {
      const hours = item.worked_hours || 0;
      const rate = item.shiftId?.wage_per_hour || 0;
      const extra = item.shiftId?.extra_salary || 0;

      totalHours += hours;
      totalSalary += hours * (rate + extra);
    });

    res.json({
      totalHours,
      totalSalary,
      attendances,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




  
