import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMinioDownload } from './MinioDownload';
import { useMutation } from '@apollo/client';

vi.mock('@apollo/client', () => ({
  useMutation: vi.fn(),
}));

describe('useMinioDownload', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const mockPresignedUrl = 'https://minio.example.com/presigned?token=abc123';

  it('should return a presigned URL when the mutation succeeds', async () => {
    const mutateFn = vi.fn().mockResolvedValue({
      data: { createGetfileUrl: { presignedUrl: mockPresignedUrl } },
    });
    (useMutation as unknown as ReturnType<typeof vi.fn>).mockReturnValue([
      mutateFn,
    ]);

    const { result } = renderHook(() => useMinioDownload());

    let url: string = '';
    await act(async () => {
      url = await result.current.getFileFromMinio('object-name', 'org-id');
    });

    expect(url).toBe(mockPresignedUrl);
    expect(mutateFn).toHaveBeenCalledWith({
      variables: {
        input: { objectName: 'object-name', organizationId: 'org-id' },
      },
    });
  });

  it('should throw an error if no presigned URL is returned', async () => {
    const mutateFn = vi.fn().mockResolvedValue({
      data: { createGetfileUrl: { presignedUrl: '' } },
    });
    (useMutation as unknown as ReturnType<typeof vi.fn>).mockReturnValue([
      mutateFn,
    ]);

    const { result } = renderHook(() => useMinioDownload());

    await act(async () => {
      await expect(
        result.current.getFileFromMinio('object-name', 'org-id'),
      ).rejects.toThrow('Failed to get presigned URL');
    });
  });

  it('should throw an error when the mutation itself fails', async () => {
    const errorMessage = 'Mutation error';
    const mutateFn = vi.fn().mockRejectedValue(new Error(errorMessage));
    (useMutation as unknown as ReturnType<typeof vi.fn>).mockReturnValue([
      mutateFn,
    ]);

    const { result } = renderHook(() => useMinioDownload());

    await act(async () => {
      await expect(
        result.current.getFileFromMinio('object-name', 'org-id'),
      ).rejects.toThrow(errorMessage);
    });
  });
});
