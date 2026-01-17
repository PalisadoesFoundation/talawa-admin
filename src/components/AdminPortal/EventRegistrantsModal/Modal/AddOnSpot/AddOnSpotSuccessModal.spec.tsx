import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router';
import { SIGNUP_MUTATION } from 'GraphQl/Mutations/mutations';
import AddOnSpotAttendee from './AddOnSpotAttendee';
import userEvent from '@testing-library/user-event';
import type { RenderResult } from '@testing-library/react';
import { toast } from 'react-toastify';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { describe, expect, vi } from 'vitest';

/* ================= HOISTED MOCKS ================= */

const mockUseParams = vi.hoisted(() => vi.fn());

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useParams: mockUseParams,
  };
});

vi.mock('react-toastify', () => ({
  toast: {
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

const MOCKS = [
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

const ERROR_MOCKS = [
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

const renderComponent = (): RenderResult => {
  return render(
    <MockedProvider mocks={MOCKS} addTypename={false}>
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
  afterEach(() => {
    vi.clearAllMocks();
  });

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseParams.mockReturnValue({
      eventId: '123',
      orgId: '123',
    });
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

  it('submits form successfully and shows success modal', async () => {
    renderComponent();

    await userEvent.type(screen.getByLabelText(/First Name/i), 'John');
    await userEvent.type(screen.getByLabelText(/Last Name/i), 'Doe');
    await userEvent.type(screen.getByLabelText(/Email/i), 'john@example.com');
    await userEvent.type(screen.getByLabelText(/Phone No./i), '1234567890');

    fireEvent.change(screen.getByLabelText(/Gender/i), {
      target: { value: 'Male' },
    });

    fireEvent.submit(screen.getByTestId('onspot-attendee-form'));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled();
      expect(mockProps.reloadMembers).toHaveBeenCalled();
    });

    /* Success modal */
    expect(
      await screen.findByText(/attendee added successfully/i),
    ).toBeInTheDocument();

    /* Masked password */
    expect(screen.getByText('********')).toBeInTheDocument();

    /* Show password */
    fireEvent.click(screen.getByRole('button', { name: /show/i }));
    expect(screen.getByText(TEST_PASSWORD)).toBeInTheDocument();

    /* Copy */
    fireEvent.click(screen.getByRole('button', { name: /copy/i }));

    /* Close (pick LAST close button) */
    const closeButtons = screen.getAllByRole('button', { name: /close/i });
    fireEvent.click(closeButtons[closeButtons.length - 1]);

    await waitFor(() => {
      expect(mockProps.handleClose).toHaveBeenCalled();
    });
  });

  it('handles mutation error', async () => {
    render(
      <MockedProvider mocks={ERROR_MOCKS} addTypename={false}>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <BrowserRouter>
              <AddOnSpotAttendee {...mockProps} />
            </BrowserRouter>
          </I18nextProvider>
        </Provider>
      </MockedProvider>,
    );

    await userEvent.type(screen.getByLabelText(/First Name/i), 'John');
    await userEvent.type(screen.getByLabelText(/Last Name/i), 'Doe');
    await userEvent.type(screen.getByLabelText(/Email/i), 'john@example.com');

    fireEvent.submit(screen.getByTestId('onspot-attendee-form'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });

  it('shows error if required fields missing', async () => {
    renderComponent();

    fireEvent.submit(screen.getByTestId('onspot-attendee-form'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });

  it('shows error if orgId missing', async () => {
    mockUseParams.mockReturnValue({
      eventId: '123',
      orgId: undefined,
    });

    render(
      <MockedProvider mocks={[]}>
        <BrowserRouter>
          <AddOnSpotAttendee {...mockProps} />
        </BrowserRouter>
      </MockedProvider>,
    );

    fireEvent.submit(screen.getByTestId('onspot-attendee-form'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });
});
