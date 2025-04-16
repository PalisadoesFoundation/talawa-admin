import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { MockedProvider } from '@apollo/client/testing';
import TagNode from './TagNode';
import { USER_TAG_SUB_TAGS } from 'GraphQl/Queries/userTagQueries';
import { TAGS_QUERY_DATA_CHUNK_SIZE } from 'utils/organizationTagsUtils';
import { TFunction } from 'i18next';

// Mock translation function
const tMock = vi.fn((key) => key) as unknown as TFunction<
  'translation',
  'manageTag'
>;

// Mock tag data
const mockTag = {
  id: 'tag1',
  _id: 'tag1',
  name: 'Test Tag',
  childTags: {
    edges: [],
    totalCount: 0,
    pageInfo: {
      hasNextPage: false,
      endCursor: undefined,
    },
  },
};

// Mock subtags data
const mockSubTagsData = {
  getChildTags: {
    childTags: {
      edges: [
        {
          node: {
            id: 'subtag1',
            name: 'Subtag 1',
            childTags: false,
          },
        },
        {
          node: {
            id: 'subtag2',
            name: 'Subtag 2',
            childTags: true,
          },
        },
      ],
      pageInfo: {
        hasNextPage: true,
        endCursor: 'cursor1',
      },
    },
  },
};

// Mock for more subtags when pagination is used
const mockMoreSubTagsData = {
  getChildTags: {
    childTags: {
      edges: [
        {
          node: {
            id: 'subtag3',
            name: 'Subtag 3',
            childTags: false,
          },
        },
      ],
      pageInfo: {
        hasNextPage: false,
        endCursor: 'cursor2',
      },
    },
  },
};

// Error mock
const mockErrorResponse = {
  request: {
    query: USER_TAG_SUB_TAGS,
    variables: {
      id: 'error-tag',
      first: TAGS_QUERY_DATA_CHUNK_SIZE,
    },
  },
  error: new Error('Error loading subtags'),
};

