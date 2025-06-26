// src/api/client.ts
const API_BASE = 'http://192.168.1.26:8080/api'; // replace with prod URL later

export async function apiFetch<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  token?: string,
  body?: any
): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = {}; // fallback if response isn't JSON
  }

  if (!res.ok) {
    throw new Error(data.error || 'API Error');
  }

  return data;
}
