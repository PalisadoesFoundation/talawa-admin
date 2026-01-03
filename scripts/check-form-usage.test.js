import fs from 'fs';
import path from 'path';
import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  afterAll,
  vi,
} from 'vitest';

// Mock modules with Vitest
vi.mock('fs');
vi.mock('path');

describe('check-form-usage', () => {
  let consoleErrorSpy;
  let consoleLogSpy;
  let processExitSpy;
  let mockFileSystem;

  beforeEach(() => {
    // Setup spies
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    processExitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {});

    // Reset mock file system
    mockFileSystem = {};

    // Setup fs mocks
    vi.mocked(fs.existsSync).mockImplementation((filePath) => {
      return mockFileSystem[filePath] !== undefined;
    });

    vi.mocked(fs.readdirSync).mockImplementation((dirPath) => {
      const dir = mockFileSystem[dirPath];
      if (!dir || !dir.children) return [];
      return dir.children;
    });

    vi.mocked(fs.statSync).mockImplementation((filePath) => {
      const item = mockFileSystem[filePath];
      return {
        isDirectory: () => item?.type === 'directory',
        isFile: () => item?.type === 'file',
      };
    });

    vi.mocked(fs.readFileSync).mockImplementation((filePath, encoding) => {
      const item = mockFileSystem[filePath];
      return item?.content || '';
    });

    // Setup path mocks to match Node.js behavior
    vi.mocked(path.join).mockImplementation((...args) => {
      if (args.includes('src') && args.includes('screens')) {
        return 'src/screens';
      }
      return args.join('/').replace(/\/+/g, '/');
    });

    vi.mocked(path.dirname).mockImplementation((p) => {
      return 'scripts';
    });

    vi.mocked(path.relative).mockImplementation((from, to) => {
      return to;
    });

    vi.spyOn(process, 'cwd').mockReturnValue('talawa-admin');
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  /**
   * Helper to create mock file system structure
   */
  function createMockFS(structure) {
    mockFileSystem = structure;
  }

  /**
   * Helper to run the check script
   */
  async function runCheckScript() {
    // Clear module cache to re-run the script
    vi.resetModules();

    // Re-import to execute
    const { checkFormUsage } = await import('./check-form-usage.js');
    checkFormUsage(fs, path);
  }

  describe('Test 1: Detect deprecated Form.* patterns', () => {
    it('should detect Form.Group in real file structure', async () => {
      createMockFS({
        scripts: {
          type: 'directory',
          children: ['check-form-usage.js'],
        },
        'src/screens': {
          type: 'directory',
          children: ['AdminPortal'],
        },
        'src/screens/AdminPortal': {
          type: 'directory',
          children: ['CommunityProfile'],
        },
        'src/screens/AdminPortal/CommunityProfile': {
          type: 'directory',
          children: ['CommunityProfile.tsx'],
        },
        'src/screens/AdminPortal/CommunityProfile/CommunityProfile.tsx': {
          type: 'file',
          content: `import { Form } from 'react-bootstrap';

export const CommunityProfile = () => {
  return (
    <>
      <Form.Group>
        <Form.Label className={styles.formLabel}>
          {t('communityName')}
        </Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter name"
        />
      </Form.Group>
    </>
  );
};`,
        },
      });

      await runCheckScript();

      expect(processExitSpy).toHaveBeenCalledWith(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Found deprecated Form usage'),
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Form.Group'),
      );
    });

    it('should detect Form.Control and Form.Label in OrganizationModal', async () => {
      createMockFS({
        'src/screens': {
          type: 'directory',
          children: ['AdminPortal'],
        },
        'src/screens/AdminPortal': {
          type: 'directory',
          children: ['OrgList'],
        },
        'src/screens/AdminPortal/OrgList': {
          type: 'directory',
          children: ['modal'],
        },
        'src/screens/AdminPortal/OrgList/modal': {
          type: 'directory',
          children: ['OrganizationModal.tsx'],
        },
        'src/screens/AdminPortal/OrgList/modal/OrganizationModal.tsx': {
          type: 'file',
          content: `<Form.Label htmlFor="orgname">{tCommon('name')}</Form.Label>
<Form.Control
  id="orgname"
  type="text"
  placeholder="My Organization"
/>`,
        },
      });

      await runCheckScript();

      expect(processExitSpy).toHaveBeenCalledWith(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Form.Label'),
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Form.Control'),
      );
    });

    it('should detect Form.Check in VolunteerGroupModal', async () => {
      createMockFS({
        'src/screens': {
          type: 'directory',
          children: ['EventVolunteers'],
        },
        'src/screens/EventVolunteers': {
          type: 'directory',
          children: ['VolunteerGroups'],
        },
        'src/screens/EventVolunteers/VolunteerGroups': {
          type: 'directory',
          children: ['modal'],
        },
        'src/screens/EventVolunteers/VolunteerGroups/modal': {
          type: 'directory',
          children: ['VolunteerGroupModal.tsx'],
        },
        'src/screens/EventVolunteers/VolunteerGroups/modal/VolunteerGroupModal.tsx':
          {
            type: 'file',
            content: `<Form.Group className="mb-3">
  <Form.Label>{t('applyTo')}</Form.Label>
  <Form.Check
    type="radio"
    label={t('onlyThisInstance')}
    name="applyTo"
  />
</Form.Group>`,
          },
      });

      await runCheckScript();

      expect(processExitSpy).toHaveBeenCalledWith(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Form.Check'),
      );
    });

    it('should detect violations in LoginPage', async () => {
      createMockFS({
        'src/screens': {
          type: 'directory',
          children: ['LoginPage'],
        },
        'src/screens/LoginPage': {
          type: 'directory',
          children: ['LoginPage.tsx'],
        },
        'src/screens/LoginPage/LoginPage.tsx': {
          type: 'file',
          content: `<Form.Label>{tCommon('email')}</Form.Label>
<Form.Control
  type="email"
  id="email"
  placeholder="Enter email"
/>`,
        },
      });

      await runCheckScript();

      expect(processExitSpy).toHaveBeenCalledWith(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('LoginPage/LoginPage.tsx'),
      );
    });

    it('should show correct line numbers for violations', async () => {
      createMockFS({
        'src/screens': {
          type: 'directory',
          children: ['TestFile.tsx'],
        },
        'src/screens/TestFile.tsx': {
          type: 'file',
          content: `line 1
line 2
<Form.Group>
  <Form.Label>Test</Form.Label>
line 5`,
        },
      });

      await runCheckScript();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining(':3:'),
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining(':4:'),
      );
    });

    it('should detect multiple violations in UserPortal/Settings', async () => {
      createMockFS({
        'src/screens': {
          type: 'directory',
          children: ['UserPortal'],
        },
        'src/screens/UserPortal': {
          type: 'directory',
          children: ['Settings'],
        },
        'src/screens/UserPortal/Settings': {
          type: 'directory',
          children: ['UserDetails'],
        },
        'src/screens/UserPortal/Settings/UserDetails': {
          type: 'directory',
          children: ['UserDetails.tsx'],
        },
        'src/screens/UserPortal/Settings/UserDetails/UserDetails.tsx': {
          type: 'file',
          content: `<Form.Label htmlFor="inputName" className={styles.cardLabel}>
  {t('firstName')}
</Form.Label>
<Form.Control
  id="inputName"
  type="text"
/>
<Form.Label htmlFor="inputEmail" className={styles.cardLabel}>
  {tCommon('email')}
</Form.Label>
<Form.Control
  id="inputEmail"
  type="email"
/>`,
        },
      });

      await runCheckScript();

      expect(processExitSpy).toHaveBeenCalledWith(1);
      const allErrors = consoleErrorSpy.mock.calls
        .map((call) => call[0])
        .join('\n');

      expect(allErrors).toContain('Form.Label');
      expect(allErrors).toContain('Form.Control');
      expect(consoleErrorSpy).toHaveBeenCalledTimes(9);
    });
  });

  describe('Test 2: Clean repository (no violations)', () => {
    it('should exit successfully when no deprecated patterns found', async () => {
      createMockFS({
        'src/screens': {
          type: 'directory',
          children: ['CleanComponent'],
        },
        'src/screens/CleanComponent': {
          type: 'directory',
          children: ['CleanComponent.tsx'],
        },
        'src/screens/CleanComponent/CleanComponent.tsx': {
          type: 'file',
          content: `import { FormFieldGroup } from '@/shared-components/FormFieldGroup';

export const CleanComponent = () => {
  return (
    <FormFieldGroup label="Username">
      <input type="text" />
    </FormFieldGroup>
  );
};`,
        },
      });

      await runCheckScript();

      expect(processExitSpy).not.toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith(
        'No deprecated Form usage found',
      );
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('should handle empty screens directory', async () => {
      createMockFS({
        'src/screens': {
          type: 'directory',
          children: [],
        },
      });

      await runCheckScript();

      expect(processExitSpy).not.toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith(
        'No deprecated Form usage found',
      );
    });

    it('should not flag similar but valid patterns', async () => {
      createMockFS({
        'src/screens': {
          type: 'directory',
          children: ['ValidCode.tsx'],
        },
        'src/screens/ValidCode.tsx': {
          type: 'file',
          content: `// Comments about Form.Group are okay
const formGroup = 'some-string';
const myFormData = { Group: 'value', Control: 'value' };
const CustomFormGroup = () => <div>Custom</div>;`,
        },
      });

      await runCheckScript();

      expect(processExitSpy).not.toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith(
        'No deprecated Form usage found',
      );
    });

    it('should handle directories with only subdirectories', async () => {
      createMockFS({
        'src/screens': {
          type: 'directory',
          children: ['AdminPortal', 'UserPortal'],
        },
        'src/screens/AdminPortal': {
          type: 'directory',
          children: [],
        },
        'src/screens/UserPortal': {
          type: 'directory',
          children: [],
        },
      });

      await runCheckScript();

      expect(processExitSpy).not.toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith(
        'No deprecated Form usage found',
      );
    });
  });

  describe('Test 3: Missing src/screens directory', () => {
    it('should handle missing directory gracefully', async () => {
      createMockFS({
        // src/screens does not exist
      });

      await runCheckScript();

      expect(processExitSpy).not.toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith(
        'src/screens directory not found, skipping check',
      );
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('should not throw errors when directory is missing', async () => {
      createMockFS({
        // Empty file system
      });

      await expect(runCheckScript()).resolves.not.toThrow();
    });

    it('should handle fs.existsSync returning false', async () => {
      vi.mocked(fs.existsSync).mockReturnValue(false);

      await runCheckScript();

      expect(consoleLogSpy).toHaveBeenCalledWith(
        'src/screens directory not found, skipping check',
      );
      expect(processExitSpy).not.toHaveBeenCalled();
    });
  });

  describe('Test 4: File type filtering (.ts and .tsx only)', () => {
    it('should only scan .ts and .tsx files', async () => {
      createMockFS({
        'src/screens': {
          type: 'directory',
          children: [
            'test.tsx',
            'test.ts',
            'test.js',
            'test.jsx',
            'README.md',
            'config.json',
          ],
        },
        'src/screens/test.tsx': {
          type: 'file',
          content: '<Form.Group />',
        },
        'src/screens/test.ts': {
          type: 'file',
          content: 'const x = Form.Control;',
        },
        'src/screens/test.js': {
          type: 'file',
          content: '<Form.Label />',
        },
        'src/screens/test.jsx': {
          type: 'file',
          content: '<Form.Check />',
        },
        'src/screens/README.md': {
          type: 'file',
          content: 'Form.Group documentation',
        },
        'src/screens/config.json': {
          type: 'file',
          content: '{"form": "Form.Group"}',
        },
      });

      await runCheckScript();

      expect(processExitSpy).toHaveBeenCalledWith(1);

      const errorCalls = consoleErrorSpy.mock.calls
        .map((call) => call[0])
        .join('\n');

      // Should detect violations in .tsx and .ts files
      expect(errorCalls).toContain('test.tsx');
      expect(errorCalls).toContain('test.ts');

      // Should not detect violations in other file types
      expect(errorCalls).not.toContain('test.js');
      expect(errorCalls).not.toContain('test.jsx');
      expect(errorCalls.includes('README.md:')).toBe(false);
      expect(errorCalls).not.toContain('config.json');
    });

    it('should ignore JavaScript files even with violations', async () => {
      createMockFS({
        'src/screens': {
          type: 'directory',
          children: ['legacy.js', 'old.jsx'],
        },
        'src/screens/legacy.js': {
          type: 'file',
          content: `<Form.Group><Form.Control /></Form.Group>`,
        },
        'src/screens/old.jsx': {
          type: 'file',
          content: '<Form.Label>Test</Form.Label>',
        },
      });

      await runCheckScript();

      expect(processExitSpy).not.toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith(
        'No deprecated Form usage found',
      );
    });

    it('should verify fs.readFileSync is only called for TypeScript files', async () => {
      const readFileSpy = vi.spyOn(fs, 'readFileSync');

      createMockFS({
        'src/screens': {
          type: 'directory',
          children: ['Component.tsx', 'utils.ts', 'helper.js', 'styles.css'],
        },
        'src/screens/Component.tsx': {
          type: 'file',
          content: 'const x = 1;',
        },
        'src/screens/utils.ts': {
          type: 'file',
          content: 'export const util = () => {};',
        },
        'src/screens/helper.js': {
          type: 'file',
          content: 'export const help = () => {};',
        },
        'src/screens/styles.css': {
          type: 'file',
          content: '.class { color: red; }',
        },
      });

      await runCheckScript();

      expect(readFileSpy).toHaveBeenCalledTimes(2);
      expect(readFileSpy).toHaveBeenCalledWith(
        expect.stringContaining('Component.tsx'),
        'utf8',
      );
      expect(readFileSpy).toHaveBeenCalledWith(
        expect.stringContaining('utils.ts'),
        'utf8',
      );
      expect(readFileSpy).not.toHaveBeenCalledWith(
        expect.stringContaining('helper.js'),
        expect.anything(),
      );
      expect(readFileSpy).not.toHaveBeenCalledWith(
        expect.stringContaining('styles.css'),
        expect.anything(),
      );
    });

    it('should handle mixed directory structure with various file types', async () => {
      createMockFS({
        'src/screens': {
          type: 'directory',
          children: ['AdminPortal'],
        },
        'src/screens/AdminPortal': {
          type: 'directory',
          children: [
            'Component.tsx',
            'types.ts',
            'utils.js',
            'test.spec.ts',
            'README.md',
          ],
        },
        'src/screens/AdminPortal/Component.tsx': {
          type: 'file',
          content: '<Form.Group />',
        },
        'src/screens/AdminPortal/types.ts': {
          type: 'file',
          content: 'export type FormType = string;',
        },
        'src/screens/AdminPortal/utils.js': {
          type: 'file',
          content: 'export const getForm = () => Form.Control;',
        },
        'src/screens/AdminPortal/test.spec.ts': {
          type: 'file',
          content: 'describe("test", () => {});',
        },
        'src/screens/AdminPortal/README.md': {
          type: 'file',
          content: '# Admin Portal',
        },
      });

      await runCheckScript();

      expect(processExitSpy).toHaveBeenCalledWith(1);

      const errorCalls = consoleErrorSpy.mock.calls
        .map((call) => call[0])
        .join('\n');

      // Should only flag the .tsx file
      expect(errorCalls).toContain('Component.tsx');
      expect(errorCalls).not.toContain('utils.js');
      expect(errorCalls.includes('README.md:')).toBe(false);
    });
  });

  describe('Additional edge cases', () => {
    it('should handle multiple violations across different files', async () => {
      createMockFS({
        'src/screens': {
          type: 'directory',
          children: ['AdminPortal', 'UserPortal'],
        },
        'src/screens/AdminPortal': {
          type: 'directory',
          children: ['File1.tsx'],
        },
        'src/screens/AdminPortal/File1.tsx': {
          type: 'file',
          content: '<Form.Group><Form.Label>Test</Form.Label></Form.Group>',
        },
        'src/screens/UserPortal': {
          type: 'directory',
          children: ['File2.tsx'],
        },
        'src/screens/UserPortal/File2.tsx': {
          type: 'file',
          content: '<Form.Control type="text" />',
        },
      });

      await runCheckScript();

      expect(processExitSpy).toHaveBeenCalledWith(1);

      const allErrors = consoleErrorSpy.mock.calls
        .map((call) => call[0])
        .join('\n');
      expect(allErrors).toContain('AdminPortal/File1.tsx');
      expect(allErrors).toContain('UserPortal/File2.tsx');
    });

    it('should display migration message when violations found', async () => {
      createMockFS({
        'src/screens': {
          type: 'directory',
          children: ['Test.tsx'],
        },
        'src/screens/Test.tsx': {
          type: 'file',
          content: '<Form.Group />',
        },
      });

      await runCheckScript();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Please migrate to FormFieldGroup components'),
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          'src/shared-components/FormFieldGroup/README.md',
        ),
      );
    });

    it('should handle deeply nested directory structures', async () => {
      createMockFS({
        'src/screens': {
          type: 'directory',
          children: ['EventVolunteers'],
        },
        'src/screens/EventVolunteers': {
          type: 'directory',
          children: ['VolunteerGroups'],
        },
        'src/screens/EventVolunteers/VolunteerGroups': {
          type: 'directory',
          children: ['deleteModal'],
        },
        'src/screens/EventVolunteers/VolunteerGroups/deleteModal': {
          type: 'directory',
          children: ['VolunteerGroupDeleteModal.tsx'],
        },
        'src/screens/EventVolunteers/VolunteerGroups/deleteModal/VolunteerGroupDeleteModal.tsx':
          {
            type: 'file',
            content: '<Form.Check type="radio" />',
          },
      });

      await runCheckScript();

      expect(processExitSpy).toHaveBeenCalledWith(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          'EventVolunteers/VolunteerGroups/deleteModal/VolunteerGroupDeleteModal.tsx',
        ),
      );
    });
  });
});
