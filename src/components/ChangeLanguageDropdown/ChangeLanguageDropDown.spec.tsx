import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import i18nForTest from 'utils/i18nForTest';
import { languages } from 'utils/languages';
import ChangeLanguageDropDown from './ChangeLanguageDropDown';
import cookies from 'js-cookie';
import { MockedProvider } from '@apollo/react-testing';
import { UPDATE_CURRENT_USER_MUTATION } from 'GraphQl/Mutations/mutations';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { toast } from 'react-toastify';

// Mock urlToFile utility
const { mockUrlToFile } = vi.hoisted(() => ({
  mockUrlToFile: vi.fn(),
}));

vi.mock('utils/urlToFile', () => ({
  urlToFile: mockUrlToFile,
}));

// Mock useLocalStorage hook
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};

vi.mock('utils/useLocalstorage', () => ({
  default: () => mockLocalStorage,
}));

// Mock File
const mockFile = new File([''], 'avatar.png', { type: 'image/png' });

// Setup test delay utility
const wait = async (ms = 100): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, ms));
};

// GraphQL mocks
const MOCKS = [
  {
    request: {
      query: UPDATE_CURRENT_USER_MUTATION,
      variables: {
        input: {
          naturalLanguageCode: 'fr',
          avatar: mockFile,
        },
      },
    },
    result: {
      data: {
        updateCurrentUser: {
          id: '67378abd-8500-8f17-1cf2-990d00000006',
          naturalLanguageCode: 'fr',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_CURRENT_USER_MUTATION,
      variables: {
        input: {
          naturalLanguageCode: 'fr',
        },
      },
    },
    result: {
      data: {
        updateCurrentUser: {
          id: '67378abd-8500-8f17-1cf2-990d00000006',
          naturalLanguageCode: 'fr',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_CURRENT_USER_MUTATION,
      variables: {
        input: {
          naturalLanguageCode: 'hi',
        },
      },
    },
    error: new Error('An error occurred'),
  },
];

const renderComponent = (props = {}): ReturnType<typeof render> => {
  return render(
    <MockedProvider mocks={MOCKS} addTypename={false}>
      <BrowserRouter>
        <I18nextProvider i18n={i18nForTest}>
          <ChangeLanguageDropDown {...props} />
        </I18nextProvider>
      </BrowserRouter>
    </MockedProvider>,
  );
};

describe('ChangeLanguageDropDown', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    cookies.remove('i18next');

    // Setup default localStorage mock returns
    mockLocalStorage.getItem.mockImplementation((key) => {
      switch (key) {
        case 'userId':
          return '67378abd-8500-8f17-1cf2-990d00000006';
        case 'UserImage':
          return null;
        default:
          return null;
      }
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly with default props', async () => {
    renderComponent();

    expect(
      screen.getByTestId('language-dropdown-container'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('language-dropdown-btn')).toBeInTheDocument();

    // Check all language options are present
    const dropdownBtn = screen.getByTestId('language-dropdown-btn');
    await userEvent.click(dropdownBtn);

    languages.forEach((language) => {
      expect(
        screen.getByTestId(`change-language-btn-${language.code}`),
      ).toBeInTheDocument();
    });
  });

  it('changes language successfully without avatar', async () => {
    // Ensure no UserImage in localStorage
    mockLocalStorage.getItem.mockImplementation((key) => {
      switch (key) {
        case 'userId':
          return '67378abd-8500-8f17-1cf2-990d00000006';
        default:
          return null;
      }
    });

    renderComponent();

    const dropdownBtn = screen.getByTestId('language-dropdown-btn');
    await userEvent.click(dropdownBtn);

    const frenchOption = screen.getByTestId('change-language-btn-fr');
    await userEvent.click(frenchOption);

    await wait(200);

    expect(cookies.get('i18next')).toBe('fr');
  });

  it('changes language successfully with avatar', async () => {
    mockUrlToFile.mockResolvedValue(mockFile);
    mockLocalStorage.getItem.mockImplementation((key) => {
      switch (key) {
        case 'userId':
          return '67378abd-8500-8f17-1cf2-990d00000006';
        case 'UserImage':
          return 'data:image/png;base64,fake-image-data';
        default:
          return null;
      }
    });

    renderComponent();

    const dropdownBtn = screen.getByTestId('language-dropdown-btn');
    await userEvent.click(dropdownBtn);

    const frenchOption = screen.getByTestId('change-language-btn-fr');
    await userEvent.click(frenchOption);

    await wait(200);

    expect(mockUrlToFile).toHaveBeenCalledWith(
      'data:image/png;base64,fake-image-data',
    );
    expect(cookies.get('i18next')).toBe('fr');
  });

  it('handles mutation error gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'log');

    renderComponent();

    const dropdownBtn = screen.getByTestId('language-dropdown-btn');
    await userEvent.click(dropdownBtn);

    const hindiOption = screen.getByTestId('change-language-btn-hi');
    await userEvent.click(hindiOption);

    await wait(200);

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error in changing language',
      expect.any(Error),
    );
    expect(cookies.get('i18next')).not.toBe('hi');
  });

  it('handles avatar processing error gracefully', async () => {
    mockUrlToFile.mockRejectedValue(new Error('Failed to process image'));
    mockLocalStorage.getItem.mockImplementation((key) => {
      switch (key) {
        case 'userId':
          return '67378abd-8500-8f17-1cf2-990d00000006';
        case 'UserImage':
          return 'data:image/png;base64,fake-image-data';
        default:
          return null;
      }
    });

    const consoleSpy = vi.spyOn(console, 'log');

    renderComponent();

    const dropdownBtn = screen.getByTestId('language-dropdown-btn');
    await userEvent.click(dropdownBtn);

    const frenchOption = screen.getByTestId('change-language-btn-fr');
    await userEvent.click(frenchOption);

    await wait(200);

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error processing avatar:',
      expect.any(Error),
    );
    expect(cookies.get('i18next')).toBe('fr');
  });

  it('shows error toast when userId is not found', async () => {
    const toastErrorSpy = vi.spyOn(toast, 'error');

    mockLocalStorage.getItem.mockImplementation((key) => {
      switch (key) {
        case 'userId':
          return null;
        default:
          return null;
      }
    });

    renderComponent();

    const dropdownBtn = screen.getByTestId('language-dropdown-btn');
    await userEvent.click(dropdownBtn);

    const frenchOption = screen.getByTestId('change-language-btn-fr');
    await userEvent.click(frenchOption);

    expect(toastErrorSpy).toHaveBeenCalledWith('User not found');
    expect(cookies.get('i18next')).not.toBe('fr');
  });
});
