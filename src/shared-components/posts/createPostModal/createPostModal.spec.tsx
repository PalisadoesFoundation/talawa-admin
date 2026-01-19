import React, { act } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { InMemoryCache } from '@apollo/client';
import {
  CREATE_POST_MUTATION,
  UPDATE_POST_MUTATION,
} from 'GraphQl/Mutations/mutations';
import CreatePostModal from './createPostModal';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from '../../../utils/i18nForTest';
import { errorHandler } from 'utils/errorHandler';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
// Styles loaded dynamically to avoid lint error about restricted imports in tests
let styles: Record<string, string> = {};

import dayjs from 'dayjs';

// Capture originals before mocking
const originalCrypto = global.crypto;
const originalCreateObjectURL = global.URL.createObjectURL;
const originalRevokeObjectURL = global.URL.revokeObjectURL;
const originalArrayBuffer = File.prototype.arrayBuffer;
const originalAcceptDescriptor = Object.getOwnPropertyDescriptor(
  HTMLInputElement.prototype,
  'accept',
);

// Mock NotificationToast
vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
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

// Update the Avatar mock to ProfileAvatarDisplay mock
vi.mock('shared-components/ProfileAvatarDisplay/ProfileAvatarDisplay', () => ({
  ProfileAvatarDisplay: ({
    fallbackName,
    size,
    enableEnlarge,
    dataTestId,
  }: {
    fallbackName: string;
    size: string;
    enableEnlarge: boolean;
    dataTestId: string;
  }) => (
    <div
      data-testid={dataTestId || 'mock-avatar'}
      data-fallbackname={fallbackName}
      data-size={size}
      data-enableenlarge={enableEnlarge.toString()}
    >
      Avatar: {fallbackName}
    </div>
  ),
}));

// Test props
const defaultProps = {
  show: true,
  onHide: vi.fn(),
  refetch: vi.fn().mockResolvedValue({}),
  orgId: 'test-org-id',
  type: 'create' as const,
};

