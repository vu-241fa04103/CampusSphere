import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, AlertCircle, GraduationCap, Users, Briefcase, BookOpen } from 'lucide-react';
import { DEPARTMENT_SPECIALIZATIONS, UNIVERSAL_DEPARTMENTS } from '../data/curriculumData';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    regNo: '',
    department: 'Computer Science and Engineering (CSE)',
    specialization: 'AI & Machine Learning (AI&ML)',
    year: '3rd Year',
    role: 'student', // 'student', 'mentor', 'lecturer'
    bio: '',
    skills: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  // Update default specialization when department changes
  useEffect(() => {
    const specializations = DEPARTMENT_SPECIALIZATIONS[formData.department] || [];
    if (specializations.length > 0 && !specializations.includes(formData.specialization)) {
      setFormData(prev => ({
        ...prev,
        specialization: specializations[0]
      }));
    }
  }, [formData.department]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleRoleSelect = (selectedRole) => {
    let defaultYear = '3rd Year';
    if (selectedRole === 'mentor') defaultYear = '4th Year';
    if (selectedRole === 'lecturer') defaultYear = 'Faculty';

    setFormData(prev => ({
      ...prev,
      role: selectedRole,
      year: defaultYear
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await register(formData);
      // Route to dedicated portal based on registered role
      if (formData.role === 'mentor') {
        navigate('/mentor-portal');
      } else if (formData.role === 'lecturer') {
        navigate('/faculty-portal');
      } else {
        navigate('/student-portal');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check your information.');
    } finally {
      setLoading(false);
    }
  };

  const currentSpecializations = DEPARTMENT_SPECIALIZATIONS[formData.department] || [
    'General Core Engineering',
    'Specialized Systems Track'
  ];

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2.5rem 1rem'
    }}>
      <div className="card" style={{
        maxWidth: '620px',
        width: '100%',
        padding: '2.5rem',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '0.75rem'
          }}>
            <UserPlus size={24} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Create Campus Account</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Set your Branch, Department, and Specialization to access personalized study plans & dedicated portals
          </p>
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
          {/* 3-Role selector */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '0.4rem',
            background: '#f1f5f9',
            padding: '0.35rem',
            borderRadius: '10px',
            marginBottom: '1.5rem'
          }}>
            <button
              type="button"
              onClick={() => handleRoleSelect('student')}
              style={{
                padding: '0.55rem',
                fontSize: '0.8rem',
                fontWeight: '700',
                borderRadius: '8px',
                border: 'none',
                background: formData.role === 'student' ? '#ffffff' : 'transparent',
                color: formData.role === 'student' ? 'var(--primary)' : 'var(--text-muted)',
                boxShadow: formData.role === 'student' ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.2rem',
                cursor: 'pointer'
              }}
            >
              <GraduationCap size={16} />
              <span>Student</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('mentor')}
              style={{
                padding: '0.55rem',
                fontSize: '0.8rem',
                fontWeight: '700',
                borderRadius: '8px',
                border: 'none',
                background: formData.role === 'mentor' ? '#ffffff' : 'transparent',
                color: formData.role === 'mentor' ? '#9333ea' : 'var(--text-muted)',
                boxShadow: formData.role === 'mentor' ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.2rem',
                cursor: 'pointer'
              }}
            >
              <Users size={16} />
              <span>Senior Mentor</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('lecturer')}
              style={{
                padding: '0.55rem',
                fontSize: '0.8rem',
                fontWeight: '700',
                borderRadius: '8px',
                border: 'none',
                background: formData.role === 'lecturer' ? '#ffffff' : 'transparent',
                color: formData.role === 'lecturer' ? '#0284c7' : 'var(--text-muted)',
                boxShadow: formData.role === 'lecturer' ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.2rem',
                cursor: 'pointer'
              }}
            >
              <Briefcase size={16} />
              <span>Faculty</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder={formData.role === 'lecturer' ? 'Dr. Priya Sharma' : 'Divya Reddy'}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                {formData.role === 'lecturer' ? 'Faculty ID' : 'University Reg. No.'}
              </label>
              <input
                type="text"
                name="regNo"
                required
                value={formData.regNo}
                onChange={handleChange}
                placeholder={formData.role === 'lecturer' ? 'FAC-BT-008' : 'e.g. 241FA08044'}
                className="form-input"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="name@campussphere.edu"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                className="form-input"
              />
            </div>
          </div>

          {/* Department and Year */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Branch / Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="form-select"
              >
                {UNIVERSAL_DEPARTMENTS.map(dept => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Year / Cohort</label>
              {formData.role === 'lecturer' ? (
                <input
                  type="text"
                  disabled
                  value="Faculty Staff"
                  className="form-input"
                  style={{ background: '#f8fafc', color: 'var(--text-muted)' }}
                />
              ) : (
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="1st Year">1st Year (261FA0)</option>
                  <option value="2nd Year">2nd Year (251FA0)</option>
                  <option value="3rd Year">3rd Year (241FA0)</option>
                  <option value="4th Year">4th Year (231FA0)</option>
                  <option value="Alumni">Alumni / Graduated</option>
                </select>
              )}
            </div>
          </div>

          {/* Department-Specific Specialization */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <BookOpen size={15} style={{ color: 'var(--primary)' }} />
              <span>Specialization Track (Personalized to {formData.department})</span>
            </label>
            <select
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              className="form-select"
              style={{ fontWeight: '600' }}
            >
              {currentSpecializations.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>
              Your syllabus modules, quizzes, and mentor materials will adapt to this chosen track.
            </span>
          </div>

          <div className="form-group">
            <label className="form-label">
              {formData.role === 'lecturer' ? 'Courses Taught & Research Interests' : 'Skills & Key Interests (Comma separated)'}
            </label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder={formData.role === 'lecturer' ? 'Genetic Engineering, Bioinformatics, Cell Culture' : 'PCR, DNA Extraction, Python'}
              className="form-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem', fontWeight: '700' }}
          >
            {loading ? 'Creating Account...' : `Register & Launch ${formData.role.toUpperCase()} Portal`}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '1.5rem' }}>
          Already registered?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '700' }}>
            Go to 3-Way Portal Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
