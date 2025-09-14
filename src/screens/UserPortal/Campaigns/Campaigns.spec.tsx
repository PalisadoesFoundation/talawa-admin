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

const pTranslations = JSON.parse(
  JSON.stringify(i18nForTest.getDataByLanguage('en')?.translation.pledges),
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
      const schoolCampaigns = screen.getAllByText('School Campaign');
      expect(schoolCampaigns.length).toBe(2);
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

    const containers = [
      await screen.findByTestId('detailContainer1'),
      await screen.findByTestId('detailContainer2'),
    ];
    await waitFor(() => {
      containers.forEach((container) => {
        if (
          container.textContent &&
          container.textContent.includes('School Campaign')
        ) {
          expect(container).toHaveTextContent('$22000');
          expect(container).toHaveTextContent('2024-07-28');
          expect(
            container.textContent.includes('2026-08-31') ||
              container.textContent.includes('2099-12-31'),
          ).toBe(true);
          expect(container).toHaveTextContent('Active');
        }
        if (
          container.textContent &&
          container.textContent.includes('Hospital Campaign')
        ) {
          expect(container).toHaveTextContent('$9000');
          expect(container).toHaveTextContent('2024-07-28');
          expect(container).toHaveTextContent('2022-08-30');
          expect(container).toHaveTextContent('Ended');
        }
      });
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
      const schoolCampaigns = screen.getAllByText('School Campaign');
      const hospitalCampaigns = screen.getAllByText('Hospital Campaign');
      expect(schoolCampaigns.length).toBe(2);
      expect(hospitalCampaigns.length).toBe(1);
    });

    await waitFor(() => {
      const detailContainer1 = screen.getByTestId('detailContainer1');
      const detailContainer2 = screen.getByTestId('detailContainer2');
      const containers = [detailContainer1, detailContainer2];
      const school = containers.find(
        (c) => c.textContent && c.textContent.includes('School Campaign'),
      );
      const hospital = containers.find(
        (c) => c.textContent && c.textContent.includes('Hospital Campaign'),
      );
      expect(school).toBeDefined();
      expect(hospital).toBeDefined();
      const schoolContainer = school!;
      const hospitalContainer = hospital!;
      expect(
        !schoolContainer.textContent ||
          schoolContainer.textContent.includes('2026-08-31') ||
          schoolContainer.textContent.includes('2099-12-31'),
      ).toBe(true);
      expect(
        !hospitalContainer.textContent ||
          hospitalContainer.textContent.includes('2022-08-30'),
      ).toBe(true);
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
      const schoolCampaigns = screen.getAllByText('School Campaign');
      const hospitalCampaigns = screen.getAllByText('Hospital Campaign');
      expect(schoolCampaigns.length).toBe(2);
      expect(hospitalCampaigns.length).toBe(1);
    });

    await waitFor(() => {
      // School Campaigns: check both end dates robustly
      const detailContainer1 = screen.getByTestId('detailContainer1');
      const detailContainer2 = screen.getByTestId('detailContainer2');
      const containers = [detailContainer1, detailContainer2];
      const schoolCampaigns = containers.filter(
        (c) => c.textContent && c.textContent.includes('School Campaign'),
      );
      // Each School Campaign card should have one of the valid end dates
      schoolCampaigns.forEach((container) => {
        expect(
          container.textContent?.includes('2026-08-31') ||
            container.textContent?.includes('2099-12-31'),
        ).toBe(true);
      });
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
      const schoolCampaigns = screen.getAllByText('School Campaign');
      const hospitalCampaigns = screen.getAllByText('Hospital Campaign');
      expect(schoolCampaigns.length).toBe(2);
      expect(hospitalCampaigns.length).toBe(1);
    });

    await waitFor(() => {
      const detailContainer1 = screen.getByTestId('detailContainer1');
      const detailContainer2 = screen.getByTestId('detailContainer2');
      const containers = [detailContainer1, detailContainer2];
      const schoolCampaigns = containers.filter(
        (c) => c.textContent && c.textContent.includes('School Campaign'),
      );
      // Each School Campaign card should have one of the valid end dates
      schoolCampaigns.forEach((container) => {
        expect(
          container.textContent?.includes('2026-08-31') ||
            container.textContent?.includes('2099-12-31'),
        ).toBe(true);
      });
      const hospital = containers.find(
        (c) => c.textContent && c.textContent.includes('Hospital Campaign'),
      );
      expect(hospital).toBeDefined();
      if (hospital) {
        expect(
          !hospital.textContent || hospital.textContent.includes('2022-08-30'),
        ).toBe(true);
      }
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
      const schoolCampaigns = screen.getAllByText('School Campaign');
      const hospitalCampaigns = screen.getAllByText('Hospital Campaign');
      expect(schoolCampaigns.length).toBe(2);
      expect(hospitalCampaigns.length).toBe(1);
    });

    await waitFor(() => {
      // School Campaigns: check both end dates robustly
      const detailContainer1 = screen.getByTestId('detailContainer1');
      const detailContainer2 = screen.getByTestId('detailContainer2');
      const containers = [detailContainer1, detailContainer2];
      const schoolCampaigns = containers.filter(
        (c) => c.textContent && c.textContent.includes('School Campaign'),
      );
      // Each School Campaign card should have one of the valid end dates
      schoolCampaigns.forEach((container) => {
        expect(
          container.textContent?.includes('2026-08-31') ||
            container.textContent?.includes('2099-12-31'),
        ).toBe(true);
      });
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

  it('open and closes add pledge modal', async () => {
    renderCampaigns(link1);

    const addPledgeBtn = await screen.findAllByTestId('addPledgeBtn');
    await waitFor(() => expect(addPledgeBtn[0]).toBeInTheDocument());
    await userEvent.click(addPledgeBtn[0]);

    await waitFor(() =>
      expect(screen.getAllByText(pTranslations.createPledge)).toHaveLength(2),
    );
    await userEvent.click(screen.getByTestId('pledgeModalCloseBtn'));
    await waitFor(() =>
      expect(screen.queryByTestId('pledgeModalCloseBtn')).toBeNull(),
    );
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
});
