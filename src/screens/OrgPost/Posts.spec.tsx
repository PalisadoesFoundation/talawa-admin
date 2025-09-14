import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
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

describe('PostsRenderer', () => {
  const mockPost: InterfacePost = {
    id: 'post-1',
    caption: 'Test Post',
    createdAt: '2023-01-01T00:00:00Z',
    creator: {
      id: 'user-1',
      avatarURL: 'http://test-avatar.jpg',
    },
    imageUrl: 'test-image.jpg',
    videoUrl: 'test-video.mp4',
    pinned: true,
  };

  const mockPostNoAttachments: InterfacePost = {
    id: 'post-2',
    caption: 'Test Post No Attachments',
    createdAt: '2023-01-01T00:00:00Z',
    creator: {
      id: 'user-1',
      avatarURL: 'http://test-avatar.jpg',
    },
    pinned: false,
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
    expect(screen.getByText('Error loading posts')).toBeInTheDocument();
  });

  it('renders posts from organization.posts.edges when not filtering and no sorting', () => {
    render(<PostsRenderer {...defaultProps} />);

    expect(screen.getAllByTestId('org-post-card').length).toBe(3);
    expect(screen.getByText('Test Post')).toBeInTheDocument();
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
    expect(screen.getByText('Test Post')).toBeInTheDocument();
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
      creator: { id: 'user-1', avatarURL: 'http://test-avatar.jpg' },
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
      creator: { id: 'user-1', avatarURL: 'http://test-avatar.jpg' },
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
});
