/**
 * PreviewModal Component
 *
 * This component renders a modal for previewing and editing event details.
 * It uses the shared EventForm component to display event data.
 */
// translation-check-keyPrefix: eventListCard
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'shared-components/Button';
import BaseModal from 'shared-components/BaseModal/BaseModal';
import styles from './EventListCardPreviewModal.module.css';
import EventForm from 'shared-components/EventForm/EventForm';
import { UserRole } from 'types/Event/interface';
import type { InterfacePreviewEventModalProps } from 'types/Event/interface';
import type { IEventFormValues } from 'types/EventForm/interface';

const PreviewModal: React.FC<InterfacePreviewEventModalProps> = ({
  eventListCardProps,
  eventModalIsOpen,
  hideViewModal,
  toggleDeleteModal,
  t,
  tCommon,
  isRegistered,
  userId,
  registerEventHandler,
  onFormSubmit,
  openEventDashboard,
}) => {
  // EventForm expects organizationEvents keys from translation.json
  const { t: tOrg } = useTranslation('translation', {
    keyPrefix: 'organizationEvents',
  });

  // Check if the user has permission to edit the event
  const canEditEvent =
    eventListCardProps.creator?.id === userId ||
    eventListCardProps.userRole === UserRole.ADMINISTRATOR;

  const initialValues: IEventFormValues = useMemo(() => {
    return {
      name: eventListCardProps.name,
      description: eventListCardProps.description,
      location: eventListCardProps.location,
      startDate: new Date(eventListCardProps.startAt),
      endDate: new Date(eventListCardProps.endAt),
      startTime: eventListCardProps.startTime || '00:00:00',
      endTime: eventListCardProps.endTime || '00:00:00',
      allDay: eventListCardProps.allDay,
      isPublic: eventListCardProps.isPublic,
      isInviteOnly: eventListCardProps.isInviteOnly,
      isRegisterable: eventListCardProps.isRegisterable,
      recurrenceRule: eventListCardProps.recurrenceRule || null,
      createChat: false, // Default or derived if available
    };
  }, [eventListCardProps]);

  const FooterActions = (
    <>
      {canEditEvent && (
        <Button
          variant="success"
          onClick={openEventDashboard}
          data-testid="showEventDashboardBtn"
          className={styles.addButton}
          aria-label={t('showEventDashboard')}
        >
          {t('showEventDashboard')}
        </Button>
      )}

      {/* Edit button acts as form submit when user has permission */}
      {canEditEvent && (
        <Button
          type="submit"
          className={styles.addButton}
          data-testid="previewUpdateEventBtn"
          data-cy="previewUpdateEventBtn"
          aria-label={t('editEvent')}
        >
          {t('editEvent')}
        </Button>
      )}

      {canEditEvent && (
        <Button
          variant="danger"
          data-testid="deleteEventModalBtn"
          data-cy="deleteEventModalBtn"
          className={styles.removeButton}
          onClick={toggleDeleteModal}
          aria-label={t('deleteEvent')}
        >
          {t('deleteEvent')}
        </Button>
      )}
      {eventListCardProps.isRegisterable &&
        eventListCardProps.userRole === UserRole.REGULAR &&
        !(eventListCardProps.creator?.id === userId) &&
        (isRegistered ? (
          <Button className={styles.addButton} variant="success" disabled>
            {t('alreadyRegistered')}
          </Button>
        ) : (
          <Button
            className={styles.addButton}
            variant="success"
            onClick={registerEventHandler}
            data-testid="registerEventBtn"
          >
            {tCommon('register')}
          </Button>
        ))}
    </>
  );

  return (
    <BaseModal
      show={eventModalIsOpen}
      onHide={hideViewModal}
      title={t('eventDetails')}
      dataTestId="previewEventModal"
      centered={true}
      // We do not pass 'footer' to BaseModal directly because EventForm handles buttons now
      footer={null}
    >
      {/* 
        hideSubmitButton disables the built-in submit button, but footerActions 
        supplies a custom submit via the Edit button with type="submit" 
      */}
      <EventForm
        initialValues={initialValues}
        onSubmit={onFormSubmit}
        submitLabel={t('editEvent')}
        t={tOrg}
        tCommon={tCommon}
        readOnly={!canEditEvent}
        footerActions={FooterActions}
        showRecurrenceToggle={true}
        showCreateChat={true}
        showCancelButton={false}
        hideSubmitButton={true}
      />
    </BaseModal>
  );
};

export default PreviewModal;
