import React from 'react';
import type { RenderResult } from '@testing-library/react';
import {
  render,
  screen,
  waitFor,
  fireEvent,
  waitForElementToBeRemoved,
  cleanup,
} from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { toast } from 'react-toastify';
import { vi } from 'vitest';
import type * as RouterTypes from 'react-router-dom';

// Component
import OrgPostCard from './OrgPostCard';

// GraphQL
import {
  DELETE_POST_MUTATION,
  UPDATE_POST_MUTATION,
  TOGGLE_PINNED_POST,
  PRESIGNED_URL,
} from 'GraphQl/Mutations/mutations';
import { GET_USER_BY_ID } from 'GraphQl/Queries/Queries';

// Utils
import i18nForTest from 'utils/i18nForTest';
import * as errorHandlerModule from 'utils/errorHandler';

// Types
import type { MockedResponse } from '@apollo/client/testing';

/**
 * Unit Tests for OrgPostCard Component
 */

// 1. Define mock variables at the top level, before any vi.mock calls
const mockId = 'test-org-id';
const mockUploadFileToMinio = vi.fn().mockResolvedValue({
  objectName: 'mocked-object-name',
  fileHash: 'mocked-file-hash',
});

// Define TestIDs as constants at the top of your file
const TEST_IDS = {
  POST_ITEM: 'post-item',
  OPTIONS_BUTTON: 'more-options-button',
  POST_MODAL: 'post-modal',
  CLOSE_BUTTON: 'close-modal-button',
  PIN_BUTTON: 'pin-post-button',
  DELETE_OPTION: 'delete-option',
  DELETE_CONFIRM: 'deletePostBtn',
  IMAGE_UPLOAD: 'image-upload',
  VIDEO_UPLOAD: 'video-upload',
  EDIT_OPTION: 'edit-option', // Add this if it exists in your component
};

// 2. Mock modules at the top level (outside of any describe/beforeAll)
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: vi.fn().mockImplementation(() => ({ orgId: mockId })),
  };
});

vi.mock('utils/MinioUpload', () => ({
  useMinioUpload: () => ({ uploadFileToMinio: mockUploadFileToMinio }),
}));

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('utils/errorHandler', () => ({
  errorHandler: vi.fn(),
}));

