const POSTS_KEY = 'posts';

const initialPosts = [
  {
    id: 'p1',
    title: 'Introduction to React',
    content: 'React is a powerful library for building interactive user interfaces with reusable components.',
    author: 'Admin User',
    createdAt: '2026-08-01',
    updatedAt: '2026-08-01',
  },
  {
    id: 'p2',
    title: 'Understanding JWT Authentication',
    content: 'JWT helps maintain authenticated state on the client with a compact, self-contained token payload.',
    author: 'Editor User',
    createdAt: '2026-08-03',
    updatedAt: '2026-08-03',
  },
  {
    id: 'p3',
    title: 'Role-Based Access Control',
    content: 'RBAC assigns permissions to users based on roles, enabling secure and maintainable authorization.',
    author: 'Admin User',
    createdAt: '2026-08-05',
    updatedAt: '2026-08-05',
  },
];

function getStoredPosts() {
  try {
    const raw = localStorage.getItem(POSTS_KEY);
    if (!raw) {
      localStorage.setItem(POSTS_KEY, JSON.stringify(initialPosts));
      return [...initialPosts];
    }
    return JSON.parse(raw) || [];
  } catch (error) {
    console.error('Failed to load posts.', error);
    return [...initialPosts];
  }
}

function savePosts(posts) {
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
}

function getPosts() {
  return new Promise(resolve => {
    const posts = getStoredPosts();
    resolve(posts);
  });
}

function getPostById(id) {
  return new Promise((resolve, reject) => {
    const posts = getStoredPosts();
    const post = posts.find(item => item.id === id);
    if (!post) {
      reject(new Error('Post not found.'));
      return;
    }
    resolve(post);
  });
}

function createPost({ title, content, author }) {
  return new Promise((resolve, reject) => {
    if (!title || !content) {
      reject(new Error('Title and content are required.'));
      return;
    }

    const posts = getStoredPosts();
    const newPost = {
      id: `p${Date.now()}`,
      title: title.trim(),
      content: content.trim(),
      author: author.trim(),
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    posts.unshift(newPost);
    savePosts(posts);
    resolve(newPost);
  });
}

function updatePost(id, { title, content }) {
  return new Promise((resolve, reject) => {
    const posts = getStoredPosts();
    const index = posts.findIndex(post => post.id === id);
    if (index === -1) {
      reject(new Error('Post not found.'));
      return;
    }

    const updatedPost = {
      ...posts[index],
      title: title.trim(),
      content: content.trim(),
      updatedAt: new Date().toISOString().split('T')[0],
    };

    posts[index] = updatedPost;
    savePosts(posts);
    resolve(updatedPost);
  });
}

function deletePost(id) {
  return new Promise((resolve, reject) => {
    const posts = getStoredPosts();
    const index = posts.findIndex(post => post.id === id);
    if (index === -1) {
      reject(new Error('Post not found.'));
      return;
    }

    posts.splice(index, 1);
    savePosts(posts);
    resolve();
  });
}

export const postService = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};
