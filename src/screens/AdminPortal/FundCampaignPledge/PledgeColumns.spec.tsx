import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getPledgeColumns } from './PledgeColumns';
import type { GridRenderCellParams } from 'shared-components/DataGridWrapper';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

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
  afterEach(() => {
    vi.clearAllMocks();
  });

  const mockT = vi.fn((key: string) => key);
  const mockTCommon = vi.fn((key: string, options?: { count?: number }) =>
    options?.count ? `${key}_${options.count}` : key,
  );
  const mockHandleClick = vi.fn();
  const mockHandleOpenModal = vi.fn();
  const mockHandleDeleteClick = vi.fn();

  const defaultProps = {
    t: mockT as unknown as Parameters<typeof getPledgeColumns>[0]['t'],
    tCommon: mockTCommon as unknown as Parameters<
      typeof getPledgeColumns
    >[0]['tCommon'],
    id: 'test-popover-id',
    handleClick: mockHandleClick,
    handleOpenModal: mockHandleOpenModal,
    handleDeleteClick: mockHandleDeleteClick,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 5 column definitions', () => {
    const columns = getPledgeColumns(defaultProps);
    expect(columns).toHaveLength(5);
    expect(columns.map((c) => c.field)).toEqual([
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

      const params = {
        row: {
          id: '1',
          users: [
            { id: 'u1', name: 'John Doe', avatarURL: 'http://avatar.jpg' },
          ],
        },
      } as GridRenderCellParams;

      const { container } = render(<>{pledgersColumn.renderCell?.(params)}</>);

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(container.querySelector('img')).toHaveAttribute(
        'src',
        'http://avatar.jpg',
      );
    });

    it('should render Avatar component when no avatarURL', () => {
      const columns = getPledgeColumns(defaultProps);
      const pledgersColumn = columns[0];

      const params = {
        row: {
          id: '1',
          users: [{ id: 'u1', name: 'Jane Doe', avatarURL: null }],
        },
      } as GridRenderCellParams;

      render(<>{pledgersColumn.renderCell?.(params)}</>);

      expect(screen.getByTestId('mock-avatar')).toBeInTheDocument();
      expect(screen.getAllByText('Jane Doe').length).toBeGreaterThan(0);
    });

    it('should display extra users count and handle click', () => {
      const columns = getPledgeColumns(defaultProps);
      const pledgersColumn = columns[0];

      const extraUsers = [
        { id: 'u2', name: 'Extra User 1', avatarURL: null },
        { id: 'u3', name: 'Extra User 2', avatarURL: null },
      ];
      const params = {
        row: {
          id: '1',
          users: [
            { id: 'u1', name: 'Main User', avatarURL: null },
            ...extraUsers,
          ],
        },
      } as GridRenderCellParams;

      render(<>{pledgersColumn.renderCell?.(params)}</>);

      const moreContainer = screen.getByTestId('moreContainer-1');
      expect(moreContainer).toBeInTheDocument();
      expect(moreContainer).toHaveTextContent('moreCount_2');

      fireEvent.click(moreContainer);
      expect(mockHandleClick).toHaveBeenCalledWith(
        expect.any(Object),
        extraUsers,
      );
    });

    it('should handle keyboard navigation on extra users container', () => {
      const columns = getPledgeColumns(defaultProps);
      const pledgersColumn = columns[0];

      const params = {
        row: {
          id: '1',
          users: [
            { id: 'u1', name: 'Main User', avatarURL: null },
            { id: 'u2', name: 'Extra User', avatarURL: null },
          ],
        },
      } as GridRenderCellParams;

      render(<>{pledgersColumn.renderCell?.(params)}</>);

      const moreContainer = screen.getByTestId('moreContainer-1');
      expect(moreContainer).toHaveAttribute('role', 'button');
      expect(moreContainer).toHaveAttribute('tabIndex', '0');

      fireEvent.keyDown(moreContainer, { key: 'Enter' });
      expect(mockHandleClick).toHaveBeenCalled();
    });

    it('should handle empty users array', () => {
      const columns = getPledgeColumns(defaultProps);
      const pledgersColumn = columns[0];

      const params = {
        row: {
          id: '1',
          users: [],
        },
      } as GridRenderCellParams;

      const { container } = render(<>{pledgersColumn.renderCell?.(params)}</>);

      expect(container.querySelector('[data-testid^="mainUser-"]')).toBeNull();
      expect(
        container.querySelector('[data-testid^="moreContainer-"]'),
      ).toBeNull();
    });

    it('should handle undefined users (falls back to empty array)', () => {
      const columns = getPledgeColumns(defaultProps);
      const pledgersColumn = columns[0];

      const params = {
        row: {
          id: '1',
        },
      } as GridRenderCellParams;

      const { container } = render(<>{pledgersColumn.renderCell?.(params)}</>);

      expect(container.querySelector('[data-testid^="mainUser-"]')).toBeNull();
    });
  });

  describe('pledgeDate column', () => {
    it('should format date using DD/MM/YYYY format', () => {
      const columns = getPledgeColumns(defaultProps);
      const dateColumn = columns[1];

      const pledgeDate = dayjs.utc().month(2).date(15).hour(10).toISOString();
      const params = {
        row: {
          pledgeDate,
        },
      } as GridRenderCellParams;

      const result = dateColumn.renderCell?.(params);
      expect(result).toBe(dayjs.utc(pledgeDate).format('DD/MM/YYYY'));
    });
  });

  describe('amount column', () => {
    it('should display amount with USD currency symbol', () => {
      const columns = getPledgeColumns(defaultProps);
      const amountColumn = columns[2];

      const params = {
        row: {
          amount: 1000,
          currency: 'USD',
        },
      } as GridRenderCellParams;

      render(<>{amountColumn.renderCell?.(params)}</>);

      const cell = screen.getByTestId('amountCell');
      expect(cell).toHaveTextContent('$');
      expect(cell).toHaveTextContent('1,000');
    });

    it('should display amount with EUR currency symbol', () => {
      const columns = getPledgeColumns(defaultProps);
      const amountColumn = columns[2];

      const params = {
        row: {
          amount: 500,
          currency: 'EUR',
        },
      } as GridRenderCellParams;

      render(<>{amountColumn.renderCell?.(params)}</>);

      const cell = screen.getByTestId('amountCell');
      expect(cell).toHaveTextContent('€');
      expect(cell).toHaveTextContent('500');
    });
  });

  describe('donated column', () => {
    it('should display zero with currency symbol', () => {
      const columns = getPledgeColumns(defaultProps);
      const donatedColumn = columns[3];

      const params = {
        row: {
          currency: 'USD',
        },
      } as GridRenderCellParams;

      render(<>{donatedColumn.renderCell?.(params)}</>);

      const cell = screen.getByTestId('paidCell');
      expect(cell).toHaveTextContent('$0');
    });
  });

  describe('action column', () => {
    it('should call handleOpenModal with edit mode on edit button click', () => {
      const columns = getPledgeColumns(defaultProps);
      const actionColumn = columns[4];

      const row = { id: '1', amount: 100 };
      const params = { row } as GridRenderCellParams;

      render(<>{actionColumn.renderCell?.(params)}</>);

      const editButton = screen.getByTestId('editPledgeBtn');
      fireEvent.click(editButton);

      expect(mockHandleOpenModal).toHaveBeenCalledWith(row, 'edit');
    });

    it('should call handleDeleteClick on delete button click', () => {
      const columns = getPledgeColumns(defaultProps);
      const actionColumn = columns[4];

      const row = { id: '1', amount: 100 };
      const params = { row } as GridRenderCellParams;

      render(<>{actionColumn.renderCell?.(params)}</>);

      const deleteButton = screen.getByTestId('deletePledgeBtn');
      fireEvent.click(deleteButton);

      expect(mockHandleDeleteClick).toHaveBeenCalledWith(row);
    });
  });

  describe('edge cases', () => {
    it('should handle row with zero amount', () => {
      const columns = getPledgeColumns(defaultProps);
      const amountColumn = columns[2];

      const params = {
        row: {
          amount: 0,
          currency: 'USD',
        },
      } as GridRenderCellParams;

      render(<>{amountColumn.renderCell?.(params)}</>);

      const cell = screen.getByTestId('amountCell');
      expect(cell).toHaveTextContent('$0');
    });

    it('should handle row with missing amount (defaults to 0)', () => {
      const columns = getPledgeColumns(defaultProps);
      const amountColumn = columns[2];

      const params = {
        row: {
          currency: 'USD',
        },
      } as GridRenderCellParams;

      render(<>{amountColumn.renderCell?.(params)}</>);

      const cell = screen.getByTestId('amountCell');
      expect(cell).toHaveTextContent('$0');
    });

    it('should handle missing currency (defaults to empty string)', () => {
      const columns = getPledgeColumns(defaultProps);
      const amountColumn = columns[2];

      const params = {
        row: {
          amount: 100,
        },
      } as GridRenderCellParams;

      render(<>{amountColumn.renderCell?.(params)}</>);

      const cell = screen.getByTestId('amountCell');
      expect(cell).toHaveTextContent('100');
      expect(cell.textContent?.trim()).toBe('100');
    });

    it('should handle missing pledgeDate (defaults to hyphen)', () => {
      const columns = getPledgeColumns(defaultProps);
      const dateColumn = columns[1];

      const params = {
        row: {},
      } as GridRenderCellParams;

      const result = dateColumn.renderCell?.(params);
      expect(result).toBe('-');
    });

    it('should handle keydown with Enter/Space/Tab as expected', () => {
      const columns = getPledgeColumns(defaultProps);
      const pledgersColumn = columns[0];
      const params = {
        row: {
          id: '1',
          users: [
            { id: 'u1', name: 'Main', avatarURL: null },
            { id: 'u2', name: 'Extra', avatarURL: null },
          ],
        },
      } as GridRenderCellParams;

      render(<>{pledgersColumn.renderCell?.(params)}</>);
      const moreContainer = screen.getByTestId('moreContainer-1');

      // Enter
      mockHandleClick.mockClear();
      fireEvent.keyDown(moreContainer, { key: 'Enter' });
      expect(mockHandleClick).toHaveBeenCalledTimes(1);

      // Space
      mockHandleClick.mockClear();
      fireEvent.keyDown(moreContainer, { key: ' ' });
      expect(mockHandleClick).toHaveBeenCalledTimes(1);

      // Tab (should not trigger)
      mockHandleClick.mockClear();
      fireEvent.keyDown(moreContainer, { key: 'Tab' });
      expect(mockHandleClick).not.toHaveBeenCalled();
    });
  });
});
