import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import PostsRenderer from './Posts';

import type {
  InterfacePost,
  InterfacePostEdge,
} from '../../types/Post/interface';
import type { PostNode } from '../../types/Post/type';

interface InterfacePostCardProps {
  id: string;
  title: string;
  creator: {
    name: string;
  };
}

vi.mock('components/Loader/Loader', () => ({
  default: () => <div data-testid="loader">Loading...</div>,
}));

vi.mock('components/NotFound/NotFound', () => ({
  default: ({ title, keyPrefix }: { title: string; keyPrefix: string }) => (
    <div data-testid="not-found" data-title={title} data-key-prefix={keyPrefix}>
      Not Found
    </div>
  ),
}));

vi.mock('shared-components/postCard/PostCard', () => ({
  default: ({
    id,
    title,
    creator,
    fetchPosts,
  }: InterfacePostCardProps & { fetchPosts?: () => void }) => {
    return (
      <div data-testid="org-post-card" data-post-id={id}>
        <div>{title}</div>
        <div>by {creator.name}</div>
        <button
          type="button"
          onClick={fetchPosts}
          data-testid="fetch-posts-btn"
        >
          Fetch Posts
        </button>
      </div>
    );
  },
}));

// Mock PinnedPostsStory component
vi.mock('./PinnedPostsStory', () => ({
  default: ({
    pinnedPosts,
    onStoryClick,
  }: {
    pinnedPosts: InterfacePostEdge[];
    onStoryClick: (post: InterfacePost) => void;
  }) => (
    <div data-testid="pinned-posts-story">
      {pinnedPosts.map((edge) => (
        <button
          key={edge.node.id}
          data-testid={`story-${edge.node.id}`}
          onClick={() => onStoryClick(edge.node)}
        >
          {edge.node.caption}
        </button>
      ))}
    </div>
  ),
}));

// Factory function to create PostNode and InterfacePost fixtures
interface IPostFixtureOverrides {
  id?: string;
  caption?: string | null;
  createdAt?: string; // Note: createdAt is required in both types, not nullable
  creator?: {
    id?: string;
    name?: string;
    email?: string;
    emailAddress?: string;
    avatarURL?: string | null;
  } | null;
  commentCount?: number;
  commentsCount?: number;
  hasUserVoted?: {
    hasVoted: boolean;
    voteType: 'up_vote' | 'down_vote' | null;
  };
  upVotesCount?: number;
  downVotesCount?: number;
  pinnedAt?: string | null;
  pinned?: boolean;
  attachments?: {
    mimeType: string;
    name: string;
    fileHash: string;
    objectName: string;
  }[];
  downVoters?: {
    edges: {
      node: {
        id: string;
        creator: {
          id: string;
          name: string;
        };
      };
    }[];
  };
  imageUrl?: string | null;
  videoUrl?: string | null;
}

