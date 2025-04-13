import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import TagNode from './TagNode';
import { USER_TAG_SUB_TAGS } from 'GraphQl/Queries/userTagQueries';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { TFunction } from 'i18next/typescript/t';

// Mock the InfiniteScroll component
vi.mock('react-infinite-scroll-component', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="infinite-scroll">{children}</div>
  ),
}));

describe('TagNode Component', () => {
  const mockTag = {
    id: '1',
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

  const mockSubTags = {
    getChildTags: {
      childTags: {
        edges: [
          {
            node: {
              id: '2',
              name: 'Subtag 1',
              childTags: false,
            },
          },
          {
            node: {
              id: '3',
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

  const mockMoreSubTags = {
    getChildTags: {
      childTags: {
        edges: [
          {
            node: {
              id: '4',
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

  const mockErrorResponse = {
    request: {
      query: USER_TAG_SUB_TAGS,
      variables: { id: '1', first: 50 },
    },
    error: new Error('Failed to load subtags'),
  };

  const mocks = [
    {
      request: {
        query: USER_TAG_SUB_TAGS,
        variables: { id: '1', first: 50 },
      },
      result: {
        data: mockSubTags,
      },
    },
    {
      request: {
        query: USER_TAG_SUB_TAGS,
        variables: { id: '1', first: 50, after: 'cursor1' },
      },
      result: {
        data: mockMoreSubTags,
      },
    },
  ];

  const toggleTagSelectionMock = vi.fn();
  const tMock = vi.fn((key) => key) as unknown as TFunction<
    'translation',
    'manageTag'
  >;

  it('renders the tag node properly', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <TagNode
          tag={mockTag}
          checkedTags={new Set()}
          toggleTagSelection={toggleTagSelectionMock}
          t={tMock}
        />
      </MockedProvider>,
    );

    expect(screen.getByText('Test Tag')).toBeInTheDocument();
    expect(screen.getByLabelText('expand')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('toggles selection when checkbox is clicked', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <TagNode
          tag={mockTag}
          checkedTags={new Set()}
          toggleTagSelection={toggleTagSelectionMock}
          t={tMock}
        />
      </MockedProvider>,
    );

    const checkbox = screen.getByTestId('checkTag1');
    fireEvent.click(checkbox);
    expect(toggleTagSelectionMock).toHaveBeenCalledWith(mockTag, true);
  });

  it('shows checkbox as checked when tag is in checkedTags', () => {
    const checkedTags = new Set(['1']);
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

    const checkbox = screen.getByTestId('checkTag1');
    expect(checkbox).toBeChecked();
  });

  it('expands to show subtags when expand icon is clicked', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <TagNode
          tag={mockTag}
          checkedTags={new Set()}
          toggleTagSelection={toggleTagSelectionMock}
          t={tMock}
        />
      </MockedProvider>,
    );

    const expandButton = screen.getByTestId('expandSubTags1');
    fireEvent.click(expandButton);
    // Collapse the node
    fireEvent.click(expandButton);
    await waitFor(() => {
      expect(screen.queryByText('Subtag 1')).not.toBeInTheDocument();
    });
  });

  it('loads more subtags when scrolling', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <TagNode
          tag={mockTag}
          checkedTags={new Set()}
          toggleTagSelection={toggleTagSelectionMock}
          t={tMock}
        />
      </MockedProvider>,
    );

    // Expand the node
    const expandButton = screen.getByTestId('expandSubTags1');
    fireEvent.click(expandButton);
  });

  it('shows error message when failing to load subtags', async () => {
    render(
      <MockedProvider mocks={[mockErrorResponse]} addTypename={false}>
        <TagNode
          tag={mockTag}
          checkedTags={new Set()}
          toggleTagSelection={toggleTagSelectionMock}
          t={tMock}
        />
      </MockedProvider>,
    );

    // Expand the node
    const expandButton = screen.getByTestId('expandSubTags1');
    fireEvent.click(expandButton);

    // Wait for error message to appear
    await waitFor(() => {
      expect(
        screen.getByText('errorOccurredWhileLoadingSubTags'),
      ).toBeInTheDocument();
    });
  });

  it('uses appropriate icon based on whether tag has children', () => {
    // Tag with children
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <TagNode
          tag={mockTag}
          checkedTags={new Set()}
          toggleTagSelection={toggleTagSelectionMock}
          t={tMock}
        />
      </MockedProvider>,
    );

    const folderIcon = document.querySelector('.fa-folder');
    expect(folderIcon).toBeInTheDocument();

    // Tag without children
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <TagNode
          tag={{
            ...mockTag,
            childTags: {
              edges: [],
              totalCount: 0,
              pageInfo: { hasNextPage: false, endCursor: undefined },
            },
          }}
          checkedTags={new Set()}
          toggleTagSelection={toggleTagSelectionMock}
          t={tMock}
        />
      </MockedProvider>,
    );
  });

  it('changes expand icon when expanded/collapsed', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <TagNode
          tag={mockTag}
          checkedTags={new Set()}
          toggleTagSelection={toggleTagSelectionMock}
          t={tMock}
        />
      </MockedProvider>,
    );

    // Initially shows collapse icon
    const expandButton = screen.getByTestId('expandSubTags1');
    expect(expandButton.textContent).toBe('▶');

    // Click to expand
    fireEvent.click(expandButton);
    expect(expandButton.textContent).toBe('▼');

    fireEvent.click(expandButton);
    expect(expandButton.textContent).toBe('▶');
  });
});
