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
import React, { useState } from 'react';
import type { JSX } from 'react';
import dayjs from 'dayjs';
import type { InterfaceEvent } from 'types/Event/interface';
import { UserRole } from 'types/Event/interface';
import useLocalStorage from 'utils/useLocalstorage';
import { useNavigate, useParams } from 'react-router';
import type { InterfaceRecurrenceRule } from 'utils/recurrenceUtils/recurrenceTypes';
import { Frequency } from 'utils/recurrenceUtils/recurrenceTypes';
import { createDefaultRecurrenceRule } from 'utils/recurrenceUtils/recurrenceUtilityFunctions';
import {
  DELETE_STANDALONE_EVENT_MUTATION,
  DELETE_SINGLE_EVENT_INSTANCE_MUTATION,
  DELETE_THIS_AND_FOLLOWING_EVENTS_MUTATION,
  DELETE_ENTIRE_RECURRING_EVENT_SERIES_MUTATION,
  REGISTER_EVENT,
  UPDATE_EVENT_MUTATION,
  UPDATE_SINGLE_RECURRING_EVENT_INSTANCE_MUTATION,
  UPDATE_THIS_AND_FOLLOWING_EVENTS_MUTATION,
} from 'GraphQl/Mutations/EventMutations';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import { errorHandler } from 'utils/errorHandler';

import EventListCardDeleteModal from './Delete/EventListCardDeleteModal';
import EventListCardPreviewModal from './Preview/EventListCardPreviewModal';
import { Button, Modal, Form } from 'react-bootstrap';
import styles from 'style/app-fixed.module.css';

interface IEventListCard extends InterfaceEvent {
  refetchEvents?: () => void;
}

interface IEventListCardModalProps {
  eventListCardProps: IEventListCard;
  eventModalIsOpen: boolean;
  hideViewModal: () => void;
  t: (key: string) => string;
  tCommon: (key: string) => string;
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
  const [updateOption, setUpdateOption] = useState<'single' | 'following'>(
    'single',
  );
  const [eventStartDate, setEventStartDate] = useState(
    new Date(eventListCardProps.startDate),
  );
  const [eventEndDate, setEventEndDate] = useState(
    new Date(eventListCardProps.endDate),
  );
  // Initialize recurrence with default pattern for recurring events
  const [recurrence, setRecurrence] = useState<InterfaceRecurrenceRule | null>(
    () => {
      // For recurring events, initialize with a default weekly pattern based on the start date
      const isRecurringEvent =
        eventListCardProps.isRecurringTemplate ||
        (!eventListCardProps.isRecurringTemplate &&
          !!eventListCardProps.baseEventId);

      if (isRecurringEvent) {
        const startDate = new Date(eventListCardProps.startDate);
        // Use the exact same function that generates the dropdown options
        return createDefaultRecurrenceRule(startDate, Frequency.WEEKLY);
      }

      return null;
    },
  );
  const [customRecurrenceModalIsOpen, setCustomRecurrenceModalIsOpen] =
    useState(false);

  const [formState, setFormState] = useState({
    name: eventListCardProps.name,
    eventdescrip: eventListCardProps.description,
    location: eventListCardProps.location,
    startTime: eventListCardProps.startTime?.split('.')[0] || '08:00:00',
    endTime: eventListCardProps.endTime?.split('.')[0] || '08:00:00',
  });

  const [updateStandaloneEvent] = useMutation(UPDATE_EVENT_MUTATION);
  const [updateSingleRecurringEventInstance] = useMutation(
    UPDATE_SINGLE_RECURRING_EVENT_INSTANCE_MUTATION,
  );
  const [updateThisAndFollowingEvents] = useMutation(
    UPDATE_THIS_AND_FOLLOWING_EVENTS_MUTATION,
  );

