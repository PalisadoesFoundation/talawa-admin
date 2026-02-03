import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  type Mock,
} from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';
import { I18nextProvider } from 'react-i18next';
import React from 'react';
import cookies from 'js-cookie';
import i18next from 'i18next';
import ChangeLanguageDropDown from './ChangeLanguageDropDown';
import { UPDATE_CURRENT_USER_MUTATION } from 'GraphQl/Mutations/mutations';
import { languages } from 'utils/languages';
import useLocalStorage from 'utils/useLocalstorage';
import { urlToFile } from 'utils/urlToFile';
import i18nForTest from 'utils/i18nForTest';

// Mock dependencies
const sharedMocks = vi.hoisted(() => ({
  NotificationToast: {
    error: vi.fn(),
  },
}));

vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: sharedMocks.NotificationToast,
}));

vi.mock('js-cookie', () => ({ default: { get: vi.fn(), set: vi.fn() } }));

vi.mock('i18next', () => {
  const mockT = vi.fn((key: string) => key);
  const mockI18next = {
    use: vi.fn().mockReturnThis(),
    init: vi.fn().mockReturnThis(),
    changeLanguage: vi.fn(),
    t: mockT,
    getFixedT: vi.fn(() => mockT),
    language: 'en',
    languages: ['en', 'es', 'fr', 'hi', 'zh'],
    isInitialized: true,
    hasLoadedNamespace: vi.fn(() => true),
    loadNamespaces: vi.fn().mockResolvedValue(undefined),
    on: vi.fn(),
    off: vi.fn(),
    getResourceBundle: vi.fn(() => ({})),
    options: {
      react: { useSuspense: false },
    },
    services: {
      resourceStore: {
        data: {},
      },
    },
    store: {
      on: vi.fn(),
      off: vi.fn(),
    },
  };
  return { default: mockI18next };
});

vi.mock('utils/useLocalstorage', () => ({ default: vi.fn() }));

vi.mock('utils/urlToFile', () => ({ urlToFile: vi.fn() }));

// Mock the CSS module
vi.mock('./ChangeLanguageDropDown.module.css', () => ({
  default: { changeLanguageBtn: '_changeLanguageBtn_d00707' },
}));

