import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { MockedProvider } from '@apollo/client/testing';
import type { MockedResponse } from '@apollo/client/testing';
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
  mocks: MockedResponse[],
  initialRoute: string,
  authToken?: string,
) => {
  mockUseLocalStorage.mockReturnValue({
    getItem: (key: string) => {
      if (key === 'token') return authToken;
      // by default tests expect no pending token in storage unless explicitly set
      if (key === 'pendingInvitationToken') return null;
      return null;
    },
    setItem: vi.fn(),
    removeItem: vi.fn(),
  });

  return render(
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
  );
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
            },
          },
        },
      },
    ];
    renderComponent(mocks, '/invitation/test-token');
    // Loader component renders a spinner with test id 'spinner'
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('should show error for invalid token', async () => {
    renderComponent([], '/invitation/');
    await waitFor(() => {
      expect(screen.getByText('Invalid invitation token')).toBeInTheDocument();
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
            },
          },
        },
      },
    ];
    renderComponent(mocks, '/invitation/test-token');
    await waitFor(() => {
      // component shows event id when available, e.g. 'Event event-1'
      expect(
        screen.getByRole('heading', { name: /Event event-1/ }),
      ).toBeInTheDocument();
      expect(screen.getByText('Log in')).toBeInTheDocument();
      expect(screen.getByText('Sign up')).toBeInTheDocument();
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
      renderComponent(
        [verifyMock, acceptMock],
        '/invitation/test-token',
        'auth-token',
      );
      await waitFor(() => {
        fireEvent.click(screen.getByTestId('accept-invite-btn'));
      });
      await waitFor(() => {
        expect(screen.getByText('Event Page')).toBeInTheDocument();
        expect(toast.success).toHaveBeenCalledWith('Invitation accepted');
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
        fireEvent.click(screen.getByTestId('accept-invite-btn'));
      });
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Acceptance failed');
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
        fireEvent.click(screen.getByText('Sign in as a different user'));
      });
      await waitFor(() => {
        expect(screen.getByText('Login Page')).toBeInTheDocument();
        expect(mockUseLocalStorage().removeItem).toHaveBeenCalledWith('token');
      });
    });
  });
});
