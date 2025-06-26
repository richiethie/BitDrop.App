// src/api/user.ts
import { apiFetch } from './client';

export async function getUserProfile(token: string) {
  return apiFetch<{ message: string; userId: string }>('/profile', 'GET', token);
}
