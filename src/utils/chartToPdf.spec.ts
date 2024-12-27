import { expect, describe, test, beforeEach, afterEach, vi } from 'vitest';
import type { Mock } from 'vitest';
import {
  exportToCSV,
  exportTrendsToCSV,
  exportDemographicsToCSV,
} from './chartToPdf';

describe('CSV Export Functions', () => {
  // Define more specific types for our mocks
  let mockCreateElement: Mock;
  let mockAppendChild: Mock;
  let mockRemoveChild: Mock;
  let mockClick: Mock;
  let mockSetAttribute: Mock;
  let mockLink: HTMLAnchorElement;

  beforeEach(() => {
    // Mock URL methods with specific types
    (global.URL.createObjectURL as unknown) = vi.fn(() => 'mock-url');
    (global.URL.revokeObjectURL as unknown) = vi.fn();

    // Mock DOM methods
    mockSetAttribute = vi.fn();
    mockClick = vi.fn();
    mockLink = {
      setAttribute: mockSetAttribute,
      click: mockClick,
      parentNode: document.body,
    } as unknown as HTMLAnchorElement;

    // Mock createElement with proper type assertion
    mockCreateElement = vi.fn().mockReturnValue(mockLink);
    document.createElement =
      mockCreateElement as unknown as typeof document.createElement;

    // Mock appendChild and removeChild with proper type assertions
    mockAppendChild = vi.fn().mockReturnValue(mockLink);
    mockRemoveChild = vi.fn().mockReturnValue(mockLink);

    document.body.appendChild =
      mockAppendChild as unknown as typeof document.body.appendChild;
    document.body.removeChild =
      mockRemoveChild as unknown as typeof document.body.removeChild;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('exports data to CSV with proper formatting', () => {
    const data: string[][] = [
      ['Header1', 'Header2'],
      ['Value1', 'Value2'],
      ['Value with, comma', 'Value with "quotes"'],
    ];

    exportToCSV(data, 'test.csv');

    expect(mockCreateElement).toHaveBeenCalledWith('a');
    expect(mockSetAttribute).toHaveBeenCalledWith('href', 'mock-url');
    expect(mockSetAttribute).toHaveBeenCalledWith('download', 'test.csv');
    expect(mockAppendChild).toHaveBeenCalled();
    expect(mockClick).toHaveBeenCalled();
    expect(mockRemoveChild).toHaveBeenCalled();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('mock-url');
  });

  test('throws error if data is empty', () => {
    expect(() => exportToCSV([], 'test.csv')).toThrow('Data cannot be empty');
  });

  test('throws error if filename is empty', () => {
    expect(() => exportToCSV([['data']], '')).toThrow('Filename is required');
  });

  test('adds .csv extension if missing', () => {
    const data = [['test']];
    exportToCSV(data, 'filename');
    expect(mockSetAttribute).toHaveBeenCalledWith('download', 'filename.csv');
  });

  describe('exportTrendsToCSV', () => {
    test('exports attendance trends data correctly', () => {
      const eventLabels: string[] = ['Event1', 'Event2'];
      const attendeeCounts: number[] = [10, 20];
      const maleCounts: number[] = [5, 10];
      const femaleCounts: number[] = [4, 8];
      const otherCounts: number[] = [1, 2];

      exportTrendsToCSV(
        eventLabels,
        attendeeCounts,
        maleCounts,
        femaleCounts,
        otherCounts,
      );

      expect(mockCreateElement).toHaveBeenCalledWith('a');
      expect(mockSetAttribute).toHaveBeenCalledWith(
        'download',
        'attendance_trends.csv',
      );
      expect(mockClick).toHaveBeenCalled();
    });
  });

  describe('exportDemographicsToCSV', () => {
    test('exports demographics data correctly', () => {
      const selectedCategory = 'Age Groups';
      const categoryLabels: string[] = ['0-18', '19-30', '31+'];
      const categoryData: number[] = [10, 20, 15];

      exportDemographicsToCSV(selectedCategory, categoryLabels, categoryData);

      expect(mockCreateElement).toHaveBeenCalledWith('a');
      expect(mockClick).toHaveBeenCalled();
      expect(mockSetAttribute).toHaveBeenCalledWith('href', 'mock-url');
    });

    test('throws error if selected category is empty', () => {
      expect(() => exportDemographicsToCSV('', ['label'], [1])).toThrow(
        'Selected category is required',
      );
    });

    test('throws error if labels and data arrays have different lengths', () => {
      expect(() =>
        exportDemographicsToCSV('Category', ['label1', 'label2'], [1]),
      ).toThrow('Labels and data arrays must have the same length');
    });

    test('creates safe filename with timestamp', () => {
      vi.useFakeTimers();
      const mockDate = new Date('2023-01-01T00:00:00.000Z');
      vi.setSystemTime(mockDate);

      const selectedCategory = 'Age & Demographics!';
      const categoryLabels = ['Group1'];
      const categoryData = [10];

      exportDemographicsToCSV(selectedCategory, categoryLabels, categoryData);

      const expectedFilename =
        'age___demographics__demographics_2023-01-01T00-00-00.000Z.csv';
      const downloadCalls = mockSetAttribute.mock.calls.filter(
        (call) => call[0] === 'download',
      );
      expect(downloadCalls[0][1]).toBe(expectedFilename);
      vi.useRealTimers();
    });
  });
});
