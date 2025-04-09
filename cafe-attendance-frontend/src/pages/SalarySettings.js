import React, { useEffect, useState } from 'react';
import axios from 'axios';

function SalarySettings() {
  const [form, setForm] = useState({
    base_hourly_rate: '',
    night_shift_bonus: ''
  });

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/salary/get', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data) setForm(res.data);
    } catch (err) {
      console.error('Lỗi khi lấy thông tin lương:', err);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/salary/create', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('✅ Đã cập nhật lương thành công!');
    } catch (err) {
      console.error('Lỗi khi cập nhật lương:', err);
      alert('❌ Cập nhật thất bại.');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>💵 Cấu hình lương hệ thống</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 10 }}>
          <label>Lương cơ bản / giờ: </label>
          <input
            name="base_hourly_rate"
            type="number"
            value={form.base_hourly_rate}
            onChange={handleChange}
            required
          /> VND
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>Thưởng thêm cho ca tối: </label>
          <input
            name="night_shift_bonus"
            type="number"
            value={form.night_shift_bonus}
            onChange={handleChange}
            required
          /> VND
        </div>
        <button type="submit">💾 Cập nhật</button>
      </form>
    </div>
  );
}

export default SalarySettings;
