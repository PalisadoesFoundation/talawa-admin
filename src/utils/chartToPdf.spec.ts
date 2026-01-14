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
    vi.restoreAllMocks();
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

  test('handles cleanup when link is not appended to document.body', () => {
    const data = [['test']];

    // Mock link with parentNode not equal to document.body
    const mockLinkWithoutParent = {
      setAttribute: mockSetAttribute,
      click: mockClick,
      parentNode: null, // This will make the condition false
    } as unknown as HTMLAnchorElement;

    mockCreateElement = vi.fn().mockReturnValue(mockLinkWithoutParent);
    document.createElement =
      mockCreateElement as unknown as typeof document.createElement;

    exportToCSV(data, 'test.csv');

    // Should still call URL.revokeObjectURL but not removeChild
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('mock-url');
    expect(mockRemoveChild).not.toHaveBeenCalled();
  });

  test('handles cleanup when link.parentNode is different element', () => {
    const data = [['test']];

    // Mock link with parentNode as a different element (not document.body)
    const mockDifferentParent = document.createElement('div');
    const mockLinkWithDifferentParent = {
      setAttribute: mockSetAttribute,
      click: mockClick,
      parentNode: mockDifferentParent, // Different from document.body
    } as unknown as HTMLAnchorElement;

    mockCreateElement = vi.fn().mockReturnValue(mockLinkWithDifferentParent);
    document.createElement =
      mockCreateElement as unknown as typeof document.createElement;

    exportToCSV(data, 'test.csv');

    // Should still call URL.revokeObjectURL but not removeChild from document.body
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('mock-url');
    expect(mockRemoveChild).not.toHaveBeenCalled();
  });

  test('handles data with null and undefined values', () => {
    const data: (string | number | null | undefined)[][] = [
      ['Header1', 'Header2'],
      [null, 'Value2'],
      ['Value1', undefined],
      [0, ''],
    ];

    // Test the actual production behavior by passing the raw data
    // The production code will convert null/undefined using String(cell)
    exportToCSV(data as unknown as (string | number)[][], 'test.csv');

    expect(mockCreateElement).toHaveBeenCalledWith('a');
    expect(mockClick).toHaveBeenCalled();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('mock-url');
  });

  test('handles data with mixed types including booleans', () => {
    const data: (string | number | boolean)[][] = [
      ['Header1', 'Header2', 'Header3'],
      [true, false, 'Value'],
      [123, 'String', 0],
    ];

    // Capture the CSV content by mocking Blob
    let capturedCsvContent = '';
    const mockBlob = new Blob([''], { type: 'text/csv' });
    global.Blob = vi.fn().mockImplementation((content) => {
      capturedCsvContent = content[0];
      return mockBlob;
    });

    // Test the actual production behavior by passing the raw data
    // The production code will convert boolean using String(cell)
    exportToCSV(data as unknown as (string | number)[][], 'test.csv');

    expect(mockCreateElement).toHaveBeenCalledWith('a');
    expect(mockClick).toHaveBeenCalled();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('mock-url');

    // Verify boolean coercion in CSV output
    expect(capturedCsvContent).toContain('true');
    expect(capturedCsvContent).toContain('false');
    expect(capturedCsvContent).toContain('Header1,Header2,Header3');
    expect(capturedCsvContent).toContain('123,String,0');
  });

  test('handles data with special characters and newlines', () => {
    const data: string[][] = [
      ['Header with "quotes"', 'Header with\nnewline'],
      ['Value with, comma', 'Value with "quotes" and\nnewline'],
    ];

    // Capture the CSV content by mocking Blob
    let capturedCsvContent = '';
    const mockBlob = new Blob([''], { type: 'text/csv' });
    global.Blob = vi.fn().mockImplementation((content) => {
      capturedCsvContent = content[0];
      return mockBlob;
    });

    exportToCSV(data, 'test.csv');

    expect(mockCreateElement).toHaveBeenCalledWith('a');
    expect(mockClick).toHaveBeenCalled();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('mock-url');

    // Verify CSV escaping works correctly
    expect(capturedCsvContent).toContain(
      '"Header with ""quotes""","Header with\nnewline"',
    );
    expect(capturedCsvContent).toContain(
      '"Value with, comma","Value with ""quotes"" and\nnewline"',
    );
  });

  test('throws error if data is null', () => {
    expect(() =>
      exportToCSV(null as unknown as (string | number)[][], 'test.csv'),
    ).toThrow('Data cannot be empty');
  });

  test('throws error if data is undefined', () => {
    expect(() =>
      exportToCSV(undefined as unknown as (string | number)[][], 'test.csv'),
    ).toThrow('Data cannot be empty');
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
      // Using fake timers with a dynamically generated date to test filename generation
      const mockDate = new Date();
      vi.setSystemTime(mockDate);

      const selectedCategory = 'Age & Demographics!';
      const categoryLabels = ['Group1'];
      const categoryData = [10];

      exportDemographicsToCSV(selectedCategory, categoryLabels, categoryData);

      // Compute expected filename dynamically based on mockDate
      const timestamp = mockDate.toISOString().replace(/:/g, '-');
      const expectedFilename = `age___demographics__demographics_${timestamp}.csv`;
      const downloadCalls = mockSetAttribute.mock.calls.filter(
        (call) => call[0] === 'download',
      );
      expect(downloadCalls[0][1]).toBe(expectedFilename);
      vi.useRealTimers();
    });

    test('handles whitespace-only selected category', () => {
      expect(() => exportDemographicsToCSV('   ', ['label'], [1])).toThrow(
        'Selected category is required',
      );
    });

    test('handles empty arrays with same length', () => {
      const selectedCategory = 'Test Category';
      const categoryLabels: string[] = [];
      const categoryData: number[] = [];

      expect(() =>
        exportDemographicsToCSV(selectedCategory, categoryLabels, categoryData),
      ).not.toThrow();

      // Verify that the export flow completed successfully
      expect(mockCreateElement).toHaveBeenCalledWith('a');
      expect(mockClick).toHaveBeenCalled();
      expect(URL.revokeObjectURL).toHaveBeenCalledWith('mock-url');
    });
  });
});
