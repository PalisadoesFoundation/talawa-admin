import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';

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


import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';

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

// Regression prevention: Detect barrel imports from @mui/icons-material
// This helps ensure that the refactoring to direct imports (e.g.,
// import Icon from '@mui/icons-material/Icon') is maintained and
// prevents accidental reintroduction of barrel imports, which can lead
// to EMFILE errors during test runs on Windows.
vi.mock('@mui/icons-material', () => {
  return new Proxy(
    {},
    {
      get: (_target, prop) => {
        // Any attempt to access a named export from the @mui/icons-material
        // barrel file indicates a regression. We ignore non-string and special
        // properties like `__esModule` that might be accessed by the module system.
        if (typeof prop === 'string' && prop !== '__esModule') {
          const errorMessage = `
Barrel import detected from '@mui/icons-material' during tests.
Please refactor to a direct import to prevent 'EMFILE: too many open files' errors and improve performance.

  Change this:
    import { ${prop} } from '@mui/icons-material';
  To this:
    import ${prop} from '@mui/icons-material/${prop}';
`;
          throw new Error(errorMessage);
        }

        // Allow other property accesses to pass through.
        return undefined;
      },
    },
  );
});