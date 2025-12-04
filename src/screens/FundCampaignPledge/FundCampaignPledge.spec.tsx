/* eslint-disable vitest/no-disabled-tests */
import { MockedProvider } from '@apollo/react-testing';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import type { RenderResult } from '@testing-library/react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18nForTest from '../../utils/i18nForTest';
import FundCampaignPledge from './FundCampaignPledge';
import { MOCKS_FUND_CAMPAIGN_PLEDGE_ERROR } from './PledgesMocks';
import type { ApolloLink } from '@apollo/client';
import { vi } from 'vitest';
import { FUND_CAMPAIGN_PLEDGE } from 'GraphQl/Queries/fundQueries';

const mockParamsState = {
  orgId: 'orgId',
  fundCampaignId: 'fundCampaignId',
};

const { toastMocks, routerMocks } = vi.hoisted(() => {
  const navigate = vi.fn();
  const useParams = vi.fn(() => ({ ...mockParamsState }));
  return {
    toastMocks: {
      success: vi.fn(),
      error: vi.fn(),
    },
    routerMocks: {
      useParams,
      navigate,
    },
  };
});

vi.mock('react-toastify', () => ({
  toast: toastMocks,
}));

vi.mock('@mui/x-date-pickers/DateTimePicker', () => {
  return {
    DateTimePicker: vi
      .importActual('@mui/x-date-pickers/DesktopDateTimePicker')
      .then((module) => module.DesktopDateTimePicker),
  };
});

const EMPTY_MOCK = {
  request: {
    query: FUND_CAMPAIGN_PLEDGE,
    variables: {
      input: { id: 'fundCampaignId' },
    },
  },
  result: {
    data: {
      fundCampaign: {
        __typename: 'FundCampaign',
        id: '1',
        name: 'Test Campaign',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        currency: 'USD',
        fundingGoal: 1000,
        pledges: {
          __typename: 'PledgeConnection',
          edges: [],
        },
      },
    },
  },
};

const updatedMocks = {
  request: {
    query: FUND_CAMPAIGN_PLEDGE,
    variables: {
      input: { id: 'fundCampaignId' },
    },
  },
  result: {
    data: {
      fundCampaign: {
        __typename: 'FundCampaign',
        id: '1',
        name: 'Test Campaign',
        startAt: '2023-01-01T00:00:00Z',
        endAt: '2024-12-31T23:59:59Z',
        currency: 'USD',
        fundingGoal: 1000,
        pledges: {
          __typename: 'PledgeConnection',
          edges: [
            {
              __typename: 'PledgeEdge',
              node: {
                __typename: 'Pledge',
                id: '1',
                amount: 100,
                pledger: {
                  __typename: 'User',
                  id: '1',
                  name: 'John Doe',
                  image: 'img-url',
                },
              },
            },
            {
              __typename: 'PledgeEdge',
              node: {
                __typename: 'Pledge',
                id: '2',
                amount: 200,
                pledger: {
                  __typename: 'User',
                  id: '2',
                  name: 'Jane Doe',
                  image: null,
                },
              },
            },
            {
              __typename: 'PledgeEdge',
              node: {
                __typename: 'Pledge',
                id: '3',
                amount: 150,
                pledger: {
                  __typename: 'User',
                  id: '3',
                  name: 'John Doe3',
                  image: 'img-url3',
                },
              },
            },
            {
              __typename: 'PledgeEdge',
              node: {
                __typename: 'Pledge',
                id: '4',
                amount: 175,
                pledger: {
                  __typename: 'User',
                  id: '4',
                  name: 'John Doe4',
                  image: null,
                },
              },
            },
          ],
        },
      },
    },
  },
};

const FUTURE_CAMPAIGN_MOCK = {
  request: {
    query: FUND_CAMPAIGN_PLEDGE,
    variables: {
      input: { id: 'fundCampaignId' },
    },
  },
  result: {
    data: {
      fundCampaign: {
        __typename: 'FundCampaign',
        id: '1',
        name: 'Future Campaign',
        startAt: '2025-03-31T05:53:45.871Z',
        endAt: '2025-04-24T05:53:45.871Z',
        currency: 'USD',
        fundingGoal: 1000,
        pledges: {
          __typename: 'PledgeConnection',
          edges: [],
        },
      },
    },
  },
};

