import { useState } from "react";
import "./App.css";
import PostComposer from "./components/PostComposer";
import DraftManager from "./components/DraftManager";
import { saveDraft, publishPost } from "./utils/mockApi";

export default function App() {
  const [activeTab, setActiveTab] = useState("compose");
  const [editingDraft, setEditingDraft] = useState(null);
  const [savingDraft, setSavingDraft] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [refreshSignal, setRefreshSignal] = useState(0);
  // A fresh key forces PostComposer to remount with new initialPost values
  // whenever a different draft is opened for editing.
  const [composerKey, setComposerKey] = useState(0);

  async function handleSaveDraft(post) {
    setSavingDraft(true);
    try {
      await saveDraft(post);
      setRefreshSignal((n) => n + 1);
    } finally {
      setSavingDraft(false);
    }
  }

  async function handlePublish(post) {
    setPublishing(true);
    try {
      const result = await publishPost(post);
      return result;
    } finally {
      setPublishing(false);
    }
  }

  function handleEditDraft(draft) {
    setEditingDraft(draft);
    setComposerKey((k) => k + 1);
    setActiveTab("compose");
  }

  return (
    <div className="app-shell">
      <div className="app-header">
        <h1>Post composer</h1>
        <p>Write once, validate everywhere. Manage drafts before you publish.</p>
      </div>

      <div className="tabs">
        <button
          type="button"
          className={`tab-button${activeTab === "compose" ? " active" : ""}`}
          onClick={() => setActiveTab("compose")}
        >
          Compose
        </button>
        <button
          type="button"
          className={`tab-button${activeTab === "drafts" ? " active" : ""}`}
          onClick={() => setActiveTab("drafts")}
        >
          Drafts
        </button>
      </div>

      {activeTab === "compose" && (
        <PostComposer
          key={composerKey}
          initialPost={editingDraft}
          onSaveDraft={handleSaveDraft}
          onPublish={handlePublish}
          savingDraft={savingDraft}
          publishing={publishing}
        />
      )}

      {activeTab === "drafts" && (
        <DraftManager refreshSignal={refreshSignal} onEditDraft={handleEditDraft} />
      )}
    </div>
  );
}
