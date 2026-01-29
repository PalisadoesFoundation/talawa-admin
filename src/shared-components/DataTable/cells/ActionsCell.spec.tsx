import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { ActionsCell } from './ActionsCell';
import type { IRowAction } from '../../../types/shared-components/DataTable/interface';

type Row = { id: string; name: string };

describe('ActionsCell', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders all action buttons', () => {
    const actions: IRowAction<Row>[] = [
      { id: 'edit', label: 'Edit', onClick: vi.fn() },
      { id: 'delete', label: 'Delete', onClick: vi.fn() },
    ];
    const row: Row = { id: '1', name: 'Ada' };

    render(<ActionsCell row={row} actions={actions} />);

    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
  });

  it('calls onClick with row data when action is clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const actions: IRowAction<Row>[] = [{ id: 'edit', label: 'Edit', onClick }];
    const row: Row = { id: '1', name: 'Ada' };

    render(<ActionsCell row={row} actions={actions} />);

    await user.click(screen.getByRole('button', { name: 'Edit' }));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith(row);
  });

  it('disables button when disabled is true', () => {
    const actions: IRowAction<Row>[] = [
      { id: 'edit', label: 'Edit', onClick: vi.fn(), disabled: true },
    ];
    const row: Row = { id: '1', name: 'Ada' };

    render(<ActionsCell row={row} actions={actions} />);

    expect(screen.getByRole('button', { name: 'Edit' })).toBeDisabled();
  });

  it('disables button when disabled function returns true', () => {
    const actions: IRowAction<Row>[] = [
      {
        id: 'edit',
        label: 'Edit',
        onClick: vi.fn(),
        disabled: (r) => r.name === 'Ada',
      },
    ];
    const row: Row = { id: '1', name: 'Ada' };

    render(<ActionsCell row={row} actions={actions} />);

    expect(screen.getByRole('button', { name: 'Edit' })).toBeDisabled();
  });

  it('enables button when disabled function returns false', () => {
    const actions: IRowAction<Row>[] = [
      {
        id: 'edit',
        label: 'Edit',
        onClick: vi.fn(),
        disabled: (r) => r.name === 'Bob',
      },
    ];
    const row: Row = { id: '1', name: 'Ada' };

    render(<ActionsCell row={row} actions={actions} />);

    expect(screen.getByRole('button', { name: 'Edit' })).not.toBeDisabled();
  });

  it('uses ariaLabel when provided', () => {
    const actions: IRowAction<Row>[] = [
      {
        id: 'edit',
        label: 'Edit',
        onClick: vi.fn(),
        ariaLabel: 'Edit this row',
      },
    ];
    const row: Row = { id: '1', name: 'Ada' };

    render(<ActionsCell row={row} actions={actions} />);

    expect(
      screen.getByRole('button', { name: 'Edit this row' }),
    ).toBeInTheDocument();
  });

  it('falls back to label for aria-label when ariaLabel not provided', () => {
    const actions: IRowAction<Row>[] = [
      { id: 'edit', label: 'Edit', onClick: vi.fn() },
    ];
    const row: Row = { id: '1', name: 'Ada' };

    render(<ActionsCell row={row} actions={actions} />);

    const button = screen.getByRole('button', { name: 'Edit' });
    expect(button).toHaveAttribute('aria-label', 'Edit');
  });

  it('renders empty container when no actions provided', () => {
    const row: Row = { id: '1', name: 'Ada' };

    render(<ActionsCell row={row} actions={[]} />);

    expect(screen.getByTestId('actions-cell')).toBeInTheDocument();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('does not call onClick when disabled button is clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const actions: IRowAction<Row>[] = [
      { id: 'edit', label: 'Edit', onClick, disabled: true },
    ];
    const row: Row = { id: '1', name: 'Ada' };

    render(<ActionsCell row={row} actions={actions} />);

    const button = screen.getByRole('button', { name: 'Edit' });
    await user.click(button);

    // Disabled button should prevent onClick
    expect(onClick).not.toHaveBeenCalled();
  });
});
