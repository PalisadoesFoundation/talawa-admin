import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import type { RenderResult } from '@testing-library/react';
import { render, screen, cleanup, waitFor, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router';
import { I18nextProvider } from 'react-i18next';

import { store } from 'state/store';
import userEvent from '@testing-library/user-event';
import { StaticMockLink } from 'utils/StaticMockLink';
import type { ApolloLink } from '@apollo/client';
import type { InterfaceTagActionsProps } from 'types/AdminPortal/TagActions/interface';
import TagActions from './TagActions';
import i18n from 'utils/i18nForTest';
import { vi } from 'vitest';
import {
  MOCKS,
  MOCKS_ERROR_ASSIGN_OR_REMOVAL_TAGS,
  MOCKS_ERROR_SUBTAGS_QUERY,
} from './TagActionsMocks';
import type { TFunction } from 'i18next';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';

const link1 = new StaticMockLink(MOCKS, true);
const link2 = new StaticMockLink(MOCKS_ERROR_SUBTAGS_QUERY, true);
const link3 = new StaticMockLink(MOCKS_ERROR_ASSIGN_OR_REMOVAL_TAGS);
async function wait(ms = 500): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
    error: vi.fn(),
    success: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
    dismiss: vi.fn(),
  },
}));

const translations = {
  ...JSON.parse(
    JSON.stringify(i18n.getDataByLanguage('en')?.translation.manageTag ?? {}),
  ),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.common ?? {})),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.errors ?? {})),
};

const props: InterfaceTagActionsProps[] = [
  {
    tagActionsModalIsOpen: true,
    hideTagActionsModal: () => {},
    tagActionType: 'assignToTags',
    t: ((key: string) => translations[key]) as TFunction<
      'translation',
      'manageTag'
    >,
    tCommon: ((key: string) => translations[key]) as TFunction<
      'common',
      undefined
    >,
  },
  {
    tagActionsModalIsOpen: true,
    hideTagActionsModal: () => {},
    tagActionType: 'removeFromTags',
    t: ((key: string) => translations[key]) as TFunction<
      'translation',
      'manageTag'
    >,
    tCommon: ((key: string) => translations[key]) as TFunction<
      'common',
      undefined
    >,
  },
];

const renderTagActionsModal = (
  props: InterfaceTagActionsProps,
  link: ApolloLink,
): RenderResult => {
  return render(
    <MockedProvider link={link}>
      <MemoryRouter initialEntries={['/admin/orgtags/123/manageTag/1']}>
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <Routes>
              <Route
                path="/admin/orgtags/:orgId/manageTag/:tagId"
                element={<TagActions {...props} />}
              />
            </Routes>
          </I18nextProvider>
        </Provider>
      </MemoryRouter>
    </MockedProvider>,
  );
};

