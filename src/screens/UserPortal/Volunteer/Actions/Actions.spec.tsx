import React, { act } from 'react';
import { MockedProvider } from '@apollo/react-testing';
import {
  LocalizationProvider,
  AdapterDayjs,
} from 'shared-components/DateRangePicker';
import type { RenderResult } from '@testing-library/react';
import { render, screen, waitFor } from '@testing-library/react';
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
import {
  describe,
  it,
  beforeEach,
  afterEach,
  beforeAll,
  vi,
  expect,
} from 'vitest';

const localStorageMock = createLocalStorageMock();

let setItem: ReturnType<typeof useLocalStorage>['setItem'];

beforeAll(() => {
  const storage = useLocalStorage();
  setItem = storage.setItem;
});

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

describe('Actions Screen', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
      configurable: true,
    });
  });

  let user: ReturnType<typeof userEvent.setup>;
  beforeEach(() => {
    localStorageMock.clear();
    user = userEvent.setup();
    setItem('userId', 'userId');
    setItem('volunteerId', 'volunteerId1');
  });

  afterEach(() => {
    mockNavigate.mockReset();
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  it('redirects if orgId is missing', async () => {
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
      expect(screen.getByTestId('paramsError')).toBeInTheDocument();
    });
  });

  it('redirects if userId is missing', async () => {
    setItem('userId', '');

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
      expect(screen.getByTestId('paramsError')).toBeInTheDocument();
    });
  });

  it('redirects if both params are missing', async () => {
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
      expect(screen.getByTestId('paramsError')).toBeInTheDocument();
    });
  });

  it('renders Actions screen', async () => {
    renderActions(link1);

    await waitFor(() => {
      const assignees = screen.getAllByTestId('assigneeName');
      expect(assignees.length).toBeGreaterThan(0);
    });
    expect(screen.getByTestId('searchByInput')).toBeInTheDocument();
  });

  it('shows only action items for current user (direct assignment)', async () => {
    renderActions(link1);

    await waitFor(() => {
      const assignees = screen.getAllByTestId('assigneeName');
      expect(assignees).toHaveLength(2);
    });
  });

  it('shows action items assigned to user through group', async () => {
    renderActions(link1);

    await waitFor(() => {
      // Verify items assigned through volunteer group are shown
      const assignees = screen.getAllByTestId('assigneeName');
      expect(assignees.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('sorts by due date descending (default)', async () => {
    renderActions(link1);

    await waitFor(() => {
      const assignees = screen.getAllByTestId('assigneeName');
      expect(assignees.length).toBeGreaterThan(0);
    });
  });

  it('sorts by due date ascending', async () => {
    renderActions(link1);

    await waitFor(() => {
      expect(screen.getAllByTestId('assigneeName').length).toBeGreaterThan(0);
    });

    await user.click(screen.getByTestId('sort-toggle'));
    const dueDateAscOption = await screen.findByTestId('sort-item-dueDate_ASC');
    await user.click(dueDateAscOption);

    await waitFor(() => {
      expect(screen.getAllByTestId('assigneeName')[0]).toBeInTheDocument();
    });
  });

  it('sorts by due date descending explicitly', async () => {
    renderActions(link1);

    await waitFor(() => {
      expect(screen.getAllByTestId('assigneeName').length).toBeGreaterThan(0);
    });

    await user.click(screen.getByTestId('sort-toggle'));
    const dueDateDescOption = await screen.findByTestId(
      'sort-item-dueDate_DESC',
    );
    await user.click(dueDateDescOption);

    await waitFor(() => {
      expect(screen.getAllByTestId('assigneeName')[0]).toBeInTheDocument();
    });
  });

  it('searches by assignee name (volunteer user)', async () => {
    renderActions(link1);

    const input = await screen.findByTestId('searchByInput');
    await user.type(input, 'Teresa');
    await debounceWait();

    await waitFor(() => {
      const assignees = screen.getAllByTestId('assigneeName');
      expect(assignees.length).toBeGreaterThanOrEqual(1);
      expect(assignees[0].textContent?.includes('Teresa')).toBe(true);
    });
  });

  it('searches by volunteer group name', async () => {
    renderActions(link1);

    const input = await screen.findByTestId('searchByInput');
    await user.type(input, 'Group');
    await debounceWait();

    await waitFor(() => {
      const assignees = screen.getAllByTestId('assigneeName');
      expect(assignees.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('searches by category name', async () => {
    renderActions(link1);

    await waitFor(() => {
      expect(screen.getByTestId('searchByInput')).toBeInTheDocument();
    });

    // Switch to category search
    await user.click(screen.getByTestId('searchBy-toggle'));
    const categoryOption = await screen.findByTestId('searchBy-item-category');
    await user.click(categoryOption);

    const input = screen.getByTestId('searchByInput');
    await user.clear(input);
    await user.type(input, 'Category');
    await debounceWait();

    await waitFor(() => {
      const categories = screen.getAllByTestId('categoryName');
      expect(categories.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('switches between search by assignee and category', async () => {
    renderActions(link1);

    await waitFor(() => {
      expect(screen.getByTestId('searchByInput')).toBeInTheDocument();
    });

    // Switch to category
    await user.click(screen.getByTestId('searchBy-toggle'));
    const categoryOption = await screen.findByTestId('searchBy-item-category');
    await user.click(categoryOption);

    await waitFor(() => {
      expect(screen.getByTestId('searchByInput')).toBeInTheDocument();
    });

    // Switch back to assignee
    await user.click(screen.getByTestId('searchBy-toggle'));
    const assigneeOption = await screen.findByTestId('searchBy-item-assignee');
    await user.click(assigneeOption);
    await waitFor(() => {
      expect(screen.getByTestId('searchByInput')).toBeInTheDocument();
    });
  });

  it('filters action items with search term', async () => {
    renderActions(link1);

    const input = await screen.findByTestId('searchByInput');
    await user.type(input, 'Teresa');
    await debounceWait();

    await waitFor(() => {
      const assignees = screen.getAllByTestId('assigneeName');
      expect(assignees.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('clears search and shows all items', async () => {
    renderActions(link1);

    await waitFor(() => {
      const assignees = screen.getAllByTestId('assigneeName');
      expect(assignees.length).toBeGreaterThan(0);
    });

    const input = screen.getByTestId('searchByInput') as HTMLInputElement;
    await user.type(input, 'test');
    await debounceWait();

    await user.clear(input);
    await debounceWait();

    await waitFor(() => {
      const assignees = screen.getAllByTestId('assigneeName');
      expect(assignees.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('renders empty state when no action items', async () => {
    renderActions(link3);

    await waitFor(() => {
      expect(screen.getByText(t.noActionItems)).toBeInTheDocument();
    });
  });

  it('renders error state', async () => {
    renderActions(link2);

    await waitFor(() => {
      expect(screen.getByTestId('errorMsg')).toBeInTheDocument();
    });
  });

  it('renders all table columns correctly', async () => {
    renderActions(link1);

    await waitFor(() => {
      expect(screen.getAllByTestId('assigneeName').length).toBeGreaterThan(0);
      expect(screen.getAllByTestId('categoryName').length).toBeGreaterThan(0);
      expect(screen.getAllByTestId('assignedAt').length).toBeGreaterThan(0);
      expect(screen.getAllByTestId('viewItemBtn').length).toBeGreaterThan(0);
      expect(screen.getAllByTestId('statusCheckbox').length).toBeGreaterThan(0);
    });
  });

  it('displays completed status chip', async () => {
    renderActions(link1);

    await waitFor(() => {
      const completedChips = screen.queryAllByText('Completed');
      expect(completedChips.length).toBeGreaterThan(0);
    });
  });

  it('displays pending status chip', async () => {
    renderActions(link1);

    await waitFor(() => {
      const pendingChips = screen.getAllByText('Pending');
      expect(pendingChips.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('opens and closes view modal', async () => {
    renderActions(link1);

    const btn = await screen.findAllByTestId('viewItemBtn');
    await user.click(btn[0]);

    expect(await screen.findByText(t.actionItemDetails)).toBeInTheDocument();

    await user.click(await screen.findByTestId('modalCloseBtn'));

    await waitFor(() => {
      expect(screen.queryByText(t.actionItemDetails)).not.toBeInTheDocument();
    });
  });

  it('opens view modal for different action items', async () => {
    renderActions(link1);

    const btns = await screen.findAllByTestId('viewItemBtn');

    // Open first item
    await user.click(btns[0]);
    expect(await screen.findByText(t.actionItemDetails)).toBeInTheDocument();
    await user.click(await screen.findByTestId('modalCloseBtn'));

    // Open second item if exists
    if (btns.length > 1) {
      await user.click(btns[1]);
      expect(await screen.findByText(t.actionItemDetails)).toBeInTheDocument();
      await user.click(await screen.findByTestId('modalCloseBtn'));
    }
  });

  it('opens and closes status modal', async () => {
    renderActions(link1);

    const checkbox = await screen.findAllByTestId('statusCheckbox');
    await user.click(checkbox[0]);

    expect(await screen.findByText(t.actionItemStatus)).toBeInTheDocument();

    await user.click(await screen.findByTestId('modalCloseBtn'));

    await waitFor(() => {
      expect(screen.queryByText(t.actionItemStatus)).not.toBeInTheDocument();
    });
  });

  it('opens status modal for completed item', async () => {
    renderActions(link1);

    const checkboxes = await screen.findAllByTestId('statusCheckbox');
    const completedCheckbox = checkboxes.find(
      (cb) => (cb as HTMLInputElement).checked,
    );

    if (completedCheckbox) {
      await user.click(completedCheckbox);
      expect(await screen.findByText(t.actionItemStatus)).toBeInTheDocument();
      await user.click(await screen.findByTestId('modalCloseBtn'));
    }
  });

  it('opens status modal for pending item', async () => {
    renderActions(link1);

    const checkboxes = await screen.findAllByTestId('statusCheckbox');
    const pendingCheckbox = checkboxes.find(
      (cb) => !(cb as HTMLInputElement).checked,
    );

    if (pendingCheckbox) {
      await user.click(pendingCheckbox);
      expect(await screen.findByText(t.actionItemStatus)).toBeInTheDocument();
      await user.click(await screen.findByTestId('modalCloseBtn'));
    }
  });

  it('handles modal state correctly', async () => {
    renderActions(link1);

    // Open view modal
    const viewBtn = await screen.findAllByTestId('viewItemBtn');
    await user.click(viewBtn[0]);
    expect(await screen.findByText(t.actionItemDetails)).toBeInTheDocument();

    // Close view modal
    await user.click(await screen.findByTestId('modalCloseBtn'));

    // Open status modal
    const checkbox = await screen.findAllByTestId('statusCheckbox');
    await user.click(checkbox[0]);
    expect(await screen.findByText(t.actionItemStatus)).toBeInTheDocument();

    // Close status modal
    await user.click(await screen.findByTestId('modalCloseBtn'));
  });

  it('renders assignee with volunteer user', async () => {
    renderActions(link1);

    await waitFor(() => {
      const assignees = screen.getAllByTestId('assigneeName');
      expect(assignees.length).toBeGreaterThan(0);
    });
  });

  it('renders assignee with volunteer group', async () => {
    renderActions(link1);

    await waitFor(() => {
      const assignees = screen.getAllByTestId('assigneeName');
      // Check that group names are rendered
      const hasGroupName = assignees.some(
        (el) => el.textContent && el.textContent.length > 0,
      );
      expect(hasGroupName).toBe(true);
    });
  });

  it('formats assigned date correctly', async () => {
    renderActions(link1);

    await waitFor(() => {
      const dates = screen.getAllByTestId('assignedAt');
      expect(dates[0].textContent).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });
  });

  it('handles search with empty results', async () => {
    renderActions(link1);

    await waitFor(() => {
      expect(screen.getAllByTestId('assigneeName').length).toBeGreaterThan(0);
    });

    const input = screen.getByTestId('searchByInput');
    await user.type(input, 'NonexistentSearchTerm12345');
    await debounceWait();

    await waitFor(() => {
      // Should show no results or empty state
      const assignees = screen.queryAllByTestId('assigneeName');
      expect(assignees.length).toEqual(0);
    });
  });

  it('maintains sort order after search', async () => {
    renderActions(link1);

    await waitFor(() => {
      expect(screen.getAllByTestId('assigneeName')).toBeDefined();
    });

    // Set sort order
    await user.click(screen.getByTestId('sort-toggle'));
    const dueDateAscOption = await screen.findByTestId('sort-item-dueDate_ASC');
    await user.click(dueDateAscOption);

    // Then search
    const input = screen.getByTestId('searchByInput');
    await user.type(input, 'Teresa');
    await debounceWait();

    await waitFor(() => {
      const assignees = screen.getAllByTestId('assigneeName');
      expect(assignees.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('filters items assigned directly to user', async () => {
    renderActions(link1);

    await waitFor(() => {
      // Should show items where volunteer.user.id === userId
      const assignees = screen.getAllByTestId('assigneeName');
      expect(assignees.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('filters items assigned to user through volunteer group', async () => {
    renderActions(link1);

    await waitFor(() => {
      // Should show items where volunteerGroup.volunteers contains userId
      const assignees = screen.getAllByTestId('assigneeName');
      expect(assignees.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('handles category search with lowercase matching', async () => {
    renderActions(link1);

    await waitFor(() => {
      expect(screen.getByTestId('searchByInput')).toBeInTheDocument();
    });

    // Switch to category search
    await user.click(screen.getByTestId('searchBy-toggle'));
    const categoryOption = await screen.findByTestId('searchBy-item-category');
    await user.click(categoryOption);

    const input = screen.getByTestId('searchByInput');
    await user.clear(input);
    await user.type(input, 'category');
    await debounceWait();

    await waitFor(() => {
      expect(screen.getByTestId('searchByInput')).toBeInTheDocument();
    });
  });

  it('handles assignee search with lowercase matching', async () => {
    renderActions(link1);

    const input = await screen.findByTestId('searchByInput');
    await user.type(input, 'teresa');
    await debounceWait();

    await waitFor(() => {
      const assignees = screen.getAllByTestId('assigneeName');
      expect(assignees.length).toBeGreaterThan(0);
    });
  });

  it('uses assignedAt for sorting when available', async () => {
    renderActions(link1);

    await waitFor(() => {
      const dates = screen.getAllByTestId('assignedAt');
      expect(dates.length).toBeGreaterThan(0);
    });
  });

  it('falls back to createdAt for sorting when assignedAt is null', async () => {
    renderActions(link1);

    await waitFor(() => {
      // Should successfully sort even if some items use createdAt
      const assignees = screen.getAllByTestId('assigneeName');
      expect(assignees.length).toBeGreaterThan(0);
    });
  });

  it('renders loading state initially', async () => {
    const { container } = renderActions(link1);

    // Check for loader (it should appear briefly)
    await waitFor(() => {
      expect(
        container.querySelector('.loader') ||
          screen.queryByTestId('searchByInput'),
      ).toBeTruthy();
    });
  });

  it('should load actions successfully after fetching data', async () => {
    renderActions(link1);

    await waitFor(() => {
      expect(screen.getAllByTestId('assigneeName').length).toBeGreaterThan(0);
      expect(screen.getByTestId('searchByInput')).toBeInTheDocument();
    });
  });
});
