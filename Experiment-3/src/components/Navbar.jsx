import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { hasPermission } from '../utils/permissions';

function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const canCreate = hasPermission(currentUser, 'CREATE_POSTS');

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <Link to="/dashboard" className="brand-link">
          <div className="brand-logo">Exp</div>
          <span className="brand-text">Experiment-3</span>
        </Link>
      </div>

      <nav className="navbar-links">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          Dashboard
        </NavLink>
        <NavLink to="/posts" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          Posts
        </NavLink>
        {canCreate && (
          <NavLink to="/create-post" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            Create Post
          </NavLink>
        )}
      </nav>

      <div className="navbar-actions">
        <div className="user-info">
          <span className="user-email">{currentUser?.email}</span>
          <span className="role-badge role-badge--small">{currentUser?.role}</span>
        </div>
        <button onClick={handleLogout} className="btn btn-secondary btn-sm">
          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;
