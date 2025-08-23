import { render, screen, fireEvent, act } from '@testing-library/react';
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
import { toast } from 'react-toastify';
import { errorHandler } from 'utils/errorHandler';

import EventListCardModals from './EventListCardModals';
import EventListCardPreviewModal from './Preview/EventListCardPreviewModal';
import EventListCardDeleteModal from './Delete/EventListCardDeleteModal';
import { UserRole } from 'types/Event/interface';
import { Frequency } from 'utils/recurrenceUtils/recurrenceTypes';
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
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
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

const mockEventListCardProps = {
  _id: 'event1',
  name: 'Test Event',
  description: 'Test Description',
  location: 'Test Location',
  startDate: '2024-01-01',
  endDate: '2024-01-01',
  startTime: '10:00:00',
  endTime: '12:00:00',
  allDay: false,
  isPublic: true,
  isRegisterable: true,
  attendees: [],
  creator: { _id: 'user1' },
  userRole: UserRole.ADMINISTRATOR,
  isRecurringTemplate: false,
  baseEventId: null,
  refetchEvents: vi.fn(),
};

describe('EventListCardModals', () => {
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
    mockUseLocalStorage.mockReturnValue({ getItem: () => 'user1' });

    // Mock the preview modal to render nothing and capture props
    MockPreviewModal.mockImplementation((props) => {
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
    expect(previewProps.isRegistered).toBe(false);
  });

  test('initializes with user already registered', () => {
    renderComponent({
      eventListCardProps: {
        ...mockEventListCardProps,
        attendees: [{ _id: 'user1' }],
      },
    });
    const previewProps = MockPreviewModal.mock.calls[0][0];
    expect(previewProps.isRegistered).toBe(true);
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
    const updatedPreviewProps = MockPreviewModal.mock.calls[1][0];

    // Trigger the update using the handler from the new props
    await act(async () => {
      await updatedPreviewProps.handleEventUpdate();
    });

    expect(mockUpdateStandaloneEvent).toHaveBeenCalledWith({
      variables: {
        input: {
          id: 'event1',
          name: 'Updated Event',
        },
      },
    });
    expect(toast.success).toHaveBeenCalledWith('eventUpdated');
    expect(mockEventListCardProps.refetchEvents).toHaveBeenCalled();
  });

  test('handles standalone event update with description change', async () => {
    renderComponent();
    const initialPreviewProps = MockPreviewModal.mock.calls[0][0];
    act(() => {
      initialPreviewProps.setFormState({
        ...initialPreviewProps.formState,
        eventdescrip: 'Updated Description',
      });
    });
    const updatedPreviewProps = MockPreviewModal.mock.calls[1][0];
    await act(async () => {
      await updatedPreviewProps.handleEventUpdate();
    });
    expect(mockUpdateStandaloneEvent).toHaveBeenCalledWith({
      variables: {
        input: {
          id: 'event1',
          description: 'Updated Description',
        },
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
    const updatedPreviewProps = MockPreviewModal.mock.calls[1][0];
    await act(async () => {
      await updatedPreviewProps.handleEventUpdate();
    });
    expect(mockUpdateStandaloneEvent).toHaveBeenCalledWith({
      variables: {
        input: {
          id: 'event1',
          location: 'Updated Location',
        },
      },
    });
  });

  test('handles standalone event update with isPublic change', async () => {
    renderComponent();
    const initialPreviewProps = MockPreviewModal.mock.calls[0][0];
    act(() => {
      initialPreviewProps.setPublicChecked(false);
    });
    const updatedPreviewProps = MockPreviewModal.mock.calls[1][0];
    await act(async () => {
      await updatedPreviewProps.handleEventUpdate();
    });
    expect(mockUpdateStandaloneEvent).toHaveBeenCalledWith({
      variables: {
        input: {
          id: 'event1',
          isPublic: false,
        },
      },
    });
  });

  test('handles standalone event update with isRegisterable change', async () => {
    renderComponent();
    const initialPreviewProps = MockPreviewModal.mock.calls[0][0];
    act(() => {
      initialPreviewProps.setRegistrableChecked(false);
    });
    const updatedPreviewProps = MockPreviewModal.mock.calls[1][0];
    await act(async () => {
      await updatedPreviewProps.handleEventUpdate();
    });
    expect(mockUpdateStandaloneEvent).toHaveBeenCalledWith({
      variables: {
        input: {
          id: 'event1',
          isRegisterable: false,
        },
      },
    });
  });

  test('handles standalone event update with allDay change', async () => {
    renderComponent();
    const initialPreviewProps = MockPreviewModal.mock.calls[0][0];
    act(() => {
      initialPreviewProps.setAllDayChecked(true);
    });
    const updatedPreviewProps = MockPreviewModal.mock.calls[1][0];
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
    renderComponent();
    const previewProps = MockPreviewModal.mock.calls[0][0];

    await act(async () => {
      await previewProps.handleEventUpdate();
    });

    expect(mockUpdateStandaloneEvent).not.toHaveBeenCalled();
    expect(toast.info).toHaveBeenCalledWith('eventListCard.noChangesToUpdate');
  });

  test('handles event registration', async () => {
    renderComponent();
    const previewProps = MockPreviewModal.mock.calls[0][0];

    await act(async () => {
      await previewProps.registerEventHandler();
    });

    expect(mockRegisterEvent).toHaveBeenCalledWith({
      variables: { eventId: 'event1' },
    });
    expect(toast.success).toHaveBeenCalledWith(
      'Successfully registered for Test Event',
    );
  });

  test('navigates to event dashboard', () => {
    renderComponent();
    const previewProps = MockPreviewModal.mock.calls[0][0];

    act(() => {
      previewProps.openEventDashboard();
    });

    expect(mockNavigate).toHaveBeenCalledWith('/event/org1/event1');
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
      eventListCardProps: {
        ...mockEventListCardProps,
        isRecurringTemplate: false,
        baseEventId: 'baseEvent1',
      },
    });

    const previewProps = MockPreviewModal.mock.calls[0][0];

    // This should open the modal
    await act(async () => {
      await previewProps.handleEventUpdate();
    });

    expect(screen.getByText('updateRecurringEventMsg')).toBeInTheDocument();

    // Click cancel to close
    const closeButton = screen.getByTestId('eventUpdateModalCloseBtn');
    await userEvent.click(closeButton);

    expect(
      screen.queryByText('updateRecurringEventMsg'),
    ).not.toBeInTheDocument();
  });

  test('handles update of a single recurring event instance', async () => {
    renderComponent({
      eventListCardProps: {
        ...mockEventListCardProps,
        isRecurringTemplate: false,
        baseEventId: 'baseEvent1',
      },
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
        input: {
          id: 'event1',
          name: 'Updated Instance',
        },
      },
    });
  });

  test('handles update of this and following recurring events', async () => {
    renderComponent({
      eventListCardProps: {
        ...mockEventListCardProps,
        isRecurringTemplate: false,
        baseEventId: 'baseEvent1',
      },
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

    // Select the 'following' option
    const followingRadio = screen.getByLabelText('updateThisAndFollowing');
    await userEvent.click(followingRadio);

    const confirmButton = screen.getByTestId('confirmUpdateEventBtn');
    await userEvent.click(confirmButton);

    expect(mockUpdateFollowingRecurringEvent).toHaveBeenCalledWith({
      variables: {
        input: expect.objectContaining({
          id: 'event1',
          name: 'Updated Following',
        }),
      },
    });
  });

  test('handles update of an entire recurring event series', async () => {
    renderComponent({
      eventListCardProps: {
        ...mockEventListCardProps,
        isRecurringTemplate: false,
        baseEventId: 'baseEvent1',
      },
    });

    const previewProps = MockPreviewModal.mock.calls[0][0];
    act(() => {
      previewProps.setFormState({
        ...previewProps.formState,
        name: 'Updated Series',
        eventdescrip: 'Updated Series Description',
      });
    });

    await act(async () => {
      await previewProps.handleEventUpdate();
    });

    // Select the 'entire series' option
    const entireSeriesRadio = screen.getByLabelText('updateEntireSeries');
    await userEvent.click(entireSeriesRadio);

    const confirmButton = screen.getByTestId('confirmUpdateEventBtn');
    await userEvent.click(confirmButton);

    expect(mockUpdateEntireRecurringEventSeries).toHaveBeenCalledWith({
      variables: {
        input: {
          id: 'event1',
          name: 'Updated Series',
          description: 'Updated Series Description',
        },
      },
    });
  });

  test('handles update of an entire recurring event series with only name change', async () => {
    renderComponent({
      eventListCardProps: {
        ...mockEventListCardProps,
        isRecurringTemplate: false,
        baseEventId: 'baseEvent1',
      },
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

    const entireSeriesRadio = screen.getByLabelText('updateEntireSeries');
    await userEvent.click(entireSeriesRadio);

    const confirmButton = screen.getByTestId('confirmUpdateEventBtn');
    await userEvent.click(confirmButton);

    expect(mockUpdateEntireRecurringEventSeries).toHaveBeenCalledWith({
      variables: {
        input: {
          id: 'event1',
          name: 'Updated Series Name',
        },
      },
    });
  });

  test('handles update of an entire recurring event series with only description change', async () => {
    renderComponent({
      eventListCardProps: {
        ...mockEventListCardProps,
        isRecurringTemplate: false,
        baseEventId: 'baseEvent1',
      },
    });

    const previewProps = MockPreviewModal.mock.calls[0][0];
    act(() => {
      previewProps.setFormState({
        ...previewProps.formState,
        eventdescrip: 'Updated Series Event Description',
      });
    });

    await act(async () => {
      await previewProps.handleEventUpdate();
    });

    const entireSeriesRadio = screen.getByLabelText('updateEntireSeries');
    await userEvent.click(entireSeriesRadio);

    const confirmButton = screen.getByTestId('confirmUpdateEventBtn');
    await userEvent.click(confirmButton);

    expect(mockUpdateEntireRecurringEventSeries).toHaveBeenCalledWith({
      variables: {
        input: {
          id: 'event1',
          description: 'Updated Series Event Description',
        },
      },
    });
  });

  describe('date validation and handling', () => {
    test('correctly formats startAt and endAt for all-day events on date change', async () => {
      renderComponent({
        eventListCardProps: { ...mockEventListCardProps, allDay: true },
      });
      const initialPreviewProps = MockPreviewModal.mock.calls[0][0];
      const newStartDate = new Date('2024-05-10T12:00:00.000Z');
      const newEndDate = new Date('2024-05-11T12:00:00.000Z');

      act(() => {
        initialPreviewProps.setAllDayChecked(true);
        initialPreviewProps.setEventStartDate(newStartDate);
        initialPreviewProps.setEventEndDate(newEndDate);
      });

      const updatedPreviewProps = MockPreviewModal.mock.calls[1][0];
      await act(async () => {
        await updatedPreviewProps.handleEventUpdate();
      });

      expect(mockUpdateStandaloneEvent).toHaveBeenCalledWith({
        variables: {
          input: {
            id: 'event1',
            startAt: '2024-05-10T00:00:00.000Z',
            endAt: '2024-05-11T23:59:59.999Z',
          },
        },
      });
    });

    test('allows update  of recurring instance when recurrenceRule is present', async () => {
      renderComponent({
        eventListCardProps: {
          ...mockEventListCardProps,
          baseEventId: 'baseEvent1',
          recurrenceRule: {
            recurrenceEndDate: '2025-01-01T00:00:00.000Z',
          },
        },
      });
      const initialPreviewProps = MockPreviewModal.mock.calls[0][0];
      act(() => {
        initialPreviewProps.setFormState({
          ...initialPreviewProps.formState,
          name: 'Updated Name',
        });
      });
      const updatedPreviewProps = MockPreviewModal.mock.calls[1][0];
      await act(async () => {
        await updatedPreviewProps.handleEventUpdate();
      });

      // Modal should open for recurring events
      const confirmButton = screen.getByTestId('confirmUpdateEventBtn');
      await userEvent.click(confirmButton);

      expect(mockUpdateSingleRecurringEvent).toHaveBeenCalledWith({
        variables: {
          input: {
            id: 'event1',
            name: 'Updated Name',
          },
        },
      });
    });

    test('allows update with invalid original end date when allDay is true', async () => {
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
      const updatedPreviewProps = MockPreviewModal.mock.calls[1][0];
      await act(async () => {
        await updatedPreviewProps.handleEventUpdate();
      });
      expect(mockUpdateStandaloneEvent).toHaveBeenCalledWith({
        variables: { input: { id: 'event1', name: 'Updated Name' } },
      });
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
      const updatedPreviewProps = MockPreviewModal.mock.calls[1][0];
      await act(async () => {
        await updatedPreviewProps.handleEventUpdate();
      });
      expect(mockUpdateStandaloneEvent).toHaveBeenCalledWith({
        variables: { input: { id: 'event1', name: 'Updated Name' } },
      });
    });

    test('shows error when start date is invalid and allDay is true', async () => {
      renderComponent();
      const initialPreviewProps = MockPreviewModal.mock.calls[0][0];
      act(() => {
        initialPreviewProps.setAllDayChecked(true);
        initialPreviewProps.setEventStartDate(new Date('invalid date'));
      });
      const updatedPreviewProps = MockPreviewModal.mock.calls[1][0];
      await act(async () => {
        await updatedPreviewProps.handleEventUpdate();
      });
      expect(toast.error).toHaveBeenCalledWith('invalidDate');
    });

    test('shows error when end date is invalid and allDay is true', async () => {
      renderComponent();
      const initialPreviewProps = MockPreviewModal.mock.calls[0][0];
      act(() => {
        initialPreviewProps.setAllDayChecked(true);
        initialPreviewProps.setEventEndDate(new Date('invalid date'));
      });
      const updatedPreviewProps = MockPreviewModal.mock.calls[1][0];
      await act(async () => {
        await updatedPreviewProps.handleEventUpdate();
      });
      expect(toast.error).toHaveBeenCalledWith('invalidDate');
    });

    test('shows error when start date is invalid and allDay is false', async () => {
      renderComponent();
      const initialPreviewProps = MockPreviewModal.mock.calls[0][0];
      act(() => {
        initialPreviewProps.setAllDayChecked(false);
        initialPreviewProps.setEventStartDate(new Date('invalid date'));
      });
      const updatedPreviewProps = MockPreviewModal.mock.calls[1][0];
      await act(async () => {
        await updatedPreviewProps.handleEventUpdate();
      });
      expect(toast.error).toHaveBeenCalledWith('invalidDate');
    });

    test('shows error when end date is invalid and allDay is false', async () => {
      renderComponent();
      const initialPreviewProps = MockPreviewModal.mock.calls[0][0];
      act(() => {
        initialPreviewProps.setAllDayChecked(false);
        initialPreviewProps.setEventEndDate(new Date('invalid date'));
      });
      const updatedPreviewProps = MockPreviewModal.mock.calls[1][0];
      await act(async () => {
        await updatedPreviewProps.handleEventUpdate();
      });
      expect(toast.error).toHaveBeenCalledWith('invalidDate');
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
      const updatedPreviewProps = MockPreviewModal.mock.calls[1][0];
      await act(async () => {
        await updatedPreviewProps.handleEventUpdate();
      });
      expect(toast.error).toHaveBeenCalledWith('invalidDate');
    });

    test('handles invalid startDate in hasOnlyNameOrDescriptionChanged', async () => {
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
      const updatedPreviewProps = MockPreviewModal.mock.calls[1][0];
      await act(async () => {
        await updatedPreviewProps.handleEventUpdate();
      });
      expect(mockUpdateStandaloneEvent).toHaveBeenCalledWith({
        variables: {
          input: {
            id: 'event1',
            name: 'Updated Name',
          },
        },
      });
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
      eventListCardProps: {
        ...mockEventListCardProps,
        isRecurringTemplate: false,
        baseEventId: 'baseEvent1',
      },
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
      eventListCardProps: {
        ...mockEventListCardProps,
        isRecurringTemplate: false,
        baseEventId: 'baseEvent1',
      },
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
      eventListCardProps: {
        ...mockEventListCardProps,
        isRecurringTemplate: false,
        baseEventId: 'baseEvent1',
      },
    });
    const deleteProps = MockDeleteModal.mock.calls[0][0];

    await act(async () => {
      await deleteProps.deleteEventHandler('all');
    });

    expect(mockDeleteEntireSeries).toHaveBeenCalledWith({
      variables: { input: { id: 'baseEvent1' } },
    });
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
    const updatedPreviewProps = MockPreviewModal.mock.calls[1][0];

    await act(async () => {
      await updatedPreviewProps.handleEventUpdate();
    });

    expect(errorHandler).toHaveBeenCalledWith(expect.any(Function), error);
  });

  describe('updateOption logic', () => {
    test('switches to "following" when recurrence changes, making "single" invalid', async () => {
      const recurringEventProps = {
        ...mockEventListCardProps,
        baseEventId: 'baseEvent1',
        recurrenceRule: {
          frequency: Frequency.WEEKLY,
          interval: 1,
          byDay: ['MO'],
        },
      };
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
      const updatedPreviewProps = MockPreviewModal.mock.calls[1][0];

      // Now, open the update modal to check the result
      await act(async () => {
        await updatedPreviewProps.handleEventUpdate();
      });

      // The 'single' option should be gone, and 'following' should be checked.
      expect(
        screen.queryByLabelText('updateThisInstance'),
      ).not.toBeInTheDocument();
      const followingRadio = screen.getByLabelText('updateThisAndFollowing');
      expect(followingRadio).toBeChecked();
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
          eventListCardProps: {
            ...mockEventListCardProps,
            isRecurringTemplate: false,
            baseEventId: 'baseEvent1',
            recurrenceDescription: description,
          },
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
        const followingRadio = screen.getByLabelText('updateThisAndFollowing');
        await userEvent.click(followingRadio);

        const confirmButton = screen.getByTestId('confirmUpdateEventBtn');
        await userEvent.click(confirmButton);

        expect(mockUpdateFollowingRecurringEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            variables: expect.objectContaining({
              input: expect.objectContaining({}),
            }),
          }),
        );
      });
    });
  });
});
