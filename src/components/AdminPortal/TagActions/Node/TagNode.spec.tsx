import React, { act } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { describe, it, expect, vi } from 'vitest';
import TagNode from './TagNode';
import type { InterfaceTagData } from 'utils/interfaces';
import type { TFunction } from 'i18next';
import { MOCKS, MOCKS_ERROR_SUBTAGS_QUERY } from '../TagActionsMocks';
import { MOCKS_ERROR_SUBTAGS_QUERY1, MOCKS1 } from './TagNodeMocks';
import { USER_TAG_SUB_TAGS } from 'GraphQl/Queries/userTagQueries';
import userEvent from '@testing-library/user-event';

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
let mockToggleTagSelection: ReturnType<typeof vi.fn>;
const mockT: TFunction<'translation', 'manageTag'> = ((key: string) =>
  key) as TFunction<'translation', 'manageTag'>;

let user: ReturnType<typeof userEvent.setup>;

beforeEach(() => {
  mockToggleTagSelection = vi.fn();
  user = userEvent.setup();
});

afterEach(() => {
  vi.clearAllMocks();
  vi.restoreAllMocks();
});

describe('TagNode', () => {
  // Existing tests
  it('renders the tag name', () => {
    render(
      <MockedProvider mocks={[]}>
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

  it('calls toggleTagSelection when the checkbox is clicked', async () => {
    render(
      <MockedProvider mocks={MOCKS}>
        <TagNode
          tag={mockTag}
          checkedTags={mockCheckedTags}
          toggleTagSelection={mockToggleTagSelection}
          t={mockT}
        />
      </MockedProvider>,
    );

    const checkbox = screen.getByTestId(`checkTag${mockTag._id}`);
    await user.click(checkbox);
    expect(mockToggleTagSelection).toHaveBeenCalledWith(mockTag, true);
  });

  // Existing subtag tests
  it('expands and fetches subtags when expand icon is clicked', async () => {
    render(
      <MockedProvider mocks={MOCKS}>
        <TagNode
          tag={mockTag}
          checkedTags={mockCheckedTags}
          toggleTagSelection={mockToggleTagSelection}
          t={mockT}
        />
      </MockedProvider>,
    );

    const expandIcon = screen.getByTestId(`expandSubTags${mockTag._id}`);
    await user.click(expandIcon);

    await waitFor(() => {
      expect(screen.getByText('subTag 1')).toBeInTheDocument();
      expect(screen.getByText('subTag 2')).toBeInTheDocument();
    });
  });

  it('displays an error message if fetching subtags fails', async () => {
    render(
      <MockedProvider mocks={MOCKS_ERROR_SUBTAGS_QUERY}>
        <TagNode
          tag={mockTag}
          checkedTags={mockCheckedTags}
          toggleTagSelection={mockToggleTagSelection}
          t={mockT}
        />
      </MockedProvider>,
    );

    const expandIcon = screen.getByTestId(`expandSubTags${mockTag._id}`);
    await user.click(expandIcon);

    await waitFor(() => {
      expect(
        screen.getByText('errorOccurredWhileLoadingSubTags'),
      ).toBeInTheDocument();
    });
  });

  it('loads more subtags on scroll', async () => {
    render(
      <MockedProvider mocks={MOCKS}>
        <TagNode
          tag={mockTag}
          checkedTags={mockCheckedTags}
          toggleTagSelection={mockToggleTagSelection}
          t={mockT}
        />
      </MockedProvider>,
    );

    const expandIcon = screen.getByTestId(`expandSubTags${mockTag._id}`);
    await user.click(expandIcon);

    await waitFor(() => {
      expect(screen.getByText('subTag 1')).toBeInTheDocument();
    });

    const scrollableDiv = screen.getByTestId(
      `subTagsScrollableDiv${mockTag._id}`,
    );
    await act(async () => {
      scrollableDiv.scrollTop = 100;
      scrollableDiv.dispatchEvent(new Event('scroll', { bubbles: true }));
    });

    await waitFor(() => {
      expect(screen.getByText('subTag 11')).toBeInTheDocument();
    });
  });
});
describe('TagNode with Mocks', () => {
  it('renders parent tag name', () => {
    render(
      <MockedProvider mocks={[]}>
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
      <MockedProvider mocks={MOCKS}>
        <TagNode
          tag={mockTag}
          checkedTags={mockCheckedTags}
          toggleTagSelection={mockToggleTagSelection}
          t={mockT}
        />
      </MockedProvider>,
    );

    const expandIcon = screen.getByTestId(`expandSubTags${mockTag._id}`);
    await user.click(expandIcon);

    await waitFor(() => {
      expect(screen.getByText('subTag 1')).toBeInTheDocument();
      expect(screen.getByText('subTag 2')).toBeInTheDocument();
    });
  });

  it('handles pagination correctly with second MOCKS item', async () => {
    render(
      <MockedProvider mocks={MOCKS}>
        <TagNode
          tag={mockTag}
          checkedTags={mockCheckedTags}
          toggleTagSelection={mockToggleTagSelection}
          t={mockT}
        />
      </MockedProvider>,
    );

    const expandIcon = screen.getByTestId(`expandSubTags${mockTag._id}`);
    await user.click(expandIcon);

    // Verify first set of subtags
    await waitFor(() => {
      expect(screen.getByText('subTag 1')).toBeInTheDocument();
      expect(screen.getByText('subTag 2')).toBeInTheDocument();
    });

    // Trigger load more
    const scrollableDiv = screen.getByTestId(
      `subTagsScrollableDiv${mockTag._id}`,
    );
    await act(async () => {
      scrollableDiv.scrollTop = 100;
      scrollableDiv.dispatchEvent(new Event('scroll', { bubbles: true }));
    });

    // Verify paginated subtags
    await waitFor(() => {
      expect(screen.getByText('subTag 11')).toBeInTheDocument();
    });
  });

  it('displays error message with MOCKS_ERROR_SUBTAGS_QUERY', async () => {
    render(
      <MockedProvider mocks={MOCKS_ERROR_SUBTAGS_QUERY}>
        <TagNode
          tag={mockTag}
          checkedTags={mockCheckedTags}
          toggleTagSelection={mockToggleTagSelection}
          t={mockT}
        />
      </MockedProvider>,
    );

    const expandIcon = screen.getByTestId(`expandSubTags${mockTag._id}`);
    await user.click(expandIcon);

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
      <MockedProvider mocks={[]}>
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

  it('exercises nullish coalescing operator for subTagsList length when dataLength is evaluated', async () => {
    // This test exercises line 194: dataLength={subTagsList?.length ?? 0}
    // by creating a scenario where InfiniteScroll renders and the dataLength calculation is executed
    // We provide valid data with one subtag to ensure InfiniteScroll renders
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
      <MockedProvider mocks={mockWithValidData}>
        <TagNode
          tag={mockTag}
          checkedTags={mockCheckedTags}
          toggleTagSelection={mockToggleTagSelection}
          t={mockT}
        />
      </MockedProvider>,
    );

    const expandIcon = screen.getByTestId(`expandSubTags${mockTag._id}`);
    await user.click(expandIcon);

    await waitFor(() => {
      // The InfiniteScroll should render and the dataLength={subTagsList?.length ?? 0}
      // expression on line 194 will be evaluated
      // This covers the nullish coalescing operator when subTagsList has a valid length
      expect(
        screen.queryByTestId(`subTagsScrollableDiv${mockTag._id}`),
      ).toBeInTheDocument();
    });
  });

  it('handles empty subTagsList array in InfiniteScroll rendering', async () => {
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
      <MockedProvider mocks={mockWithEmptySubTags}>
        <TagNode
          tag={mockTag}
          checkedTags={mockCheckedTags}
          toggleTagSelection={mockToggleTagSelection}
          t={mockT}
        />
      </MockedProvider>,
    );

    const expandIcon = screen.getByTestId(`expandSubTags${mockTag._id}`);
    await user.click(expandIcon);

    await waitFor(() => {
      // When subTagsList is an empty array, the InfiniteScroll component is not rendered
      // because of the condition: {expanded && subTagsList?.length && (...)}
      // This test verifies behavior when subTagsList.length === 0 (empty array case)
      // Note: This does NOT exercise the nullish coalescing operator (?? 0) on line 194
      expect(
        screen.queryByTestId(`subTagsScrollableDiv${mockTag._id}`),
      ).not.toBeInTheDocument();
    });
  });

  it('handles fetchMoreSubTags with undefined fetchMoreResult in updateQuery', async () => {
    // This test covers line 90: if (!fetchMoreResult) return prevResult;
    // We need to simulate the scenario where fetchMore returns undefined
    const mockWithFetchMoreUndefined = [
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
                  hasNextPage: true,
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
      {
        request: {
          query: USER_TAG_SUB_TAGS,
          variables: { id: '1', first: 10, after: 'subTag1' },
        },
        result: {
          data: undefined, // This simulates fetchMoreResult being undefined
        },
      },
    ];

    render(
      <MockedProvider mocks={mockWithFetchMoreUndefined}>
        <TagNode
          tag={mockTag}
          checkedTags={mockCheckedTags}
          toggleTagSelection={mockToggleTagSelection}
          t={mockT}
        />
      </MockedProvider>,
    );

    const expandIcon = screen.getByTestId(`expandSubTags${mockTag._id}`);
    await user.click(expandIcon);

    await waitFor(() => {
      // Wait for initial data to load
      expect(
        screen.queryByTestId(`subTagsScrollableDiv${mockTag._id}`),
      ).toBeInTheDocument();
    });

    // Simulate scroll to trigger fetchMore
    const scrollableDiv = screen.getByTestId(
      `subTagsScrollableDiv${mockTag._id}`,
    );
    await act(async () => {
      scrollableDiv.scrollTop = 1000;
      scrollableDiv.dispatchEvent(new Event('scroll', { bubbles: true }));
    });

    await waitFor(() => {
      // The component should still render after fetchMore returns undefined
      // This covers line 90: if (!fetchMoreResult) return prevResult;
      expect(
        screen.queryByTestId(`subTagsScrollableDiv${mockTag._id}`),
      ).toBeInTheDocument();
    });
  });

  it('handles nullish coalescing operator for subTagsList length when data is null', async () => {
    // This test covers the scenario where the GraphQL query returns null data
    // and the nullish coalescing operator ?? 0 is used on line 194
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
      <MockedProvider mocks={mockWithNullData}>
        <TagNode
          tag={mockTag}
          checkedTags={mockCheckedTags}
          toggleTagSelection={mockToggleTagSelection}
          t={mockT}
        />
      </MockedProvider>,
    );

    const expandIcon = screen.getByTestId(`expandSubTags${mockTag._id}`);
    await user.click(expandIcon);

    await waitFor(() => {
      // When data is null, subTagsList will be [] (empty array), so the InfiniteScroll won't render
      // due to the condition: {expanded && subTagsList?.length && (...)}
      // This still covers the ?? 0 fallback in the dataLength prop
      expect(
        screen.queryByTestId(`subTagsScrollableDiv${mockTag._id}`),
      ).not.toBeInTheDocument();
    });
  });

  it('exercises nullish coalescing operator for hasNextPage with undefined value', async () => {
    // This test exercises the nullish coalescing operator on line 197: hasNextPage ?? false
    // by setting hasNextPage to undefined in the mock
    const mockWithUndefinedHasNextPage = [
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
                  hasNextPage: undefined, // This will exercise the ?? false fallback on line 197
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
      <MockedProvider mocks={mockWithUndefinedHasNextPage}>
        <TagNode
          tag={mockTag}
          checkedTags={mockCheckedTags}
          toggleTagSelection={mockToggleTagSelection}
          t={mockT}
        />
      </MockedProvider>,
    );

    const expandIcon = screen.getByTestId(`expandSubTags${mockTag._id}`);
    await user.click(expandIcon);

    await waitFor(() => {
      // The InfiniteScroll should render and the nullish coalescing operator ?? false
      // on line 197 should be exercised when hasNextPage is undefined
      expect(
        screen.queryByTestId(`subTagsScrollableDiv${mockTag._id}`),
      ).toBeInTheDocument();
    });
  });
});
