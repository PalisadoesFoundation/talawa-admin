import React, { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PasswordUpdateModal from 'shared-components/Auth/PasswordUpdate/PasswordUpdateModal';

const Security = (): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'memberDetail' });
  const { t: tCommon } = useTranslation('common');

  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleClose = () => {
    setOpen(false);
    setForm({
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    });
  };

  const handleSubmit = () => {
    // call mutation later
    setOpen(false);
  };

  return (
    <div className="w-100 d-flex justify-content-center">
      <PasswordUpdateModal
        open={open}
        onClose={handleClose}
        onSubmit={handleSubmit}
        values={form}
        onChange={handleChange}
        title={t('changePassword')}
        saveText={tCommon('saveChanges')}
        oldPasswordLabel={t('oldPassword')}
        newPasswordLabel={t('newPassword')}
        confirmPasswordLabel={t('confirmNewPassword')}
      />
    </div>
  );
};

export default Security;
