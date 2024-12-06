import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, test, expect, vi } from 'vitest';
import Avatar from './Avatar';

/**
 * Avatar.spec.tsx
 * description:  Test suite for the Avatar component.
 * This file contains all the unit tests for the Avatar component, covering
 * different test cases like rendering with props, handling custom styles,
 * verifying behavior for invalid/valid sizes, and handling undefined names.
 *
 */

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
        // className={testStyle}
        data-testid={testDataTestId}
      />,
    );

    const avatarElement = getByAltText('Dummy Avatar');

    expect(avatarElement).toBeInTheDocument();
    expect(avatarElement.getAttribute('src')).toBeDefined();
    expect(avatarElement.getAttribute('class')).toContain(testStyle);
    expect(avatarElement.getAttribute('data-testid')).toBe(testDataTestId);
  });
});
