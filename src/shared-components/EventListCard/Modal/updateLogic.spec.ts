import { vi, describe, it, expect, beforeEach, Mock } from 'vitest';
import { useUpdateEventHandler } from './updateLogic';
import { renderHook, cleanup } from '@testing-library/react';
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
import { Frequency, InterfaceRecurrenceRule } from 'utils/recurrenceUtils';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

// Mock react-i18next so useTranslation works without React context
vi.mock('react-i18next', async () => {
  const actual = await vi.importActual('react-i18next');
  return {
    ...actual,
    useTranslation: () => ({
      t: mockT,
    }),
  };
});

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
const mockT = (key: string) => key;

type MockEventListCardProps = InterfaceEvent;

const BASE_DATE = dayjs(['2025', '01', '01T10:00:00.000Z'].join('-'));

const mockEventListCardProps: MockEventListCardProps = {
  id: 'event1',
  name: 'Test Event',
  description: 'Test Description',
  location: 'Test Location',
  startAt: BASE_DATE.toISOString(),
  endAt: BASE_DATE.add(2, 'hours').toISOString(),
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
  eventDescription: mockEventListCardProps.description,
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
  allDayChecked: mockEventListCardProps.allDay,
  publicChecked: mockEventListCardProps.isPublic,
  registerableChecked: mockEventListCardProps.isRegisterable,
  inviteOnlyChecked: mockEventListCardProps.isInviteOnly,
  eventStartDate: new Date(
    mockEventListCardProps.startAt ?? dayjs().toISOString(),
  ),
  eventEndDate: new Date(
    mockEventListCardProps.endAt ?? dayjs().add(2, 'hours').toISOString(),
  ),
  recurrence: null as InterfaceRecurrenceRule | null,
  updateOption: 'single',
  hasRecurrenceChanged: false,
  hideViewModal: vi.fn(),
  eventUpdateModalIsOpen: true,
  closeUpdateModal: vi.fn(),
  refetchEvents: vi.fn(),
  ...overrides,
});

const getStandaloneMutationUpdate = () => {
  const standaloneMutationCall = mockUseMutation.mock.calls.find(
    ([mutation]) => mutation === UPDATE_EVENT_MUTATION,
  );

  return standaloneMutationCall?.[1]?.update as
    | ((
        cache: {
          identify: (value: unknown) => string;
          modify: (value: {
            id: string;
            fields: Record<string, () => unknown>;
          }) => void;
        },
        result: {
          data?: {
            updateStandaloneEvent?: Record<string, unknown>;
          };
        },
      ) => void)
    | undefined;
};

