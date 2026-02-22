import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidenav = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLinkClick = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="sidenav-backdrop" 
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 990,
        }}
      />
      
      {/* Sidenav */}
      <aside className="sidenav" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        width: '280px',
        backgroundColor: 'var(--bg-primary)',
        zIndex: 1000,
        transform: 'translateX(0)',
        transition: 'transform 0.3s ease',
        overflowY: 'auto',
        boxShadow: '2px 0 8px rgba(0, 0, 0, 0.15)',
      }}>
        <div style={{ padding: '1rem' }}>
          {/* Close button */}
          <button 
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '0.75rem',
              right: '0.75rem',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              color: 'var(--text-secondary)',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          {/* User section */}
          {user ? (
            <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img 
                  src={user.avatar || 'https://i.pravatar.cc/150?u=default'} 
                  alt={user.username}
                  style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{user.name}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>@{user.username}</div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                Sign in to your account
              </div>
              <Link 
                to="/login" 
                onClick={handleLinkClick}
                className="btn btn-secondary" 
                style={{ width: '100%', marginBottom: '0.5rem', display: 'block', textAlign: 'center' }}
              >
                Log in
              </Link>
              <Link 
                to="/register" 
                onClick={handleLinkClick}
                className="btn btn-primary" 
                style={{ width: '100%', display: 'block', textAlign: 'center' }}
              >
                Sign up
              </Link>
            </div>
          )}

          {/* Navigation */}
          <nav>
            <ul style={{ listStyle: 'none' }}>
              <li style={{ marginBottom: '0.25rem' }}>
                <Link 
                  to="/" 
                  onClick={handleLinkClick}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.625rem 0.75rem',
                    borderRadius: 'var(--border-radius)',
                    color: isActive('/') ? 'var(--primary-color)' : 'var(--text-primary)',
                    backgroundColor: isActive('/') ? 'rgba(59, 73, 223, 0.1)' : 'transparent',
                    fontWeight: isActive('/') ? '600' : '400',
                    textDecoration: 'none',
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                  Home
                </Link>
              </li>
              <li style={{ marginBottom: '0.25rem' }}>
                <Link 
                  to="/tags" 
                  onClick={handleLinkClick}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.625rem 0.75rem',
                    borderRadius: 'var(--border-radius)',
                    color: isActive('/tags') ? 'var(--primary-color)' : 'var(--text-primary)',
                    backgroundColor: isActive('/tags') ? 'rgba(59, 73, 223, 0.1)' : 'transparent',
                    fontWeight: isActive('/tags') ? '600' : '400',
                    textDecoration: 'none',
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                    <line x1="7" y1="7" x2="7.01" y2="7"/>
                  </svg>
                  Tags
                </Link>
              </li>
              
              {user && (
                <>
                  <li style={{ marginBottom: '0.25rem' }}>
                    <Link 
                      to="/dashboard" 
                      onClick={handleLinkClick}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.625rem 0.75rem',
                        borderRadius: 'var(--border-radius)',
                        color: isActive('/dashboard') ? 'var(--primary-color)' : 'var(--text-primary)',
                        backgroundColor: isActive('/dashboard') ? 'rgba(59, 73, 223, 0.1)' : 'transparent',
                        fontWeight: isActive('/dashboard') ? '600' : '400',
                        textDecoration: 'none',
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="7" height="7"/>
                        <rect x="14" y="3" width="7" height="7"/>
                        <rect x="14" y="14" width="7" height="7"/>
                        <rect x="3" y="14" width="7" height="7"/>
                      </svg>
                      Dashboard
                    </Link>
                  </li>
                  <li style={{ marginBottom: '0.25rem' }}>
                    <Link 
                      to="/reading-list" 
                      onClick={handleLinkClick}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.625rem 0.75rem',
                        borderRadius: 'var(--border-radius)',
                        color: isActive('/reading-list') ? 'var(--primary-color)' : 'var(--text-primary)',
                        backgroundColor: isActive('/reading-list') ? 'rgba(59, 73, 223, 0.1)' : 'transparent',
                        fontWeight: isActive('/reading-list') ? '600' : '400',
                        textDecoration: 'none',
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                      </svg>
                      Reading List
                    </Link>
                  </li>
                  <li style={{ marginBottom: '0.25rem' }}>
                    <Link 
                      to="/new-article" 
                      onClick={handleLinkClick}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.625rem 0.75rem',
                        borderRadius: 'var(--border-radius)',
                        color: 'var(--text-primary)',
                        textDecoration: 'none',
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                      Write Post
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>

          {/* More section */}
          <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
              My Account
            </div>
            <ul style={{ listStyle: 'none' }}>
              {user ? (
                <>
                  <li style={{ marginBottom: '0.25rem' }}>
                    <Link 
                      to={`/${user.username}`} 
                      onClick={handleLinkClick}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.625rem 0.75rem',
                        borderRadius: 'var(--border-radius)',
                        color: isActive(`/${user.username}`) ? 'var(--primary-color)' : 'var(--text-primary)',
                        textDecoration: 'none',
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                      Profile
                    </Link>
                  </li>
                </>
              ) : null}
            </ul>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidenav;
