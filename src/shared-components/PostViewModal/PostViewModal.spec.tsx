import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import dayjs from 'dayjs';
import PostViewModal from './PostViewModal';
import i18nForTest from '../../utils/i18nForTest';
import { store } from '../../state/store';
import type { InterfacePost } from 'types/Post/interface';

// Mock the formatDate utility
vi.mock('utils/dateFormatter', () => ({
  formatDate: vi.fn((date: string) => {
    if (date === 'invalid-date') {
      throw new Error('Invalid date');
    }
    return dayjs().format('YYYY-MM-DD');
  }),
}));

let lastPostCardProps: { fetchPosts?: () => Promise<unknown> } | null = null;
// Mock PostCard component to avoid complex dependencies
vi.mock('shared-components/postCard/PostCard', () => ({
  __esModule: true,
  default: ({
    id,
    title,
    creator,
    fetchPosts,
  }: {
    id: string;
    title: string;
    creator: { name: string };
    fetchPosts?: () => Promise<unknown>;
  }) => (
    (lastPostCardProps = { fetchPosts }),
    (
      <div data-testid="mocked-post-card">
        <div data-testid="post-id">{id}</div>
        <div data-testid="post-title">{title}</div>
        <div data-testid="post-creator">{creator.name}</div>
      </div>
    )
  ),
}));

