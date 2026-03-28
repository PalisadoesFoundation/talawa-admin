import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import {
  LocalizationProvider,
  AdapterDayjs,
} from 'shared-components/DateRangePicker';
import type { RenderResult } from '@testing-library/react';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes, useParams } from 'react-router';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18nForTest from 'utils/i18nForTest';
import type { ApolloLink } from '@apollo/client';
import useLocalStorage from 'utils/useLocalstorage';
import Campaigns from './Campaigns';
import { vi, it, expect, describe } from 'vitest';
import dayjs from 'dayjs';
import {
  MOCKS,
  MOCKS_WITH_FUND_NO_CAMPAIGNS,
  MOCKS_WITH_NO_FUNDS,
  MOCKS_WITH_NULL_ORGANIZATION,
  MOCKS_WITH_UNDEFINED_CAMPAIGNS,
  USER_FUND_CAMPAIGNS_ERROR,
  MOCKS_WITH_PENDING_CAMPAIGN,
} from './CampaignsMocks';
import { USER_FUND_CAMPAIGNS, USER_PLEDGES } from 'GraphQl/Queries/fundQueries';

const routerMocks = vi.hoisted(() => ({
  useParams: vi.fn(),
}));

vi.mock('react-router', async () => {
  const actual =
    await vi.importActual<typeof import('react-router')>('react-router');
  return {
    ...actual,
    useParams: routerMocks.useParams,
  };
});

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('@mui/x-date-pickers/DateTimePicker', async () => {
  const actual = await vi.importActual(
    '@mui/x-date-pickers/DesktopDateTimePicker',
  );
  return {
    DateTimePicker: actual.DesktopDateTimePicker,
  };
});

const { setItem } = useLocalStorage();
const mockedUseParams = vi.mocked(useParams);

let link1: StaticMockLink;
let link2: StaticMockLink;
let link3: StaticMockLink;

const cTranslations = JSON.parse(
  JSON.stringify(
    i18nForTest.getDataByLanguage('en')?.translation.userCampaigns,
  ),
);

const renderCampaigns = (link: ApolloLink): RenderResult => {
  return render(
    <MockedProvider link={link}>
      <MemoryRouter initialEntries={['/user/campaigns/orgId']}>
        <Provider store={store}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route path="/user/campaigns/:orgId" element={<Campaigns />} />
                <Route
                  path="/"
                  element={<div data-testid="paramsError"></div>}
                />
                <Route
                  path="/user/pledges/:orgId"
                  element={<div data-testid="pledgeScreen"></div>}
                />
              </Routes>
            </I18nextProvider>
          </LocalizationProvider>
        </Provider>
      </MemoryRouter>
    </MockedProvider>,
  );
};

