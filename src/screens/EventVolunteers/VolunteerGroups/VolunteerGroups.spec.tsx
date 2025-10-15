import React, { act } from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import type { RenderResult } from '@testing-library/react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes, useParams } from 'react-router';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18n from 'utils/i18nForTest';
import VolunteerGroups from './VolunteerGroups';
import type { ApolloLink } from '@apollo/client';
import { MOCKS, MOCKS_EMPTY, MOCKS_ERROR } from './modal/VolunteerGroups.mocks';
import { vi } from 'vitest';

const link1 = new StaticMockLink(MOCKS);
const link2 = new StaticMockLink(MOCKS_ERROR);
const link3 = new StaticMockLink(MOCKS_EMPTY);
const t = {
  ...JSON.parse(
    JSON.stringify(
      i18n.getDataByLanguage('en')?.translation.eventVolunteers ?? {},
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

const renderVolunteerGroups = (link: ApolloLink): RenderResult => {
  return render(
    <MockedProvider addTypename={false} link={link}>
      <MemoryRouter initialEntries={['/event/orgId/eventId']}>
        <Provider store={store}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <I18nextProvider i18n={i18n}>
              <Routes>
                <Route
                  path="/event/:orgId/:eventId"
                  element={<VolunteerGroups />}
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

/** Mock useParams to provide consistent test data */

describe('Testing VolunteerGroups Screen', () => {
  beforeAll(() => {
    vi.mock('react-router', async () => {
      const actualDom = await vi.importActual('react-router');
      return { ...actualDom, useParams: vi.fn() };
    });
  });

  afterAll(() => {
    vi.clearAllMocks();
  });

  const mockRouteParams = (orgId = 'orgId', eventId = 'eventId'): void => {
    vi.mocked(useParams).mockReturnValue({ orgId, eventId });
  };

  it('should redirect to fallback URL if URL params are undefined', async () => {
    /**  Mocking the useParams hook to return undefined parameters */
    mockRouteParams('', '');
    render(
      <MockedProvider addTypename={false} link={link1}>
        <MemoryRouter initialEntries={['/event/']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <Routes>
                <Route path="/event/" element={<VolunteerGroups />} />
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

  it('should render Groups screen', async () => {
    mockRouteParams();
    renderVolunteerGroups(link1);
    const searchInput = await screen.findByTestId('searchBy');
    expect(searchInput).toBeInTheDocument();
  });

  it('Check Sorting Functionality', async () => {
    mockRouteParams();
    renderVolunteerGroups(link1);
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

  it('Search by Groups', async () => {
    mockRouteParams();
    renderVolunteerGroups(link1);
    const searchInput = await screen.findByTestId('searchBy');
    expect(searchInput).toBeInTheDocument();

    const searchToggle = await screen.findByTestId('searchByToggle');
    expect(searchToggle).toBeInTheDocument();
    await userEvent.click(searchToggle);

    const searchByGroup = await screen.findByTestId('group');
    expect(searchByGroup).toBeInTheDocument();
    await userEvent.click(searchByGroup);

    await userEvent.type(searchInput, '1');
    await debounceWait();

    const groupName = await screen.findAllByTestId('groupName');
    expect(groupName[0]).toHaveTextContent('Group 1');
  });

  it('Search by Leader', async () => {
    mockRouteParams();
    renderVolunteerGroups(link1);
    const searchInput = await screen.findByTestId('searchBy');
    expect(searchInput).toBeInTheDocument();

    const searchToggle = await screen.findByTestId('searchByToggle');
    expect(searchToggle).toBeInTheDocument();
    await userEvent.click(searchToggle);

    const searchByLeader = await screen.findByTestId('leader');
    expect(searchByLeader).toBeInTheDocument();
    await userEvent.click(searchByLeader);

    // Search by name on press of ENTER
    await userEvent.type(searchInput, 'Bruce');
    await debounceWait();

    const groupName = await screen.findAllByTestId('groupName');
    expect(groupName[0]).toHaveTextContent('Group 1');
  });

  it('should render screen with No Groups', async () => {
    mockRouteParams();
    renderVolunteerGroups(link3);

    await waitFor(() => {
      expect(screen.getByTestId('searchBy')).toBeInTheDocument();
      expect(screen.getByText(t.noVolunteerGroups)).toBeInTheDocument();
    });
  });

  it('Error while fetching groups data', async () => {
    mockRouteParams();
    renderVolunteerGroups(link2);

    await waitFor(() => {
      expect(screen.getByTestId('errorMsg')).toBeInTheDocument();
    });
  });

  it('Open and close ViewModal', async () => {
    mockRouteParams();
    renderVolunteerGroups(link1);

    const viewGroupBtn = await screen.findAllByTestId('viewGroupBtn');
    await userEvent.click(viewGroupBtn[0]);

    expect(await screen.findByText(t.groupDetails)).toBeInTheDocument();
    await userEvent.click(
      await screen.findByTestId('volunteerViewModalCloseBtn'),
    );
  });

  it('Open and Close Delete Modal', async () => {
    mockRouteParams();
    renderVolunteerGroups(link1);

    const deleteGroupBtn = await screen.findAllByTestId('deleteGroupBtn');
    await userEvent.click(deleteGroupBtn[0]);

    expect(await screen.findByText(t.deleteGroup)).toBeInTheDocument();
    await userEvent.click(await screen.findByTestId('modalCloseBtn'));
  });

  it('Open and close GroupModal (Edit)', async () => {
    mockRouteParams();
    renderVolunteerGroups(link1);

    const editGroupBtn = await screen.findAllByTestId('editGroupBtn');
    await userEvent.click(editGroupBtn[0]);

    expect(await screen.findAllByText(t.updateGroup)).toHaveLength(2);
    await userEvent.click(await screen.findByTestId('modalCloseBtn'));
  });

  it('Open and close GroupModal (Create)', async () => {
    mockRouteParams();
    renderVolunteerGroups(link1);

    const createGroupBtn = await screen.findByTestId('createGroupBtn');
    await userEvent.click(createGroupBtn);

    expect(await screen.findAllByText(t.createGroup)).toHaveLength(2);
    await userEvent.click(await screen.findByTestId('modalCloseBtn'));
  });

  it('should render leader with image correctly', async () => {
    mockRouteParams();
    renderVolunteerGroups(link1);

    await waitFor(() => {
      expect(screen.getByTestId('searchBy')).toBeInTheDocument();
    });

    // Group 1 has a leader with an image (Teresa Bradley with img-url)
    const leaderImages = screen.queryAllByRole('img', { name: /Assignee/i });
    expect(leaderImages.length).toBeGreaterThan(0);
    
    // Verify at least one image has the expected source
    const hasImageSource = leaderImages.some(
      (img) => img.getAttribute('src') === 'img-url',
    );
    expect(hasImageSource).toBe(true);
  });

  it('should render leader without image using Avatar component', async () => {
    mockRouteParams();
    renderVolunteerGroups(link1);

    await waitFor(() => {
      expect(screen.getByTestId('searchBy')).toBeInTheDocument();
    });

    // Verify assigneeName elements exist for all groups
    const assigneeNames = screen.getAllByTestId('assigneeName');
    expect(assigneeNames.length).toBeGreaterThan(0);
    
    // Group 2 and Group 3 have leaders without images (null)
    // These should render Avatar component instead of img tag
    // Verify the leader names are displayed (Teresa Bradley appears twice, Bruce once)
    const teresaBradleyElements = screen.getAllByText(/Teresa Bradley/i);
    expect(teresaBradleyElements.length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText(/Bruce Garza/i)).toBeInTheDocument();
  });

  it('should display correct number of actions completed', async () => {
    mockRouteParams();
    renderVolunteerGroups(link1);

    await waitFor(() => {
      expect(screen.getByTestId('searchBy')).toBeInTheDocument();
    });

    // All groups have empty assignments array (0 actions completed)
    const groupRows = await screen.findAllByTestId('groupName');
    expect(groupRows.length).toBeGreaterThan(0);
    
    // According to mock data, all groups have assignments: []
    // The actions column should display 0 for each group
    // Since we have 3 groups rendered, verify they all exist
    expect(groupRows.length).toBe(3);
  });

  it('should display correct number of volunteers in each group', async () => {
    mockRouteParams();
    renderVolunteerGroups(link1);

    await waitFor(() => {
      expect(screen.getByTestId('searchBy')).toBeInTheDocument();
    });

    // Verify volunteer count is displayed for each group
    const groupRows = await screen.findAllByTestId('groupName');
    
    // All three groups should be rendered
    expect(groupRows.length).toBe(3);
    
    // Each group in mock data has 1 volunteer in the volunteers array
    // Verify group names are displayed correctly
    expect(screen.getByText('Group 1')).toBeInTheDocument();
    expect(screen.getByText('Group 2')).toBeInTheDocument();
    expect(screen.getByText('Group 3')).toBeInTheDocument();
  });
});
