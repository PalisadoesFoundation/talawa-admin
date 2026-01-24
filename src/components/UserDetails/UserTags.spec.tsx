import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import UserTags from './UserTags';
import { InterfacePeopleTabNavbarProps } from 'types/PeopleTab/interface';

/**
 * Mock PageHeader because:
 * - We only want to test UserTags logic
 * - PageHeader is already tested elsewhere
 */
vi.mock('shared-components/PeopleTabNavbar/PeopleTabNavbar', () => ({
  default: (props: InterfacePeopleTabNavbarProps) => (
    <div>
      {/* Mock search input */}
      {props.search && (
        <input
          data-testid={props.search.inputTestId || 'search-input'}
          placeholder={props.search.placeholder}
          onChange={(e) => props.search?.onSearch(e.target.value)}
        />
      )}

      {/* Mock sorting select */}
      {props.sorting &&
        props.sorting.map((sort) => (
          <select
            key={sort.title}
            data-testid={`${sort.testIdPrefix}-select`}
            value={sort.selected}
            onChange={(e) => sort.onChange(e.target.value)}
          >
            {sort.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ))}
    </div>
  ),
}));

describe('UserTags Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders table headers correctly', () => {
    render(<UserTags />);

    expect(screen.getByText('peopleTabTagName')).toBeInTheDocument();
    expect(screen.getByText('assignedTo')).toBeInTheDocument();
    expect(screen.getByText('createdOn')).toBeInTheDocument();
    expect(screen.getByText('createdBy')).toBeInTheDocument();
  });

  it('renders all tags initially', () => {
    render(<UserTags />);

    // One known tag
    expect(screen.getByText('Marketing Campaign')).toBeInTheDocument();
    expect(screen.getByText('Product Launch')).toBeInTheDocument();
    expect(screen.getByText('Security Audit')).toBeInTheDocument();
  });

  it('filters tags by search term (tag name)', async () => {
    render(<UserTags />);

    const searchInput = screen.getByTestId('tagsSearchInput');

    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, 'Marketing');

    expect(screen.getByText('Marketing Campaign')).toBeInTheDocument();
    expect(screen.queryByText('Product Launch')).not.toBeInTheDocument();
  });

  it('filters tags by createdBy field', async () => {
    render(<UserTags />);

    const searchInput = screen.getByTestId('tagsSearchInput');

    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, 'John Doe');

    expect(screen.getByText('Marketing Campaign')).toBeInTheDocument();
    expect(screen.getByText('Sales Q2')).toBeInTheDocument();
    expect(screen.queryByText('Design Review')).not.toBeInTheDocument();
  });

  it('changes sorting order when sort option changes', async () => {
    render(<UserTags />);

    const sortSelect = screen.getByTestId('tagsSort-select');

    // Change to oldest
    await userEvent.selectOptions(sortSelect, 'oldest');

    // First row should now be the first dummy tag
    const rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('Marketing Campaign');
  });

  it('shows correct created by links', () => {
    render(<UserTags />);

    const createdByLinks = screen.getAllByText(
      /John Doe|Sarah Smith|Mike Johnson/,
    );
    expect(createdByLinks.length).toBeGreaterThan(0);
  });

  it('reverses tag order when sorting by latest', async () => {
    render(<UserTags />);

    const sortSelect = screen.getByTestId('tagsSort-select');

    // Trigger reverse()
    await userEvent.selectOptions(sortSelect, 'latest');

    const rows = screen.getAllByRole('row');

    // rows[0] = header
    // rows[1] = first data row after sorting

    expect(rows[1]).toHaveTextContent('Security Audit');
  });
});
