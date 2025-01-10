/**
 * Unit tests for the Donate component.
 *
 * This file contains tests for the Donate component to ensure it behaves as expected
 * under various scenarios.
 */
import React, { act } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';
import { vi } from 'vitest';
import {
  ORGANIZATION_DONATION_CONNECTION_LIST,
  USER_ORGANIZATION_CONNECTION,
} from 'GraphQl/Queries/Queries';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import Donate from './Donate';
import userEvent from '@testing-library/user-event';
import useLocalStorage from 'utils/useLocalstorage';
import { DONATE_TO_ORGANIZATION } from 'GraphQl/Mutations/mutations';
import { toast } from 'react-toastify';
import * as errorHandlerModule from 'utils/errorHandler';

// Mock the errorHandler module
vi.mock('utils/errorHandler', () => ({
  errorHandler: vi.fn(),
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
      query: USER_ORGANIZATION_CONNECTION,
      variables: {
        id: '',
      },
    },
    result: {
      data: {
        organizationsConnection: [
          {
            _id: '6401ff65ce8e8406b8f07af3',
            image: '',
            name: 'anyOrganization2',
            description: 'desc',
            address: {
              city: 'abc',
              countryCode: '123',
              postalCode: '456',
              state: 'def',
              dependentLocality: 'ghi',
              line1: 'asdfg',
              line2: 'dfghj',
              sortingCode: '4567',
            },
            userRegistrationRequired: true,
            createdAt: '12345678900',
            creator: { firstName: 'John', lastName: 'Doe' },
            members: [
              {
                _id: '56gheqyr7deyfuiwfewifruy8',
                user: {
                  _id: '45ydeg2yet721rtgdu32ry',
                },
              },
            ],
            admins: [
              {
                _id: '45gj5678jk45678fvgbhnr4rtgh',
              },
            ],
            membershipRequests: [
              {
                _id: '56gheqyr7deyfuiwfewifruy8',
                user: {
                  _id: '45ydeg2yet721rtgdu32ry',
                },
              },
            ],
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
        amount: 123,
        nameOfOrg: 'anyOrganization2',
      },
    },
    result: {
      data: {
        createDonation: [
          {
            _id: '',
            amount: 123,
            nameOfUser: 'name',
            nameOfOrg: 'anyOrganization2',
          },
        ],
      },
    },
  },
];

const link = new StaticMockLink(MOCKS, true);

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  useParams: vi.fn(() => ({ orgId: '' })),
}));

vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe('Testing Donate Screen [User Portal]', () => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('Screen should be rendered properly', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Donate />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    expect(screen.getByPlaceholderText('Search donations')).toBeInTheDocument();
    expect(screen.getByTestId('currency0')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Amount')).toBeInTheDocument();
  });

  test('Donation amount input should update state', async () => {
    render(
      <MockedProvider addTypename={false}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Donate />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    const amountInput = screen.getByPlaceholderText('Amount');
    fireEvent.change(amountInput, { target: { value: '100' } });
    expect(amountInput).toHaveValue('100');
  });

  test('Currency dropdown should update state', async () => {
    render(
      <MockedProvider addTypename={false}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Donate />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    const currencyButton = screen.getByTestId('changeCurrencyBtn');
    fireEvent.click(currencyButton);
    const currencyOption = screen.getByText('EUR');
    fireEvent.click(currencyOption);
    expect(currencyButton).toHaveTextContent('EUR');
  });

  test('should handle search input changes', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Donate />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    const searchInput = screen.getByTestId('searchByName');
    fireEvent.change(searchInput, { target: { value: 'test search' } });
    expect(searchInput).toHaveValue('test search');
  });

  test('should render pagination list when donations are present', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Donate />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    const paginationList = screen.getByRole('table');
    expect(paginationList).toBeInTheDocument();
  });

  test('handles pagination changes for rows per page', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Donate />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    const paginationComponent = screen.getByRole('combobox');
    fireEvent.change(paginationComponent, { target: { value: '10' } });

    expect(screen.getByRole('combobox')).toHaveValue('10');
  });

  test('pagination shows correct number of donations per page', async () => {
    const multipleDonationsMock = {
      request: {
        query: ORGANIZATION_DONATION_CONNECTION_LIST,
        variables: { orgId: '' },
      },
      result: {
        data: {
          getDonationByOrgIdConnection: Array(10).fill({
            _id: '123',
            nameOfUser: 'Test User',
            amount: '100',
            userId: '456',
            payPalId: 'paypal123',
            updatedAt: new Date().toISOString(),
          }),
        },
      },
    };

    const paginationLink = new StaticMockLink([multipleDonationsMock], true);

    render(
      <MockedProvider addTypename={false} link={paginationLink}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Donate />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    const donationCards = screen.getAllByTestId('donationCard');
    expect(donationCards).toHaveLength(5); // Default rowsPerPage is 5
  });

  test('search button is present and clickable', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Donate />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    const searchButton = screen.getByTestId('searchButton');
    expect(searchButton).toBeInTheDocument();
    expect(searchButton).toBeEnabled();
  });

  test('donation form elements are properly initialized', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Donate />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    expect(screen.getByTestId('changeCurrencyBtn')).toHaveTextContent('USD');
    expect(screen.getByTestId('donationAmount')).toHaveValue('');
    expect(screen.getByTestId('donateBtn')).toBeEnabled();
  });
  test('displays loading state while fetching donations', async () => {
    render(
      <MockedProvider addTypename={false} mocks={MOCKS}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Donate />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    // Find loading text within the specific container
    const loadingElement = screen.getByTestId('loading-state');
    expect(loadingElement).toHaveTextContent('Loading...');

    await wait();
  });

  test('displays "nothing to show" when no donations exist', async () => {
    const emptyMocks = [
      {
        request: {
          query: ORGANIZATION_DONATION_CONNECTION_LIST,
          variables: { orgId: '' },
        },
        result: {
          data: {
            getDonationByOrgIdConnection: [],
          },
        },
      },
      ...MOCKS.slice(1), // Keep other mocks
    ];

    render(
      <MockedProvider addTypename={false} mocks={emptyMocks}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Donate />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    // Wait for loading to complete
    await wait();

    // Assuming i18nForTest translates 'nothingToShow' to the actual text
    // If using the translation key directly:
    const nothingToShowElement = screen.getByText(/nothing to show/i);
    expect(nothingToShowElement).toBeInTheDocument();
  });

  test('Currency is swtiched to USD', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Donate />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    userEvent.click(screen.getByTestId('changeCurrencyBtn'));

    userEvent.click(screen.getByTestId('currency0'));
    await wait();

    expect(screen.getByTestId('currency0')).toBeInTheDocument();
  });

  test('Currency is swtiched to INR', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Donate />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    userEvent.click(screen.getByTestId('changeCurrencyBtn'));

    userEvent.click(screen.getByTestId('currency1'));

    await wait();
  });

  test('Currency is swtiched to EUR', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Donate />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    userEvent.click(screen.getByTestId('changeCurrencyBtn'));

    userEvent.click(screen.getByTestId('currency2'));

    await wait();
  });

  test('Checking the existence of Donation Cards', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Donate />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    expect(screen.getAllByTestId('donationCard')[0]).toBeInTheDocument();
  });

  test('For Donation functionality', async () => {
    const { setItem } = useLocalStorage();
    setItem('userId', '123');
    setItem('name', 'name');
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Donate />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    userEvent.type(screen.getByTestId('donationAmount'), '123');
    userEvent.click(screen.getByTestId('donateBtn'));
    await wait();
  });

  test('displays error toast for donation amount below minimum', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Donate />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    userEvent.type(screen.getByTestId('donationAmount'), '0.5');
    userEvent.click(screen.getByTestId('donateBtn'));

    await wait();

    expect(toast.error).toHaveBeenCalledWith(
      'Donation amount must be between 1 and 10000000.',
    );
  });

  test('displays error toast for donation amount above maximum', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Donate />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    userEvent.type(screen.getByTestId('donationAmount'), '10000001');
    userEvent.click(screen.getByTestId('donateBtn'));

    await wait();

    expect(toast.error).toHaveBeenCalledWith(
      'Donation amount must be between 1 and 10000000.',
    );
  });

  test('displays error toast for empty donation amount', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Donate />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    userEvent.click(screen.getByTestId('donateBtn'));

    await wait();

    expect(toast.error).toHaveBeenCalledWith(
      'Please enter a numerical value for the donation amount.',
    );
  });

  test('displays error toast for invalid (non-numeric) donation amount', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Donate />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    userEvent.type(screen.getByTestId('donationAmount'), 'abc');
    userEvent.click(screen.getByTestId('donateBtn'));

    await wait();

    expect(toast.error).toHaveBeenCalledWith(
      'Please enter a numerical value for the donation amount.',
    );
  });

  test('handles donation with whitespace in amount', async () => {
    const { setItem } = useLocalStorage();
    setItem('userId', '123');
    setItem('name', 'name');

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Donate />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    userEvent.type(screen.getByTestId('donationAmount'), ' 123 ');
    userEvent.click(screen.getByTestId('donateBtn'));

    await wait();
    expect(toast.success).toHaveBeenCalled();
  });

  test('handles null donation data from query', async () => {
    const nullDonationMock = {
      request: {
        query: ORGANIZATION_DONATION_CONNECTION_LIST,
        variables: { orgId: '' },
      },
      result: {
        data: {
          getDonationByOrgIdConnection: null,
        },
      },
    };

    const nullDataLink = new StaticMockLink(
      [nullDonationMock, ...MOCKS.slice(1)],
      true,
    );

    render(
      <MockedProvider addTypename={false} link={nullDataLink}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Donate />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    expect(screen.getByText(/nothing to show/i)).toBeInTheDocument();
  });
  test('handles zero rows per page in pagination', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Donate />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    const paginationComponent = screen.getByRole('combobox');
    fireEvent.change(paginationComponent, { target: { value: '0' } });

    await wait();
    const donationCards = screen.getAllByTestId('donationCard');
    expect(donationCards.length).toBeGreaterThan(0); // Should show all donations
  });
  test('donateToOrg validation - empty amount shows error toast', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Donate />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    // Leave amount empty
    userEvent.click(screen.getByTestId('donateBtn'));

    expect(toast.error).toHaveBeenCalledWith(
      'Please enter a numerical value for the donation amount.',
    );
  });
  test('setPage updates the page number correctly', async () => {
    // Setup mock data with multiple donations to trigger pagination
    const multipleDonationsMock = {
      request: {
        query: ORGANIZATION_DONATION_CONNECTION_LIST,
        variables: { orgId: '' },
      },
      result: {
        data: {
          getDonationByOrgIdConnection: Array(15).fill({
            _id: '123',
            nameOfUser: 'Test User',
            amount: '100',
            userId: '456',
            payPalId: 'paypal123',
            updatedAt: new Date().toISOString(),
          }),
        },
      },
    };

    const paginationLink = new StaticMockLink([multipleDonationsMock], true);

    render(
      <MockedProvider addTypename={false} link={paginationLink}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Donate />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    // Find and click the next page button
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);

    // Verify page change using donation cards
    const donationCards = screen.getAllByTestId('donationCard');
    expect(donationCards.length).toBe(5); // Should show 5 items per page
  });
  test('donateToOrg validation - non-numeric amount shows error toast', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Donate />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    userEvent.type(screen.getByTestId('donationAmount'), 'abc');
    userEvent.click(screen.getByTestId('donateBtn'));

    expect(toast.error).toHaveBeenCalledWith(
      'Please enter a numerical value for the donation amount.',
    );
  });

  test('donateToOrg validation - amount less than minimum shows error toast', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Donate />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    userEvent.type(screen.getByTestId('donationAmount'), '0.5');
    userEvent.click(screen.getByTestId('donateBtn'));

    expect(toast.error).toHaveBeenCalledWith(
      'Donation amount must be between 1 and 10000000.',
    );
  });

  test('donateToOrg validation - amount greater than maximum shows error toast', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Donate />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    userEvent.type(screen.getByTestId('donationAmount'), '10000001');
    userEvent.click(screen.getByTestId('donateBtn'));

    expect(toast.error).toHaveBeenCalledWith(
      'Donation amount must be between 1 and 10000000.',
    );
  });

  test('donateToOrg - handles donation mutation error', async () => {
    const mockErrorHandler = vi.fn();
    vi.spyOn(errorHandlerModule, 'errorHandler').mockImplementation(
      mockErrorHandler,
    );

    const mocks = [
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
        error: new Error('Failed to process donation'),
      },
      ...MOCKS.slice(1),
    ];

    const { setItem } = useLocalStorage();
    setItem('userId', '123');
    setItem('name', 'name');

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Donate />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    userEvent.type(screen.getByTestId('donationAmount'), '100');
    userEvent.click(screen.getByTestId('donateBtn'));

    await wait(500);
    expect(mockErrorHandler).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Error),
    );
  });

  test('donateToOrg - handles GraphQL errors', async () => {
    const mockErrorHandler = vi.fn();
    vi.spyOn(errorHandlerModule, 'errorHandler').mockImplementation(
      mockErrorHandler,
    );

    const mocks = [
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
          errors: [{ message: 'GraphQL Error' }],
        },
      },
      ...MOCKS.slice(1),
    ];

    const { setItem } = useLocalStorage();
    setItem('userId', '123');
    setItem('name', 'name');

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Donate />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    userEvent.type(screen.getByTestId('donationAmount'), '100');
    userEvent.click(screen.getByTestId('donateBtn'));

    await wait(500);
    expect(mockErrorHandler).toHaveBeenCalled();
  });
});
