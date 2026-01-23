vi.resetModules();
vi.mock('./filehash');

beforeAll(() => {
  Object.defineProperty(File.prototype, 'arrayBuffer', {
    configurable: true,
    value: function () {
      const encoder = new TextEncoder();
      return Promise.resolve(encoder.encode('dummy content').buffer);
    },
  });
});

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';
import { PRESIGNED_URL } from 'GraphQl/Mutations/mutations';
import { useMinioUpload } from './MinioUpload';
import { vi, type Mock } from 'vitest';
import { calculateFileHash } from './filehash';

const TestComponent = ({
  onUploadComplete,
}: {
  onUploadComplete: (result: { objectName: string; fileHash: string }) => void;
}): JSX.Element => {
  const { uploadFileToMinio } = useMinioUpload();
  const [status, setStatus] = React.useState('idle');

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const files = e.target.files;
    if (!files || !files[0]) return;
    const file = files[0];

    setStatus('uploading');
    try {
      const result = await uploadFileToMinio(file, 'test-org-id');
      setStatus('success');
      onUploadComplete(result);
    } catch (error: unknown) {
      setStatus('error');
      console.error('Error in file upload process:', error);
    }
  };

  return (
    <div>
      <input type="file" data-testid="file-input" onChange={handleFileChange} />
      <div data-testid="status">{status}</div>
    </div>
  );
};

describe('Minio Upload Integration', (): void => {
  beforeEach(() => {
    vi.clearAllMocks();
    (calculateFileHash as Mock).mockResolvedValue('mocked-file-hash');
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      } as Response),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const successMocks = [
    {
      request: {
        query: PRESIGNED_URL,
        variables: {
          input: {
            fileName: 'test.png',
            organizationId: 'test-org-id',
            fileHash: 'mocked-file-hash',
          },
        },
      },
      result: {
        data: {
          createPresignedUrl: {
            fileUrl: null,
            presignedUrl: 'https://minio-test.com/upload/url',
            objectName: 'test-object-name',
            requiresUpload: true,
          },
        },
      },
    },
  ];

  it('should upload a file and call onUploadComplete with the expected result', async (): Promise<void> => {
    const handleComplete = vi.fn();

    render(
      <MockedProvider mocks={successMocks}>
        <TestComponent onUploadComplete={handleComplete} />
      </MockedProvider>,
    );

    const user = userEvent.setup();
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    const input = screen.getByTestId('file-input') as HTMLInputElement;
    await user.upload(input, file);

    await waitFor(() => {
      expect(screen.getByTestId('status').textContent).toBe('success');
    });

    expect(handleComplete).toHaveBeenCalledWith({
      objectName: 'test-object-name',
      fileHash: 'mocked-file-hash',
    });

    expect(global.fetch).toHaveBeenCalledWith(
      'https://minio-test.com/upload/url',
      expect.objectContaining({
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': 'image/png',
        },
      }),
    );
  });

  it('should log error "Failed to get presigned URL" when mutation returns no createPresignedUrl', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const missingUrlMocks = [
      {
        request: {
          query: PRESIGNED_URL,
          variables: {
            input: {
              fileName: 'test.png',
              organizationId: 'test-org-id',
              fileHash: 'mocked-file-hash',
            },
          },
        },
        result: {
          data: { createPresignedUrl: null },
        },
      },
    ];
    const handleComplete = vi.fn();

    render(
      <MockedProvider mocks={missingUrlMocks}>
        <TestComponent onUploadComplete={handleComplete} />
      </MockedProvider>,
    );

    const user = userEvent.setup();
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    const input = screen.getByTestId('file-input') as HTMLInputElement;
    await user.upload(input, file);

    await waitFor(() => {
      expect(screen.getByTestId('status').textContent).toBe('error');
    });

    expect(handleComplete).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalled();
    expect(consoleSpy.mock.calls[0][1].message).toBe(
      'Failed to get presigned URL',
    );
    consoleSpy.mockRestore();
  });

  it('should set status to error if mutation returns no data or missing createPresignedUrl', async () => {
    const errorMock = [
      {
        request: {
          query: PRESIGNED_URL,
          variables: {
            input: {
              fileName: 'test.png',
              organizationId: 'test-org-id',
              fileHash: 'mocked-file-hash',
            },
          },
        },
        result: {
          data: null,
        },
      },
    ];

    const handleComplete = vi.fn();

    render(
      <MockedProvider mocks={errorMock}>
        <TestComponent onUploadComplete={handleComplete} />
      </MockedProvider>,
    );

    const user = userEvent.setup();
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    const input = screen.getByTestId('file-input') as HTMLInputElement;
    await user.upload(input, file);

    await waitFor(() => {
      expect(screen.getByTestId('status').textContent).toBe('error');
    });

    expect(handleComplete).not.toHaveBeenCalled();
  });

  it('should set status to error when file upload fails', async () => {
    (
      global.fetch as unknown as {
        mockImplementationOnce: (fn: () => Promise<Response>) => void;
      }
    ).mockImplementationOnce(() => Promise.resolve({ ok: false } as Response));
    const handleComplete = vi.fn();

    render(
      <MockedProvider mocks={successMocks}>
        <TestComponent onUploadComplete={handleComplete} />
      </MockedProvider>,
    );

    const user = userEvent.setup();
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    const input = screen.getByTestId('file-input') as HTMLInputElement;
    await user.upload(input, file);

    await waitFor(() => {
      expect(screen.getByTestId('status').textContent).toBe('error');
    });

    expect(handleComplete).not.toHaveBeenCalled();
  });

  it('should log error "File upload failed" when file upload returns not ok', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <MockedProvider mocks={successMocks}>
        <TestComponent onUploadComplete={vi.fn()} />
      </MockedProvider>,
    );

    (global.fetch as unknown as () => Promise<Response>) = vi.fn(() =>
      Promise.resolve({ ok: false } as Response),
    );

    const user = userEvent.setup();
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    const input = screen.getByTestId('file-input') as HTMLInputElement;
    await user.upload(input, file);

    await waitFor(() => {
      expect(screen.getByTestId('status').textContent).toBe('error');
    });

    expect(consoleSpy).toHaveBeenCalled();
    const errorArg = consoleSpy.mock.calls[0][1] || consoleSpy.mock.calls[0][0];
    const errorMessage = errorArg?.message || errorArg;
    expect(errorMessage).toBe('File upload failed');
    consoleSpy.mockRestore();
  });
});
