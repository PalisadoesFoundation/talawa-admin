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
import { DELETE_POST_MUTATION } from '../../GraphQl/Mutations/mutations';
import { TOGGLE_PINNED_POST } from '../../GraphQl/Mutations/OrganizationMutations';

// Mock react-toastify
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock useLocalStorage
vi.mock('../../utils/useLocalstorage', () => ({
  default: () => ({
    getItem: (key: string) => {
      if (key === 'role') return 'administrator';
      if (key === 'userId' || key === 'id') return 'user-1';
      return null;
    },
  }),
}));

// Mock errorHandler
vi.mock('../../utils/errorHandler', () => ({
  errorHandler: vi.fn(),
}));

const mockOnStoryClick = vi.fn();

const createMockPinnedPost = (
  id: string,
  caption: string,
): InterfacePostEdge => ({
  node: {
    id,
    caption,
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
  cursor: `cursor-${id}`,
});

const mockPinnedPosts: InterfacePostEdge[] = [
  createMockPinnedPost('post-1', 'First pinned post'),
  createMockPinnedPost('post-2', 'Second pinned post'),
  createMockPinnedPost('post-3', 'Third pinned post'),
];

describe('PinnedPostsLayout Component', () => {
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
      const leftButton = screen.getByRole('button', { name: 'Scroll left' });
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
      const rightButton = screen.getByRole('button', { name: 'Scroll right' });
      fireEvent.click(rightButton);

      expect(scrollByMock).toHaveBeenCalled();
    });
  });
});
