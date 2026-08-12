import { Link } from 'react-router-dom';

function Unauthorized() {
  return (
    <section className="unauthorized-page">
      <div className="unauthorized-card">
        <h1>403</h1>
        <p className="unauthorized-title">Access Denied</p>
        <p className="muted">You do not have permission to access this resource.</p>
        <Link to="/posts" className="btn btn-primary btn-block">
          Back to Posts
        </Link>
      </div>
    </section>
  );
}

export default Unauthorized;
