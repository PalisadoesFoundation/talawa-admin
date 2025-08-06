import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import type { RenderResult } from '@testing-library/react';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18nForTest from 'utils/i18nForTest';
import {
  EMPTY_MOCKS,
  MOCKS,
  USER_PLEDGES_ERROR,
} from './PledgesMocks';
import type { ApolloLink } from '@apollo/client';
import Pledges from './Pledges';
import { USER_PLEDGES } from 'GraphQl/Queries/fundQueries';
import useLocalStorage from 'utils/useLocalstorage';
import { vi, expect, describe, it } from 'vitest';

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useParams: () => ({ orgId: 'orgId' }),
  };
});

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));
vi.mock('@mui/x-date-pickers/DateTimePicker', async () => {
  const actualModule = await vi.importActual(
    '@mui/x-date-pickers/DesktopDateTimePicker',
  );
  return {
    DateTimePicker: actualModule.DesktopDateTimePicker,
  };
});

// Mock for testing "more users" functionality - includes 4 users
export const MOCKS_WITH_MORE_USERS = [
  {
    request: {
      query: USER_PLEDGES,
      variables: {
        input: { userId: 'userId' },
        where: {
          firstName_contains: '',
          name_contains: undefined,
        },
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
            updatedAt: '2024-07-28T10:00:00.000Z',
            campaign: {
              id: 'campaignId1',
              name: 'Hospital Campaign',
              startAt: '2024-07-01T00:00:00.000Z',
              endAt: '2024-08-30T23:59:59.000Z',
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
            updatedAt: '2024-07-28T10:00:00.000Z',
            campaign: {
              id: 'campaignId2',
              name: 'School Campaign',
              startAt: '2024-07-01T00:00:00.000Z',
              endAt: '2024-09-30T23:59:59.000Z',
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
            updatedAt: '2024-07-28T10:00:00.000Z',
            campaign: {
              id: 'campaignId3',
              name: 'Library Campaign',
              startAt: '2024-07-01T00:00:00.000Z',
              endAt: '2024-08-15T23:59:59.000Z',
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
            updatedAt: '2024-07-28T10:00:00.000Z',
            campaign: {
              id: 'campaignId4',
              name: 'Park Campaign',
              startAt: '2024-07-01T00:00:00.000Z',
              endAt: '2024-08-10T23:59:59.000Z',
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

const { setItem } = useLocalStorage();

const link1 = new StaticMockLink(MOCKS);
const link2 = new StaticMockLink(USER_PLEDGES_ERROR);
const link3 = new StaticMockLink(EMPTY_MOCKS);
const translations = JSON.parse(
  JSON.stringify(i18nForTest.getDataByLanguage('en')?.translation.pledges),
);

const renderMyPledges = (link: ApolloLink): RenderResult => {
  return render(
    <MockedProvider addTypename={false} link={link}>
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
  beforeEach(() => {
    setItem('userId', 'userId');
  });

  afterAll(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('should render the Campaign Pledge screen', async () => {
    renderMyPledges(link1);
    await waitFor(() => {
      expect(screen.getByTestId('searchPledges')).toBeInTheDocument();
      expect(screen.getByText('Harve Lance')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  // This test works:
  it('should redirect to fallback URL if userId is null in LocalStorage', async () => {
    setItem('userId', null);

    renderMyPledges(link1);
    await waitFor(() => {
      expect(screen.getByTestId('paramsError')).toBeInTheDocument();
    });
  });

  // So let's structure our failing test similarly:
  it('should redirect to fallback URL if URL params are undefined', async () => {
    render(
      <MockedProvider addTypename={false} link={link1}>
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

  it('check if user image renders', async () => {
    renderMyPledges(link1);
    await waitFor(() => {
      expect(screen.getByTestId('searchPledges')).toBeInTheDocument();
    });

    const image = await screen.findByTestId('image-pledger-userId');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'image-url');
  });

  it('Sort the Pledges list by Lowest Amount', async () => {
    renderMyPledges(link1);

    const searchPledger = await screen.findByTestId('searchPledges');
    expect(searchPledger).toBeInTheDocument();

    await userEvent.click(screen.getByTestId('filter'));
    await waitFor(() => {
      expect(screen.getByTestId('amount_ASC')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('amount_ASC'));

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByText('Harve Lance')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getAllByTestId('amountCell')[0]).toHaveTextContent('100');
    });
  });

  it('Sort the Pledges list by Highest Amount', async () => {
    renderMyPledges(link1);

    const searchPledger = await screen.findByTestId('searchPledges');
    expect(searchPledger).toBeInTheDocument();

    await userEvent.click(screen.getByTestId('filter'));
    await waitFor(() => {
      expect(screen.getByTestId('amount_DESC')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('amount_DESC'));

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByText('Harve Lance')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getAllByTestId('amountCell')[0]).toHaveTextContent('700');
    });
  });

  it('Sort the Pledges list by earliest endDate', async () => {
    renderMyPledges(link1);

    const searchPledger = await screen.findByTestId('searchPledges');
    expect(searchPledger).toBeInTheDocument();

    await userEvent.click(screen.getByTestId('filter'));
    await waitFor(() => {
      expect(screen.getByTestId('endDate_ASC')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('endDate_ASC'));

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByText('Harve Lance')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getAllByTestId('amountCell')[0]).toHaveTextContent('700');
    });
  });

  it('Sort the Pledges list by latest endDate', async () => {
    renderMyPledges(link1);

    const searchPledger = await screen.findByTestId('searchPledges');
    expect(searchPledger).toBeInTheDocument();

    await userEvent.click(screen.getByTestId('filter'));
    await waitFor(() => {
      expect(screen.getByTestId('endDate_DESC')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('endDate_DESC'));

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByText('Harve Lance')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getAllByTestId('amountCell')[0]).toHaveTextContent('100');
    });
  });

  it('Search the Pledges list by User name', async () => {
    renderMyPledges(link1);

    await waitFor(() => {
      expect(screen.getByTestId('searchPledges')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByTestId('searchByDrpdwn'));

    await waitFor(() => {
      expect(screen.getByTestId('pledgers')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('pledgers'));

    const searchPledger = screen.getByTestId('searchPledges');
    fireEvent.change(searchPledger, {
      target: { value: 'Harve' },
    });
    fireEvent.click(screen.getByTestId('searchBtn'));

    await waitFor(() => {
      expect(screen.getByText('Harve Lance')).toBeInTheDocument();
      expect(screen.queryByText('John Doe')).toBeNull();
    });
  });

  it('Search the Pledges list by Campaign name', async () => {
    renderMyPledges(link1);

    await waitFor(() => {
      expect(screen.getByTestId('searchPledges')).toBeInTheDocument();
    });

    const searchByToggle = await screen.findByTestId('searchByDrpdwn');
    fireEvent.click(searchByToggle);

    await waitFor(() => {
      expect(screen.getByTestId('campaigns')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('campaigns'));

    const searchPledger = await screen.findByTestId('searchPledges');
    fireEvent.change(searchPledger, {
      target: { value: 'School' },
    });
    fireEvent.click(screen.getByTestId('searchBtn'));

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByText('Harve Lance')).toBeNull();
    });
  });

  it('should render all pledges as separate rows', async () => {
    const linkWithMoreUsers = new StaticMockLink(MOCKS_WITH_MORE_USERS, true);
    renderMyPledges(linkWithMoreUsers);
    await waitFor(() => {
      expect(screen.getByTestId('searchPledges')).toBeInTheDocument();
    });

    await waitFor(() => {
      // All pledgers should be visible as separate rows
      expect(screen.getByText('Harve Lance')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jeramy Gracia')).toBeInTheDocument();
      expect(screen.getByText('Praise Norris')).toBeInTheDocument();
    });
  });

  it('open and closes delete pledge modal', async () => {
    renderMyPledges(link1);

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

  it('open and closes update pledge modal', async () => {
    renderMyPledges(link1);

    const editPledgeBtn = await screen.findAllByTestId('editPledgeBtn');
    await waitFor(() => expect(editPledgeBtn[0]).toBeInTheDocument());
    await userEvent.click(editPledgeBtn[0]);

    await waitFor(() =>
      expect(screen.getByText(translations.editPledge)).toBeInTheDocument(),
    );
    await userEvent.click(screen.getByTestId('pledgeModalCloseBtn'));
    await waitFor(() =>
      expect(screen.queryByTestId('pledgeModalCloseBtn')).toBeNull(),
    );
  });

  it('should render the Campaign Pledge screen with error', async () => {
    renderMyPledges(link2);
    await waitFor(() => {
      expect(screen.getByTestId('errorMsg')).toBeInTheDocument();
    });
  });

  it('renders the empty pledge component', async () => {
    renderMyPledges(link3);
    await waitFor(() =>
      expect(screen.getByText(translations.noPledges)).toBeInTheDocument(),
    );
  });
});
