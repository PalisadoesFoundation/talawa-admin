import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('Vitest Configuration', () => {
  it('should support TypeScript', () => {
    const value = 42;
    expect(typeof value).toBe('number');
  });

  it('should support DOM testing', async () => {
    render(<div data-testid="test">Hello</div>);
    expect(screen.getByTestId('test')).toBeInTheDocument();
  });

  it('should support mocking', async () => {
    const mock = vi.fn().mockReturnValue('mocked');
    expect(mock()).toBe('mocked');
  });
});
