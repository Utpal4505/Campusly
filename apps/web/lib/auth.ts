import type { FeedResponse } from '@repo/schemas';
import { apiFetch } from './api';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  image: string | null;
  bio: string | null;
  department: string | null;
  yearOfStudy: string | null;
  createdAt: string;
  interests: Array<{ id: string; name: string }>;
}

export interface UserSession {
  user: {
    id: string;
    email: string;
    name: string;
    image?: string | null;
  };
  session: {
    id: string;
    userId: string;
    expiresAt: string;
  };
}

let cachedInterests: Array<{ id: string; name: string }> | null = null;

/**
 * Minimal Better Auth & Campusly user client wrapper.
 * Directly utilizes Better Auth HTTP routes with credentials: "include".
 */
export const authClient = {
  /**
   * Log in with campus email and password.
   */
  async signIn(email: string, password: string) {
    return apiFetch<{ user: any; session: any }>('/api/auth/sign-in/email', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  /**
   * Register a new student account.
   */
  async signUp(email: string, password: string, name: string) {
    return apiFetch<{ user: any; session: any }>('/api/auth/sign-up/email', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  },

  /**
   * Retrieve active Better Auth session.
   */
  async getSession(): Promise<UserSession | null> {
    try {
      const data = await apiFetch<UserSession | null>('/api/auth/get-session', {
        method: 'GET',
      });
      return data;
    } catch {
      return null;
    }
  },

  /**
   * End the current authenticated session.
   */
  async signOut() {
    return apiFetch('/api/auth/sign-out', {
      method: 'POST',
      body: JSON.stringify({}),
    });
  },

  /**
   * Fetch current user profile with saved campus interest preferences.
   */
  async getMe(): Promise<UserProfile> {
    return apiFetch<UserProfile>('/users/me', {
      method: 'GET',
    });
  },

  /**
   * Fetch all active campus interests from the database (cached in memory).
   */
  async getInterests(): Promise<Array<{ id: string; name: string }>> {
    if (cachedInterests && cachedInterests.length > 0) {
      return cachedInterests;
    }
    const data = await apiFetch<Array<{ id: string; name: string }>>('/interests', {
      method: 'GET',
    });
    if (Array.isArray(data) && data.length > 0) {
      cachedInterests = data;
    }
    return data;
  },

  /**
   * Persist student onboarding interest preferences.
   */
  async updatePreferences(interestIds: string[]): Promise<{
    message: string;
    interests: Array<{ id: string; name: string }>;
  }> {
    return apiFetch('/users/me/preferences', {
      method: 'PATCH',
      body: JSON.stringify({ interestIds }),
    });
  },

  /**
   * Fetch personalized or discovery campus feed.
   */
  async getFeed(): Promise<FeedResponse> {
    return apiFetch<FeedResponse>('/feed', {
      method: 'GET',
    });
  },
};
