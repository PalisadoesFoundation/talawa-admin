import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MockedProvider } from '@apollo/client/testing';
import PinnedPostCard from './pinnedPostCard';
import type { InterfacePostEdge } from 'types/Post/interface';
import { DELETE_POST_MUTATION } from '../../GraphQl/Mutations/mutations';
import { TOGGLE_PINNED_POST } from '../../GraphQl/Mutations/OrganizationMutations';

// Mock react-toastify
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock useTranslation
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock useLocalStorage
const mockLocalStorage = vi.fn<(key: string) => string | null>(
  (key: string) => {
    if (key === 'role') return 'administrator';
    if (key === 'userId' || key === 'id') return 'user-1';
    return null;
  },
);

vi.mock('../../utils/useLocalstorage', () => ({
  default: () => ({
    getItem: mockLocalStorage,
  }),
}));

// Mock errorHandler
vi.mock('../../utils/errorHandler', () => ({
  errorHandler: vi.fn(),
}));

// Mock GraphQL mutations
const deletePostMock = {
  request: {
    query: DELETE_POST_MUTATION,
    variables: {
      input: {
        id: 'post-1',
      },
    },
  },
  result: {
    data: {
      deletePost: {
        id: 'post-1',
      },
    },
  },
};

const togglePinMock = {
  request: {
    query: TOGGLE_PINNED_POST,
    variables: {
      input: {
        id: 'post-1',
        isPinned: false,
      },
    },
  },
  result: {
    data: {
      togglePostPin: {
        id: 'post-1',
        pinned: false,
      },
    },
  },
};

const mockMutations = [deletePostMock, togglePinMock];

vi.mock('@mui/material', async () => {
  const actual = await vi.importActual('@mui/material');
  return actual;
});

