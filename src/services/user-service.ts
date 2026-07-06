import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

import { db } from '@/services/firebase';
import type { NewUserInput, ProfileUpdateInput, User } from '@/types/user';

const USERS_COLLECTION = 'users';

interface UserDocument {
  name: string;
  email: string;
  role: User['role'];
  photo: string | null;
  skills: string[];
  createdAt: number;
}

/**
 * Creates the Firestore user document that backs a freshly registered account.
 * Firestore is the single source of truth for profile data (docs/12_FIREBASE_RULES).
 */
export async function createUserDocument(input: NewUserInput): Promise<User> {
  const now = Date.now();
  const data: UserDocument = {
    name: input.name,
    email: input.email,
    role: input.role,
    photo: null,
    skills: [],
    createdAt: now,
  };

  await setDoc(doc(db, USERS_COLLECTION, input.id), data);

  return { id: input.id, ...data };
}

/**
 * Updates the editable profile fields of a user document (USER_PROFILE phase).
 * Returns the refreshed profile.
 */
export async function updateUserProfile(
  id: string,
  input: ProfileUpdateInput,
): Promise<User> {
  await updateDoc(doc(db, USERS_COLLECTION, id), {
    name: input.name,
    photo: input.photo,
    skills: input.skills,
  });

  const profile = await getUserById(id);
  if (!profile) {
    throw new Error('profile/not-found');
  }
  return profile;
}

/**
 * Loads a user profile document. Returns null when the document does not exist.
 */
export async function getUserById(id: string): Promise<User | null> {
  const snapshot = await getDoc(doc(db, USERS_COLLECTION, id));
  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data() as Partial<UserDocument>;
  const createdAt = data.createdAt;

  return {
    id: snapshot.id,
    name: data.name ?? '',
    email: data.email ?? '',
    role: data.role ?? 'client',
    photo: data.photo ?? null,
    skills: data.skills ?? [],
    createdAt: typeof createdAt === 'number' ? createdAt : Date.now(),
  };
}
