import { describe, it, expect, afterEach, vi } from 'vitest';
import React from 'react';
import dayjs from 'dayjs';
import {
  renderHeader,
  renderCellValue,
  getCellValue,
  toSearchableString,
} from './utils';

afterEach(() => {
  vi.clearAllMocks();
});

describe('DataTable utils', () => {
  describe('renderHeader', () => {
    it('returns plain string headers as-is', () => {
      const result = renderHeader('Name');
      expect(result).toBe('Name');
    });

    it('returns empty string header as-is', () => {
      const result = renderHeader('');
      expect(result).toBe('');
    });

    it('calls function headers and returns their result', () => {
      const headerFn = (): string => 'Dynamic Header';
      const result = renderHeader(headerFn);
      expect(result).toBe('Dynamic Header');
    });

    it('returns ReactNode from function headers', () => {
      const headerFn = (): React.ReactNode =>
        React.createElement('span', null, 'React Header');
      const result = renderHeader(headerFn);
      expect(React.isValidElement(result)).toBe(true);
    });

    it('returns ReactNode headers directly', () => {
      const reactNode = React.createElement('div', { key: 'test' }, 'Content');
      const result = renderHeader(reactNode);
      expect(React.isValidElement(result)).toBe(true);
    });
  });

  describe('renderCellValue', () => {
    it('returns empty string for null', () => {
      const result = renderCellValue(null);
      expect(result).toBe('');
    });

    it('returns empty string for undefined', () => {
      const result = renderCellValue(undefined);
      expect(result).toBe('');
    });

    it('returns string values as-is', () => {
      const result = renderCellValue('test value');
      expect(result).toBe('test value');
    });

    it('returns empty string values as-is', () => {
      const result = renderCellValue('');
      expect(result).toBe('');
    });

    it('returns number values as-is', () => {
      const result = renderCellValue(42);
      expect(result).toBe(42);
    });

    it('returns zero as-is', () => {
      const result = renderCellValue(0);
      expect(result).toBe(0);
    });

    it('returns negative numbers as-is', () => {
      const result = renderCellValue(-123);
      expect(result).toBe(-123);
    });

    it('returns JSON string for plain objects', () => {
      const obj = { name: 'test', value: 123 };
      const result = renderCellValue(obj);
      expect(result).toBe(JSON.stringify(obj));
    });

    it('returns JSON string for arrays', () => {
      const arr = [1, 2, 3];
      const result = renderCellValue(arr);
      expect(result).toBe(JSON.stringify(arr));
    });

    it('returns JSON string for nested objects', () => {
      const nested = { a: { b: { c: 1 } } };
      const result = renderCellValue(nested);
      expect(result).toBe(JSON.stringify(nested));
    });

    it('returns empty string when JSON.stringify throws (circular object)', () => {
      // Create a circular reference
      const circular: Record<string, unknown> = { name: 'test' };
      circular.self = circular;

      const result = renderCellValue(circular);
      expect(result).toBe('');
    });

    it('returns JSON string for boolean values', () => {
      expect(renderCellValue(true)).toBe('true');
      expect(renderCellValue(false)).toBe('false');
    });

    it('returns JSON string for Date objects', () => {
      const date = dayjs().subtract(30, 'days').toDate();
      const result = renderCellValue(date);
      expect(result).toBe(JSON.stringify(date));
    });
  });

  describe('getCellValue', () => {
    interface ITestRow {
      id: number;
      name: string;
      email: string;
      nested?: { value: string };
    }

    const testRow: ITestRow = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      nested: { value: 'nested value' },
    };

    it('returns value using property accessor (key)', () => {
      const result = getCellValue<ITestRow, string>(testRow, 'name');
      expect(result).toBe('John Doe');
    });

    it('returns number using property accessor', () => {
      const result = getCellValue<ITestRow, number>(testRow, 'id');
      expect(result).toBe(1);
    });

    it('returns nested object using property accessor', () => {
      const result = getCellValue<ITestRow, { value: string } | undefined>(
        testRow,
        'nested',
      );
      expect(result).toEqual({ value: 'nested value' });
    });

    it('returns value using function accessor', () => {
      const accessor = (row: ITestRow): string => row.name.toUpperCase();
      const result = getCellValue<ITestRow, string>(testRow, accessor);
      expect(result).toBe('JOHN DOE');
    });

    it('returns computed value using function accessor', () => {
      const accessor = (row: ITestRow): string => `${row.name} <${row.email}>`;
      const result = getCellValue<ITestRow, string>(testRow, accessor);
      expect(result).toBe('John Doe <john@example.com>');
    });

    it('returns nested value using function accessor', () => {
      const accessor = (row: ITestRow): string => row.nested?.value ?? '';
      const result = getCellValue<ITestRow, string>(testRow, accessor);
      expect(result).toBe('nested value');
    });

    it('handles undefined property values with property accessor', () => {
      const rowWithoutNested: ITestRow = {
        id: 2,
        name: 'Jane',
        email: 'jane@example.com',
      };
      const result = getCellValue<ITestRow, { value: string } | undefined>(
        rowWithoutNested,
        'nested',
      );
      expect(result).toBeUndefined();
    });
  });

  describe('toSearchableString', () => {
    it('returns empty string for null', () => {
      const result = toSearchableString(null);
      expect(result).toBe('');
    });

    it('returns empty string for undefined', () => {
      const result = toSearchableString(undefined);
      expect(result).toBe('');
    });

    it('returns ISO string for valid Date', () => {
      const date = dayjs().subtract(15, 'days').toDate();
      const result = toSearchableString(date);
      expect(result).toBe(date.toISOString());
    });

    it('returns empty string for invalid Date', () => {
      const invalidDate = new Date('invalid');
      const result = toSearchableString(invalidDate);
      expect(result).toBe('');
    });

    it('returns empty string for Date created from NaN', () => {
      const nanDate = new Date(NaN);
      const result = toSearchableString(nanDate);
      expect(result).toBe('');
    });

    it('converts number to string', () => {
      expect(toSearchableString(42)).toBe('42');
      expect(toSearchableString(0)).toBe('0');
      expect(toSearchableString(-123)).toBe('-123');
      expect(toSearchableString(3.14)).toBe('3.14');
    });

    it('converts boolean to string', () => {
      expect(toSearchableString(true)).toBe('true');
      expect(toSearchableString(false)).toBe('false');
    });

    it('returns string values as-is', () => {
      expect(toSearchableString('hello')).toBe('hello');
      expect(toSearchableString('')).toBe('');
      expect(toSearchableString('  spaces  ')).toBe('  spaces  ');
    });

    it('converts object to string representation', () => {
      const obj = { name: 'test' };
      const result = toSearchableString(obj);
      expect(result).toBe('[object Object]');
    });

    it('converts array to string representation', () => {
      const arr = [1, 2, 3];
      const result = toSearchableString(arr);
      expect(result).toBe('1,2,3');
    });

    it('converts BigInt to string', () => {
      const bigInt = BigInt(9007199254740991);
      const result = toSearchableString(bigInt);
      expect(result).toBe('9007199254740991');
    });

    it('converts Symbol to string', () => {
      const symbol = Symbol('test');
      const result = toSearchableString(symbol);
      expect(result).toBe('Symbol(test)');
    });
  });
});