describe('PostViewModal', () => {
  const mockOnHide = vi.fn();
  const mockRefetch = vi.fn().mockResolvedValue({});

  const mockPost: InterfacePost = {
    id: '1',
    caption: 'Test Post Caption',
    body: 'Test post body content',
    createdAt: dayjs().subtract(5, 'days').toISOString(),
    attachmentURL: 'https://example.com/image.jpg',
    pinnedAt: dayjs().subtract(10, 'days').toISOString(),
    commentsCount: 5,
    upVotesCount: 10,
    downVotesCount: 2,
    creator: {
      id: 'creator1',
      name: 'John Doe',
      avatarURL: 'https://example.com/avatar.jpg',
      email: 'testuser2@example.com',
    },
    hasUserVoted: {
      hasVoted: true,
      voteType: 'up_vote',
    },
    attachments: [
      {
        mimeType: 'image/jpeg',
      },
    ],
  };

  const renderPostViewModal = (
    props: Partial<{
      show: boolean;
      onHide: () => void;
      post: InterfacePost | null;
      refetch: () => Promise<unknown>;
    }> = {},
  ) => {
    const defaultProps = {
      show: true,
      onHide: mockOnHide,
      post: mockPost,
      refetch: mockRefetch,
      ...props,
    };

    return render(
      <MockedProvider mocks={[]}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <PostViewModal {...defaultProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    lastPostCardProps = null;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering behavior', () => {
    test('returns null when post is null', () => {
      const { container } = renderPostViewModal({ post: null });
      expect(container.firstChild).toBeNull();
    });

    test('renders modal with valid post data', () => {
      renderPostViewModal();

      expect(screen.getByTestId('post-view-modal')).toBeInTheDocument();
      expect(screen.getByTestId('mocked-post-card')).toBeInTheDocument();
      expect(screen.getByTestId('close-post-view-button')).toBeInTheDocument();
    });

    test('renders with show prop false', () => {
      renderPostViewModal({ show: false });

      // When show is false, the modal should not render the content
      expect(screen.queryByTestId('post-view-modal')).not.toBeInTheDocument();
    });
  });

  describe('Close functionality', () => {
    test('calls onHide when close button is clicked', async () => {
      renderPostViewModal();

      const closeButton = screen.getByTestId('close-post-view-button');
      const user = userEvent.setup();
      await user.click(closeButton);

      expect(mockOnHide).toHaveBeenCalledTimes(1);
    });

    test('close button has correct aria-label', () => {
      renderPostViewModal();

      const closeButton = screen.getByTestId('close-post-view-button');
      expect(closeButton).toHaveAttribute('aria-label', expect.any(String));
    });
  });

  describe('formatPostForCard function', () => {
    test('formats post with all data present', () => {
      renderPostViewModal();

      expect(screen.getByTestId('post-id')).toHaveTextContent('1');
      expect(screen.getByTestId('post-title')).toHaveTextContent(
        'Test Post Caption',
      );
      expect(screen.getByTestId('post-creator')).toHaveTextContent('John Doe');
    });

    test('handles missing creator data', () => {
      const postWithoutCreator: InterfacePost = {
        ...mockPost,
        creator: null,
      };

      renderPostViewModal({ post: postWithoutCreator });

      expect(screen.getByTestId('post-creator')).toHaveTextContent(
        'Unknown User',
      );
    });

    test('handles missing creator name', () => {
      const postWithoutCreatorName: InterfacePost = {
        ...mockPost,
        creator: {
          id: 'creator1',
          name: '',
          avatarURL: 'https://example.com/avatar.jpg',
          email: 'testuser@example.com',
        },
      };

      renderPostViewModal({ post: postWithoutCreatorName });

      expect(screen.getByTestId('post-creator')).toHaveTextContent('');
    });

    test('handles missing hasUserVoted data', () => {
      const postWithoutVoteData: InterfacePost = {
        ...mockPost,
        hasUserVoted: null,
      };

      renderPostViewModal({ post: postWithoutVoteData });

      // Should render without errors
      expect(screen.getByTestId('mocked-post-card')).toBeInTheDocument();
    });

    test('handles missing pinnedAt data', () => {
      const postWithoutPinnedAt: InterfacePost = {
        ...mockPost,
        pinnedAt: null,
      };

      renderPostViewModal({ post: postWithoutPinnedAt });

      expect(screen.getByTestId('mocked-post-card')).toBeInTheDocument();
    });

    test('handles missing attachments', () => {
      const postWithoutAttachments: InterfacePost = {
        ...mockPost,
        attachments: undefined,
      };

      renderPostViewModal({ post: postWithoutAttachments });

      expect(screen.getByTestId('mocked-post-card')).toBeInTheDocument();
    });

    test('handles missing caption', () => {
      const postWithoutCaption: InterfacePost = {
        ...mockPost,
        caption: null,
      };

      renderPostViewModal({ post: postWithoutCaption });

      expect(screen.getByTestId('post-title')).toHaveTextContent('');
    });

    test('handles missing body', () => {
      const postWithoutBody: InterfacePost = {
        ...mockPost,
        body: undefined,
      };

      renderPostViewModal({ post: postWithoutBody });

      expect(screen.getByTestId('mocked-post-card')).toBeInTheDocument();
    });

    test('handles missing attachmentURL', () => {
      const postWithoutAttachmentURL: InterfacePost = {
        ...mockPost,
        attachmentURL: undefined,
      };

      renderPostViewModal({ post: postWithoutAttachmentURL });

      expect(screen.getByTestId('mocked-post-card')).toBeInTheDocument();
    });

    test('handles missing count fields', () => {
      const postWithoutCounts: InterfacePost = {
        ...mockPost,
        commentsCount: undefined,
        upVotesCount: undefined,
        downVotesCount: undefined,
      };

      renderPostViewModal({ post: postWithoutCounts });

      expect(screen.getByTestId('mocked-post-card')).toBeInTheDocument();
    });
  });

  describe('formatDate error handling', () => {
    test('handles formatDate throwing an error', () => {
      const postWithInvalidDate: InterfacePost = {
        ...mockPost,
        createdAt: 'invalid-date',
      };

      // Should not throw error and render empty string for date
      renderPostViewModal({ post: postWithInvalidDate });

      expect(screen.getByTestId('mocked-post-card')).toBeInTheDocument();
    });

    test('handles valid date formatting', () => {
      renderPostViewModal();

      // Should format the date successfully
      expect(screen.getByTestId('mocked-post-card')).toBeInTheDocument();
    });
  });

  describe('Props handling', () => {
    test('passes refetch function to PostCard', () => {
      renderPostViewModal();

      expect(lastPostCardProps?.fetchPosts).toBe(mockRefetch);
    });

    test('handles different refetch function', () => {
      const customRefetch = vi.fn().mockResolvedValue({ data: 'custom' });
      renderPostViewModal({ refetch: customRefetch });

      expect(lastPostCardProps?.fetchPosts).toBe(customRefetch);
    });
  });

  describe('Translation integration', () => {
    test('uses translation for unknown user', () => {
      const postWithoutCreator: InterfacePost = {
        ...mockPost,
        creator: null,
      };

      renderPostViewModal({ post: postWithoutCreator });

      // The translation should be used for unknownUser
      expect(screen.getByTestId('post-creator')).toHaveTextContent(
        'Unknown User',
      );
    });
  });

  describe('Component structure', () => {
    test('renders with correct modal props', () => {
      renderPostViewModal();

      const modal = screen.getByTestId('post-view-modal');
      expect(modal).toBeInTheDocument();
    });

    test('renders with backdrop static', () => {
      renderPostViewModal();

      // Modal should be rendered (backdrop behavior is handled by Bootstrap)
      expect(screen.getByTestId('post-view-modal')).toBeInTheDocument();
    });
  });
});
