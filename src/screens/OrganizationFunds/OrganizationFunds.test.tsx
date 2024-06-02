import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18nForTest from 'utils/i18nForTest';
import OrganizationFunds from './OrganizationFunds';
import {
  MOCKS,
  MOCKS_ERROR_CREATE_FUND,
  MOCKS_ERROR_ORGANIZATIONS_FUNDS,
  MOCKS_ERROR_REMOVE_FUND,
  MOCKS_ERROR_UPDATE_FUND,
  NO_FUNDS,
} from './OrganizationFundsMocks';
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
async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}
const link1 = new StaticMockLink(MOCKS, true);
const link2 = new StaticMockLink(MOCKS_ERROR_ORGANIZATIONS_FUNDS, true);
const link3 = new StaticMockLink(MOCKS_ERROR_CREATE_FUND, true);
const link4 = new StaticMockLink(MOCKS_ERROR_UPDATE_FUND, true);
const link5 = new StaticMockLink(MOCKS_ERROR_REMOVE_FUND, true);
const link6 = new StaticMockLink(NO_FUNDS, true);

const translations = JSON.parse(
  JSON.stringify(i18nForTest.getDataByLanguage('en')?.translation.funds),
);
describe('Testing OrganizationFunds screen', () => {
  const formData = {
    fundName: 'Test Fund',
    fundRef: '1',
  };
  it("loads the OrganizationFunds screen and it's components", async () => {
    const { getByText } = render(
      <MockedProvider addTypename={false} link={link1}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              {<OrganizationFunds />}
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );
    await wait();
    await waitFor(() => {
      expect(getByText(translations.createFund)).toBeInTheDocument();
    });
  });
  it("renders the OrganizationFunds screen and it's components with error", async () => {
    const { queryByText } = render(
      <MockedProvider addTypename={false} link={link2}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              {<OrganizationFunds />}
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );
    await wait();
    await waitFor(() => {
      expect(queryByText(translations.createFund)).not.toBeInTheDocument();
    });
  });
  it('renders the Error component', async () => {
    render(
      <MockedProvider addTypename={false} link={link2}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              {<OrganizationFunds />}
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
  it('renders the funds component based on fund type', async () => {
    render(
      <MockedProvider addTypename={false} link={link1}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              {<OrganizationFunds />}
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );
    await wait();
    await waitFor(() => {
      expect(screen.getAllByTestId('fundtype')[0]).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getAllByTestId('fundtype')[0]).toHaveTextContent(
        translations.nonArchive,
      );
    });
    expect(screen.getAllByTestId('fundtype')[1]).toHaveTextContent(
      translations.archived,
    );
  });
  it("opens and closes the 'Create Fund' modal", async () => {
    render(
      <MockedProvider addTypename={false} link={link1}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              {<OrganizationFunds />}
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );
    await wait();
    await waitFor(() => {
      expect(screen.getByTestId('createFundBtn')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('createFundBtn'));
    await waitFor(() => {
      return expect(
        screen.findByTestId('createFundModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('setTaxDeductibleSwitch'));
    userEvent.click(screen.getByTestId('setDefaultSwitch'));
    userEvent.click(screen.getByTestId('createFundModalCloseBtn'));
    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('createFundModalCloseBtn'),
    );
  });
  it('noFunds to be in the document', async () => {
    render(
      <MockedProvider addTypename={false} link={link6}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              {<OrganizationFunds />}
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );
    await wait();
    await waitFor(() => {
      expect(screen.getByText(translations.noFundsFound)).toBeInTheDocument();
    });
  });
  it('creates a new fund', async () => {
    render(
      <MockedProvider addTypename={false} link={link1}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              {<OrganizationFunds />}
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );
    await wait();
    await waitFor(() => {
      expect(screen.getByTestId('createFundBtn')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('createFundBtn'));
    await waitFor(() => {
      return expect(
        screen.findByTestId('createFundModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    userEvent.type(
      screen.getByPlaceholderText(translations.enterfundName),
      formData.fundName,
    );
    userEvent.type(
      screen.getByPlaceholderText(translations.enterfundId),
      formData.fundRef,
    );
    userEvent.click(screen.getByTestId('setTaxDeductibleSwitch'));
    userEvent.click(screen.getByTestId('setDefaultSwitch'));
    userEvent.click(screen.getByTestId('setTaxDeductibleSwitch'));
    userEvent.click(screen.getByTestId('setDefaultSwitch'));
    await wait();
    userEvent.click(screen.getByTestId('createFundFormSubmitBtn'));

    await waitFor(() => {
      expect(toast.success).toBeCalledWith(translations.fundCreated);
    });
  });
  it('updates fund successfully', async () => {
    render(
      <MockedProvider addTypename={false} link={link1}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              {<OrganizationFunds />}
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );
    await wait();
    userEvent.click(screen.getAllByTestId('editFundBtn')[0]);
    await wait();
    userEvent.clear(screen.getByTestId('fundNameInput'));
    userEvent.clear(screen.getByTestId('fundIdInput'));
    userEvent.type(screen.getByTestId('fundNameInput'), 'Test Fund');
    userEvent.type(screen.getByTestId('fundIdInput'), '1');
    expect(screen.getByTestId('taxDeductibleSwitch')).toBeInTheDocument();
    expect(screen.getByTestId('defaultSwitch')).toBeInTheDocument();
    expect(screen.getByTestId('archivedSwitch')).toBeInTheDocument();
    expect(screen.getByTestId('updateFormBtn')).toBeInTheDocument();
    userEvent.click(screen.getByTestId('taxDeductibleSwitch'));
    userEvent.click(screen.getByTestId('defaultSwitch'));
    userEvent.click(screen.getByTestId('archivedSwitch'));
    await wait();
    userEvent.click(screen.getByTestId('updateFormBtn'));
    await wait();
    await waitFor(() => {
      expect(toast.success).toBeCalledWith(translations.fundUpdated);
    });
  });
  it('toast error on unsuccessful fund creation', async () => {
    render(
      <MockedProvider addTypename={false} link={link3}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              {<OrganizationFunds />}
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );
    await wait();
    await waitFor(() => {
      expect(screen.getByTestId('createFundBtn')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('createFundBtn'));
    await waitFor(() => {
      return expect(
        screen.findByTestId('createFundModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    userEvent.type(
      screen.getByPlaceholderText(translations.enterfundName),
      formData.fundName,
    );
    userEvent.type(
      screen.getByPlaceholderText(translations.enterfundId),
      formData.fundRef,
    );
    userEvent.click(screen.getByTestId('createFundFormSubmitBtn'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });
  it('toast error on unsuccessful fund update', async () => {
    render(
      <MockedProvider addTypename={false} link={link4}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              {<OrganizationFunds />}
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );
    await wait();
    await waitFor(() => {
      expect(screen.getAllByTestId('editFundBtn')[0]).toBeInTheDocument();
    });
    userEvent.click(screen.getAllByTestId('editFundBtn')[0]);
    await waitFor(() => {
      return expect(
        screen.findByTestId('editFundModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    userEvent.type(
      screen.getByPlaceholderText(translations.enterfundName),
      'Test Fund Updated',
    );
    userEvent.click(screen.getByTestId('updateFormBtn'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });
  it('redirects to campaign screen when clicked on fund name', async () => {
    render(
      <MockedProvider addTypename={false} link={link1}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              {<OrganizationFunds />}
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );
    await wait();
    await waitFor(() => {
      expect(screen.getAllByTestId('fundName')[0]).toBeInTheDocument();
    });
    userEvent.click(screen.getAllByTestId('fundName')[0]);
    await waitFor(() => {
      expect(mockNavigate).toBeCalledWith('/orgfundcampaign/undefined/1');
    });
  });
  it('delete fund succesfully', async () => {
    render(
      <MockedProvider addTypename={false} link={link1}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              {<OrganizationFunds />}
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );
    await wait();
    userEvent.click(screen.getAllByTestId('editFundBtn')[0]);
    await wait();
    userEvent.click(screen.getByTestId('fundDeleteModalDeleteBtn'));
    await waitFor(() => {
      expect(toast.success).toBeCalledWith(translations.fundDeleted);
    });
  });
  it('throws error on unsuccessful fund deletion', async () => {
    render(
      <MockedProvider addTypename={false} link={link5}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              {<OrganizationFunds />}
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );
    await wait();
    userEvent.click(screen.getAllByTestId('editFundBtn')[0]);
    await wait();
    userEvent.click(screen.getByTestId('fundDeleteModalDeleteBtn'));
    await waitFor(() => {
      expect(toast.error).toBeCalled();
    });
  });
  it('search funds by name', async () => {
    render(
      <MockedProvider addTypename={false} link={link1}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              {<OrganizationFunds />}
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );
    await wait();
    userEvent.click(screen.getAllByTestId('editFundBtn')[0]);
    await wait();
    userEvent.click(screen.getByTestId('editFundModalCloseBtn'));
    await wait();
    userEvent.type(screen.getByTestId('searchFullName'), 'Funndds');
    await wait();
    userEvent.click(screen.getByTestId('searchBtn'));
  });
});
