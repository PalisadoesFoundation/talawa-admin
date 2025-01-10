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
import Invitations from './Invitations';
import type { ApolloLink } from '@apollo/client';
import {
  MOCKS,
  EMPTY_MOCKS,
  ERROR_MOCKS,
  UPDATE_ERROR_MOCKS,
} from './Invitations.mocks';
import { toast } from 'react-toastify';
import useLocalStorage from 'utils/useLocalstorage';
import { vi, expect } from 'vitest';

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ orgId: 'orgId' }),
    useNavigate: vi.fn(),
  };
});

const { setItem } = useLocalStorage();

const link1 = new StaticMockLink(MOCKS);
const link2 = new StaticMockLink(ERROR_MOCKS);
const link3 = new StaticMockLink(EMPTY_MOCKS);
const link4 = new StaticMockLink(UPDATE_ERROR_MOCKS);
const t = {
  ...JSON.parse(
    JSON.stringify(
      i18n.getDataByLanguage('en')?.translation.userVolunteer ?? {},
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

const renderInvitations = (link: ApolloLink): RenderResult => {
  return render(
    <MockedProvider addTypename={false} link={link}>
      <MemoryRouter initialEntries={['/user/volunteer/orgId']}>
        <Provider store={store}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <I18nextProvider i18n={i18n}>
              <Routes>
                <Route
                  path="/user/volunteer/:orgId"
                  element={<Invitations />}
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

describe('Testing Invvitations Screen', () => {
  beforeEach(() => {
    setItem('userId', 'userId');
  });

  afterAll(() => {
    vi.clearAllMocks();
  });

  it('should redirect to fallback URL if URL params are undefined', async () => {
    setItem('userId', null);
    render(
      <MockedProvider addTypename={false} link={link1}>
        <MemoryRouter initialEntries={['/user/volunteer/']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <Routes>
                <Route path="/user/volunteer/" element={<Invitations />} />
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

  it('should render Invitations screen', async () => {
    renderInvitations(link1);
    const searchInput = await screen.findByTestId('searchBy');
    expect(searchInput).toBeInTheDocument();
  });

  it('Check Sorting Functionality', async () => {
    renderInvitations(link1);
    const searchInput = await screen.findByTestId('searchBy');
    expect(searchInput).toBeInTheDocument();

    let sortBtn = await screen.findByTestId('sort');
    expect(sortBtn).toBeInTheDocument();

    // Sort by createdAt_DESC
    fireEvent.click(sortBtn);
    const createdAtDESC = await screen.findByTestId('createdAt_DESC');
    expect(createdAtDESC).toBeInTheDocument();
    fireEvent.click(createdAtDESC);

    let inviteSubject = await screen.findAllByTestId('inviteSubject');
    expect(inviteSubject[0]).toHaveTextContent(
      'Invitation to join volunteer group',
    );

    // Sort by createdAt_ASC
    sortBtn = await screen.findByTestId('sort');
    expect(sortBtn).toBeInTheDocument();
    fireEvent.click(sortBtn);
    const createdAtASC = await screen.findByTestId('createdAt_ASC');
    expect(createdAtASC).toBeInTheDocument();
    fireEvent.click(createdAtASC);

    inviteSubject = await screen.findAllByTestId('inviteSubject');
    expect(inviteSubject[0]).toHaveTextContent(
      'Invitation to volunteer for event',
    );
  });

  it('Filter Invitations (all)', async () => {
    renderInvitations(link1);
    const searchInput = await screen.findByTestId('searchBy');
    expect(searchInput).toBeInTheDocument();

    // Filter by All
    const filter = await screen.findByTestId('filter');
    expect(filter).toBeInTheDocument();

    fireEvent.click(filter);
    const filterAll = await screen.findByTestId('all');
    expect(filterAll).toBeInTheDocument();

    fireEvent.click(filterAll);
    const inviteSubject = await screen.findAllByTestId('inviteSubject');
    expect(inviteSubject).toHaveLength(2);
  });

  it('Filter Invitations (group)', async () => {
    renderInvitations(link1);
    const searchInput = await screen.findByTestId('searchBy');
    expect(searchInput).toBeInTheDocument();

    // Filter by All
    const filter = await screen.findByTestId('filter');
    expect(filter).toBeInTheDocument();

    fireEvent.click(filter);
    const filterGroup = await screen.findByTestId('group');
    expect(filterGroup).toBeInTheDocument();

    fireEvent.click(filterGroup);
    const inviteSubject = await screen.findAllByTestId('inviteSubject');
    expect(inviteSubject).toHaveLength(1);
    expect(inviteSubject[0]).toHaveTextContent(
      'Invitation to join volunteer group',
    );
  });

  it('Filter Invitations (individual)', async () => {
    renderInvitations(link1);
    const searchInput = await screen.findByTestId('searchBy');
    expect(searchInput).toBeInTheDocument();

    // Filter by All
    const filter = await screen.findByTestId('filter');
    expect(filter).toBeInTheDocument();

    fireEvent.click(filter);
    const filterIndividual = await screen.findByTestId('individual');
    expect(filterIndividual).toBeInTheDocument();

    fireEvent.click(filterIndividual);
    const inviteSubject = await screen.findAllByTestId('inviteSubject');
    expect(inviteSubject).toHaveLength(1);
    expect(inviteSubject[0]).toHaveTextContent(
      'Invitation to volunteer for event',
    );
  });

  it('Search Invitations', async () => {
    renderInvitations(link1);
    const searchInput = await screen.findByTestId('searchBy');
    expect(searchInput).toBeInTheDocument();

    // Search by name on press of ENTER
    userEvent.type(searchInput, '1');
    await debounceWait();

    await waitFor(() => {
      const inviteSubject = screen.getAllByTestId('inviteSubject');
      expect(inviteSubject).toHaveLength(1);
      expect(inviteSubject[0]).toHaveTextContent(
        'Invitation to volunteer for event',
      );
    });
  });

  it('should render screen with No Invitations', async () => {
    renderInvitations(link3);

    await waitFor(() => {
      expect(screen.getByTestId('searchBy')).toBeInTheDocument();
      expect(screen.getByText(t.noInvitations)).toBeInTheDocument();
    });
  });

  it('Error while fetching invitations data', async () => {
    renderInvitations(link2);

    await waitFor(() => {
      expect(screen.getByTestId('errorMsg')).toBeInTheDocument();
    });
  });

  it('Accept Invite', async () => {
    renderInvitations(link1);
    const searchInput = await screen.findByTestId('searchBy');
    expect(searchInput).toBeInTheDocument();

    const acceptBtn = await screen.findAllByTestId('acceptBtn');
    expect(acceptBtn).toHaveLength(2);

    // Accept Request
    userEvent.click(acceptBtn[0]);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(t.invitationAccepted);
    });
  });

  it('Reject Invite', async () => {
    renderInvitations(link1);
    const searchInput = await screen.findByTestId('searchBy');
    expect(searchInput).toBeInTheDocument();

    const rejectBtn = await screen.findAllByTestId('rejectBtn');
    expect(rejectBtn).toHaveLength(2);

    // Reject Request
    userEvent.click(rejectBtn[0]);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(t.invitationRejected);
    });
  });

  it('Error in Update Invite Mutation', async () => {
    renderInvitations(link4);
    const searchInput = await screen.findByTestId('searchBy');
    expect(searchInput).toBeInTheDocument();

    const acceptBtn = await screen.findAllByTestId('acceptBtn');
    expect(acceptBtn).toHaveLength(2);

    // Accept Request
    userEvent.click(acceptBtn[0]);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });
});
