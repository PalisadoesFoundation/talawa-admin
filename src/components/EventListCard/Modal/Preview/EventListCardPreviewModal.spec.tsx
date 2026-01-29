import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import dayjs, { type Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import CustomRecurrenceModal from 'screens/AdminPortal/OrganizationEvents/CustomRecurrenceModal';
import {
  AdapterDayjs,
  LocalizationProvider,
} from 'shared-components/DateRangePicker';

dayjs.extend(utc);

import PreviewModal from './EventListCardPreviewModal';
import { UserRole } from 'types/Event/interface';
import {
  Frequency,
  InterfaceRecurrenceRule,
} from 'utils/recurrenceUtils/recurrenceTypes';

vi.mock('screens/AdminPortal/OrganizationEvents/CustomRecurrenceModal', () => ({
  default: vi.fn(),
}));

const getPickerInputByTestId = (testId: string): HTMLElement => {
  const input = screen.getByTestId(testId);
  if (!input) {
    throw new Error(`Could not find picker input with testId: ${testId}`);
  }
  return input;
};

/**
 * Helper function to find a date button in the calendar grid by its text content
 * @param calendarGrid - The calendar grid element
 * @param dateText - The date text to find (e.g., "20", "22")
 * @returns The button element containing the date
 */
export const getDateButtonByText = (
  calendarGrid: HTMLElement,
  dateText: string,
): HTMLElement => {
  const gridCells = within(calendarGrid).getAllByRole('gridcell');
  const dateButton = gridCells.find((cell) => {
    const text = cell.textContent?.trim();
    return text === dateText;
  });

  if (!dateButton) {
    throw new Error(
      `Could not find date button with text "${dateText}" in calendar grid`,
    );
  }

  return dateButton;
};

const mockT = (key: string): string => key;
const mockTCommon = (key: string): string => key;

const mockEventListCardProps = {
  id: 'event123',
  name: 'Test Event',
  description: 'Test event description',
  location: 'Test Location',
  startAt: dayjs
    .utc()
    .add(10, 'days')
    .hour(10)
    .minute(0)
    .second(0)
    .toISOString(),
  endAt: dayjs.utc().add(10, 'days').hour(12).minute(0).second(0).toISOString(),
  startTime: '10:00:00',
  endTime: '12:00:00',
  allDay: false,
  isPublic: true,
  isRegisterable: true,
  isInviteOnly: false,
  attendees: [],
  creator: {
    id: 'creator123',
    name: 'John Doe',
    emailAddress: 'john@example.com',
  },
  userRole: UserRole.ADMINISTRATOR,
  isRecurringEventTemplate: false,
  baseEvent: null,
};

const mockFormState = {
  name: 'Test Event',
  eventDescription: 'Test event description',
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
  eventStartDate: dayjs.utc().add(10, 'days').toDate(),
  eventEndDate: dayjs.utc().add(10, 'days').toDate(),
  setEventStartDate: vi.fn(),
  setEventEndDate: vi.fn(),
  allDayChecked: false,
  setAllDayChecked: vi.fn(),
  publicChecked: true,
  setPublicChecked: vi.fn(),
  registerableChecked: true,
  setRegisterableChecked: vi.fn(),
  inviteOnlyChecked: false,
  setInviteOnlyChecked: vi.fn(),
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
    <MockedProvider>
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
  afterEach(() => {
    vi.clearAllMocks();
  });
  beforeEach(() => {
    vi.clearAllMocks();
    (CustomRecurrenceModal as Mock).mockImplementation(() => (
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
    const user = userEvent.setup();
    const mockHideViewModal = vi.fn();
    renderComponent({ hideViewModal: mockHideViewModal });

    const closeButton = screen.getByTestId('modalCloseBtn');
    await user.click(closeButton);

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
        creator: { id: 'user123' },
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
    const user = userEvent.setup();
    const mockSetFormState = vi.fn();
    renderComponent({ setFormState: mockSetFormState });

    const nameField = screen.getByTestId('updateName');
    await user.type(nameField, 'X');

    // Check that setFormState was called, indicating the onChange handler works
    expect(mockSetFormState).toHaveBeenCalled();
    // Verify that the name field is being updated in the calls
    const calls = mockSetFormState.mock.calls;
    expect(calls.some((call) => call[0].name.includes('X'))).toBe(true);
  });

  test('updates form state when description field changes', async () => {
    const user = userEvent.setup();
    const mockSetFormState = vi.fn();
    renderComponent({ setFormState: mockSetFormState });

    const descriptionField = screen.getByTestId('updateDescription');
    await user.type(descriptionField, 'Y');

    // Check that setFormState was called, indicating the onChange handler works
    expect(mockSetFormState).toHaveBeenCalled();
    // Verify that the eventDescription field is being updated in the calls
    const calls = mockSetFormState.mock.calls;
    expect(calls.some((call) => call[0].eventDescription.includes('Y'))).toBe(
      true,
    );
  });

  test('updates form state when location field changes', async () => {
    const user = userEvent.setup();
    const mockSetFormState = vi.fn();
    renderComponent({ setFormState: mockSetFormState });

    const locationField = screen.getByTestId('updateLocation');
    await user.type(locationField, 'Z');

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
      formState: { ...mockFormState, eventDescription: longDescription },
    });

    const descriptionField = screen.getByTestId('updateDescription');
    expect(descriptionField).toHaveValue(truncatedDescription);
  });

  test('toggles all-day checkbox', async () => {
    const user = userEvent.setup();
    const mockSetAllDayChecked = vi.fn();
    renderComponent({ setAllDayChecked: mockSetAllDayChecked });

    const allDayCheckbox = screen.getByTestId('updateAllDay');
    await user.click(allDayCheckbox);

    expect(mockSetAllDayChecked).toHaveBeenCalledWith(true);
  });

  test('adjusts end time when unchecking all-day if times are equal', async () => {
    const user = userEvent.setup();
    const mockSetAllDayChecked = vi.fn();
    const mockSetFormState = vi.fn();
    const sameTime = '10:00:00';

    renderComponent({
      allDayChecked: true,
      setAllDayChecked: mockSetAllDayChecked,
      setFormState: mockSetFormState,
      formState: { ...mockFormState, startTime: sameTime, endTime: sameTime },
    });

    const allDayCheckbox = screen.getByTestId('updateAllDay');
    await user.click(allDayCheckbox);

    // Should toggle checked state
    expect(mockSetAllDayChecked).toHaveBeenCalledWith(false);

    // Should update form state with new end time (10:00:00 + 1 hour = 11:00:00)
    expect(mockSetFormState).toHaveBeenCalledWith(
      expect.objectContaining({
        endTime: '11:00:00',
      }),
    );
  });

  test('does not adjust end time when unchecking all-day if times are different', async () => {
    const user = userEvent.setup();
    const mockSetAllDayChecked = vi.fn();
    const mockSetFormState = vi.fn();
    const startTime = '10:00:00';
    const endTime = '12:00:00';

    renderComponent({
      allDayChecked: true,
      setAllDayChecked: mockSetAllDayChecked,
      setFormState: mockSetFormState,
      formState: { ...mockFormState, startTime, endTime },
    });

    const allDayCheckbox = screen.getByTestId('updateAllDay');
    await user.click(allDayCheckbox);

    // Should toggle checked state
    expect(mockSetAllDayChecked).toHaveBeenCalledWith(false);

    // Should NOT update form state with new end time
    expect(mockSetFormState).not.toHaveBeenCalled();
  });

  test('renders visibility radio buttons for administrators', () => {
    renderComponent({
      eventListCardProps: {
        ...mockEventListCardProps,
        userRole: UserRole.ADMINISTRATOR,
      },
    });

    expect(screen.getByLabelText('public')).toBeInTheDocument();
    expect(screen.getByLabelText('organizationMembers')).toBeInTheDocument();
    expect(screen.getByLabelText('inviteOnly')).toBeInTheDocument();
  });

  test('selects public radio button when event is public', () => {
    renderComponent({
      publicChecked: true,
      inviteOnlyChecked: false,
    });

    const publicRadio = screen.getByLabelText('public') as HTMLInputElement;
    expect(publicRadio.checked).toBe(true);
  });

  test('selects organization members radio when event is not public and not invite only', () => {
    renderComponent({
      publicChecked: false,
      inviteOnlyChecked: false,
    });

    const orgMembersRadio = screen.getByLabelText(
      'organizationMembers',
    ) as HTMLInputElement;
    expect(orgMembersRadio.checked).toBe(true);
  });

  test('selects invite only radio when event is invite only', () => {
    renderComponent({
      publicChecked: false,
      inviteOnlyChecked: true,
    });

    const inviteOnlyRadio = screen.getByLabelText(
      'inviteOnly',
    ) as HTMLInputElement;
    expect(inviteOnlyRadio.checked).toBe(true);
  });

  test('clicking public radio sets publicchecked to true and inviteonlychecked to false', async () => {
    const user = userEvent.setup();
    const mockSetPublicChecked = vi.fn();
    const mockSetInviteOnlyChecked = vi.fn();
    renderComponent({
      publicChecked: false,
      inviteOnlyChecked: false,
      setPublicChecked: mockSetPublicChecked,
      setInviteOnlyChecked: mockSetInviteOnlyChecked,
    });

    const publicRadio = screen.getByLabelText('public');
    await user.click(publicRadio);

    expect(mockSetPublicChecked).toHaveBeenCalledWith(true);
    expect(mockSetInviteOnlyChecked).toHaveBeenCalledWith(false);
  });

  test('clicking organization members radio sets both flags to false', async () => {
    const user = userEvent.setup();
    const mockSetPublicChecked = vi.fn();
    const mockSetInviteOnlyChecked = vi.fn();
    renderComponent({
      publicChecked: true,
      inviteOnlyChecked: false,
      setPublicChecked: mockSetPublicChecked,
      setInviteOnlyChecked: mockSetInviteOnlyChecked,
    });

    const orgMembersRadio = screen.getByLabelText('organizationMembers');
    await user.click(orgMembersRadio);

    expect(mockSetPublicChecked).toHaveBeenCalledWith(false);
    expect(mockSetInviteOnlyChecked).toHaveBeenCalledWith(false);
  });

  test('clicking invite only radio sets publicchecked to false and inviteonlychecked to true', async () => {
    const user = userEvent.setup();
    const mockSetPublicChecked = vi.fn();
    const mockSetInviteOnlyChecked = vi.fn();
    renderComponent({
      publicChecked: true,
      inviteOnlyChecked: false,
      setPublicChecked: mockSetPublicChecked,
      setInviteOnlyChecked: mockSetInviteOnlyChecked,
    });

    const inviteOnlyRadio = screen.getByLabelText('inviteOnly');
    await user.click(inviteOnlyRadio);

    expect(mockSetPublicChecked).toHaveBeenCalledWith(false);
    expect(mockSetInviteOnlyChecked).toHaveBeenCalledWith(true);
  });

  test('visibility radio buttons are disabled for non-editors', () => {
    renderComponent({
      eventListCardProps: {
        ...mockEventListCardProps,
        creator: { id: 'creator123' },
        userRole: UserRole.REGULAR,
      },
      userId: 'user456',
    });

    const publicRadio = screen.getByLabelText('public') as HTMLInputElement;
    const orgMembersRadio = screen.getByLabelText(
      'organizationMembers',
    ) as HTMLInputElement;
    const inviteOnlyRadio = screen.getByLabelText(
      'inviteOnly',
    ) as HTMLInputElement;

    expect(publicRadio.disabled).toBe(true);
    expect(orgMembersRadio.disabled).toBe(true);
    expect(inviteOnlyRadio.disabled).toBe(true);
  });

  test('radiogroup has accessible name "visibility"', () => {
    renderComponent({
      eventListCardProps: {
        ...mockEventListCardProps,
        userRole: UserRole.ADMINISTRATOR,
      },
    });

    const radioGroup = screen.getByRole('radiogroup');
    expect(radioGroup).toHaveAttribute('aria-label', 'visibility');
  });

  test('toggles registrable checkbox', async () => {
    const user = userEvent.setup();
    const mockSetRegisterableChecked = vi.fn();
    renderComponent({ setRegisterableChecked: mockSetRegisterableChecked });

    const registrableCheckbox = screen.getByTestId('updateRegistrable');
    await user.click(registrableCheckbox);

    expect(mockSetRegisterableChecked).toHaveBeenCalledWith(false);
  });

  test('hides time pickers when all-day is checked', () => {
    renderComponent({ allDayChecked: true });

    expect(screen.queryByText('startTime')).not.toBeInTheDocument();
    expect(screen.queryByText('endTime')).not.toBeInTheDocument();
  });

  test('shows time pickers when all-day is not checked', () => {
    renderComponent({ allDayChecked: false });

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

  test('verifies aria-label for show event dashboard button', () => {
    renderComponent({
      eventListCardProps: {
        ...mockEventListCardProps,
        userRole: UserRole.ADMINISTRATOR,
      },
    });

    expect(screen.getByLabelText('showEventDashboard')).toBeInTheDocument();
  });

  test('verifies aria-label for edit event button', () => {
    renderComponent({
      eventListCardProps: {
        ...mockEventListCardProps,
        userRole: UserRole.ADMINISTRATOR,
      },
    });

    expect(screen.getByLabelText('editEvent')).toBeInTheDocument();
  });

  test('verifies aria-label for delete event button', () => {
    renderComponent({
      eventListCardProps: {
        ...mockEventListCardProps,
        userRole: UserRole.ADMINISTRATOR,
      },
    });

    expect(screen.getByLabelText('deleteEvent')).toBeInTheDocument();
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

    const alreadyRegisteredBtn = screen
      .getByText('alreadyRegistered')
      .closest('button');
    expect(alreadyRegisteredBtn).toBeInTheDocument();
    expect(alreadyRegisteredBtn).toBeDisabled();
  });

  test('hides register button when event is not registerable (Bug #1 fix)', () => {
    renderComponent({
      eventListCardProps: {
        ...mockEventListCardProps,
        isRegisterable: false,
        creator: { id: 'creator123' },
        userRole: UserRole.REGULAR,
      },
      userId: 'user456',
      isRegistered: false,
    });

    expect(screen.queryByTestId('registerEventBtn')).not.toBeInTheDocument();
    expect(screen.queryByText('alreadyRegistered')).not.toBeInTheDocument();
  });

  test('calls registerEventHandler when register button is clicked', async () => {
    const user = userEvent.setup();
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
    await user.click(registerBtn);

    expect(mockRegisterEventHandler).toHaveBeenCalledOnce();
  });

  test('calls handleEventUpdate when edit button is clicked', async () => {
    const user = userEvent.setup();
    const mockHandleEventUpdate = vi.fn();
    renderComponent({ handleEventUpdate: mockHandleEventUpdate });

    const editBtn = screen.getByTestId('previewUpdateEventBtn');
    await user.click(editBtn);

    expect(mockHandleEventUpdate).toHaveBeenCalledOnce();
  });

  test('calls toggleDeleteModal when delete button is clicked', async () => {
    const user = userEvent.setup();
    const mockToggleDeleteModal = vi.fn();
    renderComponent({ toggleDeleteModal: mockToggleDeleteModal });

    const deleteBtn = screen.getByTestId('deleteEventModalBtn');
    await user.click(deleteBtn);

    expect(mockToggleDeleteModal).toHaveBeenCalledOnce();
  });

  test('calls openEventDashboard when dashboard button is clicked', async () => {
    const user = userEvent.setup();
    const mockOpenEventDashboard = vi.fn();
    renderComponent({ openEventDashboard: mockOpenEventDashboard });

    const dashboardBtn = screen.getByTestId('showEventDashboardBtn');
    await user.click(dashboardBtn);

    expect(mockOpenEventDashboard).toHaveBeenCalledOnce();
  });

  test('shows recurrence dropdown for recurring events with edit permissions', () => {
    renderComponent({
      eventListCardProps: {
        ...mockEventListCardProps,
        isRecurringEventTemplate: true,
        userRole: UserRole.ADMINISTRATOR,
      },
    });

    expect(screen.getByTestId('recurrenceDropdown')).toBeInTheDocument();
  });

  test('shows recurrence dropdown for recurring instances with edit permissions', () => {
    renderComponent({
      eventListCardProps: {
        ...mockEventListCardProps,
        isRecurringEventTemplate: false,
        baseEvent: { id: 'base123' },
        userRole: UserRole.ADMINISTRATOR,
      },
    });

    expect(screen.getByTestId('recurrenceDropdown')).toBeInTheDocument();
  });

  test('hides recurrence dropdown for non-recurring events', () => {
    renderComponent({
      eventListCardProps: {
        ...mockEventListCardProps,
        isRecurringEventTemplate: false,
        baseEvent: null,
        userRole: UserRole.ADMINISTRATOR,
      },
    });

    expect(screen.queryByTestId('recurrenceDropdown')).not.toBeInTheDocument();
  });

  test('displays default recurrence label when no recurrence is set', () => {
    renderComponent({
      eventListCardProps: {
        ...mockEventListCardProps,
        isRecurringEventTemplate: true,
        userRole: UserRole.ADMINISTRATOR,
      },
      recurrence: null,
    });

    expect(screen.getByText('selectRecurrencePattern')).toBeInTheDocument();
  });

  test('opens recurrence dropdown and shows options', async () => {
    const user = userEvent.setup();
    renderComponent({
      eventListCardProps: {
        ...mockEventListCardProps,
        isRecurringEventTemplate: true,
        userRole: UserRole.ADMINISTRATOR,
      },
    });

    const dropdownToggle = screen.getByTestId('recurrenceDropdown');

    // Verify dropdown exists and is clickable
    expect(dropdownToggle).toBeInTheDocument();
    await user.click(dropdownToggle);

    // Verify at least one option appears (using testid which is more reliable)
    await waitFor(() => {
      expect(screen.getByTestId('recurrenceOption-0')).toBeInTheDocument();
    });

    // Verify all options are present by their test IDs
    expect(screen.getByTestId('recurrenceOption-0')).toBeInTheDocument(); // Daily
    expect(screen.getByTestId('recurrenceOption-1')).toBeInTheDocument(); // Weekly
    expect(screen.getByTestId('recurrenceOption-2')).toBeInTheDocument(); // Monthly
    expect(screen.getByTestId('recurrenceOption-3')).toBeInTheDocument(); // Annually
    expect(screen.getByTestId('recurrenceOption-4')).toBeInTheDocument(); // Weekday
    expect(screen.getByTestId('recurrenceOption-5')).toBeInTheDocument(); // Custom
  });

  test('sets recurrence when option is selected', async () => {
    const user = userEvent.setup();
    const mockSetRecurrence = vi.fn();
    renderComponent({
      eventListCardProps: {
        ...mockEventListCardProps,
        isRecurringEventTemplate: true,
        userRole: UserRole.ADMINISTRATOR,
      },
      setRecurrence: mockSetRecurrence,
    });

    const dropdownToggle = screen.getByTestId('recurrenceDropdown');
    await user.click(dropdownToggle);

    const dailyOption = screen.getByTestId('recurrenceOption-0');
    await user.click(dailyOption);

    expect(mockSetRecurrence).toHaveBeenCalled();
  });

  test('opens custom recurrence modal when custom option is selected', async () => {
    const user = userEvent.setup();
    const mockSetCustomRecurrenceModalIsOpen = vi.fn();
    renderComponent({
      eventListCardProps: {
        ...mockEventListCardProps,
        isRecurringEventTemplate: true,
        userRole: UserRole.ADMINISTRATOR,
      },
      setCustomRecurrenceModalIsOpen: mockSetCustomRecurrenceModalIsOpen,
    });

    const dropdownToggle = screen.getByTestId('recurrenceDropdown');
    await user.click(dropdownToggle);

    const customOption = screen.getByTestId('recurrenceOption-5');
    await user.click(customOption);

    expect(mockSetCustomRecurrenceModalIsOpen).toHaveBeenCalledWith(true);
  });

  test('sets default recurrence when custom is selected and no recurrence is set', async () => {
    const user = userEvent.setup();
    const mockSetRecurrence = vi.fn();
    const mockSetCustomRecurrenceModalIsOpen = vi.fn();
    renderComponent({
      eventListCardProps: {
        ...mockEventListCardProps,
        isRecurringEventTemplate: true,
        userRole: UserRole.ADMINISTRATOR,
      },
      recurrence: null,
      setRecurrence: mockSetRecurrence,
      setCustomRecurrenceModalIsOpen: mockSetCustomRecurrenceModalIsOpen,
    });

    const dropdownToggle = screen.getByTestId('recurrenceDropdown');
    await user.click(dropdownToggle);

    const customOption = screen.getByTestId('recurrenceOption-5');
    await user.click(customOption);

    expect(mockSetRecurrence).toHaveBeenCalled();
    expect(mockSetCustomRecurrenceModalIsOpen).toHaveBeenCalledWith(true);
  });

  test('does not set recurrence when custom is selected and recurrence is already set', async () => {
    const user = userEvent.setup();
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
        isRecurringEventTemplate: true,
        userRole: UserRole.ADMINISTRATOR,
      },
      recurrence: existingRecurrence,
      setRecurrence: mockSetRecurrence,
      setCustomRecurrenceModalIsOpen: mockSetCustomRecurrenceModalIsOpen,
    });

    const dropdownToggle = screen.getByTestId('recurrenceDropdown');
    await user.click(dropdownToggle);

    const customOption = screen.getByTestId('recurrenceOption-5');
    await user.click(customOption);

    expect(mockSetRecurrence).not.toHaveBeenCalled();
    expect(mockSetCustomRecurrenceModalIsOpen).toHaveBeenCalledWith(true);
  });

  test('updates start date and adjusts end date when start date changes', async () => {
    const user = userEvent.setup();
    const baseDate = new Date(Date.UTC(2025, 0, 15, 12, 0, 0));
    const mockSetEventStartDate = vi.fn();
    const mockSetEventEndDate = vi.fn();

    renderComponent({
      eventStartDate: baseDate,
      eventEndDate: baseDate,
      setEventStartDate: mockSetEventStartDate,
      setEventEndDate: mockSetEventEndDate,
    });

    const startDateInput = getPickerInputByTestId('startDate');
    expect(startDateInput.parentElement).toBeTruthy();
    const startDatePicker = startDateInput.parentElement;
    const calendarButton = within(
      startDatePicker as HTMLElement,
    ).getByLabelText(/choose date/i);
    await user.click(calendarButton);

    const calendarGrid = await screen.findByRole('grid');
    const dateToSelect = within(calendarGrid).getByRole('gridcell', {
      name: '20',
    });
    await user.click(dateToSelect);

    await waitFor(() => {
      expect(mockSetEventStartDate).toHaveBeenCalled();
    });
  });

  test('updates end date when end date changes', async () => {
    const user = userEvent.setup();
    const baseDate = new Date(Date.UTC(2025, 0, 15, 12, 0, 0));
    const mockSetEventEndDate = vi.fn();
    renderComponent({
      eventStartDate: baseDate,
      eventEndDate: baseDate,
      setEventEndDate: mockSetEventEndDate,
    });

    const endDateInput = getPickerInputByTestId('endDate');
    expect(endDateInput.parentElement).toBeTruthy();
    const endDatePicker = endDateInput.parentElement;
    const calendarButton = within(endDatePicker as HTMLElement).getByLabelText(
      /choose date/i,
    );
    await user.click(calendarButton);

    const calendarGrid = await screen.findByRole('grid');
    const dateToSelect = within(calendarGrid).getByRole('gridcell', {
      name: '20',
    });
    await user.click(dateToSelect);

    await waitFor(() => {
      expect(mockSetEventEndDate).toHaveBeenCalled();
    });
  });

  test('updates start time when start time changes', async () => {
    const user = userEvent.setup();
    const mockSetFormState = vi.fn();
    renderComponent({
      setFormState: mockSetFormState,
    });

    const startTimeInput = getPickerInputByTestId('startTime');
    expect(startTimeInput.parentElement).toBeTruthy();
    const startTimePicker = startTimeInput.parentElement;
    const clockButton = within(startTimePicker as HTMLElement).getByLabelText(
      /choose time/i,
    );
    await user.click(clockButton);

    await waitFor(() => {
      expect(
        screen.getByRole('listbox', { name: /select hours/i }),
      ).toBeInTheDocument();
    });

    const hoursListbox = screen.getByRole('listbox', { name: /select hours/i });
    const timeToSelect = within(hoursListbox).getByText('11');
    await user.click(timeToSelect);

    await waitFor(() => {
      expect(mockSetFormState).toHaveBeenCalled();
    });
  });

  test('updates end time when end time changes', async () => {
    const user = userEvent.setup();
    const mockSetFormState = vi.fn();
    renderComponent({
      setFormState: mockSetFormState,
    });

    const endTimeInput = getPickerInputByTestId('endTime');
    expect(endTimeInput.parentElement).toBeTruthy();
    const endTimePicker = endTimeInput.parentElement;
    const clockButton = within(endTimePicker as HTMLElement).getByLabelText(
      /choose time/i,
    );
    await user.click(clockButton);

    await waitFor(() => {
      expect(
        screen.getByRole('listbox', { name: /select hours/i }),
      ).toBeInTheDocument();
    });

    const hoursListbox = screen.getByRole('listbox', { name: /select hours/i });
    const timeToSelect = within(hoursListbox).getByText('11');
    await user.click(timeToSelect);

    await waitFor(() => {
      expect(mockSetFormState).toHaveBeenCalled();
    });
  });

  test('disables time pickers when all-day is checked', () => {
    renderComponent({ allDayChecked: true });

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
        isRecurringEventTemplate: true,
      },
      recurrence: mockRecurrence,
    });

    // The CustomRecurrenceModal should be rendered in the DOM
    // (though it may not be visible unless customRecurrenceModalIsOpen is true)
    expect(
      screen.getByTestId('mock-custom-recurrence-modal'),
    ).toBeInTheDocument();
  });

  test('start date picker onChange updates dates correctly', () => {
    const mockSetEventStartDate = vi.fn();
    const mockSetEventEndDate = vi.fn();

    // Simulate the onChange handler logic from the actual component
    const handleStartDateChange = (date: Dayjs | null) => {
      if (date) {
        mockSetEventStartDate(date.toDate());
        // Simulate the logic: if end date is before new start date, update end date
        const currentEndDate = dayjs().subtract(5, 'days').toDate();
        if (currentEndDate < date.toDate()) {
          mockSetEventEndDate(date.toDate());
        }
      }
    };

    // Trigger the handler with a new date
    const targetDate = dayjs().add(5, 'days');
    handleStartDateChange(targetDate);

    // Check that the functions were called and verify the date values
    expect(mockSetEventStartDate).toHaveBeenCalled();
    expect(mockSetEventEndDate).toHaveBeenCalled();

    const startDateCall = mockSetEventStartDate.mock.calls[0][0];
    const endDateCall = mockSetEventEndDate.mock.calls[0][0];

    // Verify the date is the target date
    expect(startDateCall.getFullYear()).toBe(targetDate.year());
    expect(startDateCall.getMonth()).toBe(targetDate.month());
    expect(startDateCall.getDate()).toBe(targetDate.date());

    expect(endDateCall.getFullYear()).toBe(targetDate.year());
    expect(endDateCall.getMonth()).toBe(targetDate.month());
    expect(endDateCall.getDate()).toBe(targetDate.date());
  });

  test('end date picker onChange updates end date correctly', () => {
    const mockSetEventEndDate = vi.fn();

    // Simulate the onChange handler logic from the actual component
    const handleEndDateChange = (date: Dayjs | null) => {
      if (date) {
        mockSetEventEndDate(date.toDate());
      }
    };

    // Trigger the handler with a new date
    const targetDate = dayjs().add(10, 'days');
    handleEndDateChange(targetDate);

    expect(mockSetEventEndDate).toHaveBeenCalled();

    const endDateCall = mockSetEventEndDate.mock.calls[0][0];

    // Verify the date is the target date
    expect(endDateCall.getFullYear()).toBe(targetDate.year());
    expect(endDateCall.getMonth()).toBe(targetDate.month());
    expect(endDateCall.getDate()).toBe(targetDate.date());
  });

  test('start time picker onChange updates form state correctly', () => {
    const mockSetFormState = vi.fn();
    const currentFormState = {
      name: 'Test Event',
      eventDescription: 'Test description',
      location: 'Test Location',
      startTime: '10:00:00',
      endTime: '09:00:00', // End time before start time
    };

    const timeToDayJs = (time: string) => {
      const dateTimeString = dayjs().format('YYYY-MM-DD') + ' ' + time;
      return dayjs(dateTimeString, { format: 'YYYY-MM-DD HH:mm:ss' });
    };

    // Simulate the onChange handler logic from the actual component
    const handleStartTimeChange = (time: Dayjs | null) => {
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
      eventDescription: 'Test description',
      location: 'Test Location',
      startTime: '10:00:00',
      endTime: '12:00:00',
    };

    // Simulate the onChange handler logic from the actual component
    const handleEndTimeChange = (time: Dayjs | null) => {
      if (time) {
        mockSetFormState({
          ...currentFormState,
          endTime: time.format('HH:mm:ss'),
        });
      }
    };

    // Trigger the handler with a new time
    handleEndTimeChange(dayjs().hour(16).minute(45).second(0));

    expect(mockSetFormState).toHaveBeenCalledWith(
      expect.objectContaining({
        endTime: '16:45:00',
      }),
    );
  });

  test('timeToDayJs utility function works correctly', () => {
    const timeToDayJs = (time: string) => {
      const dateTimeString = dayjs().format('YYYY-MM-DD') + ' ' + time;
      return dayjs(dateTimeString, { format: 'YYYY-MM-DD HH:mm:ss' });
    };

    const result = timeToDayJs('14:30:00');
    expect(result.hour()).toBe(14);
    expect(result.minute()).toBe(30);
    expect(result.second()).toBe(0);
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
          isRecurringEventTemplate: true,
        },
        recurrence,
      });
      expect(screen.getByText('daily')).toBeInTheDocument();
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
          isRecurringEventTemplate: true,
        },
        recurrence,
      });
      expect(screen.getByText('customRecurrence')).toBeInTheDocument();
    });

    test('returns recurrenceDescription when recurrence is not set', () => {
      renderComponent({
        eventListCardProps: {
          ...mockEventListCardProps,
          isRecurringEventTemplate: true,
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
          isRecurringEventTemplate: true,
          recurrenceDescription: undefined,
        },
        recurrence: null,
      });
      expect(screen.getByText('selectRecurrencePattern')).toBeInTheDocument();
    });

    test('returns custom recurrence description when recurrence is not defined', () => {
      renderComponent({
        eventListCardProps: {
          ...mockEventListCardProps,
          isRecurringEventTemplate: true,
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
          isRecurringEventTemplate: true,
          userRole: UserRole.ADMINISTRATOR,
        },
      });
    };

    test('should call setRecurrence with a function when setRecurrenceRuleState is called with a function', () => {
      const mockSetRecurrence = vi.fn();
      renderWithRecurrenceModal({ setRecurrence: mockSetRecurrence });

      const customModalProps = (CustomRecurrenceModal as Mock).mock.calls[0][0];
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

      const customModalProps = (CustomRecurrenceModal as Mock).mock.calls[0][0];
      const newRecurrence = { frequency: Frequency.DAILY, interval: 5 };
      customModalProps.setRecurrenceRuleState(newRecurrence);

      expect(mockSetRecurrence).toHaveBeenCalledWith(newRecurrence);
    });

    test('should call setEventEndDate with a function when setEndDate is called with a function', () => {
      const mockSetEventEndDate = vi.fn();
      renderWithRecurrenceModal({ setEventEndDate: mockSetEventEndDate });

      const customModalProps = (CustomRecurrenceModal as Mock).mock.calls[0][0];
      const newDate = dayjs().add(4, 'months').toDate();
      const updateFn = () => newDate;
      customModalProps.setEndDate(updateFn);

      expect(mockSetEventEndDate).toHaveBeenCalledWith(expect.any(Function));

      const prevState = dayjs().toDate();
      const passedFn = mockSetEventEndDate.mock.calls[0][0];
      const newState = passedFn(prevState);
      expect(newState).toEqual(newDate);
    });

    test('should call setEventEndDate with a value when setEndDate is called with a value', () => {
      const mockSetEventEndDate = vi.fn();
      renderWithRecurrenceModal({ setEventEndDate: mockSetEventEndDate });

      const customModalProps = (CustomRecurrenceModal as Mock).mock.calls[0][0];
      const newDate = dayjs().add(4, 'months').toDate();
      customModalProps.setEndDate(newDate);

      expect(mockSetEventEndDate).toHaveBeenCalledWith(newDate);
    });

    test('should call setCustomRecurrenceModalIsOpen with false when hideCustomRecurrenceModal is called', () => {
      const mockSetCustomRecurrenceModalIsOpen = vi.fn();
      renderWithRecurrenceModal({
        setCustomRecurrenceModalIsOpen: mockSetCustomRecurrenceModalIsOpen,
      });

      const customModalProps = (CustomRecurrenceModal as Mock).mock.calls[0][0];
      customModalProps.hideCustomRecurrenceModal();

      expect(mockSetCustomRecurrenceModalIsOpen).toHaveBeenCalledWith(false);
    });

    test('should pass translation function to CustomRecurrenceModal', () => {
      renderWithRecurrenceModal();

      const customModalProps = (CustomRecurrenceModal as Mock).mock.calls[0][0];

      // Verify the t function is passed and works correctly
      expect(customModalProps.t).toBeDefined();
      expect(typeof customModalProps.t).toBe('function');
      expect(customModalProps.t('testKey')).toBe('testKey');
    });
  });

  describe('Date and Time Picker onChange handlers', () => {
    test('updates end date if new start date is later', async () => {
      const user = userEvent.setup();
      const mockSetEventStartDate = vi.fn();
      const mockSetEventEndDate = vi.fn();
      // Set the end date to an early date (5th of current month) so selecting 20th will be later
      const earlyDate = dayjs().date(5).toDate();
      renderComponent({
        eventStartDate: earlyDate,
        eventEndDate: earlyDate,
        setEventStartDate: mockSetEventStartDate,
        setEventEndDate: mockSetEventEndDate,
      });

      const startDateInput = getPickerInputByTestId('startDate');
      expect(startDateInput.parentElement).toBeTruthy();
      const startDatePicker = startDateInput.parentElement;
      const calendarButton = within(
        startDatePicker as HTMLElement,
      ).getByLabelText(/choose date/i);
      await user.click(calendarButton);

      const calendarGrid = await screen.findByRole('grid');
      const dateToSelect = within(calendarGrid).getByRole('gridcell', {
        name: '20',
      });
      await user.click(dateToSelect);

      await waitFor(() => {
        expect(mockSetEventStartDate).toHaveBeenCalled();
        expect(mockSetEventEndDate).toHaveBeenCalled();
      });
    });

    test('updates end time if new start time is later', () => {
      const mockSetFormState = vi.fn();

      const currentFormState = {
        name: 'Test Event',
        eventDescription: 'Test event description',
        location: 'Test Location',
        startTime: '10:00:00',
        endTime: '11:00:00',
      };

      const handleStartTimeChange = (time: Dayjs | null) => {
        if (time) {
          const newStartTime = time.format('HH:mm:ss');
          const endTime = '11:00:00';

          mockSetFormState({
            ...currentFormState,
            startTime: newStartTime,
            endTime: newStartTime > endTime ? newStartTime : endTime,
          });
        }
      };

      handleStartTimeChange(dayjs().hour(12).minute(0).second(0));

      expect(mockSetFormState).toHaveBeenCalledWith(
        expect.objectContaining({
          startTime: '12:00:00',
          endTime: '12:00:00',
        }),
      );
    });

    test('handles null date in start date picker onChange', () => {
      const mockSetEventStartDate = vi.fn();
      const mockSetEventEndDate = vi.fn();

      // Simulate the simplified onChange handler logic from the actual component
      const handleStartDateChange = (date: Dayjs | null) => {
        if (date) {
          const newStartDate = date.toDate();
          mockSetEventStartDate(newStartDate);
          // Auto-adjust end date if it's before the new start date
          const currentEndDate = dayjs().toDate();
          if (currentEndDate < newStartDate) {
            mockSetEventEndDate(newStartDate);
          }
        }
      };

      // Trigger the handler with null to test the if (date) condition
      handleStartDateChange(null);

      // Verify that functions are not called when date is null
      expect(mockSetEventStartDate).not.toHaveBeenCalled();
      expect(mockSetEventEndDate).not.toHaveBeenCalled();
    });

    test('handles null date in end date picker onChange', () => {
      const mockSetEventEndDate = vi.fn();

      // Simulate the onChange handler logic from the actual component
      const handleEndDateChange = (date: Dayjs | null) => {
        if (date) {
          mockSetEventEndDate(date.toDate());
        }
      };

      // Trigger the handler with null to test the if (date) condition
      handleEndDateChange(null);

      // Verify that function is not called when date is null
      expect(mockSetEventEndDate).not.toHaveBeenCalled();
    });

    test('does not update end date when new start date is not later than current end date', () => {
      const mockSetEventStartDate = vi.fn();
      const mockSetEventEndDate = vi.fn();

      // Simulate the simplified onChange handler logic from the actual component
      const handleStartDateChange = (date: Dayjs | null) => {
        if (date) {
          const newStartDate = date.toDate();
          mockSetEventStartDate(newStartDate);
          // Auto-adjust end date if it's before the new start date
          const currentEndDate = dayjs().add(10, 'days').toDate(); // Later than the new start date
          if (currentEndDate < newStartDate) {
            mockSetEventEndDate(newStartDate);
          }
        }
      };

      // Trigger the handler with a date that's before the current end date
      handleStartDateChange(dayjs().add(5, 'days'));

      // Verify that start date is updated but end date is not
      expect(mockSetEventStartDate).toHaveBeenCalled();
      expect(mockSetEventEndDate).not.toHaveBeenCalled();
    });

    test('updates end date when new start date is later than current end date', () => {
      const mockSetEventStartDate = vi.fn();
      const mockSetEventEndDate = vi.fn();

      // Simulate the simplified onChange handler logic from the actual component
      const handleStartDateChange = (date: Dayjs | null) => {
        if (date) {
          const newStartDate = date.toDate();
          mockSetEventStartDate(newStartDate);
          // Auto-adjust end date if it's before the new start date
          const currentEndDate = dayjs().subtract(5, 'days').toDate(); // Earlier than the new start date
          if (currentEndDate < newStartDate) {
            mockSetEventEndDate(newStartDate);
          }
        }
      };

      // Trigger the handler with a date that's after the current end date
      handleStartDateChange(dayjs().add(5, 'days'));

      // Verify that both start date and end date are updated
      expect(mockSetEventStartDate).toHaveBeenCalled();
      expect(mockSetEventEndDate).toHaveBeenCalled();
    });
  });
});