describe('PinnedPostCard Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const mockOnStoryClick = vi.fn();

  const mockPinnedPost: InterfacePostEdge = {
    node: {
      id: 'post-1',
      caption:
        'This is a test post caption that should be displayed in the card',
      createdAt: '2024-01-15T12:00:00Z',
      imageUrl: 'https://example.com/image.jpg',
      videoUrl: null,
      pinnedAt: '2024-01-15T12:00:00Z',
      pinned: true,
      attachments: [],
      creator: {
        id: 'user-1',
        name: 'John Doe',
        avatarURL: 'https://example.com/avatar.jpg',
        email: 'user@testmail.com',
      },
      commentsCount: 5,
      upVotesCount: 10,
      downVotesCount: 2,
      hasUserVoted: { hasVoted: false, voteType: null },
    },
    cursor: 'cursor-1',
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Reset localStorage mock to default values
    mockLocalStorage.mockImplementation((key: string) => {
      if (key === 'role') return 'administrator';
      if (key === 'userId' || key === 'id') return 'user-1';
      return null;
    });
  });

  describe('Rendering', () => {
    it('renders the pinned post card with all essential elements', () => {
      render(
        <MockedProvider>
          <PinnedPostCard
            pinnedPost={mockPinnedPost}
            onStoryClick={mockOnStoryClick}
          />
        </MockedProvider>,
      );

      // Check creator name
      expect(screen.getByText('John Doe')).toBeInTheDocument();

      // Check caption
      expect(
        screen.getAllByText(
          'This is a test post caption that should be displayed in the card',
        ),
      ).toBeTruthy();

      // Check date
      expect(screen.getByText(/Posted on:/)).toBeInTheDocument();
      expect(screen.getByText(/15th Jan 2024/)).toBeInTheDocument();

      // Check view button
      expect(screen.getByRole('button', { name: /view/i })).toBeInTheDocument();

      // Check image
      const image = screen.getByAltText('Post image');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
    });

    it('renders default image when imageUrl is null', () => {
      const postWithoutImage: InterfacePostEdge = {
        ...mockPinnedPost,
        node: {
          ...mockPinnedPost.node,
          imageUrl: null,
        },
      };

      render(
        <MockedProvider mocks={mockMutations}>
          <PinnedPostCard
            pinnedPost={postWithoutImage}
            onStoryClick={mockOnStoryClick}
          />
        </MockedProvider>,
      );

      const image = screen.getByAltText('Post image');
      expect(image).toHaveAttribute('src', '/src/assets/images/defaultImg.png');
    });

    it('renders "Untitled Post" when caption is null', () => {
      const postWithoutCaption: InterfacePostEdge = {
        ...mockPinnedPost,
        node: {
          ...mockPinnedPost.node,
          caption: null,
        },
      };

      render(
        <MockedProvider mocks={mockMutations}>
          <PinnedPostCard
            pinnedPost={postWithoutCaption}
            onStoryClick={mockOnStoryClick}
          />
        </MockedProvider>,
      );

      expect(screen.getByText('Untitled Post')).toBeInTheDocument();
      expect(screen.getByText('No content available')).toBeInTheDocument();
    });

    it('renders creator name first letter when avatarURL is null', () => {
      const postWithoutAvatar: InterfacePostEdge = {
        ...mockPinnedPost,
        node: {
          ...mockPinnedPost.node,
          creator: {
            id: mockPinnedPost.node.creator?.id || '',
            name: mockPinnedPost.node.creator?.name || '',
            email: mockPinnedPost.node.creator?.email || '',
            avatarURL: undefined,
          },
        },
      };

      render(
        <MockedProvider mocks={mockMutations}>
          <PinnedPostCard
            pinnedPost={postWithoutAvatar}
            onStoryClick={mockOnStoryClick}
          />
        </MockedProvider>,
      );

      expect(screen.getByText('J')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('calls onStoryClick with post node when View button is clicked', () => {
      render(
        <MockedProvider mocks={mockMutations}>
          <PinnedPostCard
            pinnedPost={mockPinnedPost}
            onStoryClick={mockOnStoryClick}
          />
        </MockedProvider>,
      );

      const viewButton = screen.getByRole('button', { name: /view/i });
      fireEvent.click(viewButton);

      expect(mockOnStoryClick).toHaveBeenCalledTimes(1);
      expect(mockOnStoryClick).toHaveBeenCalledWith(mockPinnedPost.node);
    });

    it('handles delete post functionality', async () => {
      const mockOnPostUpdate = vi.fn();

      render(
        <MockedProvider mocks={mockMutations}>
          <PinnedPostCard
            pinnedPost={mockPinnedPost}
            onStoryClick={mockOnStoryClick}
            onPostUpdate={mockOnPostUpdate}
          />
        </MockedProvider>,
      );

      const moreOptionsButton = screen.getByTestId('more-options-button');
      fireEvent.click(moreOptionsButton);

      const deleteMenuItem = screen.getByTestId('delete-post-menu-item');
      fireEvent.click(deleteMenuItem);

      await waitFor(() => {
        expect(mockOnPostUpdate).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Permission-based rendering', () => {
    it('shows only delete option for post creator who is not admin', () => {
      // Mock non-admin user who is post creator
      mockLocalStorage.mockImplementation((key: string) => {
        if (key === 'role') return 'user'; // Non-admin
        if (key === 'userId' || key === 'id') return 'user-1'; // Post creator
        return null;
      });

      render(
        <MockedProvider mocks={mockMutations}>
          <PinnedPostCard
            pinnedPost={mockPinnedPost}
            onStoryClick={mockOnStoryClick}
          />
        </MockedProvider>,
      );

      const moreBtn = screen.getByTestId('more-options-button');
      fireEvent.click(moreBtn);

      // Should not show pin option for non-admin
      expect(
        screen.queryByTestId('pin-post-menu-item'),
      ).not.toBeInTheDocument();
      // Should show delete option for post creator
      expect(screen.getByTestId('delete-post-menu-item')).toBeInTheDocument();
    });

    it('handles userId fallback correctly', () => {
      // Mock scenario where userId is null but id exists
      mockLocalStorage.mockImplementation((key: string) => {
        if (key === 'role') return 'administrator';
        if (key === 'userId') return null; // userId is null
        if (key === 'id') return 'user-1'; // but id exists
        return null;
      });

      render(
        <MockedProvider mocks={mockMutations}>
          <PinnedPostCard
            pinnedPost={mockPinnedPost}
            onStoryClick={mockOnStoryClick}
          />
        </MockedProvider>,
      );

      const moreOptBtn = screen.getByTestId('more-options-button');
      fireEvent.click(moreOptBtn);

      // Should still work correctly with id fallback
      expect(screen.getByTestId('delete-post-menu-item')).toBeInTheDocument();
    });

    it('handles onPostUpdate not provided', async () => {
      render(
        <MockedProvider mocks={mockMutations}>
          <PinnedPostCard
            pinnedPost={mockPinnedPost}
            onStoryClick={mockOnStoryClick}
            // onPostUpdate not provided
          />
        </MockedProvider>,
      );

      const moreOptionsButton1 = screen.getByTestId('more-options-button');
      fireEvent.click(moreOptionsButton1);

      const deleteMenuItem = screen.getByTestId('delete-post-menu-item');
      fireEvent.click(deleteMenuItem);

      // Should not crash when onPostUpdate is not provided
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('handles errors in pin/unpin operation', async () => {
      const errorMock = {
        request: {
          query: TOGGLE_PINNED_POST,
          variables: {
            input: {
              id: 'post-1',
              title: 'Test Post',
            },
          },
        },
        error: new Error('Pin failed'),
      };

      render(
        <MockedProvider mocks={[errorMock]}>
          <PinnedPostCard
            pinnedPost={mockPinnedPost}
            onStoryClick={mockOnStoryClick}
          />
        </MockedProvider>,
      );

      const moreOptionsButton3 = screen.getByTestId('more-options-button');
      fireEvent.click(moreOptionsButton3);

      const pinMenuItem = screen.getByTestId('pin-post-menu-item');
      fireEvent.click(pinMenuItem);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });
    });

    it('handles toggle pin for unpinned post', async () => {
      const mockOnPostUpdate = vi.fn();

      // Create an unpinned post to test the other branch of the ternary operator
      const unpinnedPost: InterfacePostEdge = {
        ...mockPinnedPost,
        node: {
          ...mockPinnedPost.node,
          pinned: false,
          pinnedAt: null,
        },
      };

      const unpinnedTogglePinMock = {
        request: {
          query: TOGGLE_PINNED_POST,
          variables: {
            input: {
              id: 'post-1',
              isPinned: true, // Since post is unpinned, we toggle to pinned
            },
          },
        },
        result: {
          data: {
            togglePostPin: {
              id: 'post-1',
              pinned: true,
              pinnedAt: '2024-01-15T12:00:00Z',
            },
          },
        },
      };

      render(
        <MockedProvider mocks={[unpinnedTogglePinMock]}>
          <PinnedPostCard
            pinnedPost={unpinnedPost}
            onStoryClick={mockOnStoryClick}
            onPostUpdate={mockOnPostUpdate}
          />
        </MockedProvider>,
      );

      const moreOptionsButton = screen.getByTestId('more-options-button');
      fireEvent.click(moreOptionsButton);

      const pinMenuItem = screen.getByTestId('pin-post-menu-item');
      fireEvent.click(pinMenuItem);

      await waitFor(() => {
        expect(mockOnPostUpdate).toHaveBeenCalledTimes(1);
      });
    });

    it('handles toggle pin without onPostUpdate callback', async () => {
      render(
        <MockedProvider mocks={mockMutations}>
          <PinnedPostCard
            pinnedPost={mockPinnedPost}
            onStoryClick={mockOnStoryClick}
            // No onPostUpdate provided to test the conditional branch
          />
        </MockedProvider>,
      );

      const moreOptionsButton = screen.getByTestId('more-options-button');
      fireEvent.click(moreOptionsButton);

      const pinMenuItem = screen.getByTestId('pin-post-menu-item');
      fireEvent.click(pinMenuItem);

      // Just wait for the operation to complete - no callback should be triggered
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });
    });

    it('handles errors in delete operation', async () => {
      const errorMock = {
        request: {
          query: DELETE_POST_MUTATION,
          variables: {
            input: {
              id: 'post-1',
            },
          },
        },
        error: new Error('Delete failed'),
      };

      render(
        <MockedProvider mocks={[errorMock]}>
          <PinnedPostCard
            pinnedPost={mockPinnedPost}
            onStoryClick={mockOnStoryClick}
          />
        </MockedProvider>,
      );

      const moreOptionsButton4 = screen.getByTestId('more-options-button');
      fireEvent.click(moreOptionsButton4);

      const deleteMenuItem = screen.getByTestId('delete-post-menu-item');
      fireEvent.click(deleteMenuItem);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });
    });
  });
});
