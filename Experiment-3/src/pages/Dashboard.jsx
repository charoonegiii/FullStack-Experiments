import { useAuth } from '../context/AuthContext';
import { getPermissionsSummary, permissionLabel } from '../utils/permissions';

function Dashboard() {
  const { currentUser } = useAuth();
  const summary = getPermissionsSummary(currentUser?.role);

  return (
    <section className="dashboard-page">

      <div className="page-header">
        <div>
          <p className="eyebrow">Project Overview</p>

          <h1>Welcome, {currentUser?.name}</h1>

          <p className="muted">
            You are signed in as <strong>{currentUser?.email}</strong>.
          </p>
        </div>

        <div className="dashboard-badge-panel">
          <span className="role-badge role-badge--large">
            {currentUser?.role}
          </span>
        </div>
      </div>

      <div className="summary-grid">

        {/* Workspace Card */}
        <div className="summary-card summary-card--welcome">
          <h2>Your Workspace</h2>

          <p>
            Manage your posts, explore available features, and access tools
            based on your assigned role.
          </p>
        </div>

        {/* Access Card */}
        <div className="summary-card">
          <h3>Available Permissions</h3>

          <p className="muted">
            Your current role determines which actions are available to you.
          </p>

          <div className="permission-list">

            {summary.map(item => (
              <div
                key={item.permission}
                className="permission-row"
              >
                <span>
                  {permissionLabel(item.permission)}
                </span>

                <span
                  className={
                    item.allowed
                      ? 'status status-success'
                      : 'status status-failed'
                  }
                >
                  {item.allowed ? 'Allowed' : 'Restricted'}
                </span>
              </div>
            ))}

          </div>
        </div>

      </div>

    </section>
  );
}

export default Dashboard;