import { describe, it, expect, vi } from 'vitest';
import { ESLint } from 'eslint';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  restrictedImports,
  securityRestrictions,
  searchInputRestrictions,
  restrictedImportPaths,
  restrictImportsExcept,
  stripId,
} from './eslint-rule-data';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

describe('ESLint Search Input Restrictions', () => {
  const createLinter = async () => {
    const eslint = new ESLint({
      overrideConfigFile: path.resolve(dirname, '../../eslint.config.js'),
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

  describe('Direct search input restrictions', () => {
    it('should error on <input type="search">', async () => {
      const code = `
        import React from 'react';
        
        function TestComponent() {
          return <input type="search" />;
        }
      `;

      const messages = await lintCode(code);
      const searchError = messages.find(
        (msg) => msg.ruleId === 'no-restricted-syntax',
      );

      expect(searchError).toBeDefined();
      expect(searchError?.message).toContain(
        'Direct <input type="search"> is not allowed',
      );
    });

    it.each([
      ['search', 'Search users...'],
      ['Find', 'Find items'],
      ['Query', 'Query items'],
    ])(
      'should error on input with "%s" in placeholder',
      async (keyword, placeholder) => {
        const code = `
          import React from 'react';
          
          function TestComponent() {
            return <input placeholder="${placeholder}" />;
          }
        `;

        const messages = await lintCode(code);
        const searchError = messages.find(
          (msg) =>
            msg.ruleId === 'no-restricted-syntax' &&
            msg.message.includes('search-related placeholder'),
        );

        expect(searchError).toBeDefined();
      },
    );

    it('should error on input with search-related name attribute', async () => {
      const code = `
        import React from 'react';
        
        function TestComponent() {
          return <input name="searchQuery" />;
        }
      `;

      const messages = await lintCode(code);
      const searchError = messages.find(
        (msg) =>
          msg.ruleId === 'no-restricted-syntax' &&
          msg.message.includes('search-related name'),
      );

      expect(searchError).toBeDefined();
    });

    it('should error on input with search-related id attribute', async () => {
      const code = `
        import React from 'react';
        
        function TestComponent() {
          return <input id="searchBox" />;
        }
      `;

      const messages = await lintCode(code);
      const searchError = messages.find(
        (msg) =>
          msg.ruleId === 'no-restricted-syntax' &&
          msg.message.includes('search-related id'),
      );

      expect(searchError).toBeDefined();
    });

    it.each(['Search for products', 'Query for products', 'Find for products'])(
      'should error on input with search-related aria-label: "%s"',
      async (ariaLabel) => {
        const code = `
          import React from 'react';
          
          function TestComponent() {
            return <input aria-label="${ariaLabel}" />;
          }
        `;

        const messages = await lintCode(code);
        const searchError = messages.find(
          (msg) =>
            msg.ruleId === 'no-restricted-syntax' &&
            msg.message.includes('search-related aria-label'),
        );

        expect(searchError).toBeDefined();
      },
    );

    it('should allow regular input without search-related attributes', async () => {
      const code = `
        import React from 'react';
        
        function TestComponent() {
          return <input type="text" placeholder="Enter your name" />;
        }
      `;

      const messages = await lintCode(code);
      const searchError = messages.find(
        (msg) =>
          msg.ruleId === 'no-restricted-syntax' &&
          msg.message.includes('search'),
      );

      expect(searchError).toBeUndefined();
    });
  });

  describe('Exemptions for search components', () => {
    it.each([
      ['DataTable SearchBar', 'src/shared-components/DataTable/SearchBar.tsx'],
      ['SearchBar', 'src/shared-components/SearchBar/SearchBar.tsx'],
      [
        'SearchFilterBar',
        'src/shared-components/SearchFilterBar/SearchFilterBar.tsx',
      ],
    ])(
      'should allow search inputs in %s component',
      async (componentName, filePath) => {
        const code = `
          import React from 'react';
          
          function ${componentName.replace(/\s+/g, '')}() {
            return <input type="search" placeholder="Search..." />;
          }
        `;

        const messages = await lintCode(code, filePath);
        const searchError = messages.find(
          (msg) =>
            msg.ruleId === 'no-restricted-syntax' &&
            msg.message.includes('search'),
        );

        expect(searchError).toBeUndefined();
      },
    );

    it('should not allow search inputs in other DataTable components', async () => {
      const code = `
        import React from 'react';
        
        function DataTable() {
          return <input placeholder="Search table..." />;
        }
      `;

      const messages = await lintCode(
        code,
        'src/shared-components/DataTable/DataTable.tsx',
      );
      const searchError = messages.find(
        (msg) =>
          msg.ruleId === 'no-restricted-syntax' &&
          msg.message.includes('search'),
      );

      expect(searchError).not.toBeUndefined();
    });
  });

  describe('ESLint Rule Data Tests', () => {
    describe('restrictedImports data integrity', () => {
      it('should have all required import restrictions', () => {
        expect(restrictedImports.length).toBeGreaterThan(20);

        // Check for key restrictions
        const muiDataGrid = restrictedImports.find(
          (imp) => imp.id === 'mui-data-grid',
        );
        expect(muiDataGrid).toBeDefined();
        expect(muiDataGrid?.name).toBe('@mui/x-data-grid');

        const rbSpinner = restrictedImports.find(
          (imp) => imp.id === 'rb-spinner',
        );
        expect(rbSpinner).toBeDefined();
        expect(rbSpinner?.name).toBe('react-bootstrap');
        expect(rbSpinner?.importNames).toEqual(['Spinner']);
      });

      it('should have proper message formats', () => {
        restrictedImports.forEach((restriction) => {
          expect(restriction.message).toBeDefined();
          expect(typeof restriction.message).toBe('string');
          expect(restriction.message.length).toBeGreaterThan(10);
        });
      });
    });

    describe('securityRestrictions data integrity', () => {
      it('should have security-related syntax restrictions', () => {
        expect(securityRestrictions.length).toBe(3);

        securityRestrictions.forEach((restriction) => {
          expect(restriction.selector).toBeDefined();
          expect(restriction.message).toBeDefined();
          expect(typeof restriction.selector).toBe('string');
          expect(typeof restriction.message).toBe('string');
        });
      });

      it('should target authorization security risks', () => {
        const authRestriction = securityRestrictions.find((restriction) =>
          restriction.message.includes('Security Risk'),
        );
        expect(authRestriction).toBeDefined();
        expect(authRestriction?.selector).toContain('authorization');
      });
    });

    describe('searchInputRestrictions data integrity', () => {
      it('should have search input related restrictions', () => {
        expect(searchInputRestrictions.length).toBe(5);

        searchInputRestrictions.forEach((restriction) => {
          expect(restriction.selector).toBeDefined();
          expect(restriction.message).toBeDefined();
          expect(restriction.message.toLowerCase()).toContain('search');
        });
      });
    });

    describe('helper functions', () => {
      it('should strip ID from rule objects', () => {
        const ruleWithId = {
          id: 'test-id',
          name: 'test-package',
          message: 'Test message',
        };

        const stripped = stripId(ruleWithId);

        expect(stripped).not.toHaveProperty('id');
        expect(stripped.name).toBe('test-package');
        expect(stripped.message).toBe('Test message');
      });

      it('should create restricted import paths without IDs', () => {
        expect(restrictedImportPaths.length).toBe(restrictedImports.length);

        restrictedImportPaths.forEach((path) => {
          expect(path).not.toHaveProperty('id');
          expect(path.name).toBeDefined();
        });
      });

      it('should create rule configuration with allowed IDs filtered', () => {
        const allowedIds = ['mui-data-grid', 'rb-spinner'];
        const config = restrictImportsExcept(allowedIds);

        expect(config).toHaveProperty('no-restricted-imports');
        expect(Array.isArray(config['no-restricted-imports'])).toBe(true);
        expect(config['no-restricted-imports'][0]).toBe('error');
        expect(typeof config['no-restricted-imports'][1]).toBe('object');

        const paths = config['no-restricted-imports'][1].paths;
        expect(paths).toBeDefined();
        expect(Array.isArray(paths)).toBe(true);

        // Assert that none of the allowed IDs are in the filtered paths
        expect(
          paths.every(
            (p: { name: string; message?: string; importNames?: string[] }) =>
              !allowedIds.some((id) => p.name.includes(id)),
          ),
        ).toBe(true);

        // Assert that the paths array length decreased compared to the full list
        expect(paths.length).toBeLessThan(restrictedImportPaths.length);
      });
    });
  });
});
