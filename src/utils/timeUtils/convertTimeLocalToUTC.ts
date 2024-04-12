export const convertTimeLocalToUTC = (timeString: string): string => {
  const [hours, minutes, seconds] = timeString.split(':').map(Number);

  const localTime = new Date();
  localTime.setUTCHours(hours);
  localTime.setUTCMinutes(minutes);
  localTime.setUTCSeconds(seconds);

  const formattedHours = ('0' + localTime.getUTCHours()).slice(-2);
  const formattedMinutes = ('0' + localTime.getUTCMinutes()).slice(-2);
  const formattedSeconds = ('0' + localTime.getUTCSeconds()).slice(-2);

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};
