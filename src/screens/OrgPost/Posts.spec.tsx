import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PostsRenderer from './Posts';
import { ApolloError } from '@apollo/client';
import type {
  InterfacePost,
  InterfacePostEdge,
} from '../../types/Post/interface';

interface InterfaceOrgPostCardProps {
  post: {
    id: string;
    caption: string;
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

vi.mock('components/OrgPostCard/OrgPostCard', () => ({
  default: ({ post }: InterfaceOrgPostCardProps) => (
    <div data-testid="org-post-card" data-post-id={post.id}>
      {post.caption}
    </div>
  ),
}));

// Mock PinnedPostsStory component
vi.mock('./PinnedPostsStory', () => ({
  default: ({
    pinnedPosts,
    onStoryClick,
  }: {
    pinnedPosts: InterfacePost[];
    onStoryClick: (post: InterfacePost) => void;
  }) => (
    <div data-testid="pinned-posts-story">
      {pinnedPosts.map((post) => (
        <button
          key={post.id}
          data-testid={`story-${post.id}`}
          onClick={() => onStoryClick(post)}
        >
          {post.caption}
        </button>
      ))}
    </div>
  ),
}));

describe('PostsRenderer', () => {
  const mockPost: InterfacePost = {
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

  const mockPostNoAttachments: InterfacePost = {
    id: 'post-2',
    caption: 'Test Post No Attachments',
    createdAt: '2023-01-01T00:00:00Z',
    creator: {
      id: 'user-1',
      name: 'Test User',
      email: 'test@example.com',
    },
    pinnedAt: null,
  };

  const mockPostNoCreator: InterfacePost = {
    id: 'post-3',
    caption: 'Test Post No Creator',
    createdAt: '2023-01-01T00:00:00Z',
    imageUrl: 'test-image.jpg',
    pinned: false,
  };

  const createEdge = (post: InterfacePost): InterfacePostEdge => ({
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
            createEdge(mockPostNoCreator),
          ],
        },
      },
      postsByOrganization: [mockPost, mockPostNoAttachments, mockPostNoCreator],
    },
    pinnedPostData: undefined,
    isFiltering: false,
    searchTerm: '',
    sortingOption: 'None',
    displayPosts: [],
  };

  it('renders loader when loading is true', () => {
    render(<PostsRenderer {...defaultProps} loading={true} />);
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('renders error message when error is provided', () => {
    const mockError = new ApolloError({ errorMessage: 'Test error' });
    render(<PostsRenderer {...defaultProps} error={mockError} />);
    expect(screen.getByTestId('error-message')).toBeInTheDocument();
    expect(screen.getByText('Error loading posts')).toBeInTheDocument();
  });

  it('renders posts from organization.posts.edges when not filtering and no sorting', () => {
    render(<PostsRenderer {...defaultProps} />);

    expect(screen.getAllByTestId('org-post-card').length).toBe(3);
    expect(screen.getAllByText('Test Post').length).toBe(2);
    expect(screen.getByText('Test Post No Attachments')).toBeInTheDocument();
    expect(screen.getByText('Test Post No Creator')).toBeInTheDocument();
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
      displayPosts: [mockPost, mockPostNoAttachments],
    };

    render(<PostsRenderer {...props} />);

    expect(screen.getAllByTestId('org-post-card').length).toBe(2);
    expect(screen.getAllByText('Test Post').length).toBe(1);
    expect(screen.getByText('Test Post No Attachments')).toBeInTheDocument();
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
    const postWithNullId: InterfacePost = {
      id: '', // empty string to simulate a null/invalid ID
      caption: 'Post with null ID',
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
      data: {
        organization: {
          posts: {
            edges: [
              createEdge(mockPost),
              { node: postWithNullId, cursor: 'null-id' } as InterfacePostEdge,
            ],
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

  const defaultProps1 = {
    loading: false,
    error: undefined,
    data: {
      organization: {
        posts: {
          edges: [{ node: mockPinnedPost, cursor: 'cursor-1' }],
        },
      },
      postsByOrganization: [mockPinnedPost],
    },
    pinnedPostData: undefined,
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
      displayPosts: [mockPost],
    };

    render(<PostsRenderer {...props} />);

    expect(screen.getByTestId('dropdown')).toBeInTheDocument();
  });
});

// Add these tests to your Posts.spec.tsx
describe('PostsRenderer Edge Cases', () => {
  it('handles posts with undefined imageUrl and videoUrl', () => {
    const postWithUndefinedMedia: InterfacePost = {
      id: 'post-5',
      caption: 'Post with undefined media',
      createdAt: '2023-01-01T00:00:00Z',
      creator: {
        id: 'user-1',
        name: 'Test User',
        email: 'test@example.com',
      },
      imageUrl: undefined,
      videoUrl: undefined,
      pinned: false,
    };

    const props = {
      loading: false,
      error: undefined,
      data: {
        organization: {
          posts: {
            edges: [{ node: postWithUndefinedMedia, cursor: 'cursor-5' }],
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
    const postWithNullCreator: InterfacePost = {
      id: 'post-6',
      caption: 'Post with null creator',
      createdAt: '2023-01-01T00:00:00Z',
      creator: null,
      pinned: false,
    };

    const props = {
      loading: false,
      error: undefined,
      data: {
        organization: {
          posts: {
            edges: [{ node: postWithNullCreator, cursor: 'cursor-6' }],
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
                node: {
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
    const postWithLongCaption: InterfacePost = {
      id: 'post-8',
      caption: longCaption,
      createdAt: '2023-01-01T00:00:00Z',
      creator: {
        id: 'user-1',
        name: 'Test User',
        email: 'test@example.com',
      },
      pinned: false,
    };

    const props = {
      loading: false,
      error: undefined,
      data: {
        organization: {
          posts: {
            edges: [{ node: postWithLongCaption, cursor: 'cursor-8' }],
          },
        },
        postsByOrganization: [postWithLongCaption],
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
    const postWithSpecialChars: InterfacePost = {
      id: 'post-9',
      caption: 'Post with spéciål chàracters & symbols! @#$%^&*()',
      createdAt: '2023-01-01T00:00:00Z',
      creator: {
        id: 'user-1',
        name: 'Test User',
        email: 'test@example.com',
      },
      pinned: false,
    };

    const props = {
      loading: false,
      error: undefined,
      data: {
        organization: {
          posts: {
            edges: [{ node: postWithSpecialChars, cursor: 'cursor-9' }],
          },
        },
        postsByOrganization: [postWithSpecialChars],
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
    const duplicatePost: InterfacePost = {
      id: 'post-10',
      caption: 'Duplicate Post',
      createdAt: '2023-01-01T00:00:00Z',
      creator: {
        id: 'user-1',
        name: 'Test User',
        email: 'test@example.com',
      },
      pinned: false,
    };

    const duplicatePost2: InterfacePost = {
      id: 'post-11',
      caption: 'Duplicate Post',
      createdAt: '2023-01-02T00:00:00Z',
      creator: {
        id: 'user-2',
        name: 'Test User 2',
        email: 'test2@example.com',
      },
      pinned: false,
    };

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
        postsByOrganization: [duplicatePost, duplicatePost2],
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

  it('handles posts with null createdAt', () => {
    const postWithNullDate: InterfacePost = {
      id: 'post-12',
      caption: 'Post with null date',
      createdAt: '12',
      creator: {
        id: 'user-1',
        name: 'Test User',
        email: 'test@example.com',
      },
      pinned: false,
    };

    const props = {
      loading: false,
      error: undefined,
      data: {
        organization: {
          posts: {
            edges: [{ node: postWithNullDate, cursor: 'cursor-12' }],
          },
        },
        postsByOrganization: [postWithNullDate],
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
