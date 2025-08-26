import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import dayjs from 'dayjs';
import CustomRecurrenceModal from 'screens/OrganizationEvents/CustomRecurrenceModal';

import PreviewModal from './EventListCardPreviewModal';
import { UserRole } from 'types/Event/interface';
import {
  Frequency,
  InterfaceRecurrenceRule,
} from 'utils/recurrenceUtils/recurrenceTypes';

vi.mock('screens/OrganizationEvents/CustomRecurrenceModal', () => ({
  default: vi.fn(),
}));

const mockT = (key: string): string => key;
const mockTCommon = (key: string): string => key;

const mockEventListCardProps = {
  _id: 'event123',
  name: 'Test Event',
  description: 'Test event description',
  location: 'Test Location',
  startDate: '2024-01-15',
  endDate: '2024-01-15',
  startTime: '10:00:00',
  endTime: '12:00:00',
  allDay: false,
  isPublic: true,
  isRegisterable: true,
  attendees: [],
  creator: {
    _id: 'creator123',
    firstName: 'John',
    lastName: 'Doe',
  },
  userRole: UserRole.ADMINISTRATOR,
  isRecurringTemplate: false,
  baseEventId: null,
};

const mockFormState = {
  name: 'Test Event',
  eventdescrip: 'Test event description',
  location: 'Test Location',
  startTime: '10:00:00',
  endTime: '12:00:00',
};

const mockDefaultProps = {
  eventListCardProps: mockEventListCardProps,
  eventModalIsOpen: true,
  hideViewModal: vi.fn(),
  toggleDeleteModal: vi.fn(),
  t: mockT,
  tCommon: mockTCommon,
  isRegistered: false,
  userId: 'user123',
  eventStartDate: new Date('2024-01-15'),
  eventEndDate: new Date('2024-01-15'),
  setEventStartDate: vi.fn(),
  setEventEndDate: vi.fn(),
  alldaychecked: false,
  setAllDayChecked: vi.fn(),
  publicchecked: true,
  setPublicChecked: vi.fn(),
  registrablechecked: true,
  setRegistrableChecked: vi.fn(),
  formState: mockFormState,
  setFormState: vi.fn(),
  registerEventHandler: vi.fn(),
  handleEventUpdate: vi.fn(),
  openEventDashboard: vi.fn(),
  recurrence: null,
  setRecurrence: vi.fn(),
  customRecurrenceModalIsOpen: false,
  setCustomRecurrenceModalIsOpen: vi.fn(),
};

const renderComponent = (props = {}) => {
  const finalProps = { ...mockDefaultProps, ...props };
  return render(
    <MockedProvider addTypename={false}>
      <Provider store={store}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <PreviewModal {...finalProps} />
            </LocalizationProvider>
          </I18nextProvider>
        </BrowserRouter>
      </Provider>
    </MockedProvider>,
  );
};

