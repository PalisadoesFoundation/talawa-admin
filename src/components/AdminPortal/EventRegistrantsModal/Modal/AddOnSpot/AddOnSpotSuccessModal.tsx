/**
 * Modal displayed after successfully adding an on-spot attendee.
 *
 * Shows attendee credentials including:
 * - Name
 * - Email
 * - Generated password (masked by default)
 *
 * Features:
 * - Toggle show/hide password
 * - Copy password to clipboard
 * - Warning to save password securely
 *
 * @param show - Controls modal visibility
 * @param password - Generated password for attendee
 * @param email - Attendee email address
 * @param attendeeName - Full name of attendee
 * @param handleClose - Closes the modal
 *
 * @returns Rendered AddOnSpotSuccessModal component
 *
 * @remarks
 * - Uses shared BaseModal component
 * - Uses NotificationToast for success/error alerts
 * - Uses i18next for translations
 * - Password is masked by default for security
 *
 * @example
 * ```tsx
 * <AddOnSpotSuccessModal
 *   show={true}
 *   password="Test@123"
 *   email="user@example.com"
 *   attendeeName="John Doe"
 *   handleClose={() => setShow(false)}
 * />
 * ```
 *
 * Dependencies
 * - shared-components/BaseModal
 * - NotificationToast
 * - react-i18next
 * - react-bootstrap Button
 */

import { Button } from 'react-bootstrap';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from 'style/app-fixed.module.css';
import { BaseModal } from 'shared-components/BaseModal';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { AddOnSpotSuccessModalProps } from "types/AdminPortal/AddOnSpotSuccessModal/interface";




const AddOnSpotSuccessModal: FC<AddOnSpotSuccessModalProps> = ({
  show,
  password,
  email,
  attendeeName,
  handleClose,
}: Props) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'onSpotAttendee',
  });

  const [showPassword, setShowPassword] = useState(false);

  const copyPassword = async () => {
    try {
      await navigator.clipboard.writeText(password);
      NotificationToast.success(t('passwordCopied'));
    } catch {
      NotificationToast.error(t('copyFailed'));
    }
  };

  return (
    <BaseModal
      show={show}
      onHide={handleClose}
      centered
      backdrop="static"
      title={t('attendeeAddedSuccess')}
    >
      <div className={styles.modalBody}>
        <p>
          {t('hello')} <b>{attendeeName}</b>
        </p>

        <p>
          <b>{t('email')}:</b> {email}
        </p>

        <p>
          <b>{t('password')}:</b> {showPassword ? password : '********'}
        </p>

        <Button
          size="sm"
          variant="outline-secondary"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? t('hide') : t('show')}
        </Button>

        <hr />

        <small className="text-danger">{t('passwordWarning')}</small>
      </div>

      <div className="d-flex justify-content-end gap-2 mt-3">
        <Button variant="secondary" onClick={copyPassword}>
          {t('copyPassword')}
        </Button>

        <Button variant="success" onClick={handleClose}>
          {t('close')}
        </Button>
      </div>
    </BaseModal>
  );
};

export default AddOnSpotSuccessModal;
