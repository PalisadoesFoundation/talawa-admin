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
 * @see {@link useModalState} for modal visibility management.
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
import { useModalState } from 'shared-components/CRUDModalTemplate/hooks/useModalState';

import {
  DELETE_STANDALONE_EVENT_MUTATION,
  DELETE_SINGLE_EVENT_INSTANCE_MUTATION,
  DELETE_THIS_AND_FOLLOWING_EVENTS_MUTATION,
  DELETE_ENTIRE_RECURRING_EVENT_SERIES_MUTATION,
  REGISTER_EVENT,
} from 'GraphQl/Mutations/EventMutations';
import { useMutation } from '@apollo/client';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import {
  useUpdateEventHandler,
  hasRecurrenceChanged,
  getAvailableUpdateOptions,
} from './updateLogic';
import { errorHandler } from 'utils/errorHandler';
import type { IEventFormSubmitPayload } from 'types/EventForm/interface';

import EventListCardDeleteModal from './Delete/EventListCardDeleteModal';
import EventListCardPreviewModal from './Preview/EventListCardPreviewModal';
import BaseModal from 'shared-components/BaseModal/BaseModal';
import Button from 'shared-components/Button';
import { FormCheckField } from 'shared-components/FormFieldGroup/FormCheckField';
import styles from './EventListCardModals.module.css';

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
  tCommon: (key: string, options?: Record<string, unknown>) => string;
}

function EventListCardModals({
  eventListCardProps,
  eventModalIsOpen,
  hideViewModal,
  t,
  tCommon,
}: IEventListCardModalProps): JSX.Element {
  const { refetchEvents } = eventListCardProps;

  const { getItem } = useLocalStorage();
  const userId = getItem('userId') || getItem('id') || '';

  const { orgId } = useParams();
  const navigate = useNavigate();

  const {
    isOpen: eventDeleteModalIsOpen,
    close: closeEventDeleteModal,
    toggle: toggleDeleteModal,
  } = useModalState();

  const {
    isOpen: eventUpdateModalIsOpen,
    open: openEventUpdateModal,
    close: closeEventUpdateModal,
    toggle: toggleUpdateModal,
  } = useModalState();

  const [updateOption, setUpdateOption] = useState<
    'single' | 'following' | 'entireSeries'
  >('single');

  // Pending payload from EventForm submit
  const [pendingPayload, setPendingPayload] =
    useState<IEventFormSubmitPayload | null>(null);

  const availableUpdateOptions = useMemo(() => {
    if (!pendingPayload)
      return { single: false, following: false, entireSeries: false };
    return getAvailableUpdateOptions(pendingPayload, eventListCardProps);
  }, [pendingPayload, eventListCardProps]);

  // Ensure updateOption is always valid
  useEffect(() => {
    if (pendingPayload && !availableUpdateOptions[updateOption]) {
      if (availableUpdateOptions.following) {
        setUpdateOption('following');
      }
    }
  }, [availableUpdateOptions, updateOption, pendingPayload]);

  const { updateEventHandler } = useUpdateEventHandler();

  // Handle Submit from EventForm
  const handleFormSubmit = async (
    payload: IEventFormSubmitPayload,
  ): Promise<void> => {
    const isRecurringInstance =
      !eventListCardProps.isRecurringEventTemplate &&
      !!eventListCardProps.baseEvent?.id;

    if (isRecurringInstance) {
      setPendingPayload(payload);
      openEventUpdateModal();
    } else {
      // Standalone submit - convert payload to old interface format
      const formState = {
        name: payload.name,
        eventdescrip: payload.description,
        location: payload.location,
        startTime: dayjs.utc(payload.startAtISO).format('HH:mm:ss'),
        endTime: dayjs.utc(payload.endAtISO).format('HH:mm:ss'),
      };

      await updateEventHandler({
        eventListCardProps,
        formState,
        alldaychecked: payload.allDay,
        publicchecked: payload.isPublic,
        registrablechecked: payload.isRegisterable,
        inviteOnlyChecked: payload.isInviteOnly,
        eventStartDate: payload.startDate,
        eventEndDate: payload.endDate,
        recurrence: payload.recurrenceRule,
        updateOption: 'single', // Irrelevant for standalone
        t,
        hideViewModal,
        setEventUpdateModalIsOpen: (isOpen) =>
          isOpen ? openEventUpdateModal() : closeEventUpdateModal(),
        refetchEvents,
      });
    }
  };

  // Confirm update for recurring usage
  const confirmRecurringUpdate = async () => {
    if (!pendingPayload) return;

    // Convert payload to old interface format
    const formState = {
      name: pendingPayload.name,
      eventdescrip: pendingPayload.description,
      location: pendingPayload.location,
      startTime: dayjs.utc(pendingPayload.startAtISO).format('HH:mm:ss'),
      endTime: dayjs.utc(pendingPayload.endAtISO).format('HH:mm:ss'),
    };

    await updateEventHandler({
      eventListCardProps,
      formState,
      alldaychecked: pendingPayload.allDay,
      publicchecked: pendingPayload.isPublic,
      registrablechecked: pendingPayload.isRegisterable,
      inviteOnlyChecked: pendingPayload.isInviteOnly,
      eventStartDate: pendingPayload.startDate,
      eventEndDate: pendingPayload.endDate,
      recurrence: pendingPayload.recurrenceRule,
      updateOption,
      hasRecurrenceChanged: hasRecurrenceChanged(
        pendingPayload,
        eventListCardProps,
      ),
      t,
      hideViewModal,
      setEventUpdateModalIsOpen: (isOpen) =>
        isOpen ? openEventUpdateModal() : closeEventUpdateModal(),
      refetchEvents,
    });
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
        closeEventDeleteModal();
        hideViewModal();
        if (refetchEvents) {
          refetchEvents();
        }
      }
    } catch (error: unknown) {
      errorHandler(t, error);
    }
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
        registerEventHandler={registerEventHandler}
        onFormSubmit={handleFormSubmit}
        openEventDashboard={openEventDashboard}
      />

      {/* delete modal */}
      <EventListCardDeleteModal
        eventListCardProps={eventListCardProps}
        eventDeleteModalIsOpen={eventDeleteModalIsOpen}
        toggleDeleteModal={toggleDeleteModal}
        t={t}
        tCommon={tCommon}
        deleteEventHandler={deleteEventHandler}
      />

      {/* update modal */}
      <BaseModal
        size="lg"
        // i18n-ignore-next-line
        dataTestId={`updateEventModal${eventListCardProps.id}`}
        show={eventUpdateModalIsOpen}
        onHide={toggleUpdateModal}
        backdrop="static"
        keyboard={false}
        centered
        title={t('updateEvent')}
        headerClassName={`${styles.modalHeader} text-white`}
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
              onClick={confirmRecurringUpdate}
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
            {/* Only show "update this instance" option if recurrence rule hasn't changed */}
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
              />
            )}
            {/* Show "update entire series" option only when only name/description changed */}
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
              />
            )}
          </div>
        </div>
      </BaseModal>
    </>
  );
}

export default EventListCardModals;
