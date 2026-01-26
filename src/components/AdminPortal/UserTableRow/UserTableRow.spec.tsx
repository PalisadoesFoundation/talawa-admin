import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import dayjs from 'dayjs';
import { UserTableRow } from './UserTableRow';
import type {
  InterfaceUserInfo,
  InterfaceActionVariant,
} from 'types/AdminPortal/UserTableRow/interface';

const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

// Use a dynamic date for deterministic testing
const user: InterfaceUserInfo = {
  id: 'u1',
  name: 'Admin User',
  emailAddress: 'admin@example.com',
  avatarURL: null,
  createdAt: dayjs().subtract(30, 'days').toISOString(),
};

describe('UserTableRow', () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it('renders DataGrid cell view with avatar, name, email, and joined date', () => {
    render(
      <RouterWrapper>
        <UserTableRow
          user={user}
          isDataGrid
          showJoinedDate
          linkPath={`/admin/member/${user.id}`}
          actions={[]}
          testIdPrefix="spec"
        />
      </RouterWrapper>,
    );

    expect(screen.getByText('Admin User')).toBeInTheDocument();
    expect(screen.getByText('admin@example.com')).toBeInTheDocument();
    expect(screen.getByTestId('spec-joined-u1')).toBeInTheDocument();
  });

  it('fires onRowClick when clicking non-button area (grid mode)', async () => {
    const onRowClick = vi.fn();
    render(
      <RouterWrapper>
        <UserTableRow
          user={user}
          isDataGrid
          onRowClick={onRowClick}
          testIdPrefix="spec"
        />
      </RouterWrapper>,
    );
    await userEvent.click(screen.getByTestId('spec-gridcell-u1'));
    expect(onRowClick).toHaveBeenCalledWith(user);
  });

  it('fires onRowClick when clicking non-button area (table mode)', async () => {
    const onRowClick = vi.fn();
    render(
      <RouterWrapper>
        <table>
          <tbody>
            <UserTableRow
              user={user}
              isDataGrid={false}
              onRowClick={onRowClick}
              testIdPrefix="spec"
            />
          </tbody>
        </table>
      </RouterWrapper>,
    );
    await userEvent.click(screen.getByTestId('spec-tr-u1'));
    expect(onRowClick).toHaveBeenCalledWith(user);
  });

  it('does not fire onRowClick when clicking an action button', async () => {
    const onRowClick = vi.fn();
    const onAction = vi.fn();
    render(
      <RouterWrapper>
        <UserTableRow
          user={user}
          isDataGrid
          onRowClick={onRowClick}
          actions={[
            {
              label: 'Remove',
              onClick: onAction,
              variant: 'danger',
              testId: 'removeBtn',
            },
          ]}
          testIdPrefix="spec"
        />
      </RouterWrapper>,
    );
    await userEvent.click(screen.getByTestId('removeBtn'));
    expect(onRowClick).not.toHaveBeenCalled();
    expect(onAction).toHaveBeenCalledWith(user);
  });

  it('renders action button with default variant', () => {
    const onAction = vi.fn();
    render(
      <RouterWrapper>
        <UserTableRow
          user={user}
          actions={[
            {
              label: 'Default Action',
              onClick: onAction,
              testId: 'defaultBtn',
            },
          ]}
          testIdPrefix="spec"
        />
      </RouterWrapper>,
    );
    expect(screen.getByTestId('defaultBtn')).toBeInTheDocument();
  });

  it('renders action buttons with all variant types', () => {
    const onAction = vi.fn();
    render(
      <RouterWrapper>
        <UserTableRow
          user={user}
          actions={[
            {
              label: 'Danger Action',
              onClick: onAction,
              testId: 'dangerBtn',
              variant: 'danger',
            },
            {
              label: 'Success Action',
              onClick: onAction,
              testId: 'successBtn',
              variant: 'success',
            },
            {
              label: 'Primary Action',
              onClick: onAction,
              testId: 'primaryBtn',
              variant: 'primary',
            },
            {
              label: 'Default Action',
              onClick: onAction,
              testId: 'defaultBtn',
            },
          ]}
          testIdPrefix="spec"
        />
      </RouterWrapper>,
    );
    expect(screen.getByTestId('dangerBtn')).toBeInTheDocument();
    expect(screen.getByTestId('successBtn')).toBeInTheDocument();
    expect(screen.getByTestId('primaryBtn')).toBeInTheDocument();
    expect(screen.getByTestId('defaultBtn')).toBeInTheDocument();
  });

  it('renders table row view with row number', () => {
    render(
      <RouterWrapper>
        <table>
          <tbody>
            <UserTableRow
              user={user}
              isDataGrid={false}
              rowNumber={1}
              testIdPrefix="spec"
            />
          </tbody>
        </table>
      </RouterWrapper>,
    );
    expect(screen.getByTestId('spec-no-u1')).toHaveTextContent('1');
    expect(screen.getByTestId('spec-tr-u1')).toBeInTheDocument();
  });

  it('renders without joined date when showJoinedDate is false', () => {
    render(
      <RouterWrapper>
        <UserTableRow
          user={user}
          isDataGrid
          showJoinedDate={false}
          testIdPrefix="spec"
        />
      </RouterWrapper>,
    );
    expect(screen.queryByTestId('spec-joined-u1')).not.toBeInTheDocument();
  });

  it('renders compact mode correctly', () => {
    render(
      <RouterWrapper>
        <UserTableRow user={user} isDataGrid compact testIdPrefix="spec" />
      </RouterWrapper>,
    );
    expect(screen.getByTestId('spec-gridcell-u1')).toBeInTheDocument();
  });

  it('handles missing user data gracefully', () => {
    const incompleteUser: InterfaceUserInfo = {
      id: 'u2',
      name: '',
      emailAddress: null,
      avatarURL: null,
      createdAt: null,
    };
    render(
      <RouterWrapper>
        <UserTableRow user={incompleteUser} isDataGrid testIdPrefix="spec" />
      </RouterWrapper>,
    );
    const gridCell = screen.getByTestId('spec-gridcell-u2');
    expect(gridCell).toBeInTheDocument();
  });

  it('renders name as Link when linkPath is provided', () => {
    render(
      <RouterWrapper>
        <UserTableRow
          user={user}
          linkPath="/admin/member/u1"
          isDataGrid
          testIdPrefix="spec"
        />
      </RouterWrapper>,
    );
    const nameLink = screen.getByRole('link', { name: 'Admin User' });
    expect(nameLink).toBeInTheDocument();
    expect(nameLink).toHaveAttribute('href', '/admin/member/u1');
  });

  it('renders disabled action button', () => {
    const onAction = vi.fn();
    render(
      <RouterWrapper>
        <UserTableRow
          user={user}
          actions={[
            {
              label: 'Disabled Action',
              onClick: onAction,
              disabled: true,
              testId: 'disabledBtn',
            },
          ]}
          testIdPrefix="spec"
        />
      </RouterWrapper>,
    );
    const button = screen.getByTestId('disabledBtn');
    expect(button).toBeDisabled();
    // Disabled buttons cannot be clicked with userEvent, which is correct behavior
    expect(onAction).not.toHaveBeenCalled();
  });

  it('renders action button with icon', () => {
    const onAction = vi.fn();
    render(
      <RouterWrapper>
        <UserTableRow
          user={user}
          actions={[
            {
              label: 'Action with Icon',
              onClick: onAction,
              icon: <span data-testid="test-icon">Icon</span>,
              testId: 'iconBtn',
            },
          ]}
          testIdPrefix="spec"
        />
      </RouterWrapper>,
    );
    expect(screen.getByTestId('iconBtn')).toBeInTheDocument();
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('uses custom ariaLabel for action button', () => {
    const onAction = vi.fn();
    render(
      <RouterWrapper>
        <UserTableRow
          user={user}
          actions={[
            {
              label: 'Action',
              onClick: onAction,
              ariaLabel: 'Custom aria label',
              testId: 'ariaBtn',
            },
          ]}
          testIdPrefix="spec"
        />
      </RouterWrapper>,
    );
    const button = screen.getByTestId('ariaBtn');
    expect(button).toHaveAttribute('aria-label', 'Custom aria label');
  });

  it('sets aria-label on grid cell for accessibility', () => {
    render(
      <RouterWrapper>
        <UserTableRow user={user} isDataGrid testIdPrefix="spec" />
      </RouterWrapper>,
    );
    const gridCell = screen.getByTestId('spec-gridcell-u1');
    expect(gridCell).toHaveAttribute('aria-label');
  });

  it('sets aria-label on table row for accessibility', () => {
    render(
      <RouterWrapper>
        <table>
          <tbody>
            <UserTableRow user={user} isDataGrid={false} testIdPrefix="spec" />
          </tbody>
        </table>
      </RouterWrapper>,
    );
    const tableRow = screen.getByTestId('spec-tr-u1');
    expect(tableRow).toHaveAttribute('aria-label');
  });

  it('does not fire onRowClick when clicking a link', async () => {
    const onRowClick = vi.fn();
    render(
      <RouterWrapper>
        <UserTableRow
          user={user}
          linkPath="/admin/member/u1"
          onRowClick={onRowClick}
          isDataGrid
          testIdPrefix="spec"
        />
      </RouterWrapper>,
    );
    const nameLink = screen.getByRole('link', { name: 'Admin User' });
    await userEvent.click(nameLink);
    expect(onRowClick).not.toHaveBeenCalled();
  });

  it('renders without actions when actions array is empty', () => {
    render(
      <RouterWrapper>
        <UserTableRow user={user} actions={[]} isDataGrid testIdPrefix="spec" />
      </RouterWrapper>,
    );
    expect(screen.getByTestId('spec-gridcell-u1')).toBeInTheDocument();
    // Should not have any action buttons
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('handles undefined actions prop', () => {
    render(
      <RouterWrapper>
        <UserTableRow user={user} isDataGrid testIdPrefix="spec" />
      </RouterWrapper>,
    );
    expect(screen.getByTestId('spec-gridcell-u1')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders action button with unknown variant using default color', () => {
    const onAction = vi.fn();
    render(
      <RouterWrapper>
        <UserTableRow
          user={user}
          actions={[
            {
              label: 'Unknown Variant',
              onClick: onAction,
              variant: 'unknown' as InterfaceActionVariant,
              testId: 'unknownBtn',
            },
          ]}
          testIdPrefix="spec"
        />
      </RouterWrapper>,
    );
    expect(screen.getByTestId('unknownBtn')).toBeInTheDocument();
  });

  it('generates default testId for action when testId is not provided', () => {
    const onAction = vi.fn();
    render(
      <RouterWrapper>
        <UserTableRow
          user={user}
          actions={[
            {
              label: 'Action Without TestId',
              onClick: onAction,
            },
          ]}
          testIdPrefix="spec"
        />
      </RouterWrapper>,
    );
    expect(screen.getByTestId('spec-action-0')).toBeInTheDocument();
  });

  it('handles action button size based on compact mode', () => {
    const onAction = vi.fn();
    render(
      <RouterWrapper>
        <UserTableRow
          user={user}
          compact={true}
          actions={[
            {
              label: 'Compact Action',
              onClick: onAction,
              testId: 'compactBtn',
            },
          ]}
          testIdPrefix="spec"
        />
      </RouterWrapper>,
    );
    const button = screen.getByTestId('compactBtn');
    expect(button).toHaveClass('MuiButton-sizeSmall');
  });

  it('handles action button size in non-compact mode', () => {
    const onAction = vi.fn();
    render(
      <RouterWrapper>
        <UserTableRow
          user={user}
          compact={false}
          actions={[
            {
              label: 'Regular Action',
              onClick: onAction,
              testId: 'regularBtn',
            },
          ]}
          testIdPrefix="spec"
        />
      </RouterWrapper>,
    );
    const button = screen.getByTestId('regularBtn');
    expect(button).toHaveClass('MuiButton-sizeMedium');
  });

  it('handles avatar spacing based on compact mode', () => {
    render(
      <RouterWrapper>
        <UserTableRow user={user} compact={true} testIdPrefix="spec" />
      </RouterWrapper>,
    );
    expect(screen.getByTestId('spec-gridcell-u1')).toBeInTheDocument();
  });

  it('handles avatar spacing in non-compact mode', () => {
    render(
      <RouterWrapper>
        <UserTableRow user={user} compact={false} testIdPrefix="spec" />
      </RouterWrapper>,
    );
    expect(screen.getByTestId('spec-gridcell-u1')).toBeInTheDocument();
  });

  it('uses default testIdPrefix when not provided', () => {
    render(
      <RouterWrapper>
        <UserTableRow user={user} />
      </RouterWrapper>,
    );
    expect(
      screen.getByTestId('user-table-row-gridcell-u1'),
    ).toBeInTheDocument();
  });

  it('handles row click when onRowClick is not provided', async () => {
    render(
      <RouterWrapper>
        <UserTableRow user={user} testIdPrefix="spec" />
      </RouterWrapper>,
    );
    const gridCell = screen.getByTestId('spec-gridcell-u1');
    // Should not have onClick handler when onRowClick is not provided
    await userEvent.click(gridCell);
    // No assertion needed - just ensuring no errors occur
    expect(gridCell).toBeInTheDocument();
  });

  it('handles table mode without row number', () => {
    render(
      <RouterWrapper>
        <table>
          <tbody>
            <UserTableRow user={user} isDataGrid={false} testIdPrefix="spec" />
          </tbody>
        </table>
      </RouterWrapper>,
    );
    expect(screen.queryByTestId('spec-no-u1')).not.toBeInTheDocument();
    expect(screen.getByTestId('spec-tr-u1')).toBeInTheDocument();
  });

  it('handles table mode with joined date column', () => {
    render(
      <RouterWrapper>
        <table>
          <tbody>
            <UserTableRow
              user={user}
              isDataGrid={false}
              showJoinedDate={true}
              testIdPrefix="spec"
            />
          </tbody>
        </table>
      </RouterWrapper>,
    );
    expect(
      screen.getByText(dayjs().subtract(30, 'days').format('YYYY-MM-DD')),
    ).toBeInTheDocument();
  });

  it('renders name as plain Typography when linkPath is not provided', () => {
    render(
      <RouterWrapper>
        <UserTableRow user={user} isDataGrid testIdPrefix="spec" />
      </RouterWrapper>,
    );
    const nameElement = screen.getByText('Admin User');
    expect(nameElement).toBeInTheDocument();
    expect(nameElement.tagName).toBe('P'); // Typography renders as p by default
  });

  it('adds data-field="name" attribute for Cypress compatibility', () => {
    render(
      <RouterWrapper>
        <UserTableRow user={user} isDataGrid testIdPrefix="spec" />
      </RouterWrapper>,
    );
    const nameElement = screen.getByText('Admin User');
    expect(nameElement).toHaveAttribute('data-field', 'name');
  });

  it('adds data-field="name" attribute to linked name for Cypress compatibility', () => {
    render(
      <RouterWrapper>
        <UserTableRow
          user={user}
          linkPath="/admin/member/u1"
          isDataGrid
          testIdPrefix="spec"
        />
      </RouterWrapper>,
    );
    const nameElement = screen.getByText('Admin User');
    expect(nameElement).toHaveAttribute('data-field', 'name');
  });

  it('handles keyboard navigation with Enter key on grid cell', async () => {
    const onRowClick = vi.fn();
    render(
      <RouterWrapper>
        <UserTableRow
          user={user}
          isDataGrid
          onRowClick={onRowClick}
          testIdPrefix="spec"
        />
      </RouterWrapper>,
    );
    const gridCell = screen.getByTestId('spec-gridcell-u1');
    gridCell.focus();
    await userEvent.keyboard('{Enter}');
    expect(onRowClick).toHaveBeenCalledWith(user);
  });

  it('handles keyboard navigation with Space key on table row', async () => {
    const onRowClick = vi.fn();
    render(
      <RouterWrapper>
        <table>
          <tbody>
            <UserTableRow
              user={user}
              isDataGrid={false}
              onRowClick={onRowClick}
              testIdPrefix="spec"
            />
          </tbody>
        </table>
      </RouterWrapper>,
    );
    const tableRow = screen.getByTestId('spec-tr-u1');
    tableRow.focus();
    await userEvent.keyboard(' ');
    expect(onRowClick).toHaveBeenCalledWith(user);
  });

  it('handles keyboard events when onRowClick is not provided', async () => {
    render(
      <RouterWrapper>
        <UserTableRow user={user} isDataGrid testIdPrefix="spec" />
      </RouterWrapper>,
    );
    const gridCell = screen.getByTestId('spec-gridcell-u1');
    gridCell.focus();
    await userEvent.keyboard('{Enter}');
    expect(gridCell).toBeInTheDocument();
  });

  it('prevents default on keyboard events', async () => {
    const onRowClick = vi.fn();

    render(
      <RouterWrapper>
        <UserTableRow
          user={user}
          isDataGrid
          onRowClick={onRowClick}
          testIdPrefix="spec"
        />
      </RouterWrapper>,
    );

    const gridCell = screen.getByTestId('spec-gridcell-u1');

    // Test Enter key
    gridCell.focus();
    await userEvent.keyboard('{Enter}');
    expect(onRowClick).toHaveBeenCalledWith(user);

    // Test Space key
    await userEvent.keyboard(' ');
    expect(onRowClick).toHaveBeenCalledTimes(2);
  });

  it('handles keyboard events without onRowClick handler', async () => {
    render(
      <RouterWrapper>
        <UserTableRow user={user} isDataGrid testIdPrefix="spec" />
      </RouterWrapper>,
    );

    const gridCell = screen.getByTestId('spec-gridcell-u1');

    // Should not throw error when onRowClick is undefined
    gridCell.focus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');

    expect(gridCell).toBeInTheDocument();
  });

  it('handles keyboard events on table row without onRowClick', async () => {
    render(
      <RouterWrapper>
        <table>
          <tbody>
            <UserTableRow user={user} isDataGrid={false} testIdPrefix="spec" />
          </tbody>
        </table>
      </RouterWrapper>,
    );

    const tableRow = screen.getByTestId('spec-tr-u1');

    // Should not throw error when onRowClick is undefined
    tableRow.focus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');

    expect(tableRow).toBeInTheDocument();
  });

  it('executes keyboard handler with onRowClick to cover preventDefault', async () => {
    const mockOnRowClick = vi.fn();

    render(
      <RouterWrapper>
        <table>
          <tbody>
            <UserTableRow
              user={user}
              isDataGrid={false}
              testIdPrefix="spec"
              onRowClick={mockOnRowClick}
            />
          </tbody>
        </table>
      </RouterWrapper>,
    );

    const tableRow = screen.getByTestId('spec-tr-u1');

    // Focus the element to ensure proper keyboard event handling
    tableRow.focus();

    // Use userEvent for more realistic keyboard interaction
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');

    expect(mockOnRowClick).toHaveBeenCalledTimes(2);
    expect(mockOnRowClick).toHaveBeenCalledWith(user);
  });

  it('renders compact linked name to cover Typography component prop', () => {
    render(
      <RouterWrapper>
        <UserTableRow
          user={user}
          linkPath="/admin/member/u1"
          compact={true}
          isDataGrid
          testIdPrefix="spec"
        />
      </RouterWrapper>,
    );
    const nameLink = screen.getByRole('link', { name: 'Admin User' });
    expect(nameLink).toBeInTheDocument();
    expect(nameLink).toHaveAttribute('href', '/admin/member/u1');
  });
});
