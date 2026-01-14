import { describe, it, expect, afterEach } from 'vitest';
import path from 'path';
import {
  runScript,
  makeTempDir,
  writeTempFile,
  cleanupTempDirs,
  fixturesDir,
} from './check-i18n.test-utils.js';

afterEach(() => {
  cleanupTempDirs();
});

describe.sequential('check-i18n script - enhanced features', () => {
  describe('Ignore comments', () => {
    it('skips violations with // i18n-ignore-line comment', () => {
      const tmp = makeTempDir();
      const file = writeTempFile(
        tmp,
        'ignore-line.tsx',
        '<div>Hardcoded</div> // i18n-ignore-line',
      );
      const res = runScript([file]);
      expect(res.status).toBe(0);
      expect(res.stdout).toContain('No non-internationalized');
    });

    it('skips violations with // i18n-ignore-next-line comment', () => {
      const tmp = makeTempDir();
      const file = writeTempFile(
        tmp,
        'ignore-next.tsx',
        '// i18n-ignore-next-line\n<div>Hardcoded</div>',
      );
      const res = runScript([file]);
      expect(res.status).toBe(0);
      expect(res.stdout).toContain('No non-internationalized');
    });

    it('still flags violations without ignore comments', () => {
      const tmp = makeTempDir();
      const file = writeTempFile(
        tmp,
        'no-ignore.tsx',
        '<div>Hardcoded Text</div>',
      );
      const res = runScript([file]);
      expect(res.status).toBe(1);
      expect(res.stdout).toContain('Hardcoded Text');
    });
  });

  describe('Date format detection', () => {
    it('allows date format strings in attributes', () => {
      const tmp = makeTempDir();
      const file = writeTempFile(
        tmp,
        'date-format-attr.tsx',
        '<input placeholder="YYYY-MM-DD" />',
      );
      const res = runScript([file]);
      expect(res.status).toBe(0);
      expect(res.stdout).toContain('No non-internationalized');
    });

    it('allows date format in template literals', () => {
      const tmp = makeTempDir();
      const file = writeTempFile(
        tmp,
        'date-format-template.tsx',
        '<div>{`HH:mm:ss`}</div>',
      );
      const res = runScript([file]);
      expect(res.status).toBe(0);
      expect(res.stdout).toContain('No non-internationalized');
    });

    it('allows complex date formats', () => {
      const tmp = makeTempDir();
      const file = writeTempFile(
        tmp,
        'date-format-complex.tsx',
        '<div>{`YYYY-MM-DDTHH:mm:ss.SSS[Z]`}</div>',
      );
      const res = runScript([file]);
      expect(res.status).toBe(0);
      expect(res.stdout).toContain('No non-internationalized');
    });
  });

  describe('Regex pattern detection', () => {
    it('allows regex patterns in template literals', () => {
      const tmp = makeTempDir();
      const file = writeTempFile(
        tmp,
        'regex-template.tsx',
        '<div>{`[a-z]+`}</div>',
      );
      const res = runScript([file]);
      expect(res.status).toBe(0);
      expect(res.stdout).toContain('No non-internationalized');
    });

    it('allows regex patterns with special characters', () => {
      const tmp = makeTempDir();
      const file = writeTempFile(
        tmp,
        'regex-special.tsx',
        '<div>{`\\d{4}`}</div>',
      );
      const res = runScript([file]);
      expect(res.status).toBe(0);
      expect(res.stdout).toContain('No non-internationalized');
    });
  });

  describe('Context-aware skipping', () => {
    it('skips console.log messages', () => {
      const tmp = makeTempDir();
      const file = writeTempFile(
        tmp,
        'console-log.tsx',
        'console.log("Debug message");',
      );
      const res = runScript([file]);
      expect(res.status).toBe(0);
      expect(res.stdout).toContain('No non-internationalized');
    });

    it('skips console.error messages', () => {
      const tmp = makeTempDir();
      const file = writeTempFile(
        tmp,
        'console-error.tsx',
        'console.error("Error occurred");',
      );
      const res = runScript([file]);
      expect(res.status).toBe(0);
      expect(res.stdout).toContain('No non-internationalized');
    });

    it('skips throw new Error statements', () => {
      const tmp = makeTempDir();
      const file = writeTempFile(
        tmp,
        'throw-error.tsx',
        'throw new Error("Internal error");',
      );
      const res = runScript([file]);
      expect(res.status).toBe(0);
      expect(res.stdout).toContain('No non-internationalized');
    });

    it('skips GraphQL queries', () => {
      const tmp = makeTempDir();
      const file = writeTempFile(
        tmp,
        'graphql.tsx',
        'const query = gql`query { user { name } }`;',
      );
      const res = runScript([file]);
      expect(res.status).toBe(0);
      expect(res.stdout).toContain('No non-internationalized');
    });

    it('skips .format() date formatting', () => {
      const tmp = makeTempDir();
      const file = writeTempFile(
        tmp,
        'format-date.tsx',
        'const formatted = date.format("YYYY-MM-DD");',
      );
      const res = runScript([file]);
      expect(res.status).toBe(0);
      expect(res.stdout).toContain('No non-internationalized');
    });

    it('skips TypeScript type annotations', () => {
      const tmp = makeTempDir();
      const file = writeTempFile(
        tmp,
        'typescript-types.tsx',
        'const fn = (): string => { return "OK"; };',
      );
      const res = runScript([file]);
      expect(res.status).toBe(0);
      expect(res.stdout).toContain('No non-internationalized');
    });

    it('skips Promise type annotations', () => {
      const tmp = makeTempDir();
      const file = writeTempFile(
        tmp,
        'promise-type.tsx',
        'const handler = async (): Promise<void> => {};',
      );
      const res = runScript([file]);
      expect(res.status).toBe(0);
      expect(res.stdout).toContain('No non-internationalized');
    });
  });

  describe('CSS class detection', () => {
    it('skips className with CSS utility classes but flags multi-word JSX text', () => {
      const tmp = makeTempDir();
      const file = writeTempFile(
        tmp,
        'css-utility.tsx',
        '<div className={`btn primary`}>Click Button</div>',
      );
      const res = runScript([file]);
      expect(res.status).toBe(1);
      expect(res.stdout).toContain('Click Button');
      expect(res.stdout).not.toContain('btn');
      expect(res.stdout).not.toContain('primary');
    });

    it('skips className with Bootstrap classes but flags multi-word JSX text', () => {
      const tmp = makeTempDir();
      const file = writeTempFile(
        tmp,
        'bootstrap-classes.tsx',
        '<div className={`m-3 p-2 text-center`}>Page Content</div>',
      );
      const res = runScript([file]);
      expect(res.status).toBe(1);
      expect(res.stdout).toContain('Page Content');
      expect(res.stdout).not.toContain('m-3');
    });

    it('skips className with CSS modules but flags multi-word JSX text', () => {
      const tmp = makeTempDir();
      const file = writeTempFile(
        tmp,
        'css-modules.tsx',
        '<div className={`${styles.container}`}>Page Content</div>',
      );
      const res = runScript([file]);
      expect(res.status).toBe(1);
      expect(res.stdout).toContain('Page Content');
      expect(res.stdout).not.toContain('container');
    });

    it('skips font icon classes', () => {
      const tmp = makeTempDir();
      const file = writeTempFile(
        tmp,
        'font-icons.tsx',
        '<i className="fi fi-rr-home" />',
      );
      const res = runScript([file]);
      expect(res.status).toBe(0);
      expect(res.stdout).toContain('No non-internationalized');
    });

    it('skips conditional CSS classes with ternary but flags multi-word JSX text', () => {
      const tmp = makeTempDir();
      const file = writeTempFile(
        tmp,
        'conditional-css.tsx',
        '<div className={`mx-1 ${true ? "my-4" : "my-0"}`}>Page Content</div>',
      );
      const res = runScript([file]);
      expect(res.status).toBe(1);
      expect(res.stdout).toContain('Page Content');
      expect(res.stdout).not.toContain('my-4');
      expect(res.stdout).not.toContain('my-0');
    });

    it('still flags user-visible text in className context', () => {
      const tmp = makeTempDir();
      const file = writeTempFile(
        tmp,
        'css-with-text.tsx',
        '<div className="some-class">User visible text</div>',
      );
      const res = runScript([file]);
      expect(res.status).toBe(1);
      expect(res.stdout).toContain('User visible text');
    });
  });

  describe('Enhanced URL detection', () => {
    it('allows URL-like routing paths in to attribute but flags multi-word JSX text', () => {
      const tmp = makeTempDir();
      const file = writeTempFile(
        tmp,
        'routing-path.tsx',
        '<Link to="orgstore/id=123">Go to Link</Link>',
      );
      const res = runScript([file]);
      expect(res.status).toBe(1);
      expect(res.stdout).toContain('Go to Link');
      expect(res.stdout).not.toContain('orgstore/id=123');
    });

    it('allows API endpoint patterns in href but flags multi-word JSX text', () => {
      const tmp = makeTempDir();
      const file = writeTempFile(
        tmp,
        'api-endpoint.tsx',
        '<a href="api/v1/users">\n  View Users\n</a>',
      );
      const res = runScript([file]);
      expect(res.status).toBe(1);
      expect(res.stdout).toContain('View Users');
      expect(res.stdout).not.toContain('api/v1/users');
    });

    it('allows URL patterns in template literals but flags multi-word JSX text', () => {
      const tmp = makeTempDir();
      const file = writeTempFile(
        tmp,
        'url-template.tsx',
        '<Link to={`orgstore/id=${id}`}>Go to Store</Link>',
      );
      const res = runScript([file]);
      expect(res.status).toBe(1);
      expect(res.stdout).toContain('Go to Store');
      expect(res.stdout).not.toContain('orgstore/id=');
    });

    it('skips URL patterns in to attribute', () => {
      const tmp = makeTempDir();
      const file = writeTempFile(
        tmp,
        'url-to-attr.tsx',
        '<Link to="orgstore/id=123" />',
      );
      const res = runScript([file]);
      expect(res.status).toBe(0);
      expect(res.stdout).toContain('No non-internationalized');
    });
  });

  describe('Non-user-visible attributes', () => {
    it('skips data-testid attributes but flags multi-word JSX text', () => {
      const tmp = makeTempDir();
      const file = writeTempFile(
        tmp,
        'data-testid.tsx',
        '<div data-testid="my-test-id">Page Content</div>',
      );
      const res = runScript([file]);
      expect(res.status).toBe(1);
      expect(res.stdout).toContain('Page Content');
      expect(res.stdout).not.toContain('my-test-id');
    });

    it('skips aria-hidden attributes but flags multi-word JSX text', () => {
      const tmp = makeTempDir();
      const file = writeTempFile(
        tmp,
        'aria-hidden.tsx',
        '<div aria-hidden="true">Hidden Content</div>',
      );
      const res = runScript([file]);
      expect(res.status).toBe(1);
      expect(res.stdout).toContain('Hidden Content');
      expect(res.stdout).not.toContain('true');
    });

    it('skips role attributes but flags multi-word JSX text', () => {
      const tmp = makeTempDir();
      const file = writeTempFile(
        tmp,
        'role-attr.tsx',
        '<div role="button">Click Button</div>',
      );
      const res = runScript([file]);
      expect(res.status).toBe(1);
      expect(res.stdout).toContain('Click Button');
      expect(res.stdout).not.toContain('button');
    });

    it('skips to attribute in Link components but flags multi-word JSX text', () => {
      const tmp = makeTempDir();
      const file = writeTempFile(
        tmp,
        'link-to.tsx',
        '<Link to="/dashboard">Go to Dashboard</Link>',
      );
      const res = runScript([file]);
      expect(res.status).toBe(1);
      expect(res.stdout).toContain('Go to Dashboard');
      expect(res.stdout).not.toContain('/dashboard');
    });

    it('skips non-user-visible attributes completely when no JSX text', () => {
      const tmp = makeTempDir();
      const file = writeTempFile(
        tmp,
        'attr-only.tsx',
        '<div data-testid="test" role="button" aria-hidden="true" />',
      );
      const res = runScript([file]);
      expect(res.status).toBe(0);
      expect(res.stdout).toContain('No non-internationalized');
    });
  });

  describe('JavaScript operator detection', () => {
    it('skips comparison operators in JSX but flags user text', () => {
      const tmp = makeTempDir();
      const file = writeTempFile(
        tmp,
        'comparison-ops.tsx',
        '<div>{age >= 18 && age <= 40 ? `Adult Person` : `Minor Person`}</div>',
      );
      const res = runScript([file]);
      expect(res.status).toBe(1);
      expect(res.stdout).toContain('Adult Person');
      expect(res.stdout).toContain('Minor Person');
      expect(res.stdout).not.toContain('>= 18 && age');
    });

    it('skips pure comparison operators without user text', () => {
      const tmp = makeTempDir();
      const file = writeTempFile(
        tmp,
        'pure-comparison.tsx',
        '<div>{age >= 18 && age <= 40}</div>',
      );
      const res = runScript([file]);
      expect(res.status).toBe(0);
      expect(res.stdout).toContain('No non-internationalized');
    });

    it('skips array method chains', () => {
      const tmp = makeTempDir();
      const file = writeTempFile(
        tmp,
        'array-methods.tsx',
        '<div>{users.filter(u => u.age >= 18).map(u => u.name)}</div>',
      );
      const res = runScript([file]);
      expect(res.status).toBe(0);
      expect(res.stdout).toContain('No non-internationalized');
    });
  });

  describe('JSON operations', () => {
    it('skips JSON.stringify/parse contexts', () => {
      const tmp = makeTempDir();
      const file = writeTempFile(
        tmp,
        'json-context.tsx',
        [
          'const obj = { a: 1, b: 2 };',
          '<div>{JSON.stringify(obj)}</div>',
          '<div>{JSON.parse("{\\"a\\":1}").a}</div>',
        ].join('\n'),
      );
      const res = runScript([file]);
      expect(res.status).toBe(0);
      expect(res.stdout).toContain('No non-internationalized');
    });
  });

  describe('RegExp constructor and regex literals', () => {
    it('skips template literals used inside RegExp constructor', () => {
      const tmp = makeTempDir();
      const file = writeTempFile(
        tmp,
        'regexp-constructor.tsx',
        'const re = new RegExp(`[A-Z]{2,}`);',
      );
      const res = runScript([file]);
      expect(res.status).toBe(0);
      expect(res.stdout).toContain('No non-internationalized');
    });

    it('skips regex literal contexts', () => {
      const tmp = makeTempDir();
      const file = writeTempFile(
        tmp,
        'regex-literal.tsx',
        'const letters = /[a-z]+/i;',
      );
      const res = runScript([file]);
      expect(res.status).toBe(0);
      expect(res.stdout).toContain('No non-internationalized');
    });
  });

  describe('Intl date tokens', () => {
    it('allows Intl date/time tokens as formats', () => {
      const tmp = makeTempDir();
      const file = writeTempFile(
        tmp,
        'intl-date-tokens.tsx',
        '<div>{`full`}</div>\n<div>{`medium`}</div>\n<div>{`numeric`}</div>\n<div>{`2-digit`}</div>',
      );
      const res = runScript([file]);
      expect(res.status).toBe(0);
      expect(res.stdout).toContain('No non-internationalized');
    });
  });

  describe('Attribute detection', () => {
    it('resolves the last attribute before a template literal (getAttributeName)', () => {
      const tmp = makeTempDir();
      const file = writeTempFile(
        tmp,
        'last-attr-template.tsx',
        // Multiple attributes; template literal belongs to "to"
        '<Link className="btn" to={`orgstore/id=${"123"}`} title="Title">Go</Link>',
      );
      const res = runScript([file]);
      expect(res.status).toBe(1);
      // Should flag "Go" and "Title" (title is user-visible); URL-like template must be skipped
      expect(res.stdout).toContain('Go');
      expect(res.stdout).toContain('Title');
      expect(res.stdout).not.toContain('orgstore/id=');
    });

    it('skips miscellaneous non-user-visible attributes', () => {
      const tmp = makeTempDir();
      const file = writeTempFile(
        tmp,
        'misc-non-visible-attrs.tsx',
        [
          '<input id="user-id" name="username" value="raw" type="text" />',
          '<div ref={el => (el.dataset.foo = "bar")} style={{display:"block"}} />',
          '<button onClick={() => { /* noop */ }}>Click Here</button>',
        ].join('\n'),
      );
      const res = runScript([file]);
      // Only "Click Here" is user-visible text, so status 1
      expect(res.status).toBe(1);
      expect(res.stdout).toContain('Click Here');
      expect(res.stdout).not.toContain('user-id');
      expect(res.stdout).not.toContain('username');
      expect(res.stdout).not.toContain('raw');
      // Check that "text" from type="text" is not flagged (but "text" in "user-visible text" message is OK)
      expect(res.stdout).not.toMatch(/-> "text"/);
    });
  });

  describe('String method skip heuristic', () => {
    it('skips string method calls with regex-like args while inside unclosed paren', () => {
      const tmp = makeTempDir();
      const file = writeTempFile(
        tmp,
        'string-methods-skip.tsx',
        [
          'const s = "Hello";',
          '<div>{s.match(/[A-Z]+/g)}</div>',
          '<div>{s.replace(/[A-Z]/g, "_")}</div>',
          '<div>{s.search(/[A-Z]/)}</div>',
          '<div>{s.split(/[A-Z]/)}</div>',
        ].join('\n'),
      );
      const res = runScript([file]);
      expect(res.status).toBe(0);
      expect(res.stdout).toContain('No non-internationalized');
    });
  });

  describe('Comprehensive false positives fixture', () => {
    it('passes for false-positives.tsx with all edge cases', () => {
      const res = runScript([path.join(fixturesDir, 'false-positives.tsx')]);
      expect(res.status).toBe(0);
      expect(res.stdout).toContain('No non-internationalized');
    });
  });

  describe('Edge cases and boundary conditions', () => {
    it('handles nested template literals correctly', () => {
      const tmp = makeTempDir();
      const file = writeTempFile(
        tmp,
        'nested-templates.tsx',
        '<div>{`outer ${`inner`} text`}</div>',
      );
      const res = runScript([file]);
      expect(res.status).toBe(1);
      // Should flag the entire template literal content, not partial strings
      expect(res.stdout).toContain('outer');
      expect(res.stdout).toContain('inner');
      expect(res.stdout).toContain('text');
      // Should flag the complete template literal, not just "outer ${"
      expect(res.stdout).toContain('outer ${`inner`} text');
      // Should NOT flag incomplete strings like "outer ${" as a separate violation
      expect(res.stdout).not.toMatch(/-> "outer \$\{$/);
    });

    it('handles empty template literals', () => {
      const tmp = makeTempDir();
      const file = writeTempFile(tmp, 'empty-template.tsx', '<div>{``}</div>');
      const res = runScript([file]);
      expect(res.status).toBe(0);
      expect(res.stdout).toContain('No non-internationalized');
    });

    it('handles template literals with only variables', () => {
      const tmp = makeTempDir();
      const file = writeTempFile(
        tmp,
        'var-only-template.tsx',
        '<div>{`${name}`}</div>',
      );
      const res = runScript([file]);
      expect(res.status).toBe(0);
      expect(res.stdout).toContain('No non-internationalized');
    });

    it('handles mixed user-visible and technical content', () => {
      const tmp = makeTempDir();
      const file = writeTempFile(
        tmp,
        'mixed-content.tsx',
        [
          '<div className="btn">Click Button</div>',
          '<input placeholder="Enter name" />',
          '<div data-testid="test">Test content here</div>',
        ].join('\n'),
      );
      const res = runScript([file]);
      expect(res.status).toBe(1);
      expect(res.stdout).toContain('Click Button');
      expect(res.stdout).toContain('Enter name');
      expect(res.stdout).toContain('Test content here');
      expect(res.stdout).not.toContain('btn');
      expect(res.stdout).not.toContain('test');
    });

    it('skips nested template literals in className but flags multi-word JSX text', () => {
      const tmp = makeTempDir();
      const file = writeTempFile(
        tmp,
        'nested-classname.tsx',
        '<div className={`base ${isActive ? "active" : "inactive"}`}>Page Content</div>',
      );
      const res = runScript([file]);
      expect(res.status).toBe(1);
      expect(res.stdout).toContain('Page Content');
      expect(res.stdout).not.toContain('active');
      expect(res.stdout).not.toContain('inactive');
    });
  });
});
