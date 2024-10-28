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
import 'jest-location-mock';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { toast } from 'react-toastify';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18n from 'utils/i18nForTest';
import ManageTag from './ManageTag';
import {
  MOCKS,
  MOCKS_ERROR_ASSIGNED_MEMBERS,
  MOCKS_ERROR_TAG_ANCESTORS,
} from './ManageTagMocks';
import { type ApolloLink } from '@apollo/client';

const translations = {
  ...JSON.parse(
    JSON.stringify(i18n.getDataByLanguage('en')?.translation.manageTag ?? {}),
  ),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.common ?? {})),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.errors ?? {})),
};

const link = new StaticMockLink(MOCKS, true);
const link2 = new StaticMockLink(MOCKS_ERROR_ASSIGNED_MEMBERS, true);
const link3 = new StaticMockLink(MOCKS_ERROR_TAG_ANCESTORS, true);

async function wait(ms = 500): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    info: jest.fn(),
    error: jest.fn(),
  },
}));

/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports */
jest.mock('../../components/AddPeopleToTag/AddPeopleToTag', () => {
  return require('./ManageTagMockComponents/MockAddPeopleToTag').default;
});

jest.mock('../../components/TagActions/TagActions', () => {
  return require('./ManageTagMockComponents/MockTagActions').default;
});
/* eslint-enable @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports */

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
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useParams: () => ({ orgId: 'orgId' }),
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  test('Component loads correctly', async () => {
    const { getByText } = renderManageTag(link);

    await wait();

    await waitFor(() => {
      expect(getByText(translations.addPeopleToTag)).toBeInTheDocument();
    });
  });

  test('renders error component on unsuccessful userTag assigned members query', async () => {
    const { queryByText } = renderManageTag(link2);

    await wait();

    await waitFor(() => {
      expect(queryByText(translations.addPeopleToTag)).not.toBeInTheDocument();
    });
  });

  test('renders error component on unsuccessful userTag ancestors query', async () => {
    const { queryByText } = renderManageTag(link3);

    await wait();

    await waitFor(() => {
      expect(queryByText(translations.addPeopleToTag)).not.toBeInTheDocument();
    });
  });

  test('opens and closes the add people to tag modal', async () => {
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

  test('opens and closes the unassign tag modal', async () => {
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

  test('opens and closes the assignToTags modal', async () => {
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

  test('opens and closes the removeFromTags modal', async () => {
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

  test('opens and closes the edit tag modal', async () => {
    renderManageTag(link);

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('editTag')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('editTag'));

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

  test('opens and closes the remove tag modal', async () => {
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

  test("navigates to the member's profile after clicking the view option", async () => {
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

  test('navigates to the subTags screen after clicking the subTags option', async () => {
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

  test('navigates to the manageTag screen after clicking a tag in the breadcrumbs', async () => {
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

  test('navigates to organization tags screen screen after clicking tha all tags option in the breadcrumbs', async () => {
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

  test('Fetches more assigned members with infinite scroll', async () => {
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

  test('unassigns a tag from a member', async () => {
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

  test('successfully edits the tag name', async () => {
    renderManageTag(link);

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('editTag')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('editTag'));

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

  test('successfully removes the tag and redirects to orgTags page', async () => {
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
