export default {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/index.tsx',
    '!node_modules',
    '!dist',
    '!**/*.{spec,test}.{js,jsx,ts,tsx}',
    '!coverage/**',
    '!**/index.{js,ts}',
    '!**/*.d.ts',
    '!src/test/**',
    '!vitest.config.ts',
  ],
  // setupFiles: ['react-app-polyfill/jsdom'],
  setupFiles: ['whatwg-fetch'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.test.{js,jsx,ts,tsx}',
  ],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': [
      'babel-jest',
      { configFile: './config/babel.config.cjs' },
    ], // Use babel-jest for JavaScript and TypeScript files
    '^.+\\.(css|scss|sass|less)$': 'jest-preview/transforms/css', // CSS transformations
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': 'jest-preview/transforms/file', // File transformations
  },
  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|cjs|ts|tsx)$',
  ],
  modulePaths: [
    '/Users/prathamesh/Desktop/Open-Source/palisadoes/talawa-admin/src',
    '<rootDir>/src',
  ],
  moduleNameMapper: {
    '\\.(css|scss|sass|less)$': 'identity-obj-proxy',
    '^react-native$': 'react-native-web',
    '^@dicebear/core$': '<rootDir>/scripts/__mocks__/@dicebear/core.ts',
    '^@dicebear/collection$':
      '<rootDir>/scripts/__mocks__/@dicebear/collection.ts',
    '\\.svg\\?react$': '<rootDir>/scripts/__mocks__/fileMock.js',
    '\\.svg$': '<rootDir>/scripts/__mocks__/fileMock.js',
    '^@pdfme/generator$': '<rootDir>/scripts/__mocks__/@pdfme/generator.ts',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
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
  // watchPlugins: [
  //   'jest-watch-typeahead/filename',
  //   'jest-watch-typeahead/testname',
  // ],
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
      lines: 1,
      statements: 1,
    },
  },
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/build/',
    '<rootDir>/public/',
  ],
  coverageDirectory: './coverage/jest',
  coverageReporters: ['text', 'html', 'text-summary', 'lcov'],
};
