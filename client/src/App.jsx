import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Resources from './pages/Resources';
import Mentorship from './pages/Mentorship';
import Doubts from './pages/Doubts';
import Profile from './pages/Profile';
import YearPortals from './pages/YearPortals';
import StudentPortal from './pages/StudentPortal';
import MentorPortal from './pages/MentorPortal';
import FacultyPortal from './pages/FacultyPortal';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <main style={{ flexGrow: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/portals" element={<YearPortals />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/mentorship" element={<Mentorship />} />
              <Route path="/doubts" element={<Doubts />} />

              {/* 3 Dedicated Role Portals */}
              <Route
                path="/student-portal"
                element={
                  <ProtectedRoute>
                    <StudentPortal />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mentor-portal"
                element={
                  <ProtectedRoute>
                    <MentorPortal />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/faculty-portal"
                element={
                  <ProtectedRoute>
                    <FacultyPortal />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
