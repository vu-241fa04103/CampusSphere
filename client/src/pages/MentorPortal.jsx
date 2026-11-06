import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Users,
  Upload,
  MessageSquare,
  FileText,
  CheckCircle,
  Clock,
  Shield,
  HelpCircle,
  Plus,
  Send,
  BookOpen,
  Award,
  Calendar,
  Lock
} from 'lucide-react';

const MentorPortal = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('junior-doubts'); // 'junior-doubts', 'share-resources', 'my-uploads', 'sessions'

  // Data
  const [doubts, setDoubts] = useState([]);
  const [myResources, setMyResources] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Answering Doubt State
  const [answeringDoubtId, setAnsweringDoubtId] = useState(null);
  const [answerText, setAnswerText] = useState('');
  const [answerSubmitting, setAnswerSubmitting] = useState(false);

  // Upload Resource State (Department Locked)
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    subject: '',
    semester: 3,
    targetYear: 2,
    resourceType: 'Question Paper',
    fileUrl: '',
    tags: ''
  });
  const [uploadSubmitting, setUploadSubmitting] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [uploadError, setUploadError] = useState('');

  const mentorDept = user?.department || 'Computer Science';

  useEffect(() => {
    fetchJuniorDoubts();
    fetchMyResources();
    fetchSessions();
  }, [mentorDept]);

  // Fetch Doubts asked by Juniors in this Mentor's department
  const fetchJuniorDoubts = async () => {
    try {
      const res = await api.get('/doubts/mentor-inbox');
      setDoubts(res.data.doubts || []);
    } catch (err) {
      console.error('Failed to load mentor doubts inbox', err);
    }
  };

  // Fetch Resources uploaded by this Mentor
  const fetchMyResources = async () => {
    try {
      const res = await api.get(`/resources?department=${encodeURIComponent(mentorDept)}`);
      // Filter to resources uploaded by this user or this department
      setMyResources(res.data.resources || []);
    } catch (err) {
      console.error('Failed to load mentor resources', err);
    }
  };

  // Fetch Mentorship sessions
  const fetchSessions = async () => {
    try {
      const res = await api.get('/mentorship/sessions');
      setSessions(res.data.sessions || []);
    } catch (err) {
      console.error('Failed to load sessions', err);
    }
  };

  // Solve and Send answer to Junior's Doubt
  const handleSolveDoubt = async (doubtId) => {
    if (!answerText.trim()) return;
    setAnswerSubmitting(true);
    try {
      await api.post(`/doubts/${doubtId}/answers`, { text: answerText.trim() });
      setAnswerText('');
      setAnsweringDoubtId(null);
      fetchJuniorDoubts();
      alert('Your solution has been sent to the junior and marked as resolved!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit solution');
    } finally {
      setAnswerSubmitting(false);
    }
  };

  // Upload Resource (Department Locked: only mentor's department allowed!)
  const handleResourceUpload = async (e) => {
    e.preventDefault();
    setUploadSubmitting(true);
    setUploadSuccess('');
    setUploadError('');

    try {
      const payload = {
        title: uploadForm.title,
        description: uploadForm.description,
        subject: uploadForm.subject,
        department: mentorDept, // STRICT: Locked to mentor's department!
        semester: Number(uploadForm.semester),
        targetYear: Number(uploadForm.targetYear),
        resourceType: uploadForm.resourceType,
        fileUrl: uploadForm.fileUrl,
        tags: uploadForm.tags
      };

      const res = await api.post('/resources', payload);
      setUploadSuccess(`Successfully shared ${uploadForm.resourceType} for Year ${uploadForm.targetYear} juniors!`);
      fetchMyResources();
      setUploadForm({
        title: '',
        description: '',
        subject: '',
        semester: 3,
        targetYear: 2,
        resourceType: 'Question Paper',
        fileUrl: '',
        tags: ''
      });
    } catch (err) {
      setUploadError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploadSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      {/* Mentor Header Card */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, #3b0764 0%, #1e1b4b 100%)',
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
                background: 'rgba(168, 85, 247, 0.25)',
                color: '#d8b4fe',
                padding: '0.3rem 0.8rem',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: '800',
                border: '1px solid rgba(216, 180, 254, 0.3)'
              }}>
                🛡️ SENIOR MENTOR PORTAL
              </span>
              <span style={{
                background: 'rgba(34, 197, 94, 0.2)',
                color: '#4ade80',
                padding: '0.3rem 0.8rem',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: '600'
              }}>
                Reg: {user?.regNo || '231FA0'}
              </span>
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: '800', marginBottom: '0.4rem' }}>
              Senior Mentorship Center &bull; {user?.name}
            </h1>
            <p style={{ color: '#c4b5fd', fontSize: '0.95rem' }}>
              Locked Department: <strong style={{ color: '#ffffff' }}>{mentorDept}</strong> &bull; Senior Series:{' '}
              <strong style={{ color: '#fbcfe8' }}>{user?.year || '4th Year'}</strong>
            </p>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '1rem 1.5rem',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            textAlign: 'center'
          }}>
            <span style={{ fontSize: '0.75rem', color: '#e9d5ff', textTransform: 'uppercase', fontWeight: '700' }}>
              Department Status
            </span>
            <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ffffff', marginTop: '0.2rem' }}>
              {mentorDept}
            </div>
            <span style={{ fontSize: '0.75rem', color: '#a7f3d0' }}>
              ✓ Authorized Senior Mentor
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '0.5rem',
        marginBottom: '2rem',
        overflowX: 'auto'
      }}>
        {[
          { id: 'junior-doubts', label: '📥 Questions Asked by Juniors', count: doubts.length },
          { id: 'share-resources', label: '📤 Share Documents, QPs & PPTs' },
          { id: 'my-uploads', label: '📚 My Shared Resources', count: myResources.length },
          { id: 'sessions', label: '🤝 1-on-1 Mentorship Sessions', count: sessions.length }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.75rem 1.25rem',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === tab.id ? '#9333ea' : 'transparent',
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

      {/* TAB 1: JUNIOR DOUBTS INBOX */}
      {activeTab === 'junior-doubts' && (
        <div>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '800' }}>
              Junior Doubts Inbox ({mentorDept})
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Questions routed specifically to senior mentors of <strong>{mentorDept}</strong>. Solve and guide your juniors!
            </p>
          </div>

          {doubts.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem', borderRadius: '14px' }}>
              <CheckCircle size={48} style={{ color: '#10b981', margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>All Caught Up!</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                No unanswered doubts from {mentorDept} juniors right now.
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
                    borderLeft: d.isResolved ? '5px solid #10b981' : '5px solid #9333ea'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '6px',
                        background: '#f3e8ff',
                        color: '#7e22ce'
                      }}>
                        Junior: {d.askedBy?.name || d.authorName} ({d.askedBy?.regNo || 'Junior'})
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
                      {d.isResolved ? '✓ Resolved' : '⏳ Needs Mentor Help'}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '0.4rem' }}>
                    {d.title}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                    {d.description}
                  </p>

                  {/* Previous Answers */}
                  {d.answers?.length > 0 && (
                    <div style={{
                      background: '#f8fafc',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      padding: '0.75rem 1rem',
                      marginBottom: '1rem'
                    }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                        Posted Responses:
                      </span>
                      {d.answers.map((ans, idx) => (
                        <div key={idx} style={{ fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                          <strong>{ans.responderName}:</strong> {ans.text}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply Form */}
                  {answeringDoubtId === d._id ? (
                    <div style={{ marginTop: '0.75rem' }}>
                      <textarea
                        rows={3}
                        value={answerText}
                        onChange={(e) => setAnswerText(e.target.value)}
                        placeholder="Write clear explanation, step-by-step logic, or textbook reference for the junior..."
                        className="form-input"
                        style={{ marginBottom: '0.5rem' }}
                      />
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleSolveDoubt(d._id)}
                          disabled={answerSubmitting}
                          className="btn"
                          style={{
                            background: '#9333ea',
                            color: '#ffffff',
                            fontWeight: '700',
                            padding: '0.5rem 1rem',
                            borderRadius: '8px'
                          }}
                        >
                          {answerSubmitting ? 'Posting Solution...' : 'Send Solution & Resolve'}
                        </button>
                        <button
                          onClick={() => { setAnsweringDoubtId(null); setAnswerText(''); }}
                          className="btn btn-outline"
                          style={{ padding: '0.5rem 1rem', borderRadius: '8px' }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setAnsweringDoubtId(d._id); setAnswerText(''); }}
                      className="btn"
                      style={{
                        background: '#9333ea',
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
                      <MessageSquare size={14} />
                      <span>Solve & Reply to Junior</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SHARE DOCUMENTS, QPS, PPTS */}
      {activeTab === 'share-resources' && (
        <div className="card" style={{ maxWidth: '750px', margin: '0 auto', padding: '2rem', borderRadius: '16px' }}>
          <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#9333ea', fontWeight: '700', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
              <Shield size={16} />
              <span>DEPARTMENT RESTRICTED UPLOAD</span>
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800' }}>
              Share Academic Materials with Juniors
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              As a senior, you can upload Question Papers, Notes, Presentations (PPT), and Lab Manuals for junior cohorts.
              All uploads are locked to your department: <strong>{mentorDept}</strong>.
            </p>
          </div>

          {uploadSuccess && (
            <div style={{ background: '#dcfce7', color: '#15803d', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem' }}>
              ✓ {uploadSuccess}
            </div>
          )}
          {uploadError && (
            <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem' }}>
              ✗ {uploadError}
            </div>
          )}

          <form onSubmit={handleResourceUpload}>
            {/* Title */}
            <div className="form-group">
              <label className="form-label">Resource Title</label>
              <input
                type="text"
                required
                value={uploadForm.title}
                onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. End-Sem Solved Question Papers (2022-2025)"
                className="form-input"
              />
            </div>

            {/* Department (Disabled/Locked) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Lock size={13} style={{ color: '#9333ea' }} />
                  <span>Your Department (Locked)</span>
                </label>
                <input
                  type="text"
                  disabled
                  value={mentorDept}
                  className="form-input"
                  style={{ background: '#f1f5f9', fontWeight: '700', color: '#475569' }}
                />
              </div>

              {/* Resource Type */}
              <div className="form-group">
                <label className="form-label">Resource Type</label>
                <select
                  value={uploadForm.resourceType}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, resourceType: e.target.value }))}
                  className="form-select"
                >
                  <option value="Question Paper">Question Paper (Past Exams)</option>
                  <option value="Lecture Notes">Handwritten / Lecture Notes</option>
                  <option value="Presentation / PPT">Presentation / PPT</option>
                  <option value="Important PDF">Important Reference PDF</option>
                  <option value="Lab Manual">Lab Manual & Viva Guide</option>
                  <option value="Cheat Sheet">Formula & Revision Sheet</option>
                </select>
              </div>
            </div>

            {/* Target Junior Cohort & Subject */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Target Junior Year</label>
                <select
                  value={uploadForm.targetYear}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, targetYear: Number(e.target.value), semester: Number(e.target.value) * 2 - 1 }))}
                  className="form-select"
                >
                  <option value={1}>1st Year Juniors (261FA0 Series)</option>
                  <option value={2}>2nd Year Juniors (251FA0 Series)</option>
                  <option value={3}>3rd Year Juniors (241FA0 Series)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Subject Name</label>
                <input
                  type="text"
                  required
                  value={uploadForm.subject}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder={mentorDept === 'Biotechnology' ? 'Genetic Engineering' : 'Computer Networks'}
                  className="form-input"
                />
              </div>
            </div>

            {/* File URL or Google Drive Link */}
            <div className="form-group">
              <label className="form-label">Document / File URL (Google Drive, Dropbox, or Direct PDF)</label>
              <input
                type="url"
                required
                value={uploadForm.fileUrl}
                onChange={(e) => setUploadForm(prev => ({ ...prev, fileUrl: e.target.value }))}
                placeholder="https://drive.google.com/file/d/..."
                className="form-input"
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">Notes & Guidelines for Juniors</label>
              <textarea
                rows={3}
                value={uploadForm.description}
                onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Explain what topics are covered, exam tricks, derivations included..."
                className="form-input"
              />
            </div>

            <button
              type="submit"
              disabled={uploadSubmitting}
              className="btn"
              style={{
                width: '100%',
                background: '#9333ea',
                color: '#ffffff',
                fontWeight: '700',
                padding: '0.85rem',
                borderRadius: '10px'
              }}
            >
              {uploadSubmitting ? 'Publishing Material...' : `Publish to Year ${uploadForm.targetYear} ${mentorDept} Portal`}
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: MY SHARED RESOURCES */}
      {activeTab === 'my-uploads' && (
        <div>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '800' }}>
              Materials Shared in {mentorDept} Portals
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Question papers, notes, and presentations accessible by juniors
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {myResources.map(r => (
              <div key={r._id} className="card" style={{ padding: '1.5rem', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: '800',
                    color: '#9333ea',
                    background: '#f3e8ff',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '6px'
                  }}>
                    {r.resourceType}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Year {r.targetYear} Portal
                  </span>
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '0.4rem' }}>
                  {r.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', minHeight: '2.5rem' }}>
                  {r.description}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {r.downloadsCount || 0} Downloads
                  </span>
                  <a
                    href={r.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline"
                    style={{ fontSize: '0.75rem', padding: '0.3rem 0.7rem' }}
                  >
                    View File
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: MENTORSHIP SESSIONS */}
      {activeTab === 'sessions' && (
        <div>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '800' }}>
              1-on-1 Junior Mentorship Requests
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Enforced rule: You only mentor verified junior students.
            </p>
          </div>

          {sessions.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem', borderRadius: '14px' }}>
              <Calendar size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>No active bookings</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                When juniors book guidance sessions with you, they will appear here.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {sessions.map(s => (
                <div key={s._id} className="card" style={{ padding: '1.5rem', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>{s.topic}</h3>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: '800',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '6px',
                      background: s.status === 'confirmed' ? '#dcfce7' : '#fef3c7',
                      color: s.status === 'confirmed' ? '#15803d' : '#b45309'
                    }}>
                      {s.status.toUpperCase()}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                    {s.message}
                  </p>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Student: <strong>{s.student?.name}</strong> &bull; Schedule: {s.preferredDate} at {s.preferredTime}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MentorPortal;
