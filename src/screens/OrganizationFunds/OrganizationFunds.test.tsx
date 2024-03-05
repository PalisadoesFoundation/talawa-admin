import { MockedProvider } from '@apollo/client/testing';
import {
  act,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import React from 'react';
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
  MOCKS_ARCHIVED_FUND,
  MOCKS_ERROR_ARCHIVED_FUND,
  MOCKS_ERROR_CREATE_FUND,
  MOCKS_ERROR_ORGANIZATIONS_FUNDS,
  MOCKS_ERROR_REMOVE_FUND,
  MOCKS_ERROR_UNARCHIVED_FUND,
  MOCKS_ERROR_UPDATE_FUND,
  MOCKS_UNARCHIVED_FUND,
} from './OrganizationFundsMocks';
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
const link6 = new StaticMockLink(MOCKS_ARCHIVED_FUND, true);
const link7 = new StaticMockLink(MOCKS_ERROR_ARCHIVED_FUND, true);
const link8 = new StaticMockLink(MOCKS_UNARCHIVED_FUND, true);
const link9 = new StaticMockLink(MOCKS_ERROR_UNARCHIVED_FUND, true);

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
      expect(screen.getByTestId('fundtype')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('fundtype'));
    await waitFor(() => {
      expect(screen.getByTestId('Archived')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('Archived'));

    await waitFor(() => {
      expect(screen.getByTestId('fundtype')).toHaveTextContent(
        translations.archived,
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('fundtype')).toBeInTheDocument();
    });

    userEvent.click(screen.getByTestId('fundtype'));

    await waitFor(() => {
      expect(screen.getByTestId('Non-Archived')).toBeInTheDocument();
    });

    userEvent.click(screen.getByTestId('Non-Archived'));

    await waitFor(() => {
      expect(screen.getByTestId('fundtype')).toHaveTextContent(
        translations.nonArchive,
      );
    });
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
    userEvent.click(screen.getByTestId('createFundModalCloseBtn'));
    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('createFundModalCloseBtn'),
    );
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
    userEvent.click(screen.getByTestId('createFundFormSubmitBtn'));

    await waitFor(() => {
      expect(toast.success).toBeCalledWith(translations.fundCreated);
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
  it("opens and closes the 'Edit Fund' modal", async () => {
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
      expect(screen.getAllByTestId('editFundBtn')[0]).toBeInTheDocument();
    });
    userEvent.click(screen.getAllByTestId('editFundBtn')[0]);
    await waitFor(() => {
      return expect(
        screen.findByTestId('editFundModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('editFundModalCloseBtn'));
    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('editFundModalCloseBtn'),
    );
  });
  it('updates a fund', async () => {
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
    userEvent.click(screen.getByTestId('editFundFormSubmitBtn'));

    await waitFor(() => {
      expect(toast.success).toBeCalledWith(translations.fundUpdated);
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
    userEvent.click(screen.getByTestId('editFundFormSubmitBtn'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });
  it("opens and closes the 'Delete Fund' modal", async () => {
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
      expect(screen.getAllByTestId('deleteFundBtn')[0]).toBeInTheDocument();
    });
    userEvent.click(screen.getAllByTestId('deleteFundBtn')[0]);
    await waitFor(() => {
      return expect(
        screen.findByTestId('fundDeleteModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('fundDeleteModalCloseBtn'));
    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('fundDeleteModalCloseBtn'),
    );
  });
  it('deletes a fund', async () => {
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
      expect(screen.getAllByTestId('deleteFundBtn')[0]).toBeInTheDocument();
    });
    userEvent.click(screen.getAllByTestId('deleteFundBtn')[0]);
    await waitFor(() => {
      return expect(
        screen.findByTestId('fundDeleteModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('fundDeleteModalDeleteBtn'));

    await waitFor(() => {
      expect(toast.success).toBeCalledWith(translations.fundDeleted);
    });
  });
  it('toast error on unsuccessful fund deletion', async () => {
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
    await waitFor(() => {
      expect(screen.getAllByTestId('deleteFundBtn')[0]).toBeInTheDocument();
    });
    userEvent.click(screen.getAllByTestId('deleteFundBtn')[0]);
    await waitFor(() => {
      return expect(
        screen.findByTestId('fundDeleteModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('fundDeleteModalDeleteBtn'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });
  it("opens and closes the 'Archive Fund' modal", async () => {
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
      expect(screen.getAllByTestId('archiveFundBtn')[0]).toBeInTheDocument();
    });
    userEvent.click(screen.getAllByTestId('archiveFundBtn')[0]);
    await waitFor(() => {
      return expect(
        screen.findByTestId('fundArchiveModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('fundArchiveModalCloseBtn'));
    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('fundArchiveModalCloseBtn'),
    );
  });

  it('archive the fund', async () => {
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
      expect(screen.getAllByTestId('archiveFundBtn')[0]).toBeInTheDocument();
    });
    userEvent.click(screen.getAllByTestId('archiveFundBtn')[0]);
    await waitFor(() => {
      return expect(
        screen.findByTestId('fundArchiveModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('fundArchiveModalArchiveBtn'));
    await waitFor(() => {
      expect(toast.success).toBeCalledWith(translations.fundArchived);
    });
  });
  it('toast error on unsuccessful fund archive', async () => {
    render(
      <MockedProvider addTypename={false} link={link7}>
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
      expect(screen.getAllByTestId('archiveFundBtn')[0]).toBeInTheDocument();
    });
    userEvent.click(screen.getAllByTestId('archiveFundBtn')[0]);
    await waitFor(() => {
      return expect(
        screen.findByTestId('fundArchiveModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('fundArchiveModalArchiveBtn'));
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });
  it('unarchives the fund', async () => {
    render(
      <MockedProvider addTypename={false} link={link8}>
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
      expect(screen.getByTestId('fundtype')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('fundtype'));

    await waitFor(() => {
      expect(screen.getByTestId('Archived')).toBeInTheDocument();
    });

    userEvent.click(screen.getByTestId('Archived'));

    await waitFor(() => {
      expect(screen.getByTestId('fundtype')).toHaveTextContent(
        translations.archived,
      );
    });
    await waitFor(() => {
      expect(screen.getAllByTestId('archiveFundBtn')[0]).toBeInTheDocument();
    });
    userEvent.click(screen.getAllByTestId('archiveFundBtn')[0]);
    await waitFor(() => {
      expect(toast.success).toBeCalledWith(translations.fundUnarchived);
    });
  });
  it('toast error on unsuccessful fund unarchive', async () => {
    render(
      <MockedProvider addTypename={false} link={link9}>
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
      expect(screen.getByTestId('fundtype')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('fundtype'));

    await waitFor(() => {
      expect(screen.getByTestId('Archived')).toBeInTheDocument();
    });

    userEvent.click(screen.getByTestId('Archived'));

    await waitFor(() => {
      expect(screen.getByTestId('fundtype')).toHaveTextContent(
        translations.archived,
      );
    });
    await waitFor(() => {
      expect(screen.getAllByTestId('archiveFundBtn')[0]).toBeInTheDocument();
    });
    userEvent.click(screen.getAllByTestId('archiveFundBtn')[0]);
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });
});