const ACTIVE_CAMPAIGN_MOCK = {
  request: {
    query: FUND_CAMPAIGN_PLEDGE,
    variables: {
      input: { id: 'fundCampaignId' },
    },
  },
  result: {
    data: {
      fundCampaign: {
        __typename: 'FundCampaign',
        id: '1',
        name: 'Active Campaign',
        startAt: '2023-01-01T00:00:00Z',
        endAt: '2024-12-31T23:59:59Z',
        currency: 'USD',
        fundingGoal: 1000,
        pledges: {
          __typename: 'PledgeConnection',
          edges: [],
        },
      },
    },
  },
};

const mockWithExtraUsers = {
  request: {
    query: FUND_CAMPAIGN_PLEDGE,
    variables: {
      input: { id: 'fundCampaignId' },
    },
  },
  result: {
    data: {
      fundCampaign: {
        __typename: 'FundCampaign',
        id: '1',
        name: 'Test Campaign',
        startAt: '2023-01-01T00:00:00Z',
        endAt: '2024-12-31T23:59:59Z',
        currency: 'USD',
        fundingGoal: 1000,
        pledges: {
          __typename: 'PledgeConnection',
          edges: [
            {
              __typename: 'PledgeEdge',
              node: {
                __typename: 'Pledge',
                id: '1',
                amount: 100,
                createdAt: '2024-01-01T00:00:00Z',
                pledger: {
                  __typename: 'User',
                  id: '1',
                  name: 'Main User 1',
                  image: 'img-url1',
                },
              },
            },
          ],
        },
      },
    },
  },
};

const link1 = new StaticMockLink([updatedMocks]);
const link2 = new StaticMockLink(MOCKS_FUND_CAMPAIGN_PLEDGE_ERROR);
const link3 = new StaticMockLink([EMPTY_MOCK]);
const translations = JSON.parse(
  JSON.stringify(i18nForTest.getDataByLanguage('en')?.translation.pledges),
);

vi.mock('react-router', async () => {
  const actual =
    await vi.importActual<typeof import('react-router')>('react-router');
  return {
    ...actual,
    useParams: routerMocks.useParams,
    useNavigate: () => routerMocks.navigate,
  };
});

const renderFundCampaignPledge = (link: ApolloLink): RenderResult => {
  return render(
    <MockedProvider link={link}>
      <MemoryRouter
        initialEntries={['/fundCampaignPledge/orgId/fundCampaignId']}
      >
        <Provider store={store}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route
                  path="/fundCampaignPledge/:orgId/:fundCampaignId"
                  element={<FundCampaignPledge />}
                />
                <Route
                  path="/"
                  element={<div data-testid="paramsError"></div>}
                />
              </Routes>
            </I18nextProvider>
          </LocalizationProvider>
        </Provider>
      </MemoryRouter>
    </MockedProvider>,
  );
};