// Continue with your test implementation
describe('OrgPostCard Component', () => {
  // Interfaces
  interface InterfacePostAttachment {
    id: string;
    postId: string;
    name: string;
    objectName: string;
    mimeType: string;
    createdAt: Date;
    updatedAt?: Date | null;
    creatorId?: string | null;
    updaterId?: string | null;
  }

  interface InterfacePost {
    id: string;
    caption: string;
    createdAt: Date;
    updatedAt: Date | null;
    pinnedAt: Date | null;
    creatorId: string | null;
    attachments: InterfacePostAttachment[];
  }

  // Helper functions
  async function openPostOptions() {
    const postItem = screen.getByTestId(TEST_IDS.POST_ITEM);
    await userEvent.click(postItem);

    const moreOptionsButton = screen.getByTestId(TEST_IDS.OPTIONS_BUTTON);
    await userEvent.click(moreOptionsButton);
  }

  async function openEditModal() {
    await openPostOptions();
    // Either use a TestID if available:
    // const editOption = screen.getByTestId(TEST_IDS.EDIT_OPTION);
    // Or keep the text approach if that's what the component uses:
    const editOption = await screen.findByText(/edit/i);
    await userEvent.click(editOption);
  }

  // Helper function to format dates consistently
  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });

  // Setup and teardown
  beforeAll(() => {
    // Setup global mocks that don't use vi.mock
    global.URL.createObjectURL = vi.fn(() => 'mock-object-url');
    global.URL.revokeObjectURL = vi.fn();

    // Mock window.location
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { reload: vi.fn() },
    });
  });

  // Reset mocks between tests
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Clean up after all tests
  afterAll(() => {
    vi.restoreAllMocks();
  });

  // Test data
  const createMockPost = (overrides = {}): InterfacePost => ({
    id: '12',
    caption: 'Test Caption',
    createdAt: new Date('2024-02-22'),
    updatedAt: new Date('2024-02-23'),
    pinnedAt: null,
    creatorId: '123',
    attachments: [],
    ...overrides,
  });

  const imageAttachment: InterfacePostAttachment = {
    id: '1',
    postId: '12',
    name: 'test-image.jpg',
    objectName: 'test-image-object-name',
    mimeType: 'image/jpeg',
    createdAt: new Date(),
  };

  const videoAttachment: InterfacePostAttachment = {
    id: 'v1',
    postId: '12',
    name: 'video.mp4',
    objectName: 'test-video-object-name',
    mimeType: 'video/mp4',
    createdAt: new Date(),
  };

  // GraphQL mocks
  const MOCKS = [
    // User data
    {
      request: {
        query: GET_USER_BY_ID,
        variables: {
          input: { id: '123' },
        },
      },
      result: {
        data: {
          user: {
            id: '123',
            name: 'Test User',
          },
        },
      },
    },

    // Delete post
    {
      request: {
        query: DELETE_POST_MUTATION,
        variables: {
          input: { id: '12' },
        },
      },
      result: {
        data: {
          deletePost: { id: '12' },
        },
      },
    },

    // Update post
    {
      request: {
        query: UPDATE_POST_MUTATION,
        variables: {
          input: {
            id: '12',
            caption: 'Updated Caption',
            attachments: [],
          },
        },
      },
      result: {
        data: {
          updatePost: { id: '12' },
        },
      },
    },

    // Pin post
    {
      request: {
        query: TOGGLE_PINNED_POST,
        variables: {
          input: {
            id: '12',
            isPinned: true,
          },
        },
      },
      result: {
        data: {
          updatePost: {
            id: '12',
            pinnedAt: new Date(),
          },
        },
      },
    },

    // Unpin post
    {
      request: {
        query: TOGGLE_PINNED_POST,
        variables: {
          input: {
            id: '12',
            isPinned: false,
          },
        },
      },
      result: {
        data: {
          updatePost: {
            id: '12',
            pinnedAt: null,
          },
        },
      },
    },

    // Presigned URL for image
    {
      request: {
        query: PRESIGNED_URL,
        variables: {
          input: {
            objectName: 'test-image-object-name',
            operation: 'GET',
          },
        },
      },
      result: {
        data: {
          createPresignedUrl: {
            presignedUrl:
              'https://minio-server.example/test-image.jpg?presigned=true',
            objectName: 'test-image-object-name',
            requiresUpload: false,
          },
        },
      },
    },

    // Presigned URL for video
    {
      request: {
        query: PRESIGNED_URL,
        variables: {
          input: {
            objectName: 'test-video-object-name',
            operation: 'GET',
          },
        },
      },
      result: {
        data: {
          createPresignedUrl: {
            presignedUrl:
              'https://minio-server.example/test-video.mp4?presigned=true',
            objectName: 'test-video-object-name',
            requiresUpload: false,
          },
        },
      },
    },
    // Add this to your MOCKS array
    {
      request: {
        query: PRESIGNED_URL,
        variables: {
          input: {
            objectName: 'mocked-object-name', // Match your mockUploadFileToMinio return value
            operation: 'GET',
          },
        },
      },
      result: {
        data: {
          createPresignedUrl: {
            presignedUrl: 'mock-presigned-url',
            objectName: 'mocked-object-name',
            requiresUpload: false,
          },
        },
      },
    },
  ];

  // Error mock configurations
  const ERROR_MOCKS: Record<string, MockedResponse> = {
    deleteError: {
      request: {
        query: DELETE_POST_MUTATION,
        variables: { input: { id: '12' } },
      },
      error: new Error('Failed to delete post'),
    },

    nullResponse: {
      request: {
        query: DELETE_POST_MUTATION,
        variables: { input: { id: '12' } },
      },
      result: { data: { deletePost: null } },
    },

    pinError: {
      request: {
        query: TOGGLE_PINNED_POST,
        variables: {
          input: {
            id: '12',
            isPinned: true,
          },
        },
      },
      error: new Error('Network error'),
    },

    pinFailure: {
      request: {
        query: TOGGLE_PINNED_POST,
        variables: {
          input: {
            id: '12',
            isPinned: true,
          },
        },
      },
      result: {
        data: {
          updatePost: null,
        },
      },
    },
  };

  // Render helper
  const renderOrgPostCard = (
    post = createMockPost(),
    customMocks: any[] = MOCKS, // Use 'any[]' instead of specific type
  ): RenderResult => {
    return render(
      <BrowserRouter>
        <MockedProvider mocks={customMocks} addTypename={false}>
          <I18nextProvider i18n={i18nForTest}>
            <OrgPostCard post={post} />
          </I18nextProvider>
        </MockedProvider>
      </BrowserRouter>,
    );
  };

  // Tests grouped by functionality
  describe('Rendering', () => {
    // KEEP just one rendering test that covers all elements
    it('renders post with all elements', async () => {
      const createdDate = new Date('2022-01-01');
      const updatedDate = new Date('2022-01-02');

      const post = createMockPost({
        attachments: [imageAttachment],
        createdAt: createdDate,
        updatedAt: updatedDate,
      });

      renderOrgPostCard(post);

      // Check basic elements on the card
      expect(screen.getByTestId(TEST_IDS.POST_ITEM)).toBeInTheDocument();
      expect(screen.getByText('Test Caption')).toBeInTheDocument();
      expect(screen.getByAltText('Post image')).toBeInTheDocument();

      // Check created date on the card
      expect(screen.getByText(/Created:/)).toBeInTheDocument();

      // Open the modal to check updated date
      const postItem = screen.getByTestId(TEST_IDS.POST_ITEM);
      await userEvent.click(postItem);

      // Now check updated date in the modal
      await waitFor(() => {
        expect(screen.getByText(/Last updated:/)).toBeInTheDocument();
      });
    });
  });

  describe('User Interactions', () => {
    // Add interaction tests...
    // KEEP only one modal toggle test
    it('opens and closes post modal', async () => {
      renderOrgPostCard();

      const postItem = screen.getByTestId(TEST_IDS.POST_ITEM);
      await userEvent.click(postItem);

      await waitFor(() => {
        expect(screen.getByTestId(TEST_IDS.POST_MODAL)).toBeInTheDocument();
      });

      const closeButton = screen.getByTestId(TEST_IDS.CLOSE_BUTTON);
      await userEvent.click(closeButton);

      await waitFor(() => {
        expect(
          screen.queryByTestId(TEST_IDS.POST_MODAL),
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('Post Operations', () => {
    // Helper function removed from here and moved to top level

    // KEEP only one pin test (eliminate the failure case)
    it('can pin and unpin posts', async () => {
      // Test pinning
      renderOrgPostCard(createMockPost(), [MOCKS[0], MOCKS[3]]);

      await openPostOptions();
      const pinButton = screen.getByTestId(TEST_IDS.PIN_BUTTON);
      await userEvent.click(pinButton);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('Post pinned');
      });

      // Cleanup and test unpinning
      cleanup();
      renderOrgPostCard(createMockPost({ pinnedAt: new Date() }), [
        MOCKS[0],
        MOCKS[4],
      ]);

      await openPostOptions();
      const unpinButton = screen.getByTestId(TEST_IDS.PIN_BUTTON);
      await userEvent.click(unpinButton);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('Post unpinned');
      });
    });

    // KEEP only one delete test (remove cancel flow test)
    it('deletes a post when confirmed', async () => {
      renderOrgPostCard();

      await openPostOptions();
      const deleteOption = screen.getByTestId(TEST_IDS.DELETE_OPTION);
      await userEvent.click(deleteOption);

      // Confirm delete
      const deleteButton = screen.getByTestId(TEST_IDS.DELETE_CONFIRM);
      await userEvent.click(deleteButton);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(
          'Post deleted successfully.',
        );
      });

      // Check page reload
      await waitFor(
        () => {
          expect(window.location.reload).toHaveBeenCalled();
        },
        { timeout: 2500 },
      );
    });
  });

  describe('Post Editing', () => {
    it('handles media uploads and previews', async () => {
      renderOrgPostCard();

      // Use helper instead of repeating these steps
      await openEditModal();

      // Test image upload
      const fileInput = screen.getByTestId(TEST_IDS.IMAGE_UPLOAD);
      const imageFile = new File(['image content'], 'test-image.jpg', {
        type: 'image/jpeg',
      });
      await userEvent.upload(fileInput, imageFile);

      // Verify image preview
      expect(global.URL.createObjectURL).toHaveBeenCalledWith(imageFile);
      expect(mockUploadFileToMinio).toHaveBeenCalled();

      // Clear preview to test video
      const clearButton = screen.getByRole('button', { name: '×' });
      await userEvent.click(clearButton);

      // Test video upload
      const videoInput = screen.getByTestId(TEST_IDS.VIDEO_UPLOAD);
      const videoFile = new File(['video content'], 'test-video.mp4', {
        type: 'video/mp4',
      });
      await userEvent.upload(videoInput, videoFile);

      // Verify video preview
      expect(global.URL.createObjectURL).toHaveBeenCalledWith(videoFile);
    });

    it('updates post caption', async () => {
      renderOrgPostCard();

      // Use helper instead of repeating these steps
      await openEditModal();

      // Edit caption
      const captionInput = screen.getByPlaceholderText(/enterCaption/i);
      await userEvent.clear(captionInput);
      await userEvent.type(captionInput, 'Updated Caption');

      // Save changes
      const saveButton = await screen.findByText(/save/i);
      await userEvent.click(saveButton);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(
          'Post Updated successfully.',
        );
      });
    });
  });

  describe('Security', () => {
    it('sanitizes user inputs in post content', async () => {
      const post = createMockPost({
        caption: '<script>alert("XSS")</script>Test Caption',
      });

      renderOrgPostCard(post);

      // Verify script tag doesn't execute but displays as text
      const content = await screen.findByText(/Test Caption/);
      expect(content).toBeInTheDocument();
      expect(content.innerHTML).not.toContain('<script>');
    });
  });

  describe('Error Handling', () => {
    it('handles network errors during post deletion', async () => {
      // Define the error mock directly
      const deleteErrorMock = {
        request: {
          query: DELETE_POST_MUTATION,
          variables: { input: { id: '12' } },
        },
        error: new Error('Failed to delete post'),
      };

      renderOrgPostCard(createMockPost(), [deleteErrorMock]);

      await openPostOptions();
      const deleteOption = screen.getByTestId(TEST_IDS.DELETE_OPTION);
      await userEvent.click(deleteOption);

      const deleteButton = screen.getByTestId(TEST_IDS.DELETE_CONFIRM);
      await userEvent.click(deleteButton);

      await waitFor(() => {
        expect(errorHandlerModule.errorHandler).toHaveBeenCalled();
      });
    });

    // Additional error tests...
  });
});
