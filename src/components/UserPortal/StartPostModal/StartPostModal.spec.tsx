import React, { act } from 'react';
import { MockedProvider } from '@apollo/react-testing';
import type { RenderResult } from '@testing-library/react';
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import userEvent from '@testing-library/user-event';
import { CREATE_POST_MUTATION } from 'GraphQl/Mutations/mutations';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18nForTest from 'utils/i18nForTest';
import StartPostModal from './StartPostModal';
import { vi } from 'vitest';

vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
    info: vi.fn(),
    success: vi.fn(),
    dismiss: vi.fn(),
  },
}));

const MOCKS = [
  {
    request: {
      query: CREATE_POST_MUTATION,
      variables: {
        title: '',
        text: 'This is dummy text',
        organizationId: '123',
        file: '',
      },
      result: {
        data: {
          createPost: {
            _id: '453',
          },
        },
      },
    },
  },
];

const link = new StaticMockLink(MOCKS, true);

afterEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

const renderStartPostModal = (
  visibility: boolean,
  image: string | null,
  img: string | null = null,
  onHide: () => void = vi.fn(),
  fetchPosts: () => void = vi.fn(),
  customLink: StaticMockLink = link,
): RenderResult => {
  const cardProps = {
    show: visibility,
    onHide,
    fetchPosts,
    userData: {
      user: {
        __typename: 'User',
        _id: '123',
        image,
        firstName: 'Glen',
        lastName: 'dsza',
        email: 'glen@dsza.com',
        appLanguageCode: 'en',
        pluginCreationAllowed: true,
        createdAt: '2023-02-18T09:22:27.969Z',
        adminFor: [],
        createdOrganizations: [],
        joinedOrganizations: [],
        createdEvents: [],
        registeredEvents: [],
        eventAdmin: [],
        membershipRequests: [],
        organizationsBlockedBy: [],
      },
      appUserProfile: {
        __typename: 'AppUserProfile',
        _id: '123',
        isSuperAdmin: true,
        adminFor: [],
        createdOrganizations: [],
        createdEvents: [],
        eventAdmin: [],
      },
    },
    organizationId: '123',
    img,
  };

  return render(
    <MockedProvider addTypename={false} link={customLink}>
      <BrowserRouter>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <StartPostModal {...cardProps} />
          </I18nextProvider>
        </Provider>
      </BrowserRouter>
    </MockedProvider>,
  );
};

describe('Testing StartPostModal Component: User Portal', () => {
  it('Check if StartPostModal renders properly', async () => {
    renderStartPostModal(true, null);
    const modal = await screen.findByTestId('startPostModal');
    expect(modal).toBeInTheDocument();
  });

  it('On invalid post submission with empty body Error toast should be shown', async () => {
    const toastSpy = vi.spyOn(toast, 'error');
    renderStartPostModal(true, null);
    await wait();

    userEvent.click(screen.getByTestId('createPostBtn'));
    expect(toastSpy).toHaveBeenCalledWith(
      "Can't create a post with an empty body.",
    );
  });

  it('On valid post submission Info toast should be shown', async () => {
    renderStartPostModal(true, null);
    await wait();

    const randomPostInput = 'This is dummy text';
    userEvent.type(screen.getByTestId('postInput'), randomPostInput);
    expect(screen.queryByText(randomPostInput)).toBeInTheDocument();

    userEvent.click(screen.getByTestId('createPostBtn'));

    expect(toast.error).not.toHaveBeenCalled();
    expect(toast.info).toHaveBeenCalledWith(
      'Processing your post. Please wait.',
    );
  });

  it('If user image is null then default image should be shown', async () => {
    renderStartPostModal(true, null);
    await wait();

    const userImage = screen.getByTestId('userImage');
    expect(userImage).toHaveAttribute(
      'src',
      '/src/assets/images/defaultImg.png',
    );
  });

  it('If user image is not null then user image should be shown', async () => {
    renderStartPostModal(true, 'image.png');
    await wait();

    const userImage = screen.getByTestId('userImage');
    expect(userImage).toHaveAttribute('src', 'image.png');
  });

  it('should clear post content and hide modal when close button is clicked', async () => {
    const onHideMock = vi.fn();
    renderStartPostModal(true, null, null, onHideMock);
    await wait();

    const input = screen.getByTestId('postInput');
    userEvent.type(input, 'Test content');

    const closeButton = screen.getByRole('button', { name: /close/i });
    userEvent.click(closeButton);

    expect(onHideMock).toHaveBeenCalled();
    expect(input).toHaveValue('');
  });

  it('should handle successful post creation', async () => {
    const fetchPostsMock = vi.fn();
    const onHideMock = vi.fn();
    const successMocks = [
      {
        request: {
          query: CREATE_POST_MUTATION,
          variables: {
            title: '',
            text: 'Test content',
            organizationId: '123',
            file: null,
          },
        },
        result: {
          data: {
            createPost: {
              _id: '456',
            },
          },
        },
      },
    ];
    const customLink = new StaticMockLink(successMocks, true);

    renderStartPostModal(
      true,
      null,
      null,
      onHideMock,
      fetchPostsMock,
      customLink,
    );
    await wait();

    userEvent.type(screen.getByTestId('postInput'), 'Test content');
    userEvent.click(screen.getByTestId('createPostBtn'));

    await wait();

    expect(toast.dismiss).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalled();
    expect(fetchPostsMock).toHaveBeenCalled();
    expect(onHideMock).toHaveBeenCalled();
  });

  it('should handle failed post creation', async () => {
    const errorMocks = [
      {
        request: {
          query: CREATE_POST_MUTATION,
          variables: {
            title: '',
            text: 'Test content',
            organizationId: '123',
            file: null,
          },
        },
        error: new Error('Failed to create post'),
      },
    ];
    const customLink = new StaticMockLink(errorMocks, true);

    renderStartPostModal(true, null, null, vi.fn(), vi.fn(), customLink);
    await wait();

    userEvent.type(screen.getByTestId('postInput'), 'Test content');
    userEvent.click(screen.getByTestId('createPostBtn'));

    await wait();

    expect(toast.error).toHaveBeenCalled();
  });

  it('should display preview image when provided', async () => {
    const previewImage = 'preview.jpg';
    renderStartPostModal(true, null, previewImage);
    await wait();

    const image = screen.getByAltText('Post Image Preview');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', previewImage);
  });
});
