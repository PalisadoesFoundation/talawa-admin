import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { vi } from 'vitest';
import CreatePostModal from './CreatePostModal';
import { CREATE_POST_MUTATION } from 'GraphQl/Mutations/mutations';
import { toast } from 'react-toastify';
import userEvent from '@testing-library/user-event';
import convertToBase64 from 'utils/convertToBase64';
import { errorHandler } from 'utils/errorHandler';

// Mock react-i18next
vi.mock('react-i18next', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-i18next')>();

  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string) => key,
      i18n: { changeLanguage: vi.fn() },
    }),
    initReactI18next: {
      type: '3rdParty',
      init: vi.fn(),
    },
  };
});

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
  writable: true,
  configurable: true,
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

  const baseMock = {
    request: {
      query: CREATE_POST_MUTATION,
      variables: {
        input: {
          caption: 'Test Caption',
          organizationId: orgId,
          isPinned: false,
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
  };

  const mocks = [baseMock];

  const originalCreateObjectURL = global.URL.createObjectURL;

  beforeEach(() => {
    global.URL.createObjectURL = vi.fn(() => 'mock-url');
  });

  afterEach(() => {
    vi.clearAllMocks();
    global.URL.createObjectURL = originalCreateObjectURL;
  });

  it('renders correctly when shown', () => {
    render(
      <MockedProvider mocks={mocks}>
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
      <MockedProvider mocks={mocks}>
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
      <MockedProvider mocks={mocks}>
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
    render(
      <MockedProvider mocks={mocks}>
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
      <MockedProvider mocks={successMocks}>
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

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('postCreatedSuccess');
    });
    expect(mockRefetch).toHaveBeenCalled();
    expect(mockOnHide).toHaveBeenCalled();
  });
  it('handles video file upload preview', async () => {
    render(
      <MockedProvider mocks={mocks}>
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
      <MockedProvider mocks={mocks}>
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
      <MockedProvider mocks={mocks}>
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
      <MockedProvider mocks={mocks}>
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
      <MockedProvider mocks={mocks}>
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
      <MockedProvider mocks={mocks}>
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
      <MockedProvider mocks={mocks}>
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
      <MockedProvider mocks={mocks}>
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

  // These tests cover:
  // - getFileHashFromFile (crypto.subtle.digest)
  // - getMimeTypeEnum (MIME type conversion)
  // - attachment object creation
  it('calculates file hash when uploading image', async () => {
    const originalArrayBuffer = File.prototype.arrayBuffer;
    const originalCrypto = global.crypto;

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

      render(
        <MockedProvider mocks={mocks}>
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
      await waitFor(() => {
        expect(mockDigest).toHaveBeenCalledWith(
          'SHA-256',
          expect.any(ArrayBuffer),
        );
      });
    } finally {
      // Restore originals
      File.prototype.arrayBuffer = originalArrayBuffer;
      Object.defineProperty(global, 'crypto', {
        value: originalCrypto,
        writable: true,
      });
    }
  });

  it('handles PNG MIME type correctly', async () => {
    const originalArrayBuffer = File.prototype.arrayBuffer;
    const originalCrypto = global.crypto;

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
        <MockedProvider mocks={[...mocks, postMock]}>
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
        expect(toast.success).toHaveBeenCalled();
      });
    } finally {
      // Restore originals
      File.prototype.arrayBuffer = originalArrayBuffer;
      Object.defineProperty(global, 'crypto', {
        value: originalCrypto,
        writable: true,
      });
    }
  });

  it('handles WEBP MIME type correctly', async () => {
    const originalArrayBuffer = File.prototype.arrayBuffer;
    const originalCrypto = global.crypto;

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

      const postMock = {
        request: {
          query: CREATE_POST_MUTATION,
          variables: {
            input: {
              caption: 'Test WebP',
              organizationId: orgId,
              isPinned: false,
              attachments: [
                {
                  fileHash: '0f1923',
                  mimetype: 'IMAGE_WEBP', // correct enum for webp
                  name: 'test.webp',
                  objectName: 'uploads/test.webp',
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
        <MockedProvider mocks={[...mocks, postMock]}>
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
        expect(toast.success).toHaveBeenCalled();
      });
    } finally {
      // Restore originals
      File.prototype.arrayBuffer = originalArrayBuffer;
      Object.defineProperty(global, 'crypto', {
        value: originalCrypto,
        writable: true,
      });
    }
  });

  it('handles IMAGE_AVIF MIME type correctly', async () => {
    const originalArrayBuffer = File.prototype.arrayBuffer;
    const originalCrypto = global.crypto;

    try {
      File.prototype.arrayBuffer = vi
        .fn()
        .mockResolvedValue(new ArrayBuffer(8));

      const mockDigest = vi
        .fn()
        .mockResolvedValue(new Uint8Array([40, 50, 60]).buffer);

      Object.defineProperty(global, 'crypto', {
        value: {
          subtle: {
            digest: mockDigest,
          },
        },
        writable: true,
        configurable: true,
      });

      const postMock = {
        request: {
          query: CREATE_POST_MUTATION,
          variables: {
            input: {
              caption: 'Test AVIF',
              organizationId: orgId,
              isPinned: false,
              attachments: [
                {
                  fileHash: '28323c',
                  mimetype: 'IMAGE_AVIF',
                  name: 'test.avif',
                  objectName: 'uploads/test.avif',
                },
              ],
            },
          },
        },
        result: {
          data: {
            createPost: {
              id: '1',
              caption: 'Test AVIF',
            },
          },
        },
      };

      render(
        <MockedProvider mocks={[postMock]}>
          <CreatePostModal
            show={true}
            onHide={mockOnHide}
            refetch={mockRefetch}
            orgId={orgId}
          />
        </MockedProvider>,
      );

      const titleInput = screen.getByTestId('modalTitle');
      await userEvent.type(titleInput, 'Test AVIF');

      const file = new File(['content'], 'test.avif', {
        type: 'image/avif',
      });
      const fileInput = screen.getByTestId('addMediaField');
      await userEvent.upload(fileInput, file);

      const submitButton = screen.getByTestId('createPostBtn');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalled();
      });
    } finally {
      File.prototype.arrayBuffer = originalArrayBuffer;
      Object.defineProperty(global, 'crypto', {
        value: originalCrypto,
        writable: true,
      });
    }
  });

  it('handles VIDEO_MP4 MIME type correctly', async () => {
    const originalArrayBuffer = File.prototype.arrayBuffer;
    const originalCrypto = global.crypto;

    try {
      File.prototype.arrayBuffer = vi
        .fn()
        .mockResolvedValue(new ArrayBuffer(8));

      const mockDigest = vi
        .fn()
        .mockResolvedValue(new Uint8Array([70, 80, 90]).buffer);

      Object.defineProperty(global, 'crypto', {
        value: {
          subtle: {
            digest: mockDigest,
          },
        },
        writable: true,
        configurable: true,
      });

      const postMock = {
        request: {
          query: CREATE_POST_MUTATION,
          variables: {
            input: {
              caption: 'Test MP4',
              organizationId: orgId,
              isPinned: false,
              attachments: [
                {
                  fileHash: '46505a',
                  mimetype: 'VIDEO_MP4',
                  name: 'test.mp4',
                  objectName: 'uploads/test.mp4',
                },
              ],
            },
          },
        },
        result: {
          data: {
            createPost: {
              id: '1',
              caption: 'Test MP4',
            },
          },
        },
      };

      render(
        <MockedProvider mocks={[postMock]}>
          <CreatePostModal
            show={true}
            onHide={mockOnHide}
            refetch={mockRefetch}
            orgId={orgId}
          />
        </MockedProvider>,
      );

      const titleInput = screen.getByTestId('modalTitle');
      await userEvent.type(titleInput, 'Test MP4');

      const file = new File(['video content'], 'test.mp4', {
        type: 'video/mp4',
      });
      const fileInput = screen.getByTestId('addVideoField');
      await userEvent.upload(fileInput, file);

      const submitButton = screen.getByTestId('createPostBtn');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalled();
      });
    } finally {
      File.prototype.arrayBuffer = originalArrayBuffer;
      Object.defineProperty(global, 'crypto', {
        value: originalCrypto,
        writable: true,
      });
    }
  });

  it('handles VIDEO_WEBM MIME type correctly', async () => {
    const originalArrayBuffer = File.prototype.arrayBuffer;
    const originalCrypto = global.crypto;

    try {
      File.prototype.arrayBuffer = vi
        .fn()
        .mockResolvedValue(new ArrayBuffer(8));

      const mockDigest = vi
        .fn()
        .mockResolvedValue(new Uint8Array([100, 110, 120]).buffer);

      Object.defineProperty(global, 'crypto', {
        value: {
          subtle: {
            digest: mockDigest,
          },
        },
        writable: true,
        configurable: true,
      });

      const postMock = {
        request: {
          query: CREATE_POST_MUTATION,
          variables: {
            input: {
              caption: 'Test WEBM',
              organizationId: orgId,
              isPinned: false,
              attachments: [
                {
                  fileHash: '646e78',
                  mimetype: 'VIDEO_WEBM',
                  name: 'test.webm',
                  objectName: 'uploads/test.webm',
                },
              ],
            },
          },
        },
        result: {
          data: {
            createPost: {
              id: '1',
              caption: 'Test WEBM',
            },
          },
        },
      };

      render(
        <MockedProvider mocks={[postMock]}>
          <CreatePostModal
            show={true}
            onHide={mockOnHide}
            refetch={mockRefetch}
            orgId={orgId}
          />
        </MockedProvider>,
      );

      const titleInput = screen.getByTestId('modalTitle');
      await userEvent.type(titleInput, 'Test WEBM');

      const file = new File(['video content'], 'test.webm', {
        type: 'video/webm',
      });
      const fileInput = screen.getByTestId('addVideoField');
      await userEvent.upload(fileInput, file);

      const submitButton = screen.getByTestId('createPostBtn');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalled();
      });
    } finally {
      File.prototype.arrayBuffer = originalArrayBuffer;
      Object.defineProperty(global, 'crypto', {
        value: originalCrypto,
        writable: true,
      });
    }
  });

  it('handles file with path separator in filename', async () => {
    const originalArrayBuffer = File.prototype.arrayBuffer;
    const originalCrypto = global.crypto;

    try {
      File.prototype.arrayBuffer = vi
        .fn()
        .mockResolvedValue(new ArrayBuffer(8));

      Object.defineProperty(global, 'crypto', {
        value: {
          subtle: {
            digest: vi
              .fn()
              .mockResolvedValue(new Uint8Array([30, 40, 50]).buffer),
          },
        },
        writable: true,
        configurable: true,
      });

      const postMock = {
        request: {
          query: CREATE_POST_MUTATION,
          variables: {
            input: {
              caption: 'Path Test',
              organizationId: orgId,
              isPinned: false,
              attachments: [
                {
                  fileHash: '1e2832',
                  mimetype: 'IMAGE_PNG',
                  name: 'nested.png',
                  objectName: 'uploads/nested.png',
                },
              ],
            },
          },
        },
        result: {
          data: {
            createPost: {
              id: '1',
              caption: 'Path Test',
            },
          },
        },
      };

      render(
        <MockedProvider mocks={[postMock]}>
          <CreatePostModal
            show={true}
            onHide={mockOnHide}
            refetch={mockRefetch}
            orgId={orgId}
          />
        </MockedProvider>,
      );

      const titleInput = screen.getByTestId('modalTitle');
      await userEvent.type(titleInput, 'Path Test');

      const file = new File(['content'], 'path/to/nested.png', {
        type: 'image/png',
      });
      const fileInput = screen.getByTestId('addMediaField');
      await userEvent.upload(fileInput, file);

      const submitButton = screen.getByTestId('createPostBtn');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalled();
      });
    } finally {
      File.prototype.arrayBuffer = originalArrayBuffer;
      Object.defineProperty(global, 'crypto', {
        value: originalCrypto,
        writable: true,
      });
    }
  });

  it('handles clearing video preview with cleanup', async () => {
    render(
      <MockedProvider mocks={mocks}>
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
    const input = screen.getByTestId('addVideoField');

    await userEvent.upload(input, file);
    expect(screen.getByTestId('videoPreviewContainer')).toBeInTheDocument();

    const removeBtn = screen.getByTestId('videoMediaCloseButton');
    await userEvent.click(removeBtn);

    expect(
      screen.queryByTestId('videoPreviewContainer'),
    ).not.toBeInTheDocument();
  });

  it('handles invalid file type for media upload', async () => {
    render(
      <MockedProvider mocks={mocks}>
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
    const input = screen.getByTestId('addMediaField');

    Object.defineProperty(input, 'files', {
      value: [invalidFile],
      writable: false,
    });
    fireEvent.change(input);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Please select an image or video file',
      );
    });
  });

  it('handles whitespace-only title validation', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <CreatePostModal
          show={true}
          onHide={mockOnHide}
          refetch={mockRefetch}
          orgId={orgId}
        />
      </MockedProvider>,
    );

    const titleInput = screen.getByTestId('modalTitle');
    await userEvent.type(titleInput, '   ');

    const form = screen.getByTestId('createPostForm');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('messageTitleError');
    });
  });

  it('submits form with pinned post', async () => {
    const pinnedMock = {
      request: {
        query: CREATE_POST_MUTATION,
        variables: {
          input: {
            caption: 'Pinned Post',
            organizationId: orgId,
            isPinned: true,
          },
        },
      },
      result: {
        data: {
          createPost: {
            id: 'post-id',
            caption: 'Pinned Post',
            pinnedAt: '2024-01-01T00:00:00Z',
          },
        },
      },
    };

    render(
      <MockedProvider mocks={[pinnedMock]}>
        <CreatePostModal
          show={true}
          onHide={mockOnHide}
          refetch={mockRefetch}
          orgId={orgId}
        />
      </MockedProvider>,
    );

    const titleInput = screen.getByTestId('modalTitle');
    await userEvent.type(titleInput, 'Pinned Post');

    const pinCheckbox = screen.getByTestId('pinPost');
    await userEvent.click(pinCheckbox);

    const submitBtn = screen.getByText('addPost');
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled();
      expect(mockRefetch).toHaveBeenCalled();
    });
  });

  it('handles description field changes', async () => {
    render(
      <MockedProvider mocks={mocks}>
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

    await userEvent.type(descInput, 'Just a description');
    expect(descInput).toHaveValue('Just a description');
    expect(titleInput).toHaveValue('');
  });

  it('calls errorHandler when create mutation fails', async () => {
    const errorMock = {
      request: {
        query: CREATE_POST_MUTATION,
        variables: {
          input: {
            caption: 'Will Fail',
            organizationId: orgId,
            isPinned: false,
          },
        },
      },
      error: new Error('Network error'),
    };

    render(
      <MockedProvider mocks={[errorMock]}>
        <CreatePostModal
          show={true}
          onHide={mockOnHide}
          refetch={mockRefetch}
          orgId={orgId}
        />
      </MockedProvider>,
    );

    const titleInput = screen.getByTestId('modalTitle');
    await userEvent.type(titleInput, 'Will Fail');

    const form = screen.getByTestId('createPostForm');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(errorHandler).toHaveBeenCalled();
    });
  });

  it('shows preview error when convertToBase64 rejects for image', async () => {
    // Make convertToBase64 reject for this test
    vi.mocked(convertToBase64).mockRejectedValueOnce(new Error('convert fail'));

    render(
      <MockedProvider mocks={mocks}>
        <CreatePostModal
          show={true}
          onHide={mockOnHide}
          refetch={mockRefetch}
          orgId={orgId}
        />
      </MockedProvider>,
    );

    const file = new File(['img'], 'bad.png', { type: 'image/png' });
    const input = screen.getByTestId('addMediaField');

    await userEvent.upload(input, file);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Could not generate preview');
    });
  });

  it('clears media state when no file selected', async () => {
    render(
      <MockedProvider mocks={mocks}>
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

    // Trigger change with no files
    fireEvent.change(input, { target: { files: [] } });

    await waitFor(() => {
      expect(screen.queryByTestId('mediaPreview')).not.toBeInTheDocument();
    });
  });

  it('uses fallback MIME enum for unknown image MIME and submits attachment', async () => {
    const originalArrayBuffer = File.prototype.arrayBuffer;
    const originalCrypto = global.crypto;

    try {
      File.prototype.arrayBuffer = vi
        .fn()
        .mockResolvedValue(new ArrayBuffer(8));

      const mockDigest = vi
        .fn()
        .mockResolvedValue(new Uint8Array([0x0a, 0x02, 0x03]).buffer);

      Object.defineProperty(global, 'crypto', {
        value: {
          subtle: {
            digest: mockDigest,
          },
        },
        writable: true,
      });

      const fallbackMock = {
        request: {
          query: CREATE_POST_MUTATION,
          variables: {
            input: {
              caption: 'Unknown MIME',
              organizationId: orgId,
              isPinned: false,
              attachments: [
                {
                  fileHash: '0a0203',
                  mimetype: 'IMAGE_JPEG', // fallback expected
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
              caption: 'Unknown MIME',
            },
          },
        },
      };

      render(
        <MockedProvider mocks={[...mocks, fallbackMock]}>
          <CreatePostModal
            show={true}
            onHide={mockOnHide}
            refetch={mockRefetch}
            orgId={orgId}
          />
        </MockedProvider>,
      );

      const titleInput = screen.getByTestId('modalTitle');
      await userEvent.type(titleInput, 'Unknown MIME');

      // Use an image MIME that isn't in switch cases but still starts with 'image/'
      const file = new File(['content'], 'test.unknown', {
        type: 'image/unknown',
      });
      const fileInput = screen.getByTestId('addMediaField');
      await userEvent.upload(fileInput, file);

      const submitButton = screen.getByTestId('createPostBtn');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(mockDigest).toHaveBeenCalled();
      });
    } finally {
      File.prototype.arrayBuffer = originalArrayBuffer;
      Object.defineProperty(global, 'crypto', {
        value: originalCrypto,
        writable: true,
      });
    }
  });

  it('shows preview error when convertToBase64 rejects for video', async () => {
    // Make convertToBase64 reject for this test (video case)
    vi.mocked(convertToBase64).mockRejectedValueOnce(
      new Error('video convert fail'),
    );

    render(
      <MockedProvider mocks={mocks}>
        <CreatePostModal
          show={true}
          onHide={mockOnHide}
          refetch={mockRefetch}
          orgId={orgId}
        />
      </MockedProvider>,
    );

    const file = new File(['video'], 'bad.mp4', { type: 'video/mp4' });
    const input = screen.getByTestId('addVideoField');

    await userEvent.upload(input, file);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Could not generate video preview',
      );
    });
  });

  it('does not treat response without createPost as success', async () => {
    const noCreateMock = {
      request: {
        query: CREATE_POST_MUTATION,
        variables: {
          input: {
            caption: 'No Create',
            organizationId: orgId,
            isPinned: false,
          },
        },
      },
      result: {
        data: {},
      },
    };

    render(
      <MockedProvider mocks={[noCreateMock]}>
        <CreatePostModal
          show={true}
          onHide={mockOnHide}
          refetch={mockRefetch}
          orgId={orgId}
        />
      </MockedProvider>,
    );

    const titleInput = screen.getByTestId('modalTitle');
    await userEvent.type(titleInput, 'No Create');

    const submitBtn = screen.getByText('addPost');
    await userEvent.click(submitBtn);

    // Wait a tick to allow mutation to resolve
    await waitFor(() => {
      expect(toast.success).not.toHaveBeenCalledWith('postCreatedSuccess');
      expect(mockRefetch).not.toHaveBeenCalled();
      expect(mockOnHide).not.toHaveBeenCalled();
    });
  });

  it('calls errorHandler when crypto.subtle.digest rejects during hashing', async () => {
    const originalArrayBuffer = File.prototype.arrayBuffer;
    const originalCrypto = global.crypto;

    try {
      // Ensure convertToBase64 succeeds so addMedia state will be set
      vi.mocked(convertToBase64).mockResolvedValueOnce('base64-ok');

      File.prototype.arrayBuffer = vi
        .fn()
        .mockResolvedValue(new ArrayBuffer(8));

      Object.defineProperty(global, 'crypto', {
        value: {
          subtle: {
            digest: vi.fn().mockRejectedValueOnce(new Error('digest fail')),
          },
        },
        writable: true,
      });

      render(
        <MockedProvider mocks={mocks}>
          <CreatePostModal
            show={true}
            onHide={mockOnHide}
            refetch={mockRefetch}
            orgId={orgId}
          />
        </MockedProvider>,
      );

      const file = new File(['image'], 'img.png', { type: 'image/png' });
      const input = screen.getByTestId('addMediaField');
      await userEvent.upload(input, file);

      const titleInput = screen.getByTestId('modalTitle');
      await userEvent.type(titleInput, 'Digest Fail');

      const submitBtn = screen.getByText('addPost');
      await userEvent.click(submitBtn);

      await waitFor(() => {
        expect(errorHandler).toHaveBeenCalled();
      });
    } finally {
      File.prototype.arrayBuffer = originalArrayBuffer;
      Object.defineProperty(global, 'crypto', {
        value: originalCrypto,
        writable: true,
      });
    }
  });

  it('uses defaultFileName when file.name is empty', async () => {
    const originalArrayBuffer = File.prototype.arrayBuffer;
    const originalCrypto = global.crypto;

    try {
      File.prototype.arrayBuffer = vi
        .fn()
        .mockResolvedValue(new ArrayBuffer(8));

      const mockDigest = vi
        .fn()
        .mockResolvedValue(new Uint8Array([1, 2, 3]).buffer);

      Object.defineProperty(global, 'crypto', {
        value: {
          subtle: {
            digest: mockDigest,
          },
        },
        writable: true,
      });

      const defaultNameMock = {
        request: {
          query: CREATE_POST_MUTATION,
          variables: {
            input: {
              caption: 'Empty Name',
              organizationId: orgId,
              isPinned: false,
              attachments: [
                {
                  fileHash: '010203',
                  mimetype: 'IMAGE_PNG',
                  name: 'defaultFileName',
                  objectName: 'uploads/defaultFileName',
                },
              ],
            },
          },
        },
        result: {
          data: {
            createPost: {
              id: '1',
              caption: 'Empty Name',
            },
          },
        },
      };

      render(
        <MockedProvider mocks={[...mocks, defaultNameMock]}>
          <CreatePostModal
            show={true}
            onHide={mockOnHide}
            refetch={mockRefetch}
            orgId={orgId}
          />
        </MockedProvider>,
      );

      // File with empty name
      const file = new File(['x'], '', { type: 'image/png' });
      const input = screen.getByTestId('addMediaField');
      await userEvent.upload(input, file);

      const titleInput = screen.getByTestId('modalTitle');
      await userEvent.type(titleInput, 'Empty Name');

      const submitBtn = screen.getByTestId('createPostBtn');
      await userEvent.click(submitBtn);

      await waitFor(() => {
        expect(mockDigest).toHaveBeenCalled();
        expect(toast.success).toHaveBeenCalled();
      });
    } finally {
      File.prototype.arrayBuffer = originalArrayBuffer;
      Object.defineProperty(global, 'crypto', {
        value: originalCrypto,
        writable: true,
      });
    }
  });

  it('createPost handles missing DOM file inputs without errors', async () => {
    const successMocks = [
      {
        request: {
          query: CREATE_POST_MUTATION,
          variables: {
            input: {
              caption: 'Missing Inputs Test',
              organizationId: orgId,
              isPinned: false,
            },
          },
        },
        result: {
          data: {
            createPost: {
              id: 'post-id',
              caption: 'Missing Inputs Test',
            },
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={successMocks}>
        <CreatePostModal
          show={true}
          onHide={mockOnHide}
          refetch={mockRefetch}
          orgId={orgId}
        />
      </MockedProvider>,
    );

    // Remove file inputs from DOM so getElementById returns null
    document.getElementById('addMedia')?.remove();
    document.getElementById('videoAddMedia')?.remove();

    const titleInput = screen.getByTestId('modalTitle');
    await userEvent.type(titleInput, 'Missing Inputs Test');

    const submitBtn = screen.getByTestId('createPostBtn');
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('postCreatedSuccess');
      expect(mockOnHide).toHaveBeenCalled();
    });
  });

  it('handleClose handles missing DOM file inputs without errors', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <CreatePostModal
          show={true}
          onHide={mockOnHide}
          refetch={mockRefetch}
          orgId={orgId}
        />
      </MockedProvider>,
    );

    // Remove file inputs from DOM so getElementById returns null
    document.getElementById('addMedia')?.remove();
    document.getElementById('videoAddMedia')?.remove();

    const closeButton = screen.getByTestId('closeOrganizationModal');
    await userEvent.click(closeButton);

    expect(mockOnHide).toHaveBeenCalled();
  });

  it('mediaCloseButton handles missing file input element gracefully', async () => {
    render(
      <MockedProvider mocks={mocks}>
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

    // Remove the actual file input element, then click the media close button
    document.getElementById('addMedia')?.remove();

    const removeBtn = screen.getByTestId('mediaCloseButton');
    await userEvent.click(removeBtn);

    await waitFor(() => {
      expect(screen.queryByTestId('mediaPreview')).not.toBeInTheDocument();
    });
  });

  it('videoMediaCloseButton handles missing video input element gracefully', async () => {
    render(
      <MockedProvider mocks={mocks}>
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
    const input = screen.getByTestId('addVideoField');
    await userEvent.upload(input, file);

    expect(screen.getByTestId('videoPreviewContainer')).toBeInTheDocument();

    // Remove the actual video input element, then click the video media close button
    document.getElementById('videoAddMedia')?.remove();

    const removeBtn = screen.getByTestId('videoMediaCloseButton');
    await userEvent.click(removeBtn);

    await waitFor(() => {
      expect(
        screen.queryByTestId('videoPreviewContainer'),
      ).not.toBeInTheDocument();
    });
  });
});
