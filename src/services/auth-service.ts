import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth';

import { auth } from '@/services/firebase';
import { createUserDocument, getUserById } from '@/services/user-service';
import type { LoginInput, RegisterInput } from '@/types/auth';
import type { User } from '@/types/user';

/**
 * Register: create the Firebase auth user, then its Firestore profile document.
 */
export async function register(input: RegisterInput): Promise<User> {
  const credential = await createUserWithEmailAndPassword(
    auth,
    input.email,
    input.password,
  );

  await updateProfile(credential.user, { displayName: input.name });

  return createUserDocument({
    id: credential.user.uid,
    name: input.name,
    email: input.email,
    role: input.role,
  });
}

/**
 * Login: authenticate, then load the Firestore profile.
 */
export async function login(input: LoginInput): Promise<User> {
  const credential = await signInWithEmailAndPassword(
    auth,
    input.email,
    input.password,
  );

  const profile = await getUserById(credential.user.uid);
  if (!profile) {
    throw new Error('profile/not-found');
  }
  return profile;
}

export async function logout(): Promise<void> {
  await signOut(auth);
}

export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

/**
 * Loads the Firestore profile for an already-authenticated Firebase user.
 */
export async function loadProfile(firebaseUser: FirebaseUser): Promise<User | null> {
  return getUserById(firebaseUser.uid);
}

/**
 * Subscribes to Firebase auth session changes. Used by the AuthContext to keep
 * the session persistent across app restarts.
 */
export function subscribeToAuthChanges(
  callback: (firebaseUser: FirebaseUser | null) => void,
): () => void {
  return onAuthStateChanged(auth, callback);
}
