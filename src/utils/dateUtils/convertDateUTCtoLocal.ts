export const convertDateUTCtoLocal = (utcDate: Date): Date => {
  const localDate = new Date(
    utcDate.toLocaleString(undefined, {
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }),
  );

  return localDate;
};
