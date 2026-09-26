# 🎬 CinePass - Full-Stack Movie Ticket Booking Web Application

CinePass is a production-grade full-stack Movie Ticket Booking Web Application. It enables users to browse now showing and coming soon movies, select theatres and dates, pick seats on an interactive cinema screen layout, simulate checkout payments, and download digital PDF tickets with embedded QR codes. It also features a comprehensive SaaS-style Admin Dashboard with analytics graphs, movie management, showtime scheduling, and revenue reporting.

---

## 🚀 Tech Stack

### **Frontend**
- **Framework**: React.js 18 + Vite 6
- **Styling**: Tailwind CSS + Custom Obsidian/Crimson Glassmorphism UI
- **Icons**: Lucide React
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios
- **Analytics & Charts**: Chart.js + react-chartjs-2
- **PDF & QR Code**: jsPDF + qrcode.react
- **Animations**: Canvas Confetti

### **Backend**
- **Runtime**: Node.js + Express.js
- **Authentication**: JSON Web Tokens (JWT) + bcryptjs password hashing
- **File Uploads**: Multer
- **API Architecture**: RESTful API design with role-based access control (RBAC)

### **Database**
- **DBMS**: MySQL Relational Database
- **Schema**: Fully normalized with Foreign Keys, Cascades, and Indices (`schema.sql` & `seed.sql`)
- **Compatibility**: Integrated dual-mode database engine (MySQL connection with instant portable memory fallback for zero-setup execution out of the box).

---

## 🔑 Demo Login Credentials

For testing both user roles immediately:

### **1. Admin Account**
- **Email**: `admin@cinepass.com`
- **Password**: `admin123`
- **Permissions**: Full access to Admin Panel (`/admin/dashboard`), Movies, Theatres, Shows, Bookings, Users, & Reports.

### **2. Customer Account**
- **Email**: `user@cinepass.com`
- **Password**: `user123`
- **Permissions**: Ticket booking flow, seat selection, booking history, PDF downloads, and profile management.

---

## 🛠️ Installation & Setup Instructions

### **1. Prerequisites**
- Node.js (v18 or higher)
- NPM (v9 or higher)
- MySQL Server (Optional - App runs out of the box with zero setup!)

### **2. Backend Setup**
```bash
cd backend
npm install
npm start
```
*The backend server will launch on `http://localhost:5050`.*

### **3. Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```
*The React Vite app will launch on `http://localhost:3000`.*

---

## 🗄️ Database Setup (MySQL)

To manually initialize MySQL database:
1. Open MySQL Workbench or Command Line.
2. Run `database/schema.sql` to create tables and foreign key relationships:
   ```sql
   SOURCE database/schema.sql;
   ```
3. Run `database/seed.sql` to populate initial movies, theatres, screens, seats, and test users:
   ```sql
   SOURCE database/seed.sql;
   ```

---

## 🔌 API Documentation

### **Authentication**
- `POST /api/auth/register` - Register a new customer
- `POST /api/auth/login` - Authenticate user & issue JWT
- `GET /api/auth/profile` - Fetch current user profile
- `PUT /api/auth/profile` - Update profile information

### **Movies**
- `GET /api/movies` - List movies with search/genre/status filters
- `GET /api/movies/:id` - Get single movie details
- `POST /api/movies` - Create movie (Admin)
- `PUT /api/movies/:id` - Update movie (Admin)
- `DELETE /api/movies/:id` - Remove movie (Admin)

### **Theatres & Screens**
- `GET /api/theatres` - List all theatres & locations
- `GET /api/theatres/:id` - Get theatre details & screens
- `POST /api/theatres` - Create theatre (Admin)
- `PUT /api/theatres/:id` - Update theatre details (Admin)
- `DELETE /api/theatres/:id` - Remove theatre (Admin)

### **Shows & Seats**
- `GET /api/shows` - List showtimes filtered by movie/theatre/date
- `GET /api/shows/:id` - Get show detail
- `GET /api/shows/:id/seats` - Fetch seat matrix with real-time booking status
- `POST /api/shows` - Schedule new showtime (Admin)

### **Bookings & Payments**
- `POST /api/bookings` - Create new multi-seat reservation
- `GET /api/bookings/my` - Fetch logged-in user's booking history
- `GET /api/bookings/:id` - Fetch single booking with QR code details
- `PUT /api/bookings/:id/cancel` - Cancel booking & initiate refund
- `POST /api/payments` - Process checkout payment

### **Admin Analytics**
- `GET /api/admin/dashboard` - Get overall platform metrics & Chart.js data
- `GET /api/admin/users` - Master list of registered users
- `GET /api/admin/bookings` - Master list of customer bookings
- `GET /api/admin/revenue` - Box office revenue analytics by movie

---

## 📱 Features Summary
1. **Modern Premium Aesthetic**: Dark mode UI inspired by Netflix & BookMyShow with smooth micro-animations.
2. **Interactive Cinema Layout**: Curved screen banner, Row A-G seats matrix with Standard (₹150), Premium (₹200), and VIP (₹250) pricing tiers.
3. **Double-Booking Prevention**: Locked seats prevention with database transactions.
4. **Digital PDF & QR Ticket Generation**: Download official ticket PDFs featuring unique QR codes for venue entry.
5. **Role-Based Security**: Admin-only routes protected via JWT middleware and role checks.
6. **Chart.js Dashboard**: Visual metrics for monthly revenue and box office performance.
