// Simulated backend. In a real app these would be fetch() calls to a REST API.

const PLATFORMS = [
  { id: 'facebook', name: 'Facebook' },
  { id: 'linkedin', name: 'LinkedIn' },
  { id: 'twitter', name: 'Twitter' },
  {id: 'instagram', name: 'Instagram'}
];

// Matches the reference: 4 total posts, 2 on LinkedIn, 2 drafts, 2 published.
const POSTS = [
  { id: '1', title: 'Launch the new profile template', platformId: 'linkedin', status: 'published' },
  { id: '2', title: 'Draft a social media audit guide', platformId: 'twitter', status: 'draft' },
  { id: '3', title: 'good morning', platformId: 'linkedin', status: 'draft' },
  { id: '4', title: 'New campaign teaser', platformId: 'facebook', status: 'published' },
];

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchPlatformsApi() {
  await delay(400);
  return PLATFORMS;
}

export async function fetchPostsApi() {
  await delay(600);
  return POSTS;
}

export async function createPostApi(post) {
  await delay(300);
  return { id: crypto.randomUUID(), ...post };
}

export async function updatePostApi(id, changes) {
  await delay(300);
  return { id, changes };
}
