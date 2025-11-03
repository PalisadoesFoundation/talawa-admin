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
import { vi } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router';
import { toast } from 'react-toastify';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18n from 'utils/i18nForTest';
import OrganizationTags from './OrganizationTags';
import {
  MOCKS,
  MOCKS_ERROR,
  MOCKS_ERROR_ERROR_TAG,
  MOCKS_EMPTY,
  MOCKS_UNDEFINED_USER_TAGS,
  MOCKS_NULL_END_CURSOR,
  MOCKS_NO_MORE_PAGES,
  MOCKS_WITH_NULL_FETCH_MORE_RESULT,
  MOCKS_WITH_UNDEFINED_ORGANIZATION,
  MOCKS_WITH_EMPTY_TAGS_EDGES,
} from './OrganizationTagsMocks';
import type { ApolloLink } from '@apollo/client';

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
const link2 = new StaticMockLink(MOCKS_ERROR, true);
const link3 = new StaticMockLink([...MOCKS, ...MOCKS_ERROR_ERROR_TAG], true);
const link4 = new StaticMockLink(MOCKS_EMPTY, true);
const link5 = new StaticMockLink(MOCKS_UNDEFINED_USER_TAGS, true);
const link6 = new StaticMockLink(MOCKS_NULL_END_CURSOR, true);
const link7 = new StaticMockLink(MOCKS_NO_MORE_PAGES, true);
const link8 = new StaticMockLink(MOCKS_WITH_NULL_FETCH_MORE_RESULT, true);
const link9 = new StaticMockLink(MOCKS_WITH_UNDEFINED_ORGANIZATION, true);
const link10 = new StaticMockLink(MOCKS_WITH_EMPTY_TAGS_EDGES, true);

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

