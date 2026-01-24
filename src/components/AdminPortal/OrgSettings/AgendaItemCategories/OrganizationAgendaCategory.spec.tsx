import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import i18n from 'utils/i18nForTest';
import { vi } from 'vitest';
import {
  LocalizationProvider,
  AdapterDayjs,
} from 'shared-components/DateRangePicker';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';

import OrganizationAgendaCategory from './OrganizationAgendaCategory';
import {
  MOCKS_ERROR_AGENDA_ITEM_CATEGORY_LIST_QUERY,
  MOCKS_ERROR_MUTATION,
} from './OrganizationAgendaCategoryErrorMocks';
import { MOCKS } from './OrganizationAgendaCategoryMocks';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';

vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
    error: vi.fn(),
    success: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
    dismiss: vi.fn(),
  },
}));

vi.mock('react-router', async () => ({
  ...(await vi.importActual('react-router')),
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
  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  const formData = {
    name: 'Category',
    description: 'Test Description',
    createdBy: 'Test User',
  };
  it('Component loads correctly', async () => {
    const { getByText } = render(
      <MockedProvider link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18n}>
              {<OrganizationAgendaCategory orgId="123" />}
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
  test('displays loading state', async () => {
    const { getByTestId } = render(
      <MockedProvider mocks={[]}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18n}>
              {<OrganizationAgendaCategory orgId="123" />}
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    expect(getByTestId('spinner')).toBeInTheDocument();
  });

  it('render error component on unsuccessful agenda category list query', async () => {
    const { queryByText } = render(
      <MockedProvider link={link2}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18n}>
              {<OrganizationAgendaCategory orgId="123" />}
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

  it('opens and closes the create agenda category modal', async () => {
    const user = userEvent.setup();
    render(
      <MockedProvider link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18n}>
                {<OrganizationAgendaCategory orgId="123" />}
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
    await user.click(screen.getByTestId('createAgendaCategoryBtn'));

    await waitFor(() => {
      return expect(
        screen.findByTestId('modalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    await user.click(screen.getByTestId('modalCloseBtn'));

    await waitFor(() => {
      expect(screen.queryByTestId('modalCloseBtn')).not.toBeInTheDocument();
    });
  });
  it('creates new agenda cagtegory', async () => {
    const user = userEvent.setup();
    render(
      <MockedProvider link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18n}>
                {<OrganizationAgendaCategory orgId="123" />}
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
    await user.click(screen.getByTestId('createAgendaCategoryBtn'));

    await waitFor(() => {
      return expect(
        screen.findByTestId('modalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });

    await user.type(
      screen.getByPlaceholderText(translations.name),
      formData.name,
    );

    await user.type(
      screen.getByPlaceholderText(translations.description),
      formData.description,
    );
    await user.click(screen.getByTestId('createAgendaCategoryFormSubmitBtn'));

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith(
        translations.agendaCategoryCreated,
      );
    });
  });

  test('toasts error on unsuccessful creation', async () => {
    const user = userEvent.setup();
    render(
      <MockedProvider link={link3}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18n}>
                {<OrganizationAgendaCategory orgId="123" />}
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
    await user.click(screen.getByTestId('createAgendaCategoryBtn'));

    await waitFor(() => {
      return expect(
        screen.findByTestId('modalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });

    await user.type(
      screen.getByPlaceholderText(translations.name),
      formData.name,
    );

    await user.type(
      screen.getByPlaceholderText(translations.description),
      formData.description,
    );
    await user.click(screen.getByTestId('createAgendaCategoryFormSubmitBtn'));

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith(
        'Mock Graphql Error',
      );
    });
  });
  test('allow user to type in the search field', async () => {
    const user = userEvent.setup();
    render(
      <MockedProvider link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18n}>
                {<OrganizationAgendaCategory orgId="123" />}
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    // Wait for data to load (LoadingState completes)
    await waitFor(() => {
      expect(
        screen.getByText(translations.createAgendaCategory),
      ).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('searchByName');
    expect(searchInput).toBeInTheDocument();

    await user.type(searchInput, 'Category 1');
    await waitFor(() => {
      expect(searchInput).toHaveValue('Category 1');
    });
  });
  test('triggers search on pressing Enter key', async () => {
    const user = userEvent.setup();
    render(
      <MockedProvider link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18n}>
                {<OrganizationAgendaCategory orgId="123" />}
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    // Wait for data to load (LoadingState completes)
    await waitFor(() => {
      expect(
        screen.getByText(translations.createAgendaCategory),
      ).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('searchByName');
    expect(searchInput).toBeInTheDocument();

    await user.type(searchInput, 'Category');
    await act(async () => {
      await user.keyboard('{enter}');
    });
    await waitFor(() => {
      expect(screen.getAllByText('Category').length).toBe(2);
    });
  });
  test('triggers search on clicking search button', async () => {
    const user = userEvent.setup();
    render(
      <MockedProvider link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18n}>
                {<OrganizationAgendaCategory orgId="123" />}
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    // Wait for data to load (LoadingState completes)
    await waitFor(() => {
      expect(
        screen.getByText(translations.createAgendaCategory),
      ).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('searchByName');
    expect(searchInput).toBeInTheDocument();
    await user.type(searchInput, 'Category');

    const searchButton = screen.getByTestId('searchBtn');
    await user.click(searchButton);
    await waitFor(() => {
      expect(screen.getAllByText('Category').length).toBe(2);
    });
  });
  test('Search categories by name and clear the input by backspace', async () => {
    const user = userEvent.setup();
    render(
      <MockedProvider link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18n}>
                {<OrganizationAgendaCategory orgId="123" />}
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    // Wait for data to load (LoadingState completes)
    await waitFor(() => {
      expect(
        screen.getByText(translations.createAgendaCategory),
      ).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('searchByName');
    expect(searchInput).toBeInTheDocument();
    await user.type(searchInput, 'A{backspace}');
    await waitFor(() => {
      expect(screen.getAllByText('Category').length).toBe(2);
    });
  });

  it('should display categories after loading completes', async () => {
    render(
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <MockedProvider link={new StaticMockLink(MOCKS)}>
          <Provider store={store}>
            <BrowserRouter>
              <I18nextProvider i18n={i18n}>
                <OrganizationAgendaCategory orgId="123" />
              </I18nextProvider>
            </BrowserRouter>
          </Provider>
        </MockedProvider>
      </LocalizationProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('searchByName')).toBeInTheDocument();
    });
  });
});