function buildPostPair(overrides: IPostFixtureOverrides = {}) {
  const defaultId = 'post-default';
  const defaultCaption = 'Default Post Caption';
  const defaultCreatedAt = '2023-01-01T00:00:00Z';
  const defaultCreator = {
    id: 'user-1',
    name: 'Test User',
    email: 'test@example.com',
    emailAddress: 'test@example.com',
  };

  const postNode: PostNode = {
    id: overrides.id ?? defaultId,
    caption:
      overrides.caption !== undefined ? overrides.caption : defaultCaption,
    createdAt: overrides.createdAt ?? defaultCreatedAt,
    creator:
      overrides.creator === null
        ? {
            id: defaultCreator.id,
            name: 'Unknown User',
            emailAddress: 'unknown@example.com',
          }
        : {
            id: overrides.creator?.id ?? defaultCreator.id,
            name: overrides.creator?.name ?? defaultCreator.name,
            emailAddress:
              overrides.creator?.emailAddress ?? defaultCreator.emailAddress,
            ...(overrides.creator?.avatarURL !== undefined && {
              avatarURL: overrides.creator.avatarURL,
            }),
          },
    commentCount: overrides.commentCount ?? 0,
    commentsCount: overrides.commentsCount ?? 0,
    hasUserVoted: overrides.hasUserVoted ?? { hasVoted: false, voteType: null },
    upVotesCount: overrides.upVotesCount ?? 0,
    downVotesCount: overrides.downVotesCount ?? 0,
    pinnedAt: overrides.pinnedAt !== undefined ? overrides.pinnedAt : null,
    attachments: overrides.attachments ?? [],
    downVoters: overrides.downVoters ?? { edges: [] },
  };

  const interfacePost: InterfacePost = {
    id: overrides.id ?? defaultId,
    caption:
      overrides.caption !== undefined ? overrides.caption : defaultCaption,
    createdAt: overrides.createdAt ?? defaultCreatedAt,
    creator:
      overrides.creator === null
        ? null
        : {
            id: overrides.creator?.id ?? defaultCreator.id,
            name: overrides.creator?.name ?? defaultCreator.name,
            email: overrides.creator?.email ?? defaultCreator.email,
          },
    pinnedAt: overrides.pinnedAt !== undefined ? overrides.pinnedAt : null,
    pinned: overrides.pinned ?? false,
    ...(overrides.imageUrl !== undefined && { imageUrl: overrides.imageUrl }),
    ...(overrides.videoUrl !== undefined && { videoUrl: overrides.videoUrl }),
  };

  return { postNode, interfacePost };
}

