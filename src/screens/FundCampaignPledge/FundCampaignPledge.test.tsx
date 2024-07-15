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
import i18nForTest from '../../utils/i18nForTest';
import FundCampaignPledge from './FundCampaignPledge';
import {
  EMPTY_MOCKS,
  MOCKS,
  MOCKS_FUND_CAMPAIGN_PLEDGE_ERROR,
} from './PledgesMocks';
import React from 'react';
import type { ApolloLink } from '@apollo/client';

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

const link1 = new StaticMockLink(MOCKS);
const link2 = new StaticMockLink(MOCKS_FUND_CAMPAIGN_PLEDGE_ERROR);
const link3 = new StaticMockLink(EMPTY_MOCKS);
const translations = JSON.parse(
  JSON.stringify(i18nForTest.getDataByLanguage('en')?.translation.pledges),
);

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
  beforeAll(() => {
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useParams: () => ({ orgId: 'orgId', fundCampaignId: 'fundCampaignId' }),
    }));
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('should render the Campaign Pledge screen', async () => {
    renderFundCampaignPledge(link1);
    await waitFor(() => {
      expect(screen.getByTestId('searchVolunteer')).toBeInTheDocument();
    });
  });

  it('should redirect to fallback URL if URL params are undefined', async () => {
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

  it('open and closes Create Pledge modal', async () => {
    renderFundCampaignPledge(link1);

    const addPledgeBtn = await screen.findByTestId('addPledgeBtn');
    expect(addPledgeBtn).toBeInTheDocument();
    userEvent.click(addPledgeBtn);

    await waitFor(() =>
      expect(screen.getAllByText(translations.createPledge)).toHaveLength(2),
    );
    userEvent.click(screen.getByTestId('pledgeModalCloseBtn'));
    await waitFor(() =>
      expect(screen.queryByTestId('pledgeModalCloseBtn')).toBeNull(),
    );
  });

  it('open and closes update pledge modal', async () => {
    renderFundCampaignPledge(link1);

    const editPledgeBtn = await screen.findAllByTestId('editPledgeBtn');
    await waitFor(() => expect(editPledgeBtn[0]).toBeInTheDocument());
    userEvent.click(editPledgeBtn[0]);

    await waitFor(() =>
      expect(screen.getByText(translations.editPledge)).toBeInTheDocument(),
    );
    userEvent.click(screen.getByTestId('pledgeModalCloseBtn'));
    await waitFor(() =>
      expect(screen.queryByTestId('pledgeModalCloseBtn')).toBeNull(),
    );
  });

  it('open and closes delete pledge modal', async () => {
    renderFundCampaignPledge(link1);

    const deletePledgeBtn = await screen.findAllByTestId('deletePledgeBtn');
    await waitFor(() => expect(deletePledgeBtn[0]).toBeInTheDocument());
    userEvent.click(deletePledgeBtn[0]);

    await waitFor(() =>
      expect(screen.getByText(translations.deletePledge)).toBeInTheDocument(),
    );
    userEvent.click(screen.getByTestId('deletePledgeCloseBtn'));
    await waitFor(() =>
      expect(screen.queryByTestId('deletePledgeCloseBtn')).toBeNull(),
    );
  });

  it('Search the Pledges list by Users', async () => {
    renderFundCampaignPledge(link1);
    const searchVolunteer = await screen.findByTestId('searchVolunteer');
    fireEvent.change(searchVolunteer, {
      target: { value: 'John' },
    });

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByText('Jane Doe')).toBeNull();
    });
  });

  it('should render the Campaign Pledge screen with error', async () => {
    renderFundCampaignPledge(link2);
    await waitFor(() => {
      expect(screen.getByTestId('errorMsg')).toBeInTheDocument();
    });
  });

  it('renders the empty pledge component', async () => {
    renderFundCampaignPledge(link3);
    await waitFor(() =>
      expect(screen.getByText(translations.noPledges)).toBeInTheDocument(),
    );
  });

  it('Sort the Pledges list by Lowest Amount', async () => {
    renderFundCampaignPledge(link1);

    const searchVolunteer = await screen.findByTestId('searchVolunteer');
    expect(searchVolunteer).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('filter'));
    fireEvent.click(screen.getByTestId('amount_ASC'));

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByText('Jane Doe')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getAllByTestId('amountCell')[0]).toHaveTextContent('100');
    });
  });

  it('Sort the Pledges list by Highest Amount', async () => {
    renderFundCampaignPledge(link1);

    const searchVolunteer = await screen.findByTestId('searchVolunteer');
    expect(searchVolunteer).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('filter'));
    fireEvent.click(screen.getByTestId('amount_DESC'));

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByText('Jane Doe')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getAllByTestId('amountCell')[0]).toHaveTextContent('200');
    });
  });

  it('Sort the Pledges list by latest endDate', async () => {
    renderFundCampaignPledge(link1);

    const searchVolunteer = await screen.findByTestId('searchVolunteer');
    expect(searchVolunteer).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('filter'));
    fireEvent.click(screen.getByTestId('endDate_DESC'));

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByText('Jane Doe')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getAllByTestId('amountCell')[0]).toHaveTextContent('100');
    });
  });

  it('Sort the Pledges list by earliest endDate', async () => {
    renderFundCampaignPledge(link1);

    const searchVolunteer = await screen.findByTestId('searchVolunteer');
    expect(searchVolunteer).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('filter'));
    fireEvent.click(screen.getByTestId('endDate_ASC'));

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByText('Jane Doe')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getAllByTestId('amountCell')[0]).toHaveTextContent('200');
    });
  });

  it('check if user image renders', async () => {
    renderFundCampaignPledge(link1);
    await waitFor(() => {
      expect(screen.getByTestId('searchVolunteer')).toBeInTheDocument();
    });

    const image = await screen.findByAltText('volunteer');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'img-url');
  });
});