describe('ChangeLanguageDropDown', () => {
  const mockUserId = 'test-user-123';
  const mockUserImage = 'http://example.com/avatar.jpg';
  const mockFile = new File([''], 'avatar.jpg', { type: 'image/jpeg' });

  const mocks = [
    {
      request: {
        query: UPDATE_CURRENT_USER_MUTATION,
        variables: { input: { naturalLanguageCode: 'es', avatar: mockFile } },
      },
      result: { data: { updateUser: { id: mockUserId, __typename: 'User' } } },
    },
  ];

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Setup default mock implementations
    (useLocalStorage as Mock).mockReturnValue({
      getItem: vi.fn((key: string) => {
        if (key === 'id') return mockUserId;
        if (key === 'UserImage') return mockUserImage;
        if (key === 'IsLoggedIn') return 'TRUE';
        return null;
      }),
    });

    (cookies.get as Mock).mockReturnValue('en');
    (urlToFile as Mock).mockResolvedValue(mockFile);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders with default language (English)', () => {
    render(
      <MockedProvider mocks={mocks}>
        <I18nextProvider i18n={i18nForTest}>
          <ChangeLanguageDropDown />
        </I18nextProvider>
      </MockedProvider>,
    );

    const englishOption = screen.getByText('English');
    expect(englishOption).toBeInTheDocument();
  });

  it('shows error toast when userId is not found', async () => {
    (useLocalStorage as Mock).mockReturnValue({
      getItem: vi.fn((key: string) => {
        if (key === 'IsLoggedIn') return 'TRUE';
        return null; // No userId
      }),
    });

    render(
      <MockedProvider mocks={mocks}>
        <I18nextProvider i18n={i18nForTest}>
          <ChangeLanguageDropDown />
        </I18nextProvider>
      </MockedProvider>,
    );

    const dropdown = screen.getByTestId('language-dropdown-toggle');
    await userEvent.click(dropdown);

    const spanishOption = await screen.findByTestId(
      'language-dropdown-item-es',
    );
    await userEvent.click(spanishOption);

    await waitFor(() => {
      expect(sharedMocks.NotificationToast.error).toHaveBeenCalledWith(
        'userNotFound',
      );
    });
  });

  it('successfully changes language', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <I18nextProvider i18n={i18nForTest}>
          <ChangeLanguageDropDown />
        </I18nextProvider>
      </MockedProvider>,
    );

    const dropdown = screen.getByTestId('language-dropdown-toggle');
    await userEvent.click(dropdown);

    const spanishOption = await screen.findByTestId(
      'language-dropdown-item-es',
    );
    await userEvent.click(spanishOption);

    await waitFor(() => {
      expect(i18next.changeLanguage).toHaveBeenCalledWith('es');
      expect(cookies.set).toHaveBeenCalledWith('i18next', 'es');
    });
  });

  it('renders all available languages in the dropdown', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <I18nextProvider i18n={i18nForTest}>
          <ChangeLanguageDropDown />
        </I18nextProvider>
      </MockedProvider>,
    );

    const dropdown = screen.getByTestId('language-dropdown-toggle');
    await userEvent.click(dropdown);

    await waitFor(() => {
      languages.forEach((language) => {
        const option = screen.getByTestId(
          `language-dropdown-item-${language.code}`,
        );
        expect(option).toBeInTheDocument();
      });
    });
  });

  it('handles avatar processing error gracefully', async () => {
    // Mock urlToFile to throw an error
    (urlToFile as Mock).mockRejectedValue(
      new Error('Avatar processing failed'),
    );

    // Create mocks that expect no avatar in the mutation
    const mocksWithoutAvatar = [
      {
        request: {
          query: UPDATE_CURRENT_USER_MUTATION,
          variables: { input: { naturalLanguageCode: 'es' } },
        },
        result: {
          data: { updateUser: { id: mockUserId, __typename: 'User' } },
        },
      },
    ];

    render(
      <MockedProvider mocks={mocksWithoutAvatar}>
        <ChangeLanguageDropDown />
      </MockedProvider>,
    );
    const dropdown = screen.getByTestId('language-dropdown-toggle');
    await userEvent.click(dropdown);

    const spanishOption = await screen.findByTestId(
      'language-dropdown-item-es',
    );
    await userEvent.click(spanishOption);

    await waitFor(() => {
      expect(sharedMocks.NotificationToast.error).toHaveBeenCalledWith(
        'avatarProcessingError',
      );
      expect(i18next.changeLanguage).toHaveBeenCalledWith('es');
      expect(cookies.set).toHaveBeenCalledWith('i18next', 'es');
    });
  });

  it('handles mutation error gracefully', async () => {
    // Mock the mutation to throw an error
    const errorMocks = [
      {
        request: {
          query: UPDATE_CURRENT_USER_MUTATION,
          variables: { input: { naturalLanguageCode: 'es', avatar: mockFile } },
        },
        error: new Error('Mutation failed'),
      },
    ];

    render(
      <MockedProvider mocks={errorMocks}>
        <ChangeLanguageDropDown />
      </MockedProvider>,
    );

    const dropdown = screen.getByTestId('language-dropdown-toggle');
    await userEvent.click(dropdown);

    const spanishOption = await screen.findByTestId(
      'language-dropdown-item-es',
    );
    await userEvent.click(spanishOption);

    await waitFor(() => {
      expect(i18next.changeLanguage).toHaveBeenCalledWith('es');
      expect(cookies.set).toHaveBeenCalledWith('i18next', 'es');
    });
  });

  it.each([
    { userImage: null, description: 'null' },
    { userImage: { invalid: 'object' }, description: 'non-string object' },
    { userImage: undefined, description: 'undefined' },
  ])(
    'handles language change without avatar when userImage is $description',
    async ({ userImage }) => {
      // Mock userImage to be the specified invalid value
      (useLocalStorage as Mock).mockReturnValue({
        getItem: vi.fn((key: string) => {
          if (key === 'id') return mockUserId;
          if (key === 'UserImage') return userImage;
          if (key === 'IsLoggedIn') return 'TRUE';
          return null;
        }),
      });

      // Create mocks that expect no avatar in the mutation
      const mocksWithoutAvatar = [
        {
          request: {
            query: UPDATE_CURRENT_USER_MUTATION,
            variables: { input: { naturalLanguageCode: 'es' } },
          },
          result: {
            data: { updateUser: { id: mockUserId, __typename: 'User' } },
          },
        },
      ];

      render(
        <MockedProvider mocks={mocksWithoutAvatar}>
          <ChangeLanguageDropDown />
        </MockedProvider>,
      );

      const dropdown = screen.getByTestId('language-dropdown-toggle');
      await userEvent.click(dropdown);

      const spanishOption = await screen.findByTestId(
        'language-dropdown-item-es',
      );
      await userEvent.click(spanishOption);

      await waitFor(() => {
        expect(i18next.changeLanguage).toHaveBeenCalledWith('es');
        expect(cookies.set).toHaveBeenCalledWith('i18next', 'es');
      });

      // Verify urlToFile was not called since userImage is not a valid string
      expect(urlToFile).not.toHaveBeenCalled();
    },
  );

  it('uses default language when cookies.get returns falsy value', () => {
    // Mock cookies.get to return a falsy value (null, undefined, or empty string)
    (cookies.get as Mock).mockReturnValue(null);

    (useLocalStorage as Mock).mockReturnValue({
      getItem: vi.fn((key: string) => {
        if (key === 'id') return mockUserId;
        if (key === 'UserImage') return 'https://example.com/avatar.jpg';
        if (key === 'IsLoggedIn') return 'TRUE';
        return null;
      }),
    });

    render(
      <MockedProvider mocks={[]}>
        <ChangeLanguageDropDown />
      </MockedProvider>,
    );

    // The component should render without errors even when cookies.get returns null
    // This tests the fallback branch: cookies.get('i18next') || 'en'
    expect(
      screen.getByTestId('language-dropdown-container'),
    ).toBeInTheDocument();
  });

  it('changes language locally without calling mutation when user is not logged in', async () => {
    // Mock user as NOT logged in
    (useLocalStorage as Mock).mockReturnValue({
      getItem: vi.fn((key: string) => {
        if (key === 'id') return mockUserId;
        if (key === 'UserImage') return mockUserImage;
        if (key === 'IsLoggedIn') return 'FALSE'; // User NOT logged in
        return null;
      }),
    });

    // Create a spy to verify the mutation is NOT called
    const updateUserSpy = vi.fn();
    const mocksWithSpy = [
      {
        request: {
          query: UPDATE_CURRENT_USER_MUTATION,
          variables: { input: { naturalLanguageCode: 'es', avatar: mockFile } },
        },
        result: () => {
          updateUserSpy();
          return {
            data: { updateUser: { id: mockUserId, __typename: 'User' } },
          };
        },
      },
    ];

    render(
      <MockedProvider mocks={mocksWithSpy}>
        <ChangeLanguageDropDown />
      </MockedProvider>,
    );

    const dropdown = screen.getByTestId('language-dropdown-toggle');
    await userEvent.click(dropdown);

    const spanishOption = await screen.findByTestId(
      'language-dropdown-item-es',
    );
    await userEvent.click(spanishOption);

    await waitFor(() => {
      // Verify language changed locally
      expect(i18next.changeLanguage).toHaveBeenCalledWith('es');
      expect(cookies.set).toHaveBeenCalledWith('i18next', 'es');
    });

    await waitFor(
      () => {
        expect(updateUserSpy).not.toHaveBeenCalled();
      },
      { timeout: 500 },
    );
  });

  it('calls mutation to update user language when user is logged in', async () => {
    // Mock user as logged in
    (useLocalStorage as Mock).mockReturnValue({
      getItem: vi.fn((key: string) => {
        if (key === 'id') return mockUserId;
        if (key === 'UserImage') return mockUserImage;
        if (key === 'IsLoggedIn') return 'TRUE'; // User IS logged in
        return null;
      }),
    });

    // Create a spy to verify the mutation IS called
    const updateUserSpy = vi.fn();
    const mocksWithSpy = [
      {
        request: {
          query: UPDATE_CURRENT_USER_MUTATION,
          variables: { input: { naturalLanguageCode: 'es', avatar: mockFile } },
        },
        result: () => {
          updateUserSpy();
          return {
            data: { updateUser: { id: mockUserId, __typename: 'User' } },
          };
        },
      },
    ];

    render(
      <MockedProvider mocks={mocksWithSpy}>
        <ChangeLanguageDropDown />
      </MockedProvider>,
    );

    const dropdown = screen.getByTestId('language-dropdown-toggle');
    await userEvent.click(dropdown);

    const spanishOption = await screen.findByTestId(
      'language-dropdown-item-es',
    );
    await userEvent.click(spanishOption);

    await waitFor(() => {
      // Verify mutation WAS called (critical assertion)
      expect(updateUserSpy).toHaveBeenCalled();

      // Verify language changed (happens in finally block)
      expect(i18next.changeLanguage).toHaveBeenCalledWith('es');
      expect(cookies.set).toHaveBeenCalledWith('i18next', 'es');
    });
  });

  it('changes language locally when IsLoggedIn is null or missing', async () => {
    // Mock IsLoggedIn as null (user not logged in)
    (useLocalStorage as Mock).mockReturnValue({
      getItem: vi.fn((key: string) => {
        if (key === 'id') return mockUserId;
        if (key === 'UserImage') return mockUserImage;
        if (key === 'IsLoggedIn') return null; // Not set
        return null;
      }),
    });

    const updateUserSpy = vi.fn();
    const mocksWithSpy = [
      {
        request: {
          query: UPDATE_CURRENT_USER_MUTATION,
          variables: { input: { naturalLanguageCode: 'fr', avatar: mockFile } },
        },
        result: () => {
          updateUserSpy();
          return {
            data: { updateUser: { id: mockUserId, __typename: 'User' } },
          };
        },
      },
    ];

    render(
      <MockedProvider mocks={mocksWithSpy}>
        <ChangeLanguageDropDown />
      </MockedProvider>,
    );

    const dropdown = screen.getByTestId('language-dropdown-toggle');
    await userEvent.click(dropdown);

    const frenchOption = await screen.findByTestId('language-dropdown-item-fr');
    await userEvent.click(frenchOption);

    await waitFor(() => {
      expect(i18next.changeLanguage).toHaveBeenCalledWith('fr');
      expect(cookies.set).toHaveBeenCalledWith('i18next', 'fr');
    });

    await waitFor(
      () => {
        expect(updateUserSpy).not.toHaveBeenCalled();
      },
      { timeout: 500 },
    );
  });
});