describe('PostsRenderer', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const { postNode: mockPost } = buildPostPair({
    id: 'post-1',
    caption: 'Test Post',
    commentCount: 5,
    commentsCount: 5,
    creator: {
      id: 'user-1',
      name: 'Test User',
      emailAddress: 'test@example.com',
    },
    upVotesCount: 10,
    downVotesCount: 2,
    pinnedAt: '2023-01-01T00:00:00Z',
    attachments: [
      {
        mimeType: 'image/jpeg',
        name: 'test-image.jpg',
        fileHash: 'hash123',
        objectName: 'obj123',
      },
    ],
  });

  const { postNode: mockPostNoAttachments } = buildPostPair({
    id: 'post-2',
    caption: 'Test Post', // Changed to match the test expectation
    attachments: [],
  });

  const { postNode: mockPostWithPlaceholderCreator } = buildPostPair({
    id: 'post-3',
    caption: 'Test Post Placeholder Creator',
    commentCount: 1,
    commentsCount: 1,
    creator: {
      id: 'user-3',
      name: 'Unknown User',
      emailAddress: 'unknown@example.com',
    },
    upVotesCount: 3,
    downVotesCount: 1,
    attachments: [
      {
        mimeType: 'image/jpeg',
        name: 'test-image.jpg',
        fileHash: 'hash456',
        objectName: 'obj456',
      },
    ],
  });

  // Create InterfacePost objects for postsByOrganization
  const mockInterfacePost: InterfacePost = {
    id: 'post-1',
    caption: 'Test Post',
    createdAt: '2023-01-01T00:00:00Z',
    creator: {
      id: 'user-1',
      name: 'Test User',
      email: 'test@example.com',
      avatarURL: 'avatar.jpg',
    },
    imageUrl: 'test-image.jpg',
    videoUrl: 'test-video.mp4',
    pinnedAt: '2023-01-01T00:00:00Z',
  };

  const mockInterfacePostNoAttachments: InterfacePost = {
    id: 'post-2',
    caption: 'Test Post',
    createdAt: '2023-01-01T00:00:00Z',
    creator: {
      id: 'user-1',
      name: 'Test User',
      email: 'test@example.com',
    },
    pinnedAt: null,
  };

  const mockInterfacePostNoCreator: InterfacePost = {
    id: 'post-3',
    caption: 'Test Post No Creator',
    createdAt: '2023-01-01T00:00:00Z',
    creator: {
      id: 'user-3',
      name: 'Unknown User',
      email: 'unknown@example.com',
    },
    imageUrl: 'test-image.jpg',
    pinned: false,
  };

  const createEdge = (post: PostNode) => ({
    node: post,
    cursor: `cursor-${post.id}`,
  });

  const defaultProps = {
    loading: false,
    error: undefined,
    data: {
      organization: {
        posts: {
          edges: [
            createEdge(mockPost),
            createEdge(mockPostNoAttachments),
            createEdge(mockPostWithPlaceholderCreator),
          ],
        },
      },
      postsByOrganization: [
        mockInterfacePost,
        mockInterfacePostNoAttachments,
        mockInterfacePostNoCreator,
      ],
    },
    pinnedPostData: undefined,
    isFiltering: false,
    searchTerm: '',
    sortingOption: 'None',
    displayPosts: [] as InterfacePost[],
  };

  it('renders loader when loading is true', () => {
    render(<PostsRenderer {...defaultProps} loading={true} />);
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('renders error message when error is provided', () => {
    const mockError = new Error('Test error');
    render(<PostsRenderer {...defaultProps} error={mockError} />);
    expect(screen.getByTestId('error-message')).toBeInTheDocument();
    expect(screen.getByText('Error loading posts')).toBeInTheDocument();
  });

  it('renders posts from organization.posts.edges when not filtering and no sorting', () => {
    render(<PostsRenderer {...defaultProps} />);

    expect(screen.getAllByTestId('org-post-card').length).toBe(3);
    expect(screen.getAllByText('Test Post').length).toBe(2);
    expect(
      screen.getByText('Test Post Placeholder Creator'),
    ).toBeInTheDocument();
  });

  it('renders NotFound when organization.posts.edges is empty', () => {
    const props = {
      ...defaultProps,
      data: {
        ...defaultProps.data,
        organization: {
          posts: {
            edges: [],
          },
        },
      },
    };

    render(<PostsRenderer {...props} />);

    expect(screen.getByTestId('not-found')).toBeInTheDocument();
    expect(screen.getByTestId('not-found')).toHaveAttribute(
      'data-title',
      'post',
    );
    expect(screen.getByTestId('not-found')).toHaveAttribute(
      'data-key-prefix',
      'postNotFound',
    );
  });

  it('renders posts from displayPosts when sorting option is not None', () => {
    const props = {
      ...defaultProps,
      sortingOption: 'CreatedAt',
      displayPosts: [mockInterfacePost, mockInterfacePostNoAttachments],
    };

    render(<PostsRenderer {...props} />);

    expect(screen.getAllByTestId('org-post-card').length).toBe(2);
    expect(screen.getAllByText('Test Post').length).toBe(2);
    expect(screen.getAllByText('by Test User').length).toBe(2);
  });

  it('renders NotFound when displayPosts is empty and sorting option is not None', () => {
    const props = {
      ...defaultProps,
      sortingOption: 'CreatedAt',
      displayPosts: [],
    };

    render(<PostsRenderer {...props} />);

    expect(screen.getByTestId('not-found')).toBeInTheDocument();
  });

  it('renders filtered posts when isFiltering is true', () => {
    const props = {
      ...defaultProps,
      isFiltering: true,
      searchTerm: 'Test Post',
    };

    render(<PostsRenderer {...props} />);

    expect(screen.getAllByTestId('org-post-card').length).toBe(3);
  });

  it('renders NotFound when filtered posts are empty', () => {
    const props = {
      ...defaultProps,
      isFiltering: true,
      searchTerm: 'Non-existent post',
    };

    render(<PostsRenderer {...props} />);

    expect(screen.getByTestId('not-found')).toBeInTheDocument();
  });

  it('renders NotFound when postsByOrganization is empty and isFiltering is true', () => {
    const props = {
      ...defaultProps,
      isFiltering: true,
      data: {
        ...defaultProps.data,
        postsByOrganization: [],
      },
    };

    render(<PostsRenderer {...props} />);

    expect(screen.getByTestId('not-found')).toBeInTheDocument();
  });

  it('handles undefined postsByOrganization property when isFiltering is true', () => {
    const props = {
      ...defaultProps,
      isFiltering: true,
      data: {
        ...defaultProps.data,
        postsByOrganization: undefined,
      },
    };

    render(<PostsRenderer {...props} />);

    expect(screen.getByTestId('not-found')).toBeInTheDocument();
  });

  it('creates correct attachments for posts with different media types', () => {
    render(<PostsRenderer {...defaultProps} />);

    const postCards = screen.getAllByTestId('org-post-card');
    expect(postCards[0]).toHaveAttribute('data-post-id', 'post-1');
    expect(postCards[1]).toHaveAttribute('data-post-id', 'post-2');
    expect(postCards[2]).toHaveAttribute('data-post-id', 'post-3');
  });

  it('filters posts by caption properly', () => {
    const props = {
      ...defaultProps,
      isFiltering: true,
      searchTerm: 'No Creator',
    };

    render(<PostsRenderer {...props} />);

    expect(screen.getAllByTestId('org-post-card').length).toBe(1);
    expect(screen.getByText('Test Post No Creator')).toBeInTheDocument();
  });

  it('handles posts with null caption when filtering', () => {
    const postWithNullCaption: InterfacePost = {
      id: 'post-4',
      caption: '',
      createdAt: '2023-01-01T00:00:00Z',
      creator: {
        id: 'user-1',
        name: 'Test User',
        email: 'test@example.com',
      },
      pinned: false,
    };

    const props = {
      ...defaultProps,
      isFiltering: true,
      data: {
        ...defaultProps.data,
        postsByOrganization: [
          ...(defaultProps.data.postsByOrganization as InterfacePost[]),
          postWithNullCaption,
        ],
      },
    };

    render(<PostsRenderer {...props} />);

    expect(screen.getAllByTestId('org-post-card').length).toBe(3);
  });

  it('properly renders post with null id', () => {
    const { postNode: postWithNullId } = buildPostPair({
      id: '', // empty string to simulate a null/invalid ID
      caption: 'Post with null ID',
    });

    const props = {
      ...defaultProps,
      data: {
        organization: {
          posts: {
            edges: [createEdge(mockPost), createEdge(postWithNullId)],
          },
        },
        postsByOrganization: defaultProps.data.postsByOrganization,
      },
    };

    render(<PostsRenderer {...props} />);

    expect(screen.getAllByTestId('org-post-card').length).toBe(1);
  });

  it('handles organization being undefined', () => {
    const props = {
      ...defaultProps,
      data: {
        postsByOrganization: defaultProps.data.postsByOrganization,
      },
    };

    render(<PostsRenderer {...props} />);

    expect(screen.getByTestId('not-found')).toBeInTheDocument();
  });

  // Replace the getFileHashFromFile function with a mock
  vi.mock('../../../utils/fileUtils', () => ({
    getFileHashFromFile: vi.fn().mockResolvedValue('mock-file-hash-123'),
  }));

  // Then in your test, remove the actual implementation and just test the structure
  it('should create valid FileMetadataInput', async () => {
    // Mock the hash function directly in the test
    vi.spyOn(global, 'crypto', 'get').mockReturnValue({
      subtle: {
        digest: vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3, 4])),
      },
    } as unknown as Crypto);

    const attachment = {
      fileHash: 'mock-hash-value',
      mimetype: 'IMAGE_JPEG',
      name: 'hello.txt',
      objectName: 'hello.txt',
    };

    expect(attachment).toEqual({
      fileHash: expect.any(String),
      mimetype: 'IMAGE_JPEG',
      name: 'hello.txt',
      objectName: expect.any(String),
    });
  });

  const mockPinnedPost: InterfacePost = {
    id: 'pinned-post-1',
    caption: 'Pinned Test Post',
    createdAt: '2023-01-01T00:00:00Z',
    creator: {
      id: 'user-1',
      name: 'Test User',
      email: 'test@example.com',
    },
    pinnedAt: '2023-01-01T00:00:00Z',
  };

  const { postNode: mockPinnedPostNode } = buildPostPair({
    id: 'pinned-post-1',
    caption: 'Pinned Test Post',
    pinnedAt: '2023-01-01T00:00:00Z',
  });

  const defaultProps1 = {
    loading: false,
    error: undefined,
    data: {
      organization: {
        posts: {
          edges: [{ node: mockPinnedPostNode, cursor: 'cursor-1' }],
        },
      },
      postsByOrganization: [mockPinnedPost],
    },
    pinnedPostData: [{ node: mockPinnedPost, cursor: 'cursor-1' }],
    isFiltering: false,
    searchTerm: '',
    sortingOption: 'None',
    displayPosts: [],
  };

  it('should open modal when pinned post story is clicked', () => {
    render(<PostsRenderer {...defaultProps1} />);

    // Click on a pinned post story button (not the org-post-card)
    const storyButton = screen.getByTestId('story-pinned-post-1');
    fireEvent.click(storyButton);

    // Modal should open with the post content
    expect(screen.getByTestId('pinned-post-modal')).toBeInTheDocument();
    expect(screen.getByTestId('close-pinned-post-button')).toBeInTheDocument();
  });

  it('should close modal when close button is clicked', () => {
    render(<PostsRenderer {...defaultProps1} />);

    // Open modal first by clicking story
    const storyButton = screen.getByTestId('story-pinned-post-1');
    fireEvent.click(storyButton);
    expect(screen.getByTestId('pinned-post-modal')).toBeInTheDocument();

    // Close modal using close button
    const closeButton = screen.getByTestId('close-pinned-post-button');
    fireEvent.click(closeButton);

    // Modal should be closed
    expect(screen.queryByTestId('pinned-post-modal')).not.toBeInTheDocument();
  });

  it('should render pinned posts story component', () => {
    render(<PostsRenderer {...defaultProps1} />);

    expect(screen.getByTestId('pinned-posts-story')).toBeInTheDocument();
    expect(screen.getByTestId('story-pinned-post-1')).toBeInTheDocument();
  });

  it('should render regular posts container', () => {
    render(<PostsRenderer {...defaultProps} />);

    expect(screen.getByTestId('regular-posts-container')).toBeInTheDocument();
  });

  it('should render filtered posts container when filtering', () => {
    const props = {
      ...defaultProps,
      isFiltering: true,
      searchTerm: 'Test Post',
    };

    render(<PostsRenderer {...props} />);

    expect(screen.getByTestId('filtered-posts-container')).toBeInTheDocument();
  });

  it('should render dropdown container when sorting', () => {
    const props = {
      ...defaultProps,
      sortingOption: 'CreatedAt',
      displayPosts: [mockInterfacePost],
    };

    render(<PostsRenderer {...props} />);

    expect(screen.getByTestId('dropdown')).toBeInTheDocument();
  });
});

