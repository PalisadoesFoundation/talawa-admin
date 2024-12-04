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

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockProps = {
  show: true,
  handleClose: jest.fn(),
  reloadMembers: jest.fn(),
};
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ eventId: '123', orgId: '123' }),
}));

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
    jest.clearAllMocks();
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

  it('handles form input changes correctly', async () => {
    renderAddOnSpotAttendee();

    const firstNameInput = screen.getByLabelText('First Name');
    const lastNameInput = screen.getByLabelText('Last Name');
    const emailInput = screen.getByLabelText('Email');

    const user = userEvent.setup();
    await user.type(firstNameInput, 'John');
    await user.type(lastNameInput, 'Doe');
    await user.type(emailInput, 'john@example.com');

    expect(firstNameInput).toHaveValue('John');
    expect(lastNameInput).toHaveValue('Doe');
    expect(emailInput).toHaveValue('john@example.com');
  });

  it('submits form successfully and calls necessary callbacks', async () => {
    renderAddOnSpotAttendee();

    const user = userEvent.setup();
    await user.type(screen.getByLabelText('First Name'), 'John');
    await user.type(screen.getByLabelText('Last Name'), 'Doe');
    await user.type(screen.getByLabelText('Email'), 'john@example.com');
    await user.type(screen.getByLabelText('Phone No.'), '1234567890');
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
