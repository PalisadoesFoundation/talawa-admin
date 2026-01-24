import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { describe, test, expect, vi, beforeEach, Mock } from 'vitest';
import { useMutation } from '@apollo/client';
import { useNavigate, useParams } from 'react-router';
import useLocalStorage from 'utils/useLocalstorage';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

import EventListCardModals from './EventListCardModals';
import EventListCardPreviewModal from './Preview/EventListCardPreviewModal';
import EventListCardDeleteModal from './Delete/EventListCardDeleteModal';
import type { InterfaceEvent } from 'types/Event/interface';
import { UserRole } from 'types/Event/interface';
import {
  DELETE_ENTIRE_RECURRING_EVENT_SERIES_MUTATION,
  DELETE_SINGLE_EVENT_INSTANCE_MUTATION,
  DELETE_STANDALONE_EVENT_MUTATION,
  DELETE_THIS_AND_FOLLOWING_EVENTS_MUTATION,
  REGISTER_EVENT,
  UPDATE_EVENT_MUTATION,
  UPDATE_SINGLE_RECURRING_EVENT_INSTANCE_MUTATION,
  UPDATE_THIS_AND_FOLLOWING_EVENTS_MUTATION,
  UPDATE_ENTIRE_RECURRING_EVENT_SERIES_MUTATION,
} from 'GraphQl/Mutations/EventMutations';
import type { IEventFormSubmitPayload } from 'types/EventForm/interface';
import type { InterfaceRecurrenceRule } from 'utils/recurrenceUtils';

// Mock dependencies
vi.mock('@apollo/client', async () => {
  const actual = await vi.importActual('@apollo/client');
  return {
    ...actual,
    useMutation: vi.fn(),
  };
});
vi.mock('react-router', () => ({
  useNavigate: vi.fn(),
  useParams: vi.fn(),
}));
vi.mock('utils/useLocalstorage', () => ({
  default: vi.fn(),
}));
vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  },
}));
vi.mock('utils/errorHandler', () => ({
  errorHandler: vi.fn(),
}));
vi.mock('./Preview/EventListCardPreviewModal', () => ({
  default: vi.fn(),
}));
vi.mock('./Delete/EventListCardDeleteModal', () => ({
  default: vi.fn(),
}));

const mockUseMutation = useMutation as Mock;
const mockUseNavigate = useNavigate as Mock;
const mockUseParams = useParams as Mock;
const mockUseLocalStorage = useLocalStorage as Mock;
const MockPreviewModal = EventListCardPreviewModal as Mock;
const MockDeleteModal = EventListCardDeleteModal as Mock;

const mockT = (key: string) => key;

type MockEventListCardProps = InterfaceEvent & {
  refetchEvents?: Mock;
};

const mockEventListCardProps: MockEventListCardProps = {
  id: 'event1',
  name: 'Test Event',
  description: 'Test Description',
  location: 'Test Location',
  startAt: dayjs.utc().add(10, 'days').millisecond(0).toISOString(),
  endAt: dayjs
    .utc()
    .add(10, 'days')
    .add(2, 'hours')
    .millisecond(0)
    .toISOString(),
  startTime: '10:00:00',
  endTime: '12:00:00',
  allDay: false,
  isPublic: true,
  isRegisterable: true,
  isInviteOnly: false,
  attendees: [],
  creator: { id: 'user1', name: 'User 1', emailAddress: 'user1@example.com' },
  userRole: UserRole.ADMINISTRATOR,
  isRecurringEventTemplate: false,
  baseEvent: null,
  recurrenceRule: null,
  recurrenceDescription: null,
  refetchEvents: vi.fn() as Mock,
};

const buildRecurringEventProps = (
  overrides: Partial<MockEventListCardProps> = {},
): MockEventListCardProps => ({
  ...mockEventListCardProps,
  isRecurringEventTemplate: false,
  baseEvent: { id: 'baseEvent1' },
  ...overrides,
});