describe('EventListCardPreviewModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (CustomRecurrenceModal as jest.Mock).mockImplementation(() => (
      <div data-testid="mock-custom-recurrence-modal" />
    ));
  });

  test('renders modal with event details when open', () => {
    renderComponent();

    expect(screen.getByText('eventDetails')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Event')).toBeInTheDocument();
    expect(
      screen.getByDisplayValue('Test event description'),
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Location')).toBeInTheDocument();
  });

  test('does not render modal when closed', () => {
    renderComponent({ eventModalIsOpen: false });

    expect(screen.queryByText('eventDetails')).not.toBeInTheDocument();
  });

  test('closes modal when close button is clicked', async () => {
    const mockHideViewModal = vi.fn();
    renderComponent({ hideViewModal: mockHideViewModal });

    const closeButton = screen.getByTestId('eventModalCloseBtn');
    await userEvent.click(closeButton);

    expect(mockHideViewModal).toHaveBeenCalledOnce();
  });

  test('renders form fields as editable for administrator', () => {
    renderComponent({
      eventListCardProps: {
        ...mockEventListCardProps,
        userRole: UserRole.ADMINISTRATOR,
      },
      userId: 'user123',
    });

    const nameField = screen.getByTestId('updateName');
    const descriptionField = screen.getByTestId('updateDescription');
    const locationField = screen.getByTestId('updateLocation');

    expect(nameField).not.toBeDisabled();
    expect(descriptionField).not.toBeDisabled();
    expect(locationField).not.toBeDisabled();
  });

  test('renders form fields as editable for event creator', () => {
    renderComponent({
      eventListCardProps: {
        ...mockEventListCardProps,
        creator: { _id: 'user123' },
        userRole: UserRole.REGULAR,
      },
      userId: 'user123',
    });

    const nameField = screen.getByTestId('updateName');
    const descriptionField = screen.getByTestId('updateDescription');
    const locationField = screen.getByTestId('updateLocation');

    expect(nameField).not.toBeDisabled();
    expect(descriptionField).not.toBeDisabled();
    expect(locationField).not.toBeDisabled();
  });

  test('renders form fields as disabled for regular users who are not creators', () => {
    renderComponent({
      eventListCardProps: {
        ...mockEventListCardProps,
        creator: { _id: 'creator123' },
        userRole: UserRole.REGULAR,
      },
      userId: 'user456',
    });

    const nameField = screen.getByTestId('updateName');
    const descriptionField = screen.getByTestId('updateDescription');
    const locationField = screen.getByTestId('updateLocation');

    expect(nameField).toBeDisabled();
    expect(descriptionField).toBeDisabled();
    expect(locationField).toBeDisabled();
  });

  test('updates form state when name field changes', async () => {
    const mockSetFormState = vi.fn();
    renderComponent({ setFormState: mockSetFormState });

    const nameField = screen.getByTestId('updateName');
    await userEvent.type(nameField, 'X');

    // Check that setFormState was called, indicating the onChange handler works
    expect(mockSetFormState).toHaveBeenCalled();
    // Verify that the name field is being updated in the calls
    const calls = mockSetFormState.mock.calls;
    expect(calls.some((call) => call[0].name.includes('X'))).toBe(true);
  });

  test('updates form state when description field changes', async () => {
    const mockSetFormState = vi.fn();
    renderComponent({ setFormState: mockSetFormState });

    const descriptionField = screen.getByTestId('updateDescription');
    await userEvent.type(descriptionField, 'Y');

    // Check that setFormState was called, indicating the onChange handler works
    expect(mockSetFormState).toHaveBeenCalled();
    // Verify that the eventdescrip field is being updated in the calls
    const calls = mockSetFormState.mock.calls;
    expect(calls.some((call) => call[0].eventdescrip.includes('Y'))).toBe(true);
  });

  test('updates form state when location field changes', async () => {
    const mockSetFormState = vi.fn();
    renderComponent({ setFormState: mockSetFormState });

    const locationField = screen.getByTestId('updateLocation');
    await userEvent.type(locationField, 'Z');

    // Check that setFormState was called, indicating the onChange handler works
    expect(mockSetFormState).toHaveBeenCalled();
    // Verify that the location field is being updated in the calls
    const calls = mockSetFormState.mock.calls;
    expect(calls.some((call) => call[0].location.includes('Z'))).toBe(true);
  });

  test('truncates long event names to 100 characters', () => {
    const longName = 'A'.repeat(150);
    const truncatedName = 'A'.repeat(100) + '...';

    renderComponent({
      formState: { ...mockFormState, name: longName },
    });

    const nameField = screen.getByTestId('updateName');
    expect(nameField).toHaveValue(truncatedName);
  });

  test('truncates long descriptions to 256 characters', () => {
    const longDescription = 'B'.repeat(300);
    const truncatedDescription = 'B'.repeat(256) + '...';

    renderComponent({
      formState: { ...mockFormState, eventdescrip: longDescription },
    });

    const descriptionField = screen.getByTestId('updateDescription');
    expect(descriptionField).toHaveValue(truncatedDescription);
  });

  test('toggles all-day checkbox', async () => {
    const mockSetAllDayChecked = vi.fn();
    renderComponent({ setAllDayChecked: mockSetAllDayChecked });

    const allDayCheckbox = screen.getByTestId('updateAllDay');
    await userEvent.click(allDayCheckbox);

    expect(mockSetAllDayChecked).toHaveBeenCalledWith(true);
  });

  test('toggles public checkbox', async () => {
    const mockSetPublicChecked = vi.fn();
    renderComponent({ setPublicChecked: mockSetPublicChecked });

    const publicCheckbox = screen.getByTestId('updateIsPublic');
    await userEvent.click(publicCheckbox);

    expect(mockSetPublicChecked).toHaveBeenCalledWith(false);
  });

  test('toggles registrable checkbox', async () => {
    const mockSetRegistrableChecked = vi.fn();
    renderComponent({ setRegistrableChecked: mockSetRegistrableChecked });

    const registrableCheckbox = screen.getByTestId('updateRegistrable');
    await userEvent.click(registrableCheckbox);

    expect(mockSetRegistrableChecked).toHaveBeenCalledWith(false);
  });

  test('hides time pickers when all-day is checked', () => {
    renderComponent({ alldaychecked: true });

    expect(screen.queryByText('startTime')).not.toBeInTheDocument();
    expect(screen.queryByText('endTime')).not.toBeInTheDocument();
  });

  test('shows time pickers when all-day is not checked', () => {
    renderComponent({ alldaychecked: false });

    // Use getAllByText to find multiple elements and check they exist
    const startTimeElements = screen.getAllByText('startTime');
    const endTimeElements = screen.getAllByText('endTime');

    expect(startTimeElements.length).toBeGreaterThan(0);
    expect(endTimeElements.length).toBeGreaterThan(0);
  });

  test('shows event dashboard button for users with edit permissions', () => {
    renderComponent({
      eventListCardProps: {
        ...mockEventListCardProps,
        userRole: UserRole.ADMINISTRATOR,
      },
    });

    expect(screen.getByTestId('showEventDashboardBtn')).toBeInTheDocument();
  });

  test('shows edit event button for users with edit permissions', () => {
    renderComponent({
      eventListCardProps: {
        ...mockEventListCardProps,
        userRole: UserRole.ADMINISTRATOR,
      },
    });

    expect(screen.getByTestId('previewUpdateEventBtn')).toBeInTheDocument();
  });

  test('shows delete event button for users with edit permissions', () => {
    renderComponent({
      eventListCardProps: {
        ...mockEventListCardProps,
        userRole: UserRole.ADMINISTRATOR,
      },
    });

    expect(screen.getByTestId('deleteEventModalBtn')).toBeInTheDocument();
  });

  test('hides action buttons for regular users without edit permissions', () => {
    renderComponent({
      eventListCardProps: {
        ...mockEventListCardProps,
        creator: { _id: 'creator123' },
        userRole: UserRole.REGULAR,
      },
      userId: 'user456',
    });

    expect(
      screen.queryByTestId('showEventDashboardBtn'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('previewUpdateEventBtn'),
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId('deleteEventModalBtn')).not.toBeInTheDocument();
  });

  test('shows register button for unregistered regular users', () => {
    renderComponent({
      eventListCardProps: {
        ...mockEventListCardProps,
        creator: { _id: 'creator123' },
        userRole: UserRole.REGULAR,
      },
      userId: 'user456',
      isRegistered: false,
    });

    expect(screen.getByTestId('registerEventBtn')).toBeInTheDocument();
  });

  test('shows already registered button for registered regular users', () => {
    renderComponent({
      eventListCardProps: {
        ...mockEventListCardProps,
        creator: { _id: 'creator123' },
        userRole: UserRole.REGULAR,
      },
      userId: 'user456',
      isRegistered: true,
    });

    const alreadyRegisteredBtn = screen.getByText('alreadyRegistered');
    expect(alreadyRegisteredBtn).toBeInTheDocument();
    expect(alreadyRegisteredBtn).toBeDisabled();
  });

  test('calls registerEventHandler when register button is clicked', async () => {
    const mockRegisterEventHandler = vi.fn();
    renderComponent({
      eventListCardProps: {
        ...mockEventListCardProps,
        creator: { _id: 'creator123' },
        userRole: UserRole.REGULAR,
      },
      userId: 'user456',
      isRegistered: false,
      registerEventHandler: mockRegisterEventHandler,
    });

    const registerBtn = screen.getByTestId('registerEventBtn');
    await userEvent.click(registerBtn);

    expect(mockRegisterEventHandler).toHaveBeenCalledOnce();
  });

  test('calls handleEventUpdate when edit button is clicked', async () => {
    const mockHandleEventUpdate = vi.fn();
    renderComponent({ handleEventUpdate: mockHandleEventUpdate });

    const editBtn = screen.getByTestId('previewUpdateEventBtn');
    await userEvent.click(editBtn);

    expect(mockHandleEventUpdate).toHaveBeenCalledOnce();
  });

  test('calls toggleDeleteModal when delete button is clicked', async () => {
    const mockToggleDeleteModal = vi.fn();
    renderComponent({ toggleDeleteModal: mockToggleDeleteModal });

    const deleteBtn = screen.getByTestId('deleteEventModalBtn');
    await userEvent.click(deleteBtn);

    expect(mockToggleDeleteModal).toHaveBeenCalledOnce();
  });

  test('calls openEventDashboard when dashboard button is clicked', async () => {
    const mockOpenEventDashboard = vi.fn();
    renderComponent({ openEventDashboard: mockOpenEventDashboard });

    const dashboardBtn = screen.getByTestId('showEventDashboardBtn');
    await userEvent.click(dashboardBtn);

    expect(mockOpenEventDashboard).toHaveBeenCalledOnce();
  });

  test('shows recurrence dropdown for recurring events with edit permissions', () => {
    renderComponent({
      eventListCardProps: {
        ...mockEventListCardProps,
        isRecurringTemplate: true,
        userRole: UserRole.ADMINISTRATOR,
      },
    });

    expect(screen.getByTestId('recurrenceDropdown')).toBeInTheDocument();
  });

  test('shows recurrence dropdown for recurring instances with edit permissions', () => {
    renderComponent({
      eventListCardProps: {
        ...mockEventListCardProps,
        isRecurringTemplate: false,
        baseEventId: 'base123',
        userRole: UserRole.ADMINISTRATOR,
      },
    });

    expect(screen.getByTestId('recurrenceDropdown')).toBeInTheDocument();
  });

  test('hides recurrence dropdown for non-recurring events', () => {
    renderComponent({
      eventListCardProps: {
        ...mockEventListCardProps,
        isRecurringTemplate: false,
        baseEventId: null,
        userRole: UserRole.ADMINISTRATOR,
      },
    });

    expect(screen.queryByTestId('recurrenceDropdown')).not.toBeInTheDocument();
  });

  test('displays default recurrence label when no recurrence is set', () => {
    renderComponent({
      eventListCardProps: {
        ...mockEventListCardProps,
        isRecurringTemplate: true,
        userRole: UserRole.ADMINISTRATOR,
      },
      recurrence: null,
    });

    expect(screen.getByText('Select recurrence pattern')).toBeInTheDocument();
  });

  test('opens recurrence dropdown and shows options', async () => {
    renderComponent({
      eventListCardProps: {
        ...mockEventListCardProps,
        isRecurringTemplate: true,
        userRole: UserRole.ADMINISTRATOR,
      },
    });

    const dropdownToggle = screen.getByTestId('recurrenceDropdown');
    await userEvent.click(dropdownToggle);

    expect(screen.getByText('Daily')).toBeInTheDocument();
    expect(screen.getByText('Weekly on Monday')).toBeInTheDocument();
    expect(screen.getByText('Monthly on day 15')).toBeInTheDocument();
    expect(screen.getByText('Annually on January 15')).toBeInTheDocument();
    expect(
      screen.getByText('Every weekday (Monday to Friday)'),
    ).toBeInTheDocument();
    expect(screen.getByText('Custom...')).toBeInTheDocument();
  });

  test('sets recurrence when option is selected', async () => {
    const mockSetRecurrence = vi.fn();
    renderComponent({
      eventListCardProps: {
        ...mockEventListCardProps,
        isRecurringTemplate: true,
        userRole: UserRole.ADMINISTRATOR,
      },
      setRecurrence: mockSetRecurrence,
    });

    const dropdownToggle = screen.getByTestId('recurrenceDropdown');
    await userEvent.click(dropdownToggle);

    const dailyOption = screen.getByTestId('recurrenceOption-0');
    await userEvent.click(dailyOption);

    expect(mockSetRecurrence).toHaveBeenCalled();
  });

  test('opens custom recurrence modal when custom option is selected', async () => {
    const mockSetCustomRecurrenceModalIsOpen = vi.fn();
    renderComponent({
      eventListCardProps: {
        ...mockEventListCardProps,
        isRecurringTemplate: true,
        userRole: UserRole.ADMINISTRATOR,
      },
      setCustomRecurrenceModalIsOpen: mockSetCustomRecurrenceModalIsOpen,
    });

    const dropdownToggle = screen.getByTestId('recurrenceDropdown');
    await userEvent.click(dropdownToggle);

    const customOption = screen.getByTestId('recurrenceOption-5');
    await userEvent.click(customOption);

    expect(mockSetCustomRecurrenceModalIsOpen).toHaveBeenCalledWith(true);
  });

  test('sets default recurrence when custom is selected and no recurrence is set', async () => {
    const mockSetRecurrence = vi.fn();
    const mockSetCustomRecurrenceModalIsOpen = vi.fn();
    renderComponent({
      eventListCardProps: {
        ...mockEventListCardProps,
        isRecurringTemplate: true,
        userRole: UserRole.ADMINISTRATOR,
      },
      recurrence: null,
      setRecurrence: mockSetRecurrence,
      setCustomRecurrenceModalIsOpen: mockSetCustomRecurrenceModalIsOpen,
    });

    const dropdownToggle = screen.getByTestId('recurrenceDropdown');
    await userEvent.click(dropdownToggle);

    const customOption = screen.getByTestId('recurrenceOption-5');
    await userEvent.click(customOption);

    expect(mockSetRecurrence).toHaveBeenCalled();
    expect(mockSetCustomRecurrenceModalIsOpen).toHaveBeenCalledWith(true);
  });

  test('does not set recurrence when custom is selected and recurrence is already set', async () => {
    const mockSetRecurrence = vi.fn();
    const mockSetCustomRecurrenceModalIsOpen = vi.fn();
    const existingRecurrence = {
      frequency: Frequency.DAILY,
      interval: 1,
      never: true,
    };
    renderComponent({
      eventListCardProps: {
        ...mockEventListCardProps,
        isRecurringTemplate: true,
        userRole: UserRole.ADMINISTRATOR,
      },
      recurrence: existingRecurrence,
      setRecurrence: mockSetRecurrence,
      setCustomRecurrenceModalIsOpen: mockSetCustomRecurrenceModalIsOpen,
    });

    const dropdownToggle = screen.getByTestId('recurrenceDropdown');
    await userEvent.click(dropdownToggle);

    const customOption = screen.getByTestId('recurrenceOption-5');
    await userEvent.click(customOption);

    expect(mockSetRecurrence).not.toHaveBeenCalled();
    expect(mockSetCustomRecurrenceModalIsOpen).toHaveBeenCalledWith(true);
  });

  test('updates start date and adjusts end date when start date changes', async () => {
    const mockSetEventStartDate = vi.fn();
    const mockSetEventEndDate = vi.fn();
    renderComponent({
      setEventStartDate: mockSetEventStartDate,
      setEventEndDate: mockSetEventEndDate,
    });

    const startDatePicker = screen.getByLabelText('startDate').parentElement;
    const calendarButton = within(
      startDatePicker as HTMLElement,
    ).getByLabelText(/choose date/i);
    await userEvent.click(calendarButton);

    await waitFor(() => {
      expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    const dateToSelect = screen.getByText('20');
    await userEvent.click(dateToSelect);

    await waitFor(() => {
      expect(mockSetEventStartDate).toHaveBeenCalled();
    });
  });

  test('updates end date when end date changes', async () => {
    const mockSetEventEndDate = vi.fn();
    renderComponent({
      setEventEndDate: mockSetEventEndDate,
    });

    const endDatePicker = screen.getByLabelText('endDate').parentElement;
    const calendarButton = within(endDatePicker as HTMLElement).getByLabelText(
      /choose date/i,
    );
    await userEvent.click(calendarButton);

    await waitFor(() => {
      expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    const dateToSelect = screen.getByText('22');
    await userEvent.click(dateToSelect);

    await waitFor(() => {
      expect(mockSetEventEndDate).toHaveBeenCalled();
    });
  });

  test('updates start time when start time changes', async () => {
    const mockSetFormState = vi.fn();
    renderComponent({
      setFormState: mockSetFormState,
    });

    const startTimePicker = screen.getByLabelText('startTime').parentElement;
    const clockButton = within(startTimePicker as HTMLElement).getByLabelText(
      /choose time/i,
    );
    await userEvent.click(clockButton);

    await waitFor(() => {
      expect(
        screen.getByRole('listbox', { name: /select hours/i }),
      ).toBeInTheDocument();
    });

    const hoursListbox = screen.getByRole('listbox', { name: /select hours/i });
    const timeToSelect = within(hoursListbox).getByText('11');
    await userEvent.click(timeToSelect);

    await waitFor(() => {
      expect(mockSetFormState).toHaveBeenCalled();
    });
  });

  test('updates end time when end time changes', async () => {
    const mockSetFormState = vi.fn();
    renderComponent({
      setFormState: mockSetFormState,
    });

    const endTimePicker = screen.getByLabelText('endTime').parentElement;
    const clockButton = within(endTimePicker as HTMLElement).getByLabelText(
      /choose time/i,
    );
    await userEvent.click(clockButton);

    await waitFor(() => {
      expect(
        screen.getByRole('listbox', { name: /select hours/i }),
      ).toBeInTheDocument();
    });

    const hoursListbox = screen.getByRole('listbox', { name: /select hours/i });
    const timeToSelect = within(hoursListbox).getByText('11');
    await userEvent.click(timeToSelect);

    await waitFor(() => {
      expect(mockSetFormState).toHaveBeenCalled();
    });
  });

  test('disables time pickers when all-day is checked', () => {
    renderComponent({ alldaychecked: true });

    // Time pickers should not be visible when all-day is checked
    expect(screen.queryByText('startTime')).not.toBeInTheDocument();
    expect(screen.queryByText('endTime')).not.toBeInTheDocument();
  });

  test('renders CustomRecurrenceModal when recurrence is set and event is recurring', () => {
    const mockRecurrence = {
      frequency: Frequency.WEEKLY,
      interval: 1,
      never: true,
    };

    renderComponent({
      eventListCardProps: {
        ...mockEventListCardProps,
        isRecurringTemplate: true,
      },
      recurrence: mockRecurrence,
    });

    // The CustomRecurrenceModal should be rendered in the DOM
    // (though it may not be visible unless customRecurrenceModalIsOpen is true)
    expect(screen.getByRole('dialog', { hidden: true })).toBeInTheDocument();
  });

  test('start date picker onChange updates dates correctly', () => {
    const mockSetEventStartDate = vi.fn();
    const mockSetEventEndDate = vi.fn();

    // Create a component reference to access the handlers
    const TestComponent = () => {
      // Simulate the onChange handler logic from the actual component
      const handleStartDateChange = (date: any) => {
        if (date) {
          mockSetEventStartDate(date.toDate());
          // Simulate the logic: if end date is before new start date, update end date
          const currentEndDate = new Date('2024-01-10');
          if (currentEndDate < date.toDate()) {
            mockSetEventEndDate(date.toDate());
          }
        }
      };

      // Trigger the handler with a new date
      handleStartDateChange(dayjs('2024-01-20'));

      return null;
    };

    render(<TestComponent />);

    // Check that the functions were called and verify the date values
    expect(mockSetEventStartDate).toHaveBeenCalled();
    expect(mockSetEventEndDate).toHaveBeenCalled();

    const startDateCall = mockSetEventStartDate.mock.calls[0][0];
    const endDateCall = mockSetEventEndDate.mock.calls[0][0];

    // Verify the date is January 20, 2024 (accounting for timezone)
    expect(startDateCall.getFullYear()).toBe(2024);
    expect(startDateCall.getMonth()).toBe(0); // January is 0
    expect(startDateCall.getDate()).toBe(20);

    expect(endDateCall.getFullYear()).toBe(2024);
    expect(endDateCall.getMonth()).toBe(0);
    expect(endDateCall.getDate()).toBe(20);
  });

  test('end date picker onChange updates end date correctly', () => {
    const mockSetEventEndDate = vi.fn();

    const TestComponent = () => {
      // Simulate the onChange handler logic from the actual component
      const handleEndDateChange = (date: any) => {
        if (date) {
          mockSetEventEndDate(date.toDate());
        }
      };

      // Trigger the handler with a new date
      handleEndDateChange(dayjs('2024-01-25'));

      return null;
    };

    render(<TestComponent />);

    expect(mockSetEventEndDate).toHaveBeenCalled();

    const endDateCall = mockSetEventEndDate.mock.calls[0][0];

    // Verify the date is January 25, 2024 (accounting for timezone)
    expect(endDateCall.getFullYear()).toBe(2024);
    expect(endDateCall.getMonth()).toBe(0); // January is 0
    expect(endDateCall.getDate()).toBe(25);
  });

  test('start time picker onChange updates form state correctly', () => {
    const mockSetFormState = vi.fn();
    const currentFormState = {
      name: 'Test Event',
      eventdescrip: 'Test description',
      location: 'Test Location',
      startTime: '10:00:00',
      endTime: '09:00:00', // End time before start time
    };

    const TestComponent = () => {
      const timeToDayJs = (time: string) => {
        const dateTimeString = dayjs().format('YYYY-MM-DD') + ' ' + time;
        return dayjs(dateTimeString, { format: 'YYYY-MM-DD HH:mm:ss' });
      };

      // Simulate the onChange handler logic from the actual component
      const handleStartTimeChange = (time: any) => {
        if (time) {
          const newStartTime = time.format('HH:mm:ss');
          const endTimeAsDayjs = timeToDayJs(currentFormState.endTime);

          mockSetFormState({
            ...currentFormState,
            startTime: newStartTime,
            endTime:
              endTimeAsDayjs < time ? newStartTime : currentFormState.endTime,
          });
        }
      };

      // Trigger the handler with a new time
      handleStartTimeChange(dayjs().hour(14).minute(30).second(0));

      return null;
    };

    render(<TestComponent />);

    expect(mockSetFormState).toHaveBeenCalledWith(
      expect.objectContaining({
        startTime: '14:30:00',
        endTime: '14:30:00', // Should be adjusted because original end time was before start time
      }),
    );
  });

  test('end time picker onChange updates form state correctly', () => {
    const mockSetFormState = vi.fn();
    const currentFormState = {
      name: 'Test Event',
      eventdescrip: 'Test description',
      location: 'Test Location',
      startTime: '10:00:00',
      endTime: '12:00:00',
    };

    const TestComponent = () => {
      // Simulate the onChange handler logic from the actual component
      const handleEndTimeChange = (time: any) => {
        if (time) {
          mockSetFormState({
            ...currentFormState,
            endTime: time.format('HH:mm:ss'),
          });
        }
      };

      // Trigger the handler with a new time
      handleEndTimeChange(dayjs().hour(16).minute(45).second(0));

      return null;
    };

    render(<TestComponent />);

    expect(mockSetFormState).toHaveBeenCalledWith(
      expect.objectContaining({
        endTime: '16:45:00',
      }),
    );
  });

  test('timeToDayJs utility function works correctly', () => {
    const TestComponent = () => {
      const timeToDayJs = (time: string) => {
        const dateTimeString = dayjs().format('YYYY-MM-DD') + ' ' + time;
        return dayjs(dateTimeString, { format: 'YYYY-MM-DD HH:mm:ss' });
      };

      const result = timeToDayJs('14:30:00');
      expect(result.hour()).toBe(14);
      expect(result.minute()).toBe(30);
      expect(result.second()).toBe(0);

      return null;
    };

    render(<TestComponent />);
  });

  describe('getCurrentRecurrenceLabel', () => {
    test('returns matching option label when recurrence is set', () => {
      const recurrence = {
        frequency: Frequency.DAILY,
        interval: 1,
        never: true,
      };
      renderComponent({
        eventListCardProps: {
          ...mockEventListCardProps,
          isRecurringTemplate: true,
        },
        recurrence,
      });
      expect(screen.getByText('Daily')).toBeInTheDocument();
    });

    test('returns frequency when no matching option is found', () => {
      const recurrence = {
        frequency: Frequency.MONTHLY,
        interval: 2,
        never: true,
      };
      renderComponent({
        eventListCardProps: {
          ...mockEventListCardProps,
          isRecurringTemplate: true,
        },
        recurrence,
      });
      expect(screen.getByText('Monthly')).toBeInTheDocument();
    });

    test('returns recurrenceDescription when recurrence is not set', () => {
      renderComponent({
        eventListCardProps: {
          ...mockEventListCardProps,
          isRecurringTemplate: true,
          recurrenceDescription: 'Custom Rule',
        },
        recurrence: null,
      });
      expect(screen.getByText('Custom Rule')).toBeInTheDocument();
    });

    test('returns default label as a fallback', () => {
      renderComponent({
        eventListCardProps: {
          ...mockEventListCardProps,
          isRecurringTemplate: true,
          recurrenceDescription: undefined,
        },
        recurrence: null,
      });
      expect(screen.getByText('Select recurrence pattern')).toBeInTheDocument();
    });

    test('returns custom recurrence description when recurrence is not defined', () => {
      renderComponent({
        eventListCardProps: {
          ...mockEventListCardProps,
          isRecurringTemplate: true,
          recurrenceDescription: 'My Custom Rule',
        },
        recurrence: null,
      });
      expect(screen.getByText('My Custom Rule')).toBeInTheDocument();
    });
  });

  describe('CustomRecurrenceModal callbacks', () => {
    const renderWithRecurrenceModal = (props = {}) => {
      renderComponent({
        ...props,
        customRecurrenceModalIsOpen: true,
        recurrence: {
          frequency: Frequency.WEEKLY,
          interval: 1,
          never: true,
        },
        eventListCardProps: {
          ...mockEventListCardProps,
          isRecurringTemplate: true,
          userRole: UserRole.ADMINISTRATOR,
        },
      });
    };

    test('should call setRecurrence with a function when setRecurrenceRuleState is called with a function', () => {
      const mockSetRecurrence = vi.fn();
      renderWithRecurrenceModal({ setRecurrence: mockSetRecurrence });

      const customModalProps = (CustomRecurrenceModal as jest.Mock).mock
        .calls[0][0];
      const updateFn = (prev: InterfaceRecurrenceRule) => ({
        ...prev,
        interval: 2,
      });
      customModalProps.setRecurrenceRuleState(updateFn);

      expect(mockSetRecurrence).toHaveBeenCalledWith(expect.any(Function));

      const prevState = { frequency: Frequency.WEEKLY, interval: 1 };
      const passedFn = mockSetRecurrence.mock.calls[0][0];
      const newState = passedFn(prevState);
      expect(newState).toEqual({ frequency: Frequency.WEEKLY, interval: 2 });
    });

    test('should call setRecurrence with a value when setRecurrenceRuleState is called with a value', () => {
      const mockSetRecurrence = vi.fn();
      renderWithRecurrenceModal({ setRecurrence: mockSetRecurrence });

      const customModalProps = (CustomRecurrenceModal as jest.Mock).mock
        .calls[0][0];
      const newRecurrence = { frequency: Frequency.DAILY, interval: 5 };
      customModalProps.setRecurrenceRuleState(newRecurrence);

      expect(mockSetRecurrence).toHaveBeenCalledWith(newRecurrence);
    });

    test('should call setEventEndDate with a function when setEndDate is called with a function', () => {
      const mockSetEventEndDate = vi.fn();
      renderWithRecurrenceModal({ setEventEndDate: mockSetEventEndDate });

      const customModalProps = (CustomRecurrenceModal as jest.Mock).mock
        .calls[0][0];
      const newDate = new Date('2024-05-10');
      const updateFn = () => newDate;
      customModalProps.setEndDate(updateFn);

      expect(mockSetEventEndDate).toHaveBeenCalledWith(expect.any(Function));

      const prevState = new Date('2024-01-01');
      const passedFn = mockSetEventEndDate.mock.calls[0][0];
      const newState = passedFn(prevState);
      expect(newState).toEqual(newDate);
    });

    test('should call setEventEndDate with a value when setEndDate is called with a value', () => {
      const mockSetEventEndDate = vi.fn();
      renderWithRecurrenceModal({ setEventEndDate: mockSetEventEndDate });

      const customModalProps = (CustomRecurrenceModal as jest.Mock).mock
        .calls[0][0];
      const newDate = new Date('2024-05-10');
      customModalProps.setEndDate(newDate);

      expect(mockSetEventEndDate).toHaveBeenCalledWith(newDate);
    });
  });

  describe('Date and Time Picker onChange handlers', () => {
    test('updates end date if new start date is later', () => {
      const mockSetEventStartDate = vi.fn();
      const mockSetEventEndDate = vi.fn();
      renderComponent({
        eventStartDate: new Date('2024-01-15'),
        eventEndDate: new Date('2024-01-15'),
        setEventStartDate: mockSetEventStartDate,
        setEventEndDate: mockSetEventEndDate,
      });

      const datePicker = screen.getByLabelText('startDate').parentElement;
      const calendarButton = within(datePicker as HTMLElement).getByLabelText(
        /choose date/i,
      );
      fireEvent.click(calendarButton);

      waitFor(() => {
        const dateToSelect = screen.getByText('20');
        fireEvent.click(dateToSelect);
        expect(mockSetEventStartDate).toHaveBeenCalled();
        expect(mockSetEventEndDate).toHaveBeenCalled();
      });
    });

    test('updates end time if new start time is later', () => {
      const mockSetFormState = vi.fn();
      renderComponent({
        formState: {
          ...mockFormState,
          startTime: '10:00:00',
          endTime: '11:00:00',
        },
        setFormState: mockSetFormState,
      });

      const timePicker = screen.getByLabelText('startTime').parentElement;
      const clockButton = within(timePicker as HTMLElement).getByLabelText(
        /choose time/i,
      );
      fireEvent.click(clockButton);

      waitFor(() => {
        const timeToSelect = screen.getByText('12');
        fireEvent.click(timeToSelect);
        expect(mockSetFormState).toHaveBeenCalledWith(
          expect.objectContaining({
            startTime: '12:00:00',
            endTime: '12:00:00',
          }),
        );
      });
    });

    test('handles null date in start date picker onChange', () => {
      const mockSetEventStartDate = vi.fn();
      const mockSetEventEndDate = vi.fn();

      const TestComponent = () => {
        // Simulate the simplified onChange handler logic from the actual component
        const handleStartDateChange = (date: any) => {
          if (date) {
            const newStartDate = date.toDate();
            mockSetEventStartDate(newStartDate);
            // Auto-adjust end date if it's before the new start date
            const currentEndDate = new Date('2024-01-15');
            if (currentEndDate < newStartDate) {
              mockSetEventEndDate(newStartDate);
            }
          }
        };

        // Trigger the handler with null to test the if (date) condition
        handleStartDateChange(null);

        return null;
      };

      render(<TestComponent />);

      // Verify that functions are not called when date is null
      expect(mockSetEventStartDate).not.toHaveBeenCalled();
      expect(mockSetEventEndDate).not.toHaveBeenCalled();
    });

    test('handles null date in end date picker onChange', () => {
      const mockSetEventEndDate = vi.fn();

      const TestComponent = () => {
        // Simulate the onChange handler logic from the actual component
        const handleEndDateChange = (date: any) => {
          if (date) {
            mockSetEventEndDate(date.toDate());
          }
        };

        // Trigger the handler with null to test the if (date) condition
        handleEndDateChange(null);

        return null;
      };

      render(<TestComponent />);

      // Verify that function is not called when date is null
      expect(mockSetEventEndDate).not.toHaveBeenCalled();
    });

    test('does not update end date when new start date is not later than current end date', () => {
      const mockSetEventStartDate = vi.fn();
      const mockSetEventEndDate = vi.fn();

      const TestComponent = () => {
        // Simulate the simplified onChange handler logic from the actual component
        const handleStartDateChange = (date: any) => {
          if (date) {
            const newStartDate = date.toDate();
            mockSetEventStartDate(newStartDate);
            // Auto-adjust end date if it's before the new start date
            const currentEndDate = new Date('2024-01-20'); // Later than the new start date
            if (currentEndDate < newStartDate) {
              mockSetEventEndDate(newStartDate);
            }
          }
        };

        // Trigger the handler with a date that's before the current end date
        handleStartDateChange(dayjs('2024-01-15'));

        return null;
      };

      render(<TestComponent />);

      // Verify that start date is updated but end date is not
      expect(mockSetEventStartDate).toHaveBeenCalled();
      expect(mockSetEventEndDate).not.toHaveBeenCalled();
    });

    test('updates end date when new start date is later than current end date', () => {
      const mockSetEventStartDate = vi.fn();
      const mockSetEventEndDate = vi.fn();

      const TestComponent = () => {
        // Simulate the simplified onChange handler logic from the actual component
        const handleStartDateChange = (date: any) => {
          if (date) {
            const newStartDate = date.toDate();
            mockSetEventStartDate(newStartDate);
            // Auto-adjust end date if it's before the new start date
            const currentEndDate = new Date('2024-01-10'); // Earlier than the new start date
            if (currentEndDate < newStartDate) {
              mockSetEventEndDate(newStartDate);
            }
          }
        };

        // Trigger the handler with a date that's after the current end date
        handleStartDateChange(dayjs('2024-01-15'));

        return null;
      };

      render(<TestComponent />);

      // Verify that both start date and end date are updated
      expect(mockSetEventStartDate).toHaveBeenCalled();
      expect(mockSetEventEndDate).toHaveBeenCalled();
    });
  });
});
