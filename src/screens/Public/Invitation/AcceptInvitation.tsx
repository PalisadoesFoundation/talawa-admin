import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useMutation } from '@apollo/client';
import {
  VERIFY_EVENT_INVITATION,
  ACCEPT_EVENT_INVITATION,
} from 'GraphQl/Mutations/mutations';
import { Button, Spinner } from 'react-bootstrap';
import Loader from 'components/Loader/Loader';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

// NOTE: This component assumes the app has an authentication mechanism exposed
// via localStorage keys used elsewhere (e.g., 'token' and current user email can be
// read from a central place). We'll use minimal checks and prefer redirecting to
// login/signup handled by existing `LoginPage`.

const STORAGE_KEY = 'pendingInvitationToken';

const AcceptInvitation = (): JSX.Element => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation('translation', {
    keyPrefix: 'public.invitation',
  });

  const [verify] = useMutation(VERIFY_EVENT_INVITATION);
  const [accept] = useMutation(ACCEPT_EVENT_INVITATION);

  const [loading, setLoading] = useState(true);
  // New verify mutation returns masked invitee email and ids instead of full objects
  type InviteMetadata = {
    invitationToken: string;
    inviteeEmailMasked?: string | null;
    inviteeName?: string | null;
    status?: string | null;
    expiresAt?: string | null;
    eventId?: string | null;
    recurringEventInstanceId?: string | null;
    organizationId?: string | null;
  } | null;

  const [invite, setInvite] = useState<InviteMetadata>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);
      const tok = token || (localStorage.getItem(STORAGE_KEY) as string | null);
      if (!tok) {
        setError('Invalid invitation token');
        setLoading(false);
        return;
      }

      try {
        // mutation now expects `{ input: { invitationToken } }`
        const { data } = await verify({
          variables: {
            input: {
              invitationToken: tok,
            },
          },
        });
        if (data && data.verifyEventInvitation) {
          setInvite(data.verifyEventInvitation as InviteMetadata);
        } else {
          setError('Invitation not found or invalid');
        }
      } catch (err) {
        const e = err as Error | { message?: string };
        setError(e?.message || 'Error verifying invitation');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [token, verify]);

  const isAuthenticated = !!localStorage.getItem('token');
  // currentEmail is intentionally not used because server returns masked email only

  // Since the verify mutation now returns a masked email (for privacy), we cannot
  // reliably compare the full email on the client. Instead, if a masked email is
  // provided we require an explicit user confirmation (checkbox) before enabling
  // the Accept button. If no masked email is present, treat it as open to any
  // authenticated user.
  const requiresConfirmation = Boolean(invite?.inviteeEmailMasked);
  const [confirmIsInvitee, setConfirmIsInvitee] = useState(false);

  const handleLogin = () => {
    if (token) localStorage.setItem(STORAGE_KEY, token);
    navigate('/');
  };

  const handleSignup = () => {
    if (token) localStorage.setItem(STORAGE_KEY, token);
    navigate('/register');
  };

  const handleAccept = async () => {
    if (!invite) return;
    setIsSubmitting(true);
    try {
      const input = { token: invite.invitationToken };
      const { data } = await accept({ variables: { input } });
      if (data && data.acceptEventInvitation) {
        toast.success(t('accepted', { defaultValue: 'Invitation accepted' }));
        localStorage.removeItem(STORAGE_KEY);
        if (invite.eventId) {
          navigate(
            `/user/event/${invite.organizationId || ''}/${invite.eventId}`,
          );
        } else {
          navigate('/user/organizations');
        }
      }
    } catch (err) {
      const e = err as Error | { message?: string };
      toast.error(
        e?.message ||
          t('acceptError', { defaultValue: 'Could not accept invitation' }),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <Loader size="xl" />;

  return (
    <div className="container py-5">
      <div className="card p-4">
        <h3>
          {invite?.eventId
            ? `Event ${invite.eventId}`
            : t('title', { defaultValue: 'Event Invitation' })}
        </h3>
        {error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <>
            <p>
              {t('previewText', {
                defaultValue: 'You have been invited to join this event.',
              })}
            </p>
            <dl>
              <dt>{t('inviteeEmail', { defaultValue: 'Invitee Email' })}</dt>
              <dd>
                {invite?.inviteeEmailMasked ||
                  t('anyone', { defaultValue: 'Any logged in user' })}
              </dd>
              <dt>
                {t('organizationId', { defaultValue: 'Organization Id' })}
              </dt>
              <dd>{invite?.organizationId || '-'}</dd>
              <dt>{t('eventId', { defaultValue: 'Event Id' })}</dt>
              <dd>{invite?.eventId || '-'}</dd>
              <dt>{t('expiresAt', { defaultValue: 'Expires At' })}</dt>
              <dd>
                {invite?.expiresAt
                  ? new Date(invite.expiresAt).toLocaleString()
                  : '-'}
              </dd>
            </dl>

            {!isAuthenticated ? (
              <div>
                <p>
                  {t('mustLogin', {
                    defaultValue:
                      'Please login or create an account to accept this invitation.',
                  })}
                </p>
                <div className="d-flex gap-2">
                  <Button onClick={handleLogin}>
                    {t('login', { defaultValue: 'Log in' })}
                  </Button>
                  <Button variant="outline-primary" onClick={handleSignup}>
                    {t('signup', { defaultValue: 'Sign up' })}
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                {requiresConfirmation && (
                  <div className="alert alert-warning">
                    {t('maskedNotice', {
                      defaultValue:
                        'This invitation was issued to a masked email address. Please ensure you are the invited recipient before accepting.',
                    })}
                  </div>
                )}

                {requiresConfirmation && (
                  <div className="mb-3 form-check">
                    <input
                      id="confirmIsInvitee"
                      type="checkbox"
                      className="form-check-input"
                      checked={confirmIsInvitee}
                      onChange={(e) => setConfirmIsInvitee(e.target.checked)}
                    />
                    <label
                      htmlFor="confirmIsInvitee"
                      className="form-check-label"
                    >
                      {t('confirmMatch', {
                        defaultValue:
                          'I confirm the email address of my account matches the invited address (shown above).',
                      })}
                    </label>
                  </div>
                )}

                {requiresConfirmation && (
                  <div className="mb-3">
                    <Button
                      variant="outline-secondary"
                      onClick={() => {
                        // Help the user sign in as a different account: clear token/email and
                        // preserve the pending invitation token so they can resume after login.
                        localStorage.removeItem('token');
                        localStorage.removeItem('email');
                        if (invite?.invitationToken) {
                          localStorage.setItem(
                            STORAGE_KEY,
                            invite.invitationToken,
                          );
                        }
                        navigate('/');
                      }}
                    >
                      {t('signInAsDifferent', {
                        defaultValue: 'Sign in as a different user',
                      })}
                    </Button>
                  </div>
                )}

                <div className="d-flex gap-2">
                  <Button
                    onClick={handleAccept}
                    disabled={
                      isSubmitting ||
                      (requiresConfirmation && !confirmIsInvitee)
                    }
                    data-testid="accept-invite-btn"
                  >
                    {isSubmitting ? (
                      <>
                        <Spinner
                          animation="border"
                          size="sm"
                          className="me-2"
                        />{' '}
                        {t('accepting', { defaultValue: 'Accepting...' })}
                      </>
                    ) : (
                      t('accept', { defaultValue: 'Accept Invitation' })
                    )}
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AcceptInvitation;
