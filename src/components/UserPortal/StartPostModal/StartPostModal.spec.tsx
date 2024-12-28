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

/**
 * Unit tests for StartPostModal component:
 *
 * 1. **Rendering StartPostModal**: Verifies that the modal renders correctly when the `show` prop is set to `true`.
 * 2. **Invalid post submission**: Ensures that when the post body is empty, an error toast is shown with the appropriate message ("Can't create a post with an empty body").
 * 3. **Valid post submission**: Checks that a post with valid text triggers an info toast, and simulates the creation of a post with the message "Processing your post. Please wait."
 * 4. **User image null**: Confirms that when the user image is null, a default image is displayed instead.
 * 5. **User image not null**: Verifies that when the user image is provided, the correct user image is shown.
 *
 * Mocked GraphQL mutation (`CREATE_POST_MUTATION`) and toast notifications are used to simulate the post creation process.
 * The `renderStartPostModal` function is used to render the modal with different user states and input values.
 */

vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
    info: vi.fn(),
    success: vi.fn(),
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
    onHide: vi.fn(),
    fetchPosts: vi.fn(),
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
    img: '',
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
    vi.clearAllMocks();
  });

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

    expect(toast.error).not.toHaveBeenCalledWith();
    expect(toast.info).toHaveBeenCalledWith(
      'Processing your post. Please wait.',
    );
    // await wait();
    // expect(toast.success).toBeCalledWith(
    //   'Your post is now visible in the feed.',
    // );
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
});
