/**
 * Component for adding an attendee on the spot via a modal form.
 *
 * This component provides a modal interface to add attendees to an event
 * by collecting their details such as name, email, phone number, and gender.
 * It validates the form inputs, submits the data to the server using a GraphQL
 * mutation, and handles success or error responses appropriately.
 *
 * @remarks
 * - Uses `react-bootstrap` for UI constraints but avoids restricted imports.
 * - Utilizes `NotificationToast` for notifications.
 * - Integrates `react-i18next` for translations.
 * - Includes form validation to ensure required fields are filled.
 */
import { SIGNUP_MUTATION } from 'GraphQl/Mutations/mutations';
import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useParams } from 'react-router';
import { useMutation } from '@apollo/client';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import type {
  InterfaceAddOnSpotAttendeeProps,
  InterfaceFormData,
} from 'utils/interfaces';
import { useTranslation } from 'react-i18next';
import { errorHandler } from 'utils/errorHandler';
import LoadingState from 'shared-components/LoadingState/LoadingState';
import styles from './AddOnSpotAttendee.module.css';
import BaseModal from 'shared-components/BaseModal/BaseModal';

const AddOnSpotAttendee: React.FC<InterfaceAddOnSpotAttendeeProps> = ({
  show,
  handleClose,
  reloadMembers,
}) => {
  const [formData, setFormData] = useState<InterfaceFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNo: '',
    gender: '',
  });
  const { t } = useTranslation('translation', { keyPrefix: 'onSpotAttendee' });
  const { t: tCommon } = useTranslation('common');
  const { orgId } = useParams<{ orgId: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addSignUp] = useMutation(SIGNUP_MUTATION);
  const validateForm = (): boolean => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      NotificationToast.error(t('invalidDetailsMessage'));
      return false;
    }
    return true;
  };

  const resetForm = (): void => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phoneNo: '',
      gender: '',
    });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ): void => {
    const target = e.target as
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLTextAreaElement;
    setFormData((prev) => ({
      ...prev,
      [target.name]: target.value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await addSignUp({
        variables: {
          ID: orgId,
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          password: '123456',
        },
      });

      if (response.data?.signUp) {
        NotificationToast.success(t('attendeeAddedSuccess'));
        resetForm();
        reloadMembers();
        handleClose();
      }
    } catch (error) {
      errorHandler(t, error as Error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal
      show={show}
      onHide={handleClose}
      backdrop="static"
      centered
      title={t('title')}
      headerClassName={styles.modalHeader}
    >
      <form
        onSubmit={handleSubmit}
        data-testid="onspot-attendee-form"
        className="form-group"
      >
        <div className="d-flex justify-content-between">
          <div className="mb-1 w-48">
            <label htmlFor="firstName" className="form-label">
              {tCommon('firstName')}
            </label>
            <input
              id="firstName"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder={t('placeholder_firstName')}
              className="form-control"
            />
          </div>
          <div className="mb-1 w-48">
            <label htmlFor="lastName" className="form-label">
              {tCommon('lastName')}
            </label>
            <input
              id="lastName"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder={t('placeholder_lastName')}
              className="form-control"
            />
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="phoneNo" className="form-label">
            {t('phoneNumber')}
          </label>
          <input
            id="phoneNo"
            type="tel"
            name="phoneNo"
            value={formData.phoneNo}
            onChange={handleChange}
            placeholder={t('placeholder_phone')}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            {tCommon('email')}
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={t('placeholder_email')}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="gender" className="form-label">
            {tCommon('gender')}
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="form-select form-control"
          >
            <option value="">{t('selectGender')}</option>
            <option value="Male">{t('male')}</option>
            <option value="Female">{t('female')}</option>
            <option value="Other">{t('other')}</option>
          </select>
        </div>
        <br />
        <LoadingState isLoading={isSubmitting} variant="inline">
          <Button
            variant="success"
            type="submit"
            className={`border-1 mx-4 ${styles.addButton}`}
            disabled={isSubmitting}
          >
            {t('addAttendee')}
          </Button>
        </LoadingState>
      </form>
    </BaseModal>
  );
};

export default AddOnSpotAttendee;
