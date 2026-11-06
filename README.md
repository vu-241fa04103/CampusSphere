# 🎓 CampusSphere – Student Resource Sharing & Peer Mentorship Portal

> **MERN Stack Web Development Training Program – Final Project**  
> **Team Name**: CodeCraft (Change to your Team Name)  
> **Live Frontend**: [https://campussphere.vercel.app](https://campussphere.vercel.app)  
> **Live Backend API**: [https://campussphere-api.onrender.com](https://campussphere-api.onrender.com)  
> **GitHub Repository**: [https://github.com/your-username/campussphere](https://github.com/your-username/campussphere)

---

## 👥 Team Members & Contribution Matrix

| S.No | Member Name | University Registration No. | Core Responsibilities & Contributions |
| :---: | :--- | :---: | :--- |
| 1 | **Member 1 (Frontend Lead)** | `REG_NO_1` | React.js Single Page App architecture, UI/UX with Tailwind & Lucide icons, responsive state management, client routing, and Axios API consumption. |
| 2 | **Member 2 (Backend Lead)** | `REG_NO_2` | Node.js & Express.js REST API development, JWT stateless authentication, bcryptjs password encryption, custom middleware, and error handling. |
| 3 | **Member 3 (Database & DevOps Lead)** | `REG_NO_3` | MongoDB Atlas database schema modeling, Mongoose ODM relations & validations, cloud deployment on Vercel & Render, and documentation. |

*(Please replace `Member 1`, `REG_NO_1`, etc., with your actual team details before submission)*

---

## 📖 Project Description

In modern college environments, academic resources like handwritten notes, solved previous year papers, and laboratory manuals are scattered across chaotic chat groups where links expire and files get lost. Concurrently, junior students struggle to find accessible, verified senior mentors for resume critiques, coding interview strategies, and project guidance.

**CampusSphere** solves these issues by unifying campus academic life into a single, high-performance **MERN Stack** portal. It empowers students to:
1. Share and discover crowd-verified lecture notes and previous-year exam papers filtered by department and semester.
2. Book personalized 1-on-1 peer mentorship sessions with senior students and alumni.
3. Ask academic questions on a dedicated campus doubt clearance board with community upvotes and verified resolution badges.

---

## 🎯 Objectives

- **Centralized Academic Repository**: Eliminate fragmented file-sharing by providing structured, searchable storage for all course materials.
- **Bridge Senior-Junior Mentorship**: Facilitate scheduled 1-on-1 guidance sessions with automated status tracking.
- **Peer Doubt Resolution**: Encourage collaborative learning through a dedicated Q&A discussion board.
- **Robust Full-Stack Implementation**: Demonstrate end-to-end MERN architecture with production-level security, JWT authentication, and responsive design.
- **High Availability Cloud Deployment**: Deploy decoupled client and server architectures with MongoDB Atlas persistence.

---

## 🛠️ Technologies Used

### Frontend (Client)
- **React.js 18** – Dynamic component-based user interface.
- **Vite** – Ultra-fast development server and optimized production build tool.
- **React Router DOM v6** – Client-side routing with protected route guards.
- **Lucide React** – Clean, modern SVG icon library.
- **Axios** – HTTP client with automatic JWT token attachment via request interceptors.

### Backend (Server)
- **Node.js** – Asynchronous event-driven JavaScript runtime.
- **Express.js** – Robust RESTful API routing and middleware framework.
- **JSON Web Tokens (JWT)** – Stateless authentication and role-based authorization.
- **bcryptjs** – Salted password hashing for data security.
- **CORS** – Cross-Origin Resource Sharing configuration for secure communication.

### Database
- **MongoDB Atlas** – Cloud NoSQL document database.
- **Mongoose ODM** – Schema definitions, relationship population, and data validation.

### Deployment & Tooling
- **Vercel** – Frontend continuous deployment.
- **Render / Railway** – Backend cloud web service hosting.
- **Git & GitHub** – Collaborative version control.

---

## ✨ Features and Functionalities

### 1. 🔐 User Authentication & Role Management
- Secure user registration and login with encrypted passwords.
- Role-based capabilities (`Student` vs. `Mentor` vs. `Admin`).
- **One-Click Demo Login** buttons for immediate evaluator testing without manual form filling.
- JWT token expiration and protected route security.

### 2. 📚 Academic Resource Hub (Full CRUD)
- **Create**: Upload new study materials with Title, Subject, Department, Semester, Category, and Drive/PDF URL.
- **Read**: Live search and multi-criteria filtering (by Department, Semester, and Category).
- **Update**: Edit resource details and description (restricted to creator or admin).
- **Delete**: Remove outdated or duplicate materials.
- **Upvoting & Download Tracking**: Community-driven quality indicators.

### 3. 🤝 1-on-1 Peer Mentorship (Full CRUD)
- **Browse Mentors**: View verified senior profiles, skill tags, ratings, and availability windows.
- **Book Sessions**: Schedule a session by choosing topic, preferred date, and time slot.
- **Status Workflow**: Tracks session progression through `Pending` ➔ `Confirmed` (with Google Meet / Zoom link) ➔ `Completed`.
- **Feedback & Rating**: Students can review completed sessions with star ratings.

### 4. 💬 Campus Doubt Clearance Forum (Full CRUD)
- **Post Doubts**: Ask academic questions categorized by subject and tags.
- **Peer Answers**: Community members post detailed solutions and code snippets.
- **Mark as Resolved**: Question author can mark the doubt as resolved when satisfied.
- **Upvotes**: Community upvoting for helpful answers.

---

## 📁 Repository Folder Structure

```text
campussphere/
├── client/                     # React.js Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/         # Navbar, Footer, ProtectedRoute, Cards
│   │   ├── context/            # AuthContext (state & token management)
│   │   ├── pages/              # Home, Login, Register, Resources, Mentorship, Doubts, Profile
│   │   ├── services/           # Axios API configuration & endpoints
│   │   ├── App.jsx             # Routes & layout wrapper
│   │   ├── index.css           # Styling & utility design
│   │   └── main.jsx            # React root mount
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Node.js + Express Backend
│   ├── config/
│   │   └── db.js               # MongoDB connection logic
│   ├── controllers/            # Route logic (Auth, Resources, Mentorship, Doubts)
│   ├── middleware/             # JWT auth & error handling middleware
│   ├── models/                 # Mongoose schemas (User, Resource, Mentorship, Doubt)
│   ├── routes/                 # Express REST endpoints
│   ├── scripts/
│   │   └── seed.js             # Demo data population script
│   ├── .env.example            # Environment variables template
│   ├── server.js               # Express application entry point
│   └── package.json
│
├── presentation/
│   └── CampusSphere_Presentation_Content.md # Complete 10-slide PPT outline
├── .gitignore
└── README.md
```

---

## 🚀 Installation & Execution Steps

Follow these steps to run the complete MERN stack application locally:

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [Git](https://git-scm.com/)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account.

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-username/campussphere.git
cd campussphere
```

---

### Step 2: Backend Setup & Execution
1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Edit `.env` with your MongoDB URI:
     ```env
     PORT=5000
     NODE_ENV=development
     MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/campussphere?retryWrites=true&w=majority
     JWT_SECRET=your_secret_jwt_key_2026
     CLIENT_URL=http://localhost:5173
     ```
4. *(Optional but Recommended)* Seed initial demo data:
   ```bash
   npm run seed
   ```
5. Start the backend development server:
   ```bash
   npm run dev
   ```
   > Server will start on `http://localhost:5000`

---

### Step 3: Frontend Setup & Execution
1. In a new terminal window, navigate to the client folder:
   ```bash
   cd client
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to:
   ```text
   http://localhost:5173
   ```

---

### 🔑 Default Demo Credentials (Post-Seed)

| Role | Email | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| **Student** | `student@campussphere.edu` | `password123` | Upload resources, book mentorship, ask doubts |
| **Mentor** | `mentor@campussphere.edu` | `password123` | Accept bookings, add meeting links, answer questions |

---

## 🌐 Public Deployment Guide

### Database (MongoDB Atlas)
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Under **Network Access**, add IP address `0.0.0.0/0` (Allow access from anywhere).
3. Under **Database Access**, create a user with read/write privileges.
4. Copy the connection string into the server's environment variables.

### Backend Deployment (Render)
1. Link your GitHub repository on [Render](https://render.com).
2. Select **Web Service** with the root directory set to `server`.
3. Set Build Command: `npm install` and Start Command: `node server.js`.
4. Add environment variables: `MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`.

### Frontend Deployment (Vercel)
1. Import your GitHub repository on [Vercel](https://vercel.com).
2. Set root directory to `client`.
3. Framework preset: **Vite**.
4. Output directory: `dist`.
5. Set Environment Variable: `VITE_API_URL=https://your-render-backend.onrender.com/api`.

---

## 📄 License
This project is submitted as an educational capstone project under the MERN Stack Web Development Training Program.
