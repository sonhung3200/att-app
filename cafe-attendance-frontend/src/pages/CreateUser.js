import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreateUser() {
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    password: '',
    role: 'employee',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/auth/register', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess('Tạo tài khoản thành công!');
      setError('');
      setTimeout(() => navigate('/admin/users'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Đã xảy ra lỗi.');
      setSuccess('');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>➕ Tạo tài khoản nhân viên</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Họ tên: </label>
          <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} required />
        </div>
        <div>
          <label>Tên đăng nhập: </label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} required />
        </div>
        <div>
          <label>Mật khẩu: </label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <div>
          <label>Vai trò: </label>
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="employee">Nhân viên</option>
            <option value="admin">Quản trị</option>
          </select>
        </div>
        <button type="submit">Tạo tài khoản</button>
      </form>

      {success && <p style={{ color: 'green' }}>{success}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default CreateUser;
