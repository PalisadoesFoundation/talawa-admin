import React from 'react';
import { GraphQLError } from 'graphql';
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
import { MemoryRouter, Route, Routes } from 'react-router';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18nForTest from 'utils/i18nForTest';
import { MOCKS } from './PledgesMocks';
import { USER_DETAILS } from 'GraphQl/Queries/Queries';
import { ApolloLink, InMemoryCache } from '@apollo/client';
import Pledges from './Pledges';
import { USER_PLEDGES } from 'GraphQl/Queries/fundQueries';
import useLocalStorage from 'utils/useLocalstorage';
import { vi, expect, describe, it } from 'vitest';
import dayjs from 'dayjs';

type MockStorage = Storage & { resetStore: () => void };

const createLocalStorageMock = (): MockStorage => {
  const store = new Map<string, string>();

  const storage = {
    getItem: (key: string) => {
      if (!store.has(key)) {
        return null;
      }

      return store.get(key) ?? null;
    },
    setItem: (key: string, value: unknown) => {
      store.set(key, String(value));
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
    clear: () => {
      store.clear();
    },
    key: (index: number) => Array.from(store.keys())[index] ?? null,
    get length() {
      return store.size;
    },
    resetStore: () => {
      store.clear();
    },
  } satisfies Storage & { resetStore: () => void };

  return storage;
};

const localStorageMock = createLocalStorageMock();

Object.defineProperty(window, 'localStorage', {
  configurable: true,
  value: localStorageMock,
});

const MOCKS_WITH_MISSING_CAMPAIGN = [
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
            id: 'pledgeId1',
            amount: 700,
            note: 'Hospital pledge note',
            updatedAt: dayjs().toISOString(),
            campaign: null,
            pledger: {
              id: 'userId',
              name: 'Harve Lance',
              avatarURL: 'image-url',
              __typename: 'User',
            },
            updater: {
              id: 'userId',
              __typename: 'User',
            },
            __typename: 'FundraisingCampaignPledge',
          },
        ],
      },
    },
  },
];

const MOCKS_WITH_INVALID_DATE = [
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
            id: 'pledgeId1',
            amount: 700,
            note: 'Hospital pledge note',
            updatedAt: dayjs().toISOString(),
            campaign: {
              id: 'campaignId1',
              name: 'Hospital Campaign',
              startAt: dayjs().startOf('month').toISOString(),
              endAt: 'invalid-date',
              currencyCode: 'USD',
              goalAmount: 10000,
              __typename: 'FundraisingCampaign',
            },
            pledger: {
              id: 'userId',
              name: 'Harve Lance',
              avatarURL: 'image-url',
              __typename: 'User',
            },
            updater: {
              id: 'userId',
              __typename: 'User',
            },
            __typename: 'FundraisingCampaignPledge',
          },
        ],
      },
    },
  },
];

