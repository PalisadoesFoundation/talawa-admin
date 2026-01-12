import React, { useEffect, useCallback } from 'react';
import { Button, Alert } from 'react-bootstrap';
import BaseModal from 'shared-components/BaseModal/BaseModal';
import LoadingState from 'shared-components/LoadingState/LoadingState';
import type { InterfaceCRUDModalTemplateProps } from 'types/CRUDModalTemplate/interface';
import styles from './CRUDModalTemplate.module.css';
import globalStyles from 'style/app-fixed.module.css';

/**
 * Base CRUD Modal Template Component
 *
 * A reusable modal component that provides consistent structure, styling,
 * and behavior for all CRUD operations. This component serves as the foundation
 * for specialized modal templates (Create, Edit, Delete, View).
 *
 * Features:
 * - Consistent modal structure and styling
 * - Loading state management with spinner overlay
 * - Error display with alert component
 * - Customizable footer with action buttons
 * - Keyboard shortcuts (Escape to close)
 * - Accessible with proper ARIA attributes
 * - Prevents modal close during loading operations
 *
 * @example
 * ```tsx
 * <CRUDModalTemplate
 *   open={isOpen}
 *   title="Edit User"
 *   onClose={handleClose}
 *   onPrimary={handleSave}
 *   loading={isSaving}
 *   error={errorMessage}
 * >
 *   <Form.Group>
 *     <Form.Label>Name</Form.Label>
 *     <Form.Control value={name} onChange={e => setName(e.target.value)} />
 *   </Form.Group>
 * </CRUDModalTemplate>
 * ```
 */
export const CRUDModalTemplate: React.FC<InterfaceCRUDModalTemplateProps> = ({
  open,
  show,
  title,
  onClose,
  children,
  onPrimary,
  primaryText = 'Save',
  secondaryText = 'Cancel',
  loading = false,
  error,
  size,
  className,
  centered = true,
  'data-testid': dataTestId,
  primaryVariant = 'primary',
  primaryDisabled = false,
  hideSecondary = false,
  customFooter,
  showFooter = true,
}) => {
  const isOpen = open ?? show ?? false;

  const handleEscapeKey = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen && !loading) {
        onClose();
      }
    },
    [isOpen, loading, onClose],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [handleEscapeKey]);

  const handlePrimaryClick = () => {
    if (onPrimary && !loading) {
      onPrimary();
    }
  };

  const footer = showFooter ? (
    customFooter ? (
      customFooter
    ) : (
      <>
        {!hideSecondary && (
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading}
            data-testid="modal-secondary-btn"
          >
            {secondaryText}
          </Button>
        )}
        {onPrimary && (
          <Button
            variant={primaryVariant}
            onClick={handlePrimaryClick}
            disabled={loading || primaryDisabled}
            className={
              primaryVariant === 'primary'
                ? globalStyles.addButton
                : primaryVariant === 'danger'
                  ? globalStyles.removeButton
                  : ''
            }
            data-testid="modal-primary-btn"
          >
            {primaryText}
          </Button>
        )}
      </>
    )
  ) : undefined;

  return (
    <BaseModal
      show={isOpen}
      onHide={onClose}
      title={title}
      size={size}
      centered={centered}
      className={className}
      dataTestId={dataTestId}
      backdrop={loading ? 'static' : true}
      keyboard={!loading}
      showCloseButton={!loading}
      footer={footer}
      bodyClassName={styles.modalBody}
    >
      {error && (
        <Alert variant="danger" className={styles.errorAlert}>
          {error}
        </Alert>
      )}

      <LoadingState isLoading={loading} variant="inline">
        {children}
      </LoadingState>
    </BaseModal>
  );
};
