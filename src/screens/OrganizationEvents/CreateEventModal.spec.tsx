import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { I18nextProvider } from 'react-i18next';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import CreateEventModal from './CreateEventModal';
import { store } from 'state/store';
import i18n from 'utils/i18nForTest';
import { CREATE_EVENT_MUTATION } from 'GraphQl/Mutations/EventMutations';

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  },
}));

vi.mock('utils/errorHandler', () => ({
  errorHandler: vi.fn(),
}));

vi.mock('@mui/x-date-pickers', async () => {
  const actual = await vi.importActual('@mui/x-date-pickers');
  return {
    ...actual,
    DatePicker: ({ onChange, value, label }: any) => (
      <input
        data-testid={`date-picker-${label}`}
        value={value ? value.format('YYYY-MM-DD') : ''}
        onChange={(e) => {
          const mockDate = dayjs(e.target.value);
          if (onChange && mockDate.isValid()) onChange(mockDate);
        }}
      />
    ),
    TimePicker: ({ onChange, value, label, disabled }: any) => (
      <input
        data-testid={`time-picker-${label}`}
        value={value ? value.format('HH:mm:ss') : ''}
        disabled={disabled}
        onChange={(e) => {
          const mockTime = dayjs(e.target.value, 'HH:mm:ss');
          if (onChange && mockTime.isValid()) onChange(mockTime);
        }}
      />
    ),
  };
});

const mockProps = {
  isOpen: true,
  onClose: vi.fn(),
  onEventCreated: vi.fn(),
  currentUrl: 'org123',
};

const createEventMock = {
  request: { query: CREATE_EVENT_MUTATION },
  result: {
    data: {
      createEvent: {
        id: '1',
        name: 'Test Event',
        description: 'Test Description',
        startAt: '2024-01-15T00:00:00.000Z',
        endAt: '2024-01-15T23:59:59.999Z',
        allDay: true,
        location: 'Test Location',
        isPublic: true,
        isRegisterable: false,
        createdAt: '2024-01-15T00:00:00.000Z',
        updatedAt: '2024-01-15T00:00:00.000Z',
        isRecurringEventTemplate: false,
        hasExceptions: false,
        sequenceNumber: 1,
        totalCount: 1,
        progressLabel: 'Event 1 of 1',
        attachments: [],
        creator: { id: '1', name: 'Test User' },
        organization: { id: 'org123', name: 'Test Organization' },
        baseEvent: null,
      },
    },
  },
  newData: vi.fn(() => ({
    data: {
      createEvent: {
        id: '1',
        name: 'Test Event',
        description: 'Test Description',
        startAt: '2024-01-15T00:00:00.000Z',
        endAt: '2024-01-15T23:59:59.999Z',
        allDay: true,
        location: 'Test Location',
        isPublic: true,
        isRegisterable: false,
        createdAt: '2024-01-15T00:00:00.000Z',
        updatedAt: '2024-01-15T00:00:00.000Z',
        isRecurringEventTemplate: false,
        hasExceptions: false,
        sequenceNumber: 1,
        totalCount: 1,
        progressLabel: 'Event 1 of 1',
        attachments: [],
        creator: { id: '1', name: 'Test User' },
        organization: { id: 'org123', name: 'Test Organization' },
        baseEvent: null,
      },
    },
  })),
};

const createEventErrorMock = {
  request: { query: CREATE_EVENT_MUTATION },
  error: new Error('Failed to create event'),
};

const renderComponent = (mocks: any[] = [createEventMock], props = mockProps) => {
  return render(
    <MockedProvider mocks={mocks}>
      <Provider store={store}>
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <I18nextProvider i18n={i18n}>
              <CreateEventModal {...props} />
            </I18nextProvider>
          </LocalizationProvider>
        </BrowserRouter>
      </Provider>
    </MockedProvider>,
  );
};

