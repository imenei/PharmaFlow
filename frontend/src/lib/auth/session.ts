const TOKEN_KEY = 'pharma_access_token';
const USER_KEY = 'pharma_current_user';

export function getAccessToken() {
  return null;
}

export function setAccessToken(token: string) {
  void token;
}

export function clearAccessToken() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(USER_KEY);
}

export function setCurrentUser(user: unknown) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getCurrentUser<T>() {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}
