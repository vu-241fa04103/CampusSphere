# CampusSphere - Project Presentation Slide Deck (10 Slides)
> **MERN Stack Web Development Training Program**  
> **Course / Hackathon Final Evaluation**

---

## 📽️ SLIDE 1: Title & Team Details
- **Slide Title**: CampusSphere – Student Resource Sharing & Peer Mentorship Portal
- **Subtitle**: A Unified Full-Stack Academic Collaboration Platform
- **Team Name**: CodeCraft (or Your Team Name)
- **Team Members**:
  - **Member 1 (Name & Reg. No.)**: [Lead Developer / Frontend Architect (React.js, UI/UX)]
  - **Member 2 (Name & Reg. No.)**: [Backend & API Specialist (Node.js, Express, JWT Auth)]
  - **Member 3 (Name & Reg. No.)**: [Database & Cloud Engineer (MongoDB Atlas, Deployment)]
- **Date / Year**: Academic Year 2026

---

## 📽️ SLIDE 2: Introduction & Problem Statement
- **The Core Problem**:
  - Academic study materials (notes, question papers, lab manuals) are fragmented across unorganized WhatsApp/Telegram groups, leading to dead links and outdated content.
  - Juniors lack a structured, accessible channel to connect with verified senior mentors for interview prep, project guidance, and resume reviews.
  - Academic doubts asked in large group chats get buried without follow-up or verified resolutions.
- **Our Solution**:
  - **CampusSphere** bridges these gaps by providing an all-in-one centralized MERN platform with peer-reviewed resources, interactive mentor scheduling, and an academic Q&A forum.

---

## 📽️ SLIDE 3: Project Objectives
- Build a responsive, accessible single-page application using **React.js**.
- Develop a secure, RESTful backend with **Node.js** and **Express.js**.
- Model robust, relational schemas in **MongoDB Atlas** using **Mongoose ODM**.
- Implement role-based access control (**Student**, **Mentor**, and **Admin**) secured with **JSON Web Tokens (JWT)** and **bcryptjs**.
- Enable complete end-to-end **CRUD operations** across resources, bookings, and discussions.
- Deploy both client and server to cloud platforms (**Vercel** & **Render**) with 100% uptime.

---

## 📽️ SLIDE 4: Technologies & Tools Used (MERN Stack)
- **Frontend (Client)**:
  - React.js (Vite build tool)
  - React Router DOM v6 (Client-side routing)
  - Lucide React (Clean icon system)
  - Tailwind / Modern CSS Glassmorphic design
  - Axios (HTTP client with JWT auto-injection)
- **Backend (Server)**:
  - Node.js runtime environment
  - Express.js web framework
  - JSON Web Tokens (JWT) for stateless authentication
  - bcryptjs for salted password hashing
  - CORS middleware for cross-origin resource sharing
- **Database**:
  - MongoDB Atlas (Cloud NoSQL database)
  - Mongoose ODM (Object Data Modeling, validations, population)
- **DevOps & Tooling**:
  - Git & GitHub (Version control & collaboration)
  - Vercel (Frontend edge deployment)
  - Render / Railway (Backend web service deployment)

---

## 📽️ SLIDE 5: System Architecture & Workflow
- **Client-Server Architecture**:
  - **Presentation Layer**: React Single Page Application handles UI rendering, responsive state, and client-side route guards.
  - **Application / API Layer**: Express REST API intercepts requests, runs `authMiddleware` verification, and handles controllers.
  - **Data Layer**: MongoDB stores JSON-like BSON documents with strict schema enforcement via Mongoose.
- **Core Workflow Diagram**:
  1. User registers/logs in ➔ Receives signed JWT token.
  2. Student searches/filters resources ➔ Express queries MongoDB with regex & indexing.
  3. Student requests 1-on-1 mentorship ➔ Stored as `Pending` ➔ Mentor dashboard updates status to `Confirmed` with meeting link.
  4. Student asks doubt ➔ Peers/Mentors post answers ➔ Question author marks as `Resolved`.

---

## 📽️ SLIDE 6: Features & Functionalities
- **User Authentication & Role Management**:
  - Student vs. Mentor role registration, encrypted credentials, one-click demo login.
- **Resource Repository (Full CRUD)**:
  - Upload notes/question papers with department, semester, and tags.
  - Multi-attribute search and filtering.
  - Upvoting and download tracker.
- **1-on-1 Peer Mentorship (Full CRUD)**:
  - Mentor directory with skill badges and ratings.
  - Request booking with preferred date and time.
  - Status pipeline: `Pending` ➔ `Confirmed` (with Meet link) ➔ `Completed`.
  - Student star rating and feedback system.
- **Doubt Clearance Forum (Full CRUD)**:
  - Post academic questions with tags.
  - Community answers with upvotes and "Mark as Resolved" badge.

---

## 📽️ SLIDE 7: Database Design & API Endpoints
- **MongoDB Collections (Schemas)**:
  - `User`: `name`, `email`, `password`, `regNo`, `department`, `year`, `role`, `skills`, `bio`
  - `Resource`: `title`, `description`, `subject`, `department`, `semester`, `fileUrl`, `tags`, `uploadedBy`, `upvotes`
  - `Mentorship`: `mentor`, `student`, `topic`, `message`, `preferredDate`, `preferredTime`, `status`, `meetingLink`
  - `Doubt`: `title`, `description`, `subject`, `department`, `tags`, `askedBy`, `answers []`, `isResolved`
- **Primary REST API Endpoints**:
  - `POST /api/auth/register` & `POST /api/auth/login`
  - `GET /api/resources` | `POST /api/resources` | `PUT /api/resources/:id` | `DELETE /api/resources/:id`
  - `POST /api/mentorship/request` | `GET /api/mentorship/my-sessions` | `PATCH /api/mentorship/:id/status`
  - `GET /api/doubts` | `POST /api/doubts` | `POST /api/doubts/:id/answers` | `PATCH /api/doubts/:id/resolve`

---

## 📽️ SLIDE 8: Project Screenshots
*(Insert actual screenshots of the application after running it)*
- **Screenshot 1**: Landing Page & Quick Platform Statistics.
- **Screenshot 2**: Academic Resource Library with Department & Semester Filters.
- **Screenshot 3**: Mentorship Booking Hub & Session Management Pipeline.
- **Screenshot 4**: Doubt Clearance Discussion Board with Resolved Answer Thread.

---

## 📽️ SLIDE 9: Challenges Faced & Future Scope
- **Challenges Faced**:
  - Managing CORS policies and authorization header propagation across decoupled domains.
  - Implementing asynchronous Mongoose population across multi-user relations (Student-Mentor interactions).
  - Building responsive desktop & mobile layouts without layout shifts.
- **Future Scope**:
  - Built-in WebRTC video calling for in-app peer mentorship sessions.
  - AI-powered auto-tagging and summary generator for uploaded lecture notes.
  - Push notifications for booking confirmations and doubt responses.

---

## 📽️ SLIDE 10: Conclusion & Project Links
- **Summary**:
  - Successfully designed, implemented, and deployed a production-grade full-stack MERN application that fosters academic collaboration and peer mentorship across campus.
- **Live Deployment Links**:
  - **Frontend Application**: `https://campussphere.vercel.app` *(or your Vercel URL)*
  - **Backend API**: `https://campussphere-api.onrender.com` *(or your Render URL)*
  - **GitHub Repository**: `https://github.com/your-username/campussphere`
- **Thank You & Q&A**: We welcome questions and feedback from the evaluators!
