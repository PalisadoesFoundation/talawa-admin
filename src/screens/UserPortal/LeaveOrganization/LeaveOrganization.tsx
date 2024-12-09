import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { ORGANIZATIONS_LIST } from 'GraphQl/Queries/Queries';
import { REMOVE_MEMBER_MUTATION } from 'GraphQl/Mutations/mutations';
import { Button, Modal, Form, Spinner, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import useLocalStorage from 'utils/useLocalstorage';

const LeaveOrganization: React.FC = () => {
  const navigate = useNavigate();
  const { orgId: organizationId } = useParams<{ orgId: string }>();

  const { getItem } = useLocalStorage();
  const userEmail = getItem('Talawa-admin_email') ?? '';
  const userId = getItem('Talawa-admin_userId') ?? '';

  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [verificationStep, setVerificationStep] = useState<boolean>(false);

  const trimmedUserId = JSON.parse(userId)?.trim();

  const {
    data: orgData,
    loading: orgLoading,
    error: orgError,
  } = useQuery(ORGANIZATIONS_LIST, {
    variables: { id: organizationId },
  });

  const [removeMember] = useMutation(REMOVE_MEMBER_MUTATION, {
    onCompleted: () => {
      alert('You have successfully left the organization!');
      setShowModal(false);
      navigate(`/user/organizations`);
      window.location.reload();
    },
    onError: (err) => {
      setError(err.message);
      setLoading(false);
    },
  });

  const handleLeaveOrganization = (): void => {
    setError('');
    setLoading(true);
    removeMember({
      variables: { orgid: organizationId, userid: trimmedUserId },
    });
  };

  const handleVerifyAndLeave = (): void => {
    const trimmedEmail = email.trim();
    const trimmedUserEmail = JSON.parse(userEmail)?.trim();

    if (trimmedEmail === trimmedUserEmail) {
      handleLeaveOrganization();
    } else {
      setError('Verification failed: Email does not match.');
    }
  };

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
              onSubmit={(e: React.FormEvent<HTMLFormElement>): void => {
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
