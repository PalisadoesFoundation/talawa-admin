import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, afterEach } from 'vitest';
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
        data-testid={inputTestId}
        placeholder={placeholder}
        onChange={(e) => onSearch(e.target.value)}
      />
      <button data-testid={buttonTestId} onClick={() => onSearch('clicked')}>
        Search
      </button>
    </div>
  ),
}));

vi.mock('shared-components/SortingButton/SortingButton', () => ({
  default: ({
    title,
    sortingOptions,
    selectedOption,
    onSortChange,
    dataTestIdPrefix,
  }: {
    title: string;
    sortingOptions: { label: string; value: string | number }[];
    selectedOption: string | number;
    onSortChange: (value: string | number) => void;
    dataTestIdPrefix: string;
  }) => (
    <div>
      <button aria-label={title} data-testid={`${dataTestIdPrefix}-toggle`}>
        {title}
      </button>
      <div>
        {sortingOptions.map((opt) => (
          <button key={opt.value} onClick={() => onSortChange(opt.value)}>
            {opt.label}
          </button>
        ))}
      </div>
      <span>Selected: {selectedOption}</span>
    </div>
  ),
}));

afterEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

/* ------------------ Tests ------------------ */

describe('PageHeader Component', () => {
  it('renders title when provided', () => {
    render(<PageHeader title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders search bar when search props are provided', async () => {
    const onSearch = vi.fn();
    const user = userEvent.setup();

    render(
      <PageHeader
        search={{
          placeholder: 'Search...',
          onSearch,
          inputTestId: 'search-input',
          buttonTestId: 'search-btn',
        }}
      />,
    );

    const input = screen.getByTestId('search-input');
    const button = screen.getByTestId('search-btn');

    await user.type(input, 'hello');
    await user.click(button);

    expect(onSearch).toHaveBeenCalled();
  });

  it('renders sorting buttons correctly', () => {
    const mockSort = vi.fn();

    render(
      <PageHeader
        sorting={[
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
        ]}
      />,
    );

    expect(screen.getByLabelText('Sort by Date')).toBeInTheDocument();
  });

  it('renders event type filter when enabled', () => {
    render(<PageHeader showEventTypeFilter />);
    expect(screen.getByLabelText('eventType')).toBeInTheDocument();
  });

  it('renders actions when provided', () => {
    render(<PageHeader actions={<button>Click Me</button>} />);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('renders multiple sorting options', () => {
    const mockSort = vi.fn();

    render(
      <PageHeader
        sorting={[
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
        ]}
      />,
    );

    expect(screen.getByLabelText('Sort 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Sort 2')).toBeInTheDocument();
  });

  it('renders event type options and allows selection', async () => {
    const user = userEvent.setup();

    render(<PageHeader showEventTypeFilter />);

    const toggle = screen.getByTestId('eventType-toggle');
    expect(toggle).toBeInTheDocument();

    await user.click(toggle);

    expect(screen.getByText('Workshops')).toBeInTheDocument();
    await user.click(screen.getByText('Workshops'));
  });
});
