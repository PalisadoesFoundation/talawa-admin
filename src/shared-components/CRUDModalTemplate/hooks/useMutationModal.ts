import { useState, useCallback, useRef, useEffect } from 'react';
import type { InterfaceUseMutationModalReturn } from 'types/shared-components/CRUDModalTemplate/interface';

/**
 * Custom hook for modals that execute mutations (GraphQL or API calls).
 *
 * Extends useFormModal with mutation execution, error handling,
 * and automatic state management during async operations.
 *
 * @param mutationFn - Async function to execute (e.g., GraphQL mutation)
 * @param options - Optional callbacks for success and error handling
 * @returns Object containing modal state, form data, mutation execution, and error state
 *
 * @example
 * ```tsx
 * const [updateCampaign] = useMutation(UPDATE_CAMPAIGN);
 *
 * const {
 *   isOpen,
 *   formData,
 *   openWithData,
 *   reset,
 *   execute,
 *   isSubmitting,
 *   error,
 *   clearError
 * } = useMutationModal<Campaign, UpdateCampaignResult>(
 *   async (data) => {
 *     const result = await updateCampaign({ variables: { input: data } });
 *     return result.data;
 *   },
 *   {
 *     onSuccess: () => {
 *       toast.success('Campaign updated!');
 *       reset();
 *     },
 *     onError: (err) => {
 *       toast.error(err.message);
 *     }
 *   }
 * );
 *
 * return (
 *   <EditModal
 *     open={isOpen}
 *     onClose={reset}
 *     onSubmit={(e) => { e.preventDefault(); execute(); }}
 *     loading={isSubmitting}
 *     error={error?.message}
 *     title="Edit Campaign"
 *   >
 *     <Form.Control defaultValue={formData?.name} />
 *   </EditModal>
 * );
 * ```
 */
export function useMutationModal<TData, TResult = unknown>(
  mutationFn: (data: TData) => Promise<TResult>,
  options?: {
    onSuccess?: (result: TResult) => void;
    onError?: (error: Error) => void;
    allowEmptyData?: boolean;
  },
): InterfaceUseMutationModalReturn<TData, TResult> {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<TData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const onSuccessRef = useRef(options?.onSuccess);
  const onErrorRef = useRef(options?.onError);
  const allowEmptyDataRef = useRef(options?.allowEmptyData);

  useEffect(() => {
    onSuccessRef.current = options?.onSuccess;
    onErrorRef.current = options?.onError;
    allowEmptyDataRef.current = options?.allowEmptyData;
  }, [options?.onSuccess, options?.onError, options?.allowEmptyData]);

  const open = useCallback((): void => {
    setIsOpen(true);
    setError(null);
  }, []);

  const close = useCallback((): void => {
    setIsOpen(false);
  }, []);

  const toggle = useCallback((): void => {
    setIsOpen((prev) => !prev);
  }, []);

  const openWithData = useCallback((data: TData): void => {
    setFormData(data);
    setIsOpen(true);
    setError(null);
  }, []);

  const reset = useCallback((): void => {
    setIsOpen(false);
    setFormData(null);
    setIsSubmitting(false);
    setError(null);
  }, []);

  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  const execute = useCallback(
    async (data?: TData): Promise<TResult | undefined> => {
      const dataToSubmit = data ?? formData;
      if (dataToSubmit == null && !allowEmptyDataRef.current) {
        return undefined;
      }

      setIsSubmitting(true);
      setError(null);

      try {
        const result = await mutationFn(dataToSubmit as TData);
        onSuccessRef.current?.(result);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        onErrorRef.current?.(error);
        return undefined;
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, mutationFn],
  );

  return {
    isOpen,
    open,
    close,
    toggle,
    formData,
    openWithData,
    reset,
    isSubmitting,
    setIsSubmitting,
    execute,
    error,
    clearError,
  };
}
