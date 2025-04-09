import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AttendanceManager() {
  const [attendances, setAttendances] = useState([]);
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    userId: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });

  const [summary, setSummary] = useState({
    totalHours: 0,
    totalSalary: 0,
    nightShifts: 0
  });

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error('Lỗi khi lấy danh sách người dùng:', err);
    }
  };

  const fetchAttendance = async () => {
    try {
      const token = localStorage.getItem('token');
      const { userId, month, year } = filters;
      const res = await axios.get(`http://localhost:5000/api/attendance/filter`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { userId, month, year }
      });
      setAttendances(res.data);
      calculateSummary(res.data);
    } catch (err) {
      console.error('Lỗi khi lọc chấm công:', err);
    }
  };

  const calculateSummary = (data) => {
    const totalHours = data.reduce((sum, item) => sum + (item.worked_hours || 0), 0);
    const totalSalary = data.reduce((sum, item) => sum + (item.calculated_salary || 0), 0);
    const nightShifts = data.filter(item => item.is_night_shift).length;
    setSummary({ totalHours, totalSalary, nightShifts });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilter = () => {
    fetchAttendance();
  };

  const formatDate = (datetime) => {
    const date = new Date(datetime);
    return date.toLocaleDateString();
  };

  const formatTime = (datetime) => {
    const date = new Date(datetime);
    return date.toLocaleTimeString();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>📅 Quản lý chấm công</h2>

      <div style={{ marginBottom: 20 }}>
        <label>Nhân viên: </label>
        <select name="userId" value={filters.userId} onChange={handleChange}>
          <option value="">-- Chọn nhân viên --</option>
          {users.map(user => (
            <option key={user._id} value={user._id}>{user.full_name}</option>
          ))}
        </select>

        <label style={{ marginLeft: 10 }}>Tháng: </label>
        <input type="number" name="month" value={filters.month} onChange={handleChange} min={1} max={12} />

        <label style={{ marginLeft: 10 }}>Năm: </label>
        <input type="number" name="year" value={filters.year} onChange={handleChange} />

        <button onClick={handleFilter} style={{ marginLeft: 10 }}>Lọc</button>
      </div>

      <table border="1" cellPadding="10" style={{ width: '100%', marginBottom: 20 }}>
        <thead>
          <tr>
            <th>Ngày</th>
            <th>Ca làm</th>
            <th>Check-in</th>
            <th>Check-out</th>
            <th>Giờ làm</th>
            <th>Lương</th>
          </tr>
        </thead>
        <tbody>
          {attendances.map((att, index) => (
            <tr key={index}>
              <td>{formatDate(att.check_in_time)}</td>
              <td>{att.shift_name || '-'}</td>
              <td>{formatTime(att.check_in_time)}</td>
              <td>{formatTime(att.check_out_time)}</td>
              <td>{att.worked_hours?.toFixed(2)} giờ</td>
              <td>{att.calculated_salary?.toLocaleString()} VND</td>
            </tr>
          ))}
        </tbody>
      </table>

      {attendances.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <h3>📊 Tổng kết tháng</h3>
          <p><strong>Tổng số giờ làm:</strong> {summary.totalHours.toFixed(2)} giờ</p>
          <p><strong>Tổng số ca tối:</strong> {summary.nightShifts}</p>
          <p><strong>Tổng lương:</strong> {summary.totalSalary.toLocaleString()} VND</p>
        </div>
      )}
    </div>
  );
}

export default AttendanceManager;
