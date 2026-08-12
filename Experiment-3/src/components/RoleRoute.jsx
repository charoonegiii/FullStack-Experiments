import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { hasRole } from '../utils/permissions';

function RoleRoute({ allowedRoles, children }) {
  const { currentUser } = useAuth();

  if (!hasRole(currentUser, allowedRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default RoleRoute;
