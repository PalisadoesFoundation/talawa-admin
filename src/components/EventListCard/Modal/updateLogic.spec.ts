import { vi, describe, it, expect, beforeEach, Mock } from 'vitest';
import {
  useUpdateEventHandler,
  hasRecurrenceChanged,
  getAvailableUpdateOptions,
} from './updateLogic';
import { useMutation } from '@apollo/client';
import {
  UPDATE_EVENT_MUTATION,
  UPDATE_SINGLE_RECURRING_EVENT_INSTANCE_MUTATION,
  UPDATE_THIS_AND_FOLLOWING_EVENTS_MUTATION,
  UPDATE_ENTIRE_RECURRING_EVENT_SERIES_MUTATION,
} from 'GraphQl/Mutations/EventMutations';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { errorHandler } from 'utils/errorHandler';
import type { InterfaceEvent } from 'types/Event/interface';
import { UserRole } from 'types/Event/interface';
import {
  Frequency,
  InterfaceRecurrenceRule,
  WeekDays,
} from 'utils/recurrenceUtils';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import type { IEventFormSubmitPayload } from 'types/EventForm/interface';

dayjs.extend(utc);

import type { TFunction } from 'i18next';

// Mock dependencies
vi.mock('@apollo/client', async () => {
  const original = await vi.importActual('@apollo/client');
  return {
    ...original,
    useMutation: vi.fn(),
  };
});

vi.mock('components/NotificationToast/NotificationToast', async () => ({
  NotificationToast: {
    info: vi.fn(),
    error: vi.fn(),
    success: vi.fn(),
  },
}));

vi.mock('utils/errorHandler', async () => ({
  errorHandler: vi.fn(),
}));

const mockUseMutation = useMutation as Mock;
const mockT = ((key: string) => key) as unknown as TFunction<
  'translation',
  undefined
>;

type MockEventListCardProps = InterfaceEvent;

const mockEventListCardProps: MockEventListCardProps = {
  id: 'event1',
  name: 'Test Event',
  description: 'Test Description',
  location: 'Test Location',
  startAt: dayjs().toISOString(),
  endAt: dayjs().add(2, 'hours').toISOString(),
  startTime: '10:00:00',
  endTime: '12:00:00',
  allDay: false,
  isPublic: true,
  isRegisterable: true,
  isInviteOnly: false,
  attendees: [],
  creator: {
    id: 'user1',
    name: 'User 1',
    emailAddress: 'user1@example.com',
  },
  userRole: UserRole.ADMINISTRATOR,
  isRecurringEventTemplate: false,
  baseEvent: null,
  recurrenceRule: null,
  recurrenceDescription: null,
};

const mockFormState = {
  name: mockEventListCardProps.name,
  eventdescrip: mockEventListCardProps.description,
  location: mockEventListCardProps.location,
  startTime: mockEventListCardProps.startTime as string,
  endTime: mockEventListCardProps.endTime as string,
};

const buildRecurringEventProps = (
  overrides: Partial<MockEventListCardProps> = {},
): MockEventListCardProps => ({
  ...mockEventListCardProps,
  isRecurringEventTemplate: false,
  baseEvent: { id: 'baseEvent1' },
  ...overrides,
});

type HandlerArgs = Parameters<
  ReturnType<typeof useUpdateEventHandler>['updateEventHandler']
>[0];

type HandlerOverrides = Partial<HandlerArgs>;

const buildHandlerInput = (overrides: HandlerOverrides = {}): HandlerArgs => ({
  eventListCardProps: mockEventListCardProps,
  formState: mockFormState,
  alldaychecked: mockEventListCardProps.allDay,
  publicchecked: mockEventListCardProps.isPublic,
  registrablechecked: mockEventListCardProps.isRegisterable,
  inviteOnlyChecked: mockEventListCardProps.isInviteOnly,
  eventStartDate: new Date(mockEventListCardProps.startAt),
  eventEndDate: new Date(mockEventListCardProps.endAt),
  recurrence: null as InterfaceRecurrenceRule | null,
  updateOption: 'single',
  hasRecurrenceChanged: false,
  t: mockT,
  hideViewModal: vi.fn(),
  setEventUpdateModalIsOpen: vi.fn(),
  refetchEvents: vi.fn(),
  ...overrides,
});

