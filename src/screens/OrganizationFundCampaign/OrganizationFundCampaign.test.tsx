import { MockedProvider } from '@apollo/react-testing';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import { store } from '../../state/store';
import { StaticMockLink } from '../../utils/StaticMockLink';
import i18nForTest from '../../utils/i18nForTest';
import OrganizaitionFundCampiagn from './OrganizationFundCampagins';
import {
  EMPTY_MOCKS,
  MOCKS,
  MOCKS_ERROR_CREATE_CAMPAIGN,
  MOCKS_ERROR_DELETE_CAMPAIGN,
  MOCKS_ERROR_UPDATE_CAMPAIGN,
  MOCK_FUND_CAMPAIGN_ERROR,
} from './OrganizationFundCampaignMocks';
import React from 'react';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));
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
const link6 = new StaticMockLink(EMPTY_MOCKS, true);

const translations = JSON.parse(
  JSON.stringify(i18nForTest.getDataByLanguage('en')?.translation.fundCampaign),
);

describe('Testing FundCampaigns Screen', () => {
  const formData = {
    campaignName: 'Campaign 1',
    campaignCurrency: 'USD',
    campaignGoal: 100,
    campaignStartDate: '03/10/2024',
    campaignEndDate: '03/10/2024',
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
    const currency = screen.getByTestId('currencySelect');
    fireEvent.change(currency, {
      target: { value: formData.campaignCurrency },
    });
    const startDate = screen.getByLabelText('Start Date');
    const endDate = screen.getByLabelText('End Date');
    fireEvent.change(startDate, {
      target: { value: formData.campaignStartDate },
    });
    fireEvent.change(endDate, {
      target: { value: formData.campaignEndDate },
    });

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
    const endDateDatePicker = screen.getByLabelText('End Date');
    const startDateDatePicker = screen.getByLabelText('Start Date');

    fireEvent.change(endDateDatePicker, {
      target: { value: formData.campaignEndDate },
    });
    fireEvent.change(startDateDatePicker, {
      target: { value: formData.campaignStartDate },
    });

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
    const campaignName = screen.getByPlaceholderText('Enter Campaign Name');
    fireEvent.change(campaignName, {
      target: { value: 'Campaign 4' },
    });
    const fundingGoal = screen.getByPlaceholderText('Enter Funding Goal');
    fireEvent.change(fundingGoal, {
      target: { value: 1000 },
    });
    const currency = screen.getByTestId('currencySelect');
    fireEvent.change(currency, {
      target: { value: 'INR' },
    });
    const endDateDatePicker = screen.getByLabelText('End Date');
    const startDateDatePicker = screen.getByLabelText('Start Date');

    const endDate =
      formData.campaignEndDate < formData.campaignStartDate
        ? formData.campaignStartDate
        : formData.campaignEndDate;
    fireEvent.change(endDateDatePicker, {
      target: { value: endDate },
    });

    fireEvent.change(startDateDatePicker, {
      target: { value: formData.campaignStartDate },
    });

    userEvent.click(screen.getByTestId('editCampaignSubmitBtn'));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(translations.updatedCampaign);
    });
  });

  it("updates the Campaign's details when date is null", async () => {
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
    const endDateDatePicker = screen.getByLabelText('End Date');
    const startDateDatePicker = screen.getByLabelText('Start Date');

    fireEvent.change(endDateDatePicker, {
      target: { value: null },
    });

    fireEvent.change(startDateDatePicker, {
      target: { value: null },
    });

    expect(startDateDatePicker.getAttribute('value')).toBe('');
    expect(endDateDatePicker.getAttribute('value')).toBe('');
  });

  it("updates the Campaign's details when endDate is less than  date", async () => {
    const formData = {
      campaignName: 'Campaign 1',
      campaignCurrency: 'USD',
      campaignGoal: 100,
      campaignStartDate: '03/10/2024',
      campaignEndDate: '03/10/2023',
    };
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

    const endDateDatePicker = screen.getByLabelText('End Date');
    const startDateDatePicker = screen.getByLabelText('Start Date');

    fireEvent.change(endDateDatePicker, {
      target: { value: formData.campaignEndDate },
    });

    fireEvent.change(startDateDatePicker, {
      target: { value: formData.campaignStartDate },
    });
  });

  it("doesn't update when fund field has value less than or equal to 0", async () => {
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
    const fundingGoal = screen.getByPlaceholderText(
      'Enter Funding Goal',
    ) as HTMLInputElement;

    const initialValue = fundingGoal.value; //Vakue before updating

    fireEvent.change(fundingGoal, {
      target: { value: 0 },
    });

    expect(fundingGoal.value).toBe(initialValue); //Retains previous value
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
      expect(screen.getAllByTestId('editCampaignBtn')[0]).toBeInTheDocument(),
    );
    userEvent.click(screen.getAllByTestId('editCampaignBtn')[0]);
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
      expect(screen.getAllByTestId('editCampaignBtn')[0]).toBeInTheDocument(),
    );
    userEvent.click(screen.getAllByTestId('editCampaignBtn')[0]);
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
      expect(screen.getAllByTestId('editCampaignBtn')[0]).toBeInTheDocument(),
    );
    userEvent.click(screen.getAllByTestId('editCampaignBtn')[0]);
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
  it('renders the Empty Campaigns Component', async () => {
    render(
      <MockedProvider addTypename={false} link={link6}>
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
    await waitFor(() => {
      expect(screen.getByText(translations.noCampaigns)).toBeInTheDocument();
    });
  });
  it("redirects to 'FundCampaignPledge' screen", async () => {
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
      expect(screen.getAllByTestId('campaignName')[0]).toBeInTheDocument(),
    );
    userEvent.click(screen.getAllByTestId('campaignName')[0]);
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(
        '/fundCampaignPledge/undefined/1',
      );
    });
  });

  it('search funds by name', async () => {
    render(
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
    userEvent.type(screen.getByTestId('searchFullName'), 'Funndds');
    await wait();
    userEvent.click(screen.getByTestId('searchBtn'));
  });
});
