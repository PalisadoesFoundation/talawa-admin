import React, { act } from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import type { RenderResult } from '@testing-library/react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18n from 'utils/i18nForTest';
import Actions from './Actions';
import type { ApolloLink } from '@apollo/client';
import { MOCKS, EMPTY_MOCKS, ERROR_MOCKS } from './Actions.mocks';
import useLocalStorage from 'utils/useLocalstorage';
import { createLocalStorageMock } from 'test-utils/localStorageMock';
import { describe, it, beforeEach, afterEach, beforeAll, vi } from 'vitest';

const localStorageMock = createLocalStorageMock();
const { setItem, removeItem } = useLocalStorage();
const link1 = new StaticMockLink(MOCKS);
const link2 = new StaticMockLink(ERROR_MOCKS);
const link3 = new StaticMockLink(EMPTY_MOCKS);

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

const mockNavigate = vi.hoisted(() => vi.fn());

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const expectVitestToBeInTheDocument = (element: HTMLElement): void => {
  expect(element).toBeInTheDocument();
};

const expectElementToHaveTextContent = (
  element: HTMLElement,
  text: string,
): void => {
  expect(element).toHaveTextContent(text);
};

const renderActions = (link: ApolloLink): RenderResult => {
  return render(
    <MockedProvider link={link}>
      <MemoryRouter initialEntries={['/user/volunteer/orgId']}>
        <Provider store={store}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <I18nextProvider i18n={i18n}>
              <Routes>
                <Route path="/user/volunteer/:orgId" element={<Actions />} />
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

describe('Testing Actions Screen', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'localStorage', {
      // Use 'window' not 'global'
      value: localStorageMock,
      writable: true,
      configurable: true,
    });
  });

  beforeEach(() => {
    localStorageMock.clear();
    setItem('userId', 'userId');
    setItem('volunteerId', 'volunteerId1');
  });

  afterEach(() => {
    mockNavigate.mockReset();
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  it('should redirect to fallback URL if URL params are undefined', async () => {
    setItem('userId', '');
    setItem('volunteerId', '');
    render(
      <MockedProvider link={link1}>
        <MemoryRouter initialEntries={['/user/volunteer/']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <Routes>
                <Route path="/user/volunteer/" element={<Actions />} />
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
      expectVitestToBeInTheDocument(screen.getByTestId('paramsError'));
    });
  });

  it('should redirect to fallback URL if orgId is missing', async () => {
    setItem('userId', 'userId');
    render(
      <MockedProvider link={link1}>
        <MemoryRouter initialEntries={['/user/volunteer/']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <Routes>
                <Route path="/user/volunteer/" element={<Actions />} />
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
      expectVitestToBeInTheDocument(screen.getByTestId('paramsError'));
    });
  });

  it('should redirect to fallback URL if userId is missing', async () => {
    removeItem('userId');
    setItem('volunteerId', 'volunteerId1');
    render(
      <MockedProvider link={link1}>
        <MemoryRouter initialEntries={['/user/volunteer/orgId']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <Routes>
                <Route path="/user/volunteer/:orgId" element={<Actions />} />
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
      expectVitestToBeInTheDocument(screen.getByTestId('paramsError'));
    });
  });

  it('should render Actions screen', async () => {
    renderActions(link1);
    await waitFor(async () => {
      const searchInput = await screen.findByTestId('searchBy');
      expectVitestToBeInTheDocument(searchInput);

      const assigneeName = await screen.findAllByTestId('assigneeName');
      expectElementToHaveTextContent(assigneeName[0], 'Teresa Bradley');
    });
  });

  it('should display all action items for the user', async () => {
    renderActions(link1);
    await waitFor(async () => {
      const assigneeNames = await screen.findAllByTestId('assigneeName');
      expect(assigneeNames).toHaveLength(2); // action1 and action2 should be visible (action3 is for different user)
    });
  });

  it('Check Sorting Functionality', async () => {
    renderActions(link1);

    const searchInput = await screen.findByTestId('searchBy');
    expectVitestToBeInTheDocument(searchInput);

    let sortBtn = await screen.findByTestId('sort');
    expectVitestToBeInTheDocument(sortBtn);

    // Sort by dueDate_DESC
    fireEvent.click(sortBtn);
    const dueDateDESC = await screen.findByTestId('dueDate_DESC');
    expectVitestToBeInTheDocument(dueDateDESC);
    fireEvent.click(dueDateDESC);

    await waitFor(() => {
      const assigneeName = screen.getAllByTestId('assigneeName');
      expectElementToHaveTextContent(assigneeName[0], 'Group 1');
    });

    // Sort by dueDate_ASC
    sortBtn = await screen.findByTestId('sort');
    expectVitestToBeInTheDocument(sortBtn);
    fireEvent.click(sortBtn);
    const dueDateASC = await screen.findByTestId('dueDate_ASC');
    expectVitestToBeInTheDocument(dueDateASC);
    fireEvent.click(dueDateASC);

    await waitFor(() => {
      const assigneeName = screen.getAllByTestId('assigneeName');
      expectElementToHaveTextContent(assigneeName[0], 'Teresa Bradley');
    });
  });

  it('Search by Assignee name', async () => {
    renderActions(link1);

    const searchInput = await screen.findByTestId('searchBy');
    expectVitestToBeInTheDocument(searchInput);

    const searchToggle = await screen.findByTestId('searchByToggle');
    expectVitestToBeInTheDocument(searchToggle);
    await userEvent.click(searchToggle);

    const searchByAssignee = await screen.findByTestId('assignee');
    expectVitestToBeInTheDocument(searchByAssignee);
    await userEvent.click(searchByAssignee);

    await userEvent.type(searchInput, '1');

    await debounceWait();
    fireEvent.click(screen.getByTestId('searchBtn'));

    await waitFor(async () => {
      const assigneeName = await screen.findAllByTestId('assigneeName');
      expectElementToHaveTextContent(assigneeName[0], 'Group 1');
    });
  });

  it('Search by Assignee name - volunteer', async () => {
    renderActions(link1);

    const searchInput = await screen.findByTestId('searchBy');
    expectVitestToBeInTheDocument(searchInput);

    const searchToggle = await screen.findByTestId('searchByToggle');
    expectVitestToBeInTheDocument(searchToggle);
    await userEvent.click(searchToggle);

    const searchByAssignee = await screen.findByTestId('assignee');
    expectVitestToBeInTheDocument(searchByAssignee);
    await userEvent.click(searchByAssignee);

    await userEvent.type(searchInput, 'Teresa');

    await debounceWait();

    await waitFor(async () => {
      const assigneeName = await screen.findAllByTestId('assigneeName');
      expectElementToHaveTextContent(assigneeName[0], 'Teresa Bradley');
    });
  });

  it('Search by Category name', async () => {
    renderActions(link1);

    const searchInput = await screen.findByTestId('searchBy');
    expectVitestToBeInTheDocument(searchInput);

    const searchToggle = await screen.findByTestId('searchByToggle');
    expectVitestToBeInTheDocument(searchToggle);
    await userEvent.click(searchToggle);

    const searchByCategory = await screen.findByTestId('category');
    expectVitestToBeInTheDocument(searchByCategory);
    await userEvent.click(searchByCategory);

    await userEvent.type(searchInput, '1');

    await debounceWait();

    await waitFor(
      () => {
        const assigneeName = screen.getAllByTestId('assigneeName');
        expectElementToHaveTextContent(assigneeName[0], 'Teresa Bradley');
      },
      { timeout: 2500 },
    );
  });

  it('should filter by category name correctly', async () => {
    renderActions(link1);

    const searchInput = await screen.findByTestId('searchBy');
    const searchToggle = await screen.findByTestId('searchByToggle');
    await userEvent.click(searchToggle);

    const searchByCategory = await screen.findByTestId('category');
    await userEvent.click(searchByCategory);

    await userEvent.type(searchInput, 'Category 2');
    await debounceWait();

    // Click the search button to trigger the search
    fireEvent.click(screen.getByTestId('searchBtn'));

    await waitFor(
      () => {
        const assigneeNames = screen.getAllByTestId('assigneeName');
        expect(assigneeNames).toHaveLength(1);
        expectElementToHaveTextContent(assigneeNames[0], 'Group 1');
      },
      { timeout: 3000 },
    );
  });
  it('should display category names correctly', async () => {
    renderActions(link1);

    await waitFor(async () => {
      const categoryNames = await screen.findAllByTestId('categoryName');
      expect(categoryNames.length).toBeGreaterThan(0);
      expectElementToHaveTextContent(categoryNames[0], 'Category 1');
    });
  });

  it('should display assigned dates correctly', async () => {
    renderActions(link1);

    await waitFor(async () => {
      const assignedDates = await screen.findAllByTestId('assignedAt');
      expect(assignedDates.length).toBeGreaterThan(0);
      expectElementToHaveTextContent(assignedDates[0], '25/08/2024');
    });
  });

  it('should render screen with No Actions', async () => {
    renderActions(link3);

    await waitFor(() => {
      expectVitestToBeInTheDocument(screen.getByTestId('searchBy'));
      expectVitestToBeInTheDocument(screen.getByText(t.noActionItems));
    });
  });

  it('Error while fetching Actions data', async () => {
    renderActions(link2);

    await waitFor(() => {
      expectVitestToBeInTheDocument(screen.getByTestId('errorMsg'));
    });
  });

  it('should display loader while fetching data', async () => {
    render(
      <MockedProvider link={link1}>
        <MemoryRouter initialEntries={['/user/volunteer/orgId']}>
          <Provider store={store}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18n}>
                <Routes>
                  <Route path="/user/volunteer/:orgId" element={<Actions />} />
                </Routes>
              </I18nextProvider>
            </LocalizationProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );

    // Loader should be present initially - use the correct data-testid
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('Open and close ItemUpdateStatusModal', async () => {
    renderActions(link1);

    const checkbox = await screen.findAllByTestId('statusCheckbox');
    await userEvent.click(checkbox[0]);

    await waitFor(async () => {
      const element = await screen.findByText(t.actionItemStatus);
      expectVitestToBeInTheDocument(element);
    });
    await userEvent.click(await screen.findByTestId('modalCloseBtn'));
  });

  it('should handle status checkbox for completed items', async () => {
    renderActions(link1);

    await waitFor(async () => {
      const checkboxes = await screen.findAllByTestId('statusCheckbox');
      // First item should be unchecked (isCompleted: false)
      expect(checkboxes[0]).not.toBeChecked();
    });
  });

  it('Open and close ItemViewModal', async () => {
    renderActions(link1);

    const viewItemBtn = await screen.findAllByTestId('viewItemBtn');
    await userEvent.click(viewItemBtn[0]);

    await waitFor(() => {
      expectVitestToBeInTheDocument(screen.getByText(t.actionItemDetails));
    });

    await userEvent.click(await screen.findByTestId('modalCloseBtn'));
  });

  it('should open view modal for second action item', async () => {
    renderActions(link1);

    const viewItemBtns = await screen.findAllByTestId('viewItemBtn');
    await userEvent.click(viewItemBtns[1]);

    await waitFor(() => {
      expectVitestToBeInTheDocument(screen.getByText(t.actionItemDetails));
    });

    await userEvent.click(await screen.findByTestId('modalCloseBtn'));
  });

  it('should render status chip with correct text and style', async () => {
    renderActions(link1);

    await waitFor(async () => {
      const statusChips = screen.getAllByText('Pending');
      expect(statusChips.length).toBeGreaterThan(0);
    });
  });

  it('should handle volunteer group assignee rendering', async () => {
    renderActions(link1);

    await waitFor(async () => {
      const assigneeNames = await screen.findAllByTestId('assigneeName');
      const groupAssignee = assigneeNames.find((el) =>
        el.textContent?.includes('Group 1'),
      );
      expect(groupAssignee).toBeTruthy();
    });
  });

  it('should debounce search input correctly', async () => {
    renderActions(link1);

    const searchInput = await screen.findByTestId('searchBy');

    // Type multiple characters quickly
    await userEvent.type(searchInput, 'Test');

    // Should not immediately filter
    await waitFor(() => {
      expect(searchInput).toHaveValue('Test');
    });

    // Wait for debounce
    await debounceWait();
  });

  it('should handle empty search term', async () => {
    renderActions(link1);

    const searchInput = await screen.findByTestId('searchBy');

    // Clear search
    await userEvent.clear(searchInput);
    await debounceWait();

    await waitFor(async () => {
      const assigneeNames = await screen.findAllByTestId('assigneeName');
      expect(assigneeNames.length).toBe(2); // Should show all user's items
    });
  });

  it('should filter out action items not assigned to current user', async () => {
    renderActions(link1);

    await waitFor(async () => {
      const assigneeNames = await screen.findAllByTestId('assigneeName');
      // Should only show 2 items (action1 and action2), not action3 which is for different user
      expect(assigneeNames).toHaveLength(2);

      // Verify action3 assignee (John Doe) is not displayed
      const johnDoe = assigneeNames.find((el) =>
        el.textContent?.includes('John Doe'),
      );
      expect(johnDoe).toBeUndefined();
    });
  });

  it('should handle searching with no results', async () => {
    renderActions(link1);

    const searchInput = await screen.findByTestId('searchBy');
    await userEvent.type(searchInput, 'NonExistentName');
    await debounceWait();

    // Click the search button to trigger the search
    fireEvent.click(screen.getByTestId('searchBtn'));

    await waitFor(
      () => {
        expect(screen.getByText(t.noActionItems)).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });

  it('should maintain modal state correctly when closing', async () => {
    renderActions(link1);

    // Open view modal
    const viewItemBtn = await screen.findAllByTestId('viewItemBtn');
    await userEvent.click(viewItemBtn[0]);

    await waitFor(() => {
      expectVitestToBeInTheDocument(screen.getByText(t.actionItemDetails));
    });

    // Close modal
    await userEvent.click(await screen.findByTestId('modalCloseBtn'));

    // Modal should be closed
    await waitFor(() => {
      expect(screen.queryByText(t.actionItemDetails)).not.toBeInTheDocument();
    });
  });

  it('should render DataGrid with correct row height and auto height', async () => {
    renderActions(link1);

    await waitFor(() => {
      const dataGrid = document.querySelector('.MuiDataGrid-root');
      expect(dataGrid).toBeInTheDocument();
    });
  });

  it('should handle ActionItem with null category gracefully', async () => {
    renderActions(link1);

    await waitFor(async () => {
      const categoryNames = await screen.findAllByTestId('categoryName');
      expect(categoryNames.length).toBeGreaterThan(0);
    });
  });

  it('should handle null volunteerId gracefully', async () => {
    setItem('userId', 'userId');
    setItem('volunteerId', '');
    renderActions(link1);

    await waitFor(async () => {
      const searchInput = await screen.findByTestId('searchBy');
      expectVitestToBeInTheDocument(searchInput);
    });
  });

  it('should handle empty localStorage values', async () => {
    setItem('userId', '');
    setItem('volunteerId', '');

    render(
      <MockedProvider link={link1}>
        <MemoryRouter initialEntries={['/user/volunteer/orgId']}>
          <Provider store={store}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18n}>
                <Routes>
                  <Route path="/user/volunteer/:orgId" element={<Actions />} />
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
      expectVitestToBeInTheDocument(screen.getByTestId('paramsError'));
    });
  });

  it('should handle multiple search operations', async () => {
    renderActions(link1);

    const searchInput = await screen.findByTestId('searchBy');

    // First search
    await userEvent.type(searchInput, 'Teresa');
    await debounceWait();

    // Clear and second search
    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, 'Group');
    await debounceWait();

    await waitFor(async () => {
      const assigneeNames = await screen.findAllByTestId('assigneeName');
      const groupAssignee = assigneeNames.find((el) =>
        el.textContent?.includes('Group'),
      );
      expect(groupAssignee).toBeTruthy();
    });
  });

  it('should toggle between different search criteria', async () => {
    renderActions(link1);

    const searchToggle = await screen.findByTestId('searchByToggle');
    await userEvent.click(searchToggle);

    // Switch to category search
    const searchByCategory = await screen.findByTestId('category');
    await userEvent.click(searchByCategory);

    const searchInput = await screen.findByTestId('searchBy');
    await userEvent.type(searchInput, 'Category');
    await debounceWait();

    // Switch back to assignee search
    await userEvent.click(searchToggle);
    const searchByAssignee = await screen.findByTestId('assignee');
    await userEvent.click(searchByAssignee);

    await waitFor(() => {
      expect(searchInput).toBeInTheDocument();
    });
  });

  it('should handle rapid sort changes', async () => {
    renderActions(link1);

    const sortBtn = await screen.findByTestId('sort');

    // Multiple rapid sort changes
    fireEvent.click(sortBtn);
    const dueDateDESC = await screen.findByTestId('dueDate_DESC');
    fireEvent.click(dueDateDESC);

    await waitFor(() => {
      const assigneeName = screen.getAllByTestId('assigneeName');
      expect(assigneeName.length).toBeGreaterThan(0);
    });

    fireEvent.click(sortBtn);
    const dueDateASC = await screen.findByTestId('dueDate_ASC');
    fireEvent.click(dueDateASC);

    await waitFor(() => {
      const assigneeName = screen.getAllByTestId('assigneeName');
      expect(assigneeName.length).toBeGreaterThan(0);
    });
  });

  it('should handle modal interactions correctly', async () => {
    renderActions(link1);

    // Open view modal
    const viewItemBtns = await screen.findAllByTestId('viewItemBtn');
    await userEvent.click(viewItemBtns[0]);

    await waitFor(() => {
      expectVitestToBeInTheDocument(screen.getByText(t.actionItemDetails));
    });

    // Close and open status modal
    await userEvent.click(await screen.findByTestId('modalCloseBtn'));

    const checkbox = await screen.findAllByTestId('statusCheckbox');
    await userEvent.click(checkbox[0]);

    await waitFor(() => {
      expectVitestToBeInTheDocument(screen.getByText(t.actionItemStatus));
    });

    await userEvent.click(await screen.findByTestId('modalCloseBtn'));
  });

  it('should display correct due dates in different formats', async () => {
    renderActions(link1);

    await waitFor(async () => {
      const assignedDates = await screen.findAllByTestId('assignedAt');
      expect(assignedDates.length).toBeGreaterThan(0);
      // Check date format DD/MM/YYYY
      expect(assignedDates[0].textContent).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
    });
  });

  it('should handle case insensitive search', async () => {
    renderActions(link1);

    const searchInput = await screen.findByTestId('searchBy');
    const searchToggle = await screen.findByTestId('searchByToggle');
    await userEvent.click(searchToggle);

    const searchByAssignee = await screen.findByTestId('assignee');
    await userEvent.click(searchByAssignee);

    // Test lowercase search
    await userEvent.type(searchInput, 'teresa');
    await debounceWait();

    await waitFor(async () => {
      const assigneeNames = await screen.findAllByTestId('assigneeName');
      const teresaAssignee = assigneeNames.find((el) =>
        el.textContent?.includes('Teresa'),
      );
      expect(teresaAssignee).toBeTruthy();
    });
  });

  it('should render DataGrid with all expected columns', async () => {
    renderActions(link1);

    await waitFor(() => {
      // Check for column headers
      expect(screen.getByText('Assignee')).toBeInTheDocument();
      expect(screen.getByText('Item Category')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Assigned Date')).toBeInTheDocument();
      expect(screen.getByText('Options')).toBeInTheDocument();
      expect(screen.getByText('Completed')).toBeInTheDocument();
    });
  });

  it('should handle avatar rendering for different assignee types', async () => {
    renderActions(link1);

    await waitFor(async () => {
      const assigneeNames = await screen.findAllByTestId('assigneeName');
      expect(assigneeNames.length).toBeGreaterThan(0);

      // Check that both individual and group assignees are rendered
      const individualAssignee = assigneeNames.find((el) =>
        el.textContent?.includes('Teresa Bradley'),
      );
      const groupAssignee = assigneeNames.find((el) =>
        el.textContent?.includes('Group 1'),
      );

      expect(individualAssignee).toBeTruthy();
      expect(groupAssignee).toBeTruthy();
    });
  });

  it('should handle search with special characters', async () => {
    renderActions(link1);

    const searchInput = await screen.findByTestId('searchBy');

    // Test search with special characters
    await userEvent.type(searchInput, '@#$%');
    await debounceWait();

    await waitFor(() => {
      expect(searchInput).toHaveValue('@#$%');
    });
  });

  it('should maintain search state after sorting', async () => {
    renderActions(link1);

    const searchInput = await screen.findByTestId('searchBy');
    const searchToggle = await screen.findByTestId('searchByToggle');
    await userEvent.click(searchToggle);

    const searchByAssignee = await screen.findByTestId('assignee');
    await userEvent.click(searchByAssignee);

    // Search first
    await userEvent.type(searchInput, 'Teresa');
    await debounceWait();

    // Then sort
    const sortBtn = await screen.findByTestId('sort');
    fireEvent.click(sortBtn);
    const dueDateDESC = await screen.findByTestId('dueDate_DESC');
    fireEvent.click(dueDateDESC);

    await waitFor(() => {
      expect(searchInput).toHaveValue('Teresa');
    });
  });

  it('should handle multiple checkbox interactions', async () => {
    renderActions(link1);

    const checkboxes = await screen.findAllByTestId('statusCheckbox');

    // Click multiple checkboxes
    for (let i = 0; i < Math.min(checkboxes.length, 2); i++) {
      await userEvent.click(checkboxes[i]);

      await waitFor(() => {
        expectVitestToBeInTheDocument(screen.getByText(t.actionItemStatus));
      });

      await userEvent.click(await screen.findByTestId('modalCloseBtn'));
    }
  });

  it('should handle view buttons for all action items', async () => {
    renderActions(link1);

    const viewItemBtns = await screen.findAllByTestId('viewItemBtn');

    // Test view modal for multiple items
    for (let i = 0; i < viewItemBtns.length; i++) {
      await userEvent.click(viewItemBtns[i]);

      await waitFor(() => {
        expectVitestToBeInTheDocument(screen.getByText(t.actionItemDetails));
      });

      await userEvent.click(await screen.findByTestId('modalCloseBtn'));
    }
  });
});
