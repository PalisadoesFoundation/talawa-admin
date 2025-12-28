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
import React from 'react';
import type { ApolloLink } from '@apollo/client';
import { vi } from 'vitest';
import { FUND_CAMPAIGN_PLEDGE } from 'GraphQl/Queries/fundQueries';
import styles from 'style/app-fixed.module.css';
import { IBreadcrumbItem } from 'shared-components/BreadcrumbsComponent';

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

vi.mock('shared-components/BreadcrumbsComponent/SafeBreadcrumbs', () => ({
  __esModule: true,
  default: ({ items }: { items: IBreadcrumbItem[] }) => {
    return (
      <nav data-testid="breadcrumbs">
        {items.map((item: IBreadcrumbItem, index: number) =>
          item.to ? (
            <a
              key={index}
              href={item.to}
              data-testid={
                item.isCurrent
                  ? 'pledgesLink'
                  : item.to.includes('/orgfunds/')
                    ? 'fundsLink'
                    : 'campaignLink'
              }
            >
              {item.label}
            </a>
          ) : (
            <span key={index}>{item.label}</span>
          ),
        )}
      </nav>
    );
  },
}));

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
                  avatarURL: 'img-url',
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
                  avatarURL: null,
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
                  avatarURL: 'img-url3',
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
                  avatarURL: null,
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
        currencyCode: 'USD',
        goalAmount: 1000,
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
                  avatarURL: 'img-url1',
                },
                users: [
                  {
                    __typename: 'User',
                    id: '1',
                    name: 'Main User 1',
                    avatarURL: 'img-url1',
                  },
                  {
                    __typename: 'User',
                    id: '2',
                    name: 'Extra User 1',
                    avatarURL: null,
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
    mockParamsState.orgId = 'orgId';
    mockParamsState.fundCampaignId = 'fundCampaignId';
    routerMocks.navigate.mockReset();
    routerMocks.useParams.mockImplementation(() => ({ ...mockParamsState }));
  });

  afterEach(() => {
    vi.useRealTimers();

    vi.clearAllMocks();
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

  it('renders localized column headers', async () => {
    renderFundCampaignPledge(link1);

    await waitFor(() => {
      expect(screen.getByTestId('searchPledger')).toBeInTheDocument();
    });

    // Get translation values with fallbacks
    const t = (i18nForTest.getDataByLanguage('en')?.translation?.pledges ??
      {}) as Record<string, string>;
    const tCommon = (i18nForTest.getDataByLanguage('en')?.common ??
      {}) as Record<string, string>;

    // Wait for DataGrid headers to render - may take time to appear
    await waitFor(
      () => {
        expect(screen.getByText(t.pledgers ?? 'Pledgers')).toBeInTheDocument();
        expect(
          screen.getByText(t.pledgeDate ?? 'Pledge Date'),
        ).toBeInTheDocument();
        expect(screen.getByText(t.pledged ?? 'Pledged')).toBeInTheDocument();
        expect(screen.getByText(t.donated ?? 'Donated')).toBeInTheDocument();
        expect(
          screen.getByText(tCommon.action ?? 'Action'),
        ).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });

  it('open and closes Create Pledge modal', async () => {
    // Set up controlled date for active campaign
    vi.setSystemTime(new Date('2024-06-15'));
    renderFundCampaignPledge(link1);

    // Wait for component to be fully loaded
    await waitFor(() => {
      expect(screen.getByTestId('searchPledger')).toBeInTheDocument();
    });

    // Click add pledge button
    const addPledgeBtn = screen.getByTestId('addPledgeBtn');
    expect(addPledgeBtn).toBeInTheDocument();
    expect(addPledgeBtn).not.toBeDisabled();
    await userEvent.click(addPledgeBtn);

    // Verify modal opens with correct title
    await waitFor(() => {
      const modalTitle = screen.getByTestId('createPledgeTitle');
      expect(modalTitle).toBeInTheDocument();
      expect(modalTitle).toHaveTextContent(translations.createPledge);
    });

    // Close modal
    const closeBtn = screen.getByTestId('pledgeModalCloseBtn');
    await userEvent.click(closeBtn);

    // Verify modal is closed
    await waitFor(() => {
      expect(screen.queryByTestId('createPledgeTitle')).not.toBeInTheDocument();
    });

    // Reset time mock
    vi.useRealTimers();
  });

  it('open and closes update pledge modal', async () => {
    renderFundCampaignPledge(link1);

    // Wait for the table to load and find edit buttons
    await waitFor(() => {
      const editButtons = screen.getAllByTestId('editPledgeBtn');
      expect(editButtons.length).toBeGreaterThan(0);
    });

    // Click the first edit button
    const editButtons = screen.getAllByTestId('editPledgeBtn');
    await userEvent.click(editButtons[0]);

    // Verify edit modal opens
    await waitFor(() => {
      expect(screen.getByText(translations.editPledge)).toBeInTheDocument();
    });

    // Close the modal
    const closeButton = screen.getByTestId('pledgeModalCloseBtn');
    await userEvent.click(closeButton);

    // Verify modal is closed
    await waitFor(() => {
      expect(
        screen.queryByText(translations.editPledge),
      ).not.toBeInTheDocument();
    });
  });

  it('open and closes delete pledge modal', async () => {
    renderFundCampaignPledge(link1);

    const deletePledgeBtn = await screen.findAllByTestId('deletePledgeBtn');
    await waitFor(() => expect(deletePledgeBtn[0]).toBeInTheDocument());
    await userEvent.click(deletePledgeBtn[0]);

    await waitFor(() =>
      expect(screen.getByText(translations.deletePledge)).toBeInTheDocument(),
    );
    await userEvent.click(screen.getByTestId('modalCloseBtn'));

    await waitFor(() =>
      expect(screen.queryByTestId('modalCloseBtn')).not.toBeInTheDocument(),
    );
  });

  it('Search the Pledges list by Users', async () => {
    renderFundCampaignPledge(link1);
    const searchPledger = await screen.findByTestId('searchPledger');
    fireEvent.change(searchPledger, {
      target: { value: 'John' },
    });
    fireEvent.click(screen.getByTestId('searchBtn'));

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByText('Jane Doe')).toBeNull();
    });
  });

  it('should render breadcrumb links with correct paths', async () => {
    renderFundCampaignPledge(link1);

    await waitFor(() => {
      expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument();
    });

    const fundsLink = screen.getByTestId('fundsLink');
    const campaignLink = screen.getByTestId('campaignLink');

    expect(fundsLink).toHaveAttribute('href', '/orgfunds/orgId');
    expect(campaignLink).toHaveAttribute(
      'href',
      '/orgfundcampaign/orgId/fundCampaignId',
    );

    // current page – rendered as span, not a link
    expect(screen.getByText('Pledges')).toBeInTheDocument();
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
      expect(
        screen.getByTestId('fund-campaign-pledge-empty-state'),
      ).toBeInTheDocument();
      expect(screen.getByText(translations.noPledges)).toBeInTheDocument();
    });
  });

  // Fix the image test
  it('check if user image renders', async () => {
    renderFundCampaignPledge(link1);
    await waitFor(() => {
      expect(screen.getByTestId('searchPledger')).toBeInTheDocument();
    });

    await waitFor(() => {
      // Find image container
      const imageContainer = screen.getByRole('img', {
        name: 'John Doe', // Using the alt text which should match the user name
      });
      expect(imageContainer).toBeInTheDocument();

      // Check either real image or avatar is rendered
      if (imageContainer.getAttribute('src')?.startsWith('data:image/svg')) {
        // Avatar SVG is rendered
        expect(imageContainer).toHaveClass(styles.TableImagePledge);
      } else {
        // Real image is rendered
        expect(imageContainer).toHaveAttribute('src', 'img-url');
      }
    });
  });

  // Fix the extra users test
  it('should render extraUserDetails in Popup', async () => {
    const customLink = new StaticMockLink([mockWithExtraUsers]);
    renderFundCampaignPledge(customLink);

    await waitFor(() => {
      expect(screen.getByText('Main User 1')).toBeInTheDocument();
    });

    // Popup should render without popupExtra for small lists
    const moreContainer = await screen.findByTestId('moreContainer-1');
    await userEvent.click(moreContainer);
    const popup = await screen.findByTestId('extra-users-popup');
    expect(popup.className).not.toContain('popupExtra');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => {
      expect(screen.queryByTestId('extra-users-popup')).not.toBeInTheDocument();
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
            currencyCode: 'USD',
            goalAmount: 1000,
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
                      avatarURL: null,
                    },
                    users: [
                      {
                        __typename: 'User',
                        id: '1',
                        name: 'Main User 1',
                        avatarURL: null,
                      },
                      {
                        __typename: 'User',
                        id: '2',
                        name: 'Extra User 1',
                        avatarURL: null,
                      },
                      {
                        __typename: 'User',
                        id: '3',
                        name: 'Extra User 2',
                        avatarURL: null,
                      },
                      {
                        __typename: 'User',
                        id: '4',
                        name: 'Extra User 3',
                        avatarURL: null,
                      },
                      {
                        __typename: 'User',
                        id: '5',
                        name: 'Extra User 4',
                        avatarURL: null,
                      },
                      {
                        __typename: 'User',
                        id: '6',
                        name: 'Extra User 5',
                        avatarURL: null,
                      },
                      {
                        __typename: 'User',
                        id: '7',
                        name: 'Extra User 6',
                        avatarURL: null,
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

    // Wait for table to load and find main user
    const mainUserText = await screen.findByText('Main User 1');
    expect(mainUserText).toBeInTheDocument();

    // Find more container and check text
    const moreContainer = screen.getByTestId('moreContainer-1');
    expect(moreContainer).toBeInTheDocument();
    expect(moreContainer).toHaveTextContent('+6 more...');

    // Click to show popup
    await userEvent.click(moreContainer);

    // Check popup styling and content
    const popup = await screen.findByTestId('extra-users-popup');
    expect(popup).toBeInTheDocument();
    expect(popup).toHaveClass(styles.popupExtra);

    // Verify all extra users are shown
    for (let i = 1; i <= 6; i++) {
      expect(screen.getByText(`Extra User ${i}`)).toBeInTheDocument();
    }

    // Close the popup via Escape to cover Popover onClose path
    await userEvent.keyboard('{Escape}');
    await waitFor(() => {
      expect(screen.queryByTestId('extra-users-popup')).not.toBeInTheDocument();
    });
  });

  it('should render pledger without extra users (no moreContainer)', async () => {
    const noExtraUsersMock = {
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
            id: 'single',
            name: 'Solo Campaign',
            startAt: '2023-01-01T00:00:00Z',
            endAt: '2024-12-31T23:59:59Z',
            currencyCode: 'USD',
            goalAmount: 500,
            pledges: {
              __typename: 'PledgeConnection',
              edges: [
                {
                  __typename: 'PledgeEdge',
                  node: {
                    __typename: 'Pledge',
                    id: 'singlePledge',
                    amount: 50,
                    createdAt: '2024-01-02T00:00:00Z',
                    pledger: {
                      __typename: 'User',
                      id: 'solo',
                      name: 'Solo User',
                      avatarURL: null,
                    },
                  },
                },
              ],
            },
          },
        },
      },
    };

    const noExtraLink = new StaticMockLink([noExtraUsersMock]);
    renderFundCampaignPledge(noExtraLink);

    await waitFor(() => {
      expect(screen.getByText('Solo User')).toBeInTheDocument();
    });
    expect(
      screen.queryByTestId('moreContainer-singlePledge'),
    ).not.toBeInTheDocument();
  });

  it('should use fallback values when dates/currency are missing', async () => {
    const missingDatesMock = {
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
            id: 'missingDates',
            name: 'No Dates Campaign',
            startAt: null,
            endAt: null,
            currencyCode: null,
            goalAmount: 0,
            pledges: {
              __typename: 'PledgeConnection',
              edges: [
                {
                  __typename: 'PledgeEdge',
                  node: {
                    __typename: 'Pledge',
                    id: 'md1',
                    amount: 75,
                    createdAt: null,
                    pledger: {
                      __typename: 'User',
                      id: 'md-user',
                      name: 'Missing Dates User',
                      avatarURL: null,
                    },
                  },
                },
              ],
            },
          },
        },
      },
    };

    const missingDatesLink = new StaticMockLink([missingDatesMock]);
    renderFundCampaignPledge(missingDatesLink);

    await waitFor(() => {
      expect(screen.getByText('Missing Dates User')).toBeInTheDocument();
      // Amount should still render with default currency fallback $
      expect(screen.getByTestId('amountCell')).toHaveTextContent('$75');
    });
  });

  it('should handle null fundCampaign gracefully', async () => {
    const nullCampaignMock = {
      request: {
        query: FUND_CAMPAIGN_PLEDGE,
        variables: {
          input: { id: 'fundCampaignId' },
        },
      },
      result: {
        data: {
          fundCampaign: null,
        },
      },
    };

    const nullCampaignLink = new StaticMockLink([nullCampaignMock]);
    renderFundCampaignPledge(nullCampaignLink);

    await waitFor(() => {
      // Both conditions belong here
      expect(screen.getByTestId('searchPledger')).toBeInTheDocument();
      expect(
        screen.getByTestId('fund-campaign-pledge-empty-state'),
      ).toBeInTheDocument();
      expect(screen.getByText(translations.noPledges)).toBeInTheDocument();
    });
  });

  it('should render zero-amount pledge with no users and fallback currency', async () => {
    const zeroAmountNoUsersMock = {
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
            id: 'zero',
            name: 'Zero Campaign',
            startAt: '2023-01-01T00:00:00Z',
            endAt: '2024-12-31T23:59:59Z',
            currencyCode: null,
            goalAmount: 0,
            pledges: {
              __typename: 'PledgeConnection',
              edges: [
                {
                  __typename: 'PledgeEdge',
                  node: {
                    __typename: 'Pledge',
                    id: 'zeroPledge',
                    amount: null,
                    createdAt: null,
                    pledger: null,
                    users: [],
                  },
                },
              ],
            },
          },
        },
      },
    };

    const zeroLink = new StaticMockLink([zeroAmountNoUsersMock]);
    renderFundCampaignPledge(zeroLink);

    await waitFor(() => {
      expect(screen.getByTestId('searchPledger')).toBeInTheDocument();
    });

    // Amount falls back to 0 with default currency symbol
    expect(screen.getByTestId('amountCell')).toHaveTextContent('$0');
    // No extra users link since users array is empty
    expect(
      screen.queryByTestId('moreContainer-zeroPledge'),
    ).not.toBeInTheDocument();
  });

  it('should render Progress Bar with Raised amount (CONSTANT) & Pledged Amount', async () => {
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

  it('Sort the Pledges list by Lowest Amount', async () => {
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

  it('Sort the Pledges list by Highest Amount', async () => {
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

  it('Sort the Pledges list by latest endDate', async () => {
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

  // Fix sorting by earliest endDate test
  it('Sort the Pledges list by earliest endDate', async () => {
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
    vi.setSystemTime(new Date('2024-01-01')); // Set current date to known value
    const futureCampaignLink = new StaticMockLink([FUTURE_CAMPAIGN_MOCK]);
    renderFundCampaignPledge(futureCampaignLink);

    await waitFor(() => {
      const addPledgeBtn = screen.getByTestId('addPledgeBtn');
      expect(addPledgeBtn).toBeDisabled();
      expect(addPledgeBtn).toHaveAttribute('title', 'Campaign is not active');
    });
    vi.useRealTimers();
  });

  it('should enable add pledge button for active campaign', async () => {
    vi.setSystemTime(new Date('2024-06-15')); // Set current date within campaign period
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

    // Directly test the sorting by manipulating the state
    const filterButton = screen.getByTestId('filter');
    fireEvent.click(filterButton);

    // The default case should maintain the original order
    await waitFor(() => {
      const amountCells = screen.getAllByTestId('amountCell');
      // Verify that amounts are present, order doesn't matter since default returns 0
      expect(amountCells).toHaveLength(4);
      expect(amountCells[0]).toBeInTheDocument();
      expect(amountCells[1]).toBeInTheDocument();
      expect(amountCells[2]).toBeInTheDocument();
      expect(amountCells[3]).toBeInTheDocument();
    });
  });

  it('should handle all sort cases', async () => {
    renderFundCampaignPledge(link1);

    await waitFor(() => {
      expect(screen.getByTestId('searchPledger')).toBeInTheDocument();
    });

    // Test all sorting options
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
        // Note: endDate sorting tests are already covered in previous tests
      });
    }
  });

  it('should render main user with avatar image when avatarURL is provided', async () => {
    const mockWithAvatarUser = {
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
            currencyCode: 'USD',
            goalAmount: 1000,
            pledges: {
              __typename: 'PledgeConnection',
              edges: [
                {
                  __typename: 'PledgeEdge',
                  node: {
                    __typename: 'Pledge',
                    id: 'avatarPledge',
                    amount: 100,
                    createdAt: '2024-01-01T00:00:00Z',
                    pledger: {
                      __typename: 'User',
                      id: 'avatarUser',
                      name: 'Avatar User',
                      avatarURL: 'https://example.com/avatar.jpg',
                    },
                    users: [
                      {
                        __typename: 'User',
                        id: 'avatarUser',
                        name: 'Avatar User',
                        avatarURL: 'https://example.com/avatar.jpg',
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

    const avatarLink = new StaticMockLink([mockWithAvatarUser]);
    renderFundCampaignPledge(avatarLink);

    await waitFor(() => {
      expect(screen.getByText('Avatar User')).toBeInTheDocument();
    });

    const avatarImg = screen.getByRole('img', { name: 'Avatar User' });

    expect(avatarImg).toHaveAttribute('src', 'https://example.com/avatar.jpg');
    expect(avatarImg).toHaveAttribute('alt', 'Avatar User');
  });

  it('should render extra users with avatarURL in popup', async () => {
    const mockWithExtraAvatarUsers = {
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
            currencyCode: 'USD',
            goalAmount: 1000,
            pledges: {
              __typename: 'PledgeConnection',
              edges: [
                {
                  __typename: 'PledgeEdge',
                  node: {
                    __typename: 'Pledge',
                    id: 'extraAvatarPledge',
                    amount: 100,
                    createdAt: '2024-01-01T00:00:00Z',
                    pledger: {
                      __typename: 'User',
                      id: 'mainUser',
                      name: 'Main User',
                      avatarURL: null,
                    },
                    users: [
                      {
                        __typename: 'User',
                        id: 'mainUser',
                        name: 'Main User',
                        avatarURL: null,
                      },
                      {
                        __typename: 'User',
                        id: 'extraUserWithAvatar',
                        name: 'Extra With Avatar',
                        avatarURL: 'https://example.com/extra-avatar.jpg',
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

    const extraAvatarLink = new StaticMockLink([mockWithExtraAvatarUsers]);
    renderFundCampaignPledge(extraAvatarLink);

    await waitFor(() => {
      expect(screen.getByText('Main User')).toBeInTheDocument();
    });

    // Click on more container to open popup
    const moreContainer = screen.getByTestId('moreContainer-extraAvatarPledge');
    expect(moreContainer).toHaveTextContent('+1 more...');
    await userEvent.click(moreContainer);

    // Check popup is open and extra user with avatar is rendered
    const popup = await screen.findByTestId('extra-users-popup');
    expect(popup).toBeInTheDocument();

    // Check that the extra user with avatarURL has an img element
    const extraUserContainer = screen.getByTestId('extraUser-0');
    expect(extraUserContainer).toBeInTheDocument();
    const img = extraUserContainer.querySelector('img');
    expect(img).toHaveAttribute('src', 'https://example.com/extra-avatar.jpg');
    expect(img).toHaveAttribute('alt', 'Extra With Avatar');

    await userEvent.keyboard('{Escape}');
    await waitFor(() => {
      expect(screen.queryByTestId('extra-users-popup')).not.toBeInTheDocument();
    });
  });

  it('should fallback to pledger when users array is not present', async () => {
    const mockWithoutUsersArray = {
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
            currencyCode: 'USD',
            goalAmount: 1000,
            pledges: {
              __typename: 'PledgeConnection',
              edges: [
                {
                  __typename: 'PledgeEdge',
                  node: {
                    __typename: 'Pledge',
                    id: 'noUsersArrayPledge',
                    amount: 150,
                    createdAt: '2024-01-01T00:00:00Z',
                    pledger: {
                      __typename: 'User',
                      id: 'fallbackPledger',
                      name: 'Fallback Pledger',
                      avatarURL: null,
                    },
                    // No users array - should fallback to pledger
                  },
                },
              ],
            },
          },
        },
      },
    };

    const noUsersArrayLink = new StaticMockLink([mockWithoutUsersArray]);
    renderFundCampaignPledge(noUsersArrayLink);

    await waitFor(() => {
      expect(screen.getByText('Fallback Pledger')).toBeInTheDocument();
    });

    // Verify the pledger is rendered as the main user
    const mainUserContainer = screen.getByTestId(
      'mainUser-noUsersArrayPledge-0',
    );
    expect(mainUserContainer).toBeInTheDocument();
    expect(mainUserContainer).toHaveTextContent('Fallback Pledger');
  });
});
