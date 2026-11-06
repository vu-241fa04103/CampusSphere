import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  MessageSquare,
  Search,
  Filter,
  Plus,
  ThumbsUp,
  CheckCircle,
  HelpCircle,
  Send,
  X,
  Trash2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const Doubts = () => {
  const { user, isAuthenticated } = useAuth();
  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All');
  const [isResolved, setIsResolved] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    department: 'Computer Science',
    tags: ''
  });
  const [formLoading, setFormLoading] = useState(false);

  // Active expanded questions for showing answer threads
  const [expandedId, setExpandedId] = useState(null);
  const [answerTexts, setAnswerTexts] = useState({});
  const [submittingAnswer, setSubmittingAnswer] = useState(false);

  const fetchDoubts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (department !== 'All') params.department = department;
      if (isResolved !== 'All') params.isResolved = isResolved;

      const res = await api.get('/doubts', { params });
      if (res.data.success) {
        setDoubts(res.data.doubts);
      }
    } catch (err) {
      console.error('Error fetching doubts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoubts();
  }, [department, isResolved]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDoubts();
  };

  // Upvote Question
  const handleUpvoteQuestion = async (id) => {
    if (!isAuthenticated) {
      alert('Please sign in or use 1-Click Demo to upvote.');
      return;
    }

    try {
      const res = await api.post(`/doubts/${id}/upvote`);
      if (res.data.success) {
        setDoubts(prev =>
          prev.map(item => {
            if (item._id === id) {
              const currentUserId = user._id || user.id;
              const hasUpvoted = item.upvotes.some(uId => (uId._id || uId) === currentUserId);
              return {
                ...item,
                upvotes: hasUpvoted
                  ? item.upvotes.filter(uId => (uId._id || uId) !== currentUserId)
                  : [...item.upvotes, currentUserId]
              };
            }
            return item;
          })
        );
      }
    } catch (err) {
      console.error('Error upvoting question:', err);
    }
  };

  // Toggle Resolve
  const handleToggleResolve = async (id) => {
    try {
      const res = await api.patch(`/doubts/${id}/resolve`);
      if (res.data.success) {
        setDoubts(prev =>
          prev.map(item => item._id === id ? { ...item, isResolved: res.data.isResolved } : item)
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Could not toggle resolved state');
    }
  };

  // Delete Doubt
  const handleDeleteDoubt = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    try {
      const res = await api.delete(`/doubts/${id}`);
      if (res.data.success) {
        setDoubts(prev => prev.filter(item => item._id !== id));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete question');
    }
  };

  // Post Answer
  const handlePostAnswer = async (doubtId) => {
    if (!isAuthenticated) {
      alert('Please sign in or use 1-Click Demo to answer.');
      return;
    }

    const text = answerTexts[doubtId];
    if (!text || text.trim() === '') return;

    setSubmittingAnswer(true);
    try {
      const res = await api.post(`/doubts/${doubtId}/answers`, { text });
      if (res.data.success) {
        setDoubts(prev =>
          prev.map(item => item._id === doubtId ? res.data.doubt : item)
        );
        setAnswerTexts(prev => ({ ...prev, [doubtId]: '' }));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit answer');
    } finally {
      setSubmittingAnswer(false);
    }
  };

  // Create New Doubt Submit
  const handleCreateDoubt = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please sign in or use 1-Click Demo to ask doubts.');
      return;
    }

    setFormLoading(true);
    try {
      const res = await api.post('/doubts', formData);
      if (res.data.success) {
        setIsModalOpen(false);
        setFormData({
          title: '',
          description: '',
          subject: '',
          department: user?.department || 'Computer Science',
          tags: ''
        });
        fetchDoubts();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to post doubt');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div style={{ padding: '2.5rem 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <MessageSquare size={28} color="var(--primary)" /> Campus Doubt Clearance Forum
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Ask challenging academic questions, discuss concepts with seniors, and verify solutions together.
            </p>
          </div>

          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary" style={{ padding: '0.75rem 1.4rem' }}>
            <Plus size={18} /> Ask a Question
          </button>
        </div>

        {/* Filter Bar */}
        <div className="card" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
          <form onSubmit={handleSearchSubmit} style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
            gap: '1rem',
            alignItems: 'end'
          }}>
            <div>
              <label className="form-label">Search Topics</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Keywords, concepts, tags..."
                  className="form-input"
                  style={{ paddingLeft: '2.2rem' }}
                />
                <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <div>
              <label className="form-label">Department</label>
              <select value={department} onChange={(e) => setDepartment(e.target.value)} className="form-select">
                <option value="All">All Departments</option>
                <option value="Computer Science">Computer Science</option>
                <option value="AI & Data Science">AI & Data Science</option>
                <option value="Electronics & Comm">Electronics & Comm</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Civil">Civil</option>
                <option value="Information Tech">Information Tech</option>
              </select>
            </div>

            <div>
              <label className="form-label">Resolution Status</label>
              <select value={isResolved} onChange={(e) => setIsResolved(e.target.value)} className="form-select">
                <option value="All">All Questions</option>
                <option value="false">Unresolved Only</option>
                <option value="true">Resolved Only</option>
              </select>
            </div>

            <button type="submit" className="btn btn-secondary" style={{ height: '42px' }}>
              <Filter size={16} /> Filter Forum
            </button>
          </form>
        </div>

        {/* Doubts List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
            <p>Loading questions from forum...</p>
          </div>
        ) : doubts.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <HelpCircle size={48} color="#94a3b8" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>No Questions Found</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Have an academic doubt from class or labs? Post it here to get answers from peers and seniors!
            </p>
            <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
              <Plus size={16} /> Post Doubt
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {doubts.map((doubt) => {
              const currentUserId = user?._id || user?.id;
              const isAuthor = user && (
                doubt.askedBy?._id === currentUserId ||
                doubt.askedBy === currentUserId ||
                user.role === 'admin'
              );
              const hasUpvoted = user && doubt.upvotes?.some(uId => (uId._id || uId) === currentUserId);
              const isExpanded = expandedId === doubt._id;

              return (
                <div key={doubt._id} className="card" style={{ padding: '1.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span className={`badge ${doubt.isResolved ? 'badge-completed' : 'badge-pending'}`}>
                        {doubt.isResolved ? '✓ Resolved' : 'Open Question'}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                        {doubt.department} • {doubt.subject}
                      </span>
                    </div>

                    {isAuthor && (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleToggleResolve(doubt._id)}
                          className="btn btn-secondary"
                          style={{ padding: '0.3rem 0.65rem', fontSize: '0.78rem' }}
                        >
                          <CheckCircle size={14} color={doubt.isResolved ? '#10b981' : '#64748b'} />
                          {doubt.isResolved ? 'Reopen' : 'Mark Resolved'}
                        </button>
                        <button
                          onClick={() => handleDeleteDoubt(doubt._id)}
                          className="btn btn-danger"
                          style={{ padding: '0.3rem 0.5rem' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                    {doubt.title}
                  </h3>
                  <p style={{ fontSize: '0.925rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1rem' }}>
                    {doubt.description}
                  </p>

                  {/* Tags */}
                  {doubt.tags && doubt.tags.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
                      {doubt.tags.map((tag, idx) => (
                        <span key={idx} style={{
                          background: '#f1f5f9',
                          color: '#475569',
                          fontSize: '0.72rem',
                          fontWeight: '600',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '4px'
                        }}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Footer Meta */}
                  <div style={{
                    borderTop: '1px solid var(--border)',
                    paddingTop: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <img
                        src={doubt.askedBy?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                        alt="author"
                        style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Asked by <strong>{doubt.authorName || doubt.askedBy?.name || 'Student'}</strong>
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      {/* Upvote Button */}
                      <button
                        onClick={() => handleUpvoteQuestion(doubt._id)}
                        className="btn"
                        style={{
                          padding: '0.35rem 0.65rem',
                          fontSize: '0.8rem',
                          background: hasUpvoted ? 'var(--primary-light)' : '#f8fafc',
                          color: hasUpvoted ? 'var(--primary)' : 'var(--text-muted)',
                          border: '1px solid var(--border)'
                        }}
                      >
                        <ThumbsUp size={14} /> {doubt.upvotes?.length || 0}
                      </button>

                      {/* Expand Answers Button */}
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : doubt._id)}
                        className="btn btn-secondary"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                      >
                        <MessageSquare size={14} />
                        <span>{doubt.answers?.length || 0} Answers</span>
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    </div>
                  </div>

                  {/* ANSWER THREAD */}
                  {isExpanded && (
                    <div style={{
                      marginTop: '1.25rem',
                      paddingTop: '1.25rem',
                      borderTop: '1px dashed var(--border)'
                    }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1rem' }}>
                        Discussion & Solutions ({doubt.answers?.length || 0})
                      </h4>

                      {/* List Answers */}
                      {doubt.answers?.length === 0 ? (
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                          No answers yet. Share your insights below!
                        </p>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                          {doubt.answers.map((ans, idx) => (
                            <div key={idx} style={{
                              background: '#f8fafc',
                              border: '1px solid var(--border)',
                              borderRadius: 'var(--radius-sm)',
                              padding: '1rem'
                            }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>
                                    {ans.responderName}
                                  </span>
                                  <span className={`badge ${ans.responderRole === 'mentor' ? 'badge-mentor' : 'badge-student'}`} style={{ fontSize: '0.65rem' }}>
                                    {ans.responderRole}
                                  </span>
                                </div>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                  {new Date(ans.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                                {ans.text}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Post Answer Form */}
                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <textarea
                          rows={2}
                          value={answerTexts[doubt._id] || ''}
                          onChange={(e) => setAnswerTexts({ ...answerTexts, [doubt._id]: e.target.value })}
                          placeholder="Write a clear explanation or code snippet..."
                          className="form-textarea"
                          style={{ flexGrow: 1 }}
                        />
                        <button
                          onClick={() => handlePostAnswer(doubt._id)}
                          disabled={submittingAnswer}
                          className="btn btn-primary"
                          style={{ alignSelf: 'flex-end', padding: '0.65rem 1rem' }}
                        >
                          <Send size={16} /> Post
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ASK DOUBT MODAL */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800' }}>Ask an Academic Doubt</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateDoubt}>
              <div className="form-group">
                <label className="form-label">Question Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. How does context switching overhead differ in threads vs processes?"
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Subject *</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Operating Systems"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Department *</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="form-select"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="AI & Data Science">AI & Data Science</option>
                    <option value="Electronics & Comm">Electronics & Comm</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Civil">Civil</option>
                    <option value="Information Tech">Information Tech</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Tags (Comma separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="Threads, OS, Concurrency"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Detailed Explanation *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Explain what concept you are trying to understand and what specific part is unclear..."
                  className="form-textarea"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={formLoading} className="btn btn-primary">
                  {formLoading ? 'Submitting...' : 'Post Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Doubts;
