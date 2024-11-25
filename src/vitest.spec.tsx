/**
 * This file contains tests for the different Vitest configurations
 */
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('Vitest Configuration', () => {
  it('should support TypeScript', () => {
    interface TestInterface {
      id: number;
      name: string;
    }
    const value: TestInterface = { id: 42, name: 'test' };
    expect(value.id).toBe(42);
    expect(value.name).toBe('test');
  });

  it('should support DOM testing', () => {
    render(<div data-testid="test">Hello</div>);
    expect(screen.getByTestId('test')).toBeInTheDocument();
  });

  it('should support mocking', () => {
    const mock = vi.fn().mockReturnValue('mocked');
    expect(mock()).toBe('mocked');

    // Test spy functionality
    const spy = vi.spyOn(console, 'log');
    console.log('test');

    expect(spy).toHaveBeenCalledWith('test');

    // Test mock implementation
    const mockWithImpl = vi.fn().mockImplementation((x: number) => x * 2);
    expect(mockWithImpl(2)).toBe(4);
  });
});
