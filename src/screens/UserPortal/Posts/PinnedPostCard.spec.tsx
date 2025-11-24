import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import PinnedPostCard, { InterfacePinnedPostCardProps } from './PinnedPostCard';

afterEach(() => {
  vi.clearAllMocks();
});

describe('PinnedPostCard', () => {
  const mockPost: InterfacePinnedPostCardProps['post'] = {
    id: '1',
    creator: { id: 'c1', name: 'John Doe', avatarURL: '' },
    postedAt: 'Jan 1, 2025',
    image: null,
    video: null,
    title: 'Pinned Post Title',
    text: 'This is a test pinned post with some text.',
    pinnedAt: '2025-09-30',
    commentCount: 2,
    hasUserVoted: { hasVoted: false, voteType: null },
    upVoteCount: 3,
    downVoteCount: 1,
    fetchPosts: vi.fn(),
  };

  it('renders pinned post with title and text', () => {
    render(<PinnedPostCard post={mockPost} data-testid="pinned-post" />);

    expect(screen.getByText(/Pinned Post Title/i)).toBeInTheDocument();
    expect(screen.getByText(/This is a test pinned post/i)).toBeInTheDocument();
  });

  it('falls back to default image if none provided', () => {
    render(<PinnedPostCard post={mockPost} data-testid="pinned-post" />);
    const img = screen.getByRole('img') as HTMLImageElement;
    expect(img.src).toContain('/src/assets/images/defaultImg.png');
  });
});
