export function formatDate(dateString: string): string {
  if (!dateString) {
    throw new Error('Date string is required');
  }
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date string provided');
  }
  const day = date.getDate();
  const year = date.getFullYear();

  const getSuffix = (day: number): string => {
    if (day >= 11 && day <= 13) return 'th';
    const lastDigit = day % 10;
    switch (lastDigit) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  };
  const suffix = getSuffix(day);

  const monthName = new Intl.DateTimeFormat('en', { month: 'short' }).format(
    date,
  );

  return `${day}${suffix} ${monthName} ${year}`;
}
