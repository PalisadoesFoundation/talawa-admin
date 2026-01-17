/**
 * Component: EventListCardModals
 *
 * This component manages the modals for event list cards, including preview and delete modals.
 * It handles event updates, deletions, and user registration for events.
 *
 * @param eventListCardProps - The properties of the event card, including event details and refetch function.
 * @param eventModalIsOpen - Boolean indicating whether the event modal is open.
 * @param hideViewModal - Function to hide the view modal.
 * @param t - Translation function for localized strings.
 * @param tCommon - Translation function for common localized strings.
 *
 * @returns JSX.Element - The rendered modals for event list card actions.
 *
 * @remarks
 * - Manages state for event properties such as all-day, public, and registrable flags.
 * - Provides functionality to register for events and navigate to the event dashboard.
 * - Uses Apollo Client mutations for updating and deleting events.
 *
 */
// translation-check-keyPrefix: eventListCard
import React, { useEffect, useMemo, useState } from 'react';
import type { JSX } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import type { InterfaceEvent } from 'types/Event/interface';
import { UserRole } from 'types/Event/interface';
import useLocalStorage from 'utils/useLocalstorage';
import { useNavigate, useParams } from 'react-router';
import type { InterfaceRecurrenceRule } from 'utils/recurrenceUtils/recurrenceTypes';
import {
  DELETE_STANDALONE_EVENT_MUTATION,
  DELETE_SINGLE_EVENT_INSTANCE_MUTATION,
  DELETE_THIS_AND_FOLLOWING_EVENTS_MUTATION,
  DELETE_ENTIRE_RECURRING_EVENT_SERIES_MUTATION,
  REGISTER_EVENT,
} from 'GraphQl/Mutations/EventMutations';
import { useMutation } from '@apollo/client';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { useUpdateEventHandler } from './updateLogic';
import { errorHandler } from 'utils/errorHandler';

import EventListCardDeleteModal from 'shared-components/EventListCard/Modal/Delete/EventListCardDeleteModal';
import EventListCardPreviewModal from './Preview/EventListCardPreviewModal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import styles from './EventListCardModals.module.css';
import BaseModal from 'shared-components/BaseModal/BaseModal';

// Extend dayjs with utc plugin
dayjs.extend(utc);

interface IEventListCard extends InterfaceEvent {
  refetchEvents?: () => void;
}

