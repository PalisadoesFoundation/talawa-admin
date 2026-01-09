import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PeopleTabNavbar from './PeopleTabNavbar';

/* ------------------ Types (NO `any`) ------------------ */

type SearchBarProps = {
  placeholder: string;
  onSearch: (value: string) => void;
  inputTestId?: string;
  buttonTestId?: string;
};

type SortingOption = {
  label: string;
  value: string | number;
};

type SortingButtonProps = {
  title: string;
  sortingOptions: SortingOption[];
  selectedOption: string | number;
  onSortChange: (value: string | number) => void;
  dataTestIdPrefix: string;
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

vi.mock('subComponents/SortingButton', () => ({
  default: ({
    title,
    sortingOptions,
    selectedOption,
    onSortChange,
    dataTestIdPrefix,
  }: SortingButtonProps) => (
    <div data-testid={`${dataTestIdPrefix}-sorting`}>
      <span>{title}</span>

      {sortingOptions.map((opt) => (
        <button key={opt.value} onClick={() => onSortChange(opt.value)}>
          {opt.label}
        </button>
      ))}

      <span>Selected: {selectedOption}</span>
    </div>
  ),
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

  it('renders search bar and triggers onSearch', () => {
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

    fireEvent.change(screen.getByTestId('search-input'), {
      target: { value: 'John' },
    });

    expect(onSearch).toHaveBeenCalledWith('John');

    fireEvent.click(screen.getByTestId('search-button'));
    expect(onSearch).toHaveBeenCalledWith('clicked');
  });

  it('renders sorting dropdown and handles sort change', () => {
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
    expect(screen.getByText('Selected: DESC')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Oldest'));
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
    expect(screen.getByTestId('eventType-sorting')).toBeInTheDocument();
  });

  it('does not render event type filter when disabled', () => {
    render(<PeopleTabNavbar showEventTypeFilter={false} />);
    expect(screen.queryByTestId('eventType-sorting')).not.toBeInTheDocument();
  });

  it('handles event type sort change safely when onSortChange is a no-op', () => {
    render(<PeopleTabNavbar showEventTypeFilter />);

    // event type sorting button should exist
    const eventTypeSorting = screen.getByTestId('eventType-sorting');
    expect(eventTypeSorting).toBeInTheDocument();

    // Clicking should NOT throw even though onSortChange is an empty function
    expect(() => {
      fireEvent.click(screen.getByText('Workshops'));
    }).not.toThrow();
  });
});
