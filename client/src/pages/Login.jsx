import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LogIn,
  Sparkles,
  AlertCircle,
  Lock,
  Mail,
  KeyRound,
  CheckCircle,
  X,
  GraduationCap,
  Users,
  Briefcase
} from 'lucide-react';
import { UNIVERSAL_DEPARTMENTS } from '../data/curriculumData';

const Login = () => {
  // 3 Distinct Login Modes: 'student', 'mentor', 'faculty'
  const [activePortal, setActivePortal] = useState('student');
  const [demoDept, setDemoDept] = useState('Computer Science');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot Password Modal State
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [demoOtpDisplay, setDemoOtpDisplay] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { login, oneClickLogin, requestOtp, resetPassword } = useAuth();
  const navigate = useNavigate();

  const DEPT_CREDS = {
    'Computer Science': { student: 'student24@campussphere.edu', mentor: 'senior23@campussphere.edu', faculty: 'lecturer@campussphere.edu' },
    'Biotechnology': { student: 'btstudent24@campussphere.edu', mentor: 'btsenior23@campussphere.edu', faculty: 'btfaculty@campussphere.edu' },
    'AI & Data Science': { student: 'aistudent24@campussphere.edu', mentor: 'aisenior23@campussphere.edu', faculty: 'aifaculty@campussphere.edu' },
    'Electronics & Comm': { student: 'ecestudent24@campussphere.edu', mentor: 'ecesenior23@campussphere.edu', faculty: 'ecefaculty@campussphere.edu' },
    'Mechanical': { student: 'mechstudent24@campussphere.edu', mentor: 'mechsenior23@campussphere.edu', faculty: 'mechfaculty@campussphere.edu' },
    'Civil': { student: 'civilstudent24@campussphere.edu', mentor: 'civilsenior23@campussphere.edu', faculty: 'civilfaculty@campussphere.edu' },
    'Electrical & Electronics': { student: 'eeestudent24@campussphere.edu', mentor: 'eeesenior23@campussphere.edu', faculty: 'eeefaculty@campussphere.edu' },
    'Information Tech': { student: 'itstudent24@campussphere.edu', mentor: 'itsenior23@campussphere.edu', faculty: 'itfaculty@campussphere.edu' },
    'Chemical Engineering': { student: 'chemstudent24@campussphere.edu', mentor: 'chemsenior23@campussphere.edu', faculty: 'chemfaculty@campussphere.edu' }
  };

  const getDemoRoleKey = (portal, dept) => {
    const map = {
      'Computer Science': { student: 'student3rd', mentor: 'senior', faculty: 'lecturer' },
      'Biotechnology': { student: 'btstudent', mentor: 'btsenior', faculty: 'btfaculty' },
      'AI & Data Science': { student: 'aistudent', mentor: 'aisenior', faculty: 'aifaculty' },
      'Electronics & Comm': { student: 'ecestudent', mentor: 'ecesenior', faculty: 'ecefaculty' },
      'Mechanical': { student: 'mechstudent', mentor: 'mechsenior', faculty: 'mechfaculty' },
      'Civil': { student: 'civilstudent', mentor: 'civilsenior', faculty: 'civilfaculty' },
      'Electrical & Electronics': { student: 'eeestudent', mentor: 'eeesenior', faculty: 'eeefaculty' },
      'Information Tech': { student: 'itstudent', mentor: 'itsenior', faculty: 'itfaculty' },
      'Chemical Engineering': { student: 'chemstudent', mentor: 'chemsenior', faculty: 'chemfaculty' }
    };
    return map[dept]?.[portal] || 'student3rd';
  };

  // Tab change handler
  const handleTabChange = (portal) => {
    setActivePortal(portal);
    setError('');
    const targetEmail = DEPT_CREDS[demoDept]?.[portal] || 'student24@campussphere.edu';
    setEmail(targetEmail);
    setPassword(portal === 'faculty' ? 'faculty123' : 'password123');
  };

  const handleDeptChange = (dept) => {
    setDemoDept(dept);
    const targetEmail = DEPT_CREDS[dept]?.[activePortal] || 'student24@campussphere.edu';
    setEmail(targetEmail);
    setPassword(activePortal === 'faculty' ? 'faculty123' : 'password123');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      // Optional check if role matches active tab
      if (activePortal === 'faculty' && user.role !== 'lecturer' && user.role !== 'admin') {
        setError('This account does not have Faculty credentials. Please switch to Student or Mentor login.');
        setLoading(false);
        return;
      }
      if (activePortal === 'mentor' && user.role !== 'mentor' && user.role !== 'admin') {
        setError('This account does not have Senior Mentor credentials. Please switch to Student login.');
        setLoading(false);
        return;
      }

      // Navigate directly to user's dedicated portal
      if (user.role === 'mentor') {
        navigate('/mentor-portal');
      } else if (user.role === 'lecturer' || user.role === 'admin') {
        navigate('/faculty-portal');
      } else {
        navigate('/student-portal');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please verify email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleInstantDemo = async (specificRole) => {
    setError('');
    setLoading(true);
    try {
      let roleToUse = specificRole;
      if (!roleToUse) {
        if (activePortal === 'faculty') roleToUse = 'lecturer';
        else if (activePortal === 'mentor') roleToUse = 'senior';
        else roleToUse = 'student3rd';
      }

      const user = await oneClickLogin(roleToUse);
      if (user.role === 'mentor') {
        navigate('/mentor-portal');
      } else if (user.role === 'lecturer' || user.role === 'admin') {
        navigate('/faculty-portal');
      } else {
        navigate('/student-portal');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Send OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');
    setForgotLoading(true);

    try {
      const data = await requestOtp(forgotEmail);
      setForgotSuccess(data.message);
      if (data.demoOtp) {
        setDemoOtpDisplay(data.demoOtp);
        setOtp(data.demoOtp);
      }
      setForgotStep(2);
    } catch (err) {
      setForgotError(err.response?.data?.message || 'Failed to generate OTP. Check email.');
    } finally {
      setForgotLoading(false);
    }
  };

  // Step 2: Verify OTP & Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');

    if (newPassword !== confirmPassword) {
      setForgotError('New passwords do not match');
      return;
    }

    setForgotLoading(true);

    try {
      const data = await resetPassword(forgotEmail, otp, newPassword);
      setForgotSuccess(data.message);
      setTimeout(() => {
        setIsForgotModalOpen(false);
        setForgotStep(1);
        setEmail(forgotEmail);
        setPassword(newPassword);
      }, 1500);
    } catch (err) {
      setForgotError(err.response?.data?.message || 'Failed to reset password. Verify OTP.');
    } finally {
      setForgotLoading(false);
    }
  };

  const portalConfig = {
    student: {
      title: 'Student Portal Login',
      badge: 'Undergraduate Students (1st, 2nd, 3rd Year)',
      color: 'var(--primary)',
      icon: <GraduationCap size={24} />,
      emailPlaceholder: 'e.g. 241fa04103@university.edu or student@...',
      demoName: '3rd Year Student (241FA04103)',
      roleNote: 'Access your cohort portal, view study notes, and book senior guidance.'
    },
    mentor: {
      title: 'Senior Mentor Login',
      badge: '4th Years & Alumni (231FA0... / 221FA0...)',
      color: '#9333ea',
      icon: <Users size={24} />,
      emailPlaceholder: 'e.g. 231fa04019@university.edu or mentor@...',
      demoName: '4th Year Senior (231FA04019)',
      roleNote: 'Share question papers/notes into junior portals and accept mentorship requests.'
    },
    faculty: {
      title: 'Faculty / Lecturer Login',
      badge: 'Professors & Department Lecturers',
      color: '#0284c7',
      icon: <Briefcase size={24} />,
      emailPlaceholder: 'e.g. professor.cse@university.edu',
      demoName: 'Dr. K. Srinivas Rao (Professor)',
      roleNote: 'Universal portal access. Upload and verify syllabus, question banks, and PPTs.'
    }
  };

  const current = portalConfig[activePortal];

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2.5rem 1rem'
    }}>
      <div className="card" style={{
        maxWidth: '520px',
        width: '100%',
        padding: '2.5rem',
        boxShadow: 'var(--shadow-lg)'
      }}>
        {/* 3 DISTINCT LOGIN TABS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '0.4rem',
          background: '#f1f5f9',
          padding: '0.35rem',
          borderRadius: '12px',
          marginBottom: '1.75rem'
        }}>
          <button
            type="button"
            onClick={() => handleTabChange('student')}
            style={{
              padding: '0.6rem 0.3rem',
              fontSize: '0.8rem',
              fontWeight: '700',
              borderRadius: '8px',
              border: 'none',
              background: activePortal === 'student' ? '#ffffff' : 'transparent',
              color: activePortal === 'student' ? 'var(--primary)' : 'var(--text-muted)',
              boxShadow: activePortal === 'student' ? 'var(--shadow-sm)' : 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.25rem',
              transition: 'all 0.2s ease'
            }}
          >
            <GraduationCap size={16} />
            <span>Student</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('mentor')}
            style={{
              padding: '0.6rem 0.3rem',
              fontSize: '0.8rem',
              fontWeight: '700',
              borderRadius: '8px',
              border: 'none',
              background: activePortal === 'mentor' ? '#ffffff' : 'transparent',
              color: activePortal === 'mentor' ? '#9333ea' : 'var(--text-muted)',
              boxShadow: activePortal === 'mentor' ? 'var(--shadow-sm)' : 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.25rem',
              transition: 'all 0.2s ease'
            }}
          >
            <Users size={16} />
            <span>Mentor (Senior)</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('faculty')}
            style={{
              padding: '0.6rem 0.3rem',
              fontSize: '0.8rem',
              fontWeight: '700',
              borderRadius: '8px',
              border: 'none',
              background: activePortal === 'faculty' ? '#ffffff' : 'transparent',
              color: activePortal === 'faculty' ? '#0284c7' : 'var(--text-muted)',
              boxShadow: activePortal === 'faculty' ? 'var(--shadow-sm)' : 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.25rem',
              transition: 'all 0.2s ease'
            }}
          >
            <Briefcase size={16} />
            <span>Faculty</span>
          </button>
        </div>

        {/* Selected Portal Heading */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            background: activePortal === 'faculty' ? '#e0f2fe' : activePortal === 'mentor' ? '#fdf4ff' : 'var(--primary-light)',
            color: current.color,
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '0.75rem'
          }}>
            {current.icon}
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800' }}>{current.title}</h2>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: '700',
            color: current.color,
            background: '#f8fafc',
            border: '1px solid var(--border)',
            padding: '0.2rem 0.6rem',
            borderRadius: '9999px',
            display: 'inline-block',
            marginTop: '0.25rem'
          }}>
            {current.badge}
          </span>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem', marginTop: '0.5rem' }}>
            {current.roleNote}
          </p>
        </div>

        {/* 1-Click Fast Login for this Portal across ALL departments */}
        <div style={{
          background: '#f8fafc',
          border: '1px dashed var(--border)',
          borderRadius: '10px',
          padding: '0.9rem',
          marginBottom: '1.25rem',
          textAlign: 'center'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)' }}>
              ⚡ 1-CLICK DEMO (CHOOSE ANY DEPARTMENT)
            </span>
            <select
              value={demoDept}
              onChange={(e) => handleDeptChange(e.target.value)}
              className="form-select"
              style={{
                width: 'auto',
                maxWidth: '220px',
                padding: '0.25rem 0.6rem',
                fontSize: '0.75rem',
                fontWeight: '700',
                color: current.color,
                background: '#ffffff'
              }}
            >
              {UNIVERSAL_DEPARTMENTS.map(dept => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => handleInstantDemo(getDemoRoleKey(activePortal, demoDept))}
            disabled={loading}
            className="btn btn-secondary"
            style={{ width: '100%', padding: '0.55rem', fontSize: '0.825rem', fontWeight: '700', color: current.color }}
          >
            <Sparkles size={14} style={{ marginRight: '0.3rem' }} />
            Log In as {demoDept} {activePortal === 'faculty' ? 'Professor' : activePortal === 'mentor' ? 'Senior Mentor' : 'Student'}
          </button>
        </div>

        {error && (
          <div style={{
            background: 'var(--danger-bg)',
            color: 'var(--danger)',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              {activePortal === 'faculty' ? 'Faculty Institutional Email' : activePortal === 'mentor' ? 'Senior Mentor Email' : 'Student University Email'}
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={current.emailPlaceholder}
                className="form-input"
                style={{ paddingLeft: '2.4rem' }}
              />
              <Mail size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
              <button
                type="button"
                onClick={() => {
                  setForgotEmail(email);
                  setForgotError('');
                  setForgotSuccess('');
                  setForgotStep(1);
                  setIsForgotModalOpen(true);
                }}
                style={{ fontSize: '0.8rem', color: current.color, fontWeight: '700' }}
              >
                Forgot Password?
              </button>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input"
                style={{ paddingLeft: '2.4rem' }}
              />
              <Lock size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem', background: current.color }}
          >
            {loading ? 'Authenticating...' : `Enter as ${activePortal.toUpperCase()}`}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '1.75rem' }}>
          Need a new account?{' '}
          <Link to="/register" style={{ color: current.color, fontWeight: '700' }}>
            Register student or faculty account
          </Link>
        </p>
      </div>

      {/* FORGOT PASSWORD & OTP MODAL */}
      {isForgotModalOpen && (
        <div className="modal-overlay" onClick={() => setIsForgotModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <KeyRound size={22} color="var(--primary)" />
                <h2 style={{ fontSize: '1.35rem', fontWeight: '800' }}>Password Recovery (OTP)</h2>
              </div>
              <button onClick={() => setIsForgotModalOpen(false)} style={{ color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            {forgotError && (
              <div style={{
                background: 'var(--danger-bg)',
                color: 'var(--danger)',
                padding: '0.65rem 0.85rem',
                borderRadius: '6px',
                fontSize: '0.825rem',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <AlertCircle size={16} />
                <span>{forgotError}</span>
              </div>
            )}

            {forgotSuccess && (
              <div style={{
                background: 'var(--success-bg)',
                color: 'var(--success)',
                padding: '0.65rem 0.85rem',
                borderRadius: '6px',
                fontSize: '0.825rem',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <CheckCircle size={16} />
                <span>{forgotSuccess}</span>
              </div>
            )}

            {/* STEP 1: Enter Email */}
            {forgotStep === 1 && (
              <form onSubmit={handleRequestOtp}>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                  Enter your registered Student, Mentor, or Faculty email. A 6-digit one-time password (OTP) will be generated for verification.
                </p>

                <div className="form-group">
                  <label className="form-label">Registered Email Address</label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="student@campussphere.edu"
                    className="form-input"
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                  <button type="button" onClick={() => setIsForgotModalOpen(false)} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" disabled={forgotLoading} className="btn btn-primary">
                    {forgotLoading ? 'Sending...' : 'Generate OTP'}
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: Enter OTP & New Password */}
            {forgotStep === 2 && (
              <form onSubmit={handleResetPassword}>
                {demoOtpDisplay && (
                  <div style={{
                    background: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    marginBottom: '1.25rem',
                    textAlign: 'center'
                  }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#1e40af', display: 'block' }}>
                      📬 GENERATED VERIFICATION OTP:
                    </span>
                    <span style={{ fontSize: '1.6rem', fontWeight: '800', letterSpacing: '4px', color: 'var(--primary)' }}>
                      {demoOtpDisplay}
                    </span>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Enter 6-Digit OTP</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="e.g. 482910"
                    className="form-input"
                    style={{ fontSize: '1.2rem', letterSpacing: '2px', textAlign: 'center', fontWeight: '700' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Set New Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="form-input"
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
                  <button type="button" onClick={() => setForgotStep(1)} style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    ← Back to Email
                  </button>
                  <button type="submit" disabled={forgotLoading} className="btn btn-primary">
                    {forgotLoading ? 'Updating Password...' : 'Verify & Set Password'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
