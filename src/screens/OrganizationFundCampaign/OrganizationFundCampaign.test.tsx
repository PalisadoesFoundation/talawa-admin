import { MockedProvider } from '@apollo/react-testing';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import dayjs from 'dayjs';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import OrganizaitionFundCampiagn from './OrganizationFundCampagins';
import { store } from '../../state/store';
import { StaticMockLink } from '../../utils/StaticMockLink';
import i18nForTest from '../../utils/i18nForTest';
import {
  MOCKS,
  MOCKS_ERROR_CREATE_CAMPAIGN,
  MOCKS_ERROR_DELETE_CAMPAIGN,
  MOCKS_ERROR_UPDATE_CAMPAIGN,
  MOCK_FUND_CAMPAIGN_ERROR,
} from './OrganizationFundCampaignMocks';
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
async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}
const link1 = new StaticMockLink(MOCKS, true);
const link2 = new StaticMockLink(MOCK_FUND_CAMPAIGN_ERROR, true);
const link3 = new StaticMockLink(MOCKS_ERROR_CREATE_CAMPAIGN, true);
const link4 = new StaticMockLink(MOCKS_ERROR_UPDATE_CAMPAIGN, true);
const link5 = new StaticMockLink(MOCKS_ERROR_DELETE_CAMPAIGN, true);

const translations = JSON.parse(
  JSON.stringify(i18nForTest.getDataByLanguage('en')?.translation.fundCampaign),
);

