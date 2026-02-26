import { RuleTester } from 'eslint';
import rule from './enforce-screen-route.js';

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
});

ruleTester.run('enforce-screen-route', rule, {
  valid: [
    // Unknown folder has no configured prefix → skipped
    {
      filename: 'src/screens/Unknown/Foo/Foo.tsx',
      code: `
        function Component() {
          return <Route path="/whatever" />;
        }
      `,
    },

    // File sits directly under screens/ (screensIndex + 1 >= parts.length) → skipped
    {
      filename: 'src/screens',
      code: `
        function Component() {
          return <Route path="/whatever" />;
        }
      `,
    },

    // Route with no path prop → skipped
    {
      filename: 'src/screens/AdminPortal/Dashboard/Dashboard.tsx',
      code: `
        function Component() {
          return <Route exact />;
        }
      `,
    },

    // Dynamic (non-literal) path prop → skipped
    {
      filename: 'src/screens/AdminPortal/Dashboard/Dashboard.tsx',
      code: `
        const p = "/admin/dashboard";
        function Component() {
          return <Route path={p} />;
        }
      `,
    },

    // Template literal path prop → skipped
    {
      filename: 'src/screens/AdminPortal/Dashboard/Dashboard.tsx',
      code: `
        function Component() {
          return <Route path={\`/admin/\${id}\`} />;
        }
      `,
    },

    // __tests__ directory → skipped
    {
      filename: 'src/screens/AdminPortal/__tests__/Dashboard.tsx',
      code: `
        function Component() {
          return <Route path="/user/test" />;
        }
      `,
    },

    // .test. file → skipped
    {
      filename: 'src/screens/AdminPortal/Dashboard/Dashboard.test.tsx',
      code: `
        function Component() {
          return <Route path="/user/test" />;
        }
      `,
    },

    // .spec. file → skipped
    {
      filename: 'src/screens/AdminPortal/Test/Test.spec.tsx',
      code: `
        function Component() {
          return <Route path="/user/test" />;
        }
      `,
    },

    // Correct Admin route
    {
      filename: 'src/screens/AdminPortal/Dashboard/Dashboard.tsx',
      code: `
        function Component() {
          return <Route path="/admin/dashboard" />;
        }
      `,
    },

    // Exact prefix match is also valid (no trailing slash required)
    {
      filename: 'src/screens/AdminPortal/Index/Index.tsx',
      code: `
        function Component() {
          return <Route path="/admin" />;
        }
      `,
    },

    // Correct User route
    {
      filename: 'src/screens/UserPortal/Profile/Profile.tsx',
      code: `
        function Component() {
          return <Route path="/user/profile" />;
        }
      `,
    },

    // Correct Auth route
    {
      filename: 'src/screens/Auth/Login/Login.tsx',
      code: `
        function Component() {
          return <Route path="/auth/login" />;
        }
      `,
    },

    // Public folder has no configured prefix → skipped (any path allowed)
    {
      filename: 'src/screens/Public/Home/Home.tsx',
      code: `
        function Component() {
          return <Route path="/home" />;
        }
      `,
    },

    // File outside screens/ → skipped
    {
      filename: 'src/components/Button.tsx',
      code: `
        function Component() {
          return <Route path="/wrong" />;
        }
      `,
    },

    // Non-Route JSX element → skipped
    {
      filename: 'src/screens/AdminPortal/Dashboard/Dashboard.tsx',
      code: `
        function Component() {
          return <Link to="/user/profile" />;
        }
      `,
    },
  ],

  invalid: [
    // Admin using wrong prefix
    {
      filename: 'src/screens/AdminPortal/Dashboard/Dashboard.tsx',
      code: `
        function Component() {
          return <Route path="/user/dashboard" />;
        }
      `,
      errors: [
        {
          message: 'Routes in "AdminPortal" must start with "/admin"',
        },
      ],
    },

    // User using wrong prefix
    {
      filename: 'src/screens/UserPortal/Profile/Profile.tsx',
      code: `
        function Component() {
          return <Route path="/admin/profile" />;
        }
      `,
      errors: [
        {
          message: 'Routes in "UserPortal" must start with "/user"',
        },
      ],
    },

    // Auth using wrong prefix
    {
      filename: 'src/screens/Auth/Login/Login.tsx',
      code: `
        function Component() {
          return <Route path="/login" />;
        }
      `,
      errors: [
        {
          message: 'Routes in "Auth" must start with "/auth"',
        },
      ],
    },

    // Regression: startsWith was too broad — /admin-panel must be rejected for AdminPortal
    {
      filename: 'src/screens/AdminPortal/Dashboard/Dashboard.tsx',
      code: `
        function Component() {
          return <Route path="/admin-panel/dashboard" />;
        }
      `,
      errors: [
        {
          message: 'Routes in "AdminPortal" must start with "/admin"',
        },
      ],
    },

    // Regression: /user-settings must be rejected for UserPortal
    {
      filename: 'src/screens/UserPortal/Settings/Settings.tsx',
      code: `
        function Component() {
          return <Route path="/user-settings/account" />;
        }
      `,
      errors: [
        {
          message: 'Routes in "UserPortal" must start with "/user"',
        },
      ],
    },

    // Regression: /author must be rejected for Auth
    {
      filename: 'src/screens/Auth/Register/Register.tsx',
      code: `
        function Component() {
          return <Route path="/author/register" />;
        }
      `,
      errors: [
        {
          message: 'Routes in "Auth" must start with "/auth"',
        },
      ],
    },
  ],
});