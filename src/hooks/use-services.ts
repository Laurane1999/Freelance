import { useCallback, useState } from 'react';

import * as serviceService from '@/services/service-service';
import type { NewServiceInput, Service } from '@/types/service';
import { toErrorMessage } from '@/utils/errors';

interface UseServicesResult {
  services: Service[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

/**
 * Logic layer for browsing the marketplace (MARKETPLACE phase). UI calls this
 * hook, never the services or Firebase directly (docs/02_ARCHITECTURE). The
 * consumer triggers the initial load (the marketplace screen does so on focus).
 */
export function useServices(): UseServicesResult {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setServices(await serviceService.listServices());
    } catch (err) {
      setError(toErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  return { services, loading, error, reload };
}

interface UseCreateServiceResult {
  submitting: boolean;
  error: string | null;
  clearError: () => void;
  createService: (input: NewServiceInput) => Promise<boolean>;
}

export function useCreateService(): UseCreateServiceResult {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const createService = useCallback(
    async (input: NewServiceInput): Promise<boolean> => {
      setSubmitting(true);
      setError(null);
      try {
        await serviceService.createService(input);
        return true;
      } catch (err) {
        setError(toErrorMessage(err));
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [],
  );

  return { submitting, error, clearError, createService };
}
