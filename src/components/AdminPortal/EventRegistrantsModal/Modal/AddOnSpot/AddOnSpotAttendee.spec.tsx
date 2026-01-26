import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
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
  useParams: vi.fn(),
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
    useParams: sharedMocks.useParams,
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
  let user: ReturnType<typeof userEvent.setup>;
  beforeEach(() => {
    sharedMocks.useParams.mockReturnValue({ eventId: '123', orgId: '123' });
    user = userEvent.setup();
  });

  afterEach(() => {
    vi.clearAllMocks();
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

    await user.type(screen.getByLabelText(/First Name/i), 'John');
    await user.type(screen.getByLabelText(/Last Name/i), 'Doe');
    await user.type(screen.getByLabelText(/Email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/Phone No./i), '1234567890');
    const genderSelect = screen.getByLabelText(/Gender/i);
    await user.selectOptions(genderSelect, 'Male');
    expect(genderSelect).toHaveValue('Male');

    await user.click(screen.getByRole('button', { name: /add/i }));

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
    await user.type(screen.getByLabelText(/First Name/i), 'John');
    await user.type(screen.getByLabelText(/Last Name/i), 'Doe');
    await user.type(screen.getByLabelText(/Email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/Phone No./i), '1234567890');
    const genderSelect = screen.getByLabelText(/Gender/i);
    await user.selectOptions(genderSelect, 'Male');

    // Submit the form
    await user.click(screen.getByRole('button', { name: /add/i }));

    // Wait for the error to be handled
    await waitFor(() => {
      expect(sharedMocks.NotificationToast.error).toHaveBeenCalledWith(
        expect.stringContaining('Failed to add attendee'),
      );
    });
  });

  it('submits form successfully and calls necessary callbacks', async () => {
    renderAddOnSpotAttendee();

    await user.type(screen.getByLabelText(/First Name/i), 'John');
    await user.type(screen.getByLabelText(/Last Name/i), 'Doe');
    await user.type(screen.getByLabelText(/Email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/Phone No./i), '1234567890');
    const genderSelect = screen.getByLabelText(/Gender/i);
    await user.selectOptions(genderSelect, 'Male');

    await user.click(screen.getByRole('button', { name: /add/i }));
    await waitFor(() => {
      expect(sharedMocks.NotificationToast.success).toHaveBeenCalled();
      expect(mockProps.reloadMembers).toHaveBeenCalled();
      expect(mockProps.handleClose).toHaveBeenCalled();
    });
  });

  it('displays error when organization ID is missing', async () => {
    // Force mock value
    sharedMocks.useParams.mockReturnValue({ eventId: '123', orgId: undefined });

    render(
      <MockedProvider mocks={[]}>
        <BrowserRouter>
          <AddOnSpotAttendee {...mockProps} />
        </BrowserRouter>
      </MockedProvider>,
    );

    await user.click(screen.getByRole('button', { name: /add/i }));

    await waitFor(() => {
      // Expect specific error message key for missing orgId
      expect(sharedMocks.NotificationToast.error).toHaveBeenCalledWith(
        expect.stringContaining('Organization ID is missing.'),
      );
    });
  });
  it('displays error when required fields are missing', async () => {
    renderAddOnSpotAttendee();

    await user.click(screen.getByRole('button', { name: /add/i }));

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

    await user.type(screen.getByLabelText(/First Name/i), 'John');
    await user.type(screen.getByLabelText(/Last Name/i), 'Doe');
    await user.click(screen.getByRole('button', { name: /add/i }));

    await waitFor(() => {
      expect(sharedMocks.NotificationToast.error).toHaveBeenCalled();
    });
  });

  it('disables button and shows loading state during form submission', async () => {
    renderAddOnSpotAttendee();

    await user.type(screen.getByLabelText(/First Name/i), 'John');
    await user.type(screen.getByLabelText(/Last Name/i), 'Doe');
    await user.type(screen.getByLabelText(/Email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/Phone No./i), '1234567890');
    const genderSelect = screen.getByLabelText(/Gender/i);
    await user.selectOptions(genderSelect, 'Male');

    // Verify initial state before submission
    const submitButton = screen.getByRole('button', { name: /add/i });
    expect(submitButton).not.toBeDisabled();
    expect(screen.queryByTestId('loading-state')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /add/i }));

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

  it('does not submit when email is missing (Partial Submission)', async () => {
    renderAddOnSpotAttendee();

    await user.type(screen.getByLabelText(/First Name/i), 'John');
    await user.type(screen.getByLabelText(/Last Name/i), 'Doe');
    // Email skipped intentionally
    await user.type(screen.getByLabelText(/Phone No\./i), '1234567890');
    const genderSelect = screen.getByLabelText(/Gender/i);
    await user.selectOptions(genderSelect, 'Male');

    await user.click(screen.getByRole('button', { name: /add/i }));

    await waitFor(() => {
      // Should show error because email is required (HTML5 validation or custom check?)
      // Component check: if (!formData.firstName || !formData.lastName || !formData.email) -> NotificationToast.error.
      expect(sharedMocks.NotificationToast.error).toHaveBeenCalled();
      expect(mockProps.reloadMembers).not.toHaveBeenCalled();
    });
  });

  it('resets form fields after successful submission', async () => {
    renderAddOnSpotAttendee();

    const firstNameInput = screen.getByLabelText(/First Name/i);
    const lastNameInput = screen.getByLabelText(/Last Name/i);
    const emailInput = screen.getByLabelText(/Email/i);

    // Ensure inputs are initially empty
    expect(firstNameInput).toHaveValue('');

    await user.type(firstNameInput, 'John');
    await user.type(lastNameInput, 'Doe');
    await user.type(emailInput, 'john@example.com');

    // Verify values typed
    expect(firstNameInput).toHaveValue('John');

    await user.click(screen.getByRole('button', { name: /add/i }));

    await waitFor(() => {
      expect(sharedMocks.NotificationToast.success).toHaveBeenCalled();
      // Since handleClose is a mock, the component remains mounted with show=true.
      // verify resetForm() effect.
      expect(firstNameInput).toHaveValue('');
      expect(lastNameInput).toHaveValue('');
      expect(emailInput).toHaveValue('');
    });
  });
});
