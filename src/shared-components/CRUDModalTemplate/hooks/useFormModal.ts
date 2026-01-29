import { useState, useCallback } from 'react';
import type { InterfaceUseFormModalReturn } from 'types/shared-components/CRUDModalTemplate/interface';

/**
 * Custom hook combining modal state with form data handling.
 *
 * Extends useModalState with form data management, useful for
 * edit modals where you need to open the modal with pre-populated data.
 *
 * @param initialData - Initial form data (defaults to null)
 * @returns Object containing modal state, form data, and control functions
 *
 * @example
 * ```tsx
 * const {
 *   isOpen,
 *   close,
 *   formData,
 *   openWithData,
 *   reset,
 *   isSubmitting,
 *   setIsSubmitting
 * } = useFormModal<Campaign>();
 *
 * const handleEdit = (campaign: Campaign) => {
 *   openWithData(campaign);
 * };
 *
 * const handleSubmit = async (e: FormEvent) => {
 *   e.preventDefault();
 *   setIsSubmitting(true);
 *   await updateCampaign(formData);
 *   setIsSubmitting(false);
 *   reset();
 * };
 *
 * return (
 *   <EditModal
 *     open={isOpen}
 *     onClose={reset}
 *     onSubmit={handleSubmit}
 *     loading={isSubmitting}
 *     title="Edit Campaign"
 *   >
 *     <Form.Control defaultValue={formData?.name} />
 *   </EditModal>
 * );
 * ```
 */
export function useFormModal<T>(
  initialData: T | null = null,
): InterfaceUseFormModalReturn<T> {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<T | null>(initialData);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const open = useCallback((): void => {
    setIsOpen(true);
  }, []);

  const close = useCallback((): void => {
    setIsOpen(false);
  }, []);

  const toggle = useCallback((): void => {
    setIsOpen((prev) => !prev);
  }, []);

  const openWithData = useCallback((data: T): void => {
    setFormData(data);
    setIsOpen(true);
  }, []);

  const reset = useCallback((): void => {
    setIsOpen(false);
    setFormData(initialData);
    setIsSubmitting(false);
  }, [initialData]);

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
  };
}
