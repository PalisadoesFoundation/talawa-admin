import React, { useEffect, useState } from 'react';
import { Popover } from 'react-bootstrap';
import dayjs from 'dayjs';
import type { InterfaceEvent } from 'types/Event/interface';
import { Role } from 'types/Event/interface';
import {
  type InterfaceRecurrenceRuleState,
  type RecurringEventMutationType,
  Days,
  Frequency,
  allInstances,
  getRecurrenceRuleText,
  thisAndFollowingInstances,
  thisInstance,
  haveInstanceDatesChanged,
  hasRecurrenceRuleChanged,
} from 'utils/recurrenceUtils';
import useLocalStorage from 'utils/useLocalstorage';
import { useNavigate, useParams } from 'react-router-dom';
import {
  DELETE_EVENT_MUTATION,
  REGISTER_EVENT,
  UPDATE_EVENT_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import { errorHandler } from 'utils/errorHandler';

import EventListCardDeleteModal from './Delete/EventListCardDeleteModal';
import EventListCardUpdateModal from './Update/EventListCardUpdateModal';
import EventListCardPreviewModal from './Preview/EventListCardPreviewModal';

interface InterfaceEventListCard extends InterfaceEvent {
  refetchEvents?: () => void;
}

/**
 * Converts a time string to a Dayjs object representing the current date with the specified time.
 * @param time - A string representing the time in 'HH:mm:ss' format.
 * @returns A Dayjs object with the current date and specified time.
 *
 * ## CSS Strategy Explanation:
 *
 * To ensure consistency across the application and reduce duplication, common styles
 * (such as button styles) have been moved to the global CSS file. Instead of using
 * component-specific classes (e.g., `.greenregbtnOrganizationFundCampaign`, `.greenregbtnPledge`), a single reusable
 * class (e.g., .addButton) is now applied.
 *
 * ### Benefits:
 * - **Reduces redundant CSS code.
 * - **Improves maintainability by centralizing common styles.
 * - **Ensures consistent styling across components.
 *
 * ### Global CSS Classes used:
 * - `.inputField`
 * - `.switch`
 * - `.addButton`
 * - `.removeButton`
 * - `.modalHeader`
 *
 * For more details on the reusable classes, refer to the global CSS file.
 */

/**
 * Properties for the `EventListCardModals` component.
 * eventListCardProps - The properties of the event list card.
 * eventModalIsOpen - Boolean indicating if the event modal is open.
 * hideViewModal - Function to hide the event modal.
 * t - Function for translation of text.
 * tCommon - Function for translation of common text.
 */
interface InterfaceEventListCardModalProps {
  eventListCardProps: InterfaceEventListCard;
  eventModalIsOpen: boolean;
  hideViewModal: () => void;
  t: (key: string) => string;
  tCommon: (key: string) => string;
}

/**
 * The `EventListCardModals` component displays the modals related to events, such as viewing,
 * updating, and deleting events.
 * @param props - The properties for the component.
 * @returns A JSX element containing the event modals.
 */
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
  const [recurringchecked, setRecurringChecked] = useState(
    eventListCardProps.recurring,
  );
  const [publicchecked, setPublicChecked] = useState(
    eventListCardProps.isPublic,
  );
  const [registrablechecked, setRegistrableChecked] = useState(
    eventListCardProps.isRegisterable,
  );
  const [eventDeleteModalIsOpen, setEventDeleteModalIsOpen] = useState(false);
  const [recurringEventUpdateModalIsOpen, setRecurringEventUpdateModalIsOpen] =
    useState(false);
  const [eventStartDate, setEventStartDate] = useState(
    new Date(eventListCardProps.startDate),
  );
  const [eventEndDate, setEventEndDate] = useState(
    new Date(eventListCardProps.endDate),
  );

  const [recurrenceRuleState, setRecurrenceRuleState] =
    useState<InterfaceRecurrenceRuleState>({
      recurrenceStartDate: eventStartDate,
      recurrenceEndDate: null,
      frequency: Frequency.WEEKLY,
      weekDays: [Days[eventStartDate.getDay()]],
      interval: 1,
      count: undefined,
      weekDayOccurenceInMonth: undefined,
    });

  const {
    recurrenceStartDate,
    recurrenceEndDate,
    frequency,
    weekDays,
    interval,
    count,
    weekDayOccurenceInMonth,
  } = recurrenceRuleState;

  const recurrenceRuleText = getRecurrenceRuleText(recurrenceRuleState);

  const [formState, setFormState] = useState({
    title: eventListCardProps.title,
    eventdescrip: eventListCardProps.description,
    location: eventListCardProps.location,
    startTime: eventListCardProps.startTime?.split('.')[0] || '08:00:00',
    endTime: eventListCardProps.endTime?.split('.')[0] || '08:00:00',
  });

  const [recurringEventDeleteType, setRecurringEventDeleteType] =
    useState<RecurringEventMutationType>(thisInstance);

  const [recurringEventUpdateType, setRecurringEventUpdateType] =
    useState<RecurringEventMutationType>(thisInstance);

  const [recurringEventUpdateOptions, setRecurringEventUpdateOptions] =
    useState<RecurringEventMutationType[]>([
      thisInstance,
      thisAndFollowingInstances,
      allInstances,
    ]);

  const [
    shouldShowRecurringEventUpdateOptions,
    setShouldShowRecurringEventUpdateOptions,
  ] = useState(true);

  useEffect(() => {
    if (eventModalIsOpen) {
      if (eventListCardProps.recurrenceRule) {
        // get the recurrence rule
        const { recurrenceRule } = eventListCardProps;

        // set the recurrence rule state
        setRecurrenceRuleState({
          recurrenceStartDate: new Date(recurrenceRule.recurrenceStartDate),
          recurrenceEndDate: recurrenceRule.recurrenceEndDate
            ? new Date(recurrenceRule.recurrenceEndDate)
            : null,
          frequency: recurrenceRule.frequency,
          weekDays: recurrenceRule.weekDays,
          interval: recurrenceRule.interval,
          count: recurrenceRule.count ?? undefined,
          weekDayOccurenceInMonth:
            recurrenceRule.weekDayOccurenceInMonth ?? undefined,
        });
      }
    }
  }, [eventModalIsOpen]);

  // a state to specify whether the recurrence rule has changed
  const [recurrenceRuleChanged, setRecurrenceRuleChanged] = useState(false);

  // a state to specify whether the instance's startDate or endDate has changed
  const [instanceDatesChanged, setInstanceDatesChanged] = useState(false);

  // the `recurrenceRuleChanged` & `instanceDatesChanged` are required,
  // because we will provide recurring event update options based on them, i.e.:
  //   - if the `instanceDatesChanged` is true, we'll not provide the option to update "allInstances"
  //   - if the `recurrenceRuleChanged` is true, we'll not provide the option to update "thisInstance"
  //   - if both are true, we'll only provide the option to update "thisAndFollowingInstances"
  // updating recurring events is not very straightforward,
  // find more info on the approach in this doc https://docs.talawa.io/docs/functionalities/recurring-events

  useEffect(() => {
    setInstanceDatesChanged(
      haveInstanceDatesChanged(
        eventListCardProps.startDate,
        eventListCardProps.endDate,
        dayjs(eventStartDate).format('YYYY-MM-DD'), // convert to date string
        dayjs(eventEndDate).format('YYYY-MM-DD'), // convert to date string
      ),
    );
    setRecurrenceRuleChanged(
      hasRecurrenceRuleChanged(
        eventListCardProps.recurrenceRule,
        recurrenceRuleState,
      ),
    );
  }, [eventStartDate, eventEndDate, recurrenceRuleState]);

  useEffect(() => {
    if (instanceDatesChanged) {
      setRecurringEventUpdateType(thisInstance);
      setRecurringEventUpdateOptions([thisInstance, thisAndFollowingInstances]);
      setShouldShowRecurringEventUpdateOptions(true);
    }

    if (recurrenceRuleChanged) {
      setRecurringEventUpdateType(thisAndFollowingInstances);
      setRecurringEventUpdateOptions([thisAndFollowingInstances, allInstances]);
      setShouldShowRecurringEventUpdateOptions(true);
    }

    if (recurrenceRuleChanged && instanceDatesChanged) {
      setRecurringEventUpdateType(thisAndFollowingInstances);
      setShouldShowRecurringEventUpdateOptions(false);
    }

    if (!recurrenceRuleChanged && !instanceDatesChanged) {
      setRecurringEventUpdateType(thisInstance);
      setRecurringEventUpdateOptions([
        thisInstance,
        thisAndFollowingInstances,
        allInstances,
      ]);
      setShouldShowRecurringEventUpdateOptions(true);
    }
  }, [recurrenceRuleChanged, instanceDatesChanged]);

  const [updateEvent] = useMutation(UPDATE_EVENT_MUTATION);

  const updateEventHandler = async (): Promise<void> => {
    try {
      const { data } = await updateEvent({
        variables: {
          id: eventListCardProps._id,
          title: formState.title,
          description: formState.eventdescrip,
          isPublic: publicchecked,
          recurring: recurringchecked,
          recurringEventUpdateType: recurringchecked
            ? recurringEventUpdateType
            : undefined,
          isRegisterable: registrablechecked,
          allDay: alldaychecked,
          startDate: dayjs(eventStartDate).format('YYYY-MM-DD'),
          endDate: dayjs(eventEndDate).format('YYYY-MM-DD'),
          location: formState.location,
          startTime: !alldaychecked ? formState.startTime : undefined,
          endTime: !alldaychecked ? formState.endTime : undefined,
          recurrenceStartDate: recurringchecked
            ? recurringEventUpdateType === thisAndFollowingInstances &&
              (instanceDatesChanged || recurrenceRuleChanged)
              ? dayjs(eventStartDate).format('YYYY-MM-DD')
              : dayjs(recurrenceStartDate).format('YYYY-MM-DD')
            : undefined,
          recurrenceEndDate: recurringchecked
            ? recurrenceEndDate
              ? dayjs(recurrenceEndDate).format('YYYY-MM-DD')
              : null
            : undefined,
          frequency: recurringchecked ? frequency : undefined,
          weekDays:
            recurringchecked &&
            (frequency === Frequency.WEEKLY ||
              (frequency === Frequency.MONTHLY && weekDayOccurenceInMonth))
              ? weekDays
              : undefined,
          interval: recurringchecked ? interval : undefined,
          count: recurringchecked ? count : undefined,
          weekDayOccurenceInMonth: recurringchecked
            ? weekDayOccurenceInMonth
            : undefined,
        },
      });

      if (data) {
        toast.success(t('eventUpdated') as string);
        setRecurringEventUpdateModalIsOpen(false);
        hideViewModal();
        if (refetchEvents) {
          refetchEvents();
        }
      }
    } catch (error: unknown) {
      errorHandler(t, error);
    }
  };

  const handleEventUpdate = async (): Promise<void> => {
    if (!eventListCardProps.recurring) {
      await updateEventHandler();
    } else {
      if (shouldShowRecurringEventUpdateOptions) {
        setRecurringEventUpdateModalIsOpen(true);
      } else {
        await updateEventHandler();
      }
    }
  };

  const [deleteEvent] = useMutation(DELETE_EVENT_MUTATION);

  const deleteEventHandler = async (): Promise<void> => {
    try {
      const { data } = await deleteEvent({
        variables: {
          id: eventListCardProps._id,
          recurringEventDeleteType: eventListCardProps.recurring
            ? recurringEventDeleteType
            : undefined,
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
  const [registerEventMutation] = useMutation(REGISTER_EVENT);
  const [isRegistered, setIsRegistered] = useState(isInitiallyRegistered);

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

  const toggleRecurringEventUpdateModal = (): void => {
    setRecurringEventUpdateModalIsOpen(!recurringEventUpdateModalIsOpen);
  };

  const openEventDashboard = (): void => {
    const userPath = eventListCardProps.userRole === Role.USER ? 'user/' : '';
    console.log(`/${userPath}event/${orgId}/${eventListCardProps._id}`);
    navigate(`/${userPath}event/${orgId}/${eventListCardProps._id}`);
  };

  const popover = (
    <Popover
      id={`popover-recurrenceRuleText`}
      data-testid={`popover-recurrenceRuleText`}
    >
      <Popover.Body>{recurrenceRuleText}</Popover.Body>
    </Popover>
  );

  return (
    <>
      {/* preview modal */}
      <EventListCardPreviewModal
        eventListCardProps={eventListCardProps}
        eventModalIsOpen={eventModalIsOpen}
        hideViewModal={hideViewModal}
        toggleDeleteModal={toggleDeleteModal}
        t={t}
        tCommon={tCommon}
        popover={popover}
        weekDayOccurenceInMonth={weekDayOccurenceInMonth}
        isRegistered={isRegistered}
        userId={userId as string}
        eventStartDate={eventStartDate}
        eventEndDate={eventEndDate}
        setEventStartDate={setEventStartDate}
        setEventEndDate={setEventEndDate}
        alldaychecked={alldaychecked}
        setAllDayChecked={setAllDayChecked}
        recurringchecked={recurringchecked}
        setRecurringChecked={setRecurringChecked}
        publicchecked={publicchecked}
        setPublicChecked={setPublicChecked}
        registrablechecked={registrablechecked}
        setRegistrableChecked={setRegistrableChecked}
        recurrenceRuleState={recurrenceRuleState}
        setRecurrenceRuleState={setRecurrenceRuleState}
        recurrenceRuleText={recurrenceRuleText}
        formState={formState}
        setFormState={setFormState}
        registerEventHandler={registerEventHandler}
        handleEventUpdate={handleEventUpdate}
        openEventDashboard={openEventDashboard}
      />

      {/* recurring event update options modal */}
      <EventListCardUpdateModal
        eventListCardProps={eventListCardProps}
        recurringEventUpdateModalIsOpen={recurringEventUpdateModalIsOpen}
        toggleRecurringEventUpdateModal={toggleRecurringEventUpdateModal}
        t={t}
        tCommon={tCommon}
        recurringEventUpdateType={recurringEventUpdateType}
        setRecurringEventUpdateType={setRecurringEventUpdateType}
        recurringEventUpdateOptions={recurringEventUpdateOptions}
        updateEventHandler={updateEventHandler}
      />

      {/* delete modal */}
      <EventListCardDeleteModal
        eventListCardProps={eventListCardProps}
        eventDeleteModalIsOpen={eventDeleteModalIsOpen}
        toggleDeleteModal={toggleDeleteModal}
        t={t}
        tCommon={tCommon}
        recurringEventDeleteType={recurringEventDeleteType}
        setRecurringEventDeleteType={setRecurringEventDeleteType}
        deleteEventHandler={deleteEventHandler}
      />
    </>
  );
}

export default EventListCardModals;
