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
  MOCKS_CREATE_TAG_ERROR,
  MOCKS_ERROR_SUB_TAGS,
} from './SubTagsMocks';
import type { ApolloLink } from '@apollo/client';
import { vi, beforeEach, afterEach, expect, it, describe } from 'vitest';

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
  beforeEach(() => {
    vi.mock('react-router', async () => ({
      ...(await vi.importActual('react-router')),
      useParams: () => ({ orgId: '123', tagId: '1' }),
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
    vi.restoreAllMocks();
  });

  it('Component loads correctly', async () => {
    renderSubTags(link);
    await waitFor(() => {
      expect(screen.getByText(translations.addChildTag)).toBeInTheDocument();
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

  it('does nothing when pressing Tab on allTagsBtn', async () => {
    const user = userEvent.setup();
    renderSubTags(link);
    await waitFor(() => {
      expect(screen.getByTestId('allTagsBtn')).toBeInTheDocument();
    });
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
    await waitFor(() => {
      expect(screen.getAllByTestId('redirectToSubTags')[0]).toBeInTheDocument();
    });
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
});
