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
import Groups from './Groups';
import type { ApolloLink } from '@apollo/client';
import { MOCKS, EMPTY_MOCKS, ERROR_MOCKS } from './Groups.mocks';
import useLocalStorage from 'utils/useLocalstorage';

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

describe('Testing Groups Screen', () => {
  beforeAll(() => {
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useParams: () => ({ orgId: 'orgId' }),
    }));
  });

  beforeEach(() => {
    setItem('userId', 'userId');
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

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

  it('should render Groups screen', async () => {
    renderGroups(link1);
    const searchInput = await screen.findByTestId('searchBy');
    expect(searchInput).toBeInTheDocument();
  });

  it('Check Sorting Functionality', async () => {
    renderGroups(link1);
    const searchInput = await screen.findByTestId('searchBy');
    expect(searchInput).toBeInTheDocument();

    let sortBtn = await screen.findByTestId('sort');
    expect(sortBtn).toBeInTheDocument();

    // Sort by members_DESC
    fireEvent.click(sortBtn);
    const membersDESC = await screen.findByTestId('members_DESC');
    expect(membersDESC).toBeInTheDocument();
    fireEvent.click(membersDESC);

    let groupName = await screen.findAllByTestId('groupName');
    expect(groupName[0]).toHaveTextContent('Group 1');

    // Sort by members_ASC
    sortBtn = await screen.findByTestId('sort');
    expect(sortBtn).toBeInTheDocument();
    fireEvent.click(sortBtn);
    const membersASC = await screen.findByTestId('members_ASC');
    expect(membersASC).toBeInTheDocument();
    fireEvent.click(membersASC);

    groupName = await screen.findAllByTestId('groupName');
    expect(groupName[0]).toHaveTextContent('Group 2');
  });

  it('Search by Groups and clear the input by backspace', async () => {
    renderGroups(link1);
    const searchInput = await screen.findByTestId('searchBy');
    expect(searchInput).toBeInTheDocument();

    // Clear the search input by backspace
    userEvent.type(searchInput, '1{backspace}');

    const groupName = await screen.findAllByTestId('groupName');
    expect(groupName[0]).toHaveTextContent('Group 1');
  });

  it('Search by Groups on press of ENTER', async () => {
    renderGroups(link1);
    const searchInput = await screen.findByTestId('searchBy');
    expect(searchInput).toBeInTheDocument();

    const searchToggle = await screen.findByTestId('searchByToggle');
    expect(searchToggle).toBeInTheDocument();
    userEvent.click(searchToggle);

    const searchByGroup = await screen.findByTestId('group');
    expect(searchByGroup).toBeInTheDocument();
    userEvent.click(searchByGroup);

    userEvent.type(searchInput, '1{enter}');

    const groupName = await screen.findAllByTestId('groupName');
    expect(groupName[0]).toHaveTextContent('Group 1');
  });

  it('Search by Leader on click of search button', async () => {
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
    userEvent.click(await screen.findByTestId('searchBtn'));

    const groupName = await screen.findAllByTestId('groupName');
    expect(groupName[0]).toHaveTextContent('Group 1');
  });

  it('should render screen with No Groups', async () => {
    renderGroups(link3);

    await waitFor(() => {
      expect(screen.getByTestId('searchBy')).toBeInTheDocument();
      expect(screen.getByText(t.noVolunteerGroups)).toBeInTheDocument();
    });
  });

  it('Error while fetching groups data', async () => {
    renderGroups(link2);

    await waitFor(() => {
      expect(screen.getByTestId('errorMsg')).toBeInTheDocument();
    });
  });

  it('Open and close ViewModal', async () => {
    renderGroups(link1);

    const viewGroupBtn = await screen.findAllByTestId('viewGroupBtn');
    userEvent.click(viewGroupBtn[0]);

    expect(await screen.findByText(t.groupDetails)).toBeInTheDocument();
    userEvent.click(await screen.findByTestId('volunteerViewModalCloseBtn'));
  });

  it('Open and close GroupModal', async () => {
    renderGroups(link1);

    const editGroupBtn = await screen.findAllByTestId('editGroupBtn');
    userEvent.click(editGroupBtn[0]);

    expect(await screen.findByText(t.manageGroup)).toBeInTheDocument();
    userEvent.click(await screen.findByTestId('modalCloseBtn'));
  });
});
