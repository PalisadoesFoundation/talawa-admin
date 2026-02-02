import { RuleTester, Rule } from 'eslint';
// @ts-expect-error -- Missing declaration file for JS module
import requireAfterEachCleanup from './require-aftereach-cleanup';
import parser from '@typescript-eslint/parser';

const ruleTester = new RuleTester({
  languageOptions: {
    parser,
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
    },
  },
});

const rule = requireAfterEachCleanup as Rule.RuleModule;

ruleTester.run('require-aftereach-cleanup', rule, {
  valid: [
    // No mocks used
    {
      code: `
          import { describe, it, expect } from 'vitest';
          describe('test', () => {
            it('should work', () => {
              expect(true).toBe(true);
            });
          });
        `,
    },
    // vi.fn() with cleanup
    {
      code: `
          import { describe, it, afterEach, vi } from 'vitest';
          describe('test', () => {
            afterEach(() => {
              vi.clearAllMocks();
            });
            it('should work', () => {
              const mock = vi.fn();
            });
          });
        `,
    },
    // vi.mock() with cleanup
    {
      code: `
          import { describe, it, afterEach, vi } from 'vitest';
          vi.mock('./module');
          describe('test', () => {
            afterEach(() => {
              vi.restoreAllMocks();
            });
            it('should work', () => {});
          });
        `,
    },
    // vi.spyOn() with cleanup
    {
      code: `
          import { describe, it, afterEach, vi } from 'vitest';
          describe('test', () => {
            afterEach(() => {
              vi.resetModules();
            });
            it('should work', () => {
              vi.spyOn(obj, 'method');
            });
          });
        `,
    },
    // Cleanup in single expression arrow function
    {
      code: `
          import { describe, it, afterEach, vi } from 'vitest';
          describe('test', () => {
            afterEach(() => vi.clearAllMocks());
            it('should work', () => {
              vi.fn();
            });
          });
        `,
    },
  ],

  invalid: [
    // vi.fn() without afterEach
    {
      code: `
          import { describe, it, vi } from 'vitest';
          describe('test', () => {
            it('should work', () => {
              const mock = vi.fn();
            });
          });
        `,
      errors: [{ messageId: 'missingAfterEach' }],
      output: `
          import { describe, it, vi } from 'vitest';
          describe('test', () => {
            afterEach(() => {
              vi.clearAllMocks();
            });

            it('should work', () => {
              const mock = vi.fn();
            });
          });
        `,
    },
    // vi.mock() without afterEach
    {
      code: `
          import { describe, it, vi } from 'vitest';
          vi.mock('./module');
          describe('test', () => {
            it('should work', () => {});
          });
        `,
      errors: [{ messageId: 'missingAfterEach' }],
      output: `
          import { describe, it, vi } from 'vitest';
          vi.mock('./module');
          describe('test', () => {
            afterEach(() => {
              vi.clearAllMocks();
            });

            it('should work', () => {});
          });
        `,
    },
    // afterEach exists but missing cleanup
    {
      code: `
          import { describe, it, afterEach, vi } from 'vitest';
          describe('test', () => {
            afterEach(() => {
              console.log('cleanup');
            });
            it('should work', () => {
              vi.fn();
            });
          });
        `,
      errors: [{ messageId: 'missingCleanup' }],
      output: `
          import { describe, it, afterEach, vi } from 'vitest';
          describe('test', () => {
            afterEach(() => {
              console.log('cleanup');

              vi.clearAllMocks();
            });
            it('should work', () => {
              vi.fn();
            });
          });
        `,
    },
    // vi.resetAllMocks() usage (discouraged)
    {
      code: `
          import { describe, it, afterEach, vi } from 'vitest';
          describe('test', () => {
            afterEach(() => {
              vi.resetAllMocks();
            });
            it('should work', () => {
              vi.fn();
            });
          });
        `,
      errors: [{ messageId: 'discouragedMethod' }],
    },
    // afterEach with single expression arrow function (no cleanup) - No autofix
    {
      code: `
          import { describe, it, afterEach, vi } from 'vitest';
          describe('test', () => {
            afterEach(() => console.log('cleanup'));
            it('should work', () => {
              vi.fn();
            });
          });
        `,
      errors: [{ messageId: 'missingCleanup' }],
      output: null,
    },
    // Top-level test without describe (no autofix because no describe found)
    {
      code: `
          import { it, vi } from 'vitest';
          it('should work', () => {
            vi.fn();
          });
        `,
      errors: [{ messageId: 'missingAfterEach' }],
      output: null,
    },
    // afterEach with referenced function (no autofix)
    {
      code: `
          import { describe, it, afterEach, vi } from 'vitest';
          const cleanup = () => vi.clearAllMocks();
          describe('test', () => {
            afterEach(cleanup);
            it('should work', () => {
              vi.fn();
            });
          });
        `,
      errors: [{ messageId: 'missingCleanup' }],
      output: null,
    },
    // resetAllMocks arrow function (discouraged)
    {
      code: `
          import { describe, it, afterEach, vi } from 'vitest';
          describe('test', () => {
            afterEach(() => vi.resetAllMocks());
            it('should work', () => {
              vi.fn();
            });
          });
        `,
      errors: [{ messageId: 'discouragedMethod' }],
    },
    // Empty describe block with mocks outside
    {
      code: `
          import { describe, it, vi } from 'vitest';
          vi.fn();
          describe('empty', () => {
          });
        `,
      errors: [{ messageId: 'missingAfterEach' }],
      output: `
          import { describe, it, vi } from 'vitest';
          vi.fn();
          describe('empty', () => {
            afterEach(() => {
              vi.clearAllMocks();
            });

          });
        `,
    },
    // describe with comment before first statement (covers leadingComments branch)
    {
      code: `
          import { describe, it, vi } from 'vitest';
          describe('test', () => {
            // comment
            it('should work', () => {
              vi.fn();
            });
          });
        `,
      errors: [{ messageId: 'missingAfterEach' }],
      output: `
          import { describe, it, vi } from 'vitest';
          describe('test', () => {
            // comment

            afterEach(() => {
              vi.clearAllMocks();
            });


            it('should work', () => {
              vi.fn();
            });
          });
        `,
    },
    // Empty describe with comment (covers !isClosingBrace branch)
    {
      code: `
          import { describe, it, vi } from 'vitest';
          vi.fn();
          describe('empty', () => {
            // comment
          });
        `,
      errors: [{ messageId: 'missingAfterEach' }],
      output: `
          import { describe, it, vi } from 'vitest';
          vi.fn();
          describe('empty', () => {
            afterEach(() => {
              vi.clearAllMocks();
            });

            // comment
          });
        `,
    },
    // No indentation (covers no match branch)
    {
      code: `
import { describe, it, vi } from 'vitest';
describe('test', () => {
it('should work', () => {
vi.fn();
});
});
`,
      errors: [{ messageId: 'missingAfterEach' }],
      output: `
import { describe, it, vi } from 'vitest';
describe('test', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

it('should work', () => {
vi.fn();
});
});
`,
    },
  ],
});