describe('Testing User Campaigns Screen', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    setItem('userId', 'userId');
    mockedUseParams.mockReset();
    mockedUseParams.mockReturnValue({ orgId: 'orgId' });

    link1 = new StaticMockLink(MOCKS);
    link2 = new StaticMockLink(USER_FUND_CAMPAIGNS_ERROR);
    link3 = new StaticMockLink(MOCKS_WITH_NO_FUNDS);
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('should render the User Campaigns screen', async () => {
    renderCampaigns(link1);
    await waitFor(() => {
      expect(screen.getByTestId('searchByInput')).toBeInTheDocument();
      expect(screen.getByText('School Campaign')).toBeInTheDocument();
      expect(screen.getByText('Hospital Campaign')).toBeInTheDocument();
    });
  });

  it('should redirect to fallback URL if userId is null in LocalStorage', async () => {
    setItem('userId', null);
    renderCampaigns(link1);
    await waitFor(() => {
      expect(screen.getByTestId('paramsError')).toBeInTheDocument();
    });
  });

  it('should redirect to fallback URL if URL params are undefined', async () => {
    mockedUseParams.mockReturnValue({});
    render(
      <MockedProvider link={link1}>
        <MemoryRouter initialEntries={['/user/campaigns/']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route path="/user/campaigns/" element={<Campaigns />} />
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

  it('should render the User Campaign screen with error', async () => {
    renderCampaigns(link2);
    await waitFor(() => {
      expect(screen.getByTestId('errorMsg')).toBeInTheDocument();
    });
  });

  it('renders the empty campaign component', async () => {
    renderCampaigns(link3);
    await waitFor(() => {
      expect(screen.getByTestId('campaigns-empty-state')).toBeInTheDocument();
      expect(screen.getByText(cTranslations.noCampaigns)).toBeInTheDocument();
      expect(
        screen.getByText(cTranslations.createFirstCampaign),
      ).toBeInTheDocument();
    });
  });

  it('Should display campaigns in DataGrid', async () => {
    renderCampaigns(link1);

    await waitFor(() => {
      expect(screen.getByText('School Campaign')).toBeInTheDocument();
      expect(screen.getByText('Hospital Campaign')).toBeInTheDocument();
    });

    const campaignNames = screen.getAllByTestId('campaignName');
    expect(campaignNames.length).toBeGreaterThan(0);
  });

  it('Displays goal and date cells correctly', async () => {
    renderCampaigns(link1);

    await waitFor(() => {
      expect(screen.getByText('School Campaign')).toBeInTheDocument();
    });

    const goalCells = screen.getAllByTestId('goalCell');
    expect(goalCells.length).toBeGreaterThan(0);

    const endDateCells = screen.getAllByTestId('endDateCell');
    expect(endDateCells.length).toBeGreaterThan(0);
  });

  it('Search the Campaigns list by name', async () => {
    renderCampaigns(link1);

    const searchCampaigns = await screen.findByTestId('searchByInput');
    expect(searchCampaigns).toBeInTheDocument();

    await user.clear(searchCampaigns);
    await user.type(searchCampaigns, 'Hospital');

    await waitFor(() => {
      expect(screen.queryByText('School Campaign')).toBeNull();
      expect(screen.getByText('Hospital Campaign')).toBeInTheDocument();
    });
  });

  it('Redirect to My Pledges screen', async () => {
    renderCampaigns(link1);

    const myPledgesBtn = await screen.findByText(cTranslations.myPledges);
    expect(myPledgesBtn).toBeInTheDocument();
    await user.click(myPledgesBtn);

    await waitFor(() => {
      expect(screen.getByTestId('pledgeScreen')).toBeInTheDocument();
    });
  });

  it('Opens pledge modal when clicking add pledge button for active campaign', async () => {
    renderCampaigns(link1);

    await waitFor(() => {
      expect(screen.getByText('School Campaign')).toBeInTheDocument();
    });

    const addPledgeButtons = screen.getAllByTestId('addPledgeBtn');
    const activeButton = addPledgeButtons.find(
      (btn) => !btn.hasAttribute('disabled'),
    );

    expect(activeButton).toBeDefined();
    if (activeButton) {
      await user.click(activeButton);
    }

    await waitFor(() => {
      const dialogs = screen.getAllByRole('dialog');
      expect(dialogs.length).toBeGreaterThan(0);
      expect(screen.getByTestId('pledgeForm')).toBeInTheDocument();
    });
  });

  it('Closes pledge modal when close button is clicked', async () => {
    renderCampaigns(link1);

    await waitFor(() => {
      expect(screen.getByText('School Campaign')).toBeInTheDocument();
    });

    const addPledgeButtons = screen.getAllByTestId('addPledgeBtn');
    const activeButton = addPledgeButtons[0];
    await user.click(activeButton);

    await waitFor(() => {
      expect(screen.getByTestId('pledgeForm')).toBeInTheDocument();
    });

    const closeButton = screen.getByTestId('modalCloseBtn');
    await user.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByTestId('pledgeForm')).not.toBeInTheDocument();
    });
  });

  it('Disables add pledge button for ended campaigns', async () => {
    renderCampaigns(link1);

    await waitFor(() => {
      expect(screen.getByText('Hospital Campaign')).toBeInTheDocument();
    });

    const addPledgeButtons = screen.getAllByTestId('addPledgeBtn');
    const disabledButton = addPledgeButtons.find((btn) =>
      btn.hasAttribute('disabled'),
    );

    expect(disabledButton).toBeDefined();
    expect(disabledButton).toBeDisabled();
  });

  it('does not open pledge modal when campaign is not active and user has not pledged', async () => {
    const startAt = dayjs().subtract(30, 'day').toISOString();
    const endAt = dayjs().subtract(1, 'day').toISOString();

    const link = new StaticMockLink([
      {
        request: {
          query: USER_FUND_CAMPAIGNS,
          variables: {
            input: { id: 'orgId' },
          },
        },
        result: {
          data: {
            organization: {
              funds: {
                edges: [
                  {
                    node: {
                      isArchived: false,
                      campaigns: {
                        edges: [
                          {
                            node: {
                              id: 'campaignEndedOnly',
                              name: 'Ended Campaign',
                              currencyCode: 'USD',
                              goalAmount: 1000,
                              amountRaised: 250,
                              startAt,
                              endAt,
                            },
                          },
                        ],
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        request: {
          query: USER_PLEDGES,
          variables: {
            input: { userId: 'userId' },
            where: {},
            orderBy: 'endDate_DESC',
          },
        },
        result: {
          data: {
            getPledgesByUserId: [],
          },
        },
      },
    ]);

    renderCampaigns(link);

    await waitFor(() => {
      expect(screen.getByText('Ended Campaign')).toBeInTheDocument();
    });

    const addPledgeButton = screen.getByTestId('addPledgeBtn');
    expect(addPledgeButton).toBeDisabled();

    // Force trigger the click handler to execute the !canCreatePledge branch.
    addPledgeButton.removeAttribute('disabled');
    addPledgeButton.click();

    expect(screen.queryByTestId('pledgeForm')).not.toBeInTheDocument();
  });

  it('keeps add pledge enabled when pledges have only invalid campaign ids', async () => {
    const startAt = dayjs().subtract(1, 'day').toISOString();
    const endAt = dayjs().add(30, 'day').toISOString();

    const link = new StaticMockLink([
      {
        request: {
          query: USER_FUND_CAMPAIGNS,
          variables: {
            input: { id: 'orgId' },
          },
        },
        result: {
          data: {
            organization: {
              funds: {
                edges: [
                  {
                    node: {
                      isArchived: false,
                      campaigns: {
                        edges: [
                          {
                            node: {
                              id: 'campaignIdActive',
                              name: 'Active Campaign',
                              currencyCode: 'USD',
                              goalAmount: 1000,
                              amountRaised: 100,
                              startAt,
                              endAt,
                            },
                          },
                        ],
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        request: {
          query: USER_PLEDGES,
          variables: {
            input: { userId: 'userId' },
            where: {},
            orderBy: 'endDate_DESC',
          },
        },
        result: {
          data: {
            getPledgesByUserId: [
              {
                id: 'pledge-1',
                amount: 50,
                note: 'pledge with null campaign',
                updatedAt: dayjs().toISOString(),
                campaign: null,
                pledger: {
                  id: 'userId',
                  name: 'User One',
                  avatarURL: null,
                },
              },
              {
                id: 'pledge-2',
                amount: 75,
                note: 'pledge with empty campaign id',
                updatedAt: dayjs().toISOString(),
                campaign: {
                  id: '',
                  name: 'Unknown',
                  startAt,
                  endAt,
                  currencyCode: 'USD',
                  goalAmount: 100,
                  amountRaised: 10,
                },
                pledger: {
                  id: 'userId',
                  name: 'User One',
                  avatarURL: null,
                },
              },
            ],
          },
        },
      },
    ]);

    renderCampaigns(link);

    await waitFor(() => {
      expect(screen.getByText('Active Campaign')).toBeInTheDocument();
    });

    const addPledgeButton = screen.getByTestId('addPledgeBtn');
    expect(addPledgeButton).toBeEnabled();
  });

  it('disables add pledge only for campaigns with valid pledged campaign ids', async () => {
    const startAt = dayjs().subtract(1, 'day').toISOString();
    const endAt = dayjs().add(30, 'day').toISOString();

    const link = new StaticMockLink([
      {
        request: {
          query: USER_FUND_CAMPAIGNS,
          variables: {
            input: { id: 'orgId' },
          },
        },
        result: {
          data: {
            organization: {
              funds: {
                edges: [
                  {
                    node: {
                      isArchived: false,
                      campaigns: {
                        edges: [
                          {
                            node: {
                              id: 'campaignIdActive',
                              name: 'Active Campaign',
                              currencyCode: 'USD',
                              goalAmount: 1000,
                              amountRaised: 100,
                              startAt,
                              endAt,
                            },
                          },
                        ],
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        request: {
          query: USER_PLEDGES,
          variables: {
            input: { userId: 'userId' },
            where: {},
            orderBy: 'endDate_DESC',
          },
        },
        result: {
          data: {
            getPledgesByUserId: [
              {
                id: 'pledge-3',
                amount: 75,
                note: 'pledge with valid campaign id',
                updatedAt: dayjs().toISOString(),
                campaign: {
                  id: 'campaignIdActive',
                  name: 'Active Campaign',
                  startAt,
                  endAt,
                  currencyCode: 'USD',
                  goalAmount: 1000,
                  amountRaised: 100,
                },
                pledger: {
                  id: 'userId',
                  name: 'User One',
                  avatarURL: null,
                },
              },
              {
                id: 'pledge-4',
                amount: 50,
                note: 'pledge with null campaign',
                updatedAt: dayjs().toISOString(),
                campaign: null,
                pledger: {
                  id: 'userId',
                  name: 'User One',
                  avatarURL: null,
                },
              },
            ],
          },
        },
      },
    ]);

    renderCampaigns(link);

    await waitFor(() => {
      expect(screen.getByText('Active Campaign')).toBeInTheDocument();
    });

    const addPledgeButton = screen.getByTestId('addPledgeBtn');
    expect(addPledgeButton).toBeDisabled();

    // Force trigger the click handler to execute the guard branch:
    // if (!canCreatePledge || hasAlreadyPledged) return;
    addPledgeButton.removeAttribute('disabled');
    addPledgeButton.click();
    expect(screen.queryByTestId('pledgeForm')).not.toBeInTheDocument();
  });

  it('Handles fund with no campaigns gracefully', async () => {
    const link = new StaticMockLink(MOCKS_WITH_FUND_NO_CAMPAIGNS);
    renderCampaigns(link);

    await waitFor(() => {
      expect(screen.getByText(cTranslations.noCampaigns)).toBeInTheDocument();
    });
  });

  it('Filters campaigns by search term correctly', async () => {
    renderCampaigns(link1);

    await waitFor(() => {
      expect(screen.getByText('School Campaign')).toBeInTheDocument();
      expect(screen.getByText('Hospital Campaign')).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('searchByInput');
    await user.clear(searchInput);
    await user.type(searchInput, 'School');

    await waitFor(() => {
      expect(screen.getByText('School Campaign')).toBeInTheDocument();
      expect(screen.queryByText('Hospital Campaign')).not.toBeInTheDocument();
    });

    await user.clear(searchInput);

    await waitFor(() => {
      expect(screen.getByText('School Campaign')).toBeInTheDocument();
      expect(screen.getByText('Hospital Campaign')).toBeInTheDocument();
    });
  });

  it('Clears campaigns when organization data is null', async () => {
    const link = new StaticMockLink(MOCKS_WITH_NULL_ORGANIZATION);
    renderCampaigns(link);

    await waitFor(() => {
      expect(screen.getByText(cTranslations.noCampaigns)).toBeInTheDocument();
    });
  });

  it('Handles fund with undefined campaigns field', async () => {
    const link = new StaticMockLink(MOCKS_WITH_UNDEFINED_CAMPAIGNS);
    renderCampaigns(link);

    await waitFor(() => {
      expect(screen.getByText(cTranslations.noCampaigns)).toBeInTheDocument();
    });
  });

  it('Clears search text when clear button is clicked', async () => {
    renderCampaigns(link1);

    await waitFor(() => {
      expect(screen.getByText('School Campaign')).toBeInTheDocument();
      expect(screen.getByText('Hospital Campaign')).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('searchByInput');
    await user.clear(searchInput);
    await user.type(searchInput, 'School');

    await waitFor(() => {
      expect(screen.getByText('School Campaign')).toBeInTheDocument();
      expect(screen.queryByText('Hospital Campaign')).not.toBeInTheDocument();
    });

    const clearButton = screen.getByRole('button', { name: /clear/i });
    await user.click(clearButton);

    await waitFor(() => {
      expect(screen.getByText('School Campaign')).toBeInTheDocument();
      expect(screen.getByText('Hospital Campaign')).toBeInTheDocument();
    });
  });

  it('Shows noResultsFoundFor message when search has no results', async () => {
    renderCampaigns(link1);

    await waitFor(() => {
      expect(screen.getByText('School Campaign')).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('searchByInput');
    await user.clear(searchInput);
    await user.type(searchInput, 'NonExistentCampaign');

    await waitFor(() => {
      const campaignCells = screen.queryAllByTestId('campaignName');
      expect(campaignCells.length).toBe(0);
    });
  });

  it('Displays progress cells with correct percentage and colors', async () => {
    renderCampaigns(link1);

    await waitFor(() => {
      expect(screen.getByText('School Campaign')).toBeInTheDocument();
    });

    const progressCells = screen.getAllByTestId('progressCell');
    expect(progressCells.length).toBeGreaterThan(0);

    progressCells.forEach((cell) => {
      expect(cell).toHaveTextContent('50%');
    });
  });

  it('renders complete progress pie when raised amount reaches or exceeds goal', async () => {
    const startAt = dayjs().subtract(1, 'day').toISOString();
    const endAt = dayjs().add(30, 'days').toISOString();

    const link = new StaticMockLink([
      {
        request: {
          query: USER_FUND_CAMPAIGNS,
          variables: {
            input: { id: 'orgId' },
          },
        },
        result: {
          data: {
            organization: {
              funds: {
                edges: [
                  {
                    node: {
                      isArchived: false,
                      campaigns: {
                        edges: [
                          {
                            node: {
                              id: 'campaignFullProgress',
                              name: 'Campaign Full Progress',
                              currencyCode: 'USD',
                              goalAmount: 100,
                              amountRaised: 150,
                              startAt,
                              endAt,
                            },
                          },
                        ],
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        request: {
          query: USER_PLEDGES,
          variables: {
            input: { userId: 'userId' },
            where: {},
            orderBy: 'endDate_DESC',
          },
        },
        result: {
          data: {
            getPledgesByUserId: [],
          },
        },
      },
    ]);

    renderCampaigns(link);

    await waitFor(() => {
      expect(screen.getByText('Campaign Full Progress')).toBeInTheDocument();
    });

    const progressCell = screen.getByTestId('progressCell');
    expect(progressCell).toHaveTextContent('100%');

    const progressSvg = progressCell.querySelector('svg');
    expect(progressSvg).toBeTruthy();
    expect(progressSvg?.className.baseVal).toContain('progressComplete');
    expect(progressSvg?.querySelector('path')).toBeNull();
    expect(progressSvg?.querySelectorAll('circle').length).toBe(2);
  });

  it('renders large-arc progress slice for percentages above 50 and below 100', async () => {
    const startAt = dayjs().subtract(1, 'day').toISOString();
    const endAt = dayjs().add(30, 'days').toISOString();

    const link = new StaticMockLink([
      {
        request: {
          query: USER_FUND_CAMPAIGNS,
          variables: {
            input: { id: 'orgId' },
          },
        },
        result: {
          data: {
            organization: {
              funds: {
                edges: [
                  {
                    node: {
                      isArchived: false,
                      campaigns: {
                        edges: [
                          {
                            node: {
                              id: 'campaignLargeArc',
                              name: 'Campaign Large Arc',
                              currencyCode: 'USD',
                              goalAmount: 100,
                              amountRaised: 75,
                              startAt,
                              endAt,
                            },
                          },
                        ],
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        request: {
          query: USER_PLEDGES,
          variables: {
            input: { userId: 'userId' },
            where: {},
            orderBy: 'endDate_DESC',
          },
        },
        result: {
          data: {
            getPledgesByUserId: [],
          },
        },
      },
    ]);

    renderCampaigns(link);

    await waitFor(() => {
      expect(screen.getByText('Campaign Large Arc')).toBeInTheDocument();
    });

    const progressCell = screen.getByTestId('progressCell');
    expect(progressCell).toHaveTextContent('75%');

    const progressPath = progressCell.querySelector('path');
    expect(progressPath).toBeTruthy();
    expect(progressPath?.getAttribute('d')).toContain('A 16 16 0 1 1');
  });

  it('Falls back to 0 when amountRaised is missing from API response', async () => {
    const startAt = dayjs().subtract(1, 'day').toISOString();
    const endAt = dayjs().add(30, 'days').toISOString();

    const link = new StaticMockLink([
      {
        request: {
          query: MOCKS[0].request.query,
          variables: {
            input: { id: 'orgId' },
          },
        },
        result: {
          data: {
            organization: {
              funds: {
                edges: [
                  {
                    node: {
                      campaigns: {
                        edges: [
                          {
                            node: {
                              id: 'campaignNoRaised',
                              name: 'Campaign No Raised',
                              currencyCode: 'USD',
                              goalAmount: 1000,
                              startAt,
                              endAt,
                            },
                          },
                        ],
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      },
    ]);

    renderCampaigns(link);

    await waitFor(() => {
      expect(screen.getByText('Campaign No Raised')).toBeInTheDocument();
    });

    const raisedCells = screen.getAllByTestId('raisedCell');
    expect(raisedCells.some((cell) => cell.textContent?.includes('$0'))).toBe(
      true,
    );

    const progressCells = screen.getAllByTestId('progressCell');
    expect(progressCells.some((cell) => cell.textContent?.includes('0%'))).toBe(
      true,
    );
  });

  it('Shows 0% when funding goal is 0', async () => {
    const startAt = dayjs().subtract(1, 'day').toISOString();
    const endAt = dayjs().add(30, 'days').toISOString();

    const link = new StaticMockLink([
      {
        request: {
          query: MOCKS[0].request.query,
          variables: {
            input: { id: 'orgId' },
          },
        },
        result: {
          data: {
            organization: {
              funds: {
                edges: [
                  {
                    node: {
                      campaigns: {
                        edges: [
                          {
                            node: {
                              id: 'campaignZeroGoal',
                              name: 'Campaign Zero Goal',
                              currencyCode: 'USD',
                              goalAmount: 0,
                              amountRaised: 500,
                              startAt,
                              endAt,
                            },
                          },
                        ],
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      },
    ]);

    renderCampaigns(link);

    await waitFor(() => {
      expect(screen.getByText('Campaign Zero Goal')).toBeInTheDocument();
    });

    const progressCell = screen.getByTestId('progressCell');
    expect(progressCell).toHaveTextContent('0%');
  });

  it('Renders campaigns list with campaigns data', async () => {
    renderCampaigns(link1);

    await waitFor(() => {
      expect(screen.getByText('School Campaign')).toBeInTheDocument();
      expect(screen.getByText('Hospital Campaign')).toBeInTheDocument();
    });

    const campaignCells = screen.getAllByTestId('campaignName');
    expect(campaignCells).toHaveLength(2);
  });

  it('Supports sorting by startDate column', async () => {
    renderCampaigns(link1);

    await waitFor(() => {
      expect(screen.getByText('School Campaign')).toBeInTheDocument();
      expect(screen.getByText('Hospital Campaign')).toBeInTheDocument();
    });

    const getCampaignOrder = (): string[] => {
      const campaignCells = screen.getAllByTestId('campaignName');
      return campaignCells.map((cell) => cell.textContent || '');
    };

    const startDateHeader = screen.getByRole('button', {
      name: /start date/i,
    });
    expect(startDateHeader).toBeInTheDocument();

    await user.click(startDateHeader);

    await waitFor(() => {
      const sortedOrder = getCampaignOrder();
      expect(sortedOrder).toEqual(['School Campaign', 'Hospital Campaign']);
    });

    await user.click(startDateHeader);

    await waitFor(() => {
      const descendingOrder = getCampaignOrder();
      expect(descendingOrder).toEqual(['Hospital Campaign', 'School Campaign']);
    });
  });

  it('Supports sorting by endDate column', async () => {
    renderCampaigns(link1);

    await waitFor(() => {
      expect(screen.getByText('School Campaign')).toBeInTheDocument();
      expect(screen.getByText('Hospital Campaign')).toBeInTheDocument();
    });

    const getCampaignOrder = (): string[] => {
      const campaignCells = screen.getAllByTestId('campaignName');
      return campaignCells.map((cell) => cell.textContent || '');
    };

    const endDateHeader = screen.getByRole('button', {
      name: /end date/i,
    });
    expect(endDateHeader).toBeInTheDocument();

    await user.click(endDateHeader);

    await waitFor(() => {
      const sortedOrder = getCampaignOrder();
      expect(sortedOrder).toEqual(['Hospital Campaign', 'School Campaign']);
    });

    await user.click(endDateHeader);

    await waitFor(() => {
      const descendingOrder = getCampaignOrder();
      expect(descendingOrder).toEqual(['School Campaign', 'Hospital Campaign']);
    });
  });
  it('should render correct status for pending campaign', async () => {
    const link = new StaticMockLink(MOCKS_WITH_PENDING_CAMPAIGN);
    renderCampaigns(link);

    await waitFor(() => {
      expect(screen.getByText('Future School Campaign')).toBeInTheDocument();
      const text = screen.getByText(/Not Started/i);
      expect(text).toBeInTheDocument();
    });
  });

  it('falls back to 0 when campaign index map does not contain row id', async () => {
    const originalMapGet = Map.prototype.get;
    const mapGetSpy = vi.spyOn(Map.prototype, 'get');
    mapGetSpy.mockImplementation(function (
      this: Map<unknown, unknown>,
      key: unknown,
    ) {
      if (key === 'campaignId1' || key === 'campaignId2') {
        return undefined;
      }
      return originalMapGet.call(this, key);
    });

    try {
      renderCampaigns(link1);

      await waitFor(() => {
        expect(screen.getByText('School Campaign')).toBeInTheDocument();
      });

      await waitFor(() => {
        const bodyRows = screen
          .getAllByRole('row')
          .filter((row) => row.querySelector('td'));
        const schoolRow = bodyRows.find((row) =>
          row.textContent?.includes('School Campaign'),
        );
        expect(schoolRow).toBeDefined();
        expect(schoolRow?.textContent).toContain('0');
      });
    } finally {
      mapGetSpy.mockRestore();
    }
  });
});
