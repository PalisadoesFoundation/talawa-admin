import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PinnedPostsStory from './PinnedPostsStory';
import type { InterfacePost } from 'types/Post/interface';

// Mock react-multi-carousel to render children directly
vi.mock('react-multi-carousel', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

// Mock posts
const mockPosts: InterfacePost[] = [
  {
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
  {
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
];

describe('PinnedPostsStory', () => {
  it('renders nothing when pinnedPosts is empty', () => {
    const { container } = render(
      <PinnedPostsStory pinnedPosts={[]} onStoryClick={vi.fn()} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders avatars and names when posts are provided', () => {
    render(<PinnedPostsStory pinnedPosts={mockPosts} onStoryClick={vi.fn()} />);

    // Use flexible text matcher in case of nested elements
    expect(
      screen.getByText((content) => content.includes('Alice')),
    ).toBeInTheDocument();
    expect(
      screen.getByText((content) => content.includes('Bob')),
    ).toBeInTheDocument();

    // Check avatars
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
    expect(handleClick).toHaveBeenCalledWith(mockPosts[0]);
  });
});
