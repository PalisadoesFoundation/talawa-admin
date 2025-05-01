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
 * @example
 * <EventListCardModals
 *   eventListCardProps={eventProps}
 *   eventModalIsOpen={true}
 *   hideViewModal={() => {}}
 *   t={(key) => key}
 *   tCommon={(key) => key}
 * />
 */
import React, { useState } from 'react';
import dayjs from 'dayjs';
import type { InterfaceEvent } from 'types/Event/interface';
import { UserRole } from 'types/Event/interface';
import useLocalStorage from 'utils/useLocalstorage';
import { useNavigate, useParams } from 'react-router';
import {
  DELETE_EVENT_MUTATION,
  REGISTER_EVENT,
  UPDATE_EVENT_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import { errorHandler } from 'utils/errorHandler';

import EventListCardDeleteModal from './Delete/EventListCardDeleteModal';
import EventListCardPreviewModal from './Preview/EventListCardPreviewModal';

interface InterfaceEventListCard extends InterfaceEvent {
  refetchEvents?: () => void;
}

interface InterfaceEventListCardModalProps {
  eventListCardProps: InterfaceEventListCard;
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
}: InterfaceEventListCardModalProps): JSX.Element {
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
  const [eventStartDate, setEventStartDate] = useState(
    new Date(eventListCardProps.startDate),
  );
  const [eventEndDate, setEventEndDate] = useState(
    new Date(eventListCardProps.endDate),
  );

  const [formState, setFormState] = useState({
    title: eventListCardProps.title,
    eventdescrip: eventListCardProps.description,
    location: eventListCardProps.location,
    startTime: eventListCardProps.startTime?.split('.')[0] || '08:00:00',
    endTime: eventListCardProps.endTime?.split('.')[0] || '08:00:00',
  });

  const [updateEvent] = useMutation(UPDATE_EVENT_MUTATION);

  const handleEventUpdate = async (): Promise<void> => {
    try {
      const { data } = await updateEvent({
        variables: {
          input: {
            id: eventListCardProps._id,
            name: formState.title,
            description: formState.eventdescrip,
            isPublic: publicchecked,
            isRegisterable: registrablechecked,
            allDay: alldaychecked,
            startAt: alldaychecked
              ? dayjs(eventStartDate).startOf('day').toISOString()
              : dayjs(eventStartDate)
                  .hour(parseInt(formState.startTime.split(':')[0]))
                  .minute(parseInt(formState.startTime.split(':')[1]))
                  .second(parseInt(formState.startTime.split(':')[2]))
                  .toISOString(),
            endAt: alldaychecked
              ? dayjs(eventEndDate).endOf('day').toISOString()
              : dayjs(eventEndDate)
                  .hour(parseInt(formState.endTime.split(':')[0]))
                  .minute(parseInt(formState.endTime.split(':')[1]))
                  .second(parseInt(formState.endTime.split(':')[2]))
                  .toISOString(),
            location: formState.location,
          },
        },
      });

      if (data) {
        toast.success(t('eventUpdated') as string);
        hideViewModal();
        if (refetchEvents) {
          refetchEvents();
        }
      }
    } catch (error: unknown) {
      errorHandler(t, error);
    }
  };

  const [deleteEvent] = useMutation(DELETE_EVENT_MUTATION);

  const deleteEventHandler = async (): Promise<void> => {
    try {
      const { data } = await deleteEvent({
        variables: {
          input: {
            id: eventListCardProps._id,
          },
        },
      });

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
            `Successfully registered for ${eventListCardProps.title}`,
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
    </>
  );
}

export default EventListCardModals;
