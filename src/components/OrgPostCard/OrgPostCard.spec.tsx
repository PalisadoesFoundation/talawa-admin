import React from 'react';
import type { RenderResult } from '@testing-library/react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing'; // Updated import
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

vi.mock('utils/MinioUpload', () => ({
  useMinioUpload: () => ({
    uploadFileToMinio: vi
      .fn()
      .mockResolvedValue({
        objectName: 'mocked-file.jpg',
        fileHash: 'mocked-hash',
      }),
  }),
}));

vi.mock('utils/MinioDownload', () => ({
  useMinioDownload: () => ({
    getFileFromMinio: vi.fn().mockResolvedValue('mocked-url'),
  }),
}));

vi.mock('utils/fileValidation', () => ({
  validateFile: vi.fn().mockReturnValue({ isValid: true, errorMessage: '' }),
}));

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

interface InterfacePostAttachment {
  id: string;
  postId: string;
  name: string;
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
        attachments?: any[];
      };
    };
  };
  result?: {
    data: {
      updatePost?: { id: string; pinnedAt: Date | null };
      deletePost?: { id: string };
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
        isPinned?: boolean;
        caption?: string;
        attachments?: any[];
      };
    };
  };
  result?: {
    data: {
      updatePost?: { id: string; pinnedAt: Date | null } | null;
      deletePost?: { id: string } | null;
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

const successMock: MockedResponse = {
  request: {
    query: DELETE_POST_MUTATION,
    variables: { input: { id: '12' } },
  },
  result: {
    data: { deletePost: { id: '12' } },
  },
};

const errorMock: MockedResponse = {
  request: {
    query: DELETE_POST_MUTATION,
    variables: { input: { id: '12' } },
  },
  error: new Error('Failed to delete post'),
};

const nullResponseMock: MockedResponse = {
  request: {
    query: DELETE_POST_MUTATION,
    variables: { input: { id: '12' } },
  },
  result: {
    data: { deletePost: null },
  },
};

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('utils/errorHandler', () => ({
  errorHandler: vi.fn(),
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
        mimeType: 'image/jpeg',
        createdAt: new Date(),
      },
    ],
  };

  const videoPost = {
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
        mimeType: 'video/mp4',
        createdAt: new Date(),
      },
    ],
  };

  const renderComponentVideo = (): RenderResult => {
    return render(
      <MockedProvider mocks={[userMock]} addTypename={false}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard post={videoPost} />
        </I18nextProvider>
      </MockedProvider>,
    );
  };

  const mocks: MockedResponse[] = [
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

    it('displays the correct image when provided', () => {
      renderComponent();

      const image = screen.getByAltText('Post image');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'test-image.jpg');
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
        <MockedProvider mocks={[userMock]} addTypename={false}>
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

    it('successfully uploads an image and displays preview in edit modal', async () => {
      const toastSuccessSpy = vi.spyOn(toast, 'success');
      const validImage = new File(['image-content'], 'test.jpg', {
        type: 'image/jpeg',
      });

      render(
        <MockedProvider mocks={[userMock]} addTypename={false}>
          <I18nextProvider i18n={i18nForTest}>
            <OrgPostCard post={mockPost} />
          </I18nextProvider>
        </MockedProvider>,
      );

      const postItem = screen.getByTestId('post-item');
      await userEvent.click(postItem);

      const moreOptionsButton = screen.getByTestId('more-options-button');
      await userEvent.click(moreOptionsButton);

      const editOption = screen.getByText(/edit/i);
      await userEvent.click(editOption);

      const imageInput = screen.getByTestId('image-upload');
      await userEvent.upload(imageInput, validImage);

      await waitFor(() => {
        expect(toastSuccessSpy).toHaveBeenCalledWith(
          'File uploaded successfully!',
        );
        const previewImage = screen.getByAltText('Preview');
        expect(previewImage).toBeInTheDocument();
        expect(previewImage).toHaveAttribute('src', 'mocked-url');
      });
    });

    it('removes uploaded image from preview in edit modal', async () => {
      const validImage = new File(['image-content'], 'test.jpg', {
        type: 'image/jpeg',
      });

      render(
        <MockedProvider mocks={[userMock]} addTypename={false}>
          <I18nextProvider i18n={i18nForTest}>
            <OrgPostCard post={mockPost} />
          </I18nextProvider>
        </MockedProvider>,
      );

      const postItem = screen.getByTestId('post-item');
      await userEvent.click(postItem);

      const moreOptionsButton = screen.getByTestId('more-options-button');
      await userEvent.click(moreOptionsButton);

      const editOption = screen.getByText(/edit/i);
      await userEvent.click(editOption);

      const imageInput = screen.getByTestId('image-upload');
      await userEvent.upload(imageInput, validImage);

      await waitFor(() => {
        expect(screen.getByAltText('Preview')).toBeInTheDocument();
      });

      const clearButton = screen.getByText('×');
      await userEvent.click(clearButton);

      await waitFor(() => {
        expect(screen.queryByAltText('Preview')).not.toBeInTheDocument();
      });
    });
  });

  describe('OrgPostCard Pin Toggle and Update Post Functionality', () => {
    const mockPost: InterfacePost = {
      id: '12',
      caption: 'Test Caption',
      createdAt: new Date('2024-02-22'),
      updatedAt: new Date('2024-02-23'),
      pinnedAt: null,
      creatorId: '123',
      attachments: [],
    };

    const updateMock: MockedResponse = {
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
    };

    const deleteMock: MockedResponse = {
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
      mocks: MockedResponse[] = [],
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
      const pinMock: MockedResponse = {
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
      const failedPinMock: MockedResponse = {
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

      renderComponent([failedPinMock, userMock]);

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
      const errorPinMock: MockedResponse = {
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

      renderComponent([errorPinMock, userMock]);

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

      const unpinMock: MockedResponse = {
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

    it('updates post successfully', async () => {
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

      const submitButton = screen.getByTestId('update-post-submit');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(
          'Post Updated successfully.',
        );
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

    it('handles update error gracefully', async () => {
      const errorMock: MockedResponse = {
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
});
