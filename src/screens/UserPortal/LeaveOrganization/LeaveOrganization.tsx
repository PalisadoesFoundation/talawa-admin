import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  ORGANIZATIONS_LIST,
  USER_ORGANIZATION_CONNECTION,
} from 'GraphQl/Queries/Queries';
import { REMOVE_MEMBER_MUTATION } from 'GraphQl/Mutations/mutations';
import { Button, Modal, Form, Spinner, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { getItem } from 'utils/useLocalstorage';
import { toast } from 'react-toastify';

const userEmail = (() => {
  try {
    return getItem('Talawa-admin', 'email') ?? '';
  } catch (e) {
    console.error('Failed to access localStorage:', e);
    return '';
  }
})();
const userId = (() => {
  try {
    return getItem('Talawa-admin', 'userId') ?? '';
  } catch (e) {
    console.error('Failed to access localStorage:', e);
    return '';
  }
})();

export { userEmail, userId };

const LeaveOrganization = (): JSX.Element => {
  const navigate = useNavigate();
  const { orgId: organizationId } = useParams();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [verificationStep, setVerificationStep] = useState(false);

  /**
   * Query to fetch the organization data.
   */
  const {
    data: orgData,
    loading: orgLoading,
    error: orgError,
  } = useQuery(ORGANIZATIONS_LIST, {
    variables: { id: organizationId },
  });

  /**
   * Mutation to remove the member from the organization.
   */
  const [removeMember] = useMutation(REMOVE_MEMBER_MUTATION, {
    refetchQueries: [
      {
        query: USER_ORGANIZATION_CONNECTION,
        variables: { id: organizationId },
      },
    ],
    onCompleted: () => {
      // Use a toast notification or in-app message
      setShowModal(false);
      toast.success('You have successfully left the organization!');
      navigate(`/user/organizations`);
    },
    onError: (err) => {
      const isNetworkError = err.networkError !== null;
      setError(
        isNetworkError
          ? 'Unable to process your request. Please check your connection.'
          : 'Failed to leave organization. Please try again.',
      );
      setLoading(false);
    },
  });

  /**
   * Handles the process of leaving the organization.
   */
  const handleLeaveOrganization = (): void => {
    if (!organizationId || !userId) {
      setError('Unable to process request: Missing required information.');
      setLoading(false);
      return;
    }
    setError('');
    setLoading(true);
    removeMember({
      variables: { orgid: organizationId, userid: userId },
    });
  };

  /**
   * Verifies the user's email before proceeding.
   */
  const handleVerifyAndLeave = (): void => {
    if (email.trim().toLowerCase() === userEmail.toLowerCase()) {
      handleLeaveOrganization();
    } else {
      setError('Verification failed: Email does not match.');
    }
  };

  /**
   * Handles the 'Enter' key press.
   */
  const handleKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ): void => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (verificationStep) {
        handleVerifyAndLeave();
      } else {
        setVerificationStep(true);
      }
    }
  };

  if (orgLoading) {
    return (
      <div className="text-center mt-4" role="status">
        <Spinner animation="border" />
        <p>Loading organization details...</p>
      </div>
    );
  }
  if (orgError)
    return <Alert variant="danger">Error: {orgError.message}</Alert>;

  if (!orgData?.organizations?.length) {
    return <p>Organization not found</p>;
  }

  const organization = orgData?.organizations[0];

  return (
    <div>
      <br />
      <h1>{organization?.name}</h1>
      <p>{organization?.description}</p>

      <Button variant="danger" onClick={() => setShowModal(true)}>
        Leave Organization
      </Button>

      <Modal
        show={showModal}
        data-testid="leave-organization-modal"
        aria-labelledby="leave-organization-modal"
        onHide={() => {
          setShowModal(false);
          setVerificationStep(false);
          setEmail('');
          setError('');
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title id="leave-organization-modal">
            Leave Joined Organization
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!verificationStep ? (
            <>
              <p>Are you sure you want to leave this organization?</p>
              <p>
                This action cannot be undone, and you may need to request access
                again if you reconsider.
              </p>
            </>
          ) : (
            <Form>
              <Form.Group>
                <Form.Label htmlFor="confirm-email">
                  Enter your email to confirm:
                </Form.Label>
                <Form.Control
                  id="confirm-email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  required
                  aria-describedby={error ? 'email-error' : undefined}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleKeyPress}
                  aria-label="confirm-email-input"
                />
              </Form.Group>
              {error && (
                <Alert variant="danger" id="email-error" role="alert">
                  {error}
                </Alert>
              )}
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          {!verificationStep ? (
            <>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => setVerificationStep(true)}
              >
                Continue
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="secondary"
                onClick={() => {
                  setVerificationStep(false);
                  setEmail('');
                  setError('');
                }}
              >
                Back
              </Button>
              <Button
                variant="danger"
                disabled={loading}
                onClick={handleVerifyAndLeave}
                aria-label="confirm-leave-button"
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" role="status" />
                    {' Loading...'}
                  </>
                ) : (
                  'Confirm'
                )}
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LeaveOrganization;
