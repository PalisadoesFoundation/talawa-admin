import React from 'react';
import type { RenderResult } from '@testing-library/react';
import {
  render,
  screen,
  waitFor,
  fireEvent,
  cleanup,
} from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';
import OrgPostCard from './OrgPostCard';
import {
  DELETE_POST_MUTATION,
  UPDATE_POST_MUTATION,
  TOGGLE_PINNED_POST,
} from 'GraphQl/Mutations/mutations';
import { GET_USER_BY_ID } from 'GraphQl/Queries/Queries';
import i18nForTest from 'utils/i18nForTest';
import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { toast } from 'react-toastify';
import type { DocumentNode } from 'graphql';
import * as errorHandlerModule from 'utils/errorHandler';
import type { MockedResponse } from '@apollo/client/testing';
// Add imports for MinIO implementation
import { useMinioUpload } from 'utils/MinioUpload';
import { useParams } from 'react-router-dom';

/**
 * Unit Tests for OrgPostCard Component
 *
 * This test suite validates the functionality of the OrgPostCard component,
 * which handles the display and interaction with organization posts.
 *
 * Key Test Areas:
 * 1. Component Rendering
 * 2. User Interactions
 * 3. Mutation Operations
 * 4. Media Handling
 * 5. Error/State Management
 *
 * Test Strategy:
 * - Uses Apollo MockedProvider for GraphQL operation mocking
 * - Leverages react-i18next for internationalization
 * - Employs userEvent for realistic interaction simulation
 * - Verifies both UI states and business logic outcomes
 */

// Mock the react-router-dom useParams hook
vi.mock('react-router-dom', () => ({
  useParams: () => ({ orgId: 'test-org' }),
}));

// Mock the MinioUpload hook
const mockUploadFileToMinio = vi.fn().mockResolvedValue({
  objectName: 'test-object-name',
});

vi.mock('utils/MinioUpload', () => ({
  useMinioUpload: () => ({
    uploadFileToMinio: mockUploadFileToMinio,
  }),
}));

// Mock URL.createObjectURL and URL.revokeObjectURL
global.URL.createObjectURL = vi.fn(() => 'mocked-object-url');
global.URL.revokeObjectURL = vi.fn();