// Mock GraphQL responses
const createPostSuccessMock = {
  request: {
    query: CREATE_POST_MUTATION,
    variables: {
      input: {
        caption: 'Test Post Title',
        body: '',
        organizationId: 'test-org-id',
        isPinned: false,
      },
    },
  },
  result: {
    data: {
      createPost: {
        __typename: 'Post',
        id: 'test-post-id',
        caption: 'Test Post Title',
        pinnedAt: null,
        attachmentURL: null,
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
        body: '',
        organizationId: 'test-org-id',
        isPinned: true,
      },
    },
  },
  result: {
    data: {
      createPost: {
        __typename: 'Post',
        id: 'test-post-id',
        caption: 'Pinned Post',
        // Use dynamic past date to avoid test staleness
        pinnedAt: dayjs().subtract(30, 'days').toISOString(),
        attachmentURL: null,
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
        body: '',
        organizationId: 'test-org-id',
        isPinned: false,
      },
    },
  },
  result: {
    data: {
      createPost: {
        __typename: 'Post',
        id: 'test-post-id',
        caption: 'Post with Image',
        pinnedAt: null,
        attachmentURL: 'https://example.com/uploads/test-image.jpg',
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
        body: '',
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

  beforeEach(async () => {
    user = userEvent.setup();
    // Dynamically import styles to get the actual hashed class names
    const mod = await import('./createPostModal.module.css');
    styles = mod.default;
  });

  const renderComponent = (
    props = {},
    mocks: MockedResponse[] = [createPostSuccessMock],
  ) => {
    return render(
      <I18nextProvider i18n={i18nForTest}>
        <MockedProvider mocks={mocks} cache={new InMemoryCache()}>
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
      expect(screen.getByText('Post to anyone')).toBeInTheDocument(); // postToAnyone translation
    });
    it('renders ProfileAvatarDisplay with correct props', () => {
      render(
        <MockedProvider>
          <I18nextProvider i18n={i18nForTest}>
            <CreatePostModal {...defaultProps} />
          </I18nextProvider>
        </MockedProvider>,
      );

      const avatar = screen.getByTestId('user-avatar');
      expect(avatar).toBeInTheDocument();
      expect(avatar.getAttribute('data-fallbackname')).toBe('John Doe');
      expect(avatar.getAttribute('data-size')).toBe('small');
      expect(avatar.getAttribute('data-enableenlarge')).toBe('true');
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
      renderComponent();

      const titleInput = screen.getByPlaceholderText('Title of your post...');
      const postButton = screen.getByTestId('createPostBtn');

      await user.type(titleInput, 'Test Post Title');
      await user.click(postButton);

      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalledWith(
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
    });

    const imageTypes = [
      { name: 'test.jpg', type: 'image/jpeg', testId: 'imagePreview' },
      { name: 'test.png', type: 'image/png', testId: 'imagePreview' },
      { name: 'test.webp', type: 'image/webp', testId: 'imagePreview' },
      { name: 'test.avif', type: 'image/avif', testId: 'imagePreview' },
    ];

    const videoTypes = [
      { name: 'test.mp4', type: 'video/mp4', testId: 'videoPreview' },
      { name: 'test.webm', type: 'video/webm', testId: 'videoPreview' },
      { name: 'test.mov', type: 'video/quicktime', testId: 'videoPreview' },
    ];

    it.each(imageTypes)(
      'shows image preview for $type',
      async ({ name, type, testId }) => {
        const file = new File(['content'], name, { type });

        renderComponent({}, [createPostWithAttachmentMock]);

        const fileInput = screen.getByTestId('addMedia');
        await userEvent.upload(fileInput, file);

        await waitFor(() => {
          expect(screen.getByTestId(testId)).toBeInTheDocument();
        });
      },
    );

    it.each(videoTypes)(
      'shows video preview for $type',
      async ({ name, type, testId }) => {
        const file = new File(['content'], name, { type });

        renderComponent({}, [createPostWithAttachmentMock]);

        const fileInput = screen.getByTestId('addMedia');
        await userEvent.upload(fileInput, file);

        await waitFor(() => {
          expect(screen.getByTestId(testId)).toBeInTheDocument();
        });
      },
    );

    it('shows error for unsupported file type', async () => {
      const aviFile = new File(['video-content'], 'test.avi', {
        type: 'video/avi',
      });

      renderComponent({}, [createPostWithAttachmentMock]);

      const fileInput = screen.getByTestId('addMedia');
      await userEvent.upload(fileInput, aviFile);

      await waitFor(() => {
        expect(NotificationToast.error).toHaveBeenCalledWith(
          'Unsupported file type!',
        );
      });
    });

    it('shows error when organization ID is missing', async () => {
      renderComponent({ orgId: undefined });

      const titleInput = screen.getByPlaceholderText('Title of your post...');
      const postButton = screen.getByTestId('createPostBtn');

      await user.type(titleInput, 'Test Post');

      await user.click(postButton);

      await waitFor(() => {
        expect(NotificationToast.error).toHaveBeenCalledWith(
          'Organization ID is missing!',
        );
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
  });

  describe('Edge Cases', () => {
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

    it('handles null name from localStorage', () => {
      // Temporarily change the mock to return null
      mockLocalStorage.mockImplementation((key: string) => {
        if (key === 'name') return null; // This will trigger the ?? fallback
        return null;
      });

      renderComponent();

      // Component should render properly with fallback empty string
      expect(screen.getByTestId('modalBackdrop')).toBeInTheDocument();
      expect(screen.getByTestId('user-avatar')).toBeInTheDocument();

      // Reset the mock back to original behavior
      mockLocalStorage.mockImplementation((key: string) => {
        if (key === 'name') return 'John Doe';
        return null;
      });
    });

    it('handles case when createPost mutation succeeds but returns no data', async () => {
      const noDataMock = {
        request: {
          query: CREATE_POST_MUTATION,
          variables: {
            input: {
              caption: 'Test Post',
              body: '',
              organizationId: 'test-org-id',
              isPinned: false,
            },
          },
        },
        result: {
          data: {
            createPost: null, // Mutation succeeds but createPost field is null
          },
        },
      };

      renderComponent({}, [noDataMock]);

      const titleInput = screen.getByPlaceholderText('Title of your post...');
      const postButton = screen.getByTestId('createPostBtn');

      await user.type(titleInput, 'Test Post');
      await user.click(postButton);

      // Should not show success toast or call refetch when data.createPost is null
      await waitFor(() => {
        expect(NotificationToast.success).not.toHaveBeenCalled();
        expect(defaultProps.refetch).not.toHaveBeenCalled();
        expect(defaultProps.onHide).not.toHaveBeenCalled();
      });
    });

    it('renders with correct CSS classes when show is false', () => {
      renderComponent({ show: false });

      const backdrop = screen.getByTestId('modalBackdrop');
      const modal = screen.getByTestId('create-post-modal');

      // Should not have the show classes when show is false
      expect(backdrop).not.toHaveClass(styles.backdropShow);
      expect(modal).not.toHaveClass(styles.modalShow);
    });

    it('cleans up preview URL when unmounted with a preview', async () => {
      const { unmount } = renderComponent();

      const titleInput = screen.getByPlaceholderText('Title of your post...');
      const fileInput = screen.getByTestId('addMedia');
      const mockFile = new File(['test-content'], 'test.jpg', {
        type: 'image/jpeg',
      });

      // Type to ensure component state is active
      await user.type(titleInput, 'Draft Post');
      // Upload file to generate preview
      await userEvent.upload(fileInput, mockFile);

      await waitFor(() => {
        expect(screen.getByTestId('imagePreview')).toBeInTheDocument();
      });

      // Unmount the component
      unmount();

      // Check if revokeObjectURL was called
      expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
    });
  });

  describe('Edit Post Functionality', () => {
    it('renders in edit mode with pre-filled data', () => {
      renderComponent({
        type: 'edit',
        id: 'post-123',
        title: 'Existing Title',
        body: 'Existing Body',
      });

      expect(screen.getByDisplayValue('Existing Title')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Existing Body')).toBeInTheDocument();
      expect(screen.getByText('Edit Post')).toBeInTheDocument();
      expect(screen.getByText('Save Changes')).toBeInTheDocument();
    });

    it('handles edit mode with file upload', async () => {
      renderComponent({
        type: 'edit',
        id: 'post-123',
        title: 'Original Title',
        body: 'Original Body',
      });

      const titleInput = screen.getByDisplayValue('Original Title');
      const bodyInput = screen.getByDisplayValue('Original Body');
      const fileInput = screen.getByTestId('addMedia');
      const saveButton = screen.getByText('Save Changes');

      const mockFile = new File(['test-content'], 'test.jpg', {
        type: 'image/jpeg',
      });

      await user.clear(titleInput);
      await user.type(titleInput, 'Updated Title');
      await user.clear(bodyInput);
      await user.type(bodyInput, 'Updated Body');
      await userEvent.upload(fileInput, mockFile);

      // Should show preview
      expect(screen.getByTestId('imagePreview')).toBeInTheDocument();

      // Button should be enabled
      expect(saveButton).not.toBeDisabled();

      // Verify form state
      expect(titleInput).toHaveValue('Updated Title');
      expect(bodyInput).toHaveValue('Updated Body');
    });

    it('handles edit mode when updatePost returns null', async () => {
      const updatePostNullMock = {
        request: {
          query: UPDATE_POST_MUTATION,
          variables: {
            input: {
              caption: 'Test Title',
              body: 'Test Body',
              id: 'post-123',
              isPinned: false,
              attachment: undefined,
            },
          },
        },
        result: {
          data: {
            updatePost: null,
          },
        },
      };

      renderComponent(
        {
          type: 'edit',
          id: 'post-123',
          title: '',
          body: '',
        },
        [updatePostNullMock],
      );

      const titleInput = screen.getByTestId('postTitleInput');
      const bodyInput = screen.getByTestId('postBodyInput');
      const saveButton = screen.getByText('Save Changes');

      await user.type(titleInput, 'Test Title');
      await user.type(bodyInput, 'Test Body');
      await user.click(saveButton);

      await waitFor(() => {
        expect(NotificationToast.success).not.toHaveBeenCalled();
        expect(defaultProps.refetch).not.toHaveBeenCalled();
      });
    });
    it('handles edit mode when updatePost returns success', async () => {
      const updatePostNullMock = {
        request: {
          query: UPDATE_POST_MUTATION,
          variables: {
            input: {
              caption: 'Test Title',
              body: 'Test Body',
              id: 'post-123',
              isPinned: false,
              attachment: undefined,
            },
          },
        },
        result: {
          data: {
            updatePost: {
              id: 'post-123',
              caption: 'Test Title',
              pinnedAt: null,
              attachments: [
                {
                  fileHash: 'mock-hash-123',
                  mimeType: 'image/jpeg',
                  name: 'test.jpg',
                  objectName: 'uploads/test.jpg',
                },
              ],
            },
          },
        },
      };

      renderComponent(
        {
          type: 'edit',
          id: 'post-123',
          title: '',
          body: '',
        },
        [updatePostNullMock],
      );

      const titleInput = screen.getByTestId('postTitleInput');
      const bodyInput = screen.getByTestId('postBodyInput');
      const saveButton = screen.getByText('Save Changes');

      await user.type(titleInput, 'Test Title');
      await user.type(bodyInput, 'Test Body');
      await user.click(saveButton);

      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalled();
      });
    });

    it('successfully updates post with file attachment in edit mode', async () => {
      const mockFile = new File(['test-content'], 'test.jpg', {
        type: 'image/jpeg',
      });

      // Use a matcher function for the mock since File objects are hard to compare
      const updatePostWithFileMock = {
        request: {
          query: UPDATE_POST_MUTATION,
        },
        variableMatcher: (variables: Record<string, unknown>) => {
          const input = variables.input as Record<string, unknown>;
          return (
            input.caption === 'Updated Title' &&
            input.body === 'Updated Body' &&
            input.id === 'post-123' &&
            input.isPinned === false &&
            input.attachment instanceof File
          );
        },
        result: {
          data: {
            updatePost: {
              id: 'post-123',
              caption: 'Updated Title',
              pinnedAt: null,
              attachments: [
                {
                  fileHash: 'mock-hash-123',
                  mimeType: 'image/jpeg',
                  name: 'test.jpg',
                  objectName: 'uploads/test.jpg',
                },
              ],
            },
          },
        },
      };

      renderComponent(
        {
          type: 'edit',
          id: 'post-123',
          title: '',
          body: '',
        },
        [updatePostWithFileMock],
      );

      const titleInput = screen.getByTestId('postTitleInput');
      const bodyInput = screen.getByTestId('postBodyInput');
      const fileInput = screen.getByTestId('addMedia');
      const saveButton = screen.getByText('Save Changes');

      await user.type(titleInput, 'Updated Title');
      await user.type(bodyInput, 'Updated Body');
      await userEvent.upload(fileInput, mockFile);

      // Verify preview appears
      await waitFor(() => {
        expect(screen.getByTestId('imagePreview')).toBeInTheDocument();
      });

      await user.click(saveButton);

      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalledWith(
          'Post updated successfully.',
        );
        expect(defaultProps.refetch).toHaveBeenCalled();
        expect(defaultProps.onHide).toHaveBeenCalled();
      });
    });
  });

  describe('File Input Clearing on Success', () => {
    it('clears file input DOM element after successful post creation', async () => {
      const mockFile = new File(['test-content'], 'test.jpg', {
        type: 'image/jpeg',
      });

      // Use a matcher function for the mock since File objects are hard to compare
      const createPostWithFileMock = {
        request: {
          query: CREATE_POST_MUTATION,
        },
        variableMatcher: (variables: Record<string, unknown>) => {
          const input = variables.input as Record<string, unknown>;
          return (
            input.caption === 'Post with File' &&
            input.body === '' &&
            input.organizationId === 'test-org-id' &&
            input.isPinned === false &&
            input.attachment instanceof File
          );
        },
        result: {
          data: {
            createPost: {
              __typename: 'Post',
              id: 'new-post-id',
              caption: 'Post with File',
              pinnedAt: null,
              attachmentURL: 'https://example.com/test.jpg',
            },
          },
        },
      };

      renderComponent({}, [createPostWithFileMock]);

      const titleInput = screen.getByTestId('postTitleInput');
      const fileInput = screen.getByTestId('addMedia') as HTMLInputElement;
      const postButton = screen.getByTestId('createPostBtn');

      // Verify id is set correctly on the file input
      expect(fileInput.id).toBe('addMedia');

      await user.type(titleInput, 'Post with File');
      await userEvent.upload(fileInput, mockFile);

      // Verify file was uploaded
      expect(fileInput.files).toHaveLength(1);

      await user.click(postButton);

      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalled();
        expect(defaultProps.refetch).toHaveBeenCalled();
        // Verify file input was cleared
        expect(fileInput.files?.length).toBe(0);
      });
    });
  });
});
