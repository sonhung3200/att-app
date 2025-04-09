import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function UserList() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // Ưu tiên role admin hiển thị trước
      const sortedUsers = response.data.sort((a, b) => {
        if (a.role === 'admin' && b.role !== 'admin') return -1;
        if (a.role !== 'admin' && b.role === 'admin') return 1;
        return 0;
      });
  
      setUsers(sortedUsers);
    } catch (error) {
      console.error('Lỗi khi tải danh sách người dùng:', error);
    }
  };
  

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleCreateUser = () => {
    navigate('/admin/users/create');
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Bạn có chắc muốn xoá tài khoản này?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (error) {
      console.error('Lỗi khi xoá người dùng:', error);
      alert('Không thể xoá người dùng.');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>👥 Danh sách nhân viên</h1>

      <button onClick={handleCreateUser} style={{ marginBottom: 10 }}>➕ Tạo tài khoản</button>

      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>STT</th>
            <th>Họ tên</th>
            <th>Tên đăng nhập</th>
            <th>Vai trò</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user._id}>
              <td>{index + 1}</td>
              <td>{user.full_name}</td>
              <td>{user.username}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => handleDeleteUser(user._id)}>🗑️ Xoá</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={handleLogout} style={{ marginTop: 20 }}>Đăng xuất</button>
    </div>
  );
}

export default UserList;
