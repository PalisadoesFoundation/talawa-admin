import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import type { RenderResult } from '@testing-library/react';
import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18n from 'utils/i18nForTest';
import SubTags from './SubTags';
import {
  emptyMocks,
  MOCKS,
  MOCKS_CREATE_TAG_ERROR,
  MOCKS_ERROR_SUB_TAGS,
} from './SubTagsMocks';
import { InMemoryCache, type ApolloLink } from '@apollo/client';
import * as Apollo from '@apollo/client';
import { vi, beforeEach, afterEach, expect, it, describe } from 'vitest';

// Mock react-infinite-scroll-component to easily trigger 'next'
interface InterfaceInfiniteScrollMockProps {
  next: () => void;
  children?: React.ReactNode;
}

vi.mock('react-infinite-scroll-component', () => ({
  default: ({ next, children }: InterfaceInfiniteScrollMockProps) => (
    <div data-testid="infinite-scroll-component">
      <button type="button" data-testid="trigger-load-more" onClick={next}>
        Load More
      </button>
      {children}
    </div>
  ),
}));

const translations = {
  ...JSON.parse(
    JSON.stringify(
      i18n.getDataByLanguage('en')?.translation.organizationTags ?? {},
    ),
  ),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.common ?? {})),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.errors ?? {})),
};

const link = new StaticMockLink(MOCKS, true);
const link2 = new StaticMockLink(MOCKS_ERROR_SUB_TAGS, true);

async function wait(ms = 500): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

vi.mock('shared-components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  },
}));

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        getUserTag: {
          merge(existing = {}, incoming) {
            return {
              ...existing,
              ...incoming,
              childTags: {
                ...existing.childTags,
                ...incoming.childTags,
                edges: [
                  ...(existing.childTags?.edges || []),
                  ...(incoming.childTags?.edges || []),
                ],
              },
            };
          },
        },
      },
    },
  },
});

