// src/api/auth.ts
import { apiFetch } from './client';

export async function loginUser({ email, password }: { email: string; password: string }) {
  return apiFetch<{ token: string; user: any }>('/login', 'POST', undefined, {
    email,
    password,
  });
}

export async function signUpUser(data: {
  email: string;
  password: string;
  username: string;
}) {
  return apiFetch('/signup', 'POST', undefined, data);
}

export async function fetchUserProfile(token: string) {
  return apiFetch('/profile', 'GET', token);
}