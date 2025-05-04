import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import type { RenderResult } from '@testing-library/react';
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router';
import { toast } from 'react-toastify';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18n from 'utils/i18nForTest';
import ManageTag from './ManageTag';
import { MOCKS, MOCKS_ERROR_ASSIGNED_MEMBERS } from './ManageTagMocks';
import { type ApolloLink } from '@apollo/client';
import { vi, beforeEach, afterEach, expect, it } from 'vitest';

const translations = {
  ...JSON.parse(
    JSON.stringify(i18n.getDataByLanguage('en')?.translation.manageTag ?? {}),
  ),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.common ?? {})),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.errors ?? {})),
};

const link = new StaticMockLink(MOCKS, true);
const link2 = new StaticMockLink(MOCKS_ERROR_ASSIGNED_MEMBERS, true);

async function wait(ms = 500): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    info: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('../../components/AddPeopleToTag/AddPeopleToTag', async () => {
  return await import('./ManageTagMockComponents/MockAddPeopleToTag');
});

vi.mock('../../components/TagActions/TagActions', async () => {
  return await import('./ManageTagMockComponents/MockTagActions');
});

const renderManageTag = (link: ApolloLink): RenderResult => {
  return render(
    <MockedProvider addTypename={false} link={link}>
      <MemoryRouter initialEntries={['/orgtags/123/manageTag/1']}>
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <Routes>
              <Route
                path="/orgtags/:orgId"
                element={<div data-testid="organizationTagsScreen"></div>}
              />
              <Route
                path="/orgtags/:orgId/manageTag/:tagId"
                element={<ManageTag />}
              />
              <Route
                path="/orgtags/:orgId/subTags/:tagId"
                element={<div data-testid="subTagsScreen"></div>}
              />
              <Route
                path="/member/:orgId"
                element={<div data-testid="memberProfileScreen"></div>}
              />
            </Routes>
          </I18nextProvider>
        </Provider>
      </MemoryRouter>
    </MockedProvider>,
  );
};

describe('Manage Tag Page', () => {
  beforeEach(() => {
    vi.mock('react-router', async () => ({
      ...(await vi.importActual('react-router')),
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it('Component loads correctly', async () => {
    await wait();
  });

  it('renders error component on unsuccessful userTag assigned members query', async () => {
    const { queryByText } = renderManageTag(link2);

    await wait();

    await waitFor(() => {
      expect(queryByText(translations.addPeopleToTag)).not.toBeInTheDocument();
    });
  });

  it('opens and closes the add people to tag modal', async () => {
    renderManageTag(link);

    await waitFor(() => {
      expect(screen.getByTestId('addPeopleToTagBtn')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(
        screen.queryByTestId('addPeopleToTagModal'),
      ).not.toBeInTheDocument();
    });
  });

  it('opens and closes the unassign tag modal', async () => {
    renderManageTag(link);

    await wait();
    await waitFor(() =>
      expect(
        screen.queryByTestId('unassignTagModalCloseBtn'),
      ).not.toBeInTheDocument(),
    );
  });

  it('opens and closes the assignToTags modal', async () => {
    renderManageTag(link);
    // Wait for the modal to be removed from the document
    await waitFor(() => {
      expect(screen.queryByTestId('tagActionsModal')).not.toBeInTheDocument();
    });
  });

  it('opens and closes the removeFromTags modal', async () => {
    renderManageTag(link);

    // Wait for the modal to be removed from the document
    await waitFor(() => {
      expect(screen.queryByTestId('tagActionsModal')).not.toBeInTheDocument();
    });
  });

  it('opens and closes the edit tag modal', async () => {
    renderManageTag(link);

    await wait();
    await waitFor(() =>
      expect(
        screen.queryByTestId('closeEditTagModalBtn'),
      ).not.toBeInTheDocument(),
    );
  });

  it('opens and closes the remove tag modal', async () => {
    renderManageTag(link);

    await wait();

    await waitFor(() =>
      expect(
        screen.queryByTestId('removeUserTagModalCloseBtn'),
      ).not.toBeInTheDocument(),
    );
  });

  it("navigates to the member's profile after clicking the view option", async () => {
    renderManageTag(link);

    await wait();
  });

  it('navigates to the subTags screen after clicking the subTags option', async () => {
    renderManageTag(link);

    await wait();
  });

  it('navigates to the manageTag screen after clicking a tag in the breadcrumbs', async () => {
    renderManageTag(link);

    await wait();
  });

  it('navigates to organization tags screen after clicking the all tags option in the breadcrumbs', async () => {
    renderManageTag(link);

    await wait();
  });

  it('searchs for tags where the name matches the provided search input', async () => {
    renderManageTag(link);

    await wait();
  });

  it('fetches the tags by the sort order, i.e. latest or oldest first', async () => {
    renderManageTag(link);

    await wait();
  });

  it('Fetches more assigned members with infinite scroll', async () => {
    await wait();
  });

  it('unassigns a tag from a member', async () => {
    renderManageTag(link);

    await wait();
  });

  it('successfully edits the tag name', async () => {
    renderManageTag(link);

    await wait();
  });

  it('successfully removes the tag and redirects to orgTags page', async () => {
    renderManageTag(link);

    await wait();
  });
});
