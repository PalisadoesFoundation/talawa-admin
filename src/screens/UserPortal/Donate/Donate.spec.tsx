import React from 'react';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { MockedProvider, MockedResponse } from '@apollo/react-testing';
import { ApolloLink } from '@apollo/client';
import { I18nextProvider } from 'react-i18next';
import { vi } from 'vitest';
import {
  ORGANIZATION_DONATION_CONNECTION_LIST,
  ORGANIZATION_LIST,
} from 'GraphQl/Queries/Queries';
import { DUMMY_DATE_TIME_PREFIX } from 'Constant/common';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import Donate from './Donate';
import userEvent from '@testing-library/user-event';
import { DONATE_TO_ORGANIZATION } from 'GraphQl/Mutations/mutations';
import dayjs from 'dayjs';

const MOCK_DATE = `${DUMMY_DATE_TIME_PREFIX}00:00:00.000Z`;

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

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  useParams: mockUseParams,
}));

vi.mock('react-router', async () => ({
  ...(await vi.importActual('react-router')),
  useParams: mockUseParams,
}));

vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: mockToast,
}));

vi.mock('utils/useLocalstorage', () => ({
  default: vi.fn(() => ({
    getItem: vi.fn((key) => {
      if (key === 'userId') return '123';
      if (key === 'name') return 'name';
      return null;
    }),
    setItem: vi.fn(),
  })),
}));

// Child component mocks to ensure unit isolation
vi.mock(
  'components/UserPortal/OrganizationSidebar/OrganizationSidebar',
  () => ({
    default: () => <div data-testid="organization-sidebar" />,
  }),
);

vi.mock('components/UserPortal/DonationCard/DonationCard', () => ({
  default: () => <div data-testid="donation-card-mock" />,
}));

interface InterfaceSearchFilterBarMockProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchInputTestId?: string;
}

vi.mock('shared-components/SearchFilterBar/SearchFilterBar', () => ({
  default: ({
    searchValue,
    onSearchChange,
    searchInputTestId,
  }: InterfaceSearchFilterBarMockProps) => (
    <div>
      <input
        data-testid={searchInputTestId}
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <button data-testid="searchButton" type="button">
        Search
      </button>
    </div>
  ),
}));

interface InterfaceFormTextFieldMockProps {
  value: string;
  onChange: (value: string) => void;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  [key: string]: unknown;
}

vi.mock('shared-components/FormFieldGroup/FormTextField', () => ({
  FormTextField: ({
    value,
    onChange,
    startAdornment,
    endAdornment,
    ...props
  }: InterfaceFormTextFieldMockProps) => (
    <div>
      {startAdornment}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...props}
      />
      {endAdornment}
    </div>
  ),
}));

vi.mock('shared-components/PaginationList/PaginationList', () => ({
  default: ({
    rowsPerPage,
    page,
    onPageChange,
    onRowsPerPageChange,
  }: {
    rowsPerPage: number;
    page: number;
    onPageChange: (
      event: React.MouseEvent<HTMLButtonElement> | null,
      newPage: number,
    ) => void;
    onRowsPerPageChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  }) => (
    <div data-testid="pagination">
      <span data-testid="current-page">{page}</span>
      <span data-testid="rows-per-page">{rowsPerPage}</span>
      <button
        type="button"
        data-testid="next-page-btn"
        onClick={(e) => onPageChange(e, page + 1)}
      >
        Next
      </button>
      <button
        type="button"
        data-testid="prev-page-btn"
        onClick={(e) => onPageChange(e, page - 1)}
      >
        Previous
      </button>
      <select
        data-testid="rows-per-page-select"
        value={rowsPerPage}
        onChange={onRowsPerPageChange}
      >
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="25">25</option>
      </select>
    </div>
  ),
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
            updatedAt: dayjs(MOCK_DATE).toISOString(),
            __typename: 'Donation',
          },
        ],
        __typename: 'Query',
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
              __typename: 'Address',
            },
            userRegistrationRequired: true,
            createdAt: '12345678900',
            creator: { firstName: 'John', lastName: 'Doe', __typename: 'User' },
            members: [],
            admins: [],
            membershipRequests: [],
            __typename: 'Organization',
          },
        ],
        __typename: 'Query',
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
          __typename: 'Donation',
        },
        __typename: 'Mutation',
      },
    },
  },
];

