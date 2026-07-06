import { FirebaseError } from 'firebase/app';

const ERROR_MESSAGES: Record<string, string> = {
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/invalid-email': 'Enter a valid email address.',
  'auth/invalid-credential': 'Incorrect email or password.',
  'auth/user-not-found': 'Incorrect email or password.',
  'auth/wrong-password': 'Incorrect email or password.',
  'auth/weak-password': 'Password is too weak.',
  'auth/too-many-requests': 'Too many attempts. Please try again later.',
  'auth/network-request-failed': 'Network error. Check your connection.',
  'profile/not-found': 'We could not find your profile. Please contact support.',
  'permission-denied': 'You do not have permission to do that.',
  unavailable: 'Service temporarily unavailable. Please try again.',
};

/**
 * Maps Firebase errors (auth or Firestore) to short, user-friendly messages.
 */
export function toErrorMessage(error: unknown): string {
  if (error instanceof FirebaseError) {
    return ERROR_MESSAGES[error.code] ?? 'Something went wrong. Please try again.';
  }
  if (error instanceof Error && ERROR_MESSAGES[error.message]) {
    return ERROR_MESSAGES[error.message];
  }
  return 'Something went wrong. Please try again.';
}

/** @deprecated use toErrorMessage — kept for the auth layer's existing call sites. */
export const toAuthErrorMessage = toErrorMessage;