describe('Organisation Tags Page', () => {
  beforeEach(() => {
    vi.mock('react-router', async () => {
      const actualModule = await vi.importActual('react-router');
      return {
        ...actualModule,
      };
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  test('Component loads correctly and opens assignToTags modal', async () => {
    const { getByText } = renderTagActionsModal(props[0], link1);

    await wait();

    await waitFor(() => {
      expect(getByText(translations.assign)).toBeInTheDocument();
    });
  });

  test('Component loads correctly and opens removeFromTags modal', async () => {
    const { getByText } = renderTagActionsModal(props[1], link1);

    await wait();

    await waitFor(() => {
      expect(getByText(translations.remove)).toBeInTheDocument();
    });
  });

  test('Component calls hideTagActionsModal when modal is closed', async () => {
    const user = userEvent.setup();
    const hideTagActionsModalMock = vi.fn();

    const props2: InterfaceTagActionsProps = {
      tagActionsModalIsOpen: true,
      hideTagActionsModal: hideTagActionsModalMock,
      tagActionType: 'assignToTags',
      t: ((key: string) => translations[key]) as TFunction<
        'translation',
        'manageTag'
      >,
      tCommon: ((key: string) => translations[key]) as TFunction<
        'common',
        undefined
      >,
    };

    renderTagActionsModal(props2, link1);

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('closeTagActionsModalBtn')).toBeInTheDocument();
    });
    await user.click(screen.getByTestId('closeTagActionsModalBtn'));

    await waitFor(() => {
      expect(hideTagActionsModalMock).toHaveBeenCalled();
    });
  });

  test('Renders error component when when subTags query is unsuccessful', async () => {
    const user = userEvent.setup();
    const { getByText } = renderTagActionsModal(props[0], link2);

    await wait();

    // expand tag 1 to list its subtags
    await waitFor(() => {
      expect(screen.getByTestId('expandSubTags1')).toBeInTheDocument();
    });
    await user.click(screen.getByTestId('expandSubTags1'));

    await waitFor(() => {
      expect(
        getByText(translations.errorOccurredWhileLoadingSubTags),
      ).toBeInTheDocument();
    });
  });

  test('searches for tags where the name matches the provided search input', async () => {
    const user = userEvent.setup();
    renderTagActionsModal(props[0], link1);

    await wait();

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText(translations.searchByName),
      ).toBeInTheDocument();
    });
    const input = screen.getByPlaceholderText(translations.searchByName);
    await user.clear(input);
    await user.type(input, 'searchUserTag');

    // should render the two searched tags from the mock data
    // where name starts with "searchUserTag"
    await waitFor(() => {
      const tags = screen.getAllByTestId('orgUserTag');
      expect(tags.length).toEqual(2);
    });
  });

  test('Selects and deselects tags', async () => {
    const user = userEvent.setup();
    renderTagActionsModal(props[0], link1);

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('checkTag1')).toBeInTheDocument();
    });
    await user.click(screen.getByTestId('checkTag1'));

    await waitFor(() => {
      expect(screen.getByTestId('checkTag2')).toBeInTheDocument();
    });
    await user.click(screen.getByTestId('checkTag2'));

    await waitFor(() => {
      expect(screen.getByTestId('checkTag1')).toBeInTheDocument();
    });
    await user.click(screen.getByTestId('checkTag1'));

    await waitFor(() => {
      expect(screen.getByTestId('clearSelectedTag2')).toBeInTheDocument();
    });
    await user.click(screen.getByTestId('clearSelectedTag2'));
  });

  test('fetches and lists the child tags and then selects and deselects them', async () => {
    const user = userEvent.setup();
    renderTagActionsModal(props[0], link1);

    await wait();

    // expand tag 1 to list its subtags
    await waitFor(() => {
      expect(screen.getByTestId('expandSubTags1')).toBeInTheDocument();
    });
    await user.click(screen.getByTestId('expandSubTags1'));

    await waitFor(() => {
      expect(screen.getByTestId('subTagsScrollableDiv1')).toBeInTheDocument();
    });
    // Find the infinite scroll div for subtags by test ID or another selector
    const subTagsScrollableDiv1 = screen.getByTestId('subTagsScrollableDiv1');

    const initialTagsDataLength =
      screen.getAllByTestId('orgUserSubTags').length;

    // Set scroll position to the bottom
    act(() => {
      subTagsScrollableDiv1.scrollTop = subTagsScrollableDiv1.scrollHeight;
      subTagsScrollableDiv1.dispatchEvent(
        new Event('scroll', { bubbles: true }),
      );
    });

    await waitFor(() => {
      const finalTagsDataLength =
        screen.getAllByTestId('orgUserSubTags').length;
      expect(finalTagsDataLength).toBeGreaterThan(initialTagsDataLength);
    });

    // select subtags 1 & 2
    await waitFor(() => {
      expect(screen.getByTestId('checkTagsubTag1')).toBeInTheDocument();
    });
    await user.click(screen.getByTestId('checkTagsubTag1'));

    await waitFor(() => {
      expect(screen.getByTestId('checkTagsubTag2')).toBeInTheDocument();
    });
    await user.click(screen.getByTestId('checkTagsubTag2'));

    await waitFor(() => {
      expect(screen.getByTestId('checkTag1')).toBeInTheDocument();
    });
    await user.click(screen.getByTestId('checkTag1'));

    // deselect subtags 1 & 2
    await waitFor(() => {
      expect(screen.getByTestId('checkTagsubTag1')).toBeInTheDocument();
    });
    await user.click(screen.getByTestId('checkTagsubTag1'));

    await waitFor(() => {
      expect(screen.getByTestId('checkTagsubTag2')).toBeInTheDocument();
    });
    await user.click(screen.getByTestId('checkTagsubTag2'));

    // hide subtags of tag 1
    await waitFor(() => {
      expect(screen.getByTestId('expandSubTags1')).toBeInTheDocument();
    });
    await user.click(screen.getByTestId('expandSubTags1'));
  });

  test('Toasts error when no tag is selected while assigning', async () => {
    const user = userEvent.setup();
    renderTagActionsModal(props[0], link1);

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('tagActionSubmitBtn')).toBeInTheDocument();
    });
    await user.click(screen.getByTestId('tagActionSubmitBtn'));

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith(
        translations.noTagSelected,
      );
    });
  });
  test('Toasts error when something goes wrong while assigning/removing tags', async () => {
    const user = userEvent.setup();
    renderTagActionsModal(props[0], link3);
    await wait();

    // Select tags 2 and 3 to match the mock variables
    await waitFor(() => {
      expect(screen.getByTestId('checkTag2')).toBeInTheDocument();
    });
    await user.click(screen.getByTestId('checkTag2'));
    await waitFor(() => {
      expect(screen.getByTestId('checkTag3')).toBeInTheDocument();
    });
    await user.click(screen.getByTestId('checkTag3'));

    await waitFor(() => {
      expect(screen.getByTestId('tagActionSubmitBtn')).toBeInTheDocument();
    });
    await user.click(screen.getByTestId('tagActionSubmitBtn'));

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith(
        'Mock Graphql Error While assigning/removing tags',
      );
    });
  });

  test('Successfully assigns to tags', async () => {
    const user = userEvent.setup();
    renderTagActionsModal(props[0], link1);

    await wait();

    // select userTags 2 & 3 and assign them
    await waitFor(() => {
      expect(screen.getByTestId('checkTag2')).toBeInTheDocument();
    });
    await user.click(screen.getByTestId('checkTag2'));

    await waitFor(() => {
      expect(screen.getByTestId('checkTag3')).toBeInTheDocument();
    });
    await user.click(screen.getByTestId('checkTag3'));

    await user.click(screen.getByTestId('tagActionSubmitBtn'));

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith(
        translations.successfullyAssignedToTags,
      );
    });
  });

  test('Successfully removes from tags', async () => {
    const user = userEvent.setup();
    renderTagActionsModal(props[1], link1);

    await wait();

    // select userTag 2 and remove people from it
    await waitFor(() => {
      expect(screen.getByTestId('checkTag2')).toBeInTheDocument();
    });
    await user.click(screen.getByTestId('checkTag2'));

    await user.click(screen.getByTestId('tagActionSubmitBtn'));

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith(
        translations.successfullyRemovedFromTags,
      );
    });
  });
});
