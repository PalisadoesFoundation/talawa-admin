import React, { act } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { CREATE_POST_MUTATION } from 'GraphQl/Mutations/mutations';
import CreatePostModal from './createPostModal';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from '../../../utils/i18nForTest';
import { errorHandler } from 'utils/errorHandler';
import { toast } from 'react-toastify';
import styles from './createPostModal.module.css';

// Capture originals before mocking
const originalCrypto = global.crypto;
const originalCreateObjectURL = global.URL.createObjectURL;
const originalRevokeObjectURL = global.URL.revokeObjectURL;
const originalArrayBuffer = File.prototype.arrayBuffer;
const originalAcceptDescriptor = Object.getOwnPropertyDescriptor(
  HTMLInputElement.prototype,
  'accept',
);

// Mock react-toastify
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock useLocalStorage
const mockLocalStorage = vi.fn<(key: string) => string | null>(
  (key: string) => {
    if (key === 'name') return 'John Doe';
    return null;
  },
);

vi.mock('utils/useLocalstorage', () => ({
  default: () => ({
    getItem: mockLocalStorage,
  }),
}));

// Mock errorHandler
vi.mock('utils/errorHandler', () => ({
  errorHandler: vi.fn(),
}));

// Mock Avatar component
vi.mock('components/Avatar/Avatar', () => ({
  default: ({
    name,
    size,
    radius,
    dataTestId,
  }: {
    name: string;
    size: number;
    radius: number;
    dataTestId: string;
  }) => (
    <div
      data-testid={dataTestId || 'mock-avatar'}
      data-name={name}
      data-size={size}
      data-radius={radius}
    >
      Avatar: {name}
    </div>
  ),
}));

// Test props
const defaultProps = {
  show: true,
  onHide: vi.fn(),
  refetch: vi.fn().mockResolvedValue({}),
  orgId: 'test-org-id',
};

// Mock GraphQL responses
const createPostSuccessMock = {
  request: {
    query: CREATE_POST_MUTATION,
    variables: {
      input: {
        caption: 'Test Post Title',
        organizationId: 'test-org-id',
        isPinned: false,
      },
    },
  },
  result: {
    data: {
      createPost: {
        id: 'test-post-id',
        caption: 'Test Post Title',
        pinnedAt: null,
        attachments: [],
      },
    },
  },
};

const createPinnedPostMock = {
  request: {
    query: CREATE_POST_MUTATION,
    variables: {
      input: {
        caption: 'Pinned Post',
        organizationId: 'test-org-id',
        isPinned: true,
      },
    },
  },
  result: {
    data: {
      createPost: {
        id: 'test-post-id',
        caption: 'Pinned Post',
        pinnedAt: '2023-01-01T00:00:00Z',
        attachments: [],
      },
    },
  },
};

const createPostWithAttachmentMock = {
  request: {
    query: CREATE_POST_MUTATION,
    variables: {
      input: {
        caption: 'Post with Image',
        organizationId: 'test-org-id',
        isPinned: false,
        attachments: [
          {
            fileHash:
              '123456789abcdef011223344556677889aaabbccddeeff00112233445566778899',
            mimetype: 'IMAGE_JPEG',
            name: 'test-image.jpg',
            objectName: 'uploads/test-image.jpg',
          },
        ],
      },
    },
  },
  result: {
    data: {
      createPost: {
        id: 'test-post-id',
        caption: 'Post with Image',
        pinnedAt: null,
        attachments: [
          {
            fileHash:
              '123456789abcdef011223344556677889aaabbccddeeff00112233445566778899',
            mimeType: 'IMAGE_JPEG',
            name: 'test-image.jpg',
            objectName: 'uploads/test-image.jpg',
          },
        ],
      },
    },
  },
};