const MOCKS_WITH_MORE_USERS = [
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
            id: 'pledgeId1',
            amount: 700,
            note: 'Hospital pledge note',
            updatedAt: dayjs().toISOString(),
            campaign: {
              id: 'campaignId1',
              name: 'Hospital Campaign',
              startAt: dayjs().startOf('month').toISOString(),
              endAt: dayjs().add(1, 'month').endOf('month').toISOString(),
              currencyCode: 'USD',
              goalAmount: 10000,
              __typename: 'FundraisingCampaign',
            },
            pledger: {
              id: 'userId',
              name: 'Harve Lance',
              avatarURL: 'image-url',
              __typename: 'User',
            },
            updater: {
              id: 'userId',
              __typename: 'User',
            },
            __typename: 'FundraisingCampaignPledge',
          },
          {
            id: 'pledgeId2',
            amount: 100,
            note: 'School pledge note',
            updatedAt: dayjs().toISOString(),
            campaign: {
              id: 'campaignId2',
              name: 'School Campaign',
              startAt: dayjs().startOf('month').toISOString(),
              endAt: dayjs().add(2, 'months').endOf('month').toISOString(),
              currencyCode: 'USD',
              goalAmount: 5000,
              __typename: 'FundraisingCampaign',
            },
            pledger: {
              id: 'userId5',
              name: 'John Doe',
              avatarURL: null,
              __typename: 'User',
            },
            updater: {
              id: 'userId5',
              __typename: 'User',
            },
            __typename: 'FundraisingCampaignPledge',
          },
          {
            id: 'pledgeId3',
            amount: 300,
            note: 'Library pledge note',
            updatedAt: dayjs().toISOString(),
            campaign: {
              id: 'campaignId3',
              name: 'Library Campaign',
              startAt: dayjs().startOf('month').toISOString(),
              endAt: dayjs()
                .add(1, 'month')
                .date(15)
                .endOf('day')
                .toISOString(),
              currencyCode: 'USD',
              goalAmount: 3000,
              __typename: 'FundraisingCampaign',
            },
            pledger: {
              id: 'userId3',
              name: 'Jeramy Gracia',
              avatarURL: 'image-url3',
              __typename: 'User',
            },
            updater: {
              id: 'userId3',
              __typename: 'User',
            },
            __typename: 'FundraisingCampaignPledge',
          },
          {
            id: 'pledgeId4',
            amount: 200,
            note: 'Park pledge note',
            updatedAt: dayjs().toISOString(),
            campaign: {
              id: 'campaignId4',
              name: 'Park Campaign',
              startAt: dayjs().startOf('month').toISOString(),
              endAt: dayjs()
                .add(1, 'month')
                .date(10)
                .endOf('day')
                .toISOString(),
              currencyCode: 'USD',
              goalAmount: 2000,
              __typename: 'FundraisingCampaign',
            },
            pledger: {
              id: 'userId4',
              name: 'Praise Norris',
              avatarURL: null,
              __typename: 'User',
            },
            updater: {
              id: 'userId4',
              __typename: 'User',
            },
            __typename: 'FundraisingCampaignPledge',
          },
        ],
      },
    },
  },
];

const MOCKS_WITH_SINGLE_PLEDGER = [
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
            id: 'pledgeId1',
            amount: 700,
            note: 'Hospital pledge note',
            updatedAt: dayjs().toISOString(),
            campaign: {
              id: 'campaignId1',
              name: 'Hospital Campaign',
              startAt: dayjs().startOf('month').toISOString(),
              endAt: dayjs().add(1, 'month').endOf('month').toISOString(),
              currencyCode: 'USD',
              goalAmount: 10000,
              __typename: 'FundraisingCampaign',
            },
            pledger: {
              id: 'userId',
              name: 'Harve Lance',
              avatarURL: 'image-url',
              __typename: 'User',
            },
            updater: {
              id: 'userId',
              __typename: 'User',
            },
            __typename: 'FundraisingCampaignPledge',
          },
        ],
      },
    },
  },
];

const MOCKS_WITH_DIFFERENT_CURRENCIES = [
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
            id: 'pledgeId1',
            amount: 700,
            note: 'Hospital pledge note',
            updatedAt: dayjs().toISOString(),
            campaign: {
              id: 'campaignId1',
              name: 'Hospital Campaign',
              startAt: dayjs().startOf('month').toISOString(),
              endAt: dayjs().add(1, 'month').endOf('month').toISOString(),
              currencyCode: 'EUR',
              goalAmount: 10000,
              __typename: 'FundraisingCampaign',
            },
            pledger: {
              id: 'userId',
              name: 'Harve Lance',
              avatarURL: 'image-url',
              __typename: 'User',
            },
            updater: {
              id: 'userId',
              __typename: 'User',
            },
            __typename: 'FundraisingCampaignPledge',
          },
        ],
      },
    },
  },
];

const MOCKS_WITH_ZERO_GOAL = [
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
            id: 'pledgeId1',
            amount: 700,
            note: 'Hospital pledge note',
            updatedAt: dayjs().toISOString(),
            campaign: {
              id: 'campaignId1',
              name: 'Hospital Campaign',
              startAt: dayjs().startOf('month').toISOString(),
              endAt: dayjs().add(1, 'month').endOf('month').toISOString(),
              currencyCode: 'USD',
              goalAmount: 0,
              __typename: 'FundraisingCampaign',
            },
            pledger: {
              id: 'userId',
              name: 'Harve Lance',
              avatarURL: 'image-url',
              __typename: 'User',
            },
            updater: {
              id: 'userId',
              __typename: 'User',
            },
            __typename: 'FundraisingCampaignPledge',
          },
        ],
      },
    },
  },
];

