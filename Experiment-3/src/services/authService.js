import { encodePayload, decodePayload } from '../utils/token';

const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_USER_KEY = 'current_user';

const users = [
  {
    userId: 'u1',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'ADMIN',
  },
  {
    userId: 'u2',
    name: 'Editor User',
    email: 'editor@example.com',
    password: 'editor123',
    role: 'EDITOR',
  },
  {
    userId: 'u3',
    name: 'Viewer User',
    email: 'viewer@example.com',
    password: 'viewer123',
    role: 'VIEWER',
  },
];

const TOKEN_LIFETIME_MINUTES = 120;

function generateToken(user) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const issuedAt = Date.now();
  const expiresAt = issuedAt + TOKEN_LIFETIME_MINUTES * 60 * 1000;
  const payload = {
    userId: user.userId,
    name: user.name,
    email: user.email,
    role: user.role,
    issuedAt,
    expiresAt,
  };

  const encodedHeader = encodePayload(header);
  const encodedPayload = encodePayload(payload);
  const signature = 'signature-simulated';

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

function decodeToken(token) {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  try {
    const payload = decodePayload(parts[1]);
    return payload;
  } catch (error) {
    return null;
  }
}

function isTokenExpired(token) {
  const payload = decodeToken(token);
  if (!payload) return true;
  return Date.now() > payload.expiresAt;
}

function login({ email, password }) {
  return new Promise((resolve, reject) => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!user) {
      reject(new Error('Invalid email or password.'));
      return;
    }

    const token = generateToken(user);
    const payload = decodeToken(token);

    try {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(payload));
      resolve({ token, user: payload });
    } catch (error) {
      reject(new Error('Could not save authentication data.'));
    }
  });
}

function logout() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

function getToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

function getCurrentUser() {
  const token = getToken();
  const payload = decodeToken(token);
  return payload && !isTokenExpired(token) ? payload : null;
}

function restoreSession() {
  const token = getToken();
  if (!token || isTokenExpired(token)) {
    logout();
    return null;
  }

  const user = getCurrentUser();
  return user;
}

function isAuthenticated() {
  return Boolean(getCurrentUser());
}

export const authService = {
  login,
  logout,
  getCurrentUser,
  restoreSession,
  isTokenExpired,
  isAuthenticated,
  generateToken,
  decodeToken,
};
