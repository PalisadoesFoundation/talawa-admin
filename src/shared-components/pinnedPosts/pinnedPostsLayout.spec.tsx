import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MockedProvider } from '@apollo/client/testing';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from '../../utils/i18nForTest';
import PinnedPostsLayout from './pinnedPostsLayout';
import type { InterfacePostEdge } from 'types/Post/interface';
import { TOGGLE_PINNED_POST } from '../../GraphQl/Mutations/OrganizationMutations';
import { DELETE_POST_MUTATION } from '../../GraphQl/Mutations/mutations';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
dayjs.extend(utc);

vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
    error: vi.fn(),
    success: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
    dismiss: vi.fn(),
  },
}));

// Mock useLocalStorage
const mockGetItem = vi.fn();
vi.mock('../../utils/useLocalstorage', () => ({
  default: () => ({
    getItem: mockGetItem,
  }),
}));

// Reset mock before each test
beforeEach(() => {
  mockGetItem.mockImplementation((key: string) => {
    if (key === 'role') return 'administrator';
    if (key === 'userId' || key === 'id') return 'user-1';
    return null;
  });
});

// Mock errorHandler
vi.mock('../../utils/errorHandler', () => ({
  errorHandler: vi.fn(),
}));

const mockOnStoryClick = vi.fn();

const createMockPinnedPost = (
  id: string,
  caption: string,
  creatorName = 'John Doe',
  creatorId = 'user-1',
): InterfacePostEdge => ({
  node: {
    id,
    caption,
    // Use dynamic dates to avoid test staleness
    createdAt: dayjs.utc().subtract(14, 'days').toISOString(),
    attachmentURL: 'https://example.com/image.jpg',
    pinnedAt: dayjs.utc().subtract(14, 'days').toISOString(),
    pinned: true,
    attachments: [
      {
        mimeType: 'image/jpeg',
      },
    ],
    creator: {
      id: creatorId,
      name: creatorName,
      avatarURL: 'https://example.com/avatar.jpg',
      email: 'user@testmail.com',
    },
    commentsCount: 5,
    upVotesCount: 10,
    downVotesCount: 2,
    hasUserVoted: { hasVoted: false, voteType: null },
  },
  cursor: `cursor-${id}`,
});

const mockPinnedPosts: InterfacePostEdge[] = [
  createMockPinnedPost('post-1', 'First pinned post'),
  createMockPinnedPost('post-2', 'Second pinned post'),
  createMockPinnedPost('post-3', 'Third pinned post'),
];

// GraphQL mocks for mutations
const TOGGLE_PINNED_POST_MOCK = {
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
      updatePost: {
        id: 'post-1',
        caption: 'First pinned post',
        pinnedAt: null,
        attachments: [],
        __typename: 'Post',
      },
    },
  },
};

const DELETE_POST_MOCK = {
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
        __typename: 'Post',
      },
    },
  },
};