  // This function handles the actual update logic with the selected option
  const updateEventHandler = async (
    updateOption?: 'single' | 'following',
  ): Promise<void> => {
    // Check if this is a recurring instance
    const isRecurringInstance =
      !eventListCardProps.isRecurringTemplate &&
      !!eventListCardProps.baseEventId;

    try {
      let data;

      // Build update input with only changed fields
      const updateInput: any = {
        id: eventListCardProps._id,
      };

      // Only add fields that have potentially changed
      if (formState.name !== eventListCardProps.name) {
        updateInput.name = formState.name;
      }

      if (formState.eventdescrip !== eventListCardProps.description) {
        updateInput.description = formState.eventdescrip;
      }

      if (formState.location !== eventListCardProps.location) {
        updateInput.location = formState.location;
      }

      if (publicchecked !== eventListCardProps.isPublic) {
        updateInput.isPublic = publicchecked;
      }

      if (registrablechecked !== eventListCardProps.isRegisterable) {
        updateInput.isRegisterable = registrablechecked;
      }

      if (alldaychecked !== eventListCardProps.allDay) {
        updateInput.allDay = alldaychecked;
      }

      // Always include dates/times as they may have been modified
      const newStartAt = alldaychecked
        ? dayjs(eventStartDate).startOf('day').toISOString()
        : dayjs(eventStartDate)
            .hour(parseInt(formState.startTime.split(':')[0]))
            .minute(parseInt(formState.startTime.split(':')[1]))
            .second(parseInt(formState.startTime.split(':')[2]))
            .toISOString();

      const newEndAt = alldaychecked
        ? dayjs(eventEndDate).endOf('day').toISOString()
        : dayjs(eventEndDate)
            .hour(parseInt(formState.endTime.split(':')[0]))
            .minute(parseInt(formState.endTime.split(':')[1]))
            .second(parseInt(formState.endTime.split(':')[2]))
            .toISOString();

      // Check if dates have changed
      const originalStartAt = eventListCardProps.allDay
        ? dayjs(eventListCardProps.startDate).startOf('day').toISOString()
        : dayjs(
            eventListCardProps.startDate + 'T' + eventListCardProps.startTime,
          ).toISOString();

      const originalEndAt = eventListCardProps.allDay
        ? dayjs(eventListCardProps.endDate).endOf('day').toISOString()
        : dayjs(
            eventListCardProps.endDate + 'T' + eventListCardProps.endTime,
          ).toISOString();

      if (newStartAt !== originalStartAt) {
        updateInput.startAt = newStartAt;
      }

      if (newEndAt !== originalEndAt) {
        updateInput.endAt = newEndAt;
      }

      // Add recurrence field for following updates if it has been set and changed
      // Note: We can't easily compare current recurrence rule with the original as we don't have it
      // For now, only add recurrence if user explicitly changed it via dropdown
      if (updateOption === 'following' && recurrence !== null) {
        updateInput.recurrence = recurrence;
      }

      // Check if any changes were made
      const hasChanges = Object.keys(updateInput).length > 1; // More than just the ID

      if (!hasChanges) {
        toast.info(t('noChangesToUpdate') || 'No changes to update');
        return;
      }

      if (!isRecurringInstance) {
        // Standalone event
        const result = await updateStandaloneEvent({
          variables: {
            input: updateInput,
          },
        });
        data = result.data;
      } else {
        // Recurring instance - handle based on selected option
        switch (updateOption) {
          case 'single':
            const singleResult = await updateSingleRecurringEventInstance({
              variables: {
                input: updateInput,
              },
            });
            data = singleResult.data;
            break;
          case 'following':
            const followingResult = await updateThisAndFollowingEvents({
              variables: {
                input: updateInput,
              },
            });
            data = followingResult.data;
            break;
        }
      }

      if (data) {
        toast.success(t('eventUpdated') as string);
        setEventUpdateModalIsOpen(false);
        hideViewModal();
        if (refetchEvents) {
          refetchEvents();
        }
      }
    } catch (error: unknown) {
      errorHandler(t, error);
    }
  };

  // This function is called when the update button is clicked
  const handleEventUpdate = async (): Promise<void> => {
    // Check if this is a recurring instance
    const isRecurringInstance =
      !eventListCardProps.isRecurringTemplate &&
      !!eventListCardProps.baseEventId;

    // If it's a recurring instance, show the modal to choose options
    if (isRecurringInstance) {
      setEventUpdateModalIsOpen(true);
    } else {
      // For standalone events, update directly
      await updateEventHandler();
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
        !eventListCardProps.isRecurringTemplate &&
        !!eventListCardProps.baseEventId;

      if (!isRecurringInstance) {
        // Standalone event
        const result = await deleteStandaloneEvent({
          variables: {
            input: {
              id: eventListCardProps._id,
            },
          },
        });
        data = result.data;
      } else {
        // Recurring instance - handle based on selected option
        switch (deleteOption) {
          case 'single':
            const singleResult = await deleteSingleInstance({
              variables: {
                input: {
                  id: eventListCardProps._id,
                },
              },
            });
            data = singleResult.data;
            break;
          case 'following':
            const followingResult = await deleteThisAndFollowing({
              variables: {
                input: {
                  id: eventListCardProps._id,
                },
              },
            });
            data = followingResult.data;
            break;
          case 'all':
            const allResult = await deleteEntireSeries({
              variables: {
                input: {
                  id: eventListCardProps.baseEventId,
                },
              },
            });
            data = allResult.data;
            break;
        }
      }

      if (data) {
        toast.success(t('eventDeleted') as string);
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
    (attendee) => attendee._id === userId,
  );
  const [isRegistered, setIsRegistered] = useState(isInitiallyRegistered);

  const [registerEventMutation] = useMutation(REGISTER_EVENT);
  const registerEventHandler = async (): Promise<void> => {
    if (!isRegistered) {
      try {
        const { data } = await registerEventMutation({
          variables: {
            eventId: eventListCardProps._id,
          },
        });

        if (data) {
          toast.success(
            `Successfully registered for ${eventListCardProps.name}`,
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
    navigate(`/${userPath}event/${orgId}/${eventListCardProps._id}`);
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
        t={t}
        tCommon={tCommon}
        deleteEventHandler={deleteEventHandler}
      />

      {/* update modal */}
      <Modal
        size="lg"
        id={`updateEventModal${eventListCardProps._id}`}
        show={eventUpdateModalIsOpen}
        onHide={toggleUpdateModal}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton className={`${styles.modalHeader}`}>
          <Modal.Title
            className="text-white"
            id={`updateEventModalLabel${eventListCardProps._id}`}
          >
            {t('updateEvent')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <p>{t('updateRecurringEventMsg')}</p>
            <Form>
              <Form.Check
                type="radio"
                id="update-single"
                name="updateOption"
                value="single"
                checked={updateOption === 'single'}
                onChange={() => setUpdateOption('single')}
                label={t('updateThisInstance')}
                className="mb-2"
              />
              <Form.Check
                type="radio"
                id="update-following"
                name="updateOption"
                value="following"
                checked={updateOption === 'following'}
                onChange={() => setUpdateOption('following')}
                label={t('updateThisAndFollowing')}
                className="mb-2"
              />
            </Form>
          </div>
        </Modal.Body>
        <Modal.Footer>
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
            onClick={() => updateEventHandler(updateOption)}
            data-testid="confirmUpdateEventBtn"
          >
            {t('updateEvent')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default EventListCardModals;
