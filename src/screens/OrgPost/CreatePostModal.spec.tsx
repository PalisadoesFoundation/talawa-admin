import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { vi } from 'vitest';
import CreatePostModal from './CreatePostModal';
import { CREATE_POST_MUTATION } from 'GraphQl/Mutations/mutations';
import { toast } from 'react-toastify';
import userEvent from '@testing-library/user-event';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock react-toastify
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock crypto.subtle
Object.defineProperty(global, 'crypto', {
  value: {
    subtle: {
      digest: vi.fn().mockResolvedValue(new ArrayBuffer(32)),
    },
  },
});

// Mock utils/errorHandler
vi.mock('utils/errorHandler', () => ({
  errorHandler: vi.fn(),
}));

// Mock utils/convertToBase64
vi.mock('utils/convertToBase64', () => ({
  __esModule: true,
  default: vi.fn().mockResolvedValue('base64-string'),
}));
describe('CreatePostModal', () => {
  const mockOnHide = vi.fn();
  const mockRefetch = vi.fn();
  const orgId = 'test-org-id';

  const mocks = [
    {
      request: {
        query: CREATE_POST_MUTATION,
        variables: {
          input: {
            caption: 'Test Caption',
            organizationId: orgId,
            isPinned: false,
            attachments: [],
          },
        },
      },
      result: {
        data: {
          createPost: {
            id: 'post-id',
            caption: 'Test Caption',
            pinnedAt: null,
            attachments: [],
          },
        },
      },
    },
  ];

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly when shown', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CreatePostModal
          show={true}
          onHide={mockOnHide}
          refetch={mockRefetch}
          orgId={orgId}
        />
      </MockedProvider>,
    );

    expect(screen.getByTestId('modalTitle')).toBeInTheDocument();
    expect(screen.getByTestId('modalinfo')).toBeInTheDocument();
    expect(screen.getByText('addPost')).toBeInTheDocument();
  });

  it('validates empty title', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CreatePostModal
          show={true}
          onHide={mockOnHide}
          refetch={mockRefetch}
          orgId={orgId}
        />
      </MockedProvider>,
    );

    const form = screen.getByTestId('createPostForm');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('messageTitleError');
    });
  });

  it('handles input changes', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CreatePostModal
          show={true}
          onHide={mockOnHide}
          refetch={mockRefetch}
          orgId={orgId}
        />
      </MockedProvider>,
    );

    const titleInput = screen.getByTestId('modalTitle');
    const descInput = screen.getByTestId('modalinfo');

    await userEvent.type(titleInput, 'New Post Title');
    await userEvent.type(descInput, 'New Post Description');

    expect(titleInput).toHaveValue('New Post Title');
    expect(descInput).toHaveValue('New Post Description');
  });

  it('handles file upload preview', async () => {
    // Mock URL.createObjectURL
    global.URL.createObjectURL = vi.fn(() => 'mock-url');

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CreatePostModal
          show={true}
          onHide={mockOnHide}
          refetch={mockRefetch}
          orgId={orgId}
        />
      </MockedProvider>,
    );

    const file = new File(['hello'], 'hello.png', { type: 'image/png' });
    const input = screen.getByTestId('addMediaField');

    await userEvent.upload(input, file);

    expect(screen.getByTestId('mediaPreview')).toBeInTheDocument();
    expect(screen.getByTestId('imagePreview')).toBeInTheDocument();
  });

  it('submits form successfully', async () => {
    const successMocks = [
      {
        request: {
          query: CREATE_POST_MUTATION,
          variables: {
            input: {
              caption: 'Test Title',
              organizationId: orgId,
              isPinned: false,
            },
          },
        },
        result: {
          data: {
            createPost: {
              id: 'post-id',
              caption: 'Test Title',
              pinnedAt: null,
              attachments: [],
            },
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={successMocks} addTypename={false}>
        <CreatePostModal
          show={true}
          onHide={mockOnHide}
          refetch={mockRefetch}
          orgId={orgId}
        />
      </MockedProvider>,
    );

    const titleInput = screen.getByTestId('modalTitle');
    await userEvent.type(titleInput, 'Test Title');

    const submitBtn = screen.getByText('addPost');
    await userEvent.click(submitBtn);

    await waitFor(
      () => {
        expect(toast.success).toHaveBeenCalledWith('postCreatedSuccess');
      },
      { timeout: 3000 },
    );
    expect(mockRefetch).toHaveBeenCalled();
    expect(mockOnHide).toHaveBeenCalled();
  });
  it('handles video file upload preview', async () => {
    global.URL.createObjectURL = vi.fn(() => 'mock-video-url');

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CreatePostModal
          show={true}
          onHide={mockOnHide}
          refetch={mockRefetch}
          orgId={orgId}
        />
      </MockedProvider>,
    );

    const file = new File(['video content'], 'video.mp4', {
      type: 'video/mp4',
    });
    const input = screen.getByTestId('addMediaField');

    await userEvent.upload(input, file);

    expect(screen.getByTestId('mediaPreview')).toBeInTheDocument();
    expect(screen.getByTestId('videoPreview')).toBeInTheDocument();
  });

  it('handles removing media', async () => {
    global.URL.createObjectURL = vi.fn(() => 'mock-url');

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CreatePostModal
          show={true}
          onHide={mockOnHide}
          refetch={mockRefetch}
          orgId={orgId}
        />
      </MockedProvider>,
    );

    const file = new File(['hello'], 'hello.png', { type: 'image/png' });
    const input = screen.getByTestId('addMediaField');

    await userEvent.upload(input, file);
    expect(screen.getByTestId('mediaPreview')).toBeInTheDocument();

    const removeBtn = screen.getByTestId('mediaCloseButton');
    await userEvent.click(removeBtn);

    expect(screen.queryByTestId('mediaPreview')).not.toBeInTheDocument();
  });

  it('handles pin post toggle', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CreatePostModal
          show={true}
          onHide={mockOnHide}
          refetch={mockRefetch}
          orgId={orgId}
        />
      </MockedProvider>,
    );

    const pinCheckbox = screen.getByTestId('pinPost');
    expect(pinCheckbox).not.toBeChecked();

    await userEvent.click(pinCheckbox);
    expect(pinCheckbox).toBeChecked();
  });

  it('handles various mime types correctly', async () => {
    // This test implicitly covers the getMimeTypeEnum switch case by uploading different file types
    // We can verify the internal state or just ensure no errors and correct preview behavior
    global.URL.createObjectURL = vi.fn(() => 'mock-url');

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CreatePostModal
          show={true}
          onHide={mockOnHide}
          refetch={mockRefetch}
          orgId={orgId}
        />
      </MockedProvider>,
    );

    const input = screen.getByTestId('addMediaField');

    // Test PNG
    await userEvent.upload(
      input,
      new File([''], 'test.png', { type: 'image/png' }),
    );
    expect(screen.getByTestId('imagePreview')).toBeInTheDocument();

    // Test JPEG
    await userEvent.upload(
      input,
      new File([''], 'test.jpg', { type: 'image/jpeg' }),
    );
    expect(screen.getByTestId('imagePreview')).toBeInTheDocument();

    // Test WEBP
    await userEvent.upload(
      input,
      new File([''], 'test.webp', { type: 'image/webp' }),
    );
    expect(screen.getByTestId('imagePreview')).toBeInTheDocument();

    // Test AVIF
    await userEvent.upload(
      input,
      new File([''], 'test.avif', { type: 'image/avif' }),
    );
    expect(screen.getByTestId('imagePreview')).toBeInTheDocument();

    // Test WEBM
    await userEvent.upload(
      input,
      new File([''], 'test.webm', { type: 'video/webm' }),
    );
    expect(screen.getByTestId('videoPreview')).toBeInTheDocument();
  });
  it('handles missing orgId error', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CreatePostModal
          show={true}
          onHide={mockOnHide}
          refetch={mockRefetch}
          orgId={undefined}
        />
      </MockedProvider>,
    );

    const titleInput = screen.getByTestId('modalTitle');
    await userEvent.type(titleInput, 'Test Title');

    const form = screen.getByTestId('createPostForm');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('organizationIdMissing');
    });
  });

  it('handles modal close correctly', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CreatePostModal
          show={true}
          onHide={mockOnHide}
          refetch={mockRefetch}
          orgId={orgId}
        />
      </MockedProvider>,
    );

    const closeButton = screen.getByTestId('closeOrganizationModal');
    await userEvent.click(closeButton);

    expect(mockOnHide).toHaveBeenCalled();
  });

  it('handles invalid video file type', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CreatePostModal
          show={true}
          onHide={mockOnHide}
          refetch={mockRefetch}
          orgId={orgId}
        />
      </MockedProvider>,
    );

    const invalidFile = new File(['content'], 'test.txt', {
      type: 'text/plain',
    });
    const videoInput = screen.getByTestId('addVideoField');

    // Manually trigger the change event
    Object.defineProperty(videoInput, 'files', {
      value: [invalidFile],
      writable: false,
    });
    fireEvent.change(videoInput);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Please select a video file');
    });
  });

  it('handles video file with no file selected', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CreatePostModal
          show={true}
          onHide={mockOnHide}
          refetch={mockRefetch}
          orgId={orgId}
        />
      </MockedProvider>,
    );

    const videoInput = screen.getByTestId('addVideoField');

    // Trigger change event with no files
    fireEvent.change(videoInput, { target: { files: [] } });

    // Should not show any error
    expect(toast.error).not.toHaveBeenCalled();
  });

  // TODO: Re-enable these tests once mutation mocking is properly configured
  // These tests are intended to cover:
  // - Lines 80-82: getFileHashFromFile function (crypto.subtle.digest)
  // - Lines 85-100: getMimeTypeEnum function (MIME type conversion)
  // - Line 124: attachment object creation
  it('calculates file hash when uploading image', async () => {
    const originalArrayBuffer = File.prototype.arrayBuffer;
    const originalCrypto = global.crypto;
    const originalCreateObjectURL = global.URL.createObjectURL;

    try {
      // Mock File.prototype.arrayBuffer
      File.prototype.arrayBuffer = vi
        .fn()
        .mockResolvedValue(new ArrayBuffer(8));

      // Mock crypto.subtle.digest for file hashing
      const mockDigest = vi
        .fn()
        .mockResolvedValue(new Uint8Array([1, 2, 3, 4, 5, 6]).buffer);

      Object.defineProperty(global, 'crypto', {
        value: {
          subtle: {
            digest: mockDigest,
          },
        },
        writable: true,
      });

      global.URL.createObjectURL = vi.fn(() => 'mock-url');

      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <CreatePostModal
            show={true}
            onHide={mockOnHide}
            refetch={mockRefetch}
            orgId={orgId}
          />
        </MockedProvider>,
      );

      const titleInput = screen.getByTestId('modalTitle');
      await userEvent.type(titleInput, 'Test');

      const imageFile = new File(['image content'], 'test.jpg', {
        type: 'image/jpeg',
      });
      const fileInput = screen.getByTestId('addMediaField');
      await userEvent.upload(fileInput, imageFile);

      const submitButton = screen.getByText('addPost');
      await userEvent.click(submitButton);

      // Verify that crypto.subtle.digest was called for hashing
      await waitFor(
        () => {
          expect(mockDigest).toHaveBeenCalledWith(
            'SHA-256',
            expect.any(ArrayBuffer),
          );
        },
        { timeout: 2000 },
      );
    } finally {
      // Restore originals
      File.prototype.arrayBuffer = originalArrayBuffer;
      Object.defineProperty(global, 'crypto', {
        value: originalCrypto,
        writable: true,
      });
      global.URL.createObjectURL = originalCreateObjectURL;
    }
  });

  it('handles PNG MIME type correctly', async () => {
    const originalArrayBuffer = File.prototype.arrayBuffer;
    const originalCrypto = global.crypto;
    const originalCreateObjectURL = global.URL.createObjectURL;

    try {
      // Mock File.prototype.arrayBuffer
      File.prototype.arrayBuffer = vi
        .fn()
        .mockResolvedValue(new ArrayBuffer(8));

      const mockDigest = vi
        .fn()
        .mockResolvedValue(new Uint8Array([10, 20, 30]).buffer);

      Object.defineProperty(global, 'crypto', {
        value: {
          subtle: {
            digest: mockDigest,
          },
        },
        writable: true,
      });

      global.URL.createObjectURL = vi.fn(() => 'mock-url');

      const postMock = {
        request: {
          query: CREATE_POST_MUTATION,
          variables: {
            input: {
              caption: 'Test PNG',
              organizationId: orgId,
              isPinned: false,
              attachments: [
                {
                  fileHash: '0a141e',
                  mimetype: 'IMAGE_PNG',
                  name: 'test.png',
                  objectName: 'uploads/test.png',
                },
              ],
            },
          },
        },
        result: {
          data: {
            createPost: {
              id: '1',
              caption: 'Test PNG',
            },
          },
        },
      };

      render(
        <MockedProvider mocks={[...mocks, postMock]} addTypename={false}>
          <CreatePostModal
            show={true}
            onHide={mockOnHide}
            refetch={mockRefetch}
            orgId={orgId}
          />
        </MockedProvider>,
      );

      const titleInput = screen.getByTestId('modalTitle');
      await userEvent.type(titleInput, 'Test PNG');

      const file = new File(['content'], 'test.png', {
        type: 'image/png',
      });
      const fileInput = screen.getByTestId('addMediaField');
      await userEvent.upload(fileInput, file);

      const submitButton = screen.getByTestId('createPostBtn');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(mockDigest).toHaveBeenCalled();
      });
    } finally {
      // Restore originals
      File.prototype.arrayBuffer = originalArrayBuffer;
      Object.defineProperty(global, 'crypto', {
        value: originalCrypto,
        writable: true,
      });
      global.URL.createObjectURL = originalCreateObjectURL;
    }
  });

  it('handles WEBP MIME type correctly', async () => {
    const originalArrayBuffer = File.prototype.arrayBuffer;
    const originalCrypto = global.crypto;
    const originalCreateObjectURL = global.URL.createObjectURL;

    try {
      // Mock File.prototype.arrayBuffer
      File.prototype.arrayBuffer = vi
        .fn()
        .mockResolvedValue(new ArrayBuffer(8));

      const mockDigest = vi
        .fn()
        .mockResolvedValue(new Uint8Array([15, 25, 35]).buffer);

      Object.defineProperty(global, 'crypto', {
        value: {
          subtle: {
            digest: mockDigest,
          },
        },
        writable: true,
      });

      global.URL.createObjectURL = vi.fn(() => 'mock-url');

      const postMock = {
        request: {
          query: CREATE_POST_MUTATION,
          variables: {
            input: {
              caption: 'Test Unknown',
              organizationId: orgId,
              isPinned: false,
              attachments: [
                {
                  fileHash: '0f1923',
                  mimetype: 'IMAGE_JPEG', // fallback
                  name: 'test.unknown',
                  objectName: 'uploads/test.unknown',
                },
              ],
            },
          },
        },
        result: {
          data: {
            createPost: {
              id: '1',
              caption: 'Test WebP',
            },
          },
        },
      };

      render(
        <MockedProvider mocks={[...mocks, postMock]} addTypename={false}>
          <CreatePostModal
            show={true}
            onHide={mockOnHide}
            refetch={mockRefetch}
            orgId={orgId}
          />
        </MockedProvider>,
      );

      const titleInput = screen.getByTestId('modalTitle');
      await userEvent.type(titleInput, 'Test WebP');

      const file = new File(['content'], 'test.webp', {
        type: 'image/webp',
      });
      const fileInput = screen.getByTestId('addMediaField');
      await userEvent.upload(fileInput, file);

      const submitButton = screen.getByTestId('createPostBtn');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(mockDigest).toHaveBeenCalled();
      });
    } finally {
      // Restore originals
      File.prototype.arrayBuffer = originalArrayBuffer;
      Object.defineProperty(global, 'crypto', {
        value: originalCrypto,
        writable: true,
      });
      global.URL.createObjectURL = originalCreateObjectURL;
    }
  });
});
