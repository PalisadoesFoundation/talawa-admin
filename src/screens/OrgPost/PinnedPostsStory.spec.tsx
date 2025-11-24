import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PinnedPostsStory from './PinnedPostsStory';
import type { InterfacePost, InterfacePostEdge } from 'types/Post/interface';
import AboutImg from 'assets/images/defaultImg.png';

// Mock react-multi-carousel to render children directly
vi.mock('react-multi-carousel', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

const mockPosts: InterfacePostEdge[] = [
  {
    node: {
      id: '1',
      caption: 'Test Post 1',
      createdAt: new Date().toISOString(),
      pinned: true,
      creator: {
        id: 'u1',
        name: 'Alice Johnson',
        email: 'example@example.com',
        avatarURL: 'http://example.com/alice.jpg',
      },
    } as InterfacePost,
    cursor: 'cursor-1',
  },
  {
    node: {
      id: '2',
      caption: 'Test Post 2',
      createdAt: new Date().toISOString(),
      pinned: true,
      creator: {
        id: 'u2',
        name: 'Bob Smith',
        email: 'example@example.com',
        avatarURL: '',
      },
    } as InterfacePost,
    cursor: 'cursor-2',
  },
];

describe('PinnedPostsStory', () => {
  it('renders nothing when pinnedPosts is empty', () => {
    const { container } = render(
      <PinnedPostsStory pinnedPosts={[]} onStoryClick={vi.fn()} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders captions and creator names when posts are provided', () => {
    render(<PinnedPostsStory pinnedPosts={mockPosts} onStoryClick={vi.fn()} />);

    expect(
      screen.getByText((content) => content.includes('Alice')),
    ).toBeInTheDocument();
    expect(
      screen.getByText((content) => content.includes('Bob')),
    ).toBeInTheDocument();

    expect(screen.getAllByRole('img')).toHaveLength(2);
  });

  it('calls onStoryClick when a story is clicked', () => {
    const handleClick = vi.fn();
    render(
      <PinnedPostsStory pinnedPosts={mockPosts} onStoryClick={handleClick} />,
    );

    const aliceStory = screen.getByText((content) => content.includes('Alice'));
    fireEvent.click(aliceStory);

    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleClick).toHaveBeenCalledWith(mockPosts[0].node);
  });

  it('renders Unknown when creator is missing', () => {
    const posts = [
      { ...mockPosts[0], node: { ...mockPosts[0].node, creator: undefined } },
    ];
    render(<PinnedPostsStory pinnedPosts={posts} onStoryClick={vi.fn()} />);
    expect(screen.getByText('Unknown')).toBeInTheDocument();
  });

  it('uses default image when imageUrl is missing', () => {
    const posts = [
      { ...mockPosts[0], node: { ...mockPosts[0].node, imageUrl: undefined } },
    ];
    render(<PinnedPostsStory pinnedPosts={posts} onStoryClick={vi.fn()} />);
    const img = screen.getByRole('img') as HTMLImageElement;
    expect(img.src).toContain(AboutImg);
  });

  it('renders "Untitled" when caption is missing', () => {
    const posts = [
      { ...mockPosts[0], node: { ...mockPosts[0].node, caption: undefined } },
    ];
    render(<PinnedPostsStory pinnedPosts={posts} onStoryClick={vi.fn()} />);

    // Strict check for the fallback text
    expect(screen.getByText('Untitled')).toBeInTheDocument();

    // Ensure no other fallback text like "No Caption" etc. sneaks in
    expect(screen.queryByText(/No Caption/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Untitled Post/i)).not.toBeInTheDocument();
  });
});
