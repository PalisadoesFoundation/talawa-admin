/**
 * BaseModal Component
 *
 * A reusable wrapper around react-bootstrap Modal that provides a consistent
 * structure and reduces boilerplate code across the Talawa Admin application.
 * Handles common patterns like header with title/close button, body content,
 * and optional footer with action buttons.
 *
 * Features:
 * - Standardized header with optional title and close button
 * - Customizable size variants (sm, lg, xl)
 * - Built-in accessibility (aria-modal, role="dialog", Escape key support)
 * - Flexible footer for action buttons
 * - Custom header support for complex layouts
 * - i18n support for all user-visible strings
 *
 * @example
 * ```tsx
 * // Simple delete confirmation modal
 * <BaseModal
 *   show={isOpen}
 *   onHide={handleClose}
 *   title={t('deletePost')}
 *   dataTestId="delete-post-modal"
 *   footer={
 *     <>
 *       <Button variant="secondary" onClick={handleClose}>
 *         {tCommon('cancel')}
 *       </Button>
 *       <Button variant="danger" onClick={handleDelete}>
 *         {tCommon('confirm')}
 *       </Button>
 *     </>
 *   }
 * >
 *   <p>{t('deletePostMsg')}</p>
 * </BaseModal>
 * ```
 *
 * @example
 * ```tsx
 * // Form modal with custom styling
 * <BaseModal
 *   show={isEditOpen}
 *   onHide={handleClose}
 *   title={t('editTag')}
 *   size="lg"
 *   headerClassName={styles.customHeader}
 *   footer={
 *     <>
 *       <Button variant="secondary" onClick={handleClose}>
 *         {tCommon('cancel')}
 *       </Button>
 *       <Button type="submit" form="edit-form">
 *         {tCommon('save')}
 *       </Button>
 *     </>
 *   }
 * >
 *   <Form id="edit-form" onSubmit={handleSubmit}>
 *     <Form.Control {...} />
 *   </Form>
 * </BaseModal>
 * ```
 */
import { useId } from 'react';
import { Modal, Button } from 'react-bootstrap';
import type { IBaseModalProps } from 'types/shared-components/BaseModal/interface';
import { useTranslation } from 'react-i18next';
import styles from './BaseModal.module.css';

export default function BaseModal({
  show,
  onHide,
  title,
  headerContent,
  children,
  footer,
  size,
  centered = true,
  backdrop = 'static',
  keyboard = true,
  className,
  headerClassName,
  bodyClassName,
  footerClassName,
  showCloseButton = true,
  closeButtonVariant = 'danger',
  dataTestId,
}: IBaseModalProps) {
  const { t } = useTranslation('translation', { keyPrefix: 'common' });
  const titleId = useId();
  const bodyId = useId();

  const closeButton = showCloseButton ? (
    <Button
      variant={closeButtonVariant}
      onClick={onHide}
      aria-label={t('close')}
      data-testid="modalCloseBtn"
      className={styles.closeButton}
    >
      <i className="fa fa-times"></i>
    </Button>
  ) : null;

  return (
    <Modal
      show={show}
      onHide={onHide}
      size={size}
      centered={centered}
      backdrop={backdrop}
      keyboard={keyboard}
      className={className}
      role="dialog"
      aria-modal={true}
      aria-labelledby={title ? titleId : undefined}
      aria-describedby={bodyId}
      data-testid={dataTestId}
    >
      {headerContent ? (
        <Modal.Header className={headerClassName}>
          {headerContent}
          {closeButton}
        </Modal.Header>
      ) : (
        <Modal.Header className={headerClassName}>
          <Modal.Title id={titleId}>{title}</Modal.Title>
          {closeButton}
        </Modal.Header>
      )}
      <Modal.Body id={bodyId} className={bodyClassName}>
        {children}
      </Modal.Body>
      {footer && (
        <Modal.Footer className={footerClassName} data-testid="modal-footer">
          {footer}
        </Modal.Footer>
      )}
    </Modal>
  );
}
