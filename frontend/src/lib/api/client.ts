import { clearAccessToken } from '@/lib/auth/session';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || '';

type ApiOptions = RequestInit & {
  skipAuth?: boolean;
};

function buildHeaders(options: ApiOptions) {
  const headers = new Headers(options.headers ?? {});

  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }

  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  if (!isFormData && options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  return headers;
}

export function getApiBaseUrl() {
  return API_BASE_URL;
}

export async function apiFetch<T>(path: string, options: ApiOptions = {}): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error('NEXT_PUBLIC_API_URL is missing');
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: buildHeaders(options),
    credentials: 'include',
  });

  if (response.status === 401 && typeof window !== 'undefined') {
    const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });

    if (refreshResponse.ok) {
      const retriedResponse = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: buildHeaders(options),
        credentials: 'include',
      });

      if (retriedResponse.ok) {
        if (retriedResponse.status === 204) {
          return undefined as T;
        }
        return retriedResponse.json() as Promise<T>;
      }
    }

    clearAccessToken();
  }

  if (!response.ok) {
    let message = `API request failed with status ${response.status}`;
    try {
      const data = await response.json();
      message = data.message || data.error || message;
    } catch {
      const text = await response.text();
      if (text) message = text;
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
