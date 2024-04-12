export function convertTimeUTCtoLocal(utcTimeString: string): string {
  const utcTime = new Date(utcTimeString);

  const hours = ('0' + utcTime.getUTCHours()).slice(-2);
  const minutes = ('0' + utcTime.getUTCMinutes()).slice(-2);
  const seconds = ('0' + utcTime.getUTCSeconds()).slice(-2);

  return `${hours}:${minutes}:${seconds}`;
}
