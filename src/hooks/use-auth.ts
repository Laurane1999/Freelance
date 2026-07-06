import { useCallback, useState } from 'react';

import { useAuthContext } from '@/context/auth-context';
import * as authService from '@/services/auth-service';
import type { LoginInput, RegisterInput } from '@/types/auth';
import { toAuthErrorMessage } from '@/utils/errors';

interface UseAuthResult {
  submitting: boolean;
  error: string | null;
  clearError: () => void;
  register: (input: RegisterInput) => Promise<boolean>;
  login: (input: LoginInput) => Promise<boolean>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
}

/**
 * Logic layer for authentication. UI screens call this hook, never the
 * services or Firebase directly (docs/02_ARCHITECTURE, docs/12_FIREBASE_RULES).
 */
export function useAuth(): UseAuthResult {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const run = useCallback(async (action: () => Promise<void>): Promise<boolean> => {
    setSubmitting(true);
    setError(null);
    try {
      await action();
      return true;
    } catch (err) {
      setError(toAuthErrorMessage(err));
      return false;
    } finally {
      setSubmitting(false);
    }
  }, []);

  const register = useCallback(
    (input: RegisterInput) => run(async () => {
      await authService.register(input);
    }),
    [run],
  );

  const login = useCallback(
    (input: LoginInput) => run(async () => {
      await authService.login(input);
    }),
    [run],
  );

  const resetPassword = useCallback(
    (email: string) => run(async () => {
      await authService.resetPassword(email);
    }),
    [run],
  );

  const logout = useCallback(async () => {
    await authService.logout();
  }, []);

  return { submitting, error, clearError, register, login, logout, resetPassword };
}

/**
 * Convenience re-export so screens can read session state from one place.
 */
export function useSession() {
  return useAuthContext();
}
