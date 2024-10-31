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
            return cellStr.includes(',') ? `"${cellStr}"` : cellStr;
          })
          .join(','),
      )
      .join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  try {
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', finalFilename);
    document.body.appendChild(link);
    link.click();
  } finally {
    if (link.parentNode === document.body) {
      document.body.removeChild(link);
    }
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

  const heading = `${selectedCategory} Demographics`;
  const headers = [
    selectedCategory,
    'Count',
    'Age Distribution',
    'Gender Distribution',
  ];
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
