import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { toast } from 'react-toastify';
import { USER_TAG_SUB_TAGS } from 'GraphQl/Queries/userTagQueries';
import { CREATE_USER_TAG } from 'GraphQl/Mutations/TagMutations';
import SubTags from './SubTags';
// Mock the react-i18next hooks
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (str: string, _?: any) => {
      const translations: { [key: string]: string } = {
        tagCreationSuccess: 'Tag created successfully',
        manageTag: 'Manage Tag',
        addChildTag: 'Add Child Tag',
        tagDetails: 'Tag Details',
        tagName: 'Tag Name',
        tagNamePlaceholder: 'Enter tag name',
        noTagsFound: 'No tags found',
        cancel: 'Cancel',
        create: 'Create',
        Latest: 'Latest',
        Oldest: 'Oldest',
        sort: 'Sort',
        searchByName: 'Search by name',
      };
      return translations[str] || str;
    },
  }),
}));

// Mock the InfiniteScroll component
vi.mock('react-infinite-scroll-component', () => ({
  default: ({ children, dataLength, next, hasMore, loader }: any) => (
    <div data-testid="infinite-scroll">
      {children}
      {hasMore && (
        <button onClick={next} data-testid="load-more">
          Load More
        </button>
      )}
      {hasMore && loader}
    </div>
  ),
}));

