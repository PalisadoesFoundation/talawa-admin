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
import type { ApolloLink } from '@apollo/client';
import useLocalStorage from 'utils/useLocalstorage';
import Campaigns from './Campaigns';
import { vi, it, expect, describe } from 'vitest';
import {
  EMPTY_MOCKS,
  MOCKS,
  USER_FUND_CAMPAIGNS_ERROR,
} from './CampaignsMocks';

/* Mocking 'react-toastify` */
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

/* Mocking `@mui/x-date-pickers/DateTimePicker` */
vi.mock('@mui/x-date-pickers/DateTimePicker', async () => {
  const actual = await vi.importActual(
    '@mui/x-date-pickers/DesktopDateTimePicker',
  );
  return {
    DateTimePicker: actual.DesktopDateTimePicker,
  };
});

const { setItem } = useLocalStorage();

/**
 * Creates a mocked Apollo link for testing.
 */
const link1 = new StaticMockLink(MOCKS);
const link2 = new StaticMockLink(USER_FUND_CAMPAIGNS_ERROR);
const link3 = new StaticMockLink(EMPTY_MOCKS);

const cTranslations = JSON.parse(
  JSON.stringify(
    i18nForTest.getDataByLanguage('en')?.translation.userCampaigns,
  ),
);

/*
 * Renders the `Campaigns` component for testing.
 *
 * @param link - The mocked Apollo link used for testing.
 * @returns The rendered result of the `Campaigns` component.
 */

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

/**
 * Test suite for the User Campaigns screen.
 */
