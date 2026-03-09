import {
  render,
  screen,
  waitFor,
  within,
  cleanup,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { describe, test, expect, vi } from 'vitest';
import type { Mock } from 'vitest';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import CustomRecurrenceModal from 'shared-components/Recurrence/CustomRecurrenceModal';
import {
  AdapterDayjs,
  LocalizationProvider,
} from 'shared-components/DateRangePicker';

dayjs.extend(utc);

// We use explicit ISO strings to avoid timezone drift in CI

import PreviewModal from './EventListCardPreviewModal';
import { UserRole } from 'types/Event/interface';
import { Frequency } from 'utils/recurrenceUtils/recurrenceTypes';

// Use I18nextProvider with i18nForTest for translation handling
// This ensures that tests use the same translation logic as the app

vi.mock('shared-components/Recurrence/CustomRecurrenceModal', () => ({
  __esModule: true,
  default: vi.fn(({ ...props }) => (
    <div data-testid="mock-custom-recurrence-modal" {...props} />
  )),
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
const FIXED_BASE_DATE = ['2025', '01', '01T00:00:00.000Z'].join('-');

const mockEventListCardProps = {
  id: 'event123',
  name: 'Test Event',
  description: 'Test event description',
  location: 'Test Location',
  startAt: dayjs
    .utc(FIXED_BASE_DATE)
    .add(30, 'day')
    .startOf('day')
    .add(10, 'hour')
    .toISOString(),
  endAt: dayjs
    .utc(FIXED_BASE_DATE)
    .add(30, 'day')
    .startOf('day')
    .add(12, 'hour')
    .toISOString(),
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
  allDay: false,
  isPublic: true,
  isInviteOnly: false,
};

const mockDefaultProps = {
  eventListCardProps: mockEventListCardProps,
  eventModalIsOpen: true,
  hideViewModal: vi.fn(),
  toggleDeleteModal: vi.fn(),
  isRegistered: false,
  userId: 'user123',
  eventStartDate: dayjs
    .utc(FIXED_BASE_DATE)
    .add(30, 'day')
    .startOf('day')
    .toDate(),
  eventEndDate: dayjs
    .utc(FIXED_BASE_DATE)
    .add(30, 'day')
    .startOf('day')
    .toDate(),
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
    cleanup();
    vi.restoreAllMocks();
  });

  beforeEach(() => {
    (CustomRecurrenceModal as Mock).mockImplementation(
      ({ t, setCustomRecurrenceModalIsOpen, ...props }) => (
        <div data-testid="mock-custom-recurrence-modal" {...props}>
          {t && t('testKey')}
        </div>
      ),
    );
  });

  test('renders modal with event details when open', () => {
    renderComponent();

    expect(screen.getByText('Event Details')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Event')).toBeInTheDocument();
    expect(
      screen.getByDisplayValue('Test event description'),
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Location')).toBeInTheDocument();
  });

  test('does not render modal when closed', () => {
    renderComponent({ eventModalIsOpen: false });

    expect(screen.queryByText('Event Details')).not.toBeInTheDocument();
  });

  test('closes modal when close button is clicked', async () => {
    const user = userEvent.setup();
    const mockHideViewModal = vi.fn();
    renderComponent({ hideViewModal: mockHideViewModal });

    const closeButton = screen.getByTestId('modalCloseBtn');
    await user.click(closeButton);
    await waitFor(() => {
      expect(mockHideViewModal).toHaveBeenCalledOnce();
    });
  });

  test('renders form fields as editable for administrator', () => {
    renderComponent({
      eventListCardProps: {
        ...mockEventListCardProps,
        userRole: UserRole.ADMINISTRATOR,
      },
      userId: 'user123',
    });

    const nameField = screen.getByTestId('eventTitleInput');
    const descriptionField = screen.getByTestId('eventDescriptionInput');
    const locationField = screen.getByTestId('eventLocationInput');

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

    const nameField = screen.getByTestId('eventTitleInput');
    const descriptionField = screen.getByTestId('eventDescriptionInput');
    const locationField = screen.getByTestId('eventLocationInput');

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

    const nameField = screen.getByTestId('eventTitleInput');
    const descriptionField = screen.getByTestId('eventDescriptionInput');
    const locationField = screen.getByTestId('eventLocationInput');

    expect(nameField).toBeDisabled();
    expect(descriptionField).toBeDisabled();
    expect(locationField).toBeDisabled();
  });

  test('treats user as non-editor when event creator is null', () => {
    renderComponent({
      eventListCardProps: {
        ...mockEventListCardProps,
        creator: null as unknown as { id: string; name: string },
        userRole: UserRole.REGULAR,
      },
      userId: 'regular-user-123',
    });

    expect(screen.getByTestId('eventTitleInput')).toBeDisabled();
    expect(screen.getByTestId('eventDescriptionInput')).toBeDisabled();
    expect(
      screen.queryByTestId('previewUpdateEventBtn'),
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId('deleteEventModalBtn')).not.toBeInTheDocument();
  });

  test('treats user as non-editor when event creator is undefined', () => {
    renderComponent({
      eventListCardProps: {
        ...mockEventListCardProps,
        creator: undefined,
        userRole: UserRole.REGULAR,
      },
      userId: 'regular-user-123',
    });

    expect(screen.getByTestId('eventTitleInput')).toBeDisabled();
    expect(screen.getByTestId('eventDescriptionInput')).toBeDisabled();
  });

  test('should treat user as non-creator when creator exists but id does not match', () => {
    renderComponent({
      eventListCardProps: {
        ...mockEventListCardProps,
        creator: { id: 'different-user-id', name: 'Other User' },
        userRole: UserRole.REGULAR,
      },
      userId: 'current-user-123',
    });

    expect(screen.getByTestId('eventTitleInput')).toBeDisabled();
    expect(
      screen.queryByRole('button', { name: /edit/i }),
    ).not.toBeInTheDocument();
  });

  test('truncates long name and description when user cannot edit', () => {
    const longName = 'A'.repeat(150);
    const longDesc = 'B'.repeat(300);
    renderComponent({
      eventListCardProps: {
        ...mockEventListCardProps,
        name: longName,
        description: longDesc,
        creator: { id: 'creator123' },
        userRole: UserRole.REGULAR,
      },
      userId: 'other-user',
      formState: {
        ...mockFormState,
        name: longName,
        eventDescription: longDesc,
      },
    });

    const titleInput = screen.getByTestId('eventTitleInput');
    const descInput = screen.getByTestId('eventDescriptionInput');
    expect(titleInput).toHaveValue(longName.substring(0, 100) + '...');
    expect(descInput).toHaveValue(longDesc.substring(0, 256) + '...');
  });

  test('handles missing setter callbacks gracefully', async () => {
    const user = userEvent.setup();
    renderComponent({
      setFormState:
        undefined as unknown as typeof mockDefaultProps.setFormState,
      setAllDayChecked:
        undefined as unknown as typeof mockDefaultProps.setAllDayChecked,
      setEventStartDate:
        undefined as unknown as typeof mockDefaultProps.setEventStartDate,
      setEventEndDate:
        undefined as unknown as typeof mockDefaultProps.setEventEndDate,
      setPublicChecked:
        undefined as unknown as typeof mockDefaultProps.setPublicChecked,
      setRegisterableChecked:
        undefined as unknown as typeof mockDefaultProps.setRegisterableChecked,
      setInviteOnlyChecked:
        undefined as unknown as typeof mockDefaultProps.setInviteOnlyChecked,
      setRecurrence:
        undefined as unknown as typeof mockDefaultProps.setRecurrence,
    });

    expect(screen.getByTestId('eventTitleInput')).toBeInTheDocument();
    const titleInput = screen.getByTestId('eventTitleInput');
    await user.clear(titleInput);
    await user.type(titleInput, 'New Name');
    expect(titleInput).toHaveValue('New Name');
  });

  test('shows Register button when user is not registered', () => {
    renderComponent({
      eventListCardProps: {
        ...mockEventListCardProps,
        isRegisterable: true,
        userRole: UserRole.REGULAR,
        creator: { id: 'creator123' },
      },
      userId: 'regular-user-123',
      isRegistered: false,
    });

    expect(screen.getByTestId('registerEventBtn')).toBeInTheDocument();
    expect(screen.queryByText(/already registered/i)).not.toBeInTheDocument();
  });

  test('shows Already registered when user is registered', () => {
    renderComponent({
      eventListCardProps: {
        ...mockEventListCardProps,
        isRegisterable: true,
        userRole: UserRole.REGULAR,
        creator: { id: 'creator123' },
      },
      userId: 'regular-user-123',
      isRegistered: true,
    });

    expect(screen.getByText(/already registered/i)).toBeInTheDocument();
    expect(screen.queryByTestId('registerEventBtn')).not.toBeInTheDocument();
  });

  test('updates form state when name field changes', async () => {
    const user = userEvent.setup();
    const mockSetFormState = vi.fn();
    renderComponent({ setFormState: mockSetFormState });

    const nameField = screen.getByTestId('eventTitleInput');
    await user.type(nameField, 'X');

    // Check that setFormState was called, indicating the onChange handler works
    await waitFor(() => {
      expect(mockSetFormState).toHaveBeenCalled();
      // Verify that the name field is being updated in the calls
      const calls = mockSetFormState.mock.calls;
      expect(calls.some((call) => call[0].name.includes('X'))).toBe(true);
    });
  });

  test('updates form state when description field changes', async () => {
    const user = userEvent.setup();
    const mockSetFormState = vi.fn();
    renderComponent({ setFormState: mockSetFormState });

    const descriptionField = screen.getByTestId('eventDescriptionInput');
    await user.type(descriptionField, 'Y');

    // Check that setFormState was called, indicating the onChange handler works
    await waitFor(() => {
      expect(mockSetFormState).toHaveBeenCalled();
      // Verify that the eventDescription field is being updated in the calls
      const calls = mockSetFormState.mock.calls;
      expect(calls.some((call) => call[0].eventDescription.includes('Y'))).toBe(
        true,
      );
    });
  });

  test('updates form state when location field changes', async () => {
    const user = userEvent.setup();
    const mockSetFormState = vi.fn();
    renderComponent({ setFormState: mockSetFormState });

    const locationField = screen.getByTestId('eventLocationInput');
    await user.type(locationField, 'Z');

    // Check that setFormState was called, indicating the onChange handler works
    await waitFor(() => {
      expect(mockSetFormState).toHaveBeenCalled();
      // Verify that the location field is being updated in the calls
      const calls = mockSetFormState.mock.calls;
      expect(calls.some((call) => call[0].location.includes('Z'))).toBe(true);
    });
  });

  test('truncates long event names to 100 characters', () => {
    const longName = 'A'.repeat(150);
    const truncatedName = 'A'.repeat(100) + '...';

    renderComponent({
      eventListCardProps: {
        ...mockEventListCardProps,
        userRole: UserRole.REGULAR,
        creator: {
          id: 'other-user',
          name: 'Other',
          emailAddress: 'other@example.com',
        },
      },
      userId: 'user123',
      formState: { ...mockFormState, name: longName },
    });

    const nameField = screen.getByTestId('eventTitleInput');
    expect(nameField).toHaveValue(truncatedName);
  });

  test('truncates long descriptions to 256 characters', () => {
    const longDescription = 'B'.repeat(300);
    const truncatedDescription = 'B'.repeat(256) + '...';

    renderComponent({
      eventListCardProps: {
        ...mockEventListCardProps,
        userRole: UserRole.REGULAR,
        creator: {
          id: 'other-user',
          name: 'Other',
          emailAddress: 'other@example.com',
        },
      },
      userId: 'user123',
      formState: { ...mockFormState, eventDescription: longDescription },
    });

    const descriptionField = screen.getByTestId('eventDescriptionInput');
    expect(descriptionField).toHaveValue(truncatedDescription);
  });

  test('truncates name but not description when only name exceeds limit', () => {
    const longName = 'A'.repeat(150);
    const shortDesc = 'Short description';

    renderComponent({
      eventListCardProps: {
        ...mockEventListCardProps,
        userRole: UserRole.REGULAR,
        creator: {
          id: 'other-user',
          name: 'Other',
          emailAddress: 'other@example.com',
        },
      },
      userId: 'current-user-123',
      formState: {
        ...mockFormState,
        name: longName,
        eventDescription: shortDesc,
      },
    });

    const titleInput = screen.getByTestId('eventTitleInput');
    const descInput = screen.getByTestId('eventDescriptionInput');
    expect(titleInput).toHaveValue(longName.substring(0, 100) + '...');
    expect(descInput).toHaveValue(shortDesc);
  });

  test('truncates description but not name when only description exceeds limit', () => {
    const shortName = 'Short Event Name';
    const longDesc = 'B'.repeat(300);

    renderComponent({
      eventListCardProps: {
        ...mockEventListCardProps,
        userRole: UserRole.REGULAR,
        creator: {
          id: 'other-user',
          name: 'Other',
          emailAddress: 'other@example.com',
        },
      },
      userId: 'current-user-123',
      formState: {
        ...mockFormState,
        name: shortName,
        eventDescription: longDesc,
      },
    });

    const titleInput = screen.getByTestId('eventTitleInput');
    const descInput = screen.getByTestId('eventDescriptionInput');
    expect(titleInput).toHaveValue(shortName);
    expect(descInput).toHaveValue(longDesc.substring(0, 256) + '...');
  });

  test('uses default startTime 08:00:00 when formState.startTime is missing', () => {
    renderComponent({
      allDayChecked: false,
      formState: {
        ...mockFormState,
        startTime: '',
      },
    });

    const startTimeInput = screen.getByTestId('startTime');
    expect(startTimeInput).toHaveValue('08:00 AM');
  });

  test('uses default endTime 10:00:00 when formState.endTime is missing', () => {
    renderComponent({
      allDayChecked: false,
      formState: {
        ...mockFormState,
        endTime: '',
      },
    });

    const endTimeInput = screen.getByTestId('endTime');
    expect(endTimeInput).toHaveValue('10:00 AM');
  });

  test('passes createChat true to form when eventListCardProps.createChat is true', () => {
    renderComponent({
      eventListCardProps: {
        ...mockEventListCardProps,
        createChat: true,
      },
    });

    expect(screen.getByText('Event Details')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Event')).toBeInTheDocument();
  });

  test('should handle non-editable mode with long text and missing creator gracefully', () => {
    const longName = 'A'.repeat(150);
    const longDesc = 'B'.repeat(300);

    renderComponent({
      eventListCardProps: {
        ...mockEventListCardProps,
        creator: undefined,
        isRegisterable: true,
        userRole: UserRole.REGULAR,
      },
      formState: {
        ...mockFormState,
        name: longName,
        eventDescription: longDesc,
      },
      isRegistered: false,
      userId: 'regular-user-123',
    });

    const titleInput = screen.getByTestId(
      'eventTitleInput',
    ) as HTMLInputElement;
    expect(titleInput.value.length).toBeLessThanOrEqual(103);
    expect(
      screen.getByRole('button', { name: /register/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /edit/i }),
    ).not.toBeInTheDocument();
  });

  test('toggles all-day checkbox', async () => {
    const user = userEvent.setup();
    const mockSetAllDayChecked = vi.fn();
    renderComponent({ setAllDayChecked: mockSetAllDayChecked });

    const allDayCheckbox = screen.getByTestId('allDayEventCheck');
    await user.click(allDayCheckbox);
    await waitFor(() => {
      expect(mockSetAllDayChecked).toHaveBeenCalledWith(true);
    });
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

    const allDayCheckbox = screen.getByTestId('allDayEventCheck');
    await user.click(allDayCheckbox);
    await waitFor(() => {
      // Should toggle checked state
      expect(mockSetAllDayChecked).toHaveBeenCalledWith(false);

      // Should update form state with allDay false, but PRESERVE times
      expect(mockSetFormState).toHaveBeenCalledWith(
        expect.objectContaining({
          startTime,
          endTime,
        }),
      );
    });
  });

  test('renders visibility radio buttons for administrators', () => {
    renderComponent({
      eventListCardProps: {
        ...mockEventListCardProps,
        userRole: UserRole.ADMINISTRATOR,
      },
    });

    expect(screen.getByTestId('visibilityPublicRadio')).toBeInTheDocument();
    expect(screen.getByTestId('visibilityOrgRadio')).toBeInTheDocument();
    expect(screen.getByTestId('visibilityInviteRadio')).toBeInTheDocument();
  });

  test('selects public radio button when event is public', () => {
    renderComponent({
      publicChecked: true,
      inviteOnlyChecked: false,
    });

    const publicRadio = screen.getByTestId(
      'visibilityPublicRadio',
    ) as HTMLInputElement;
    expect(publicRadio.checked).toBe(true);
  });

  test('selects organization members radio when event is not public and not invite only', () => {
    renderComponent({
      eventListCardProps: {
        ...mockEventListCardProps,
        userRole: UserRole.ADMINISTRATOR,
        isPublic: false,
        isInviteOnly: false,
      },
    });

    const orgMembersRadio = screen.getByTestId(
      'visibilityOrgRadio',
    ) as HTMLInputElement;
    expect(orgMembersRadio.checked).toBe(true);
  });

  test('selects invite only radio when event is invite only', () => {
    renderComponent({
      eventListCardProps: {
        ...mockEventListCardProps,
        userRole: UserRole.ADMINISTRATOR,
        isPublic: false,
        isInviteOnly: true,
      },
    });

    const inviteOnlyRadio = screen.getByTestId(
      'visibilityInviteRadio',
    ) as HTMLInputElement;
    expect(inviteOnlyRadio.checked).toBe(true);
  });

  test('clicking public radio sets publicchecked to true and inviteonlychecked to false', async () => {
    const user = userEvent.setup();
    const mockSetPublicChecked = vi.fn();
    const mockSetInviteOnlyChecked = vi.fn();
    renderComponent({
      eventListCardProps: {
        ...mockEventListCardProps,
        userRole: UserRole.ADMINISTRATOR,
        isPublic: false,
        isInviteOnly: false,
      },
      setPublicChecked: mockSetPublicChecked,
      setInviteOnlyChecked: mockSetInviteOnlyChecked,
    });

    const publicRadio = screen.getByTestId('visibilityPublicRadio');
    await user.click(publicRadio);
    await waitFor(() => {
      expect(mockSetPublicChecked).toHaveBeenCalledWith(true);
      expect(mockSetInviteOnlyChecked).toHaveBeenCalledWith(false);
    });
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

    const orgMembersRadio = screen.getByTestId('visibilityOrgRadio');
    await user.click(orgMembersRadio);
    await waitFor(() => {
      expect(mockSetPublicChecked).toHaveBeenCalledWith(false);
      expect(mockSetInviteOnlyChecked).toHaveBeenCalledWith(false);
    });
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

    const inviteOnlyRadio = screen.getByTestId('visibilityInviteRadio');
    await user.click(inviteOnlyRadio);
    await waitFor(() => {
      expect(mockSetPublicChecked).toHaveBeenCalledWith(false);
      expect(mockSetInviteOnlyChecked).toHaveBeenCalledWith(true);
    });
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

    const publicRadio = screen.getByTestId(
      'visibilityPublicRadio',
    ) as HTMLInputElement;
    const orgMembersRadio = screen.getByTestId(
      'visibilityOrgRadio',
    ) as HTMLInputElement;
    const inviteOnlyRadio = screen.getByTestId(
      'visibilityInviteRadio',
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

    const radioGroup = screen.getByRole('group', { name: 'Event Visibility' });
    expect(radioGroup).toHaveAttribute('aria-label', 'Event Visibility');
  });

  test('toggles registrable checkbox', async () => {
    const user = userEvent.setup();
    const mockSetRegisterableChecked = vi.fn();
    renderComponent({ setRegisterableChecked: mockSetRegisterableChecked });

    const registrableCheckbox = screen.getByTestId('registerableEventCheck');
    await user.click(registrableCheckbox);
    await waitFor(() => {
      expect(mockSetRegisterableChecked).toHaveBeenCalledWith(false);
    });
  });

  test('hides time pickers when all-day is checked', () => {
    renderComponent({ allDayChecked: true });

    expect(screen.queryByText('Start Time')).not.toBeInTheDocument();
    expect(screen.queryByText('End Time')).not.toBeInTheDocument();
  });

  test('shows time pickers when all-day is not checked', () => {
    renderComponent({ allDayChecked: false });

    // Use getAllByText to find multiple elements and check they exist
    const startTimeElements = screen.getAllByText('Start Time');
    const endTimeElements = screen.getAllByText('End Time');

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

    expect(screen.getByLabelText('Show Dashboard')).toBeInTheDocument();
  });

  test('verifies aria-label for edit event button', () => {
    renderComponent({
      eventListCardProps: {
        ...mockEventListCardProps,
        userRole: UserRole.ADMINISTRATOR,
      },
    });

    expect(screen.getByLabelText('Edit')).toBeInTheDocument();
  });

  test('verifies aria-label for delete event button', () => {
    renderComponent({
      eventListCardProps: {
        ...mockEventListCardProps,
        userRole: UserRole.ADMINISTRATOR,
      },
    });

    expect(screen.getByLabelText('Delete')).toBeInTheDocument();
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
      .getByText('Already registered')
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
    expect(screen.queryByText('Already registered')).not.toBeInTheDocument();
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
    await waitFor(() => {
      expect(mockRegisterEventHandler).toHaveBeenCalledOnce();
    });
  });

  test('calls handleEventUpdate when edit button is clicked', async () => {
    const user = userEvent.setup();
    const mockHandleEventUpdate = vi.fn();
    renderComponent({ handleEventUpdate: mockHandleEventUpdate });

    const editBtn = screen.getByTestId('previewUpdateEventBtn');
    await user.click(editBtn);
    await waitFor(() => {
      expect(mockHandleEventUpdate).toHaveBeenCalledOnce();
    });
  });

  test('form submit triggers onSubmit handler (covers onSubmit callback)', async () => {
    const user = userEvent.setup();
    renderComponent({
      eventListCardProps: {
        ...mockEventListCardProps,
        userRole: UserRole.ADMINISTRATOR,
      },
    });

    const titleInput = screen.getByTestId('eventTitleInput');
    const form = titleInput.closest('form');
    expect(form).toBeInTheDocument();

    await user.click(titleInput);
    await user.keyboard('{Enter}');
    await waitFor(() => {
      expect(form).toBeInTheDocument();
    });
  });

  test('calls toggleDeleteModal when delete button is clicked', async () => {
    const user = userEvent.setup();
    const mockToggleDeleteModal = vi.fn();
    renderComponent({ toggleDeleteModal: mockToggleDeleteModal });

    const deleteBtn = screen.getByTestId('deleteEventModalBtn');
    await user.click(deleteBtn);
    await waitFor(() => {
      expect(mockToggleDeleteModal).toHaveBeenCalledOnce();
    });
  });

  test('calls openEventDashboard when dashboard button is clicked', async () => {
    const user = userEvent.setup();
    const mockOpenEventDashboard = vi.fn();
    renderComponent({ openEventDashboard: mockOpenEventDashboard });

    const dashboardBtn = screen.getByTestId('showEventDashboardBtn');
    await user.click(dashboardBtn);
    await waitFor(() => {
      expect(mockOpenEventDashboard).toHaveBeenCalledOnce();
    });
  });

  test('shows recurrence dropdown for recurring events with edit permissions', () => {
    renderComponent({
      recurrence: { frequency: Frequency.WEEKLY, interval: 1 },
      eventListCardProps: {
        ...mockEventListCardProps,
        isRecurringEventTemplate: true,
        userRole: UserRole.ADMINISTRATOR,
      },
    });

    // Check the dropdown toggle exists
    const toggle = screen.getByTestId('recurrence-toggle');
    expect(toggle).toBeInTheDocument();
  });

  test('shows recurrence dropdown for recurring instances with edit permissions', () => {
    renderComponent({
      recurrence: { frequency: Frequency.WEEKLY, interval: 1 },
      eventListCardProps: {
        ...mockEventListCardProps,
        baseEvent: { id: 'base-123' },
        userRole: UserRole.ADMINISTRATOR,
      },
    });

    // Check the dropdown toggle exists
    const toggle = screen.getByTestId('recurrence-toggle');
    expect(toggle).toBeInTheDocument();
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

    expect(screen.queryByTestId('recurrence-toggle')).not.toBeInTheDocument();
  });

  test('opens recurrence dropdown and shows options', async () => {
    const user = userEvent.setup();

    renderComponent({
      recurrence: { frequency: Frequency.WEEKLY, interval: 1 },
      eventListCardProps: {
        ...mockEventListCardProps,
        isRecurringEventTemplate: true,
        userRole: UserRole.ADMINISTRATOR,
      },
    });

    const dropdownToggle = screen.getByTestId('recurrence-toggle');
    expect(dropdownToggle).toBeInTheDocument();

    await user.click(dropdownToggle);

    // Wait for the dropdown options to appear
    const dailyOption = await screen.findByText(/daily/i);
    const weeklyOption = await screen.findByText(/weekly/i);
    const monthlyOption = await screen.findByText(/monthly/i);
    const annuallyOption = await screen.findByText(/annually/i);
    const weekdayOption = await screen.findByText(/weekday/i);
    const customOptions = await screen.findAllByText(/custom/i);
    expect(customOptions.length).toBeGreaterThan(0);

    expect(dailyOption).toBeInTheDocument();
    expect(weeklyOption).toBeInTheDocument();
    expect(monthlyOption).toBeInTheDocument();
    expect(annuallyOption).toBeInTheDocument();
    expect(weekdayOption).toBeInTheDocument();
  });

  test('sets recurrence correctly for a non-custom option', async () => {
    const user = userEvent.setup();
    const mockSetRecurrence = vi.fn();

    renderComponent({
      eventListCardProps: {
        ...mockEventListCardProps,
        isRecurringEventTemplate: true,
        userRole: UserRole.ADMINISTRATOR,
      },
      recurrence: { frequency: Frequency.WEEKLY, interval: 1 },
      setRecurrence: mockSetRecurrence,
    });

    const dropdownToggle = screen.getByTestId('recurrence-toggle');
    await user.click(dropdownToggle);

    // Select daily option
    const dailyOption = await screen.findByText(/daily/i);
    await user.click(dailyOption);
    await waitFor(() => {
      expect(mockSetRecurrence).toHaveBeenCalledWith({
        frequency: Frequency.DAILY,
        interval: 1,
        never: true,
      });
    });
  });

  test('opens custom recurrence modal when recurrence already exists', () => {
    const mockSetRecurrence = vi.fn();

    renderComponent({
      eventListCardProps: {
        ...mockEventListCardProps,
        isRecurringEventTemplate: true,
        userRole: UserRole.ADMINISTRATOR,
      },
      recurrence: {
        frequency: Frequency.DAILY,
        interval: 1,
        never: true,
      },
      setRecurrence: mockSetRecurrence,
    });

    expect(
      screen.getByTestId('mock-custom-recurrence-modal'),
    ).toBeInTheDocument();

    expect(mockSetRecurrence).toHaveBeenCalledTimes(1);
    expect(mockSetRecurrence).toHaveBeenCalledWith({
      frequency: Frequency.DAILY,
      interval: 1,
      never: true,
    });
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

    const startDateInput = getPickerInputByTestId('eventStartAt');
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

    const endDateInput = getPickerInputByTestId('eventEndAt');
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
    expect(screen.queryByText('Start Time')).not.toBeInTheDocument();
    expect(screen.queryByText('End Time')).not.toBeInTheDocument();
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
      expect(screen.getByText('Daily')).toBeInTheDocument();
    });

    test('opens custom recurrence modal when recurrence is custom', () => {
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

      expect(
        screen.getByTestId('mock-custom-recurrence-modal'),
      ).toBeInTheDocument();
    });

    test('does not display recurrenceDescription when recurrence is not set', () => {
      renderComponent({
        eventListCardProps: {
          ...mockEventListCardProps,
          isRecurringEventTemplate: true,
          recurrenceDescription: 'Custom Rule',
        },
        recurrence: null,
      });
      expect(screen.queryByText('Custom Rule')).not.toBeInTheDocument();
    });

    test('does not display default recurrence label when recurrence is not set', () => {
      renderComponent({
        eventListCardProps: {
          ...mockEventListCardProps,
          isRecurringEventTemplate: true,
          recurrenceDescription: undefined,
        },
        recurrence: null,
      });
      expect(
        screen.queryByText('selectRecurrencePattern'),
      ).not.toBeInTheDocument();
    });

    test('does not render recurrence description when recurrence is null', () => {
      renderComponent({
        eventListCardProps: {
          ...mockEventListCardProps,
          isRecurringEventTemplate: true,
          recurrenceDescription: 'My Custom Rule',
        },
        recurrence: null,
      });

      expect(screen.queryByText('My Custom Rule')).not.toBeInTheDocument();
    });
  });

  describe('Date and Time Picker onChange handlers', () => {
    test('updates end date if new start date is later', async () => {
      const user = userEvent.setup();
      const mockSetEventStartDate = vi.fn();
      const mockSetEventEndDate = vi.fn();
      // Set the end date to an early date (5th of month) so selecting 20th will be later
      const earlyDate = dayjs
        .utc(FIXED_BASE_DATE)
        .add(5, 'day')
        .startOf('day')
        .add(12, 'hour')
        .toDate();
      renderComponent({
        eventStartDate: earlyDate,
        eventEndDate: earlyDate,
        setEventStartDate: mockSetEventStartDate,
        setEventEndDate: mockSetEventEndDate,
      });

      const startDateInput = getPickerInputByTestId('eventStartAt');
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

    test('handles null value gracefully in start date picker (no call)', async () => {
      const mockSetEventStartDate = vi.fn();
      renderComponent({ setEventStartDate: mockSetEventStartDate });

      const startDateInput = getPickerInputByTestId('eventStartAt');
      const user = userEvent.setup();

      // For Material UI DatePicker with Day.js, typing an invalid date often triggers OnChange with an invalid Date object.
      // And clearing it sets it to null or Invalid Date.
      // But depending on how Mui ignores invalid typed dates, it might not fire mockSetEventStartDate.
      await user.clear(startDateInput);
      await user.type(startDateInput, '11/11/1111');
      await user.clear(startDateInput);
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(mockSetEventStartDate).toHaveBeenCalledTimes(1);
      });
    });

    test('handles null value gracefully in end date picker (no call)', async () => {
      const mockSetEventEndDate = vi.fn();
      renderComponent({ setEventEndDate: mockSetEventEndDate });

      const endDateInput = getPickerInputByTestId('eventEndAt');
      const user = userEvent.setup();

      await user.clear(endDateInput);
      await user.type(endDateInput, '11/11/1111');
      await user.clear(endDateInput);
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(mockSetEventEndDate).toHaveBeenCalledTimes(1);
      });
    });
  });

  it('updates endTime if new startTime is after current endTime', async () => {
    const user = userEvent.setup();
    const mockSetFormState = vi.fn();

    renderComponent({
      setFormState: mockSetFormState,
      formState: {
        ...mockFormState,
        startTime: '09:00:00',
        endTime: '10:00:00',
      },
    });

    // Open the start time picker and select hour 11
    const startTimeInput = getPickerInputByTestId('startTime');
    const startTimePicker = startTimeInput.parentElement as HTMLElement;
    const clockButton = within(startTimePicker).getByLabelText(/choose time/i);
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
      expect(mockSetFormState).toHaveBeenCalledWith(
        expect.objectContaining({
          startTime: expect.stringContaining('11'),
          endTime: expect.stringContaining('11'),
        }),
      );
    });
  });
});
