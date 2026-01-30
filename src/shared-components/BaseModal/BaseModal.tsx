/**
 * BaseModal component.
 *
 * A reusable wrapper around react-bootstrap Modal that provides a consistent
 * structure and reduces boilerplate code across the Talawa Admin application.
 * Handles common patterns like header with title/close button, body content,
 * and optional footer with action buttons.
 *
 * @remarks
 * Features:
 * - Standardized header with optional title and close button.
 * - Customizable size variants: sm, lg, xl.
 * - Built-in accessibility including aria-modal, role dialog, and Escape key support.
 * - Flexible footer for action buttons.
 * - Custom header support for complex layouts.
 * - i18n support for user-visible strings.
 *
 * Example usage:
 * - Confirmation modal with title, footer actions, and content.
 * - Form modal with custom header styling and submit button.
 */
import { useId } from 'react';
import { Button } from 'shared-components/Button';
import { Modal } from 'react-bootstrap';
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
  headerTestId,
  bodyClassName,
  footerClassName,
  showCloseButton = true,
  closeButtonVariant = 'danger',
  dataTestId,
  id,
}: IBaseModalProps) {
  const { t } = useTranslation('common');
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
      id={id}
    >
      {headerContent ? (
        <Modal.Header className={headerClassName} data-testid={headerTestId}>
          {headerContent}
          {closeButton}
        </Modal.Header>
      ) : (
        <Modal.Header className={headerClassName} data-testid={headerTestId}>
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
