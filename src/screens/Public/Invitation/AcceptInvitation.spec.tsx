import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { MockedProvider } from '@apollo/client/testing/react';
import type { MockLink } from '@apollo/client/testing';
import {
  VERIFY_EVENT_INVITATION,
  ACCEPT_EVENT_INVITATION,
} from 'GraphQl/Mutations/mutations';
import AcceptInvitation from './AcceptInvitation';
import { useLocalStorage } from '../../../utils/useLocalstorage';
import { toast } from 'react-toastify';
import { vi } from 'vitest';

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options: { defaultValue: string }) => options.defaultValue,
  }),
}));
vi.mock('../../../utils/useLocalstorage');

const mockUseLocalStorage = useLocalStorage as unknown as ReturnType<
  typeof vi.fn
>;

const renderComponent = (
  mocks: MockLink.MockedResponse[],
  initialRoute: string,
  authToken?: string,
  pendingToken?: string,
) => {
  const mockLocalStorage = {
    getItem: vi.fn((key: string) => {
      if (key === 'token') return authToken || null;
      if (key === 'pendingInvitationToken') return pendingToken || null;
      return null;
    }),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  };

  mockUseLocalStorage.mockReturnValue(mockLocalStorage);

  return {
    ...render(
      <MockedProvider mocks={mocks}>
        <MemoryRouter initialEntries={[initialRoute]}>
          <Routes>
            <Route path="/invitation/:token" element={<AcceptInvitation />} />
            <Route path="/invitation/" element={<AcceptInvitation />} />
            <Route path="/" element={<div>Login Page</div>} />
            <Route path="/register" element={<div>Signup Page</div>} />
            <Route
              path="/user/event/:orgId/:eventId"
              element={<div>Event Page</div>}
            />
            <Route
              path="/user/organizations"
              element={<div>Organizations Page</div>}
            />
          </Routes>
        </MemoryRouter>
      </MockedProvider>,
    ),
    mockLocalStorage,
  };
};

