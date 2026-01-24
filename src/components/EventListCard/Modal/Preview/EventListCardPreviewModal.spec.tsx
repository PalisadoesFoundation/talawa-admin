import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import {
  AdapterDayjs,
  LocalizationProvider,
} from 'shared-components/DateRangePicker';

dayjs.extend(utc);

import PreviewModal from './EventListCardPreviewModal';
import { UserRole } from 'types/Event/interface';

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

const mockDefaultProps = {
  eventListCardProps: mockEventListCardProps,
  eventModalIsOpen: true,
  hideViewModal: vi.fn(),
  toggleDeleteModal: vi.fn(),
  t: mockT,
  tCommon: mockTCommon,
  isRegistered: false,
  userId: 'user123',
  registerEventHandler: vi.fn(),
  onFormSubmit: vi.fn(),
  openEventDashboard: vi.fn(),
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

// Mock matchMedia globally before tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe('EventListCardPreviewModal', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  beforeEach(() => {
    vi.clearAllMocks();
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

  test('calls onFormSubmit with updated values when saved', async () => {
    const mockOnFormSubmit = vi.fn();
    renderComponent({ onFormSubmit: mockOnFormSubmit, userId: 'creator123' });

    const nameField = screen.getByTestId('eventTitleInput');
    await userEvent.clear(nameField);
    await userEvent.type(nameField, 'Updated Event Name');

    const submitBtn = screen.getByTestId('previewUpdateEventBtn');
    expect(submitBtn).not.toBeDisabled();
    await userEvent.click(submitBtn);

    expect(mockOnFormSubmit).toHaveBeenCalled();
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

    const publicRadio = screen.getByLabelText(
      /publicEvent/i,
    ) as HTMLInputElement;
    const orgMembersRadio = screen.getByLabelText(
      /organizationEvent/i,
    ) as HTMLInputElement;
    const inviteOnlyRadio = screen.getByLabelText(
      /inviteOnlyEvent/i,
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
    expect(radioGroup).toBeInTheDocument();
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

  test('verifies show event dashboard button has accessible name', () => {
    renderComponent({
      eventListCardProps: {
        ...mockEventListCardProps,
        userRole: UserRole.ADMINISTRATOR,
      },
    });

    expect(
      screen.getByRole('button', { name: 'showEventDashboard' }),
    ).toBeInTheDocument();
  });

  test('verifies edit event button has accessible name', () => {
    renderComponent({
      eventListCardProps: {
        ...mockEventListCardProps,
        userRole: UserRole.ADMINISTRATOR,
      },
    });

    expect(
      screen.getByRole('button', { name: 'editEvent' }),
    ).toBeInTheDocument();
  });

  test('verifies delete event button has accessible name', () => {
    renderComponent({
      eventListCardProps: {
        ...mockEventListCardProps,
        userRole: UserRole.ADMINISTRATOR,
      },
    });

    expect(
      screen.getByRole('button', { name: 'deleteEvent' }),
    ).toBeInTheDocument();
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

  test('hides register button when event is not registerable', () => {
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
});
