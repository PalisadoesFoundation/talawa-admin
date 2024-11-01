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
import Volunteers from './Volunteers';
import type { ApolloLink } from '@apollo/client';
import { MOCKS, MOCKS_EMPTY, MOCKS_ERROR } from './Volunteers.mocks';

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

const renderVolunteers = (link: ApolloLink): RenderResult => {
  return render(
    <MockedProvider addTypename={false} link={link}>
      <MemoryRouter initialEntries={['/event/orgId/eventId']}>
        <Provider store={store}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <I18nextProvider i18n={i18n}>
              <Routes>
                <Route path="/event/:orgId/:eventId" element={<Volunteers />} />
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

describe('Testing Volunteers Screen', () => {
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
                <Route path="/event/" element={<Volunteers />} />
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

  it('should render Volunteers screen', async () => {
    renderVolunteers(link1);
    const searchInput = await screen.findByTestId('searchBy');
    expect(searchInput).toBeInTheDocument();
  });

  it('Check Sorting Functionality', async () => {
    renderVolunteers(link1);
    const searchInput = await screen.findByTestId('searchBy');
    expect(searchInput).toBeInTheDocument();

    let sortBtn = await screen.findByTestId('sort');
    expect(sortBtn).toBeInTheDocument();

    // Sort by hoursVolunteered_DESC
    fireEvent.click(sortBtn);
    const hoursVolunteeredDESC = await screen.findByTestId(
      'hoursVolunteered_DESC',
    );
    expect(hoursVolunteeredDESC).toBeInTheDocument();
    fireEvent.click(hoursVolunteeredDESC);

    let volunteerName = await screen.findAllByTestId('volunteerName');
    expect(volunteerName[0]).toHaveTextContent('Teresa Bradley');

    // Sort by hoursVolunteered_ASC
    sortBtn = await screen.findByTestId('sort');
    expect(sortBtn).toBeInTheDocument();
    fireEvent.click(sortBtn);
    const hoursVolunteeredASC = await screen.findByTestId(
      'hoursVolunteered_ASC',
    );
    expect(hoursVolunteeredASC).toBeInTheDocument();
    fireEvent.click(hoursVolunteeredASC);

    volunteerName = await screen.findAllByTestId('volunteerName');
    expect(volunteerName[0]).toHaveTextContent('Bruce Graza');
  });

  it('Filter Volunteers by status (All)', async () => {
    renderVolunteers(link1);

    const filterBtn = await screen.findByTestId('filter');
    expect(filterBtn).toBeInTheDocument();

    // Filter by All
    fireEvent.click(filterBtn);
    await waitFor(() => {
      expect(screen.getByTestId('statusAll')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('statusAll'));

    const volunteerName = await screen.findAllByTestId('volunteerName');
    expect(volunteerName).toHaveLength(2);
  });

  it('Filter Volunteers by status (Pending)', async () => {
    renderVolunteers(link1);

    const filterBtn = await screen.findByTestId('filter');
    expect(filterBtn).toBeInTheDocument();

    // Filter by Pending
    fireEvent.click(filterBtn);
    await waitFor(() => {
      expect(screen.getByTestId('statusPending')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('statusPending'));

    const volunteerName = await screen.findAllByTestId('volunteerName');
    expect(volunteerName[0]).toHaveTextContent('Bruce Graza');
  });

  it('Filter Volunteers by status (Accepted)', async () => {
    renderVolunteers(link1);

    const filterBtn = await screen.findByTestId('filter');
    expect(filterBtn).toBeInTheDocument();

    // Filter by Accepted
    fireEvent.click(filterBtn);
    await waitFor(() => {
      expect(screen.getByTestId('statusAccepted')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('statusAccepted'));

    const volunteerName = await screen.findAllByTestId('volunteerName');
    expect(volunteerName[0]).toHaveTextContent('Teresa Bradley');
  });

  it('Search and clear the input by backspace', async () => {
    renderVolunteers(link1);
    const searchInput = await screen.findByTestId('searchBy');
    expect(searchInput).toBeInTheDocument();

    // Clear the search input by backspace
    userEvent.type(searchInput, 'T{backspace}');

    const volunteerName = await screen.findAllByTestId('volunteerName');
    expect(volunteerName).toHaveLength(2);
  });

  it('Search on press of ENTER', async () => {
    renderVolunteers(link1);
    const searchInput = await screen.findByTestId('searchBy');
    expect(searchInput).toBeInTheDocument();

    userEvent.type(searchInput, 'T{enter}');

    const volunteerName = await screen.findAllByTestId('volunteerName');
    expect(volunteerName[0]).toHaveTextContent('Teresa Bradley');
  });

  it('Search on click of search button', async () => {
    renderVolunteers(link1);
    const searchInput = await screen.findByTestId('searchBy');
    expect(searchInput).toBeInTheDocument();

    // Search by name on press of ENTER
    userEvent.type(searchInput, 'T');
    userEvent.click(await screen.findByTestId('searchBtn'));

    const volunteerName = await screen.findAllByTestId('volunteerName');
    expect(volunteerName[0]).toHaveTextContent('Teresa Bradley');
  });

  it('should render screen with No Volunteers', async () => {
    renderVolunteers(link3);

    await waitFor(() => {
      expect(screen.getByTestId('searchBy')).toBeInTheDocument();
      expect(screen.getByText(t.noVolunteers)).toBeInTheDocument();
    });
  });

  it('Error while fetching volunteers data', async () => {
    renderVolunteers(link2);

    await waitFor(() => {
      expect(screen.getByTestId('errorMsg')).toBeInTheDocument();
    });
  });

  it('Open and close Volunteer Modal (View)', async () => {
    renderVolunteers(link1);

    const viewItemBtn = await screen.findAllByTestId('viewItemBtn');
    userEvent.click(viewItemBtn[0]);

    expect(await screen.findByText(t.volunteerDetails)).toBeInTheDocument();
    userEvent.click(await screen.findByTestId('modalCloseBtn'));
  });

  it('Open and Close Volunteer Modal (Delete)', async () => {
    renderVolunteers(link1);

    const deleteItemBtn = await screen.findAllByTestId('deleteItemBtn');
    userEvent.click(deleteItemBtn[0]);

    expect(await screen.findByText(t.removeVolunteer)).toBeInTheDocument();
    userEvent.click(await screen.findByTestId('modalCloseBtn'));
  });

  it('Open and close Volunteer Modal (Create)', async () => {
    renderVolunteers(link1);

    const addVolunteerBtn = await screen.findByTestId('addVolunteerBtn');
    userEvent.click(addVolunteerBtn);

    expect(await screen.findAllByText(t.addVolunteer)).toHaveLength(2);
    userEvent.click(await screen.findByTestId('modalCloseBtn'));
  });
});
