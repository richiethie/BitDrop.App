// api/availability.ts
import { apiFetch } from './client';

export async function checkUsernameAndEmail(username: string, email: string) {
  const query = `?username=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}`;
  return apiFetch<{ message: string }>(`/check-availability${query}`, 'GET');
}
