import { describe, it, expect, vi, afterEach } from 'vitest';
import { formatPostForCard } from './helperFunctions';
import type { InterfacePost } from 'types/Post/interface';
import dayjs from 'dayjs';

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
});
