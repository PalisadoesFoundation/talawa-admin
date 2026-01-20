/**
 * Component for adding an attendee on the spot via a modal form.
 *
 * This component provides a modal interface to add attendees to an event
 * by collecting their details such as name, email, phone number, and gender.
 * It validates the form inputs, submits the data to the server using a GraphQL
 * mutation, and handles success or error responses appropriately.
 *
 * @param show - Determines whether the modal is visible.
 * @param handleClose - Function to close the modal.
 * @param reloadMembers - Function to reload the list of members.
 *
 * @returns The rendered AddOnSpotAttendee component.
 *
 * @remarks
 * - Uses `react-bootstrap` for modal and form styling
 * - Utilizes `NotificationToast` for displaying success and error messages
 * - Integrates `react-i18next` for translations
 * - Includes form validation to ensure required fields are filled
 * - Dependencies: `@apollo/client` for GraphQL mutation, `react-bootstrap` for UI components,
 *   `NotificationToast` for notifications, `react-i18next` for translations
 *
 * @example
 * ```tsx
 * <AddOnSpotAttendee
 *   show={true}
 *   handleClose={() => setShow(false)}
 *   reloadMembers={fetchMembers}
 * />
 * ```
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

    const isValid = validateForm();
    if (!isValid) {
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
        centered={true}
        headerClassName={styles.modalHeader}
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
    </ErrorBoundaryWrapper>
  );
};

export default AddOnSpotAttendee;
