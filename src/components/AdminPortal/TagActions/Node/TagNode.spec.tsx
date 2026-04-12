import React, { act } from 'react';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import type { MockedResponse } from '@apollo/client/testing';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi, afterEach, beforeEach } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import i18n from 'utils/i18nForTest';
import { TAG_FOLDER_CHILD_FOLDERS_FOR_NODE } from 'GraphQl/Queries/userTagQueries';
import TagNode from './TagNode';
import type { InterfaceTagData } from 'utils/interfaces';

vi.mock('react-infinite-scroll-component', () => ({
  default: ({
    next,
    children,
  }: {
    next: () => void;
    children: React.ReactNode;
  }) => (
    <div data-testid="infinite-scroll-component">
      <button type="button" data-testid="trigger-load-more" onClick={next}>
        Load More
      </button>
      {children}
    </div>
  ),
}));

const makeTag = (
  id: string,
  name: string,
  childCount: number,
): InterfaceTagData => ({
  _id: id,
  name,
  parentTag: { _id: 'parent' },
  usersAssignedTo: { totalCount: 0 },
  childTags: { totalCount: childCount },
  ancestorTags: [],
});

const parentTag = makeTag('1', 'Parent Tag', 2);

const childFolderPageOne = [
  makeTag('childFolder1', 'child folder 1', 0),
  makeTag('childFolder2', 'child folder 2', 0),
];
const childFolderPageTwo = [makeTag('childFolder11', 'child folder 11', 0)];

const createMocks = (): MockedResponse[] => [
  {
    request: {
      query: TAG_FOLDER_CHILD_FOLDERS_FOR_NODE,
      variables: { id: '1', first: 10 },
    },
    result: {
      data: {
        tagFolder: {
          childFolders: {
            edges: childFolderPageOne.map((tag) => ({ node: tag })),
            pageInfo: {
              hasNextPage: true,
              endCursor: 'childFolder2',
            },
          },
        },
      },
    },
  },
  {
    request: {
      query: TAG_FOLDER_CHILD_FOLDERS_FOR_NODE,
      variables: { id: '1', first: 10, after: 'childFolder2' },
    },
    result: {
      data: {
        tagFolder: {
          childFolders: {
            edges: childFolderPageTwo.map((tag) => ({ node: tag })),
            pageInfo: {
              hasNextPage: false,
              endCursor: 'childFolder11',
            },
          },
        },
      },
    },
  },
  {
    request: {
      query: TAG_FOLDER_CHILD_FOLDERS_FOR_NODE,
      variables: { id: '1', first: 10, after: 'childFolder11' },
    },
    result: {
      data: {
        tagFolder: {
          childFolders: {
            edges: [],
            pageInfo: {
              hasNextPage: false,
              endCursor: 'childFolder11',
            },
          },
        },
      },
    },
  },
  {
    request: {
      query: TAG_FOLDER_CHILD_FOLDERS_FOR_NODE,
      variables: { id: '1', first: 10 },
    },
    result: {
      data: {
        tagFolder: {
          childFolders: {
            edges: childFolderPageOne.map((tag) => ({ node: tag })),
            pageInfo: {
              hasNextPage: true,
              endCursor: 'childFolder2',
            },
          },
        },
      },
    },
  },
];

const errorMocks: MockedResponse[] = [
  {
    request: {
      query: TAG_FOLDER_CHILD_FOLDERS_FOR_NODE,
      variables: { id: '1', first: 10 },
    },
    error: new Error('Mock Graphql Error for child folders query'),
  },
];

const checkedTags = new Set<string>();
let toggleTagSelection: ReturnType<typeof vi.fn>;
let user: ReturnType<typeof userEvent.setup>;

const renderNode = (
  mocks: ReadonlyArray<MockedResponse>,
  tag: InterfaceTagData = parentTag,
) =>
  render(
    <I18nextProvider i18n={i18n}>
      <MockedProvider mocks={mocks}>
        <TagNode
          tag={tag}
          checkedTags={checkedTags}
          toggleTagSelection={toggleTagSelection}
        />
      </MockedProvider>
    </I18nextProvider>,
  );

describe('TagNode', () => {
  beforeEach(() => {
    toggleTagSelection = vi.fn();
    user = userEvent.setup();
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  test('renders tag name and toggles checkbox', async () => {
    renderNode([]);

    expect(screen.getByText('Parent Tag')).toBeInTheDocument();

    await user.click(screen.getByTestId('checkTag1'));
    await waitFor(() => {
      expect(toggleTagSelection).toHaveBeenCalledWith(parentTag, true);
    });
  });

  test('expands and shows child folders', async () => {
    renderNode(createMocks());

    await user.click(screen.getByTestId('expandChildFolders1'));

    await waitFor(() => {
      expect(screen.getByText('child folder 1')).toBeInTheDocument();
      expect(screen.getByText('child folder 2')).toBeInTheDocument();
    });
  });

  test('handles load-more trigger without breaking child folder list', async () => {
    renderNode(createMocks());

    await user.click(screen.getByTestId('expandChildFolders1'));

    await waitFor(() => {
      expect(screen.getByText('child folder 1')).toBeInTheDocument();
    });

    await act(async () => {
      await user.click(screen.getByTestId('trigger-load-more'));
    });

    await waitFor(() => {
      expect(screen.getByText('child folder 1')).toBeInTheDocument();
      expect(screen.getByText('child folder 2')).toBeInTheDocument();
    });
  });

  test('renders error message when child folder query fails', async () => {
    renderNode(errorMocks);

    await user.click(screen.getByTestId('expandChildFolders1'));

    await waitFor(() => {
      expect(
        screen.getByText('Error occurred while loading child folders'),
      ).toBeInTheDocument();
    });
  });

  test('renders leaf tag without expand icon', () => {
    const leafTag = makeTag('leaf-1', 'Leaf Tag', 0);
    renderNode([], leafTag);

    expect(screen.getByText('Leaf Tag')).toBeInTheDocument();
    expect(
      screen.queryByTestId('expandChildFoldersleaf-1'),
    ).not.toBeInTheDocument();
  });
});
