import { describe, it, expect } from 'vitest';
import { ROW_HEIGHT, PAGE_SIZE, dataGridStyle } from './utils';

describe('ReportingTable utils', () => {
  describe('Constants', () => {
    it('should export ROW_HEIGHT as 60', () => {
      expect(ROW_HEIGHT).toBe(60);
      expect(typeof ROW_HEIGHT).toBe('number');
    });

    it('should export PAGE_SIZE as 10', () => {
      expect(PAGE_SIZE).toBe(10);
      expect(typeof PAGE_SIZE).toBe('number');
    });
  });

  describe('dataGridStyle', () => {
    it('should have correct top-level properties', () => {
      expect(dataGridStyle).toHaveProperty('borderRadius');
      expect(dataGridStyle).toHaveProperty('backgroundColor');
      expect(dataGridStyle.borderRadius).toBe('var(--table-head-radius)');
      expect(dataGridStyle.backgroundColor).toBe('var(--row-background)');
    });

    it('should have MuiDataGrid-row styles', () => {
      expect(dataGridStyle).toHaveProperty('& .MuiDataGrid-row');
      const rowStyle = dataGridStyle['& .MuiDataGrid-row'];
      expect(rowStyle).toHaveProperty(
        'backgroundColor',
        'var(--row-background)',
      );
      expect(rowStyle).toHaveProperty('&:focus-within');
      expect(rowStyle['&:focus-within']).toEqual({ outline: 'none' });
    });

    it('should have MuiDataGrid-row hover styles', () => {
      expect(dataGridStyle).toHaveProperty('& .MuiDataGrid-row:hover');
      expect(dataGridStyle['& .MuiDataGrid-row:hover']).toEqual({
        backgroundColor: 'var(--row-background)',
      });
    });

    it('should have MuiDataGrid-row hovered state styles', () => {
      expect(dataGridStyle).toHaveProperty('& .MuiDataGrid-row.Mui-hovered');
      expect(dataGridStyle['& .MuiDataGrid-row.Mui-hovered']).toEqual({
        backgroundColor: 'var(--row-background)',
      });
    });

    it('should have MuiDataGrid-cell focus styles', () => {
      expect(dataGridStyle).toHaveProperty('& .MuiDataGrid-cell:focus');
      expect(dataGridStyle['& .MuiDataGrid-cell:focus']).toEqual({
        outline: 'none',
      });
    });

    it('should have MuiDataGrid-cell focus-within styles', () => {
      expect(dataGridStyle).toHaveProperty('& .MuiDataGrid-cell:focus-within');
      expect(dataGridStyle['& .MuiDataGrid-cell:focus-within']).toEqual({
        outline: 'none',
      });
    });

    it('should have all expected style keys', () => {
      const expectedKeys = [
        'borderRadius',
        'backgroundColor',
        '& .MuiDataGrid-row',
        '& .MuiDataGrid-row:hover',
        '& .MuiDataGrid-row.Mui-hovered',
        '& .MuiDataGrid-cell:focus',
        '& .MuiDataGrid-cell:focus-within',
      ];

      expectedKeys.forEach((key) => {
        expect(dataGridStyle).toHaveProperty(key);
      });
    });

    it('should be a plain object', () => {
      expect(typeof dataGridStyle).toBe('object');
      expect(dataGridStyle).not.toBeNull();
      expect(Array.isArray(dataGridStyle)).toBe(false);
    });
  });
});
