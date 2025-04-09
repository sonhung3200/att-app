import React, { useEffect, useState } from 'react';
import axios from 'axios';

function CheckInOut() {
  const [shifts, setShifts] = useState([]);
  const [selectedShift, setSelectedShift] = useState('');
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [message, setMessage] = useState('');

  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    fetchShifts();
  }, []);

  const fetchShifts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/shift/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShifts(res.data.data);
    } catch (err) {
      console.error('Lỗi khi lấy danh sách ca:', err);
    }
  };

  const isTimeWithinShift = (shift) => {
    const now = new Date();

    const [startHour, startMinute] = shift.start_time.split(':').map(Number);
    const [endHour, endMinute] = shift.end_time.split(':').map(Number);

    const start = new Date(now);
    start.setHours(startHour, startMinute, 0, 0);

    let end = new Date(now);
    end.setHours(endHour, endMinute, 0, 0);

    // Trường hợp ca đêm (qua ngày hôm sau)
    if (end <= start) {
      if (now < start) {
        // Nếu giờ hiện tại sau nửa đêm nhưng trước giờ bắt đầu, thì ca vẫn thuộc về ngày hôm trước
        start.setDate(start.getDate() - 1);
        end.setDate(end.getDate());
      } else {
        end.setDate(end.getDate() + 1);
      }
    }

    return now >= start && now <= end;
  };

  const handleCheckIn = async () => {
    if (!selectedShift) return alert('Vui lòng chọn ca làm');
    if (!user || !user.id) {
      return setMessage('❌ Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
    }

    const shift = shifts.find((s) => s._id === selectedShift);
    if (!isTimeWithinShift(shift)) {
      return setMessage(`❌ Giờ hiện tại không nằm trong thời gian của ca ${shift.name}.`);
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/attendance/checkin',
        {
          userId: user.id,
          shiftId: selectedShift
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setIsCheckedIn(true);
      setMessage('✅ Đã check-in thành công!');
    } catch (err) {
      console.error('Lỗi check-in:', err.response?.data || err.message);
      setMessage('❌ Check-in thất bại.');
    }
  };

  const handleCheckOut = async () => {
    if (!user || !user.id) {
      return setMessage('❌ Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/attendance/checkout',
        {
          userId: user.id
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setIsCheckedIn(false);
      setMessage('✅ Đã check-out thành công!');
    } catch (err) {
      console.error('Lỗi check-out:', err.response?.data || err.message);
      setMessage('❌ Check-out thất bại.');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🕘 Chấm công</h2>

      <div style={{ marginBottom: 10 }}>
        <label>Chọn ca làm:</label>
        <select value={selectedShift} onChange={(e) => setSelectedShift(e.target.value)}>
          <option value="">-- Chọn ca --</option>
          {shifts.map((shift) => (
            <option key={shift._id} value={shift._id}>
              {shift.name} ({shift.start_time} - {shift.end_time})
            </option>
          ))}
        </select>
      </div>

      <button onClick={handleCheckIn} disabled={isCheckedIn} style={{ marginRight: 10 }}>
        ✅ Check-in
      </button>
      <button onClick={handleCheckOut} disabled={!isCheckedIn}>⏹️ Check-out</button>

      {message && <p style={{ marginTop: 20 }}>{message}</p>}
    </div>
  );
}

export default CheckInOut;