describe('useUpdateEventHandler', () => {
  let mockUpdateStandaloneEvent: Mock;
  let mockUpdateSingleRecurringEventInstance: Mock;
  let mockUpdateThisAndFollowingEvents: Mock;
  let mockUpdateEntireRecurringEventSeries: Mock;

  afterEach(() => {
    cleanup();
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
    const { result } = renderHook(() => useUpdateEventHandler());
    const { updateEventHandler } = result.current;
    expect(updateEventHandler).toBeInstanceOf(Function);
  });

  it('calls info toast when no changes are made', async () => {
    const { result } = renderHook(() => useUpdateEventHandler());
    const { updateEventHandler } = result.current;

    const initialStartAt =
      mockEventListCardProps.startAt ?? dayjs(BASE_DATE).toISOString();
    const initialEndAt =
      mockEventListCardProps.endAt ??
      dayjs(BASE_DATE).add(2, 'hours').toISOString();

    const alignedStartAt = dayjs(new Date(initialStartAt))
      .hour(parseInt(mockFormState.startTime.split(':')[0], 10) || 0)
      .minute(parseInt(mockFormState.startTime.split(':')[1], 10) || 0)
      .second(parseInt(mockFormState.startTime.split(':')[2], 10) || 0)
      .millisecond(0)
      .toISOString();
    const alignedEndAt = dayjs(new Date(initialEndAt))
      .hour(parseInt(mockFormState.endTime.split(':')[0], 10) || 0)
      .minute(parseInt(mockFormState.endTime.split(':')[1], 10) || 0)
      .second(parseInt(mockFormState.endTime.split(':')[2], 10) || 0)
      .millisecond(0)
      .toISOString();

    await updateEventHandler(
      buildHandlerInput({
        eventListCardProps: {
          ...mockEventListCardProps,
          startAt: alignedStartAt,
          endAt: alignedEndAt,
        },
        eventStartDate: new Date(alignedStartAt),
        eventEndDate: new Date(alignedEndAt),
      }),
    );

    expect(NotificationToast.info).toHaveBeenCalledWith('noChangesToUpdate');
    expect(mockUpdateStandaloneEvent).not.toHaveBeenCalled();
    expect(mockUpdateSingleRecurringEventInstance).not.toHaveBeenCalled();
    expect(mockUpdateThisAndFollowingEvents).not.toHaveBeenCalled();
    expect(mockUpdateEntireRecurringEventSeries).not.toHaveBeenCalled();
  });

  describe('standalone event updates', () => {
    it('updates Apollo cache fields when mutation returns updateStandaloneEvent', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      renderHook(() => useUpdateEventHandler());

      const update = getStandaloneMutationUpdate();
      expect(update).toBeTypeOf('function');

      const dynamicStartAt = dayjs()
        .add(30, 'days')
        .hour(10)
        .minute(0)
        .second(0);
      const dynamicEndAt = dynamicStartAt.add(2, 'hours');

      const updatedEvent = {
        __typename: 'Event',
        id: 'event1',
        startDate: dynamicStartAt.format('YYYY-MM-DD'),
        endDate: dynamicEndAt.format('YYYY-MM-DD'),
        startAt: dynamicStartAt.toISOString(),
        endAt: dynamicEndAt.toISOString(),
        allDay: false,
        name: 'Updated Event Name',
        description: 'Updated description',
        location: 'Updated location',
        isPublic: false,
        isRegisterable: false,
        isInviteOnly: true,
      };

      const identify = vi.fn(() => 'Event:event1');
      const modify = vi.fn();

      update?.(
        {
          identify,
          modify,
        },
        {
          data: {
            updateStandaloneEvent: updatedEvent,
          },
        },
      );

      expect(identify).toHaveBeenCalledWith(updatedEvent);
      expect(modify).toHaveBeenCalledTimes(1);
      expect(modify).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'Event:event1',
          fields: expect.objectContaining({
            startDate: expect.any(Function),
            endDate: expect.any(Function),
            startAt: expect.any(Function),
            endAt: expect.any(Function),
            allDay: expect.any(Function),
            name: expect.any(Function),
            description: expect.any(Function),
            location: expect.any(Function),
            isPublic: expect.any(Function),
            isRegisterable: expect.any(Function),
            isInviteOnly: expect.any(Function),
          }),
        }),
      );

      const modifierArgs = modify.mock.calls[0][0];
      expect(modifierArgs.fields.startDate()).toBe(updatedEvent.startDate);
      expect(modifierArgs.fields.endDate()).toBe(updatedEvent.endDate);
      expect(modifierArgs.fields.startAt()).toBe(updatedEvent.startAt);
      expect(modifierArgs.fields.endAt()).toBe(updatedEvent.endAt);
      expect(modifierArgs.fields.allDay()).toBe(updatedEvent.allDay);
      expect(modifierArgs.fields.name()).toBe(updatedEvent.name);
      expect(modifierArgs.fields.description()).toBe(updatedEvent.description);
      expect(modifierArgs.fields.location()).toBe(updatedEvent.location);
      expect(modifierArgs.fields.isPublic()).toBe(updatedEvent.isPublic);
      expect(modifierArgs.fields.isRegisterable()).toBe(
        updatedEvent.isRegisterable,
      );
      expect(modifierArgs.fields.isInviteOnly()).toBe(
        updatedEvent.isInviteOnly,
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        'Updating Apollo cache with fresh event data:',
        updatedEvent,
      );
    });

    it('does not modify Apollo cache when updateStandaloneEvent is missing', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      renderHook(() => useUpdateEventHandler());

      const update = getStandaloneMutationUpdate();
      expect(update).toBeTypeOf('function');

      const identify = vi.fn(() => 'Event:event1');
      const modify = vi.fn();

      update?.(
        {
          identify,
          modify,
        },
        { data: {} },
      );

      expect(identify).not.toHaveBeenCalled();
      expect(modify).not.toHaveBeenCalled();
      expect(consoleSpy).not.toHaveBeenCalledWith(
        'Updating Apollo cache with fresh event data:',
        expect.anything(),
      );
    });

    it('logs that cache should be updated when standalone mutation returns fresh event data', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      mockUpdateStandaloneEvent.mockResolvedValueOnce({
        data: {
          updateStandaloneEvent: {
            id: 'event1',
          },
        },
      });

      const { result } = renderHook(() => useUpdateEventHandler());
      const { updateEventHandler } = result.current;

      await updateEventHandler(
        buildHandlerInput({
          formState: {
            ...mockFormState,
            name: 'Changed Name',
          },
        }),
      );

      expect(consoleSpy).toHaveBeenCalledWith(
        'Mutation returned fresh data, cache should be updated',
      );
      consoleSpy.mockRestore();
    });

    it('does not log cache update message when standalone mutation data lacks updateStandaloneEvent', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      mockUpdateStandaloneEvent.mockResolvedValueOnce({
        data: { updateEvent: {} },
      });

      const { result } = renderHook(() => useUpdateEventHandler());
      const { updateEventHandler } = result.current;

      await updateEventHandler(
        buildHandlerInput({
          formState: {
            ...mockFormState,
            name: 'Changed Name',
          },
        }),
      );

      expect(consoleSpy).not.toHaveBeenCalledWith(
        'Mutation returned fresh data, cache should be updated',
      );
      consoleSpy.mockRestore();
    });

    it('handles standalone event update with name change', async () => {
      mockUpdateStandaloneEvent.mockResolvedValueOnce({
        data: { updateEvent: {} },
      });
      const { result } = renderHook(() => useUpdateEventHandler());
      const { updateEventHandler } = result.current;

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
      const { result } = renderHook(() => useUpdateEventHandler());
      const { updateEventHandler } = result.current;

      await updateEventHandler(
        buildHandlerInput({
          formState: {
            ...mockFormState,
            eventDescription: 'Changed Event',
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
      const { result } = renderHook(() => useUpdateEventHandler());
      const { updateEventHandler } = result.current;

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
      const { result } = renderHook(() => useUpdateEventHandler());
      const { updateEventHandler } = result.current;

      await updateEventHandler(
        buildHandlerInput({
          publicChecked: false,
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
      const { result } = renderHook(() => useUpdateEventHandler());
      const { updateEventHandler } = result.current;

      await updateEventHandler(
        buildHandlerInput({
          registerableChecked: false,
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
      const { result } = renderHook(() => useUpdateEventHandler());
      const { updateEventHandler } = result.current;

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

      const { result } = renderHook(() => useUpdateEventHandler());
      const { updateEventHandler } = result.current;

      const hideViewModal = vi.fn();
      const closeUpdateModal = vi.fn();
      const refetchEvents = vi.fn();

      await updateEventHandler(
        buildHandlerInput({
          formState: {
            ...mockFormState,
            name: 'Changed Name',
          },
          hideViewModal,
          closeUpdateModal,
          eventUpdateModalIsOpen: true,
          refetchEvents,
        }),
      );

      expect(mockUpdateStandaloneEvent).toHaveBeenCalledTimes(1);
      expect(NotificationToast.success).toHaveBeenCalledWith('eventUpdated');
      expect(closeUpdateModal).toHaveBeenCalled();
      expect(hideViewModal).toHaveBeenCalled();
      expect(refetchEvents).toHaveBeenCalled();
    });

    it('calls errorHandler when mutation throws', async () => {
      const error = new Error('network');
      mockUpdateStandaloneEvent.mockRejectedValueOnce(error);
      const { result } = renderHook(() => useUpdateEventHandler());
      const { updateEventHandler } = result.current;

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
      const { result } = renderHook(() => useUpdateEventHandler());
      const { updateEventHandler } = result.current;

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
      const { result } = renderHook(() => useUpdateEventHandler());
      const { updateEventHandler } = result.current;

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
      const { result } = renderHook(() => useUpdateEventHandler());
      const { updateEventHandler } = result.current;

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
      const { result } = renderHook(() => useUpdateEventHandler());
      const { updateEventHandler } = result.current;

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
      const { result } = renderHook(() => useUpdateEventHandler());
      const { updateEventHandler } = result.current;

      await updateEventHandler(
        buildHandlerInput({
          eventListCardProps: buildRecurringEventProps(),
          updateOption: 'entireSeries',
          formState: {
            ...mockFormState,
            eventDescription: 'Changed event description',
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
      const { result } = renderHook(() => useUpdateEventHandler());
      const { updateEventHandler } = result.current;

      await updateEventHandler(
        buildHandlerInput({
          eventListCardProps: buildRecurringEventProps(),
          updateOption: 'entireSeries',
          formState: {
            ...mockFormState,
            name: 'Changed Name',
            location: 'New Location',
          },
          publicChecked: false, // Changed from true
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
      const { result } = renderHook(() => useUpdateEventHandler());
      const { updateEventHandler } = result.current;

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
      const { result } = renderHook(() => useUpdateEventHandler());
      const { updateEventHandler } = result.current;

      const newStartDate = BASE_DATE.add(20, 'days').startOf('day').toDate();
      const newEndDate = BASE_DATE.add(21, 'days').startOf('day').toDate();

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
          publicChecked: true,
          registerableChecked: false, // Changed from true
          allDayChecked: true, // Changed from false
          eventStartDate: newStartDate,
          eventEndDate: newEndDate,
        }),
      );

      expect(mockUpdateEntireRecurringEventSeries).toHaveBeenCalledTimes(1);
      const calledInputs =
        mockUpdateEntireRecurringEventSeries.mock.calls[0][0].variables.input;

      expect(calledInputs.isRegisterable).toBe(false);
      expect(calledInputs.allDay).toBe(true);
      // All-day updates propagate date fields
      expect(calledInputs.startDate).toBeDefined();
      expect(calledInputs.endDate).toBeDefined();
    });

    it('propagates timed startAt and endAt when both timestamps change for entire series', async () => {
      mockUpdateEntireRecurringEventSeries.mockResolvedValueOnce({
        data: { updateEvent: {} },
      });
      const { result } = renderHook(() => useUpdateEventHandler());
      const { updateEventHandler } = result.current;

      const nextStartDate = BASE_DATE.add(3, 'days').toDate();
      const nextEndDate = BASE_DATE.add(3, 'days').add(4, 'hours').toDate();

      const nextStartAt = dayjs(nextStartDate)
        .hour(11)
        .minute(30)
        .second(0)
        .millisecond(0)
        .toISOString();
      const nextEndAt = dayjs(nextEndDate)
        .hour(15)
        .minute(0)
        .second(0)
        .millisecond(0)
        .toISOString();

      await updateEventHandler(
        buildHandlerInput({
          eventListCardProps: buildRecurringEventProps({
            allDay: false,
          }),
          updateOption: 'entireSeries',
          formState: {
            ...mockFormState,
            name: 'Changed Name',
            startTime: '11:30:00',
            endTime: '15:00:00',
          },
          allDayChecked: false,
          eventStartDate: nextStartDate,
          eventEndDate: nextEndDate,
        }),
      );

      expect(mockUpdateEntireRecurringEventSeries).toHaveBeenCalledTimes(1);
      const calledInputs =
        mockUpdateEntireRecurringEventSeries.mock.calls[0][0].variables.input;

      expect(calledInputs.startAt).toBe(nextStartAt);
      expect(calledInputs.endAt).toBe(nextEndAt);
    });

    it('propagates only endAt when startAt is unchanged for timed entire series update', async () => {
      mockUpdateEntireRecurringEventSeries.mockResolvedValueOnce({
        data: { updateEvent: {} },
      });
      const { result } = renderHook(() => useUpdateEventHandler());
      const { updateEventHandler } = result.current;

      const sameStartDate = dayjs(mockEventListCardProps.startAt).toDate();
      const changedEndDate = dayjs(mockEventListCardProps.endAt)
        .add(1, 'hours')
        .toDate();

      const changedEndAt = dayjs(changedEndDate)
        .hour(13)
        .minute(0)
        .second(0)
        .millisecond(0)
        .toISOString();

      await updateEventHandler(
        buildHandlerInput({
          eventListCardProps: buildRecurringEventProps({
            allDay: false,
          }),
          updateOption: 'entireSeries',
          formState: {
            ...mockFormState,
            name: 'Changed Name',
            startTime: '10:00:00',
            endTime: '13:00:00',
          },
          allDayChecked: false,
          eventStartDate: sameStartDate,
          eventEndDate: changedEndDate,
        }),
      );

      expect(mockUpdateEntireRecurringEventSeries).toHaveBeenCalledTimes(1);
      const calledInputs =
        mockUpdateEntireRecurringEventSeries.mock.calls[0][0].variables.input;

      expect(calledInputs.startAt).toBeUndefined();
      expect(calledInputs.endAt).toBe(changedEndAt);
    });

    it('sets only endDate when all-day entire series startDate is unchanged but endDate differs', async () => {
      mockUpdateEntireRecurringEventSeries.mockResolvedValueOnce({
        data: { updateEvent: {} },
      });
      const { result } = renderHook(() => useUpdateEventHandler());
      const { updateEventHandler } = result.current;

      const stableStartDate = BASE_DATE.add(25, 'days').startOf('day').toDate();
      const changedEndDate = BASE_DATE.add(26, 'days').startOf('day').toDate();

      await updateEventHandler(
        buildHandlerInput({
          eventListCardProps: buildRecurringEventProps({
            allDay: true,
            startDate: dayjs.utc(stableStartDate).format('YYYY-MM-DD'),
            endDate: dayjs
              .utc(changedEndDate)
              .add(3, 'days')
              .format('YYYY-MM-DD'),
          }),
          updateOption: 'entireSeries',
          formState: {
            ...mockFormState,
            name: 'Changed Name',
          },
          allDayChecked: true,
          eventStartDate: stableStartDate,
          eventEndDate: changedEndDate,
        }),
      );

      expect(mockUpdateEntireRecurringEventSeries).toHaveBeenCalledTimes(1);
      const calledInputs =
        mockUpdateEntireRecurringEventSeries.mock.calls[0][0].variables.input;

      expect(calledInputs.startDate).toBeUndefined();
      expect(calledInputs.endDate).toBe(
        dayjs.utc(changedEndDate).add(1, 'day').format('YYYY-MM-DD'),
      );
    });
  });

  describe('date validation and handling', () => {
    it('updates only endAt when timed standalone startAt is unchanged but endAt differs', async () => {
      mockUpdateStandaloneEvent.mockResolvedValueOnce({
        data: { updateEvent: {} },
      });
      const { result } = renderHook(() => useUpdateEventHandler());
      const { updateEventHandler } = result.current;

      const unchangedStartDate = BASE_DATE.add(5, 'days').toDate();
      const changedEndDate = BASE_DATE.add(5, 'days').add(4, 'hours').toDate();
      const unchangedStartAt = dayjs(unchangedStartDate)
        .hour(10)
        .minute(0)
        .second(0)
        .millisecond(0)
        .toISOString();
      const changedEndAt = dayjs(changedEndDate)
        .hour(14)
        .minute(30)
        .second(0)
        .millisecond(0)
        .toISOString();

      await updateEventHandler(
        buildHandlerInput({
          eventListCardProps: {
            ...mockEventListCardProps,
            allDay: false,
            startAt: unchangedStartAt,
            endAt: dayjs(changedEndDate)
              .hour(12)
              .minute(0)
              .second(0)
              .millisecond(0)
              .toISOString(),
          },
          formState: {
            ...mockFormState,
            name: 'Changed Name',
            startTime: '10:00:00',
            endTime: '14:30:00',
          },
          allDayChecked: false,
          eventStartDate: unchangedStartDate,
          eventEndDate: changedEndDate,
        }),
      );

      expect(mockUpdateStandaloneEvent).toHaveBeenCalledTimes(1);
      const calledInputs =
        mockUpdateStandaloneEvent.mock.calls[0][0].variables.input;

      expect(calledInputs.startAt).toBeUndefined();
      expect(calledInputs.endAt).toBe(changedEndAt);
    });

    it('uses startDate/endDate template originals when existing event is all-day with date fields', async () => {
      mockUpdateStandaloneEvent.mockResolvedValueOnce({
        data: { updateEvent: {} },
      });
      const { result } = renderHook(() => useUpdateEventHandler());
      const { updateEventHandler } = result.current;

      const nextStartDate = BASE_DATE.add(30, 'days').toDate();
      const nextEndDate = BASE_DATE.add(31, 'days').toDate();

      await updateEventHandler(
        buildHandlerInput({
          eventListCardProps: {
            ...mockEventListCardProps,
            allDay: true,
            startDate: dayjs(nextStartDate).format('YYYY-MM-DD'),
            endDate: dayjs(nextEndDate).format('YYYY-MM-DD'),
            startAt: null,
            endAt: null,
          },
          formState: {
            ...mockFormState,
            name: 'Changed Name',
            startTime: '09:00:00',
            endTime: '17:00:00',
          },
          allDayChecked: false,
          eventStartDate: nextStartDate,
          eventEndDate: nextEndDate,
        }),
      );

      expect(mockUpdateStandaloneEvent).toHaveBeenCalledTimes(1);
      const calledInputs =
        mockUpdateStandaloneEvent.mock.calls[0][0].variables.input;

      expect(calledInputs.startAt).toBe(
        dayjs(nextStartDate)
          .hour(9)
          .minute(0)
          .second(0)
          .millisecond(0)
          .toISOString(),
      );
      expect(calledInputs.endAt).toBe(
        dayjs(nextEndDate)
          .hour(17)
          .minute(0)
          .second(0)
          .millisecond(0)
          .toISOString(),
      );
    });

    it('falls back to hour 0 when startTime/endTime hour segments are invalid', async () => {
      mockUpdateStandaloneEvent.mockResolvedValueOnce({
        data: { updateEvent: {} },
      });
      const { result } = renderHook(() => useUpdateEventHandler());
      const { updateEventHandler } = result.current;

      const targetStartDate = BASE_DATE.add(7, 'days').toDate();
      const targetEndDate = BASE_DATE.add(7, 'days').add(1, 'hours').toDate();

      await updateEventHandler(
        buildHandlerInput({
          formState: {
            ...mockFormState,
            name: 'Changed Name',
            startTime: 'invalid:30:00',
            endTime: 'oops:45:00',
          },
          allDayChecked: false,
          eventStartDate: targetStartDate,
          eventEndDate: targetEndDate,
        }),
      );

      expect(mockUpdateStandaloneEvent).toHaveBeenCalledTimes(1);
      const calledInputs =
        mockUpdateStandaloneEvent.mock.calls[0][0].variables.input;

      expect(calledInputs.startAt).toBe(
        dayjs(targetStartDate)
          .hour(0)
          .minute(30)
          .second(0)
          .millisecond(0)
          .toISOString(),
      );
      expect(calledInputs.endAt).toBe(
        dayjs(targetEndDate)
          .hour(0)
          .minute(45)
          .second(0)
          .millisecond(0)
          .toISOString(),
      );
    });

    it('uses empty-string original start/end fallbacks when non-all-day event has null timestamps', async () => {
      mockUpdateStandaloneEvent.mockResolvedValueOnce({
        data: { updateEvent: {} },
      });
      const { result } = renderHook(() => useUpdateEventHandler());
      const { updateEventHandler } = result.current;

      const fallbackStartDate = BASE_DATE.add(9, 'days').toDate();
      const fallbackEndDate = BASE_DATE.add(9, 'days').add(2, 'hours').toDate();

      await updateEventHandler(
        buildHandlerInput({
          eventListCardProps: {
            ...mockEventListCardProps,
            allDay: false,
            startAt: null,
            endAt: null,
          },
          formState: {
            ...mockFormState,
            name: 'Changed Name',
            startTime: '09:15:00',
            endTime: '11:45:00',
          },
          allDayChecked: false,
          eventStartDate: fallbackStartDate,
          eventEndDate: fallbackEndDate,
        }),
      );

      expect(mockUpdateStandaloneEvent).toHaveBeenCalledTimes(1);
      const calledInputs =
        mockUpdateStandaloneEvent.mock.calls[0][0].variables.input;

      expect(calledInputs.startAt).toBe(
        dayjs(fallbackStartDate)
          .hour(9)
          .minute(15)
          .second(0)
          .millisecond(0)
          .toISOString(),
      );
      expect(calledInputs.endAt).toBe(
        dayjs(fallbackEndDate)
          .hour(11)
          .minute(45)
          .second(0)
          .millisecond(0)
          .toISOString(),
      );
    });

    it('sets only endDate when all-day startDate is unchanged but endDate differs', async () => {
      mockUpdateStandaloneEvent.mockResolvedValueOnce({
        data: { updateEvent: {} },
      });
      const { result } = renderHook(() => useUpdateEventHandler());
      const { updateEventHandler } = result.current;

      const sameStartDate = BASE_DATE.add(15, 'days').startOf('day').toDate();
      const changedEndDate = BASE_DATE.add(16, 'days').startOf('day').toDate();
      const unchangedStartDateText = dayjs(sameStartDate).format('YYYY-MM-DD');

      await updateEventHandler(
        buildHandlerInput({
          eventListCardProps: {
            ...mockEventListCardProps,
            allDay: false,
            startDate: unchangedStartDateText,
            endDate: dayjs(changedEndDate).add(2, 'days').format('YYYY-MM-DD'),
          },
          formState: {
            ...mockFormState,
            name: 'Changed Name',
          },
          allDayChecked: true,
          eventStartDate: sameStartDate,
          eventEndDate: changedEndDate,
        }),
      );

      expect(mockUpdateStandaloneEvent).toHaveBeenCalledTimes(1);
      const calledInputs =
        mockUpdateStandaloneEvent.mock.calls[0][0].variables.input;

      expect(calledInputs.startDate).toBeUndefined();
      expect(calledInputs.endDate).toBe(
        dayjs(changedEndDate).add(1, 'day').format('YYYY-MM-DD'),
      );
    });

    it('shows invalidDate toast and returns when all-day updateInput date fields are empty strings', async () => {
      const formatSpy = vi
        .spyOn(Object.getPrototypeOf(dayjs()), 'format')
        .mockReturnValueOnce('')
        .mockReturnValueOnce('');

      const { result } = renderHook(() => useUpdateEventHandler());
      const { updateEventHandler } = result.current;

      await updateEventHandler(
        buildHandlerInput({
          formState: {
            ...mockFormState,
            name: 'Changed Name',
          },
          allDayChecked: true,
          eventStartDate: BASE_DATE.add(12, 'days').startOf('day').toDate(),
          eventEndDate: BASE_DATE.add(13, 'days').startOf('day').toDate(),
        }),
      );

      expect(NotificationToast.error).toHaveBeenCalledWith('invalidDate');
      expect(mockUpdateStandaloneEvent).not.toHaveBeenCalled();
      formatSpy.mockRestore();
    });

    it('computes all-day startAt and endAt correctly', async () => {
      mockUpdateStandaloneEvent.mockResolvedValueOnce({
        data: { updateEvent: {} },
      });
      const { result } = renderHook(() => useUpdateEventHandler());
      const { updateEventHandler } = result.current;

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
          allDayChecked: true,
          eventStartDate: BASE_DATE.add(10, 'days').startOf('day').toDate(),
          eventEndDate: BASE_DATE.add(11, 'days').startOf('day').toDate(),
        }),
      );

      expect(mockUpdateStandaloneEvent).toHaveBeenCalledTimes(1);
      const calledInputs =
        mockUpdateStandaloneEvent.mock.calls[0][0].variables.input;
      expect(calledInputs.startDate).toBe(
        BASE_DATE.add(10, 'days').format('YYYY-MM-DD'),
      );
      // End date is exclusive for all-day events (+1 day)
      expect(calledInputs.endDate).toBe(
        BASE_DATE.add(12, 'days').format('YYYY-MM-DD'),
      );
      expect(NotificationToast.success).toHaveBeenCalledWith('eventUpdated');
    });

    it('handles standalone event update with allDay change only', async () => {
      mockUpdateStandaloneEvent.mockResolvedValueOnce({
        data: { updateEvent: {} },
      });
      const { result } = renderHook(() => useUpdateEventHandler());
      const { updateEventHandler } = result.current;

      await updateEventHandler(
        buildHandlerInput({
          allDayChecked: true, // Changed from false
        }),
      );

      expect(mockUpdateStandaloneEvent).toHaveBeenCalledTimes(1);
      const calledInputs =
        mockUpdateStandaloneEvent.mock.calls[0][0].variables.input;
      expect(calledInputs.allDay).toBe(true);
    });

    it('shows error toast when computed dates are invalid', async () => {
      const { result } = renderHook(() => useUpdateEventHandler());
      const { updateEventHandler } = result.current;

      await updateEventHandler(
        buildHandlerInput({
          eventStartDate: new Date('invalid'),
          eventEndDate: new Date('invalid'),
        }),
      );

      expect(NotificationToast.error).toHaveBeenCalledWith('invalidDate');
      expect(mockUpdateStandaloneEvent).not.toHaveBeenCalled();
    });

    it('shows error toast and does not mutate when all-day eventStartDate is invalid', async () => {
      const { result } = renderHook(() => useUpdateEventHandler());
      const { updateEventHandler } = result.current;

      await updateEventHandler(
        buildHandlerInput({
          allDayChecked: true,
          eventStartDate: new Date('invalid'),
          eventEndDate: BASE_DATE.add(11, 'days').startOf('day').toDate(),
          formState: {
            ...mockFormState,
            name: 'Changed Name',
          },
        }),
      );

      expect(NotificationToast.error).toHaveBeenCalledWith('invalidDate');
      expect(mockUpdateStandaloneEvent).not.toHaveBeenCalled();
    });

    it('shows error toast and does not mutate when all-day eventEndDate is invalid', async () => {
      const { result } = renderHook(() => useUpdateEventHandler());
      const { updateEventHandler } = result.current;

      await updateEventHandler(
        buildHandlerInput({
          allDayChecked: true,
          eventStartDate: BASE_DATE.add(10, 'days').startOf('day').toDate(),
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
      const { result } = renderHook(() => useUpdateEventHandler());
      const { updateEventHandler } = result.current;

      await updateEventHandler(
        buildHandlerInput({
          eventListCardProps: {
            ...mockEventListCardProps,
            allDay: true,
            startAt: 'invalid-date',
            endAt: BASE_DATE.add(2, 'hours').toISOString(),
          },
          allDayChecked: true,
          eventStartDate: BASE_DATE.add(10, 'days').startOf('day').toDate(),
          eventEndDate: BASE_DATE.add(11, 'days').startOf('day').toDate(),
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
      const { result } = renderHook(() => useUpdateEventHandler());
      const { updateEventHandler } = result.current;

      await updateEventHandler(
        buildHandlerInput({
          eventListCardProps: {
            ...mockEventListCardProps,
            allDay: true,
            startAt: BASE_DATE.toISOString(),
            endAt: 'invalid-date',
          },
          allDayChecked: true,
          eventStartDate: BASE_DATE.add(10, 'days').startOf('day').toDate(),
          eventEndDate: BASE_DATE.add(11, 'days').startOf('day').toDate(),
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
      const { result } = renderHook(() => useUpdateEventHandler());
      const { updateEventHandler } = result.current;

      await updateEventHandler(
        buildHandlerInput({
          eventListCardProps: {
            ...mockEventListCardProps,
            allDay: false,
            startAt: BASE_DATE.toISOString(),
            endAt: BASE_DATE.add(2, 'hours').toISOString(),
            startTime: 'invalid-time',
            endTime: '12:00:00',
          },
          allDayChecked: false,
          eventStartDate: dayjs(BASE_DATE)
            .add(10, 'days')
            .hour(11)
            .minute(0)
            .second(0)
            .toDate(),
          eventEndDate: dayjs(BASE_DATE)
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
      const { result } = renderHook(() => useUpdateEventHandler());
      const { updateEventHandler } = result.current;

      await updateEventHandler(
        buildHandlerInput({
          eventListCardProps: {
            ...mockEventListCardProps,
            allDay: false,
            startAt: BASE_DATE.toISOString(),
            endAt: BASE_DATE.add(2, 'hours').toISOString(),
            startTime: '10:00:00',
            endTime: 'invalid-time',
          },
          allDayChecked: false,
          eventStartDate: dayjs(BASE_DATE)
            .add(10, 'days')
            .hour(10)
            .minute(0)
            .second(0)
            .toDate(),
          eventEndDate: dayjs(BASE_DATE)
            .add(10, 'days')
            .hour(14)
            .minute(0)
            .second(0)
            .toDate(),
          formState: {
            ...mockFormState,
            name: 'Changed Name',
            startTime: '10:00:00',
            endTime: '14:00:00',
          },
        }),
      );

      expect(mockUpdateStandaloneEvent).toHaveBeenCalledTimes(1);
      expect(NotificationToast.success).toHaveBeenCalledWith('eventUpdated');
    });
  });

  describe('edge cases', () => {
    it('does not show success toast or close modals when data is falsy', async () => {
      mockUpdateStandaloneEvent.mockResolvedValueOnce({
        data: null,
      });

      const { result } = renderHook(() => useUpdateEventHandler());
      const { updateEventHandler } = result.current;

      const hideViewModal = vi.fn();
      const closeUpdateModal = vi.fn();
      const refetchEvents = vi.fn();

      await updateEventHandler(
        buildHandlerInput({
          formState: {
            ...mockFormState,
            name: 'Changed Name',
          },
          hideViewModal,
          closeUpdateModal,
          refetchEvents,
        }),
      );

      expect(mockUpdateStandaloneEvent).toHaveBeenCalledTimes(1);
      expect(NotificationToast.success).not.toHaveBeenCalled();
      expect(closeUpdateModal).not.toHaveBeenCalled();
      expect(hideViewModal).not.toHaveBeenCalled();
      expect(refetchEvents).not.toHaveBeenCalled();
    });

    it('does not call refetchEvents when it is not provided', async () => {
      mockUpdateStandaloneEvent.mockResolvedValueOnce({
        data: { updateEvent: {} },
      });

      const { result } = renderHook(() => useUpdateEventHandler());
      const { updateEventHandler } = result.current;

      const hideViewModal = vi.fn();
      const closeUpdateModal = vi.fn();

      await updateEventHandler(
        buildHandlerInput({
          formState: {
            ...mockFormState,
            name: 'Changed Name',
          },
          hideViewModal,
          closeUpdateModal,
          eventUpdateModalIsOpen: true,
          refetchEvents: undefined,
        }),
      );

      expect(mockUpdateStandaloneEvent).toHaveBeenCalledTimes(1);
      expect(NotificationToast.success).toHaveBeenCalledWith('eventUpdated');
      expect(closeUpdateModal).toHaveBeenCalled();
      expect(hideViewModal).toHaveBeenCalled();
    });
  });
});
