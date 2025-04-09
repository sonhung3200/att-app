const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const shiftRoutes = require('./routes/shiftRoutes');
const salarySettingRoutes = require('./routes/salarySettingRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const userRoutes = require('./routes/userRoutes'); // thêm dòng này


// Khởi tạo app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('✅ Attendance App Server is running...');
});

// Sử dụng các routes
app.use('/api/auth', authRoutes);               // Đăng ký / Đăng nhập
app.use('/api/attendance', attendanceRoutes);   // Check-in, check-out, lịch sử, thống kê
app.use('/api/shift', shiftRoutes);             // Tạo / lấy ca làm
app.use('/api/salary', salarySettingRoutes);    // Cấu hình lương
app.use('/api/dashboard', dashboardRoutes);     // Thống kê tổng quan
app.use('/api/users', userRoutes); // thêm dòng này dưới các app.use khác

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB connected');
  app.listen(process.env.PORT || 5000, () => {
    console.log('🚀 Server running on port 5000');
  });
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
});
