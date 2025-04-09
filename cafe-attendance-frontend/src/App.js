import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import PrivateRoute from './components/PrivateRoute';
import UserList from './pages/UserList';
import CreateUser from './pages/CreateUser';
import ShiftManager from './pages/ShiftManager';
import AttendanceManager from './pages/AttendanceManager';
import SalarySettings from './pages/SalarySettings';
import CheckInOut from './pages/CheckInOut';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <PrivateRoute>
              <UserList />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/users/create"
          element={
            <PrivateRoute>
              <CreateUser />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/shifts"
          element={
            <PrivateRoute>
              <ShiftManager />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/attendance"
          element={
            <PrivateRoute>
              <AttendanceManager />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/salary"
          element={
            <PrivateRoute>
              <SalarySettings />
            </PrivateRoute>
          }
        />



        <Route
          path="/employee-dashboard"
          element={
            <PrivateRoute>
              <EmployeeDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/employee/checkin"
          element={
            <PrivateRoute>
              <CheckInOut />
            </PrivateRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;
