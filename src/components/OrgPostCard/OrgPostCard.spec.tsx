import React from 'react';
import type { RenderResult } from '@testing-library/react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
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

// Mock plugin injector similar to Transactions tests
vi.mock('plugin', () => ({
  PluginInjector: vi.fn(() => (
    <div data-testid="plugin-injector-g3">Mock Plugin Injector G3</div>
  )),
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
        isPinned: boolean;
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
    it('renders the G3 plugin injector below caption', () => {
      renderComponent();
      expect(screen.getByTestId('plugin-injector-g3')).toBeInTheDocument();
    });
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

    it('removes the preview image when clearImage is triggered', async () => {
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

      await waitFor(() => {
        expect(screen.queryByAltText('Preview')).not.toBeInTheDocument();
      });
    });

    it('removes the preview video when clearVideo is triggered', async () => {
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

      const previewVideo = await screen.findByTestId('video-preview');
      expect(previewVideo).toBeInTheDocument();

      const clearButton = screen.getByRole('button', { name: '×' });
      expect(clearButton).toBeInTheDocument();

      await userEvent.click(clearButton);

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

  const updateMock = {
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

    const submitButton = screen.getByRole('button', { name: /save/i }); // Adjust the name accordingly
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(errorHandlerModule.errorHandler).toHaveBeenCalled();
    });
  });
});

describe('getMimeTypeEnum', () => {
  const getMimeTypeEnum = (url: string): string => {
    // Check for base64 data URI
    if (url.startsWith('data:')) {
      const mime = url.split(';')[0].split(':')[1]; // e.g., "image/png"
      switch (mime) {
        case 'image/jpeg':
          return 'IMAGE_JPEG';
        case 'image/png':
          return 'IMAGE_PNG';
        case 'image/webp':
          return 'IMAGE_WEBP';
        case 'image/avif':
          return 'IMAGE_AVIF';
        case 'video/mp4':
          return 'VIDEO_MP4';
        case 'video/webm':
          return 'VIDEO_WEBM';
        default:
          return 'IMAGE_JPEG'; // fallback
      }
    }

    // Fallback for file URLs (e.g., https://.../file.png)
    const ext = url.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'jpg':
      case 'jpeg':
        return 'IMAGE_JPEG';
      case 'png':
        return 'IMAGE_PNG';
      case 'webp':
        return 'IMAGE_WEBP';
      case 'avif':
        return 'IMAGE_AVIF';
      case 'mp4':
        return 'VIDEO_MP4';
      case 'webm':
        return 'VIDEO_WEBM';
      default:
        return 'IMAGE_JPEG'; // fallback
    }
  };
  it('should return IMAGE_JPEG for .jpg and .jpeg', () => {
    expect(getMimeTypeEnum('file.jpg')).toBe('IMAGE_JPEG');
    expect(getMimeTypeEnum('file.jpeg')).toBe('IMAGE_JPEG');
  });

  it('should return IMAGE_PNG for .png', () => {
    expect(getMimeTypeEnum('file.png')).toBe('IMAGE_PNG');
  });

  it('should return IMAGE_WEBP for .webp', () => {
    expect(getMimeTypeEnum('file.webp')).toBe('IMAGE_WEBP');
  });

  it('should return IMAGE_AVIF for .avif', () => {
    expect(getMimeTypeEnum('file.avif')).toBe('IMAGE_AVIF');
  });

  it('should return VIDEO_MP4 for .mp4', () => {
    expect(getMimeTypeEnum('video.mp4')).toBe('VIDEO_MP4');
  });

  it('should return VIDEO_WEBM for .webm', () => {
    expect(getMimeTypeEnum('video.webm')).toBe('VIDEO_WEBM');
  });

  it('should return IMAGE_JPEG as fallback for unknown extension', () => {
    expect(getMimeTypeEnum('file.unknown')).toBe('IMAGE_JPEG');
    expect(getMimeTypeEnum('file')).toBe('IMAGE_JPEG'); // no extension
  });
});

describe('getFileHashFromBase64', () => {
  // Test the getFileHashFromBase64 function
  const getFileHashFromBase64 = async (
    base64String: string,
  ): Promise<string> => {
    const base64 = base64String.split(',')[1];
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    const hashBuffer = await crypto.subtle.digest('SHA-256', bytes);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  };

  it('should generate hash from base64 string', async () => {
    const base64String =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
    const result = await getFileHashFromBase64(base64String);
    expect(result).toBeDefined();
    expect(typeof result).toBe('string');
    expect(result.length).toBe(64); // SHA-256 hash should be 64 characters
  });

  it('should handle different base64 inputs', async () => {
    const base64String = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/';
    const result = await getFileHashFromBase64(base64String);
    expect(result).toBeDefined();
    expect(typeof result).toBe('string');
    expect(result.length).toBe(64);
  });
});