describe('PinnedPostsLayout Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the pinned posts layout container', () => {
      render(
        <MockedProvider>
          <I18nextProvider i18n={i18nForTest}>
            <PinnedPostsLayout
              pinnedPosts={mockPinnedPosts}
              onStoryClick={mockOnStoryClick}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      expect(screen.getByTestId('pinned-posts-layout')).toBeInTheDocument();
      expect(screen.getByTestId('scroll-container')).toBeInTheDocument();
    });

    it('renders all pinned post cards with their captions', () => {
      render(
        <MockedProvider>
          <I18nextProvider i18n={i18nForTest}>
            <PinnedPostsLayout
              pinnedPosts={mockPinnedPosts}
              onStoryClick={mockOnStoryClick}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      // Check that all post captions are rendered
      expect(screen.getAllByText('First pinned post').length).toBeGreaterThan(
        0,
      );
      expect(screen.getAllByText('Second pinned post').length).toBeGreaterThan(
        0,
      );
      expect(screen.getAllByText('Third pinned post').length).toBeGreaterThan(
        0,
      );
    });

    it('renders creator names for all posts', () => {
      render(
        <MockedProvider>
          <I18nextProvider i18n={i18nForTest}>
            <PinnedPostsLayout
              pinnedPosts={mockPinnedPosts}
              onStoryClick={mockOnStoryClick}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      // All posts have the same creator 'John Doe'
      const creatorNames = screen.getAllByText('John Doe');
      expect(creatorNames.length).toBe(3);
    });

    it('renders view buttons for all posts', () => {
      render(
        <MockedProvider>
          <I18nextProvider i18n={i18nForTest}>
            <PinnedPostsLayout
              pinnedPosts={mockPinnedPosts}
              onStoryClick={mockOnStoryClick}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      const viewButtons = screen.getAllByTestId('view-post-btn');
      expect(viewButtons.length).toBe(3);
    });

    it('renders empty state when no pinned posts', () => {
      render(
        <MockedProvider>
          <I18nextProvider i18n={i18nForTest}>
            <PinnedPostsLayout
              pinnedPosts={[]}
              onStoryClick={mockOnStoryClick}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      expect(screen.getByTestId('pinned-posts-layout')).toBeInTheDocument();
      expect(screen.queryByText('First pinned post')).not.toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('calls onStoryClick when view button is clicked', () => {
      render(
        <MockedProvider>
          <I18nextProvider i18n={i18nForTest}>
            <PinnedPostsLayout
              pinnedPosts={mockPinnedPosts}
              onStoryClick={mockOnStoryClick}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      const viewButtons = screen.getAllByTestId('view-post-btn');
      fireEvent.click(viewButtons[0]);

      expect(mockOnStoryClick).toHaveBeenCalledWith(mockPinnedPosts[0].node);
    });

    it('shows more options menu when more options button is clicked', async () => {
      render(
        <MockedProvider>
          <I18nextProvider i18n={i18nForTest}>
            <PinnedPostsLayout
              pinnedPosts={mockPinnedPosts}
              onStoryClick={mockOnStoryClick}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      const moreOptionsButtons = screen.getAllByTestId('more-options-button');
      fireEvent.click(moreOptionsButtons[0]);

      await waitFor(() => {
        expect(screen.getByTestId('pin-post-menu-item')).toBeInTheDocument();
      });
    });
  });

  describe('Navigation Buttons', () => {
    let scrollByMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      scrollByMock = vi.fn();
    });

    it('calls scrollBy when left navigation button is clicked', async () => {
      render(
        <MockedProvider>
          <I18nextProvider i18n={i18nForTest}>
            <PinnedPostsLayout
              pinnedPosts={mockPinnedPosts}
              onStoryClick={mockOnStoryClick}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      const scrollContainer = screen.getByTestId('scroll-container');

      // Mock scroll properties and scrollBy
      Object.defineProperty(scrollContainer, 'scrollWidth', {
        value: 1000,
        configurable: true,
      });
      Object.defineProperty(scrollContainer, 'clientWidth', {
        value: 400,
        configurable: true,
      });
      Object.defineProperty(scrollContainer, 'scrollLeft', {
        value: 200,
        writable: true,
        configurable: true,
      });
      scrollContainer.scrollBy = scrollByMock;

      // Trigger scroll event to show buttons
      await act(async () => {
        fireEvent.scroll(scrollContainer);
      });

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: 'Scroll left' }),
        ).toBeInTheDocument();
      });

      // Click left button
      const leftButton = screen.getByTestId('scroll-left-button');
      fireEvent.click(leftButton);

      expect(scrollByMock).toHaveBeenCalled();
    });

    it('calls scrollBy when right navigation button is clicked', async () => {
      render(
        <MockedProvider>
          <I18nextProvider i18n={i18nForTest}>
            <PinnedPostsLayout
              pinnedPosts={mockPinnedPosts}
              onStoryClick={mockOnStoryClick}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      const scrollContainer = screen.getByTestId('scroll-container');

      // Mock scroll properties and scrollBy
      Object.defineProperty(scrollContainer, 'scrollWidth', {
        value: 1000,
        configurable: true,
      });
      Object.defineProperty(scrollContainer, 'clientWidth', {
        value: 400,
        configurable: true,
      });
      Object.defineProperty(scrollContainer, 'scrollLeft', {
        value: 200,
        writable: true,
        configurable: true,
      });
      scrollContainer.scrollBy = scrollByMock;

      // Trigger scroll event to show buttons
      await act(async () => {
        fireEvent.scroll(scrollContainer);
      });

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: 'Scroll right' }),
        ).toBeInTheDocument();
      });

      // Click right button
      const rightButton = screen.getByTestId('scroll-right-button');
      fireEvent.click(rightButton);

      expect(scrollByMock).toHaveBeenCalled();
    });
  });

  describe('Event Listener Cleanup', () => {
    it('should remove scroll event listener when component unmounts', () => {
      // Capture the scroll handler when addEventListener is called
      let capturedScrollHandler: EventListener | undefined;

      // Save the original methods before spying
      const originalAddEventListener = Element.prototype.addEventListener;

      const addEventListenerSpy = vi.spyOn(
        Element.prototype,
        'addEventListener',
      );
      addEventListenerSpy.mockImplementation(function (
        this: Element,
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | AddEventListenerOptions,
      ) {
        if (type === 'scroll' && typeof listener === 'function') {
          capturedScrollHandler = listener;
        }
        // Call original implementation
        return originalAddEventListener.call(this, type, listener, options);
      });

      const removeEventListenerSpy = vi.spyOn(
        Element.prototype,
        'removeEventListener',
      );

      const { unmount } = render(
        <MockedProvider>
          <I18nextProvider i18n={i18nForTest}>
            <PinnedPostsLayout
              pinnedPosts={mockPinnedPosts}
              onStoryClick={mockOnStoryClick}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      // Ensure the scroll handler was captured
      expect(capturedScrollHandler).toBeDefined();

      // Unmount the component
      unmount();

      // Verify that removeEventListener was called with the exact same handler reference
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'scroll',
        capturedScrollHandler,
      );
    });

    it('should not call scroll handler after component unmount', async () => {
      // Spy on console.error before render to catch any React warnings
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const { unmount } = render(
        <MockedProvider>
          <I18nextProvider i18n={i18nForTest}>
            <PinnedPostsLayout
              pinnedPosts={mockPinnedPosts}
              onStoryClick={mockOnStoryClick}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      const scrollContainer = screen.getByTestId('scroll-container');

      // Unmount the component
      unmount();

      // Simulate a scroll event on the now-detached container
      fireEvent.scroll(scrollContainer);

      // Should not see React warning about updating unmounted component
      expect(consoleErrorSpy).not.toHaveBeenCalledWith(
        expect.stringContaining('unmounted component'),
      );
    });
  });

  describe('Defensive Branches in Scroll Functions', () => {
    let scrollByMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      scrollByMock = vi.fn();
    });

    it('should handle insufficient scroll width in scrollLeft', async () => {
      render(
        <MockedProvider>
          <I18nextProvider i18n={i18nForTest}>
            <PinnedPostsLayout
              pinnedPosts={mockPinnedPosts}
              onStoryClick={mockOnStoryClick}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      const scrollContainer = screen.getByTestId('scroll-container');
      scrollContainer.scrollBy = scrollByMock;

      // Set up conditions where scrollWidth <= clientWidth (no scrolling needed)
      Object.defineProperty(scrollContainer, 'scrollWidth', {
        value: 400,
        configurable: true,
      });
      Object.defineProperty(scrollContainer, 'clientWidth', {
        value: 400,
        configurable: true,
      });
      Object.defineProperty(scrollContainer, 'scrollLeft', {
        value: 0,
        writable: true,
        configurable: true,
      });

      act(() => {
        fireEvent.scroll(scrollContainer);
      });

      // Buttons should not appear when scrolling is not possible
      expect(
        screen.queryByTestId('scroll-left-button'),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('scroll-right-button'),
      ).not.toBeInTheDocument();
    });
  });

  describe('Null/Undefined scrollContainerRef Edge Cases', () => {
    it('should handle null scrollContainerRef in checkScrollability', () => {
      const { rerender } = render(
        <MockedProvider>
          <I18nextProvider i18n={i18nForTest}>
            <PinnedPostsLayout
              pinnedPosts={[]}
              onStoryClick={mockOnStoryClick}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      // Component should render without errors even with empty posts
      expect(screen.getByTestId('pinned-posts-layout')).toBeInTheDocument();

      // Rerender with posts - should not throw
      rerender(
        <MockedProvider>
          <I18nextProvider i18n={i18nForTest}>
            <PinnedPostsLayout
              pinnedPosts={mockPinnedPosts}
              onStoryClick={mockOnStoryClick}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      expect(screen.getByTestId('scroll-container')).toBeInTheDocument();
    });
  });

  describe('Posts with Null/Undefined Properties', () => {
    it('should safely render posts with null creator', () => {
      const postsWithNullCreator = [
        createMockPinnedPost('post-null-creator', 'Post without creator'),
        ...mockPinnedPosts,
      ];

      // Modify the first post to have null creator
      postsWithNullCreator[0].node.creator = null;

      render(
        <MockedProvider>
          <I18nextProvider i18n={i18nForTest}>
            <PinnedPostsLayout
              pinnedPosts={postsWithNullCreator}
              onStoryClick={mockOnStoryClick}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      // Should render all posts including the one with null creator
      const postCards = screen.getAllByTestId('view-post-btn');
      expect(postCards.length).toBe(4);

      // Check that the post with null creator still renders caption
      expect(
        screen.getAllByText('Post without creator').length,
      ).toBeGreaterThan(0);
    });

    it('should safely render posts with empty captions', () => {
      const postsWithEmptyCaption = [
        createMockPinnedPost('post-empty-caption', ''),
        createMockPinnedPost('post-whitespace-caption', '   '),
        ...mockPinnedPosts,
      ];

      render(
        <MockedProvider>
          <I18nextProvider i18n={i18nForTest}>
            <PinnedPostsLayout
              pinnedPosts={postsWithEmptyCaption}
              onStoryClick={mockOnStoryClick}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      // Should render all posts including those with empty captions
      const postCards = screen.getAllByTestId('view-post-btn');
      expect(postCards.length).toBe(5);
    });
  });

  describe('Menu Item Actions', () => {
    it('should open menu and show pin/unpin option for admin users', async () => {
      // Mock admin role
      mockGetItem.mockImplementation((key: string) => {
        if (key === 'role') return 'administrator';
        if (key === 'userId' || key === 'id') return 'admin-user';
        return null;
      });

      render(
        <MockedProvider>
          <I18nextProvider i18n={i18nForTest}>
            <PinnedPostsLayout
              pinnedPosts={mockPinnedPosts}
              onStoryClick={mockOnStoryClick}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      // Click on more options button for first post
      const moreOptionsButtons = screen.getAllByTestId('more-options-button');
      fireEvent.click(moreOptionsButtons[0]);

      await waitFor(() => {
        expect(screen.getByTestId('pin-post-menu-item')).toBeInTheDocument();
      });

      // Should show pin option (since post is already pinned, should show unpin)
      const pinMenuItem = screen.getByTestId('pin-post-menu-item');
      expect(pinMenuItem).toBeInTheDocument();
    });

    it('should open menu and show delete option for post creator', async () => {
      // Mock user as post creator
      mockGetItem.mockImplementation((key: string) => {
        if (key === 'role') return 'user';
        if (key === 'userId' || key === 'id') return 'user-1'; // Same as creator ID
        return null;
      });

      render(
        <MockedProvider>
          <I18nextProvider i18n={i18nForTest}>
            <PinnedPostsLayout
              pinnedPosts={mockPinnedPosts}
              onStoryClick={mockOnStoryClick}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      // Click on more options button for first post
      const moreOptionsButtons = screen.getAllByTestId('more-options-button');
      fireEvent.click(moreOptionsButtons[0]);

      await waitFor(() => {
        expect(screen.getByTestId('delete-post-menu-item')).toBeInTheDocument();
      });
    });

    it('should not show menu options for non-admin, non-creator users', async () => {
      // Mock user as neither admin nor creator
      mockGetItem.mockImplementation((key: string) => {
        if (key === 'role') return 'user';
        if (key === 'userId' || key === 'id') return 'different-user-id';
        return null;
      });

      render(
        <MockedProvider>
          <I18nextProvider i18n={i18nForTest}>
            <PinnedPostsLayout
              pinnedPosts={mockPinnedPosts}
              onStoryClick={mockOnStoryClick}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      // Should not show more options button for users who can't manage
      const moreOptionsButtons = screen.queryAllByTestId('more-options-button');
      expect(moreOptionsButtons.length).toBe(0);
    });

    it('should handle pin action click', async () => {
      // Mock admin user
      mockGetItem.mockImplementation((key: string) => {
        if (key === 'role') return 'administrator';
        if (key === 'userId' || key === 'id') return 'admin-user';
        return null;
      });

      render(
        <MockedProvider mocks={[TOGGLE_PINNED_POST_MOCK]}>
          <I18nextProvider i18n={i18nForTest}>
            <PinnedPostsLayout
              pinnedPosts={mockPinnedPosts}
              onStoryClick={mockOnStoryClick}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      // Open menu
      const moreOptionsButtons = screen.getAllByTestId('more-options-button');
      fireEvent.click(moreOptionsButtons[0]);

      await waitFor(() => {
        expect(screen.getByTestId('pin-post-menu-item')).toBeInTheDocument();
      });

      // Click pin/unpin option
      const pinMenuItem = screen.getByTestId('pin-post-menu-item');
      fireEvent.click(pinMenuItem);

      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalledWith(
          'Post unpinned successfully.',
        );
      });
    });

    it('should handle delete action click', async () => {
      // Mock admin user
      mockGetItem.mockImplementation((key: string) => {
        if (key === 'role') return 'administrator';
        if (key === 'userId' || key === 'id') return 'admin-user';
        return null;
      });

      render(
        <MockedProvider mocks={[DELETE_POST_MOCK]}>
          <I18nextProvider i18n={i18nForTest}>
            <PinnedPostsLayout
              pinnedPosts={mockPinnedPosts}
              onStoryClick={mockOnStoryClick}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      // Open menu
      const moreOptionsButtons = screen.getAllByTestId('more-options-button');
      fireEvent.click(moreOptionsButtons[0]);

      await waitFor(() => {
        expect(screen.getByTestId('delete-post-menu-item')).toBeInTheDocument();
      });

      // Click delete option
      const deleteMenuItem = screen.getByTestId('delete-post-menu-item');
      expect(() => fireEvent.click(deleteMenuItem)).not.toThrow();
    });
  });
});
