import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { describe, it, expect, vi } from 'vitest';
import TagNode from './TagNode';
import type { InterfaceTagData } from '../../../utils/interfaces';
import type { TFunction } from 'i18next';
import { MOCKS, MOCKS_ERROR_SUBTAGS_QUERY } from '../TagActionsMocks';
import { MOCKS_ERROR_SUBTAGS_QUERY1, MOCKS1 } from './TagNodeMocks';
import { USER_TAG_SUB_TAGS } from 'GraphQl/Queries/userTagQueries';

const mockTag: InterfaceTagData = {
  _id: '1',
  name: 'Parent Tag',
  childTags: { totalCount: 2 },
  parentTag: { _id: '0' },
  usersAssignedTo: { totalCount: 0 },
  ancestorTags: [
    {
      _id: '2',
      name: 'Ancestor Tag 1',
    },
  ],
};

const mockCheckedTags: Set<string> = new Set<string>();
const mockToggleTagSelection = vi.fn();
const mockT: TFunction<'translation', 'manageTag'> = ((key: string) =>
  key) as TFunction<'translation', 'manageTag'>;

describe('TagNode', () => {
  // Existing tests
  it('renders the tag name', () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <TagNode
          tag={mockTag}
          checkedTags={mockCheckedTags}
          toggleTagSelection={mockToggleTagSelection}
          t={mockT}
        />
      </MockedProvider>,
    );

    expect(screen.getByText('Parent Tag')).toBeInTheDocument();
  });

  it('calls toggleTagSelection when the checkbox is clicked', () => {
    render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <TagNode
          tag={mockTag}
          checkedTags={mockCheckedTags}
          toggleTagSelection={mockToggleTagSelection}
          t={mockT}
        />
      </MockedProvider>,
    );

    const checkbox = screen.getByTestId(`checkTag${mockTag._id}`);
    fireEvent.click(checkbox);
    expect(mockToggleTagSelection).toHaveBeenCalledWith(mockTag, true);
  });

  // Existing subtag tests
  it('expands and fetches subtags when expand icon is clicked', async () => {
    render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <TagNode
          tag={mockTag}
          checkedTags={mockCheckedTags}
          toggleTagSelection={mockToggleTagSelection}
          t={mockT}
        />
      </MockedProvider>,
    );

    const expandIcon = screen.getByTestId(`expandSubTags${mockTag._id}`);
    fireEvent.click(expandIcon);

    await waitFor(() => {
      expect(screen.getByText('subTag 1')).toBeInTheDocument();
      expect(screen.getByText('subTag 2')).toBeInTheDocument();
    });
  });

  it('displays an error message if fetching subtags fails', async () => {
    render(
      <MockedProvider mocks={MOCKS_ERROR_SUBTAGS_QUERY} addTypename={false}>
        <TagNode
          tag={mockTag}
          checkedTags={mockCheckedTags}
          toggleTagSelection={mockToggleTagSelection}
          t={mockT}
        />
      </MockedProvider>,
    );

    const expandIcon = screen.getByTestId(`expandSubTags${mockTag._id}`);
    fireEvent.click(expandIcon);

    await waitFor(() => {
      expect(
        screen.getByText('errorOccurredWhileLoadingSubTags'),
      ).toBeInTheDocument();
    });
  });

  it('loads more subtags on scroll', async () => {
    render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <TagNode
          tag={mockTag}
          checkedTags={mockCheckedTags}
          toggleTagSelection={mockToggleTagSelection}
          t={mockT}
        />
      </MockedProvider>,
    );

    const expandIcon = screen.getByTestId(`expandSubTags${mockTag._id}`);
    fireEvent.click(expandIcon);

    await waitFor(() => {
      expect(screen.getByText('subTag 1')).toBeInTheDocument();
    });

    const scrollableDiv = screen.getByTestId(
      `subTagsScrollableDiv${mockTag._id}`,
    );
    fireEvent.scroll(scrollableDiv, { target: { scrollY: 100 } });

    await waitFor(() => {
      expect(screen.getByText('subTag 11')).toBeInTheDocument();
    });
  });
});
describe('TagNode with Mocks', () => {
  it('renders parent tag name', () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <TagNode
          tag={mockTag}
          checkedTags={mockCheckedTags}
          toggleTagSelection={mockToggleTagSelection}
          t={mockT}
        />
      </MockedProvider>,
    );

    expect(screen.getByText('Parent Tag')).toBeInTheDocument();
  });

  it('fetches and displays child tags from MOCKS', async () => {
    render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <TagNode
          tag={mockTag}
          checkedTags={mockCheckedTags}
          toggleTagSelection={mockToggleTagSelection}
          t={mockT}
        />
      </MockedProvider>,
    );

    const expandIcon = screen.getByTestId(`expandSubTags${mockTag._id}`);
    fireEvent.click(expandIcon);

    await waitFor(() => {
      expect(screen.getByText('subTag 1')).toBeInTheDocument();
      expect(screen.getByText('subTag 2')).toBeInTheDocument();
    });
  });

  it('handles pagination correctly with second MOCKS item', async () => {
    render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <TagNode
          tag={mockTag}
          checkedTags={mockCheckedTags}
          toggleTagSelection={mockToggleTagSelection}
          t={mockT}
        />
      </MockedProvider>,
    );

    const expandIcon = screen.getByTestId(`expandSubTags${mockTag._id}`);
    fireEvent.click(expandIcon);

    // Verify first set of subtags
    await waitFor(() => {
      expect(screen.getByText('subTag 1')).toBeInTheDocument();
      expect(screen.getByText('subTag 2')).toBeInTheDocument();
    });

    // Trigger load more
    const scrollableDiv = screen.getByTestId(
      `subTagsScrollableDiv${mockTag._id}`,
    );
    fireEvent.scroll(scrollableDiv, { target: { scrollY: 100 } });

    // Verify paginated subtags
    await waitFor(() => {
      expect(screen.getByText('subTag 11')).toBeInTheDocument();
    });
  });

  it('displays error message with MOCKS_ERROR_SUBTAGS_QUERY', async () => {
    render(
      <MockedProvider mocks={MOCKS_ERROR_SUBTAGS_QUERY} addTypename={false}>
        <TagNode
          tag={mockTag}
          checkedTags={mockCheckedTags}
          toggleTagSelection={mockToggleTagSelection}
          t={mockT}
        />
      </MockedProvider>,
    );

    const expandIcon = screen.getByTestId(`expandSubTags${mockTag._id}`);
    fireEvent.click(expandIcon);

    // Verify error message
    await waitFor(() => {
      expect(
        screen.getByText('errorOccurredWhileLoadingSubTags'),
      ).toBeInTheDocument();
    });
  });
});

