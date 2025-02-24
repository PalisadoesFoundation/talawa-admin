import React from 'react';
import type { RenderResult } from '@testing-library/react';
import { render, screen, waitFor } from '@testing-library/react';
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

// Define types for the mocks
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

  const mocks = [
    // Mock for user query
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
    // Mock for update mutation
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
    // Mock window.location.reload
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
  describe('Rendering', () => {
    it('renders the post card with basic information', () => {
      renderComponent();

      expect(screen.getByText('Test Caption')).toBeInTheDocument();
      expect(screen.getByText(/Created: 2\/22\/2024/)).toBeInTheDocument();
      expect(screen.getByTestId('post-item')).toBeInTheDocument();
    });

    it('displays the correct image when provided', () => {
      renderComponent();

      const image = screen.getByAltText('Post image');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'test-image.jpg');
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
  });
});

describe('OrgPostCard Pin Toggle Functionality', () => {
  const mockPost: InterfacePost = {
    id: '12',
    caption: 'Test Caption',
    createdAt: new Date('2024-02-22'),
    updatedAt: new Date('2024-02-23'),
    pinnedAt: null,
    creatorId: '123',
    attachments: [],
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

    // First, click on the post item
    const postItem = screen.getByTestId('post-item');
    await userEvent.click(postItem);

    // Wait for the modal to appear
    const postModal = await screen.findByTestId('post-modal');
    expect(postModal).toBeInTheDocument();

    // Now find and click the more options button
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
});
