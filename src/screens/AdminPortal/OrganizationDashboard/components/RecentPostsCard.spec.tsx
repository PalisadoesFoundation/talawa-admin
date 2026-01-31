import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import RecentPostsCard from './RecentPostsCard';
import type { InterfaceOrganizationPg } from 'utils/interfaces';
import dayjs from 'dayjs';

// Narrow type that only includes the fields the component uses
type MinimalOrgPg = Pick<InterfaceOrganizationPg, 'organization'>;

// Mock interfaces for test data - simplified types that match our test needs
interface TestInterfaceUser {
  id: string;
  name: string;
}

interface TestInterfacePost {
  id: string;
  caption: string;
  createdAt: string;
  creator: TestInterfaceUser;
}

interface TestInterfacePostEdge {
  node: TestInterfacePost;
}

interface TestInterfacePostsConnection {
  edges: TestInterfacePostEdge[];
}

interface TestInterfaceOrganizationData {
  posts: TestInterfacePostsConnection;
}

interface TestInterfacePostData {
  organization: TestInterfaceOrganizationData;
}

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock CardItem component
vi.mock(
  'components/AdminPortal/OrganizationDashCards/CardItem/CardItem',
  () => ({
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
  }),
);

// Mock CardItemLoading component
vi.mock(
  'components/AdminPortal/OrganizationDashCards/CardItem/Loader/CardItemLoading',
  () => ({
    default: () => <div data-testid="card-item-loading">Loading...</div>,
  }),
);

describe('RecentPostsCard Component', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const mockPostData: TestInterfacePostData = {
    organization: {
      posts: {
        edges: [
          {
            node: {
              id: 'post1',
              caption: 'First Post Caption',
              createdAt: dayjs().subtract(1, 'year').toISOString(),
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
              createdAt: dayjs()
                .subtract(1, 'year')
                .add(1, 'day')
                .toISOString(),
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
    postData: mockPostData as MinimalOrgPg,
    postsCount: 2,
    isLoading: false,
    onViewAllClick: vi.fn(),
  };

  it('renders recent posts card with correct title', () => {
    render(<RecentPostsCard {...mockProps} />);

    expect(screen.getByText('latestPosts')).toBeInTheDocument();
  });

  it('displays view all button and handles click', async () => {
    render(<RecentPostsCard {...mockProps} />);

    const viewAllButton = screen.getByText('viewAll');
    expect(viewAllButton).toBeInTheDocument();

    await userEvent.click(viewAllButton);
    expect(mockProps.onViewAllClick).toHaveBeenCalled();
  });

  it('renders loading state correctly', () => {
    const loadingProps = {
      ...mockProps,
      isLoading: true,
    };

    render(<RecentPostsCard {...loadingProps} />);

    expect(screen.getAllByTestId('card-item-loading')).toHaveLength(5);
  });

  it('should render empty state when no posts are available', () => {
    const emptyPostData: TestInterfacePostData = {
      organization: {
        posts: {
          edges: [],
        },
      },
    };
    const emptyProps = {
      postData: emptyPostData as MinimalOrgPg,
      postsCount: 0,
      isLoading: false,
      onViewAllClick: vi.fn(),
    };

    render(<RecentPostsCard {...emptyProps} />);

    expect(screen.getByText('noPostsPresent')).toBeInTheDocument();
  });

  it('renders zero count empty state correctly', () => {
    const noPosts = {
      postsCount: 0,
      postData: mockPostData as MinimalOrgPg,
      isLoading: false,
      onViewAllClick: vi.fn(),
    };

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

  it('handles click on view all button', async () => {
    const singleCallProps = {
      ...mockProps,
      onViewAllClick: vi.fn(),
    };
    render(<RecentPostsCard {...singleCallProps} />);

    const viewAllButton = screen.getByText('viewAll');
    await userEvent.click(viewAllButton);

    expect(singleCallProps.onViewAllClick).toHaveBeenCalledTimes(1);
  });

  it('displays correctly when more than 10 posts', () => {
    const manyPosts: TestInterfacePostEdge[] = [];
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

    const manyPostsData: TestInterfacePostData = {
      organization: {
        posts: { edges: manyPosts },
      },
    };

    const manyPostsProps = {
      postData: manyPostsData as MinimalOrgPg,
      postsCount: 15,
      isLoading: false,
      onViewAllClick: vi.fn(),
    };

    render(<RecentPostsCard {...manyPostsProps} />);

    // Should only show first 5 posts
    const cardItems = screen.getAllByTestId('card-item');
    expect(cardItems).toHaveLength(5);
  });
});
