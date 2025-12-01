import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import InviteByEmailModal from './InviteByEmailModal';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from '../../../../utils/i18nForTest';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { SEND_EVENT_INVITATIONS } from 'GraphQl/Mutations/mutations';
import { toast } from 'react-toastify';

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

let mockHandleClose: ReturnType<typeof vi.fn>;
let mockOnInvitesSent: ReturnType<typeof vi.fn>;

let defaultProps: {
  show: boolean;
  handleClose: ReturnType<typeof vi.fn>;
  eventId: string;
  isRecurring: boolean;
  onInvitesSent: ReturnType<typeof vi.fn>;
};

const mocks = [
  {
    request: {
      query: SEND_EVENT_INVITATIONS,
      variables: {
        input: {
          eventId: 'test-event-1',
          recurringEventInstanceId: null,
          message: 'Hello there',
          expiresInDays: 7,
          recipients: [{ email: 'test@example.com', name: 'Test User' }],
        },
      },
    },
    result: {
      data: {
        sendEventInvitations: {
          id: '1',
        },
      },
    },
  },
];

const renderComponent = (
  props = {},
  customMocks: MockedResponse[] = mocks as MockedResponse[],
) => {
  return render(
    <MockedProvider mocks={customMocks}>
      <I18nextProvider i18n={i18nForTest}>
        <InviteByEmailModal {...defaultProps} {...props} />
      </I18nextProvider>
    </MockedProvider>,
  );
};

describe('InviteByEmailModal', () => {
  beforeEach(() => {
    mockHandleClose = vi.fn();
    mockOnInvitesSent = vi.fn();
    defaultProps = {
      show: true,
      handleClose: mockHandleClose,
      eventId: 'test-event-1',
      isRecurring: false,
      onInvitesSent: mockOnInvitesSent,
    };
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the modal with initial fields when show is true', () => {
    renderComponent();
    expect(screen.getByText('Invite by Email')).toBeInTheDocument();
    expect(screen.getByText('Recipient emails and names')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByText('Add recipient')).toBeInTheDocument();
    expect(screen.getByTestId('send-invites')).toBeInTheDocument();
  });

  it('does not render the modal when show is false', () => {
    const { container } = renderComponent({ show: false });
    expect(container.firstChild).toBeNull();
  });

  it('calls handleClose when the header close button is clicked', () => {
    renderComponent();
    fireEvent.click(screen.getByLabelText('Close'));
    expect(mockHandleClose).toHaveBeenCalledTimes(1);
  });

  it('calls handleClose when the footer close button is clicked', () => {
    renderComponent();
    fireEvent.click(screen.getByText('Close'));
    expect(mockHandleClose).toHaveBeenCalledTimes(1);
  });

  it('allows adding and removing recipient input fields', () => {
    renderComponent();
    const emailInputs = () => screen.queryAllByLabelText('Email');
    expect(emailInputs()).toHaveLength(1);
    expect(screen.queryByText('Remove')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Add recipient'));
    expect(emailInputs()).toHaveLength(2);
    expect(screen.getAllByText('Remove')).toHaveLength(2);

    fireEvent.click(screen.getAllByText('Remove')[0]);
    expect(emailInputs()).toHaveLength(1);
    expect(screen.queryByText('Remove')).not.toBeInTheDocument();
  });

  it('updates state when user types in the fields', async () => {
    renderComponent();
    const user = userEvent.setup();

    const emailInput = screen.getByLabelText('Email');
    const nameInput = screen.getByLabelText('Name');
    const expiresInput = screen.getByTestId('invite-expires');

    await user.type(emailInput, 'test@example.com');
    await user.type(nameInput, 'Test User');
    await user.clear(expiresInput);
    await user.type(expiresInput, '10');

    expect(emailInput).toHaveValue('test@example.com');
    expect(nameInput).toHaveValue('Test User');
    expect(expiresInput).toHaveValue(10);
  });

  describe('Form Submission', () => {
    it('shows an error toast if no recipients are provided', async () => {
      renderComponent();
      fireEvent.click(screen.getByTestId('send-invites'));
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          'Please provide at least one recipient email',
        );
      });
    });

    it('shows an error toast for invalid email formats', async () => {
      renderComponent();
      const user = userEvent.setup();
      const emailInput = screen.getByLabelText('Email');
      await user.type(emailInput, 'invalid-email');
      fireEvent.click(screen.getByTestId('send-invites'));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          'Invalid email(s): invalid-email',
        );
      });
    });

    it('submits the form, shows success toast, and closes on valid submission', async () => {
      const successMock: MockedResponse = {
        request: {
          query: SEND_EVENT_INVITATIONS,
          variables: {
            input: {
              eventId: 'test-event-1',
              recurringEventInstanceId: null,
              message: null,
              expiresInDays: 7,
              recipients: [{ email: 'test@example.com', name: 'Test User' }],
            },
          },
        },
        result: { data: { sendEventInvitations: { id: '1' } } },
      };

      renderComponent({}, [successMock]);
      const user = userEvent.setup();

      await user.type(screen.getByLabelText('Email'), 'test@example.com');
      await user.type(screen.getByLabelText('Name'), 'Test User');

      fireEvent.click(screen.getByTestId('send-invites'));

      await waitFor(() => {
        expect(screen.getByText('Sending...')).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(
          'Invites added Successfully',
        );
      });

      expect(mockOnInvitesSent).toHaveBeenCalledTimes(1);
      expect(mockHandleClose).toHaveBeenCalledTimes(1);
    });

    it('handles recurring event submission correctly', async () => {
      const recurringMock: MockedResponse = {
        request: {
          query: SEND_EVENT_INVITATIONS,
          variables: {
            input: {
              eventId: 'test-event-1',
              recurringEventInstanceId: 'test-event-1',
              message: null,
              expiresInDays: 7,
              recipients: [{ email: 'recurring@example.com', name: '' }],
            },
          },
        },
        result: { data: { sendEventInvitations: { id: '2' } } },
      };

      renderComponent({ isRecurring: true }, [recurringMock]);
      const user = userEvent.setup();

      await user.type(screen.getByLabelText('Email'), 'recurring@example.com');

      fireEvent.click(screen.getByTestId('send-invites'));

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(
          'Invites added Successfully',
        );
      });
      expect(mockHandleClose).toHaveBeenCalledTimes(1);
    });

    it('handles API error on submission', async () => {
      const errorMock: MockedResponse = {
        request: {
          query: SEND_EVENT_INVITATIONS,
          variables: {
            input: {
              eventId: 'test-event-1',
              recurringEventInstanceId: null,
              message: null,
              expiresInDays: 7,
              recipients: [{ email: 'test@example.com', name: '' }],
            },
          },
        },
        error: new Error('An error occurred'),
        result: { data: { sendEventInvitations: { id: 'error-id' } } },
      };

      renderComponent({}, [errorMock]);
      const user = userEvent.setup();

      await user.type(screen.getByLabelText('Email'), 'test@example.com');
      fireEvent.click(screen.getByTestId('send-invites'));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          'eventRegistrantsModal.inviteByEmail.errorSendingInvites',
        );
      });
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('An error occurred');
      });
      expect(mockHandleClose).not.toHaveBeenCalled();
      expect(screen.queryByText('Sending...')).not.toBeInTheDocument();
      expect(screen.getByTestId('send-invites')).not.toBeDisabled();
    });
  });
});