interface InterfacePostAttachment {
  id: string;
  postId: string;
  name: string;
  objectName?: string; // Added for MinIO
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

interface InterfaceMockedResponse {
  request: {
    query: DocumentNode;
    variables: {
      input: {
        id: string;
        isPinned?: boolean;
        caption?: string;
        attachments?: Array<{
          objectName?: string; // Added for MinIO
          mimeType?: string;
        }>;
      };
    };
  };
  result?: {
    data: {
      updatePost: {
        id: string;
        pinnedAt: Date | null;
      };
    };
  };
  error?: Error;
}

interface InterfaceUserMockedResponse {
  request: {
    query: DocumentNode;
    variables: {
      input: {
        id: string;
      };
    };
  };
  result: {
    data: {
      user: {
        id: string;
        name: string;
      };
    };
  };
}

interface InterfaceFailedMockedResponse {
  request: {
    query: DocumentNode;
    variables: {
      input: {
        id: string;
        isPinned: boolean;
      };
    };
  };
  result?: {
    data: {
      updatePost: { id: string; pinnedAt: Date | null } | null;
    };
  };
  error?: Error;
}

const userMock: InterfaceUserMockedResponse = {
  request: {
    query: GET_USER_BY_ID,
    variables: {
      input: { id: '123' },
    },
  },
  result: {
    data: {
      user: { id: '123', name: 'Test User' },
    },
  },
};

const successMock = {
  request: {
    query: DELETE_POST_MUTATION,
    variables: { input: { id: '12' } },
  },
  result: {
    data: { deletePost: { id: '12' } },
  },
};

const errorMock = {
  request: {
    query: DELETE_POST_MUTATION,
    variables: { input: { id: '12' } },
  },
  error: new Error('Failed to delete post'),
};

const nullResponseMock = {
  request: {
    query: DELETE_POST_MUTATION,
    variables: { input: { id: '12' } },
  },
  result: {
    data: { deletePost: null },
  },
};

vi.mock('utils/errorHandler', () => ({
  errorHandler: vi.fn(),
}));

// Mock the dependencies
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('OrgPostCard Component', () => {
  const mockPost = {
    id: '12',
    caption: 'Test Caption',
    createdAt: new Date('2024-02-22'),
    updatedAt: new Date('2024-02-23'),
    pinnedAt: null,
    creatorId: '123',
    attachments: [
      {
        id: '1',
        postId: '12',
        name: 'test-image.jpg',
        objectName: 'test-image-object', // Added for MinIO
        mimeType: 'image/jpeg',
        createdAt: new Date(),
      },
    ],
  };

  const videoPost = {
    ...{
      id: '12',
      caption: 'Test Caption with Video',
      createdAt: new Date('2024-02-22'),
      updatedAt: new Date('2024-02-23'),
      pinnedAt: null,
      creatorId: '123',
      attachments: [
        {
          id: 'v1',
          postId: '12',
          name: 'video.mp4',
          objectName: 'test-video-object', // Added for MinIO
          mimeType: 'video/mp4',
          createdAt: new Date(),
        },
      ],
    },
  };

  const renderComponentVideo = (): RenderResult => {
    return render(
      <MockedProvider mocks={[userMock as MockedResponse]} addTypename={false}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard post={videoPost} />
        </I18nextProvider>
      </MockedProvider>,
    );
  };

  const mocks = [
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
    // Mock for delete mutation
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
          },
        },
      },
    },
    // Mock for pin toggle mutation
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
    // Updated for MinIO - attachments now include objectName
    {
      request: {
        query: UPDATE_POST_MUTATION,
        variables: {
          input: {
            id: '12',
            caption: 'Updated Caption',
            attachments: [
              {
                objectName: 'test-object-name',
                mimeType: 'image/jpeg',
              },
            ],
          },
        },
      },
      result: {
        data: {
          updatePost: {
            id: '12',
          },
        },
      },
    },
  ];

  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { reload: vi.fn() },
    });
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = (): RenderResult => {
    return render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard post={mockPost} />
        </I18nextProvider>
      </MockedProvider>,
    );
  };

  describe('Tests', () => {
    it('renders the post card with basic information', () => {
      renderComponent();

      expect(screen.getByText('Test Caption')).toBeInTheDocument();
      expect(
        screen.getByText(/Created:\s*\d{1,2}\/\d{1,2}\/\d{4}/),
      ).toBeInTheDocument();
      expect(screen.getByTestId('post-item')).toBeInTheDocument();
    });

    it('displays the correct image using MinIO objectName', () => {
      const objectName = 'test-image-object';
      const endpoint = 'images';
      const expectedUrl = `/api/${endpoint}/${objectName}`;

      renderComponent();

      const image = screen.getByAltText('Post image');
      expect(image).toBeInTheDocument();

      // Should use the image URL with objectName
      expect(image.getAttribute('src')).toContain(expectedUrl);
    });

    it('closes the modal and stops event propagation when the close button is clicked', async () => {
      render(
        <MockedProvider>
          <OrgPostCard post={mockPost} />
        </MockedProvider>,
      );

      const postItem = screen.getByTestId('post-item');
      fireEvent.click(postItem);

      const modal = await screen.findByTestId('post-modal');
      expect(modal).toBeInTheDocument();

      const closeButton = screen.getByTestId('close-modal-button');

      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      });
      const stopPropagationSpy = vi.spyOn(clickEvent, 'stopPropagation');
      closeButton.dispatchEvent(clickEvent);

      expect(stopPropagationSpy).toHaveBeenCalled();

      await waitFor(() => {
        expect(screen.queryByTestId('post-modal')).toBeNull();
      });
    });

    it('shows default image when no image attachment is provided', () => {
      const postWithoutImage = {
        ...mockPost,
        attachments: [],
      };

      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <I18nextProvider i18n={i18nForTest}>
            <OrgPostCard post={postWithoutImage} />
          </I18nextProvider>
        </MockedProvider>,
      );

      const defaultImage = screen.getByAltText('Default image');
      expect(defaultImage).toBeInTheDocument();
    });

    it('handleVideoPlay: sets playing to true and calls video.play()', async () => {
      renderComponentVideo();

      const videoElement = screen.getByTestId('video') as HTMLVideoElement;
      videoElement.play = vi.fn();

      fireEvent.mouseEnter(videoElement);

      await waitFor(() => {
        expect(videoElement.play).toHaveBeenCalled();
      });
    });

    it('handleVideoPause: sets playing to false and calls video.pause()', async () => {
      renderComponentVideo();

      const videoElement = screen.getByTestId('video') as HTMLVideoElement;
      videoElement.pause = vi.fn();

      fireEvent.mouseLeave(videoElement);

      await waitFor(() => {
        expect(videoElement.pause).toHaveBeenCalled();
      });
    });

    it('handleInputChange: updates the caption in the edit modal', async () => {
      const simplePost = {
        id: '12',
        caption: 'Test Caption',
        createdAt: new Date('2024-02-22'),
        updatedAt: new Date('2024-02-23'),
        pinnedAt: null,
        creatorId: '123',
        attachments: [],
      };

      render(
        <MockedProvider
          mocks={[userMock as MockedResponse]}
          addTypename={false}
        >
          <I18nextProvider i18n={i18nForTest}>
            <OrgPostCard post={simplePost} />
          </I18nextProvider>
        </MockedProvider>,
      );

      const postItem = screen.getByTestId('post-item');
      await userEvent.click(postItem);

      const moreOptionsButton = screen.getByTestId('more-options-button');
      await userEvent.click(moreOptionsButton);
      const editOption = screen.getByText(/edit/i);
      await userEvent.click(editOption);

      const captionInput = await screen.findByPlaceholderText(/enterCaption/i);
      expect(captionInput).toBeInTheDocument();

      fireEvent.change(captionInput, { target: { value: 'Updated Caption' } });
      expect((captionInput as HTMLInputElement).value).toBe('Updated Caption');
    });

    // Updated for MinIO - Tests image upload with MinIO
    it('uploads image to MinIO and shows preview when image is selected', async () => {
      renderComponent();
      const postItem = screen.getByTestId('post-item');
      await userEvent.click(postItem);
      const moreOptionsButton = screen.getByTestId('more-options-button');
      await userEvent.click(moreOptionsButton);
      const editOption = screen.getByText(/edit/i);
      await userEvent.click(editOption);

      const fileInput = await screen.findByTestId('image-upload');
      expect(fileInput).toBeInTheDocument();

      const file = new File(['dummy content'], 'dummy-image.jpg', {
        type: 'image/jpeg',
      });
      await userEvent.upload(fileInput, file);

      // Check if MinIO upload was called
      expect(mockUploadFileToMinio).toHaveBeenCalledWith(file, 'test-org');

      // Check for createObjectURL
      expect(URL.createObjectURL).toHaveBeenCalledWith(file);

      const previewImage = await screen.findByAltText('Preview');
      expect(previewImage).toBeInTheDocument();
    });

    it('removes the preview image and revokes object URL when clearImage is triggered', async () => {
      renderComponent();
      const postItem = screen.getByTestId('post-item');
      await userEvent.click(postItem);
      const moreOptionsButton = screen.getByTestId('more-options-button');
      await userEvent.click(moreOptionsButton);
      const editOption = screen.getByText(/edit/i);
      await userEvent.click(editOption);

      const fileInput = await screen.findByTestId('image-upload');
      expect(fileInput).toBeInTheDocument();

      const file = new File(['dummy content'], 'dummy-image.jpg', {
        type: 'image/jpeg',
      });
      await userEvent.upload(fileInput, file);

      const previewImage = await screen.findByAltText('Preview');
      expect(previewImage).toBeInTheDocument();

      const clearButton = screen.getByRole('button', { name: '×' });
      expect(clearButton).toBeInTheDocument();

      await userEvent.click(clearButton);

      // Check if URL.revokeObjectURL was called
      expect(URL.revokeObjectURL).toHaveBeenCalledWith('mocked-object-url');

      await waitFor(() => {
        expect(screen.queryByAltText('Preview')).not.toBeInTheDocument();
      });
    });

    // Updated for MinIO - Tests video upload with MinIO
    it('uploads video to MinIO and removes the preview video when clearVideo is triggered', async () => {
      renderComponent();

      const postItem = screen.getByTestId('post-item');
      await userEvent.click(postItem);
      const moreOptionsButton = screen.getByTestId('more-options-button');
      await userEvent.click(moreOptionsButton);
      const editOption = screen.getByText(/edit/i);
      await userEvent.click(editOption);

      const videoInput = await screen.findByTestId('video-upload');
      expect(videoInput).toBeInTheDocument();

      const file = new File(['dummy video content'], 'dummy-video.mp4', {
        type: 'video/mp4',
      });
      await userEvent.upload(videoInput, file);

      // Check if MinIO upload was called
      expect(mockUploadFileToMinio).toHaveBeenCalledWith(file, 'test-org');

      const previewVideo = await screen.findByTestId('video-preview');
      expect(previewVideo).toBeInTheDocument();

      const clearButton = screen.getByRole('button', { name: '×' });
      expect(clearButton).toBeInTheDocument();

      await userEvent.click(clearButton);

      // Check if URL.revokeObjectURL was called
      expect(URL.revokeObjectURL).toHaveBeenCalledWith('mocked-object-url');

      await waitFor(() => {
        expect(screen.queryByTestId('video-preview')).not.toBeInTheDocument();
      });
    });

    it('deletes a post successfully', async () => {
      render(
        <MockedProvider mocks={[successMock]} addTypename={false}>
          <I18nextProvider i18n={i18nForTest}>
            <OrgPostCard post={mockPost} />
          </I18nextProvider>
        </MockedProvider>,
      );

      const postItem = screen.getByTestId('post-item');
      await userEvent.click(postItem);

      const moreOptionsButton = screen.getByTestId('more-options-button');
      await userEvent.click(moreOptionsButton);

      const deleteOption = screen.getByTestId('delete-option');
      await userEvent.click(deleteOption);

      const modal = await screen.findByTestId('delete-post-modal');
      expect(modal).toBeInTheDocument();

      const deleteButton = screen.getByTestId('deletePostBtn');
      await userEvent.click(deleteButton);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(
          'Post deleted successfully.',
        );
      });

      await waitFor(
        () => {
          expect(window.location.reload).toHaveBeenCalled();
        },
        { timeout: 2500 },
      );
    });

    it('handles delete error gracefully', async () => {
      render(
        <MockedProvider mocks={[errorMock]} addTypename={false}>
          <I18nextProvider i18n={i18nForTest}>
            <OrgPostCard post={mockPost} />
          </I18nextProvider>
        </MockedProvider>,
      );

      const postItem = screen.getByTestId('post-item');
      await userEvent.click(postItem);

      const moreOptionsButton = screen.getByTestId('more-options-button');
      await userEvent.click(moreOptionsButton);

      const deleteOption = screen.getByTestId('delete-option');
      await userEvent.click(deleteOption);

      const deleteButton = screen.getByTestId('deletePostBtn');
      await userEvent.click(deleteButton);

      await waitFor(() => {
        expect(errorHandlerModule.errorHandler).toHaveBeenCalled();
      });
    });

    it('handles null response gracefully', async () => {
      render(
        <MockedProvider mocks={[nullResponseMock]} addTypename={false}>
          <I18nextProvider i18n={i18nForTest}>
            <OrgPostCard post={mockPost} />
          </I18nextProvider>
        </MockedProvider>,
      );

      const postItem = screen.getByTestId('post-item');
      await userEvent.click(postItem);

      const moreOptionsButton = screen.getByTestId('more-options-button');
      await userEvent.click(moreOptionsButton);

      const deleteOption = screen.getByTestId('delete-option');
      await userEvent.click(deleteOption);

      const deleteButton = screen.getByTestId('deletePostBtn');
      await userEvent.click(deleteButton);

      await waitFor(() => {
        expect(toast.success).not.toHaveBeenCalled();
        expect(window.location.reload).not.toHaveBeenCalled();
      });
    });

    it('closes delete modal when cancel is clicked', async () => {
      render(
        <MockedProvider mocks={[]} addTypename={false}>
          <I18nextProvider i18n={i18nForTest}>
            <OrgPostCard post={mockPost} />
          </I18nextProvider>
        </MockedProvider>,
      );

      const postItem = screen.getByTestId('post-item');
      await userEvent.click(postItem);

      const moreOptionsButton = screen.getByTestId('more-options-button');
      await userEvent.click(moreOptionsButton);

      const deleteOption = screen.getByTestId('delete-option');
      await userEvent.click(deleteOption);

      const cancelButton = screen.getByTestId('deleteModalNoBtn');
      await userEvent.click(cancelButton);

      await waitFor(() => {
        expect(
          screen.queryByTestId('delete-post-modal'),
        ).not.toBeInTheDocument();
      });
    });

    it('handles MinIO upload errors gracefully', async () => {
      // Add console.error spy
      const consoleErrorSpy = vi.spyOn(console, 'error');

      // Mock upload failure
      mockUploadFileToMinio.mockRejectedValueOnce(new Error('Upload failed'));

      renderComponent();
      const postItem = screen.getByTestId('post-item');
      await userEvent.click(postItem);
      const moreOptionsButton = screen.getByTestId('more-options-button');
      await userEvent.click(moreOptionsButton);
      const editOption = screen.getByText(/edit/i);
      await userEvent.click(editOption);

      const fileInput = await screen.findByTestId('image-upload');

      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      await userEvent.upload(fileInput, file);

      await waitFor(() => {
        // Check both console.error and toast.error are called with correct messages
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Failed to upload image:',
          expect.any(Error),
        );
        expect(toast.error).toHaveBeenCalledWith('Failed to upload image');
      });

      // Restore console.error
      consoleErrorSpy.mockRestore();
    });

    it('constructs correct media URLs using objectName for different media types', async () => {
      // Calculate expected URLs the same way the component does
      const imageObjectName = 'test-image-object';
      const imageType = 'image/jpeg';
      const imageEndpoint = imageType.startsWith('image/')
        ? 'images'
        : 'videos';
      const expectedImageUrl = `/api/${imageEndpoint}/${imageObjectName}`;

      const videoObjectName = 'test-video-object';
      const videoType = 'video/mp4';
      const videoEndpoint = videoType.startsWith('image/')
        ? 'images'
        : 'videos';
      const expectedVideoUrl = `/api/${videoEndpoint}/${videoObjectName}`;

      // Test image URL construction
      renderComponent();
      const imageElement = screen.getByAltText('Post image');
      expect(imageElement).toBeInTheDocument();
      expect(imageElement.getAttribute('src')).toContain(expectedImageUrl);

      // Test video URL construction
      renderComponentVideo();
      const videoElement = screen.getByTestId('video');
      const sourceElement = videoElement.querySelector('source');
      expect(sourceElement).toBeInTheDocument();
      expect(sourceElement?.getAttribute('src')).toContain(expectedVideoUrl);
    });

    it('handles empty or undefined objectName in media URLs', () => {
      // Post with missing objectName
      const postWithMissingObjectName = {
        ...mockPost,
        attachments: [
          {
            ...mockPost.attachments[0],
            objectName: undefined,
          },
        ],
      };

      render(
        <MockedProvider mocks={[]} addTypename={false}>
          <I18nextProvider i18n={i18nForTest}>
            <OrgPostCard post={postWithMissingObjectName} />
          </I18nextProvider>
        </MockedProvider>,
      );

      // Should fall back to using name property instead
      const image = screen.getByAltText('Post image');
      expect(image).toBeInTheDocument();
      expect(image.getAttribute('src')).toBe('test-image.jpg');
    });

    it('handles video upload error gracefully', async () => {
      // Mock upload failure specifically for video
      mockUploadFileToMinio.mockRejectedValueOnce(
        new Error('Video upload failed'),
      );

      renderComponent();
      const postItem = screen.getByTestId('post-item');
      await userEvent.click(postItem);
      const moreOptionsButton = screen.getByTestId('more-options-button');
      await userEvent.click(moreOptionsButton);
      const editOption = screen.getByText(/edit/i);
      await userEvent.click(editOption);

      // Use the video upload input instead of image upload
      const videoInput = await screen.findByTestId('video-upload');
      expect(videoInput).toBeInTheDocument();

      const videoFile = new File(['test video content'], 'test-video.mp4', {
        type: 'video/mp4',
      });
      await userEvent.upload(videoInput, videoFile);

      // Check for video-specific error message
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to upload video');
      });
    });

    it('handles undefined objectName in video src correctly', () => {
      // Create a post with video attachment that has undefined objectName
      const postWithMissingObjectName = {
        ...mockPost,
        attachments: [
          {
            id: 'v1',
            postId: '12',
            name: 'fallback-video.mp4',
            objectName: undefined,
            mimeType: 'video/mp4',
            createdAt: new Date(),
          },
        ],
      };

      render(
        <MockedProvider mocks={[]} addTypename={false}>
          <I18nextProvider i18n={i18nForTest}>
            <OrgPostCard post={postWithMissingObjectName} />
          </I18nextProvider>
        </MockedProvider>,
      );

      const videoElement = screen.getByTestId('video');
      const sourceElement = videoElement.querySelector('source');

      expect(sourceElement).toBeInTheDocument();
      // Should fall back to the name property
      expect(sourceElement?.getAttribute('src')).toBe('fallback-video.mp4');
    });

    it('uses orgId from useParams for MinIO uploads', async () => {
      renderComponent();
      const postItem = screen.getByTestId('post-item');
      await userEvent.click(postItem);
      const moreOptionsButton = screen.getByTestId('more-options-button');
      await userEvent.click(moreOptionsButton);
      const editOption = screen.getByText(/edit/i);
      await userEvent.click(editOption);

      const fileInput = await screen.findByTestId('image-upload');
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      await userEvent.upload(fileInput, file);

      // Verify the orgId is passed correctly
      expect(mockUploadFileToMinio).toHaveBeenCalledWith(file, 'test-org');
    });

    it('uses orgId from useParams for both image and video MinIO uploads', async () => {
      renderComponent();
      const postItem = screen.getByTestId('post-item');
      await userEvent.click(postItem);
      const moreOptionsButton = screen.getByTestId('more-options-button');
      await userEvent.click(moreOptionsButton);
      const editOption = screen.getByText(/edit/i);
      await userEvent.click(editOption);

      // Test with image upload
      const imageInput = await screen.findByTestId('image-upload');
      const imageFile = new File(['content'], 'test.jpg', {
        type: 'image/jpeg',
      });
      await userEvent.upload(imageInput, imageFile);

      // Verify the orgId is passed correctly for image
      expect(mockUploadFileToMinio).toHaveBeenCalledWith(imageFile, 'test-org');

      // Clear mocks to isolate video upload test
      mockUploadFileToMinio.mockClear();

      // Test with video upload
      const videoInput = await screen.findByTestId('video-upload');
      const videoFile = new File(['video content'], 'test.mp4', {
        type: 'video/mp4',
      });
      await userEvent.upload(videoInput, videoFile);

      // Verify the orgId is passed correctly for video
      expect(mockUploadFileToMinio).toHaveBeenCalledWith(videoFile, 'test-org');
    });

    it('handles empty file selection gracefully', async () => {
      renderComponent();
      const postItem = screen.getByTestId('post-item');
      await userEvent.click(postItem);
      const moreOptionsButton = screen.getByTestId('more-options-button');
      await userEvent.click(moreOptionsButton);
      const editOption = screen.getByText(/edit/i);
      await userEvent.click(editOption);

      // Clear any previous calls
      mockUploadFileToMinio.mockClear();

      // Test empty image upload
      const fileInput = await screen.findByTestId('image-upload');
      fireEvent.change(fileInput, { target: { files: [] } });
      expect(mockUploadFileToMinio).not.toHaveBeenCalled();

      // Test empty video upload
      const videoInput = await screen.findByTestId('video-upload');
      fireEvent.change(videoInput, { target: { files: [] } });
      expect(mockUploadFileToMinio).not.toHaveBeenCalled();

      // Check that no attachments were added
      expect(screen.queryByAltText('Preview')).not.toBeInTheDocument();
      expect(screen.queryByTestId('video-preview')).not.toBeInTheDocument();
    });

    it('handles empty objectName in getMediaUrl', async () => {
      const postWithEmptyObjectName = {
        ...mockPost,
        attachments: [
          {
            ...mockPost.attachments[0],
            objectName: '', // Empty string
          },
        ],
      };

      render(
        <MockedProvider mocks={[]} addTypename={false}>
          <I18nextProvider i18n={i18nForTest}>
            <OrgPostCard post={postWithEmptyObjectName} />
          </I18nextProvider>
        </MockedProvider>,
      );

      const postItem = screen.getByTestId('post-item');
      await userEvent.click(postItem);

      const modalImage = screen.getByAltText('Post content');
      expect(modalImage.getAttribute('src')).toBe('test-image.jpg');
    });

    it('handles undefined objectName in getMediaUrl', async () => {
      const postWithUndefinedObjectName = {
        ...mockPost,
        attachments: [
          {
            ...mockPost.attachments[0],
            objectName: undefined,
          },
        ],
      };

      render(
        <MockedProvider mocks={[]} addTypename={false}>
          <I18nextProvider i18n={i18nForTest}>
            <OrgPostCard post={postWithUndefinedObjectName} />
          </I18nextProvider>
        </MockedProvider>,
      );

      const postItem = screen.getByTestId('post-item');
      await userEvent.click(postItem);

      const modalImage = screen.getByAltText('Post content');
      expect(modalImage.getAttribute('src')).toBe('test-image.jpg');
    });
  });
});

