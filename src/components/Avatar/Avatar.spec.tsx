import React from 'react';
import { render, screen } from '@testing-library/react';
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
    getState: vi.fn(() => ({
      auth: {
        user: null,
        loading: false,
      },
    })),
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

// Test suite for Avatar component
describe('Testing Avatar component', () => {
  // Helper function for rendering Avatar component with props
  const renderAvatar = (props = {}): ReturnType<typeof render> => {
    return render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Avatar {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
  };

  // Test for rendering with name and alt attribute
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

  // Test for custom style and data-testid
  test('should render with custom style and data-testid', () => {
    const testName = 'Jane Doe';
    const testAlt = 'Dummy Avatar';
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

    const avatarElement = getByAltText(testAlt);
    expect(avatarElement).toBeInTheDocument();
    expect(avatarElement.getAttribute('src')).toBeDefined();
    expect(avatarElement.getAttribute('class')).toContain(testStyle);
    expect(avatarElement.getAttribute('data-testid')).toBe(testDataTestId);
  });

  // Error Handling for Undefined Name
  test('handles undefined name gracefully', () => {
    renderAvatar({ name: undefined });

    const avatarElement = screen.getByAltText('Dummy Avatar');
    expect(avatarElement).toBeInTheDocument();
    expect(avatarElement.getAttribute('src')).toContain('data:image/svg+xml');
  });

  // Valid Sizes Test
  const validSizes = [32, 64, 128];
  validSizes.forEach((size) => {
    test(`accepts valid size ${size}`, () => {
      renderAvatar({ name: 'Test User', size });

      const avatarElement = screen.getByAltText('Dummy Avatar');
      expect(avatarElement).toHaveAttribute('width', size.toString());
      expect(avatarElement).toHaveAttribute('height', size.toString());
    });
  });

  // Invalid Sizes Test
  const invalidSizes = [0, -1, 257, 'string'];
  invalidSizes.forEach((size) => {
    test(`falls back to default size when invalid size ${size} is provided`, () => {
      renderAvatar({ name: 'Test User', size });

      const avatarElement = screen.getByAltText('Dummy Avatar');
      expect(avatarElement).toHaveAttribute('width');
      expect(avatarElement).toHaveAttribute('height');
    });
  });

  // Custom URL Test
  test('uses custom URL when provided', () => {
    const customUrl = 'https://example.com/custom-avatar.png';

    renderAvatar({
      name: 'John Doe',
      customUrl,
    });

    const avatarElement = screen.getByAltText('Dummy Avatar');
    expect(avatarElement.getAttribute('src')).toBe(customUrl);
  });

  // Fallback to generated avatar when custom URL is invalid
  test('falls back to generated avatar when custom URL is invalid', () => {
    renderAvatar({
      name: 'John Doe',
      customUrl: '',
    });

    const avatarElement = screen.getByAltText('Dummy Avatar');
    expect(avatarElement.getAttribute('src')).toContain('data:image/svg+xml');
  });
});
