import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import PinnedPostsLayout from './pinnedPostsLayout';
import { InterfacePostEdge, InterfacePost } from 'types/Post/interface';

// Mock the PinnedPostCard component
vi.mock('./pinnedPostCard', () => ({
  default: ({
    pinnedPost,
    onStoryClick,
  }: {
    pinnedPost: InterfacePostEdge;
    onStoryClick: (post: InterfacePost) => void;
  }) => (
    <div
      data-testid={`pinned-post-card-${pinnedPost.node.id}`}
      onClick={() => onStoryClick(pinnedPost.node)}
    >
      <div data-testid="post-title">
        {pinnedPost.node.caption || 'Untitled'}
      </div>
      <div data-testid="creator-name">
        {pinnedPost.node.creator?.name || 'Anonymous'}
      </div>
    </div>
  ),
}));

// Mock the react-multi-carousel component
vi.mock('react-multi-carousel', () => ({
  default: ({
    children,
    responsive,
    swipeable,
    draggable,
    showDots,
    infinite,
    keyBoardControl,
  }: {
    children?: React.ReactNode;
    responsive?: Record<string, unknown>;
    swipeable?: boolean;
    draggable?: boolean;
    showDots?: boolean;
    infinite?: boolean;
    keyBoardControl?: boolean;
  }) => (
    <div
      data-testid="carousel-container"
      data-responsive={JSON.stringify(responsive)}
      data-swipeable={swipeable}
      data-draggable={draggable}
      data-show-dots={showDots}
      data-infinite={infinite}
      data-keyboard-control={keyBoardControl}
    >
      {children}
    </div>
  ),
}));

// Mock CSS imports
vi.mock('react-multi-carousel/lib/styles.css', () => ({}));
vi.mock('./postStyles.module.css', () => ({
  default: {},
}));

// Mock console.log to test it's being called
const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

describe('PinnedPostsLayout', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const mockOnStoryClick = vi.fn();

  const mockPinnedPosts: InterfacePostEdge[] = [
    {
      node: {
        id: '1',
        caption: 'First pinned post',
        createdAt: '2023-06-15T10:30:00Z',
        creator: {
          id: 'user1',
          name: 'John Doe',
          email: 'john@example.com',
        },
        hasUserVoted: {
          hasVoted: false,
          voteType: null,
        },
      } as InterfacePost,
      cursor: 'cursor1',
    },
    {
      node: {
        id: '2',
        caption: 'Second pinned post',
        createdAt: '2023-06-16T14:45:00Z',
        creator: {
          id: 'user2',
          name: 'Jane Smith',
          email: 'jane@example.com',
        },
        hasUserVoted: {
          hasVoted: true,
          voteType: 'up_vote',
        },
      } as InterfacePost,
      cursor: 'cursor2',
    },
  ];

  const mockPostWithoutId: InterfacePostEdge[] = [
    {
      node: {
        id: '',
        caption: 'Post without ID',
        createdAt: '2023-06-17T09:15:00Z',
        creator: {
          id: 'user3',
          name: 'Bob Johnson',
          email: 'bob@example.com',
        },
        hasUserVoted: {
          hasVoted: false,
          voteType: null,
        },
      } as InterfacePost,
      cursor: 'cursor3',
    },
  ];

  const emptyPinnedPosts: InterfacePostEdge[] = [];

  beforeEach(() => {
    vi.clearAllMocks();
    consoleSpy.mockClear();
  });

  describe('Component Rendering', () => {
    it('renders the component with pinned posts', () => {
      render(
        <PinnedPostsLayout
          pinnedPosts={mockPinnedPosts}
          onStoryClick={mockOnStoryClick}
        />,
      );

      expect(screen.getByTestId('carousel-container')).toBeInTheDocument();
      expect(screen.getByTestId('pinned-post-card-1')).toBeInTheDocument();
      expect(screen.getByTestId('pinned-post-card-2')).toBeInTheDocument();
    });

    it('renders empty carousel when no pinned posts', () => {
      render(
        <PinnedPostsLayout
          pinnedPosts={emptyPinnedPosts}
          onStoryClick={mockOnStoryClick}
        />,
      );

      expect(screen.getByTestId('carousel-container')).toBeInTheDocument();
      expect(screen.queryByTestId(/pinned-post-card/)).not.toBeInTheDocument();
    });

    it('handles posts without IDs using index as fallback key', () => {
      render(
        <PinnedPostsLayout
          pinnedPosts={mockPostWithoutId}
          onStoryClick={mockOnStoryClick}
        />,
      );

      expect(screen.getByTestId('carousel-container')).toBeInTheDocument();
      expect(screen.getByTestId('pinned-post-card-')).toBeInTheDocument();
    });
  });

  describe('Carousel Configuration', () => {
    it('configures carousel with correct responsive settings', () => {
      render(
        <PinnedPostsLayout
          pinnedPosts={mockPinnedPosts}
          onStoryClick={mockOnStoryClick}
        />,
      );

      const carousel = screen.getByTestId('carousel-container');
      const responsiveData = JSON.parse(
        carousel.getAttribute('data-responsive') || '{}',
      );

      expect(responsiveData).toEqual({
        desktop: {
          breakpoint: { max: 3000, min: 1024 },
          items: 3.5,
          slidesToSlide: 2,
        },
        tablet: {
          breakpoint: { max: 1024, min: 464 },
          items: 2,
          slidesToSlide: 1,
        },
        mobile: {
          breakpoint: { max: 464, min: 0 },
          items: 1,
          slidesToSlide: 1,
        },
      });
    });

    it('configures carousel with correct boolean properties', () => {
      render(
        <PinnedPostsLayout
          pinnedPosts={mockPinnedPosts}
          onStoryClick={mockOnStoryClick}
        />,
      );

      const carousel = screen.getByTestId('carousel-container');

      expect(carousel).toHaveAttribute('data-swipeable', 'true');
      expect(carousel).toHaveAttribute('data-draggable', 'true');
      expect(carousel).toHaveAttribute('data-show-dots', 'false');
      expect(carousel).toHaveAttribute('data-infinite', 'false');
      expect(carousel).toHaveAttribute('data-keyboard-control', 'true');
    });
  });
});
