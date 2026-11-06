import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  Users,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  FileText,
  Star
} from 'lucide-react';

const Home = () => {
  const { isAuthenticated, oneClickLogin } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(180deg, #f1f5f9 0%, #f8fafc 100%)',
        padding: '5rem 0 4rem 0',
        textAlign: 'center'
      }}>
        <div className="container" style={{ maxWidth: '850px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            padding: '0.4rem 1rem',
            borderRadius: '9999px',
            fontSize: '0.85rem',
            fontWeight: '700',
            marginBottom: '1.5rem'
          }}>
            <Sparkles size={16} /> MERN Stack Full-Stack Academic Solution
          </div>

          <h1 style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
            fontWeight: '800',
            lineHeight: 1.15,
            color: 'var(--text-main)',
            letterSpacing: '-1px',
            marginBottom: '1.25rem'
          }}>
            Campus Learning & Peer Mentorship, <span style={{
              background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>All In One Place</span>
          </h1>

          <p style={{
            fontSize: '1.15rem',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            marginBottom: '2.5rem'
          }}>
            Access verified lecture notes and past question papers, book 1-on-1 guidance sessions with senior mentors, and get your academic doubts resolved collaboratively.
          </p>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '1rem'
          }}>
            <Link to="/resources" className="btn btn-primary" style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}>
              <BookOpen size={20} /> Browse Study Notes <ArrowRight size={18} />
            </Link>
            <Link to="/mentorship" className="btn btn-secondary" style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}>
              <Users size={20} /> Find a Senior Mentor
            </Link>
          </div>

          {/* Quick Metrics */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1.5rem',
            marginTop: '4rem',
            padding: '1.5rem',
            background: '#ffffff',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--primary)' }}>500+</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Academic Resources</p>
            </div>
            <div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--secondary)' }}>80+</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Senior Peer Mentors</p>
            </div>
            <div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#10b981' }}>95%</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Queries Resolved</p>
            </div>
            <div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--accent)' }}>6+</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Engineering Branches</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillar Cards */}
      <section style={{ padding: '4.5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>
              Everything Students Need to Succeed
            </h2>
            <p style={{ color: 'var(--text-muted)' }}>
              Built specifically to eliminate scattered WhatsApp links and streamline peer knowledge sharing.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem'
          }}>
            {/* Card 1 */}
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                <FileText size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.75rem' }}>
                Organized Resource Hub
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Upload, search, and download verified handwritten notes, solved end-sem question papers, and lab manuals filtered by department & semester.
              </p>
              <Link to="/resources" style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                Explore Library <ArrowRight size={16} />
              </Link>
            </div>

            {/* Card 2 */}
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{
                background: '#fdf4ff',
                color: '#9333ea',
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                <Users size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.75rem' }}>
                1-on-1 Peer Mentorship
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Connect directly with seniors and alumni for mock technical interviews, resume critique, capstone project advice, and branch-specific guidance.
              </p>
              <Link to="/mentorship" style={{ color: '#9333ea', fontWeight: '700', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                Schedule Guidance <ArrowRight size={16} />
              </Link>
            </div>

            {/* Card 3 */}
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{
                background: '#ecfdf5',
                color: '#059669',
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                <MessageSquare size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.75rem' }}>
                Doubt Clearance Forum
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Post academic doubts with subject tags. Receive peer solutions, upvote the most helpful explanations, and mark questions as resolved.
              </p>
              <Link to="/doubts" style={{ color: '#059669', fontWeight: '700', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                Join Discussion <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
