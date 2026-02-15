import React from 'react';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, afterEach } from 'vitest';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
import PageHeader from './Navbar';

/* ------------------ Mocks ------------------ */

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('shared-components/SearchBar/SearchBar', () => ({
  default: ({
    placeholder,
    onSearch,
    inputTestId,
    buttonTestId,
  }: {
    placeholder: string;
    onSearch: (value: string) => void;
    inputTestId?: string;
    buttonTestId?: string;
  }) => (
    <div>
      <input
        data-testid={inputTestId ?? 'search-input'}
        placeholder={placeholder}
        onChange={(e) => onSearch(e.target.value)}
      />
      <button
        data-testid={buttonTestId ?? 'search-button'}
        onClick={() => onSearch('clicked')}
      >
        Search
      </button>
    </div>
  ),
}));

vi.mock('shared-components/DropDownButton/DropDownButton', () => ({
  default: ({
    options,
    selectedValue,
    onSelect,
    ariaLabel,
    dataTestIdPrefix,
    buttonLabel,
  }: {
    options: { label: string; value: string | number }[];
    selectedValue: string | number;
    onSelect: (value: string | number) => void;
    ariaLabel: string;
    dataTestIdPrefix: string;
    buttonLabel?: string;
  }) => {
    const selected = options.find((o) => o.value === selectedValue);
    const label = buttonLabel || selected?.label || 'Select';
    return (
      <div data-testid={`${dataTestIdPrefix}-dropdown`}>
        <span data-testid={`${dataTestIdPrefix}-label`}>{ariaLabel}</span>
        <button data-testid={`${dataTestIdPrefix}-toggle`}>{label}</button>
        {options.map((opt) => (
          <button key={opt.value} onClick={() => onSelect(opt.value)}>
            {opt.label}
          </button>
        ))}
      </div>
    );
  },
}));

vi.mock('@mui/icons-material/Sort', () => ({
  default: () => <span data-testid="sort-icon">SortIcon</span>,
}));

/* ------------------ Tests ------------------ */

describe('PageHeader Component', () => {
  it('renders title when provided', () => {
    render(<PageHeader title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders search bar when search props are provided', async () => {
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

    await userEvent.clear(input);
    await userEvent.type(input, 'hello');
    await userEvent.click(button);
    await waitFor(() => expect(TestInterfaceMockSearch).toHaveBeenCalled());
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
    expect(screen.getByText('Sort by Date')).toBeInTheDocument();
  });

  it('renders event type filter when showEventTypeFilter is true', () => {
    render(<PageHeader showEventTypeFilter={true} />);
    expect(screen.getByTestId('eventType-label')).toHaveTextContent(
      'eventType',
    );
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
    expect(screen.getByText('Sort 1')).toBeInTheDocument();
    expect(screen.getByText('Sort 2')).toBeInTheDocument();
  });

  it('renders event type options and allows selection', async () => {
    render(<PageHeader showEventTypeFilter={true} />);

    // 1. Check if the main button exists
    const eventTypeButton = screen.getByTestId('eventType-toggle');
    expect(eventTypeButton).toBeInTheDocument();

    // 2. The mock renders options directly as buttons, so we can click them
    const workshopsOption = screen.getByText('Workshops');
    expect(workshopsOption).toBeInTheDocument();

    // 3. Click the option (to ensure no errors occur)
    await userEvent.click(workshopsOption);
  });
});