const createPostErrorMock = {
  request: {
    query: CREATE_POST_MUTATION,
    variables: {
      input: {
        caption: 'Error Post',
        organizationId: 'test-org-id',
        isPinned: false,
      },
    },
  },
  error: new Error('GraphQL error occurred'),
};
beforeEach(() => {
  Object.defineProperty(global, 'crypto', {
    value: {
      subtle: {
        digest: vi.fn().mockImplementation(async () => {
          const mockHash = new Uint8Array([
            0x12, 0x34, 0x56, 0x78, 0x9a, 0xbc, 0xde, 0xf0, 0x11, 0x22, 0x33,
            0x44, 0x55, 0x66, 0x77, 0x88, 0x99, 0xaa, 0xbb, 0xcc, 0xdd, 0xee,
            0xff, 0x00, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88,
          ]);
          return mockHash.buffer;
        }),
      },
    },
    configurable: true,
  });

  global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
  global.URL.revokeObjectURL = vi.fn();

  Object.defineProperty(File.prototype, 'arrayBuffer', {
    value: vi.fn().mockImplementation(async function () {
      const buffer = new ArrayBuffer(8);
      new Uint8Array(buffer).set([
        0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
      ]);
      return buffer;
    }),
    writable: true,
    configurable: true,
  });

  Object.defineProperty(HTMLInputElement.prototype, 'accept', {
    get() {
      return this.getAttribute('accept') || '';
    },
    set(value) {
      this.setAttribute('accept', value);
    },
    configurable: true,
  });
});

afterEach(() => {
  Object.defineProperty(global, 'crypto', {
    value: originalCrypto,
    configurable: true,
  });
  global.URL.createObjectURL = originalCreateObjectURL;
  global.URL.revokeObjectURL = originalRevokeObjectURL;

  Object.defineProperty(File.prototype, 'arrayBuffer', {
    value: originalArrayBuffer,
    writable: true,
    configurable: true,
  });

  if (originalAcceptDescriptor) {
    Object.defineProperty(
      HTMLInputElement.prototype,
      'accept',
      originalAcceptDescriptor,
    );
  } else {
    Reflect.deleteProperty(HTMLInputElement.prototype, 'accept');
  }

  vi.clearAllMocks();
});

