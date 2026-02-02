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
import Button from 'shared-components/Button';
import {
  FormFieldGroup,
  FormTextField,
} from 'shared-components/FormFieldGroup/FormFieldGroup';
import { CRUDModalTemplate } from 'shared-components/CRUDModalTemplate';
import { useMutation } from '@apollo/client';
import { SEND_EVENT_INVITATIONS } from 'GraphQl/Mutations/mutations';
import { useTranslation } from 'react-i18next';
import type { ApolloError } from '@apollo/client/errors';
import LoadingState from 'shared-components/LoadingState/LoadingState';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import styles from './InviteByEmailModal.module.css';
import type { InterfaceInviteByEmailModalProps } from 'types/AdminPortal/EventRegistrantsModal/InviteByEmail/interface';

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
        t('invitesSentSuccessfully', {
          defaultValue: 'Invites sent successfully',
        }),
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
    <CRUDModalTemplate
      open={show}
      onClose={handleClose}
      title={t('title', { defaultValue: 'Invite by Email' })}
      loading={isSubmitting}
      customFooter={
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
      <form
        onSubmit={onSubmit}
        data-testid="invite-by-email-form"
        id="invite-by-email-form"
      >
        <FormFieldGroup name="recipients" label={t('emailsLabel')}>
          {recipients.map((r) => (
            <div key={r.id} className="d-flex align-items-center mb-2">
              <FormTextField
                name={`recipient-email-${r.id}`}
                label={t('email')}
                value={r.email || ''}
                onChange={(v: string) =>
                  setRecipients((prev) =>
                    prev.map((item) =>
                      item.id === r.id ? { ...item, email: v } : item,
                    ),
                  )
                }
                className={styles.emailField}
              />

              <FormTextField
                name={`recipient-name-${r.id}`}
                label={t('name')}
                value={r.name || ''}
                onChange={(v: string) =>
                  setRecipients((prev) =>
                    prev.map((item) =>
                      item.id === r.id ? { ...item, name: v } : item,
                    ),
                  )
                }
                className={styles.nameField}
              />

              {recipients.length > 1 && (
                <Button
                  variant="link"
                  onClick={() =>
                    setRecipients((prev) =>
                      prev.filter((item) => item.id !== r.id),
                    )
                  }
                  className={styles.removeButton}
                >
                  {t('remove')}
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
              {t('addRecipient')}
            </Button>
          </div>

          <small className="text-muted">{t('emailsHelp')}</small>
        </FormFieldGroup>

        <FormFieldGroup name="message" label={t('messageLabel')}>
          <FormTextField
            name="message"
            label={t('messageLabel', { defaultValue: 'Message (optional)' })}
            value={message || ''}
            onChange={(v: string) => setMessage(v)}
            multiline
            minRows={2}
            placeholder={t('messagePlaceholder')}
            data-testid="invite-message"
          />
        </FormFieldGroup>

        <FormTextField
          name="expiresInDays"
          label={t('expiresInDaysLabel')}
          type="number"
          value={expiresInDays.toString()}
          onChange={(v) => {
            const value = parseInt(v, 10);
            setExpiresInDays(isNaN(value) || value < 1 ? 7 : value);
          }}
          data-testid="invite-expires"
        />
      </form>
    </CRUDModalTemplate>
  );
};

export default InviteByEmailModal;