describe('EventListCardModals', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  let mockUpdateStandaloneEvent: Mock;
  let mockUpdateSingleRecurringEvent: Mock;
  let mockUpdateFollowingRecurringEvent: Mock;
  let mockUpdateEntireRecurringEventSeries: Mock;
  let mockDeleteStandaloneEvent: Mock;
  let mockDeleteSingleInstance: Mock;
  let mockDeleteThisAndFollowing: Mock;
  let mockDeleteEntireSeries: Mock;
  let mockRegisterEvent: Mock;
  let mockNavigate: Mock;

  beforeEach(() => {
    vi.clearAllMocks();

    mockUpdateStandaloneEvent = vi
      .fn()
      .mockResolvedValue({ data: { updateStandaloneEvent: {} } });
    mockUpdateSingleRecurringEvent = vi
      .fn()
      .mockResolvedValue({ data: { updateSingleRecurringEventInstance: {} } });
    mockUpdateFollowingRecurringEvent = vi
      .fn()
      .mockResolvedValue({ data: { updateThisAndFollowingEvents: {} } });
    mockUpdateEntireRecurringEventSeries = vi
      .fn()
      .mockResolvedValue({ data: { updateEntireRecurringEventSeries: {} } });
    mockDeleteStandaloneEvent = vi
      .fn()
      .mockResolvedValue({ data: { deleteStandaloneEvent: {} } });
    mockDeleteSingleInstance = vi
      .fn()
      .mockResolvedValue({ data: { deleteSingleEventInstance: {} } });
    mockDeleteThisAndFollowing = vi
      .fn()
      .mockResolvedValue({ data: { deleteThisAndFollowingEvents: {} } });
    mockDeleteEntireSeries = vi
      .fn()
      .mockResolvedValue({ data: { deleteEntireRecurringEventSeries: {} } });
    mockRegisterEvent = vi
      .fn()
      .mockResolvedValue({ data: { registerEvent: {} } });
    mockNavigate = vi.fn();

    mockUseMutation.mockImplementation((mutation) => {
      if (mutation === UPDATE_EVENT_MUTATION)
        return [mockUpdateStandaloneEvent, { loading: false }];
      if (mutation === UPDATE_SINGLE_RECURRING_EVENT_INSTANCE_MUTATION)
        return [mockUpdateSingleRecurringEvent, { loading: false }];
      if (mutation === UPDATE_THIS_AND_FOLLOWING_EVENTS_MUTATION)
        return [mockUpdateFollowingRecurringEvent, { loading: false }];
      if (mutation === UPDATE_ENTIRE_RECURRING_EVENT_SERIES_MUTATION)
        return [mockUpdateEntireRecurringEventSeries, { loading: false }];
      if (mutation === DELETE_STANDALONE_EVENT_MUTATION)
        return [mockDeleteStandaloneEvent, { loading: false }];
      if (mutation === DELETE_SINGLE_EVENT_INSTANCE_MUTATION)
        return [mockDeleteSingleInstance, { loading: false }];
      if (mutation === DELETE_THIS_AND_FOLLOWING_EVENTS_MUTATION)
        return [mockDeleteThisAndFollowing, { loading: false }];
      if (mutation === DELETE_ENTIRE_RECURRING_EVENT_SERIES_MUTATION)
        return [mockDeleteEntireSeries, { loading: false }];
      if (mutation === REGISTER_EVENT)
        return [mockRegisterEvent, { loading: false }];
      return [vi.fn().mockResolvedValue({ data: {} }), { loading: false }];
    });
    mockUseNavigate.mockReturnValue(mockNavigate);
    mockUseParams.mockReturnValue({ orgId: 'org1' });
    mockUseLocalStorage.mockReturnValue({
      getItem: (key: string) => (key === 'userId' ? 'user1' : null),
    });

    MockPreviewModal.mockImplementation(() => null);
    MockDeleteModal.mockImplementation(() => null);
  });

  const renderComponent = (props = {}) => {
    const finalProps = {
      eventListCardProps: mockEventListCardProps,
      eventModalIsOpen: true,
      hideViewModal: vi.fn(),
      t: mockT,
      tCommon: mockT,
      ...props,
    };
    return render(
      <MockedProvider>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <EventListCardModals {...finalProps} />
          </I18nextProvider>
        </Provider>
      </MockedProvider>,
    );
  };

  test('initializes and renders preview modal with correct props', () => {
    renderComponent();
    expect(MockPreviewModal).toHaveBeenCalled();
    const previewProps = MockPreviewModal.mock.calls[0][0];
    expect(previewProps.eventListCardProps.name).toBe('Test Event');
    expect(previewProps.userId).toBe('user1');
  });

  test('handles standalone event update via onFormSubmit', async () => {
    renderComponent();
    const previewProps = MockPreviewModal.mock.calls[0][0];

    const payload: IEventFormSubmitPayload = {
      name: 'Updated Event',
      description: 'Test Description',
      location: 'Test Location',
      startDate: dayjs.utc().toDate(),
      endDate: dayjs.utc().add(1, 'hour').toDate(),
      startAtISO: mockEventListCardProps.startAt,
      endAtISO: mockEventListCardProps.endAt,
      allDay: false,
      isPublic: true,
      isRegisterable: true,
      isInviteOnly: false,
      recurrenceRule: null,
      createChat: false,
    };

    await act(async () => {
      await previewProps.onFormSubmit(payload);
    });

    expect(mockUpdateStandaloneEvent).toHaveBeenCalledWith({
      variables: {
        input: expect.objectContaining({
          id: 'event1',
          name: 'Updated Event',
        }),
      },
    });
    expect(NotificationToast.success).toHaveBeenCalledWith('eventUpdated');
  });

  test('handles recurring event update (single instance)', async () => {
    renderComponent({ eventListCardProps: buildRecurringEventProps() });
    const previewProps = MockPreviewModal.mock.calls[0][0];

    const payload: IEventFormSubmitPayload = {
      name: 'Updated Instance',
      description: 'Test Description',
      location: 'Test Location',
      startDate: dayjs.utc().toDate(),
      endDate: dayjs.utc().add(1, 'hour').toDate(),
      startAtISO: mockEventListCardProps.startAt,
      endAtISO: mockEventListCardProps.endAt,
      allDay: false,
      isPublic: true,
      isRegisterable: true,
      isInviteOnly: false,
      recurrenceRule: null,
      createChat: false,
    };

    // Submitting form should open confirmation modal for recurring events
    await act(async () => {
      await previewProps.onFormSubmit(payload);
    });

    expect(screen.getByText('updateRecurringEventMsg')).toBeInTheDocument();

    const confirmButton = screen.getByTestId('confirmUpdateEventBtn');
    await userEvent.click(confirmButton);

    expect(mockUpdateStandaloneEvent).not.toHaveBeenCalled();
    expect(mockUpdateSingleRecurringEvent).toHaveBeenCalledWith({
      variables: {
        input: expect.objectContaining({
          id: 'event1',
          name: 'Updated Instance',
        }),
      },
    });
    expect(NotificationToast.success).toHaveBeenCalledWith('eventUpdated');
  });

  test('handles event registration', async () => {
    renderComponent();
    const previewProps = MockPreviewModal.mock.calls[0][0];

    await act(async () => {
      await previewProps.registerEventHandler();
    });

    expect(mockRegisterEvent).toHaveBeenCalledWith({
      variables: { id: 'event1' },
    });
    expect(NotificationToast.success).toHaveBeenCalledWith(
      'registeredSuccessfully',
    );
  });

  test('navigates to event dashboard', () => {
    renderComponent();
    const previewProps = MockPreviewModal.mock.calls[0][0];

    act(() => {
      previewProps.openEventDashboard();
    });

    expect(mockNavigate).toHaveBeenCalledWith('/admin/event/org1/event1');
  });

  test('toggles delete modal', () => {
    renderComponent();
    const previewProps = MockPreviewModal.mock.calls[0][0];

    // Initially, delete modal should be closed
    expect(MockDeleteModal.mock.calls[0][0].eventDeleteModalIsOpen).toBe(false);

    act(() => {
      previewProps.toggleDeleteModal();
    });

    // After toggling, delete modal should be open
    // The component re-renders, so we check the latest call to MockDeleteModal
    expect(MockDeleteModal.mock.calls[1][0].eventDeleteModalIsOpen).toBe(true);
  });

  test('opens and closes update modal for recurring events', async () => {
    renderComponent({
      eventListCardProps: buildRecurringEventProps(),
    });

    const previewProps = MockPreviewModal.mock.calls[0][0];

    const payload: IEventFormSubmitPayload = {
      name: 'Updated Instance',
      description: 'Test Description',
      location: 'Test Location',
      startDate: dayjs.utc().toDate(),
      endDate: dayjs.utc().add(1, 'hour').toDate(),
      startAtISO: mockEventListCardProps.startAt,
      endAtISO: mockEventListCardProps.endAt,
      allDay: false,
      isPublic: true,
      isRegisterable: true,
      isInviteOnly: false,
      recurrenceRule: null,
      createChat: false,
    };

    // This should open the modal
    await act(async () => {
      await previewProps.onFormSubmit(payload);
    });

    expect(screen.getByText('updateRecurringEventMsg')).toBeInTheDocument();

    // Default option is usually single
    const confirmButton = screen.getByTestId('confirmUpdateEventBtn');
    await userEvent.click(confirmButton);

    expect(mockUpdateSingleRecurringEvent).toHaveBeenCalledWith({
      variables: {
        input: expect.objectContaining({
          id: 'event1',
          name: 'Updated Instance',
        }),
      },
    });
  });

  test('allows selection of "entire series" if only metadata changed', async () => {
    renderComponent({ eventListCardProps: buildRecurringEventProps() });
    const previewProps = MockPreviewModal.mock.calls[0][0];

    // Change only Name
    const payload: IEventFormSubmitPayload = {
      name: 'Updated Series Name',
      description: 'Test Description',
      location: 'Test Location',
      startDate: dayjs.utc().toDate(),
      endDate: dayjs.utc().add(1, 'hour').toDate(),
      startAtISO: mockEventListCardProps.startAt,
      endAtISO: mockEventListCardProps.endAt,
      allDay: false,
      isPublic: true,
      isRegisterable: true,
      isInviteOnly: false,
      recurrenceRule: null,
      createChat: false,
    };

    await act(async () => {
      await previewProps.onFormSubmit(payload);
    });

    // entireSeries should be option
    const entireSeriesRadio = screen.getByLabelText('updateEntireSeries');
    expect(entireSeriesRadio).not.toBeDisabled();
    await userEvent.click(entireSeriesRadio);

    const confirmButton = screen.getByTestId('confirmUpdateEventBtn');
    await userEvent.click(confirmButton);

    expect(mockUpdateEntireRecurringEventSeries).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: {
          input: expect.objectContaining({
            id: 'event1',
          }),
        },
      }),
    );
  });

  test('does not allow "entire series" if start/end times changed', async () => {
    renderComponent({ eventListCardProps: buildRecurringEventProps() });
    const previewProps = MockPreviewModal.mock.calls[0][0];

    // Change start and end times
    const newStartTime = dayjs
      .utc()
      .add(11, 'days')
      .millisecond(0)
      .toISOString();
    const newEndTime = dayjs
      .utc()
      .add(11, 'days')
      .add(3, 'hours')
      .millisecond(0)
      .toISOString();

    const payload: IEventFormSubmitPayload = {
      name: 'Test Event',
      description: 'Test Description',
      location: 'Test Location',
      startDate: dayjs.utc(newStartTime).toDate(),
      endDate: dayjs.utc(newEndTime).toDate(),
      startAtISO: newStartTime,
      endAtISO: newEndTime,
      allDay: false,
      isPublic: true,
      isRegisterable: true,
      isInviteOnly: false,
      recurrenceRule: null,
      createChat: false,
    };

    await act(async () => {
      await previewProps.onFormSubmit(payload);
    });

    // entireSeries option should not be available
    const entireSeriesRadio = screen.queryByLabelText('updateEntireSeries');
    expect(entireSeriesRadio).not.toBeInTheDocument();

    // Confirm button should trigger single or following update, not entire series
    const confirmButton = screen.getByTestId('confirmUpdateEventBtn');
    await userEvent.click(confirmButton);

    expect(mockUpdateEntireRecurringEventSeries).not.toHaveBeenCalled();
  });

  test('does not allow "entire series" if recurrence changed', async () => {
    // Mock with initial recurrence
    const props = buildRecurringEventProps({
      recurrenceRule: {
        frequency: 'DAILY',
        interval: 1,
      } as unknown as InterfaceRecurrenceRule,
    });
    renderComponent({ eventListCardProps: props });
    const previewProps = MockPreviewModal.mock.calls[0][0];

    // Payload with CHANGED recurrence
    const payload: IEventFormSubmitPayload = {
      name: 'Updated Recurrence',
      description: 'Test Description',
      location: 'Test Location',
      startDate: dayjs.utc().toDate(),
      endDate: dayjs.utc().add(1, 'hour').toDate(),
      startAtISO: mockEventListCardProps.startAt,
      endAtISO: mockEventListCardProps.endAt,
      allDay: false,
      isPublic: true,
      isRegisterable: true,
      isInviteOnly: false,
      recurrenceRule: {
        frequency: 'WEEKLY',
        interval: 1,
      } as unknown as InterfaceRecurrenceRule,
      createChat: false,
    };

    await act(async () => {
      await previewProps.onFormSubmit(payload);
    });

    // Should default to Following
    // Single should be disabled? My logic: single: !recurrenceChanged. So single is disabled.
    // Following: true.
    // EntireSeries: onlyNameOrDescChanged (false because recurrence changed).

    const singleRadio = screen.queryByLabelText('updateThisInstance');
    const followingRadio = screen.getByLabelText('updateThisAndFollowing');
    const seriesRadio = screen.queryByLabelText('updateEntireSeries');

    expect(singleRadio).not.toBeInTheDocument();
    expect(followingRadio).toBeChecked();
    expect(seriesRadio).not.toBeInTheDocument();

    // Confirming should trigger following update
    const confirmButton = screen.getByTestId('confirmUpdateEventBtn');
    await userEvent.click(confirmButton);

    expect(mockUpdateFollowingRecurringEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: {
          input: expect.objectContaining({
            id: 'event1',
            recurrence: expect.objectContaining({
              frequency: 'WEEKLY',
            }),
          }),
        },
      }),
    );
  });

  test('handles delete modal toggle', async () => {
    renderComponent();
    const previewProps = MockPreviewModal.mock.calls[0][0];

    // Initially, delete modal should be closed
    const lastCall = MockDeleteModal.mock.lastCall;
    expect(lastCall).toBeDefined();
    if (lastCall) {
      expect(lastCall[0].eventDeleteModalIsOpen).toBe(false);
    }

    act(() => {
      previewProps.toggleDeleteModal();
    });

    await waitFor(() => {
      const lastCall = MockDeleteModal.mock.lastCall;
      expect(lastCall).toBeDefined();
      if (lastCall) {
        expect(lastCall[0].eventDeleteModalIsOpen).toBe(true);
      }
    });
  });

  test('detects recurrence added (null to exists)', async () => {
    renderComponent({
      eventListCardProps: buildRecurringEventProps({ recurrenceRule: null }),
    });
    const previewProps = MockPreviewModal.mock.calls[0][0];

    const payload: IEventFormSubmitPayload = {
      name: 'Test Event',
      description: 'Desc',
      location: 'Loc',
      startDate: dayjs.utc().toDate(),
      endDate: dayjs.utc().add(1, 'hour').toDate(),
      startAtISO: mockEventListCardProps.startAt,
      endAtISO: mockEventListCardProps.endAt,
      allDay: false,
      isPublic: true,
      isRegisterable: true,
      isInviteOnly: false,
      createChat: false,
      recurrenceRule: {
        frequency: 'DAILY',
        interval: 1,
      } as unknown as InterfaceRecurrenceRule,
    };

    await act(async () => {
      await previewProps.onFormSubmit(payload);
    });

    const followingRadio = screen.getByLabelText('updateThisAndFollowing');
    expect(followingRadio).toBeChecked();
  });

  test('detects recurrence removed (exists to null)', async () => {
    const props = buildRecurringEventProps({
      recurrenceRule: {
        frequency: 'DAILY',
        interval: 1,
      } as unknown as InterfaceRecurrenceRule,
    });
    renderComponent({ eventListCardProps: props });
    const previewProps = MockPreviewModal.mock.calls[0][0];

    const payload: IEventFormSubmitPayload = {
      name: 'Test Event',
      description: 'Desc',
      location: 'Loc',
      startDate: dayjs.utc().toDate(),
      endDate: dayjs.utc().add(1, 'hour').toDate(),
      startAtISO: mockEventListCardProps.startAt,
      endAtISO: mockEventListCardProps.endAt,
      allDay: false,
      isPublic: true,
      isRegisterable: true,
      isInviteOnly: false,
      createChat: false,
      recurrenceRule: null,
    };

    await act(async () => {
      await previewProps.onFormSubmit(payload);
    });

    const followingRadio = screen.getByLabelText('updateThisAndFollowing');
    expect(followingRadio).toBeChecked();
  });
});

