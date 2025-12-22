/**
 * Normalizes presigned URLs by replacing Docker internal hostnames with browser-accessible ones.
 * Specifically, it replaces "minio" with "localhost".
 *
 * @param url - The presigned URL to normalize
 * @returns The normalized URL
 */
export const normalizeMinioUrl = (url: string): string => {
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname === 'minio') {
      parsedUrl.hostname = 'localhost';
      return parsedUrl.toString();
    }
    return url;
  } catch {
    // In case of invalid URL, return original to let it fail naturally or succeed if it's relative
    return url;
  }
};
