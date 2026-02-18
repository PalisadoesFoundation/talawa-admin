import React, { useEffect, useRef } from 'react';
import Button from 'shared-components/Button';
import { CRUDModalTemplate } from './CRUDModalTemplate';
import type { InterfaceEditModalProps } from 'types/shared-components/CRUDModalTemplate/interface';
import { useTranslation } from 'react-i18next';

/**
 * EditModal Component
 *
 * Specialized modal template for editing existing entities.
 * Supports data loading states and pre-population of form fields.
 *
 * Features:
 * - Auto-focus on first input field when modal opens and data is loaded
 * - Keyboard shortcut: Ctrl/Cmd+Enter to submit form
 * - Loading state for data fetching (loadingData prop)
 * - Form validation support via submitDisabled prop
 * - Prevents duplicate submissions during save
 *
 * @example
 * ```tsx
 * <EditModal
 *   open={showModal}
 *   title="Edit Campaign"
 *   onClose={handleClose}
 *   onSubmit={handleUpdate}
 *   loading={isSaving}
 *   loadingData={isLoadingData}
 *   error={error}
 *   submitDisabled={!isFormDirty}
 * >
 *   <Form.Group>
 *     <Form.Label>Campaign Name</Form.Label>
 *     <Form.Control
 *       value={name}
 *       onChange={(e) => setName(e.target.value)}
 *       required
 *     />
 *   </Form.Group>
 * </EditModal>
 * ```
 */
export const EditModal: React.FC<InterfaceEditModalProps> = ({
  open,
  title,
  onClose,
  children,
  onSubmit,
  loading = false,
  loadingData = false,
  error,
  size,
  className,
  centered = true,
  'data-testid': dataTestId,
  submitDisabled = false,
}) => {
  const { t: tCommon } = useTranslation('common');
  const isOpen = open ?? false;
  const formRef = useRef<HTMLFormElement>(null);
  const isLoading = loading || loadingData;

  useEffect(() => {
    if (isOpen && !isLoading && formRef.current) {
      const firstInput = formRef.current.querySelector<
        HTMLInputElement | HTMLTextAreaElement
      >(
        'input:not([type="hidden"]):not([disabled]), textarea:not([disabled]), select:not([disabled])',
      );
      if (firstInput) {
        setTimeout(() => firstInput.focus(), 100);
      }
    }
  }, [isOpen, isLoading]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(event);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  const customFooter = (
    <>
      <Button
        variant="secondary"
        onClick={onClose}
        disabled={isLoading}
        data-testid="modal-cancel-btn"
      >
        {tCommon('cancel')}
      </Button>
      <Button
        type="submit"
        form="crud-edit-form"
        variant="primary"
        disabled={isLoading || submitDisabled}
        data-testid="modal-submit-btn"
      >
        {tCommon('update')}
      </Button>
    </>
  );

  return (
    <CRUDModalTemplate
      open={isOpen}
      title={title}
      onClose={onClose}
      loading={isLoading}
      error={error}
      size={size}
      className={className}
      centered={centered}
      data-testid={dataTestId}
      customFooter={customFooter}
    >
      <form
        id="crud-edit-form"
        ref={formRef}
        onSubmit={handleSubmit}
        onKeyDown={handleKeyDown}
      >
        {children}
      </form>
    </CRUDModalTemplate>
  );
};
