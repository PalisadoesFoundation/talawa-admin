import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router';
import { SIGNUP_MUTATION } from 'GraphQl/Mutations/mutations';
import AddOnSpotAttendee from './AddOnSpotAttendee';
import userEvent from '@testing-library/user-event';
import type { RenderResult } from '@testing-library/react';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { describe, expect, vi } from 'vitest';

const sharedMocks = vi.hoisted(() => ({
  NotificationToast: {
    success: vi.fn(),
    error: vi.fn(),
  },
  navigate: vi.fn(),
}));

vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: sharedMocks.NotificationToast,
}));

const mockProps = {
  show: true,
  handleClose: vi.fn(),
  reloadMembers: vi.fn(),
};
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useParams: () => ({ eventId: '123', orgId: '123' }),
  };
});

const MOCKS = [
  {
    request: {
      query: SIGNUP_MUTATION,
      variables: {
        ID: '123',
        name: 'John Doe',
        email: 'john@example.com',
        password: '123456',
      },
    },
    result: {
      data: {
        signUp: {
          user: {
            id: '1',
          },
          authenticationToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
        },
      },
    },
    delay: 50, // Add delay to capture loading state
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
        password: '123456',
      },
    },
    error: new Error('Failed to add attendee'),
  },
];

const renderAddOnSpotAttendee = (): RenderResult => {
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

describe('AddOnSpotAttendee Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the component with all form fields', async () => {
    renderAddOnSpotAttendee();

    expect(screen.getByText('On-spot Attendee')).toBeInTheDocument();
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone No./i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Gender/i)).toBeInTheDocument();
  });

  it('handles case where signUp response is undefined', async () => {
    const mockWithoutSignUp = [
      {
        request: {
          query: SIGNUP_MUTATION,
          variables: {
            ID: '123',
            name: 'John Doe',
            email: 'john@example.com',
            password: '123456',
          },
        },
        result: {
          data: {
            signUp: null,
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={mockWithoutSignUp}>
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
    await userEvent.type(screen.getByLabelText(/Phone No./i), '1234567890');
    const genderSelect = screen.getByLabelText(/Gender/i);
    fireEvent.change(genderSelect, { target: { value: 'Male' } });

    fireEvent.submit(screen.getByTestId('onspot-attendee-form'));

    await waitFor(() => {
      expect(sharedMocks.NotificationToast.success).not.toHaveBeenCalled(); // Ensure success toast is not shown
      expect(sharedMocks.NotificationToast.error).not.toHaveBeenCalled(); // Ensure no unexpected error toast
      expect(mockProps.reloadMembers).not.toHaveBeenCalled(); // Reload should not be triggered
      expect(mockProps.handleClose).not.toHaveBeenCalled(); // Modal should not close
    });
  });

  it('handles error during form submission', async () => {
    render(
      <MockedProvider mocks={ERROR_MOCKS}>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <BrowserRouter>
              <AddOnSpotAttendee {...mockProps} />
            </BrowserRouter>
          </I18nextProvider>
        </Provider>
      </MockedProvider>,
    );

    // Fill the form
    await userEvent.type(screen.getByLabelText(/First Name/i), 'John');
    await userEvent.type(screen.getByLabelText(/Last Name/i), 'Doe');
    await userEvent.type(screen.getByLabelText(/Email/i), 'john@example.com');
    await userEvent.type(screen.getByLabelText(/Phone No./i), '1234567890');
    const genderSelect = screen.getByLabelText(/Gender/i);
    fireEvent.change(genderSelect, { target: { value: 'Male' } });

    // Submit the form
    fireEvent.submit(screen.getByTestId('onspot-attendee-form'));

    // Wait for the error to be handled
    await waitFor(() => {
      expect(sharedMocks.NotificationToast.error).toHaveBeenCalledWith(
        expect.stringContaining('Failed to add attendee'),
      );
    });
  });

  it('submits form successfully and calls necessary callbacks', async () => {
    renderAddOnSpotAttendee();

    await userEvent.type(screen.getByLabelText(/First Name/i), 'John');
    await userEvent.type(screen.getByLabelText(/Last Name/i), 'Doe');
    await userEvent.type(screen.getByLabelText(/Email/i), 'john@example.com');
    await userEvent.type(screen.getByLabelText(/Phone No./i), '1234567890');
    const genderSelect = screen.getByLabelText(/Gender/i);
    fireEvent.change(genderSelect, { target: { value: 'Male' } });

    fireEvent.submit(screen.getByTestId('onspot-attendee-form'));
    await waitFor(() => {
      expect(sharedMocks.NotificationToast.success).toHaveBeenCalled();
      expect(mockProps.reloadMembers).toHaveBeenCalled();
      expect(mockProps.handleClose).toHaveBeenCalled();
    });
  });

  it('displays error when organization ID is missing', async () => {
    render(
      <MockedProvider mocks={[]}>
        <BrowserRouter>
          <AddOnSpotAttendee {...mockProps} />
        </BrowserRouter>
      </MockedProvider>,
    );

    fireEvent.submit(screen.getByTestId('onspot-attendee-form'));

    await waitFor(() => {
      expect(sharedMocks.NotificationToast.error).toHaveBeenCalled();
    });
  });
  it('displays error when required fields are missing', async () => {
    renderAddOnSpotAttendee();

    fireEvent.submit(screen.getByTestId('onspot-attendee-form'));

    await waitFor(() => {
      expect(sharedMocks.NotificationToast.error).toHaveBeenCalled();
    });
  });

  it('handles mutation error appropriately', async () => {
    render(
      <MockedProvider mocks={ERROR_MOCKS}>
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
    fireEvent.submit(screen.getByTestId('onspot-attendee-form'));

    await waitFor(() => {
      expect(sharedMocks.NotificationToast.error).toHaveBeenCalled();
    });
  });

  it('disables button and shows loading state during form submission', async () => {
    renderAddOnSpotAttendee();

    await userEvent.type(screen.getByLabelText(/First Name/i), 'John');
    await userEvent.type(screen.getByLabelText(/Last Name/i), 'Doe');
    await userEvent.type(screen.getByLabelText(/Email/i), 'john@example.com');
    await userEvent.type(screen.getByLabelText(/Phone No./i), '1234567890');
    const genderSelect = screen.getByLabelText(/Gender/i);
    fireEvent.change(genderSelect, { target: { value: 'Male' } });

    // Verify initial state before submission
    const submitButton = screen.getByRole('button', { name: /add/i });
    expect(submitButton).not.toBeDisabled();
    expect(screen.queryByTestId('loading-state')).not.toBeInTheDocument();

    fireEvent.submit(screen.getByTestId('onspot-attendee-form'));

    // Wait for loading state to appear AND button to be gone (atomic check)
    await waitFor(() => {
      expect(screen.getByTestId('loading-state')).toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /add/i }),
      ).not.toBeInTheDocument();
    });

    // Verify loading state eventually disappears
    await waitFor(() => {
      expect(screen.queryByTestId('loading-state')).not.toBeInTheDocument();
    });

    // Verify success state
    await waitFor(() => {
      // Button should reappear (if modal is still open, which it is in this render context)
      expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
      expect(sharedMocks.NotificationToast.success).toHaveBeenCalledWith(
        'Attendee added successfully!',
      );
      // Callbacks should be invoked
      expect(mockProps.reloadMembers).toHaveBeenCalled();
      expect(mockProps.handleClose).toHaveBeenCalled();
    });
  });
});
