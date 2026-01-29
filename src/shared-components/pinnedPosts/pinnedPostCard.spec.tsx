import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MockedProvider } from '@apollo/client/testing';
import PinnedPostCard from './pinnedPostCard';
import type { InterfacePostEdge } from 'types/Post/interface';
import { DELETE_POST_MUTATION } from '../../GraphQl/Mutations/mutations';
import { TOGGLE_PINNED_POST } from '../../GraphQl/Mutations/OrganizationMutations';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

// Mock useTranslation
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { date?: string }) => {
      const translations: Record<string, string> = {
        postedOn: options?.date
          ? `Posted on: ${options.date}`
          : 'Posted on: {{date}}',
        untitledPost: 'Untitled Post',
        noContentAvailable: 'No content available',
        view: 'view',
        postDeletedSuccess: 'Post deleted successfully',
        postPinnedSuccess: 'Post pinned successfully',
        postUnpinnedSuccess: 'Post unpinned successfully',
        editPost: 'Edit Post',
        pinPost: 'Pin Post',
        unpinPost: 'Unpin Post',
        moreOptions: 'more options',
      };
      return translations[key] || key;
    },
  }),
  initReactI18next: {
    type: '3rdParty',
    init: vi.fn(),
  },
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
      createdAt: dayjs.utc().subtract(14, 'days').toISOString(),
      pinnedAt: dayjs.utc().subtract(14, 'days').toISOString(),
      pinned: true,
      attachments: [
        {
          mimeType: 'image/jpeg',
        },
      ],
      attachmentURL: 'https://example.com/attachment.jpg',
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

      // Check date - use pattern that matches formatted date display
      expect(screen.getByText(/Posted on:/)).toBeInTheDocument();

      // Check view button
      expect(screen.getByRole('button', { name: /view/i })).toBeInTheDocument();

      // Check image
      const image = screen.getByAltText('postImage');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute(
        'src',
        'https://example.com/attachment.jpg',
      );
    });
    it('renders the pinned post card with video', () => {
      render(
        <MockedProvider>
          <PinnedPostCard
            pinnedPost={{
              ...mockPinnedPost,
              node: {
                ...mockPinnedPost.node,
                attachmentURL: 'https://example.com/attachment.mp4',
                attachments: [
                  {
                    mimeType: 'video/mp4',
                  },
                ],
              },
            }}
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

      // Check date - use pattern that matches formatted date display
      expect(screen.getByText(/Posted on:/)).toBeInTheDocument();

      // Check view button
      expect(screen.getByRole('button', { name: /view/i })).toBeInTheDocument();

      // Check video element
      const video = screen.getByTestId('post-video');
      expect(video).toBeInTheDocument();
      const source = video.querySelector('source');
      expect(source).toHaveAttribute(
        'src',
        'https://example.com/attachment.mp4',
      );
    });

    it('renders default image when imageUrl is undefined', () => {
      const postWithoutImage: InterfacePostEdge = {
        ...mockPinnedPost,
        node: {
          ...mockPinnedPost.node,
          attachmentURL: undefined,
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

      const image = screen.getByAltText('postImage');
      expect(image).toHaveAttribute('src', '/src/assets/images/defaultImg.png');
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
    it('calls onStoryClick with post node when View button is clicked', async () => {
      render(
        <MockedProvider mocks={mockMutations}>
          <PinnedPostCard
            pinnedPost={mockPinnedPost}
            onStoryClick={mockOnStoryClick}
          />
        </MockedProvider>,
      );

      const user = userEvent.setup();
      const viewButton = screen.getByRole('button', { name: /view/i });
      await user.click(viewButton);

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

      const user = userEvent.setup();
      const moreOptionsButton = screen.getByTestId('more-options-button');
      await user.click(moreOptionsButton);

      const deleteMenuItem = screen.getByTestId('delete-post-menu-item');
      await user.click(deleteMenuItem);

      await waitFor(() => {
        expect(mockOnPostUpdate).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Permission-based rendering', () => {
    it('shows only delete option for post creator who is not admin', async () => {
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

      const user = userEvent.setup();
      const moreBtn = screen.getByTestId('more-options-button');
      await user.click(moreBtn);

      // Should not show pin option for non-admin
      expect(
        screen.queryByTestId('pin-post-menu-item'),
      ).not.toBeInTheDocument();
      // Should show delete option for post creator
      expect(screen.getByTestId('delete-post-menu-item')).toBeInTheDocument();
    });

    it('handles userId fallback correctly', async () => {
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

      const user = userEvent.setup();
      const moreOptBtn = screen.getByTestId('more-options-button');
      await user.click(moreOptBtn);

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

      const user = userEvent.setup();
      const moreOptionsButton1 = screen.getByTestId('more-options-button');
      await user.click(moreOptionsButton1);

      const deleteMenuItem = screen.getByTestId('delete-post-menu-item');
      await user.click(deleteMenuItem);

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

      const user = userEvent.setup();
      const moreOptionsButton3 = screen.getByTestId('more-options-button');
      await user.click(moreOptionsButton3);

      const pinMenuItem = screen.getByTestId('pin-post-menu-item');
      await user.click(pinMenuItem);

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
              pinnedAt: dayjs().subtract(14, 'days').toISOString(),
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

      const user = userEvent.setup();
      const moreOptionsButton = screen.getByTestId('more-options-button');
      await user.click(moreOptionsButton);

      const pinMenuItem = screen.getByTestId('pin-post-menu-item');
      await user.click(pinMenuItem);

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

      const user = userEvent.setup();
      const moreOptionsButton = screen.getByTestId('more-options-button');
      await user.click(moreOptionsButton);

      const pinMenuItem = screen.getByTestId('pin-post-menu-item');
      await user.click(pinMenuItem);

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

      const user = userEvent.setup();
      const moreOptionsButton4 = screen.getByTestId('more-options-button');
      await user.click(moreOptionsButton4);

      const deleteMenuItem = screen.getByTestId('delete-post-menu-item');
      await user.click(deleteMenuItem);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });
    });
  });
});
