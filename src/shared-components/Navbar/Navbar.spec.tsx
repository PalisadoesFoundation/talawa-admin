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
        type="button"
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
    type,
    icon,
  }: {
    options: { label: string; value: string | number }[];
    selectedValue: string | number;
    onSelect: (value: string | number) => void;
    ariaLabel: string;
    dataTestIdPrefix: string;
    buttonLabel?: string;
    type?: string;
    icon?: React.ReactNode;
  }) => {
    const selected = options.find((o) => o.value === selectedValue);
    const label = buttonLabel || selected?.label || 'Select';
    return (
      <div data-testid={`${dataTestIdPrefix}-dropdown`}>
        <span data-testid={`${dataTestIdPrefix}-label`}>{ariaLabel}</span>
        <button type="button" data-testid={`${dataTestIdPrefix}-toggle`}>
          {label}
        </button>
        <div data-testid={`${dataTestIdPrefix}-icon`} data-icon-type={type}>
          {icon}
        </div>
        {options.map((opt) => (
          <button
            type="button"
            key={opt.value}
            onClick={() => onSelect(opt.value)}
          >
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

  it('renders sort type icon when sort type is provided', () => {
    const mockSort = vi.fn();
    const sortingProps = [
      {
        title: 'Sort Custom',
        options: [{ label: 'A', value: 'a' }],
        selected: 'a',
        onChange: mockSort,
        testIdPrefix: 'sort-custom',
      },
    ];

    render(<PageHeader sorting={sortingProps} />);
    const iconContainer = screen.getByTestId('sort-custom-icon');
    expect(iconContainer).toHaveAttribute('data-icon-type', 'sort');
  });

  it('renders default sort type when sort.icon is NOT provided', () => {
    const mockSort = vi.fn();
    const sortingProps = [
      {
        title: 'Sort Default',
        options: [{ label: 'B', value: 'b' }],
        selected: 'b',
        onChange: mockSort,
        testIdPrefix: 'sort-default',
      },
    ];

    render(<PageHeader sorting={sortingProps} />);
    const iconContainer = screen.getByTestId('sort-default-icon');
    expect(iconContainer).toHaveAttribute('data-icon-type', 'sort');
  });
});
