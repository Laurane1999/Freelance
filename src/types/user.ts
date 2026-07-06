/**
 * User model — mirrors the `users` collection in Firestore (see docs/03_DATABASE).
 */
export type UserRole = 'client' | 'freelance';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  photo: string | null;
  skills: string[];
  createdAt: number;
}

/**
 * Data required to create a new user document at registration time.
 */
export interface NewUserInput {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
