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
import Invitations from './Invitations';
import type { ApolloLink } from '@apollo/client';
import {
  MOCKS,
  EMPTY_MOCKS,
  ERROR_MOCKS,
  UPDATE_ERROR_MOCKS,
  GROUP_RECURRING_MOCKS,
  GROUP_NON_RECURRING_MOCKS,
  INDIVIDUAL_RECURRING_MOCKS,
  INDIVIDUAL_NON_RECURRING_MOCKS,
} from './Invitations.mocks';
import { toast } from 'react-toastify';
import useLocalStorage from 'utils/useLocalstorage';
import { vi, expect, beforeEach, afterEach } from 'vitest';

const sharedMocks = vi.hoisted(() => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
  navigate: vi.fn(),
}));

vi.mock('react-toastify', () => ({
  toast: sharedMocks.toast,
}));

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useParams: () => ({ orgId: 'orgId' }),
    useNavigate: () => sharedMocks.navigate,
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
    <MockedProvider link={link}>
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
    localStorage.clear();
    setItem('userId', 'userId');
  });

  afterEach(() => {
    vi.clearAllMocks();
    sharedMocks.navigate.mockReset();
    localStorage.clear();
  });

  it('should redirect to fallback URL if URL params are undefined', async () => {
    setItem('userId', null);
    render(
      <MockedProvider link={link1}>
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
    expect(inviteSubject).toHaveLength(5);
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
    await userEvent.type(searchInput, '1');
    await debounceWait();
    fireEvent.click(screen.getByTestId('searchBtn'));

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
    expect(acceptBtn).toHaveLength(5);

    // Accept Request
    await userEvent.click(acceptBtn[0]);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(t.invitationAccepted);
    });
  });

  it('Reject Invite', async () => {
    renderInvitations(link1);
    const searchInput = await screen.findByTestId('searchBy');
    expect(searchInput).toBeInTheDocument();

    const rejectBtn = await screen.findAllByTestId('rejectBtn');
    expect(rejectBtn).toHaveLength(5);

    // Reject Request
    await userEvent.click(rejectBtn[0]);

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
    await userEvent.click(acceptBtn[0]);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });

  describe('Invitation subject rendering based on type and recurrence', () => {
    it('should display group invitation recurring subject for group invitations with recurrence rule', async () => {
      const groupRecurringLink = new StaticMockLink(GROUP_RECURRING_MOCKS);
      renderInvitations(groupRecurringLink);

      await waitFor(() => {
        const inviteSubject = screen.getByTestId('inviteSubject');
        expect(inviteSubject).toHaveTextContent(
          t.groupInvitationRecurringSubject,
        );
      });
    });

    it('should display group invitation subject for group invitations without recurrence rule', async () => {
      const groupNonRecurringLink = new StaticMockLink(
        GROUP_NON_RECURRING_MOCKS,
      );
      renderInvitations(groupNonRecurringLink);

      await waitFor(() => {
        const inviteSubject = screen.getByTestId('inviteSubject');
        expect(inviteSubject).toHaveTextContent(t.groupInvitationSubject);
      });
    });

    it('should display event invitation recurring subject for individual invitations with recurrence rule', async () => {
      const individualRecurringLink = new StaticMockLink(
        INDIVIDUAL_RECURRING_MOCKS,
      );
      renderInvitations(individualRecurringLink);

      await waitFor(() => {
        const inviteSubject = screen.getByTestId('inviteSubject');
        expect(inviteSubject).toHaveTextContent(
          t.eventInvitationRecurringSubject,
        );
      });
    });

    it('should display event invitation subject for individual invitations without recurrence rule', async () => {
      const individualNonRecurringLink = new StaticMockLink(
        INDIVIDUAL_NON_RECURRING_MOCKS,
      );
      renderInvitations(individualNonRecurringLink);

      await waitFor(() => {
        const inviteSubject = screen.getByTestId('inviteSubject');
        expect(inviteSubject).toHaveTextContent(t.eventInvitationSubject);
      });
    });
  });
});
