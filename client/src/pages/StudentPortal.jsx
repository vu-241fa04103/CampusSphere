import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  BookOpen,
  Bell,
  HelpCircle,
  Award,
  Bot,
  Send,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Users,
  Briefcase,
  Check,
  X
} from 'lucide-react';
import { DEPARTMENT_CURRICULUM } from '../data/curriculumData';

const StudentPortal = () => {
  const { user } = useAuth();

  // Active sub-tab
  const [activeTab, setActiveTab] = useState('study-plans'); // 'study-plans', 'notices', 'quizzes', 'doubts', 'ai-chatbot'

  // Data states
  const [notices, setNotices] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [doubts, setDoubts] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);

  // Ask Doubt Modal State
  const [showDoubtModal, setShowDoubtModal] = useState(false);
  const [doubtForm, setDoubtForm] = useState({
    title: '',
    description: '',
    subject: '',
    targetRole: 'mentor', // 'mentor' or 'faculty'
    targetFaculty: '',
    tags: ''
  });
  const [doubtSubmitting, setDoubtSubmitting] = useState(false);
  const [doubtSuccess, setDoubtSuccess] = useState('');

  // Active Quiz State
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [quizSubmitting, setQuizSubmitting] = useState(false);

  // AI Chatbot State
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'bot',
      text: `Hello ${user?.name || 'Student'}! 👋 I am your CampusSphere Academic AI Assistant. Ask me anything about your ${user?.department || 'course'} syllabus, exam topics, concept explanations, or study strategies!`
    }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  // Department Curriculum
  const userDept = user?.department || 'Computer Science';
  const userYear = user?.year || '3rd Year';
  const curriculumForYear = DEPARTMENT_CURRICULUM[userDept]?.[userYear] ||
    DEPARTMENT_CURRICULUM[userDept]?.['3rd Year'] ||
    DEPARTMENT_CURRICULUM['Computer Science']['3rd Year'];

  useEffect(() => {
    if (curriculumForYear && curriculumForYear.length > 0) {
      setSelectedSubject(curriculumForYear[0]);
      setDoubtForm(prev => ({ ...prev, subject: curriculumForYear[0].name }));
    }
    fetchNotices();
    fetchQuizzes();
    fetchDoubts();
    fetchFacultyList();
  }, [userDept, userYear]);

  const fetchNotices = async () => {
    try {
      const res = await api.get('/notices');
      setNotices(res.data.notices || []);
    } catch (err) {
      console.error('Failed to load notices', err);
    }
  };

  const fetchQuizzes = async () => {
    try {
      const res = await api.get('/quizzes');
      setQuizzes(res.data.quizzes || []);
    } catch (err) {
      console.error('Failed to load quizzes', err);
    }
  };

  const fetchDoubts = async () => {
    try {
      const res = await api.get(`/doubts?department=${encodeURIComponent(userDept)}`);
      setDoubts(res.data.doubts || []);
    } catch (err) {
      console.error('Failed to load doubts', err);
    }
  };

  const fetchFacultyList = async () => {
    try {
      const res = await api.get(`/doubts/faculty-list?department=${encodeURIComponent(userDept)}`);
      setFacultyList(res.data.faculty || []);
      if (res.data.faculty?.length > 0) {
        setDoubtForm(prev => ({ ...prev, targetFaculty: res.data.faculty[0]._id }));
      }
    } catch (err) {
      console.error('Failed to load faculty list', err);
    }
  };

  // Submit Doubt with Target Choice (Mentors vs Faculty)
  const handleDoubtSubmit = async (e) => {
    e.preventDefault();
    setDoubtSubmitting(true);
    setDoubtSuccess('');

    try {
      const payload = {
        title: doubtForm.title,
        description: doubtForm.description,
        subject: doubtForm.subject || selectedSubject?.name || 'General',
        department: userDept,
        targetRole: doubtForm.targetRole,
        targetFaculty: doubtForm.targetRole === 'faculty' ? doubtForm.targetFaculty : null,
        tags: doubtForm.tags
      };

      const res = await api.post('/doubts', payload);
      setDoubtSuccess(res.data.message || 'Doubt submitted successfully!');
      fetchDoubts();
      setTimeout(() => {
        setShowDoubtModal(false);
        setDoubtSuccess('');
        setDoubtForm({
          title: '',
          description: '',
          subject: selectedSubject?.name || '',
          targetRole: 'mentor',
          targetFaculty: facultyList[0]?._id || '',
          tags: ''
        });
      }, 1500);
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting question');
    } finally {
      setDoubtSubmitting(false);
    }
  };

  // Start Taking Quiz
  const handleStartQuiz = async (quizId) => {
    try {
      setLoading(true);
      const res = await api.get(`/quizzes/${quizId}`);
      setActiveQuiz(res.data.quiz);
      setUserAnswers({});
      setQuizResult(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to load quiz');
    } finally {
      setLoading(false);
    }
  };

  // Submit Quiz Answers
  const handleQuizSubmit = async () => {
    if (!activeQuiz) return;
    const answeredCount = Object.keys(userAnswers).length;
    if (answeredCount < activeQuiz.questions.length) {
      if (!window.confirm(`You answered ${answeredCount} of ${activeQuiz.questions.length} questions. Submit anyway?`)) {
        return;
      }
    }

    setQuizSubmitting(true);
    try {
      const answersArray = activeQuiz.questions.map((_, idx) =>
        userAnswers[idx] !== undefined ? userAnswers[idx] : -1
      );

      const res = await api.post(`/quizzes/${activeQuiz._id}/submit`, { answers: answersArray });
      setQuizResult(res.data.result);
      fetchQuizzes();
    } catch (err) {
      alert(err.response?.data?.message || 'Submission failed');
    } finally {
      setQuizSubmitting(false);
    }
  };

  // Chatbot Send Message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');
    setChatLoading(true);

    try {
      const res = await api.post('/ai/ask', {
        question: userMsg,
        department: userDept,
        subject: selectedSubject?.name
      });
      setChatMessages(prev => [...prev, { sender: 'bot', text: res.data.answer }]);
    } catch (err) {
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: 'I encountered an issue fetching answers right now. Please try asking again or check the Study Plans tab!'
        }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      {/* Student Profile Header Banner */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        color: '#ffffff',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: 'var(--shadow-lg)',
        borderRadius: '16px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span style={{
                background: 'rgba(59, 130, 246, 0.25)',
                color: '#60a5fa',
                padding: '0.3rem 0.8rem',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: '700',
                border: '1px solid rgba(96, 165, 250, 0.3)'
              }}>
                🎓 STUDENT ACADEMIC PORTAL
              </span>
              <span style={{
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#34d399',
                padding: '0.3rem 0.8rem',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: '600'
              }}>
                Series: {user?.regNo || '241FA0'}
              </span>
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: '800', marginBottom: '0.4rem' }}>
              Welcome back, {user?.name || 'Student'}!
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
              Department: <strong style={{ color: '#f8fafc' }}>{userDept}</strong> &bull; Track:{' '}
              <strong style={{ color: '#38bdf8' }}>{user?.specialization || 'Core Systems'}</strong> &bull; Cohort:{' '}
              <strong style={{ color: '#f8fafc' }}>{userYear}</strong>
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => setShowDoubtModal(true)}
              className="btn"
              style={{
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                color: '#ffffff',
                fontWeight: '700',
                padding: '0.75rem 1.25rem',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)'
              }}
            >
              <HelpCircle size={18} />
              <span>Ask a Doubt (Mentors or Faculty)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs for Student Features */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '0.5rem',
        marginBottom: '2rem',
        overflowX: 'auto'
      }}>
        {[
          { id: 'study-plans', label: '📖 Subjects & Study Plans', count: curriculumForYear.length },
          { id: 'notices', label: '📢 Exam Notifications & Notices', count: notices.length },
          { id: 'quizzes', label: '📝 Quizzes & Assessments', count: quizzes.length },
          { id: 'doubts', label: '💬 Q&A & Doubts Forum', count: doubts.length },
          { id: 'ai-chatbot', label: '🤖 AI Academic Chatbot' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setActiveQuiz(null); }}
            style={{
              padding: '0.75rem 1.25rem',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === tab.id ? 'var(--primary)' : 'transparent',
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

      {/* TAB 1: SUBJECTS & STUDY PLANS */}
      {activeTab === 'study-plans' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: '800' }}>
                {userDept} — {userYear} Curriculum & Study Guide
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Curated specifically for your branch and specialization track: <strong>{user?.specialization || 'Standard Track'}</strong>
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
            {/* Subject Selector Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {curriculumForYear.map(subj => {
                const isSelected = selectedSubject?.code === subj.code;
                return (
                  <div
                    key={subj.code}
                    onClick={() => {
                      setSelectedSubject(subj);
                      setDoubtForm(prev => ({ ...prev, subject: subj.name }));
                    }}
                    className="card"
                    style={{
                      padding: '1.25rem',
                      cursor: 'pointer',
                      border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                      background: isSelected ? 'rgba(37, 99, 235, 0.04)' : '#ffffff',
                      transition: 'all 0.2s',
                      borderRadius: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: '800',
                        color: 'var(--primary)',
                        background: 'var(--primary-light)',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '6px'
                      }}>
                        {subj.code}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {subj.credits} Credits
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.3rem' }}>
                      {subj.name}
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineClamp: 2 }}>
                      {subj.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Subject Detail & Detailed Study Plan */}
            {selectedSubject && (
              <div className="card" style={{ padding: '2rem', borderRadius: '14px' }}>
                <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{
                      color: 'var(--primary)',
                      fontWeight: '800',
                      fontSize: '0.85rem'
                    }}>
                      COURSE MODULE PLAN ({selectedSubject.code})
                    </span>
                    <button
                      onClick={() => {
                        setDoubtForm(prev => ({ ...prev, subject: selectedSubject.name }));
                        setShowDoubtModal(true);
                      }}
                      className="btn btn-outline"
                      style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
                    >
                      <HelpCircle size={14} style={{ marginRight: '0.3rem' }} />
                      Ask Doubt on this Subject
                    </button>
                  </div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.4rem' }}>
                    {selectedSubject.name}
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    {selectedSubject.description}
                  </p>
                </div>

                {/* Modules breakdown */}
                <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <BookOpen size={18} style={{ color: 'var(--primary)' }} />
                  <span>Syllabus Units & Preparation Checklist</span>
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.75rem' }}>
                  {selectedSubject.modules.map((mod, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '1rem',
                        background: '#f8fafc',
                        border: '1px solid var(--border-color)',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{
                          background: 'var(--primary)',
                          color: '#ffffff',
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: '800'
                        }}>
                          {idx + 1}
                        </span>
                        <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{mod}</span>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Check size={14} /> Ready
                      </span>
                    </div>
                  ))}
                </div>

                {/* Expert Study Tips */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(245, 158, 11, 0.02) 100%)',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                  borderRadius: '10px',
                  padding: '1.25rem'
                }}>
                  <h4 style={{ color: '#d97706', fontSize: '0.9rem', fontWeight: '800', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Sparkles size={16} />
                    <span>Senior & Faculty Study Tip:</span>
                  </h4>
                  <p style={{ fontSize: '0.875rem', color: '#92400e', lineHeight: 1.5 }}>
                    {selectedSubject.studyTips}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: EXAM NOTIFICATIONS & NOTICES */}
      {activeTab === 'notices' && (
        <div>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '800' }}>
              Official University & Department Notices
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Exam schedules, lab timetables, and academic circulars broadcasted by Faculty
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {notices.map(notice => (
              <div
                key={notice._id}
                className="card"
                style={{
                  padding: '1.5rem',
                  borderRadius: '12px',
                  borderLeft: notice.isPinned ? '5px solid #ef4444' : '5px solid var(--primary)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: '800',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '6px',
                      background: notice.type === 'Exam Notification' ? '#fee2e2' : notice.type === 'Lab Timetable' ? '#fef3c7' : '#e0e7ff',
                      color: notice.type === 'Exam Notification' ? '#dc2626' : notice.type === 'Lab Timetable' ? '#b45309' : '#3730a3'
                    }}>
                      {notice.type}
                    </span>
                    {notice.isPinned && (
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: '700',
                        color: '#ef4444',
                        background: '#fef2f2',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '4px',
                        border: '1px solid #fca5a5'
                      }}>
                        📌 HIGH PRIORITY
                      </span>
                    )}
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Target: {notice.department} &bull; {notice.targetYear}
                    </span>
                  </div>

                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {new Date(notice.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '0.5rem' }}>
                  {notice.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                  {notice.content}
                </p>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Briefcase size={14} />
                  <span>Posted by: <strong>{notice.authorName}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: QUIZZES */}
      {activeTab === 'quizzes' && (
        <div>
          {!activeQuiz ? (
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: '800' }}>
                  Department Quizzes & Self-Assessments
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Test your mastery of semester subjects. Automatically graded with instant explanations!
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
                {quizzes.map(quiz => (
                  <div key={quiz._id} className="card" style={{ padding: '1.5rem', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        color: 'var(--primary)',
                        background: 'var(--primary-light)',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '6px'
                      }}>
                        {quiz.subject}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Clock size={13} /> {quiz.duration} mins
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.4rem' }}>
                      {quiz.title}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem', minHeight: '2.5rem' }}>
                      {quiz.description}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        By {quiz.creatorName}
                      </span>
                      <button
                        onClick={() => handleStartQuiz(quiz._id)}
                        className="btn btn-primary"
                        style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', fontWeight: '700' }}
                      >
                        Start Quiz &rarr;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* ACTIVE QUIZ INTERACTION */
            <div className="card" style={{ padding: '2rem', borderRadius: '14px', maxWidth: '800px', margin: '0 auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <button
                    onClick={() => setActiveQuiz(null)}
                    style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '700', cursor: 'pointer', marginBottom: '0.3rem' }}
                  >
                    &larr; Back to Quizzes
                  </button>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: '800' }}>{activeQuiz.title}</h2>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Subject: {activeQuiz.subject} &bull; Total Questions: {activeQuiz.questions.length}
                  </span>
                </div>
              </div>

              {/* Quiz Results if submitted */}
              {quizResult && (
                <div style={{
                  background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                  border: '1px solid #10b981',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  marginBottom: '2rem',
                  textAlign: 'center'
                }}>
                  <Award size={40} style={{ color: '#059669', marginBottom: '0.5rem' }} />
                  <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#065f46' }}>
                    You scored {quizResult.score} / {quizResult.totalQuestions} ({quizResult.percentage}%)!
                  </h3>
                  <p style={{ color: '#047857', fontSize: '0.9rem' }}>
                    Great job! Check the detailed solutions and explanations below.
                  </p>
                </div>
              )}

              {/* Question list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', marginBottom: '2rem' }}>
                {activeQuiz.questions.map((q, qIdx) => (
                  <div
                    key={qIdx}
                    style={{
                      padding: '1.25rem',
                      background: '#f8fafc',
                      borderRadius: '10px',
                      border: '1px solid var(--border-color)'
                    }}
                  >
                    <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '1rem' }}>
                      Question {qIdx + 1}: {q.question}
                    </h4>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {q.options.map((opt, optIdx) => {
                        const isSelected = userAnswers[qIdx] === optIdx;
                        const isSubmitted = !!quizResult;
                        const isCorrectAnswer = quizResult?.breakdown?.[qIdx]?.correctAnswer === opt;

                        let bg = '#ffffff';
                        let borderColor = 'var(--border-color)';
                        if (isSelected) {
                          bg = 'rgba(37, 99, 235, 0.08)';
                          borderColor = 'var(--primary)';
                        }
                        if (isSubmitted && isCorrectAnswer) {
                          bg = '#dcfce7';
                          borderColor = '#22c55e';
                        } else if (isSubmitted && isSelected && !isCorrectAnswer) {
                          bg = '#fee2e2';
                          borderColor = '#ef4444';
                        }

                        return (
                          <div
                            key={optIdx}
                            onClick={() => {
                              if (!quizResult) {
                                setUserAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
                              }
                            }}
                            style={{
                              padding: '0.75rem 1rem',
                              borderRadius: '8px',
                              border: `1.5px solid ${borderColor}`,
                              background: bg,
                              cursor: quizResult ? 'default' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              fontSize: '0.875rem'
                            }}
                          >
                            <span>{opt}</span>
                            {isSelected && <span style={{ fontWeight: '700', color: 'var(--primary)' }}>●</span>}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation if submitted */}
                    {quizResult && quizResult.breakdown?.[qIdx] && (
                      <div style={{
                        marginTop: '0.75rem',
                        padding: '0.75rem',
                        background: '#eff6ff',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        color: '#1e40af'
                      }}>
                        <strong>Explanation:</strong> {quizResult.breakdown[qIdx].explanation || 'Refer to standard textbook definition.'}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {!quizResult && (
                <button
                  onClick={handleQuizSubmit}
                  disabled={quizSubmitting}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.85rem', fontWeight: '700', fontSize: '1rem' }}
                >
                  {quizSubmitting ? 'Evaluating Answers...' : 'Submit Quiz for Auto-Grading'}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: DOUBTS & QA FORUM */}
      {activeTab === 'doubts' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: '800' }}>
                {userDept} Q&A Doubt Clearance Forum
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Doubts asked by students routed to <strong>Senior Mentors</strong> or <strong>Subject Faculty</strong>
              </p>
            </div>
            <button
              onClick={() => setShowDoubtModal(true)}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.2rem' }}
            >
              <Plus size={16} />
              <span>Ask New Doubt</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {doubts.map(d => (
              <div key={d._id} className="card" style={{ padding: '1.5rem', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: '800',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '6px',
                      background: d.targetRole === 'faculty' ? '#e0f2fe' : '#f3e8ff',
                      color: d.targetRole === 'faculty' ? '#0369a1' : '#7e22ce'
                    }}>
                      {d.targetRole === 'faculty' ? '🏛️ Directed to Faculty' : '🛡️ Directed to Mentors'}
                    </span>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '6px',
                      background: d.isResolved ? '#dcfce7' : '#fef3c7',
                      color: d.isResolved ? '#15803d' : '#b45309'
                    }}>
                      {d.isResolved ? '✓ Resolved' : '⏳ Waiting for Solution'}
                    </span>
                  </div>

                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Subject: <strong>{d.subject}</strong>
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '0.4rem' }}>
                  {d.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                  {d.description}
                </p>

                {/* Answers / Solutions list */}
                {d.answers?.length > 0 ? (
                  <div style={{
                    background: '#f8fafc',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '1rem',
                    marginTop: '0.5rem'
                  }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '0.4rem', display: 'block' }}>
                      💡 Solutions & Answers ({d.answers.length}):
                    </span>
                    {d.answers.map((ans, aIdx) => (
                      <div key={aIdx} style={{ borderBottom: aIdx < d.answers.length - 1 ? '1px solid #e2e8f0' : 'none', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                          <strong style={{ fontSize: '0.85rem' }}>{ans.responderName}</strong>
                          <span style={{
                            fontSize: '0.7rem',
                            padding: '0.1rem 0.4rem',
                            borderRadius: '4px',
                            background: ans.responderRole === 'lecturer' ? '#e0f2fe' : '#f3e8ff',
                            color: ans.responderRole === 'lecturer' ? '#0369a1' : '#7e22ce',
                            fontWeight: '700'
                          }}>
                            {ans.responderRole === 'lecturer' ? 'Faculty Professor' : 'Senior Mentor'}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                          {ans.text}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    No solutions posted yet. Your mentors and faculty have been notified!
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: AI CHATBOT */}
      {activeTab === 'ai-chatbot' && (
        <div className="card" style={{
          padding: '0',
          borderRadius: '16px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          height: '620px',
          boxShadow: 'var(--shadow-md)'
        }}>
          {/* Chat Header */}
          <div style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            color: '#ffffff',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                background: 'rgba(59, 130, 246, 0.25)',
                color: '#60a5fa',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Bot size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>CampusSphere Academic AI Assistant</h3>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  Equipped with {userDept} Syllabus, Exam Concepts & Study Assistance
                </span>
              </div>
            </div>
            <span style={{
              background: '#10b981',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              display: 'inline-block'
            }} />
          </div>

          {/* Chat Messages Body */}
          <div style={{
            flexGrow: 1,
            padding: '1.5rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            background: '#f8fafc'
          }}>
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div style={{
                  maxWidth: '75%',
                  padding: '1rem 1.25rem',
                  borderRadius: msg.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                  background: msg.sender === 'user' ? 'var(--primary)' : '#ffffff',
                  color: msg.sender === 'user' ? '#ffffff' : 'var(--text-primary)',
                  boxShadow: 'var(--shadow-sm)',
                  fontSize: '0.9rem',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap'
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  padding: '0.75rem 1rem',
                  background: '#ffffff',
                  borderRadius: '12px',
                  color: 'var(--text-muted)',
                  fontSize: '0.85rem'
                }}>
                  AI is analyzing curriculum and generating explanation...
                </div>
              </div>
            )}
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={handleSendMessage}
            style={{
              padding: '1rem 1.5rem',
              background: '#ffffff',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              gap: '0.75rem'
            }}
          >
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder={`Ask a question (e.g. Explain QuickSort, PCR Cycles, DNA Replication, 3NF)...`}
              className="form-input"
              style={{ flexGrow: 1 }}
            />
            <button
              type="submit"
              disabled={chatLoading}
              className="btn btn-primary"
              style={{ padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '700' }}
            >
              <Send size={16} />
              <span>Ask</span>
            </button>
          </form>
        </div>
      )}

      {/* ASK DOUBT MODAL WITH ROUTING SELECTION */}
      {showDoubtModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div className="card" style={{
            maxWidth: '600px',
            width: '100%',
            padding: '2rem',
            borderRadius: '16px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: '800' }}>Ask an Academic Doubt</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Choose whether your question goes to <strong>Senior Mentors</strong> or directly to <strong>Subject Faculty</strong>
                </p>
              </div>
              <button
                onClick={() => setShowDoubtModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            {doubtSuccess && (
              <div style={{
                background: '#dcfce7',
                color: '#15803d',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                marginBottom: '1rem'
              }}>
                ✓ {doubtSuccess}
              </div>
            )}

            <form onSubmit={handleDoubtSubmit}>
              {/* TARGET SELECTION: Mentors vs Faculty */}
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: '700' }}>
                  Target Recipient (Where should this doubt be routed?)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div
                    onClick={() => setDoubtForm(prev => ({ ...prev, targetRole: 'mentor' }))}
                    style={{
                      padding: '1rem',
                      borderRadius: '10px',
                      border: doubtForm.targetRole === 'mentor' ? '2px solid #9333ea' : '1px solid var(--border-color)',
                      background: doubtForm.targetRole === 'mentor' ? '#faf5ff' : '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.3rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', color: '#9333ea' }}>
                      <Users size={18} />
                      <span>Department Mentors</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Goes to all senior mentors of your department ({userDept}). Any senior can solve!
                    </span>
                  </div>

                  <div
                    onClick={() => setDoubtForm(prev => ({ ...prev, targetRole: 'faculty' }))}
                    style={{
                      padding: '1rem',
                      borderRadius: '10px',
                      border: doubtForm.targetRole === 'faculty' ? '2px solid #0284c7' : '1px solid var(--border-color)',
                      background: doubtForm.targetRole === 'faculty' ? '#f0f9ff' : '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.3rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', color: '#0284c7' }}>
                      <Briefcase size={18} />
                      <span>Subject Faculty</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Routes directly to faculty portal for official academic resolution.
                    </span>
                  </div>
                </div>
              </div>

              {/* Specific Faculty Selector if targetRole === 'faculty' */}
              {doubtForm.targetRole === 'faculty' && (
                <div className="form-group">
                  <label className="form-label">Select Faculty Member</label>
                  <select
                    value={doubtForm.targetFaculty}
                    onChange={(e) => setDoubtForm(prev => ({ ...prev, targetFaculty: e.target.value }))}
                    className="form-select"
                  >
                    {facultyList.map(fac => (
                      <option key={fac._id} value={fac._id}>
                        {fac.name} ({fac.department})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Subject */}
              <div className="form-group">
                <label className="form-label">Subject</label>
                <select
                  value={doubtForm.subject}
                  onChange={(e) => setDoubtForm(prev => ({ ...prev, subject: e.target.value }))}
                  className="form-select"
                >
                  {curriculumForYear.map(s => (
                    <option key={s.code} value={s.name}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div className="form-group">
                <label className="form-label">Question Title</label>
                <input
                  type="text"
                  required
                  value={doubtForm.title}
                  onChange={(e) => setDoubtForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. How to solve Dijkstra shortest path with negative edge weights?"
                  className="form-input"
                />
              </div>

              {/* Description */}
              <div className="form-group">
                <label className="form-label">Detailed Explanation & Specific Problem</label>
                <textarea
                  required
                  rows={4}
                  value={doubtForm.description}
                  onChange={(e) => setDoubtForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Explain where you are getting stuck, relevant formulas or code..."
                  className="form-input"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setShowDoubtModal(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={doubtSubmitting}
                  className="btn btn-primary"
                  style={{ fontWeight: '700' }}
                >
                  {doubtSubmitting ? 'Routing Doubt...' : 'Send Doubt'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentPortal;
