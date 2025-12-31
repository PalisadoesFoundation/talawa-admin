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
    expect(screen.getByTestId('spec-gridcell-u2')).toBeInTheDocument();
  });
});