describe('OrgPostCard Pin Toggle and update post Functionality ', () => {
  const mockPost: InterfacePost = {
    id: '12',
    caption: 'Test Caption',
    createdAt: new Date('2024-02-22'),
    updatedAt: new Date('2024-02-23'),
    pinnedAt: null,
    creatorId: '123',
    attachments: [],
  };

  // Updated for MinIO - includes objectName in attachments
  const updateMock = {
    request: {
      query: UPDATE_POST_MUTATION,
      variables: {
        input: {
          id: '12',
          caption: 'Updated Caption',
          attachments: [
            {
              objectName: 'test-object-name',
              mimeType: 'image/jpeg',
            },
          ],
        },
      },
    },
    result: {
      data: {
        updatePost: { id: '12' },
      },
    },
  };

  const deleteMock = {
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
  };

  const renderComponent = (
    mocks: InterfaceMockedResponse[] = [],
    post: InterfacePost = mockPost,
  ): void => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard post={post} />
        </I18nextProvider>
      </MockedProvider>,
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { reload: vi.fn() },
    });
  });

  it('successfully pins a post', async () => {
    const pinMock: InterfaceMockedResponse = {
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
    };

    renderComponent([pinMock]);

    const postItem = screen.getByTestId('post-item');
    await userEvent.click(postItem);

    const postModal = await screen.findByTestId('post-modal');
    expect(postModal).toBeInTheDocument();

    const moreOptionsButton = screen.getByTestId('more-options-button');
    await userEvent.click(moreOptionsButton);

    const pinButton = await screen.findByTestId('pin-post-button');
    await userEvent.click(pinButton);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Post pinned');
      expect(screen.queryByTestId('post-modal')).not.toBeInTheDocument();
      expect(screen.queryByTestId('post-menu')).not.toBeInTheDocument();
    });

    await waitFor(
      () => {
        expect(window.location.reload).toHaveBeenCalled();
      },
      { timeout: 2500 },
    );
  });

  it('handles pin toggle failure', async () => {
    const failedPinMock: InterfaceFailedMockedResponse = {
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
    };

    renderComponent([
      failedPinMock as unknown as InterfaceMockedResponse,
      userMock as unknown as InterfaceMockedResponse,
    ]);

    const postItem = screen.getByTestId('post-item');
    await userEvent.click(postItem);

    const moreOptionsButton = screen.getByTestId('more-options-button');
    await userEvent.click(moreOptionsButton);

    const pinButton = screen.getByTestId('pin-post-button');
    await userEvent.click(pinButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to toggle pin');
    });
  });

  it('handles pin toggle error', async () => {
    const errorPinMock: InterfaceMockedResponse = {
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
    };

    renderComponent([
      errorPinMock as unknown as InterfaceMockedResponse,
      userMock as unknown as InterfaceMockedResponse,
    ]);

    const postItem = screen.getByTestId('post-item');
    await userEvent.click(postItem);

    const moreOptionsButton = screen.getByTestId('more-options-button');
    await userEvent.click(moreOptionsButton);

    const pinButton = screen.getByTestId('pin-post-button');
    await userEvent.click(pinButton);
    await waitFor(() => {
      expect(errorHandlerModule.errorHandler).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalled();
    });
  });

  it('unpins a pinned post', async () => {
    const pinnedPost: InterfacePost = {
      ...mockPost,
      pinnedAt: new Date(),
    };

    const unpinMock: InterfaceMockedResponse = {
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
    };

    renderComponent([unpinMock], pinnedPost);

    const postItem = screen.getByTestId('post-item');
    await userEvent.click(postItem);

    const moreOptionsButton = screen.getByTestId('more-options-button');
    await userEvent.click(moreOptionsButton);

    const unpinButton = screen.getByTestId('pin-post-button');
    await userEvent.click(unpinButton);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Post unpinned');
      expect(screen.queryByTestId('post-modal')).not.toBeInTheDocument();
      expect(screen.queryByTestId('post-menu')).not.toBeInTheDocument();
    });

    await waitFor(
      () => {
        expect(window.location.reload).toHaveBeenCalled();
      },
      { timeout: 2500 },
    );
  });

  // Updated for MinIO - Tests post update with MinIO objectName
  it('updates post with MinIO objectName references', async () => {
    // Mock for file upload
    mockUploadFileToMinio.mockResolvedValueOnce({
      objectName: 'test-object-name',
    });

    render(
      <MockedProvider mocks={[updateMock]} addTypename={false}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard post={mockPost} />
        </I18nextProvider>
      </MockedProvider>,
    );

    const postItem = screen.getByTestId('post-item');
    await userEvent.click(postItem);

    const moreOptionsButton = screen.getByTestId('more-options-button');
    await userEvent.click(moreOptionsButton);

    const editButton = screen.getByText(/edit/i);
    await userEvent.click(editButton);

    const captionInput = screen.getByPlaceholderText(/enterCaption/i);
    await userEvent.clear(captionInput);
    await userEvent.type(captionInput, 'Updated Caption');

    // Upload a file to get objectName
    const fileInput = await screen.findByTestId('image-upload');
    const file = new File(['dummy content'], 'dummy-image.jpg', {
      type: 'image/jpeg',
    });
    await userEvent.upload(fileInput, file);

    // Submit the update
    const submitButton = screen.getByTestId('update-post-submit');
    await userEvent.click(submitButton);

    // Verify attachments sent objectName
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Post Updated successfully.');
    });

    await waitFor(
      () => {
        expect(window.location.reload).toHaveBeenCalled();
      },
      { timeout: 2500 },
    );
  });

  it('deletes post successfully', async () => {
    render(
      <MockedProvider mocks={[deleteMock]} addTypename={false}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard post={mockPost} />
        </I18nextProvider>
      </MockedProvider>,
    );

    const postItem = screen.getByTestId('post-item');
    await userEvent.click(postItem);

    const moreOptionsButton = screen.getByTestId('more-options-button');
    await userEvent.click(moreOptionsButton);

    const deleteOption = screen.getByTestId('delete-option');
    await userEvent.click(deleteOption);

    const deleteButton = screen.getByTestId('deletePostBtn');
    await userEvent.click(deleteButton);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Post deleted successfully.');
    });

    await waitFor(
      () => {
        expect(window.location.reload).toHaveBeenCalled();
      },
      { timeout: 2500 },
    );
  });

  it('handles update error gracefully', async () => {
    const errorMock = {
      request: {
        query: UPDATE_POST_MUTATION,
        variables: {
          input: {
            id: '12',
            caption: 'Updated Caption',
            attachments: [
              {
                objectName: 'test-object-name',
                mimeType: 'image/jpeg',
              },
            ],
          },
        },
      },
      error: new Error('Network error'),
    };

    render(
      <MockedProvider mocks={[errorMock]} addTypename={false}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard post={mockPost} />
        </I18nextProvider>
      </MockedProvider>,
    );

    const postItem = screen.getByTestId('post-item');
    await userEvent.click(postItem);

    const moreOptionsButton = screen.getByTestId('more-options-button');
    await userEvent.click(moreOptionsButton);

    const editButton = screen.getByText(/edit/i);
    await userEvent.click(editButton);

    const captionInput = screen.getByPlaceholderText(/enterCaption/i);
    await userEvent.clear(captionInput);
    await userEvent.type(captionInput, 'Updated Caption');

    const submitButton = screen.getByRole('button', { name: /save/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(errorHandlerModule.errorHandler).toHaveBeenCalled();
    });
  });
});

