/**
 * Component for adding an attendee on the spot via a modal form.
 *
 * Provides a modal interface to add attendees by collecting:
 * - First name
 * - Last name
 * - Email
 * - Phone number
 * - Gender
 *
 * It validates inputs, submits data using a GraphQL mutation,
 * and shows success or error notifications accordingly.
 *
 * @param show - Controls modal visibility
 * @param handleClose - Closes the modal
 * @param reloadMembers - Reloads attendee list after success
 *
 * @returns Rendered AddOnSpotAttendee component
 *
 * @remarks
 * - Uses shared BaseModal component
 * - Uses NotificationToast for alerts
 * - Uses i18next for translations
 * - Includes client-side form validation
 *
 * @example
 * ```tsx
 * <AddOnSpotAttendee
 *   show={true}
 *   handleClose={() => setShow(false)}
 *   reloadMembers={fetchMembers}
 * />
 * ```
 *
 * Dependencies
 * - apollo/client
 * - shared-components/BaseModal
 * - NotificationToast
 * - react-i18next
*/

import { SIGNUP_MUTATION } from 'GraphQl/Mutations/mutations';
import React, { useState } from 'react';
import Button from 'shared-components/Button';
import {
  FormTextField,
  FormSelectField,
} from 'shared-components/FormFieldGroup/FormFieldGroup';
import { BaseModal } from 'shared-components/BaseModal';
import styles from './AddOnSpotAttendee.module.css';
import { useParams } from 'react-router';
import { useMutation } from '@apollo/client';
import type {
  InterfaceAddOnSpotAttendeeProps,
  InterfaceFormData,
} from 'types/AdminPortal/EventRegistrantsModal/AddOnSpot';
import { useTranslation } from 'react-i18next';
import { errorHandler } from 'utils/errorHandler';
import LoadingState from 'shared-components/LoadingState/LoadingState';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { ErrorBoundaryWrapper } from 'shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper';
import { generateSecurePassword } from 'utils/generateSecurePassword';
import AddOnSpotSuccessModal from './AddOnSpotSuccessModal';

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
  const { t: tErrors } = useTranslation('errors');
  const { orgId } = useParams<{ orgId: string }>();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addSignUp] = useMutation(SIGNUP_MUTATION);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [createdUser, setCreatedUser] = useState({
    name: '',
    email: '',
  });

  const validateForm = (): boolean => {
    if (!orgId) {
      NotificationToast.error(t('organizationIdMissing'));
      return false;
    }

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

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const securePassword = generateSecurePassword();

      const response = await addSignUp({
        variables: {
          ID: orgId,
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          password: securePassword,
        },
      });

      if (response.data?.signUp) {
        NotificationToast.success(t('attendeeAddedSuccess'));

        setGeneratedPassword(securePassword);
        setCreatedUser({
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
        });

        setShowSuccessModal(true);

        resetForm();
        reloadMembers();
      }
    } catch (error) {
      errorHandler(t, error as Error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ErrorBoundaryWrapper
      fallbackErrorMessage={tErrors('defaultErrorMessage')}
      fallbackTitle={tErrors('title')}
      resetButtonAriaLabel={tErrors('resetButtonAriaLabel')}
      resetButtonText={tErrors('resetButton')}
    >
      <BaseModal
        show={show}
        onHide={handleClose}
        backdrop="static"
        centered
        headerClassName={modalStyles.modalHeader}
        title={t('title')}
      >
        <form onSubmit={handleSubmit} data-testid="onspot-attendee-form">
          <div className="d-flex justify-content-between">
            <FormTextField
              name="firstName"
              label={tCommon('firstName')}
              value={formData.firstName}
              onChange={(v) =>
                setFormData((prev) => ({ ...prev, firstName: v }))
              }
              placeholder={t('placeholderFirstName')}
              required
            />

            <FormTextField
              name="lastName"
              label={tCommon('lastName')}
              value={formData.lastName}
              onChange={(v) =>
                setFormData((prev) => ({ ...prev, lastName: v }))
              }
              placeholder={t('placeholderLastName')}
              required
            />
          </div>

          <FormTextField
            name="phoneNo"
            label={t('phoneNumber')}
            type="tel"
            value={formData.phoneNo}
            onChange={(v) => setFormData((prev) => ({ ...prev, phoneNo: v }))}
            placeholder={t('phoneNumberPlaceholder')}
          />

          <FormTextField
            name="email"
            label={tCommon('email')}
            type="email"
            value={formData.email}
            onChange={(v) => setFormData((prev) => ({ ...prev, email: v }))}
            placeholder={t('placeholderEmail')}
            required
          />

          <FormSelectField
            name="gender"
            label={tCommon('gender')}
            value={formData.gender}
            onChange={(v) => setFormData((prev) => ({ ...prev, gender: v }))}
          >
            <option value="">{t('selectGender')}</option>
            <option value="Male">{t('male')}</option>
            <option value="Female">{t('female')}</option>
            <option value="Other">{t('other')}</option>
          </FormSelectField>

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

      <AddOnSpotSuccessModal
        show={showSuccessModal}
        password={generatedPassword}
        email={createdUser.email}
        attendeeName={createdUser.name}
        handleClose={() => {
          setShowSuccessModal(false);
          handleClose();
        }}
      />
    </ErrorBoundaryWrapper>
  );
};

export default AddOnSpotAttendee;
