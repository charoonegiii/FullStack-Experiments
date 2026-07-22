// Simulates a backend for drafts and publishing.
// Swap the bodies of these functions for real fetch() calls later —
// the calling components only care about the returned Promises.

const STORAGE_KEY = "post-composer-drafts";
const SIMULATED_DELAY_MS = 600;
const FAILURE_RATE = 0.08; // ~8% of publish attempts "fail" to demo error handling

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function readDraftsFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeDraftsToStorage(drafts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
}

export async function fetchDrafts() {
  await delay(SIMULATED_DELAY_MS);
  return readDraftsFromStorage().sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function saveDraft(draft) {
  await delay(SIMULATED_DELAY_MS);
  const drafts = readDraftsFromStorage();
  const now = Date.now();

  if (draft.id) {
    const index = drafts.findIndex((d) => d.id === draft.id);
    if (index !== -1) {
      drafts[index] = { ...drafts[index], ...draft, updatedAt: now };
    }
  } else {
    drafts.push({
      ...draft,
      id: `draft_${now}_${Math.random().toString(36).slice(2, 8)}`,
      createdAt: now,
      updatedAt: now,
    });
  }

  writeDraftsToStorage(drafts);
  return readDraftsFromStorage();
}

export async function deleteDraft(draftId) {
  await delay(SIMULATED_DELAY_MS);
  const drafts = readDraftsFromStorage().filter((d) => d.id !== draftId);
  writeDraftsToStorage(drafts);
  return drafts;
}

// Simulates publishing a post to the selected platforms.
export async function publishPost(post) {
  await delay(SIMULATED_DELAY_MS + 400);

  if (Math.random() < FAILURE_RATE) {
    throw new Error(
      "Publishing failed — the network request timed out. Please try again."
    );
  }

  return {
    success: true,
    publishedAt: Date.now(),
    platforms: post.platforms,
  };
}