describe('Video attachment conditional rendering', () => {
  // Use the same mockPost that's already defined in the file
  const mockPost = {
    id: '12',
    caption: 'Test Caption',
    createdAt: new Date('2024-02-22'),
    updatedAt: new Date('2024-02-23'),
    pinnedAt: null,
    creatorId: '123',
    attachments: [
      {
        id: '1',
        postId: '12',
        name: 'test-image.jpg',
        objectName: 'test-image-object',
        mimeType: 'image/jpeg',
        createdAt: new Date(),
      },
    ],
  };

  it('renders video with objectName when both videoAttachment and objectName exist', async () => {
    // Create a post with a video attachment that has an objectName
    const postWithVideoObjectName = {
      ...mockPost,
      attachments: [
        {
          id: '123',
          postId: '12',
          name: 'fallback-name.mp4',
          objectName: 'minio-object-name.mp4',
          mimeType: 'video/mp4',
          createdAt: new Date(),
        },
      ],
    };

    const objectName = 'minio-object-name.mp4';
    const type = 'video/mp4';
    const endpoint = type.startsWith('image/') ? 'images' : 'videos';
    const expectedUrl = `/api/${endpoint}/${objectName}`;

    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard post={postWithVideoObjectName} />
        </I18nextProvider>
      </MockedProvider>,
    );

    // Open the post modal to display the video
    const postItem = screen.getByTestId('post-item');
    await userEvent.click(postItem);

    // Verify the video element exists
    const videoElement = screen.getByTestId('video');
    expect(videoElement).toBeInTheDocument();

    // Check that the source uses getMediaUrl with objectName
    const sourceElement = videoElement.querySelector('source');
    expect(sourceElement).toHaveAttribute('src', expectedUrl);
    expect(sourceElement).not.toHaveAttribute('src', 'fallback-name.mp4');
  });

  it('renders video with name when videoAttachment exists but objectName is missing', async () => {
    // Create a post with a video attachment that doesn't have an objectName
    const postWithVideoNoObjectName = {
      ...mockPost,
      attachments: [
        {
          id: '123',
          postId: '12',
          name: 'fallback-name.mp4',
          objectName: undefined,
          mimeType: 'video/mp4',
          createdAt: new Date(),
        },
      ],
    };

    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard post={postWithVideoNoObjectName} />
        </I18nextProvider>
      </MockedProvider>,
    );

    // Open the post modal to display the video
    const postItem = screen.getByTestId('post-item');
    await userEvent.click(postItem);

    // Verify the video element exists
    const videoElement = screen.getByTestId('video');
    expect(videoElement).toBeInTheDocument();

    // Check that the source falls back to using name
    const sourceElement = videoElement.querySelector('source');
    expect(sourceElement).toHaveAttribute('src', 'fallback-name.mp4');
  });

  it('does not render video when no videoAttachment exists', async () => {
    // Use the existing mockPost which already has an image attachment
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard post={mockPost} />
        </I18nextProvider>
      </MockedProvider>,
    );

    // Open the post modal
    const postItem = screen.getByTestId('post-item');
    await userEvent.click(postItem);

    // Check that there's no video element
    expect(screen.queryByTestId('video')).not.toBeInTheDocument();

    // But there should be an image
    const imgElement = screen.getByAltText('Post content');
    expect(imgElement).toBeInTheDocument();
  });
});
