import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Users,
  Calendar,
  Clock,
  Star,
  CheckCircle,
  XCircle,
  Video,
  MessageSquare,
  AlertCircle,
  X,
  Send,
  Sparkles,
  ShieldAlert,
  GraduationCap
} from 'lucide-react';

const Mentorship = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('browse');
  const [mentors, setMentors] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Booking Modal State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [bookingData, setBookingData] = useState({
    topic: '',
    message: '',
    preferredDate: '',
    preferredTime: '6:00 PM IST'
  });
  const [bookingLoading, setBookingLoading] = useState(false);

  // Mentor Accept Modal State
  const [actionModalSession, setActionModalSession] = useState(null);
  const [meetingLink, setMeetingLink] = useState('');
  const [mentorNotes, setMentorNotes] = useState('');

  // Student Feedback Modal
  const [feedbackSession, setFeedbackSession] = useState(null);
  const [rating, setRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');

  // Fetch Mentors
  const fetchMentors = async () => {
    try {
      const res = await api.get('/auth/mentors');
      if (res.data.success) {
        setMentors(res.data.mentors);
      }
    } catch (err) {
      console.error('Error fetching mentors:', err);
    }
  };

  // Fetch My Sessions
  const fetchMySessions = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await api.get('/mentorship/my-sessions');
      if (res.data.success) {
        setSessions(res.data.sessions);
      }
    } catch (err) {
      console.error('Error fetching sessions:', err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchMentors();
      if (isAuthenticated) {
        await fetchMySessions();
      }
      setLoading(false);
    };
    init();
  }, [isAuthenticated]);

  // Check if logged-in user is a junior eligible to be mentored by this specific mentor
  const checkJuniorEligibility = (mentor) => {
    if (!user) return { eligible: true }; // Allow view, prompt login on click
    if (mentor.role === 'lecturer' || mentor.role === 'admin') return { eligible: true, label: 'Faculty Mentor (All Students)' };
    if (user.role === 'lecturer' || user.role === 'admin') return { eligible: false, label: 'Faculty Account' };

    const matchMentor = mentor.regNo?.match(/^(\d{2})/);
    const matchStudent = user.regNo?.match(/^(\d{2})/);

    const mentorBatch = matchMentor ? parseInt(matchMentor[1], 10) : 23;
    const studentBatch = matchStudent ? parseInt(matchStudent[1], 10) : 24;

    // RULE: Students can be mentors ONLY for their juniors!
    // Lower batch number means senior (e.g. 23 is senior to 24)
    // Eligible if mentorBatch < studentBatch
    if (mentorBatch < studentBatch) {
      return { eligible: true, label: `Junior Eligible (Your Senior)` };
    } else if (mentorBatch === studentBatch) {
      return { eligible: false, label: `Peer / Same Batch (Cannot Mentor)` };
    } else {
      return { eligible: false, label: `Junior to you (Cannot Mentor Seniors)` };
    }
  };

  // Open Booking Modal
  const openBookingModal = (mentor) => {
    if (!isAuthenticated) {
      alert('Please sign in as a student to book a mentorship session.');
      return;
    }

    const { eligible, label } = checkJuniorEligibility(mentor);
    if (!eligible) {
      alert(`Mentorship Rule Restriction: Students can only mentor their juniors! (${label})`);
      return;
    }

    setSelectedMentor(mentor);
    setBookingData({
      topic: '',
      message: '',
      preferredDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      preferredTime: '6:00 PM IST'
    });
    setIsBookingModalOpen(true);
  };

  // Submit Booking
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingLoading(true);

    try {
      const res = await api.post('/mentorship/request', {
        mentorId: selectedMentor._id,
        ...bookingData
      });

      if (res.data.success) {
        setIsBookingModalOpen(false);
        alert(res.data.message || 'Mentorship session requested successfully!');
        setActiveTab('my-sessions');
        fetchMySessions();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to request session.');
    } finally {
      setBookingLoading(false);
    }
  };

  // Mentor updates session status (Accept / Decline)
  const handleStatusUpdate = async (status) => {
    if (!actionModalSession) return;

    try {
      const res = await api.patch(`/mentorship/${actionModalSession._id}/status`, {
        status,
        meetingLink,
        mentorNotes
      });

      if (res.data.success) {
        setActionModalSession(null);
        setMeetingLink('');
        setMentorNotes('');
        fetchMySessions();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update session');
    }
  };

  // Cancel Session
  const handleCancelSession = async (sessionId) => {
    if (!window.confirm('Are you sure you want to cancel this session?')) return;

    try {
      const res = await api.delete(`/mentorship/${sessionId}`);
      if (res.data.success) {
        setSessions(prev => prev.filter(s => s._id !== sessionId));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel session');
    }
  };

  // Submit Feedback
  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/mentorship/${feedbackSession._id}/feedback`, {
        rating,
        feedback: feedbackText
      });

      if (res.data.success) {
        setFeedbackSession(null);
        fetchMySessions();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit feedback');
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
          marginBottom: '1.5rem'
        }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Users size={28} color="var(--primary)" /> Peer Mentorship Hub
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Connect with senior mentors for career roadmaps, mock technical interviews, and resume reviews.
            </p>
          </div>

          {/* Tab Switcher */}
          <div style={{
            display: 'flex',
            background: '#e2e8f0',
            padding: '0.3rem',
            borderRadius: 'var(--radius-sm)'
          }}>
            <button
              onClick={() => setActiveTab('browse')}
              style={{
                padding: '0.55rem 1.25rem',
                fontSize: '0.875rem',
                fontWeight: '700',
                borderRadius: '6px',
                background: activeTab === 'browse' ? '#ffffff' : 'transparent',
                color: activeTab === 'browse' ? 'var(--primary)' : 'var(--text-muted)',
                boxShadow: activeTab === 'browse' ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              Browse Mentors
            </button>
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  alert('Please sign in to view your sessions.');
                  return;
                }
                setActiveTab('my-sessions');
                fetchMySessions();
              }}
              style={{
                padding: '0.55rem 1.25rem',
                fontSize: '0.875rem',
                fontWeight: '700',
                borderRadius: '6px',
                background: activeTab === 'my-sessions' ? '#ffffff' : 'transparent',
                color: activeTab === 'my-sessions' ? 'var(--primary)' : 'var(--text-muted)',
                boxShadow: activeTab === 'my-sessions' ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              My Sessions ({sessions.length})
            </button>
          </div>
        </div>

        {/* POLICY CALLOUT BANNER */}
        <div style={{
          background: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: 'var(--radius-sm)',
          padding: '0.85rem 1.25rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontSize: '0.875rem',
          color: '#1e40af'
        }}>
          <GraduationCap size={20} />
          <span>
            <strong>Mentorship Rule:</strong> Students can be mentors <strong>only for their juniors</strong> (e.g., 4th-Year seniors mentor 3rd/2nd/1st years; 3rd-Year students mentor 2nd/1st years). Faculty members can mentor students across all batches.
          </span>
        </div>

        {/* TAB 1: BROWSE MENTORS */}
        {activeTab === 'browse' && (
          <div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
                <p>Loading mentors directory...</p>
              </div>
            ) : mentors.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                <Users size={48} color="#94a3b8" style={{ marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>No Mentors Registered Yet</h3>
                <p style={{ color: 'var(--text-muted)' }}>
                  Sign up as a Senior Mentor to help juniors across campus!
                </p>
              </div>
            ) : (
              <div className="grid-cards">
                {mentors.map((mentor) => {
                  const { eligible, label } = checkJuniorEligibility(mentor);
                  const isFaculty = mentor.role === 'lecturer';

                  return (
                    <div key={mentor._id} className="card" style={{ display: 'flex', flexDirection: 'column', padding: '1.75rem' }}>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                        <img
                          src={mentor.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'}
                          alt={mentor.name}
                          style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: `2px solid ${isFaculty ? '#38bdf8' : '#f0abfc'}`
                          }}
                        />
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-main)' }}>{mentor.name}</h3>
                          </div>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            {isFaculty ? 'Faculty Professor' : `${mentor.year} (${mentor.regNo})`} • {mentor.department}
                          </p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
                            <Star size={14} color="#f59e0b" fill="#f59e0b" />
                            <span style={{ fontSize: '0.8rem', fontWeight: '700' }}>{mentor.rating || 4.9}</span>
                            <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                              {isFaculty ? 'Faculty Guide' : 'Senior Mentor'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Junior Eligibility Badge */}
                      <div style={{ marginBottom: '0.75rem' }}>
                        <span style={{
                          fontSize: '0.72rem',
                          fontWeight: '700',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '6px',
                          background: eligible ? '#ecfdf5' : '#f1f5f9',
                          color: eligible ? '#047857' : '#64748b',
                          border: `1px solid ${eligible ? '#a7f3d0' : '#cbd5e1'}`
                        }}>
                          {label}
                        </span>
                      </div>

                      <p style={{
                        fontSize: '0.875rem',
                        color: 'var(--text-muted)',
                        lineHeight: 1.5,
                        marginBottom: '1rem',
                        flexGrow: 1
                      }}>
                        {mentor.bio}
                      </p>

                      {/* Skill Tags */}
                      {mentor.skills && mentor.skills.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
                          {mentor.skills.map((skill, idx) => (
                            <span key={idx} style={{
                              background: '#fdf4ff',
                              color: '#9333ea',
                              border: '1px solid #f0abfc',
                              fontSize: '0.72rem',
                              fontWeight: '600',
                              padding: '0.15rem 0.5rem',
                              borderRadius: '4px'
                            }}>
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}

                      <div style={{
                        borderTop: '1px solid var(--border)',
                        paddingTop: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          <Clock size={14} />
                          <span>{mentor.availability || 'Weekdays 6:00 PM'}</span>
                        </div>

                        <button
                          onClick={() => openBookingModal(mentor)}
                          disabled={!eligible && !!user}
                          className="btn btn-primary"
                          style={{
                            padding: '0.45rem 0.95rem',
                            fontSize: '0.825rem',
                            background: eligible || !user ? 'var(--primary)' : '#94a3b8',
                            cursor: eligible || !user ? 'pointer' : 'not-allowed'
                          }}
                        >
                          {eligible || !user ? 'Book 1-on-1' : 'Juniors Only'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MY SESSIONS */}
        {activeTab === 'my-sessions' && (
          <div>
            {sessions.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                <Calendar size={48} color="#94a3b8" style={{ marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>No Active Bookings</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                  Browse through senior mentors and book your first 1-on-1 strategy session!
                </p>
                <button onClick={() => setActiveTab('browse')} className="btn btn-primary">
                  Find a Mentor
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {sessions.map((session) => {
                  const isMentorRole = user?._id === session.mentor?._id || user?.role === 'mentor' || user?.role === 'lecturer';
                  const partner = isMentorRole ? session.student : session.mentor;

                  return (
                    <div key={session._id} className="card" style={{ padding: '1.5rem' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                            <span className={`badge badge-${session.status}`}>
                              {session.status}
                            </span>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                              <Calendar size={15} /> {session.preferredDate} at {session.preferredTime}
                            </span>
                          </div>

                          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.35rem' }}>
                            {session.topic}
                          </h3>
                          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                            {session.message}
                          </p>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                            <img
                              src={partner?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                              alt="partner"
                              style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                            <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>
                              {isMentorRole ? `Junior Mentee: ${partner?.name} (${partner?.regNo})` : `Senior Mentor: ${partner?.name} (${partner?.year})`}
                            </span>
                          </div>
                        </div>

                        {/* Status Controls */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.6rem' }}>
                          {session.status === 'confirmed' && session.meetingLink && (
                            <a
                              href={session.meetingLink}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-primary"
                              style={{ padding: '0.45rem 0.85rem', fontSize: '0.825rem' }}
                            >
                              <Video size={16} /> Join Meeting
                            </a>
                          )}

                          {isMentorRole && session.status === 'pending' && (
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button
                                onClick={() => setActionModalSession(session)}
                                className="btn btn-success"
                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                              >
                                Accept & Link
                              </button>
                              <button
                                onClick={() => handleStatusUpdate('cancelled')}
                                className="btn btn-danger"
                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                              >
                                Decline
                              </button>
                            </div>
                          )}

                          {!isMentorRole && session.status === 'completed' && !session.feedback && (
                            <button
                              onClick={() => setFeedbackSession(session)}
                              className="btn btn-secondary"
                              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                            >
                              <Star size={14} color="#f59e0b" /> Rate Senior Mentor
                            </button>
                          )}

                          {session.status === 'pending' && (
                            <button
                              onClick={() => handleCancelSession(session._id)}
                              className="btn btn-secondary"
                              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', color: 'var(--danger)' }}
                            >
                              Cancel Request
                            </button>
                          )}

                          {session.rating && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: '#f59e0b', fontWeight: '700' }}>
                              <Star size={14} fill="#f59e0b" /> {session.rating} / 5 ({session.feedback})
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* BOOKING MODAL */}
      {isBookingModalOpen && selectedMentor && (
        <div className="modal-overlay" onClick={() => setIsBookingModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: '800' }}>Book Junior Guidance Session</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  With Senior Mentor {selectedMentor.name} ({selectedMentor.year})
                </p>
              </div>
              <button onClick={() => setIsBookingModalOpen(false)} style={{ color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleBookingSubmit}>
              <div className="form-group">
                <label className="form-label">Discussion Topic / Guidance Goal *</label>
                <input
                  type="text"
                  required
                  value={bookingData.topic}
                  onChange={(e) => setBookingData({ ...bookingData, topic: e.target.value })}
                  placeholder="e.g. SDE Resume Critique & 3rd-Year Internship Prep"
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Preferred Date *</label>
                  <input
                    type="date"
                    required
                    value={bookingData.preferredDate}
                    onChange={(e) => setBookingData({ ...bookingData, preferredDate: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Preferred Time *</label>
                  <input
                    type="text"
                    required
                    value={bookingData.preferredTime}
                    onChange={(e) => setBookingData({ ...bookingData, preferredTime: e.target.value })}
                    placeholder="e.g. 6:30 PM IST"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Details / Specific Questions for Senior *</label>
                <textarea
                  rows={3}
                  required
                  value={bookingData.message}
                  onChange={(e) => setBookingData({ ...bookingData, message: e.target.value })}
                  placeholder="Briefly describe what you would like your senior to guide you through..."
                  className="form-textarea"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsBookingModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="btn btn-primary"
                >
                  {bookingLoading ? 'Sending...' : 'Confirm Request to Senior'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MENTOR ACCEPT MODAL */}
      {actionModalSession && (
        <div className="modal-overlay" onClick={() => setActionModalSession(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '800', marginBottom: '1rem' }}>Accept Mentorship Session</h2>
            <div className="form-group">
              <label className="form-label">Meeting URL (Google Meet / Zoom) *</label>
              <input
                type="url"
                required
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                placeholder="https://meet.google.com/xyz-abcd-efg"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Prep Notes for Junior (Optional)</label>
              <textarea
                rows={2}
                value={mentorNotes}
                onChange={(e) => setMentorNotes(e.target.value)}
                placeholder="e.g. Please bring your updated GitHub links and resume draft."
                className="form-textarea"
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button onClick={() => setActionModalSession(null)} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={() => handleStatusUpdate('confirmed')} className="btn btn-success">
                Confirm & Send Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STUDENT FEEDBACK MODAL */}
      {feedbackSession && (
        <div className="modal-overlay" onClick={() => setFeedbackSession(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '800', marginBottom: '1rem' }}>Rate Mentorship Session</h2>
            <form onSubmit={handleFeedbackSubmit}>
              <div className="form-group">
                <label className="form-label">Rating (1 to 5 Stars)</label>
                <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="form-select">
                  <option value={5}>⭐⭐⭐⭐⭐ 5 - Extremely Helpful</option>
                  <option value={4}>⭐⭐⭐⭐ 4 - Good Session</option>
                  <option value={3}>⭐⭐⭐ 3 - Average</option>
                  <option value={2}>⭐⭐ 2 - Needs Improvement</option>
                  <option value={1}>⭐ 1 - Not Helpful</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Feedback for Senior</label>
                <textarea
                  rows={3}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Share how this senior session helped you..."
                  className="form-textarea"
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setFeedbackSession(null)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mentorship;
