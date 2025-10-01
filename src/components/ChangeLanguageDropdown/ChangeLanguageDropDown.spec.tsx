import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import React from 'react';
import { toast } from 'react-toastify';
import cookies from 'js-cookie';
import i18next from 'i18next';
import ChangeLanguageDropDown from './ChangeLanguageDropDown';
import { UPDATE_CURRENT_USER_MUTATION } from 'GraphQl/Mutations/mutations';
import { languages } from 'utils/languages';
import useLocalStorage from 'utils/useLocalstorage';
import { urlToFile } from 'utils/urlToFile';

// Mock dependencies
vi.mock('react-toastify', () => ({ toast: { error: vi.fn() } }));

vi.mock('js-cookie', () => ({ default: { get: vi.fn(), set: vi.fn() } }));

vi.mock('i18next', () => ({ default: { changeLanguage: vi.fn() } }));

vi.mock('utils/useLocalstorage', () => ({ default: vi.fn() }));

vi.mock('utils/urlToFile', () => ({ urlToFile: vi.fn() }));

// Mock the CSS module
vi.mock('style/app-fixed.module.css', () => ({
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
      result: { data: { updateUser: { id: mockUserId } } },
    },
  ];

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Setup default mock implementations
    (useLocalStorage as jest.Mock).mockReturnValue({
      getItem: vi.fn((key) => {
        if (key === 'id') return mockUserId;
        if (key === 'UserImage') return mockUserImage;
        return null;
      }),
    });

    (cookies.get as jest.Mock).mockReturnValue('en');
    (urlToFile as jest.Mock).mockResolvedValue(mockFile);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders with default language (English)', () => {
    render(
      <MockedProvider mocks={mocks}>
        <ChangeLanguageDropDown />
      </MockedProvider>,
    );

    const englishOption = screen.getByText('English');
    expect(englishOption).toBeInTheDocument();
  });

  it('shows error toast when userId is not found', async () => {
    (useLocalStorage as jest.Mock).mockReturnValue({
      getItem: vi.fn(() => null),
    });

    render(
      <MockedProvider mocks={mocks}>
        <ChangeLanguageDropDown />
      </MockedProvider>,
    );

    const dropdown = screen.getByTestId('language-dropdown-btn');
    fireEvent.click(dropdown);

    const spanishOption = screen.getByTestId('change-language-btn-es');
    fireEvent.click(spanishOption);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('User not found');
    });
  });

  it('successfully changes language', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <ChangeLanguageDropDown />
      </MockedProvider>,
    );

    const dropdown = screen.getByTestId('language-dropdown-btn');
    fireEvent.click(dropdown);

    const spanishOption = screen.getByTestId('change-language-btn-es');
    fireEvent.click(spanishOption);

    await waitFor(() => {
      expect(i18next.changeLanguage).toHaveBeenCalledWith('es');
      expect(cookies.set).toHaveBeenCalledWith('i18next', 'es');
    });
  });

  it('renders all available languages in the dropdown', () => {
    render(
      <MockedProvider mocks={mocks}>
        <ChangeLanguageDropDown />
      </MockedProvider>,
    );

    const dropdown = screen.getByTestId('language-dropdown-btn');
    fireEvent.click(dropdown);

    languages.forEach((language) => {
      const option = screen.getByTestId(`change-language-btn-${language.code}`);
      expect(option).toBeInTheDocument();
    });
  });
});
