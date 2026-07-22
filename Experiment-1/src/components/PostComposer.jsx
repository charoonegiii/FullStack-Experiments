import { useMemo, useState } from "react";
import { PLATFORMS, getPlatform } from "../data/platforms";
import { validateAllPlatforms } from "../utils/validation";

// initialPost lets the Draft Manager hand off a saved draft for editing.
export default function PostComposer({
  initialPost,
  onSaveDraft,
  onPublish,
  savingDraft,
  publishing,
}) {
  const [content, setContent] = useState(initialPost?.content || "");
  const [mediaCount, setMediaCount] = useState(initialPost?.mediaCount || 0);
  const [selectedPlatforms, setSelectedPlatforms] = useState(
    initialPost?.platforms || ["twitter"]
  );
  const [toast, setToast] = useState(null); // { type: 'success' | 'error', message }

  const validation = useMemo(
    () => validateAllPlatforms(content, mediaCount, selectedPlatforms),
    [content, mediaCount, selectedPlatforms]
  );

  const allValid =
    selectedPlatforms.length > 0 &&
    selectedPlatforms.every((id) => validation[id].isValid);

  function togglePlatform(id) {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }

  function buildPostPayload() {
    return {
      id: initialPost?.id,
      content,
      mediaCount,
      platforms: selectedPlatforms,
    };
  }

  async function handleSaveDraft() {
    try {
      await onSaveDraft(buildPostPayload());
      setToast({ type: "success", message: "Draft saved." });
    } catch (err) {
      setToast({ type: "error", message: err.message || "Could not save draft." });
    }
  }

  async function handlePublish() {
    setToast(null);
    try {
      await onPublish(buildPostPayload());
      setToast({ type: "success", message: "Post published to all selected platforms." });
      setContent("");
      setMediaCount(0);
    } catch (err) {
      setToast({ type: "error", message: err.message || "Publish failed." });
    }
  }

  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>Compose post</h3>

      <div className="platform-grid">
        {PLATFORMS.map((platform) => {
          const isSelected = selectedPlatforms.includes(platform.id);
          return (
            <button
              key={platform.id}
              type="button"
              className={`platform-chip${isSelected ? " selected" : ""}`}
              style={isSelected ? { background: platform.color } : {}}
              onClick={() => togglePlatform(platform.id)}
              aria-pressed={isSelected}
            >
              <span aria-hidden="true">{platform.icon}</span>
              {platform.label}
            </button>
          );
        })}
      </div>

      <textarea
        className="composer-textarea"
        placeholder="What do you want to share?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div className="media-row">
        <button type="button" onClick={() => setMediaCount((c) => Math.max(0, c - 1))}>
          − Media
        </button>
        <span className="media-count">{mediaCount} attached</span>
        <button type="button" onClick={() => setMediaCount((c) => c + 1)}>
          + Media
        </button>
      </div>

      {selectedPlatforms.length === 0 ? (
        <p style={{ color: "var(--text-muted)", fontSize: 13.5, marginTop: 14 }}>
          Select at least one platform to see validation.
        </p>
      ) : (
        <div className="platform-feedback-list">
          {selectedPlatforms.map((id) => {
            const platform = getPlatform(id);
            const result = validation[id];
            const pct = Math.min(100, (result.charCount / result.charLimit) * 100);
            const barColor =
              result.errors.length > 0
                ? "var(--danger)"
                : pct > 90
                ? "var(--warning)"
                : platform.color;

            let countClass = "";
            if (result.errors.length > 0) countClass = "error";
            else if (pct > 90) countClass = "warn";

            return (
              <div className="platform-feedback" key={id}>
                <div className="platform-feedback-header">
                  <span className="platform-feedback-title">
                    <span aria-hidden="true">{platform.icon}</span>
                    {platform.label}
                  </span>
                  <span className={`char-count ${countClass}`}>
                    {result.charCount} / {result.charLimit}
                  </span>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: `${pct}%`, background: barColor }}
                  />
                </div>
                {result.errors.map((msg, i) => (
                  <div className="feedback-msg error" key={`e${i}`}>
                    ⛔ {msg}
                  </div>
                ))}
                {result.warnings.map((msg, i) => (
                  <div className="feedback-msg warning" key={`w${i}`}>
                    ⚠ {msg}
                  </div>
                ))}
                {result.errors.length === 0 && result.warnings.length === 0 && (
                  <div className="feedback-msg ok">✓ Meets {platform.label} guidelines</div>
                )}
                <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "6px 0 0" }}>
                  {platform.notes}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}

      <div className="composer-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleSaveDraft}
          disabled={savingDraft || content.trim().length === 0}
        >
          {savingDraft ? "Saving…" : "Save as draft"}
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handlePublish}
          disabled={!allValid || publishing}
        >
          {publishing ? "Publishing…" : "Publish"}
        </button>
      </div>
    </div>
  );
}
