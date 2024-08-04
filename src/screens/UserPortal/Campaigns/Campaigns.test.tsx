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
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18nForTest from 'utils/i18nForTest';
import type { ApolloLink } from '@apollo/client';
import useLocalStorage from 'utils/useLocalstorage';
import Campaigns from './Campaigns';
import {
  EMPTY_MOCKS,
  MOCKS,
  USER_FUND_CAMPAIGNS_ERROR,
} from './CampaignsMocks';

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));
jest.mock('@mui/x-date-pickers/DateTimePicker', () => {
  return {
    DateTimePicker: jest.requireActual(
      '@mui/x-date-pickers/DesktopDateTimePicker',
    ).DesktopDateTimePicker,
  };
});
const { setItem } = useLocalStorage();

const link1 = new StaticMockLink(MOCKS);
const link2 = new StaticMockLink(USER_FUND_CAMPAIGNS_ERROR);
const link3 = new StaticMockLink(EMPTY_MOCKS);
const cTranslations = JSON.parse(
  JSON.stringify(
    i18nForTest.getDataByLanguage('en')?.translation.userCampaigns,
  ),
);
const pTranslations = JSON.parse(
  JSON.stringify(i18nForTest.getDataByLanguage('en')?.translation.pledges),
);

const renderCampaigns = (link: ApolloLink): RenderResult => {
  return render(
    <MockedProvider addTypename={false} link={link}>
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
  beforeEach(() => {
    setItem('userId', 'userId');
  });

  beforeAll(() => {
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useParams: () => ({ orgId: 'orgId' }),
    }));
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('should render the User Campaigns screen', async () => {
    renderCampaigns(link1);
    await waitFor(() => {
      expect(screen.getByTestId('searchCampaigns')).toBeInTheDocument();
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
    render(
      <MockedProvider addTypename={false} link={link1}>
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
    await waitFor(() =>
      expect(screen.getByText(cTranslations.noCampaigns)).toBeInTheDocument(),
    );
  });

  it('Check if All details are rendered correctly', async () => {
    renderCampaigns(link1);
    await waitFor(() => {
      const detailContainer = screen.getByTestId('detailContainer1');
      expect(detailContainer).toHaveTextContent('School Campaign');
      expect(detailContainer).toHaveTextContent('$22000');
      expect(detailContainer).toHaveTextContent('2024-07-28');
      expect(detailContainer).toHaveTextContent('2025-08-31');
      expect(detailContainer).toHaveTextContent('Active');
      const detailContainer2 = screen.getByTestId('detailContainer2');
      expect(detailContainer2).toHaveTextContent('Hospital Campaign');
      expect(detailContainer2).toHaveTextContent('$9000');
      expect(detailContainer2).toHaveTextContent('2024-07-28');
      expect(detailContainer2).toHaveTextContent('2022-08-30');
      expect(detailContainer2).toHaveTextContent('Ended');
    });
  });

  it('Sort the Campaigns list by lowest fundingGoal', async () => {
    renderCampaigns(link1);

    const searchCampaigns = await screen.findByTestId('searchCampaigns');
    expect(searchCampaigns).toBeInTheDocument();

    userEvent.click(screen.getByTestId('filter'));
    await waitFor(() => {
      expect(screen.getByTestId('fundingGoal_ASC')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('fundingGoal_ASC'));

    await waitFor(() => {
      expect(screen.getByText('School Campaign')).toBeInTheDocument();
      expect(screen.getByText('Hospital Campaign')).toBeInTheDocument();
    });

    await waitFor(() => {
      const detailContainer = screen.getByTestId('detailContainer2');
      expect(detailContainer).toHaveTextContent('School Campaign');
      expect(detailContainer).toHaveTextContent('$22000');
      expect(detailContainer).toHaveTextContent('2024-07-28');
      expect(detailContainer).toHaveTextContent('2024-08-31');
    });
  });

  it('Sort the Campaigns list by highest fundingGoal', async () => {
    renderCampaigns(link1);

    const searchCampaigns = await screen.findByTestId('searchCampaigns');
    expect(searchCampaigns).toBeInTheDocument();

    userEvent.click(screen.getByTestId('filter'));
    await waitFor(() => {
      expect(screen.getByTestId('fundingGoal_DESC')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('fundingGoal_DESC'));

    await waitFor(() => {
      expect(screen.getByText('School Campaign')).toBeInTheDocument();
      expect(screen.getByText('Hospital Campaign')).toBeInTheDocument();
    });

    await waitFor(() => {
      const detailContainer = screen.getByTestId('detailContainer1');
      expect(detailContainer).toHaveTextContent('School Campaign');
      expect(detailContainer).toHaveTextContent('$22000');
      expect(detailContainer).toHaveTextContent('2024-07-28');
      expect(detailContainer).toHaveTextContent('2024-08-31');
    });
  });

  it('Sort the Campaigns list by earliest endDate', async () => {
    renderCampaigns(link1);

    const searchCampaigns = await screen.findByTestId('searchCampaigns');
    expect(searchCampaigns).toBeInTheDocument();

    userEvent.click(screen.getByTestId('filter'));
    await waitFor(() => {
      expect(screen.getByTestId('endDate_ASC')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('endDate_ASC'));

    await waitFor(() => {
      expect(screen.getByText('School Campaign')).toBeInTheDocument();
      expect(screen.getByText('Hospital Campaign')).toBeInTheDocument();
    });

    await waitFor(() => {
      const detailContainer = screen.getByTestId('detailContainer2');
      expect(detailContainer).toHaveTextContent('School Campaign');
      expect(detailContainer).toHaveTextContent('$22000');
      expect(detailContainer).toHaveTextContent('2024-07-28');
      expect(detailContainer).toHaveTextContent('2024-08-31');
    });
  });

  it('Sort the Campaigns list by latest endDate', async () => {
    renderCampaigns(link1);

    const searchCampaigns = await screen.findByTestId('searchCampaigns');
    expect(searchCampaigns).toBeInTheDocument();

    userEvent.click(screen.getByTestId('filter'));
    await waitFor(() => {
      expect(screen.getByTestId('endDate_DESC')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('endDate_DESC'));

    await waitFor(() => {
      expect(screen.getByText('School Campaign')).toBeInTheDocument();
      expect(screen.getByText('Hospital Campaign')).toBeInTheDocument();
    });

    await waitFor(() => {
      const detailContainer = screen.getByTestId('detailContainer1');
      expect(detailContainer).toHaveTextContent('School Campaign');
      expect(detailContainer).toHaveTextContent('$22000');
      expect(detailContainer).toHaveTextContent('2024-07-28');
      expect(detailContainer).toHaveTextContent('2025-08-31');
    });
  });

  it('Search the Campaigns list by name', async () => {
    renderCampaigns(link1);

    const searchCampaigns = await screen.findByTestId('searchCampaigns');
    expect(searchCampaigns).toBeInTheDocument();

    fireEvent.change(searchCampaigns, {
      target: { value: 'Hospital' },
    });

    await waitFor(() => {
      expect(screen.queryByText('School Campaign')).toBeNull();
      expect(screen.getByText('Hospital Campaign')).toBeInTheDocument();
    });
  });

  it('Redirect to My Pledges screen', async () => {
    renderCampaigns(link1);

    const myPledgesBtn = await screen.findByText(cTranslations.myPledges);
    expect(myPledgesBtn).toBeInTheDocument();
    userEvent.click(myPledgesBtn);

    await waitFor(() => {
      expect(screen.getByTestId('pledgeScreen')).toBeInTheDocument();
    });
  });

  it('open and closes add pledge modal', async () => {
    renderCampaigns(link1);

    const addPledgeBtn = await screen.findAllByTestId('addPledgeBtn');
    await waitFor(() => expect(addPledgeBtn[0]).toBeInTheDocument());
    userEvent.click(addPledgeBtn[0]);

    await waitFor(() =>
      expect(screen.getAllByText(pTranslations.createPledge)).toHaveLength(2),
    );
    userEvent.click(screen.getByTestId('pledgeModalCloseBtn'));
    await waitFor(() =>
      expect(screen.queryByTestId('pledgeModalCloseBtn')).toBeNull(),
    );
  });
});