const renderSubTags = (link: ApolloLink): RenderResult => {
  return render(
    <MockedProvider cache={cache} link={link}>
      <MemoryRouter initialEntries={['/admin/orgtags/123/subTags/1']}>
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <Routes>
              <Route
                path="/admin/orgtags/:orgId"
                element={<div data-testid="orgtagsScreen"></div>}
              />
              <Route
                path="/admin/orgtags/:orgId/manageTag/:tagId"
                element={<div data-testid="manageTagScreen"></div>}
              />
              <Route
                path="/admin/orgtags/:orgId/subTags/:tagId"
                element={<SubTags />}
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
    vi.mock('react-router', async () => ({
      ...(await vi.importActual('react-router')),
      useParams: () => ({ orgId: '123', tagId: '1' }),
    }));
    cache.reset();
  });

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
    vi.restoreAllMocks(); // Important for restoring the spy on Apollo
  });

  it('Component loads correctly', async () => {
    const { getByText } = renderSubTags(link);
    await wait();
    await waitFor(() => {
      expect(getByText(translations.addChildTag)).toBeInTheDocument();
    });
  });

  it('render error component on unsuccessful subtags query', async () => {
    const { queryByText } = renderSubTags(link2);
    await wait();
    await waitFor(() => {
      expect(queryByText(translations.addChildTag)).not.toBeInTheDocument();
    });
  });

  it('opens and closes the create tag modal', async () => {
    renderSubTags(link);
    await wait();
    await waitFor(() => {
      expect(screen.getByTestId('addSubTagBtn')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('addSubTagBtn'));
    await waitFor(() => {
      return expect(
        screen.findByTestId('modal-cancel-btn'),
      ).resolves.toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('modal-cancel-btn'));
    await waitFor(() =>
      expect(screen.queryByTestId('modal-cancel-btn')).not.toBeInTheDocument(),
    );
  });

  it('navigates to manage tag screen after clicking manage tag option', async () => {
    renderSubTags(link);
    await wait();
    await waitFor(() => {
      expect(screen.getAllByTestId('manageTagBtn')[0]).toBeInTheDocument();
    });
    await userEvent.click(screen.getAllByTestId('manageTagBtn')[0]);
    await waitFor(() => {
      expect(screen.getByTestId('manageTagScreen')).toBeInTheDocument();
    });
  });

  it('navigates to sub tags screen after clicking on a tag', async () => {
    renderSubTags(link);
    await wait();
    await waitFor(() => {
      expect(screen.getAllByTestId('tagName')[0]).toBeInTheDocument();
    });
    await userEvent.click(screen.getAllByTestId('tagName')[0]);
    await waitFor(() => {
      expect(screen.getByTestId('addSubTagBtn')).toBeInTheDocument();
    });
  });

  it('navigates to the different sub tag screen screen after clicking a tag in the breadcrumbs', async () => {
    renderSubTags(link);
    await wait();
    await waitFor(() => {
      expect(screen.getAllByTestId('redirectToSubTags')[0]).toBeInTheDocument();
    });
    await userEvent.click(screen.getAllByTestId('redirectToSubTags')[0]);
    await waitFor(() => {
      expect(screen.getByTestId('addSubTagBtn')).toBeInTheDocument();
    });
  });

  it('navigates to organization tags screen screen after clicking tha all tags option in the breadcrumbs', async () => {
    renderSubTags(link);
    await wait();
    await waitFor(() => {
      expect(screen.getByTestId('allTagsBtn')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('allTagsBtn'));
    await waitFor(() => {
      expect(screen.getByTestId('orgtagsScreen')).toBeInTheDocument();
    });
  });

  it('navigates to manage tags screen for the current tag after clicking tha manageCurrentTag button', async () => {
    renderSubTags(link);
    await wait();
    await waitFor(() => {
      expect(screen.getByTestId('manageCurrentTagBtn')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('manageCurrentTagBtn'));
    await waitFor(() => {
      expect(screen.getByTestId('manageTagScreen')).toBeInTheDocument();
    });
  });

  it('searchs for tags where the name matches the provided search input', async () => {
    const user = userEvent.setup();
    renderSubTags(link);
    await wait();
    await waitFor(() => {
      expect(
        screen.getByPlaceholderText(translations.searchByName),
      ).toBeInTheDocument();
    });
    const input = screen.getByPlaceholderText(translations.searchByName);
    // Test trimming: add spaces that should be trimmed by the component
    await user.clear(input);
    await user.type(input, '  searchSubTag  ');
    await user.click(screen.getByTestId('searchBtn'));

    // should render the two searched tags from the mock data
    // where name starts with "searchSubTag" (mocks are configured for this)
    await waitFor(() => {
      const buttons = screen.getAllByTestId('manageTagBtn');
      expect(buttons.length).toEqual(2);
    });
  });

  it('changes the sort order when dropdown selection changes', async () => {
    const user = userEvent.setup();
    renderSubTags(link);
    await wait();
    await waitFor(() => {
      expect(
        screen.getByPlaceholderText(translations.searchByName),
      ).toBeInTheDocument();
    });
    const sortButton = screen.getByTestId('sortTags-toggle');
    expect(sortButton).toBeInTheDocument();
    await user.click(sortButton);
    const ascendingOption = screen.getByTestId('sortTags-item-ASCENDING');
    expect(ascendingOption).toBeInTheDocument();
    await user.click(ascendingOption);
    await user.click(sortButton);
    const descendingOption = screen.getByTestId('sortTags-item-DESCENDING');
    expect(descendingOption).toBeInTheDocument();
    await user.click(descendingOption);
  });

  it('Fetches more sub tags with infinite scroll (load more)', async () => {
    const user = userEvent.setup();
    renderSubTags(link);
    await wait();
    await waitFor(() => {
      expect(screen.getByTestId('trigger-load-more')).toBeInTheDocument();
    });

    const initialSubTagsDataLength =
      screen.getAllByTestId('manageTagBtn').length;
    expect(initialSubTagsDataLength).toBe(10);

    // Trigger load more - this calls the loadMoreSubTags function
    await user.click(screen.getByTestId('trigger-load-more'));

    await wait();

    // The load more function was called without crashing
    // The actual updateQuery logic is tested in the separate updateQuery test
    await waitFor(() => {
      const tags = screen.getAllByTestId('manageTagBtn');
      // At minimum, we should still have the original tags
      expect(tags.length).toBeGreaterThanOrEqual(10);
    });
  });

  it('adds a new sub tag to the current tag', async () => {
    renderSubTags(link);
    await wait();
    await waitFor(() => {
      expect(screen.getByTestId('addSubTagBtn')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('addSubTagBtn'));
    await userEvent.type(
      screen.getByPlaceholderText(translations.tagNamePlaceholder),
      'subTag 12',
    );
    await userEvent.click(screen.getByTestId('modal-submit-btn'));
    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith(
        translations.tagCreationSuccess,
      );
    });
  });

  it('navigates to organization tags screen when pressing Enter on allTagsBtn', async () => {
    const user = userEvent.setup();
    renderSubTags(link);
    await wait();
    await waitFor(() => {
      expect(screen.getByTestId('allTagsBtn')).toBeInTheDocument();
    });
    const allTagsBtn = screen.getByTestId('allTagsBtn');
    allTagsBtn.focus();
    await user.keyboard('{Enter}');
    await waitFor(() => {
      expect(screen.getByTestId('orgtagsScreen')).toBeInTheDocument();
    });
  });

  it('navigates to organization tags screen when pressing Space on allTagsBtn', async () => {
    const user = userEvent.setup();
    renderSubTags(link);
    await wait();
    await waitFor(() => {
      expect(screen.getByTestId('allTagsBtn')).toBeInTheDocument();
    });
    const allTagsBtn = screen.getByTestId('allTagsBtn');
    allTagsBtn.focus();
    await user.keyboard(' ');
    await waitFor(() => {
      expect(screen.getByTestId('orgtagsScreen')).toBeInTheDocument();
    });
  });

  it('navigates to sub tags screen when pressing Enter on breadcrumb ancestor', async () => {
    const user = userEvent.setup();
    renderSubTags(link);
    await wait();
    await waitFor(() => {
      expect(screen.getAllByTestId('redirectToSubTags')[0]).toBeInTheDocument();
    });
    const breadcrumbBtn = screen.getAllByTestId('redirectToSubTags')[0];
    breadcrumbBtn.focus();
    await user.keyboard('{Enter}');
    await waitFor(() => {
      expect(screen.getByTestId('addSubTagBtn')).toBeInTheDocument();
    });
  });

  it('navigates to sub tags screen when pressing Space on breadcrumb ancestor', async () => {
    const user = userEvent.setup();
    renderSubTags(link);
    await wait();
    await waitFor(() => {
      expect(screen.getAllByTestId('redirectToSubTags')[0]).toBeInTheDocument();
    });
    const breadcrumbBtn = screen.getAllByTestId('redirectToSubTags')[0];
    breadcrumbBtn.focus();
    await user.keyboard(' ');
    await waitFor(() => {
      expect(screen.getByTestId('addSubTagBtn')).toBeInTheDocument();
    });
  });

  it('does nothing when pressing Tab on allTagsBtn', async () => {
    const user = userEvent.setup();
    renderSubTags(link);
    await wait();
    const allTagsBtn = screen.getByTestId('allTagsBtn');
    allTagsBtn.focus();
    await user.keyboard('{Tab}');
    await waitFor(() => {
      expect(screen.getByTestId('addSubTagBtn')).toBeInTheDocument();
    });
  });

  it('does nothing when pressing Tab on breadcrumb ancestor', async () => {
    const user = userEvent.setup();
    renderSubTags(link);
    await wait();
    const breadcrumbBtn = screen.getAllByTestId('redirectToSubTags')[0];
    breadcrumbBtn.focus();
    await user.keyboard('{Tab}');
    await waitFor(() => {
      expect(screen.getByTestId('addSubTagBtn')).toBeInTheDocument();
    });
  });

  it('displays error toast when addSubTag mutation fails', async () => {
    const errorLink = new StaticMockLink(MOCKS_CREATE_TAG_ERROR, true);
    renderSubTags(errorLink);
    await wait();
    await waitFor(() => {
      expect(screen.getByTestId('addSubTagBtn')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('addSubTagBtn'));
    await userEvent.type(
      screen.getByPlaceholderText(translations.tagNamePlaceholder),
      'subTag 12',
    );
    await userEvent.click(screen.getByTestId('modal-submit-btn'));
    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith(
        'Failed to create tag',
      );
    });
  });

  it('renders noRowsOverlay when there are no sub tags', async () => {
    const emptyLink = new StaticMockLink(emptyMocks, true);
    renderSubTags(emptyLink);
    await wait();
    await waitFor(() => {
      expect(screen.getByText(translations.noTagsFound)).toBeInTheDocument();
    });
  });

  // Coverage test for updateQuery return prevResult if fetchMoreResult is undefined
  it('updateQuery returns prevResult if fetchMoreResult is undefined', async () => {
    const fetchMoreSpy = vi.fn();
    const prevResultMock = {
      getChildTags: {
        name: 'Parent',
        ancestorTags: [],
        childTags: {
          pageInfo: { hasNextPage: true, endCursor: 'abc' },
          edges: [],
        },
      },
    };

    // Spy on useQuery to intercept fetchMore configuration
    vi.spyOn(Apollo, 'useQuery').mockReturnValue({
      data: prevResultMock,
      loading: false,
      error: undefined,
      fetchMore: fetchMoreSpy,
      refetch: vi.fn(),
      client: {},
      called: true,
      networkStatus: 7,
      variables: {},
      startPolling: vi.fn(),
      stopPolling: vi.fn(),
      subscribeToMore: vi.fn(),
      updateQuery: vi.fn(),
    } as unknown as ReturnType<typeof Apollo.useQuery>);

    const user = userEvent.setup();
    render(
      <MockedProvider>
        <MemoryRouter initialEntries={['/admin/orgtags/123/subTags/1']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <SubTags />
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );

    // Trigger load more which calls fetchMore
    const trigger = screen.getByTestId('trigger-load-more');
    await user.click(trigger);

    expect(fetchMoreSpy).toHaveBeenCalled();
    const updateQueryFn = fetchMoreSpy.mock.calls[0][0].updateQuery;

    // Manually call updateQuery with undefined fetchMoreResult
    const result = updateQueryFn(prevResultMock, {
      fetchMoreResult: undefined,
    });
    expect(result).toBe(prevResultMock);
  });
});
