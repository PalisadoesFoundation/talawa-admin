/**
 * Component for adding an attendee on the spot via a modal form.
 *
 * This component provides a modal interface to add attendees to an event
 * by collecting their details such as name, email, phone number, and gender.
 * It validates the form inputs, submits the data to the server using a GraphQL
 * mutation, and handles success or error responses appropriately.
 *
 * @param props - The props for the component, including `show`, `handleClose`, and `reloadMembers`.
 *
 * @returns The rendered AddOnSpotAttendee component.
 */
import { SIGNUP_MUTATION } from 'GraphQl/Mutations/mutations';
import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import styles from 'style/app-fixed.module.css';
import { useParams } from 'react-router';
import { useMutation } from '@apollo/client';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { BaseModal } from 'shared-components/BaseModal';
import type {
  InterfaceAddOnSpotAttendeeProps,
  InterfaceFormData,
} from 'utils/interfaces';
import { useTranslation } from 'react-i18next';
import { errorHandler } from 'utils/errorHandler';
import LoadingState from 'shared-components/LoadingState/LoadingState';
import modalStyles from '../../EventRegistrants.module.css';

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
    <>
      <BaseModal
        show={show}
        onHide={handleClose}
        backdrop="static"
        centered
        headerClassName={modalStyles.modalHeader}
        title={t('title')}
        showCloseButton
      >
        <Form onSubmit={handleSubmit} data-testid="onspot-attendee-form">
          <div className="d-flex justify-content-between">
            <Form.Group className="mb-1">
              <Form.Label htmlFor="firstName">
                {tCommon('firstName')}
              </Form.Label>
              <Form.Control
                id="firstName"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder={t('placeholderFirstName')}
              />
            </Form.Group>
            <Form.Group className="mb-1">
              <Form.Label htmlFor="lastName">{tCommon('lastName')}</Form.Label>
              <Form.Control
                id="lastName"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder={t('placeholderLastName')}
              />
            </Form.Group>
          </div>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="phoneNo">{t('phoneNumber')}</Form.Label>
            <Form.Control
              id="phoneNo"
              type="tel"
              name="phoneNo"
              value={formData.phoneNo}
              onChange={handleChange}
              placeholder="1234567890"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="email">{tCommon('email')}</Form.Label>
            <Form.Control
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t('placeholderEmail')}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="gender">{tCommon('gender')}</Form.Label>
            <Form.Control
              id="gender"
              as="select"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">{t('selectGender')}</option>
              <option value="Male">{t('male')}</option>
              <option value="Female">{t('female')}</option>
              <option value="Other">{t('other')}</option>
            </Form.Control>
          </Form.Group>
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
        </Form>
      </BaseModal>
    </>
  );
};

export default AddOnSpotAttendee;