const MULTIPLE_DONATIONS_MOCKS = [
  {
    request: {
      query: ORGANIZATION_DONATION_CONNECTION_LIST,
      variables: {
        orgId: '',
      },
    },
    result: {
      data: {
        getDonationByOrgIdConnection: Array.from({ length: 10 }, (_, i) => ({
          _id: `donation-${i}`,
          nameOfUser: `User ${i}`,
          amount: (i + 1) * 10,
          userId: `user-${i}`,
          payPalId: `paypal-${i}`,
          updatedAt: dayjs(MOCK_DATE).toISOString(),
          __typename: 'Donation',
        })),
        __typename: 'Query',
      },
    },
  },
  ...MOCKS.slice(1),
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
        __typename: 'Query',
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
        __typename: 'Query',
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
              __typename: 'Address',
            },
            userRegistrationRequired: true,
            createdAt: '12345678900',
            creator: { firstName: 'John', lastName: 'Doe', __typename: 'User' },
            members: [],
            admins: [],
            membershipRequests: [],
            __typename: 'Organization',
          },
        ],
        __typename: 'Query',
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

const BOUNDARY_MOCKS = [
  ...MOCKS,
  {
    request: {
      query: DONATE_TO_ORGANIZATION,
      variables: {
        userId: '123',
        createDonationOrgId2: '',
        payPalId: 'paypalId',
        nameOfUser: 'name',
        amount: 1,
        nameOfOrg: 'anyOrganization2',
      },
    },
    result: {
      data: {
        createDonation: {
          _id: 'min-donation',
          amount: 1,
          nameOfUser: 'name',
          nameOfOrg: 'anyOrganization2',
          __typename: 'Donation',
        },
        __typename: 'Mutation',
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
        amount: 10000000,
        nameOfOrg: 'anyOrganization2',
      },
    },
    result: {
      data: {
        createDonation: {
          _id: 'max-donation',
          amount: 10000000,
          nameOfUser: 'name',
          nameOfOrg: 'anyOrganization2',
          __typename: 'Donation',
        },
        __typename: 'Mutation',
      },
    },
  },
];

