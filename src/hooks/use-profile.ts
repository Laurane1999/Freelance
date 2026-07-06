import { useCallback, useState } from 'react';

import { useAuthContext } from '@/context/auth-context';
import * as userService from '@/services/user-service';
import type { ProfileUpdateInput, User } from '@/types/user';
import { toAuthErrorMessage } from '@/utils/errors';

interface UseProfileResult {
  user: User | null;
  submitting: boolean;
  error: string | null;
  clearError: () => void;
  updateProfile: (input: ProfileUpdateInput) => Promise<boolean>;
}

/**
 * Logic layer for the current user's profile (USER_PROFILE phase). UI screens
 * call this hook, never the services or Firebase directly (docs/02_ARCHITECTURE).
 */
export function useProfile(): UseProfileResult {
  const { user, refresh } = useAuthContext();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const updateProfile = useCallback(
    async (input: ProfileUpdateInput): Promise<boolean> => {
      if (!user) {
        setError('You must be signed in to edit your profile.');
        return false;
      }
      setSubmitting(true);
      setError(null);
      try {
        await userService.updateUserProfile(user.id, input);
        await refresh();
        return true;
      } catch (err) {
        setError(toAuthErrorMessage(err));
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [user, refresh],
  );

  return { user, submitting, error, clearError, updateProfile };
}