describe('Testing Campaign Pledge Screen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockParamsState.orgId = 'orgId';
    mockParamsState.fundCampaignId = 'fundCampaignId';
    routerMocks.navigate.mockReset();
    routerMocks.useParams.mockImplementation(() => ({ ...mockParamsState }));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should redirect to fallback URL if URL params are undefined', async () => {
    mockParamsState.orgId = '';
    mockParamsState.fundCampaignId = '';

    render(
      <MockedProvider link={link1}>
        <MemoryRouter initialEntries={['/fundCampaignPledge/']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route
                  path="/fundCampaignPledge/"
                  element={<FundCampaignPledge />}
                />
                <Route
                  path="/"
                  element={<div data-testid="paramsError"></div>}
                />
              </Routes>
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );
    await waitFor(() => {
      expect(screen.getByTestId('paramsError')).toBeInTheDocument();
    });
  });

  it('should render the Campaign Pledge screen', async () => {
    renderFundCampaignPledge(link1);
    await waitFor(() => {
      expect(screen.getByTestId('searchPledger')).toBeInTheDocument();
    });
  });

  it('opens and closes Create Pledge modal', async () => {
    vi.setSystemTime(new Date('2024-06-15'));
    renderFundCampaignPledge(link1);

    await waitFor(() => {
      expect(screen.getByTestId('searchPledger')).toBeInTheDocument();
    });

    const addPledgeBtn = screen.getByTestId('addPledgeBtn');
    expect(addPledgeBtn).toBeInTheDocument();
    expect(addPledgeBtn).not.toBeDisabled();
    await userEvent.click(addPledgeBtn);

    await waitFor(() => {
      const modalTitle = screen.getByTestId('createPledgeTitle');
      expect(modalTitle).toBeInTheDocument();
      expect(modalTitle).toHaveTextContent(translations.createPledge);
    });

    const closeBtn = screen.getByTestId('pledgeModalCloseBtn');
    await userEvent.click(closeBtn);

    await waitFor(() => {
      expect(screen.queryByTestId('createPledgeTitle')).not.toBeInTheDocument();
    });

    vi.useRealTimers();
  });

  it('opens and closes update pledge modal', async () => {
    renderFundCampaignPledge(link1);

    await waitFor(() => {
      const editButtons = screen.getAllByTestId('editPledgeBtn');
      expect(editButtons.length).toBeGreaterThan(0);
    });

    const editButtons = screen.getAllByTestId('editPledgeBtn');
    await userEvent.click(editButtons[0]);

    await waitFor(() => {
      expect(screen.getByText(translations.editPledge)).toBeInTheDocument();
    });

    const closeButton = screen.getByTestId('pledgeModalCloseBtn');
    await userEvent.click(closeButton);

    await waitFor(() => {
      expect(
        screen.queryByText(translations.editPledge),
      ).not.toBeInTheDocument();
    });
  });

  it('opens and closes delete pledge modal', async () => {
    renderFundCampaignPledge(link1);

    const deletePledgeBtn = await screen.findAllByTestId('deletePledgeBtn');
    await waitFor(() => expect(deletePledgeBtn[0]).toBeInTheDocument());
    await userEvent.click(deletePledgeBtn[0]);

    await waitFor(() =>
      expect(screen.getByText(translations.deletePledge)).toBeInTheDocument(),
    );
    await userEvent.click(screen.getByTestId('deletePledgeCloseBtn'));
    await waitFor(() =>
      expect(screen.queryByTestId('deletePledgeCloseBtn')).toBeNull(),
    );
  });

  it('searches the Pledges list by Users', async () => {
    renderFundCampaignPledge(link1);

    await waitFor(() => {
      expect(screen.getByTestId('searchPledger')).toBeInTheDocument();
    });
    expect(screen.getByTestId('searchPledger')).toBeInTheDocument();
    expect(screen.getByTestId('searchBtn')).toBeInTheDocument();
  });

  it('should handle breadcrumb navigation correctly', async () => {
    const mockHistoryBack = vi.fn();
    const mockHistoryGo = vi.fn();

    Object.defineProperty(window, 'history', {
      value: {
        back: mockHistoryBack,
        go: mockHistoryGo,
      },
      writable: true,
    });

    renderFundCampaignPledge(link1);

    await waitFor(() => {
      expect(screen.getByTestId('searchPledger')).toBeInTheDocument();
    });

    const breadcrumbLinks = screen.getAllByRole('button');

    fireEvent.click(breadcrumbLinks[0]);
    expect(mockHistoryGo).toHaveBeenCalledWith(-2);

    fireEvent.click(breadcrumbLinks[1]);
    expect(mockHistoryBack).toHaveBeenCalled();
  });

  it('should render the Campaign Pledge screen with error', async () => {
    renderFundCampaignPledge(link2);
    await waitFor(() => {
      expect(screen.getByTestId('errorMsg')).toBeInTheDocument();
    });
  });

  it('renders the empty pledge component', async () => {
    renderFundCampaignPledge(link3);
    await waitFor(() => {
      expect(screen.getByText(translations.noPledges)).toBeInTheDocument();
    });
  });

  it('checks if user image renders', async () => {
    renderFundCampaignPledge(link1);

    await waitFor(() => {
      expect(screen.getByTestId('searchPledger')).toBeInTheDocument();
    });

    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('should render extraUserDetails in Popup', async () => {
    const customLink = new StaticMockLink([mockWithExtraUsers]);
    renderFundCampaignPledge(customLink);

    await waitFor(() => {
      expect(screen.getByText('Main User 1')).toBeInTheDocument();
    });
  });

  it('should handle popup styling when there are many extra users', async () => {
    const manyUsersMock = {
      request: {
        query: FUND_CAMPAIGN_PLEDGE,
        variables: {
          input: { id: 'fundCampaignId' },
        },
      },
      result: {
        data: {
          fundCampaign: {
            __typename: 'FundCampaign',
            id: '1',
            name: 'Test Campaign',
            startAt: '2023-01-01T00:00:00Z',
            endAt: '2024-12-31T23:59:59Z',
            currency: 'USD',
            fundingGoal: 1000,
            pledges: {
              __typename: 'PledgeConnection',
              edges: [
                {
                  __typename: 'PledgeEdge',
                  node: {
                    __typename: 'Pledge',
                    id: '1',
                    amount: 100,
                    createdAt: '2024-01-01T00:00:00Z',
                    note: 'Test note',
                    campaign: {
                      __typename: 'FundCampaign',
                      id: '1',
                      name: 'Test Campaign',
                    },
                    pledger: {
                      __typename: 'User',
                      id: '1',
                      name: 'Main User 1',
                      image: null,
                    },
                    users: [
                      {
                        __typename: 'User',
                        id: '1',
                        name: 'Main User 1',
                        image: null,
                      },
                      {
                        __typename: 'User',
                        id: '2',
                        name: 'Extra User 1',
                        image: null,
                      },
                      {
                        __typename: 'User',
                        id: '3',
                        name: 'Extra User 2',
                        image: null,
                      },
                      {
                        __typename: 'User',
                        id: '4',
                        name: 'Extra User 3',
                        image: null,
                      },
                      {
                        __typename: 'User',
                        id: '5',
                        name: 'Extra User 4',
                        image: null,
                      },
                      {
                        __typename: 'User',
                        id: '6',
                        name: 'Extra User 5',
                        image: null,
                      },
                      {
                        __typename: 'User',
                        id: '7',
                        name: 'Extra User 6',
                        image: null,
                      },
                    ],
                  },
                },
              ],
            },
          },
        },
      },
    };

    const manyUsersLink = new StaticMockLink([manyUsersMock]);
    renderFundCampaignPledge(manyUsersLink);

    const mainUserText = await screen.findByText('Main User 1');
    expect(mainUserText).toBeInTheDocument();

    const moreContainer = screen.getByTestId('moreContainer-1');
    expect(moreContainer).toBeInTheDocument();
    expect(moreContainer).toHaveTextContent('+6 more...');

    await userEvent.click(moreContainer);

    const popup = await screen.findByTestId('extra-users-popup');
    expect(popup).toBeInTheDocument();

    for (let i = 1; i <= 6; i++) {
      expect(screen.getByText(`Extra User ${i}`)).toBeInTheDocument();
    }
  });

  it.skip('should render Progress Bar with Raised amount (CONSTANT) and Pledged Amount', async () => {
    renderFundCampaignPledge(link1);
    await waitFor(() => {
      expect(screen.getByTestId('searchPledger')).toBeInTheDocument();
    });
    const raised = screen.getByLabelText('Raised amount');
    const pledged = screen.getByLabelText('Pledged amount');
    expect(pledged).toBeInTheDocument();
    expect(raised).toBeInTheDocument();

    await userEvent.click(raised);

    await waitFor(() => {
      expect(screen.getByTestId('progressBar')).toBeInTheDocument();
      expect(screen.getByTestId('progressBar')).toHaveTextContent('$0');
    });

    await userEvent.click(pledged);

    await waitFor(() => {
      expect(screen.getByTestId('progressBar')).toBeInTheDocument();
      expect(screen.getByTestId('progressBar')).toHaveTextContent('$625');
    });
  });

  it.skip('sorts the Pledges list by Lowest Amount', async () => {
    renderFundCampaignPledge(link1);

    const searchPledger = await screen.findByTestId('searchPledger');
    expect(searchPledger).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('filter'));
    await waitFor(() => {
      expect(screen.getByTestId('amount_ASC')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('amount_ASC'));

    await waitFor(() => {
      const amountCells = screen.getAllByTestId('amountCell');
      expect(amountCells[0]).toHaveTextContent('$100');
      expect(amountCells[1]).toHaveTextContent('$150');
      expect(amountCells[2]).toHaveTextContent('$175');
      expect(amountCells[3]).toHaveTextContent('$200');
    });
  });

  it.skip('sorts the Pledges list by Highest Amount', async () => {
    renderFundCampaignPledge(link1);

    const searchPledger = await screen.findByTestId('searchPledger');
    expect(searchPledger).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('filter'));
    await waitFor(() => {
      expect(screen.getByTestId('amount_DESC')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('amount_DESC'));

    await waitFor(() => {
      const amountCells = screen.getAllByTestId('amountCell');
      expect(amountCells[0]).toHaveTextContent('$200');
      expect(amountCells[1]).toHaveTextContent('$175');
      expect(amountCells[2]).toHaveTextContent('$150');
      expect(amountCells[3]).toHaveTextContent('$100');
    });
  });

  it.skip('sorts the Pledges list by latest endDate', async () => {
    renderFundCampaignPledge(link1);

    const searchPledger = await screen.findByTestId('searchPledger');
    expect(searchPledger).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('filter'));
    await waitFor(() => {
      expect(screen.getByTestId('endDate_DESC')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('endDate_DESC'));

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByText('Jane Doe')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getAllByTestId('amountCell')[0]).toHaveTextContent('$100');
    });
  });

  it.skip('sorts the Pledges list by earliest endDate', async () => {
    renderFundCampaignPledge(link1);

    const searchPledger = await screen.findByTestId('searchPledger');
    expect(searchPledger).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('filter'));
    await waitFor(() => {
      expect(screen.getByTestId('endDate_ASC')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('endDate_ASC'));

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByText('Jane Doe')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getAllByTestId('amountCell')[0]).toHaveTextContent('$100');
    });
  });

  it('should disable add pledge button for future campaign', async () => {
    vi.setSystemTime(new Date('2024-01-01'));
    const futureCampaignLink = new StaticMockLink([FUTURE_CAMPAIGN_MOCK]);
    renderFundCampaignPledge(futureCampaignLink);

    await waitFor(() => {
      const addPledgeBtn = screen.getByTestId('addPledgeBtn');
      expect(addPledgeBtn).toBeDisabled();
      expect(addPledgeBtn).toHaveAttribute(
        'title',
        'pledges.campaignNotActive',
      );
    });
    vi.useRealTimers();
  });

  it('should enable add pledge button for active campaign', async () => {
    vi.setSystemTime(new Date('2024-06-15'));
    const activeCampaignLink = new StaticMockLink([ACTIVE_CAMPAIGN_MOCK]);
    renderFundCampaignPledge(activeCampaignLink);

    await waitFor(() => {
      const addPledgeBtn = screen.getByTestId('addPledgeBtn');
      expect(addPledgeBtn).not.toBeDisabled();
      expect(addPledgeBtn).toHaveAttribute('title', '');
    });
    vi.useRealTimers();
  });

  it('should handle default case in sort function', async () => {
    renderFundCampaignPledge(link1);

    await waitFor(() => {
      expect(screen.getByTestId('searchPledger')).toBeInTheDocument();
    });

    const filterButton = screen.getByTestId('filter');
    fireEvent.click(filterButton);

    await waitFor(() => {
      const amountCells = screen.getAllByTestId('amountCell');
      expect(amountCells).toHaveLength(4);
      expect(amountCells[0]).toBeInTheDocument();
      expect(amountCells[1]).toBeInTheDocument();
      expect(amountCells[2]).toBeInTheDocument();
      expect(amountCells[3]).toBeInTheDocument();
    });
  });

  it.skip('should handle all sort cases', async () => {
    renderFundCampaignPledge(link1);

    await waitFor(
      () => {
        expect(screen.getByTestId('searchPledger')).toBeInTheDocument();
      },
      { timeout: 5000 },
    );

    const sortOptions = [
      'amount_ASC',
      'amount_DESC',
      'endDate_ASC',
      'endDate_DESC',
    ];

    for (const option of sortOptions) {
      fireEvent.click(screen.getByTestId('filter'));
      await waitFor(() => {
        expect(screen.getByTestId(option)).toBeInTheDocument();
      });
      fireEvent.click(screen.getByTestId(option));

      await waitFor(() => {
        const amountCells = screen.getAllByTestId('amountCell');
        expect(amountCells).toHaveLength(4);

        if (option === 'amount_ASC') {
          expect(amountCells[0]).toHaveTextContent('$100');
          expect(amountCells[3]).toHaveTextContent('$200');
        } else if (option === 'amount_DESC') {
          expect(amountCells[0]).toHaveTextContent('$200');
          expect(amountCells[3]).toHaveTextContent('$100');
        }
      });
    }
  });
});
