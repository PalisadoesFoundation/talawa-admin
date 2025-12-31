/**
 * Unit tests for the Donate component.
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';
import { vi } from 'vitest';
import {
  ORGANIZATION_DONATION_CONNECTION_LIST,
  ORGANIZATION_LIST,
} from 'GraphQl/Queries/Queries';
import { BrowserRouter } from 'react-router';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import Donate from './Donate';
import userEvent from '@testing-library/user-event';
import useLocalStorage from 'utils/useLocalstorage';
import { DONATE_TO_ORGANIZATION } from 'GraphQl/Mutations/mutations';

const { mockErrorHandler, mockUseParams, mockToast } = vi.hoisted(() => ({
  mockErrorHandler: vi.fn(),
  mockUseParams: vi.fn(),
  mockToast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

vi.mock('utils/errorHandler', () => ({
  errorHandler: mockErrorHandler,
}));

vi.mock('react-router', async () => ({
  ...(await vi.importActual('react-router')),
  useParams: mockUseParams,
}));

vi.mock('react-toastify', () => ({
  toast: mockToast,
}));

const MOCKS = [
  {
    request: {
      query: ORGANIZATION_DONATION_CONNECTION_LIST,
      variables: {
        orgId: '',
      },
    },
    result: {
      data: {
        getDonationByOrgIdConnection: [
          {
            _id: '6391a15bcb738c181d238957',
            nameOfUser: 'firstName lastName',
            amount: 1,
            userId: '6391a15bcb738c181d238952',
            payPalId: 'payPalId',
            updatedAt: '2024-04-03T16:43:01.514Z',
          },
        ],
      },
    },
  },
  {
    request: {
      query: ORGANIZATION_LIST,
      variables: {
        id: '',
      },
    },
    result: {
      data: {
        organizations: [
          {
            _id: '6401ff65ce8e8406b8f07af3',
            name: 'anyOrganization2',
            description: 'desc',
            address: {
              city: 'abc',
              countryCode: '123',
              postalCode: '456',
              state: 'def',
            },
            userRegistrationRequired: true,
            createdAt: '12345678900',
            creator: { firstName: 'John', lastName: 'Doe' },
            members: [],
            admins: [],
            membershipRequests: [],
          },
        ],
      },
    },
  },
  {
    request: {
      query: DONATE_TO_ORGANIZATION,
      variables: {
        userId: '123',
        createDonationOrgId2: '',
        payPalId: 'paypalId',
        nameOfUser: 'name',
        amount: 100,
        nameOfOrg: 'anyOrganization2',
      },
    },
    result: {
      data: {
        createDonation: {
          _id: '1',
          amount: 100,
          nameOfUser: 'name',
          nameOfOrg: 'anyOrganization2',
        },
      },
    },
  },
];

const EMPTY_DONATIONS_MOCK = [
  {
    request: {
      query: ORGANIZATION_DONATION_CONNECTION_LIST,
      variables: {
        orgId: '',
      },
    },
    result: {
      data: {
        getDonationByOrgIdConnection: [],
      },
    },
  },
  ...MOCKS.slice(1),
];

const DONATION_ERROR_MOCK = [
  {
    request: {
      query: ORGANIZATION_DONATION_CONNECTION_LIST,
      variables: {
        orgId: '',
      },
    },
    result: {
      data: {
        getDonationByOrgIdConnection: [],
      },
    },
  },
  {
    request: {
      query: ORGANIZATION_LIST,
      variables: {
        id: '',
      },
    },
    result: {
      data: {
        organizations: [
          {
            _id: '6401ff65ce8e8406b8f07af3',
            name: 'anyOrganization2',
            description: 'desc',
            address: {
              city: 'abc',
              countryCode: '123',
              postalCode: '456',
              state: 'def',
            },
            userRegistrationRequired: true,
            createdAt: '12345678900',
            creator: { firstName: 'John', lastName: 'Doe' },
            members: [],
            admins: [],
            membershipRequests: [],
          },
        ],
      },
    },
  },
  {
    request: {
      query: DONATE_TO_ORGANIZATION,
      variables: {
        userId: '123',
        createDonationOrgId2: '',
        payPalId: 'paypalId',
        nameOfUser: 'name',
        amount: 100,
        nameOfOrg: 'anyOrganization2',
      },
    },
    error: new Error('Donation failed'),
  },
];

const emptyLink = new StaticMockLink(EMPTY_DONATIONS_MOCK, true);
const errorLink = new StaticMockLink(DONATION_ERROR_MOCK, true);

const renderDonate = (mocks = MOCKS) => {
  const testLink = new StaticMockLink(mocks, true);
  return render(
    <MockedProvider link={testLink}>
      <BrowserRouter>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <Donate />
          </I18nextProvider>
        </Provider>
      </BrowserRouter>
    </MockedProvider>,
  );
};

describe('Donate Component', () => {
  beforeEach(() => {
    mockUseParams.mockReturnValue({ orgId: '' });
    mockErrorHandler.mockClear();
    mockToast.error.mockClear();
    mockToast.success.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('renders Donate screen with essential elements', async () => {
    renderDonate();

    expect(screen.getByTestId('searchInput')).toBeInTheDocument();
    expect(screen.getByTestId('searchButton')).toBeInTheDocument();
    expect(screen.getByTestId('changeCurrencyBtn')).toBeInTheDocument();
    expect(screen.getByTestId('donationAmount')).toBeInTheDocument();
    expect(screen.getByTestId('donateBtn')).toBeInTheDocument();
  });

  test('search input updates value when typed into', async () => {
    renderDonate();

    const searchInput = screen.getByTestId('searchInput');
    await userEvent.type(searchInput, 'test search');

    expect(searchInput).toHaveValue('test search');
  });

  test('currency switch works correctly', async () => {
    renderDonate();

    const currencyButton = screen.getByTestId('changeCurrencyBtn');
    await userEvent.click(currencyButton);

    const eurOption = screen.getByTestId('currency2');
    await userEvent.click(eurOption);

    expect(currencyButton).toHaveTextContent('EUR');
  });

  test('shows error toast for empty donation amount', async () => {
    renderDonate();

    await userEvent.click(screen.getByTestId('donateBtn'));

    expect(mockToast.error).toHaveBeenCalledWith(
      'Please enter a numerical value for the donation amount.',
    );
  });

  test('shows error toast for non-numeric donation amount', async () => {
    renderDonate();

    await userEvent.type(screen.getByTestId('donationAmount'), 'abc');
    await userEvent.click(screen.getByTestId('donateBtn'));

    expect(mockToast.error).toHaveBeenCalledWith(
      'Please enter a numerical value for the donation amount.',
    );
  });

  test('shows error toast for donation amount below minimum', async () => {
    renderDonate();

    await userEvent.type(screen.getByTestId('donationAmount'), '0.5');
    await userEvent.click(screen.getByTestId('donateBtn'));

    expect(mockToast.error).toHaveBeenCalledWith(
      'Donation amount must be between 1 and 10000000.',
    );
  });

  test('shows error toast for donation amount above maximum', async () => {
    renderDonate();

    await userEvent.type(screen.getByTestId('donationAmount'), '10000001');
    await userEvent.click(screen.getByTestId('donateBtn'));

    expect(mockToast.error).toHaveBeenCalledWith(
      'Donation amount must be between 1 and 10000000.',
    );
  });

  test('successful donation shows success toast', async () => {
    const { setItem } = useLocalStorage();
    setItem('userId', '123');
    setItem('name', 'name');

    renderDonate();

    await userEvent.type(screen.getByTestId('donationAmount'), '100');
    await userEvent.click(screen.getByTestId('donateBtn'));

    await waitFor(() => {
      expect(mockToast.success).toHaveBeenCalled();
    });
  });

  test('handles donation mutation error', async () => {
    const { setItem } = useLocalStorage();
    setItem('userId', '123');
    setItem('name', 'name');

    render(
      <MockedProvider link={errorLink}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Donate />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await userEvent.type(screen.getByTestId('donationAmount'), '100');
    await userEvent.click(screen.getByTestId('donateBtn'));

    await waitFor(() => {
      expect(mockErrorHandler).toHaveBeenCalled();
    });
  });

  test('shows empty state when no donations exist', async () => {
    render(
      <MockedProvider link={emptyLink}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Donate />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText(/nothing to show/i)).toBeInTheDocument();
    });
  });
});
