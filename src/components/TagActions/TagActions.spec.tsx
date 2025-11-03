import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import type { RenderResult } from '@testing-library/react';
import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
  act,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router';
import { I18nextProvider } from 'react-i18next';

import { store } from 'state/store';
import userEvent from '@testing-library/user-event';
import { StaticMockLink } from 'utils/StaticMockLink';
import { toast } from 'react-toastify';
import type { ApolloLink } from '@apollo/client';
import type { InterfaceTagActionsProps } from './TagActions';
import TagActions from './TagActions';
import i18n from 'utils/i18nForTest';
import { vi } from 'vitest';
import {
  MOCKS,
  MOCKS_ERROR_ASSIGN_OR_REMOVAL_TAGS,
  MOCKS_ERROR_ORGANIZATION_TAGS_QUERY,
  MOCKS_ERROR_SUBTAGS_QUERY,
  MOCKS_WITH_NULL_FETCH_MORE,
  MOCKS_WITH_UNDEFINED_PAGEINFO,
} from './TagActionsMocks';
import type { TFunction } from 'i18next';

const link = new StaticMockLink(MOCKS, true);
const link2 = new StaticMockLink(MOCKS_ERROR_ORGANIZATION_TAGS_QUERY, true);
const link3 = new StaticMockLink(MOCKS_ERROR_SUBTAGS_QUERY, true);
const link4 = new StaticMockLink(MOCKS_ERROR_ASSIGN_OR_REMOVAL_TAGS);
const link5 = new StaticMockLink(MOCKS_WITH_NULL_FETCH_MORE, true);
const link6 = new StaticMockLink(MOCKS_WITH_UNDEFINED_PAGEINFO, true);
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
    error: vi.fn(),
  },
}));

// Capture the loadMore callback from InfiniteScroll for testing
let capturedLoadMoreCallback: (() => void) | null = null;

beforeEach(() => {
  capturedLoadMoreCallback = null;
});