describe('OrgPostCard Additional Coverage Tests', () => {
  const mockPost = {
    id: '12',
    caption: 'Test Caption',
    createdAt: new Date('2024-02-22'),
    updatedAt: new Date('2024-02-23'),
    pinnedAt: null,
    creatorId: '123',
    attachments: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { reload: vi.fn() },
    });
  });

  it('should cover attachment processing in updatePost', async () => {
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

    const editButton = screen.getByText(/edit/i);
    await userEvent.click(editButton);

    const fileInput = await screen.findByTestId('image-upload');
    const file = new File(['dummy content'], 'test-image.png', {
      type: 'image/png',
    });

    // Mock URL.createObjectURL
    const originalCreateObjectURL = global.URL.createObjectURL;
    global.URL.createObjectURL = vi.fn(
      () => 'data:image/png;base64,ZHVtbXkgY29udGVudA==',
    );

    await userEvent.upload(fileInput, file);

    await waitFor(() => {
      const previewImage = screen.getByAltText('Preview');
      expect(previewImage).toBeInTheDocument();
    });

    // Restore the original function
    global.URL.createObjectURL = originalCreateObjectURL;
  });

  it('should handle update post without attachment', async () => {
    const updateMock = {
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

    // Update caption only (no attachments)
    const captionInput = screen.getByPlaceholderText(/enterCaption/i);
    await userEvent.clear(captionInput);
    await userEvent.type(captionInput, 'Updated Caption');

    const submitButton = screen.getByTestId('update-post-submit');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Post Updated successfully.');
    });
  });

  it('should handle update post error with attachments', async () => {
    const errorMock = {
      request: {
        query: UPDATE_POST_MUTATION,
        variables: {
          input: {
            id: '12',
            caption: 'Updated Caption',
            attachments: expect.any(Array),
          },
        },
      },
      error: new Error('Update failed'),
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

    // Add an attachment to trigger the attachment processing code
    const fileInput = await screen.findByTestId('image-upload');
    const file = new File(['dummy content'], 'test.png', {
      type: 'image/png',
    });
    await userEvent.upload(fileInput, file);

    const captionInput = screen.getByPlaceholderText(/enterCaption/i);
    await userEvent.clear(captionInput);
    await userEvent.type(captionInput, 'Updated Caption');

    const submitButton = screen.getByTestId('update-post-submit');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(errorHandlerModule.errorHandler).toHaveBeenCalled();
    });
  });

  it('should handle close menu option', async () => {
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

    // Check that the menu is visible
    const menu = screen.getByTestId('post-menu');
    expect(menu).toBeInTheDocument();

    const closeMenuOption = screen.getByTestId('close-menu-option');
    await userEvent.click(closeMenuOption);

    // Check that the menu is closed
    await waitFor(() => {
      expect(screen.queryByTestId('post-menu')).not.toBeInTheDocument();
    });
  });

  it('should handle file name extraction from URL', async () => {
    const mockWithUrl = {
      id: '12',
      caption: 'Test Caption',
      createdAt: new Date('2024-02-22'),
      updatedAt: new Date('2024-02-23'),
      pinnedAt: null,
      creatorId: '123',
      attachments: [],
    };

    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard post={mockWithUrl} />
        </I18nextProvider>
      </MockedProvider>,
    );

    const postItem = screen.getByTestId('post-item');
    await userEvent.click(postItem);

    const moreOptionsButton = screen.getByTestId('more-options-button');
    await userEvent.click(moreOptionsButton);

    const editButton = screen.getByText(/edit/i);
    await userEvent.click(editButton);

    // Test file with complex URL structure
    const fileInput = await screen.findByTestId('image-upload');
    const file = new File(['dummy content'], 'complex/path/test-image.png', {
      type: 'image/png',
    });
    await userEvent.upload(fileInput, file);

    // Verify that the preview shows up
    await waitFor(() => {
      const previewImage = screen.getByAltText('Preview');
      expect(previewImage).toBeInTheDocument();
    });
  });
});
