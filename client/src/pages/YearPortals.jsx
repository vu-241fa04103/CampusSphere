import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Folder,
  FolderLock,
  Lock,
  Unlock,
  BookOpen,
  FileText,
  FileCheck,
  Presentation,
  Download,
  ExternalLink,
  Plus,
  X,
  Search,
  Filter,
  AlertTriangle,
  GraduationCap,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

const YEAR_PORTALS_CONFIG = [
  {
    yearNum: 1,
    title: '1st Year Academic Portal',
    series: '261FA0... Series',
    semesters: 'Semesters 1 & 2',
    color: '#0ea5e9',
    bgColor: '#f0f9ff',
    borderColor: '#bae6fd',
    description: 'Foundational engineering subjects: C-Programming, Engineering Physics, Chemistry, Calculus & Basic Electrical.'
  },
  {
    yearNum: 2,
    title: '2nd Year Academic Portal',
    series: '251FA0... Series',
    semesters: 'Semesters 3 & 4',
    color: '#10b981',
    bgColor: '#ecfdf5',
    borderColor: '#a7f3d0',
    description: 'Core departmental subjects: Data Structures, Discrete Mathematics, Digital Logic, OOP in Java, and DBMS fundamentals.'
  },
  {
    yearNum: 3,
    title: '3rd Year Academic Portal',
    series: '241FA0... Series',
    semesters: 'Semesters 5 & 6',
    color: '#f59e0b',
    bgColor: '#fffbeb',
    borderColor: '#fde68a',
    description: 'Advanced systems: Operating Systems, Computer Networks, Theory of Computation, AI/ML, and Software Engineering.'
  },
  {
    yearNum: 4,
    title: '4th Year & Placement Vault',
    series: '231FA0... / 221FA0... Series',
    semesters: 'Semesters 7 & 8',
    color: '#8b5cf6',
    bgColor: '#fdf4ff',
    borderColor: '#f0abfc',
    description: 'Capstones & placements: System Design decks, Distributed Systems, Cloud Architecture, and SDE Interview Question Banks.'
  }
];

