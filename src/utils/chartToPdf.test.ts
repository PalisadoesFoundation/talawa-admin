import {
  exportToCSV,
  exportTrendsToCSV,
  exportDemographicsToCSV,
} from './chartToPdf';

describe('CSV Export Functions', () => {
  let mockCreateElement: jest.SpyInstance;
  let mockClick: jest.SpyInstance;
  let mockSetAttribute: jest.SpyInstance;

  beforeEach(() => {
    // Mock URL methods
    global.URL.createObjectURL = jest.fn(() => 'mock-url');
    global.URL.revokeObjectURL = jest.fn();

    // Mock DOM methods
    mockSetAttribute = jest.fn();
    mockClick = jest.fn();
    const mockLink = {
      setAttribute: mockSetAttribute,
      click: mockClick,
    } as unknown as HTMLAnchorElement;

    mockCreateElement = jest
      .spyOn(document, 'createElement')
      .mockReturnValue(mockLink as HTMLAnchorElement);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('CSV Export Functions', () => {
    let mockCreateElement: jest.SpyInstance;
    let mockAppendChild: jest.SpyInstance;
    let mockRemoveChild: jest.SpyInstance;
    let mockClick: jest.SpyInstance;
    let mockSetAttribute: jest.SpyInstance;

    beforeEach(() => {
      // Mock URL methods
      global.URL.createObjectURL = jest.fn(() => 'mock-url');
      global.URL.revokeObjectURL = jest.fn();

      // Mock DOM methods
      mockSetAttribute = jest.fn();
      mockClick = jest.fn();
      const mockLink = {
        setAttribute: mockSetAttribute,
        click: mockClick,
        parentNode: document.body, // Add this to trigger removeChild
      } as unknown as HTMLAnchorElement;

      mockCreateElement = jest
        .spyOn(document, 'createElement')
        .mockReturnValue(mockLink as HTMLAnchorElement);
      mockAppendChild = jest
        .spyOn(document.body, 'appendChild')
        .mockImplementation(() => mockLink as HTMLAnchorElement);
      mockRemoveChild = jest
        .spyOn(document.body, 'removeChild')
        .mockImplementation(() => mockLink as HTMLAnchorElement);
    });

    test('exports data to CSV with proper formatting', () => {
      const data = [
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
  });

  describe('exportTrendsToCSV', () => {
    test('exports attendance trends data correctly', () => {
      const eventLabels = ['Event1', 'Event2'];
      const attendeeCounts = [10, 20];
      const maleCounts = [5, 10];
      const femaleCounts = [4, 8];
      const otherCounts = [1, 2];

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
      const categoryLabels = ['0-18', '19-30', '31+'];
      const categoryData = [10, 20, 15];

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
      jest.useFakeTimers();
      const mockDate = new Date('2023-01-01T00:00:00.000Z');
      jest.setSystemTime(mockDate);

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
      jest.useRealTimers();
    });
  });
});
