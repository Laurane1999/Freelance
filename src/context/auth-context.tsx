import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { User as FirebaseUser } from 'firebase/auth';

import { loadProfile, subscribeToAuthChanges } from '@/services/auth-service';
import type { AuthState } from '@/types/auth';
import type { User } from '@/types/user';

interface AuthContextValue extends AuthState {
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const PROFILE_LOAD_RETRIES = 4;
const PROFILE_RETRY_DELAY_MS = 400;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Loads the profile with a few retries to cover the brief window during
 * registration where the auth session exists before the Firestore doc is written.
 */
async function loadProfileWithRetry(firebaseUser: FirebaseUser): Promise<User | null> {
  for (let attempt = 0; attempt < PROFILE_LOAD_RETRIES; attempt += 1) {
    const profile = await loadProfile(firebaseUser);
    if (profile) {
      return profile;
    }
    await delay(PROFILE_RETRY_DELAY_MS);
  }
  return null;
}

/**
 * Global auth state. Subscribes to Firebase session changes so the session
 * persists across app restarts (docs/10_AUTH_SYSTEM).
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ status: 'loading', user: null });

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (firebaseUser) => {
      if (!firebaseUser) {
        setState({ status: 'unauthenticated', user: null });
        return;
      }

      const profile = await loadProfileWithRetry(firebaseUser);
      setState(
        profile
          ? { status: 'authenticated', user: profile }
          : { status: 'unauthenticated', user: null },
      );
    });

    return unsubscribe;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      isAuthenticated: state.status === 'authenticated',
    }),
    [state],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
