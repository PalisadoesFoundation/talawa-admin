import React from 'react';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getPledgeColumns } from './PledgeColumns';
import type { InterfacePledgeTableRow } from './PledgeColumns';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import userEvent from '@testing-library/user-event';
import type { IColumnDef } from 'types/shared-components/DataTable/interface';

dayjs.extend(utc);

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' },
  }),
}));

// Mock Avatar component
vi.mock('shared-components/Avatar/Avatar', () => ({
  default: ({
    name,
    alt,
  }: {
    name: string;
    alt: string;
    containerStyle: string;
    avatarStyle: string;
  }) => <div data-testid="mock-avatar">{name || alt}</div>,
}));

describe('getPledgeColumns', () => {
  let user: ReturnType<typeof userEvent.setup>;
  beforeEach(() => {
    user = userEvent.setup();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  const mockHandleClick = vi.fn();
  const mockHandleOpenModal = vi.fn();

  const defaultProps = {
    labels: {
      pledgers: 'pledges.pledgers',
      pledgeDate: 'pledges.pledgeDate',
      pledged: 'pledges.pledged',
      donated: 'pledges.donated',
      action: 'action',
      edit: 'edit',
    },
    getMoreCountLabel: (count: number) => `moreCount_${count}`,
    id: 'test-popover-id',
    handleClick: mockHandleClick,
    handleOpenModal: mockHandleOpenModal,
  };

  const renderColumnCell = (
    column: IColumnDef<InterfacePledgeTableRow>,
    row: Partial<InterfacePledgeTableRow>,
  ): React.ReactNode => {
    const accessor = column.accessor;
    const value =
      typeof accessor === 'function'
        ? accessor(row as InterfacePledgeTableRow)
        : (row as Record<string, unknown>)[accessor as string];

    return column.render?.(value, row as InterfacePledgeTableRow);
  };

  it('should return 5 column definitions', () => {
    const columns = getPledgeColumns(defaultProps);
    expect(columns).toHaveLength(5);
    expect(columns.map((c) => c.id)).toEqual([
      'pledgers',
      'pledgeDate',
      'amount',
      'donated',
      'action',
    ]);
  });

  describe('pledgers column', () => {
    it('should render main user with avatarURL', () => {
      const columns = getPledgeColumns(defaultProps);
      const pledgersColumn = columns[0];

      const row = {
        id: '1',
        users: [{ id: 'u1', name: 'John Doe', avatarURL: 'http://avatar.jpg' }],
      };

      const { container } = render(
        <>{renderColumnCell(pledgersColumn, row)}</>,
      );

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(container.querySelector('img')).toHaveAttribute(
        'src',
        'http://avatar.jpg',
      );
    });

    it('should render Avatar component when no avatarURL', () => {
      const columns = getPledgeColumns(defaultProps);
      const pledgersColumn = columns[0];

      const row = {
        id: '1',
        users: [{ id: 'u1', name: 'Jane Doe', avatarURL: null }],
      };

      render(<>{renderColumnCell(pledgersColumn, row)}</>);

      expect(screen.getByTestId('mock-avatar')).toBeInTheDocument();
      expect(screen.getAllByText('Jane Doe').length).toBeGreaterThan(0);
    });

    it('should display extra users count and handle click', async () => {
      const columns = getPledgeColumns(defaultProps);
      const pledgersColumn = columns[0];

      const extraUsers = [
        { id: 'u2', name: 'Extra User 1', avatarURL: null },
        { id: 'u3', name: 'Extra User 2', avatarURL: null },
      ];
      const row = {
        id: '1',
        users: [
          { id: 'u1', name: 'Main User', avatarURL: null },
          ...extraUsers,
        ],
      };

      render(<>{renderColumnCell(pledgersColumn, row)}</>);

      const moreContainer = screen.getByTestId('moreContainer-1');
      expect(moreContainer).toBeInTheDocument();
      expect(moreContainer).toHaveTextContent('moreCount_2');

      await user.click(moreContainer);
      await waitFor(() => {
        expect(mockHandleClick).toHaveBeenCalledWith(
          expect.any(Object),
          extraUsers,
        );
      });
    });

    it('should handle keyboard navigation on extra users container', async () => {
      const columns = getPledgeColumns(defaultProps);
      const pledgersColumn = columns[0];

      const row = {
        id: '1',
        users: [
          { id: 'u1', name: 'Main User', avatarURL: null },
          { id: 'u2', name: 'Extra User', avatarURL: null },
        ],
      };

      render(<>{renderColumnCell(pledgersColumn, row)}</>);

      const moreContainer = screen.getByTestId('moreContainer-1');
      expect(moreContainer).toHaveAttribute('role', 'button');
      expect(moreContainer).toHaveAttribute('tabIndex', '0');

      await user.click(moreContainer);
      await user.keyboard('{Enter}');
      await waitFor(() => {
        expect(mockHandleClick).toHaveBeenCalled();
      });
    });

    it('should handle empty users array', () => {
      const columns = getPledgeColumns(defaultProps);
      const pledgersColumn = columns[0];

      const row = {
        id: '1',
        users: [],
      };

      const { container } = render(
        <>{renderColumnCell(pledgersColumn, row)}</>,
      );

      expect(container.querySelector('[data-testid^="mainUser-"]')).toBeNull();
      expect(
        container.querySelector('[data-testid^="moreContainer-"]'),
      ).toBeNull();
    });

    it('should handle undefined users (falls back to empty array)', () => {
      const columns = getPledgeColumns(defaultProps);
      const pledgersColumn = columns[0];

      const row = {
        id: '1',
      };

      const { container } = render(
        <>{renderColumnCell(pledgersColumn, row)}</>,
      );

      expect(container.querySelector('[data-testid^="mainUser-"]')).toBeNull();
    });
  });

  describe('pledgeDate column', () => {
    it('should format date using DD/MM/YYYY format', () => {
      const columns = getPledgeColumns(defaultProps);
      const dateColumn = columns[1];

      const pledgeDate = dayjs.utc().month(2).date(15).hour(10).toISOString();
      const result = renderColumnCell(dateColumn, {
        pledgeDate: pledgeDate as unknown as Date,
      });
      expect(result).toBe(dayjs.utc(pledgeDate).format('DD/MM/YYYY'));
    });

    it('should sort pledgeDate using ascending timestamp comparator', () => {
      const columns = getPledgeColumns(defaultProps);
      const dateColumn = columns[1];
      const sortFn = dateColumn.meta?.sortFn;

      expect(sortFn).toBeDefined();

      const earlierDate = dayjs.utc().subtract(2, 'day').toDate();
      const laterDate = dayjs.utc().subtract(1, 'day').toDate();

      const rowA = {
        pledgeDate: earlierDate,
      } as InterfacePledgeTableRow;
      const rowB = {
        pledgeDate: laterDate,
      } as InterfacePledgeTableRow;

      const ascendingResult = sortFn?.(rowA, rowB);
      const descendingResult = sortFn?.(rowB, rowA);

      expect(ascendingResult).toBeLessThan(0);
      expect(descendingResult).toBeGreaterThan(0);
    });
  });

  describe('amount column', () => {
    it('should display amount with USD currency symbol', () => {
      const columns = getPledgeColumns(defaultProps);
      const amountColumn = columns[2];

      render(
        <>
          {renderColumnCell(amountColumn, { amount: 1000, currency: 'USD' })}
        </>,
      );

      const cell = screen.getByTestId('amountCell');
      expect(cell).toHaveTextContent('$');
      expect(cell).toHaveTextContent('1,000');
    });

    it('should display amount with EUR currency symbol', () => {
      const columns = getPledgeColumns(defaultProps);
      const amountColumn = columns[2];

      render(
        <>{renderColumnCell(amountColumn, { amount: 500, currency: 'EUR' })}</>,
      );

      const cell = screen.getByTestId('amountCell');
      expect(cell).toHaveTextContent('€');
      expect(cell).toHaveTextContent('500');
    });
  });

  describe('donated column', () => {
    it('should display zero with currency symbol', () => {
      const columns = getPledgeColumns(defaultProps);
      const donatedColumn = columns[3];

      render(<>{renderColumnCell(donatedColumn, { currency: 'USD' })}</>);

      const cell = screen.getByTestId('paidCell');
      expect(cell).toHaveTextContent('$0');
    });
  });

  describe('action column', () => {
    it('should call handleOpenModal with edit mode on edit button click', async () => {
      const columns = getPledgeColumns(defaultProps);
      const actionColumn = columns[4];

      const originalPledge = {
        id: '1',
        amount: 100,
        currency: 'USD',
        createdAt: dayjs.utc().toISOString(),
        pledger: {
          id: 'u1',
          name: 'John Doe',
          avatarURL: null,
        },
      };

      const row = { id: '1', amount: 100, original: originalPledge };

      render(<>{renderColumnCell(actionColumn, row)}</>);

      const editButton = screen.getByTestId('editPledgeBtn');
      await user.click(editButton);

      await waitFor(() => {
        expect(mockHandleOpenModal).toHaveBeenCalledWith(
          originalPledge,
          'edit',
        );
      });
    });
  });

  describe('edge cases', () => {
    it('should handle row with zero amount', () => {
      const columns = getPledgeColumns(defaultProps);
      const amountColumn = columns[2];

      render(
        <>{renderColumnCell(amountColumn, { amount: 0, currency: 'USD' })}</>,
      );

      const cell = screen.getByTestId('amountCell');
      expect(cell).toHaveTextContent('$0');
    });

    it('should handle row with missing amount (defaults to 0)', () => {
      const columns = getPledgeColumns(defaultProps);
      const amountColumn = columns[2];

      render(<>{renderColumnCell(amountColumn, { currency: 'USD' })}</>);

      const cell = screen.getByTestId('amountCell');
      expect(cell).toHaveTextContent('$0');
    });

    it('should handle missing currency (defaults to empty string)', () => {
      const columns = getPledgeColumns(defaultProps);
      const amountColumn = columns[2];

      render(<>{renderColumnCell(amountColumn, { amount: 100 })}</>);

      const cell = screen.getByTestId('amountCell');
      expect(cell).toHaveTextContent('100');
      expect(cell.textContent?.trim()).toBe('100');
    });

    it('should handle missing pledgeDate (defaults to hyphen)', () => {
      const columns = getPledgeColumns(defaultProps);
      const dateColumn = columns[1];

      const result = renderColumnCell(dateColumn, {});
      expect(result).toBe('-');
    });

    it('should handle keydown with Enter/Space/Tab as expected', async () => {
      const columns = getPledgeColumns(defaultProps);
      const pledgersColumn = columns[0];
      const row = {
        id: '1',
        users: [
          { id: 'u1', name: 'Main', avatarURL: null },
          { id: 'u2', name: 'Extra', avatarURL: null },
        ],
      };

      render(<>{renderColumnCell(pledgersColumn, row)}</>);
      const moreContainer = screen.getByTestId('moreContainer-1');

      // Test Enter key
      mockHandleClick.mockClear();
      moreContainer.focus();
      await user.keyboard('{Enter}'); // Using bracket notation sometimes works differently
      await waitFor(() => {
        expect(mockHandleClick).toHaveBeenCalledTimes(1);
      });

      // Test Space key
      mockHandleClick.mockClear();
      moreContainer.focus();
      await user.keyboard(' ');
      await waitFor(() => {
        expect(mockHandleClick).toHaveBeenCalledTimes(1);
      });

      // Test Tab key
      mockHandleClick.mockClear();
      moreContainer.focus();
      await user.keyboard('{Tab}');
      await waitFor(() => {
        expect(mockHandleClick).not.toHaveBeenCalled();
      });
    });
  });
});
