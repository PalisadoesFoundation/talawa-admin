import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router';
import { SIGNUP_MUTATION } from 'GraphQl/Mutations/mutations';
import AddOnSpotAttendee from './AddOnSpotAttendee';
import type { RenderResult } from '@testing-library/react';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { describe, expect, vi, beforeEach, afterEach, it } from 'vitest';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';
import type { MockedResponse } from '@apollo/client/testing';

/* ================= HOISTED MOCKS ================= */

const mockUseParams = vi.hoisted(() => vi.fn());

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useParams: mockUseParams,
  };
});

vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const TEST_PASSWORD = 'TestPass124!';

vi.mock('utils/generateSecurePassword', () => ({
  generateSecurePassword: vi.fn(() => TEST_PASSWORD),
}));

/* ================= SETUP ================= */

const mockProps = {
  show: true,
  handleClose: vi.fn(),
  reloadMembers: vi.fn(),
};
const SUCCESS_MOCKS: MockedResponse[] = [
  {
    request: {
      query: SIGNUP_MUTATION,
      variables: {
        ID: '123',
        name: 'John Doe',
        email: 'john@example.com',
        password: TEST_PASSWORD,
      },
    },
    result: {
      data: {
        signUp: {
          user: { id: '1' },
          authenticationToken: 'mock-token',
        },
      },
    },
  },
];

const ERROR_MOCKS: MockedResponse[] = [
  {
    request: {
      query: SIGNUP_MUTATION,
      variables: {
        ID: '123',
        name: 'John Doe',
        email: 'john@example.com',
        password: TEST_PASSWORD,
      },
    },
    error: new Error('Failed to add attendee'),
  },
];

const renderComponent = (
  mocks: MockedResponse[] = SUCCESS_MOCKS,
): RenderResult => {
  return render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <Provider store={store}>
        <I18nextProvider i18n={i18nForTest}>
          <BrowserRouter>
            <AddOnSpotAttendee {...mockProps} />
          </BrowserRouter>
        </I18nextProvider>
      </Provider>
    </MockedProvider>,
  );
};
/* ================= TESTS ================= */

describe('AddOnSpotAttendee Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseParams.mockReturnValue({
      eventId: '123',
      orgId: '123',
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders all form fields', () => {
    renderComponent();

    expect(screen.getByText('On-spot Attendee')).toBeInTheDocument();
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone No./i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Gender/i)).toBeInTheDocument();
  });

  it('submits form successfully', async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.type(screen.getByLabelText(/First Name/i), 'John');
    await user.type(screen.getByLabelText(/Last Name/i), 'Doe');
    await user.type(screen.getByLabelText(/Email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/Phone No./i), '1234567890');
    await user.selectOptions(screen.getByLabelText(/Gender/i), 'Male');

    await user.click(
      screen.getByRole('button', { name: /add attendee/i }),
    );

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalled();
      expect(mockProps.reloadMembers).toHaveBeenCalled();
      expect(mockProps.handleClose).toHaveBeenCalled();
    });
  });

  it('handles mutation error', async () => {
    const user = userEvent.setup();
    renderComponent(ERROR_MOCKS);

    await user.type(screen.getByLabelText(/First Name/i), 'John');
    await user.type(screen.getByLabelText(/Last Name/i), 'Doe');
    await user.type(screen.getByLabelText(/Email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/Phone No./i), '1234567890');

    await user.click(
      screen.getByRole('button', { name: /add attendee/i }),
    );

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalled();
    });
  });

  it('shows error if required fields missing', async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(
      screen.getByRole('button', { name: /add attendee/i }),
    );

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalled();
    });
  });

  it('shows error if orgId missing', async () => {
    mockUseParams.mockReturnValue({
      eventId: '123',
      orgId: undefined,
    });

    const user = userEvent.setup();
    renderComponent();

    await user.type(screen.getByLabelText(/First Name/i), 'John');
    await user.type(screen.getByLabelText(/Last Name/i), 'Doe');
    await user.type(screen.getByLabelText(/Email/i), 'john@example.com');

    await user.click(
      screen.getByRole('button', { name: /add attendee/i }),
    );

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalled();
    });
  });

  it('does not submit when email is missing', async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.type(screen.getByLabelText(/First Name/i), 'John');
    await user.type(screen.getByLabelText(/Last Name/i), 'Doe');

    await user.click(
      screen.getByRole('button', { name: /add attendee/i }),
    );

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalled();
      expect(mockProps.reloadMembers).not.toHaveBeenCalled();
    });
  });

  it('resets form fields after successful submission', async () => {
    const user = userEvent.setup();
    renderComponent();

    const firstName = screen.getByLabelText(/First Name/i) as HTMLInputElement;
    const lastName = screen.getByLabelText(/Last Name/i) as HTMLInputElement;
    const email = screen.getByLabelText(/Email/i) as HTMLInputElement;

    await user.type(firstName, 'John');
    await user.type(lastName, 'Doe');
    await user.type(email, 'john@example.com');

    await user.click(
      screen.getByRole('button', { name: /add attendee/i }),
    );

    await waitFor(() => {
      expect(firstName).toHaveValue('');
      expect(lastName).toHaveValue('');
      expect(email).toHaveValue('');
    });
  });

  it('updates form fields correctly on user input', async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.type(screen.getByLabelText(/First Name/i), 'Jane');
    await user.type(screen.getByLabelText(/Last Name/i), 'Smith');
    await user.type(screen.getByLabelText(/Email/i), 'jane@example.com');
    await user.type(screen.getByLabelText(/Phone No./i), '9876543210');
    await user.selectOptions(screen.getByLabelText(/Gender/i), 'Female');

    expect(screen.getByLabelText(/First Name/i)).toHaveValue('Jane');
    expect(screen.getByLabelText(/Last Name/i)).toHaveValue('Smith');
    expect(screen.getByLabelText(/Email/i)).toHaveValue('jane@example.com');
    expect(screen.getByLabelText(/Phone No./i)).toHaveValue('9876543210');
    expect(screen.getByLabelText(/Gender/i)).toHaveValue('Female');
  });

  it('disables submit button while submitting', async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.type(screen.getByLabelText(/First Name/i), 'John');
    await user.type(screen.getByLabelText(/Last Name/i), 'Doe');
    await user.type(screen.getByLabelText(/Email/i), 'john@example.com');

    const submitButton = screen.getByRole('button', {
      name: /add attendee/i,
    });

    await user.click(submitButton);

    expect(submitButton).toBeDisabled();

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalled();
    });
  });
});
