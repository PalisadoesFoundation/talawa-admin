import { SIGNUP_MUTATION } from 'GraphQl/Mutations/mutations';
import React, { useState } from 'react';
import { Modal, Form, Button, Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import type {
  InterfaceAddOnSpotAttendeeProps,
  InterfaceFormData,
} from 'utils/interfaces';
import { useTranslation } from 'react-i18next';
import { errorHandler } from 'utils/errorHandler';
/**
 * Modal component for adding on-spot attendees to an event
 * @param show - Boolean to control modal visibility
 * @param handleClose - Function to handle modal close
 * @param reloadMembers - Function to refresh member list after adding attendee
 * @returns Modal component with form for adding new attendee
 */
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
      toast.error(t('invalidDetailsMessage'));
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
          ...formData,
          password: '123456',
          orgId,
        },
      });

      if (response.data?.signUp) {
        toast.success(t('attendeeAddedSuccess'));
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
      <Modal show={show} onHide={handleClose} backdrop="static" centered>
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title>{t('title')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
                  placeholder="John"
                />
              </Form.Group>
              <Form.Group className="mb-1">
                <Form.Label htmlFor="lastName">
                  {tCommon('lastName')}
                </Form.Label>
                <Form.Control
                  id="lastName"
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
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
                placeholder="abc@gmail.com"
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
            <Button
              variant="success"
              type="submit"
              className="w-100"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  {t('addingAttendee')}
                </>
              ) : (
                'Add'
              )}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AddOnSpotAttendee;
