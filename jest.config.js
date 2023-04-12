export default {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/index.tsx'],
  setupFiles: ['react-app-polyfill/jsdom'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}',
  ],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx|mjs|cjs|ts|tsx)$':
      'react-scripts/config/jest/babelTransform.js',
    '^.+\\.(css|scss|sass|less)$': 'jest-preview/transforms/css',
    '^(?!.*\\.(js|jsx|mjs|cjs|ts|tsx|css|json)$)':
      'jest-preview/transforms/file',
  },
  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|cjs|ts|tsx)$',
  ],
  modulePaths: [
    '/Users/prathamesh/Desktop/Open-Source/palisadoes/talawa-admin/src',
    '<rootDir>/src',
  ],
  moduleNameMapper: {
    '^react-native$': 'react-native-web',
    '^@mui/(.*)$': '<rootDir>/node_modules/@mui/$1',
  },
  moduleFileExtensions: [
    'web.js',
    'js',
    'web.ts',
    'ts',
    'web.tsx',
    'tsx',
    'json',
    'web.jsx',
    'jsx',
    'node',
  ],
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
  resetMocks: false,
  coveragePathIgnorePatterns: [
    'src/state/index.ts',
    'src/components/plugins/index.ts',
    'src/components/AddOn/support/services/Render.helper.ts',
    'src/components/SecuredRoute/SecuredRoute.tsx',
    'src/reportWebVitals.ts',
  ],
  coverageThreshold: {
    global: {
      lines: 20,
      statements: 20,
    },
  },
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/build/',
    '<rootDir>/public/',
  ],
};
