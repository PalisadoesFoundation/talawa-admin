import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import type { RenderResult } from '@testing-library/react';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
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
  MOCKS_CREATE_NULL_DATA,
  MOCKS_CREATE_TAG_ERROR,
  MOCKS_ERROR_SUB_TAGS,
  MOCKS_NULL_ANCESTOR_TAGS,
  MOCKS_WITH_ANCESTORS,
} from './SubTagsMocks';
import type { ApolloLink } from '@apollo/client';
import { vi, afterEach, expect, it, describe } from 'vitest';

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

vi.mock('shared-components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  },
}));

const renderSubTags = (link: ApolloLink): RenderResult => {
  return render(
    <MockedProvider link={link}>
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
  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
    vi.restoreAllMocks();
  });

  it('Component loads correctly and displays parent tag name in manage button', async () => {
    renderSubTags(link);
    await waitFor(() => {
      expect(screen.getByText(translations.addChildTag)).toBeInTheDocument();
    });
    // Verify handleQueryResult populated the parentTagName from the query
    await waitFor(() => {
      expect(screen.getByTestId('manageCurrentTagBtn')).toHaveTextContent(
        `${translations.manageTag} userTag 1`,
      );
    });
  });

  it('render error component on unsuccessful subtags query', async () => {
    renderSubTags(link2);
    await waitFor(() => {
      expect(screen.getByTestId('cursor-pagination-error')).toBeInTheDocument();
    });
  });

  it('opens and closes the create tag modal', async () => {
    renderSubTags(link);
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
    await waitFor(() => {
      expect(screen.getAllByTestId('tagName')[0]).toBeInTheDocument();
    });
    await userEvent.click(screen.getAllByTestId('tagName')[0]);
    await waitFor(() => {
      expect(screen.getByTestId('addSubTagBtn')).toBeInTheDocument();
    });
  });

  it('navigates to sub tags screen when pressing Enter on a tag name', async () => {
    const user = userEvent.setup();
    renderSubTags(link);
    await waitFor(() => {
      expect(screen.getAllByTestId('tagName')[0]).toBeInTheDocument();
    });
    const tagName = screen.getAllByTestId('tagName')[0];
    tagName.focus();
    await user.keyboard('{Enter}');
    await waitFor(() => {
      expect(screen.getByTestId('addSubTagBtn')).toBeInTheDocument();
    });
  });

  it('navigates to sub tags screen when pressing Space on a tag name', async () => {
    const user = userEvent.setup();
    renderSubTags(link);
    await waitFor(() => {
      expect(screen.getAllByTestId('tagName')[0]).toBeInTheDocument();
    });
    const tagName = screen.getAllByTestId('tagName')[0];
    tagName.focus();
    await user.keyboard(' ');
    await waitFor(() => {
      expect(screen.getByTestId('addSubTagBtn')).toBeInTheDocument();
    });
  });

  it('navigates to the different sub tag screen screen after clicking a tag in the breadcrumbs', async () => {
    renderSubTags(link);
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
    await waitFor(() => {
      expect(
        screen.getByPlaceholderText(translations.searchByName),
      ).toBeInTheDocument();
    });
    const input = screen.getByPlaceholderText(translations.searchByName);
    await user.clear(input);
    await user.type(input, '  searchSubTag  ');

    // SearchFilterBar uses debounced onChange (no search button),
    // so wait for the debounce to trigger and results to render
    await waitFor(() => {
      const buttons = screen.getAllByTestId('manageTagBtn');
      expect(buttons.length).toEqual(2);
    });
  });

  it('changes the sort order when dropdown selection changes', async () => {
    const user = userEvent.setup();
    renderSubTags(link);
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

  it('Fetches more sub tags with load more button', async () => {
    const user = userEvent.setup();
    renderSubTags(link);
    await waitFor(() => {
      expect(screen.getByTestId('load-more-button')).toBeInTheDocument();
    });

    const initialSubTagsDataLength =
      screen.getAllByTestId('manageTagBtn').length;
    expect(initialSubTagsDataLength).toBe(10);

    // Trigger load more via CursorPaginationManager button
    await user.click(screen.getByTestId('load-more-button'));

    await waitFor(() => {
      const tags = screen.getAllByTestId('manageTagBtn');
      expect(tags.length).toBeGreaterThan(10);
    });
  });

  it('adds a new sub tag to the current tag', async () => {
    renderSubTags(link);
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

  it('displays error toast when addSubTag mutation fails', async () => {
    const errorLink = new StaticMockLink(MOCKS_CREATE_TAG_ERROR, true);
    renderSubTags(errorLink);
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

  it('renders empty state when there are no sub tags', async () => {
    const emptyLink = new StaticMockLink(emptyMocks, true);
    renderSubTags(emptyLink);
    await waitFor(() => {
      expect(screen.getByText(translations.noTagsFound)).toBeInTheDocument();
    });
  });

  it('renders breadcrumbs with ancestor tags and caret separators', async () => {
    const ancestorLink = new StaticMockLink(MOCKS_WITH_ANCESTORS, true);
    renderSubTags(ancestorLink);

    // Wait for ancestor breadcrumb to appear
    await waitFor(() => {
      expect(screen.getByText('Grandparent Tag')).toBeInTheDocument();
    });

    const breadcrumbs = screen.getAllByTestId('redirectToSubTags');
    // 2 breadcrumbs: ancestor "Grandparent Tag" + current "userTag 1"
    expect(breadcrumbs.length).toBe(2);

    // First breadcrumb (ancestor) should have a caret separator
    const firstBreadcrumb = breadcrumbs[0];
    expect(firstBreadcrumb.querySelector('.fa-caret-right')).toBeTruthy();

    // Last breadcrumb (current tag) should NOT have a caret separator
    const lastBreadcrumb = breadcrumbs[1];
    expect(lastBreadcrumb.querySelector('.fa-caret-right')).toBeNull();
  });

  it('does not show success toast when create mutation returns null data', async () => {
    const nullDataLink = new StaticMockLink(MOCKS_CREATE_NULL_DATA, true);
    renderSubTags(nullDataLink);
    await waitFor(() => {
      expect(screen.getByTestId('addSubTagBtn')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('addSubTagBtn'));
    await userEvent.type(
      screen.getByPlaceholderText(translations.tagNamePlaceholder),
      'subTag 12',
    );
    await userEvent.click(screen.getByTestId('modal-submit-btn'));
    // Wait for mutation to resolve, then verify success toast was NOT called
    await waitFor(() => {
      expect(NotificationToast.success).not.toHaveBeenCalled();
    });
  });

  it('handles null ancestorTags gracefully', async () => {
    const nullAncestorLink = new StaticMockLink(MOCKS_NULL_ANCESTOR_TAGS, true);
    renderSubTags(nullAncestorLink);
    // Should render without crashing, falling back to empty array for ancestorTags
    await waitFor(() => {
      expect(screen.getByTestId('manageCurrentTagBtn')).toHaveTextContent(
        `${translations.manageTag} userTag 1`,
      );
    });
    // Only 1 breadcrumb (the current tag itself), since ancestorTags fell back to []
    const breadcrumbs = screen.getAllByTestId('redirectToSubTags');
    expect(breadcrumbs.length).toBe(1);
  });

  it('does not navigate when pressing Tab on tag name', async () => {
    const user = userEvent.setup();
    renderSubTags(link);
    await waitFor(() => {
      expect(screen.getAllByTestId('tagName')[0]).toBeInTheDocument();
    });
    const tagName = screen.getAllByTestId('tagName')[0];
    tagName.focus();
    await user.keyboard('{Tab}');
    // Should remain on the same page — no navigation
    await waitFor(() => {
      expect(screen.getByTestId('addSubTagBtn')).toBeInTheDocument();
    });
  });
});
