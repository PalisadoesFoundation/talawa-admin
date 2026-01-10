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
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
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
import { vi, beforeEach, afterEach, expect, it } from 'vitest';

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

vi.mock('components/NotificationToast/NotificationToast', () => ({
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
            const merged = {
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

            return merged;
          },
        },
      },
    },
  },
});

const renderSubTags = (link: ApolloLink): RenderResult => {
  return render(
    <MockedProvider cache={cache} link={link}>
      <MemoryRouter initialEntries={['/orgtags/123/subTags/1']}>
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <Routes>
              <Route
                path="/orgtags/:orgId"
                element={<div data-testid="orgtagsScreen"></div>}
              />
              <Route
                path="/orgtags/:orgId/manageTag/:tagId"
                element={<div data-testid="manageTagScreen"></div>}
              />
              <Route
                path="/orgtags/:orgId/subTags/:tagId"
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
    }));
    cache.reset();
  });

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it('Component loads correctly', async () => {
    const { getByText } = renderSubTags(link);

    await wait();

    await waitFor(() => {
      expect(getByText(translations.addChildTag)).toBeInTheDocument();
    });
  });

  it('renders UI with addChildTag button even when subtags query fails', async () => {
    const { getByText } = renderSubTags(link2);

    await wait();

    await waitFor(() => {
      // The page still renders even with query error, addChildTag button should be visible
      expect(getByText(translations.addChildTag)).toBeInTheDocument();
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
        screen.findByTestId('addSubTagModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('addSubTagModalCloseBtn'));

    await waitFor(() =>
      expect(
        screen.queryByTestId('addSubTagModalCloseBtn'),
      ).not.toBeInTheDocument(),
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
    renderSubTags(link);

    await wait();

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText(translations.searchByName),
      ).toBeInTheDocument();
    });
    const input = screen.getByPlaceholderText(translations.searchByName);
    fireEvent.change(input, { target: { value: 'searchSubTag' } });
    fireEvent.click(screen.getByTestId('searchBtn'));

    // should render the two searched tags from the mock data
    // where name starts with "searchUserTag"
    await waitFor(() => {
      const buttons = screen.getAllByTestId('manageTagBtn');
      expect(buttons.length).toEqual(2);
    });
  });

  it('changes the sort order when dropdown selection changes', async () => {
    renderSubTags(link);

    await wait();

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText(translations.searchByName),
      ).toBeInTheDocument();
    });

    // Verify the sort dropdown button exists
    const sortButton = screen.getByTestId('sortTags');
    expect(sortButton).toBeInTheDocument();

    // Click the dropdown button to open menu
    fireEvent.click(sortButton);

    // Find and click the ASCENDING option
    const ascendingOption = screen.getByTestId('ASCENDING');
    expect(ascendingOption).toBeInTheDocument();
    fireEvent.click(ascendingOption);

    // Click dropdown again and select DESCENDING
    fireEvent.click(sortButton);
    const descendingOption = screen.getByTestId('DESCENDING');
    expect(descendingOption).toBeInTheDocument();
    fireEvent.click(descendingOption);
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

    await userEvent.click(screen.getByTestId('addSubTagSubmitBtn'));

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith(
        translations.tagCreationSuccess,
      );
    });
  });

  it('navigates to organization tags screen when pressing Enter on allTagsBtn', async () => {
    renderSubTags(link);

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('allTagsBtn')).toBeInTheDocument();
    });

    const allTagsBtn = screen.getByTestId('allTagsBtn');
    fireEvent.keyDown(allTagsBtn, { key: 'Enter' });

    await waitFor(() => {
      expect(screen.getByTestId('orgtagsScreen')).toBeInTheDocument();
    });
  });

  it('navigates to organization tags screen when pressing Space on allTagsBtn', async () => {
    renderSubTags(link);

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('allTagsBtn')).toBeInTheDocument();
    });

    const allTagsBtn = screen.getByTestId('allTagsBtn');
    fireEvent.keyDown(allTagsBtn, { key: ' ' });

    await waitFor(() => {
      expect(screen.getByTestId('orgtagsScreen')).toBeInTheDocument();
    });
  });

  it('navigates to sub tags screen when pressing Enter on breadcrumb ancestor', async () => {
    renderSubTags(link);

    await wait();

    await waitFor(() => {
      expect(screen.getAllByTestId('redirectToSubTags')[0]).toBeInTheDocument();
    });

    const breadcrumbBtn = screen.getAllByTestId('redirectToSubTags')[0];
    fireEvent.keyDown(breadcrumbBtn, { key: 'Enter' });

    await waitFor(() => {
      expect(screen.getByTestId('addSubTagBtn')).toBeInTheDocument();
    });
  });

  it('navigates to sub tags screen when pressing Space on breadcrumb ancestor', async () => {
    renderSubTags(link);

    await wait();

    await waitFor(() => {
      expect(screen.getAllByTestId('redirectToSubTags')[0]).toBeInTheDocument();
    });

    const breadcrumbBtn = screen.getAllByTestId('redirectToSubTags')[0];
    fireEvent.keyDown(breadcrumbBtn, { key: ' ' });

    await waitFor(() => {
      expect(screen.getByTestId('addSubTagBtn')).toBeInTheDocument();
    });
  });

  it('does nothing when pressing Tab on allTagsBtn', async () => {
    renderSubTags(link);
    await wait();

    const allTagsBtn = screen.getByTestId('allTagsBtn');
    fireEvent.keyDown(allTagsBtn, { key: 'Tab' });

    await waitFor(() => {
      expect(screen.getByTestId('addSubTagBtn')).toBeInTheDocument();
    });
  });

  it('does nothing when pressing Tab on breadcrumb ancestor', async () => {
    renderSubTags(link);
    await wait();

    const breadcrumbBtn = screen.getAllByTestId('redirectToSubTags')[0];
    fireEvent.keyDown(breadcrumbBtn, { key: 'Tab' });

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

    await userEvent.click(screen.getByTestId('addSubTagSubmitBtn'));

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

  it('skips query and renders without errors when parentTagId is undefined', async () => {
    render(
      <MockedProvider cache={cache} link={link}>
        <MemoryRouter initialEntries={['/orgtags/123/subTags/']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <Routes>
                <Route
                  path="/orgtags/:orgId"
                  element={<div data-testid="orgtagsScreen"></div>}
                />
                <Route path="/orgtags/:orgId/subTags/" element={<SubTags />} />
              </Routes>
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );

    await wait();

    // Loading state should be handled properly when query is skipped
    await waitFor(() => {
      // The component should still render UI elements but with no data
      expect(screen.getByTestId('addSubTagBtn')).toBeInTheDocument();
    });
  });
});
