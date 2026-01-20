/**
 * Tests for `formatPostForCard` helper function.
 *
 * This function formats a post object for display in post cards.
 * The tests cover:
 *   - Fallback behavior when `creator` or `attachments` are missing
 *   - Correct handling of `hasUserVoted` and `mimeType`
 *   - Proper formatting of `postedAt`, including error handling when dates are invalid
 *   - Happy path with all fields populated
 *
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { formatPostForCard } from './helperFunctions';
import type { InterfacePost } from 'types/Post/interface';
import dayjs from 'dayjs';
import * as dateFormatter from 'utils/dateFormatter';

describe('formatPostForCard', () => {
  const t = (key: string) => key;
  const refetch = vi.fn();

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should fallback to unknown creator and handle missing attachments', () => {
    const post: InterfacePost = {
      id: '2',
      caption: 'Test',
      body: '',
      createdAt: dayjs().format('YYYY-MM-DD'),
      creator: {
        id: 'unknown',
        name: 'unknownUser',
        email: 'unknown@example.com',
      },
      commentsCount: 0,
      upVotesCount: 0,
      downVotesCount: 0,
      pinnedAt: undefined,
      hasUserVoted: undefined,
      attachments: undefined,
      attachmentURL: undefined,
    };

    const card = formatPostForCard(post, t, refetch);

    expect(card.creator.id).toBe('unknown');
    expect(card.creator.name).toBe('unknownUser');
    expect(card.hasUserVoted).toEqual({ hasVoted: false, voteType: null });
    expect(card.mimeType).toBeNull();
    expect(card.attachmentURL).toBeUndefined();
  });

  // Should
  it('should format a complete post correctly', () => {
    const post: InterfacePost = {
      id: '1',
      caption: 'Full Post',
      body: 'Body content',
      createdAt: dayjs().format('YYYY-MM-DD'),
      creator: {
        id: 'creator-1',
        name: 'John Doe',
        email: 'john@example.com',
        avatarURL: 'https://example.com/avatar.jpg',
      },
      commentsCount: 5,
      upVotesCount: 10,
      downVotesCount: 2,
      pinnedAt: dayjs().add(1, 'day').format('YYYY-MM-DD'),
      hasUserVoted: { hasVoted: true, voteType: 'up_vote' },
      attachments: [{ mimeType: 'image/png' }],
      attachmentURL: 'https://example.com/image.png',
    };

    const card = formatPostForCard(post, t, refetch);

    expect(card.id).toBe('1');
    expect(card.creator.name).toBe('John Doe');
    expect(card.attachmentURL).toBe('https://example.com/image.png');
    expect(card.mimeType).toBe('image/png');
    expect(card.hasUserVoted).toEqual({ hasVoted: true, voteType: 'up_vote' });
  });

  it('should fallback to empty string when date formatting fails', () => {
    vi.spyOn(dateFormatter, 'formatDate').mockImplementation(() => {
      throw new Error('Invalid date');
    });

    const post: InterfacePost = {
      id: '3',
      createdAt: 'invalid-date',
      // minimal required fields
    };

    const card = formatPostForCard(post, t, refetch);

    expect(card.postedAt).toBe('');
  });

  it('should fallback to unknownUser when creator.name is missing', () => {
    const post: InterfacePost = {
      id: '4',
      createdAt: dayjs().format('YYYY-MM-DD'),
      creator: {
        id: 'creator-2',
        name: undefined as unknown as string,
        email: 'test@example.com',
      },
      hasUserVoted: undefined,
    };

    const card = formatPostForCard(post, t, refetch);

    expect(card.creator.name).toBe('unknownUser');
  });
});
