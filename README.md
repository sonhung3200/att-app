
# Attendance App

A simple attendance tracking system for a cafe, designed to manage part-time employees' check-in and check-out times, calculate total working hours, and compute salaries (with additional pay for night shifts).

## 📁 Project Structure

```
att-app/
├── cafe-attendance-frontend/   # Frontend built with ReactJS
├── cafe-attendance-backend/    # Backend built with Node.js + Express
└── README.md
```

---

## 🚀 Technologies Used

### Frontend:
- ReactJS
- React Router DOM
- Axios

### Backend:
- Node.js
- Express.js
- MongoDB (Mongoose)
- dotenv

---

## ⚙️ How to Run the Project Locally

### 1. Clone the repository

```bash
git clone https://github.com/sonhung3200/att-app.git
cd att-app
```

---

### 2. Set up the backend

```bash
cd cafe-attendance-backend
npm install
```

Create a `.env` file in this folder and add your environment variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Run the backend server:

```bash
npm run dev
```

---

### 3. Set up the frontend

Open a new terminal:

```bash
cd cafe-attendance-frontend
npm install
npm start
```

---

## ✅ Features

- Employee check-in / check-out
- Calculate working hours and salary (including night shift bonus)
- Admin dashboard for tracking all employee activity
- Separate dashboards for admin and employees
- Responsive web interface

---

## 🛡️ Environment Variables

Make sure you add appropriate `.env` files in both backend and frontend (if needed) and **never upload them to GitHub**.

---

## 📌 Notes

- Night shifts are paid with an extra 5000 VND/hour.
- You can change salary settings in the admin panel (or via environment variables or configs depending on your implementation).

---

## 📮 Contact

If you have any questions or issues, feel free to open an issue or contact [sonhung3200](https://github.com/sonhung3200).