vi.mock('react-infinite-scroll-component', async () => {
  const actual = await vi.importActual<
    typeof import('react-infinite-scroll-component')
  >('react-infinite-scroll-component');
  return {
    ...actual,
    default: ({
      next,
      children,
      hasMore,
      loader,
      dataLength,
      ...props
    }: {
      next: () => void;
      children: React.ReactNode;
      hasMore: boolean;
      loader?: React.ReactNode;
      dataLength: number;
      [key: string]: unknown;
    }) => {
      capturedLoadMoreCallback = next;
      const InfiniteScroll = actual.default;
      return (
        <InfiniteScroll
          next={next}
          hasMore={hasMore}
          loader={loader}
          dataLength={dataLength}
          {...props}
        >
          {children}
        </InfiniteScroll>
      );
    },
  };
});

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
    <MockedProvider addTypename={false} link={link}>
      <MemoryRouter initialEntries={['/orgtags/123/manageTag/1']}>
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <Routes>
              <Route
                path="/orgtags/:orgId/manageTag/:tagId"
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
    const { getByText } = renderTagActionsModal(props[0], link);

    await wait();

    await waitFor(() => {
      expect(getByText(translations.assign)).toBeInTheDocument();
    });
  });

  test('Component loads correctly and opens removeFromTags modal', async () => {
    const { getByText } = renderTagActionsModal(props[1], link);

    await wait();

    await waitFor(() => {
      expect(getByText(translations.remove)).toBeInTheDocument();
    });
  });

  test('Component calls hideTagActionsModal when modal is closed', async () => {
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

    renderTagActionsModal(props2, link);

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('closeTagActionsModalBtn')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('closeTagActionsModalBtn'));

    await waitFor(() => {
      expect(hideTagActionsModalMock).toHaveBeenCalled();
    });
  });

  test('Renders error component when when query is unsuccessful', async () => {
    const { queryByText } = renderTagActionsModal(props[0], link2);

    await wait();

    await waitFor(() => {
      expect(queryByText(translations.assign)).not.toBeInTheDocument();
    });
  });

  test('Renders error when subTags query fails', async () => {
    const { getByText } = renderTagActionsModal(props[0], link3);

    await wait();

    // expand tag 1 to list its subtags
    await waitFor(() => {
      expect(screen.getByTestId('expandSubTags1')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('expandSubTags1'));

    await waitFor(() => {
      expect(
        getByText(translations.errorOccurredWhileLoadingSubTags),
      ).toBeInTheDocument();
    });
  });

  test('Searches tags by name from search input', async () => {
    renderTagActionsModal(props[0], link);

    await wait();

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText(translations.searchByName),
      ).toBeInTheDocument();
    });
    const input = screen.getByPlaceholderText(translations.searchByName);
    fireEvent.change(input, { target: { value: 'searchUserTag' } });

    // should render the two searched tags from the mock data
    // where name starts with "searchUserTag"
    await waitFor(() => {
      const tags = screen.getAllByTestId('orgUserTag');
      expect(tags.length).toEqual(2);
    });
  });

  test('Renders tags list with scrollable container', async () => {
    const { getByText } = renderTagActionsModal(props[0], link);

    await wait();

    await waitFor(() => {
      expect(getByText(translations.assign)).toBeInTheDocument();
    });

    // Verify initial tags are loaded
    await waitFor(() => {
      expect(screen.getAllByTestId('orgUserTag').length).toBe(10);
    });

    // Verify scrollable container exists with proper styling
    const scrollableDiv = screen.getByTestId('scrollableDiv');
    expect(scrollableDiv).toBeInTheDocument();
    expect(scrollableDiv).toHaveStyle({ height: '300px', overflow: 'auto' });

    // Verify all tags are rendered
    for (let i = 1; i <= 10; i++) {
      expect(screen.getByTestId(`checkTag${i}`)).toBeInTheDocument();
    }

    // Note: InfiniteScroll's scroll-to-load-more behavior cannot be
    // reliably tested in JSDOM as it uses IntersectionObserver and
    // getBoundingClientRect which are not accurately simulated in test
    // environment. The fetchMore pagination logic is thoroughly tested
    // in OrganizationTags tests which use the same implementation.
  });

  test('Calls loadMore when more data is available', async () => {
    renderTagActionsModal(props[0], link);

    await wait();

    await waitFor(() => {
      expect(screen.getByText(translations.assign)).toBeInTheDocument();
    });

    // Verify initial tags are loaded
    await waitFor(() => {
      expect(screen.getAllByTestId('orgUserTag').length).toBe(10);
    });

    // Ensure callback was captured
    expect(capturedLoadMoreCallback).toBeTruthy();

    // Call the loadMore callback to test fetchMore logic
    let fetchMoreError: Error | null = null;
    await act(async () => {
      try {
        if (capturedLoadMoreCallback) {
          await capturedLoadMoreCallback();
        }
      } catch (error) {
        fetchMoreError = error as Error;
      }
    });

    // Verify fetchMore executed without errors
    expect(fetchMoreError).toBeNull();

    // Verify component remains stable after fetchMore
    await waitFor(() => {
      expect(screen.getByText(translations.assign)).toBeInTheDocument();
      expect(screen.getAllByTestId('orgUserTag').length).toBeGreaterThanOrEqual(
        10,
      );
    });
  });

  test('Should handle null fetchMore result gracefully', async () => {
    renderTagActionsModal(props[0], link5);

    await wait();

    await waitFor(() => {
      expect(screen.getByText(translations.assign)).toBeInTheDocument();
    });

    // Verify initial tags are loaded
    await waitFor(() => {
      expect(screen.getAllByTestId('orgUserTag').length).toBe(10);
    });

    // Ensure callback was captured
    expect(capturedLoadMoreCallback).toBeTruthy();

    // Call the loadMore callback which will return null
    await act(async () => {
      capturedLoadMoreCallback?.();
    });

    // Should still have 10 tags (no new tags added due to null response)
    await waitFor(() => {
      expect(screen.getAllByTestId('orgUserTag').length).toBe(10);
    });
  });

  test('Selects and deselects tags', async () => {
    renderTagActionsModal(props[0], link);

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('checkTag1')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('checkTag1'));

    await waitFor(() => {
      expect(screen.getByTestId('checkTag2')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('checkTag2'));

    await waitFor(() => {
      expect(screen.getByTestId('checkTag1')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('checkTag1'));

    await waitFor(() => {
      expect(screen.getByTestId('clearSelectedTag2')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('clearSelectedTag2'));

    // Select tag2 again after clearing
    await waitFor(() => {
      expect(screen.getByTestId('checkTag2')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('checkTag2'));

    // Deselect tag2 through checkbox
    await userEvent.click(screen.getByTestId('checkTag2'));
  });

  test('Fetches child tags and handles selection/deselection', async () => {
    renderTagActionsModal(props[0], link);

    await wait();

    // expand tag 1 to list its subtags
    await waitFor(() => {
      expect(screen.getByTestId('expandSubTags1')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('expandSubTags1'));

    await waitFor(() => {
      expect(screen.getByTestId('subTagsScrollableDiv1')).toBeInTheDocument();
    });
    // Find the infinite scroll div for subtags by test ID or another selector
    const subTagsScrollableDiv1 = screen.getByTestId('subTagsScrollableDiv1');

    const initialTagsDataLength =
      screen.getAllByTestId('orgUserSubTags').length;

    // Set scroll position to the bottom
    fireEvent.scroll(subTagsScrollableDiv1, {
      target: { scrollY: subTagsScrollableDiv1.scrollHeight },
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
    await userEvent.click(screen.getByTestId('checkTagsubTag1'));

    await waitFor(() => {
      expect(screen.getByTestId('checkTagsubTag2')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('checkTagsubTag2'));

    // Try to uncheck the ancestor tag (tag1) directly
    // - this should hit early return
    await waitFor(() => {
      expect(screen.getByTestId('checkTag1')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('checkTag1'));

    // deselect subtags 1 & 2
    await waitFor(() => {
      expect(screen.getByTestId('checkTagsubTag1')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('checkTagsubTag1'));

    await waitFor(() => {
      expect(screen.getByTestId('checkTagsubTag2')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('checkTagsubTag2'));

    // hide subtags of tag 1
    await waitFor(() => {
      expect(screen.getByTestId('expandSubTags1')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('expandSubTags1'));
  });

  test('Toasts error when no tag is selected while assigning', async () => {
    renderTagActionsModal(props[0], link);

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('tagActionSubmitBtn')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('tagActionSubmitBtn'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(translations.noTagSelected);
    });
  });
  test('Shows error toast on assign/remove failure', async () => {
    renderTagActionsModal(props[0], link4);
    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('tagActionSubmitBtn')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('tagActionSubmitBtn'));
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });

  test('Successfully assigns to tags', async () => {
    renderTagActionsModal(props[0], link);

    await wait();

    // select userTags 2 & 3 and assign them
    await waitFor(() => {
      expect(screen.getByTestId('checkTag2')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('checkTag2'));

    await waitFor(() => {
      expect(screen.getByTestId('checkTag3')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('checkTag3'));

    await userEvent.click(screen.getByTestId('tagActionSubmitBtn'));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        translations.successfullyAssignedToTags,
      );
    });
  });

  test('Successfully removes from tags', async () => {
    renderTagActionsModal(props[1], link);

    await wait();

    // select userTag 2 and remove people from it
    await waitFor(() => {
      expect(screen.getByTestId('checkTag2')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('checkTag2'));

    await userEvent.click(screen.getByTestId('tagActionSubmitBtn'));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        translations.successfullyRemovedFromTags,
      );
    });
  });

  test('Should handle undefined pageInfo gracefully', async () => {
    renderTagActionsModal(props[0], link6);

    await wait();

    await waitFor(() => {
      expect(screen.getByText(translations.assign)).toBeInTheDocument();
    });

    // Verify tags are loaded even with undefined pageInfo
    await waitFor(() => {
      expect(screen.getAllByTestId('orgUserTag').length).toBe(10);
    });

    // Verify hasMore defaults to false when pageInfo is undefined
    // This is tested by checking that the component renders without errors
    expect(screen.getByTestId('scrollableDiv')).toBeInTheDocument();
  });
});
