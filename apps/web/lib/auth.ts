import type {
  FeedResponse,
  EventCard,
  EventDetail,
  ClubCard,
  ClubDetail,
  UserCard,
  PostCard,
  CreateEventInput,
  CreateClubInput,
  CreatePostInput,
} from '@repo/schemas';
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
  async getFeed(
    interestIds?: string[],
    interests?: string[],
  ): Promise<FeedResponse> {
    const params = new URLSearchParams();
    if (interestIds && interestIds.length > 0) {
      params.set('interestIds', interestIds.join(','));
    }
    if (interests && interests.length > 0) {
      params.set('interests', interests.join(','));
    }
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return apiFetch<FeedResponse>(`/feed${queryString}`, {
      method: 'GET',
    });
  },

  /**
   * Fetch all upcoming campus events from PostgreSQL.
   */
  async getEvents(): Promise<EventCard[]> {
    return apiFetch<EventCard[]>('/events', {
      method: 'GET',
    });
  },

  /**
   * Fetch single event details by ID or slug.
   */
  async getEvent(id: string): Promise<EventDetail> {
    return apiFetch<EventDetail>(`/events/${id}`, {
      method: 'GET',
    });
  },

  /**
   * Register active student for a campus event.
   */
  async registerEvent(id: string): Promise<{
    message: string;
    eventId: string;
    eventTitle: string;
    registeredAt: string;
  }> {
    return apiFetch(`/events/${id}/register`, {
      method: 'POST',
    });
  },

  /**
   * Fetch all active campus clubs from PostgreSQL.
   */
  async getClubs(): Promise<ClubCard[]> {
    return apiFetch<ClubCard[]>('/clubs', {
      method: 'GET',
    });
  },

  /**
   * Fetch single club details by ID or slug.
   */
  async getClub(id: string): Promise<ClubDetail> {
    return apiFetch<ClubDetail>(`/clubs/${id}`, {
      method: 'GET',
    });
  },

  /**
   * Join a student club organization.
   */
  async joinClub(id: string): Promise<{
    message: string;
    clubId: string;
    clubName: string;
    role: string;
    joinedAt: string;
  }> {
    return apiFetch(`/clubs/${id}/join`, {
      method: 'POST',
    });
  },

  /**
   * Fetch all campus students/peers from PostgreSQL.
   */
  async getUsers(interest?: string, search?: string): Promise<UserCard[]> {
    const params = new URLSearchParams();
    if (interest && interest !== 'All') {
      params.set('interest', interest);
    }
    if (search && search.trim()) {
      params.set('search', search.trim());
    }
    const qs = params.toString() ? `?${params.toString()}` : '';
    return apiFetch<UserCard[]>(`/users${qs}`, {
      method: 'GET',
    });
  },

  /**
   * Fetch single user/peer details by ID or slug from PostgreSQL.
   */
  async getUser(id: string): Promise<UserCard> {
    return apiFetch<UserCard>(`/users/${id}`, {
      method: 'GET',
    });
  },

  /**
   * Create a new campus event in PostgreSQL.
   */
  async createEvent(payload: CreateEventInput): Promise<EventDetail> {
    return apiFetch<EventDetail>('/events', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Create a new campus club in PostgreSQL.
   */
  async createClub(payload: CreateClubInput): Promise<ClubDetail> {
    return apiFetch<ClubDetail>('/clubs', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Create a new community post or teammate request in PostgreSQL.
   */
  async createPost(payload: CreatePostInput): Promise<PostCard> {
    return apiFetch<PostCard>('/posts', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
