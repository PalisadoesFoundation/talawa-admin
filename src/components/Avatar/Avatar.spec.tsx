import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, test, expect, vi } from 'vitest';
import Avatar from './Avatar';

/**
 * Unit tests for the `Avatar` component.
 *
 * The tests ensure the `Avatar` component renders correctly with various props.
 * Mocked dependencies are used to isolate the component and verify its behavior.
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
  /**
   * Test: Verifies the `Avatar` component renders correctly with the `name` and `alt` attributes.
   *
   * Steps:
   * 1. Render the `Avatar` component with `name`, `alt`, and `size` props.
   * 2. Check if the avatar image is present in the document.
   * 3. Validate the `src` attribute is defined.
   */
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

  /**
   * Test: Verifies the `Avatar` component renders correctly with custom style and `data-testid`.
   *
   * Steps:
   * 1. Render the `Avatar` component with `avatarStyle` and `dataTestId` props.
   * 2. Check if the avatar image is present in the document.
   * 3. Validate the `className` contains the custom style.
   * 4. Validate the `data-testid` attribute matches the expected value.
   */

  test('renders with custom style and data-testid', () => {
    const testName = 'Jane Doe';
    const testStyle = 'custom-avatar-style';
    const testDataTestId = 'custom-avatar-test-id';

    const { getByAltText } = render(
      <Avatar
        name={testName}
        alt="Dummy Avatar"
        avatarStyle={testStyle}
        dataTestId={testDataTestId}
      />,
    );

    const avatarElement = getByAltText('Dummy Avatar');

    expect(avatarElement).toBeInTheDocument();
    expect(avatarElement.getAttribute('src')).toBeDefined();

    expect(avatarElement.className).toContain(testStyle);

    expect(avatarElement.getAttribute('data-testid')).toBe(testDataTestId);
  });
});
