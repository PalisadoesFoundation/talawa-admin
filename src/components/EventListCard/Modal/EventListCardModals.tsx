/**
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
import { TEST_ID_UPDATE_EVENT_MODAL } from 'Constant/common';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { UserRole } from 'types/Event/interface';
import useLocalStorage from 'utils/useLocalstorage';
import { useNavigate, useParams } from 'react-router';
import type { InterfaceRecurrenceRule } from 'utils/recurrenceUtils/recurrenceTypes';
import type { InterfaceEventListCardModalsProps } from 'types/EventListCard/interface';
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

import EventListCardDeleteModal from './Delete/EventListCardDeleteModal';
import EventListCardPreviewModal from './Preview/EventListCardPreviewModal';
import BaseModal from 'shared-components/BaseModal/BaseModal';
import Button from 'shared-components/Button';
import { FormCheckField } from 'shared-components/FormFieldGroup/FormCheckField';
import styles from './EventListCardModals.module.css';

// Extend dayjs with utc plugin
dayjs.extend(utc);

function EventListCardModals({
  eventListCardProps,
  eventModalIsOpen,
  hideViewModal,
  t,
  tCommon,
}: InterfaceEventListCardModalsProps): JSX.Element {
  const { refetchEvents } = eventListCardProps;

  const { getItem } = useLocalStorage();
  const userId = getItem('userId') || getItem('id') || '';

  const { orgId } = useParams();
  const navigate = useNavigate();

  const [allDayChecked, setAllDayChecked] = useState(eventListCardProps.allDay);
  const [publicChecked, setPublicChecked] = useState(
    eventListCardProps.isPublic,
  );
  const [registerableChecked, setRegisterableChecked] = useState(
    eventListCardProps.isRegisterable,
  );
  const [inviteOnlyChecked, setInviteOnlyChecked] = useState(
    Boolean(eventListCardProps.isInviteOnly),
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
      formState.eventDescription !== eventListCardProps.description;
    const locationChanged = formState.location !== eventListCardProps.location;
    const publicChanged = publicChecked !== eventListCardProps.isPublic;
    const registrableChanged =
      registerableChecked !== eventListCardProps.isRegisterable;
    const inviteOnlyChanged =
      inviteOnlyChecked !== Boolean(eventListCardProps.isInviteOnly);
    const allDayChanged = allDayChecked !== eventListCardProps.allDay;
    const recurrenceChanged = hasRecurrenceChanged();

    // Return true if only name/description changed, and no other fields changed
    return (
      (nameChanged || descriptionChanged) &&
      !locationChanged &&
      !publicChanged &&
      !registrableChanged &&
      !inviteOnlyChanged &&
      !allDayChanged &&
      !recurrenceChanged
    );
  };

  const [customRecurrenceModalIsOpen, setCustomRecurrenceModalIsOpen] =
    useState(false);

  const [formState, setFormState] = useState({
    name: eventListCardProps.name,
    eventDescription: eventListCardProps.description,
    location: eventListCardProps.location,
    startTime: eventListCardProps.startTime?.split('.')[0] || '08:00:00',
    endTime: eventListCardProps.endTime?.split('.')[0] || '08:00:00',
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
    publicChecked,
    registerableChecked,
    inviteOnlyChecked,
    allDayChecked,
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
        allDayChecked,
        publicChecked,
        registerableChecked,
        inviteOnlyChecked,
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
    const isUserPortal = eventListCardProps.userRole === UserRole.REGULAR;
    const basePath = isUserPortal ? '/user' : '/admin';
    navigate(`${basePath}/event/${orgId}/${eventListCardProps.id}`);
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
        allDayChecked={allDayChecked}
        setAllDayChecked={setAllDayChecked}
        publicChecked={publicChecked}
        setPublicChecked={setPublicChecked}
        registerableChecked={registerableChecked}
        setRegisterableChecked={setRegisterableChecked}
        inviteOnlyChecked={inviteOnlyChecked}
        setInviteOnlyChecked={setInviteOnlyChecked}
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

      <EventListCardDeleteModal
        eventListCardProps={eventListCardProps}
        eventDeleteModalIsOpen={eventDeleteModalIsOpen}
        toggleDeleteModal={toggleDeleteModal}
        t={t}
        tCommon={tCommon}
        deleteEventHandler={deleteEventHandler}
      />

      <BaseModal
        size="lg"
        dataTestId={TEST_ID_UPDATE_EVENT_MODAL(eventListCardProps.id)}
        show={eventUpdateModalIsOpen}
        onHide={toggleUpdateModal}
        backdrop="static"
        keyboard={false}
        centered
        title={t('updateEvent')}
        headerClassName={`${styles.modalHeader}`}
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
              onClick={() =>
                updateEventHandler({
                  eventListCardProps,
                  formState,
                  allDayChecked,
                  publicChecked,
                  registerableChecked,
                  inviteOnlyChecked,
                  eventStartDate,
                  eventEndDate,
                  recurrence,
                  updateOption,
                  hasRecurrenceChanged: hasRecurrenceChanged(),
                  t,
                  hideViewModal,
                  setEventUpdateModalIsOpen,
                  refetchEvents,
                })
              }
              data-testid="confirmUpdateEventBtn"
            >
              {t('updateEvent')}
            </Button>
          </>
        }
      >
        <div>
          <p>{t('updateRecurringEventMsg')}</p>
          <div>
            {availableUpdateOptions.single && (
              <FormCheckField
                type="radio"
                id="update-single"
                name="updateOption"
                value="single"
                checked={updateOption === 'single'}
                onChange={() => setUpdateOption('single')}
                label={t('updateThisInstance')}
                className="mb-2"
                data-testid="update-single-radio"
              />
            )}
            {availableUpdateOptions.following && (
              <FormCheckField
                type="radio"
                id="update-following"
                name="updateOption"
                value="following"
                checked={updateOption === 'following'}
                onChange={() => setUpdateOption('following')}
                label={t('updateThisAndFollowing')}
                className="mb-2"
                data-testid="update-following-radio"
              />
            )}
            {availableUpdateOptions.entireSeries && (
              <FormCheckField
                type="radio"
                id="update-entire-series"
                name="updateOption"
                value="entireSeries"
                checked={updateOption === 'entireSeries'}
                onChange={() => setUpdateOption('entireSeries')}
                label={t('updateEntireSeries')}
                className="mb-2"
                data-testid="update-entire-series-radio"
              />
            )}
          </div>
        </div>
      </BaseModal>
    </>
  );
}

export default EventListCardModals;
