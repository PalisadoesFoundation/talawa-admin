import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, afterEach } from 'vitest';

afterEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();
});
import PageHeader from './Navbar';

describe('PageHeader Component', () => {
  it('renders title when provided', () => {
    render(<PageHeader title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders search bar when search props are provided', () => {
    const TestInterfaceMockSearch = vi.fn();
    render(
      <PageHeader
        search={{
          placeholder: 'Search...',
          onSearch: TestInterfaceMockSearch,
          inputTestId: 'search-input',
          buttonTestId: 'search-btn',
        }}
      />,
    );

    const input = screen.getByTestId('search-input');
    const button = screen.getByTestId('search-btn');
    expect(input).toBeInTheDocument();
    expect(button).toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'hello' } });
    fireEvent.click(button);
    expect(TestInterfaceMockSearch).toHaveBeenCalled();
  });

  it('renders sorting buttons correctly', () => {
    const mockSort = vi.fn();
    const sortingProps = [
      {
        title: 'Sort by Date',
        options: [
          { label: 'Newest', value: 'new' },
          { label: 'Oldest', value: 'old' },
        ],
        selected: 'new',
        onChange: mockSort,
        testIdPrefix: 'sort-by-date',
      },
    ];

    render(<PageHeader sorting={sortingProps} />);
    expect(screen.getByTitle('Sort by Date')).toBeInTheDocument();
  });

  it('renders event type filter when showEventTypeFilter is true', () => {
    render(<PageHeader showEventTypeFilter={true} />);
    expect(screen.getByText('eventType')).toBeInTheDocument();
  });

  it('renders actions when provided', () => {
    render(<PageHeader actions={<button>Click Me</button>} />);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('renders multiple sorting options', () => {
    const mockSort = vi.fn();
    const sortingProps = [
      {
        title: 'Sort 1',
        options: [{ label: 'A', value: 'a' }],
        selected: 'a',
        onChange: mockSort,
        testIdPrefix: 'sort-1',
      },
      {
        title: 'Sort 2',
        options: [{ label: 'B', value: 'b' }],
        selected: 'b',
        onChange: mockSort,
        testIdPrefix: 'sort-2',
      },
    ];

    render(<PageHeader sorting={sortingProps} />);
    expect(screen.getByTitle('Sort 1')).toBeInTheDocument();
    expect(screen.getByTitle('Sort 2')).toBeInTheDocument();
  });

  it('calls onSortChange and triggers console.log when event type is changed', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    render(<PageHeader showEventTypeFilter={true} />);
    // Find the dropdown/button for event type
    const eventTypeButton = screen.getByTestId('eventType');
    fireEvent.click(eventTypeButton);

    // Select "Workshops" from the dropdown
    const workshopsOption = screen.getByText('Workshops');
    fireEvent.click(workshopsOption);

    expect(logSpy).toHaveBeenCalledWith('Selected Event Type: Workshops');
    logSpy.mockRestore();
  });
});
