import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import PeopleTabNavbar from './PeopleTabNavbar';

/* ------------------ Types (NO `any`) ------------------ */

type SearchBarProps = {
  placeholder: string;
  onSearch: (value: string) => void;
  inputTestId?: string;
  buttonTestId?: string;
};

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
  }: SearchBarProps) => (
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

describe('PeopleTabNavbar', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders title when provided', () => {
    render(<PeopleTabNavbar title="Users" />);
    expect(screen.getByText('Users')).toBeInTheDocument();
  });

  it('renders search bar and triggers onSearch', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn<(value: string) => void>();

    render(
      <PeopleTabNavbar
        search={{
          placeholder: 'Search user...',
          onSearch,
          inputTestId: 'search-input',
          buttonTestId: 'search-button',
        }}
      />,
    );

    await user.type(screen.getByTestId('search-input'), 'John');
    expect(onSearch).toHaveBeenLastCalledWith('John');

    await user.click(screen.getByTestId('search-button'));
    expect(onSearch).toHaveBeenCalledWith('clicked');
  });

  it('renders sorting dropdown and handles sort change', async () => {
    const user = userEvent.setup();
    const onSortChange = vi.fn<(value: string | number) => void>();

    render(
      <PeopleTabNavbar
        sorting={[
          {
            title: 'Sort By',
            options: [
              { label: 'Newest', value: 'DESC' },
              { label: 'Oldest', value: 'ASC' },
            ],
            selected: 'DESC',
            onChange: onSortChange,
            testIdPrefix: 'usersSort',
          },
        ]}
      />,
    );

    expect(screen.getByText('Sort By')).toBeInTheDocument();
    // DropDownButton shows the label of the selected option, not the value
    expect(screen.getByTestId('usersSort-toggle')).toHaveTextContent('Newest');

    await user.click(screen.getByText('Oldest'));
    expect(onSortChange).toHaveBeenCalledWith('ASC');
  });

  it('renders action buttons when provided', () => {
    render(
      <PeopleTabNavbar
        actions={<button data-testid="add-user">Add User</button>}
      />,
    );

    expect(screen.getByTestId('add-user')).toBeInTheDocument();
  });

  it('renders event type filter when enabled', () => {
    render(<PeopleTabNavbar showEventTypeFilter />);
    expect(screen.getByTestId('eventType-dropdown')).toBeInTheDocument();
  });

  it('does not render event type filter when disabled', () => {
    render(<PeopleTabNavbar showEventTypeFilter={false} />);
    expect(screen.queryByTestId('eventType-dropdown')).not.toBeInTheDocument();
  });

  it('handles event type sort change safely when onSortChange is a no-op', async () => {
    const user = userEvent.setup();

    render(<PeopleTabNavbar showEventTypeFilter />);

    const eventTypeSorting = screen.getByTestId('eventType-dropdown');
    expect(eventTypeSorting).toBeInTheDocument();

    await expect(
      user.click(screen.getByText('Workshops')),
    ).resolves.not.toThrow();
  });
});
