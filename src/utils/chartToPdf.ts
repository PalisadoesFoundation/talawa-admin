import i18n from './i18n';

type CSVData = (string | number)[][];

export const exportToCSV = (data: CSVData, filename: string): void => {
  if (!data?.length) {
    throw new Error('Data cannot be empty');
  }

  if (!filename) {
    throw new Error('Filename is required');
  }

  // Ensure .csv extension
  const finalFilename = filename.endsWith('.csv')
    ? filename
    : `${filename}.csv`;
  const csvContent =
    // Properly escape and quote CSV content
    'data:text/csv;charset=utf-8,' +
    data
      .map((row) =>
        row
          .map((cell) => {
            const cellStr = String(cell);
            // Escape double quotes by doubling them
            const escapedCell = cellStr.replace(/"/g, '""');
            // Enclose cell in double quotes if it contains commas, newlines, or double quotes
            return /[",\n]/.test(escapedCell)
              ? `"${escapedCell}"`
              : escapedCell;
          })
          .join(','),
      )
      .join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  try {
    link.setAttribute('href', url);
    link.setAttribute('download', finalFilename);
    document.body.appendChild(link);
    link.click();
  } finally {
    if (link.parentNode === document.body) {
      document.body.removeChild(link);
    }
    URL.revokeObjectURL(url); // Clean up the URL object
  }
};

export const exportTrendsToCSV = (
  eventLabels: string[],
  attendeeCounts: number[],
  maleCounts: number[],
  femaleCounts: number[],
  otherCounts: number[],
): void => {
  const heading = 'Attendance Trends';
  const headers = [
    'Date',
    'Attendee Count',
    'Male Attendees',
    'Female Attendees',
    'Other Attendees',
  ];
  const data: CSVData = [
    [heading],
    [],
    headers,
    ...eventLabels.map((label, index) => [
      label,
      attendeeCounts[index],
      maleCounts[index],
      femaleCounts[index],
      otherCounts[index],
    ]),
  ];
  exportToCSV(data, 'attendance_trends.csv');
};

export const exportDemographicsToCSV = (
  selectedCategory: string,
  categoryLabels: string[],
  categoryData: number[],
): void => {
  if (!selectedCategory?.trim()) {
    throw new Error('Selected category is required');
  }

  if (categoryLabels.length !== categoryData.length) {
    throw new Error('Labels and data arrays must have the same length');
  }

  const heading = i18n.t('csv.demographics', { category: selectedCategory });
  const headers = [selectedCategory, 'Count'];
  const data: CSVData = [
    [heading],
    [],
    headers,
    ...categoryLabels.map((label, index) => [label, categoryData[index]]),
  ];
  const safeCategory = selectedCategory
    .replace(/[^a-z0-9]/gi, '_')
    .toLowerCase();
  const timestamp = new Date().toISOString().replace(/[:]/g, '-');
  exportToCSV(data, `${safeCategory}_demographics_${timestamp}.csv`);
};