describe('useUpdateEventHandler', () => {
  let mockUpdateStandaloneEvent: Mock;
  let mockUpdateSingleRecurringEventInstance: Mock;
  let mockUpdateThisAndFollowingEvents: Mock;
  let mockUpdateEntireRecurringEventSeries: Mock;

  afterEach(() => {
    vi.clearAllMocks();
  });

  beforeEach(() => {
    mockUpdateStandaloneEvent = vi.fn();
    mockUpdateSingleRecurringEventInstance = vi.fn();
    mockUpdateThisAndFollowingEvents = vi.fn();
    mockUpdateEntireRecurringEventSeries = vi.fn();

    mockUseMutation.mockImplementation((mutation) => {
      if (mutation === UPDATE_EVENT_MUTATION) {
        return [mockUpdateStandaloneEvent, { loading: false }];
      }
      if (mutation === UPDATE_SINGLE_RECURRING_EVENT_INSTANCE_MUTATION) {
        return [mockUpdateSingleRecurringEventInstance, { loading: false }];
      }
      if (mutation === UPDATE_THIS_AND_FOLLOWING_EVENTS_MUTATION) {
        return [mockUpdateThisAndFollowingEvents, { loading: false }];
      }
      if (mutation === UPDATE_ENTIRE_RECURRING_EVENT_SERIES_MUTATION) {
        return [mockUpdateEntireRecurringEventSeries, { loading: false }];
      }
      return [vi.fn(), { loading: false }];
    });
  });

  it('initializes updateEventHandler function correctly', () => {
    const { updateEventHandler } = useUpdateEventHandler();
    expect(updateEventHandler).toBeInstanceOf(Function);
  });

  it('calls info toast when no changes are made', async () => {
    const { updateEventHandler } = useUpdateEventHandler();
    await updateEventHandler(buildHandlerInput());

    expect(NotificationToast.info).toHaveBeenCalledWith('noChangesToUpdate');
    expect(mockUpdateStandaloneEvent).not.toHaveBeenCalled();
    expect(mockUpdateSingleRecurringEventInstance).not.toHaveBeenCalled();
    expect(mockUpdateThisAndFollowingEvents).not.toHaveBeenCalled();
    expect(mockUpdateEntireRecurringEventSeries).not.toHaveBeenCalled();
  });

  describe('standalone event updates', () => {
    it('handles standalone event update with name change', async () => {
      mockUpdateStandaloneEvent.mockResolvedValueOnce({
        data: { updateEvent: {} },
      });
      const { updateEventHandler } = useUpdateEventHandler();

      await updateEventHandler(
        buildHandlerInput({
          formState: {
            ...mockFormState,
            name: 'Changed Name',
          },
        }),
      );

      expect(mockUpdateStandaloneEvent).toHaveBeenCalledTimes(1);
      const calledInputs =
        mockUpdateStandaloneEvent.mock.calls[0][0].variables.input;
      expect(calledInputs.name).toContain('Changed Name');
      expect(NotificationToast.success).toHaveBeenCalledWith('eventUpdated');
    });

    it('handles standalone event update with description change', async () => {
      mockUpdateStandaloneEvent.mockResolvedValueOnce({
        data: { updateEvent: {} },
      });
      const { updateEventHandler } = useUpdateEventHandler();

      await updateEventHandler(
        buildHandlerInput({
          formState: {
            ...mockFormState,
            eventdescrip: 'Changed Event',
          },
        }),
      );

      expect(mockUpdateStandaloneEvent).toBeCalledTimes(1);
      const calledInputs =
        mockUpdateStandaloneEvent.mock.calls[0][0].variables.input;
      expect(calledInputs.description).toContain('Changed Event');
    });

    it('handles standalone event update with location change', async () => {
      mockUpdateStandaloneEvent.mockResolvedValueOnce({
        data: { updateEvent: {} },
      });
      const { updateEventHandler } = useUpdateEventHandler();

      await updateEventHandler(
        buildHandlerInput({
          formState: {
            ...mockFormState,
            location: 'Changed location',
          },
        }),
      );

      expect(mockUpdateStandaloneEvent).toBeCalledTimes(1);
      const calledInputs =
        mockUpdateStandaloneEvent.mock.calls[0][0].variables.input;
      expect(calledInputs.location).toContain('Changed location');
    });

    it('handles standalone event update with isPublic change', async () => {
      mockUpdateStandaloneEvent.mockResolvedValueOnce({
        data: { updateEvent: {} },
      });
      const { updateEventHandler } = useUpdateEventHandler();

      await updateEventHandler(
        buildHandlerInput({
          publicchecked: false,
        }),
      );

      expect(mockUpdateStandaloneEvent).toBeCalledTimes(1);
      const calledInputs =
        mockUpdateStandaloneEvent.mock.calls[0][0].variables.input;
      expect(calledInputs.isPublic).toBe(false);
    });

    it('handles standalone event update with isRegisterable change', async () => {
      mockUpdateStandaloneEvent.mockResolvedValueOnce({
        data: { updateEvent: {} },
      });
      const { updateEventHandler } = useUpdateEventHandler();

      await updateEventHandler(
        buildHandlerInput({
          registrablechecked: false,
        }),
      );

      expect(mockUpdateStandaloneEvent).toBeCalledTimes(1);
      const calledInputs =
        mockUpdateStandaloneEvent.mock.calls[0][0].variables.input;
      expect(calledInputs.isRegisterable).toBe(false);
    });

    it('handles standalone event update with isInviteOnly change', async () => {
      mockUpdateStandaloneEvent.mockResolvedValueOnce({
        data: { updateEvent: {} },
      });
      const { updateEventHandler } = useUpdateEventHandler();

      await updateEventHandler(
        buildHandlerInput({
          inviteOnlyChecked: true,
        }),
      );

      expect(mockUpdateStandaloneEvent).toBeCalledTimes(1);
      const calledInputs =
        mockUpdateStandaloneEvent.mock.calls[0][0].variables.input;
      expect(calledInputs.isInviteOnly).toBe(true);
    });

    it('shows success toast, closes modals and refetches on successful update', async () => {
      mockUpdateStandaloneEvent.mockResolvedValueOnce({
        data: { updateEvent: {} },
      });
      const { updateEventHandler } = useUpdateEventHandler();

      const hideViewModal = vi.fn();
      const setEventUpdateModalIsOpen = vi.fn();
      const refetchEvents = vi.fn();

      await updateEventHandler(
        buildHandlerInput({
          formState: {
            ...mockFormState,
            name: 'Changed Name',
          },
          hideViewModal,
          setEventUpdateModalIsOpen,
          refetchEvents,
        }),
      );

      expect(mockUpdateStandaloneEvent).toHaveBeenCalledTimes(1);
      expect(NotificationToast.success).toHaveBeenCalledWith('eventUpdated');
      expect(setEventUpdateModalIsOpen).toHaveBeenCalledWith(false);
      expect(hideViewModal).toHaveBeenCalled();
      expect(refetchEvents).toHaveBeenCalled();
    });

    it('calls errorHandler when mutation throws', async () => {
      const error = new Error('network');
      mockUpdateStandaloneEvent.mockRejectedValueOnce(error);
      const { updateEventHandler } = useUpdateEventHandler();

      await updateEventHandler(
        buildHandlerInput({
          formState: {
            ...mockFormState,
            name: 'Changed Name',
          },
        }),
      );

      expect(errorHandler).toHaveBeenCalledWith(mockT, error);
    });
  });

  describe('recurring event updates', () => {
    it('calls updateSingleRecurringEventInstance mutation', async () => {
      mockUpdateSingleRecurringEventInstance.mockResolvedValueOnce({
        data: { updateEvent: {} },
      });
      const { updateEventHandler } = useUpdateEventHandler();

      await updateEventHandler(
        buildHandlerInput({
          eventListCardProps: buildRecurringEventProps(),
          updateOption: 'single',
          formState: {
            ...mockFormState,
            name: 'Changed Name',
          },
        }),
      );

      expect(mockUpdateSingleRecurringEventInstance).toBeCalledTimes(1);
      const calledInputs =
        mockUpdateSingleRecurringEventInstance.mock.calls[0][0].variables.input;
      expect(calledInputs.name).toContain('Changed Name');
    });

    it('calls updateThisAndFollowingEvents mutation', async () => {
      mockUpdateThisAndFollowingEvents.mockResolvedValueOnce({
        data: { updateEvent: {} },
      });
      const { updateEventHandler } = useUpdateEventHandler();

      await updateEventHandler(
        buildHandlerInput({
          eventListCardProps: buildRecurringEventProps(),
          updateOption: 'following',
          formState: {
            ...mockFormState,
            name: 'Changed name',
          },
          recurrence: { frequency: Frequency.DAILY, interval: 1 },
          hasRecurrenceChanged: undefined,
        }),
      );

      expect(mockUpdateThisAndFollowingEvents).toHaveBeenCalledTimes(1);
      const calledInputs =
        mockUpdateThisAndFollowingEvents.mock.calls[0][0].variables.input;
      expect(calledInputs.name).toContain('Changed name');
      expect(calledInputs.recurrence).toBeUndefined();
    });

    it('includes recurrence in input when hasRecurrenceChanged is true', async () => {
      mockUpdateThisAndFollowingEvents.mockResolvedValueOnce({
        data: { updateEvent: {} },
      });
      const { updateEventHandler } = useUpdateEventHandler();

      const recurrenceRule: InterfaceRecurrenceRule = {
        frequency: Frequency.DAILY,
        interval: 1,
      };

      await updateEventHandler(
        buildHandlerInput({
          eventListCardProps: buildRecurringEventProps(),
          updateOption: 'following',
          formState: {
            ...mockFormState,
            name: 'Changed name',
          },
          recurrence: recurrenceRule,
          hasRecurrenceChanged: true,
        }),
      );

      expect(mockUpdateThisAndFollowingEvents).toHaveBeenCalledTimes(1);
      const calledInputs =
        mockUpdateThisAndFollowingEvents.mock.calls[0][0].variables.input;
      expect(calledInputs.name).toContain('Changed name');
      expect(calledInputs.recurrence).toEqual(recurrenceRule);
    });

    it('calls updateEntireRecurringEventSeries when name is changed', async () => {
      mockUpdateEntireRecurringEventSeries.mockResolvedValueOnce({
        data: { updateEvent: {} },
      });
      const { updateEventHandler } = useUpdateEventHandler();

      await updateEventHandler(
        buildHandlerInput({
          eventListCardProps: buildRecurringEventProps(),
          updateOption: 'entireSeries',
          formState: {
            ...mockFormState,
            name: 'Changed Name',
          },
        }),
      );

      expect(mockUpdateEntireRecurringEventSeries).toBeCalledTimes(1);
      const calledInputs =
        mockUpdateEntireRecurringEventSeries.mock.calls[0][0].variables.input;
      expect(calledInputs.name).toContain('Changed Name');
    });

    it('calls updateEntireRecurringEventSeries when description is changed', async () => {
      mockUpdateEntireRecurringEventSeries.mockResolvedValueOnce({
        data: { updateEvent: {} },
      });
      const { updateEventHandler } = useUpdateEventHandler();

      await updateEventHandler(
        buildHandlerInput({
          eventListCardProps: buildRecurringEventProps(),
          updateOption: 'entireSeries',
          formState: {
            ...mockFormState,
            eventdescrip: 'Changed event description',
          },
        }),
      );

      expect(mockUpdateEntireRecurringEventSeries).toBeCalledTimes(1);
      const calledInputs =
        mockUpdateEntireRecurringEventSeries.mock.calls[0][0].variables.input;
      expect(calledInputs.description).toContain('Changed event description');
    });

    it('propagates all fields when updating entire series', async () => {
      mockUpdateEntireRecurringEventSeries.mockResolvedValueOnce({
        data: { updateEvent: {} },
      });
      const { updateEventHandler } = useUpdateEventHandler();

      await updateEventHandler(
        buildHandlerInput({
          eventListCardProps: buildRecurringEventProps(),
          updateOption: 'entireSeries',
          formState: {
            ...mockFormState,
            name: 'Changed Name',
            location: 'New Location',
          },
          publicchecked: false, // Changed from true
          inviteOnlyChecked: true, // Changed from false
        }),
      );

      expect(mockUpdateEntireRecurringEventSeries).toHaveBeenCalledTimes(1);
      const calledInputs =
        mockUpdateEntireRecurringEventSeries.mock.calls[0][0].variables.input;

      expect(calledInputs.name).toBe('Changed Name');
      expect(calledInputs.location).toBe('New Location');
      expect(calledInputs.isPublic).toBe(false);
      expect(calledInputs.isInviteOnly).toBe(true);
    });

    it('handles undefined isInviteOnly in props correctly when inviteOnlyChecked is false', async () => {
      mockUpdateEntireRecurringEventSeries.mockResolvedValueOnce({
        data: { updateEvent: {} },
      });
      const { updateEventHandler } = useUpdateEventHandler();

      const props = buildRecurringEventProps();
      delete (props as Partial<MockEventListCardProps>).isInviteOnly;

      await updateEventHandler(
        buildHandlerInput({
          eventListCardProps: props,
          updateOption: 'entireSeries',
          formState: {
            ...mockFormState,
            name: 'Changed Name',
          },
          inviteOnlyChecked: false,
        }),
      );

      expect(mockUpdateEntireRecurringEventSeries).toHaveBeenCalledTimes(1);
      const calledInputs =
        mockUpdateEntireRecurringEventSeries.mock.calls[0][0].variables.input;
      expect(calledInputs).not.toHaveProperty('isInviteOnly');
    });

    it('propagates extended fields (registerable, allDay, dates) when updating entire series', async () => {
      mockUpdateEntireRecurringEventSeries.mockResolvedValueOnce({
        data: { updateEvent: {} },
      });
      const { updateEventHandler } = useUpdateEventHandler();

      const newStartDate = dayjs().add(20, 'days').startOf('day').toDate();
      const newEndDate = dayjs().add(21, 'days').startOf('day').toDate();

      await updateEventHandler(
        buildHandlerInput({
          eventListCardProps: buildRecurringEventProps({
            isRegisterable: true,
            allDay: false,
          }),
          updateOption: 'entireSeries',
          formState: {
            ...mockFormState,
          },
          publicchecked: true,
          registrablechecked: false, // Changed from true
          alldaychecked: true, // Changed from false
          eventStartDate: newStartDate,
          eventEndDate: newEndDate,
        }),
      );

      expect(mockUpdateEntireRecurringEventSeries).toHaveBeenCalledTimes(1);
      const calledInputs =
        mockUpdateEntireRecurringEventSeries.mock.calls[0][0].variables.input;

      expect(calledInputs.isRegisterable).toBe(false);
      expect(calledInputs.allDay).toBe(true);
      // Dates should be propagated
      expect(calledInputs.startAt).toBeDefined();
      expect(calledInputs.endAt).toBeDefined();
    });
  });

  describe('date validation and handling', () => {
    it('computes all-day startAt and endAt correctly', async () => {
      mockUpdateStandaloneEvent.mockResolvedValueOnce({
        data: { updateEvent: {} },
      });
      const { updateEventHandler } = useUpdateEventHandler();

      await updateEventHandler(
        buildHandlerInput({
          eventListCardProps: {
            ...mockEventListCardProps,
            allDay: false,
            startAt: dayjs().add(2, 'months').toISOString(),
            endAt: dayjs()
              .add(2, 'months')
              .add(1, 'day')
              .add(2, 'hours')
              .toISOString(),
          },
          alldaychecked: true,
          eventStartDate: dayjs().add(10, 'days').startOf('day').toDate(),
          eventEndDate: dayjs().add(11, 'days').startOf('day').toDate(),
        }),
      );

      expect(mockUpdateStandaloneEvent).toHaveBeenCalledTimes(1);
      const calledInputs =
        mockUpdateStandaloneEvent.mock.calls[0][0].variables.input;
      // The implementation uses dayjs.utc() to parse the Date objects
      // When local dates (IST) are converted to UTC, they shift backwards
      // So we need to expect the UTC-converted values, not the local values
      const expectedStartDate = dayjs
        .utc(dayjs().add(10, 'days').startOf('day').toDate())
        .startOf('day');
      const expectedEndDate = dayjs
        .utc(dayjs().add(11, 'days').startOf('day').toDate())
        .endOf('day');
      expect(calledInputs.startAt).toContain(
        expectedStartDate.format('YYYY-MM-DDTHH:mm:ss'),
      );
      expect(calledInputs.endAt).toContain(
        expectedEndDate.format('YYYY-MM-DDTHH:mm'),
      );
      expect(NotificationToast.success).toHaveBeenCalledWith('eventUpdated');
    });

    it('handles standalone event update with allDay change only', async () => {
      mockUpdateStandaloneEvent.mockResolvedValueOnce({
        data: { updateEvent: {} },
      });
      const { updateEventHandler } = useUpdateEventHandler();

      await updateEventHandler(
        buildHandlerInput({
          alldaychecked: true, // Changed from false
        }),
      );

      expect(mockUpdateStandaloneEvent).toHaveBeenCalledTimes(1);
      const calledInputs =
        mockUpdateStandaloneEvent.mock.calls[0][0].variables.input;
      expect(calledInputs.allDay).toBe(true);
    });

    it('shows error toast when computed dates are invalid', async () => {
      const { updateEventHandler } = useUpdateEventHandler();

      await updateEventHandler(
        buildHandlerInput({
          eventStartDate: new Date('invalid'),
          eventEndDate: new Date('invalid'),
        }),
      );

      expect(NotificationToast.error).toHaveBeenCalledWith('invalidDate');
      expect(mockUpdateStandaloneEvent).not.toHaveBeenCalled();
    });

    it('shows error toast when all-day eventStartDate is invalid', async () => {
      const { updateEventHandler } = useUpdateEventHandler();

      await updateEventHandler(
        buildHandlerInput({
          alldaychecked: true,
          eventStartDate: new Date('invalid'),
          eventEndDate: dayjs().add(11, 'days').startOf('day').toDate(),
          formState: {
            ...mockFormState,
            name: 'Changed Name',
          },
        }),
      );

      expect(NotificationToast.error).toHaveBeenCalledWith('invalidDate');
      expect(mockUpdateStandaloneEvent).not.toHaveBeenCalled();
    });

    it('shows error toast when all-day eventEndDate is invalid', async () => {
      const { updateEventHandler } = useUpdateEventHandler();

      await updateEventHandler(
        buildHandlerInput({
          alldaychecked: true,
          eventStartDate: dayjs().add(10, 'days').startOf('day').toDate(),
          eventEndDate: new Date('invalid'),
          formState: {
            ...mockFormState,
            name: 'Changed Name',
          },
        }),
      );

      expect(NotificationToast.error).toHaveBeenCalledWith('invalidDate');
      expect(mockUpdateStandaloneEvent).not.toHaveBeenCalled();
    });

    it('handles originalStartAt calculation when event is all-day but startAt is invalid', async () => {
      mockUpdateStandaloneEvent.mockResolvedValueOnce({
        data: { updateEvent: {} },
      });
      const { updateEventHandler } = useUpdateEventHandler();

      await updateEventHandler(
        buildHandlerInput({
          eventListCardProps: {
            ...mockEventListCardProps,
            allDay: true,
            startAt: 'invalid-date',
            endAt: dayjs().add(2, 'hours').toISOString(),
          },
          alldaychecked: true,
          eventStartDate: dayjs().add(10, 'days').startOf('day').toDate(),
          eventEndDate: dayjs().add(11, 'days').startOf('day').toDate(),
          formState: {
            ...mockFormState,
            name: 'Changed Name',
          },
        }),
      );

      expect(mockUpdateStandaloneEvent).toHaveBeenCalledTimes(1);
      expect(NotificationToast.success).toHaveBeenCalledWith('eventUpdated');
    });

    it('handles originalEndAt calculation when event is all-day but endAt is invalid', async () => {
      mockUpdateStandaloneEvent.mockResolvedValueOnce({
        data: { updateEvent: {} },
      });
      const { updateEventHandler } = useUpdateEventHandler();

      await updateEventHandler(
        buildHandlerInput({
          eventListCardProps: {
            ...mockEventListCardProps,
            allDay: true,
            startAt: dayjs().toISOString(),
            endAt: 'invalid-date',
          },
          alldaychecked: true,
          eventStartDate: dayjs().add(10, 'days').startOf('day').toDate(),
          eventEndDate: dayjs().add(11, 'days').startOf('day').toDate(),
          formState: {
            ...mockFormState,
            name: 'Changed Name',
          },
        }),
      );

      expect(mockUpdateStandaloneEvent).toHaveBeenCalledTimes(1);
      expect(NotificationToast.success).toHaveBeenCalledWith('eventUpdated');
    });

    it('handles originalStartAt calculation when event is not all-day but constructed date is invalid', async () => {
      mockUpdateStandaloneEvent.mockResolvedValueOnce({
        data: { updateEvent: {} },
      });
      const { updateEventHandler } = useUpdateEventHandler();

      await updateEventHandler(
        buildHandlerInput({
          eventListCardProps: {
            ...mockEventListCardProps,
            allDay: false,
            startAt: dayjs().toISOString(),
            endAt: dayjs().add(2, 'hours').toISOString(),
            startTime: 'invalid-time',
            endTime: '12:00:00',
          },
          alldaychecked: false,
          eventStartDate: dayjs()
            .add(10, 'days')
            .hour(11)
            .minute(0)
            .second(0)
            .toDate(),
          eventEndDate: dayjs()
            .add(10, 'days')
            .hour(13)
            .minute(0)
            .second(0)
            .toDate(),
          formState: {
            ...mockFormState,
            name: 'Changed Name',
            startTime: '11:00:00',
            endTime: '13:00:00',
          },
        }),
      );

      expect(mockUpdateStandaloneEvent).toHaveBeenCalledTimes(1);
      expect(NotificationToast.success).toHaveBeenCalledWith('eventUpdated');
    });

    it('handles originalEndAt calculation when event is not all-day but constructed date is invalid', async () => {
      mockUpdateStandaloneEvent.mockResolvedValueOnce({
        data: { updateEvent: {} },
      });
      const { updateEventHandler } = useUpdateEventHandler();

      await updateEventHandler(
        buildHandlerInput({
          eventListCardProps: {
            ...mockEventListCardProps,
            allDay: false,
            startAt: dayjs().toISOString(),
            endAt: dayjs().add(2, 'hours').toISOString(),
            startTime: '10:00:00',
            endTime: 'invalid-time',
          },
          alldaychecked: false,
          eventStartDate: dayjs()
            .add(10, 'days')
            .hour(10)
            .minute(0)
            .second(0)
            .toDate(),
          eventEndDate: dayjs()
            .add(10, 'days')
            .hour(14)
            .minute(0)
            .second(0)
            .toDate(),
          formState: {
            ...mockFormState,
            name: 'Changed Name',
            startTime: '11:00:00',
            endTime: '13:00:00',
          },
        }),
      );

      expect(mockUpdateStandaloneEvent).toHaveBeenCalledTimes(1);
      expect(NotificationToast.success).toHaveBeenCalledWith('eventUpdated');
    });
  });
});