const YearPortals = () => {
  const { user, isAuthenticated, canAccessYear } = useAuth();
  const [selectedYear, setSelectedYear] = useState(3); // Defaults to 3rd year (user prompt example)
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  // Upload modal state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadFormData, setUploadFormData] = useState({
    title: '',
    description: '',
    subject: '',
    department: 'Computer Science',
    semester: 5,
    targetYear: 3,
    resourceType: 'Question Paper',
    fileUrl: '',
    tags: ''
  });
  const [uploadSubmitting, setUploadSubmitting] = useState(false);
  const [restrictionModalInfo, setRestrictionModalInfo] = useState(null);

  // Fetch resources for active year
  const fetchCohortResources = async (yearNum) => {
    try {
      setLoading(true);
      const res = await api.get('/resources', {
        params: {
          targetYear: yearNum,
          resourceType: activeCategory !== 'All' ? activeCategory : undefined,
          search: search || undefined
        }
      });
      if (res.data.success) {
        setResources(res.data.resources);
      }
    } catch (err) {
      console.error('Error fetching cohort resources:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCohortResources(selectedYear);
  }, [selectedYear, activeCategory]);

  const handlePortalClick = (portal) => {
    const isUnlocked = canAccessYear(portal.yearNum);

    if (!isUnlocked) {
      setRestrictionModalInfo(portal);
      return;
    }

    setSelectedYear(portal.yearNum);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCohortResources(selectedYear);
  };

  // Open Upload Modal
  const openUploadModal = () => {
    if (!isAuthenticated) {
      alert('Please sign in or use 1-Click Demo to share study materials.');
      return;
    }

    const defaultSemester = selectedYear * 2 - 1;
    setUploadFormData({
      title: '',
      description: '',
      subject: '',
      department: user?.department || 'Computer Science',
      semester: defaultSemester,
      targetYear: selectedYear,
      resourceType: 'Question Paper',
      fileUrl: '',
      tags: ''
    });
    setIsUploadOpen(true);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    setUploadSubmitting(true);

    try {
      const res = await api.post('/resources', uploadFormData);
      if (res.data.success) {
        setIsUploadOpen(false);
        alert(res.data.message || 'Material uploaded to portal successfully!');
        fetchCohortResources(selectedYear);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to upload material');
    } finally {
      setUploadSubmitting(false);
    }
  };

  const selectedPortalConfig = YEAR_PORTALS_CONFIG.find(p => p.yearNum === selectedYear);

  return (
    <div style={{ padding: '2.5rem 0' }}>
      <div className="container">
        {/* Page Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
            <span className="badge badge-student" style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}>
              University Reg. Series Access Protocol
            </span>
            {user && (
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Active Session: <strong>{user.name}</strong> ({user.role.toUpperCase()} • Reg No: <strong>{user.regNo}</strong>)
              </span>
            )}
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
            Cohort Year Portals & Academic Vaults
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '850px' }}>
            Seniors and Lecturers can access junior student portals to share previous year question papers, lecture notes, PPT presentations, and important PDF files.
          </p>
        </div>

        {/* 4 YEAR COHORT CARDS GRID */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.25rem',
          marginBottom: '3rem'
        }}>
          {YEAR_PORTALS_CONFIG.map((portal) => {
            const isUnlocked = canAccessYear(portal.yearNum);
            const isCurrent = selectedYear === portal.yearNum;

            return (
              <div
                key={portal.yearNum}
                onClick={() => handlePortalClick(portal)}
                className="card"
                style={{
                  padding: '1.5rem',
                  cursor: isUnlocked ? 'pointer' : 'not-allowed',
                  border: isCurrent ? `2px solid ${portal.color}` : '1px solid var(--border)',
                  background: isCurrent ? portal.bgColor : '#ffffff',
                  opacity: isUnlocked ? 1 : 0.75,
                  position: 'relative',
                  transition: 'all 0.2s ease',
                  transform: isCurrent ? 'translateY(-3px)' : 'none'
                }}
              >
                {/* Lock / Unlock Icon Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: portal.bgColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `1px solid ${portal.borderColor}`
                  }}>
                    {isUnlocked ? (
                      <Unlock size={20} color={portal.color} />
                    ) : (
                      <Lock size={20} color="#ef4444" />
                    )}
                  </div>

                  <span style={{
                    fontSize: '0.725rem',
                    fontWeight: '700',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '9999px',
                    background: isUnlocked ? '#ecfdf5' : '#fef2f2',
                    color: isUnlocked ? '#047857' : '#b91c1c',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}>
                    {isUnlocked ? '✓ Accessible' : '🔒 Locked'}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '0.25rem' }}>
                  {portal.title}
                </h3>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: portal.color, display: 'block', marginBottom: '0.5rem' }}>
                  {portal.series}
                </span>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  {portal.semesters}
                </p>
              </div>
            );
          })}
        </div>

        {/* ACTIVE PORTAL CONTENT VAULT */}
        {selectedPortalConfig && (
          <div className="card" style={{ padding: '2rem', marginBottom: '3rem' }}>
            {/* Vault Header */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              marginBottom: '2rem',
              borderBottom: '1px solid var(--border)',
              paddingBottom: '1.5rem'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                  <span style={{
                    background: selectedPortalConfig.bgColor,
                    color: selectedPortalConfig.color,
                    padding: '0.2rem 0.6rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: '800',
                    border: `1px solid ${selectedPortalConfig.borderColor}`
                  }}>
                    {selectedPortalConfig.series}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {selectedPortalConfig.semesters}
                  </span>
                </div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: '800' }}>
                  {selectedPortalConfig.title} Vault
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  {selectedPortalConfig.description}
                </p>
              </div>

              {/* Upload to this cohort button */}
              <button
                onClick={openUploadModal}
                className="btn btn-primary"
                style={{ padding: '0.65rem 1.25rem' }}
              >
                <Plus size={18} /> Share File into Year {selectedYear}
              </button>
            </div>

            {/* Category Filter Pills */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem',
              marginBottom: '1.75rem'
            }}>
              {[
                { name: 'All', label: 'All Materials' },
                { name: 'Question Paper', label: '📝 Question Papers' },
                { name: 'Lecture Notes', label: '✍️ Handwritten Notes' },
                { name: 'Presentation / PPT', label: '📽️ Presentations (PPT)' },
                { name: 'Important PDF', label: '📑 Important PDFs' },
                { name: 'Lab Manual', label: '🧪 Lab Manuals' }
              ].map(cat => (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name)}
                  style={{
                    padding: '0.45rem 0.95rem',
                    fontSize: '0.825rem',
                    fontWeight: '700',
                    borderRadius: '9999px',
                    background: activeCategory === cat.name ? 'var(--primary)' : '#f1f5f9',
                    color: activeCategory === cat.name ? '#ffffff' : 'var(--text-main)',
                    border: '1px solid transparent',
                    transition: 'all 0.2s'
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Resources List */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
                <p>Loading Year {selectedYear} documents & files...</p>
              </div>
            ) : resources.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3.5rem 1rem', background: '#f8fafc', borderRadius: 'var(--radius-sm)' }}>
                <FileText size={42} color="#94a3b8" style={{ marginBottom: '0.75rem' }} />
                <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.4rem' }}>
                  No materials found under this category
                </h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                  Seniors and lecturers can upload the first question paper, notes, or PPT for this cohort!
                </p>
                <button onClick={openUploadModal} className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
                  <Plus size={16} /> Upload Now
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {resources.map((item) => {
                  const isFaculty = item.isFacultyVerified || item.uploaderRole === 'lecturer';
                  const isSeniorShared = item.uploaderRole === 'mentor';

                  return (
                    <div
                      key={item._id}
                      style={{
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '1.25rem',
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '1rem',
                        background: '#ffffff'
                      }}
                    >
                      <div style={{ flexGrow: 1, minWidth: '280px' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                          <span className="badge" style={{
                            background: item.resourceType.includes('PPT') ? '#fef3c7' : item.resourceType.includes('Paper') ? '#fee2e2' : '#e0e7ff',
                            color: item.resourceType.includes('PPT') ? '#92400e' : item.resourceType.includes('Paper') ? '#991b1b' : '#3730a3',
                            fontSize: '0.725rem'
                          }}>
                            {item.resourceType}
                          </span>

                          {isFaculty && (
                            <span className="badge" style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0' }}>
                              <ShieldCheck size={13} /> Faculty Verified
                            </span>
                          )}

                          {isSeniorShared && (
                            <span className="badge" style={{ background: '#fdf4ff', color: '#86198f', border: '1px solid #f0abfc' }}>
                              <GraduationCap size={13} /> Senior Shared
                            </span>
                          )}

                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Sem {item.semester} • {item.department}
                          </span>
                        </div>

                        <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.3rem', color: 'var(--text-main)' }}>
                          {item.title}
                        </h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: '0.5rem' }}>
                          {item.description}
                        </p>

                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Contributed by: <strong>{item.uploaderName}</strong>
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <a
                          href={item.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-primary"
                          style={{ padding: '0.45rem 0.95rem', fontSize: '0.825rem' }}
                        >
                          <ExternalLink size={15} /> Open / Download
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ACCESS RESTRICTION MODAL */}
      {restrictionModalInfo && (
        <div className="modal-overlay" onClick={() => setRestrictionModalInfo(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: '#fef2f2',
                color: '#ef4444',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <Lock size={30} />
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '0.5rem' }}>
                Access Restricted: Senior Portal
              </h2>
              <p style={{ fontSize: '0.925rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Under university guidelines, junior students cannot access higher senior portals ({restrictionModalInfo.title} – {restrictionModalInfo.series}).
              </p>

              <div style={{
                background: '#f8fafc',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '1rem',
                textAlign: 'left',
                fontSize: '0.825rem',
                color: 'var(--text-main)',
                marginBottom: '1.5rem'
              }}>
                <p style={{ fontWeight: '700', marginBottom: '0.35rem' }}>Access Rules in CampusSphere:</p>
                <ul style={{ paddingLeft: '1.25rem', lineHeight: 1.6 }}>
                  <li><strong>Seniors & Alumni (231FA0...)</strong>: Can access 4th, 3rd, 2nd, and 1st year portals.</li>
                  <li><strong>3rd Years (241FA0...)</strong>: Can access 3rd, 2nd, and 1st year portals. Cannot access 4th year vault.</li>
                  <li><strong>Juniors (251FA0..., 261FA0...)</strong>: Restricted from senior vaults.</li>
                  <li><strong>Faculty Lecturers</strong>: Have unrestricted access across all student cohorts.</li>
                </ul>
              </div>

              <button
                onClick={() => setRestrictionModalInfo(null)}
                className="btn btn-secondary"
                style={{ width: '100%', padding: '0.65rem' }}
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD MODAL INTO COHORT */}
      {isUploadOpen && (
        <div className="modal-overlay" onClick={() => setIsUploadOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: '800' }}>
                  Share into Year {selectedYear} Portal
                </h2>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                  Sharing materials with the junior cohort ({selectedPortalConfig?.series})
                </p>
              </div>
              <button onClick={() => setIsUploadOpen(false)} style={{ color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit}>
              <div className="form-group">
                <label className="form-label">Document Title *</label>
                <input
                  type="text"
                  required
                  value={uploadFormData.title}
                  onChange={(e) => setUploadFormData({ ...uploadFormData, title: e.target.value })}
                  placeholder="e.g. Operating Systems Previous End-Sem Solved Question Papers"
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Subject *</label>
                  <input
                    type="text"
                    required
                    value={uploadFormData.subject}
                    onChange={(e) => setUploadFormData({ ...uploadFormData, subject: e.target.value })}
                    placeholder="e.g. Operating Systems"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    value={uploadFormData.resourceType}
                    onChange={(e) => setUploadFormData({ ...uploadFormData, resourceType: e.target.value })}
                    className="form-select"
                  >
                    <option value="Question Paper">📝 Question Paper</option>
                    <option value="Lecture Notes">✍️ Handwritten Notes</option>
                    <option value="Presentation / PPT">📽️ Presentation / PPT</option>
                    <option value="Important PDF">📑 Important PDF</option>
                    <option value="Lab Manual">🧪 Lab Manual</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.7fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Department *</label>
                  <select
                    value={uploadFormData.department}
                    onChange={(e) => setUploadFormData({ ...uploadFormData, department: e.target.value })}
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
                    value={uploadFormData.semester}
                    onChange={(e) => setUploadFormData({ ...uploadFormData, semester: Number(e.target.value) })}
                    className="form-select"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                      <option key={s} value={s}>Semester {s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Google Drive / File Link (PDF/PPT/DOC) *</label>
                <input
                  type="url"
                  required
                  value={uploadFormData.fileUrl}
                  onChange={(e) => setUploadFormData({ ...uploadFormData, fileUrl: e.target.value })}
                  placeholder="https://drive.google.com/... or direct PDF link"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description / Exam Tips</label>
                <textarea
                  rows={3}
                  value={uploadFormData.description}
                  onChange={(e) => setUploadFormData({ ...uploadFormData, description: e.target.value })}
                  placeholder="Add important tips, solved year details, or exam guidelines..."
                  className="form-textarea"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setIsUploadOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={uploadSubmitting} className="btn btn-primary">
                  {uploadSubmitting ? 'Uploading...' : 'Publish to Junior Portal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default YearPortals;
