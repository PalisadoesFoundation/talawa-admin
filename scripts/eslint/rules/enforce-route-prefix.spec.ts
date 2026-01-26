import { describe, it, expect, vi, afterEach } from 'vitest';
import { ESLint } from 'eslint';
import path from 'path';
import { fileURLToPath } from 'url';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const createLinter = async () => {
  const eslint = new ESLint({
    overrideConfigFile: path.resolve(dirname, '../../../eslint.config.js'),
  });
  return eslint;
};

const lintCode = async (code: string, filename = 'test.tsx') => {
  const eslint = await createLinter();
  const results = await eslint.lintText(code, { filePath: filename });
  return results[0]?.messages || [];
};

afterEach(() => {
  vi.clearAllMocks();
});

describe('Route prefix enforcement', () => {
  it('should error on Route path without prefix', async () => {
    const code = `
      import React from 'react';
      import { Route } from 'react-router-dom';

      export default function App() {
        return <Route path="/orglist" element={<div />} />;
      }
    `;

    const messages = await lintCode(code);
    const routeError = messages.find(
      (msg) => msg.ruleId === 'route-prefix/enforce-route-prefix',
    );

    expect(routeError).toBeDefined();
  });

  it('should allow Route path with admin prefix', async () => {
    const code = `
      import React from 'react';
      import { Route } from 'react-router-dom';

      export default function App() {
        return <Route path="/admin/orglist" element={<div />} />;
      }
    `;

    const messages = await lintCode(code);
    const routeError = messages.find(
      (msg) => msg.ruleId === 'route-prefix/enforce-route-prefix',
    );

    expect(routeError).toBeUndefined();
  });

  it('should error on Link to unprefixed path', async () => {
    const code = `
      import React from 'react';
      import { Link } from 'react-router-dom';

      export default function App() {
        return <Link to="/orglist">Go</Link>;
      }
    `;

    const messages = await lintCode(code);
    const routeError = messages.find(
      (msg) => msg.ruleId === 'route-prefix/enforce-route-prefix',
    );

    expect(routeError).toBeDefined();
  });

  it('should allow Link to public auth route', async () => {
    const code = `
      import React from 'react';
      import { Link } from 'react-router-dom';

      export default function App() {
        return <Link to="/register">Go</Link>;
      }
    `;

    const messages = await lintCode(code);
    const routeError = messages.find(
      (msg) => msg.ruleId === 'route-prefix/enforce-route-prefix',
    );

    expect(routeError).toBeUndefined();
  });

  it('should error on navigate with unprefixed path', async () => {
    const code = `
      export default function App() {
        const navigate = (path: string) => path;
        navigate('/orglist');
        return null;
      }
    `;

    const messages = await lintCode(code);
    const routeError = messages.find(
      (msg) => msg.ruleId === 'route-prefix/enforce-route-prefix',
    );

    expect(routeError).toBeDefined();
  });

  it('should allow navigate template literal with admin prefix', async () => {
    const code = `
      export default function App() {
        const navigate = (path: string) => path;
        const orgId = '123';
        navigate(\`/admin/orgdash/\${orgId}\`);
        return null;
      }
    `;

    const messages = await lintCode(code);
    const routeError = messages.find(
      (msg) => msg.ruleId === 'route-prefix/enforce-route-prefix',
    );

    expect(routeError).toBeUndefined();
  });

  it('should error on Link pathname object without prefix', async () => {
    const code = `
      import React from 'react';
      import { Link } from 'react-router-dom';

      export default function App() {
        return <Link to={{ pathname: '/orgdash' }}>Go</Link>;
      }
    `;

    const messages = await lintCode(code);
    const routeError = messages.find(
      (msg) => msg.ruleId === 'route-prefix/enforce-route-prefix',
    );

    expect(routeError).toBeDefined();
  });
});
