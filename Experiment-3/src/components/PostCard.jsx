import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { hasPermission } from '../utils/permissions';

function PostCard({ post, onDelete }) {
  const { currentUser } = useAuth();
  const canEdit = hasPermission(currentUser, 'EDIT_POSTS');
  const canDelete = hasPermission(currentUser, 'DELETE_POSTS');

  return (
    <article className="post-card">
      <div className="post-card__content">
        <div className="post-card__header">
          <h3>{post.title}</h3>
          <span className="post-card__author">{post.author}</span>
        </div>
        <p className="post-card__description">{post.content}</p>
        <div className="post-card__meta">
          <span>Created: {post.createdAt}</span>
          <span>Updated: {post.updatedAt}</span>
        </div>
      </div>
      <div className="post-card__actions">
        {canEdit && (
          <Link to={`/edit-post/${post.id}`} className="btn btn-outline">
            Edit
          </Link>
        )}
        {canDelete && (
          <button onClick={() => onDelete(post.id)} className="btn btn-danger">
            Delete
          </button>
        )}
      </div>
    </article>
  );
}

export default PostCard;