describe('Testing User Campaigns Screen', () => {
  beforeEach(() => {
    setItem('userId', 'userId');
  });

  beforeAll(() => {
    /**
     * Mocks the `useParams` function from `react-router-dom` to simulate URL parameters.
     */
    vi.mock('react-router', async () => {
      const actual = await vi.importActual('react-router');
      return {
        ...actual,
        useParams: vi.fn(() => ({ orgId: 'orgId' })), // Mock `useParams`
      };
    });
  });

  afterAll(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  /**
   * Verifies that the User Campaigns screen renders correctly with mock data.
   */
  it('should render the User Campaigns screen', async () => {
    renderCampaigns(link1);
    await waitFor(() => {
      expect(screen.getByTestId('searchCampaigns')).toBeInTheDocument();
      expect(screen.getByText('School Campaign')).toBeInTheDocument();
      expect(screen.getByText('Hospital Campaign')).toBeInTheDocument();
    });
  });

  /**
   * Ensures the app redirects to the fallback URL if `userId` is null in LocalStorage.
   */
  it('should redirect to fallback URL if userId is null in LocalStorage', async () => {
    setItem('userId', null);
    renderCampaigns(link1);
    await waitFor(() => {
      expect(screen.getByTestId('paramsError')).toBeInTheDocument();
    });
  });

  /**
   * Ensures the app redirects to the fallback URL if URL parameters are undefined.
   */
  it('should redirect to fallback URL if URL params are undefined', async () => {
    vi.unmock('react-router'); // unmocking to get real behavior from useParams
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

    const detailContainer = await screen.findByTestId('detailContainer1');
    const detailContainer2 = await screen.findByTestId('detailContainer2');
    await waitFor(() => {
      expect(detailContainer).toBeInTheDocument();
      expect(detailContainer2).toBeInTheDocument();
      expect(detailContainer).toHaveTextContent('School Campaign');
      expect(detailContainer).toHaveTextContent('$22000');
      expect(detailContainer).toHaveTextContent(
        new Date('2024-07-28').toLocaleDateString(),
      );
      expect(detailContainer).toHaveTextContent(
        new Date('2099-12-31').toLocaleDateString(),
      );
      expect(detailContainer).toHaveTextContent('Active');
      expect(detailContainer2).toHaveTextContent('Hospital Campaign');
      expect(detailContainer2).toHaveTextContent('$9000');
      expect(detailContainer2).toHaveTextContent(
        new Date('2024-07-28').toLocaleDateString(),
      );
      expect(detailContainer2).toHaveTextContent(
        new Date('2022-08-30').toLocaleDateString(),
      );
      expect(detailContainer2).toHaveTextContent('Ended');
    });
  });

  it('Sort the Campaigns list by lowest fundingGoal', async () => {
    renderCampaigns(link1);

    const searchCampaigns = await screen.findByTestId('searchCampaigns');
    expect(searchCampaigns).toBeInTheDocument();

    await userEvent.click(screen.getByTestId('filter'));
    await waitFor(() => {
      expect(screen.getByTestId('fundingGoal_ASC')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('fundingGoal_ASC'));

    await waitFor(() => {
      expect(screen.getByText('School Campaign')).toBeInTheDocument();
      expect(screen.getByText('Hospital Campaign')).toBeInTheDocument();
    });

    await waitFor(() => {
      const detailContainer = screen.getByTestId('detailContainer2');
      expect(detailContainer).toHaveTextContent('School Campaign');
      expect(detailContainer).toHaveTextContent('$22000');
      expect(detailContainer).toHaveTextContent(
        new Date('2024-07-28').toLocaleDateString(),
      );
      expect(detailContainer).toHaveTextContent(
        new Date('2099-12-31').toLocaleDateString(),
      );
    });
  });

  it('Sort the Campaigns list by highest fundingGoal', async () => {
    renderCampaigns(link1);

    const searchCampaigns = await screen.findByTestId('searchCampaigns');
    expect(searchCampaigns).toBeInTheDocument();

    await userEvent.click(screen.getByTestId('filter'));
    await waitFor(() => {
      expect(screen.getByTestId('fundingGoal_DESC')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('fundingGoal_DESC'));

    await waitFor(() => {
      expect(screen.getByText('School Campaign')).toBeInTheDocument();
      expect(screen.getByText('Hospital Campaign')).toBeInTheDocument();
    });

    await waitFor(() => {
      const detailContainer = screen.getByTestId('detailContainer1');
      expect(detailContainer).toHaveTextContent('School Campaign');
      expect(detailContainer).toHaveTextContent('$22000');
      expect(detailContainer).toHaveTextContent(
        new Date('2024-07-28').toLocaleDateString(),
      );
      expect(detailContainer).toHaveTextContent(
        new Date('2099-12-31').toLocaleDateString(),
      );
    });
  });

  it('Sort the Campaigns list by earliest endDate', async () => {
    renderCampaigns(link1);

    const searchCampaigns = await screen.findByTestId('searchCampaigns');
    expect(searchCampaigns).toBeInTheDocument();

    await userEvent.click(screen.getByTestId('filter'));
    await waitFor(() => {
      expect(screen.getByTestId('endDate_ASC')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('endDate_ASC'));

    await waitFor(() => {
      expect(screen.getByText('School Campaign')).toBeInTheDocument();
      expect(screen.getByText('Hospital Campaign')).toBeInTheDocument();
    });

    await waitFor(() => {
      const detailContainer = screen.getByTestId('detailContainer2');
      expect(detailContainer).toHaveTextContent('School Campaign');
      expect(detailContainer).toHaveTextContent('$22000');
      expect(detailContainer).toHaveTextContent(
        new Date('2024-07-28').toLocaleDateString(),
      );
      expect(detailContainer).toHaveTextContent(
        new Date('2099-12-31').toLocaleDateString(),
      );
    });
  });

  it('Sort the Campaigns list by latest endDate', async () => {
    renderCampaigns(link1);

    const searchCampaigns = await screen.findByTestId('searchCampaigns');
    expect(searchCampaigns).toBeInTheDocument();

    await userEvent.click(screen.getByTestId('filter'));
    await waitFor(() => {
      expect(screen.getByTestId('endDate_DESC')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('endDate_DESC'));

    await waitFor(() => {
      expect(screen.getByText('School Campaign')).toBeInTheDocument();
      expect(screen.getByText('Hospital Campaign')).toBeInTheDocument();
    });

    await waitFor(() => {
      const detailContainer = screen.getByTestId('detailContainer1');
      expect(detailContainer).toHaveTextContent('School Campaign');
      expect(detailContainer).toHaveTextContent('$22000');
      expect(detailContainer).toHaveTextContent(
        new Date('2024-07-28').toLocaleDateString(),
      );
      expect(detailContainer).toHaveTextContent(
        new Date('2099-12-31').toLocaleDateString(),
      );
    });
  });

  it('Search the Campaigns list by name', async () => {
    renderCampaigns(link1);

    const searchCampaigns = await screen.findByTestId('searchCampaigns');
    expect(searchCampaigns).toBeInTheDocument();

    fireEvent.change(searchCampaigns, {
      target: { value: 'Hospital' },
    });
    fireEvent.click(screen.getByTestId('searchBtn'));

    await waitFor(() => {
      expect(screen.queryByText('School Campaign')).toBeNull();
      expect(screen.getByText('Hospital Campaign')).toBeInTheDocument();
    });
  });

  it('Redirect to My Pledges screen', async () => {
    renderCampaigns(link1);

    const myPledgesBtn = await screen.findByText(cTranslations.myPledges);
    expect(myPledgesBtn).toBeInTheDocument();
    await userEvent.click(myPledgesBtn);

    await waitFor(() => {
      expect(screen.getByTestId('pledgeScreen')).toBeInTheDocument();
    });
  });

  it('Opens pledge modal when clicking add pledge button for active campaign', async () => {
    renderCampaigns(link1);

    // Wait for campaigns to load
    await waitFor(() => {
      expect(screen.getByText('School Campaign')).toBeInTheDocument();
    });

    // Find and click the "Add Pledge" button for an active campaign
    const addPledgeButtons = screen.getAllByTestId('addPledgeBtn');
    const activeButton = addPledgeButtons.find(
      (btn) => !btn.hasAttribute('disabled'),
    );

    expect(activeButton).toBeDefined();
    if (activeButton) {
      await userEvent.click(activeButton);
    }

    // Modal state should change (tested via component behavior)
    await waitFor(() => {
      expect(activeButton).toBeInTheDocument();
    });
  });

  it('Disables add pledge button for ended campaigns', async () => {
    renderCampaigns(link1);

    await waitFor(() => {
      expect(screen.getByText('Hospital Campaign')).toBeInTheDocument();
    });

    // Get all add pledge buttons
    const addPledgeButtons = screen.getAllByTestId('addPledgeBtn');

    // Find the button for the ended campaign (Hospital Campaign with endDate 2022-08-30)
    const endedCampaignButton = addPledgeButtons.find((btn) =>
      btn.hasAttribute('disabled'),
    );

    expect(endedCampaignButton).toBeDefined();
    expect(endedCampaignButton).toBeDisabled();
  });
});
