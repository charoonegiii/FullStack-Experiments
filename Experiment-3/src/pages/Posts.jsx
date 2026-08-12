import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { postService } from '../services/postService';
import { useAuth } from '../context/AuthContext';
import { hasPermission } from '../utils/permissions';
import PostCard from '../components/PostCard';

function Posts() {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  const canCreate = hasPermission(currentUser, 'CREATE_POSTS');

  useEffect(() => {
    postService.getPosts().then(allPosts => {
      setPosts(allPosts);
      setLoading(false);
    });
  }, []);

  function handleDelete(postId) {
    const confirmDelete = window.confirm('Are you sure you want to delete this post?');
    if (!confirmDelete) {
      return;
    }

    postService.deletePost(postId).then(() => {
      setPosts(prev => prev.filter(post => post.id !== postId));
      setAlert({ type: 'success', message: 'Post deleted successfully.' });
      setTimeout(() => setAlert(null), 3000);
    });
  }

  return (
    <section className="posts-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Post Management</p>
          <h1>Manage course posts</h1>
          <p className="muted">View all articles, edit content, and ensure user actions match their role.</p>
        </div>
        {canCreate && (
          <Link to="/create-post" className="btn btn-primary">
            Create New Post
          </Link>
        )}
      </div>

      {alert && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}

      {loading ? (
        <div className="page-loading">Loading posts...</div>
      ) : (
        <div className="posts-grid">
          {posts.map(post => (
            <PostCard key={post.id} post={post} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </section>
  );
}

export default Posts;
