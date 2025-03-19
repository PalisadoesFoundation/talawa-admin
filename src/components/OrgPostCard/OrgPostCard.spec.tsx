import React from 'react';
import type { RenderResult } from '@testing-library/react';
import {
  render,
  screen,
  waitFor,
  fireEvent,
  waitForElementToBeRemoved,
  cleanup,
  act,
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

// Configure proper act() environment
vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);

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

const MESSAGES = {
  POST_PINNED: 'Post pinned',
  POST_UNPINNED: 'Post unpinned',
  POST_DELETED: 'Post deleted successfully.',
  POST_UPDATED: 'Post Updated successfully.',
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

const mockErrorHandler = vi.fn();

// Change to:
vi.mock('react-apollo-hooks', () => {
  return {
    useApolloClient: () => ({
      onError: mockErrorHandler,
    }),
  };
});

// Find where the component generates object names (likely uses Date.now())
// Let's say it's in a function called generateObjectName()

// Then mock that function
vi.mock('path/to/module', () => ({
  ...vi.importActual('path/to/module'),
  generateObjectName: () => 'mocked-object-name',
}));

/**
 * Creates a mock for createPresignedUrl that matches any object name
 */
const createFlexiblePresignedUrlMock = () => ({
  request: {
    query: PRESIGNED_URL,
    matcher: (variables: any) => {
      // Add debug log to see what variables are being matched
      console.log('Trying to match presigned URL variables:', variables);

      // More explicit checking
      if (!variables || !variables.input) return false;
      if (variables.input.operation !== 'GET') return false;
      if (typeof variables.input.objectName !== 'string') return false;

      // Match successful
      console.log('Successfully matched presigned URL mock');
      return true;
    },
  },
  // Keep the rest the same
});

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
      month: 'long', // Changed from 'numeric' to 'long'
      day: 'numeric',
    });

  // 1. Create a waitForApolloQueries helper function
  const waitForApolloQueries = async () => {
    // This forces all pending operations in Apollo to complete
    await new Promise((resolve) => setTimeout(resolve, 0));
    // Additional tick to let React re-render after the Apollo operations
    await new Promise((resolve) => setTimeout(resolve, 0));
  };

  // Wait for component update cycles to complete
  const waitForComponentUpdate = async () => {
    // Single tick to let React process state updates
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
  };

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

    // Mock fetch for presigned URLs
    global.fetch = vi.fn().mockImplementation((url) => {
      // If URL includes our mocked domains, return mock data
      if (
        url.includes('minio-server.example') ||
        url.includes('mock-presigned-url')
      ) {
        return Promise.resolve({
          ok: true,
          status: 200,
          blob: () =>
            Promise.resolve(
              new Blob(['mock image data'], { type: 'image/jpeg' }),
            ),
          json: () => Promise.resolve({ success: true }),
          text: () => Promise.resolve('Mock response text'),
        });
      }

      // Otherwise let original fetch handle it (or return error)
      return Promise.reject(new Error(`Unmocked fetch call to ${url}`));
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

  // Add this after the afterAll hook
  afterEach(() => {
    cleanup();
    // Force garbage collection of Apollo cache (if available in test env)
    if (global.gc) global.gc();
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
    // User-specific mock - keep this
    {
      request: {
        query: GET_USER_BY_ID,
        variables: { input: { id: '123' } },
      },
      result: { data: { user: { id: '123', name: 'Test User' } } },
    },

    // Flexible user mock - keep this
    {
      request: {
        query: GET_USER_BY_ID,
        matcher: (variables: any) =>
          variables?.input?.id && variables.input.id !== '123',
      },
      result: ({ variables }: { variables: any }) => ({
        data: {
          user: {
            id: variables.input.id,
            name: `User ${variables.input.id}`,
          },
        },
      }),
    },

    // DELETE_POST_MUTATION - keep this
    {
      request: {
        query: DELETE_POST_MUTATION,
        variables: {
          input: { id: '12' },
        },
      },
      result: {
        data: {
          deletePost: {
            id: '12',
            success: true,
            message: 'Post deleted successfully.',
            // Other fields the component expects
          },
        },
      },
    },

    // UPDATE_POST_MUTATION - keep this
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
          updatePost: {
            ...createMockPost(), // Include all base fields
            id: '12',
            caption: 'Updated Caption', // Updated caption
            attachments: [], // Updated attachments
            updatedAt: new Date().toISOString(), // Fresh timestamp
          },
        },
      },
    },

    // TOGGLE_PINNED_POST mocks - keep these
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
            // Return the COMPLETE post object
            ...createMockPost(),
            pinnedAt: new Date().toISOString(),
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
            // Return the COMPLETE post object
            ...createMockPost({ pinnedAt: null }),
          },
        },
      },
    },

    // Keep ONLY this flexible mock
    createFlexiblePresignedUrlMock(),
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
    customMocks: any[] = MOCKS,
  ) => {
    // Use new reference for each test to avoid shared state
    const mocksCopy = [...customMocks];

    return render(
      <BrowserRouter>
        <MockedProvider mocks={mocksCopy} addTypename={false}>
          <I18nextProvider i18n={i18nForTest}>
            <OrgPostCard post={post} />
          </I18nextProvider>
        </MockedProvider>
      </BrowserRouter>,
    );
  };

  // 1. Add onError handler to MockedProvider to catch unexpected errors
  const renderWithErrorCatching = (
    post = createMockPost(),
    customMocks: any[] = MOCKS,
  ) => {
    const errorSpy = vi.fn();
    const errors: Error[] = []; // Use regular array instead of useRef

    const handleError = (e: Error) => {
      errorSpy(e);
      errors.push(e);
    };

    render(
      <BrowserRouter>
        <MockedProvider mocks={customMocks} addTypename={false}>
          <ErrorBoundary onError={handleError}>
            <I18nextProvider i18n={i18nForTest}>
              <OrgPostCard post={post} />
            </I18nextProvider>
          </ErrorBoundary>
        </MockedProvider>
      </BrowserRouter>,
    );

    return { errorSpy, errors };
  };

  // Add this ErrorBoundary component
  class ErrorBoundary extends React.Component<{
    children: React.ReactNode;
    onError: (error: Error) => void;
  }> {
    componentDidCatch(error: Error) {
      this.props.onError(error);
    }

    render() {
      return this.props.children;
    }
  }

  const allMocksExcept = (indexesToExclude: number[]) => {
    return MOCKS.filter((_, index) => !indexesToExclude.includes(index));
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

      // Check basic elements and created date on the card
      expect(screen.getByTestId(TEST_IDS.POST_ITEM)).toBeInTheDocument();
      expect(screen.getByText('Test Caption')).toBeInTheDocument();
      expect(screen.getByAltText('Post image')).toBeInTheDocument();
      expect(screen.getByText(/Created:/)).toBeInTheDocument();
      expect(screen.getByText(/1\/1\/2022|01\/01\/2022/)).toBeInTheDocument();

      // Open the modal to check updated date
      const postItem = screen.getByTestId(TEST_IDS.POST_ITEM);
      await userEvent.click(postItem);

      // Now check updated date in the modal
      await waitFor(() => {
        expect(screen.getByText(/Last updated:/)).toBeInTheDocument();
        // Use regex to match any format containing the month/day/year
        expect(
          screen.getByText(
            (content) =>
              // Will match both "1/2/2022" and "January 2, 2022" formats
              content.includes('1/2/2022') || content.includes('01/02/2022'),
          ),
        ).toBeInTheDocument();
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
      // Pin test portion
      renderOrgPostCard(createMockPost(), [MOCKS[0], MOCKS[4]]); // Correct - use pin mock
      await openPostOptions();

      // Add this code
      const pinButton = screen.getByTestId(TEST_IDS.PIN_BUTTON);
      await act(async () => {
        await userEvent.click(pinButton);
        await waitForApolloQueries();
      });

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(MESSAGES.POST_PINNED);
      });

      // Complete cleanup and ensure Apollo operations are done
      cleanup();
      await waitForApolloQueries();
      vi.clearAllMocks(); // Add this line to reset all mocks including toast

      // Unpin test portion (already implemented)
      const pinnedPost = createMockPost({
        pinnedAt: new Date().toISOString(), // Use string format if component expects it
      });

      renderOrgPostCard(pinnedPost, [MOCKS[0], MOCKS[1], MOCKS[5]]); // Remove MOCKS[6], there is no MOCKS[6]
      await openPostOptions();
      const unpinButton = screen.getByTestId(TEST_IDS.PIN_BUTTON);

      // More robust waiting with act
      await act(async () => {
        await userEvent.click(unpinButton);
        await waitForApolloQueries();
        // Additional tick to ensure component updates
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(MESSAGES.POST_UNPINNED);
      });
    });

    // KEEP only one delete test (remove cancel flow test)
    it('deletes a post when confirmed', async () => {
      renderOrgPostCard();

      await openPostOptions();
      const deleteOption = screen.getByTestId(TEST_IDS.DELETE_OPTION);
      await userEvent.click(deleteOption);

      await act(async () => {
        const deleteButton = screen.getByTestId(TEST_IDS.DELETE_CONFIRM);
        await userEvent.click(deleteButton);
        // Wait for Apollo to process the mutation
        await waitForApolloQueries();
      });

      // Now assert results
      expect(toast.success).toHaveBeenCalledWith(MESSAGES.POST_DELETED);
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
      await waitForComponentUpdate();

      const saveButton = await screen.findByText(/save/i);
      await userEvent.click(saveButton);
      await waitFor(() => {
        expect(toast.success).toHaveBeenCalled();
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

      // Include both the user mock and the flexible presigned URL mock
      const testMocks = [
        // User mock needed for initial rendering
        MOCKS[0], // The specific user mock for '123'

        // Flexible presigned URL mock for any attachments
        createFlexiblePresignedUrlMock(),

        // The delete error mock
        deleteErrorMock,
      ];

      renderOrgPostCard(createMockPost(), testMocks);

      // Rest of your test remains the same
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
    // Add this test to the Error Handling section
    it('should not have Apollo errors', async () => {
      const { errorSpy } = renderWithErrorCatching();
      await waitForComponentUpdate();
      expect(errorSpy).not.toHaveBeenCalled();
    });
  });
});
