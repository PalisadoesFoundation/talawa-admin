import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import RecentPostsCard from './RecentPostsCard';

/* eslint-disable @typescript-eslint/no-explicit-any */

// Mock react-i18next
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
      {time && <div>{time}</div>}
      {creator && <div>Author: {creator.name}</div>}
    </div>
  ),
}));

// Mock CardItemLoading component
vi.mock(
  'components/OrganizationDashCards/CardItem/Loader/CardItemLoading',
  () => ({
    default: () => <div data-testid="card-item-loading">Loading...</div>,
  }),
);

describe('RecentPostsCard Component', () => {
  const mockPostData = {
    organization: {
      posts: {
        edges: [
          {
            node: {
              id: 'post1',
              caption: 'First Post Caption',
              createdAt: '2023-01-01T00:00:00Z',
              creator: {
                id: 'user1',
                name: 'John Doe',
              },
            },
          },
          {
            node: {
              id: 'post2',
              caption: 'Second Post Caption',
              createdAt: '2023-01-02T00:00:00Z',
              creator: {
                id: 'user2',
                name: 'Jane Smith',
              },
            },
          },
        ],
      },
    },
  } as any;

  const mockProps = {
    postData: mockPostData,
    postsCount: 2,
    isLoading: false,
    onViewAllClick: vi.fn(),
  } as any;

  it('renders recent posts card with correct title', () => {
    render(<RecentPostsCard {...mockProps} />);

    expect(screen.getByText('latestPosts')).toBeInTheDocument();
  });

  it('displays view all button and handles click', async () => {
    render(<RecentPostsCard {...mockProps} />);

    const viewAllButton = screen.getByText('viewAll');
    expect(viewAllButton).toBeInTheDocument();

    fireEvent.click(viewAllButton);
    expect(mockProps.onViewAllClick).toHaveBeenCalled();
  });

  it('renders loading state correctly', () => {
    const loadingProps = {
      ...mockProps,
      isLoading: true,
    } as any;

    render(<RecentPostsCard {...loadingProps} />);

    expect(screen.getAllByTestId('card-item-loading')).toHaveLength(4);
  });

  it('should render empty state when no posts are available', () => {
    const emptyPostData = {
      organization: {
        posts: {
          edges: [],
        },
      },
    } as any;

    const emptyProps = {
      postData: emptyPostData,
      postsCount: 0,
      isLoading: false,
      onViewAllClick: vi.fn(),
    } as any;

    render(<RecentPostsCard {...emptyProps} />);

    expect(screen.getByText('noPostsPresent')).toBeInTheDocument();
  });

  it('renders zero count empty state correctly', () => {
    const noPosts = {
      postsCount: 0,
      postData: mockPostData,
      isLoading: false,
      onViewAllClick: vi.fn(),
    } as any;

    render(<RecentPostsCard {...noPosts} />);

    expect(screen.getByText('noPostsPresent')).toBeInTheDocument();
  });

  it('displays correct post titles and creators', () => {
    render(<RecentPostsCard {...mockProps} />);

    expect(screen.getByText('First Post Caption')).toBeInTheDocument();
    expect(screen.getByText('Second Post Caption')).toBeInTheDocument();
    expect(screen.getByText('Author: John Doe')).toBeInTheDocument();
    expect(screen.getByText('Author: Jane Smith')).toBeInTheDocument();
  });

  it('handles click on view all button', () => {
    const singleCallProps = {
      ...mockProps,
      onViewAllClick: vi.fn(),
    };
    render(<RecentPostsCard {...singleCallProps} />);

    const viewAllButton = screen.getByText('viewAll');
    fireEvent.click(viewAllButton);

    expect(singleCallProps.onViewAllClick).toHaveBeenCalledTimes(1);
  });

  it('displays correctly when more than 10 posts', () => {
    const manyPosts = [];
    for (let i = 1; i <= 15; i++) {
      manyPosts.push({
        node: {
          id: `post${i}`,
          caption: `Post ${i} Caption`,
          createdAt: `2023-01-${i.toString().padStart(2, '0')}T00:00:00Z`,
          creator: {
            id: `user${i}`,
            name: `User ${i}`,
          },
        },
      });
    }

    const manyPostsData = {
      organization: {
        posts: { edges: manyPosts },
      },
    } as any;

    const manyPostsProps = {
      postData: manyPostsData,
      postsCount: 15,
      isLoading: false,
      onViewAllClick: vi.fn(),
    } as any;

    render(<RecentPostsCard {...manyPostsProps} />);

    // Should only show first 10 posts
    const cardItems = screen.getAllByTestId('card-item');
    expect(cardItems).toHaveLength(10);
  });
});
