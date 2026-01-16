import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from 'style/app-fixed.module.css';

interface Props {
  show: boolean;
  password: string;
  email: string;
  attendeeName: string;
  handleClose: () => void;
}

const AddOnSpotSuccessModal = ({
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
      toast.success(t('passwordCopied'));
    } catch {
      toast.error(t('copyFailed'));
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {t('attendeeAddedSuccess')}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className={styles.modalBody}>
        <p>
          {t('hello')} <b>{attendeeName}</b>
        </p>

        <p>
          <b>{t('email')}:</b> {email}
        </p>

        <p>
          <b>{t('password')}:</b>{' '}
          {showPassword ? password : '********'}
        </p>

        <Button
          size="sm"
          variant="outline-secondary"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? t('hide') : t('show')}
        </Button>

        <hr />

        <small className="text-danger">
          {t('passwordWarning')}
        </small>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={copyPassword}>
          {t('copyPassword')}
        </Button>

        <Button variant="success" onClick={handleClose}>
          {t('close')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddOnSpotSuccessModal;
