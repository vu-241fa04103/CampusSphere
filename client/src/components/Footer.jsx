import React from 'react';
import { Heart, Github, GraduationCap } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      background: '#ffffff',
      padding: '2.5rem 0',
      marginTop: 'auto'
    }}>
      <div className="container" style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            background: 'var(--primary)',
            color: '#fff',
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <GraduationCap size={18} />
          </div>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: '800' }}>CampusSphere</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Built for MERN Stack Web Development Training Program
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          <span>Powered by MongoDB • Express.js • React.js • Node.js</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
            Team CodeCraft © 2026
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
