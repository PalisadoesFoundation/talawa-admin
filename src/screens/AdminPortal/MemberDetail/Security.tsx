import React, { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from 'react-bootstrap';
import Button from 'shared-components/Button';
import PasswordUpdateModal from 'shared-components/Auth/PasswordUpdate/PasswordUpdateModal';
import {
  ADMIN_UPDATE_USER_PASSWORD,
  UPDATE_USER_PASSWORD,
} from 'GraphQl/Mutations/mutations';
import { useMutation } from '@apollo/client';
import { useParams } from 'react-router';
import useLocalStorage from 'utils/useLocalstorage';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { validatePassword } from 'utils/passwordValidator';
import styles from './Security.module.css';

/**
 * Security component.
 *
 * @remarks
 * Displays security settings for a user, allowing them to update their password.
 * Administrators can also reset passwords for other users without requiring the
 * current password. The component opens a {@link PasswordUpdateModal} for handling
 * password updates and performs validation before executing the appropriate
 * GraphQL mutation.
 *
 * @returns A card containing password management controls.
 */
const Security = (): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'memberDetail' });
  const { t: tValidation } = useTranslation('translation');

  const { getItem } = useLocalStorage();
  const { userId } = useParams();

  const loggedInUserId = getItem('userId');
  const resolvedUserId = userId || loggedInUserId;

  const isAdminEditingOtherUser = loggedInUserId !== resolvedUserId;

  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [updateUserPassword] = useMutation(UPDATE_USER_PASSWORD);
  const [adminUpdateUserPassword] = useMutation(ADMIN_UPDATE_USER_PASSWORD);

  const [form, setForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleClose = () => {
    setOpen(false);
    setForm({
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    });
  };

  const handleSubmit = async (): Promise<void> => {
    if (isSubmitting) return;
    const { oldPassword, newPassword, confirmNewPassword } = form;

    if (!newPassword || !confirmNewPassword) {
      NotificationToast.error(t('passCantBeEmpty'));
      return;
    }

    if (newPassword !== confirmNewPassword) {
      NotificationToast.error(t('passNoMatch'));
      return;
    }

    const checkPassword = validatePassword(newPassword);

    if (checkPassword) {
      NotificationToast.error(tValidation(checkPassword));
      return;
    }
    setIsSubmitting(true);
    try {
      if (isAdminEditingOtherUser) {
        await adminUpdateUserPassword({
          variables: {
            input: {
              id: resolvedUserId,
              newPassword,
              confirmNewPassword,
            },
          },
        });
      } else {
        if (!oldPassword) {
          NotificationToast.error(t('enterCurrentPassword'));
          return;
        }

        await updateUserPassword({
          variables: {
            input: {
              oldPassword,
              newPassword,
              confirmNewPassword,
            },
          },
        });
      }

      NotificationToast.success(t('passwordChangedSuccessfully'));
      handleClose();
    } catch (err) {
      if (err instanceof Error) {
        NotificationToast.error(err.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="w-100">
        <Card className={`mt-4 ${styles.securityCard}`}>
          <Card.Body className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-1 fw-semibold">{t('password')}</h5>
            </div>

            <Button
              variant="outline-secondary"
              onClick={() => setOpen(true)}
              data-testid="changePasswordBtn"
            >
              {t('changePassword')}
            </Button>
          </Card.Body>
        </Card>
      </div>

      <PasswordUpdateModal
        open={open}
        onClose={handleClose}
        onSubmit={handleSubmit}
        values={form}
        onChange={handleChange}
        loading={isSubmitting}
        hidePreviousPassword={isAdminEditingOtherUser}
        title={t('changePassword')}
        saveText={t('updatePassword')}
        oldPasswordLabel={t('oldPassword')}
        newPasswordLabel={t('newPassword')}
        confirmPasswordLabel={t('confirmNewPassword')}
      />
    </>
  );
};

export default Security;
