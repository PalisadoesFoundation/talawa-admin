import { RuleTester } from 'eslint';
import rule from '../require-aftereach-cleanup.js';

const ruleTester = new RuleTester();

ruleTester.run('require-aftereach-cleanup', rule, {
  valid: [
    {
      code: `
        afterEach(() => {
          vi.clearAllMocks();
        });
        vi.fn();
      `,
      languageOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        globals: { vi: 'readonly', afterEach: 'readonly' },
      },
    },

    {
      code: `
        afterEach(() => vi.restoreAllMocks());
        vi.mock('x');
      `,
      languageOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        globals: { vi: 'readonly', afterEach: 'readonly' },
      },
    },

    {
      code: `
        describe('t', () => {
          afterEach(() => {
            vi.resetModules();
          });
        });
        vi.spyOn(obj, 'a');
      `,
      languageOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        globals: { vi: 'readonly', describe: 'readonly', afterEach: 'readonly', obj: 'readonly' },
      },
    },

    // Test no mocks - should pass without afterEach
    {
      code: `
        test('no mocks', () => {
          expect(1).toBe(1);
        });
      `,
      languageOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        globals: { test: 'readonly', expect: 'readonly' },
      },
    },

    // Test FunctionExpression callback with clearAllMocks
    {
      code: `
        afterEach(function() {
          vi.clearAllMocks();
        });
        vi.fn();
      `,
      languageOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        globals: { vi: 'readonly', afterEach: 'readonly' },
      },
    },

    {
      code: `
        afterEach(function() {
          vi.restoreAllMocks();
        });
        vi.mock('x');
      `,
      languageOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        globals: { vi: 'readonly', afterEach: 'readonly' },
      },
    },

    {
      code: `
        afterEach(() => {
          if (true) {
            vi.clearAllMocks();
          }
        });
        vi.fn();
      `,
      languageOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        globals: { vi: 'readonly', afterEach: 'readonly' },
      },
    },

    {
      code: `
        afterEach(() => {
          [vi.clearAllMocks()];
        });
        vi.fn();
      `,
      languageOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        globals: { vi: 'readonly', afterEach: 'readonly' },
      },
    },

    {
      code: `
        afterEach(() => {
          vi.clearAllMocks();
        });
        vi.fn();
        vi.mock('x');
        vi.spyOn(obj, 'y');
      `,
      languageOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        globals: { vi: 'readonly', afterEach: 'readonly', obj: 'readonly' },
      },
    },

    {
      code: `
        afterEach(() => {
          vi.clearAllMocks();
        });
        jest.spyOn(obj, 'x');
      `,
      languageOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        globals: { vi: 'readonly', jest: 'readonly', afterEach: 'readonly', obj: 'readonly' },
      },
    },

    {
      code: `
        obj.spyOn(target, 'method');
      `,
      languageOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        globals: { obj: 'readonly', target: 'readonly' },
      },
    },

    {
      code: `
        afterEach(() => {
          vi.clearAllMocks();
          vi.doSomethingElse();
        });
        vi.fn();
      `,
      languageOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        globals: { vi: 'readonly', afterEach: 'readonly' },
      },
    },

    {
      code: `afterEach(() => {
vi.clearAllMocks();
});
vi.fn();`,
      languageOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        globals: { vi: 'readonly', afterEach: 'readonly' },
      },
    },
  ],

  invalid: [
    {
      code: `vi.fn();`,
      errors: [{ messageId: 'missingAfterEach' }],
      output: null,
      languageOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        globals: { vi: 'readonly' },
      },
    },

    {
      code: `vi.mock('y');`,
      errors: [{ messageId: 'missingAfterEach' }],
      output: null,
      languageOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        globals: { vi: 'readonly' },
      },
    },

    {
      code: `vi.spyOn(obj, 'x');`,
      errors: [{ messageId: 'missingAfterEach' }],
      output: null,
      languageOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        globals: { vi: 'readonly', obj: 'readonly' },
      },
    },

    {
      code: `
    describe('x', () => {
      vi.mock('y');
    });
  `,
      errors: [{ messageId: 'missingAfterEach' }],
      output: `
    describe('x', () => {
      
      afterEach(() => {
        vi.clearAllMocks();
      });

vi.mock('y');
    });
  `,
      languageOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        globals: { vi: 'readonly', describe: 'readonly', afterEach: 'readonly' },
      },
    },

    {
      code: `
    describe('empty', () => {
    });
    vi.fn();
  `,
      errors: [{ messageId: 'missingAfterEach' }],
      output: `
    describe('empty', () => {
    afterEach(() => {
      vi.clearAllMocks();
    });


    });
    vi.fn();
  `,
      languageOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        globals: { vi: 'readonly', describe: 'readonly', afterEach: 'readonly' },
      },
    },

    {
      code: `
    afterEach(() => {
      console.log('no cleanup');
    });
    vi.mock('x');
  `,
      errors: [{ messageId: 'missingCleanup' }],
      output: `
    afterEach(() => {
      console.log('no cleanup');
    
      vi.clearAllMocks();});
    vi.mock('x');
  `,
      languageOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        globals: { vi: 'readonly', afterEach: 'readonly', console: 'readonly' },
      },
    },

    {
      code: `
    describe('x', () => {
      afterEach(() => {});
    });
    jest.spyOn(obj, 'x');
  `,
      errors: [{ messageId: 'missingCleanup' }],
      output: `
    describe('x', () => {
      afterEach(() => {
    vi.clearAllMocks();});
    });
    jest.spyOn(obj, 'x');
  `,
      languageOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        globals: { jest: 'readonly', describe: 'readonly', afterEach: 'readonly', obj: 'readonly' },
      },
    },

    {
      code: `
        afterEach(() => vi.resetAllMocks());
        vi.fn();
      `,
      errors: [{ messageId: 'discouragedMethod' }],
      languageOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        globals: { vi: 'readonly', afterEach: 'readonly' },
      },
    },

    {
      code: `
        afterEach(() => {
          vi.resetAllMocks();
        });
        vi.fn();
      `,
      errors: [{ messageId: 'discouragedMethod' }],
      languageOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        globals: { vi: 'readonly', afterEach: 'readonly' },
      },
    },

    {
      code: `
        afterEach();
        vi.fn();
      `,
      errors: [{ messageId: 'missingCleanup' }],
      output: null,
      languageOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        globals: { vi: 'readonly', afterEach: 'readonly' },
      },
    },

    {
      code: `
        afterEach(cleanup);
        vi.fn();
      `,
      errors: [{ messageId: 'missingCleanup' }],
      output: null,
      languageOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        globals: { vi: 'readonly', afterEach: 'readonly', cleanup: 'readonly' },
      },
    },

    {
      code: `
        afterEach(() => console.log('x'));
        vi.spyOn(obj, 'x');
      `,
      errors: [{ messageId: 'missingCleanup' }],
      output: null,
      languageOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        globals: { vi: 'readonly', afterEach: 'readonly', obj: 'readonly', console: 'readonly' },
      },
    },

    {
      code: `
        vi.fn();
        vi.mock('x');
        vi.spyOn(obj, 'y');
      `,
      errors: [{ messageId: 'missingAfterEach' }],
      output: null,
      languageOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        globals: { vi: 'readonly', obj: 'readonly' },
      },
    },

    {
      code: `
        afterEach(function() {
          console.log('no cleanup');
        });
        vi.fn();
      `,
      errors: [{ messageId: 'missingCleanup' }],
      output: `
        afterEach(function() {
          console.log('no cleanup');
        
          vi.clearAllMocks();});
        vi.fn();
      `,
      languageOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        globals: { vi: 'readonly', afterEach: 'readonly', console: 'readonly' },
      },
    },

    {
      code: `
        afterEach(function() {});
        vi.fn();
      `,
      errors: [{ messageId: 'missingCleanup' }],
      output: `
        afterEach(function() {
    vi.clearAllMocks();});
        vi.fn();
      `,
      languageOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        globals: { vi: 'readonly', afterEach: 'readonly' },
      },
    },

    {
      code: `
        describe('x', () => test('y', () => {}));
        vi.fn();
      `,
      errors: [{ messageId: 'missingAfterEach' }],
      output: null,
      languageOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        globals: { vi: 'readonly', describe: 'readonly', test: 'readonly' },
      },
    },

    {
      code: `
    describe('outer', () => {
      describe('inner', () => {
        vi.fn();
      });
    });
  `,
      errors: [{ messageId: 'missingAfterEach' }],
      output: `
    describe('outer', () => {
      
      afterEach(() => {
        vi.clearAllMocks();
      });

describe('inner', () => {
        vi.fn();
      });
    });
  `,
      languageOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        globals: { vi: 'readonly', describe: 'readonly', afterEach: 'readonly' },
      },
    },

    {
      code: `describe('x', () => {
vi.mock('y');
});`,
      errors: [{ messageId: 'missingAfterEach' }],
      output: `describe('x', () => {

  afterEach(() => {
    vi.clearAllMocks();
  });

vi.mock('y');
});`,
      languageOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        globals: { vi: 'readonly', describe: 'readonly', afterEach: 'readonly' },
      },
    },

    {
      code: `afterEach(() => {
console.log('no cleanup');
});
vi.fn();`,
      errors: [{ messageId: 'missingCleanup' }],
      output: `afterEach(() => {
console.log('no cleanup');

    vi.clearAllMocks();});
vi.fn();`,
      languageOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        globals: { vi: 'readonly', afterEach: 'readonly', console: 'readonly' },
      },
    },
  ],
});