const EMPTY_MOCKS = [
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
  {
    request: {
      query: USER_DETAILS,
      variables: {
        input: { id: 'userId' },
      },
    },
    result: {
      data: {
        user: {
          id: 'userId',
          joinedOrganizations: [
            {
              id: '6537904485008f171cf29924',
              __typename: 'Organization',
            },
          ],
          firstName: 'Harve',
          lastName: 'Lance',
          email: 'testuser1@example.com',
          image: null,
          createdAt: dayjs().subtract(1, 'year').toISOString(),
          birthDate: null,
          educationGrade: null,
          employmentStatus: null,
          gender: null,
          maritalStatus: null,
          phone: null,
          address: {
            line1: 'Line1',
            countryCode: 'CountryCode',
            city: 'CityName',
            state: 'State',
            __typename: 'Address',
          },
          registeredEvents: [],
          membershipRequests: [],
          __typename: 'User',
        },
      },
    },
  },
];

const USER_PLEDGES_ERROR = [
  {
    request: {
      query: USER_PLEDGES,
      variables: {
        input: { userId: 'userId' },
        where: {},
        orderBy: 'endDate_DESC',
      },
    },
    error: new Error('Mock Graphql USER_PLEDGES Error'),
  },
];

const USER_PLEDGES_NO_ASSOCIATED_RESOURCES_ERROR = [
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
        getPledgesByUserId: null,
      },
      errors: [
        new GraphQLError(
          'No associated resources found for the provided arguments.',
          {
            extensions: {
              code: 'arguments_associated_resources_not_found',
            },
          },
        ),
      ],
    },
  },
];

const link1 = new StaticMockLink(MOCKS);
const link2 = new StaticMockLink(USER_PLEDGES_ERROR);
const link3 = new StaticMockLink(EMPTY_MOCKS);
const link4 = new StaticMockLink(MOCKS_WITH_SINGLE_PLEDGER);
const link5 = new StaticMockLink(MOCKS_WITH_DIFFERENT_CURRENCIES);
const link6 = new StaticMockLink(MOCKS_WITH_ZERO_GOAL);
const link8 = new StaticMockLink(MOCKS_WITH_MISSING_CAMPAIGN);
const link9 = new StaticMockLink(MOCKS_WITH_INVALID_DATE);
const link10 = new StaticMockLink(MOCKS_WITH_MORE_USERS);
const link11 = new StaticMockLink(USER_PLEDGES_NO_ASSOCIATED_RESOURCES_ERROR);

const translations = JSON.parse(
  JSON.stringify(i18nForTest.getDataByLanguage('en')?.translation),
);

