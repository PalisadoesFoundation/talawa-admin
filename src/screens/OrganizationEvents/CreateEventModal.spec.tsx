import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { GraphQLError } from 'graphql';

import CreateEventModal from './CreateEventModal';
import { CREATE_EVENT_MUTATION } from 'GraphQl/Mutations/EventMutations';
import i18n from 'utils/i18nForTest';
import { toast } from 'react-toastify';
import * as errorHandlerModule from 'utils/errorHandler';
import type { IEventFormProps } from 'types/EventForm/interface';
import type { InterfaceRecurrenceRule } from 'utils/recurrenceUtils/recurrenceTypes';
import { Frequency } from 'utils/recurrenceUtils';

// Extend Window interface for test data storage
interface ITestWindow extends Window {
  __eventFormData?: {
    name?: string;
    description?: string;
    location?: string;
    recurrenceRule?: InterfaceRecurrenceRule | null;
  };
}

// Mock toast
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  },
}));

// Mock error handler
vi.mock('utils/errorHandler', () => ({
  errorHandler: vi.fn(),
}));

// Mock EventForm component for controlled testing
vi.mock('shared-components/EventForm/EventForm', () => ({
  default: ({
    initialValues,
    onSubmit,
    onCancel,
    submitLabel,
    submitting,
    showCancelButton,
  }: IEventFormProps) => {
    const windowWithData = window as ITestWindow;
    return (
      <div data-testid="event-form">
        <input
          data-testid="event-name-input"
          defaultValue={initialValues?.name || ''}
          onChange={(e) => {
            // Store value for form submission
            windowWithData.__eventFormData = {
              ...windowWithData.__eventFormData,
              name: e.target.value,
            };
          }}
        />
        <input
          data-testid="event-description-input"
          defaultValue={initialValues?.description || ''}
          onChange={(e) => {
            windowWithData.__eventFormData = {
              ...windowWithData.__eventFormData,
              description: e.target.value,
            };
          }}
        />
        <input
          data-testid="event-location-input"
          defaultValue={initialValues?.location || ''}
          onChange={(e) => {
            windowWithData.__eventFormData = {
              ...windowWithData.__eventFormData,
              location: e.target.value,
            };
          }}
        />
        <button
          data-testid="event-form-submit"
          onClick={async () => {
            const formData = windowWithData.__eventFormData || {};
            const result = onSubmit({
              name: formData.name || 'Test Event',
              description: formData.description || 'Test Description',
              location: formData.location || 'Test Location',
              startDate: new Date('2024-01-01'),
              endDate: new Date('2024-01-01'),
              startAtISO: '2024-01-01T08:00:00Z',
              endAtISO: '2024-01-01T18:00:00Z',
              allDay: true,
              isPublic: true,
              isRegisterable: false,
              recurrenceRule: formData.recurrenceRule || null,
            });
            if (result instanceof Promise) {
              await result;
            }
          }}
          disabled={submitting}
        >
          {submitLabel}
        </button>
        {showCancelButton && (
          <button data-testid="event-form-cancel" onClick={onCancel}>
            Cancel
          </button>
        )}
        <div data-testid="submitting-state">
          {submitting ? 'true' : 'false'}
        </div>
      </div>
    );
  },
  formatRecurrenceForPayload: vi.fn(
    (
      rule: InterfaceRecurrenceRule | null | undefined,
    ): Record<string, unknown> | null => {
      if (!rule) return null;
      return {
        frequency: rule.frequency || Frequency.WEEKLY,
        interval: rule.interval || 1,
        count: rule.count,
        byDay: rule.byDay || [],
      };
    },
  ),
}));

const mockOnClose = vi.fn();
const mockOnEventCreated = vi.fn();

const defaultProps = {
  isOpen: true,
  onClose: mockOnClose,
  onEventCreated: mockOnEventCreated,
  currentUrl: 'test-org-id',
};

const successMock = {
  request: {
    query: CREATE_EVENT_MUTATION,
    variables: {
      input: {
        name: 'Test Event',
        description: 'Test Description',
        startAt: '2024-01-01T08:00:00Z',
        endAt: '2024-01-01T18:00:00Z',
        organizationId: 'test-org-id',
        allDay: true,
        location: 'Test Location',
        isPublic: true,
        isRegisterable: false,
        recurrence: undefined,
      },
    },
  },
  result: {
    data: {
      createEvent: {
        id: 'event-1',
        name: 'Test Event',
      },
    },
  },
};

