/**
 * @file LeaveOrganization.tsx
 * @description This component allows a user to leave an organization they are a member of.
 * It includes email verification for confirmation and handles the removal process via GraphQL mutations.
 *
 * @module LeaveOrganization
 */

/**
 * @constant userEmail
 * @description Retrieves the user's email from localStorage. Returns an empty string if unavailable or an error occurs.
 */

/**
 * @constant userId
 * @description Retrieves the user's ID from localStorage. Returns an empty string if unavailable or an error occurs.
 */

/**
 * @function LeaveOrganization
 * @description React functional component that renders the UI for leaving an organization.
 * It includes a modal for confirmation, email verification, and handles the GraphQL mutation to remove the user.
 *
 * @returns {JSX.Element} The rendered LeaveOrganization component.
 *
 * @remarks
 * - Uses Apollo Client's `useQuery` to fetch organization details.
 * - Uses Apollo Client's `useMutation` to remove the user from the organization.
 * - Displays a modal for user confirmation and email verification.
 * - Handles errors and loading states gracefully.
 *
 * @dependencies
 * - `useQuery` and `useMutation` from Apollo Client for GraphQL operations.
 * - `useParams` and `useNavigate` from React Router for route handling.
 * - `react-toastify` for toast notifications.
 * - `react-bootstrap` for UI components like Modal, Button, Spinner, and Alert.
 *
 * @example
 * ```tsx
 * <LeaveOrganization />
 * ```
 */
import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  ORGANIZATIONS_LIST_BASIC,
  ORGANIZATION_LIST,
} from 'GraphQl/Queries/Queries';
import { REMOVE_MEMBER_MUTATION } from 'GraphQl/Mutations/mutations';
import { Button, Modal, Form, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router';
import { getItem } from 'utils/useLocalstorage';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import LoadingState from 'shared-components/LoadingState/LoadingState';
import { useTranslation } from 'react-i18next';

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
  const { t: tCommon } = useTranslation('common');
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
  } = useQuery(ORGANIZATIONS_LIST_BASIC, { variables: { id: organizationId } });

  /**
   * Mutation to remove the member from the organization.
   */
  const [removeMember] = useMutation(REMOVE_MEMBER_MUTATION, {
    refetchQueries: [
      { query: ORGANIZATION_LIST, variables: { id: organizationId } },
    ],
    onCompleted: () => {
      // Use a toast notification or in-app message
      setShowModal(false);
      NotificationToast.success('You have successfully left the organization!');
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
    removeMember({ variables: { orgid: organizationId, userid: userId } });
  };

  /**
   * Verifies the user's email before proceeding.
   */
  const handleVerifyAndLeave = (): void => {
    if (email.trim().toLowerCase() === (userEmail as string).toLowerCase()) {
      handleLeaveOrganization();
    } else {
      setError('Verification failed: Email does not match.');
    }
  };

  /**
   * Handles the 'Enter' key press on the email input to submit verification.
   * This handler is only attached to the email input which only renders
   * when verificationStep is true, so we can directly call handleVerifyAndLeave.
   */
  const handleKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ): void => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleVerifyAndLeave();
    }
  };

  if (orgLoading) {
    return (
      <div className="text-center mt-4" role="status">
        <LoadingState isLoading={orgLoading} variant="spinner">
          <div />
        </LoadingState>
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
                {tCommon('back')}
              </Button>
              <LoadingState isLoading={loading} variant="inline">
                <Button
                  variant="danger"
                  disabled={loading}
                  onClick={handleVerifyAndLeave}
                  aria-label="confirm-leave-button"
                >
                  {tCommon('confirm')}
                </Button>
              </LoadingState>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LeaveOrganization;
