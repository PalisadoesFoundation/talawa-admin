/**
 * Screen to verify and accept an event invitation.
 * Verifies a token, shows invite details, and allows the user to accept the invitation.
 */
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useMutation } from '@apollo/client';
import {
  VERIFY_EVENT_INVITATION,
  ACCEPT_EVENT_INVITATION,
} from 'GraphQl/Mutations/mutations';
import { Button } from 'shared-components/Button';
import LoadingState from 'shared-components/LoadingState/LoadingState';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { useTranslation } from 'react-i18next';
import useLocalStorage from '../../../utils/useLocalstorage';

const STORAGE_KEY = 'pendingInvitationToken';
const AUTH_TOKEN_KEY = 'token';
const EMAIL_KEY = 'email';

const AcceptInvitation = (): JSX.Element => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation('translation', {
    keyPrefix: 'public.invitation',
  });

  const { getItem, setItem, removeItem } = useLocalStorage();

  const [verify] = useMutation(VERIFY_EVENT_INVITATION);
  const [accept] = useMutation(ACCEPT_EVENT_INVITATION);

  const [loading, setLoading] = useState(true);
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
      const tok = token || (getItem(STORAGE_KEY) as string | null);
      if (!tok) {
        setError(
          t('invalidToken', { defaultValue: 'Invalid invitation token' }),
        );
        setLoading(false);
        return;
      }

      try {
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
          setError(
            t('invitationNotFound', {
              defaultValue: 'Invitation not found or invalid',
            }),
          );
        }
      } catch (err) {
        const e = err as Error | { message?: string };
        setError(
          e?.message ||
            t('verifyError', { defaultValue: 'Error verifying invitation' }),
        );
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [token, verify]);

  const [isAuthenticated] = useState(() => Boolean(getItem(AUTH_TOKEN_KEY)));
  const requiresConfirmation = Boolean(invite?.inviteeEmailMasked);
  const [confirmIsInvitee, setConfirmIsInvitee] = useState(false);

  const handleLogin = () => {
    if (token) setItem(STORAGE_KEY, token);
    navigate('/');
  };

  const handleSignup = () => {
    if (token) setItem(STORAGE_KEY, token);
    navigate('/register');
  };

  const handleAccept = async () => {
    if (!invite) {
      return;
    }
    setIsSubmitting(true);
    try {
      const input = { invitationToken: invite.invitationToken };
      const { data } = await accept({ variables: { input } });
      if (data && data.acceptEventInvitation) {
        NotificationToast.success(
          t('accepted', { defaultValue: 'Invitation accepted' }),
        );
        removeItem(STORAGE_KEY);
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
      NotificationToast.error(
        e?.message ||
          t('acceptError', { defaultValue: 'Could not accept invitation' }),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LoadingState
      isLoading={loading}
      variant="spinner"
      size="xl"
      data-testid="invitation-loading"
    >
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
                          removeItem(AUTH_TOKEN_KEY);
                          removeItem(EMAIL_KEY);
                          if (invite?.invitationToken) {
                            setItem(STORAGE_KEY, invite.invitationToken);
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
                    <LoadingState
                      isLoading={isSubmitting}
                      variant="inline"
                      size="sm"
                      data-testid="submit-loading"
                    >
                      <Button
                        onClick={handleAccept}
                        disabled={requiresConfirmation && !confirmIsInvitee}
                        data-testid="accept-invite-btn"
                      >
                        {t('accept', { defaultValue: 'Accept Invitation' })}
                      </Button>
                    </LoadingState>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </LoadingState>
  );
};

export default AcceptInvitation;
