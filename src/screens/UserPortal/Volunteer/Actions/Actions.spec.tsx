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

  it('redirects if params are missing', async () => {
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

    expect(await screen.findByTestId('searchByInput')).toBeInTheDocument();
    const assignees = await screen.findAllByTestId('assigneeName');
    expect(assignees.length).toBeGreaterThan(0);
  });

  it('shows only action items for current user', async () => {
    renderActions(link1);

    await waitFor(() => {
      const assignees = screen.getAllByTestId('assigneeName');
      expect(assignees).toHaveLength(2);
    });
  });

  it('sorts by due date', async () => {
    renderActions(link1);

    fireEvent.click(await screen.findByTestId('sort'));
    fireEvent.click(await screen.findByTestId('dueDate_ASC'));

    await waitFor(() => {
      expect(screen.getAllByTestId('assigneeName')[0]).toBeInTheDocument();
    });
  });

  it('searches by assignee', async () => {
    renderActions(link1);

    const input = await screen.findByTestId('searchByInput');
    await userEvent.type(input, 'Teresa');
    await debounceWait();

    await waitFor(() => {
      expect(
        screen
          .getAllByTestId('assigneeName')[0]
          .textContent?.includes('Teresa'),
      ).toBe(true);
    });
  });

  it('renders empty state', async () => {
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

  it('opens and closes view modal', async () => {
    renderActions(link1);

    const btn = await screen.findAllByTestId('viewItemBtn');
    await userEvent.click(btn[0]);

    expect(await screen.findByText(t.actionItemDetails)).toBeInTheDocument();

    await userEvent.click(await screen.findByTestId('modalCloseBtn'));
  });

  it('opens and closes status modal', async () => {
    renderActions(link1);

    const checkbox = await screen.findAllByTestId('statusCheckbox');
    await userEvent.click(checkbox[0]);

    expect(await screen.findByText(t.actionItemStatus)).toBeInTheDocument();

    await userEvent.click(await screen.findByTestId('modalCloseBtn'));
  });
});
