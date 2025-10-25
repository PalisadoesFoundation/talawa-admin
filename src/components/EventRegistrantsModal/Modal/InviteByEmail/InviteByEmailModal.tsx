/**
 * Modal component to invite users to an event by email.
 * Allows entering multiple recipient emails/names and an optional message, then sends invites.
 */
import React, { useState } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import TextField from '@mui/material/TextField';
import { useMutation } from '@apollo/client';
import { SEND_EVENT_INVITATIONS } from 'GraphQl/Mutations/mutations';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import type { ApolloError } from '@apollo/client/errors';

type Props = {
  show: boolean;
  handleClose: () => void;
  eventId: string;
  isRecurring?: boolean;
  onInvitesSent?: () => void;
};

const validateEmails = (emails: string[]): string[] => {
  const invalid: string[] = [];
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  emails.forEach((e) => {
    if (!re.test(e.trim())) invalid.push(e);
  });
  return invalid;
};

const InviteByEmailModal: React.FC<Props> = ({
  show,
  handleClose,
  eventId,
  isRecurring = false,
  onInvitesSent,
}) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'eventRegistrantsModal.inviteByEmail',
  });
  const { t: tCommon } = useTranslation('common');

  const [recipients, setRecipients] = useState<
    { email: string; name?: string }[]
  >([{ email: '', name: '' }]);
  const [message, setMessage] = useState('');
  const [expiresInDays, setExpiresInDays] = useState<number>(7);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [sendInvites] = useMutation(SEND_EVENT_INVITATIONS);

  const onSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    const cleaned = recipients
      .map((r) => ({
        email: (r.email || '').trim(),
        name: (r.name || '').trim(),
      }))
      .filter((r) => r.email !== '');

    if (cleaned.length === 0) {
      toast.error('Please provide at least one recipient email');
      return;
    }

    const invalid = validateEmails(cleaned.map((r) => r.email));
    if (invalid.length) {
      toast.error(`Invalid email(s): ${invalid.join(', ')}`);
      return;
    }

    setIsSubmitting(true);

    const input: Record<string, unknown> = {
      eventId: eventId,
      recurringEventInstanceId: isRecurring ? eventId : null,
      message: message || null,
      expiresInDays: expiresInDays || 7,
      recipients: cleaned,
    };

    try {
      await sendInvites({ variables: { input } });

      toast.success(
        tCommon('addedSuccessfully', { item: 'Invites' }) || 'Invites sent',
      );
      setRecipients([{ email: '', name: '' }]);
      setMessage('');
      setExpiresInDays(7);
      if (onInvitesSent) onInvitesSent();
      handleClose();
    } catch (err) {
      const error = err as ApolloError;
      toast.error(t('errorSendingInvites') || 'Error sending invites');
      if (error?.message) toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" centered>
      <Modal.Header
        closeButton
        style={{ backgroundColor: 'var(--tableHeader-bg)' }}
      >
        <Modal.Title>
          {t('title', { defaultValue: 'Invite by Email' })}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmit} data-testid="invite-by-email-form">
          <Form.Group className="mb-3">
            <Form.Label>
              {t('emailsLabel', { defaultValue: 'Recipient emails and names' })}
            </Form.Label>

            {recipients.map((r, idx) => (
              <div key={idx} className="d-flex align-items-center mb-2">
                <TextField
                  label={t('email', { defaultValue: 'Email' })}
                  variant="outlined"
                  size="small"
                  value={r.email}
                  onChange={(e) => {
                    const copy = [...recipients];
                    copy[idx] = { ...copy[idx], email: e.target.value };
                    setRecipients(copy);
                  }}
                  style={{ flex: 1 }}
                />

                <TextField
                  label={t('name', { defaultValue: 'Name' })}
                  variant="outlined"
                  size="small"
                  value={r.name}
                  onChange={(e) => {
                    const copy = [...recipients];
                    copy[idx] = { ...copy[idx], name: e.target.value };
                    setRecipients(copy);
                  }}
                  style={{ width: 220, marginLeft: 12 }}
                />

                {recipients.length > 1 ? (
                  <Button
                    variant="link"
                    onClick={() => {
                      const copy = recipients.filter((_, i) => i !== idx);
                      setRecipients(copy);
                    }}
                    style={{ marginLeft: 8 }}
                  >
                    {t('remove', { defaultValue: 'Remove' })}
                  </Button>
                ) : null}
              </div>
            ))}

            <div className="mb-2">
              <Button
                variant="outline-primary"
                onClick={() =>
                  setRecipients([...recipients, { email: '', name: '' }])
                }
              >
                {t('addRecipient', { defaultValue: 'Add recipient' })}
              </Button>
            </div>

            <small className="text-muted">
              {t('emailsHelp', {
                defaultValue:
                  'Provide email and optional name for each recipient. Add multiple recipients as needed.',
              })}
            </small>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              {t('messageLabel', { defaultValue: 'Message (optional)' })}
            </Form.Label>
            <TextField
              fullWidth
              multiline
              minRows={2}
              placeholder={t('messagePlaceholder', {
                defaultValue: 'You are invited to attend this event.',
              })}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              data-testid="invite-message"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              {t('expiresInDaysLabel', { defaultValue: 'Expires in (days)' })}
            </Form.Label>
            <Form.Control
              type="number"
              min={1}
              value={expiresInDays}
              onChange={(e) => setExpiresInDays(Number(e.target.value))}
              data-testid="invite-expires"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={handleClose}
          disabled={isSubmitting}
        >
          {tCommon('close', { defaultValue: 'Close' })}
        </Button>
        <Button
          variant="primary"
          onClick={onSubmit}
          disabled={isSubmitting}
          data-testid="send-invites"
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
              {t('sending', { defaultValue: 'Sending...' })}
            </>
          ) : (
            t('sendInvites', { defaultValue: 'Send Invites' })
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default InviteByEmailModal;
