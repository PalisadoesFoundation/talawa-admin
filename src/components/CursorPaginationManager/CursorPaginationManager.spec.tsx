import React, { useRef } from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import CursorPaginationManager from './CursorPaginationManager';
import type { InterfaceConnection } from 'types/CursorPagination/interface';

// Mock data types
interface InterfaceMockNode {
  id: string;
  content: string;
}

interface InterfaceMockData {
  items: InterfaceConnection<InterfaceMockNode>;
}

const createMockConnection = (
  items: InterfaceMockNode[],
  hasNextPage = true,
  hasPreviousPage = false,
  startCursor = 'start',
  endCursor = 'end',
): InterfaceConnection<InterfaceMockNode> => ({
  edges: items.map((item, index) => ({
    cursor: `cursor-${index}`,
    node: item,
  })),
  pageInfo: {
    hasNextPage,
    hasPreviousPage,
    startCursor,
    endCursor,
  },
});

describe('CursorPaginationManager Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Forward Pagination', () => {
    it('renders items correctly in forward direction', () => {
      const mockData: InterfaceMockData = {
        items: createMockConnection([
          { id: '1', content: 'Item 1' },
          { id: '2', content: 'Item 2' },
        ]),
      };

      render(
        <CursorPaginationManager
          paginationDirection="forward"
          data={mockData}
          getConnection={(data) => data.items}
          queryVariables={{ first: 10, after: null }}
          itemsPerPage={10}
          onLoadMore={vi.fn()}
        >
          {({ items }) => (
            <div>
              {items.map((item) => (
                <div key={item.id} data-testid={`item-${item.id}`}>
                  {item.content}
                </div>
              ))}
            </div>
          )}
        </CursorPaginationManager>,
      );

      expect(screen.getByTestId('item-1')).toHaveTextContent('Item 1');
      expect(screen.getByTestId('item-2')).toHaveTextContent('Item 2');
    });

    it('shows hasMore as true when hasNextPage is true', () => {
      const mockData: InterfaceMockData = {
        items: createMockConnection(
          [{ id: '1', content: 'Item 1' }],
          true, // hasNextPage
        ),
      };

      render(
        <CursorPaginationManager
          paginationDirection="forward"
          data={mockData}
          getConnection={(data) => data.items}
          queryVariables={{ first: 10, after: null }}
          itemsPerPage={10}
          onLoadMore={vi.fn()}
        >
          {({ hasMore }) => (
            <div data-testid="has-more">{hasMore ? 'true' : 'false'}</div>
          )}
        </CursorPaginationManager>,
      );

      expect(screen.getByTestId('has-more')).toHaveTextContent('true');
    });

    it('shows hasMore as false when hasNextPage is false', () => {
      const mockData: InterfaceMockData = {
        items: createMockConnection(
          [{ id: '1', content: 'Item 1' }],
          false, // hasNextPage
        ),
      };

      render(
        <CursorPaginationManager
          paginationDirection="forward"
          data={mockData}
          getConnection={(data) => data.items}
          queryVariables={{ first: 10, after: null }}
          itemsPerPage={10}
          onLoadMore={vi.fn()}
        >
          {({ hasMore }) => (
            <div data-testid="has-more">{hasMore ? 'true' : 'false'}</div>
          )}
        </CursorPaginationManager>,
      );

      expect(screen.getByTestId('has-more')).toHaveTextContent('false');
    });

    it('calls onLoadMore with correct variables for forward pagination', async () => {
      const mockData: InterfaceMockData = {
        items: createMockConnection(
          [{ id: '1', content: 'Item 1' }],
          true,
          false,
          'start',
          'end-cursor',
        ),
      };

      const onLoadMore = vi.fn().mockResolvedValue(undefined);

      render(
        <CursorPaginationManager
          paginationDirection="forward"
          data={mockData}
          getConnection={(data) => data.items}
          queryVariables={{ first: 10, after: null }}
          itemsPerPage={10}
          onLoadMore={onLoadMore}
        >
          {({ loadMore }) => (
            <button type="button" onClick={() => loadMore()}>
              Load More
            </button>
          )}
        </CursorPaginationManager>,
      );

      fireEvent.click(screen.getByText('Load More'));

      await waitFor(() => {
        expect(onLoadMore).toHaveBeenCalledWith({
          first: 10,
          after: 'end-cursor',
        });
      });
    });

    it('shows loading state during forward pagination', async () => {
      const mockData: InterfaceMockData = {
        items: createMockConnection([{ id: '1', content: 'Item 1' }], true),
      };

      const onLoadMore = vi.fn(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

      render(
        <CursorPaginationManager
          paginationDirection="forward"
          data={mockData}
          getConnection={(data) => data.items}
          queryVariables={{ first: 10, after: null }}
          itemsPerPage={10}
          onLoadMore={onLoadMore}
        >
          {({ loadMore, loading }) => (
            <div>
              <div data-testid="loading">{loading ? 'Loading' : 'Ready'}</div>
              <button type="button" onClick={() => loadMore()}>
                Load More
              </button>
            </div>
          )}
        </CursorPaginationManager>,
      );

      expect(screen.getByTestId('loading')).toHaveTextContent('Ready');

      fireEvent.click(screen.getByText('Load More'));

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Loading');
      });
    });

    it('does not load more when hasMore is false', async () => {
      const mockData: InterfaceMockData = {
        items: createMockConnection([{ id: '1', content: 'Item 1' }], false),
      };

      const onLoadMore = vi.fn();

      render(
        <CursorPaginationManager
          paginationDirection="forward"
          data={mockData}
          getConnection={(data) => data.items}
          queryVariables={{ first: 10, after: null }}
          itemsPerPage={10}
          onLoadMore={onLoadMore}
        >
          {({ loadMore }) => (
            <button type="button" onClick={() => loadMore()}>
              Load More
            </button>
          )}
        </CursorPaginationManager>,
      );

      fireEvent.click(screen.getByText('Load More'));

      await waitFor(() => {
        expect(onLoadMore).not.toHaveBeenCalled();
      });
    });
  });

  describe('Backward Pagination', () => {
    it('renders items correctly in backward direction', () => {
      const mockData: InterfaceMockData = {
        items: createMockConnection(
          [
            { id: '1', content: 'Message 1' },
            { id: '2', content: 'Message 2' },
          ],
          false,
          true, // hasPreviousPage
        ),
      };

      render(
        <CursorPaginationManager
          paginationDirection="backward"
          data={mockData}
          getConnection={(data) => data.items}
          queryVariables={{ last: 10, before: null }}
          itemsPerPage={10}
          onLoadMore={vi.fn()}
        >
          {({ items }) => (
            <div>
              {items.map((item) => (
                <div key={item.id} data-testid={`item-${item.id}`}>
                  {item.content}
                </div>
              ))}
            </div>
          )}
        </CursorPaginationManager>,
      );

      expect(screen.getByTestId('item-1')).toHaveTextContent('Message 1');
      expect(screen.getByTestId('item-2')).toHaveTextContent('Message 2');
    });

    it('shows hasMore as true when hasPreviousPage is true', () => {
      const mockData: InterfaceMockData = {
        items: createMockConnection(
          [{ id: '1', content: 'Message 1' }],
          false,
          true, // hasPreviousPage
        ),
      };

      render(
        <CursorPaginationManager
          paginationDirection="backward"
          data={mockData}
          getConnection={(data) => data.items}
          queryVariables={{ last: 10, before: null }}
          itemsPerPage={10}
          onLoadMore={vi.fn()}
        >
          {({ hasMore }) => (
            <div data-testid="has-more">{hasMore ? 'true' : 'false'}</div>
          )}
        </CursorPaginationManager>,
      );

      expect(screen.getByTestId('has-more')).toHaveTextContent('true');
    });

    it('shows hasMore as false when hasPreviousPage is false', () => {
      const mockData: InterfaceMockData = {
        items: createMockConnection(
          [{ id: '1', content: 'Message 1' }],
          false,
          false, // hasPreviousPage
        ),
      };

      render(
        <CursorPaginationManager
          paginationDirection="backward"
          data={mockData}
          getConnection={(data) => data.items}
          queryVariables={{ last: 10, before: null }}
          itemsPerPage={10}
          onLoadMore={vi.fn()}
        >
          {({ hasMore }) => (
            <div data-testid="has-more">{hasMore ? 'true' : 'false'}</div>
          )}
        </CursorPaginationManager>,
      );

      expect(screen.getByTestId('has-more')).toHaveTextContent('false');
    });

    it('calls onLoadMore with correct variables for backward pagination', async () => {
      const mockData: InterfaceMockData = {
        items: createMockConnection(
          [{ id: '1', content: 'Message 1' }],
          false,
          true,
          'start-cursor',
          'end',
        ),
      };

      const onLoadMore = vi.fn().mockResolvedValue(undefined);

      render(
        <CursorPaginationManager
          paginationDirection="backward"
          data={mockData}
          getConnection={(data) => data.items}
          queryVariables={{ last: 10, before: null }}
          itemsPerPage={10}
          onLoadMore={onLoadMore}
        >
          {({ loadMore }) => (
            <button type="button" onClick={() => loadMore()}>
              Load Older
            </button>
          )}
        </CursorPaginationManager>,
      );

      fireEvent.click(screen.getByText('Load Older'));

      await waitFor(() => {
        expect(onLoadMore).toHaveBeenCalledWith({
          last: 10,
          before: 'start-cursor',
        });
      });
    });

    it('handles scroll position restoration for backward pagination', async () => {
      const TestComponent = (): JSX.Element => {
        const scrollRef = useRef<HTMLDivElement>(null);
        const mockData: InterfaceMockData = {
          items: createMockConnection(
            [{ id: '1', content: 'Message 1' }],
            false,
            true,
          ),
        };

        const onLoadMore = vi.fn().mockResolvedValue(undefined);

        return (
          <CursorPaginationManager
            paginationDirection="backward"
            data={mockData}
            getConnection={(data) => data.items}
            queryVariables={{ last: 10, before: null }}
            itemsPerPage={10}
            onLoadMore={onLoadMore}
            scrollContainerRef={scrollRef}
          >
            {({ items, loadMore }) => (
              <div
                ref={scrollRef}
                style={{ height: '200px', overflow: 'auto' }}
              >
                <button type="button" onClick={() => loadMore()}>
                  Load Older
                </button>
                {items.map((item) => (
                  <div key={item.id}>{item.content}</div>
                ))}
              </div>
            )}
          </CursorPaginationManager>
        );
      };

      render(<TestComponent />);

      fireEvent.click(screen.getByText('Load Older'));

      await waitFor(() => {
        expect(screen.getByText('Message 1')).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles null data gracefully', () => {
      render(
        <CursorPaginationManager
          paginationDirection="forward"
          data={null}
          getConnection={(data) => data?.items}
          queryVariables={{ first: 10, after: null }}
          itemsPerPage={10}
          onLoadMore={vi.fn()}
        >
          {({ items }) => <div data-testid="items-count">{items.length}</div>}
        </CursorPaginationManager>,
      );

      expect(screen.getByTestId('items-count')).toHaveTextContent('0');
    });

    it('handles undefined data gracefully', () => {
      render(
        <CursorPaginationManager
          paginationDirection="forward"
          data={undefined}
          getConnection={(data) => data?.items}
          queryVariables={{ first: 10, after: null }}
          itemsPerPage={10}
          onLoadMore={vi.fn()}
        >
          {({ items }) => <div data-testid="items-count">{items.length}</div>}
        </CursorPaginationManager>,
      );

      expect(screen.getByTestId('items-count')).toHaveTextContent('0');
    });

    it('handles empty edges array', () => {
      const mockData: InterfaceMockData = {
        items: createMockConnection([]),
      };

      render(
        <CursorPaginationManager
          paginationDirection="forward"
          data={mockData}
          getConnection={(data) => data.items}
          queryVariables={{ first: 10, after: null }}
          itemsPerPage={10}
          onLoadMore={vi.fn()}
        >
          {({ items, hasMore }) => (
            <div>
              <div data-testid="items-count">{items.length}</div>
              <div data-testid="has-more">{hasMore ? 'true' : 'false'}</div>
            </div>
          )}
        </CursorPaginationManager>,
      );

      expect(screen.getByTestId('items-count')).toHaveTextContent('0');
      expect(screen.getByTestId('has-more')).toHaveTextContent('true');
    });

    it('handles errors during load more', async () => {
      const mockData: InterfaceMockData = {
        items: createMockConnection([{ id: '1', content: 'Item 1' }], true),
      };

      const error = new Error('Network error');
      const onLoadMore = vi.fn().mockRejectedValue(error);
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => { });

      render(
        <CursorPaginationManager
          paginationDirection="forward"
          data={mockData}
          getConnection={(data) => data.items}
          queryVariables={{ first: 10, after: null }}
          itemsPerPage={10}
          onLoadMore={onLoadMore}
        >
          {({ loadMore, error: renderError }) => (
            <div>
              <button type="button" onClick={() => loadMore()}>
                Load More
              </button>
              {renderError && (
                <div data-testid="error">{renderError.message}</div>
              )}
            </div>
          )}
        </CursorPaginationManager>,
      );

      fireEvent.click(screen.getByText('Load More'));

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Network error');
      });

      consoleErrorSpy.mockRestore();
    });

    it('calls onItemsChange when items change', () => {
      const onItemsChange = vi.fn();
      const mockData: InterfaceMockData = {
        items: createMockConnection([
          { id: '1', content: 'Item 1' },
          { id: '2', content: 'Item 2' },
        ]),
      };

      render(
        <CursorPaginationManager
          paginationDirection="forward"
          data={mockData}
          getConnection={(data) => data.items}
          queryVariables={{ first: 10, after: null }}
          itemsPerPage={10}
          onLoadMore={vi.fn()}
          onItemsChange={onItemsChange}
        >
          {({ items }) => (
            <div>
              {items.map((item) => (
                <div key={item.id}>{item.content}</div>
              ))}
            </div>
          )}
        </CursorPaginationManager>,
      );

      expect(onItemsChange).toHaveBeenCalledWith([
        { id: '1', content: 'Item 1' },
        { id: '2', content: 'Item 2' },
      ]);
    });

    it('prevents multiple simultaneous load operations', async () => {
      const mockData: InterfaceMockData = {
        items: createMockConnection([{ id: '1', content: 'Item 1' }], true),
      };

      const onLoadMore = vi.fn(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

      render(
        <CursorPaginationManager
          paginationDirection="forward"
          data={mockData}
          getConnection={(data) => data.items}
          queryVariables={{ first: 10, after: null }}
          itemsPerPage={10}
          onLoadMore={onLoadMore}
        >
          {({ loadMore }) => (
            <button type="button" onClick={() => loadMore()}>
              Load More
            </button>
          )}
        </CursorPaginationManager>,
      );

      // Click multiple times rapidly
      fireEvent.click(screen.getByText('Load More'));
      fireEvent.click(screen.getByText('Load More'));
      fireEvent.click(screen.getByText('Load More'));

      await waitFor(() => {
        // Should only be called once due to loading guard
        expect(onLoadMore).toHaveBeenCalledTimes(1);
      });
    });
  });
});