const renderMyPledges = (link: ApolloLink): RenderResult => {
  const cache = new InMemoryCache();
  return render(
    <MockedProvider link={link} cache={cache}>
      <MemoryRouter initialEntries={['/user/pledges/orgId']}>
        <Provider store={store}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route path="/user/pledges/:orgId" element={<Pledges />} />
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

describe('Testing User Pledge Screen', () => {
  const { setItem } = useLocalStorage();
  beforeEach(() => {
    localStorageMock.resetStore();
    setItem('userId', 'userId');
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it('should render the Campaign Pledge screen', async () => {
    renderMyPledges(link1);
    await waitFor(() => {
      expect(screen.getByRole('grid')).toBeInTheDocument();
      expect(screen.getByText('Harve Lance')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  it('should redirect to fallback URL if userId is null in LocalStorage', async () => {
    setItem('userId', null);
    renderMyPledges(link1);
    await waitFor(() => {
      expect(screen.getByTestId('paramsError')).toBeInTheDocument();
    });
  });

  it('should redirect to fallback URL if URL params are undefined', async () => {
    const cache = new InMemoryCache();
    render(
      <MockedProvider link={link1} cache={cache}>
        <MemoryRouter initialEntries={['/']}>
          <Provider store={store}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                <Routes>
                  <Route path="/user/pledges/:orgId" element={<Pledges />} />
                  <Route path="/" element={<div data-testid="paramsError" />} />
                </Routes>
              </I18nextProvider>
            </LocalizationProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );
    await waitFor(() => {
      expect(screen.getByTestId('paramsError')).toBeInTheDocument();
    });
  });

  it('should render user image when avatarURL is provided', async () => {
    renderMyPledges(link1);
    await waitFor(() => {
      expect(screen.getByRole('grid')).toBeInTheDocument();
      expect(screen.getByTestId('image-pledger-userId')).toHaveAttribute(
        'src',
        'image-url',
      );
    });
  });

  it('should render avatar when no avatarURL is provided', async () => {
    renderMyPledges(link1);
    await waitFor(() => {
      expect(screen.getByRole('grid')).toBeInTheDocument();
      expect(screen.getByTestId('avatar-pledger-userId5')).toHaveAttribute(
        'alt',
        'John Doe',
      );
    });
  });

  it('should handle missing campaign data', async () => {
    renderMyPledges(link8);
    await waitFor(() => {
      expect(screen.getByRole('grid')).toBeInTheDocument();
    });
  });

  it('should handle invalid end date', async () => {
    renderMyPledges(link9);
    await waitFor(() => {
      expect(screen.getByRole('grid')).toBeInTheDocument();
    });
  });

  it('should render all pledges as separate rows', async () => {
    renderMyPledges(link10);
    await waitFor(() => {
      expect(screen.getByRole('grid')).toBeInTheDocument();
      expect(screen.getByText('Harve Lance')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jeramy Gracia')).toBeInTheDocument();
      expect(screen.getByText('Praise Norris')).toBeInTheDocument();
    });
  });

  it('should display single pledger correctly', async () => {
    renderMyPledges(link4);
    await waitFor(() => {
      expect(screen.getByRole('grid')).toBeInTheDocument();
      expect(screen.getByText('Harve Lance')).toBeInTheDocument();
      expect(screen.getByText('Hospital Campaign')).toBeInTheDocument();
      expect(screen.getByTestId('amountCell')).toHaveTextContent('$700');
    });
  });

  it('should render correct currency symbol', async () => {
    renderMyPledges(link5);
    await waitFor(() => {
      expect(screen.getByRole('grid')).toBeInTheDocument();
      expect(screen.getByTestId('amountCell')).toHaveTextContent('€700');
      expect(screen.getByTestId('paidCell')).toHaveTextContent('€0');
    });
  });

  it('should render ProgressBar with zero goal amount', async () => {
    renderMyPledges(link6);
    await waitFor(() => {
      expect(screen.getByRole('grid')).toBeInTheDocument();
      expect(screen.getByTestId('progressBar')).toHaveTextContent('0%');
    });
  });

  it('should open and close delete pledge modal', async () => {
    renderMyPledges(link1);
    await waitFor(() => {
      expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    const deletePledgeBtn = await screen.findAllByTestId('deletePledgeBtn');
    await userEvent.click(deletePledgeBtn[0]);
    await waitFor(() => {
      expect(
        screen.getByText((content) =>
          content.includes(translations.pledges.deletePledge),
        ),
      ).toBeInTheDocument();
    });

    await userEvent.click(screen.getByTestId('modalCloseBtn'));
    await waitFor(() => {
      expect(screen.queryByTestId('modalCloseBtn')).not.toBeInTheDocument();
    });
  });

  it('should open and close update pledge modal', async () => {
    renderMyPledges(link1);
    await waitFor(() => {
      expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    const editPledgeBtn = await screen.findAllByTestId('editPledgeBtn');
    await userEvent.click(editPledgeBtn[0]);
    await waitFor(() => {
      expect(
        screen.getByText(translations.pledges.editPledge),
      ).toBeInTheDocument();
    });

    await userEvent.click(screen.getByTestId('modalCloseBtn'));
    await waitFor(() => {
      expect(screen.queryByTestId('modalCloseBtn')).not.toBeInTheDocument();
    });
  });

  it('should render error state', async () => {
    renderMyPledges(link2);
    await waitFor(() => {
      expect(screen.getByTestId('errorMsg')).toBeInTheDocument();
      expect(
        screen.getByText(/Error occured while loading Pledges data/i),
      ).toBeInTheDocument();
    });
    const errorElement = screen.getByTestId('errorMsg');
    expect(errorElement).toHaveTextContent('Mock Graphql USER_PLEDGES Error');
  });

  it('should show empty state when server returns no associated resources error', async () => {
    renderMyPledges(link11);
    await waitFor(() => {
      expect(
        screen.getByText(translations.userCampaigns.noPledges),
      ).toBeInTheDocument();
    });
    expect(screen.queryByTestId('errorMsg')).not.toBeInTheDocument();
  });

  it('should render empty state', async () => {
    renderMyPledges(link3);
    await waitFor(() => {
      expect(
        screen.getByText(translations.userCampaigns.noPledges),
      ).toBeInTheDocument();
    });
  });

  it('should render DataGrid with correct styling', async () => {
    renderMyPledges(link1);
    await waitFor(() => {
      const dataGrid = document.querySelector('.MuiDataGrid-root');
      expect(dataGrid).toBeInTheDocument();
      expect(dataGrid).toHaveClass('MuiDataGrid-root');
    });
  });

  it('should handle component unmounting', async () => {
    const { unmount } = renderMyPledges(link1);
    await waitFor(() => {
      expect(screen.getByRole('grid')).toBeInTheDocument();
    });
    unmount();
    expect(screen.queryByRole('grid')).not.toBeInTheDocument();
  });

  it('should update pledges on pledgeData change', async () => {
    const { unmount } = renderMyPledges(link1);
    await waitFor(() => {
      expect(screen.getByText('Harve Lance')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
    unmount();
    renderMyPledges(link3);
    await waitFor(() => {
      expect(
        screen.getByText(translations.userCampaigns.noPledges),
      ).toBeInTheDocument();
      expect(screen.queryByText('Harve Lance')).not.toBeInTheDocument();
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });
  });

  it('should handle pledge with null campaign gracefully', async () => {
    renderMyPledges(link8);
    await waitFor(() => {
      expect(screen.getByRole('grid')).toBeInTheDocument();
      expect(screen.getByText('Harve Lance')).toBeInTheDocument();
    });
  });

  it('should handle invalid date formatting', async () => {
    renderMyPledges(link9);
    await waitFor(() => {
      expect(screen.getByRole('grid')).toBeInTheDocument();
      expect(screen.getByText('Harve Lance')).toBeInTheDocument();
    });
  });

  it('should display progress bar correctly', async () => {
    renderMyPledges(link1);
    await waitFor(() => {
      expect(screen.getByRole('grid')).toBeInTheDocument();
      const progressBars = screen.getAllByTestId('progressBar');
      expect(progressBars.length).toBeGreaterThan(0);
      expect(progressBars[0]).toBeInTheDocument();
    });
  });

  it('should handle different currency codes', async () => {
    renderMyPledges(link5);
    await waitFor(() => {
      expect(screen.getByRole('grid')).toBeInTheDocument();
      expect(screen.getByTestId('amountCell')).toBeInTheDocument();
      expect(screen.getByTestId('paidCell')).toBeInTheDocument();
    });
  });

  it('should render pledges with pledger data', async () => {
    renderMyPledges(link10);
    await waitFor(() => {
      expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Harve Lance')).toBeInTheDocument();
    });
  });

  it('should handle zero goal amount', async () => {
    renderMyPledges(link6);
    await waitFor(() => {
      expect(screen.getByRole('grid')).toBeInTheDocument();
    });
  });

  it('should display pledger avatar when available', async () => {
    renderMyPledges(link1);
    await waitFor(() => {
      expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    expect(screen.getByTestId('image-pledger-userId')).toHaveAttribute(
      'src',
      'image-url',
    );
  });

  it('should handle campaign with missing data gracefully', async () => {
    renderMyPledges(link8);
    await waitFor(() => {
      expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Harve Lance')).toBeInTheDocument();
    });
  });

  it('should render with null pledger gracefully', async () => {
    const mockWithNullPledger = new StaticMockLink([
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
                id: 'nullPledgerPledgeId',
                amount: 300,
                note: 'Null pledger test',
                updatedAt: dayjs().toISOString(),
                campaign: {
                  id: 'campaignId1',
                  name: 'Test Campaign',
                  startAt: dayjs().startOf('month').toISOString(),
                  endAt: dayjs().add(1, 'month').endOf('month').toISOString(),
                  currencyCode: 'USD',
                  goalAmount: 10000,
                  __typename: 'FundraisingCampaign',
                },
                pledger: null,
                updater: {
                  id: 'userId',
                  __typename: 'User',
                },
                __typename: 'FundraisingCampaignPledge',
              },
            ],
          },
        },
      },
    ]);

    renderMyPledges(mockWithNullPledger);

    await waitFor(() => {
      expect(screen.getByRole('grid')).toBeInTheDocument();
    });
  });

  it('should render pledger with avatarURL in main row', async () => {
    const mockWithPledgerAvatar = new StaticMockLink([
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
                id: 'avatarPledgerId',
                amount: 400,
                note: 'Avatar pledger test',
                updatedAt: dayjs().toISOString(),
                campaign: {
                  id: 'campaignId1',
                  name: 'Test Campaign',
                  startAt: dayjs().startOf('month').toISOString(),
                  endAt: dayjs().add(1, 'month').endOf('month').toISOString(),
                  currencyCode: 'USD',
                  goalAmount: 10000,
                  __typename: 'FundraisingCampaign',
                },
                pledger: {
                  id: 'avatarPledgerUserId',
                  name: 'Avatar Pledger',
                  avatarURL: 'https://example.com/pledger-avatar.jpg',
                  __typename: 'User',
                },
                updater: {
                  id: 'avatarPledgerUserId',
                  __typename: 'User',
                },
                __typename: 'FundraisingCampaignPledge',
              },
            ],
          },
        },
      },
    ]);

    renderMyPledges(mockWithPledgerAvatar);

    await waitFor(() => {
      expect(screen.getByText('Avatar Pledger')).toBeInTheDocument();
    });

    const pledgerImage = screen.getByTestId(
      'image-pledger-avatarPledgerUserId',
    );
    expect(pledgerImage).toHaveAttribute(
      'src',
      'https://example.com/pledger-avatar.jpg',
    );
  });

  it('should render pledge with pledger', async () => {
    const mockWithPledger = new StaticMockLink([
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
                id: 'pledgerPledgeId',
                amount: 250,
                note: 'Pledger test',
                updatedAt: dayjs().toISOString(),
                campaign: {
                  id: 'campaignId1',
                  name: 'Test Campaign',
                  startAt: dayjs().startOf('month').toISOString(),
                  endAt: dayjs().add(1, 'month').endOf('month').toISOString(),
                  currencyCode: 'USD',
                  goalAmount: 10000,
                  __typename: 'FundraisingCampaign',
                },
                pledger: {
                  id: 'pledgerId',
                  name: 'Pledger User',
                  avatarURL: null,
                  __typename: 'User',
                },
                updater: {
                  id: 'pledgerId',
                  __typename: 'User',
                },
                __typename: 'FundraisingCampaignPledge',
              },
            ],
          },
        },
      },
    ]);

    renderMyPledges(mockWithPledger);

    await waitFor(() => {
      expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Pledger User')).toBeInTheDocument();
    });
  });

  describe('LoadingState Behavior', () => {
    it('should show LoadingState spinner while pledges are loading', async () => {
      const loadingMocks = [
        {
          request: {
            query: USER_PLEDGES,
            variables: {
              input: { userId: 'userId' },
              where: {},
              orderBy: 'endDate_DESC',
            },
          },
          result: { data: { getPledgesByUserId: [] } },
          delay: 100,
        },
      ];

      renderMyPledges(new StaticMockLink(loadingMocks));
      await waitFor(() => {
        const spinners = screen.getAllByTestId('spinner');
        expect(spinners.length).toBeGreaterThan(0);
      });
    });

    it('should hide spinner and render pledges after LoadingState completes', async () => {
      renderMyPledges(new StaticMockLink(MOCKS));

      await waitFor(() => {
        expect(screen.getByRole('grid')).toBeInTheDocument();
      });

      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    });
  });
});
