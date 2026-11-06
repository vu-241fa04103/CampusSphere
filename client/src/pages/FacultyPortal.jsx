import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Briefcase,
  Award,
  Bell,
  HelpCircle,
  FileText,
  Plus,
  Trash2,
  CheckCircle,
  Clock,
  Send,
  Pin,
  Check,
  X,
  Users
} from 'lucide-react';

const FacultyPortal = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('conduct-quizzes'); // 'conduct-quizzes', 'notices', 'solve-doubts', 'share-materials'

  // Data states
  const [quizzes, setQuizzes] = useState([]);
  const [notices, setNotices] = useState([]);
  const [doubts, setDoubts] = useState([]);
  const [facultyMaterials, setFacultyMaterials] = useState([]);

  // Quiz Creator Form State
  const [quizForm, setQuizForm] = useState({
    title: '',
    description: '',
    subject: '',
    department: user?.department || 'Computer Science',
    targetYear: '3rd Year',
    duration: 15,
    questions: [
      {
        question: '',
        options: ['', '', '', ''],
        correctIndex: 0,
        explanation: ''
      }
    ]
  });
  const [quizSubmitting, setQuizSubmitting] = useState(false);
  const [selectedQuizSubmissions, setSelectedQuizSubmissions] = useState(null);

  // Notice Form State
  const [noticeForm, setNoticeForm] = useState({
    title: '',
    content: '',
    type: 'Exam Notification',
    department: user?.department || 'All',
    targetYear: 'All',
    isPinned: true
  });
  const [noticeSubmitting, setNoticeSubmitting] = useState(false);

  // Doubt Solving State
  const [solvingDoubtId, setSolvingDoubtId] = useState(null);
  const [solutionText, setSolutionText] = useState('');
  const [solutionSubmitting, setSolutionSubmitting] = useState(false);

  // Share Material State
  const [materialForm, setMaterialForm] = useState({
    title: '',
    subject: '',
    department: user?.department || 'Computer Science',
    semester: 5,
    targetYear: 3,
    resourceType: 'Lab Manual',
    fileUrl: '',
    description: ''
  });
  const [materialSubmitting, setMaterialSubmitting] = useState(false);

  const facultyDept = user?.department || 'Computer Science';

  useEffect(() => {
    fetchQuizzes();
    fetchNotices();
    fetchFacultyDoubts();
    fetchFacultyMaterials();
  }, [facultyDept]);

  const fetchQuizzes = async () => {
    try {
      const res = await api.get('/quizzes');
      setQuizzes(res.data.quizzes || []);
    } catch (err) {
      console.error('Failed to load quizzes', err);
    }
  };

  const fetchNotices = async () => {
    try {
      const res = await api.get('/notices');
      setNotices(res.data.notices || []);
    } catch (err) {
      console.error('Failed to load notices', err);
    }
  };

  const fetchFacultyDoubts = async () => {
    try {
      const res = await api.get('/doubts/faculty-inbox');
      setDoubts(res.data.doubts || []);
    } catch (err) {
      console.error('Failed to load faculty doubts', err);
    }
  };

  const fetchFacultyMaterials = async () => {
    try {
      const res = await api.get(`/resources?department=${encodeURIComponent(facultyDept)}`);
      setFacultyMaterials(res.data.resources || []);
    } catch (err) {
      console.error('Failed to load materials', err);
    }
  };

  // Add Question to Quiz
  const handleAddQuestion = () => {
    setQuizForm(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        { question: '', options: ['', '', '', ''], correctIndex: 0, explanation: '' }
      ]
    }));
  };

  // Remove Question
  const handleRemoveQuestion = (idx) => {
    if (quizForm.questions.length <= 1) return;
    setQuizForm(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== idx)
    }));
  };

  // Update Question Field
  const handleQuestionChange = (qIdx, field, value) => {
    setQuizForm(prev => {
      const updated = [...prev.questions];
      updated[qIdx][field] = value;
      return { ...prev, questions: updated };
    });
  };

  // Update Question Option
  const handleOptionChange = (qIdx, optIdx, value) => {
    setQuizForm(prev => {
      const updated = [...prev.questions];
      const opts = [...updated[qIdx].options];
      opts[optIdx] = value;
      updated[qIdx].options = opts;
      return { ...prev, questions: updated };
    });
  };

  // Create Quiz Submit
  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    setQuizSubmitting(true);
    try {
      await api.post('/quizzes', quizForm);
      alert('Quiz created and launched for students!');
      setQuizForm({
        title: '',
        description: '',
        subject: '',
        department: facultyDept,
        targetYear: '3rd Year',
        duration: 15,
        questions: [{ question: '', options: ['', '', '', ''], correctIndex: 0, explanation: '' }]
      });
      fetchQuizzes();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create quiz');
    } finally {
      setQuizSubmitting(false);
    }
  };

  // View Submissions
  const handleViewSubmissions = async (quizId) => {
    try {
      const res = await api.get(`/quizzes/${quizId}/submissions`);
      setSelectedQuizSubmissions(res.data);
    } catch (err) {
      alert('Failed to load student submissions');
    }
  };

  // Send Notice Submit
  const handleCreateNotice = async (e) => {
    e.preventDefault();
    setNoticeSubmitting(true);
    try {
      await api.post('/notices', noticeForm);
      alert('Notice broadcasted to students successfully!');
      setNoticeForm({
        title: '',
        content: '',
        type: 'Exam Notification',
        department: facultyDept,
        targetYear: 'All',
        isPinned: true
      });
      fetchNotices();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to broadcast notice');
    } finally {
      setNoticeSubmitting(false);
    }
  };

  // Pin Toggle
  const handleTogglePin = async (noticeId) => {
    try {
      await api.patch(`/notices/${noticeId}/pin`);
      fetchNotices();
    } catch (err) {
      alert('Failed to toggle pin');
    }
  };

  // Delete Notice
  const handleDeleteNotice = async (noticeId) => {
    if (!window.confirm('Delete this notice?')) return;
    try {
      await api.delete(`/notices/${noticeId}`);
      fetchNotices();
    } catch (err) {
      alert('Failed to delete notice');
    }
  };

  // Solve Student Doubt
  const handleSolveDoubt = async (doubtId) => {
    if (!solutionText.trim()) return;
    setSolutionSubmitting(true);
    try {
      await api.post(`/doubts/${doubtId}/answers`, { text: solutionText.trim() });
      setSolutionText('');
      setSolvingDoubtId(null);
      fetchFacultyDoubts();
      alert('Official faculty solution sent back to student!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit solution');
    } finally {
      setSolutionSubmitting(false);
    }
  };

  // Upload Faculty Verified Material
  const handleMaterialUpload = async (e) => {
    e.preventDefault();
    setMaterialSubmitting(true);
    try {
      await api.post('/resources', {
        ...materialForm,
        department: facultyDept,
        semester: Number(materialForm.semester),
        targetYear: Number(materialForm.targetYear)
      });
      alert('Faculty-verified academic material published!');
      fetchFacultyMaterials();
      setMaterialForm({
        title: '',
        subject: '',
        department: facultyDept,
        semester: 5,
        targetYear: 3,
        resourceType: 'Lab Manual',
        fileUrl: '',
        description: ''
      });
    } catch (err) {
      alert(err.response?.data?.message || 'Upload failed');
    } finally {
      setMaterialSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      {/* Faculty Header Card */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, #0c4a6e 0%, #082f49 100%)',
        color: '#ffffff',
        padding: '2rem',
        marginBottom: '2rem',
        borderRadius: '16px',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span style={{
                background: 'rgba(56, 189, 248, 0.25)',
                color: '#7dd3fc',
                padding: '0.3rem 0.8rem',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: '800',
                border: '1px solid rgba(125, 211, 252, 0.3)'
              }}>
                🏛️ FACULTY PROFESSOR PORTAL
              </span>
              <span style={{
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#34d399',
                padding: '0.3rem 0.8rem',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: '600'
              }}>
                ID: {user?.regNo || 'FAC-CSE-012'}
              </span>
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: '800', marginBottom: '0.4rem' }}>
              {user?.name || 'Faculty Member'}
            </h1>
            <p style={{ color: '#bae6fd', fontSize: '0.95rem' }}>
              Department: <strong style={{ color: '#ffffff' }}>{facultyDept}</strong> &bull; Specialization:{' '}
              <strong style={{ color: '#f0fdf4' }}>{user?.specialization || 'Academic Excellence'}</strong>
            </p>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '1rem 1.5rem',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            textAlign: 'center'
          }}>
            <span style={{ fontSize: '0.75rem', color: '#bae6fd', textTransform: 'uppercase', fontWeight: '700' }}>
              Faculty Privileges
            </span>
            <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#ffffff', marginTop: '0.2rem' }}>
              Quizzes &bull; Exam Notices &bull; Solutions
            </div>
            <span style={{ fontSize: '0.75rem', color: '#a7f3d0' }}>
              ✓ Verified Authority
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '0.5rem',
        marginBottom: '2rem',
        overflowX: 'auto'
      }}>
        {[
          { id: 'conduct-quizzes', label: '📝 Conduct & Manage Quizzes', count: quizzes.length },
          { id: 'notices', label: '📢 Send Exam Notifications & Notices', count: notices.length },
          { id: 'solve-doubts', label: '💬 Faculty Doubts Inbox (Direct)', count: doubts.length },
          { id: 'share-materials', label: '📚 Share Verified Academic Data' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setSelectedQuizSubmissions(null); }}
            style={{
              padding: '0.75rem 1.25rem',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === tab.id ? '#0284c7' : 'transparent',
              color: activeTab === tab.id ? '#ffffff' : 'var(--text-muted)',
              fontWeight: '700',
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s'
            }}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span style={{
                background: activeTab === tab.id ? 'rgba(255,255,255,0.25)' : 'var(--bg-muted)',
                color: activeTab === tab.id ? '#ffffff' : 'var(--text-muted)',
                padding: '0.15rem 0.5rem',
                borderRadius: '12px',
                fontSize: '0.75rem'
              }}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB 1: CONDUCT QUIZZES */}
      {activeTab === 'conduct-quizzes' && (
        <div>
          {/* Submissions Modal / Drawer if selected */}
          {selectedQuizSubmissions && (
            <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem', border: '2px solid #0284c7', borderRadius: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>
                  Student Submissions & Scores: {selectedQuizSubmissions.quiz}
                </h3>
                <button
                  onClick={() => setSelectedQuizSubmissions(null)}
                  className="btn btn-outline"
                  style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}
                >
                  Close
                </button>
              </div>

              {selectedQuizSubmissions.submissions?.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No student submissions yet.</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                        <th style={{ padding: '0.75rem' }}>Student Name</th>
                        <th style={{ padding: '0.75rem' }}>Reg No</th>
                        <th style={{ padding: '0.75rem' }}>Score</th>
                        <th style={{ padding: '0.75rem' }}>Percentage</th>
                        <th style={{ padding: '0.75rem' }}>Submitted At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedQuizSubmissions.submissions.map((sub, sIdx) => (
                        <tr key={sIdx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '0.75rem', fontWeight: '600' }}>{sub.studentName || sub.student?.name}</td>
                          <td style={{ padding: '0.75rem' }}>{sub.student?.regNo || 'N/A'}</td>
                          <td style={{ padding: '0.75rem', fontWeight: '700', color: '#0284c7' }}>{sub.score} / {sub.totalQuestions}</td>
                          <td style={{ padding: '0.75rem' }}>{sub.percentage}%</td>
                          <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>{new Date(sub.submittedAt).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Active Quizzes List */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1rem' }}>
              Active Quizzes Published
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {quizzes.map(q => (
                <div key={q._id} className="card" style={{ padding: '1.25rem', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#0284c7', background: '#e0f2fe', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                      {q.subject}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Target: {q.targetYear}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '0.4rem' }}>{q.title}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{q.description}</p>
                  <button
                    onClick={() => handleViewSubmissions(q._id)}
                    className="btn btn-outline"
                    style={{ width: '100%', fontSize: '0.85rem', padding: '0.5rem' }}
                  >
                    View Student Submissions & Scores
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quiz Creator Form */}
          <div className="card" style={{ padding: '2rem', borderRadius: '16px', maxWidth: '850px', margin: '0 auto' }}>
            <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: '800' }}>Create & Conduct New Quiz</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Conduct automated multiple choice quizzes with auto-scoring and explanations for your students
              </p>
            </div>

            <form onSubmit={handleCreateQuiz}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Quiz Title</label>
                  <input
                    type="text"
                    required
                    value={quizForm.title}
                    onChange={(e) => setQuizForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Genetic Engineering & rDNA Vectors Quiz"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input
                    type="text"
                    required
                    value={quizForm.subject}
                    onChange={(e) => setQuizForm(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder={facultyDept === 'Biotechnology' ? 'Genetic Engineering' : 'Operating Systems'}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <select
                    value={quizForm.department}
                    onChange={(e) => setQuizForm(prev => ({ ...prev, department: e.target.value }))}
                    className="form-select"
                  >
                    <option value={facultyDept}>{facultyDept}</option>
                    <option value="All">All Departments</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Target Year</label>
                  <select
                    value={quizForm.targetYear}
                    onChange={(e) => setQuizForm(prev => ({ ...prev, targetYear: e.target.value }))}
                    className="form-select"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="All">All Years</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Duration (Minutes)</label>
                  <input
                    type="number"
                    min={5}
                    max={60}
                    value={quizForm.duration}
                    onChange={(e) => setQuizForm(prev => ({ ...prev, duration: Number(e.target.value) }))}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Questions Section */}
              <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: '800' }}>
                    Quiz Questions ({quizForm.questions.length})
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="btn btn-outline"
                    style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                  >
                    <Plus size={14} /> Add Another Question
                  </button>
                </div>

                {quizForm.questions.map((q, qIdx) => (
                  <div
                    key={qIdx}
                    style={{
                      background: '#f8fafc',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '1.25rem',
                      marginBottom: '1.25rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <span style={{ fontWeight: '800', color: '#0284c7', fontSize: '0.9rem' }}>
                        Question {qIdx + 1}
                      </span>
                      {quizForm.questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(qIdx)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Question Text</label>
                      <input
                        type="text"
                        required
                        value={q.question}
                        onChange={(e) => handleQuestionChange(qIdx, 'question', e.target.value)}
                        placeholder="e.g. Which enzyme catalyzes phosphodiester bonds?"
                        className="form-input"
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      {q.options.map((opt, optIdx) => (
                        <div key={optIdx}>
                          <label className="form-label" style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <input
                              type="radio"
                              name={`correct-${qIdx}`}
                              checked={q.correctIndex === optIdx}
                              onChange={() => handleQuestionChange(qIdx, 'correctIndex', optIdx)}
                            />
                            <span>Option {optIdx + 1} {q.correctIndex === optIdx && '✓ (Correct)'}</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={opt}
                            onChange={(e) => handleOptionChange(qIdx, optIdx, e.target.value)}
                            placeholder={`Option ${optIdx + 1}`}
                            className="form-input"
                            style={{
                              borderColor: q.correctIndex === optIdx ? '#22c55e' : 'var(--border-color)',
                              background: q.correctIndex === optIdx ? '#f0fdf4' : '#ffffff'
                            }}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="form-group" style={{ marginBottom: '0' }}>
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Solution Explanation</label>
                      <input
                        type="text"
                        value={q.explanation}
                        onChange={(e) => handleQuestionChange(qIdx, 'explanation', e.target.value)}
                        placeholder="Explain why this option is correct for student review..."
                        className="form-input"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={quizSubmitting}
                className="btn"
                style={{
                  width: '100%',
                  background: '#0284c7',
                  color: '#ffffff',
                  fontWeight: '700',
                  padding: '0.85rem',
                  borderRadius: '10px'
                }}
              >
                {quizSubmitting ? 'Publishing Quiz...' : 'Launch Quiz for Department Students'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: BROADCAST NOTICES */}
      {activeTab === 'notices' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
          {/* Notice Form */}
          <div className="card" style={{ padding: '2rem', borderRadius: '16px' }}>
            <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: '800' }}>Broadcast Official Notice</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Send Exam notifications, lab timetables, or academic circulars
              </p>
            </div>

            <form onSubmit={handleCreateNotice}>
              <div className="form-group">
                <label className="form-label">Notice Type</label>
                <select
                  value={noticeForm.type}
                  onChange={(e) => setNoticeForm(prev => ({ ...prev, type: e.target.value }))}
                  className="form-select"
                >
                  <option value="Exam Notification">Exam Notification (Mid-Terms, End-Sems)</option>
                  <option value="Lab Timetable">Lab External Practical Timetable</option>
                  <option value="Academic Notice">Academic Notice / Syllabus Circular</option>
                  <option value="General">General Campus Announcement</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Notice Title</label>
                <input
                  type="text"
                  required
                  value={noticeForm.title}
                  onChange={(e) => setNoticeForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. End Semester Practical Viva Schedule - Dec 2026"
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Target Department</label>
                  <select
                    value={noticeForm.department}
                    onChange={(e) => setNoticeForm(prev => ({ ...prev, department: e.target.value }))}
                    className="form-select"
                  >
                    <option value={facultyDept}>{facultyDept}</option>
                    <option value="All">All Departments</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Target Cohort</label>
                  <select
                    value={noticeForm.targetYear}
                    onChange={(e) => setNoticeForm(prev => ({ ...prev, targetYear: e.target.value }))}
                    className="form-select"
                  >
                    <option value="All">All Years</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Notice Content & Details</label>
                <textarea
                  rows={4}
                  required
                  value={noticeForm.content}
                  onChange={(e) => setNoticeForm(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Provide date, timing, venue, mandatory requirements for students..."
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600' }}>
                  <input
                    type="checkbox"
                    checked={noticeForm.isPinned}
                    onChange={(e) => setNoticeForm(prev => ({ ...prev, isPinned: e.target.checked }))}
                  />
                  <span>Pin as High-Priority Notice (Appears at top with red badge)</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={noticeSubmitting}
                className="btn"
                style={{
                  width: '100%',
                  background: '#0284c7',
                  color: '#ffffff',
                  fontWeight: '700',
                  padding: '0.85rem',
                  borderRadius: '10px'
                }}
              >
                {noticeSubmitting ? 'Broadcasting...' : 'Broadcast Notice to Students'}
              </button>
            </form>
          </div>

          {/* Active Notices List */}
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1rem' }}>
              Notices Published ({notices.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {notices.map(n => (
                <div key={n._id} className="card" style={{ padding: '1.25rem', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', padding: '0.2rem 0.5rem', borderRadius: '4px', background: '#e0f2fe', color: '#0369a1' }}>
                        {n.type}
                      </span>
                      {n.isPinned && (
                        <span style={{ fontSize: '0.7rem', color: '#ef4444', fontWeight: '800' }}>
                          📌 PINNED
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        onClick={() => handleTogglePin(n._id)}
                        title="Toggle Pin"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: n.isPinned ? '#ef4444' : 'var(--text-muted)' }}
                      >
                        <Pin size={15} />
                      </button>
                      <button
                        onClick={() => handleDeleteNotice(n._id)}
                        title="Delete Notice"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.3rem' }}>{n.title}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{n.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SOLVE DOUBTS (DIRECTED TO FACULTY) */}
      {activeTab === 'solve-doubts' && (
        <div>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '800' }}>
              Faculty Doubts Inbox ({doubts.length})
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Questions routed directly to you or your department faculty by students seeking official clarification
            </p>
          </div>

          {doubts.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem', borderRadius: '14px' }}>
              <CheckCircle size={48} style={{ color: '#10b981', margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>No Pending Doubts</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                All student doubts directed to faculty have been answered.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {doubts.map(d => (
                <div
                  key={d._id}
                  className="card"
                  style={{
                    padding: '1.5rem',
                    borderRadius: '12px',
                    borderLeft: d.isResolved ? '5px solid #10b981' : '5px solid #0284c7'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', padding: '0.2rem 0.5rem', borderRadius: '6px', background: '#e0f2fe', color: '#0369a1' }}>
                        Student: {d.askedBy?.name || d.authorName} ({d.askedBy?.regNo || 'Student'})
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Subject: <strong>{d.subject}</strong>
                      </span>
                    </div>

                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '6px',
                      background: d.isResolved ? '#dcfce7' : '#fef3c7',
                      color: d.isResolved ? '#15803d' : '#b45309'
                    }}>
                      {d.isResolved ? '✓ Resolved' : '⏳ Awaiting Faculty Resolution'}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '0.4rem' }}>
                    {d.title}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                    {d.description}
                  </p>

                  {/* Previous responses */}
                  {d.answers?.length > 0 && (
                    <div style={{
                      background: '#f8fafc',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      padding: '0.75rem 1rem',
                      marginBottom: '1rem'
                    }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                        Existing Faculty Solutions:
                      </span>
                      {d.answers.map((ans, idx) => (
                        <div key={idx} style={{ fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                          <strong>{ans.responderName} ({ans.responderRole}):</strong> {ans.text}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Solution form */}
                  {solvingDoubtId === d._id ? (
                    <div style={{ marginTop: '0.75rem' }}>
                      <textarea
                        rows={3}
                        value={solutionText}
                        onChange={(e) => setSolutionText(e.target.value)}
                        placeholder="Provide professor explanation, textbook citations, or technical clarifications..."
                        className="form-input"
                        style={{ marginBottom: '0.5rem' }}
                      />
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleSolveDoubt(d._id)}
                          disabled={solutionSubmitting}
                          className="btn"
                          style={{
                            background: '#0284c7',
                            color: '#ffffff',
                            fontWeight: '700',
                            padding: '0.5rem 1rem',
                            borderRadius: '8px'
                          }}
                        >
                          {solutionSubmitting ? 'Sending Solution...' : 'Post Official Faculty Solution'}
                        </button>
                        <button
                          onClick={() => { setSolvingDoubtId(null); setSolutionText(''); }}
                          className="btn btn-outline"
                          style={{ padding: '0.5rem 1rem', borderRadius: '8px' }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setSolvingDoubtId(d._id); setSolutionText(''); }}
                      className="btn"
                      style={{
                        background: '#0284c7',
                        color: '#ffffff',
                        fontWeight: '700',
                        padding: '0.45rem 1rem',
                        fontSize: '0.85rem',
                        borderRadius: '8px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                      }}
                    >
                      <Send size={14} />
                      <span>Write Official Solution</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: SHARE VERIFIED ACADEMIC DATA */}
      {activeTab === 'share-materials' && (
        <div className="card" style={{ maxWidth: '750px', margin: '0 auto', padding: '2rem', borderRadius: '16px' }}>
          <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: '800' }}>Publish Faculty-Verified Study Material</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Materials uploaded by faculty receive a verified checkmark and are highlighted for all students in {facultyDept}
            </p>
          </div>

          <form onSubmit={handleMaterialUpload}>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                type="text"
                required
                value={materialForm.title}
                onChange={(e) => setMaterialForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. Official Course Syllabus & Model Question Papers"
                className="form-input"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Subject</label>
                <input
                  type="text"
                  required
                  value={materialForm.subject}
                  onChange={(e) => setMaterialForm(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder={facultyDept === 'Biotechnology' ? 'Recombinant DNA Tech' : 'Operating Systems'}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Material Type</label>
                <select
                  value={materialForm.resourceType}
                  onChange={(e) => setMaterialForm(prev => ({ ...prev, resourceType: e.target.value }))}
                  className="form-select"
                >
                  <option value="Lecture Notes">Faculty Lecture Notes</option>
                  <option value="Question Paper">Official Model Question Paper</option>
                  <option value="Lab Manual">Lab Practical Manual</option>
                  <option value="Important PDF">Reference Guidelines (PDF)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Target Year</label>
                <select
                  value={materialForm.targetYear}
                  onChange={(e) => setMaterialForm(prev => ({ ...prev, targetYear: Number(e.target.value), semester: Number(e.target.value) * 2 - 1 }))}
                  className="form-select"
                >
                  <option value={1}>1st Year</option>
                  <option value={2}>2nd Year</option>
                  <option value={3}>3rd Year</option>
                  <option value={4}>4th Year</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">File URL / Cloud Drive</label>
                <input
                  type="url"
                  required
                  value={materialForm.fileUrl}
                  onChange={(e) => setMaterialForm(prev => ({ ...prev, fileUrl: e.target.value }))}
                  placeholder="https://drive.google.com/..."
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description & Instructions</label>
              <textarea
                rows={3}
                value={materialForm.description}
                onChange={(e) => setMaterialForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Guidance for students preparing for examinations..."
                className="form-input"
              />
            </div>

            <button
              type="submit"
              disabled={materialSubmitting}
              className="btn"
              style={{
                width: '100%',
                background: '#0284c7',
                color: '#ffffff',
                fontWeight: '700',
                padding: '0.85rem',
                borderRadius: '10px'
              }}
            >
              {materialSubmitting ? 'Uploading...' : 'Publish Verified Academic Material'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default FacultyPortal;
