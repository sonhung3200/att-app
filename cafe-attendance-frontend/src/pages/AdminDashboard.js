import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const today = new Date();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();

        const response = await axios.get(`http://localhost:5000/api/dashboard/admin?month=${month}&year=${year}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setData(response.data);
      } catch (error) {
        console.error('Lỗi khi tải dashboard admin:', error);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!data) return <p style={{ padding: 20 }}>Đang tải dữ liệu...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>📊 Dashboard Quản trị</h1>

      <button onClick={() => navigate('/admin/users')} style={{ marginBottom: 20 }}>
        👥 Danh sách nhân viên
      </button>

      <button onClick={() => navigate('/admin/shifts')}>⏰ Quản lý ca làm</button>

      <button onClick={() => navigate('/admin/attendance')}>📅 Quản lý chấm công</button>

      <button onClick={() => navigate('/admin/salary')}>💰 Cấu hình lương</button>


      <p><strong>Tổng số lần chấm công:</strong> {data.totalAttendance}</p>
      <p><strong>Tổng số giờ làm:</strong> {data.totalHours?.toFixed(2)} giờ</p>
      <p><strong>Tổng lương phải trả:</strong> {data.totalSalary.toLocaleString()} VND</p>
      <p><strong>Tổng số ca đêm:</strong> {data.totalNightShifts}</p>

      <h3>🔥 Top nhân viên:</h3>
      <ul>
        {data.topEmployees.map(emp => (
          <li key={emp.userId}>
            {emp.full_name} – {emp.total_hours.toFixed(2)} giờ – {emp.total_salary.toLocaleString()} VND – {emp.night_shifts} ca đêm
          </li>
        ))}
      </ul>

      <button onClick={handleLogout} style={{ marginTop: 20 }}>Đăng xuất</button>
    </div>
  );
}

export default AdminDashboard;
