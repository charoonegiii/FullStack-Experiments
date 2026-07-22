import { useEffect, useState } from "react";
import { fetchDrafts, deleteDraft as deleteDraftApi } from "../utils/mockApi";
import { getPlatform } from "../data/platforms";

function formatTime(ts) {
  return new Date(ts).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function DraftManager({ refreshSignal, onEditDraft }) {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(null);

  async function loadDrafts() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDrafts();
      setDrafts(data);
    } catch (err) {
      setError("Could not load drafts.");
    } finally {
      setLoading(false);
    }
  }

  // Reload whenever the composer saves a new draft (refreshSignal changes).
  useEffect(() => {
    loadDrafts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshSignal]);

  async function handleDelete(id) {
    setDeletingId(id);
    try {
      const updated = await deleteDraftApi(id);
      setDrafts(updated);
    } catch (err) {
      setError("Could not delete draft. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <div className="card">
        <div className="loading-row">
          <span className="spinner" />
          Loading drafts…
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>Saved drafts ({drafts.length})</h3>

      {error && <div className="toast error">{error}</div>}

      {drafts.length === 0 ? (
        <div className="empty-state">
          No drafts yet. Write a post and click "Save as draft".
        </div>
      ) : (
        <div className="draft-list">
          {drafts.map((draft) => (
            <div className="draft-item" key={draft.id}>
              <div className="draft-item-content">
                <p>
                  {draft.content.length > 140
                    ? draft.content.slice(0, 140) + "…"
                    : draft.content}
                </p>
                <div className="draft-meta">
                  <span>Updated {formatTime(draft.updatedAt)}</span>
                  <span>·</span>
                  <span>
                    {draft.platforms
                      .map((id) => getPlatform(id)?.label || id)
                      .join(", ")}
                  </span>
                  <span>·</span>
                  <span>{draft.mediaCount} media</span>
                </div>
              </div>
              <div className="draft-actions">
                <button type="button" onClick={() => onEditDraft(draft)}>
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(draft.id)}
                  disabled={deletingId === draft.id}
                >
                  {deletingId === draft.id ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
