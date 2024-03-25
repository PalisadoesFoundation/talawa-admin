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
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18nForTest from '../../utils/i18nForTest';
import FundCampaignPledge from './FundCampaignPledge';
import {
  EMPTY_MOCKS,
  MOCKS,
  MOCKS_CREATE_PLEDGE_ERROR,
  MOCKS_DELETE_PLEDGE_ERROR,
  MOCKS_FUND_CAMPAIGN_PLEDGE_ERROR,
  MOCKS_UPDATE_PLEDGE_ERROR,
} from './PledgesMocks';
import React from 'react';

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
const link1 = new StaticMockLink(MOCKS);
const link2 = new StaticMockLink(MOCKS_FUND_CAMPAIGN_PLEDGE_ERROR);
const link3 = new StaticMockLink(MOCKS_CREATE_PLEDGE_ERROR);
const link4 = new StaticMockLink(MOCKS_UPDATE_PLEDGE_ERROR);
const link5 = new StaticMockLink(MOCKS_DELETE_PLEDGE_ERROR);
const link6 = new StaticMockLink(EMPTY_MOCKS);
const translations = JSON.parse(
  JSON.stringify(i18nForTest.getDataByLanguage('en')?.translation.pledges),
);

describe('Testing Campaign Pledge Screen', () => {
  const formData = {
    pledgeAmount: 100,
    pledgeCurrency: 'USD',
    pledgeEndDate: '03/10/2024',
    pledgeStartDate: '03/10/2024',
  };

  it('should render the Campaign Pledge screen', async () => {
    const { getByText } = render(
      <MockedProvider link={link1} addTypename={false}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              {<FundCampaignPledge />}
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );
    await wait();
    await waitFor(() => {
      expect(getByText(translations.addPledge)).toBeInTheDocument();
    });
  });
  it('should render the Campaign Pledge screen with error', async () => {
    const { queryByText } = render(
      <MockedProvider link={link2} addTypename={false}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              {<FundCampaignPledge />}
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );
    await wait();
    await waitFor(() =>
      expect(queryByText(translations.addPledge)).not.toBeInTheDocument(),
    );
    await waitFor(() =>
      expect(screen.getByTestId('errorMsg')).toBeInTheDocument(),
    );
  });

  it('open and closes Create Pledge modal', async () => {
    render(
      <MockedProvider link={link1} addTypename={false}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                {<FundCampaignPledge />}
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );
    await wait();
    await waitFor(() =>
      expect(screen.getByTestId('addPledgeBtn')).toBeInTheDocument(),
    );
    userEvent.click(screen.getByTestId('addPledgeBtn'));
    await waitFor(() => {
      return expect(
        screen.findByTestId('createPledgeCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('createPledgeCloseBtn'));
    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('createPledgeCloseBtn'),
    );
  });
  it('creates a pledge', async () => {
    render(
      <MockedProvider link={link1} addTypename={false}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                {<FundCampaignPledge />}
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );
    await wait();
    await waitFor(() =>
      expect(screen.getByTestId('addPledgeBtn')).toBeInTheDocument(),
    );
    userEvent.click(screen.getByTestId('addPledgeBtn'));
    await waitFor(() => {
      return expect(
        screen.findByTestId('createPledgeCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    const currency = screen.getByTestId('currencySelect');
    fireEvent.change(currency, { target: { value: formData.pledgeCurrency } });
    const startDate = screen.getByLabelText(translations.startDate);
    const endDate = screen.getByLabelText(translations.endDate);
    fireEvent.change(startDate, {
      target: { value: formData.pledgeStartDate },
    });
    fireEvent.change(endDate, { target: { value: formData.pledgeEndDate } });
    userEvent.type(
      screen.getByPlaceholderText('Enter Pledge Amount'),
      formData.pledgeAmount.toString(),
    );
    userEvent.click(screen.getByTestId('createPledgeBtn'));
    await waitFor(() => {
      return expect(toast.success).toHaveBeenCalledWith(
        translations.pledgeCreated,
      );
    });
  });
  it('toasts an error on unsuccessful pledge creation', async () => {
    render(
      <MockedProvider link={link3} addTypename={false}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                {<FundCampaignPledge />}
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );
    await wait();
    await waitFor(() =>
      expect(screen.getByTestId('addPledgeBtn')).toBeInTheDocument(),
    );
    userEvent.click(screen.getByTestId('addPledgeBtn'));
    await waitFor(() => {
      return expect(
        screen.findByTestId('createPledgeCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    const currency = screen.getByTestId('currencySelect');
    fireEvent.change(currency, { target: { value: formData.pledgeCurrency } });
    const startDate = screen.getByLabelText(translations.startDate);
    const endDate = screen.getByLabelText(translations.endDate);
    fireEvent.change(startDate, {
      target: { value: formData.pledgeStartDate },
    });
    fireEvent.change(endDate, { target: { value: formData.pledgeEndDate } });
    userEvent.type(
      screen.getByPlaceholderText('Enter Pledge Amount'),
      formData.pledgeAmount.toString(),
    );
    userEvent.click(screen.getByTestId('createPledgeBtn'));
    await waitFor(() => {
      return expect(toast.error).toHaveBeenCalled();
    });
  });

  it('open and closes update pledge modal', async () => {
    render(
      <MockedProvider link={link1} addTypename={false}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                {<FundCampaignPledge />}
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );
    await wait();
    await waitFor(() =>
      expect(screen.getAllByTestId('editPledgeBtn')[0]).toBeInTheDocument(),
    );
    userEvent.click(screen.getAllByTestId('editPledgeBtn')[0]);
    await waitFor(() => {
      return expect(
        screen.findByTestId('updatePledgeCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('updatePledgeCloseBtn'));
    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('updatePledgeCloseBtn'),
    );
  });
  it('updates a pledge', async () => {
    render(
      <MockedProvider link={link1} addTypename={false}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                {<FundCampaignPledge />}
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );
    await wait();
    await waitFor(() =>
      expect(screen.getAllByTestId('editPledgeBtn')[0]).toBeInTheDocument(),
    );
    userEvent.click(screen.getAllByTestId('editPledgeBtn')[0]);
    await waitFor(() => {
      return expect(
        screen.findByTestId('updatePledgeCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    const currency = screen.getByTestId('currencySelect');
    fireEvent.change(currency, { target: { value: 'INR' } });
    const startDate = screen.getByLabelText(translations.startDate);
    const endDate = screen.getByLabelText(translations.endDate);
    fireEvent.change(startDate, {
      target: { value: formData.pledgeStartDate },
    });
    fireEvent.change(endDate, { target: { value: formData.pledgeEndDate } });
    userEvent.type(
      screen.getByPlaceholderText('Enter Pledge Amount'),
      formData.pledgeAmount.toString(),
    );
    userEvent.click(screen.getByTestId('updatePledgeBtn'));
    await waitFor(() => {
      return expect(toast.success).toHaveBeenCalledWith(
        translations.pledgeUpdated,
      );
    });
  });
  it('toasts an error on unsuccessful pledge update', async () => {
    render(
      <MockedProvider link={link4} addTypename={false}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                {<FundCampaignPledge />}
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );
    await wait();
    await waitFor(() =>
      expect(screen.getAllByTestId('editPledgeBtn')[0]).toBeInTheDocument(),
    );
    userEvent.click(screen.getAllByTestId('editPledgeBtn')[0]);
    await waitFor(() => {
      return expect(
        screen.findByTestId('updatePledgeCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    const currency = screen.getByTestId('currencySelect');
    fireEvent.change(currency, { target: { value: 'INR' } });
    const startDate = screen.getByLabelText(translations.startDate);
    const endDate = screen.getByLabelText(translations.endDate);
    fireEvent.change(startDate, {
      target: { value: formData.pledgeStartDate },
    });
    fireEvent.change(endDate, { target: { value: formData.pledgeEndDate } });
    userEvent.type(
      screen.getByPlaceholderText('Enter Pledge Amount'),
      formData.pledgeAmount.toString(),
    );
    userEvent.click(screen.getByTestId('updatePledgeBtn'));
    await waitFor(() => {
      return expect(toast.error).toHaveBeenCalled();
    });
  });
  it('open and closes delete pledge modal', async () => {
    render(
      <MockedProvider link={link1} addTypename={false}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                {<FundCampaignPledge />}
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );
    await wait();
    await waitFor(() =>
      expect(screen.getAllByTestId('deletePledgeBtn')[0]).toBeInTheDocument(),
    );
    userEvent.click(screen.getAllByTestId('deletePledgeBtn')[0]);
    await waitFor(() => {
      return expect(
        screen.findByTestId('deletePledgeCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('deletePledgeCloseBtn'));
    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('deletePledgeCloseBtn'),
    );
  });
  it('deletes a pledge', async () => {
    render(
      <MockedProvider link={link1} addTypename={false}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                {<FundCampaignPledge />}
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );
    await wait();
    await waitFor(() =>
      expect(screen.getAllByTestId('deletePledgeBtn')[0]).toBeInTheDocument(),
    );
    userEvent.click(screen.getAllByTestId('deletePledgeBtn')[0]);
    await waitFor(() => {
      return expect(
        screen.findByTestId('deletePledgeCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('deleteyesbtn'));
    await waitFor(() => {
      return expect(toast.success).toHaveBeenCalledWith(
        translations.pledgeDeleted,
      );
    });
  });
  it('toasts an error on unsuccessful pledge deletion', async () => {
    render(
      <MockedProvider link={link5} addTypename={false}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                {<FundCampaignPledge />}
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );
    await wait();
    await waitFor(() =>
      expect(screen.getAllByTestId('deletePledgeBtn')[0]).toBeInTheDocument(),
    );
    userEvent.click(screen.getAllByTestId('deletePledgeBtn')[0]);
    await waitFor(() => {
      return expect(
        screen.findByTestId('deletePledgeCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('deleteyesbtn'));
    await waitFor(() => {
      return expect(toast.error).toHaveBeenCalled();
    });
  });
  it('renders the empty pledge component', async () => {
    render(
      <MockedProvider link={link6} addTypename={false}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                {<FundCampaignPledge />}
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );
    await wait();
    await waitFor(() =>
      expect(screen.getByText(translations.noPledges)).toBeInTheDocument(),
    );
  });
});
