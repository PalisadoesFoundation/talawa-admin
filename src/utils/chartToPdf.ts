type CSVData = (string | number)[][];

export const exportToCSV = (data: CSVData, filename: string): void => {
  const csvContent = 'data:text/csv;charset=utf-8,' + data.map((e) => e.join(',')).join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
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
  exportToCSV(data, `${selectedCategory.toLowerCase()}_demographics.csv`);
};
