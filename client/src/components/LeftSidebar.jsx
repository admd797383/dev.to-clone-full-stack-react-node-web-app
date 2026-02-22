import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LeftSidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="left-sidebar">
      <ul className="left-sidebar-nav">
        <li className="left-sidebar-item">
          <Link 
            to="/" 
            className={`left-sidebar-link ${isActive('/') ? 'active' : ''}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            Home
          </Link>
        </li>
        <li className="left-sidebar-item">
          <Link 
            to="/tags" 
            className={`left-sidebar-link ${isActive('/tags') ? 'active' : ''}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
              <line x1="7" y1="7" x2="7.01" y2="7"/>
            </svg>
            Tags
          </Link>
        </li>
        {user && (
          <>
            <li className="left-sidebar-item">
              <Link 
                to="/dashboard" 
                className={`left-sidebar-link ${isActive('/dashboard') ? 'active' : ''}`}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7"/>
                  <rect x="14" y="3" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/>
                </svg>
                Dashboard
              </Link>
            </li>
            <li className="left-sidebar-item">
              <Link 
                to="/reading-list" 
                className={`left-sidebar-link ${isActive('/reading-list') ? 'active' : ''}`}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                </svg>
                Reading List
              </Link>
            </li>
          </>
        )}
      </ul>
    </aside>
  );
};

export default LeftSidebar;
