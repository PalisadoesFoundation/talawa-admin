import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import type { RenderResult } from '@testing-library/react';
import { act, fireEvent, render, screen } from '@testing-library/react';
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

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    info: jest.fn(),
    success: jest.fn(),
  },
}));

const MOCKS = [
  {
    request: {
      query: CREATE_POST_MUTATION,
      variables: {
        title: 'Dummy Post',
        text: 'This is dummy text',
        organizationId: '123',
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
): RenderResult => {
  const cardProps = {
    show: visibility,
    onHide: jest.fn(),
    fetchPosts: jest.fn(),
    userData: {
      user: {
        __typename: 'User',
        _id: '123',
        image: image,
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
  };

  return render(
    <MockedProvider addTypename={false} link={link}>
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
  afterAll(() => {
    jest.clearAllMocks();
  });

  test('Check if StartPostModal renders properly', async () => {
    renderStartPostModal(true, null);

    const modal = await screen.findByTestId('startPostModal');
    expect(modal).toBeInTheDocument();
  });

  test('triggers file input when the upload icon is clicked', async () => {
    const clickSpy = jest.spyOn(HTMLInputElement.prototype, 'click');
    renderStartPostModal(true, null);

    await wait();
    const postImageInput = screen.getByTestId('postImageInput');
    expect(postImageInput).toHaveAttribute('type', 'file');
    expect(postImageInput).toHaveStyle({ display: 'inline-block' });

    const iconButton = screen.getByTestId('addMediaBtn');
    fireEvent.click(iconButton);

    expect(clickSpy).toHaveBeenCalled();
    clickSpy.mockRestore();
  });

  test('On invalid post submission with empty body Error toast should be shown', async () => {
    const toastSpy = jest.spyOn(toast, 'error');
    renderStartPostModal(true, null);
    await wait();

    userEvent.click(screen.getByTestId('createPostBtn'));
    expect(toastSpy).toBeCalledWith("Can't create a post with an empty body.");
  });

  test('On valid post submission Info toast should be shown', async () => {
    renderStartPostModal(true, null);
    await wait();

    const randomPostInput = 'test post input';
    userEvent.type(screen.getByTestId('postInput'), randomPostInput);
    expect(screen.queryByText(randomPostInput)).toBeInTheDocument();

    userEvent.click(screen.getByTestId('createPostBtn'));

    expect(toast.error).not.toBeCalledWith();
    expect(toast.info).toBeCalledWith('Processing your post. Please wait.');
  });

  test('If user image is null then default image should be shown', async () => {
    renderStartPostModal(true, null);
    await wait();

    const userImage = screen.getByTestId('userImage');
    expect(userImage).toHaveAttribute(
      'src',
      '/src/assets/images/defaultImg.png',
    );
  });

  test('If user image is not null then user image should be shown', async () => {
    renderStartPostModal(true, 'image.png');
    await wait();

    const userImage = screen.getByTestId('userImage');
    expect(userImage).toHaveAttribute('src', 'image.png');
  });

  test('should update post image state when a file is selected', async () => {
    renderStartPostModal(true, null);
    await wait();

    const file = new File(['(⌐□_□)'], 'chad.png', { type: 'image/png' });
    const input = screen.getByTestId('postImageInput') as HTMLInputElement;
    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } });
    });

    expect(input.files?.[0]).toEqual(file);
    const previewImage = await screen.findByAltText('Post Image Preview');
    expect(previewImage).toBeInTheDocument();
  });

  test('should not update post image state when no file is selected', async () => {
    renderStartPostModal(true, null);
    await wait();

    const input = screen.getByTestId('postImageInput') as HTMLInputElement;
    await act(async () => {
      fireEvent.change(input, { target: { files: null } });
    });

    const previewImage = screen.queryByAltText('Post Image Preview');
    expect(previewImage).not.toBeInTheDocument();
  });

  test('triggers file input when fileInputRef exists', async () => {
    const clickSpy = jest.spyOn(HTMLInputElement.prototype, 'click');
    const refMock = { current: { click: clickSpy } };

    renderStartPostModal(true, null);
    await wait();

    jest.spyOn(React, 'useRef').mockReturnValueOnce(refMock);

    const iconButton = screen.getByTestId('addMediaBtn');
    fireEvent.click(iconButton);

    expect(clickSpy).toHaveBeenCalled();
    clickSpy.mockRestore();
  });
});
