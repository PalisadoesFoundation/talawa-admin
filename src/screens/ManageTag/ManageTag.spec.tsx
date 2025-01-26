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
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
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
    vi.mock('react-router-dom', async () => ({
      ...(await vi.importActual('react-router-dom')),
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it('Component loads correctly', async () => {
    const { getByText } = renderManageTag(link);

    await wait();

    await waitFor(() => {
      expect(getByText(translations.addPeopleToTag)).toBeInTheDocument();
    });
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

    userEvent.click(screen.getByTestId('addPeopleToTagBtn'));

    await waitFor(() => {
      expect(screen.getByTestId('addPeopleToTagModal')).toBeInTheDocument();
    });

    userEvent.click(screen.getByTestId('closeAddPeopleToTagModal'));

    await waitFor(() => {
      expect(
        screen.queryByTestId('addPeopleToTagModal'),
      ).not.toBeInTheDocument();
    });
  });

  it('opens and closes the unassign tag modal', async () => {
    renderManageTag(link);

    await wait();

    await waitFor(() => {
      expect(screen.getAllByTestId('unassignTagBtn')[0]).toBeInTheDocument();
    });
    userEvent.click(screen.getAllByTestId('unassignTagBtn')[0]);

    await waitFor(() => {
      return expect(
        screen.findByTestId('unassignTagModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('unassignTagModalCloseBtn'));

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('unassignTagModalCloseBtn'),
    );
  });

  it('opens and closes the assignToTags modal', async () => {
    renderManageTag(link);

    // Wait for the assignToTags button to be present
    await waitFor(() => {
      expect(screen.getByTestId('assignToTags')).toBeInTheDocument();
    });

    // Click the assignToTags button to open the modal
    userEvent.click(screen.getByTestId('assignToTags'));

    // Wait for the close button in the modal to be present
    await waitFor(() => {
      expect(screen.getByTestId('closeTagActionsModalBtn')).toBeInTheDocument();
    });

    // Click the close button to close the modal
    userEvent.click(screen.getByTestId('closeTagActionsModalBtn'));

    // Wait for the modal to be removed from the document
    await waitFor(() => {
      expect(screen.queryByTestId('tagActionsModal')).not.toBeInTheDocument();
    });
  });

  it('opens and closes the removeFromTags modal', async () => {
    renderManageTag(link);

    // Wait for the removeFromTags button to be present
    await waitFor(() => {
      expect(screen.getByTestId('removeFromTags')).toBeInTheDocument();
    });

    // Click the removeFromTags button to open the modal
    userEvent.click(screen.getByTestId('removeFromTags'));

    // Wait for the close button in the modal to be present
    await waitFor(() => {
      expect(screen.getByTestId('closeTagActionsModalBtn')).toBeInTheDocument();
    });

    // Click the close button to close the modal
    userEvent.click(screen.getByTestId('closeTagActionsModalBtn'));

    // Wait for the modal to be removed from the document
    await waitFor(() => {
      expect(screen.queryByTestId('tagActionsModal')).not.toBeInTheDocument();
    });
  });

  it('opens and closes the edit tag modal', async () => {
    renderManageTag(link);

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('editUserTag')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('editUserTag'));

    await waitFor(() => {
      return expect(
        screen.findByTestId('closeEditTagModalBtn'),
      ).resolves.toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('closeEditTagModalBtn'));

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('closeEditTagModalBtn'),
    );
  });

  it('opens and closes the remove tag modal', async () => {
    renderManageTag(link);

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('removeTag')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('removeTag'));

    await waitFor(() => {
      return expect(
        screen.findByTestId('removeUserTagModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('removeUserTagModalCloseBtn'));

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('removeUserTagModalCloseBtn'),
    );
  });

  it("navigates to the member's profile after clicking the view option", async () => {
    renderManageTag(link);

    await wait();

    await waitFor(() => {
      expect(screen.getAllByTestId('viewProfileBtn')[0]).toBeInTheDocument();
    });
    userEvent.click(screen.getAllByTestId('viewProfileBtn')[0]);

    await waitFor(() => {
      expect(screen.getByTestId('memberProfileScreen')).toBeInTheDocument();
    });
  });

  it('navigates to the subTags screen after clicking the subTags option', async () => {
    renderManageTag(link);

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('subTagsBtn')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('subTagsBtn'));

    await waitFor(() => {
      expect(screen.getByTestId('subTagsScreen')).toBeInTheDocument();
    });
  });

  it('navigates to the manageTag screen after clicking a tag in the breadcrumbs', async () => {
    renderManageTag(link);

    await wait();

    await waitFor(() => {
      expect(
        screen.getAllByTestId('redirectToManageTag')[0],
      ).toBeInTheDocument();
    });
    userEvent.click(screen.getAllByTestId('redirectToManageTag')[0]);

    await waitFor(() => {
      expect(screen.getByTestId('addPeopleToTagBtn')).toBeInTheDocument();
    });
  });

  it('navigates to organization tags screen screen after clicking tha all tags option in the breadcrumbs', async () => {
    renderManageTag(link);

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('allTagsBtn')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('allTagsBtn'));

    await waitFor(() => {
      expect(screen.getByTestId('organizationTagsScreen')).toBeInTheDocument();
    });
  });

  it('searchs for tags where the name matches the provided search input', async () => {
    renderManageTag(link);

    await wait();

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText(translations.searchByName),
      ).toBeInTheDocument();
    });
    const input = screen.getByPlaceholderText(translations.searchByName);
    fireEvent.change(input, { target: { value: 'assigned user' } });

    // should render the two users from the mock data
    // where firstName starts with "assigned" and lastName starts with "user"
    await waitFor(() => {
      const buttons = screen.getAllByTestId('viewProfileBtn');
      expect(buttons.length).toEqual(2);
    });
  });

  it('fetches the tags by the sort order, i.e. latest or oldest first', async () => {
    renderManageTag(link);

    await wait();

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText(translations.searchByName),
      ).toBeInTheDocument();
    });
    const input = screen.getByPlaceholderText(translations.searchByName);
    fireEvent.change(input, { target: { value: 'assigned user' } });

    // should render the two searched tags from the mock data
    // where name starts with "searchUserTag"
    await waitFor(() => {
      expect(screen.getAllByTestId('memberName')[0]).toHaveTextContent(
        'assigned user1',
      );
    });

    // now change the sorting order
    await waitFor(() => {
      expect(screen.getByTestId('sortPeople')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('sortPeople'));

    await waitFor(() => {
      expect(screen.getByTestId('ASCENDING')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('ASCENDING'));

    // returns the tags in reverse order
    await waitFor(() => {
      expect(screen.getAllByTestId('memberName')[0]).toHaveTextContent(
        'assigned user2',
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('sortPeople')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('sortPeople'));

    await waitFor(() => {
      expect(screen.getByTestId('DESCENDING')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('DESCENDING'));

    // reverse the order again
    await waitFor(() => {
      expect(screen.getAllByTestId('memberName')[0]).toHaveTextContent(
        'assigned user1',
      );
    });
  });

  it('Fetches more assigned members with infinite scroll', async () => {
    const { getByText } = renderManageTag(link);

    await wait();

    await waitFor(() => {
      expect(getByText(translations.addPeopleToTag)).toBeInTheDocument();
    });

    const manageTagScrollableDiv = screen.getByTestId('manageTagScrollableDiv');

    // Get the initial number of tags loaded
    const initialAssignedMembersDataLength =
      screen.getAllByTestId('viewProfileBtn').length;

    // Set scroll position to the bottom
    fireEvent.scroll(manageTagScrollableDiv, {
      target: { scrollY: manageTagScrollableDiv.scrollHeight },
    });

    await waitFor(() => {
      const finalAssignedMembersDataLength =
        screen.getAllByTestId('viewProfileBtn').length;
      expect(finalAssignedMembersDataLength).toBeGreaterThan(
        initialAssignedMembersDataLength,
      );

      expect(getByText(translations.addPeopleToTag)).toBeInTheDocument();
    });
  });

  it('unassigns a tag from a member', async () => {
    renderManageTag(link);

    await wait();

    await waitFor(() => {
      expect(screen.getAllByTestId('unassignTagBtn')[0]).toBeInTheDocument();
    });
    userEvent.click(screen.getAllByTestId('unassignTagBtn')[0]);

    userEvent.click(screen.getByTestId('unassignTagModalSubmitBtn'));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        translations.successfullyUnassigned,
      );
    });
  });

  it('successfully edits the tag name', async () => {
    renderManageTag(link);

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('editUserTag')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('editUserTag'));

    userEvent.click(screen.getByTestId('editTagSubmitBtn'));

    await waitFor(() => {
      expect(toast.info).toHaveBeenCalledWith(translations.changeNameToEdit);
    });

    const tagNameInput = screen.getByTestId('tagNameInput');
    await userEvent.clear(tagNameInput);
    await userEvent.type(tagNameInput, 'tag 1 edited');
    expect(tagNameInput).toHaveValue('tag 1 edited');

    userEvent.click(screen.getByTestId('editTagSubmitBtn'));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        translations.tagUpdationSuccess,
      );
    });
  });

  it('successfully removes the tag and redirects to orgTags page', async () => {
    renderManageTag(link);

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('removeTag')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('removeTag'));

    userEvent.click(screen.getByTestId('removeUserTagSubmitBtn'));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        translations.tagRemovalSuccess,
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('organizationTagsScreen')).toBeInTheDocument();
    });
  });
});
