import React from 'react';
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
import i18n from 'utils/i18nForTest';
import OrganizationActionItems from 'screens/OrganizationActionItems/OrganizationActionItems';
import type { ApolloLink } from '@apollo/client';
import {
  MOCKS,
  MOCKS_EMPTY,
  MOCKS_ERROR,
} from './OrganizationActionItem.mocks';

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

const renderOrganizationActionItems = (link: ApolloLink): RenderResult => {
  return render(
    <MockedProvider addTypename={false} link={link}>
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
};

describe('Testing Organization Action Items Screen', () => {
  beforeAll(() => {
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useParams: () => ({ orgId: 'orgId', eventId: 'eventId' }),
    }));
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should redirect to fallback URL if URL params are undefined', async () => {
    render(
      <MockedProvider addTypename={false} link={link1}>
        <MemoryRouter initialEntries={['/orgactionitems/']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <Routes>
                <Route
                  path="/orgactionitems/"
                  element={<OrganizationActionItems />}
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

  it('should render Organization Action Items screen', async () => {
    renderOrganizationActionItems(link1);
    await waitFor(() => {
      expect(screen.getByTestId('searchBy')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    });
  });

  it('Sort Action Items descending by dueDate', async () => {
    renderOrganizationActionItems(link1);

    const sortBtn = await screen.findByTestId('sort');
    expect(sortBtn).toBeInTheDocument();

    // Sort by dueDate_DESC
    fireEvent.click(sortBtn);
    await waitFor(() => {
      expect(screen.getByTestId('dueDate_DESC')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('dueDate_DESC'));
    await waitFor(() => {
      expect(screen.getAllByTestId('categoryName')[0]).toHaveTextContent(
        'Category 2',
      );
    });
  });

  it('Sort Action Items ascending by dueDate', async () => {
    renderOrganizationActionItems(link1);

    const sortBtn = await screen.findByTestId('sort');
    expect(sortBtn).toBeInTheDocument();

    // Sort by dueDate_ASC
    fireEvent.click(sortBtn);
    await waitFor(() => {
      expect(screen.getByTestId('dueDate_ASC')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('dueDate_ASC'));
    await waitFor(() => {
      expect(screen.getAllByTestId('categoryName')[0]).toHaveTextContent(
        'Category 1',
      );
    });
  });

  it('Filter Action Items by status (All/Pending)', async () => {
    renderOrganizationActionItems(link1);

    const filterBtn = await screen.findByTestId('filter');
    expect(filterBtn).toBeInTheDocument();

    // Filter by All
    fireEvent.click(filterBtn);
    await waitFor(() => {
      expect(screen.getByTestId('statusAll')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('statusAll'));

    await waitFor(() => {
      expect(screen.getByText('Category 1')).toBeInTheDocument();
      expect(screen.getByText('Category 2')).toBeInTheDocument();
    });

    // Filter by Pending
    fireEvent.click(filterBtn);
    await waitFor(() => {
      expect(screen.getByTestId('statusPending')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('statusPending'));
    await waitFor(() => {
      expect(screen.queryByText('Category 1')).toBeNull();
      expect(screen.getByText('Category 2')).toBeInTheDocument();
    });
  });

  it('Filter Action Items by status (Completed)', async () => {
    renderOrganizationActionItems(link1);

    const filterBtn = await screen.findByTestId('filter');
    expect(filterBtn).toBeInTheDocument();

    fireEvent.click(filterBtn);
    await waitFor(() => {
      expect(screen.getByTestId('statusCompleted')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('statusCompleted'));
    await waitFor(() => {
      expect(screen.getByText('Category 1')).toBeInTheDocument();
      expect(screen.queryByText('Category 2')).toBeNull();
    });
  });

  it('open and close Item modal (create)', async () => {
    renderOrganizationActionItems(link1);

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
    renderOrganizationActionItems(link1);

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
    renderOrganizationActionItems(link1);

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
    renderOrganizationActionItems(link1);

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
    renderOrganizationActionItems(link1);

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
    renderOrganizationActionItems(link1);

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
    userEvent.click(screen.getByTestId('searchBtn'));
    await waitFor(() => {
      expect(screen.getByText('Category 1')).toBeInTheDocument();
      expect(screen.queryByText('Category 2')).toBeNull();
    });
  });

  it('Search action items by category', async () => {
    renderOrganizationActionItems(link1);

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
    userEvent.click(screen.getByTestId('searchBtn'));
    await waitFor(() => {
      expect(screen.getByText('Category 1')).toBeInTheDocument();
      expect(screen.queryByText('Category 2')).toBeNull();
    });
  });

  it('Search action items by name and clear the input by backspace', async () => {
    renderOrganizationActionItems(link1);

    const searchInput = await screen.findByTestId('searchBy');
    expect(searchInput).toBeInTheDocument();

    // Clear the search input by backspace
    userEvent.type(searchInput, 'A{backspace}');
    await waitFor(() => {
      expect(screen.getByText('Category 1')).toBeInTheDocument();
      expect(screen.getByText('Category 2')).toBeInTheDocument();
    });
  });

  it('Search action items by name on press of ENTER', async () => {
    renderOrganizationActionItems(link1);

    const searchInput = await screen.findByTestId('searchBy');
    expect(searchInput).toBeInTheDocument();

    userEvent.type(searchInput, 'John');
    userEvent.type(searchInput, '{enter}');
    await waitFor(() => {
      expect(screen.getByText('Category 1')).toBeInTheDocument();
      expect(screen.queryByText('Category 2')).toBeNull();
    });
  });

  it('should render Empty Action Item Categories Screen', async () => {
    renderOrganizationActionItems(link3);
    await waitFor(() => {
      expect(screen.getByTestId('searchBy')).toBeInTheDocument();
      expect(screen.getByText(t.noActionItems)).toBeInTheDocument();
    });
  });

  it('should render the Action Item Categories Screen with error', async () => {
    renderOrganizationActionItems(link2);
    await waitFor(() => {
      expect(screen.getByTestId('errorMsg')).toBeInTheDocument();
    });
  });
});
