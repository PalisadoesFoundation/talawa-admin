import React from 'react';
import { render } from '@testing-library/react';
import Avatar from './Avatar';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';

describe('Avatar component', () => {
  test('renders with name and alt attribute', () => {
    const testName = 'John Doe';
    const testAlt = 'Test Alt Text';
    const testSize = 64;

    const { getByAltText } = render(
      <BrowserRouter>
        <I18nextProvider i18n={i18nForTest}>
          <Avatar name={testName} alt={testAlt} size={testSize} />
        </I18nextProvider>
      </BrowserRouter>
    );
    const avatarElement = getByAltText(testAlt);

    expect(avatarElement).toBeInTheDocument();
    expect(avatarElement.getAttribute('src')).toBeDefined();
  });

  test('renders with custom style and data-testid', () => {
    const testName = 'Jane Doe';
    const testStyle = 'custom-avatar-style';
    const testDataTestId = 'custom-avatar-test-id';

    const { getByAltText } = render(
      <BrowserRouter>
        <I18nextProvider i18n={i18nForTest}>
          <Avatar
            name={testName}
            avatarStyle={testStyle}
            dataTestId={testDataTestId}
          />
        </I18nextProvider>
      </BrowserRouter>
    );
    const avatarElement = getByAltText('Dummy Avatar');

    expect(avatarElement).toBeInTheDocument();
    expect(avatarElement.getAttribute('src')).toBeDefined();
    expect(avatarElement.getAttribute('class')).toContain(testStyle);
    expect(avatarElement.getAttribute('data-testid')).toBe(testDataTestId);
  });
});