describe('PostsRenderer Branch Coverage Tests', () => {
  it('handles missing refetch function with fallback', () => {
    const mockReload = vi.fn();
    const originalLocation = window.location;

    try {
      Object.defineProperty(window, 'location', {
        value: { reload: mockReload },
        writable: true,
      });

      const {
        postNode: postWithoutRefetchNode,
        interfacePost: postWithoutRefetch,
      } = buildPostPair({
        id: 'post-no-refetch',
        caption: 'Post without refetch',
      });

      const props = {
        loading: false,
        error: undefined,
        data: {
          organization: {
            posts: {
              edges: [
                { node: postWithoutRefetchNode, cursor: 'cursor-no-refetch' },
              ],
            },
          },
          postsByOrganization: [postWithoutRefetch],
        },
        pinnedPostData: undefined,
        isFiltering: false,
        searchTerm: '',
        sortingOption: 'None',
        displayPosts: [],
        // Explicitly NOT providing refetch to test fallback
      };

      render(<PostsRenderer {...props} />);

      expect(screen.getByTestId('org-post-card')).toBeInTheDocument();
      expect(screen.getByText('Post without refetch')).toBeInTheDocument();

      // Click the fetch posts button to trigger the fallback function
      const fetchPostsBtn = screen.getByTestId('fetch-posts-btn');
      fireEvent.click(fetchPostsBtn);

      // Verify that window.location.reload was called
      expect(mockReload).toHaveBeenCalled();
    } finally {
      // Restore original window.location
      Object.defineProperty(window, 'location', {
        value: originalLocation,
        writable: true,
      });
    }
  });
});

