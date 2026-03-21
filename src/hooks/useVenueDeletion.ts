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
      await deleteVenue({ variables: { id: selectedVenueId } });
      const refetchFn = venueRefetch ?? (() => Promise.resolve());
      await refetchFn();
      close();
    } catch (error) {
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
