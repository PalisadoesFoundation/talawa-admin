import React from 'react';
import { act, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import i18nForTest from 'utils/i18nForTest';
import { languages } from 'utils/languages';
import ChangeLanguageDropDown from './ChangeLanguageDropDown';
import cookies from 'js-cookie';
import { MockedProvider } from '@apollo/react-testing';
import { UPDATE_USER_MUTATION } from 'GraphQl/Mutations/mutations';
import { StaticMockLink } from 'utils/StaticMockLink';

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

const MOCKS = [
  {
    request: {
      query: UPDATE_USER_MUTATION,
      variables: {
        id: 1,
        appLanguageCode: 'en',
      },
    },
    result: {
      data: {
        updateUser: {
          id: 1,
          appLanguageCode: 'en',
        },
      },
    },
  },
];

const link = new StaticMockLink(MOCKS, true);
describe('Testing Change Language Dropdown', () => {
  test('Component Should be rendered properly', async () => {
    const { getByTestId } = render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <ChangeLanguageDropDown />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(getByTestId('language-dropdown-container')).toBeInTheDocument();
    expect(getByTestId('language-dropdown-btn')).toBeInTheDocument();
    expect(getByTestId('dropdown-btn-0')).toBeInTheDocument();

    getByTestId('language-dropdown-container').className.includes('');
    getByTestId('language-dropdown-btn').className.includes('');
    getByTestId('dropdown-btn-0').className.includes('');

    userEvent.click(getByTestId('dropdown-btn-0'));
    await wait();

    languages.map((language) => {
      expect(
        getByTestId(`change-language-btn-${language.code}`),
      ).toBeInTheDocument();
    });
  });

  test('Component Should accept props properly', async () => {
    const props = {
      parentContainerStyle: 'parentContainerStyle',
      btnStyle: 'btnStyle',
      btnTextStyle: 'btnTextStyle',
    };
    const { getByTestId } = render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <ChangeLanguageDropDown {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );
    getByTestId('language-dropdown-container').className.includes(
      props.parentContainerStyle,
    );
    getByTestId('language-dropdown-btn').className.includes(props.btnStyle);
    getByTestId('dropdown-btn-0').className.includes(props.btnTextStyle);
  });

  test('Testing when language cookie is not set', async () => {
    Object.defineProperty(window.document, 'cookie', {
      writable: true,
      value: 'i18next=',
    });

    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <ChangeLanguageDropDown />
        </I18nextProvider>
      </MockedProvider>,
    );

    await wait();
    expect(cookies.get('i18next')).toBe('');
  });

  test('Testing change language functionality', async () => {
    Object.defineProperty(window.document, 'cookie', {
      writable: true,
      value: 'i18next=en',
    });

    const { getByTestId } = render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <ChangeLanguageDropDown />
        </I18nextProvider>
      </MockedProvider>,
    );

    userEvent.click(getByTestId('language-dropdown-btn'));
    await wait();
    languages.map((language) => {
      const changeLanguageBtn = getByTestId(
        `change-language-btn-${language.code}`,
      );
      expect(changeLanguageBtn).toBeInTheDocument();
      userEvent.click(changeLanguageBtn);
      expect(cookies.get('i18next')).toBe(language.code);
    });
  });
});