describe('Testing FundCampaigns Screen', () => {
  const formData = {
    campaignName: 'Campaign 1',
    campaignCurrency: 'USD',
    campaignGoal: 100,
    campaignStartDate: dayjs(new Date()).format('YYYY-MM-DD'),
    campaignEndDate: dayjs(new Date()).format('YYYY-MM-DD'),
  };

  it('loads the Fund Campaigns screen', async () => {
    const { getByText } = render(
      <MockedProvider addTypename={false} link={link1}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              {<OrganizaitionFundCampiagn />}
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );
    await wait();
    await waitFor(() => {
      expect(getByText(translations.addCampaign)).toBeInTheDocument();
    });
  });
  it('renders the campaign screen with error', async () => {
    const { queryByText } = render(
      <MockedProvider addTypename={false} link={link2}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              {<OrganizaitionFundCampiagn />}
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );
    await wait();
    await waitFor(() => {
      expect(queryByText(translations.addCampaign)).not.toBeInTheDocument();
    });
  });
  it('renders the Error Component', async () => {
    render(
      <MockedProvider addTypename={false} link={link2}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              {<OrganizaitionFundCampiagn />}
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );
    await wait();
    await waitFor(() => {
      expect(screen.getByTestId('errorMsg')).toBeInTheDocument();
    });
  });
  it("opens and closes the 'Create Campaign' modal", async () => {
    render(
      <MockedProvider addTypename={false} link={link1}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                {<OrganizaitionFundCampiagn />}
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );
    await wait();
    await waitFor(() =>
      expect(screen.getByTestId('addCampaignBtn')).toBeInTheDocument(),
    );
    userEvent.click(screen.getByTestId('addCampaignBtn'));
    await waitFor(() => {
      return expect(
        screen.findByTestId('createCampaignCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('createCampaignCloseBtn'));
    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('createCampaignCloseBtn'),
    );
  });
  it('creates a new Campaign', async () => {
    render(
      <MockedProvider addTypename={false} link={link1}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                {<OrganizaitionFundCampiagn />}
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );
    await wait();
    await waitFor(() =>
      expect(screen.getByTestId('addCampaignBtn')).toBeInTheDocument(),
    );
    userEvent.click(screen.getByTestId('addCampaignBtn'));
    await waitFor(() => {
      return expect(
        screen.findByTestId('createCampaignCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    userEvent.type(
      screen.getByPlaceholderText('Enter Campaign Name'),
      formData.campaignName,
    );
    userEvent.type(
      screen.getByPlaceholderText('Enter Funding Goal'),
      formData.campaignGoal.toString(),
    );
    userEvent.click(screen.getByLabelText('Start Date'));
    userEvent.click(screen.getByLabelText('End Date'));
    userEvent.click(screen.getByTestId('createCampaignBtn'));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(translations.createdCampaign);
    });
  });
  it('toast an error on unsuccessful campaign creation', async () => {
    render(
      <MockedProvider addTypename={false} link={link3}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                {<OrganizaitionFundCampiagn />}
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );
    await wait();
    await waitFor(() =>
      expect(screen.getByTestId('addCampaignBtn')).toBeInTheDocument(),
    );
    userEvent.click(screen.getByTestId('addCampaignBtn'));
    await waitFor(() => {
      return expect(
        screen.findByTestId('createCampaignCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    userEvent.type(
      screen.getByPlaceholderText('Enter Campaign Name'),
      formData.campaignName,
    );
    userEvent.type(
      screen.getByPlaceholderText('Enter Funding Goal'),
      formData.campaignGoal.toString(),
    );
    userEvent.click(screen.getByLabelText('Start Date'));
    userEvent.click(screen.getByLabelText('End Date'));
    userEvent.click(screen.getByTestId('createCampaignBtn'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });
  it('opens and closes the Edit Campaign modal', async () => {
    render(
      <MockedProvider addTypename={false} link={link1}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                {<OrganizaitionFundCampiagn />}
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );
    await wait();
    await waitFor(() =>
      expect(screen.getAllByTestId('editCampaignBtn')[0]).toBeInTheDocument(),
    );
    userEvent.click(screen.getAllByTestId('editCampaignBtn')[0]);
    await waitFor(() => {
      return expect(
        screen.findByTestId('editCampaignCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('editCampaignCloseBtn'));
    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('editCampaignCloseBtn'),
    );
  });
  it("updates the Campaign's details", async () => {
    render(
      <MockedProvider addTypename={false} link={link1}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                {<OrganizaitionFundCampiagn />}
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );
    await wait();
    await waitFor(() =>
      expect(screen.getAllByTestId('editCampaignBtn')[0]).toBeInTheDocument(),
    );
    userEvent.click(screen.getAllByTestId('editCampaignBtn')[0]);
    await waitFor(() => {
      return expect(
        screen.findByTestId('editCampaignCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    userEvent.type(
      screen.getByPlaceholderText('Enter Campaign Name'),
      formData.campaignName,
    );

    userEvent.click(screen.getByTestId('editCampaignSubmitBtn'));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(translations.updatedCampaign);
    });
  });
  it('toast an error on unsuccessful campaign update', async () => {
    render(
      <MockedProvider addTypename={false} link={link4}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                {<OrganizaitionFundCampiagn />}
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );
    await wait();
    await waitFor(() =>
      expect(screen.getAllByTestId('editCampaignBtn')[0]).toBeInTheDocument(),
    );
    userEvent.click(screen.getAllByTestId('editCampaignBtn')[0]);
    await waitFor(() => {
      return expect(
        screen.findByTestId('editCampaignCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    userEvent.type(
      screen.getByPlaceholderText('Enter Campaign Name'),
      formData.campaignName,
    );

    userEvent.click(screen.getByTestId('editCampaignSubmitBtn'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });
  it("opens and closes the 'Delete Campaign' modal", async () => {
    render(
      <MockedProvider addTypename={false} link={link1}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                {<OrganizaitionFundCampiagn />}
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );
    await wait();
    await waitFor(() =>
      expect(screen.getAllByTestId('deleteCampaignBtn')[0]).toBeInTheDocument(),
    );
    userEvent.click(screen.getAllByTestId('deleteCampaignBtn')[0]);
    await waitFor(() => {
      return expect(
        screen.findByTestId('deleteCampaignCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('deleteCampaignCloseBtn'));
    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('deleteCampaignCloseBtn'),
    );
  });
  it('deletes a Campaign', async () => {
    render(
      <MockedProvider addTypename={false} link={link1}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                {<OrganizaitionFundCampiagn />}
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );
    await wait();
    await waitFor(() =>
      expect(screen.getAllByTestId('deleteCampaignBtn')[0]).toBeInTheDocument(),
    );
    userEvent.click(screen.getAllByTestId('deleteCampaignBtn')[0]);
    await waitFor(() => {
      return expect(
        screen.findByTestId('deleteCampaignCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('deleteyesbtn'));
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(translations.deletedCampaign);
    });
  });
  it('toast an error on unsuccessful campaign deletion', async () => {
    render(
      <MockedProvider addTypename={false} link={link5}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                {<OrganizaitionFundCampiagn />}
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );
    await wait();
    await waitFor(() =>
      expect(screen.getAllByTestId('deleteCampaignBtn')[0]).toBeInTheDocument(),
    );
    userEvent.click(screen.getAllByTestId('deleteCampaignBtn')[0]);
    await waitFor(() => {
      return expect(
        screen.findByTestId('deleteCampaignCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('deleteyesbtn'));
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });
});
