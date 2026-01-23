import { describe, it, expect } from 'vitest';
import { ESLint } from 'eslint';
import path from 'path';
import { fileURLToPath } from 'url';

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

    it('should error on input with search placeholder', async () => {
      const code = `
        import React from 'react';
        
        function TestComponent() {
          return <input placeholder="Search users..." />;
        }
      `;

      const messages = await lintCode(code);
      const searchError = messages.find(
        (msg) =>
          msg.ruleId === 'no-restricted-syntax' &&
          msg.message.includes('search-related placeholder'),
      );

      expect(searchError).toBeDefined();
      expect(searchError?.message).toContain('SearchBar or SearchFilterBar');
    });

    it('should error on input with "Find" in placeholder', async () => {
      const code = `
        import React from 'react';
        
        function TestComponent() {
          return <input placeholder="Find items" />;
        }
      `;

      const messages = await lintCode(code);
      const searchError = messages.find(
        (msg) =>
          msg.ruleId === 'no-restricted-syntax' &&
          msg.message.includes('search-related placeholder'),
      );

      expect(searchError).toBeDefined();
    });

    it('should error on input with "Query" in placeholder', async () => {
      const code = `
        import React from 'react';
        
        function TestComponent() {
          return <input placeholder="Query items" />;
        }
      `;

      const messages = await lintCode(code);
      const searchError = messages.find(
        (msg) =>
          msg.ruleId === 'no-restricted-syntax' &&
          msg.message.includes('search-related placeholder'),
      );

      expect(searchError).toBeDefined();
    });

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

    it('should error on input with search-related aria-label', async () => {
      const code = `
        import React from 'react';
        
        function TestComponent() {
          return <input aria-label="Search for products" />;
        }
      `;

      const messages = await lintCode(code);
      const searchError = messages.find(
        (msg) =>
          msg.ruleId === 'no-restricted-syntax' &&
          msg.message.includes('search-related aria-label'),
      );

      expect(searchError).toBeDefined();
    });

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
    it('should allow search inputs in SearchBar component', async () => {
      const code = `
        import React from 'react';
        
        function SearchBar() {
          return <input type="search" placeholder="Search..." />;
        }
      `;

      const messages = await lintCode(
        code,
        'src/shared-components/DataTable/SearchBar.tsx',
      );
      const searchError = messages.find(
        (msg) =>
          msg.ruleId === 'no-restricted-syntax' &&
          msg.message.includes('search'),
      );

      expect(searchError).toBeUndefined();
    });

    it('should allow search inputs in SearchFilterBar component', async () => {
      const code = `
        import React from 'react';
        
        function SearchFilterBar() {
          return <input type="search" id="searchInput" />;
        }
      `;

      const messages = await lintCode(
        code,
        'src/shared-components/SearchFilterBar/SearchFilterBar.tsx',
      );
      const searchError = messages.find(
        (msg) =>
          msg.ruleId === 'no-restricted-syntax' &&
          msg.message.includes('search'),
      );

      expect(searchError).toBeUndefined();
    });

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
});
