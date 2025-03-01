import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { PRESIGNED_URL } from 'GraphQl/Mutations/mutations';
import { useMinioUpload } from './MinioUpload';
import { vi } from 'vitest';

const TestComponent = ({
  onUploadComplete,
}: {
  onUploadComplete: (result: { fileUrl: string; objectName: string }) => void;
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
    } catch (error) {
      setStatus('error');
      console.error(error);
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
  const successMocks = [
    {
      request: {
        query: PRESIGNED_URL,
        variables: {
          input: {
            fileName: 'test.png',
            fileType: 'image/png',
            organizationId: 'test-org-id',
          },
        },
      },
      result: {
        data: {
          createPresignedUrl: {
            presignedUrl: 'https://minio-test.com/upload/url',
            fileUrl: 'https://minio-test.com/file/url',
            objectName: 'test-object-name',
          },
        },
      },
    },
  ];

  beforeEach((): void => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      } as Response),
    );
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should upload a file and call onUploadComplete with the expected result', async (): Promise<void> => {
    const handleComplete = vi.fn();

    render(
      <MockedProvider mocks={successMocks} addTypename={false}>
        <TestComponent onUploadComplete={handleComplete} />
      </MockedProvider>,
    );

    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    const input = screen.getByTestId('file-input') as HTMLInputElement;

    Object.defineProperty(input, 'files', {
      value: [file],
      writable: false,
    });

    fireEvent.change(input);

    // Expect initial status to be "uploading"
    expect(screen.getByTestId('status').textContent).toBe('uploading');

    await waitFor(() => {
      expect(screen.getByTestId('status').textContent).toBe('success');
    });

    expect(handleComplete).toHaveBeenCalledWith({
      fileUrl: 'https://minio-test.com/file/url',
      objectName: 'test-object-name',
    });
  });

  it('should set status to error if mutation returns no data or missing createPresignedUrl', async () => {
    const errorMock = [
      {
        request: {
          query: PRESIGNED_URL,
          variables: {
            input: {
              fileName: 'test.png',
              fileType: 'image/png',
              organizationId: 'test-org-id',
            },
          },
        },
        result: {
          data: {
            createPresignedUrl: null,
          },
        },
      },
    ];

    const handleComplete = vi.fn();

    render(
      <MockedProvider mocks={errorMock} addTypename={false}>
        <TestComponent onUploadComplete={handleComplete} />
      </MockedProvider>,
    );

    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    const input = screen.getByTestId('file-input') as HTMLInputElement;
    Object.defineProperty(input, 'files', {
      value: [file],
      writable: false,
    });

    fireEvent.change(input);

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
      <MockedProvider mocks={successMocks} addTypename={false}>
        <TestComponent onUploadComplete={handleComplete} />
      </MockedProvider>,
    );

    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    const input = screen.getByTestId('file-input') as HTMLInputElement;
    Object.defineProperty(input, 'files', {
      value: [file],
      writable: false,
    });
    fireEvent.change(input);

    await waitFor(() => {
      expect(screen.getByTestId('status').textContent).toBe('error');
    });

    expect(handleComplete).not.toHaveBeenCalled();
  });
});
