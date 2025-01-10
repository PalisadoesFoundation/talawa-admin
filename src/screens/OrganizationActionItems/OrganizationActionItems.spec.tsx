import React, { act } from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18n from 'utils/i18nForTest';
import OrganizationActionItems from 'screens/OrganizationActionItems/OrganizationActionItems';

import {
  MOCKS,
  MOCKS_EMPTY,
  MOCKS_ERROR,
} from './OrganizationActionItem.mocks';
import { vi } from 'vitest';

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('@mui/x-date-pickers/DateTimePicker', async () => {
  return {
    DateTimePicker: (
      await vi.importActual('@mui/x-date-pickers/DesktopDateTimePicker')
    ).DesktopDateTimePicker,
  };
});

const link1 = new StaticMockLink(MOCKS);
const link2 = new StaticMockLink(MOCKS_ERROR);
const link3 = new StaticMockLink(MOCKS_EMPTY);
const t = {
  ...JSON.parse(
    JSON.stringify(
      i18n.getDataByLanguage('en')?.translation.organizationActionItems ?? {},
    ),
  ),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.common ?? {})),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.errors ?? {})),
};

const debounceWait = async (ms = 300): Promise<void> => {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
};

describe('Testing Organization Action Items Screen', () => {
  beforeAll(() => {
    vi.mock('react-router-dom', async () => ({
      ...(await vi.importActual('react-router-dom')),
      useParams: () => ({ orgId: 'orgId', eventId: 'eventId' }),
    }));
  });

  afterAll(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();
  });

  it('should redirect to fallback URL if URL params are undefined', async () => {
    render(
      <MockedProvider addTypename={false} link={link1}>
        <MemoryRouter initialEntries={['/orgactionitems/orgId']}>
          <Provider store={store}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18n}>
                <Routes>
                  <Route
                    path="/orgactionitems/:orgId"
                    element={<OrganizationActionItems />}
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

    await waitFor(() => {
      expect(window.location.pathname).toBe('/');
    });
  });

  it('should render Organization Action Items screen', async () => {
    render(
      <MockedProvider addTypename={false} mocks={MOCKS}>
        <MemoryRouter initialEntries={['/orgactionitems/orgId']}>
          <Provider store={store}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18n}>
                <Routes>
                  <Route
                    path="/orgactionitems/:orgId"
                    element={<OrganizationActionItems />}
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

    await waitFor(() => {
      expect(screen.queryByTestId('searchBy')).toBeInTheDocument();
      expect(screen.queryAllByText('John Doe')).toHaveLength(2);
      expect(screen.queryAllByText('Jane Doe')).toHaveLength(2);
    });
  });

  it('Sort Action Items descending by dueDate', async () => {
    render(
      <MockedProvider addTypename={false} link={link1}>
        <MemoryRouter initialEntries={['/orgactionitems/orgId']}>
          <Provider store={store}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18n}>
                <Routes>
                  <Route
                    path="/orgactionitems/:orgId"
                    element={<OrganizationActionItems />}
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

    const sortBtn = await screen.findByTestId('sort');
    expect(sortBtn).toBeInTheDocument();

    await act(() => {
      fireEvent.click(sortBtn);
    });

    await waitFor(() => {
      expect(screen.getByTestId('dueDate_DESC')).toBeInTheDocument();
    });

    await act(() => {
      fireEvent.click(screen.getByTestId('dueDate_DESC'));
    });

    await waitFor(() => {
      expect(screen.getAllByTestId('categoryName')[0]).toHaveTextContent(
        'Category 2',
      );
    });
  });

  it('Sort Action Items ascending by dueDate', async () => {
    render(
      <MockedProvider addTypename={false} link={link1}>
        <MemoryRouter initialEntries={['/orgactionitems/orgId']}>
          <Provider store={store}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18n}>
                <Routes>
                  <Route
                    path="/orgactionitems/:orgId"
                    element={<OrganizationActionItems />}
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

    const sortBtn = await screen.findByTestId('sort');
    expect(sortBtn).toBeInTheDocument();

    await act(() => {
      fireEvent.click(sortBtn);
    });

    await waitFor(() => {
      expect(screen.getByTestId('dueDate_ASC')).toBeInTheDocument();
    });

    await act(() => {
      fireEvent.click(screen.getByTestId('dueDate_ASC'));
    });

    await waitFor(() => {
      expect(screen.getAllByTestId('categoryName')[0]).toHaveTextContent(
        'Category 1',
      );
    });
  });

  it('Filter Action Items by status (All/Pending)', async () => {
    render(
      <MockedProvider addTypename={false} link={link1}>
        <MemoryRouter initialEntries={['/orgactionitems/orgId']}>
          <Provider store={store}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18n}>
                <Routes>
                  <Route
                    path="/orgactionitems/:orgId"
                    element={<OrganizationActionItems />}
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

    const filterBtn = await screen.findByTestId('filter');
    expect(filterBtn).toBeInTheDocument();

    await act(() => {
      fireEvent.click(filterBtn);
    });

    await waitFor(() => {
      expect(screen.getByTestId('all')).toBeInTheDocument();
    });

    await act(() => {
      fireEvent.click(screen.getByTestId('all'));
    });

    await waitFor(() => {
      expect(screen.getAllByText('Category 1')).toHaveLength(3);
      expect(screen.getAllByText('Category 2')).toHaveLength(2);
    });

    await act(() => {
      fireEvent.click(filterBtn);
    });

    await waitFor(() => {
      expect(screen.getByTestId('pending')).toBeInTheDocument();
    });

    await act(() => {
      fireEvent.click(screen.getByTestId('pending'));
    });

    await waitFor(() => {
      expect(screen.queryByText('Category 1')).toBeNull();
      expect(screen.getByText('Category 2')).toBeInTheDocument();
    });
  });

  it('Filter Action Items by status (Completed)', async () => {
    render(
      <MockedProvider addTypename={false} link={link1}>
        <MemoryRouter initialEntries={['/orgactionitems/orgId']}>
          <Provider store={store}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18n}>
                <Routes>
                  <Route
                    path="/orgactionitems/:orgId"
                    element={<OrganizationActionItems />}
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

    const filterBtn = await screen.findByTestId('filter');
    expect(filterBtn).toBeInTheDocument();

    await act(() => {
      fireEvent.click(filterBtn);
    });

    await waitFor(() => {
      expect(screen.getByTestId('completed')).toBeInTheDocument();
    });

    await act(() => {
      fireEvent.click(screen.getByTestId('completed'));
    });

    await waitFor(() => {
      expect(screen.getByText('Category 1')).toBeInTheDocument();
      expect(screen.queryByText('Category 2')).toBeNull();
    });
  });

  it('open and close Item modal (create)', async () => {
    render(
      <MockedProvider addTypename={false} link={link1}>
        <MemoryRouter initialEntries={['/orgactionitems/orgId']}>
          <Provider store={store}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18n}>
                <Routes>
                  <Route
                    path="/orgactionitems/:orgId"
                    element={<OrganizationActionItems />}
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

    const addItemBtn = await screen.findByTestId('createActionItemBtn');
    expect(addItemBtn).toBeInTheDocument();
    userEvent.click(addItemBtn);

    await waitFor(() =>
      expect(screen.getAllByText(t.createActionItem)).toHaveLength(2),
    );
    userEvent.click(screen.getByTestId('modalCloseBtn'));
    await waitFor(() =>
      expect(screen.queryByTestId('modalCloseBtn')).toBeNull(),
    );
  });

  it('open and close Item modal (view)', async () => {
    render(
      <MockedProvider addTypename={false} link={link1}>
        <MemoryRouter initialEntries={['/orgactionitems/orgId']}>
          <Provider store={store}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18n}>
                <Routes>
                  <Route
                    path="/orgactionitems/:orgId"
                    element={<OrganizationActionItems />}
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

    const viewItemBtn = await screen.findByTestId('viewItemBtn1');
    expect(viewItemBtn).toBeInTheDocument();
    userEvent.click(viewItemBtn);

    await waitFor(() =>
      expect(screen.getByText(t.actionItemDetails)).toBeInTheDocument(),
    );
    userEvent.click(screen.getByTestId('modalCloseBtn'));
    await waitFor(() =>
      expect(screen.queryByTestId('modalCloseBtn')).toBeNull(),
    );
  });

  it('open and closes Item modal (edit)', async () => {
    render(
      <MockedProvider addTypename={false} link={link1}>
        <MemoryRouter initialEntries={['/orgactionitems/orgId']}>
          <Provider store={store}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18n}>
                <Routes>
                  <Route
                    path="/orgactionitems/:orgId"
                    element={<OrganizationActionItems />}
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

    const editItemBtn = await screen.findByTestId('editItemBtn1');
    await waitFor(() => expect(editItemBtn).toBeInTheDocument());
    userEvent.click(editItemBtn);

    await waitFor(() =>
      expect(screen.getAllByText(t.updateActionItem)).toHaveLength(2),
    );
    userEvent.click(screen.getByTestId('modalCloseBtn'));
    await waitFor(() =>
      expect(screen.queryByTestId('modalCloseBtn')).toBeNull(),
    );
  });

  it('open and closes Item modal (delete)', async () => {
    render(
      <MockedProvider addTypename={false} link={link1}>
        <MemoryRouter initialEntries={['/orgactionitems/orgId']}>
          <Provider store={store}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18n}>
                <Routes>
                  <Route
                    path="/orgactionitems/:orgId"
                    element={<OrganizationActionItems />}
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

    const deleteItemBtn = await screen.findByTestId('deleteItemBtn1');
    expect(deleteItemBtn).toBeInTheDocument();
    userEvent.click(deleteItemBtn);

    await waitFor(() =>
      expect(screen.getByText(t.deleteActionItem)).toBeInTheDocument(),
    );
    userEvent.click(screen.getByTestId('modalCloseBtn'));
    await waitFor(() =>
      expect(screen.queryByTestId('modalCloseBtn')).toBeNull(),
    );
  });

  it('open and closes Item modal (update status)', async () => {
    render(
      <MockedProvider addTypename={false} link={link1}>
        <MemoryRouter initialEntries={['/orgactionitems/orgId']}>
          <Provider store={store}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18n}>
                <Routes>
                  <Route
                    path="/orgactionitems/:orgId"
                    element={<OrganizationActionItems />}
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

    const statusCheckbox = await screen.findByTestId('statusCheckbox1');
    expect(statusCheckbox).toBeInTheDocument();
    userEvent.click(statusCheckbox);

    await waitFor(() =>
      expect(screen.getByText(t.actionItemStatus)).toBeInTheDocument(),
    );
    userEvent.click(screen.getByTestId('modalCloseBtn'));
    await waitFor(() =>
      expect(screen.queryByTestId('modalCloseBtn')).toBeNull(),
    );
  });

  it('Search action items by assignee', async () => {
    render(
      <MockedProvider addTypename={false} link={link1}>
        <MemoryRouter initialEntries={['/orgactionitems/orgId']}>
          <Provider store={store}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18n}>
                <Routes>
                  <Route
                    path="/orgactionitems/:orgId"
                    element={<OrganizationActionItems />}
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

    const searchByToggle = await screen.findByTestId('searchByToggle');
    expect(searchByToggle).toBeInTheDocument();

    userEvent.click(searchByToggle);
    await waitFor(() => {
      expect(screen.getByTestId('assignee')).toBeInTheDocument();
    });

    userEvent.click(screen.getByTestId('assignee'));

    const searchInput = await screen.findByTestId('searchBy');
    expect(searchInput).toBeInTheDocument();

    userEvent.type(searchInput, 'John');
    await debounceWait();

    await waitFor(() => {
      expect(screen.getByText('Category 1')).toBeInTheDocument();
      expect(screen.queryByText('Category 2')).toBeNull();
    });
  });

  it('Search action items by category', async () => {
    render(
      <MockedProvider addTypename={false} link={link1}>
        <MemoryRouter initialEntries={['/orgactionitems/orgId']}>
          <Provider store={store}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18n}>
                <Routes>
                  <Route
                    path="/orgactionitems/:orgId"
                    element={<OrganizationActionItems />}
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

    const searchByToggle = await screen.findByTestId('searchByToggle');
    expect(searchByToggle).toBeInTheDocument();

    userEvent.click(searchByToggle);
    await waitFor(() => {
      expect(screen.getByTestId('category')).toBeInTheDocument();
    });

    userEvent.click(screen.getByTestId('category'));

    const searchInput = await screen.findByTestId('searchBy');
    expect(searchInput).toBeInTheDocument();

    userEvent.type(searchInput, 'Category 1');
    await debounceWait();

    await waitFor(() => {
      expect(screen.getByText('Category 1')).toBeInTheDocument();
      expect(screen.queryByText('Category 2')).toBeNull();
    });
  });

  it('should render Empty Action Item Categories Screen', async () => {
    render(
      <MockedProvider addTypename={false} link={link3}>
        <MemoryRouter initialEntries={['/orgactionitems/orgId']}>
          <Provider store={store}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18n}>
                <Routes>
                  <Route
                    path="/orgactionitems/:orgId"
                    element={<OrganizationActionItems />}
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
    await waitFor(() => {
      expect(screen.getByTestId('searchBy')).toBeInTheDocument();
      expect(screen.getByText(t.noActionItems)).toBeInTheDocument();
    });
  });

  it('should render the Action Item Categories Screen with error', async () => {
    render(
      <MockedProvider addTypename={false} link={link2}>
        <MemoryRouter initialEntries={['/orgactionitems/orgId']}>
          <Provider store={store}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18n}>
                <Routes>
                  <Route
                    path="/orgactionitems/:orgId"
                    element={<OrganizationActionItems />}
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
    await waitFor(() => {
      expect(screen.getByTestId('errorMsg')).toBeInTheDocument();
    });
  });
});