interface IEventListCardModalProps {
  eventListCardProps: IEventListCard;
  eventModalIsOpen: boolean;
  hideViewModal: () => void;
  t: (key: string, options?: Record<string, unknown>) => string;
  tCommon: (key: string) => string;
}
const DEFAULT_TIME = '08:00:00';
function EventListCardModals({
  eventListCardProps,
  eventModalIsOpen,
  hideViewModal,
  t,
  tCommon,
}: IEventListCardModalProps): JSX.Element {
  const { refetchEvents } = eventListCardProps;

  const { getItem } = useLocalStorage();
  const userId = getItem('userId');

  const { orgId } = useParams();
  const navigate = useNavigate();

  const [alldaychecked, setAllDayChecked] = useState(eventListCardProps.allDay);
  const [publicchecked, setPublicChecked] = useState(
    eventListCardProps.isPublic,
  );
  const [registrablechecked, setRegistrableChecked] = useState(
    eventListCardProps.isRegisterable,
  );
  const [eventDeleteModalIsOpen, setEventDeleteModalIsOpen] = useState(false);
  const [eventUpdateModalIsOpen, setEventUpdateModalIsOpen] = useState(false);
  const [updateOption, setUpdateOption] = useState<
    'single' | 'following' | 'entireSeries'
  >('single');
  const [eventStartDate, setEventStartDate] = useState(
    new Date(eventListCardProps.startAt),
  );
  const [eventEndDate, setEventEndDate] = useState(
    new Date(eventListCardProps.endAt),
  );
  // Initialize recurrence with default pattern for recurring events
  const [recurrence, setRecurrence] = useState<InterfaceRecurrenceRule | null>(
    eventListCardProps.recurrenceRule
      ? {
          ...eventListCardProps.recurrenceRule,
          endDate: eventListCardProps.recurrenceRule.recurrenceEndDate
            ? new Date(eventListCardProps.recurrenceRule.recurrenceEndDate)
            : undefined,
          never: !eventListCardProps.recurrenceRule.recurrenceEndDate,
        }
      : null,
  );

  // Store the original recurrence rule to detect changes
  const [originalRecurrence] = useState<InterfaceRecurrenceRule | null>(
    eventListCardProps.recurrenceRule
      ? {
          ...eventListCardProps.recurrenceRule,
          endDate: eventListCardProps.recurrenceRule.recurrenceEndDate
            ? new Date(eventListCardProps.recurrenceRule.recurrenceEndDate)
            : undefined,
          never: !eventListCardProps.recurrenceRule.recurrenceEndDate,
        }
      : null,
  );

  useEffect(() => {
    setRecurrence(
      eventListCardProps.recurrenceRule
        ? {
            ...eventListCardProps.recurrenceRule,
            endDate: eventListCardProps.recurrenceRule.recurrenceEndDate
              ? new Date(eventListCardProps.recurrenceRule.recurrenceEndDate)
              : undefined,
            never: !eventListCardProps.recurrenceRule.recurrenceEndDate,
          }
        : null,
    );
  }, [eventListCardProps.recurrenceRule]);

  // Helper function to check if recurrence rule has changed
  const hasRecurrenceChanged = (): boolean => {
    if (!originalRecurrence && !recurrence) return false;
    if (!originalRecurrence || !recurrence) return true;

    // Deep compare the two objects for any changes
    const changed =
      originalRecurrence.frequency !== recurrence.frequency ||
      originalRecurrence.interval !== recurrence.interval ||
      JSON.stringify(originalRecurrence.byDay) !==
        JSON.stringify(recurrence.byDay) ||
      JSON.stringify(originalRecurrence.byMonth) !==
        JSON.stringify(recurrence.byMonth) ||
      JSON.stringify(originalRecurrence.byMonthDay) !==
        JSON.stringify(recurrence.byMonthDay) ||
      originalRecurrence.count !== recurrence.count ||
      originalRecurrence.endDate?.toISOString() !==
        recurrence.endDate?.toISOString() ||
      originalRecurrence.never !== recurrence.never;

    return changed;
  };

  // Helper function to check if only name/description changed (eligible for entireSeries update)
  const hasOnlyNameOrDescriptionChanged = (): boolean => {
    const nameChanged = formState.name !== eventListCardProps.name;
    const descriptionChanged =
      formState.eventdescrip !== eventListCardProps.description;
    const locationChanged = formState.location !== eventListCardProps.location;
    const publicChanged = publicchecked !== eventListCardProps.isPublic;
    const registrableChanged =
      registrablechecked !== eventListCardProps.isRegisterable;
    const allDayChanged = alldaychecked !== eventListCardProps.allDay;
    const recurrenceChanged = hasRecurrenceChanged();

    // Return true if only name/description changed, and no other fields changed
    return (
      (nameChanged || descriptionChanged) &&
      !locationChanged &&
      !publicChanged &&
      !registrableChanged &&
      !allDayChanged &&
      !recurrenceChanged
    );
  };

  const [customRecurrenceModalIsOpen, setCustomRecurrenceModalIsOpen] =
    useState(false);

  const [formState, setFormState] = useState({
    name: eventListCardProps.name,
    eventdescrip: eventListCardProps.description,
    location: eventListCardProps.location,
    startTime: eventListCardProps.startTime?.split('.')[0] || DEFAULT_TIME,
    endTime: eventListCardProps.endTime?.split('.')[0] || DEFAULT_TIME,
  });

  // Automatically switch to "following" option when recurrence rule changes
  useEffect(() => {
    if (hasRecurrenceChanged() && updateOption === 'single') {
      setUpdateOption('following');
    }
  }, [recurrence, updateOption]);

  // Compute available options reactively
  const availableUpdateOptions = useMemo(() => {
    const recurrenceChanged = hasRecurrenceChanged();
    const onlyNameOrDescChanged = hasOnlyNameOrDescriptionChanged();

    return {
      single: !recurrenceChanged,
      following: true,
      entireSeries: onlyNameOrDescChanged,
    };
  }, [
    recurrence,
    formState,
    publicchecked,
    registrablechecked,
    alldaychecked,
    eventStartDate,
    eventEndDate,
  ]);

  // Ensure updateOption is always valid
  useEffect(() => {
    if (
      !availableUpdateOptions[
        updateOption as keyof typeof availableUpdateOptions
      ]
    ) {
      if (availableUpdateOptions.following) {
        setUpdateOption('following');
      } else if (availableUpdateOptions.single) {
        setUpdateOption('single');
      } else if (availableUpdateOptions.entireSeries) {
        setUpdateOption('entireSeries');
      }
    }
  }, [availableUpdateOptions, updateOption]);

  const { updateEventHandler } = useUpdateEventHandler();

  // This function is called when the update button is clicked
  const handleEventUpdate = async (): Promise<void> => {
    const isRecurringInstance =
      !eventListCardProps.isRecurringEventTemplate &&
      !!eventListCardProps.baseEvent?.id;

    if (isRecurringInstance) {
      setEventUpdateModalIsOpen(true);
    } else {
      await updateEventHandler({
        eventListCardProps,
        formState,
        alldaychecked,
        publicchecked,
        registrablechecked,
        eventStartDate,
        eventEndDate,
        recurrence,
        updateOption,
        hasRecurrenceChanged: hasRecurrenceChanged(), // Pass the recurrence change status
        t,
        hideViewModal,
        setEventUpdateModalIsOpen,
        refetchEvents,
      });
    }
  };

  const [deleteStandaloneEvent] = useMutation(DELETE_STANDALONE_EVENT_MUTATION);
  const [deleteSingleInstance] = useMutation(
    DELETE_SINGLE_EVENT_INSTANCE_MUTATION,
  );
  const [deleteThisAndFollowing] = useMutation(
    DELETE_THIS_AND_FOLLOWING_EVENTS_MUTATION,
  );
  const [deleteEntireSeries] = useMutation(
    DELETE_ENTIRE_RECURRING_EVENT_SERIES_MUTATION,
  );

  const deleteEventHandler = async (
    deleteOption?: 'single' | 'following' | 'all',
  ): Promise<void> => {
    try {
      let data;

      // Check if this is a recurring instance
      const isRecurringInstance =
        !eventListCardProps.isRecurringEventTemplate &&
        !!eventListCardProps.baseEvent?.id;

      if (!isRecurringInstance) {
        // Standalone event
        const result = await deleteStandaloneEvent({
          variables: {
            input: {
              id: eventListCardProps.id,
            },
          },
        });
        data = result.data;
      } else {
        // Recurring instance - handle based on selected option
        switch (deleteOption) {
          case 'single': {
            const singleResult = await deleteSingleInstance({
              variables: {
                input: {
                  id: eventListCardProps.id,
                },
              },
            });
            data = singleResult.data;
            break;
          }
          case 'following': {
            const followingResult = await deleteThisAndFollowing({
              variables: {
                input: {
                  id: eventListCardProps.id,
                },
              },
            });
            data = followingResult.data;
            break;
          }
          case 'all': {
            const allResult = await deleteEntireSeries({
              variables: {
                input: {
                  id: eventListCardProps.baseEvent?.id,
                },
              },
            });
            data = allResult.data;
            break;
          }
        }
      }

      if (data) {
        NotificationToast.success(t('eventDeleted') as string);
        setEventDeleteModalIsOpen(false);
        hideViewModal();
        if (refetchEvents) {
          refetchEvents();
        }
      }
    } catch (error: unknown) {
      errorHandler(t, error);
    }
  };

  const toggleDeleteModal = (): void => {
    setEventDeleteModalIsOpen(!eventDeleteModalIsOpen);
  };

  const toggleUpdateModal = (): void => {
    setEventUpdateModalIsOpen(!eventUpdateModalIsOpen);
  };

  const isInitiallyRegistered = eventListCardProps?.attendees?.some(
    (attendee) => attendee.id === userId,
  );
  const [isRegistered, setIsRegistered] = useState(isInitiallyRegistered);

  const [registerEventMutation] = useMutation(REGISTER_EVENT);
  const registerEventHandler = async (): Promise<void> => {
    if (!isRegistered) {
      try {
        const { data } = await registerEventMutation({
          variables: {
            id: eventListCardProps.id,
          },
        });

        if (data) {
          NotificationToast.success(
            t('registeredSuccessfully', { eventName: eventListCardProps.name }),
          );
          setIsRegistered(true);
          hideViewModal();
        }
      } catch (error: unknown) {
        errorHandler(t, error);
      }
    }
  };

  const openEventDashboard = (): void => {
    const userPath =
      eventListCardProps.userRole === UserRole.REGULAR ? 'user/' : '';
    navigate(`/${userPath}event/${orgId}/${eventListCardProps.id}`);
  };

  const handleConfirmUpdate = async (): Promise<void> => {
    await updateEventHandler({
      eventListCardProps,
      formState,
      alldaychecked,
      publicchecked,
      registrablechecked,
      eventStartDate,
      eventEndDate,
      recurrence,
      updateOption,
      hasRecurrenceChanged: hasRecurrenceChanged(),
      t,
      hideViewModal,
      setEventUpdateModalIsOpen,
      refetchEvents,
    });
  };

  return (
    <>
      <EventListCardPreviewModal
        eventListCardProps={eventListCardProps}
        eventModalIsOpen={eventModalIsOpen}
        hideViewModal={hideViewModal}
        toggleDeleteModal={toggleDeleteModal}
        t={t}
        tCommon={tCommon}
        isRegistered={isRegistered}
        userId={userId as string}
        eventStartDate={eventStartDate}
        eventEndDate={eventEndDate}
        setEventStartDate={setEventStartDate}
        setEventEndDate={setEventEndDate}
        alldaychecked={alldaychecked}
        setAllDayChecked={setAllDayChecked}
        publicchecked={publicchecked}
        setPublicChecked={setPublicChecked}
        registrablechecked={registrablechecked}
        setRegistrableChecked={setRegistrableChecked}
        formState={formState}
        setFormState={setFormState}
        registerEventHandler={registerEventHandler}
        handleEventUpdate={handleEventUpdate}
        openEventDashboard={openEventDashboard}
        recurrence={recurrence}
        setRecurrence={setRecurrence}
        customRecurrenceModalIsOpen={customRecurrenceModalIsOpen}
        setCustomRecurrenceModalIsOpen={setCustomRecurrenceModalIsOpen}
      />

      {/* delete modal */}
      <EventListCardDeleteModal
        eventListCardProps={eventListCardProps}
        eventDeleteModalIsOpen={eventDeleteModalIsOpen}
        toggleDeleteModal={toggleDeleteModal}
        deleteEventHandler={deleteEventHandler}
      />

      {/* update modal */}
      <BaseModal
        size="lg"
        show={eventUpdateModalIsOpen}
        onHide={toggleUpdateModal}
        backdrop="static"
        keyboard={false}
        centered
        title={
          <span
            className="text-white"
            id={`updateEventModalLabel${eventListCardProps.id}`}
          >
            {t('updateEvent')}
          </span>
        }
        headerClassName={styles.modalHeader}
        showCloseButton={true}
        footer={
          <>
            <Button
              type="button"
              className={`btn btn-secondary ${styles.removeButton}`}
              data-dismiss="modal"
              onClick={toggleUpdateModal}
              data-testid="eventUpdateModalCloseBtn"
            >
              {tCommon('cancel')}
            </Button>
            <Button
              type="button"
              className={`btn ${styles.addButton}`}
              onClick={handleConfirmUpdate}
              data-testid="confirmUpdateEventBtn"
            >
              {t('updateEvent')}
            </Button>
          </>
        }
        dataTestId={'updateEventModal' + eventListCardProps.id}
      >
        <div>
          <p>{t('updateRecurringEventMsg')}</p>
          <Form>
            {/* Only show "update this instance" option if recurrence rule hasn't changed */}
            {availableUpdateOptions.single && (
              <Form.Check
                type="radio"
                id={`update-single-${eventListCardProps.id}`}
                name={`updateOption-${eventListCardProps.id}`}
                value="single"
                checked={updateOption === 'single'}
                onChange={() => setUpdateOption('single')}
                label={t('updateThisInstance')}
                className="mb-2"
              />
            )}
            {availableUpdateOptions.following && (
              <Form.Check
                type="radio"
                id={`update-following-${eventListCardProps.id}`}
                name={`updateOption-${eventListCardProps.id}`}
                value="following"
                checked={updateOption === 'following'}
                onChange={() => setUpdateOption('following')}
                label={t('updateThisAndFollowing')}
                className="mb-2"
              />
            )}
            {/* Show "update entire series" option only when only name/description changed */}
            {availableUpdateOptions.entireSeries && (
              <Form.Check
                type="radio"
                id={`update-entire-series-${eventListCardProps.id}`}
                name={`updateOption-${eventListCardProps.id}`}
                value="entireSeries"
                checked={updateOption === 'entireSeries'}
                onChange={() => setUpdateOption('entireSeries')}
                label={t('updateEntireSeries')}
                className="mb-2"
              />
            )}
          </Form>
        </div>
      </BaseModal>
    </>
  );
}

export default EventListCardModals;