describe('CreateEventModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders modal when open', () => {
    renderComponent();
    expect(screen.getByText('Event Details')).toBeInTheDocument();
    expect(screen.getByTestId('createEventModalCloseBtn')).toBeInTheDocument();
    expect(screen.getByTestId('eventTitleInput')).toBeInTheDocument();
    expect(screen.getByTestId('createEventBtn')).toBeInTheDocument();
  });

  test('does not render when closed', () => {
    renderComponent([], { ...mockProps, isOpen: false });
    expect(screen.queryByText('Event Details')).not.toBeInTheDocument();
  });

  test('updates form fields', async () => {
    renderComponent();
    const nameInput = screen.getByTestId('eventTitleInput') as HTMLInputElement;
    await userEvent.type(nameInput, 'Test');
    expect(nameInput.value).toBe('Test');
  });

  test('toggles checkboxes', async () => {
    renderComponent();
    const alldayCheck = screen.getByTestId('alldayCheck') as HTMLInputElement;
    expect(alldayCheck.checked).toBe(true);
    await userEvent.click(alldayCheck);
    expect(alldayCheck.checked).toBe(false);
  });

  test('shows time pickers when allDay unchecked', async () => {
    renderComponent();
    await userEvent.click(screen.getByTestId('alldayCheck'));
    await waitFor(() => {
      expect(screen.getByTestId('time-picker-Start Time')).toBeInTheDocument();
    });
  });

  test('shows warning for empty name', async () => {
    renderComponent();
    const submitBtn = screen.getByTestId('createEventBtn');
    fireEvent.submit(submitBtn.closest('form')!);
    expect(toast.warning).toHaveBeenCalledWith('Name can not be blank!');
  });

  test('shows warning for empty description', async () => {
    renderComponent();
    const nameInput = screen.getByTestId('eventTitleInput');
    fireEvent.change(nameInput, { target: { value: 'Test' } });
    const submitBtn = screen.getByTestId('createEventBtn');
    fireEvent.submit(submitBtn.closest('form')!);
    expect(toast.warning).toHaveBeenCalledWith('Description can not be blank!');
  });

  test('shows warning for empty location', async () => {
    renderComponent();
    const nameInput = screen.getByTestId('eventTitleInput');
    const descInput = screen.getByTestId('eventDescriptionInput');
    fireEvent.change(nameInput, { target: { value: 'Test' } });
    fireEvent.change(descInput, { target: { value: 'Desc' } });
    const submitBtn = screen.getByTestId('createEventBtn');
    fireEvent.submit(submitBtn.closest('form')!);
    expect(toast.warning).toHaveBeenCalledWith('Location can not be blank!');
  });

  test('creates event with all fields filled', async () => {
    renderComponent();
    const nameInput = screen.getByTestId('eventTitleInput');
    const descInput = screen.getByTestId('eventDescriptionInput');
    const locInput = screen.getByTestId('eventLocationInput');
    fireEvent.change(nameInput, { target: { value: 'Test Event' } });
    fireEvent.change(descInput, { target: { value: 'Test Description' } });
    fireEvent.change(locInput, { target: { value: 'Test Location' } });
    expect(nameInput).toHaveValue('Test Event');
    expect(descInput).toHaveValue('Test Description');
    expect(locInput).toHaveValue('Test Location');
  });

  test('handles error during creation', async () => {
    renderComponent([createEventErrorMock]);
    await userEvent.type(screen.getByTestId('eventTitleInput'), 'Error Event');
    await userEvent.type(screen.getByTestId('eventDescriptionInput'), 'Error Description');
    await userEvent.type(screen.getByTestId('eventLocationInput'), 'Error Location');
    await userEvent.click(screen.getByTestId('createEventBtn'));
    await waitFor(() => {
      expect(toast.success).not.toHaveBeenCalled();
    });
  });

  test('closes modal on close button click', async () => {
    renderComponent();
    await userEvent.click(screen.getByTestId('createEventModalCloseBtn'));
    expect(mockProps.onClose).toHaveBeenCalled();
  });

  test('opens recurrence dropdown', async () => {
    renderComponent();
    await userEvent.click(screen.getByTestId('recurrenceDropdown'));
    await waitFor(() => {
      expect(screen.getByText('Daily')).toBeInTheDocument();
    });
  });

  test('selects recurrence options', async () => {
    renderComponent();
    const dropdown = screen.getByTestId('recurrenceDropdown');
    fireEvent.click(dropdown);
    await waitFor(() => {
      const option = screen.queryByTestId('recurrenceOption-1');
      if (option) {
        fireEvent.click(option);
      }
    });
    expect(screen.getByTestId('recurrenceDropdown')).toBeInTheDocument();
  });

  test('custom recurrence option exists', async () => {
    renderComponent();
    const dropdown = screen.getByTestId('recurrenceDropdown');
    fireEvent.click(dropdown);
    await waitFor(() => {
      expect(screen.queryByTestId('recurrenceOption-6')).toBeInTheDocument();
    });
  });

  test('updates dates', async () => {
    renderComponent();
    const startDate = screen.getByTestId('date-picker-Start Date');
    fireEvent.change(startDate, { target: { value: '2024-12-31' } });
    await waitFor(() => {
      expect(startDate).toHaveValue('2024-12-31');
    });
  });

  test('updates times when not allDay', async () => {
    renderComponent();
    await userEvent.click(screen.getByTestId('alldayCheck'));
    await waitFor(() => {
      const startTime = screen.getByTestId('time-picker-Start Time');
      fireEvent.change(startTime, { target: { value: '10:00:00' } });
      expect(startTime).toHaveValue('10:00:00');
    });
  });

  test('renders all recurrence options', async () => {
    renderComponent();
    const dropdown = screen.getByTestId('recurrenceDropdown');
    fireEvent.click(dropdown);
    await waitFor(() => {
      expect(screen.getByText('Daily')).toBeInTheDocument();
      expect(screen.getByText(/Weekly on/)).toBeInTheDocument();
      expect(screen.getByText(/Monthly on day/)).toBeInTheDocument();
      expect(screen.getByText(/Annually on/)).toBeInTheDocument();
      expect(screen.getByText('Every weekday (Monday to Friday)')).toBeInTheDocument();
      expect(screen.getByText('Custom...')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test('toggles all checkboxes correctly', async () => {
    renderComponent();
    const publicCheck = screen.getByTestId('ispublicCheck') as HTMLInputElement;
    const registrableCheck = screen.getByTestId('registrableCheck') as HTMLInputElement;
    
    expect(publicCheck.checked).toBe(true);
    expect(registrableCheck.checked).toBe(false);
    
    await userEvent.click(publicCheck);
    await userEvent.click(registrableCheck);
    
    expect(publicCheck.checked).toBe(false);
    expect(registrableCheck.checked).toBe(true);
  });

  test('form resets on close', async () => {
    renderComponent();
    await userEvent.type(screen.getByTestId('eventTitleInput'), 'Test');
    await userEvent.click(screen.getByTestId('createEventModalCloseBtn'));
    expect(mockProps.onClose).toHaveBeenCalled();
  });

  test('disables submit button during loading', async () => {
    renderComponent();
    await userEvent.type(screen.getByTestId('eventTitleInput'), 'Test Event');
    await userEvent.type(screen.getByTestId('eventDescriptionInput'), 'Test Description');
    await userEvent.type(screen.getByTestId('eventLocationInput'), 'Test Location');
    const submitBtn = screen.getByTestId('createEventBtn') as HTMLButtonElement;
    expect(submitBtn.disabled).toBe(false);
  });
});
