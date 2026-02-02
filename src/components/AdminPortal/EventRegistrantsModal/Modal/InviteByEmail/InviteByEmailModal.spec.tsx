import React from 'react';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import InviteByEmailModal from './InviteByEmailModal';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { SEND_EVENT_INVITATIONS } from 'GraphQl/Mutations/mutations';
import dayjs from 'dayjs';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';

vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
    error: vi.fn(),
    success: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
    dismiss: vi.fn(),
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
          eventId: 'test-event-1',
          recurringEventInstanceId: null,
          invitedBy: 'user1',
          userId: 'user2',
          inviteeEmail: 'test@example.com',
          inviteeName: 'Test User',
          invitationToken: 'token123',
          status: 'PENDING',
          expiresAt: dayjs().add(1, 'year').format('YYYY-MM-DD'),
          respondedAt: null,
          metadata: null,
          createdAt: dayjs().format('YYYY-MM-DD'),
          updatedAt: dayjs().format('YYYY-MM-DD'),
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
    <MockedProvider mocks={customMocks} addTypename={false}>
      <I18nextProvider i18n={i18nForTest}>
        <InviteByEmailModal {...defaultProps} {...props} />
      </I18nextProvider>
    </MockedProvider>,
  );
};

describe('InviteByEmailModal', () => {
  let user: ReturnType<typeof userEvent.setup>;
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
    user = userEvent.setup();
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it('renders the modal with initial fields when show is true', () => {
    renderComponent();
    expect(screen.getByText('Invite by Email')).toBeInTheDocument();
    expect(screen.getByText('Recipient emails and names')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByText('Add recipient')).toBeInTheDocument();
    expect(screen.getByTestId('invite-submit')).toBeInTheDocument();
  });

  it('does not render the modal when show is false', () => {
    const { container } = renderComponent({ show: false });
    expect(container.firstChild).toBeNull();
  });

  it('calls handleClose when the header close button is clicked', async () => {
    renderComponent();
    await user.click(screen.getByLabelText('Close'));
    expect(mockHandleClose).toHaveBeenCalledTimes(1);
  });

  it('calls handleClose when the footer close button is clicked', async () => {
    renderComponent();
    await user.click(screen.getByText('Close'));
    expect(mockHandleClose).toHaveBeenCalledTimes(1);
  });

  it('allows adding and removing recipient input fields', async () => {
    renderComponent();
    const emailInputs = () => screen.queryAllByLabelText('Email');
    expect(emailInputs()).toHaveLength(1);
    expect(screen.queryByText('Remove')).not.toBeInTheDocument();

    await user.click(screen.getByText('Add recipient'));
    expect(emailInputs()).toHaveLength(2);
    expect(screen.getAllByText('Remove')).toHaveLength(2);

    await user.click(screen.getAllByText('Remove')[0]);
    expect(emailInputs()).toHaveLength(1);
    expect(screen.queryByText('Remove')).not.toBeInTheDocument();
  });

  it('updates state correctly with multiple recipients', async () => {
    renderComponent();

    // Add a second recipient
    await user.click(screen.getByText('Add recipient'));
    const emailInputs = screen.getAllByLabelText('Email');
    const nameInputs = screen.getAllByLabelText('Name');

    expect(emailInputs).toHaveLength(2);

    // Update first recipient
    await user.type(emailInputs[0], 'user1@example.com');
    await user.type(nameInputs[0], 'User One');

    // Update second recipient
    await user.type(emailInputs[1], 'user2@example.com');
    await user.type(nameInputs[1], 'User Two');

    expect(emailInputs[0]).toHaveValue('user1@example.com');
    expect(nameInputs[0]).toHaveValue('User One');
    expect(emailInputs[1]).toHaveValue('user2@example.com');
    expect(nameInputs[1]).toHaveValue('User Two');
  });

  describe('Form Submission', () => {
    it('shows an error toast if no recipients are provided', async () => {
      renderComponent();
      await user.click(screen.getByTestId('invite-submit'));
      await waitFor(() => {
        expect(NotificationToast.error).toHaveBeenCalledWith(
          'Please provide at least one recipient email',
        );
      });
    });

    it('shows an error toast for invalid email formats', async () => {
      renderComponent();
      const emailInput = screen.getByLabelText('Email');
      await user.type(emailInput, 'invalid-email');
      await user.click(screen.getByTestId('invite-submit'));

      await waitFor(() => {
        expect(NotificationToast.error).toHaveBeenCalledWith(
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
              message: 'Test Message',
              expiresInDays: 7,
              recipients: [{ email: 'test@example.com', name: 'Test User' }],
            },
          },
        },
        result: {
          data: {
            sendEventInvitations: {
              id: '1',
              eventId: 'test-event-1',
              recurringEventInstanceId: null,
              invitedBy: 'user1',
              userId: 'user2',
              inviteeEmail: 'test@example.com',
              inviteeName: 'Test User',
              invitationToken: 'token123',
              status: 'PENDING',
              expiresAt: dayjs().add(1, 'year').format('YYYY-MM-DD'),
              respondedAt: null,
              metadata: null,
              createdAt: dayjs().format('YYYY-MM-DD'),
              updatedAt: dayjs().format('YYYY-MM-DD'),
            },
          },
        },
      };

      renderComponent({}, [successMock]);

      await user.type(screen.getByLabelText('Email'), 'test@example.com');
      await user.type(screen.getByLabelText('Name'), 'Test User');
      await user.type(screen.getByTestId('invite-message'), 'Test Message');

      const sendButton = screen.getByTestId('invite-submit');
      expect(sendButton).not.toBeDisabled();
      expect(screen.queryByTestId('loading-state')).not.toBeInTheDocument();

      await user.click(sendButton);

      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalledWith(
          'Invites sent successfully',
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
        result: {
          data: {
            sendEventInvitations: {
              id: '2',
              eventId: 'test-event-1',
              recurringEventInstanceId: 'test-event-1',
              invitedBy: 'user1',
              userId: 'user2',
              inviteeEmail: 'recurring@example.com',
              inviteeName: '',
              invitationToken: 'token456',
              status: 'PENDING',
              expiresAt: dayjs().add(1, 'year').format('YYYY-MM-DD'),
              respondedAt: null,
              metadata: null,
              createdAt: dayjs().format('YYYY-MM-DD'),
              updatedAt: dayjs().format('YYYY-MM-DD'),
            },
          },
        },
      };

      renderComponent({ isRecurring: true }, [recurringMock]);

      await user.type(screen.getByLabelText('Email'), 'recurring@example.com');

      await user.click(screen.getByTestId('invite-submit'));

      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalledWith(
          'Invites sent successfully',
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
      };

      renderComponent({}, [errorMock]);

      await user.type(screen.getByLabelText('Email'), 'test@example.com');
      await user.click(screen.getByTestId('invite-submit'));

      await waitFor(() => {
        expect(NotificationToast.error).toHaveBeenCalledWith(
          'Error sending invites',
        );
      });
      await waitFor(() => {
        expect(NotificationToast.error).toHaveBeenCalledWith(
          'An error occurred',
        );
      });
      expect(mockHandleClose).not.toHaveBeenCalled();
      expect(screen.queryByTestId('loading-state')).not.toBeInTheDocument();
      expect(screen.getByTestId('invite-submit')).not.toBeDisabled();
    });
  });

  describe('ExpiresInDays Field', () => {
    it('should accept valid number input', async () => {
      renderComponent();
      const expiresInput = screen.getByTestId(
        'invite-expires',
      ) as HTMLInputElement;

      await user.dblClick(expiresInput);
      await user.paste('14');

      expect(expiresInput.value).toBe('14');
    });

    it('should reset to 7 when input is NaN', async () => {
      renderComponent();
      const expiresInput = screen.getByTestId(
        'invite-expires',
      ) as HTMLInputElement;

      await user.dblClick(expiresInput);
      await user.paste('abc');

      expect(expiresInput.value).toBe('7');
    });

    it('should reset to 7 when input is less than 1', async () => {
      renderComponent();
      const expiresInput = screen.getByTestId(
        'invite-expires',
      ) as HTMLInputElement;

      await user.dblClick(expiresInput);
      await user.paste('0');

      expect(expiresInput.value).toBe('7');
    });

    it('should reset to 7 when input is negative', async () => {
      renderComponent();
      const expiresInput = screen.getByTestId(
        'invite-expires',
      ) as HTMLInputElement;

      await user.dblClick(expiresInput);
      await user.paste('-5');
      expect(expiresInput.value).toBe('7');
    });
  });

  describe('Default Parameters', () => {
    it('should use default isRecurring=false when not provided', async () => {
      const minimalProps = {
        show: true,
        handleClose: mockHandleClose,
        eventId: 'test-event-1',
        onInvitesSent: mockOnInvitesSent,
      };

      const successMock: MockedResponse = {
        request: {
          query: SEND_EVENT_INVITATIONS,
          variables: {
            input: {
              eventId: 'test-event-1',
              recurringEventInstanceId: null, // Should be null when isRecurring defaults to false
              message: null,
              expiresInDays: 7,
              recipients: [{ email: 'test@example.com', name: '' }],
            },
          },
        },
        result: {
          data: {
            sendEventInvitations: {
              id: '1',
              eventId: 'test-event-1',
              recurringEventInstanceId: null,
              invitedBy: 'user1',
              userId: 'user2',
              inviteeEmail: 'test@example.com',
              inviteeName: '',
              invitationToken: 'token123',
              status: 'PENDING',
              expiresAt: dayjs().add(1, 'year').format('YYYY-MM-DD'),
              respondedAt: null,
              metadata: null,
              createdAt: dayjs().format('YYYY-MM-DD'),
              updatedAt: dayjs().format('YYYY-MM-DD'),
            },
          },
        },
      };

      render(
        <MockedProvider mocks={[successMock]} addTypename={false}>
          <I18nextProvider i18n={i18nForTest}>
            <InviteByEmailModal {...minimalProps} />
          </I18nextProvider>
        </MockedProvider>,
      );

      await user.type(screen.getByLabelText('Email'), 'test@example.com');
      await user.click(screen.getByTestId('invite-submit'));

      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalledWith(
          'Invites sent successfully',
        );
      });
    });

    it('should handle explicit isRecurring=false correctly', async () => {
      const explicitFalseProps = {
        isRecurring: false,
      };

      const successMock: MockedResponse = {
        request: {
          query: SEND_EVENT_INVITATIONS,
          variables: {
            input: {
              eventId: 'test-event-1',
              recurringEventInstanceId: null,
              message: null,
              expiresInDays: 7,
              recipients: [{ email: 'explicit@example.com', name: '' }],
            },
          },
        },
        result: {
          data: {
            sendEventInvitations: {
              id: '3',
              eventId: 'test-event-1',
              recurringEventInstanceId: null,
              invitedBy: 'user1',
              userId: 'user2',
              inviteeEmail: 'explicit@example.com',
              inviteeName: '',
              invitationToken: 'token789',
              status: 'PENDING',
              expiresAt: dayjs().add(1, 'year').format('YYYY-MM-DD'),
              respondedAt: null,
              metadata: null,
              createdAt: dayjs().format('YYYY-MM-DD'),
              updatedAt: dayjs().format('YYYY-MM-DD'),
            },
          },
        },
      };

      renderComponent(explicitFalseProps, [successMock]);

      await user.type(screen.getByLabelText('Email'), 'explicit@example.com');
      await user.click(screen.getByTestId('invite-submit'));

      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalledWith(
          'Invites sent successfully',
        );
      });
    });
  });
});