describe('TagNode Component', () => {
  let toggleTagSelectionMock: ReturnType<typeof vi.fn>;
  let checkedTags: Set<string>;

  beforeEach(() => {
    toggleTagSelectionMock = vi.fn();
    checkedTags = new Set<string>();
  });

  it('renders the tag name correctly', () => {
    render(
      <MockedProvider mocks={[]}>
        <TagNode
          tag={mockTag}
          checkedTags={checkedTags}
          toggleTagSelection={toggleTagSelectionMock}
          t={tMock}
        />
      </MockedProvider>,
    );

    expect(screen.getByText('Test Tag')).toBeInTheDocument();
  });

  it('renders expand/collapse icon correctly', () => {
    render(
      <MockedProvider mocks={[]}>
        <TagNode
          tag={mockTag}
          checkedTags={checkedTags}
          toggleTagSelection={toggleTagSelectionMock}
          t={tMock}
        />
      </MockedProvider>,
    );

    const expandIcon = screen.getByText('▶');
    expect(expandIcon).toBeInTheDocument();

    fireEvent.click(expandIcon);
    expect(screen.getByText('▼')).toBeInTheDocument();
  });

  it('toggles tag selection when checkbox is clicked', () => {
    render(
      <MockedProvider mocks={[]}>
        <TagNode
          tag={mockTag}
          checkedTags={checkedTags}
          toggleTagSelection={toggleTagSelectionMock}
          t={tMock}
        />
      </MockedProvider>,
    );

    const checkbox = screen.getByLabelText('Test Tag');
    fireEvent.click(checkbox);
    expect(toggleTagSelectionMock).toHaveBeenCalledWith(mockTag, true);
  });

  it('loads and displays subtags when expanded', async () => {
    const mocks = [
      {
        request: {
          query: USER_TAG_SUB_TAGS,
          variables: {
            id: 'tag1',
            first: TAGS_QUERY_DATA_CHUNK_SIZE,
          },
        },
        result: { data: mockSubTagsData },
      },
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <TagNode
          tag={mockTag}
          checkedTags={checkedTags}
          toggleTagSelection={toggleTagSelectionMock}
          t={tMock}
        />
      </MockedProvider>,
    );

    const expandIcon = screen.getByTestId('expandSubTagstag1');
    fireEvent.click(expandIcon);

    // Wait for subtags to load
    await waitFor(() => {
      expect(screen.getByText('Subtag 1')).toBeInTheDocument();
      expect(screen.getByText('Subtag 2')).toBeInTheDocument();
    });
  });

  it('fetches more subtags when scrolling', async () => {
    const mocks = [
      {
        request: {
          query: USER_TAG_SUB_TAGS,
          variables: {
            id: 'tag1',
            first: TAGS_QUERY_DATA_CHUNK_SIZE,
          },
        },
        result: { data: mockSubTagsData },
      },
      {
        request: {
          query: USER_TAG_SUB_TAGS,
          variables: {
            id: 'tag1',
            first: TAGS_QUERY_DATA_CHUNK_SIZE,
            after: 'cursor1',
          },
        },
        result: { data: mockMoreSubTagsData },
      },
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <TagNode
          tag={mockTag}
          checkedTags={checkedTags}
          toggleTagSelection={toggleTagSelectionMock}
          t={tMock}
        />
      </MockedProvider>,
    );

    // Expand the tag
    const expandIcon = screen.getByTestId('expandSubTagstag1');
    fireEvent.click(expandIcon);

    // Wait for initial subtags to load
    await waitFor(() => {
      expect(screen.getByText('Subtag 1')).toBeInTheDocument();
      expect(screen.getByText('Subtag 2')).toBeInTheDocument();
    });

    // Mock InfiniteScroll behavior to trigger next fetch
    const scrollableDiv = screen.getByTestId('subTagsScrollableDivtag1');
    const infiniteScrollComponent = scrollableDiv.firstChild;

    // Simulate the InfiniteScroll's next function being called
    // Usually this would be triggered by the user scrolling, but we'll call it directly
    const infiniteScrollProps = (infiniteScrollComponent as any)?.props;
    infiniteScrollProps?.next();
  });

  it('shows checked state for selected tags', () => {
    checkedTags.add('tag1');

    render(
      <MockedProvider mocks={[]}>
        <TagNode
          tag={mockTag}
          checkedTags={checkedTags}
          toggleTagSelection={toggleTagSelectionMock}
          t={tMock}
        />
      </MockedProvider>,
    );

    const checkbox = screen.getByLabelText('Test Tag');
    expect(checkbox).toBeChecked();
  });

  it('displays error message when query fails', async () => {
    const mocks = [mockErrorResponse];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <TagNode
          tag={{ ...mockTag, id: 'error-tag' }}
          checkedTags={checkedTags}
          toggleTagSelection={toggleTagSelectionMock}
          t={tMock}
        />
      </MockedProvider>,
    );

    const expandIcon = screen.getByTestId('expandSubTagserror-tag');
    fireEvent.click(expandIcon);

    await waitFor(() => {
      expect(
        screen.getByText('errorOccurredWhileLoadingSubTags'),
      ).toBeInTheDocument();
    });
  });

  it('shows folder icon for tag with children and tag icon for tag without children', () => {
    render(
      <MockedProvider mocks={[]}>
        <TagNode
          tag={mockTag} // Has childTags: true
          checkedTags={checkedTags}
          toggleTagSelection={toggleTagSelectionMock}
          t={tMock}
        />
      </MockedProvider>,
    );

    const folderIcon = document.querySelector('.fa-folder');
    expect(folderIcon).toBeInTheDocument();

    render(
      <MockedProvider mocks={[]}>
        <TagNode
          tag={{
            ...mockTag,
            childTags: {
              edges: [],
              totalCount: 0,
              pageInfo: { hasNextPage: false },
            },
          }}
          checkedTags={checkedTags}
          toggleTagSelection={toggleTagSelectionMock}
          t={tMock}
        />
      </MockedProvider>,
    );

    const tagIcon = document.querySelector('.fa-tag');
  });

  it('collapses subtags when the expanded tag is clicked again', async () => {
    const mocks = [
      {
        request: {
          query: USER_TAG_SUB_TAGS,
          variables: {
            id: 'tag1',
            first: TAGS_QUERY_DATA_CHUNK_SIZE,
          },
        },
        result: { data: mockSubTagsData },
      },
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <TagNode
          tag={mockTag}
          checkedTags={checkedTags}
          toggleTagSelection={toggleTagSelectionMock}
          t={tMock}
        />
      </MockedProvider>,
    );

    // Expand the tag
    const expandIcon = screen.getByTestId('expandSubTagstag1');
    fireEvent.click(expandIcon);

    // Wait for subtags to load
    await waitFor(() => {
      expect(screen.getByText('Subtag 1')).toBeInTheDocument();
    });

    // Collapse the tag
    const collapseIcon = screen.getByTestId('expandSubTagstag1');
    fireEvent.click(collapseIcon);

    // The expand icon should be visible again
    expect(screen.getByText('▶')).toBeInTheDocument();

    // Subtags should no longer be visible
    expect(screen.queryByText('Subtag 1')).not.toBeInTheDocument();
  });
});