describe('hasRecurrenceChanged', () => {
  const basePayload: Partial<IEventFormSubmitPayload> = {
    recurrenceRule: null,
  };
  const baseProps: Partial<InterfaceEvent> = {
    recurrenceRule: null,
  };

  it('returns false when neither has recurrence', () => {
    expect(
      hasRecurrenceChanged(
        basePayload as unknown as IEventFormSubmitPayload,
        baseProps as unknown as InterfaceEvent,
      ),
    ).toBe(false);
  });

  it('returns true when recurrence added (null -> object)', () => {
    const payload: Partial<IEventFormSubmitPayload> = {
      recurrenceRule: {
        frequency: Frequency.DAILY,
        interval: 1,
      },
    };
    expect(
      hasRecurrenceChanged(
        payload as unknown as IEventFormSubmitPayload,
        baseProps as unknown as InterfaceEvent,
      ),
    ).toBe(true);
  });

  it('returns true when recurrence removed (object -> null)', () => {
    const props: Partial<InterfaceEvent> = {
      ...baseProps,
      recurrenceRule: {
        frequency: Frequency.DAILY,
        interval: 1,
      },
    };
    expect(
      hasRecurrenceChanged(
        basePayload as unknown as IEventFormSubmitPayload,
        props as unknown as InterfaceEvent,
      ),
    ).toBe(true);
  });

  it('returns false when recurrence components are identical', () => {
    const payload: Partial<IEventFormSubmitPayload> = {
      recurrenceRule: {
        frequency: Frequency.DAILY,
        interval: 1,
        byDay: undefined,
        byMonth: undefined,
        byMonthDay: undefined,
        count: undefined,
        recurrenceEndDate: undefined,
      },
    };
    const props: Partial<InterfaceEvent> = {
      ...baseProps,
      recurrenceRule: {
        frequency: Frequency.DAILY,
        interval: 1,
        byDay: undefined,
        byMonth: undefined,
        byMonthDay: undefined,
        count: undefined,
        recurrenceEndDate: undefined,
      },
    };
    expect(
      hasRecurrenceChanged(
        payload as unknown as IEventFormSubmitPayload,
        props as unknown as InterfaceEvent,
      ),
    ).toBe(false);
  });

  it('returns true when a recurrence component differs', () => {
    const payload: Partial<IEventFormSubmitPayload> = {
      recurrenceRule: {
        frequency: Frequency.DAILY,
        interval: 1,
        byDay: [WeekDays.TU], // different
        byMonth: undefined,
        byMonthDay: undefined,
        count: undefined,
        recurrenceEndDate: undefined,
      },
    };
    const props: Partial<InterfaceEvent> = {
      ...baseProps,
      recurrenceRule: {
        frequency: Frequency.DAILY,
        interval: 1,
        byDay: [WeekDays.MO],
        byMonth: undefined,
        byMonthDay: undefined,
        count: undefined,
        recurrenceEndDate: undefined,
      },
    };
    expect(
      hasRecurrenceChanged(
        payload as unknown as IEventFormSubmitPayload,
        props as unknown as InterfaceEvent,
      ),
    ).toBe(true);
  });

  it('returns true when count differs', () => {
    const payload: Partial<IEventFormSubmitPayload> = {
      recurrenceRule: {
        frequency: Frequency.DAILY,
        interval: 1,
        byDay: [WeekDays.MO],
        byMonth: undefined,
        byMonthDay: undefined,
        count: 10,
        recurrenceEndDate: undefined,
      },
    };
    const props: Partial<InterfaceEvent> = {
      ...baseProps,
      recurrenceRule: {
        frequency: Frequency.DAILY,
        interval: 1,
        byDay: [WeekDays.MO],
        byMonth: undefined,
        byMonthDay: undefined,
        count: 5, // different
        recurrenceEndDate: undefined,
      },
    };
    expect(
      hasRecurrenceChanged(
        payload as unknown as IEventFormSubmitPayload,
        props as unknown as InterfaceEvent,
      ),
    ).toBe(true);
  });

  it('returns true when recurrenceEndDate differs', () => {
    const payload: Partial<IEventFormSubmitPayload> = {
      recurrenceRule: {
        frequency: Frequency.DAILY,
        interval: 1,
        byDay: [WeekDays.MO],
        byMonth: undefined,
        byMonthDay: undefined,
        count: undefined,
        recurrenceEndDate: dayjs().toDate(),
      },
    };
    const props: Partial<InterfaceEvent> = {
      ...baseProps,
      recurrenceRule: {
        frequency: Frequency.DAILY,
        interval: 1,
        byDay: [WeekDays.MO],
        byMonth: undefined,
        byMonthDay: undefined,
        count: undefined,
        recurrenceEndDate: dayjs().add(1, 'day').toDate(), // different
      },
    };
    expect(
      hasRecurrenceChanged(
        payload as unknown as IEventFormSubmitPayload,
        props as unknown as InterfaceEvent,
      ),
    ).toBe(true);
  });
});