describe('AcceptInvitation', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should show loader while verifying', () => {
    const mocks = [
      {
        request: {
          query: VERIFY_EVENT_INVITATION,
          variables: { input: { invitationToken: 'test-token' } },
        },
        result: {
          data: {
            verifyEventInvitation: {
              invitationToken: 'test-token',
              eventId: 'event-1',
              organizationId: 'org-1',
              inviteeName: 'Test Invitee',
              status: 'PENDING',
              expiresAt: '2025-12-31T23:59:59Z',
              inviteeEmailMasked: null,
              recurringEventInstanceId: null,
            },
          },
        },
      },
    ];
    renderComponent(mocks, '/invitation/test-token');
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('should show error for invalid token', async () => {
    renderComponent([], '/invitation/');
    await waitFor(() => {
      expect(screen.getByText('Invalid invitation token')).toBeInTheDocument();
    });
  });

  // NEW: Test for using pending token from localStorage
  it('should use pending token from localStorage when URL token is missing', async () => {
    const mocks = [
      {
        request: {
          query: VERIFY_EVENT_INVITATION,
          variables: { input: { invitationToken: 'pending-token' } },
        },
        result: {
          data: {
            verifyEventInvitation: {
              invitationToken: 'pending-token',
              eventId: 'event-2',
              organizationId: 'org-2',
              inviteeName: 'Pending Invitee',
              status: 'PENDING',
              expiresAt: '2025-12-31T23:59:59Z',
              inviteeEmailMasked: null,
              recurringEventInstanceId: null,
            },
          },
        },
      },
    ];
    renderComponent(mocks, '/invitation/', undefined, 'pending-token');
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /Event event-2/ }),
      ).toBeInTheDocument();
    });
  });

  it('should show error on verification failure', async () => {
    const mocks = [
      {
        request: {
          query: VERIFY_EVENT_INVITATION,
          variables: { input: { invitationToken: 'test-token' } },
        },
        error: new Error('Verification failed'),
      },
    ];
    renderComponent(mocks, '/invitation/test-token');
    await waitFor(() => {
      expect(screen.getByText('Verification failed')).toBeInTheDocument();
    });
  });

  // NEW: Test for verification returning null data
  it('should show error when verification returns no data', async () => {
    const mocks = [
      {
        request: {
          query: VERIFY_EVENT_INVITATION,
          variables: { input: { invitationToken: 'test-token' } },
        },
        result: {
          data: { verifyEventInvitation: null },
        },
      },
    ];
    renderComponent(mocks, '/invitation/test-token');
    await waitFor(() => {
      expect(
        screen.getByText('Invitation not found or invalid'),
      ).toBeInTheDocument();
    });
  });

  // NEW: Test for verification error without message
  it('should show generic error when verification fails without message', async () => {
    const mocks = [
      {
        request: {
          query: VERIFY_EVENT_INVITATION,
          variables: { input: { invitationToken: 'test-token' } },
        },
        error: new Error(''),
      },
    ];
    renderComponent(mocks, '/invitation/test-token');
    await waitFor(() => {
      // Apollo Client returns "Error message not found." for empty error messages
      expect(
        screen.getByText('Error verifying invitation'),
      ).toBeInTheDocument();
    });
  });

  it('should show invitation details for unauthenticated user', async () => {
    const mocks = [
      {
        request: {
          query: VERIFY_EVENT_INVITATION,
          variables: { input: { invitationToken: 'test-token' } },
        },
        result: {
          data: {
            verifyEventInvitation: {
              invitationToken: 'test-token',
              eventId: 'event-1',
              organizationId: 'org-1',
              expiresAt: new Date().toISOString(),
              inviteeName: 'Test Invitee',
              status: 'PENDING',
              inviteeEmailMasked: null,
              recurringEventInstanceId: null,
            },
          },
        },
      },
    ];
    renderComponent(mocks, '/invitation/test-token');
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /Event event-1/ }),
      ).toBeInTheDocument();
      expect(screen.getByText('Log in')).toBeInTheDocument();
      expect(screen.getByText('Sign up')).toBeInTheDocument();
    });
  });

  // NEW: Test for invitation without eventId (shows default title)
  it('should show default title when eventId is not present', async () => {
    const mocks = [
      {
        request: {
          query: VERIFY_EVENT_INVITATION,
          variables: { input: { invitationToken: 'test-token' } },
        },
        result: {
          data: {
            verifyEventInvitation: {
              invitationToken: 'test-token',
              organizationId: 'org-1',
              eventId: null,
              inviteeName: 'Test Invitee',
              status: 'PENDING',
              expiresAt: '2025-12-31T23:59:59Z',
              inviteeEmailMasked: null,
              recurringEventInstanceId: null,
            },
          },
        },
      },
    ];
    renderComponent(mocks, '/invitation/test-token');
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Event Invitation' }),
      ).toBeInTheDocument();
    });
  });

  // NEW: Test for displaying all invitation metadata fields
  it('should display all invitation metadata fields correctly', async () => {
    const expiryDate = '2025-12-31T23:59:59Z';
    const mocks = [
      {
        request: {
          query: VERIFY_EVENT_INVITATION,
          variables: { input: { invitationToken: 'test-token' } },
        },
        result: {
          data: {
            verifyEventInvitation: {
              invitationToken: 'test-token',
              eventId: 'event-1',
              organizationId: 'org-1',
              inviteeEmailMasked: 'test@example.com',
              expiresAt: expiryDate,
              inviteeName: 'Test Invitee',
              status: 'PENDING',
              recurringEventInstanceId: null,
            },
          },
        },
      },
    ];
    renderComponent(mocks, '/invitation/test-token', 'auth-token');
    await waitFor(() => {
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
      expect(screen.getByText('org-1')).toBeInTheDocument();
      expect(screen.getByText('event-1')).toBeInTheDocument();
      expect(
        screen.getByText(new Date(expiryDate).toLocaleString()),
      ).toBeInTheDocument();
    });
  });

  // NEW: Test for missing optional fields (shows dashes)
  it('should display dashes for missing optional fields', async () => {
    const mocks = [
      {
        request: {
          query: VERIFY_EVENT_INVITATION,
          variables: { input: { invitationToken: 'test-token' } },
        },
        result: {
          data: {
            verifyEventInvitation: {
              invitationToken: 'test-token',
              inviteeName: 'Test Invitee',
              status: 'PENDING',
              expiresAt: null,
              eventId: null,
              organizationId: null,
              inviteeEmailMasked: null,
              recurringEventInstanceId: null,
            },
          },
        },
      },
    ];
    renderComponent(mocks, '/invitation/test-token');
    await waitFor(() => {
      const dashes = screen.getAllByText('-');
      expect(dashes.length).toBeGreaterThanOrEqual(3); // organizationId, eventId, expiresAt
    });
  });

  // NEW: Test that login stores token in localStorage
  it('should navigate to login and store token on login button click', async () => {
    const mocks = [
      {
        request: {
          query: VERIFY_EVENT_INVITATION,
          variables: { input: { invitationToken: 'test-token' } },
        },
        result: {
          data: {
            verifyEventInvitation: {
              invitationToken: 'test-token',
              eventId: 'event-1',
              organizationId: 'org-1',
              inviteeName: 'Test Invitee',
              status: 'PENDING',
              expiresAt: '2025-12-31T23:59:59Z',
              inviteeEmailMasked: null,
              recurringEventInstanceId: null,
            },
          },
        },
      },
    ];
    const { mockLocalStorage } = renderComponent(
      mocks,
      '/invitation/test-token',
    );
    await waitFor(() => {
      fireEvent.click(screen.getByText('Log in'));
    });
    await waitFor(() => {
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'pendingInvitationToken',
        'test-token',
      );
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });
  });

  it('should navigate to login on login button click', async () => {
    const mocks = [
      {
        request: {
          query: VERIFY_EVENT_INVITATION,
          variables: { input: { invitationToken: 'test-token' } },
        },
        result: {
          data: {
            verifyEventInvitation: {
              invitationToken: 'test-token',
              eventId: 'event-1',
              organizationId: 'org-1',
              inviteeName: 'Test Invitee',
              status: 'PENDING',
              expiresAt: '2025-12-31T23:59:59Z',
              inviteeEmailMasked: null,
              recurringEventInstanceId: null,
            },
          },
        },
      },
    ];
    renderComponent(mocks, '/invitation/test-token');
    await waitFor(() => {
      fireEvent.click(screen.getByText('Log in'));
    });
    await waitFor(() => {
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });
  });

  // NEW: Test that signup stores token in localStorage
  it('should navigate to signup and store token on signup button click', async () => {
    const mocks = [
      {
        request: {
          query: VERIFY_EVENT_INVITATION,
          variables: { input: { invitationToken: 'test-token' } },
        },
        result: {
          data: {
            verifyEventInvitation: {
              invitationToken: 'test-token',
              eventId: 'event-1',
              organizationId: 'org-1',
              inviteeName: 'Test Invitee',
              status: 'PENDING',
              expiresAt: '2025-12-31T23:59:59Z',
              inviteeEmailMasked: null,
              recurringEventInstanceId: null,
            },
          },
        },
      },
    ];
    const { mockLocalStorage } = renderComponent(
      mocks,
      '/invitation/test-token',
    );
    await waitFor(() => {
      fireEvent.click(screen.getByText('Sign up'));
    });
    await waitFor(() => {
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'pendingInvitationToken',
        'test-token',
      );
      expect(screen.getByText('Signup Page')).toBeInTheDocument();
    });
  });

  it('should navigate to signup on signup button click', async () => {
    const mocks = [
      {
        request: {
          query: VERIFY_EVENT_INVITATION,
          variables: { input: { invitationToken: 'test-token' } },
        },
        result: {
          data: {
            verifyEventInvitation: {
              invitationToken: 'test-token',
              eventId: 'event-1',
              organizationId: 'org-1',
              inviteeName: 'Test Invitee',
              status: 'PENDING',
              expiresAt: '2025-12-31T23:59:59Z',
              inviteeEmailMasked: 't**@example.com',
              recurringEventInstanceId: null,
            },
          },
        },
      },
    ];
    renderComponent(mocks, '/invitation/test-token');
    await waitFor(() => {
      fireEvent.click(screen.getByText('Sign up'));
    });
    await waitFor(() => {
      expect(screen.getByText('Signup Page')).toBeInTheDocument();
    });
  });

  describe('Authenticated User', () => {
    const verifyMock = {
      request: {
        query: VERIFY_EVENT_INVITATION,
        variables: { input: { invitationToken: 'test-token' } },
      },
      result: {
        data: {
          verifyEventInvitation: {
            invitationToken: 'test-token',
            eventId: 'event-1',
            organizationId: 'org-1',
            inviteeName: 'Test Invitee',
            status: 'PENDING',
            expiresAt: '2025-12-31T23:59:59Z',
            inviteeEmailMasked: null,
            recurringEventInstanceId: null,
          },
        },
      },
    };

    const acceptMock = {
      request: {
        query: ACCEPT_EVENT_INVITATION,
        variables: { input: { invitationToken: 'test-token' } },
      },
      result: {
        data: {
          acceptEventInvitation: {
            invitationToken: 'test-token',
            id: 'invite-1',
            eventId: 'event-1',
            organizationId: 'org-1',
            recurringEventInstanceId: null,
            invitedBy: null,
            userId: 'user-1',
            inviteeEmail: 'test@example.com',
            inviteeName: 'Test Invitee',
            status: 'ACCEPTED',
            expiresAt: '2025-12-31T23:59:59Z',
            respondedAt: new Date().toISOString(),
            metadata: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            __typename: 'EventInvitation',
          },
        },
      },
    };

    it('should show accept button for authenticated user', async () => {
      renderComponent([verifyMock], '/invitation/test-token', 'auth-token');
      await waitFor(() => {
        expect(screen.getByTestId('accept-invite-btn')).toBeInTheDocument();
      });
    });

    it('should handle invitation acceptance', async () => {
      const { mockLocalStorage } = renderComponent(
        [verifyMock, acceptMock],
        '/invitation/test-token',
        'auth-token',
      );
      await waitFor(() => {
        expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
      });
      fireEvent.click(screen.getByTestId('accept-invite-btn'));
      await waitFor(() => {
        expect(screen.getByText('Event Page')).toBeInTheDocument();
        expect(toast.success).toHaveBeenCalledWith('Invitation accepted');
        expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(
          'pendingInvitationToken',
        );
      });
    });

    // NEW: Test acceptance without eventId (navigates to organizations)
    it('should navigate to organizations page when eventId is missing after acceptance', async () => {
      const verifyWithoutEventMock = {
        request: {
          query: VERIFY_EVENT_INVITATION,
          variables: { input: { invitationToken: 'test-token' } },
        },
        result: {
          data: {
            verifyEventInvitation: {
              invitationToken: 'test-token',
              eventId: null,
              organizationId: 'org-1',
              inviteeName: 'Test Invitee',
              status: 'PENDING',
              expiresAt: '2025-12-31T23:59:59Z',
              inviteeEmailMasked: null,
              recurringEventInstanceId: null,
            },
          },
        },
      };

      renderComponent(
        [verifyWithoutEventMock, acceptMock],
        '/invitation/test-token',
        'auth-token',
      );
      await waitFor(() => {
        expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
      });
      fireEvent.click(screen.getByTestId('accept-invite-btn'));
      await waitFor(() => {
        expect(screen.getByText('Organizations Page')).toBeInTheDocument();
      });
    });

    // NEW: Test acceptance returns null data
    it('should not navigate when acceptance returns no data', async () => {
      const acceptNullMock = {
        request: {
          query: ACCEPT_EVENT_INVITATION,
          variables: { input: { invitationToken: 'test-token' } },
        },
        result: {
          data: { acceptEventInvitation: null },
        },
      };

      renderComponent(
        [verifyMock, acceptNullMock],
        '/invitation/test-token',
        'auth-token',
      );
      await waitFor(() => {
        expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
      });
      fireEvent.click(screen.getByTestId('accept-invite-btn'));
      await waitFor(() => {
        expect(screen.queryByText('Event Page')).not.toBeInTheDocument();
        expect(toast.success).not.toHaveBeenCalled();
      });
    });

    it('should handle acceptance failure', async () => {
      const acceptFailMock = {
        request: {
          query: ACCEPT_EVENT_INVITATION,
          variables: { input: { invitationToken: 'test-token' } },
        },
        error: new Error('Acceptance failed'),
      };

      renderComponent(
        [verifyMock, acceptFailMock],
        '/invitation/test-token',
        'auth-token',
      );
      await waitFor(() => {
        expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
      });
      fireEvent.click(screen.getByTestId('accept-invite-btn'));
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Acceptance failed');
      });
    });

    // NEW: Test acceptance failure without error message
    it('should show default error message when acceptance fails without message', async () => {
      const acceptFailMock = {
        request: {
          query: ACCEPT_EVENT_INVITATION,
          variables: { input: { invitationToken: 'test-token' } },
        },
        error: new Error(''),
      };

      renderComponent(
        [verifyMock, acceptFailMock],
        '/invitation/test-token',
        'auth-token',
      );
      await waitFor(() => {
        expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
      });
      fireEvent.click(screen.getByTestId('accept-invite-btn'));
      await waitFor(() => {
        // Apollo Client returns "Error message not found." for empty error messages
        expect(toast.error).toHaveBeenCalledWith('Could not accept invitation');
      });
    });

    // NEW: Test button shows loading state during submission
    it('should show loading state on accept button during submission', async () => {
      renderComponent(
        [verifyMock, acceptMock],
        '/invitation/test-token',
        'auth-token',
      );

      await waitFor(() => {
        expect(screen.getByTestId('accept-invite-btn')).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
      });
      const button = screen.getByTestId('accept-invite-btn');
      fireEvent.click(button);

      // Wait for the loading state to appear
      await waitFor(() => {
        expect(screen.getByTestId('spinner')).toBeInTheDocument();
      });
    });

    it('should require confirmation for masked email', async () => {
      const verifyMaskedEmailMock = {
        request: {
          query: VERIFY_EVENT_INVITATION,
          variables: { input: { invitationToken: 'test-token' } },
        },
        result: {
          data: {
            verifyEventInvitation: {
              invitationToken: 'test-token',
              eventId: 'event-1',
              organizationId: 'org-1',
              inviteeEmailMasked: 't**@e***.com',
              inviteeName: 'Test Invitee',
              status: 'PENDING',
              expiresAt: '2025-12-31T23:59:59Z',
              recurringEventInstanceId: null,
            },
          },
        },
      };

      renderComponent(
        [verifyMaskedEmailMock],
        '/invitation/test-token',
        'auth-token',
      );
      await waitFor(() => {
        const acceptButton = screen.getByTestId('accept-invite-btn');
        expect(acceptButton).toBeDisabled();
        const checkbox = screen.getByLabelText(
          'I confirm the email address of my account matches the invited address (shown above).',
        );
        fireEvent.click(checkbox);
        expect(acceptButton).not.toBeDisabled();
      });
    });

    // NEW: Test masked email warning message appears
    it('should show warning message for masked email invitations', async () => {
      const verifyMaskedEmailMock = {
        request: {
          query: VERIFY_EVENT_INVITATION,
          variables: { input: { invitationToken: 'test-token' } },
        },
        result: {
          data: {
            verifyEventInvitation: {
              invitationToken: 'test-token',
              inviteeEmailMasked: 't**@e***.com',
              eventId: 'event-1',
              organizationId: 'org-1',
              inviteeName: 'Test Invitee',
              status: 'PENDING',
              expiresAt: '2025-12-31T23:59:59Z',
              recurringEventInstanceId: null,
            },
          },
        },
      };

      renderComponent(
        [verifyMaskedEmailMock],
        '/invitation/test-token',
        'auth-token',
      );
      await waitFor(() => {
        expect(
          screen.getByText(
            /This invitation was issued to a masked email address/,
          ),
        ).toBeInTheDocument();
      });
    });

    it('should allow signing in as a different user', async () => {
      const verifyMaskedEmailMock = {
        request: {
          query: VERIFY_EVENT_INVITATION,
          variables: { input: { invitationToken: 'test-token' } },
        },
        result: {
          data: {
            verifyEventInvitation: {
              invitationToken: 'test-token',
              inviteeEmailMasked: 't**@e***.com',
              eventId: 'event-1',
              organizationId: 'org-1',
              inviteeName: 'Test Invitee',
              status: 'PENDING',
              expiresAt: '2025-12-31T23:59:59Z',
              recurringEventInstanceId: null,
            },
          },
        },
      };

      const { mockLocalStorage } = renderComponent(
        [verifyMaskedEmailMock],
        '/invitation/test-token',
        'auth-token',
      );
      await waitFor(() => {
        fireEvent.click(screen.getByText('Sign in as a different user'));
      });
      await waitFor(() => {
        expect(screen.getByText('Login Page')).toBeInTheDocument();
        expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('token');
        expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('email');
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
          'pendingInvitationToken',
          'test-token',
        );
      });
    });

    // NEW: Test that "Sign in as different user" button only shows for masked emails
    it('should not show "Sign in as different user" button for non-masked invitations', async () => {
      renderComponent([verifyMock], '/invitation/test-token', 'auth-token');
      await waitFor(() => {
        expect(
          screen.queryByText('Sign in as a different user'),
        ).not.toBeInTheDocument();
      });
    });

    // NEW: Test unchecking confirmation checkbox disables button again
    it('should disable accept button when confirmation checkbox is unchecked', async () => {
      const verifyMaskedEmailMock = {
        request: {
          query: VERIFY_EVENT_INVITATION,
          variables: { input: { invitationToken: 'test-token' } },
        },
        result: {
          data: {
            verifyEventInvitation: {
              invitationToken: 'test-token',
              inviteeEmailMasked: 't**@e***.com',
              eventId: 'event-1',
              organizationId: 'org-1',
              inviteeName: 'Test Invitee',
              status: 'PENDING',
              expiresAt: '2025-12-31T23:59:59Z',
              recurringEventInstanceId: null,
            },
          },
        },
      };

      renderComponent(
        [verifyMaskedEmailMock],
        '/invitation/test-token',
        'auth-token',
      );
      await waitFor(() => {
        const checkbox = screen.getByLabelText(
          'I confirm the email address of my account matches the invited address (shown above).',
        );
        fireEvent.click(checkbox); // Check
        const acceptButton = screen.getByTestId('accept-invite-btn');
        expect(acceptButton).not.toBeDisabled();

        fireEvent.click(checkbox); // Uncheck
        expect(acceptButton).toBeDisabled();
      });
    });
  });
});
