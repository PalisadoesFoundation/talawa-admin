import { render, screen } from '@testing-library/react';
import TruncatedText from './TruncatedText';
import React from 'react';
import { vi } from 'vitest';

const mockLayout = (width: number, fontSize = '16px') => {
  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
    configurable: true,
    value: width,
  });

  window.getComputedStyle = () =>
    ({
      fontSize,
    }) as CSSStyleDeclaration;
};

describe('TruncatedText Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  test('renders full text when maxWidthOverride allows full display', () => {
    render(<TruncatedText text="This is a long text" maxWidthOverride={300} />);
    expect(screen.getByText('This is a long text')).toBeInTheDocument();
  });

  test('truncates text when width is small', () => {
    mockLayout(50, '16px');

    render(<TruncatedText text="This is a long text" />);

    const truncated = screen.getByText((content) => content.endsWith('...'));

    expect(truncated).toBeInTheDocument();
  });
  test('truncates when maxWidthOverride is 0', () => {
    render(<TruncatedText text="This is a long text" maxWidthOverride={0} />);

    const truncated = screen.getByText((content) => content.endsWith('...'));

    expect(truncated).toBeInTheDocument();
  });
});
