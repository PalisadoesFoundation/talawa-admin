import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';
import '@testing-library/jest-dom';
import { describe, test, expect, vi } from 'vitest';
import { store } from 'state/store';
import Avatar from './Avatar';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';

const link = new StaticMockLink([], true);

vi.mock('state/store', () => ({
  store: {
    // Mock store configuration if needed
    getState: vi.fn(),
    subscribe: vi.fn(),
    dispatch: vi.fn(),
  },
}));

vi.mock('utils/i18nForTest', () => ({
  __esModule: true,
  default: vi.fn(() => ({
    t: (key: string) => key,
  })),
}));

describe('Testing Avatar component', () => {
  test('should render with name and alt attribute', () => {
    const testName = 'John Doe';
    const testAlt = 'Test Alt Text';
    const testSize = 64;

    const { getByAltText } = render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Avatar name={testName} alt={testAlt} size={testSize} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    const avatarElement = getByAltText(testAlt);
    expect(avatarElement).toBeInTheDocument();
    expect(avatarElement.getAttribute('src')).toBeDefined();
  });

  test('should render with custom style and data-testid', () => {
    const testName = 'Jane Doe';
    const testStyle = 'custom-avatar-style';
    const testDataTestId = 'custom-avatar-test-id';

    const { getByAltText } = render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Avatar
                name={testName}
                avatarStyle={testStyle}
                dataTestId={testDataTestId}
              />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    const avatarElement = getByAltText('Dummy Avatar');
    expect(avatarElement).toBeInTheDocument();
    expect(avatarElement.getAttribute('src')).toBeDefined();
    expect(avatarElement.getAttribute('class')).toContain(testStyle);
    expect(avatarElement.getAttribute('data-testid')).toBe(testDataTestId);
  });
});
