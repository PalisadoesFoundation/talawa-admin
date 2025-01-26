import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import { SIGNUP_MUTATION } from 'GraphQl/Mutations/mutations';
import AddOnSpotAttendee from './AddOnSpotAttendee';
import userEvent from '@testing-library/user-event';
import type { RenderResult } from '@testing-library/react';
import { toast } from 'react-toastify';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { store } from 'state/store';
import i18nForTest from '../../utils/i18nForTest';
import { describe, expect, vi } from 'vitest';

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockProps = {
  show: true,
  handleClose: vi.fn(),
  reloadMembers: vi.fn(),
};
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
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
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phoneNo: '1234567890',
        gender: 'Male',
        password: '123456',
        orgId: '123',
      },
    },
    result: {
      data: {
        signUp: {
          user: {
            _id: '1',
          },
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
        },
      },
    },
  },
];

const ERROR_MOCKS = [
  {
    ...MOCKS[0],
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

  it('renders the component with all form fields', async () => {
    renderAddOnSpotAttendee();

    expect(screen.getByText('On-spot Attendee')).toBeInTheDocument();
    expect(screen.getByLabelText('First Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Phone No.')).toBeInTheDocument();
    expect(screen.getByLabelText('Gender')).toBeInTheDocument();
  });

  it('handles case where signUp response is undefined', async () => {
    const mockWithoutSignUp = [
      {
        request: {
          query: SIGNUP_MUTATION,
          variables: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            phoneNo: '1234567890',
            gender: 'Male',
            password: '123456',
            orgId: '123',
          },
        },
        result: {
          data: {}, // No signUp property
        },
      },
    ];

    render(
      <MockedProvider mocks={mockWithoutSignUp} addTypename={false}>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <BrowserRouter>
              <AddOnSpotAttendee {...mockProps} />
            </BrowserRouter>
          </I18nextProvider>
        </Provider>
      </MockedProvider>,
    );

    userEvent.type(screen.getByLabelText('First Name'), 'John');
    userEvent.type(screen.getByLabelText('Last Name'), 'Doe');
    userEvent.type(screen.getByLabelText('Email'), 'john@example.com');
    userEvent.type(screen.getByLabelText('Phone No.'), '1234567890');
    const genderSelect = screen.getByLabelText('Gender');
    fireEvent.change(genderSelect, { target: { value: 'Male' } });

    fireEvent.submit(screen.getByTestId('onspot-attendee-form'));

    await waitFor(() => {
      expect(toast.success).not.toHaveBeenCalled(); // Ensure success toast is not shown
      expect(toast.error).not.toHaveBeenCalled(); // Ensure no unexpected error toast
      expect(mockProps.reloadMembers).not.toHaveBeenCalled(); // Reload should not be triggered
      expect(mockProps.handleClose).not.toHaveBeenCalled(); // Modal should not close
    });
  });

  it('handles error during form submission', async () => {
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

    // Fill the form
    userEvent.type(screen.getByLabelText('First Name'), 'John');
    userEvent.type(screen.getByLabelText('Last Name'), 'Doe');
    userEvent.type(screen.getByLabelText('Email'), 'john@example.com');
    userEvent.type(screen.getByLabelText('Phone No.'), '1234567890');
    const genderSelect = screen.getByLabelText('Gender');
    fireEvent.change(genderSelect, { target: { value: 'Male' } });

    // Submit the form
    fireEvent.submit(screen.getByTestId('onspot-attendee-form'));

    // Wait for the error to be handled
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        expect.stringContaining('Failed to add attendee'),
      );
    });
  });

  it('submits form successfully and calls necessary callbacks', async () => {
    renderAddOnSpotAttendee();

    userEvent.type(screen.getByLabelText('First Name'), 'John');
    userEvent.type(screen.getByLabelText('Last Name'), 'Doe');
    userEvent.type(screen.getByLabelText('Email'), 'john@example.com');
    userEvent.type(screen.getByLabelText('Phone No.'), '1234567890');
    const genderSelect = screen.getByLabelText('Gender');
    fireEvent.change(genderSelect, { target: { value: 'Male' } });

    fireEvent.submit(screen.getByTestId('onspot-attendee-form'));
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled();
      expect(mockProps.reloadMembers).toHaveBeenCalled();
      expect(mockProps.handleClose).toHaveBeenCalled();
    });
  });

  it('displays error when organization ID is missing', async () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
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
  it('displays error when required fields are missing', async () => {
    renderAddOnSpotAttendee();

    fireEvent.submit(screen.getByTestId('onspot-attendee-form'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });

  it('handles mutation error appropriately', async () => {
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

    userEvent.type(screen.getByLabelText('First Name'), 'John');
    userEvent.type(screen.getByLabelText('Last Name'), 'Doe');
    fireEvent.submit(screen.getByTestId('onspot-attendee-form'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });
});