describe('CreatePostModal Integration Tests', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  const renderComponent = (
    props = {},
    mocks: MockedResponse[] = [createPostSuccessMock],
  ) => {
    return render(
      <I18nextProvider i18n={i18nForTest}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <CreatePostModal {...defaultProps} {...props} />
        </MockedProvider>
      </I18nextProvider>,
    );
  };

  describe('Modal Display and Basic Functionality', () => {
    it('renders modal when show is true', () => {
      renderComponent();

      expect(screen.getByTestId('modalBackdrop')).toBeInTheDocument();
      expect(screen.getByTestId('user-avatar')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText(/Post to anyone/i)).toBeInTheDocument(); // postToAnyone translation
    });

    it('closes modal when close button is clicked', async () => {
      const onHide = vi.fn();
      renderComponent({ onHide });

      const closeButton = screen.getByTestId('closeBtn');
      await user.click(closeButton);

      expect(onHide).toHaveBeenCalledTimes(1);
    });

    it('closes modal when backdrop is clicked', async () => {
      const onHide = vi.fn();
      renderComponent({ onHide });

      const backdrop = screen.getByTestId('modalBackdrop');
      await user.click(backdrop);

      expect(onHide).toHaveBeenCalledTimes(1);
    });

    it('closes modal when Escape key is pressed', async () => {
      const onHide = vi.fn();
      renderComponent({ onHide });

      await user.keyboard('{Escape}');

      expect(onHide).toHaveBeenCalledTimes(1);
    });
  });

  describe('Form Input Handling', () => {
    it('updates post title when typing in textarea', async () => {
      renderComponent();

      const titleInput = screen.getByPlaceholderText('Title of your post...');
      await user.type(titleInput, 'My Test Post');

      expect(titleInput).toHaveValue('My Test Post');
    });

    it('updates post body when typing in body textarea', async () => {
      renderComponent();

      const bodyInput = screen.getByPlaceholderText('Body of your post...');
      await user.type(bodyInput, 'This is the body content');

      expect(bodyInput).toHaveValue('This is the body content');
    });

    it('disables post button when title is empty', () => {
      renderComponent();

      const postButton = screen.getByTestId('createPostBtn');
      expect(postButton).toBeDisabled();
      expect(postButton).toHaveClass(styles.postButtonDisabled);
    });

    it('enables post button when title has content', async () => {
      renderComponent();

      const titleInput = screen.getByPlaceholderText('Title of your post...');
      await user.type(titleInput, 'Test Title');

      const postButton = screen.getByTestId('createPostBtn');
      expect(postButton).not.toBeDisabled();
      expect(postButton).not.toHaveClass(styles.postButtonDisabled);
    });

    it('disables post button when title contains only whitespace', async () => {
      renderComponent();

      const titleInput = screen.getByPlaceholderText('Title of your post...');
      await user.type(titleInput, '   ');

      const postButton = screen.getByTestId('createPostBtn');
      expect(postButton).toBeDisabled();
    });
  });

  describe('Pin Post Functionality', () => {
    it('toggles pin state when pin button is clicked', async () => {
      renderComponent();

      const pinButton = screen.getByTestId('pinPostButton');

      // Initially not pinned
      expect(pinButton).toHaveAttribute('title', 'Pin post');

      // Click to pin
      await user.click(pinButton);

      expect(pinButton).toHaveAttribute('title', 'Unpin post');

      // Click to unpin
      await user.click(pinButton);

      expect(pinButton).toHaveAttribute('title', 'Pin post');
    });

    it('creates pinned post when pin is active', async () => {
      renderComponent({}, [createPinnedPostMock]);

      const titleInput = screen.getByPlaceholderText('Title of your post...');
      const pinButton = screen.getByTestId('pinPostButton');
      const postButton = screen.getByTestId('createPostBtn');

      await user.type(titleInput, 'Pinned Post');
      await user.click(pinButton);
      await user.click(postButton);

      await waitFor(() => {
        expect(defaultProps.refetch).toHaveBeenCalled();
      });
    });
  });

  describe('File Upload Functionality', () => {
    it('opens file selector when photo button is clicked', async () => {
      renderComponent();

      const photoButton = screen.getByTestId('addPhotoBtn');
      const fileInput = photoButton.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;

      const mockClick = vi
        .spyOn(fileInput, 'click')
        .mockImplementation(() => {});

      await user.click(photoButton);

      expect(mockClick).toHaveBeenCalled();
    });
  });

  describe('Form Submission', () => {
    it('creates post successfully with valid data', async () => {
      const { toast } = await import('react-toastify');
      renderComponent();

      const titleInput = screen.getByPlaceholderText('Title of your post...');
      const postButton = screen.getByTestId('createPostBtn');

      await user.type(titleInput, 'Test Post Title');
      await user.click(postButton);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(
          'Congratulations! You have Posted Something.',
        );
        expect(defaultProps.refetch).toHaveBeenCalled();
        expect(defaultProps.onHide).toHaveBeenCalled();
      });
    });

    it('handles file upload preview', async () => {
      renderComponent();

      const titleInput = screen.getByPlaceholderText('Title of your post...');
      const file = new File(['hello'], 'hello.png', { type: 'image/png' });
      const input = screen.getByTestId('addMedia');

      await userEvent.upload(input, file);

      await user.type(titleInput, 'Test Post Title');
      expect(screen.getByTestId('imagePreview')).toBeInTheDocument();
    });

    it('handles file upload and processes attachments correctly', async () => {
      // Simple test that verifies file upload flow without GraphQL mutation
      renderComponent({}, [createPostSuccessMock]);

      const titleInput = screen.getByPlaceholderText('Title of your post...');
      const fileInput = screen.getByTestId('addMedia');

      // Create a mock file
      const mockFile = new File(['fake-image-content'], 'test-image.jpg', {
        type: 'image/jpeg',
      });

      // Upload the file
      await userEvent.upload(fileInput, mockFile);

      // Verify preview appears (this confirms file handling works)
      await waitFor(() => {
        expect(screen.getByTestId('imagePreview')).toBeInTheDocument();
      });

      // Verify file input shows the file was selected
      const files = (fileInput as HTMLInputElement).files;
      expect(files).not.toBeNull();
      expect(files?.[0]).toBe(mockFile);
      expect(files).toHaveLength(1);

      // Add some title to enable posting
      await user.type(titleInput, 'Test Post Title');

      // The post button should be enabled
      const postButton = screen.getByTestId('createPostBtn');
      expect(postButton).not.toBeDisabled();

      // This test confirms that the file upload handling, preview generation,
      // and UI state management all work correctly
    });

    it('tests file hash generation functionality', async () => {
      // Spy on crypto.subtle.digest to verify it's called
      const digestSpy = vi.spyOn(global.crypto.subtle, 'digest');
      // Spy on File.prototype.arrayBuffer to track the ArrayBuffer being passed
      const arrayBufferSpy = vi.spyOn(File.prototype, 'arrayBuffer');

      renderComponent({}, [createPostWithAttachmentMock]);

      const titleInput = screen.getByPlaceholderText('Title of your post...');
      const fileInput = screen.getByTestId('addMedia');
      const postButton = screen.getByTestId('createPostBtn');

      const mockFile = new File(['test-content'], 'test-image.jpg', {
        type: 'image/jpeg',
      });

      await userEvent.upload(fileInput, mockFile);
      await user.type(titleInput, 'Post with Image');
      await user.click(postButton);

      // Verify that arrayBuffer was called and digest was called with the returned ArrayBuffer
      await waitFor(() => {
        expect(arrayBufferSpy).toHaveBeenCalled();
        expect(digestSpy).toHaveBeenCalledWith(
          'SHA-256',
          expect.any(ArrayBuffer),
        );
      });
    });

    it('tests MIME type conversion functionality', async () => {
      // Test the getMimeTypeEnum function by testing different file types
      const jpegFile = new File(['jpeg-content'], 'test.jpg', {
        type: 'image/jpeg',
      });
      const pngFile = new File(['png-content'], 'test.png', {
        type: 'image/png',
      });
      const webpFile = new File(['webp-content'], 'test.webp', {
        type: 'image/webp',
      });
      const avifFile = new File(['video-content'], 'test.avif', {
        type: 'image/avif',
      });
      const videoFile = new File(['video-content'], 'test.mp4', {
        type: 'video/mp4',
      });
      const webmVideoFile = new File(['video-content'], 'test.webm', {
        type: 'video/webm',
      });
      const aviFile = new File(['video-content'], 'test.avi', {
        type: 'video/avi',
      });
      const movFile = new File(['video-content'], 'test.mov', {
        type: 'video/quicktime',
      });

      renderComponent({}, [createPostWithAttachmentMock]);

      const fileInput = screen.getByTestId('addMedia');

      // Test different file types get preview
      await userEvent.upload(fileInput, jpegFile);
      await waitFor(() => {
        expect(screen.getByTestId('imagePreview')).toBeInTheDocument();
      });

      // Clear and test another type
      fireEvent.change(fileInput, { target: { files: null } });
      await userEvent.upload(fileInput, pngFile);
      await waitFor(() => {
        expect(screen.getByTestId('imagePreview')).toBeInTheDocument();
      });

      // Clear and test another type
      fireEvent.change(fileInput, { target: { files: null } });
      await userEvent.upload(fileInput, webpFile);
      await waitFor(() => {
        expect(screen.getByTestId('imagePreview')).toBeInTheDocument();
      });

      // Clear and test another type
      fireEvent.change(fileInput, { target: { files: null } });
      await userEvent.upload(fileInput, avifFile);
      await waitFor(() => {
        expect(screen.getByTestId('imagePreview')).toBeInTheDocument();
      });

      // Clear and test another type
      fireEvent.change(fileInput, { target: { files: null } });
      await userEvent.upload(fileInput, videoFile);
      await waitFor(() => {
        expect(screen.getByTestId('videoPreview')).toBeInTheDocument();
      });

      // Clear and test another type
      fireEvent.change(fileInput, { target: { files: null } });
      await userEvent.upload(fileInput, webmVideoFile);
      await waitFor(() => {
        expect(screen.getByTestId('videoPreview')).toBeInTheDocument();
      });

      // Clear and test another type
      fireEvent.change(fileInput, { target: { files: null } });
      await userEvent.upload(fileInput, movFile);
      await waitFor(() => {
        expect(screen.getByTestId('videoPreview')).toBeInTheDocument();
      });

      // Clear and test another type
      fireEvent.change(fileInput, { target: { files: null } });
      await userEvent.upload(fileInput, aviFile);
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Unsupported file type!');
      });
    });

    it('shows error when organization ID is missing', async () => {
      const { toast } = await import('react-toastify');
      renderComponent({ orgId: undefined });

      const titleInput = screen.getByPlaceholderText('Title of your post...');
      const postButton = screen.getByTestId('createPostBtn');

      await user.type(titleInput, 'Test Post');

      await user.click(postButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Organization ID is missing!');
      });
    });

    it('handles GraphQL error gracefully', async () => {
      renderComponent({}, [createPostErrorMock]);

      const titleInput = screen.getByPlaceholderText('Title of your post...');
      const postButton = screen.getByTestId('createPostBtn');

      await user.type(titleInput, 'Error Post');
      await user.click(postButton);

      await waitFor(() => {
        expect(errorHandler).toHaveBeenCalled();
      });
    });

    it('resets form state after successful submission', async () => {
      renderComponent();

      const titleInput = screen.getByPlaceholderText('Title of your post...');
      const bodyInput = screen.getByPlaceholderText('Body of your post...');
      const postButton = screen.getByTestId('createPostBtn');

      await user.type(titleInput, 'Test Post Title');
      await user.type(bodyInput, 'Test body content');
      await user.click(postButton);

      await waitFor(() => {
        expect(titleInput).toHaveValue('');
        expect(bodyInput).toHaveValue('');
      });
    });

    it('clears file inputs after successful submission', async () => {
      // Mock DOM methods
      const mockGetElementById = vi
        .spyOn(document, 'getElementById')
        .mockImplementation((id) => {
          if (id === 'addMedia' || id === 'videoAddMedia') {
            return { value: 'test.jpg' } as HTMLInputElement;
          }
          return null;
        });

      renderComponent();

      const titleInput = screen.getByTestId('postTitleInput');
      const postButton = screen.getByTestId('createPostBtn');

      await user.type(titleInput, 'Test Post Title');
      await user.click(postButton);

      await waitFor(() => {
        expect(mockGetElementById).toHaveBeenCalledWith('addMedia');
        expect(mockGetElementById).toHaveBeenCalledWith('videoAddMedia');
      });

      mockGetElementById.mockRestore();
    });
  });

  describe('File Selection Edge Cases', () => {
    it('handles file selection when no file is selected', async () => {
      renderComponent();

      const photoButton = screen.getByTestId('addPhotoBtn');
      const fileInput = photoButton.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;

      // Mock empty file selection
      Object.defineProperty(fileInput, 'files', { value: null });

      await act(async () => {
        fireEvent.change(fileInput);
      });

      // Should not show any preview
      expect(screen.queryByAltText('Selected')).not.toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation and Accessibility', () => {
    it('handles proper cleanup on unmount', async () => {
      const { unmount } = renderComponent();

      // Component should unmount without errors
      expect(() => unmount()).not.toThrow();
    });

    it('has proper accessibility attributes', () => {
      renderComponent();

      const closeButton = screen.getByTestId('closeBtn');
      expect(closeButton).toHaveAttribute('aria-label', 'Close');

      const photoButton = screen.getByTestId('addPhotoBtn');
      expect(photoButton).toHaveAttribute('aria-label', 'Add photo');

      const pinButton = screen.getByTestId('pinPostButton');
      expect(pinButton).toHaveAttribute('aria-label', 'pin post');
    });
  });

  describe('Component State Management', () => {
    it('maintains consistent state across multiple interactions', async () => {
      renderComponent();

      const titleInput = screen.getByPlaceholderText('Title of your post...');
      const bodyInput = screen.getByPlaceholderText('Body of your post...');
      const pinButton = screen.getByTestId('pinPostButton');

      // Type in title
      await user.type(titleInput, 'Test Title');
      expect(titleInput).toHaveValue('Test Title');

      // Type in body
      await user.type(bodyInput, 'Test Body');
      expect(bodyInput).toHaveValue('Test Body');

      // Toggle pin
      await user.click(pinButton);
      expect(pinButton).toHaveAttribute('title', 'Unpin post');

      // Values should still be present
      expect(titleInput).toHaveValue('Test Title');
      expect(bodyInput).toHaveValue('Test Body');
    });
  });
});
