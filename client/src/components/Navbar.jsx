import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  BookOpen,
  Users,
  MessageSquare,
  User,
  LogOut,
  LogIn,
  UserPlus,
  Sparkles,
  FolderLock,
  Layers,
  Shield,
  Briefcase
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Determine dedicated portal link for current user
  let dedicatedPortalPath = '/student-portal';
  let dedicatedPortalLabel = 'Student Portal';
  let dedicatedPortalIcon = <GraduationCap size={16} />;

  if (user?.role === 'mentor') {
    dedicatedPortalPath = '/mentor-portal';
    dedicatedPortalLabel = 'Mentor Portal';
    dedicatedPortalIcon = <Shield size={16} />;
  } else if (user?.role === 'lecturer' || user?.role === 'admin') {
    dedicatedPortalPath = '/faculty-portal';
    dedicatedPortalLabel = 'Faculty Portal';
    dedicatedPortalIcon = <Briefcase size={16} />;
  }

  return (
    <nav style={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px'
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
          <div style={{
            background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
            color: '#fff',
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(79, 70, 229, 0.3)'
          }}>
            <GraduationCap size={24} />
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
              Campus<span style={{ color: 'var(--primary)' }}>Sphere</span>
            </span>
            <span style={{ display: 'block', fontSize: '0.68rem', fontWeight: '700', color: 'var(--primary)', lineHeight: 1 }}>
              SERIES HIERARCHY & CURRICULUM
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }} className="desktop-links">
          {/* Highlighted Dedicated Portal Link */}
          {isAuthenticated && (
            <Link
              to={dedicatedPortalPath}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontWeight: '800',
                fontSize: '0.9rem',
                color: '#ffffff',
                background: user?.role === 'lecturer' ? '#0284c7' : user?.role === 'mentor' ? '#9333ea' : 'var(--primary)',
                padding: '0.45rem 0.9rem',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}
            >
              {dedicatedPortalIcon}
              <span>{dedicatedPortalLabel}</span>
            </Link>
          )}

          <Link
            to="/portals"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontWeight: '700',
              fontSize: '0.9rem',
              color: isActive('/portals') ? 'var(--primary)' : 'var(--text-main)',
              background: isActive('/portals') ? 'var(--primary-light)' : 'transparent',
              padding: '0.35rem 0.75rem',
              borderRadius: '6px'
            }}
          >
            <Layers size={18} /> Year Portals
          </Link>

          <Link
            to="/resources"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontWeight: '600',
              fontSize: '0.9rem',
              color: isActive('/resources') ? 'var(--primary)' : 'var(--text-muted)'
            }}
          >
            <BookOpen size={18} /> All Notes
          </Link>

          <Link
            to="/mentorship"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontWeight: '600',
              fontSize: '0.9rem',
              color: isActive('/mentorship') ? 'var(--primary)' : 'var(--text-muted)'
            }}
          >
            <Users size={18} /> Mentorship
          </Link>

          <Link
            to="/doubts"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontWeight: '600',
              fontSize: '0.9rem',
              color: isActive('/doubts') ? 'var(--primary)' : 'var(--text-muted)'
            }}
          >
            <MessageSquare size={18} /> Doubt Forum
          </Link>
        </div>

        {/* Auth / Profile Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {isAuthenticated && user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  alt={user.name}
                  style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary-light)' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)' }}>{user.name}</span>
                  <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                    <span className={`badge ${user.role === 'lecturer' ? 'badge-confirmed' : user.role === 'mentor' ? 'badge-mentor' : 'badge-student'}`} style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                      {user.role === 'lecturer' ? 'FACULTY' : user.year}
                    </span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                      ({user.department?.split(' ')[0]})
                    </span>
                  </div>
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="btn btn-secondary"
                style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem' }}
                title="Log out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-primary" style={{ padding: '0.45rem 0.95rem', fontSize: '0.85rem' }}>
                <LogIn size={15} /> 3-Way Portal Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