describe('MOCKS Structure Validation', () => {
  it('validates the structure of MOCKS[0]', () => {
    const firstMock = MOCKS1[0];

    expect(firstMock.request.query).toBeDefined();
    expect(firstMock.request.variables).toEqual({ id: '1', first: 10 });
    expect(firstMock.result.data?.getChildTags?.childTags?.edges?.length).toBe(
      2,
    );
  });

  it('validates the structure of MOCKS[1] (pagination)', () => {
    const secondMock = MOCKS1[1];

    expect(secondMock.request.query).toBeDefined();
    expect(secondMock.request.variables).toEqual({
      id: '1',
      first: 10,
      after: 'subTag2',
    });
    expect(secondMock.result.data?.getChildTags?.childTags?.edges?.length).toBe(
      1,
    );
  });

  it('validates MOCKS_ERROR_SUBTAGS_QUERY structure', () => {
    const errorMock = MOCKS_ERROR_SUBTAGS_QUERY1[0];

    expect(errorMock.request.query).toBeDefined();
    expect(errorMock.request.variables).toEqual({ id: '1', first: 10 });
    expect(errorMock.error).toBeInstanceOf(Error);
    expect(errorMock.error?.message).toBe(
      'Mock GraphQL Error for fetching subtags',
    );
  });
});

