/**
 * Component for adding an attendee on the spot via a modal form.
 *
 * This component provides a modal interface to add attendees to an event
 * by collecting their details such as name, email, phone number, and gender.
 * It validates the form inputs, submits the data to the server using a GraphQL
 * mutation, and handles success or error responses appropriately.
 *
 * @param props - The props for the component:
 * - show - Determines whether the modal is visible.
 * - handleClose - Function to close the modal.
 * - reloadMembers - Function to reload the list of members.
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
import { Button } from 'react-bootstrap';
import { BaseModal } from 'shared-components/BaseModal';
import styles from 'style/app-fixed.module.css';
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
import modalStyles from '../../EventRegistrants.module.css';
import { ErrorBoundaryWrapper } from 'shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper';
import { FormFieldGroup } from 'shared-components/FormFieldGroup/FormFieldGroup';

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
  const { t: tErrors } = useTranslation('errors');
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
        headerClassName={modalStyles.modalHeader}
        title={t('title')}
      >
        <form onSubmit={handleSubmit} data-testid="onspot-attendee-form">
          <div className="d-flex justify-content-between">
            <FormFieldGroup name="firstName" label={tCommon('firstName')}>
              <input
                className="form-control"
                id="firstName"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder={t('firstNamePlaceholder')}
              />
            </FormFieldGroup>
            <FormFieldGroup name="lastName" label={tCommon('lastName')}>
              <input
                className="form-control"
                id="lastName"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder={t('lastNamePlaceholder')}
              />
            </FormFieldGroup>
          </div>
          <FormFieldGroup name="phoneNo" label={t('phoneNumber')}>
            <input
              className="form-control"
              id="phoneNo"
              type="tel"
              name="phoneNo"
              value={formData.phoneNo}
              onChange={handleChange}
              placeholder="1234567890"
            />
          </FormFieldGroup>

          <FormFieldGroup name="email" label={tCommon('email')}>
            <input
              className="form-control"
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t('emailPlaceholder')}
            />
          </FormFieldGroup>

          <FormFieldGroup name="gender" label={tCommon('gender')}>
            <select
              className="form-control"
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">{t('selectGender')}</option>
              <option value="Male">{t('male')}</option>
              <option value="Female">{t('female')}</option>
              <option value="Other">{t('other')}</option>
            </select>
          </FormFieldGroup>
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
