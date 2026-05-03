/**
 * BaseModal — native <dialog> implementation.
 *
 * Replaces react-bootstrap Modal. Same IBaseModalProps interface.
 * Uses showModal() for top-layer + backdrop. Frosted-glass backdrop,
 * slide-up animation, Escape key support.
 */
import { useId, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Button } from 'shared-components/Button';
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
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (show && !dialog.open) {
      dialog.showModal();
    } else if (!show && dialog.open) {
      dialog.close();
    }
  }, [show]);

  const handleCancel = useCallback(
    (e: Event) => {
      if (!keyboard) {
        e.preventDefault();
        return;
      }
      onHide();
    },
    [keyboard, onHide],
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDialogElement>) => {
      if (backdrop === 'static') return;
      if (e.target === dialogRef.current) {
        onHide();
      }
    },
    [backdrop, onHide],
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.addEventListener('cancel', handleCancel);
    return () => dialog.removeEventListener('cancel', handleCancel);
  }, [handleCancel]);

  const sizeClass = size
    ? { sm: styles.sizeSm, lg: styles.sizeLg, xl: styles.sizeXl }[size] || ''
    : '';

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

  // Portal the dialog to document.body so it's never nested inside
  // invalid parents like <tbody>, <tr>, etc.
  return createPortal(
    <dialog
      ref={dialogRef}
      className={`${styles.dialog} ${sizeClass} ${centered ? styles.centered : ''} ${className || ''}`}
      role="dialog"
      aria-modal={true}
      aria-labelledby={title ? titleId : undefined}
      aria-describedby={bodyId}
      data-testid={dataTestId}
      id={id}
      onClick={handleClick}
    >
      <div className={styles.dialogContent}>
        {headerContent ? (
          <div
            className={`${styles.header} ${headerClassName || ''}`}
            data-testid={headerTestId}
          >
            {headerContent}
            {closeButton}
          </div>
        ) : (
          <div
            className={`${styles.header} ${headerClassName || ''}`}
            data-testid={headerTestId}
          >
            <h2 className={styles.title} id={titleId}>
              {title}
            </h2>
            {closeButton}
          </div>
        )}
        <div id={bodyId} className={`${styles.body} ${bodyClassName || ''}`}>
          {children}
        </div>
        {footer && (
          <div
            className={`${styles.footer} ${footerClassName || ''}`}
            data-testid="modal-footer"
          >
            {footer}
          </div>
        )}
      </div>
    </dialog>,
    document.body,
  );
}
