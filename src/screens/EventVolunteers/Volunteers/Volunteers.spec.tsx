import React, { act } from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import type { RenderResult } from '@testing-library/react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes, useParams } from 'react-router-dom';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18n from 'utils/i18nForTest';
import Volunteers from './Volunteers';
import type { ApolloLink } from '@apollo/client';
import { MOCKS, MOCKS_EMPTY, MOCKS_ERROR } from './Volunteers.mocks';
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

/** Mock useParams to provide consistent test data */

describe('Testing Volunteers Screen', () => {
  beforeAll(() => {
    vi.mock('react-router-dom', async () => {
      const actualDom = await vi.importActual('react-router-dom');
      return {
        ...actualDom,
        useParams: vi.fn(),
      };
    });
  });

  afterAll(() => {
    vi.clearAllMocks();
  });

  it('should redirect to fallback URL if URL params are undefined', async () => {
    vi.mocked(useParams).mockReturnValue({ orgId: '', eventId: '' });
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
    vi.mocked(useParams).mockReturnValue({
      orgId: 'orgId',
      eventId: 'eventId',
    });

    renderVolunteers(link1);
    const searchInput = await screen.findByTestId('searchBy');
    expect(searchInput).toBeInTheDocument();
  });

  it('Check Sorting Functionality', async () => {
    vi.mocked(useParams).mockReturnValue({
      orgId: 'orgId',
      eventId: 'eventId',
    });
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
    vi.mocked(useParams).mockReturnValue({
      orgId: 'orgId',
      eventId: 'eventId',
    });
    renderVolunteers(link1);

    const filterBtn = await screen.findByTestId('filter');
    expect(filterBtn).toBeInTheDocument();

    // Filter by All
    fireEvent.click(filterBtn);
    await waitFor(() => {
      expect(screen.getByTestId('all')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('all'));

    const volunteerName = await screen.findAllByTestId('volunteerName');
    expect(volunteerName).toHaveLength(2);
  });

  it('Filter Volunteers by status (Pending)', async () => {
    vi.mocked(useParams).mockReturnValue({
      orgId: 'orgId',
      eventId: 'eventId',
    });
    renderVolunteers(link1);

    const filterBtn = await screen.findByTestId('filter');
    expect(filterBtn).toBeInTheDocument();

    // Filter by Pending
    fireEvent.click(filterBtn);
    await waitFor(() => {
      expect(screen.getByTestId('pending')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('pending'));

    const volunteerName = await screen.findAllByTestId('volunteerName');
    expect(volunteerName[0]).toHaveTextContent('Bruce Graza');
  });

  it('Filter Volunteers by status (Accepted)', async () => {
    vi.mocked(useParams).mockReturnValue({
      orgId: 'orgId',
      eventId: 'eventId',
    });
    renderVolunteers(link1);

    const filterBtn = await screen.findByTestId('filter');
    expect(filterBtn).toBeInTheDocument();

    // Filter by Accepted
    fireEvent.click(filterBtn);
    await waitFor(() => {
      expect(screen.getByTestId('accepted')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('accepted'));

    const volunteerName = await screen.findAllByTestId('volunteerName');
    expect(volunteerName[0]).toHaveTextContent('Teresa Bradley');
  });

  it('Search', async () => {
    vi.mocked(useParams).mockReturnValue({
      orgId: 'orgId',
      eventId: 'eventId',
    });
    renderVolunteers(link1);
    const searchInput = await screen.findByTestId('searchBy');
    expect(searchInput).toBeInTheDocument();

    userEvent.type(searchInput, 'T');
    await debounceWait();

    const volunteerName = await screen.findAllByTestId('volunteerName');
    expect(volunteerName[0]).toHaveTextContent('Teresa Bradley');
  });

  it('should render screen with No Volunteers', async () => {
    vi.mocked(useParams).mockReturnValue({
      orgId: 'orgId',
      eventId: 'eventId',
    });
    renderVolunteers(link3);

    await waitFor(() => {
      expect(screen.getByTestId('searchBy')).toBeInTheDocument();
      expect(screen.getByText(t.noVolunteers)).toBeInTheDocument();
    });
  });

  it('Error while fetching volunteers data', async () => {
    vi.mocked(useParams).mockReturnValue({
      orgId: 'orgId',
      eventId: 'eventId',
    });
    renderVolunteers(link2);

    await waitFor(() => {
      expect(screen.getByTestId('errorMsg')).toBeInTheDocument();
    });
  });

  it('Open and close Volunteer Modal (View)', async () => {
    vi.mocked(useParams).mockReturnValue({
      orgId: 'orgId',
      eventId: 'eventId',
    });
    renderVolunteers(link1);

    const viewItemBtn = await screen.findAllByTestId('viewItemBtn');
    userEvent.click(viewItemBtn[0]);

    expect(await screen.findByText(t.volunteerDetails)).toBeInTheDocument();
    userEvent.click(await screen.findByTestId('modalCloseBtn'));
  });

  it('Open and Close Volunteer Modal (Delete)', async () => {
    vi.mocked(useParams).mockReturnValue({
      orgId: 'orgId',
      eventId: 'eventId',
    });
    renderVolunteers(link1);

    const deleteItemBtn = await screen.findAllByTestId('deleteItemBtn');
    userEvent.click(deleteItemBtn[0]);

    expect(await screen.findByText(t.removeVolunteer)).toBeInTheDocument();
    userEvent.click(await screen.findByTestId('modalCloseBtn'));
  });

  it('Open and close Volunteer Modal (Create)', async () => {
    vi.mocked(useParams).mockReturnValue({
      orgId: 'orgId',
      eventId: 'eventId',
    });
    renderVolunteers(link1);

    const addVolunteerBtn = await screen.findByTestId('addVolunteerBtn');
    userEvent.click(addVolunteerBtn);

    expect(await screen.findAllByText(t.addVolunteer)).toHaveLength(2);
    userEvent.click(await screen.findByTestId('modalCloseBtn'));
  });
});
