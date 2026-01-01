import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { UserTableRow } from './UserTableRow';
import type { InterfaceUserInfo } from 'types/AdminPortal/UserTableRow/interface';

const MockedProvider = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

const user: InterfaceUserInfo = {
  id: 'u1',
  name: 'Admin User',
  emailAddress: 'admin@example.com',
  avatarURL: null,
  createdAt: '2024-01-15T00:00:00.000Z',
};

describe('UserTableRow', () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it('renders DataGrid cell view with avatar, name, email, and joined date', () => {
    render(
      <MockedProvider>
        <UserTableRow
          user={user}
          isDataGrid
          showJoinedDate
          linkPath={`/member/${user.id}`}
          actions={[]}
          testIdPrefix="spec"
        />
      </MockedProvider>,
    );

    expect(screen.getByTestId('spec-avatar-u1')).toBeInTheDocument();
    expect(screen.getByText('Admin User')).toBeInTheDocument();
    expect(screen.getByText('admin@example.com')).toBeInTheDocument();
    expect(screen.getByTestId('spec-joined-u1')).toBeInTheDocument();
  });

  it('fires onRowClick when clicking non-button area (grid mode)', () => {
    const onRowClick = vi.fn();
    render(
      <MockedProvider>
        <UserTableRow
          user={user}
          isDataGrid
          onRowClick={onRowClick}
          testIdPrefix="spec"
        />
      </MockedProvider>,
    );
    fireEvent.click(screen.getByTestId('spec-gridcell-u1'));
    expect(onRowClick).toHaveBeenCalledWith(user);
  });

  it('fires onRowClick when clicking non-button area (table mode)', () => {
    const onRowClick = vi.fn();
    render(
      <MockedProvider>
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
      </MockedProvider>,
    );
    fireEvent.click(screen.getByTestId('spec-tr-u1'));
    expect(onRowClick).toHaveBeenCalledWith(user);
  });

  it('does not fire onRowClick when clicking an action button', () => {
    const onRowClick = vi.fn();
    const onAction = vi.fn();
    render(
      <MockedProvider>
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
      </MockedProvider>,
    );
    fireEvent.click(screen.getByTestId('removeBtn'));
    expect(onRowClick).not.toHaveBeenCalled();
    expect(onAction).toHaveBeenCalledWith(user);
  });

  it('renders action button with default variant', () => {
    const onAction = vi.fn();
    render(
      <MockedProvider>
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
      </MockedProvider>,
    );
    expect(screen.getByTestId('defaultBtn')).toBeInTheDocument();
  });

  it('renders action buttons with all variant types', () => {
    const onAction = vi.fn();
    render(
      <MockedProvider>
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
          ]}
          testIdPrefix="spec"
        />
      </MockedProvider>,
    );
    expect(screen.getByTestId('dangerBtn')).toBeInTheDocument();
    expect(screen.getByTestId('successBtn')).toBeInTheDocument();
    expect(screen.getByTestId('primaryBtn')).toBeInTheDocument();
  });

  it('renders table row view with row number', () => {
    render(
      <MockedProvider>
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
      </MockedProvider>,
    );
    expect(screen.getByTestId('spec-no-u1')).toHaveTextContent('1');
    expect(screen.getByTestId('spec-tr-u1')).toBeInTheDocument();
  });

  it('renders without joined date when showJoinedDate is false', () => {
    render(
      <MockedProvider>
        <UserTableRow
          user={user}
          isDataGrid
          showJoinedDate={false}
          testIdPrefix="spec"
        />
      </MockedProvider>,
    );
    expect(screen.queryByTestId('spec-joined-u1')).not.toBeInTheDocument();
  });

  it('renders compact mode correctly', () => {
    render(
      <MockedProvider>
        <UserTableRow user={user} isDataGrid compact testIdPrefix="spec" />
      </MockedProvider>,
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
      <MockedProvider>
        <UserTableRow user={incompleteUser} isDataGrid testIdPrefix="spec" />
      </MockedProvider>,
    );
    const gridCell = screen.getByTestId('spec-gridcell-u2');
    expect(gridCell).toBeInTheDocument();
    expect(gridCell).toHaveTextContent('No name');
    expect(gridCell).toHaveTextContent('No email');
    expect(gridCell).toHaveTextContent('N/A');
  });

  it('renders name as Link when linkPath is provided', () => {
    render(
      <MockedProvider>
        <UserTableRow
          user={user}
          linkPath="/member/u1"
          isDataGrid
          testIdPrefix="spec"
        />
      </MockedProvider>,
    );
    const nameLink = screen.getByRole('link', { name: 'Admin User' });
    expect(nameLink).toBeInTheDocument();
    expect(nameLink).toHaveAttribute('href', '/member/u1');
  });

  it('renders disabled action button', () => {
    const onAction = vi.fn();
    render(
      <MockedProvider>
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
      </MockedProvider>,
    );
    const button = screen.getByTestId('disabledBtn');
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(onAction).not.toHaveBeenCalled();
  });

  it('renders action button with icon', () => {
    const onAction = vi.fn();
    render(
      <MockedProvider>
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
      </MockedProvider>,
    );
    expect(screen.getByTestId('iconBtn')).toBeInTheDocument();
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('uses custom ariaLabel for action button', () => {
    const onAction = vi.fn();
    render(
      <MockedProvider>
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
      </MockedProvider>,
    );
    const button = screen.getByTestId('ariaBtn');
    expect(button).toHaveAttribute('aria-label', 'Custom aria label');
  });

  it('sets aria-label on grid cell for accessibility', () => {
    render(
      <MockedProvider>
        <UserTableRow user={user} isDataGrid testIdPrefix="spec" />
      </MockedProvider>,
    );
    const gridCell = screen.getByTestId('spec-gridcell-u1');
    expect(gridCell).toHaveAttribute('aria-label', 'User row');
  });

  it('sets aria-label on table row for accessibility', () => {
    render(
      <MockedProvider>
        <table>
          <tbody>
            <UserTableRow user={user} isDataGrid={false} testIdPrefix="spec" />
          </tbody>
        </table>
      </MockedProvider>,
    );
    const tableRow = screen.getByTestId('spec-tr-u1');
    expect(tableRow).toHaveAttribute('aria-label', 'User row');
  });

  it('does not fire onRowClick when clicking a link', () => {
    const onRowClick = vi.fn();
    render(
      <MockedProvider>
        <UserTableRow
          user={user}
          linkPath="/member/u1"
          onRowClick={onRowClick}
          isDataGrid
          testIdPrefix="spec"
        />
      </MockedProvider>,
    );
    const nameLink = screen.getByRole('link', { name: 'Admin User' });
    fireEvent.click(nameLink);
    expect(onRowClick).not.toHaveBeenCalled();
  });

  it('renders without actions when actions array is empty', () => {
    render(
      <MockedProvider>
        <UserTableRow user={user} actions={[]} isDataGrid testIdPrefix="spec" />
      </MockedProvider>,
    );
    expect(screen.getByTestId('spec-gridcell-u1')).toBeInTheDocument();
    // Should not have any action buttons
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('handles undefined actions prop', () => {
    render(
      <MockedProvider>
        <UserTableRow user={user} isDataGrid testIdPrefix="spec" />
      </MockedProvider>,
    );
    expect(screen.getByTestId('spec-gridcell-u1')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