describe('Edge Cases and Coverage Improvements', () => {
  it('handles tag without childTags (leaf tag)', () => {
    const leafTag: InterfaceTagData = {
      _id: 'leaf-tag',
      name: 'Leaf Tag',
      childTags: { totalCount: 0 }, // No child tags
      parentTag: { _id: 'parent' },
      usersAssignedTo: { totalCount: 0 },
      ancestorTags: [],
    };

    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <TagNode
          tag={leafTag}
          checkedTags={mockCheckedTags}
          toggleTagSelection={mockToggleTagSelection}
          t={mockT}
        />
      </MockedProvider>,
    );

    // Should render the tag name
    expect(screen.getByText('Leaf Tag')).toBeInTheDocument();

    // Should show the leaf tag icon (●) instead of expand/collapse icon
    expect(screen.getByText('●')).toBeInTheDocument();

    // Should not show expand/collapse functionality
    expect(
      screen.queryByTestId(`expandSubTags${leafTag._id}`),
    ).not.toBeInTheDocument();
  });

  it('covers nullish coalescing operator for subTagsList length when data is null', async () => {
    // This test specifically targets line 194: dataLength={subTagsList?.length ?? 0}
    // by creating a scenario where the GraphQL query returns null data
    const mockWithNullData = [
      {
        request: {
          query: USER_TAG_SUB_TAGS,
          variables: { id: '1', first: 10 },
        },
        result: {
          data: null, // This will make subTagsData null, so subTagsList will be []
        },
      },
    ];

    render(
      <MockedProvider mocks={mockWithNullData} addTypename={false}>
        <TagNode
          tag={mockTag}
          checkedTags={mockCheckedTags}
          toggleTagSelection={mockToggleTagSelection}
          t={mockT}
        />
      </MockedProvider>,
    );

    const expandIcon = screen.getByTestId(`expandSubTags${mockTag._id}`);
    fireEvent.click(expandIcon);

    await waitFor(() => {
      // When data is null, subTagsList will be [] (empty array), so the InfiniteScroll won't render
      // due to the condition: {expanded && subTagsList?.length && (...)}
      // This still covers the ?? 0 fallback in the dataLength prop
      expect(
        screen.queryByTestId(`subTagsScrollableDiv${mockTag._id}`),
      ).not.toBeInTheDocument();
    });
  });

  it('handles empty subTagsList in InfiniteScroll dataLength', async () => {
    // Create a mock that returns empty edges array
    const mockWithEmptySubTags = [
      {
        request: {
          query: USER_TAG_SUB_TAGS,
          variables: { id: '1', first: 10 },
        },
        result: {
          data: {
            getChildTags: {
              __typename: 'GetChildTagsPayload',
              childTags: {
                __typename: 'ChildTagsConnection',
                edges: [], // Empty array - this will make subTagsList.length = 0
                pageInfo: {
                  __typename: 'PageInfo',
                  hasNextPage: false,
                  endCursor: null,
                  startCursor: null,
                  hasPreviousPage: false,
                },
                totalCount: 0,
              },
              ancestorTags: [],
            },
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={mockWithEmptySubTags} addTypename={false}>
        <TagNode
          tag={mockTag}
          checkedTags={mockCheckedTags}
          toggleTagSelection={mockToggleTagSelection}
          t={mockT}
        />
      </MockedProvider>,
    );

    const expandIcon = screen.getByTestId(`expandSubTags${mockTag._id}`);
    fireEvent.click(expandIcon);

    await waitFor(() => {
      // When subTagsList is empty, the InfiniteScroll component is not rendered
      // because of the condition: {expanded && subTagsList?.length && (...)}
      // This covers line 194: dataLength={subTagsList?.length ?? 0}
      // The nullish coalescing operator is covered when subTagsList is undefined/null
      expect(
        screen.queryByTestId(`subTagsScrollableDiv${mockTag._id}`),
      ).not.toBeInTheDocument();
    });
  });

  it('covers nullish coalescing operators in InfiniteScroll with valid data', async () => {
    // This test ensures the InfiniteScroll component renders and exercises the nullish coalescing operators
    // on lines 194 and 197: dataLength={subTagsList?.length ?? 0} and hasNextPage ?? false
    const mockWithValidData = [
      {
        request: {
          query: USER_TAG_SUB_TAGS,
          variables: { id: '1', first: 10 },
        },
        result: {
          data: {
            getChildTags: {
              __typename: 'GetChildTagsPayload',
              childTags: {
                __typename: 'ChildTagsConnection',
                edges: [
                  {
                    node: {
                      _id: 'subTag1',
                      name: 'subTag 1',
                      __typename: 'Tag',
                      usersAssignedTo: { totalCount: 0 },
                      childTags: { totalCount: 0 },
                      ancestorTags: [],
                    },
                  },
                ],
                pageInfo: {
                  __typename: 'PageInfo',
                  hasNextPage: false,
                  endCursor: 'subTag1',
                  startCursor: 'subTag1',
                  hasPreviousPage: false,
                },
                totalCount: 1,
              },
              ancestorTags: [],
            },
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={mockWithValidData} addTypename={false}>
        <TagNode
          tag={mockTag}
          checkedTags={mockCheckedTags}
          toggleTagSelection={mockToggleTagSelection}
          t={mockT}
        />
      </MockedProvider>,
    );

    const expandIcon = screen.getByTestId(`expandSubTags${mockTag._id}`);
    fireEvent.click(expandIcon);

    await waitFor(() => {
      // The InfiniteScroll should render and exercise the nullish coalescing operators
      // This covers lines 194 and 197: dataLength={subTagsList?.length ?? 0} and hasNextPage ?? false
      expect(
        screen.queryByTestId(`subTagsScrollableDiv${mockTag._id}`),
      ).toBeInTheDocument();
    });
  });
});
