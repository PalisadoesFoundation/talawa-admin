import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, afterEach } from 'vitest';
import PageHeader from './PageHeader';

afterEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();
});
describe('PageHeader Component', () => {
  it('renders title when provided', () => {
    render(<PageHeader title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders search bar when search props are provided', async () => {
    const user = userEvent.setup();
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

    await user.type(input, 'hello');
    await user.click(button);
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
    expect(screen.getByTestId('eventType')).toBeInTheDocument();
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

  it('renders event type options and allows selection', async () => {
    const user = userEvent.setup();
    render(<PageHeader showEventTypeFilter={true} />);

    // 1. Check if the main button exists
    const eventTypeButton = screen.getByTestId('eventType');
    expect(eventTypeButton).toBeInTheDocument();

    // 2. Click it to open the menu
    await user.click(eventTypeButton);

    // 3. Check if the "workshops" option appears (using translation key)
    const workshopsOption = screen.getByText('workshops');
    expect(workshopsOption).toBeInTheDocument();

    // 4. Click the option (to ensure no errors occur)
    await user.click(workshopsOption);
  });

  it('displays correct buttonLabel when selectedEventType is "events"', () => {
    render(
      <PageHeader showEventTypeFilter={true} selectedEventType="events" />,
    );

    const eventTypeButton = screen.getByTestId('eventType');
    expect(eventTypeButton).toHaveTextContent('events');
  });

  it('displays correct buttonLabel when selectedEventType is "workshops"', () => {
    render(
      <PageHeader showEventTypeFilter={true} selectedEventType="workshops" />,
    );

    const eventTypeButton = screen.getByTestId('eventType');
    expect(eventTypeButton).toHaveTextContent('workshops');
  });

  it('calls onEventTypeChange with correct value when selecting "workshops"', async () => {
    const user = userEvent.setup();
    const mockOnEventTypeChange = vi.fn();

    render(
      <PageHeader
        showEventTypeFilter={true}
        selectedEventType="events"
        onEventTypeChange={mockOnEventTypeChange}
      />,
    );

    // Open the dropdown
    const eventTypeButton = screen.getByTestId('eventType');
    await user.click(eventTypeButton);

    // Select "workshops" option
    const workshopsOption = screen.getByText('workshops');
    await user.click(workshopsOption);

    // Verify the callback was called with the correct value
    expect(mockOnEventTypeChange).toHaveBeenCalledWith('workshops');
  });

  it('calls onEventTypeChange with correct value when selecting "events"', async () => {
    const user = userEvent.setup();
    const mockOnEventTypeChange = vi.fn();

    render(
      <PageHeader
        showEventTypeFilter={true}
        selectedEventType="workshops"
        onEventTypeChange={mockOnEventTypeChange}
      />,
    );

    // Open the dropdown
    const eventTypeButton = screen.getByTestId('eventType');
    await user.click(eventTypeButton);

    // Select "events" option
    const eventsOption = screen.getByText('events');
    await user.click(eventsOption);

    // Verify the callback was called with the correct value
    expect(mockOnEventTypeChange).toHaveBeenCalledWith('events');
  });

  it('resolves buttonLabel correctly from sorting options', () => {
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
    expect(screen.getByTestId('sort-by-date')).toHaveTextContent('Newest');
  });

  it('falls back to title when selected option is not found', () => {
    const mockSort = vi.fn();
    const sortingProps = [
      {
        title: 'Sort by Date',
        options: [
          { label: 'Newest', value: 'new' },
          { label: 'Oldest', value: 'old' },
        ],
        selected: 'unknown_value',
        onChange: mockSort,
        testIdPrefix: 'sort-fallback',
      },
    ];

    render(<PageHeader sorting={sortingProps} />);
    expect(screen.getByTestId('sort-fallback')).toHaveTextContent(
      'Sort by Date',
    );
  });
});
