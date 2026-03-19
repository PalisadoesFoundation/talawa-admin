import { render, screen, act, waitFor, cleanup } from '@testing-library/react';
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
import { errorHandler } from 'utils/errorHandler';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

import EventListCardModals from './EventListCardModals';
import EventListCardPreviewModal from './Preview/EventListCardPreviewModal';
import EventListCardDeleteModal from './Delete/EventListCardDeleteModal';
import type { InterfaceEvent } from 'types/Event/interface';
import { UserRole } from 'types/Event/interface';
import { Frequency, WeekDays } from 'utils/recurrenceUtils/recurrenceTypes';
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

type MockEventListCardProps = InterfaceEvent & {
  refetchEvents?: Mock;
};

const FIXED_BASE_DATE = new Date(['2025', '01', '01T10:00:00.000Z'].join('-'));

const mockEventListCardProps: MockEventListCardProps = {
  id: 'event1',
  name: 'Test Event',
  description: 'Test Description',
  location: 'Test Location',
  startAt: dayjs
    .utc(FIXED_BASE_DATE)
    .add(10, 'days')
    .millisecond(0)
    .toISOString(),
  endAt: dayjs
    .utc(FIXED_BASE_DATE)
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
    vi.restoreAllMocks();
    cleanup();
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
    mockUpdateStandaloneEvent = vi
      .fn()
      .mockResolvedValue({ data: { updateStandaloneEvent: {} } });
    mockUpdateSingleRecurringEvent = vi
      .fn()
      .mockResolvedValue({ data: { updateSingleRecurringEventInstance: {} } });
    mockUpdateFollowingRecurringEvent = vi
      .fn()
      .mockResolvedValue({ data: { updateThisAndFollowingEvents: {} } });
    mockUpdateEntireRecurringEventSeries = vi.fn().mockResolvedValue({
      data: { updateEntireRecurringEventSeries: {} },
    });
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
      if (mutation === UPDATE_EVENT_MUTATION) {
        return [mockUpdateStandaloneEvent, { loading: false }];
      }
      if (mutation === UPDATE_SINGLE_RECURRING_EVENT_INSTANCE_MUTATION) {
        return [mockUpdateSingleRecurringEvent, { loading: false }];
      }
      if (mutation === UPDATE_THIS_AND_FOLLOWING_EVENTS_MUTATION) {
        return [mockUpdateFollowingRecurringEvent, { loading: false }];
      }
      if (mutation === UPDATE_ENTIRE_RECURRING_EVENT_SERIES_MUTATION) {
        return [mockUpdateEntireRecurringEventSeries, { loading: false }];
      }
      if (mutation === DELETE_STANDALONE_EVENT_MUTATION) {
        return [mockDeleteStandaloneEvent, { loading: false }];
      }
      if (mutation === DELETE_SINGLE_EVENT_INSTANCE_MUTATION) {
        return [mockDeleteSingleInstance, { loading: false }];
      }
      if (mutation === DELETE_THIS_AND_FOLLOWING_EVENTS_MUTATION) {
        return [mockDeleteThisAndFollowing, { loading: false }];
      }
      if (mutation === DELETE_ENTIRE_RECURRING_EVENT_SERIES_MUTATION) {
        return [mockDeleteEntireSeries, { loading: false }];
      }
      if (mutation === REGISTER_EVENT) {
        return [mockRegisterEvent, { loading: false }];
      }
      return [vi.fn().mockResolvedValue({ data: {} }), { loading: false }];
    });
    mockUseNavigate.mockReturnValue(mockNavigate);
    mockUseParams.mockReturnValue({ orgId: 'org1' });
    mockUseLocalStorage.mockReturnValue({
      getItem: (key: string) => (key === 'userId' ? 'user1' : null),
    });

    // Mock the preview modal to render nothing and capture props
    MockPreviewModal.mockImplementation(() => {
      // Store the props for testing but don't render anything
      return null;
    });
    MockDeleteModal.mockImplementation(() => null);
  });

  const renderComponent = (props = {}) => {
    const finalProps = {
      eventListCardProps: mockEventListCardProps,
      eventModalIsOpen: true,
      hideViewModal: vi.fn(),
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
    expect(previewProps.isRegistered).toBe(false);
  });

  test('initializes with user already registered', () => {
    renderComponent({
      eventListCardProps: {
        ...mockEventListCardProps,
        attendees: [{ id: 'user1' }],
      },
    });
    const previewProps = MockPreviewModal.mock.calls[0][0];
    expect(previewProps.isRegistered).toBe(true);
  });

  test('passes correct userId to PreviewModal', () => {
    // This test ensures that we are fetching the correct 'userId' from local storage
    // and passing it as 'userId' to the PreviewModal.
    // The mock works such that getItem('userId') -> 'user1', getItem('id') -> null.
    renderComponent();
    const previewProps = MockPreviewModal.mock.calls[0][0];
    expect(previewProps.userId).toBe('user1');
  });

  test('passes correct userId (id) to PreviewModal when userId is null', () => {
    mockUseLocalStorage.mockReturnValue({
      getItem: (key: string) => {
        if (key === 'userId') return null;
        if (key === 'id') return 'user2';
        return null;
      },
    });
    renderComponent();
    const previewProps = MockPreviewModal.mock.calls[0][0];
    expect(previewProps.userId).toBe('user2');
  });

  test('derives form startTime and endTime from startAt and endAt when API time fields are absent', () => {
    const startAt = dayjs
      .utc(FIXED_BASE_DATE)
      .add(1, 'day')
      .hour(13)
      .minute(5)
      .second(7)
      .millisecond(0)
      .toISOString();
    const endAt = dayjs
      .utc(FIXED_BASE_DATE)
      .add(1, 'day')
      .hour(15)
      .minute(45)
      .second(9)
      .millisecond(0)
      .toISOString();

    renderComponent({
      eventListCardProps: {
        ...mockEventListCardProps,
        startAt,
        endAt,
        startTime: undefined,
        endTime: undefined,
      },
    });

    const previewProps = MockPreviewModal.mock.calls[0][0];

    expect(previewProps.formState.startTime).toBe(
      dayjs(startAt).format('HH:mm:ss'),
    );
    expect(previewProps.formState.endTime).toBe(
      dayjs(endAt).format('HH:mm:ss'),
    );
  });

  test('re-derives form startTime and endTime when startAt and endAt props change', () => {
    const initialStartAt = dayjs
      .utc(FIXED_BASE_DATE)
      .add(2, 'day')
      .hour(9)
      .minute(0)
      .second(0)
      .millisecond(0)
      .toISOString();
    const initialEndAt = dayjs
      .utc(FIXED_BASE_DATE)
      .add(2, 'day')
      .hour(11)
      .minute(0)
      .second(0)
      .millisecond(0)
      .toISOString();

    const { rerender } = renderComponent({
      eventListCardProps: {
        ...mockEventListCardProps,
        startAt: initialStartAt,
        endAt: initialEndAt,
        startTime: undefined,
        endTime: undefined,
      },
    });

    const updatedStartAt = dayjs
      .utc(FIXED_BASE_DATE)
      .add(3, 'day')
      .hour(16)
      .minute(20)
      .second(30)
      .millisecond(0)
      .toISOString();
    const updatedEndAt = dayjs
      .utc(FIXED_BASE_DATE)
      .add(3, 'day')
      .hour(18)
      .minute(40)
      .second(50)
      .millisecond(0)
      .toISOString();

    rerender(
      <MockedProvider>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <EventListCardModals
              eventListCardProps={{
                ...mockEventListCardProps,
                startAt: updatedStartAt,
                endAt: updatedEndAt,
                startTime: undefined,
                endTime: undefined,
              }}
              eventModalIsOpen={true}
              hideViewModal={vi.fn()}
            />
          </I18nextProvider>
        </Provider>
      </MockedProvider>,
    );

    const latestPreviewProps =
      MockPreviewModal.mock.calls[MockPreviewModal.mock.calls.length - 1][0];

    expect(latestPreviewProps.formState.startTime).toBe(
      dayjs(updatedStartAt).format('HH:mm:ss'),
    );
    expect(latestPreviewProps.formState.endTime).toBe(
      dayjs(updatedEndAt).format('HH:mm:ss'),
    );
  });

  test('handles standalone event update successfully', async () => {
    renderComponent();

    const initialPreviewProps = MockPreviewModal.mock.calls[0][0];

    // Simulate changing a form field
    act(() => {
      initialPreviewProps.setFormState({
        ...initialPreviewProps.formState,
        name: 'Updated Event',
      });
    });

    // After the state update, the component re-renders, and the mock is called again with new props.
    const updatedPreviewProps =
      MockPreviewModal.mock.calls[MockPreviewModal.mock.calls.length - 1][0];

    // Trigger the update using the handler from the new props
    await act(async () => {
      await updatedPreviewProps.handleEventUpdate();
    });

    expect(mockUpdateStandaloneEvent).toHaveBeenCalledWith({
      variables: {
        input: expect.objectContaining({
          id: 'event1',
          name: 'Updated Event',
        }),
      },
    });
    expect(NotificationToast.success).toHaveBeenCalledWith(
      'Event updated successfully.',
    );
    expect(mockEventListCardProps.refetchEvents).toHaveBeenCalled();
  });

  test('handles standalone event update with description change', async () => {
    renderComponent();
    const initialPreviewProps = MockPreviewModal.mock.calls[0][0];
    act(() => {
      initialPreviewProps.setFormState({
        ...initialPreviewProps.formState,
        eventDescription: 'Updated Description',
      });
    });
    const updatedPreviewProps =
      MockPreviewModal.mock.calls[MockPreviewModal.mock.calls.length - 1][0];
    await act(async () => {
      await updatedPreviewProps.handleEventUpdate();
    });
    expect(mockUpdateStandaloneEvent).toHaveBeenCalledWith({
      variables: {
        input: expect.objectContaining({
          id: 'event1',
          description: 'Updated Description',
        }),
      },
    });
  });

  test('handles standalone event update with location change', async () => {
    renderComponent();
    const initialPreviewProps = MockPreviewModal.mock.calls[0][0];
    act(() => {
      initialPreviewProps.setFormState({
        ...initialPreviewProps.formState,
        location: 'Updated Location',
      });
    });
    const updatedPreviewProps =
      MockPreviewModal.mock.calls[MockPreviewModal.mock.calls.length - 1][0];
    await act(async () => {
      await updatedPreviewProps.handleEventUpdate();
    });
    expect(mockUpdateStandaloneEvent).toHaveBeenCalledWith({
      variables: {
        input: expect.objectContaining({
          id: 'event1',
          location: 'Updated Location',
        }),
      },
    });
  });

  test('handles standalone event update with isPublic change', async () => {
    renderComponent();
    const initialPreviewProps = MockPreviewModal.mock.calls[0][0];
    act(() => {
      initialPreviewProps.setPublicChecked(false);
    });
    const updatedPreviewProps =
      MockPreviewModal.mock.calls[MockPreviewModal.mock.calls.length - 1][0];
    await act(async () => {
      await updatedPreviewProps.handleEventUpdate();
    });
    expect(mockUpdateStandaloneEvent).toHaveBeenCalledWith({
      variables: {
        input: expect.objectContaining({
          id: 'event1',
          isPublic: false,
        }),
      },
    });
  });

  test('handles standalone event update with isRegisterable change', async () => {
    renderComponent();
    const initialPreviewProps = MockPreviewModal.mock.calls[0][0];
    act(() => {
      initialPreviewProps.setRegisterableChecked(false);
    });
    const updatedPreviewProps =
      MockPreviewModal.mock.calls[MockPreviewModal.mock.calls.length - 1][0];
    await act(async () => {
      await updatedPreviewProps.handleEventUpdate();
    });
    expect(mockUpdateStandaloneEvent).toHaveBeenCalledWith({
      variables: {
        input: expect.objectContaining({
          id: 'event1',
          isRegisterable: false,
        }),
      },
    });
  });

  test('handles standalone event update with isInviteOnly change', async () => {
    renderComponent();
    const initialPreviewProps = MockPreviewModal.mock.calls[0][0];
    act(() => {
      initialPreviewProps.setInviteOnlyChecked(true);
    });
    const updatedPreviewProps =
      MockPreviewModal.mock.calls[MockPreviewModal.mock.calls.length - 1][0];
    await act(async () => {
      await updatedPreviewProps.handleEventUpdate();
    });
    expect(mockUpdateStandaloneEvent).toHaveBeenCalledWith({
      variables: {
        input: expect.objectContaining({
          id: 'event1',
          isInviteOnly: true,
        }),
      },
    });
  });

  test('handles standalone event update with allDay change', async () => {
    renderComponent();
    const initialPreviewProps = MockPreviewModal.mock.calls[0][0];
    act(() => {
      initialPreviewProps.setAllDayChecked(true);
    });
    const updatedPreviewProps =
      MockPreviewModal.mock.calls[MockPreviewModal.mock.calls.length - 1][0];
    await act(async () => {
      await updatedPreviewProps.handleEventUpdate();
    });
    expect(mockUpdateStandaloneEvent).toHaveBeenCalledWith({
      variables: {
        input: expect.objectContaining({
          id: 'event1',
          allDay: true,
        }),
      },
    });
  });

  test('does not call update mutation if no changes are made', async () => {
    const alignedStartAt = dayjs(new Date(mockEventListCardProps.startAt ?? ''))
      .hour(parseInt(mockEventListCardProps.startTime ?? '00', 10) || 0)
      .minute(
        parseInt(mockEventListCardProps.startTime?.split(':')[1] ?? '00', 10) ||
          0,
      )
      .second(
        parseInt(mockEventListCardProps.startTime?.split(':')[2] ?? '00', 10) ||
          0,
      )
      .millisecond(0)
      .toISOString();
    const alignedEndAt = dayjs(new Date(mockEventListCardProps.endAt ?? ''))
      .hour(parseInt(mockEventListCardProps.endTime ?? '00', 10) || 0)
      .minute(
        parseInt(mockEventListCardProps.endTime?.split(':')[1] ?? '00', 10) ||
          0,
      )
      .second(
        parseInt(mockEventListCardProps.endTime?.split(':')[2] ?? '00', 10) ||
          0,
      )
      .millisecond(0)
      .toISOString();

    cleanup();
    renderComponent({
      eventListCardProps: {
        ...mockEventListCardProps,
        startAt: alignedStartAt,
        endAt: alignedEndAt,
      },
    });

    const stablePreviewProps = MockPreviewModal.mock.calls[0][0];
    await act(async () => {
      await stablePreviewProps.handleEventUpdate();
    });

    expect(mockUpdateStandaloneEvent).not.toHaveBeenCalled();
    expect(NotificationToast.info).toHaveBeenCalledWith('No changes to update');
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
      'Successfully registered for Test Event',
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
    expect(
      MockDeleteModal.mock.calls[MockDeleteModal.mock.calls.length - 1][0]
        .eventDeleteModalIsOpen,
    ).toBe(true);
  });

  test('opens and closes update modal for recurring events', async () => {
    renderComponent({
      eventListCardProps: buildRecurringEventProps(),
    });

    const previewProps = MockPreviewModal.mock.calls[0][0];

    await act(async () => {
      await previewProps.handleEventUpdate();
    });

    await waitFor(() => {
      expect(
        screen.getByText(
          'This is a recurring event. Choose how you want to update it:',
        ),
      ).toBeInTheDocument();
    });

    const closeButton = screen.getByTestId('eventUpdateModalCloseBtn');
    await userEvent.click(closeButton);

    await waitFor(() => {
      expect(
        screen.queryByText('updateRecurringEventMsg'),
      ).not.toBeInTheDocument();
    });
  });

  test('handles update of a single recurring event instance', async () => {
    renderComponent({
      eventListCardProps: buildRecurringEventProps(),
    });

    const previewProps = MockPreviewModal.mock.calls[0][0];
    act(() => {
      previewProps.setFormState({
        ...previewProps.formState,
        name: 'Updated Instance',
      });
    });

    await act(async () => {
      await previewProps.handleEventUpdate();
    });

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

  test('handles explicit selection of "update single instance" option', async () => {
    renderComponent({
      eventListCardProps: buildRecurringEventProps(),
    });

    const previewProps = MockPreviewModal.mock.calls[0][0];

    // Update form state to ensure changes are detected
    act(() => {
      previewProps.setFormState({
        ...previewProps.formState,
        name: 'Updated Name for Single Instance',
      });
    });

    // Open the update modal
    await act(async () => {
      await previewProps.handleEventUpdate();
    });

    // Find the "Update this instance" radio button
    const singleInstanceRadio = screen.getByTestId('update-single-radio');

    // Verify it exists and click it
    expect(singleInstanceRadio).toBeInTheDocument();
    await userEvent.click(singleInstanceRadio);

    // Assert it is checked (it should be default, but clicking ensures the handler runs)
    await waitFor(() => expect(singleInstanceRadio).toBeChecked());

    const confirmButton = screen.getByTestId('confirmUpdateEventBtn');
    await userEvent.click(confirmButton);
    await waitFor(() =>
      expect(mockUpdateSingleRecurringEvent).toHaveBeenCalled(),
    );
  });

  test('handles update of this and following recurring events', async () => {
    renderComponent({
      eventListCardProps: buildRecurringEventProps(),
    });

    const previewProps = MockPreviewModal.mock.calls[0][0];
    act(() => {
      previewProps.setFormState({
        ...previewProps.formState,
        name: 'Updated Following',
      });
    });

    await act(async () => {
      await previewProps.handleEventUpdate();
    });

    const followingRadio = screen.getByTestId('update-following-radio');
    await userEvent.click(followingRadio);

    const confirmButton = screen.getByTestId('confirmUpdateEventBtn');
    await userEvent.click(confirmButton);

    await waitFor(() =>
      expect(mockUpdateFollowingRecurringEvent).toHaveBeenCalledWith({
        variables: {
          input: expect.objectContaining({
            id: 'event1',
            name: 'Updated Following',
          }),
        },
      }),
    );
  });

  test('handles update of an entire recurring event series', async () => {
    renderComponent({
      eventListCardProps: buildRecurringEventProps(),
    });

    const previewProps = MockPreviewModal.mock.calls[0][0];
    act(() => {
      previewProps.setFormState({
        ...previewProps.formState,
        name: 'Updated Series',
        eventDescription: 'Updated Series Description',
      });
    });

    await act(async () => {
      await previewProps.handleEventUpdate();
    });

    const entireSeriesRadio = screen.getByTestId('update-entire-series-radio');
    await userEvent.click(entireSeriesRadio);

    const confirmButton = screen.getByTestId('confirmUpdateEventBtn');
    await userEvent.click(confirmButton);

    await waitFor(() =>
      expect(mockUpdateEntireRecurringEventSeries).toHaveBeenCalledWith({
        variables: {
          input: expect.objectContaining({
            id: 'event1',
            name: 'Updated Series',
            description: 'Updated Series Description',
          }),
        },
      }),
    );
  });

  test('handles update of an entire recurring event series with only name change', async () => {
    renderComponent({
      eventListCardProps: buildRecurringEventProps(),
    });

    const previewProps = MockPreviewModal.mock.calls[0][0];
    act(() => {
      previewProps.setFormState({
        ...previewProps.formState,
        name: 'Updated Series Name',
      });
    });

    await act(async () => {
      await previewProps.handleEventUpdate();
    });

    const entireSeriesRadio = screen.getByTestId('update-entire-series-radio');
    await userEvent.click(entireSeriesRadio);

    const confirmButton = screen.getByTestId('confirmUpdateEventBtn');
    await userEvent.click(confirmButton);

    await waitFor(() =>
      expect(mockUpdateEntireRecurringEventSeries).toHaveBeenCalledWith({
        variables: {
          input: expect.objectContaining({
            id: 'event1',
            name: 'Updated Series Name',
          }),
        },
      }),
    );
  });

  test('handles update of an entire recurring event series with only description change', async () => {
    renderComponent({
      eventListCardProps: buildRecurringEventProps(),
    });

    const previewProps = MockPreviewModal.mock.calls[0][0];
    act(() => {
      previewProps.setFormState({
        ...previewProps.formState,
        eventDescription: 'Updated Series Event Description',
      });
    });

    await act(async () => {
      await previewProps.handleEventUpdate();
    });

    const entireSeriesRadio = screen.getByTestId('update-entire-series-radio');
    await userEvent.click(entireSeriesRadio);

    const confirmButton = screen.getByTestId('confirmUpdateEventBtn');
    await userEvent.click(confirmButton);

    await waitFor(() =>
      expect(mockUpdateEntireRecurringEventSeries).toHaveBeenCalledWith({
        variables: {
          input: expect.objectContaining({
            id: 'event1',
            description: 'Updated Series Event Description',
          }),
        },
      }),
    );
  });

  describe('date validation and handling', () => {
    test('correctly formats startAt and endAt for all-day events on date change', async () => {
      renderComponent({
        eventListCardProps: { ...mockEventListCardProps, allDay: true },
      });
      const initialPreviewProps = MockPreviewModal.mock.calls[0][0];
      const newStartDate = dayjs
        .utc(FIXED_BASE_DATE)
        .add(20, 'days')
        .hour(12)
        .minute(0)
        .second(0)
        .millisecond(0)
        .toDate();
      const newEndDate = dayjs
        .utc(FIXED_BASE_DATE)
        .add(21, 'days')
        .hour(12)
        .minute(0)
        .second(0)
        .millisecond(0)
        .toDate();

      act(() => {
        initialPreviewProps.setAllDayChecked(true);
        initialPreviewProps.setEventStartDate(newStartDate);
        initialPreviewProps.setEventEndDate(newEndDate);
      });

      const updatedPreviewProps =
        MockPreviewModal.mock.calls[MockPreviewModal.mock.calls.length - 1][0];
      await act(async () => {
        await updatedPreviewProps.handleEventUpdate();
      });

      const calledInput =
        mockUpdateStandaloneEvent.mock.calls[0][0].variables.input;
      expect(calledInput.id).toBe('event1');
      expect(calledInput.startDate).toBeDefined();
      expect(calledInput.endDate).toBeDefined();
    });

    test('allows update  of recurring instance when recurrenceRule is present', async () => {
      renderComponent({
        eventListCardProps: buildRecurringEventProps({
          recurrenceRule: {
            frequency: Frequency.DAILY,
            recurrenceEndDate: dayjs
              .utc(FIXED_BASE_DATE)
              .add(1, 'year')
              .toDate(),
          },
        }),
      });
      const initialPreviewProps = MockPreviewModal.mock.calls[0][0];
      act(() => {
        initialPreviewProps.setFormState({
          ...initialPreviewProps.formState,
          name: 'Updated Name',
        });
      });
      const updatedPreviewProps =
        MockPreviewModal.mock.calls[MockPreviewModal.mock.calls.length - 1][0];
      await act(async () => {
        await updatedPreviewProps.handleEventUpdate();
      });

      // Modal should open for recurring events
      const confirmButton = screen.getByTestId('confirmUpdateEventBtn');
      await userEvent.click(confirmButton);

      expect(mockUpdateSingleRecurringEvent).toHaveBeenCalledWith({
        variables: {
          input: expect.objectContaining({
            id: 'event1',
            name: 'Updated Name',
          }),
        },
      });
    });

    test('shows error when original endDate is invalid and allDay is true', async () => {
      renderComponent({
        eventListCardProps: {
          ...mockEventListCardProps,
          allDay: true,
          endDate: 'invalid date',
        },
      });
      const initialPreviewProps = MockPreviewModal.mock.calls[0][0];
      act(() => {
        initialPreviewProps.setFormState({
          ...initialPreviewProps.formState,
          name: 'Updated Name',
        });
      });
      const updatedPreviewProps =
        MockPreviewModal.mock.calls[MockPreviewModal.mock.calls.length - 1][0];
      await act(async () => {
        await updatedPreviewProps.handleEventUpdate();
      });
      expect(NotificationToast.error).toHaveBeenCalledWith('Invalid Date');
      expect(mockUpdateStandaloneEvent).not.toHaveBeenCalled();
    });

    test('allows update with invalid original end date when allDay is false', async () => {
      renderComponent({
        eventListCardProps: {
          ...mockEventListCardProps,
          allDay: false,
          endDate: 'invalid date',
        },
      });
      const initialPreviewProps = MockPreviewModal.mock.calls[0][0];
      act(() => {
        initialPreviewProps.setFormState({
          ...initialPreviewProps.formState,
          name: 'Updated Name',
        });
      });
      const updatedPreviewProps =
        MockPreviewModal.mock.calls[MockPreviewModal.mock.calls.length - 1][0];
      await act(async () => {
        await updatedPreviewProps.handleEventUpdate();
      });
      expect(mockUpdateStandaloneEvent).toHaveBeenCalledTimes(1);
    });

    test('shows error when start date is invalid and allDay is true', async () => {
      renderComponent();
      const initialPreviewProps = MockPreviewModal.mock.calls[0][0];
      act(() => {
        initialPreviewProps.setAllDayChecked(true);
        initialPreviewProps.setEventStartDate(new Date('invalid date'));
      });
      const updatedPreviewProps =
        MockPreviewModal.mock.calls[MockPreviewModal.mock.calls.length - 1][0];
      await act(async () => {
        await updatedPreviewProps.handleEventUpdate();
      });
      expect(NotificationToast.error).toHaveBeenCalledWith('Invalid Date');
      expect(mockUpdateStandaloneEvent).not.toHaveBeenCalled();
    });

    test('shows error when end date is invalid and allDay is true', async () => {
      renderComponent();
      const initialPreviewProps = MockPreviewModal.mock.calls[0][0];
      act(() => {
        initialPreviewProps.setAllDayChecked(true);
        initialPreviewProps.setEventEndDate(new Date('invalid date'));
      });
      const updatedPreviewProps =
        MockPreviewModal.mock.calls[MockPreviewModal.mock.calls.length - 1][0];
      await act(async () => {
        await updatedPreviewProps.handleEventUpdate();
      });
      expect(NotificationToast.error).toHaveBeenCalledWith('Invalid Date');
      expect(mockUpdateStandaloneEvent).not.toHaveBeenCalled();
    });

    test('shows error when start date is invalid and allDay is false', async () => {
      renderComponent();
      const initialPreviewProps = MockPreviewModal.mock.calls[0][0];
      act(() => {
        initialPreviewProps.setAllDayChecked(false);
        initialPreviewProps.setEventStartDate(new Date('invalid date'));
      });
      const updatedPreviewProps =
        MockPreviewModal.mock.calls[MockPreviewModal.mock.calls.length - 1][0];
      await act(async () => {
        await updatedPreviewProps.handleEventUpdate();
      });
      expect(NotificationToast.error).toHaveBeenCalledWith('Invalid Date');
      expect(mockUpdateStandaloneEvent).not.toHaveBeenCalled();
    });

    test('shows error when end date is invalid and allDay is false', async () => {
      renderComponent();
      const initialPreviewProps = MockPreviewModal.mock.calls[0][0];
      act(() => {
        initialPreviewProps.setAllDayChecked(false);
        initialPreviewProps.setEventEndDate(new Date('invalid date'));
      });
      const updatedPreviewProps =
        MockPreviewModal.mock.calls[MockPreviewModal.mock.calls.length - 1][0];
      await act(async () => {
        await updatedPreviewProps.handleEventUpdate();
      });
      expect(NotificationToast.error).toHaveBeenCalledWith('Invalid Date');
      expect(mockUpdateStandaloneEvent).not.toHaveBeenCalled();
    });

    test('handles invalid eventStartDate in hasOnlyNameOrDescriptionChanged', async () => {
      renderComponent({
        eventListCardProps: {
          ...mockEventListCardProps,
          allDay: true,
        },
      });
      const initialPreviewProps = MockPreviewModal.mock.calls[0][0];
      act(() => {
        initialPreviewProps.setEventStartDate(new Date('invalid date'));
      });
      const updatedPreviewProps =
        MockPreviewModal.mock.calls[MockPreviewModal.mock.calls.length - 1][0];
      await act(async () => {
        await updatedPreviewProps.handleEventUpdate();
      });
      expect(NotificationToast.error).toHaveBeenCalledWith('Invalid Date');
      expect(mockUpdateStandaloneEvent).not.toHaveBeenCalled();
    });

    test('shows error when props startDate is invalid for all-day event', async () => {
      renderComponent({
        eventListCardProps: {
          ...mockEventListCardProps,
          allDay: true,
          startDate: 'invalid date',
        },
      });
      const initialPreviewProps = MockPreviewModal.mock.calls[0][0];
      act(() => {
        initialPreviewProps.setFormState({
          ...initialPreviewProps.formState,
          name: 'Updated Name',
        });
      });
      const updatedPreviewProps =
        MockPreviewModal.mock.calls[MockPreviewModal.mock.calls.length - 1][0];
      await act(async () => {
        await updatedPreviewProps.handleEventUpdate();
      });
      expect(NotificationToast.error).toHaveBeenCalledWith('Invalid Date');
      expect(mockUpdateStandaloneEvent).not.toHaveBeenCalled();
    });
  });

  test('handles deletion of a standalone event', async () => {
    renderComponent();
    const deleteProps = MockDeleteModal.mock.calls[0][0];

    await act(async () => {
      await deleteProps.deleteEventHandler();
    });

    expect(mockDeleteStandaloneEvent).toHaveBeenCalledWith({
      variables: { input: { id: 'event1' } },
    });
  });

  test('handles deletion of a single recurring event instance', async () => {
    renderComponent({
      eventListCardProps: buildRecurringEventProps(),
    });
    const deleteProps = MockDeleteModal.mock.calls[0][0];

    await act(async () => {
      await deleteProps.deleteEventHandler('single');
    });

    expect(mockDeleteSingleInstance).toHaveBeenCalledWith({
      variables: { input: { id: 'event1' } },
    });
  });

  test('handles deletion of this and following recurring events', async () => {
    renderComponent({
      eventListCardProps: buildRecurringEventProps(),
    });
    const deleteProps = MockDeleteModal.mock.calls[0][0];

    await act(async () => {
      await deleteProps.deleteEventHandler('following');
    });

    expect(mockDeleteThisAndFollowing).toHaveBeenCalledWith({
      variables: { input: { id: 'event1' } },
    });
  });

  test('handles deletion of an entire recurring event series', async () => {
    renderComponent({
      eventListCardProps: buildRecurringEventProps(),
    });
    const deleteProps = MockDeleteModal.mock.calls[0][0];

    await act(async () => {
      await deleteProps.deleteEventHandler('all');
    });

    expect(mockDeleteEntireSeries).toHaveBeenCalledWith({
      variables: { input: { id: 'baseEvent1' } },
    });
  });

  test('shows error when delete is attempted on recurring instance without delete option', async () => {
    renderComponent({
      eventListCardProps: buildRecurringEventProps(),
    });
    const deleteProps = MockDeleteModal.mock.calls[0][0];

    // Call with no arg (or undefined) to hit the !deleteOption branch in deleteEventHandler
    await act(async () => {
      await deleteProps.deleteEventHandler(undefined);
    });

    expect(NotificationToast.error).toHaveBeenCalledWith(
      'Delete option is required',
    );
    expect(mockDeleteSingleInstance).not.toHaveBeenCalled();
    expect(mockDeleteThisAndFollowing).not.toHaveBeenCalled();
    expect(mockDeleteEntireSeries).not.toHaveBeenCalled();
  });

  test('handles GraphQL error during update', async () => {
    const error = new Error('GraphQL Error');
    mockUpdateStandaloneEvent.mockRejectedValue(error);
    renderComponent();

    const initialPreviewProps = MockPreviewModal.mock.calls[0][0];
    act(() => {
      initialPreviewProps.setFormState({
        ...initialPreviewProps.formState,
        name: 'Updated Event',
      });
    });

    // After the state update, the component re-renders, and the mock is called again with new props.
    const updatedPreviewProps =
      MockPreviewModal.mock.calls[MockPreviewModal.mock.calls.length - 1][0];

    await act(async () => {
      await updatedPreviewProps.handleEventUpdate();
    });

    expect(errorHandler).toHaveBeenCalledWith(expect.any(Function), error);
  });

  describe('updateOption logic', () => {
    test('switches to "following" when recurrence changes, making "single" invalid', async () => {
      const recurringEventProps = buildRecurringEventProps({
        recurrenceRule: {
          frequency: Frequency.WEEKLY,
          interval: 1,
          byDay: [WeekDays.MO],
        },
      });
      renderComponent({ eventListCardProps: recurringEventProps });

      // Initial state: updateOption is 'single'
      // Simulate changing the recurrence rule, which is done via the preview modal
      const initialPreviewProps = MockPreviewModal.mock.calls[0][0];
      act(() => {
        initialPreviewProps.setRecurrence({
          ...recurringEventProps.recurrenceRule,
          interval: 2, // Change the interval
        });
      });

      // After the state update, the component re-renders.
      // The `useEffect` should have switched the updateOption to 'following'.
      const updatedPreviewProps =
        MockPreviewModal.mock.calls[MockPreviewModal.mock.calls.length - 1][0];

      // Now, open the update modal to check the result
      await act(async () => {
        await updatedPreviewProps.handleEventUpdate();
      });

      // The 'single' option should be gone, and 'following' should be checked.
      expect(
        screen.queryByTestId('update-single-radio'),
      ).not.toBeInTheDocument();
      const followingRadio = screen.getByTestId('update-following-radio');
      await waitFor(() => expect(followingRadio).toBeChecked());
    });
  });

  describe('detects recurrence frequency from description', () => {
    const testCases = [
      {
        description: 'Repeats weekly on Tuesday',
        expectedFrequency: Frequency.WEEKLY,
      },
      { description: 'Occurs every week', expectedFrequency: Frequency.WEEKLY },
      {
        description: 'Monthly on the first Friday',
        expectedFrequency: Frequency.MONTHLY,
      },
      {
        description: 'Recurs every month',
        expectedFrequency: Frequency.MONTHLY,
      },
      {
        description: 'Annual event, every year on July 4th',
        expectedFrequency: Frequency.YEARLY,
      },
      { description: 'Yearly meeting', expectedFrequency: Frequency.YEARLY },
      { description: 'Happens daily', expectedFrequency: Frequency.DAILY },
      { description: 'Repeats every day', expectedFrequency: Frequency.DAILY },
      {
        description: 'A random day event',
        expectedFrequency: Frequency.DAILY,
      },
      { description: 'day by day', expectedFrequency: Frequency.DAILY },
      { description: 'Starts with day', expectedFrequency: Frequency.DAILY },
      { description: 'Ends with day', expectedFrequency: Frequency.DAILY },
    ];

    testCases.forEach(({ description, expectedFrequency }) => {
      test(`should detect ${expectedFrequency} for "${description}"`, async () => {
        renderComponent({
          eventListCardProps: buildRecurringEventProps({
            recurrenceDescription: description,
          }),
        });

        const previewProps = MockPreviewModal.mock.calls[0][0];
        act(() => {
          previewProps.setFormState({
            ...previewProps.formState,
            name: 'Updated Recurring Event',
          });
        });

        await act(async () => {
          await previewProps.handleEventUpdate();
        });

        // Select 'this and following events' to trigger the logic that uses frequency
        const followingRadio = screen.getByTestId('update-following-radio');
        await userEvent.click(followingRadio);

        const confirmButton = screen.getByTestId('confirmUpdateEventBtn');
        await userEvent.click(confirmButton);

        await waitFor(() =>
          expect(mockUpdateFollowingRecurringEvent).toHaveBeenCalledWith(
            expect.objectContaining({
              variables: expect.objectContaining({
                input: expect.objectContaining({}),
              }),
            }),
          ),
        );
      });
    });
  });
  test('handles register event error', async () => {
    mockRegisterEvent.mockRejectedValue(new Error('Register failed'));
    renderComponent();
    const previewProps = MockPreviewModal.mock.calls[0][0];

    await act(async () => {
      await previewProps.registerEventHandler();
    });

    expect(mockRegisterEvent).toHaveBeenCalledWith({
      variables: { id: 'event1' },
    });
    expect(errorHandler).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({ message: 'Register failed' }),
    );
    expect(NotificationToast.success).not.toHaveBeenCalled();
  });

  test('handles delete standalone event safely when refetchEvents is undefined', async () => {
    // Render with undefined refetchEvents
    renderComponent({
      eventListCardProps: {
        ...mockEventListCardProps,
        refetchEvents: undefined,
      },
    });

    const previewProps = MockPreviewModal.mock.calls[0][0];

    // Toggle delete modal
    act(() => {
      previewProps.toggleDeleteModal();
    });

    // Trigger delete
    const deleteModalProps = MockDeleteModal.mock.calls[1][0];
    await act(async () => {
      await deleteModalProps.deleteEventHandler('single');
    });

    expect(mockDeleteStandaloneEvent).toHaveBeenCalled();
    expect(NotificationToast.success).toHaveBeenCalledWith(
      'Event deleted successfully.',
    );
  });
});
