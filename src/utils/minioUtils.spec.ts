import { normalizeMinioUrl } from './minioUtils';

describe('normalizeMinioUrl', () => {
  it('should replace minio hostname with localhost', () => {
    const url = 'http://minio:9000/bucket/file';
    const expected = 'http://localhost:9000/bucket/file';
    expect(normalizeMinioUrl(url)).toBe(expected);
  });

  it('should NOT replace 127.0.0.1 hostname with localhost', () => {
    const url = 'http://127.0.0.1:9002/bucket/file';
    expect(normalizeMinioUrl(url)).toBe(url);
  });

  it('should not change other hostnames', () => {
    const url = 'http://example.com/bucket/file';
    expect(normalizeMinioUrl(url)).toBe(url);
  });

  it('should handle ports correctly', () => {
    const url = 'http://minio:1234/bucket/file';
    const expected = 'http://localhost:1234/bucket/file';
    expect(normalizeMinioUrl(url)).toBe(expected);
  });

  it('should return original url if invalid', () => {
    const url = 'not-a-url';
    expect(normalizeMinioUrl(url)).toBe(url);
  });
});
