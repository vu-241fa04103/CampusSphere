import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  BookOpen,
  Search,
  Filter,
  Plus,
  ThumbsUp,
  Download,
  ExternalLink,
  Edit2,
  Trash2,
  Tag,
  AlertCircle,
  X,
  FileText
} from 'lucide-react';

const Resources = () => {
  const { user, isAuthenticated } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All');
  const [semester, setSemester] = useState('All');
  const [resourceType, setResourceType] = useState('All');

  // Modal states
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    department: 'Computer Science',
    semester: 3,
    resourceType: 'Lecture Notes',
    fileUrl: '',
    tags: ''
  });
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Fetch resources
  const fetchResources = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (department !== 'All') params.department = department;
      if (semester !== 'All') params.semester = semester;
      if (resourceType !== 'All') params.resourceType = resourceType;

      const res = await api.get('/resources', { params });
      if (res.data.success) {
        setResources(res.data.resources);
      }
    } catch (err) {
      console.error('Error fetching resources:', err);
      setError('Could not connect to backend server. Make sure MongoDB and server are running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [department, semester, resourceType]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchResources();
  };

  // Upvote resource
  const handleUpvote = async (id) => {
    if (!isAuthenticated) {
      alert('Please sign in or use 1-Click Demo to upvote resources.');
      return;
    }

    try {
      const res = await api.post(`/resources/${id}/upvote`);
      if (res.data.success) {
        setResources(prev =>
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
      console.error('Error upvoting:', err);
    }
  };

  // Download / Open Link
  const handleDownload = async (resource) => {
    try {
      await api.post(`/resources/${resource._id}/download`);
      setResources(prev =>
        prev.map(item => item._id === resource._id ? { ...item, downloadsCount: item.downloadsCount + 1 } : item)
      );
      window.open(resource.fileUrl, '_blank');
    } catch (err) {
      window.open(resource.fileUrl, '_blank');
    }
  };

  // Open Create / Edit Modal
  const openModal = (resourceToEdit = null) => {
    if (!isAuthenticated) {
      alert('Please login or use 1-Click Demo to upload resources.');
      return;
    }

    if (resourceToEdit) {
      setEditingResource(resourceToEdit);
      setFormData({
        title: resourceToEdit.title,
        description: resourceToEdit.description,
        subject: resourceToEdit.subject,
        department: resourceToEdit.department,
        semester: resourceToEdit.semester,
        resourceType: resourceToEdit.resourceType,
        fileUrl: resourceToEdit.fileUrl,
        tags: resourceToEdit.tags?.join(', ') || ''
      });
    } else {
      setEditingResource(null);
      setFormData({
        title: '',
        description: '',
        subject: '',
        department: user?.department || 'Computer Science',
        semester: 3,
        resourceType: 'Lecture Notes',
        fileUrl: '',
        tags: ''
      });
    }
    setIsUploadModalOpen(true);
  };

  // Submit Modal Form (Create or Update)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);

    try {
      if (editingResource) {
        // UPDATE (PUT)
        const res = await api.put(`/resources/${editingResource._id}`, formData);
        if (res.data.success) {
          setIsUploadModalOpen(false);
          fetchResources();
        }
      } else {
        // CREATE (POST)
        const res = await api.post('/resources', formData);
        if (res.data.success) {
          setIsUploadModalOpen(false);
          fetchResources();
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save resource.');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Delete Resource
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;

    try {
      const res = await api.delete(`/resources/${id}`);
      if (res.data.success) {
        setResources(prev => prev.filter(item => item._id !== id));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete resource');
    }
  };

  return (
    <div style={{ padding: '2.5rem 0' }}>
      <div className="container">
        {/* Header & Upload CTA */}
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
              <BookOpen size={28} color="var(--primary)" /> Academic Notes & Resources
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Discover, upload, and review verified lecture notes, question papers, and lab manuals.
            </p>
          </div>

          <button
            onClick={() => openModal()}
            className="btn btn-primary"
            style={{ padding: '0.75rem 1.4rem' }}
          >
            <Plus size={18} /> Upload Study Material
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="card" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
          <form onSubmit={handleSearchSubmit} style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            alignItems: 'end'
          }}>
            <div>
              <label className="form-label">Search Keyword</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Subject, topic, or tag..."
                  className="form-input"
                  style={{ paddingLeft: '2.2rem' }}
                />
                <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <div>
              <label className="form-label">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="form-select"
              >
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
              <label className="form-label">Semester</label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="form-select"
              >
                <option value="All">All Semesters</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                  <option key={s} value={s}>Semester {s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">Material Type</label>
              <select
                value={resourceType}
                onChange={(e) => setResourceType(e.target.value)}
                className="form-select"
              >
                <option value="All">All Categories</option>
                <option value="Lecture Notes">Lecture Notes</option>
                <option value="Question Paper">Question Paper</option>
                <option value="Lab Manual">Lab Manual</option>
                <option value="Cheat Sheet">Cheat Sheet</option>
                <option value="Project Code">Project Code</option>
                <option value="Reference Book">Reference Book</option>
              </select>
            </div>

            <button type="submit" className="btn btn-secondary" style={{ height: '42px' }}>
              <Filter size={16} /> Filter Results
            </button>
          </form>
        </div>

        {/* Resources Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
            <p>Loading study materials from database...</p>
          </div>
        ) : resources.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <FileText size={48} color="#94a3b8" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>No Resources Found</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Be the first student to upload study notes for this subject or try adjusting your filter!
            </p>
            <button onClick={() => openModal()} className="btn btn-primary">
              <Plus size={16} /> Upload Now
            </button>
          </div>
        ) : (
          <div className="grid-cards">
            {resources.map((item) => {
              const currentUserId = user?._id || user?.id;
              const isOwner = user && (
                item.uploadedBy?._id === currentUserId ||
                item.uploadedBy === currentUserId ||
                user.role === 'admin'
              );
              const hasUpvoted = user && item.upvotes?.some(uId => (uId._id || uId) === currentUserId);

              return (
                <div key={item._id} className="card" style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem' }}>
                  {/* Category & Semester Badges */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{
                      background: 'var(--primary-light)',
                      color: 'var(--primary)',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '6px'
                    }}>
                      {item.resourceType}
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)' }}>
                      Sem {item.semester} • {item.department}
                    </span>
                  </div>

                  {/* Title & Subject */}
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '700', lineHeight: 1.4, marginBottom: '0.4rem', color: 'var(--text-main)' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--secondary)', marginBottom: '0.75rem' }}>
                    📖 {item.subject}
                  </p>

                  {/* Description */}
                  <p style={{
                    fontSize: '0.875rem',
                    color: 'var(--text-muted)',
                    lineHeight: 1.5,
                    marginBottom: '1rem',
                    flexGrow: 1,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {item.description}
                  </p>

                  {/* Tags */}
                  {item.tags && item.tags.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
                      {item.tags.map((tag, idx) => (
                        <span key={idx} style={{
                          background: '#f1f5f9',
                          color: '#475569',
                          fontSize: '0.7rem',
                          fontWeight: '600',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '4px'
                        }}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Uploader Meta & Action Buttons */}
                  <div style={{
                    borderTop: '1px solid var(--border)',
                    paddingTop: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      By {item.uploaderName || item.uploadedBy?.name || 'Student'}
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {/* Upvote Button */}
                      <button
                        onClick={() => handleUpvote(item._id)}
                        className="btn"
                        style={{
                          padding: '0.35rem 0.65rem',
                          fontSize: '0.8rem',
                          background: hasUpvoted ? 'var(--primary-light)' : '#f8fafc',
                          color: hasUpvoted ? 'var(--primary)' : 'var(--text-muted)',
                          border: '1px solid var(--border)'
                        }}
                        title="Upvote helpful notes"
                      >
                        <ThumbsUp size={14} />
                        <span>{item.upvotes?.length || 0}</span>
                      </button>

                      {/* Download Link */}
                      <button
                        onClick={() => handleDownload(item)}
                        className="btn btn-primary"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                        title="Open / Download"
                      >
                        <ExternalLink size={14} /> View
                      </button>

                      {/* Owner CRUD actions */}
                      {isOwner && (
                        <>
                          <button
                            onClick={() => openModal(item)}
                            className="btn btn-secondary"
                            style={{ padding: '0.35rem 0.5rem' }}
                            title="Edit Resource"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="btn btn-danger"
                            style={{ padding: '0.35rem 0.5rem' }}
                            title="Delete Resource"
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Upload / Edit Modal */}
      {isUploadModalOpen && (
        <div className="modal-overlay" onClick={() => setIsUploadModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800' }}>
                {editingResource ? 'Edit Study Material' : 'Upload Academic Resource'}
              </h2>
              <button onClick={() => setIsUploadModalOpen(false)} style={{ color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label className="form-label">Resource Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Unit 3 Dynamic Programming Handcrafted Notes"
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
                    placeholder="e.g. Data Structures"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Material Type *</label>
                  <select
                    value={formData.resourceType}
                    onChange={(e) => setFormData({ ...formData, resourceType: e.target.value })}
                    className="form-select"
                  >
                    <option value="Lecture Notes">Lecture Notes</option>
                    <option value="Question Paper">Question Paper</option>
                    <option value="Lab Manual">Lab Manual</option>
                    <option value="Cheat Sheet">Cheat Sheet</option>
                    <option value="Project Code">Project Code</option>
                    <option value="Reference Book">Reference Book</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.7fr', gap: '1rem' }}>
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
                <div className="form-group">
                  <label className="form-label">Semester *</label>
                  <select
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })}
                    className="form-select"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                      <option key={s} value={s}>Semester {s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">File Link / Google Drive URL *</label>
                <input
                  type="url"
                  required
                  value={formData.fileUrl}
                  onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                  placeholder="https://drive.google.com/... or PDF URL"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tags (Comma separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="DSA, EndSem, Important, Trees"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Brief Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Explain what topics are covered in this material..."
                  className="form-textarea"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="btn btn-primary"
                >
                  {formSubmitting ? 'Saving...' : editingResource ? 'Save Changes' : 'Upload Resource'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Resources;
