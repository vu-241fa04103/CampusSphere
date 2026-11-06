import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('campussphere_token') || null);
  const [loading, setLoading] = useState(true);

  // Check and load user on mount if token exists
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const savedToken = localStorage.getItem('campussphere_token');
      if (!savedToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/auth/me');
        if (res.data.success) {
          setUser(res.data.user);
        }
      } catch (err) {
        console.error('Failed to load user with stored token:', err);
        localStorage.removeItem('campussphere_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  // Login handler
  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      const { token: newToken, user: loggedUser } = res.data;
      localStorage.setItem('campussphere_token', newToken);
      setToken(newToken);
      setUser(loggedUser);
      return loggedUser;
    }
  };

  // Register handler
  const register = async (formData) => {
    const res = await api.post('/auth/register', formData);
    if (res.data.success) {
      const { token: newToken, user: registeredUser } = res.data;
      localStorage.setItem('campussphere_token', newToken);
      setToken(newToken);
      setUser(registeredUser);
      return registeredUser;
    }
  };

  // Instant 1-Click Demo Login for quick evaluations across student/faculty roles
  const oneClickLogin = async (role = 'student3rd') => {
    const credentials = {
      // CSE
      lecturer: { email: 'lecturer@campussphere.edu', password: 'faculty123' },
      senior: { email: 'senior23@campussphere.edu', password: 'password123' },
      student3rd: { email: 'student24@campussphere.edu', password: 'password123' },
      junior2nd: { email: 'junior25@campussphere.edu', password: 'password123' },
      // Biotechnology
      btfaculty: { email: 'btfaculty@campussphere.edu', password: 'faculty123' },
      btsenior: { email: 'btsenior23@campussphere.edu', password: 'password123' },
      btstudent: { email: 'btstudent24@campussphere.edu', password: 'password123' },
      // AI & Data Science
      aifaculty: { email: 'aifaculty@campussphere.edu', password: 'faculty123' },
      aisenior: { email: 'aisenior23@campussphere.edu', password: 'password123' },
      aistudent: { email: 'aistudent24@campussphere.edu', password: 'password123' },
      // Electronics & Comm (ECE)
      ecefaculty: { email: 'ecefaculty@campussphere.edu', password: 'faculty123' },
      ecesenior: { email: 'ecesenior23@campussphere.edu', password: 'password123' },
      ecestudent: { email: 'ecestudent24@campussphere.edu', password: 'password123' },
      // Mechanical
      mechfaculty: { email: 'mechfaculty@campussphere.edu', password: 'faculty123' },
      mechsenior: { email: 'mechsenior23@campussphere.edu', password: 'password123' },
      mechstudent: { email: 'mechstudent24@campussphere.edu', password: 'password123' },
      // Civil
      civilfaculty: { email: 'civilfaculty@campussphere.edu', password: 'faculty123' },
      civilsenior: { email: 'civilsenior23@campussphere.edu', password: 'password123' },
      civilstudent: { email: 'civilstudent24@campussphere.edu', password: 'password123' },
      // Electrical & Electronics (EEE)
      eeefaculty: { email: 'eeefaculty@campussphere.edu', password: 'faculty123' },
      eeesenior: { email: 'eeesenior23@campussphere.edu', password: 'password123' },
      eeestudent: { email: 'eeestudent24@campussphere.edu', password: 'password123' },
      // Information Tech (IT)
      itfaculty: { email: 'itfaculty@campussphere.edu', password: 'faculty123' },
      itsenior: { email: 'itsenior23@campussphere.edu', password: 'password123' },
      itstudent: { email: 'itstudent24@campussphere.edu', password: 'password123' },
      // Chemical Engineering
      chemfaculty: { email: 'chemfaculty@campussphere.edu', password: 'faculty123' },
      chemsenior: { email: 'chemsenior23@campussphere.edu', password: 'password123' },
      chemstudent: { email: 'chemstudent24@campussphere.edu', password: 'password123' }
    };

    const creds = credentials[role] || credentials.student3rd;
    return await login(creds.email, creds.password);
  };

  // Request 6-digit OTP for password recovery
  const requestOtp = async (email) => {
    const res = await api.post('/auth/forgot-password', { email });
    return res.data;
  };

  // Reset Password using verified OTP
  const resetPassword = async (email, otp, newPassword) => {
    const res = await api.post('/auth/reset-password', { email, otp, newPassword });
    return res.data;
  };

  // Year Hierarchy Access Verification
  // Target Years: 4 (231FA0), 3 (241FA0), 2 (251FA0), 1 (261FA0)
  const canAccessYear = (targetYearNum) => {
    if (!user) return false;
    if (user.role === 'lecturer' || user.role === 'admin') return true;

    // Extract student's batch prefix year (e.g. 241FA04103 -> 24)
    const match = user.regNo?.match(/^(\d{2})/);
    let studentBatch = match ? parseInt(match[1], 10) : 24;

    const targetBatchMap = { 4: 23, 3: 24, 2: 25, 1: 26 };
    const requiredBatch = targetBatchMap[targetYearNum] || 24;

    // Lower batch number means senior or alumni!
    // Senior (23) <= 24 (Target 3rd year) -> TRUE (Senior can access Junior 3rd year)
    // Junior (24) <= 23 (Target 4th year) -> FALSE (Junior CANNOT access Senior 4th year)
    return studentBatch <= requiredBatch;
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('campussphere_token');
    setToken(null);
    setUser(null);
  };

  // Update profile in state
  const updateUser = (updatedData) => {
    setUser(prev => ({ ...prev, ...updatedData }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        oneClickLogin,
        requestOtp,
        resetPassword,
        canAccessYear,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
