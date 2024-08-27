import { SIGNUP_MUTATION } from 'GraphQl/Mutations/mutations';
import React, { useState } from 'react';
import { Modal, Form, Button, Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import type {
  InterfaceAddOnSpotAttendeeProps,
  InterfaceFormData,
} from 'utils/interfaces';

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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ): void => {
    const target = e.target as
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLTextAreaElement;
    setFormData({ ...formData, [target.name]: target.value });
  };

  const { orgId } = useParams<{ orgId: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addSignUp] = useMutation(SIGNUP_MUTATION);
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    if (!orgId) {
      toast.error('Organization ID is missing. Please try again.');
      return;
    }
    setIsSubmitting(true);
    try {
      await addSignUp({
        variables: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNo: formData.phoneNo,
          gender: formData.gender,
          password: '123456',
          orgId: orgId,
        },
      });
      toast.success('Attendee added successfully!');
      reloadMembers();
      handleClose();
    } catch (error) {
      console.error('Error signing up:', error);
      toast.error('Failed to add attendee. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" centered>
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title>On-spot Attendee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <div className="d-flex justify-content-between">
              <Form.Group className="mb-1">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                />
              </Form.Group>
              <Form.Group className="mb-1">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                />
              </Form.Group>
            </div>
            <div className="d-flex justify-content-between">
              <Form.Group className="mb-3">
                <Form.Label>Phone no.</Form.Label>
                <Form.Control
                  type="tel"
                  name="phoneNo"
                  value={formData.phoneNo}
                  onChange={handleChange}
                  placeholder="1234567890"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="abc@gmail.com"
                />
              </Form.Group>
            </div>
            <Form.Group className="mb-3">
              <Form.Label>Gender</Form.Label>
              <Form.Control
                as="select"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
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
                  Adding...
                </>
              ) : (
                'Add'
              )}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default AddOnSpotAttendee;
