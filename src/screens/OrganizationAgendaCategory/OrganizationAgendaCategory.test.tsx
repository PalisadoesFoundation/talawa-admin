import React from 'react';
import {
  render,
  screen,
  waitFor,
  act,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import 'jest-localstorage-mock';
import { MockedProvider } from '@apollo/client/testing';
import 'jest-location-mock';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import i18n from 'utils/i18nForTest';
import { toast } from 'react-toastify';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';

import OrganizationAgendaCategory from './OrganizationAgendaCategory';
import {
  MOCKS_ERROR_AGENDA_ITEM_CATEGORY_LIST_QUERY,
  MOCKS_ERROR_MUTATION,
} from './OrganizationAgendaCategoryErrorMocks';
import { MOCKS } from './OrganizationAgendaCategoryMocks';

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ orgId: '123' }),
}));

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

const link = new StaticMockLink(MOCKS, true);
const link2 = new StaticMockLink(
  MOCKS_ERROR_AGENDA_ITEM_CATEGORY_LIST_QUERY,
  true,
);
const link3 = new StaticMockLink(MOCKS_ERROR_MUTATION, true);

const translations = {
  ...JSON.parse(
    JSON.stringify(
      i18n.getDataByLanguage('en')?.translation.organizationAgendaCategory ??
        {},
    ),
  ),
};

describe('Testing Agenda Categories Component', () => {
  const formData = {
    name: 'Category',
    description: 'Test Description',
    createdBy: 'Test User',
  };
  test('Component loads correctly', async () => {
    const { getByText } = render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18n}>
              {<OrganizationAgendaCategory />}
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(getByText(translations.createAgendaCategory)).toBeInTheDocument();
    });
  });

  test('render error component on unsuccessful agenda category list query', async () => {
    const { queryByText } = render(
      <MockedProvider addTypename={false} link={link2}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18n}>
              {<OrganizationAgendaCategory />}
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(
        queryByText(translations.createAgendaCategory),
      ).not.toBeInTheDocument();
    });
  });

  test('opens and closes the create agenda category modal', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18n}>
                {<OrganizationAgendaCategory />}
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('createAgendaCategoryBtn')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('createAgendaCategoryBtn'));

    await waitFor(() => {
      return expect(
        screen.findByTestId('createAgendaCategoryModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('createAgendaCategoryModalCloseBtn'));

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('createAgendaCategoryModalCloseBtn'),
    );
  });
  test('creates new agenda cagtegory', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18n}>
                {<OrganizationAgendaCategory />}
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('createAgendaCategoryBtn')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('createAgendaCategoryBtn'));

    await waitFor(() => {
      return expect(
        screen.findByTestId('createAgendaCategoryModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });

    userEvent.type(
      screen.getByPlaceholderText(translations.name),
      formData.name,
    );

    userEvent.type(
      screen.getByPlaceholderText(translations.description),
      formData.description,
    );
    userEvent.click(screen.getByTestId('createAgendaCategoryFormSubmitBtn'));

    await waitFor(() => {
      expect(toast.success).toBeCalledWith(translations.agendaCategoryCreated);
    });
  });

  // test('toasts error on unsuccessful creation', async () => {
  //   render(
  //     <MockedProvider addTypename={false} link={link3}>
  //       <Provider store={store}>
  //         <BrowserRouter>
  //           <LocalizationProvider dateAdapter={AdapterDayjs}>
  //             <I18nextProvider i18n={i18n}>
  //               {<OrganizationAgendaCategory />}
  //             </I18nextProvider>
  //           </LocalizationProvider>
  //         </BrowserRouter>
  //       </Provider>
  //     </MockedProvider>,
  //   );

  //   await wait();

  //   await waitFor(() => {
  //     expect(screen.getByTestId('createAgendaCategoryBtn')).toBeInTheDocument();
  //   });
  //   userEvent.click(screen.getByTestId('createAgendaCategoryBtn'));

  //   await waitFor(() => {
  //     return expect(
  //       screen.findByTestId('createAgendaCategoryModalCloseBtn'),
  //     ).resolves.toBeInTheDocument();
  //   });

  //   userEvent.type(
  //     screen.getByPlaceholderText(translations.name),
  //     formData.name,
  //   );

  //   userEvent.type(
  //     screen.getByPlaceholderText(translations.description),
  //     formData.description,
  //   );
  //   userEvent.click(screen.getByTestId('createAgendaCategoryFormSubmitBtn'));

  //   await waitFor(() => {
  //     expect(toast.error).toBeCalledWith();
  //   });
  // });
});
