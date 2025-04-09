import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ShiftManager() {
  const [shifts, setShifts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    start_time: '',
    end_time: '',
    is_night_shift: false
  });
  const [editingShiftId, setEditingShiftId] = useState(null);

  const fetchShifts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/shift/all', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setShifts(response.data.data || []); // Đảm bảo luôn là mảng
    } catch (err) {
      console.error('Lỗi khi lấy danh sách ca làm:', err);
    }
  };

  useEffect(() => {
    fetchShifts();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (editingShiftId) {
        await axios.put(`http://localhost:5000/api/shift/${editingShiftId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('✅ Cập nhật ca thành công!');
      } else {
        await axios.post('http://localhost:5000/api/shift/create', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('✅ Tạo ca làm thành công!');
      }
      setFormData({ name: '', start_time: '', end_time: '', is_night_shift: false });
      setEditingShiftId(null);
      fetchShifts();
    } catch (err) {
      console.error('Lỗi:', err);
      alert('❌ Thao tác thất bại.');
    }
  };

  const handleEdit = (shift) => {
    setEditingShiftId(shift._id);
    setFormData({
      name: shift.name,
      start_time: shift.start_time,
      end_time: shift.end_time,
      is_night_shift: shift.is_night_shift
    });
  };

  const handleCancelEdit = () => {
    setEditingShiftId(null);
    setFormData({ name: '', start_time: '', end_time: '',  is_night_shift: false });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xoá ca làm này?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/shift/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('🗑️ Xoá thành công!');
      fetchShifts();
    } catch (err) {
      console.error('Lỗi khi xoá ca làm:', err);
      alert('❌ Không thể xoá.');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>⏰ Quản lý ca làm</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <div>
          <label>Tên ca:</label>
          <input name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Giờ bắt đầu:</label>
          <input name="start_time" value={formData.start_time} onChange={handleChange} required placeholder="08:00" />
        </div>
        <div>
          <label>Giờ kết thúc:</label>
          <input name="end_time" value={formData.end_time} onChange={handleChange} required placeholder="14:00" />
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              name="is_night_shift"
              checked={formData.is_night_shift}
              onChange={handleChange}
            /> Ca tối
          </label>
        </div>
        <button type="submit">{editingShiftId ? '💾 Cập nhật ca' : '➕ Tạo ca làm'}</button>
        {editingShiftId && <button type="button" onClick={handleCancelEdit} style={{ marginLeft: 10 }}>Hủy</button>}
      </form>

      <h3>📋 Danh sách ca làm:</h3>
      <table border="1" cellPadding="10" style={{ width: '100%', marginTop: 10 }}>
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên ca</th>
            <th>Giờ bắt đầu</th>
            <th>Giờ kết thúc</th>
            <th>Ca tối</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {shifts.map((shift, index) => (
            <tr key={shift._id}>
              <td>{index + 1}</td>
              <td>{shift.name}</td>
              <td>{shift.start_time}</td>
              <td>{shift.end_time}</td>
              <td>{shift.is_night_shift ? '✅' : '❌'}</td>
              <td>
                <button onClick={() => handleEdit(shift)}>✏️ Sửa</button>{' '}
                <button onClick={() => handleDelete(shift._id)} style={{ marginLeft: 5 }}>🗑️ Xoá</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ShiftManager;
