import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { User, Mail, Hash, BookOpen, Star, CheckCircle, Edit3 } from 'lucide-react';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    skills: user?.skills?.join(', ') || '',
    availability: user?.availability || '',
    department: user?.department || 'Computer Science'
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0' }}>
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const res = await api.put('/auth/profile', formData);
      if (res.data.success) {
        updateUser(res.data.user);
        setIsEditing(false);
        setMessage('Profile updated successfully!');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: '3rem 0' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="card" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
          {/* Header Info */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={user.name}
              style={{
                width: '90px',
                height: '90px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid var(--primary-light)',
                boxShadow: 'var(--shadow-sm)'
              }}
            />
            <div style={{ flexGrow: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>{user.name}</h1>
                <span className={`badge ${user.role === 'mentor' ? 'badge-mentor' : 'badge-student'}`}>
                  {user.role}
                </span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                {user.department} • {user.year || '3rd Year'}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Mail size={15} /> {user.email}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Hash size={15} /> Reg No: <strong>{user.regNo}</strong>
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="btn btn-secondary"
              style={{ padding: '0.5rem 1rem' }}
            >
              <Edit3 size={16} /> {isEditing ? 'Cancel Edit' : 'Edit Profile'}
            </button>
          </div>

          {message && (
            <div style={{
              background: 'var(--success-bg)',
              color: 'var(--success)',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.875rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <CheckCircle size={16} />
              <span>{message}</span>
            </div>
          )}

          {/* Edit Form or View Details */}
          {isEditing ? (
            <form onSubmit={handleUpdate} style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Short Bio</label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="form-textarea"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Skills / Expertise (Comma separated)</label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  placeholder="React.js, Node.js, DSA, System Design"
                  className="form-input"
                />
              </div>

              {user.role === 'mentor' && (
                <div className="form-group">
                  <label className="form-label">Weekly Availability</label>
                  <input
                    type="text"
                    value={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                    placeholder="e.g. Weekdays 6:00 PM - 8:00 PM IST"
                    className="form-input"
                  />
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setIsEditing(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn btn-primary">
                  {saving ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          ) : (
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.4rem' }}>About</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', lineHeight: 1.6 }}>
                  {user.bio || 'No bio written yet. Click Edit Profile to tell classmates about yourself!'}
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.6rem' }}>Skills & Interests</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {user.skills && user.skills.length > 0 ? (
                    user.skills.map((skill, idx) => (
                      <span key={idx} style={{
                        background: 'var(--primary-light)',
                        color: 'var(--primary)',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.8rem',
                        fontWeight: '600'
                      }}>
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>None listed</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