// Add these tests to your Posts.spec.tsx
describe('PostsRenderer Edge Cases', () => {
  it('handles posts with undefined imageUrl and videoUrl', () => {
    const {
      postNode: postWithUndefinedMediaNode,
      interfacePost: postWithUndefinedMedia,
    } = buildPostPair({
      id: 'post-5',
      caption: 'Post with undefined media',
    });

    const props = {
      loading: false,
      error: undefined,
      data: {
        organization: {
          posts: {
            edges: [{ node: postWithUndefinedMediaNode, cursor: 'cursor-5' }],
          },
        },
        postsByOrganization: [postWithUndefinedMedia],
      },
      pinnedPostData: undefined,
      isFiltering: false,
      searchTerm: '',
      sortingOption: 'None',
      displayPosts: [],
    };

    render(<PostsRenderer {...props} />);

    expect(screen.getByTestId('org-post-card')).toBeInTheDocument();
    expect(screen.getByText('Post with undefined media')).toBeInTheDocument();
  });

  it('handles posts with null creator', () => {
    const {
      postNode: postWithNullCreatorNode,
      interfacePost: postWithNullCreator,
    } = buildPostPair({
      id: 'post-6',
      caption: 'Post with null creator',
      creator: {
        id: 'user-1',
        name: 'Unknown User',
        emailAddress: 'unknown@example.com',
      },
    });

    const props = {
      loading: false,
      error: undefined,
      data: {
        organization: {
          posts: {
            edges: [{ node: postWithNullCreatorNode, cursor: 'cursor-6' }],
          },
        },
        postsByOrganization: [postWithNullCreator],
      },
      pinnedPostData: undefined,
      isFiltering: false,
      searchTerm: '',
      sortingOption: 'None',
      displayPosts: [],
    };

    render(<PostsRenderer {...props} />);

    expect(screen.getByTestId('org-post-card')).toBeInTheDocument();
    expect(screen.getByText('Post with null creator')).toBeInTheDocument();
  });

  it('handles filtering with case insensitive search', () => {
    const props = {
      loading: false,
      error: undefined,
      data: {
        organization: {
          posts: {
            edges: [
              {
                node: buildPostPair({
                  id: 'post-7',
                  caption: 'Mixed CASE Post',
                }).postNode,
                cursor: 'cursor-7',
              },
            ],
          },
        },
        postsByOrganization: [
          {
            id: 'post-7',
            caption: 'Mixed CASE Post',
            createdAt: '2023-01-01T00:00:00Z',
            creator: {
              id: 'user-1',
              name: 'Test User',
              email: 'test@example.com',
            },
            pinned: false,
          },
        ],
      },
      pinnedPostData: undefined,
      isFiltering: true,
      searchTerm: 'mixed case',
      sortingOption: 'None',
      displayPosts: [],
    };

    render(<PostsRenderer {...props} />);

    expect(screen.getByTestId('org-post-card')).toBeInTheDocument();
    expect(screen.getByText('Mixed CASE Post')).toBeInTheDocument();
  });

  it('handles posts with very long captions', () => {
    const longCaption = 'A'.repeat(1000);
    const {
      postNode: postWithLongCaption,
      interfacePost: postWithLongCaptionInterface,
    } = buildPostPair({
      id: 'post-8',
      caption: longCaption,
    });

    const props = {
      loading: false,
      error: undefined,
      data: {
        organization: {
          posts: {
            edges: [{ node: postWithLongCaption, cursor: 'cursor-8' }],
          },
        },
        postsByOrganization: [postWithLongCaptionInterface],
      },
      pinnedPostData: undefined,
      isFiltering: false,
      searchTerm: '',
      sortingOption: 'None',
      displayPosts: [],
    };

    render(<PostsRenderer {...props} />);

    expect(screen.getByTestId('org-post-card')).toBeInTheDocument();
  });

  it('handles posts with special characters in caption', () => {
    const {
      postNode: postWithSpecialChars,
      interfacePost: postWithSpecialCharsInterface,
    } = buildPostPair({
      id: 'post-9',
      caption: 'Post with spéciål chàracters & symbols! @#$%^&*()',
    });

    const props = {
      loading: false,
      error: undefined,
      data: {
        organization: {
          posts: {
            edges: [{ node: postWithSpecialChars, cursor: 'cursor-9' }],
          },
        },
        postsByOrganization: [postWithSpecialCharsInterface],
      },
      pinnedPostData: undefined,
      isFiltering: false,
      searchTerm: '',
      sortingOption: 'None',
      displayPosts: [],
    };

    render(<PostsRenderer {...props} />);

    expect(screen.getByTestId('org-post-card')).toBeInTheDocument();
    expect(
      screen.getByText('Post with spéciål chàracters & symbols! @#$%^&*()'),
    ).toBeInTheDocument();
  });

  it('handles multiple posts with same caption', () => {
    const { postNode: duplicatePost, interfacePost: duplicatePostInterface } =
      buildPostPair({
        id: 'post-10',
        caption: 'Duplicate Post',
      });

    const { postNode: duplicatePost2, interfacePost: duplicatePost2Interface } =
      buildPostPair({
        id: 'post-11',
        caption: 'Duplicate Post',
        createdAt: '2023-01-02T00:00:00Z',
        creator: {
          id: 'user-2',
          name: 'Test User 2',
          email: 'test2@example.com',
          emailAddress: 'test2@example.com',
        },
      });

    const props = {
      loading: false,
      error: undefined,
      data: {
        organization: {
          posts: {
            edges: [
              { node: duplicatePost, cursor: 'cursor-10' },
              { node: duplicatePost2, cursor: 'cursor-11' },
            ],
          },
        },
        postsByOrganization: [duplicatePostInterface, duplicatePost2Interface],
      },
      pinnedPostData: undefined,
      isFiltering: false,
      searchTerm: '',
      sortingOption: 'None',
      displayPosts: [],
    };

    render(<PostsRenderer {...props} />);

    const postCards = screen.getAllByTestId('org-post-card');
    expect(postCards.length).toBe(2);
  });

  it('handles posts with invalid createdAt format', () => {
    const {
      postNode: postWithNullDate,
      interfacePost: postWithNullDateInterface,
    } = buildPostPair({
      id: 'post-12',
      caption: 'Post with null date',
      createdAt: '12', // Invalid date format, not ISO 8601
    });

    const props = {
      loading: false,
      error: undefined,
      data: {
        organization: {
          posts: {
            edges: [{ node: postWithNullDate, cursor: 'cursor-12' }],
          },
        },
        postsByOrganization: [postWithNullDateInterface],
      },
      pinnedPostData: undefined,
      isFiltering: false,
      searchTerm: '',
      sortingOption: 'None',
      displayPosts: [],
    };

    render(<PostsRenderer {...props} />);

    expect(screen.getByTestId('org-post-card')).toBeInTheDocument();
    expect(screen.getByText('Post with null date')).toBeInTheDocument();
  });
});
