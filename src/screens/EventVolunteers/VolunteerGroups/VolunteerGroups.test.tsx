import React, { act } from 'react';
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
import VolunteerGroups from './VolunteerGroups';
import type { ApolloLink } from '@apollo/client';
import { MOCKS, MOCKS_EMPTY, MOCKS_ERROR } from './VolunteerGroups.mocks';

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

describe('Testing VolunteerGroups Screen', () => {
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
    renderVolunteerGroups(link1);
    const searchInput = await screen.findByTestId('searchBy');
    expect(searchInput).toBeInTheDocument();
  });

  it('Check Sorting Functionality', async () => {
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
    renderVolunteerGroups(link1);
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

  it('Search by Leader', async () => {
    renderVolunteerGroups(link1);
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

  it('should render screen with No Groups', async () => {
    renderVolunteerGroups(link3);

    await waitFor(() => {
      expect(screen.getByTestId('searchBy')).toBeInTheDocument();
      expect(screen.getByText(t.noVolunteerGroups)).toBeInTheDocument();
    });
  });

  it('Error while fetching groups data', async () => {
    renderVolunteerGroups(link2);

    await waitFor(() => {
      expect(screen.getByTestId('errorMsg')).toBeInTheDocument();
    });
  });

  it('Open and close ViewModal', async () => {
    renderVolunteerGroups(link1);

    const viewGroupBtn = await screen.findAllByTestId('viewGroupBtn');
    userEvent.click(viewGroupBtn[0]);

    expect(await screen.findByText(t.groupDetails)).toBeInTheDocument();
    userEvent.click(await screen.findByTestId('volunteerViewModalCloseBtn'));
  });

  it('Open and Close Delete Modal', async () => {
    renderVolunteerGroups(link1);

    const deleteGroupBtn = await screen.findAllByTestId('deleteGroupBtn');
    userEvent.click(deleteGroupBtn[0]);

    expect(await screen.findByText(t.deleteGroup)).toBeInTheDocument();
    userEvent.click(await screen.findByTestId('modalCloseBtn'));
  });

  it('Open and close GroupModal (Edit)', async () => {
    renderVolunteerGroups(link1);

    const editGroupBtn = await screen.findAllByTestId('editGroupBtn');
    userEvent.click(editGroupBtn[0]);

    expect(await screen.findAllByText(t.updateGroup)).toHaveLength(2);
    userEvent.click(await screen.findByTestId('modalCloseBtn'));
  });

  it('Open and close GroupModal (Create)', async () => {
    renderVolunteerGroups(link1);

    const createGroupBtn = await screen.findByTestId('createGroupBtn');
    userEvent.click(createGroupBtn);

    expect(await screen.findAllByText(t.createGroup)).toHaveLength(2);
    userEvent.click(await screen.findByTestId('modalCloseBtn'));
  });
});