describe('getAvailableUpdateOptions', () => {
  const baseCardProps: MockEventListCardProps = {
    ...mockEventListCardProps,
    isRecurringEventTemplate: false,
    baseEvent: { id: 'base1' },
  };

  const basePayload: Partial<IEventFormSubmitPayload> = {
    name: 'Test Event',
    description: 'Test Description',
    startDate: new Date(baseCardProps.startAt),
    endDate: new Date(baseCardProps.endAt),
    startAtISO: baseCardProps.startAt,
    endAtISO: baseCardProps.endAt,
    allDay: false,
    recurrenceRule: null,
    location: baseCardProps.location,
    isPublic: baseCardProps.isPublic,
    isRegisterable: baseCardProps.isRegisterable,
    isInviteOnly: baseCardProps.isInviteOnly,
  };

  it('allows all options when only name changes (metadata only)', () => {
    const payload: Partial<IEventFormSubmitPayload> = {
      ...basePayload,
      name: 'Changed Name',
    };
    const options = getAvailableUpdateOptions(
      payload as unknown as IEventFormSubmitPayload,
      baseCardProps,
    );
    expect(options).toEqual({
      single: true,
      following: true,
      entireSeries: true,
    });
  });

  it('disallows entireSeries when time changes', () => {
    const payload: Partial<IEventFormSubmitPayload> = {
      ...basePayload,
      startAtISO: dayjs().add(1, 'year').toISOString(), // Changed
    };
    const options = getAvailableUpdateOptions(
      payload as unknown as IEventFormSubmitPayload,
      baseCardProps,
    );
    expect(options).toEqual({
      single: true,
      following: true,
      entireSeries: false,
    });
  });

  it('disallows entireSeries when date changes', () => {
    const payload: Partial<IEventFormSubmitPayload> = {
      ...basePayload,
      startDate: dayjs(baseCardProps.startAt).add(1, 'day').toDate(),
    };
    const options = getAvailableUpdateOptions(
      payload as unknown as IEventFormSubmitPayload,
      baseCardProps,
    );
    expect(options).toEqual({
      single: true,
      following: true,
      entireSeries: false,
    });
  });
});