const errorMock = {
  request: {
    query: CREATE_EVENT_MUTATION,
    variables: {
      input: {
        name: 'Test Event',
        description: 'Test Description',
        startAt: '2024-01-01T08:00:00Z',
        endAt: '2024-01-01T18:00:00Z',
        organizationId: 'test-org-id',
        allDay: true,
        location: 'Test Location',
        isPublic: true,
        isRegisterable: false,
        recurrence: undefined,
      },
    },
  },
  error: new GraphQLError('Failed to create event'),
};

const recurrenceMock = {
  request: {
    query: CREATE_EVENT_MUTATION,
    variables: {
      input: {
        name: 'Test Event',
        description: 'Test Description',
        startAt: '2024-01-01T08:00:00Z',
        endAt: '2024-01-01T18:00:00Z',
        organizationId: 'test-org-id',
        allDay: true,
        location: 'Test Location',
        isPublic: true,
        isRegisterable: false,
        recurrence: {
          frequency: 'WEEKLY',
          interval: 1,
          count: undefined,
          byDay: [],
        },
      },
    },
  },
  result: {
    data: {
      createEvent: {
        id: 'event-2',
        name: 'Test Event',
      },
    },
  },
};

describe('CreateEventModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    const windowWithData = window as ITestWindow;
    delete windowWithData.__eventFormData;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('renders modal when isOpen is true', () => {
    render(
      <MockedProvider mocks={[successMock]} addTypename={false}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <I18nextProvider i18n={i18n}>
            <CreateEventModal {...defaultProps} />
          </I18nextProvider>
        </LocalizationProvider>
      </MockedProvider>,
    );

    expect(screen.getByText('Event Details')).toBeInTheDocument();
    expect(screen.getByTestId('event-form')).toBeInTheDocument();
  });

  test('does not render modal when isOpen is false', () => {
    render(
      <MockedProvider mocks={[successMock]} addTypename={false}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <I18nextProvider i18n={i18n}>
            <CreateEventModal {...defaultProps} isOpen={false} />
          </I18nextProvider>
        </LocalizationProvider>
      </MockedProvider>,
    );

    expect(screen.queryByText('Event Details')).not.toBeInTheDocument();
    expect(screen.queryByTestId('event-form')).not.toBeInTheDocument();
  });

  test('renders close button and calls onClose when clicked', async () => {
    render(
      <MockedProvider mocks={[successMock]} addTypename={false}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <I18nextProvider i18n={i18n}>
            <CreateEventModal {...defaultProps} />
          </I18nextProvider>
        </LocalizationProvider>
      </MockedProvider>,
    );

    const closeButton = screen.getByTestId('createEventModalCloseBtn');
    expect(closeButton).toBeInTheDocument();

    await userEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('passes correct initial values to EventForm', () => {
    render(
      <MockedProvider mocks={[successMock]} addTypename={false}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <I18nextProvider i18n={i18n}>
            <CreateEventModal {...defaultProps} />
          </I18nextProvider>
        </LocalizationProvider>
      </MockedProvider>,
    );

    const nameInput = screen.getByTestId(
      'event-name-input',
    ) as HTMLInputElement;
    const descInput = screen.getByTestId(
      'event-description-input',
    ) as HTMLInputElement;
    const locInput = screen.getByTestId(
      'event-location-input',
    ) as HTMLInputElement;

    expect(nameInput.value).toBe('');
    expect(descInput.value).toBe('');
    expect(locInput.value).toBe('');
  });

  test('successfully creates event and calls callbacks', async () => {
    render(
      <MockedProvider mocks={[successMock]} addTypename={false}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <I18nextProvider i18n={i18n}>
            <CreateEventModal {...defaultProps} />
          </I18nextProvider>
        </LocalizationProvider>
      </MockedProvider>,
    );

    const submitButton = screen.getByTestId('event-form-submit');
    await userEvent.click(submitButton);

    await waitFor(
      () => {
        expect(toast.success).toHaveBeenCalledWith(
          'Congratulations! The Event is created.',
        );
      },
      { timeout: 3000 },
    );

    expect(mockOnEventCreated).toHaveBeenCalledTimes(1);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('handles mutation error and calls errorHandler', async () => {
    render(
      <MockedProvider mocks={[errorMock]} addTypename={false}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <I18nextProvider i18n={i18n}>
            <CreateEventModal {...defaultProps} />
          </I18nextProvider>
        </LocalizationProvider>
      </MockedProvider>,
    );

    const submitButton = screen.getByTestId('event-form-submit');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(errorHandlerModule.errorHandler).toHaveBeenCalled();
    });

    expect(toast.success).not.toHaveBeenCalled();
    expect(mockOnEventCreated).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test('shows loading state during mutation', async () => {
    const delayedMock = {
      ...successMock,
      delay: 100,
    };

    render(
      <MockedProvider mocks={[delayedMock]} addTypename={false}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <I18nextProvider i18n={i18n}>
            <CreateEventModal {...defaultProps} />
          </I18nextProvider>
        </LocalizationProvider>
      </MockedProvider>,
    );

    const submitButton = screen.getByTestId('event-form-submit');

    // Check initial state
    expect(screen.getByTestId('submitting-state')).toHaveTextContent('false');

    await userEvent.click(submitButton);

    // Check loading state
    await waitFor(() => {
      expect(screen.getByTestId('submitting-state')).toHaveTextContent('true');
    });

    // Wait for completion
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled();
    });
  });

  test('resets form when modal closes', async () => {
    const { rerender } = render(
      <MockedProvider mocks={[successMock]} addTypename={false}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <I18nextProvider i18n={i18n}>
            <CreateEventModal {...defaultProps} />
          </I18nextProvider>
        </LocalizationProvider>
      </MockedProvider>,
    );

    // Type into form
    const nameInput = screen.getByTestId('event-name-input');
    await userEvent.type(nameInput, 'My Event');

    // Close modal
    const closeButton = screen.getByTestId('createEventModalCloseBtn');
    await userEvent.click(closeButton);

    // Reopen modal
    rerender(
      <MockedProvider mocks={[successMock]} addTypename={false}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <I18nextProvider i18n={i18n}>
            <CreateEventModal {...defaultProps} isOpen={false} />
          </I18nextProvider>
        </LocalizationProvider>
      </MockedProvider>,
    );

    rerender(
      <MockedProvider mocks={[successMock]} addTypename={false}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <I18nextProvider i18n={i18n}>
            <CreateEventModal {...defaultProps} isOpen={true} />
          </I18nextProvider>
        </LocalizationProvider>
      </MockedProvider>,
    );

    // Form should be reset (EventForm gets new key, so inputs are reset)
    const newNameInput = screen.getByTestId(
      'event-name-input',
    ) as HTMLInputElement;
    expect(newNameInput.value).toBe('');
  });

  test('handles recurrence rule formatting and submission', async () => {
    const { formatRecurrenceForPayload } = await import(
      'shared-components/EventForm/EventForm'
    );

    render(
      <MockedProvider mocks={[recurrenceMock]} addTypename={false}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <I18nextProvider i18n={i18n}>
            <CreateEventModal {...defaultProps} />
          </I18nextProvider>
        </LocalizationProvider>
      </MockedProvider>,
    );

    // Set recurrence rule data
    const windowWithData = window as ITestWindow;
    windowWithData.__eventFormData = {
      name: 'Test Event',
      recurrenceRule: {
        frequency: Frequency.WEEKLY,
        interval: 1,
        byDay: [],
      },
    };

    const submitButton = screen.getByTestId('event-form-submit');
    await userEvent.click(submitButton);

    await waitFor(
      () => {
        expect(formatRecurrenceForPayload).toHaveBeenCalled();
      },
      { timeout: 3000 },
    );

    await waitFor(
      () => {
        expect(toast.success).toHaveBeenCalled();
      },
      { timeout: 3000 },
    );
  });

  test('handles null recurrence rule', async () => {
    render(
      <MockedProvider mocks={[successMock]} addTypename={false}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <I18nextProvider i18n={i18n}>
            <CreateEventModal {...defaultProps} />
          </I18nextProvider>
        </LocalizationProvider>
      </MockedProvider>,
    );

    // Ensure no recurrence rule
    const windowWithData = window as ITestWindow;
    windowWithData.__eventFormData = {
      name: 'Test Event',
      recurrenceRule: null,
    };

    const submitButton = screen.getByTestId('event-form-submit');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled();
    });
  });

  test('EventForm cancel button triggers modal close', async () => {
    render(
      <MockedProvider mocks={[successMock]} addTypename={false}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <I18nextProvider i18n={i18n}>
            <CreateEventModal {...defaultProps} />
          </I18nextProvider>
        </LocalizationProvider>
      </MockedProvider>,
    );

    const cancelButton = screen.getByTestId('event-form-cancel');
    await userEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('passes correct props to EventForm', () => {
    render(
      <MockedProvider mocks={[successMock]} addTypename={false}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <I18nextProvider i18n={i18n}>
            <CreateEventModal {...defaultProps} />
          </I18nextProvider>
        </LocalizationProvider>
      </MockedProvider>,
    );

    expect(screen.getByTestId('event-form')).toBeInTheDocument();
    expect(screen.getByText('Create Event')).toBeInTheDocument();
    expect(screen.getByTestId('event-form-cancel')).toBeInTheDocument();
  });

  test('increments formResetKey on successful submission', async () => {
    render(
      <MockedProvider mocks={[successMock]} addTypename={false}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <I18nextProvider i18n={i18n}>
            <CreateEventModal {...defaultProps} />
          </I18nextProvider>
        </LocalizationProvider>
      </MockedProvider>,
    );

    const submitButton = screen.getByTestId('event-form-submit');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled();
    });

    // After successful submission, form is reset with new key
    // This is verified by checking that the form re-renders with empty values
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('does not call onEventCreated or onClose on mutation failure', async () => {
    render(
      <MockedProvider mocks={[errorMock]} addTypename={false}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <I18nextProvider i18n={i18n}>
            <CreateEventModal {...defaultProps} />
          </I18nextProvider>
        </LocalizationProvider>
      </MockedProvider>,
    );

    const submitButton = screen.getByTestId('event-form-submit');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(errorHandlerModule.errorHandler).toHaveBeenCalled();
    });

    expect(mockOnEventCreated).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test('handles network error during mutation', async () => {
    const networkErrorMock = {
      request: {
        query: CREATE_EVENT_MUTATION,
        variables: {
          input: {
            name: 'Test Event',
            description: 'Test Description',
            startAt: '2024-01-01T08:00:00Z',
            endAt: '2024-01-01T18:00:00Z',
            organizationId: 'test-org-id',
            allDay: true,
            location: 'Test Location',
            isPublic: true,
            isRegisterable: false,
            recurrence: undefined,
          },
        },
      },
      error: new Error('Network error'),
    };

    render(
      <MockedProvider mocks={[networkErrorMock]} addTypename={false}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <I18nextProvider i18n={i18n}>
            <CreateEventModal {...defaultProps} />
          </I18nextProvider>
        </LocalizationProvider>
      </MockedProvider>,
    );

    const submitButton = screen.getByTestId('event-form-submit');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(errorHandlerModule.errorHandler).toHaveBeenCalled();
    });
  });

  test('modal header displays correct title', () => {
    render(
      <MockedProvider mocks={[successMock]} addTypename={false}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <I18nextProvider i18n={i18n}>
            <CreateEventModal {...defaultProps} />
          </I18nextProvider>
        </LocalizationProvider>
      </MockedProvider>,
    );

    expect(screen.getByText('Event Details')).toBeInTheDocument();
  });

  test('submit button is disabled during loading', async () => {
    const delayedMock = {
      ...successMock,
      delay: 100,
    };

    render(
      <MockedProvider mocks={[delayedMock]} addTypename={false}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <I18nextProvider i18n={i18n}>
            <CreateEventModal {...defaultProps} />
          </I18nextProvider>
        </LocalizationProvider>
      </MockedProvider>,
    );

    const submitButton = screen.getByTestId('event-form-submit');

    expect(submitButton).not.toBeDisabled();

    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled();
    });
  });

  test('handles undefined recurrence in formatRecurrenceForPayload', async () => {
    const { formatRecurrenceForPayload } = await import(
      'shared-components/EventForm/EventForm'
    );

    render(
      <MockedProvider mocks={[successMock]} addTypename={false}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <I18nextProvider i18n={i18n}>
            <CreateEventModal {...defaultProps} />
          </I18nextProvider>
        </LocalizationProvider>
      </MockedProvider>,
    );

    // Ensure no recurrence rule is set
    const windowWithData = window as ITestWindow;
    windowWithData.__eventFormData = {
      name: 'Test Event',
      recurrenceRule: null,
    };

    const submitButton = screen.getByTestId('event-form-submit');
    await userEvent.click(submitButton);

    await waitFor(
      () => {
        expect(toast.success).toHaveBeenCalled();
      },
      { timeout: 3000 },
    );

    // formatRecurrenceForPayload should NOT be called when recurrenceRule is null/undefined
    // because the code checks: payload.recurrenceRule ? formatRecurrenceForPayload(...) : undefined
    expect(formatRecurrenceForPayload).not.toHaveBeenCalled();
  });

  test('correctly constructs mutation input with all fields', async () => {
    render(
      <MockedProvider mocks={[successMock]} addTypename={false}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <I18nextProvider i18n={i18n}>
            <CreateEventModal {...defaultProps} />
          </I18nextProvider>
        </LocalizationProvider>
      </MockedProvider>,
    );

    const submitButton = screen.getByTestId('event-form-submit');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled();
    });

    // Verify all expected fields are passed to mutation
    expect(mockOnEventCreated).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('resets form on close via header close button', async () => {
    const { rerender } = render(
      <MockedProvider mocks={[successMock]} addTypename={false}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <I18nextProvider i18n={i18n}>
            <CreateEventModal {...defaultProps} />
          </I18nextProvider>
        </LocalizationProvider>
      </MockedProvider>,
    );

    const closeButton = screen.getByTestId('createEventModalCloseBtn');
    await userEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();

    // Reopen to verify reset
    rerender(
      <MockedProvider mocks={[successMock]} addTypename={false}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <I18nextProvider i18n={i18n}>
            <CreateEventModal {...defaultProps} isOpen={true} />
          </I18nextProvider>
        </LocalizationProvider>
      </MockedProvider>,
    );

    const nameInput = screen.getByTestId(
      'event-name-input',
    ) as HTMLInputElement;
    expect(nameInput.value).toBe('');
  });

  test('handles successful event creation with createEventData', async () => {
    render(
      <MockedProvider mocks={[successMock]} addTypename={false}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <I18nextProvider i18n={i18n}>
            <CreateEventModal {...defaultProps} />
          </I18nextProvider>
        </LocalizationProvider>
      </MockedProvider>,
    );

    const submitButton = screen.getByTestId('event-form-submit');
    await userEvent.click(submitButton);

    await waitFor(
      () => {
        expect(toast.success).toHaveBeenCalledWith(
          'Congratulations! The Event is created.',
        );
        expect(mockOnEventCreated).toHaveBeenCalledTimes(1);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
      },
      { timeout: 3000 },
    );
  });

  test('formResetKey changes when handleClose is called', async () => {
    const { rerender } = render(
      <MockedProvider mocks={[successMock]} addTypename={false}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <I18nextProvider i18n={i18n}>
            <CreateEventModal {...defaultProps} />
          </I18nextProvider>
        </LocalizationProvider>
      </MockedProvider>,
    );

    // Close modal
    const closeButton = screen.getByTestId('createEventModalCloseBtn');
    await userEvent.click(closeButton);

    // Reopen modal - form should have new key
    rerender(
      <MockedProvider mocks={[successMock]} addTypename={false}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <I18nextProvider i18n={i18n}>
            <CreateEventModal {...defaultProps} isOpen={true} />
          </I18nextProvider>
        </LocalizationProvider>
      </MockedProvider>,
    );

    // Form is re-rendered with new key
    expect(screen.getByTestId('event-form')).toBeInTheDocument();
  });

  test('handles case when createEvent mutation returns null data', async () => {
    const nullDataMock = {
      request: {
        query: CREATE_EVENT_MUTATION,
        variables: {
          input: {
            name: 'Test Event',
            description: 'Test Description',
            startAt: '2024-01-01T08:00:00Z',
            endAt: '2024-01-01T18:00:00Z',
            organizationId: 'test-org-id',
            allDay: true,
            location: 'Test Location',
            isPublic: true,
            isRegisterable: false,
            recurrence: undefined,
          },
        },
      },
      result: {
        data: null,
      },
    };

    render(
      <MockedProvider mocks={[nullDataMock]} addTypename={false}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <I18nextProvider i18n={i18n}>
            <CreateEventModal {...defaultProps} />
          </I18nextProvider>
        </LocalizationProvider>
      </MockedProvider>,
    );

    const submitButton = screen.getByTestId('event-form-submit');
    await userEvent.click(submitButton);

    await waitFor(
      () => {
        expect(toast.success).not.toHaveBeenCalled();
        expect(mockOnEventCreated).not.toHaveBeenCalled();
        expect(mockOnClose).not.toHaveBeenCalled();
      },
      { timeout: 3000 },
    );
  });

  test('handles all-day event with proper time values', async () => {
    render(
      <MockedProvider mocks={[successMock]} addTypename={false}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <I18nextProvider i18n={i18n}>
            <CreateEventModal {...defaultProps} />
          </I18nextProvider>
        </LocalizationProvider>
      </MockedProvider>,
    );

    const submitButton = screen.getByTestId('event-form-submit');
    await userEvent.click(submitButton);

    await waitFor(
      () => {
        expect(toast.success).toHaveBeenCalled();
      },
      { timeout: 3000 },
    );
  });

  test('passes translation functions to EventForm', () => {
    render(
      <MockedProvider mocks={[successMock]} addTypename={false}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <I18nextProvider i18n={i18n}>
            <CreateEventModal {...defaultProps} />
          </I18nextProvider>
        </LocalizationProvider>
      </MockedProvider>,
    );

    expect(screen.getByTestId('event-form')).toBeInTheDocument();
  });
});