const renderOrganizationTags = (link: ApolloLink): RenderResult => {
  return render(
    <MockedProvider addTypename={false} link={link}>
      <MemoryRouter initialEntries={['/orgtags/123']}>
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <Routes>
              <Route path="/orgtags/:orgId" element={<OrganizationTags />} />
              <Route
                path="/orgtags/:orgId/manageTag/:tagId"
                element={<div data-testid="manageTagScreen"></div>}
              />
              <Route
                path="/orgtags/:orgId/subTags/:tagId"
                element={<div data-testid="subTagsScreen"></div>}
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
      const actual = await vi.importActual('react-router');
      return {
        ...actual,
        useParams: () => ({ orgId: 'orgId' }),
      };
    });
  });
  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });
  test('component loads correctly', async () => {
    const { getByText } = renderOrganizationTags(link);

    await wait();

    await waitFor(() => {
      expect(getByText(translations.createTag)).toBeInTheDocument();
    });
  });
  test('render error component on unsuccessful userTags query', async () => {
    const { queryByText } = renderOrganizationTags(link2);

    await wait();

    await waitFor(() => {
      expect(
        screen.getByText(/Error occurred while loading Organization Tags Data/),
      ).toBeInTheDocument();
      expect(queryByText(translations.createTag)).toBeInTheDocument();
    });
  });
  test('opens and closes the create tag modal', async () => {
    renderOrganizationTags(link);

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('createTagBtn')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('createTagBtn'));

    await waitFor(() => {
      return expect(
        screen.findByTestId('closeCreateTagModal'),
      ).resolves.toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('closeCreateTagModal'));

    await waitFor(() =>
      expect(
        screen.queryByTestId('closeCreateTagModal'),
      ).not.toBeInTheDocument(),
    );
  });
  test('navigates to sub tags screen after clicking on a tag', async () => {
    renderOrganizationTags(link);

    await wait();

    await waitFor(() => {
      expect(screen.getAllByTestId('tagName')[0]).toBeInTheDocument();
    });
    await userEvent.click(screen.getAllByTestId('tagName')[0]);

    await waitFor(() => {
      expect(screen.getByTestId('subTagsScreen')).toBeInTheDocument();
    });
  });
  test('navigates to manage tag page after clicking manage tag option', async () => {
    renderOrganizationTags(link);

    await wait();

    await waitFor(() => {
      expect(screen.getAllByTestId('manageTagBtn')[0]).toBeInTheDocument();
    });
    await userEvent.click(screen.getAllByTestId('manageTagBtn')[0]);

    await waitFor(() => {
      expect(screen.getByTestId('manageTagScreen')).toBeInTheDocument();
    });
  });
  test('searchs for tags where the name matches the provided search input', async () => {
    renderOrganizationTags(link);

    await wait();

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText(translations.searchByName),
      ).toBeInTheDocument();
    });
    const input = screen.getByPlaceholderText(translations.searchByName);
    fireEvent.change(input, { target: { value: 'searchUserTag' } });
    fireEvent.click(screen.getByTestId('searchBtn'));

    // should render the two searched tags from the mock data
    // where name starts with "searchUserTag"
    await waitFor(() => {
      const buttons = screen.getAllByTestId('manageTagBtn');
      expect(buttons.length).toEqual(2);
    });
  });
  test('fetches the tags by the sort order, i.e. latest or oldest first', async () => {
    renderOrganizationTags(link);

    await wait();

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText(translations.searchByName),
      ).toBeInTheDocument();
    });
    const input = screen.getByPlaceholderText(translations.searchByName);
    fireEvent.change(input, { target: { value: 'searchUserTag' } });
    fireEvent.click(screen.getByTestId('searchBtn'));

    // should render the two searched tags from the mock data
    // where name starts with "searchUserTag"
    await waitFor(() => {
      expect(screen.getAllByTestId('tagName')[0]).toHaveTextContent(
        'searchUserTag 1',
      );
    });

    // now change the sorting order
    await waitFor(() => {
      expect(screen.getByTestId('sortTags')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('sortTags'));

    await waitFor(() => {
      expect(screen.getByTestId('oldest')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('oldest'));

    // returns the tags in reverse order
    await waitFor(() => {
      expect(screen.getAllByTestId('tagName')[0]).toHaveTextContent(
        'searchUserTag 2',
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('sortTags')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('sortTags'));

    await waitFor(() => {
      expect(screen.getByTestId('latest')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('latest'));

    // reverse the order again
    await waitFor(() => {
      expect(screen.getAllByTestId('tagName')[0]).toHaveTextContent(
        'searchUserTag 1',
      );
    });
  });
  test('fetches more tags with infinite scroll', async () => {
    const { getByText } = renderOrganizationTags(link);

    await wait();

    await waitFor(() => {
      expect(getByText(translations.createTag)).toBeInTheDocument();
    });

    const orgUserTagsScrollableDiv = screen.getByTestId(
      'orgUserTagsScrollableDiv',
    );

    // Get the initial number of tags loaded
    const initialTagsDataLength = screen.getAllByTestId('manageTagBtn').length;
    expect(initialTagsDataLength).toBe(10); // Assert that initial count is 10

    // Set scroll position to the bottom
    fireEvent.scroll(orgUserTagsScrollableDiv, {
      target: { scrollY: orgUserTagsScrollableDiv.scrollHeight },
    });

    expect(getByText(translations.createTag)).toBeInTheDocument();
  });
  test('creates a new user tag', async () => {
    const { getByText } = renderOrganizationTags(link);
    await wait();

    await waitFor(() => {
      expect(getByText(translations.createTag)).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('createTagBtn'));

    await userEvent.click(screen.getByTestId('createTagSubmitBtn'));

    expect(getByText(translations.createTag)).toBeInTheDocument();

    await userEvent.type(
      screen.getByPlaceholderText(translations.tagNamePlaceholder),
      'userTag 12',
    );

    await userEvent.click(screen.getByTestId('createTagSubmitBtn'));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        translations.tagCreationSuccess,
      );
    });
  });
  test('shows error when creating tag with empty name', async () => {
    renderOrganizationTags(link);

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('createTagBtn')).toBeInTheDocument();
    });

    // Open create tag modal
    await userEvent.click(screen.getByTestId('createTagBtn'));

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText(translations.tagNamePlaceholder),
      ).toBeInTheDocument();
    });

    const tagNameInput = screen.getByPlaceholderText(
      translations.tagNamePlaceholder,
    );

    // Try with only whitespace - this should trigger validation
    await userEvent.clear(tagNameInput);
    await userEvent.type(tagNameInput, '   ');

    await userEvent.click(screen.getByTestId('createTagSubmitBtn'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(translations.enterTagName);
    });
  });

  test('creates a new user tag with error', async () => {
    renderOrganizationTags(link3);

    await wait();

    await userEvent.click(screen.getByTestId('createTagBtn'));

    await userEvent.type(
      screen.getByPlaceholderText(translations.tagNamePlaceholder),
      'userTagE',
    );

    await userEvent.click(screen.getByTestId('createTagSubmitBtn'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Mock Graphql Error');
    });
  });
  test('renders the no tags found message when there are no tags', async () => {
    renderOrganizationTags(link4);

    await wait();

    await waitFor(() => {
      expect(screen.getByText(translations.noTagsFound)).toBeInTheDocument();
    });
  });
  test('sets dataLength to 0 when userTagsList is undefined', async () => {
    renderOrganizationTags(link5);

    await wait();

    // Wait for the component to render
    await waitFor(() => {
      const userTags = screen.queryAllByTestId('user-tag');
      expect(userTags).toHaveLength(0);
    });
  });
  test('Null endCursor', async () => {
    renderOrganizationTags(link6);

    await wait();

    const orgUserTagsScrollableDiv = screen.getByTestId(
      'orgUserTagsScrollableDiv',
    );

    // Set scroll position to the bottom
    fireEvent.scroll(orgUserTagsScrollableDiv, {
      target: { scrollY: orgUserTagsScrollableDiv.scrollHeight },
    });

    await waitFor(() => {
      expect(screen.getByTestId('createTagBtn')).toBeInTheDocument();
    });
  });
  test('Null Page available', async () => {
    renderOrganizationTags(link7);

    await wait();

    await waitFor(() => {
      expect(
        screen.getByText(/Error occurred while loading Organization Tags Data/),
      ).toBeInTheDocument();
      expect(screen.getByTestId('createTagBtn')).toBeInTheDocument();
    });
  });
  test('creates a new user tag with undefined data', async () => {
    renderOrganizationTags(link);

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('createTagBtn')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('createTagBtn'));

    await userEvent.type(
      screen.getByPlaceholderText(translations.tagNamePlaceholder),
      'userTag 13',
    );

    await userEvent.click(screen.getByTestId('createTagSubmitBtn'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Tag creation failed');
    });
  });

  test('should handle null fetchMoreResult in updateQuery', async () => {
    renderOrganizationTags(link8);

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('createTagBtn')).toBeInTheDocument();
    });

    // Verify initial tags are loaded by checking for tag names
    await waitFor(() => {
      expect(screen.getByText('userTag 1')).toBeInTheDocument();
    });

    // Find scrollable div and trigger scroll event to call fetchMore
    const orgUserTagsScrollableDiv = screen.getByTestId(
      'orgUserTagsScrollableDiv',
    );
    expect(orgUserTagsScrollableDiv).toBeInTheDocument();

    // Scroll to bottom to trigger fetchMore (which will return null/undefined)
    fireEvent.scroll(orgUserTagsScrollableDiv, {
      target: { scrollY: orgUserTagsScrollableDiv.scrollHeight },
    });

    await wait();

    // Component should still render after null fetchMoreResult
    await waitFor(() => {
      expect(screen.getByText('userTag 1')).toBeInTheDocument();
      expect(screen.getByTestId('createTagBtn')).toBeInTheDocument();
    });

    // Verify tags remain stable (no new tags added)
    await waitFor(() => {
      expect(screen.getByText('userTag 1')).toBeInTheDocument();
      expect(screen.getByText('userTag 10')).toBeInTheDocument();
    });

    // No error toast should be triggered
    expect(toast.error).not.toHaveBeenCalled();
  });

  test('should handle undefined organization in fetchMoreResult', async () => {
    renderOrganizationTags(link9);

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('createTagBtn')).toBeInTheDocument();
    });

    // Verify initial tags are loaded
    await waitFor(() => {
      expect(screen.getByText('userTag 1')).toBeInTheDocument();
    });

    // Find scrollable div and trigger scroll event to call fetchMore
    const orgUserTagsScrollableDiv = screen.getByTestId(
      'orgUserTagsScrollableDiv',
    );
    expect(orgUserTagsScrollableDiv).toBeInTheDocument();

    // Scroll to bottom to trigger fetchMore (which will return undefined organization)
    fireEvent.scroll(orgUserTagsScrollableDiv, {
      target: { scrollY: orgUserTagsScrollableDiv.scrollHeight },
    });

    await wait();

    // Component should still render after undefined organization in fetchMoreResult
    await waitFor(() => {
      expect(screen.getByText('userTag 1')).toBeInTheDocument();
      expect(screen.getByTestId('createTagBtn')).toBeInTheDocument();
    });

    // Verify tags remain stable (no changes after undefined organization)
    await waitFor(() => {
      expect(screen.getByText('userTag 1')).toBeInTheDocument();
      expect(screen.getByText('userTag 10')).toBeInTheDocument();
    });

    // No error toast should be triggered
    expect(toast.error).not.toHaveBeenCalled();
  });

  test('should handle null tags edges gracefully', async () => {
    renderOrganizationTags(link10);

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('createTagBtn')).toBeInTheDocument();
    });

    // Component should render even with null edges (empty list)
    await waitFor(() => {
      expect(screen.getByText(translations.createTag)).toBeInTheDocument();
    });

    // No error toast should be triggered
    expect(toast.error).not.toHaveBeenCalled();
  });
});
