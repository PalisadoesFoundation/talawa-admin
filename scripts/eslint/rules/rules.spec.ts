import { describe, it, expect, vi, afterEach } from 'vitest';
import { ESLint } from 'eslint';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  restrictedImports,
  restrictedImportPaths,
  restrictImportsExcept,
  stripId,
  securityRestrictions,
  searchInputRestrictions,
  modalStateRestrictions,
} from './rules.ts';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

describe('ESLint Syntax Restrictions', () => {
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

  describe('Modal state restrictions', () => {
    it('should error on useState with modalState variable name', async () => {
      const code = `
        import React, { useState } from 'react';

        function TestComponent() {
          const [modalState, setModalState] = useState(false);
          return <div />;
        }
      `;

      const messages = await lintCode(code);
      const modalError = messages.find(
        (msg) =>
          msg.ruleId === 'no-restricted-syntax' &&
          msg.message.includes('useModalState'),
      );

      expect(modalError).toBeDefined();
    });

    it('should error on useState with showModal variable name', async () => {
      const code = `
        import React, { useState } from 'react';

        function TestComponent() {
          const [showModal, setShowModal] = useState(false);
          return <div />;
        }
      `;

      const messages = await lintCode(code);
      const modalError = messages.find(
        (msg) =>
          msg.ruleId === 'no-restricted-syntax' &&
          msg.message.includes('useModalState'),
      );

      expect(modalError).toBeDefined();
    });

    it('should error on useState with show*Modal pattern (e.g., showUploadModal)', async () => {
      const code = `
        import React, { useState } from 'react';

        function TestComponent() {
          const [showUploadModal, setShowUploadModal] = useState(false);
          return <div />;
        }
      `;

      const messages = await lintCode(code);
      const modalError = messages.find(
        (msg) =>
          msg.ruleId === 'no-restricted-syntax' &&
          msg.message.includes('useModalState'),
      );

      expect(modalError).toBeDefined();
    });

    it('should error on useState with *ModalIsOpen pattern', async () => {
      const code = `
        import React, { useState } from 'react';

        function TestComponent() {
          const [editUserTagModalIsOpen, setEditUserTagModalIsOpen] = useState(false);
          return <div />;
        }
      `;

      const messages = await lintCode(code);
      const modalError = messages.find(
        (msg) =>
          msg.ruleId === 'no-restricted-syntax' &&
          msg.message.includes('useModalState'),
      );

      expect(modalError).toBeDefined();
    });

    it('should error on useState with *modalisOpen pattern (lowercase variant)', async () => {
      const code = `
        import React, { useState } from 'react';

        function TestComponent() {
          const [createEventmodalisOpen, setCreateEventmodalisOpen] = useState(false);
          return <div />;
        }
      `;

      const messages = await lintCode(code);
      const modalError = messages.find(
        (msg) =>
          msg.ruleId === 'no-restricted-syntax' &&
          msg.message.includes('useModalState'),
      );

      expect(modalError).toBeDefined();
    });

    it('should allow useState with non-modal-related variable names', async () => {
      const code = `
        import React, { useState } from 'react';

        function TestComponent() {
          const [isOpen, setIsOpen] = useState(false);
          const [modalMode, setModalMode] = useState('create');
          const [count, setCount] = useState(0);
          return <div />;
        }
      `;

      const messages = await lintCode(code);
      const modalError = messages.find(
        (msg) =>
          msg.ruleId === 'no-restricted-syntax' &&
          msg.message.includes('useModalState'),
      );

      expect(modalError).toBeUndefined();
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

      it('should contain both ID-based and non-ID restrictions', () => {
        const idBasedRestrictions = restrictedImports.filter((imp) => imp.id);
        const nonIdRestrictions = restrictedImports.filter((imp) => !imp.id);

        expect(idBasedRestrictions.length).toBeGreaterThan(0);
        expect(nonIdRestrictions.length).toBeGreaterThan(0);
      });

      it('should have proper structure for ID-based restrictions', () => {
        const idBasedRestrictions = restrictedImports.filter((imp) => imp.id);

        idBasedRestrictions.forEach((restriction) => {
          expect(restriction.id).toBeDefined();
          expect(typeof restriction.id).toBe('string');
          expect(restriction.id && restriction.id.length).toBeGreaterThan(0);
          expect(restriction.name).toBeDefined();
          expect(typeof restriction.name).toBe('string');
          expect(restriction.message).toBeDefined();
        });
      });

      it('should have proper structure for non-ID restrictions', () => {
        const nonIdRestrictions = restrictedImports.filter((imp) => !imp.id);

        nonIdRestrictions.forEach((restriction) => {
          expect(restriction.id).toBeUndefined();
          expect(restriction.name).toBeDefined();
          expect(typeof restriction.name).toBe('string');
          expect(restriction.message).toBeDefined();
          expect(typeof restriction.message).toBe('string');
        });
      });

      it('should have consistent naming patterns for similar restrictions', () => {
        const muiDataGrid = restrictedImports.find(
          (imp) => imp.id === 'mui-data-grid',
        );
        const muiDataGridPro = restrictedImports.find(
          (imp) => imp.id === 'mui-data-grid-pro',
        );

        expect(muiDataGrid?.name).toBe('@mui/x-data-grid');
        expect(muiDataGridPro?.name).toBe('@mui/x-data-grid-pro');
        expect(muiDataGrid?.message).toContain('DataGridWrapper');
        expect(muiDataGridPro?.message).toContain('DataGridWrapper');
      });

      it('should handle restrictions with importNames correctly', () => {
        const restrictionsWithImportNames = restrictedImports.filter(
          (imp) => imp.importNames,
        );

        restrictionsWithImportNames.forEach((restriction) => {
          expect(Array.isArray(restriction.importNames)).toBe(true);
          expect(
            restriction.importNames && restriction.importNames.length,
          ).toBeGreaterThan(0);
          restriction.importNames?.forEach((importName) => {
            expect(typeof importName).toBe('string');
            expect(importName.length).toBeGreaterThan(0);
          });
        });
      });

      it('should contain all expected restriction categories', () => {
        const restrictionNames = restrictedImports.map((imp) => imp.name);

        // Should contain Material-UI related restrictions
        expect(restrictionNames.some((name) => name.includes('@mui'))).toBe(
          true,
        );

        // Should contain React Bootstrap related restrictions
        expect(
          restrictionNames.some((name) => name.includes('react-bootstrap')),
        ).toBe(true);

        // Should contain testing related restrictions
        expect(
          restrictionNames.some((name) => name.includes('@testing-library')),
        ).toBe(true);

        // Should contain utility restrictions
        expect(
          restrictionNames.some((name) => name.includes('react-toastify')),
        ).toBe(true);
        expect(
          restrictionNames.some((name) => name.includes('@dicebear')),
        ).toBe(true);
      });

      it('should have no duplicate IDs in restrictions', () => {
        const idBasedRestrictions = restrictedImports.filter((imp) => imp.id);
        const ids = idBasedRestrictions.map((imp) => imp.id || '');
        const uniqueIds = [...new Set(ids)];

        expect(ids.length).toBe(uniqueIds.length);
      });

      it('should have meaningful error messages with actionable guidance', () => {
        restrictedImports.forEach((restriction) => {
          expect(restriction.message).toMatch(
            /(Use|use|Please use|Direct imports|Do not import|Tests)/,
          );
          expect(restriction.message).toMatch(
            /(component|instead|shared|userEvent|reliability)/,
          );
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

    describe('modalStateRestrictions data integrity', () => {
      it('should have modal state related restrictions', () => {
        expect(modalStateRestrictions.length).toBe(5);

        modalStateRestrictions.forEach((restriction) => {
          expect(restriction.selector).toBeDefined();
          expect(restriction.message).toBeDefined();
          expect(restriction.message).toContain('useModalState');
        });
      });

      it('should target useState calls for modal visibility patterns', () => {
        modalStateRestrictions.forEach((restriction) => {
          expect(restriction.selector).toContain('useState');
          expect(restriction.selector).toContain('VariableDeclarator');
        });
      });

      it('should have proper message guiding to useModalState hook', () => {
        modalStateRestrictions.forEach((restriction) => {
          expect(restriction.message).toContain(
            'shared-components/CRUDModalTemplate/hooks/useModalState',
          );
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

        // Create mapping of ID to package name for exact matching
        const idToPackage: Record<string, string> = {
          'mui-data-grid': '@mui/x-data-grid',
          'rb-spinner': 'react-bootstrap',
        };

        // Assert that allowed IDs are filtered out (their package names should not be present)
        allowedIds.forEach((id) => {
          const expectedPackageName = idToPackage[id];
          const isPresent = paths.some(
            (p: { name: string; message?: string; importNames?: string[] }) =>
              p.name === expectedPackageName &&
              (!p.importNames || p.importNames.includes('Spinner')),
          );
          expect(isPresent).toBe(false);
        });

        // Assert that non-ID restrictions are preserved
        const fireEventRestriction = paths.find(
          (p: { name: string; message?: string; importNames?: string[] }) =>
            p.name === '@testing-library/react' &&
            p.importNames?.includes('fireEvent'),
        );
        expect(fireEventRestriction).toBeDefined();

        // Assert that the paths array length is correct (total - filtered IDs)
        const expectedFilteredCount = 2; // mui-data-grid and rb-spinner should be filtered
        expect(paths.length).toBe(
          restrictedImportPaths.length - expectedFilteredCount,
        );
      });

      it('should preserve non-ID restrictions when filtering', () => {
        const allowedIds = ['non-existent-id'];
        const config = restrictImportsExcept(allowedIds);
        const paths = config['no-restricted-imports'][1].paths;

        // Should contain restrictions without IDs (like @testing-library/react fireEvent)
        const fireEventRestriction = paths.find(
          (p: { name: string; message?: string; importNames?: string[] }) =>
            p.name === '@testing-library/react' &&
            p.importNames?.includes('fireEvent'),
        );
        expect(fireEventRestriction).toBeDefined();

        // Should contain direct path restrictions without IDs
        const directChipPath = paths.find(
          (p: { name: string; message?: string; importNames?: string[] }) =>
            p.name === '@mui/material/Chip',
        );
        expect(directChipPath).toBeDefined();
      });

      it('should filter out only specified allowed IDs while preserving others', () => {
        const allowedIds = ['mui-data-grid'];
        const config = restrictImportsExcept(allowedIds);
        const paths = config['no-restricted-imports'][1].paths;

        // Should NOT contain allowed ID's package
        const dataGridRestriction = paths.find(
          (p: { name: string; message?: string; importNames?: string[] }) =>
            p.name === '@mui/x-data-grid',
        );
        expect(dataGridRestriction).toBeUndefined();

        // Should still contain other ID-based restrictions
        const spinnerRestriction = paths.find(
          (p: { name: string; message?: string; importNames?: string[] }) =>
            p.name === 'react-bootstrap' && p.importNames?.includes('Spinner'),
        );
        expect(spinnerRestriction).toBeDefined();

        // Should preserve non-ID restrictions
        const fireEventRestriction = paths.find(
          (p: { name: string; message?: string; importNames?: string[] }) =>
            p.name === '@testing-library/react' &&
            p.importNames?.includes('fireEvent'),
        );
        expect(fireEventRestriction).toBeDefined();

        // Verify correct count: filtered out exactly 1 restriction
        expect(paths.length).toBe(restrictedImportPaths.length - 1);
      });

      it('should return all restrictions when no allowed IDs are specified', () => {
        const config = restrictImportsExcept([]);
        const paths = config['no-restricted-imports'][1].paths;

        // Should contain all restrictions including both ID and non-ID based
        expect(paths.length).toBe(restrictedImportPaths.length);

        // Should contain non-ID restrictions
        const fireEventRestriction = paths.find(
          (p: { name: string; message?: string; importNames?: string[] }) =>
            p.name === '@testing-library/react' &&
            p.importNames?.includes('fireEvent'),
        );
        expect(fireEventRestriction).toBeDefined();

        // Should contain ID-based restrictions
        const dataGridRestriction = paths.find(
          (p: { name: string; message?: string; importNames?: string[] }) =>
            p.name === '@mui/x-data-grid',
        );
        expect(dataGridRestriction).toBeDefined();
      });

      it('should return all restrictions when default empty array is used', () => {
        const config = restrictImportsExcept();
        const paths = config['no-restricted-imports'][1].paths;

        expect(paths.length).toBe(restrictedImportPaths.length);
      });

      it('should handle edge case with empty restrictedImports', () => {
        const config = restrictImportsExcept(['some-id']);
        expect(config['no-restricted-imports']).toBeDefined();
        expect(Array.isArray(config['no-restricted-imports'][1].paths)).toBe(
          true,
        );
      });
    });
  });
});
