/**
 * Testing component for managing and displaying Volunteer Membership requests for an event.
 *
 * This component allows users to view, filter, sort, and create action items. It also allows users to accept or reject volunteer membership requests.
 *
 *
 */
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
import Requests from './Requests';
import type { ApolloLink } from '@apollo/client';
import {
  MOCKS,
  EMPTY_MOCKS,
  ERROR_MOCKS,
  UPDATE_ERROR_MOCKS,
} from './Requests.mocks';
import { toast } from 'react-toastify';
import { vi } from 'vitest';

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const debounceWait = async (ms = 300): Promise<void> => {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
};

const link1 = new StaticMockLink(MOCKS);
const link2 = new StaticMockLink(ERROR_MOCKS);
const link3 = new StaticMockLink(EMPTY_MOCKS);
const link4 = new StaticMockLink(UPDATE_ERROR_MOCKS);
const t = {
  ...JSON.parse(
    JSON.stringify(
      i18n.getDataByLanguage('en')?.translation.eventVolunteers ?? {},
    ),
  ),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.common ?? {})),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.errors ?? {})),
};

const renderRequests = (link: ApolloLink): RenderResult => {
  return render(
    <MockedProvider addTypename={false} link={link}>
      <MemoryRouter initialEntries={['/event/orgId/eventId']}>
        <Provider store={store}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <I18nextProvider i18n={i18n}>
              <Routes>
                <Route path="/event/:orgId/:eventId" element={<Requests />} />
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

describe('Testing Requests Screen', () => {
  beforeAll(() => {
    vi.mock('react-router-dom', async () => ({
      ...(await vi.importActual('react-router-dom')),
      useParams: () => ({ orgId: 'orgId', eventId: 'eventId' }),
    }));
  });

  afterAll(() => {
    vi.clearAllMocks();
  });

  it('should redirect to fallback URL if URL params are undefined', async () => {
    render(
      <MockedProvider addTypename={false} link={link1}>
        <MemoryRouter initialEntries={['/event/']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <Routes>
                <Route path="/event/" element={<Requests />} />
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
    expect(window.location.pathname).toBe('/');
  });

  it('should render Requests screen', async () => {
    renderRequests(link1);
    await waitFor(() => {
      expect(screen.getByTestId('searchBy')).toBeInTheDocument();
    });
  });

  it('Check Sorting Functionality', async () => {
    renderRequests(link1);

    await waitFor(() => {
      expect(screen.getByTestId('searchBy')).toBeInTheDocument();
    });

    let sortBtn = await screen.findByTestId('sort');
    expect(sortBtn).toBeInTheDocument();

    // Sort by createdAt_DESC
    fireEvent.click(sortBtn);
    const createdAtDESC = await screen.findByTestId('createdAt_DESC');
    expect(createdAtDESC).toBeInTheDocument();
    fireEvent.click(createdAtDESC);

    let volunteerName = await screen.findAllByTestId('volunteerName');
    expect(volunteerName[0]).toHaveTextContent('Teresa Bradley');

    // Sort by createdAt_ASC
    sortBtn = await screen.findByTestId('sort');
    expect(sortBtn).toBeInTheDocument();
    fireEvent.click(sortBtn);
    const createdAtASC = await screen.findByTestId('createdAt_ASC');
    expect(createdAtASC).toBeInTheDocument();
    fireEvent.click(createdAtASC);

    volunteerName = await screen.findAllByTestId('volunteerName');
    expect(volunteerName[0]).toHaveTextContent('John Doe');
  });

  it('Search Requests by volunteer name', async () => {
    renderRequests(link1);

    const searchInput = await screen.findByTestId('searchBy');
    expect(searchInput).toBeInTheDocument();

    // Search by name on press of ENTER
    userEvent.type(searchInput, 'T');
    await debounceWait();

    await waitFor(() => {
      const volunteerName = screen.getAllByTestId('volunteerName');
      expect(volunteerName[0]).toHaveTextContent('Teresa Bradley');
    });
  });

  it('should render screen with No Requests', async () => {
    renderRequests(link3);

    await waitFor(() => {
      expect(screen.getByTestId('searchBy')).toBeInTheDocument();
      expect(screen.getByText(t.noRequests)).toBeInTheDocument();
    });
  });

  it('Error while fetching requests data', async () => {
    renderRequests(link2);

    await waitFor(() => {
      expect(screen.getByTestId('errorMsg')).toBeInTheDocument();
    });
  });

  it('Accept Request', async () => {
    renderRequests(link1);
    await waitFor(() => {
      expect(screen.getByTestId('searchBy')).toBeInTheDocument();
    });

    const acceptBtn = await screen.findAllByTestId('acceptBtn');
    expect(acceptBtn).toHaveLength(2);

    // Accept Request
    userEvent.click(acceptBtn[0]);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(t.requestAccepted);
    });
  });

  it('Reject Request', async () => {
    renderRequests(link1);
    await waitFor(() => {
      expect(screen.getByTestId('searchBy')).toBeInTheDocument();
    });

    const rejectBtn = await screen.findAllByTestId('rejectBtn');
    expect(rejectBtn).toHaveLength(2);

    // Reject Request
    userEvent.click(rejectBtn[0]);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(t.requestRejected);
    });
  });

  it('Error in Update Request Mutation', async () => {
    renderRequests(link4);
    await waitFor(() => {
      expect(screen.getByTestId('searchBy')).toBeInTheDocument();
    });

    const acceptBtn = await screen.findAllByTestId('acceptBtn');
    expect(acceptBtn).toHaveLength(2);

    // Accept Request
    userEvent.click(acceptBtn[0]);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });
});