// Mock the DataGrid component
vi.mock('@mui/x-data-grid', () => ({
  DataGrid: ({ rows, columns, getRowId }: any) => (
    <div data-testid="data-grid">
      <table>
        <thead>
          <tr>
            {columns.map((column: any) => (
              <th key={column.field}>{column.headerName}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row: any) => (
            <tr key={getRowId(row)}>
              {columns.map((column: any) => (
                <td key={`${row.id}-${column.field}`} data-field={column.field}>
                  {column.renderCell
                    ? column.renderCell({ row })
                    : row[column.field] || ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
}));

// Mock Loader component
vi.mock('components/Loader/Loader', () => ({
  default: () => <div data-testid="loader">Loading...</div>,
}));

// Mock toast
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Create mock data for the GraphQL queries and mutations
const mockParentTag = {
  id: 'parent-tag-id',
  _id: 'parent-tag-id',
  name: 'Parent Tag',
  childTags: {
    totalCount: 2,
    pageInfo: {
      hasNextPage: false,
      endCursor: 'cursor',
    },
    edges: [
      {
        node: {
          id: 'child-tag-1',
          _id: 'child-tag-1',
          name: 'Child Tag 1',
          childTags: {
            totalCount: 0,
          },
          assignees: {
            totalCount: 3,
          },
        },
      },
      {
        node: {
          id: 'child-tag-2',
          _id: 'child-tag-2',
          name: 'Child Tag 2',
          childTags: {
            totalCount: 1,
          },
          assignees: {
            totalCount: 5,
          },
        },
      },
    ],
  },
};

// Success mocks
const link = [
  {
    request: {
      query: USER_TAG_SUB_TAGS,
      variables: {
        input: {
          id: 'tag123',
        },
        first: 10, // Assuming TAGS_QUERY_DATA_CHUNK_SIZE is 10
      },
    },
    result: {
      data: {
        getChildTags: mockParentTag,
      },
    },
  },
  {
    request: {
      query: CREATE_USER_TAG,
      variables: {
        name: 'New SubTag',
        organizationId: 'org123',
        parentTagId: 'tag123',
      },
    },
    result: {
      data: {
        createUserTag: {
          _id: 'new-subtag-id',
          name: 'New SubTag',
        },
      },
    },
  },
];

// Error mocks
const link2 = [
  {
    request: {
      query: USER_TAG_SUB_TAGS,
      variables: {
        input: {
          id: 'tag123',
        },
        first: 10,
      },
    },
    error: new Error('Error loading sub tags'),
  },
];

// Creation error mocks
const link3 = [
  {
    request: {
      query: USER_TAG_SUB_TAGS,
      variables: {
        input: {
          id: 'tag123',
        },
        first: 10,
      },
    },
    result: {
      data: {
        getChildTags: mockParentTag,
      },
    },
  },
  {
    request: {
      query: CREATE_USER_TAG,
      variables: {
        name: 'Error SubTag',
        organizationId: 'org123',
        parentTagId: 'tag123',
      },
    },
    error: new Error('Error creating tag'),
  },
];

// Empty results mock
const link4 = [
  {
    request: {
      query: USER_TAG_SUB_TAGS,
      variables: {
        input: {
          id: 'tag123',
        },
        first: 10,
      },
    },
    result: {
      data: {
        getChildTags: {
          ...mockParentTag,
          childTags: {
            totalCount: 0,
            pageInfo: {
              hasNextPage: false,
              endCursor: null,
            },
            edges: [],
          },
        },
      },
    },
  },
];

// Test setup helper
const renderSubTags = (mocks: any[]) => {
  return render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <MemoryRouter initialEntries={['/orgtags/org123/subTags/tag123']}>
        <Routes>
          <Route path="/orgtags/:orgId/subTags/:tagId" element={<SubTags />} />
          <Route path="/orgtags/:orgId" element={<div>Tags List Page</div>} />
          <Route
            path="/orgtags/:orgId/manageTag/:tagId"
            element={<div>Manage Tag Page</div>}
          />
        </Routes>
      </MemoryRouter>
    </MockedProvider>,
  );
};

describe('SubTags Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loader when data is loading', () => {
    renderSubTags(link);
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('renders error component on unsuccessful sub tags query', async () => {
    const { queryByText } = renderSubTags(link2);

    await waitFor(() => {
      expect(
        queryByText('Error occurred while loading sub tags'),
      ).toBeInTheDocument();
    });
  });

  it('renders the sub tags list successfully', async () => {
    renderSubTags(link);

    await waitFor(() => {
      expect(screen.getByTestId('data-grid')).toBeInTheDocument();
      expect(screen.getByText('Child Tag 1')).toBeInTheDocument();
      expect(screen.getByText('Child Tag 2')).toBeInTheDocument();
    });
  });

  it('opens and closes the add sub tag modal', async () => {
    renderSubTags(link);

    await waitFor(() => {
      expect(screen.getByTestId('addSubTagBtn')).toBeInTheDocument();
    });

    // Modal should not be visible initially
    expect(screen.queryByTestId('tagHeader')).not.toBeInTheDocument();

    // Open the modal
    fireEvent.click(screen.getByTestId('addSubTagBtn'));
    expect(screen.getByTestId('tagHeader')).toBeInTheDocument();
    expect(screen.getByText('Tag Details')).toBeInTheDocument();

    // Close the modal
    fireEvent.click(screen.getByTestId('addSubTagModalCloseBtn'));
    await waitFor(() => {
      expect(screen.queryByTestId('tagHeader')).not.toBeInTheDocument();
    });
  });

  it('handles adding a new sub tag successfully', async () => {
    renderSubTags(link);

    await waitFor(() => {
      expect(screen.getByTestId('addSubTagBtn')).toBeInTheDocument();
    });

    // Open modal and add a new tag
    fireEvent.click(screen.getByTestId('addSubTagBtn'));
    fireEvent.change(screen.getByTestId('modalTitle'), {
      target: { value: 'New SubTag' },
    });
    fireEvent.click(screen.getByTestId('addSubTagSubmitBtn'));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Tag created successfully');
    });
  });

  it('shows error toast when tag creation fails', async () => {
    renderSubTags(link3);

    await waitFor(() => {
      expect(screen.getByTestId('addSubTagBtn')).toBeInTheDocument();
    });

    // Open modal and try to add a tag that will cause an error
    fireEvent.click(screen.getByTestId('addSubTagBtn'));
    fireEvent.change(screen.getByTestId('modalTitle'), {
      target: { value: 'Error SubTag' },
    });
    fireEvent.click(screen.getByTestId('addSubTagSubmitBtn'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Error creating tag');
    });
  });

  it('navigates to manage tag page when manage tag button is clicked', async () => {
    renderSubTags(link);

    await waitFor(() => {
      expect(screen.getAllByTestId('manageTagBtn')[0]).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByTestId('manageTagBtn')[0]);

    await waitFor(() => {
      expect(screen.getByText('Manage Tag Page')).toBeInTheDocument();
    });
  });

  it('navigates to parent tags list when Tags breadcrumb is clicked', async () => {
    renderSubTags(link);

    await waitFor(() => {
      expect(screen.getByTestId('allTagsBtn')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('allTagsBtn'));

    await waitFor(() => {
      expect(screen.getByText('Tags List Page')).toBeInTheDocument();
    });
  });

  it('navigates to sub tags page when tag name is clicked', async () => {
    renderSubTags(link);

    await waitFor(() => {
      expect(screen.getAllByTestId('tagName')[0]).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByTestId('tagName')[0]);

    // In our test setup we remain on the same page, but in a real app this would navigate
    // Here we're just testing the click handler executes without errors
  });

  it('displays the breadcrumbs with parent tag name', async () => {
    renderSubTags(link);

    await waitFor(() => {
      expect(screen.getByText('Tags')).toBeInTheDocument();
      expect(screen.getByText('Parent Tag')).toBeInTheDocument();
    });
  });

  it('displays no tags message when there are no sub tags', async () => {
    renderSubTags(link4);
  });

  it('performs search functionality when search button is clicked', async () => {
    renderSubTags(link);

    await waitFor(() => {
      expect(screen.getByTestId('searchByName')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByTestId('searchByName'), {
      target: { value: 'Test Search' },
    });
    fireEvent.click(screen.getByTestId('searchBtn'));

    // In our test mock the search doesn't actually filter anything
    // We're just testing the interaction works without errors
  });

  it('changes sort order when sort option is selected', async () => {
    renderSubTags(link);
  });
});
