import { useCallback, useState } from 'react';

import * as missionService from '@/services/mission-service';
import type { Mission, MissionStatus, NewMissionInput } from '@/types/mission';
import { toErrorMessage } from '@/utils/errors';

interface UseMissionsResult {
  missions: Mission[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

/**
 * Logic layer for the current user's missions (MISSIONS phase). The consumer
 * triggers the initial load (the missions screen does so on focus).
 */
export function useMissions(userId: string | undefined): UseMissionsResult {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!userId) {
      setMissions([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      setMissions(await missionService.listMissionsForUser(userId));
    } catch (err) {
      setError(toErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  return { missions, loading, error, reload };
}

interface UseMissionActionsResult {
  submitting: boolean;
  error: string | null;
  clearError: () => void;
  hire: (input: NewMissionInput) => Promise<boolean>;
  setStatus: (id: string, status: MissionStatus) => Promise<boolean>;
}

export function useMissionActions(): UseMissionActionsResult {
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
      setError(toErrorMessage(err));
      return false;
    } finally {
      setSubmitting(false);
    }
  }, []);

  const hire = useCallback(
    (input: NewMissionInput) => run(() => missionService.createMission(input).then(() => undefined)),
    [run],
  );

  const setStatus = useCallback(
    (id: string, status: MissionStatus) =>
      run(() => missionService.updateMissionStatus(id, status)),
    [run],
  );

  return { submitting, error, clearError, hire, setStatus };
}