const renderDonate = (
  mocksOrLink: MockedResponse[] | ApolloLink = new StaticMockLink(MOCKS, true),
) => {
  const finalProps = Array.isArray(mocksOrLink)
    ? { mocks: mocksOrLink }
    : { link: mocksOrLink };
  /* Note: If { link } is passed, it overrides { mocks } in MockedProvider behavior */
  return render(
    <MockedProvider {...finalProps} addTypename={false}>
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
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  test('renders Donate screen with essential elements', async () => {
    renderDonate();

    // Wait for initial render to complete
    await screen.findByTestId('searchInput');

    expect(screen.getByTestId('searchInput')).toBeInTheDocument();
    expect(screen.getByTestId('searchButton')).toBeInTheDocument();
    expect(screen.getByTestId('currency-dropdown-toggle')).toBeInTheDocument();
    expect(screen.getByTestId('donationAmount')).toBeInTheDocument();
    expect(screen.getByTestId('donateBtn')).toBeInTheDocument();
    expect(screen.getByTestId('organization-sidebar')).toBeInTheDocument();
  });

  test('search input updates value when typed into', async () => {
    renderDonate();

    const searchInput = await screen.findByTestId('searchInput');
    await userEvent.type(searchInput, 'test search');

    expect(searchInput).toHaveValue('test search');
  });

  test('currency switch works correctly', async () => {
    renderDonate();

    const currencyButton = await screen.findByTestId(
      'currency-dropdown-toggle',
    );
    await userEvent.click(currencyButton);

    await screen.findByTestId('currency-dropdown-menu');

    const eurOption = await screen.findByTestId('currency-dropdown-item-EUR');
    await userEvent.click(eurOption);

    await waitFor(() => {
      expect(currencyButton).toHaveTextContent('EUR');
    });
  });

  test('shows error toast for empty donation amount', async () => {
    renderDonate();

    const donateBtn = await screen.findByTestId('donateBtn');
    await userEvent.click(donateBtn);

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith(
        'Please enter a numerical value for the donation amount.',
      );
    });
  });

  test('shows error toast for non-numeric donation amount', async () => {
    renderDonate();

    const amountInput = await screen.findByTestId('donationAmount');
    await userEvent.type(amountInput, 'abc');

    const donateBtn = await screen.findByTestId('donateBtn');
    await userEvent.click(donateBtn);

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith(
        'Please enter a numerical value for the donation amount.',
      );
    });
  });

  test('shows error toast for donation amount below minimum', async () => {
    renderDonate();

    const amountInput = await screen.findByTestId('donationAmount');
    await userEvent.type(amountInput, '0.5');

    const donateBtn = await screen.findByTestId('donateBtn');
    await userEvent.click(donateBtn);

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith(
        'Donation amount must be between 1 and 10000000.',
      );
    });
  });

  test('shows error toast for donation amount above maximum', async () => {
    renderDonate();

    const amountInput = await screen.findByTestId('donationAmount');
    await userEvent.type(amountInput, '10000001');

    const donateBtn = await screen.findByTestId('donateBtn');
    await userEvent.click(donateBtn);

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith(
        'Donation amount must be between 1 and 10000000.',
      );
    });
  });

  test('successful donation shows success toast', async () => {
    renderDonate();

    // Wait for organization data to load
    await waitFor(() => {
      expect(
        screen.getByText('Donate for the anyOrganization2'),
      ).toBeInTheDocument();
    });

    const amountInput = await screen.findByTestId('donationAmount');
    await userEvent.type(amountInput, '100');

    const donateBtn = await screen.findByTestId('donateBtn');
    await userEvent.click(donateBtn);

    await waitFor(() => {
      expect(mockToast.success).toHaveBeenCalled();
    });
  });

  test('handles donation mutation error', async () => {
    const errorLink = new StaticMockLink(DONATION_ERROR_MOCK, true);
    renderDonate(errorLink);

    await waitFor(() => {
      expect(
        screen.getByText('Donate for the anyOrganization2'),
      ).toBeInTheDocument();
    });

    const amountInput = await screen.findByTestId('donationAmount');
    await userEvent.type(amountInput, '100');

    const donateBtn = await screen.findByTestId('donateBtn');
    await userEvent.click(donateBtn);

    await waitFor(() => {
      expect(mockErrorHandler).toHaveBeenCalled();
    });
  });

  test('shows empty state when no donations exist', async () => {
    const emptyLink = new StaticMockLink(EMPTY_DONATIONS_MOCK, true);
    renderDonate(emptyLink);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText(/nothing to show/i)).toBeInTheDocument();
    });
  });

  test('shows loading state while donations are loading', async () => {
    renderDonate();

    await waitFor(() => {
      const loading = screen.queryByTestId('loading-state');
      const data = screen.queryByTestId('donationCard');
      expect(loading || data).toBeTruthy();
    });
  });

  test('displays donation cards when donations exist', async () => {
    renderDonate();

    await waitFor(() => {
      expect(screen.getByTestId('donationCard')).toBeInTheDocument();
    });
  });

  test('switches to INR currency', async () => {
    renderDonate();

    const currencyButton = await screen.findByTestId(
      'currency-dropdown-toggle',
    );
    expect(currencyButton).toHaveTextContent('USD');

    await userEvent.click(currencyButton);

    // Wait for menu
    await screen.findByTestId('currency-dropdown-menu');

    // Wait for option
    const inrOption = await screen.findByTestId('currency-dropdown-item-INR');
    await userEvent.click(inrOption);

    // Wait for state update
    await waitFor(() => {
      expect(currencyButton).toHaveTextContent('INR');
    });
  });

  test('displays all three currency options', async () => {
    renderDonate();

    const currencyButton = await screen.findByTestId(
      'currency-dropdown-toggle',
    );
    await userEvent.click(currencyButton);

    await waitFor(() => {
      expect(screen.getByTestId('currency-dropdown-menu')).toBeInTheDocument();
    });

    expect(screen.getByTestId('currency-dropdown-item-USD')).toHaveTextContent(
      'USD',
    );
    expect(screen.getByTestId('currency-dropdown-item-INR')).toHaveTextContent(
      'INR',
    );
    expect(screen.getByTestId('currency-dropdown-item-EUR')).toHaveTextContent(
      'EUR',
    );
  });

  test('handles pagination with multiple donations', async () => {
    renderDonate(new StaticMockLink(MULTIPLE_DONATIONS_MOCKS, true));

    // Wait for donations to load
    await waitFor(() => {
      const cards = screen.getAllByTestId('donationCard');
      // Should show 5 cards (default rowsPerPage)
      expect(cards.length).toBe(5);
    });
  });

  test('handles edge case with donations length equal to rowsPerPage', async () => {
    const exactMatchMocks = [
      {
        request: {
          query: ORGANIZATION_DONATION_CONNECTION_LIST,
          variables: {
            orgId: '',
          },
        },
        result: {
          data: {
            getDonationByOrgIdConnection: Array.from({ length: 5 }, (_, i) => ({
              _id: `donation-${i}`,
              nameOfUser: `User ${i}`,
              amount: (i + 1) * 10,
              userId: `user-${i}`,
              payPalId: `paypal-${i}`,
              updatedAt: dayjs(MOCK_DATE).toISOString(),
              __typename: 'Donation',
            })),
            __typename: 'Query',
          },
        },
      },
      ...MOCKS.slice(1),
    ];

    renderDonate(new StaticMockLink(exactMatchMocks, true));

    // With exactly 5 donations and rowsPerPage=5, should show all 5
    await waitFor(() => {
      const cards = screen.getAllByTestId('donationCard');
      expect(cards.length).toBe(5);
    });
  });

  test('displays organization name after loading', async () => {
    renderDonate();

    await waitFor(() => {
      expect(
        screen.getByText('Donate for the anyOrganization2'),
      ).toBeInTheDocument();
    });
  });

  test('handles zero as invalid donation amount', async () => {
    renderDonate();

    const amountInput = await screen.findByTestId('donationAmount');
    await userEvent.type(amountInput, '0');

    const donateBtn = await screen.findByTestId('donateBtn');
    await userEvent.click(donateBtn);

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith(
        'Donation amount must be between 1 and 10000000.',
      );
    });
  });

  test('handles negative donation amount', async () => {
    renderDonate();

    const amountInput = await screen.findByTestId('donationAmount');
    await userEvent.type(amountInput, '-10');

    const donateBtn = await screen.findByTestId('donateBtn');
    await userEvent.click(donateBtn);

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith(
        'Donation amount must be between 1 and 10000000.',
      );
    });
  });

  test('updates amount input field correctly', async () => {
    renderDonate();

    const amountInput = (await screen.findByTestId(
      'donationAmount',
    )) as HTMLInputElement;

    await userEvent.type(amountInput, '500');

    await waitFor(() => {
      expect(amountInput.value).toBe('500');
    });
  });

  test('clears amount input and allows new value', async () => {
    renderDonate();

    const amountInput = (await screen.findByTestId(
      'donationAmount',
    )) as HTMLInputElement;

    await userEvent.type(amountInput, '500');
    expect(amountInput.value).toBe('500');

    await userEvent.clear(amountInput);
    expect(amountInput.value).toBe('');

    await userEvent.type(amountInput, '1000');
    expect(amountInput.value).toBe('1000');
  });

  test('renders donation card with correct props', async () => {
    renderDonate();

    await waitFor(() => {
      const card = screen.getByTestId('donationCard');
      expect(card).toBeInTheDocument();
    });
  });

  test('donation amount at exactly minimum boundary (1)', async () => {
    renderDonate(new StaticMockLink(BOUNDARY_MOCKS, true));

    await waitFor(() => {
      expect(
        screen.getByText('Donate for the anyOrganization2'),
      ).toBeInTheDocument();
    });

    const amountInput = await screen.findByTestId('donationAmount');
    await userEvent.type(amountInput, '1');
    const donateBtn = await screen.findByTestId('donateBtn');
    await userEvent.click(donateBtn);

    // Verify success toast is called
    await waitFor(() => {
      expect(mockToast.success).toHaveBeenCalled();
    });
  });

  test('donation amount at exactly maximum boundary (10000000)', async () => {
    renderDonate(new StaticMockLink(BOUNDARY_MOCKS, true));

    await waitFor(() => {
      expect(
        screen.getByText('Donate for the anyOrganization2'),
      ).toBeInTheDocument();
    });

    const amountInput = await screen.findByTestId('donationAmount');
    await userEvent.type(amountInput, '10000000');
    const donateBtn = await screen.findByTestId('donateBtn');
    await userEvent.click(donateBtn);

    // Verify success toast is called
    await waitFor(() => {
      expect(mockToast.success).toHaveBeenCalled();
    });
  });

  test('changes page using pagination next button', async () => {
    renderDonate(new StaticMockLink(MULTIPLE_DONATIONS_MOCKS, true));

    // Wait for pagination to render
    await screen.findByTestId('pagination');

    // Verify initial page
    await waitFor(() => {
      expect(screen.getByTestId('current-page')).toHaveTextContent('0');
    });

    // Wait for initial cards
    await waitFor(() => {
      const cards = screen.getAllByTestId('donationCard');
      expect(cards.length).toBe(5);
    });

    // Click next
    const nextButton = await screen.findByTestId('next-page-btn');
    await userEvent.click(nextButton);

    // Wait for page update
    await waitFor(() => {
      expect(screen.getByTestId('current-page')).toHaveTextContent('1');
    });

    // Wait for new cards to render
    await waitFor(() => {
      const cards = screen.getAllByTestId('donationCard');
      expect(cards.length).toBe(5);
    });
  });

  test('changes page using pagination previous button', async () => {
    renderDonate(new StaticMockLink(MULTIPLE_DONATIONS_MOCKS, true));

    // Wait for donations to load
    await waitFor(() => {
      expect(screen.getByTestId('pagination')).toBeInTheDocument();
    });

    // First go to page 1
    const nextButton = await screen.findByTestId('next-page-btn');
    await userEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByTestId('current-page')).toHaveTextContent('1');
    });

    // Then go back to page 0
    const prevButton = screen.getByTestId('prev-page-btn');
    await userEvent.click(prevButton);

    await waitFor(() => {
      expect(screen.getByTestId('current-page')).toHaveTextContent('0');
    });

    // Should show first 5 donations again
    await waitFor(() => {
      const cards = screen.getAllByTestId('donationCard');
      expect(cards.length).toBe(5);
    });
  });

  test('changes rows per page and resets to page 0', async () => {
    renderDonate(new StaticMockLink(MULTIPLE_DONATIONS_MOCKS, true));

    // Wait for donations to load
    await waitFor(() => {
      expect(screen.getByTestId('pagination')).toBeInTheDocument();
    });

    // Initially should have 5 rows per page
    expect(screen.getByTestId('rows-per-page')).toHaveTextContent('5');
    expect(screen.getByTestId('current-page')).toHaveTextContent('0');

    // Initially should show 5 donation cards
    await waitFor(() => {
      const cards = screen.getAllByTestId('donationCard');
      expect(cards.length).toBe(5);
    });

    // Go to page 1
    const nextButton = await screen.findByTestId('next-page-btn');
    await userEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByTestId('current-page')).toHaveTextContent('1');
    });

    // Change rows per page to 10
    const rowsSelect = await screen.findByTestId('rows-per-page-select');
    await userEvent.selectOptions(rowsSelect, '10');

    // Should reset to page 0 and have 10 rows per page
    await waitFor(() => {
      expect(screen.getByTestId('current-page')).toHaveTextContent('0');
      expect(screen.getByTestId('rows-per-page')).toHaveTextContent('10');
    });

    // Should now show all 10 donation cards
    await waitFor(() => {
      const cards = screen.getAllByTestId('donationCard');
      expect(cards.length).toBe(10);
    });
  });

  test('parses rows per page value correctly', async () => {
    renderDonate(new StaticMockLink(MULTIPLE_DONATIONS_MOCKS, true));

    // Wait for donations to load
    await waitFor(() => {
      expect(screen.getByTestId('pagination')).toBeInTheDocument();
    });

    // Initially 5 rows
    await waitFor(() => {
      const cards = screen.getAllByTestId('donationCard');
      expect(cards.length).toBe(5);
    });

    // Change to 25 rows per page
    const rowsSelect = screen.getByTestId('rows-per-page-select');
    await userEvent.selectOptions(rowsSelect, '25');

    // Should parse and set to 25
    await waitFor(() => {
      expect(screen.getByTestId('rows-per-page')).toHaveTextContent('25');
    });

    // Should now show all 10 donation cards (we only have 10 total)
    await waitFor(() => {
      const cards = screen.getAllByTestId('donationCard');
      expect(cards.length).toBe(10);
    });
  });
});
