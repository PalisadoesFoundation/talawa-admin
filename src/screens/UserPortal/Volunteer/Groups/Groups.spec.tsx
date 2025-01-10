import React, { act } from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import type { RenderResult } from '@testing-library/react';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18n from 'utils/i18nForTest';
import Groups from './Groups';
import type { ApolloLink } from '@apollo/client';
import { MOCKS, EMPTY_MOCKS, ERROR_MOCKS } from './Groups.mocks';
import useLocalStorage from 'utils/useLocalstorage';
import { vi } from 'vitest';

const { setItem } = useLocalStorage();

const link1 = new StaticMockLink(MOCKS);
const link2 = new StaticMockLink(ERROR_MOCKS);
const link3 = new StaticMockLink(EMPTY_MOCKS);
const t = {
  ...JSON.parse(
    JSON.stringify(
      i18n.getDataByLanguage('en')?.translation.eventVolunteers ?? {},
    ),
  ),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.common ?? {})),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.errors ?? {})),
};

/**
 * Introduces a delay for the specified duration.
 * This is primarily used to simulate debounce behavior in tests.
 * @param ms - The duration to delay in milliseconds. Defaults to 300ms.
 * @returns A Promise that resolves after the specified duration.
 */

const debounceWait = async (ms = 300): Promise<void> => {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
};

/**
 * Renders the Groups component using a specific Apollo link.
 * @param link - The ApolloLink instance to use for mocking GraphQL requests.
 * @returns The rendered component wrapped in test utilities.
 */
const renderGroups = (link: ApolloLink): RenderResult => {
  return render(
    <MockedProvider addTypename={false} link={link}>
      <MemoryRouter initialEntries={['/user/volunteer/orgId']}>
        <Provider store={store}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <I18nextProvider i18n={i18n}>
              <Routes>
                <Route path="/user/volunteer/:orgId" element={<Groups />} />
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

/**
 * Describes the testing suite for the Groups screen.
 */
describe('Testing Groups Screen', () => {
  beforeAll(() => {
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual,
        useParams: () => ({ orgId: 'orgId' }),
      };
    });
  });

  beforeEach(() => {
    setItem('userId', 'userId');
  });

  afterEach(() => {
    vi.resetAllMocks();
    cleanup(); // from @testing-library/react
  });

  /**
   * Tests redirection to the fallback URL when required URL parameters are missing.
   * Ensures the "paramsError" element is displayed.
   */
  it('should redirect to fallback URL if URL params are undefined', async () => {
    setItem('userId', null);
    render(
      <MockedProvider addTypename={false} link={link1}>
        <MemoryRouter initialEntries={['/user/volunteer/']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <Routes>
                <Route path="/user/volunteer/" element={<Groups />} />
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

  /**
   * Checks if the Groups screen renders correctly with the expected elements.
   */
  it('should render Groups screen', async () => {
    renderGroups(link1);
    const searchInput = await screen.findByTestId('searchBy');
    expect(searchInput).toBeInTheDocument();
    // Verify other critical UI elements
    expect(await screen.findByTestId('sort')).toBeInTheDocument();
    expect(await screen.findByTestId('searchByToggle')).toBeInTheDocument();
    const groupElements = await screen.findAllByTestId('groupName');
    expect(groupElements.length).toBeGreaterThan(0);
  });

  /**
   * Verifies the sorting functionality of the Groups screen.
   */
  it('Check Sorting Functionality', async () => {
    renderGroups(link1);
    const searchInput = await screen.findByTestId('searchBy');
    expect(searchInput).toBeInTheDocument();

    let sortBtn = await screen.findByTestId('sort');
    expect(sortBtn).toBeInTheDocument();

    // Sort by members_DESC
    fireEvent.click(sortBtn);
    const volunteersDESC = await screen.findByTestId('volunteers_DESC');
    expect(volunteersDESC).toBeInTheDocument();
    fireEvent.click(volunteersDESC);

    let groupName = await screen.findAllByTestId('groupName');
    expect(groupName[0]).toHaveTextContent('Group 1');

    // Sort by members_ASC
    sortBtn = await screen.findByTestId('sort');
    expect(sortBtn).toBeInTheDocument();
    fireEvent.click(sortBtn);
    const volunteersASC = await screen.findByTestId('volunteers_ASC');
    expect(volunteersASC).toBeInTheDocument();
    fireEvent.click(volunteersASC);

    groupName = await screen.findAllByTestId('groupName');
    expect(groupName[0]).toHaveTextContent('Group 2');
  });

  /**
   * Verifies the search by group functionality of the Groups screen.
   */
  it('Search by Groups', async () => {
    renderGroups(link1);
    const searchInput = await screen.findByTestId('searchBy');
    expect(searchInput).toBeInTheDocument();

    const searchToggle = await screen.findByTestId('searchByToggle');
    expect(searchToggle).toBeInTheDocument();
    userEvent.click(searchToggle);

    const searchByGroup = await screen.findByTestId('group');
    expect(searchByGroup).toBeInTheDocument();
    userEvent.click(searchByGroup);

    userEvent.type(searchInput, '1');
    await debounceWait();

    const groupName = await screen.findAllByTestId('groupName');
    expect(groupName[0]).toHaveTextContent('Group 1');
  });

  /**
   * Verifies the search by leader functionality of the Groups screen.
   */
  it('Search by Leader', async () => {
    renderGroups(link1);
    const searchInput = await screen.findByTestId('searchBy');
    expect(searchInput).toBeInTheDocument();

    const searchToggle = await screen.findByTestId('searchByToggle');
    expect(searchToggle).toBeInTheDocument();
    userEvent.click(searchToggle);

    const searchByLeader = await screen.findByTestId('leader');
    expect(searchByLeader).toBeInTheDocument();
    userEvent.click(searchByLeader);

    // Search by name on press of ENTER
    userEvent.type(searchInput, 'Bruce');
    await debounceWait();

    const groupName = await screen.findAllByTestId('groupName');
    expect(groupName[0]).toHaveTextContent('Group 1');
  });

  /**
   * Verifies the behavior when there are no groups to display.
   */
  it('should render screen with No Groups', async () => {
    renderGroups(link3);

    await waitFor(() => {
      expect(screen.getByTestId('searchBy')).toBeInTheDocument();
      expect(screen.getByText(t.noVolunteerGroups)).toBeInTheDocument();
    });
  });

  /**
   * Verifies the error handling when there is an issue fetching groups data.
   */
  it('Error while fetching groups data', async () => {
    renderGroups(link2);

    await waitFor(() => {
      expect(screen.getByTestId('errorMsg')).toBeInTheDocument();
    });
  });

  /**
   * Verifies the functionality of opening and closing the ViewModal.
   */
  it('Open and close ViewModal', async () => {
    renderGroups(link1);

    const viewGroupBtn = await screen.findAllByTestId('viewGroupBtn');
    userEvent.click(viewGroupBtn[0]);

    expect(await screen.findByText(t.groupDetails)).toBeInTheDocument();
    userEvent.click(await screen.findByTestId('volunteerViewModalCloseBtn'));
  });

  /**
   * Verifies the functionality of opening and closing the GroupModal.
   */
  it('Open and close GroupModal', async () => {
    renderGroups(link1);

    const editGroupBtn = await screen.findAllByTestId('editGroupBtn');
    userEvent.click(editGroupBtn[0]);

    expect(await screen.findByText(t.manageGroup)).toBeInTheDocument();
    userEvent.click(await screen.findByTestId('modalCloseBtn'));
  });
});
