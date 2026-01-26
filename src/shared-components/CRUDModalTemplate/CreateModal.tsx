import React, { useEffect, useRef } from 'react';
import Button from 'shared-components/Button';
import { useTranslation } from 'react-i18next';
import { CRUDModalTemplate } from './CRUDModalTemplate';
import type { InterfaceCreateModalProps } from 'types/shared-components/CRUDModalTemplate/interface';

/**
 * CreateModal Component
 *
 * Specialized modal template for creating new entities.
 * Wraps form content with proper submission handling and loading states.
 *
 * Features:
 * - Auto-focus on first input field when modal opens
 * - Keyboard shortcut: Ctrl/Cmd+Enter to submit form
 * - Form validation support via submitDisabled prop
 * - Loading state prevents duplicate submissions
 * - Error display with alert component
 *
 * @example
 * ```tsx
 * <CreateModal
 *   open={showModal}
 *   title="Create Campaign"
 *   onClose={handleClose}
 *   onSubmit={handleCreate}
 *   loading={isCreating}
 *   error={error}
 *   submitDisabled={!isFormValid}
 * >
 *   <Form.Group>
 *     <Form.Label>Campaign Name</Form.Label>
 *     <Form.Control
 *       value={name}
 *       onChange={(e) => setName(e.target.value)}
 *       required
 *     />
 *   </Form.Group>
 * </CreateModal>
 * ```
 */
export const CreateModal: React.FC<InterfaceCreateModalProps> = ({
  open,
  title,
  onClose,
  children,
  onSubmit,
  loading = false,
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

  useEffect(() => {
    if (isOpen && formRef.current) {
      const firstInput = formRef.current.querySelector<
        HTMLInputElement | HTMLTextAreaElement
      >(
        'input:not([type="hidden"]):not([disabled]), textarea:not([disabled]), select:not([disabled])',
      );
      if (firstInput) {
        setTimeout(() => firstInput.focus(), 100);
      }
    }
  }, [isOpen]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(event);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === 'Enter') {
      const target = event.target as HTMLElement;
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
        formRef.current?.requestSubmit();
      } else if (target.tagName !== 'TEXTAREA') {
        event.preventDefault();
      }
    }
  };

  const customFooter = (
    <>
      <Button
        variant="secondary"
        onClick={onClose}
        disabled={loading}
        data-testid="modal-cancel-btn"
      >
        {tCommon('cancel')}
      </Button>
      <Button
        type="submit"
        form="crud-create-form"
        variant="primary"
        disabled={loading || submitDisabled}
        data-testid="modal-submit-btn"
      >
        {tCommon('create')}
      </Button>
    </>
  );

  return (
    <CRUDModalTemplate
      open={isOpen}
      title={title}
      onClose={onClose}
      loading={loading}
      error={error}
      size={size}
      className={className}
      centered={centered}
      data-testid={dataTestId}
      customFooter={customFooter}
    >
      <form
        id="crud-create-form"
        ref={formRef}
        onSubmit={handleSubmit}
        onKeyDown={handleKeyDown}
      >
        {children}
      </form>
    </CRUDModalTemplate>
  );
};
