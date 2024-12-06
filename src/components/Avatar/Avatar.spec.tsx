import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, test, expect, vi } from 'vitest';
import Avatar from './Avatar';

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

describe('Avatar component', () => {
  test('renders with name and alt attribute', () => {
    const testName = 'John Doe';
    const testAlt = 'Test Alt Text';
    const testSize = 64;

    const { getByAltText } = render(
      <Avatar name={testName} alt={testAlt} size={testSize} />,
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
      <Avatar
        name={testName}
        alt="Dummy Avatar"
        avatarStyle={testStyle} // Pass custom style
        dataTestId={testDataTestId} // Pass data-testid
      />,
    );

    const avatarElement = getByAltText('Dummy Avatar');

    expect(avatarElement).toBeInTheDocument();
    expect(avatarElement.getAttribute('src')).toBeDefined();

    expect(avatarElement.className).toContain(testStyle);

    expect(avatarElement.getAttribute('data-testid')).toBe(testDataTestId);
  });
});
