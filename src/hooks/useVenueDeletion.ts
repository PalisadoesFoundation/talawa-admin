import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { errorHandler } from 'utils/errorHandler';
import type { MutationFunction, OperationVariables } from '@apollo/client';

export default function useVenueDeletion(
  deleteVenue: MutationFunction<unknown, OperationVariables>,
  venueRefetch?: () => Promise<unknown>,
) {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationVenues',
  });
  const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const open = (id: string): void => {
    setSelectedVenueId(id);
    setIsOpen(true);
  };

  const close = (): void => {
    setSelectedVenueId(null);
    setIsOpen(false);
  };

  const confirmDelete = async (): Promise<void> => {
    if (!selectedVenueId) return;
    try {
      setDeleting(true);
      // Perform deletion first
      await deleteVenue({ variables: { id: selectedVenueId } });

      // Close modal immediately after successful delete so UI can't retry
      // against a resource that no longer exists.
      close();

      // Attempt to refresh the list as a best-effort operation. Any
      // refetch errors should be reported but must not re-open the modal.
      const refetchFn = venueRefetch ?? (() => Promise.resolve());
      try {
        await refetchFn();
      } catch (refetchError) {
        errorHandler(t, refetchError as Error);
      }
    } catch (error) {
      // Deletion itself failed — report and keep the modal open so the
      // user may retry or inspect the error.
      errorHandler(t, error as Error);
    } finally {
      setDeleting(false);
    }
  };

  return {
    selectedVenueId,
    isOpen,
    open,
    close,
    confirmDelete,
    deleting,
  } as const;
}
