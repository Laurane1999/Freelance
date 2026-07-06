import { FirebaseError } from 'firebase/app';

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/invalid-email': 'Enter a valid email address.',
  'auth/invalid-credential': 'Incorrect email or password.',
  'auth/user-not-found': 'Incorrect email or password.',
  'auth/wrong-password': 'Incorrect email or password.',
  'auth/weak-password': 'Password is too weak.',
  'auth/too-many-requests': 'Too many attempts. Please try again later.',
  'auth/network-request-failed': 'Network error. Check your connection.',
  'profile/not-found': 'We could not find your profile. Please contact support.',
};

/**
 * Maps Firebase/auth errors to short, user-friendly messages.
 */
export function toAuthErrorMessage(error: unknown): string {
  if (error instanceof FirebaseError) {
    return AUTH_ERROR_MESSAGES[error.code] ?? 'Something went wrong. Please try again.';
  }
  if (error instanceof Error && AUTH_ERROR_MESSAGES[error.message]) {
    return AUTH_ERROR_MESSAGES[error.message];
  }
  return 'Something went wrong. Please try again.';
}
