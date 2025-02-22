import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { useMutation } from '@apollo/client';
import ChangeLanguageDropDown from './ChangeLanguageDropDown';
import i18next from 'i18next';
import cookies from 'js-cookie';
import { languages } from 'utils/languages';
import { toast } from 'react-toastify';
import { urlToFile } from 'utils/urlToFile';

// Mock external dependencies
jest.mock('i18next', () => ({
  changeLanguage: jest.fn().mockResolvedValue(true),
}));

jest.mock('js-cookie', () => ({
  get: jest.fn(),
  set: jest.fn(),
}));

jest.mock('@apollo/client', () => ({
  ...jest.requireActual('@apollo/client'),
  useMutation: jest.fn(),
}));

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
}));

jest.mock('utils/urlToFile', () => ({
  urlToFile: jest.fn().mockResolvedValue(new File([''], 'avatar.png')),
}));

jest.mock('utils/useLocalstorage', () => ({
  __esModule: true,
  default: () => ({
    getItem: jest.fn(),
  }),
}));

const mockUpdateUser = jest.fn();
const mockUseMutation = useMutation as jest.Mock;

describe('ChangeLanguageDropDown Component', async () => {
  beforeEach(() => {
    mockUseMutation.mockImplementation(() => [mockUpdateUser]);
    (cookies.get as jest.Mock).mockReturnValue('en');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly with current language', () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <ChangeLanguageDropDown />
      </MockedProvider>,
    );

    expect(
      screen.getByTestId('language-dropdown-container'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('language-dropdown-btn')).toBeInTheDocument();
    expect(screen.getByText('English')).toBeInTheDocument();
  });

  test('displays all language options', async () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <ChangeLanguageDropDown />
      </MockedProvider>,
    );

    fireEvent.click(screen.getByTestId('language-dropdown-btn'));

    await waitFor(() => {
      languages.forEach((language) => {
        expect(screen.getByText(language.name)).toBeInTheDocument();
      });
    });
  });

  render(
    <MockedProvider mocks={[]} addTypename={false}>
      <ChangeLanguageDropDown />
    </MockedProvider>,
  );

  fireEvent.click(screen.getByTestId('language-dropdown-btn'));
  fireEvent.click(screen.getByTestId('change-language-btn-fr'));

  await waitFor(() => {
    expect(urlToFile).toHaveBeenCalledWith('avatar-url');
    expect(mockUpdateUser).toHaveBeenCalledWith({
      variables: {
        input: {
          naturalLanguageCode: 'fr',
          avatar: expect.any(File),
        },
      },
    });
    expect(i18next.changeLanguage).toHaveBeenCalledWith('fr');
    expect(cookies.set).toHaveBeenCalledWith('i18next', 'fr');
  });
});

render(
  <MockedProvider mocks={[]} addTypename={false}>
    <ChangeLanguageDropDown />
  </MockedProvider>,
);

fireEvent.click(screen.getByTestId('language-dropdown-btn'));
fireEvent.click(screen.getByTestId('change-language-btn-es'));

await waitFor(() => {
  expect(toast.error).toHaveBeenCalledWith('User not found');
  expect(mockUpdateUser).not.toHaveBeenCalled();
});

(urlToFile as jest.Mock).mockRejectedValue(new Error('Conversion error'));

render(
  <MockedProvider mocks={[]} addTypename={false}>
    <ChangeLanguageDropDown />
  </MockedProvider>,
);

fireEvent.click(screen.getByTestId('language-dropdown-btn'));
fireEvent.click(screen.getByTestId('change-language-btn-de'));

await waitFor(() => {
  expect(mockUpdateUser).toHaveBeenCalledWith({
    variables: {
      input: {
        naturalLanguageCode: 'de',
      },
    },
  });
});

test('disables current language option', async () => {
  render(
    <MockedProvider mocks={[]} addTypename={false}>
      <ChangeLanguageDropDown />
    </MockedProvider>,
  );

  fireEvent.click(screen.getByTestId('language-dropdown-btn'));
  const currentLanguageItem = screen.getByTestId('change-language-btn-en');

  expect(currentLanguageItem).toHaveAttribute('disabled');
  expect(currentLanguageItem).toHaveClass('disabled');
});
