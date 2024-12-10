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

/**
 * Component to allow the user to leave an organization.
 * The user needs to confirm by entering their email.
 * After confirmation, the member is removed from the organization.
 *
 * @returns The LeaveOrganization component.
 */
const LeaveOrganization = (): JSX.Element => {
  const navigate = useNavigate();
  const { orgId: organizationId } = useParams();

  const userEmail = getItem('Talawa-admin', 'email');
  const userId = getItem('Talawa-admin', 'userId');

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [verificationStep, setVerificationStep] = useState(false);

  /**
   * Query to fetch the organization data.
   *
   * @returns The organization data or loading/error states.
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
      alert('You have successfully left the organization!');
      setShowModal(false);
      navigate(`/user/organizations`);
    },
    onError: (err) => {
      setError(err.message);
      setLoading(false);
    },
  });

  /**
   * Handles the process of leaving the organization.
   * It triggers the mutation to remove the member.
   */
  const handleLeaveOrganization = (): void => {
    setError('');
    setLoading(true);
    removeMember({
      variables: { orgid: organizationId, userid: userId },
    });
  };

  /**
   * Verifies the user's email and triggers the leave process if the email matches.
   * If the email doesn't match, an error message is set.
   *
   * @returns
   */
  const handleVerifyAndLeave = (): void => {
    if (email.trim().toLowerCase() === userEmail.toLowerCase()) {
      handleLeaveOrganization();
    } else {
      setError('Verification failed: Email does not match.');
    }
  };

  /**
   * Handles the 'Enter' key press event for the email input.
   * It either moves to the verification step or triggers the leave process.
   *
   * @param event - The keyboard event.
   * @returns
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

  if (orgLoading) return <Spinner animation="border" />;
  if (orgError) return <p>Error: {orgError.message}</p>;

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
        onHide={() => {
          setShowModal(false);
          setVerificationStep(false);
          setEmail('');
          setError('');
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Leave Organization</Modal.Title>
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
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                handleVerifyAndLeave();
              }}
            >
              <Form.Group>
                <Form.Label>Enter your email to confirm:</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleKeyPress}
                />
              </Form.Group>
              {error && <Alert variant="danger">{error}</Alert>}
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
                onClick={() => setVerificationStep(false)}
              >
                Back
              </Button>
              <Button
                variant="danger"
                disabled={loading}
                onClick={handleVerifyAndLeave}
              >
                {loading ? <Spinner animation="border" size="sm" /> : 'Confirm'}
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LeaveOrganization;
