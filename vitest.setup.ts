import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import React from 'react';

// Mock MUI X Charts to avoid ESM node import issues during tests
vi.mock('@mui/x-charts', () => {
  const MockComp = () => null as unknown as React.ReactElement;
  return {
    PieChart: MockComp,
    BarChart: MockComp,
    LineChart: MockComp,
    pieArcClasses: {},
  };
});

// Basic cleanup after each test
afterEach(() => {
  cleanup();
});

// Simple console error handler for React 18 warnings
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    const firstArg = args[0];
    if (
      typeof firstArg === 'string' &&
      /Warning: ReactDOM.render is no longer supported in React 18./.test(
        firstArg,
      )
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
