import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function EmployeeDashboard() {
  const [summary, setSummary] = useState(null);
  const [records, setRecords] = useState([]);
  const [filters, setFilters] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });
  const navigate = useNavigate();

  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  const fetchData = useCallback(async () => {
    if (!user || !user.id) {
      console.error('Không tìm thấy user.id');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const { month, year } = filters;

      console.log('Gửi request với:', { userId: user.id, month, year });

      const res = await axios.get('http://localhost:5000/api/attendance/filter', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          userId: user.id,
          month,
          year
        },
      });

      const data = res.data;
      setRecords(data);

      const totalHours = data.reduce((sum, r) => sum + (r.worked_hours || 0), 0);
      const totalSalary = data.reduce((sum, r) => sum + (r.calculated_salary || 0), 0);
      const nightShifts = data.filter(r => r.shift_name === 'Ca đêm').length;

      setSummary({ totalHours, totalSalary, nightShifts });
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu nhân viên:', err.response?.data || err.message);
    }
  }, [filters, user]);

  useEffect(() => {
    if (!user || user.role !== 'employee') {
      navigate('/');
      return;
    }
    fetchData();
  }, [filters, fetchData, navigate, user]);

  const formatDate = (date) => new Date(date).toLocaleDateString();
  const formatTime = (date) => new Date(date).toLocaleTimeString();

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>👤 Dashboard Nhân viên</h1>

      <button onClick={() => navigate('/employee/checkin')}>🕘 Chấm công</button>

      <div style={{ marginTop: 20, marginBottom: 20 }}>
        <label>Tháng: </label>
        <input type="number" name="month" value={filters.month} onChange={handleChange} min={1} max={12} />
        <label style={{ marginLeft: 10 }}>Năm: </label>
        <input type="number" name="year" value={filters.year} onChange={handleChange} />
      </div>

      {summary && (
        <div style={{ marginBottom: 20 }}>
          <p><strong>Tổng số giờ làm:</strong> {summary.totalHours.toFixed(2)} giờ</p>
          <p><strong>Số ca đêm:</strong> {summary.nightShifts}</p>
          <p><strong>Tổng lương:</strong> {summary.totalSalary.toLocaleString()} VND</p>
        </div>
      )}

      <table border="1" cellPadding="10" style={{ width: '100%' }}>
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
          {records.map((rec, index) => (
            <tr key={index}>
              <td>{formatDate(rec.check_in_time)}</td>
              <td>{rec.shift_name || '-'}</td>
              <td>{formatTime(rec.check_in_time)}</td>
              <td>{rec.check_out_time ? formatTime(rec.check_out_time) : '-'}</td>
              <td>{rec.worked_hours?.toFixed(2)} giờ</td>
              <td>{rec.calculated_salary?.toLocaleString()} VND</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={handleLogout} style={{ marginTop: 20 }}>Đăng xuất</button>
    </div>
  );
}

export default EmployeeDashboard;
