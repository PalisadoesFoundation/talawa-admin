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
{
  filename: 'src/screens/Unknown/Foo/Foo.tsx',
  code: `
    function Component() {
      return <Route path="/whatever" />;
    }
  `,
},
{
  filename: 'src/screens',
  code: `
    function Component() {
      return <Route path="/whatever" />;
    }
  `,
},
{
  filename: 'src/screens/AdminPortal/Dashboard/Dashboard.tsx',
  code: `
    function Component() {
      return <Route exact />;
    }
  `,
},
{
  filename: 'src/screens/AdminPortal/Dashboard/Dashboard.tsx',
  code: `
    const p = "/admin/dashboard";
    function Component() {
      return <Route path={p} />;
    }
  `,
},
{
  filename: 'src/screens/AdminPortal/__tests__/Dashboard.tsx',
  code: `
    function Component() {
      return <Route path="/user/test" />;
    }
  `,
},
{
  filename: 'src/screens/AdminPortal/Dashboard/Dashboard.test.tsx',
  code: `
    function Component() {
      return <Route path="/user/test" />;
    }
  `,
},
    //  Correct Admin route
    {
      filename:
        'src/screens/AdminPortal/Dashboard/Dashboard.tsx',
      code: `
        function Component() {
          return <Route path="/admin/dashboard" />;
        }
      `,
    },

    //  Correct User route
    {
      filename:
        'src/screens/UserPortal/Profile/Profile.tsx',
      code: `
        function Component() {
          return <Route path="/user/profile" />;
        }
      `,
    },

    //  Correct Auth route
    {
      filename:
        'src/screens/Auth/Login/Login.tsx',
      code: `
        function Component() {
          return <Route path="/auth/login" />;
        }
      `,
    },

    //  Public folder can use anything
    {
      filename:
        'src/screens/Public/Home/Home.tsx',
      code: `
        function Component() {
          return <Route path="/home" />;
        }
      `,
    },

    //  Ignore test files
    {
      filename:
        'src/screens/AdminPortal/Test/Test.spec.tsx',
      code: `
        function Component() {
          return <Route path="/user/test" />;
        }
      `,
    },

    //  Ignore files outside screens
    {
      filename: 'src/components/Button.tsx',
      code: `
        function Component() {
          return <Route path="/wrong" />;
        }
      `,
    },
  ],

  invalid: [
    //  Admin using wrong prefix
    {
      filename:
        'src/screens/AdminPortal/Dashboard/Dashboard.tsx',
      code: `
        function Component() {
          return <Route path="/user/dashboard" />;
        }
      `,
      errors: [
        {
          message:
            'Routes in "AdminPortal" must start with "/admin"',
        },
      ],
    },

    //  User using wrong prefix
    {
      filename:
        'src/screens/UserPortal/Profile/Profile.tsx',
      code: `
        function Component() {
          return <Route path="/admin/profile" />;
        }
      `,
      errors: [
        {
          message:
            'Routes in "UserPortal" must start with "/user"',
        },
      ],
    },

    //  Auth using wrong prefix
    {
      filename:
        'src/screens/Auth/Login/Login.tsx',
      code: `
        function Component() {
          return <Route path="/login" />;
        }
      `,
      errors: [
        {
          message:
            'Routes in "Auth" must start with "/auth"',
        },
      ],
    },
  ],
});
