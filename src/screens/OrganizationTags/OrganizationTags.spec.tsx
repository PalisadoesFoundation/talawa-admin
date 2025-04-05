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
import { MemoryRouter, Route, Routes } from 'react-router-dom';
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
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
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
    const { getByText, getByTestId, getByRole } = renderOrganizationTags(link);

    await wait();

    await waitFor(() => {
      // Check if main elements are rendered
      expect(getByText(translations.createTag)).toBeInTheDocument();
      expect(getByTestId('searchByName')).toBeInTheDocument();
      expect(getByTestId('sortTags')).toBeInTheDocument();
      expect(getByTestId('createTagBtn')).toBeInTheDocument();

      // Check if the DataGrid is rendered
      expect(getByRole('grid')).toBeInTheDocument();

      // Check if the icon and title are present
      expect(getByText('Tags')).toBeInTheDocument();
    });
  });

  test('render error component on unsuccessful userTags query', async () => {
    const { queryByText } = renderOrganizationTags(link2);

    await wait();

    await waitFor(() => {
      expect(queryByText(translations.createTag)).not.toBeInTheDocument();
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
      expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    const tagNameCell = screen.getByText('userTag 1');
    await userEvent.click(tagNameCell);

    await waitFor(() => {
      expect(screen.getByTestId('subTagsScreen')).toBeInTheDocument();
    });
  });

  test('navigates to manage tag page after clicking manage tag option', async () => {
    renderOrganizationTags(link);

    await wait();

    await waitFor(() => {
      expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    const editButton = screen.getByTestId('manageTagBtn');
    await userEvent.click(editButton);

    await waitFor(() => {
      expect(screen.getByTestId('manageTagScreen')).toBeInTheDocument();
    });
  });

  test('searches for tags where the name matches the provided search input', async () => {
    renderOrganizationTags(link);

    await wait();

    const searchInput = screen.getByTestId('searchByName');
    await userEvent.type(searchInput, 'searchUserTag');

    const searchButton = screen.getByTestId('searchBtn');
    await userEvent.click(searchButton);

    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      // Header row + 2 matching data rows
      expect(rows.length).toBe(3);
    });
  });

  test('fetches the tags by the sort order', async () => {
    renderOrganizationTags(link);

    await wait();

    const sortButton = screen.getByTestId('sortTags');
    await userEvent.click(sortButton);

    const oldestOption = screen.getByTestId('oldest');
    await userEvent.click(oldestOption);

    await waitFor(() => {
      const firstRow = screen.getAllByRole('row')[1];
      expect(firstRow).toHaveTextContent('searchUserTag 2');
    });

    await userEvent.click(sortButton);
    const latestOption = screen.getByTestId('latest');
    await userEvent.click(latestOption);

    await waitFor(() => {
      const firstRow = screen.getAllByRole('row')[1];
      expect(firstRow).toHaveTextContent('searchUserTag 1');
    });
  });

  test('fetches more tags with infinite scroll', async () => {
    renderOrganizationTags(link);

    await wait();

    const scrollableDiv = screen.getByTestId('orgUserTagsScrollableDiv');

    const initialRows = screen.getAllByRole('row').length;

    fireEvent.scroll(scrollableDiv, {
      target: { scrollY: scrollableDiv.scrollHeight },
    });

    await waitFor(() => {
      const newRows = screen.getAllByRole('row').length;
      expect(newRows).toBeGreaterThan(initialRows);
    });
  });

  test('creates a new user tag', async () => {
    renderOrganizationTags(link);

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('createTagBtn')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('createTagBtn'));

    await userEvent.click(screen.getByTestId('createTagSubmitBtn'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(translations.enterTagName);
    });

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

  test('handles null endCursor in pagination', async () => {
    renderOrganizationTags(link6);

    await wait();

    const scrollableDiv = screen.getByTestId('orgUserTagsScrollableDiv');
    const initialRows = screen.getAllByRole('row').length;

    // Trigger infinite scroll
    fireEvent.scroll(scrollableDiv, {
      target: { scrollY: scrollableDiv.scrollHeight },
    });

    await waitFor(() => {
      // Verify that no additional rows were loaded
      const newRows = screen.getAllByRole('row').length;
      expect(newRows).toBe(initialRows);
      // Verify DataGrid is still present
      expect(screen.getByRole('grid')).toBeInTheDocument();
    });
  });

  test('handles error when fetching tags', async () => {
    renderOrganizationTags(link3);

    await wait();

    const scrollableDiv = screen.getByTestId('orgUserTagsScrollableDiv');

    // Trigger infinite scroll
    fireEvent.scroll(scrollableDiv, {
      target: { scrollY: scrollableDiv.scrollHeight },
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Mock Graphql Error');
    });
  });
});
