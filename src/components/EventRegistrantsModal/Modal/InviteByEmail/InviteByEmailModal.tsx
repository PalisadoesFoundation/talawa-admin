/**
 * Modal component to invite users to an event by email.
 * Allows entering multiple recipient emails/names and an optional message, then sends invites.
 *
 * @param show - Controls the visibility of the modal.
 * @param handleClose - Callback function to close the modal.
 * @param eventId - The ID of the event for which invites are being sent.
 * @param isRecurring - Whether the event is a recurring event instance.
 * @param onInvitesSent - Optional callback invoked after invites are successfully sent.
 *
 * @returns The rendered InviteByEmailModal component.
 *
 * @remarks
 * Uses Apollo Client's `useMutation` for the SEND_EVENT_INVITATIONS GraphQL mutation.
 * Integrates with `react-toastify` for user notifications.
 */
import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { BaseModal } from 'shared-components/BaseModal';
import TextField from '@mui/material/TextField';
import { useMutation } from '@apollo/client';
import { SEND_EVENT_INVITATIONS } from 'GraphQl/Mutations/mutations';
import { useTranslation } from 'react-i18next';
import type { ApolloError } from '@apollo/client/errors';
import LoadingState from 'shared-components/LoadingState/LoadingState';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import styles from './InviteByEmail.module.css';
import type { InterfaceInviteByEmailModalProps } from 'types/components/EventRegistrantsModal/InviteByEmail/interface';

const validateEmails = (emails: string[]): string[] => {
  const invalid: string[] = [];
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  emails.forEach((e) => {
    if (!re.test(e.trim())) invalid.push(e);
  });
  return invalid;
};

const InviteByEmailModal: React.FC<InterfaceInviteByEmailModalProps> = ({
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
    { id: string; email: string; name?: string }[]
  >([{ id: crypto.randomUUID(), email: '', name: '' }]);
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
      NotificationToast.error(
        t('noRecipientsError', {
          defaultValue: 'Please provide at least one recipient email',
        }),
      );
      return;
    }

    const invalid = validateEmails(cleaned.map((r) => r.email));
    if (invalid.length) {
      NotificationToast.error(
        t('invalidEmailsError', {
          emails: invalid.join(', '),
          defaultValue: 'Invalid email(s): {{emails}}',
        }),
      );
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

      NotificationToast.success(
        tCommon('addedSuccessfully', { item: 'Invites' }) || 'Invites sent',
      );
      setRecipients([{ id: crypto.randomUUID(), email: '', name: '' }]);
      setMessage('');
      setExpiresInDays(7);
      if (onInvitesSent) onInvitesSent();
      handleClose();
    } catch (err) {
      const error = err as ApolloError;
      NotificationToast.error(
        t('errorSendingInvites') || 'Error sending invites',
      );
      if (error?.message) NotificationToast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal
      show={show}
      onHide={handleClose}
      backdrop="static"
      centered
      headerClassName={styles.modalHeader}
      title={t('title', { defaultValue: 'Invite by Email' })}
      showCloseButton
      footer={
        <>
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            {tCommon('close', { defaultValue: 'Close' })}
          </Button>
          <LoadingState isLoading={isSubmitting} variant="inline">
            <Button
              type="submit"
              form="invite-by-email-form"
              className={`border-1 mx-4 ${styles.addButton}`}
              variant="success"
              disabled={isSubmitting}
              data-testid="invite-submit"
            >
              {t('sendInvites')}
            </Button>
          </LoadingState>
        </>
      }
    >
      <Form
        onSubmit={onSubmit}
        data-testid="invite-by-email-form"
        id="invite-by-email-form"
      >
        <Form.Group className="mb-3">
          <Form.Label>
            {t('emailsLabel', { defaultValue: 'Recipient emails and names' })}
          </Form.Label>

          {recipients.map((r) => (
            <div key={r.id} className="d-flex align-items-center mb-2">
              <TextField
                label={t('email', { defaultValue: 'Email' })}
                variant="outlined"
                size="small"
                value={r.email}
                onChange={(e) => {
                  setRecipients((prev) =>
                    prev.map((item) =>
                      item.id === r.id
                        ? { ...item, email: e.target.value }
                        : item,
                    ),
                  );
                }}
                className={styles.emailField}
              />

              <TextField
                label={t('name', { defaultValue: 'Name' })}
                variant="outlined"
                size="small"
                value={r.name}
                onChange={(e) => {
                  setRecipients((prev) =>
                    prev.map((item) =>
                      item.id === r.id
                        ? { ...item, name: e.target.value }
                        : item,
                    ),
                  );
                }}
                className={styles.nameField}
              />

              {recipients.length > 1 && (
                <Button
                  variant="link"
                  onClick={() => {
                    const copy = recipients.filter((item) => item.id !== r.id);
                    setRecipients(copy);
                  }}
                  className={styles.removeButton}
                >
                  {t('remove', { defaultValue: 'Remove' })}
                </Button>
              )}
            </div>
          ))}

          <div className="mb-2">
            <Button
              variant="outline-primary"
              onClick={() =>
                setRecipients([
                  ...recipients,
                  { id: crypto.randomUUID(), email: '', name: '' },
                ])
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
            inputProps={{ 'data-testid': 'invite-message' }}
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
    </BaseModal>
  );
};

export default InviteByEmailModal;
