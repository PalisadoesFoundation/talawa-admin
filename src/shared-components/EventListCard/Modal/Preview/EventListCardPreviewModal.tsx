/**
 * PreviewModal Component
 *
 * This component renders a modal for previewing and editing event details.
 * It uses the shared `EventForm` component to ensure consistent UI between
 * the Create and Edit/Preview modals.
 *
 * - Admin / event creator: sees all fields enabled + Show Dashboard, Edit, Delete footer buttons.
 * - Regular user (view-only): sees all fields disabled + Register button in footer.
 *
 * @param eventListCardProps - Event card data (name, dates, attendees, etc.)
 * @param eventModalIsOpen - Whether the modal is open.
 * @param hideViewModal - Function to close the modal.
 * @param toggleDeleteModal - Function to open the delete confirmation modal.
 * @param isRegistered - Whether the current user is registered for the event.
 * @param userId - Current user's ID.
 * @param handleEventUpdate - Callback to trigger the update mutation.
 * @param registerEventHandler - Callback to register for the event.
 * @param openEventDashboard - Callback to navigate to the event dashboard.
 *
 * @returns A modal for previewing and managing event details.
 */
// translation-check-keyPrefix: eventListCard
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'shared-components/Button';
import BaseModal from 'shared-components/BaseModal/BaseModal';
import EventForm from 'shared-components/EventForm/EventForm';
import styles from './EventListCardPreviewModal.module.css';

import type { InterfacePreviewEventModalProps } from 'types/Event/interface';
import { UserRole } from 'types/Event/interface';
import type { IEventFormValues } from 'types/EventForm/interface';

const PreviewModal: React.FC<InterfacePreviewEventModalProps> = ({
  eventListCardProps,
  eventModalIsOpen,
  hideViewModal,
  toggleDeleteModal,
  isRegistered,
  userId,
  eventStartDate,
  eventEndDate,
  allDayChecked,
  formState,
  registerEventHandler,
  handleEventUpdate,
  openEventDashboard,
  recurrence,
  setRecurrence,
  setFormState,
  setAllDayChecked,
  setEventStartDate,
  setEventEndDate,
  setPublicChecked,
  setRegisterableChecked,
  setInviteOnlyChecked,
  customRecurrenceModalIsOpen,
  setCustomRecurrenceModalIsOpen,
  hideCustomRecurrenceModal,
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'eventListCard' });
  const { t: tCommon } = useTranslation('common');

  // Check if the user has permission to edit the event
  const canEditEvent =
    eventListCardProps.creator?.id === userId ||
    eventListCardProps.userRole === UserRole.ADMINISTRATOR;

  // Build initialValues for EventForm from event card props
  const initialValues = useMemo<IEventFormValues>(() => {
    let name = formState.name || '';
    let description = formState.eventDescription || '';

    // Truncate for preview mode (readOnly) to satisfy existing tests
    if (!canEditEvent) {
      if (name.length > 100) {
        name = name.substring(0, 100) + '...';
      }
      if (description.length > 256) {
        description = description.substring(0, 256) + '...';
      }
    }

    return {
      name,
      description,
      location: formState.location || '',
      startDate: eventStartDate,
      endDate: eventEndDate,
      startTime: formState.startTime || '08:00:00',
      endTime: formState.endTime || '10:00:00',
      allDay: allDayChecked,
      isPublic: eventListCardProps.isPublic,
      isInviteOnly: Boolean(eventListCardProps.isInviteOnly),
      isRegisterable: eventListCardProps.isRegisterable,
      recurrenceRule: recurrence,
      createChat: eventListCardProps.createChat ?? false,
    };
  }, [
    canEditEvent,
    formState.name,
    formState.eventDescription,
    formState.location,
    formState.startTime,
    formState.endTime,
    eventStartDate,
    eventEndDate,
    allDayChecked,
    eventListCardProps.isPublic,
    eventListCardProps.isInviteOnly,
    eventListCardProps.isRegisterable,
    eventListCardProps.createChat,
    recurrence,
  ]);

  const handleStateChange = useCallback(
    (newValues: IEventFormValues): void => {
      if (setFormState)
        setFormState({
          name: newValues.name,
          eventDescription: newValues.description,
          location: newValues.location,
          startTime: newValues.startTime,
          endTime: newValues.endTime,
        });
      if (setAllDayChecked) setAllDayChecked(newValues.allDay);
      if (setEventStartDate) setEventStartDate(newValues.startDate);
      if (setEventEndDate) setEventEndDate(newValues.endDate);
      if (setPublicChecked) setPublicChecked(newValues.isPublic);
      if (setRegisterableChecked)
        setRegisterableChecked(newValues.isRegisterable);
      if (setInviteOnlyChecked) setInviteOnlyChecked(newValues.isInviteOnly);
      if (setRecurrence) setRecurrence(newValues.recurrenceRule || null);
    },
    [
      setFormState,
      setAllDayChecked,
      setEventStartDate,
      setEventEndDate,
      setPublicChecked,
      setRegisterableChecked,
      setInviteOnlyChecked,
      setRecurrence,
    ],
  );

  return (
    <BaseModal
      show={eventModalIsOpen}
      onHide={hideViewModal}
      title={t('eventDetails')}
      dataTestId="previewEventModal"
      footer={
        <>
          {canEditEvent && (
            <div className={styles.footerActions}>
              <Button
                variant="success"
                onClick={openEventDashboard}
                data-testid="showEventDashboardBtn"
                className={styles.addButton}
                aria-label={t('showEventDashboard')}
              >
                {t('showEventDashboard')}
              </Button>
              <Button
                variant="success"
                className={styles.addButton}
                data-testid="previewUpdateEventBtn"
                data-cy="previewUpdateEventBtn"
                onClick={handleEventUpdate}
                aria-label={tCommon('edit')}
              >
                {tCommon('edit')}
              </Button>
              <Button
                variant="danger"
                data-testid="deleteEventModalBtn"
                data-cy="deleteEventModalBtn"
                className={styles.removeButton}
                onClick={toggleDeleteModal}
                aria-label={tCommon('delete')}
              >
                {tCommon('delete')}
              </Button>
            </div>
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
      }
      centered={true}
    >
      <EventForm
        initialValues={initialValues}
        onSubmit={() => Promise.resolve()}
        onCancel={hideViewModal}
        submitLabel={tCommon('edit')}
        readOnly={!canEditEvent}
        hideSubmitButton
        showRegisterable
        showPublicToggle
        disableRecurrence={!recurrence}
        showRecurrenceToggle={false}
        onStateChange={handleStateChange}
        customRecurrenceModalIsOpen={customRecurrenceModalIsOpen}
        setCustomRecurrenceModalIsOpen={setCustomRecurrenceModalIsOpen}
        hideCustomRecurrenceModal={hideCustomRecurrenceModal}
      />
    </BaseModal>
  );
};

export default PreviewModal;
