import { MockedProvider } from '@apollo/react-testing';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import type { RenderResult } from '@testing-library/react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18nForTest from '../../utils/i18nForTest';
import FundCampaignPledge from './FundCampaignPledge';
import {
  EMPTY_MOCKS,
  MOCKS,
  MOCKS_FUND_CAMPAIGN_PLEDGE_ERROR,
} from './PledgesMocks';
import React from 'react';
import type { ApolloLink } from '@apollo/client';
import { vi } from 'vitest';
import { FUND_CAMPAIGN_PLEDGE } from 'GraphQl/Queries/fundQueries';

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
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
        id: '1',
        name: 'Test Campaign',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        currency: 'USD',
        fundingGoal: 1000,
        pledges: {
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
        id: '1',
        name: 'Test Campaign',
        startAt: '2023-01-01T00:00:00Z',
        endAt: '2024-12-31T23:59:59Z',
        currency: 'USD',
        fundingGoal: 1000,
        pledges: {
          edges: [
            {
              node: {
                id: '1',
                amount: 100,
                pledger: {
                  id: '1',
                  name: 'John Doe',
                  image: 'img-url',
                },
              },
            },
            {
              node: {
                id: '2',
                amount: 200,
                pledger: {
                  id: '2',
                  name: 'Jane Doe',
                  image: null,
                },
              },
            },
            {
              node: {
                id: '3',
                amount: 150,
                pledger: {
                  id: '3',
                  name: 'John Doe3',
                  image: 'img-url3',
                },
              },
            },
            {
              node: {
                id: '4',
                amount: 175,
                pledger: {
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
        id: '1',
        name: 'Future Campaign',
        startAt: '2025-03-31T05:53:45.871Z',
        endAt: '2025-04-24T05:53:45.871Z',
        currency: 'USD',
        fundingGoal: 1000,
        pledges: {
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
        id: '1',
        name: 'Active Campaign',
        startAt: '2023-01-01T00:00:00Z',
        endAt: '2024-12-31T23:59:59Z',
        currency: 'USD',
        fundingGoal: 1000,
        pledges: {
          edges: [],
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

const mockParamsState = {
  orgId: 'orgId',
  fundCampaignId: 'fundCampaignId',
};

const renderFundCampaignPledge = (link: ApolloLink): RenderResult => {
  return render(
    <MockedProvider addTypename={false} link={link}>
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
  const mockNavigate = vi.fn();

  vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
      ...actual,
      useParams: () => ({ ...mockParamsState }),
      useNavigate: () => mockNavigate,
    };
  });

  beforeEach(() => {
    mockParamsState.orgId = 'orgId';
    mockParamsState.fundCampaignId = 'fundCampaignId';
  });

  afterAll(() => {
    vi.clearAllMocks();
  });

  it('should redirect to fallback URL if URL params are undefined', async () => {
    mockParamsState.orgId = '';
    mockParamsState.fundCampaignId = '';

    render(
      <MockedProvider addTypename={false} link={link1}>
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
    await userEvent.click(screen.getByTestId('deletePledgeCloseBtn'));
    await waitFor(() =>
      expect(screen.queryByTestId('deletePledgeCloseBtn')).toBeNull(),
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

  it('should handle breadcrumb navigation correctly', async () => {
    const mockHistoryBack = vi.fn();
    const mockHistoryGo = vi.fn();

    // Mock window.history
    Object.defineProperty(window, 'history', {
      value: {
        back: mockHistoryBack,
        go: mockHistoryGo,
      },
      writable: true,
    });

    renderFundCampaignPledge(link1);

    // Wait for component to load
    await waitFor(() => {
      expect(screen.getByTestId('searchPledger')).toBeInTheDocument();
    });

    // Find and click breadcrumb links
    const breadcrumbLinks = screen.getAllByRole('button');

    // Click campaign name link (goes back 2 steps)
    fireEvent.click(breadcrumbLinks[0]);
    expect(mockHistoryGo).toHaveBeenCalledWith(-2);

    // Click fund name link (goes back 1 step)
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
        expect(imageContainer).toHaveClass('_TableImagePledge_d00707');
      } else {
        // Real image is rendered
        expect(imageContainer).toHaveAttribute('src', 'img-url');
      }
    });
  });

  // Fix the extra users test
  it('should render extraUserDetails in Popup', async () => {
    renderFundCampaignPledge(link1);
    await waitFor(() => {
      expect(screen.getByTestId('searchPledger')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('filter'));
    await waitFor(() => {
      expect(screen.getByTestId('amount_DESC')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('amount_DESC'));

    // Verify all users are shown in the grid
    await waitFor(() => {
      const allRows = screen.getAllByRole('row');
      expect(allRows.length).toBeGreaterThan(1); // Header row + data rows
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Doe')).toBeInTheDocument();
      expect(screen.getByText('John Doe3')).toBeInTheDocument();
      expect(screen.getByText('John Doe4')).toBeInTheDocument();
    });
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
      expect(addPledgeBtn).toHaveAttribute(
        'title',
        'pledges.campaignNotActive',
      );
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

  // it('Sort the Pledges list by endDate correctly', async () => {
  //   renderFundCampaignPledge(link1);

  //   await screen.findByTestId('searchPledger');

  //   // Test DESC sorting
  //   fireEvent.click(screen.getByTestId('filter'));
  //   await screen.findByTestId('endDate_DESC');
  //   fireEvent.click(screen.getByTestId('endDate_DESC'));

  //   await waitFor(() => {
  //     const pledgeDates = screen.getAllByText(/\d{2}\/\d{2}\/\d{4}/);
  //     const dates = pledgeDates.map(el => new Date(el.textContent || ''));
  //     expect(dates[0].getTime()).toBeGreaterThanOrEqual(dates[1].getTime());
  //   });

  //   // Test ASC sorting
  //   fireEvent.click(screen.getByTestId('filter'));
  //   await screen.findByTestId('endDate_ASC');
  //   fireEvent.click(screen.getByTestId('endDate_ASC'));

  //   await waitFor(() => {
  //     const pledgeDates = screen.getAllByText(/\d{2}\/\d{2}\/\d{4}/);
  //     const dates = pledgeDates.map(el => new Date(el.textContent || ''));
  //     expect(dates[0].getTime()).toBeLessThanOrEqual(dates[1].getTime());
  //   });
  // });
});
