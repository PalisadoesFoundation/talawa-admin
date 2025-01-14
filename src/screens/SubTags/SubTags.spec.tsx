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
import SubTags from './SubTags';
import { MOCKS, MOCKS_ERROR_SUB_TAGS } from './SubTagsMocks';
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

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
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
    <MockedProvider cache={cache} addTypename={false} link={link}>
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
    vi.mock('react-router-dom', async () => ({
      ...(await vi.importActual('react-router-dom')),
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
    userEvent.click(screen.getByTestId('addSubTagBtn'));

    await waitFor(() => {
      return expect(
        screen.findByTestId('addSubTagModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('addSubTagModalCloseBtn'));

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('addSubTagModalCloseBtn'),
    );
  });

  it('navigates to manage tag screen after clicking manage tag option', async () => {
    renderSubTags(link);

    await wait();

    await waitFor(() => {
      expect(screen.getAllByTestId('manageTagBtn')[0]).toBeInTheDocument();
    });
    userEvent.click(screen.getAllByTestId('manageTagBtn')[0]);

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
    userEvent.click(screen.getAllByTestId('tagName')[0]);

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
    userEvent.click(screen.getAllByTestId('redirectToSubTags')[0]);

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
    userEvent.click(screen.getByTestId('allTagsBtn'));

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
    userEvent.click(screen.getByTestId('manageCurrentTagBtn'));

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

    // should render the two searched tags from the mock data
    // where name starts with "searchUserTag"
    await waitFor(() => {
      const buttons = screen.getAllByTestId('manageTagBtn');
      expect(buttons.length).toEqual(2);
    });
  });

  it('fetches the tags by the sort order, i.e. latest or oldest first', async () => {
    renderSubTags(link);

    await wait();

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText(translations.searchByName),
      ).toBeInTheDocument();
    });
    const input = screen.getByPlaceholderText(translations.searchByName);
    fireEvent.change(input, { target: { value: 'searchSubTag' } });

    // should render the two searched tags from the mock data
    // where name starts with "searchUserTag"
    await waitFor(() => {
      expect(screen.getAllByTestId('tagName')[0]).toHaveTextContent(
        'searchSubTag 1',
      );
    });

    // now change the sorting order
    await waitFor(() => {
      expect(screen.getByTestId('sortTags')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('sortTags'));

    await waitFor(() => {
      expect(screen.getByTestId('ASCENDING')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('ASCENDING'));

    // returns the tags in reverse order
    await waitFor(() => {
      expect(screen.getAllByTestId('tagName')[0]).toHaveTextContent(
        'searchSubTag 2',
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('sortTags')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('sortTags'));

    await waitFor(() => {
      expect(screen.getByTestId('DESCENDING')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('DESCENDING'));

    // reverse the order again
    await waitFor(() => {
      expect(screen.getAllByTestId('tagName')[0]).toHaveTextContent(
        'searchSubTag 1',
      );
    });
  });

  it('Fetches more sub tags with infinite scroll', async () => {
    const { getByText } = renderSubTags(link);

    await wait();

    await waitFor(() => {
      expect(getByText(translations.addChildTag)).toBeInTheDocument();
    });

    const subTagsScrollableDiv = screen.getByTestId('subTagsScrollableDiv');

    // Get the initial number of tags loaded
    const initialSubTagsDataLength =
      screen.getAllByTestId('manageTagBtn').length;

    // Set scroll position to the bottom
    fireEvent.scroll(subTagsScrollableDiv, {
      target: { scrollY: subTagsScrollableDiv.scrollHeight },
    });

    await waitFor(() => {
      const finalSubTagsDataLength =
        screen.getAllByTestId('manageTagBtn').length;
      expect(finalSubTagsDataLength).toBeGreaterThan(initialSubTagsDataLength);

      expect(getByText(translations.addChildTag)).toBeInTheDocument();
    });
  });

  it('adds a new sub tag to the current tag', async () => {
    renderSubTags(link);

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('addSubTagBtn')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('addSubTagBtn'));

    userEvent.type(
      screen.getByPlaceholderText(translations.tagNamePlaceholder),
      'subTag 12',
    );

    userEvent.click(screen.getByTestId('addSubTagSubmitBtn'));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        translations.tagCreationSuccess,
      );
    });
  });
});