describe('handleConfirmDelete with recurring events', () => {
  let mockDeleteSingleInstance: Mock;
  let mockDeleteThisAndFollowing: Mock;
  let mockDeleteEntireSeries: Mock;

  const recurringEventProps: MockEventListCardProps = {
    ...mockEventListCardProps,
    isRecurringEventTemplate: false,
    baseEvent: { id: 'baseEventId' },
  };

  beforeEach(() => {
    mockDeleteSingleInstance = vi.fn().mockResolvedValue({
      data: { deleteEvent: { id: 'deletedId' } },
    });
    mockDeleteThisAndFollowing = vi.fn().mockResolvedValue({
      data: { deleteEvent: { id: 'deletedId' } },
    });
    mockDeleteEntireSeries = vi.fn().mockResolvedValue({
      data: { deleteEvent: { id: 'deletedId' } },
    });

    mockUseMutation.mockImplementation((mutation) => {
      if (mutation === DELETE_SINGLE_EVENT_INSTANCE_MUTATION) {
        return [mockDeleteSingleInstance, { loading: false }];
      }
      if (mutation === DELETE_THIS_AND_FOLLOWING_EVENTS_MUTATION) {
        return [mockDeleteThisAndFollowing, { loading: false }];
      }
      if (mutation === DELETE_ENTIRE_RECURRING_EVENT_SERIES_MUTATION) {
        return [mockDeleteEntireSeries, { loading: false }];
      }
      return [vi.fn(), { loading: false }];
    });
  });

  test('calls deleteSingleInstance when deleteOption is single', async () => {
    render(
      <MockedProvider>
        <EventListCardModals
          eventListCardProps={recurringEventProps}
          eventModalIsOpen={false}
          hideViewModal={vi.fn()}
          t={mockT}
          tCommon={mockT}
        />
      </MockedProvider>,
    );

    // Get the deleteHandler from the mocked DeleteModal props
    const deleteModalProps = MockDeleteModal.mock.calls.slice(-1)[0][0];
    await act(async () => {
      await deleteModalProps.deleteEventHandler('single');
    });

    expect(mockDeleteSingleInstance).toHaveBeenCalledTimes(1);
    expect(mockDeleteSingleInstance).toHaveBeenCalledWith({
      variables: {
        input: { id: recurringEventProps.id },
      },
    });
    expect(NotificationToast.success).toHaveBeenCalledWith('eventDeleted');
  });

  test('calls deleteThisAndFollowing when deleteOption is following', async () => {
    render(
      <MockedProvider>
        <EventListCardModals
          eventListCardProps={recurringEventProps}
          eventModalIsOpen={false}
          hideViewModal={vi.fn()}
          t={mockT}
          tCommon={mockT}
        />
      </MockedProvider>,
    );

    const deleteModalProps = MockDeleteModal.mock.calls.slice(-1)[0][0];
    await act(async () => {
      await deleteModalProps.deleteEventHandler('following');
    });

    expect(mockDeleteThisAndFollowing).toHaveBeenCalledTimes(1);
    expect(mockDeleteThisAndFollowing).toHaveBeenCalledWith({
      variables: {
        input: { id: recurringEventProps.id },
      },
    });
  });

  test('calls deleteEntireSeries when deleteOption is all', async () => {
    render(
      <MockedProvider>
        <EventListCardModals
          eventListCardProps={recurringEventProps}
          eventModalIsOpen={false}
          hideViewModal={vi.fn()}
          t={mockT}
          tCommon={mockT}
        />
      </MockedProvider>,
    );

    const deleteModalProps = MockDeleteModal.mock.calls.slice(-1)[0][0];
    await act(async () => {
      await deleteModalProps.deleteEventHandler('all');
    });

    expect(mockDeleteEntireSeries).toHaveBeenCalledTimes(1);
    expect(mockDeleteEntireSeries).toHaveBeenCalledWith({
      variables: {
        input: { id: recurringEventProps.baseEvent?.id },
      },
    });
  });
});
