import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import RecentPostsCard from './RecentPostsCard';

// Mock react-toastify
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock CardItem component
vi.mock('components/OrganizationDashCards/CardItem/CardItem', () => ({
  default: ({
    title,
    time,
    creator,
  }: {
    title: string;
    time?: string;
    creator?: { name: string };
  }) => (
    <div data-testid="card-item">
      <div>{title}</div>
      <div>{time}</div>
      <div>{creator?.name}</div>
    </div>
  ),
}));

// Mock CardItemLoading component
vi.mock(
  'components/OrganizationDashCards/CardItem/Loader/CardItemLoading',
  () => ({
    default: () => <div data-testid="card-loading" />,
  }),
);

describe('RecentPostsCard Component', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mockPostData: any = {
    organization: {
      posts: {
        edges: [
          {
            node: {
              id: 'post1',
              caption: 'Test post 1',
              createdAt: '2024-01-01T10:00:00.000Z',
              creator: {
                id: 'user1',
                name: 'John Doe',
              },
            },
          },
          {
            node: {
              id: 'post2',
              caption: 'Test post 2',
              createdAt: '2024-01-02T10:00:00.000Z',
              creator: {
                id: 'user2',
                name: 'Jane Smith',
              },
            },
          },
        ],
      },
    },
  };

  const mockProps = {
    postData: mockPostData,
    postsCount: 15,
    isLoading: false,
    onViewAllClick: vi.fn(),
  };

  it('renders recent posts card with correct title', () => {
    render(<RecentPostsCard {...mockProps} />);

    expect(screen.getByText('latestPosts')).toBeInTheDocument();
  });

  it('displays post list correctly when posts are provided', () => {
    render(<RecentPostsCard {...mockProps} />);

    expect(screen.getByText('Test post 1')).toBeInTheDocument();
    expect(screen.getByText('Test post 2')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('shows loading state when isLoading is true', () => {
    const loadingProps = { ...mockProps, isLoading: true };
    render(<RecentPostsCard {...loadingProps} />);

    const loadingElements = screen.getAllByTestId('card-loading');
    expect(loadingElements.length).toBeGreaterThan(0);
  });

  it('calls onViewAllClick when view all button is clicked', async () => {
    render(<RecentPostsCard {...mockProps} />);

    const viewAllButton = screen.getByRole('button', { name: /viewAll/i });
    fireEvent.click(viewAllButton);

    expect(mockProps.onViewAllClick).toHaveBeenCalled();
  });

  it('should render empty state when no posts are available', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const emptyPostData: any = {
      organization: {
        posts: {
          edges: [],
        },
      },
    };
    const emptyProps = { ...mockProps, postData: emptyPostData };
    render(<RecentPostsCard {...emptyProps} />);

    expect(screen.getByText('latestPosts')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /viewAll/i }),
    ).toBeInTheDocument();
  });

  it('shows no posts message when postsCount is 0', () => {
    const noPosts = { ...mockProps, postsCount: 0 };
    render(<RecentPostsCard {...noPosts} />);

    expect(screen.getByText('noPostsPresent')).toBeInTheDocument();
  });

  it('renders with correct card structure', () => {
    render(<RecentPostsCard {...mockProps} />);

    // Check for card element and title
    const card = screen.getByText('latestPosts');
    expect(card).toBeInTheDocument();

    const viewAllButton = screen.getByRole('button', { name: /viewAll/i });
    expect(viewAllButton).toBeInTheDocument();
  });

  it('displays correct number of posts', () => {
    render(<RecentPostsCard {...mockProps} />);

    const cardItems = screen.getAllByTestId('card-item');
    expect(cardItems).toHaveLength(2);
  });

  it('shows only first 10 posts when more than 10 are provided', () => {
    const manyPosts = [];
    for (let i = 1; i <= 12; i++) {
      manyPosts.push({
        node: {
          id: `post${i}`,
          caption: `Post ${i}`,
          createdAt: `2024-09-${30 - i}T10:00:00Z`,
          creator: {
            id: `creator${i}`,
            name: `Creator ${i}`,
          },
        },
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const manyPostsData: any = {
      organization: {
        posts: { edges: manyPosts },
      },
    };
    const manyPostsProps = { ...mockProps, postData: manyPostsData };
    render(<RecentPostsCard {...manyPostsProps} />);

    const cardItems = screen.getAllByTestId('card-item');
    expect(cardItems).toHaveLength(10); // Should show only first 10
  });
});
