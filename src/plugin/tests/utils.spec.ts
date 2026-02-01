import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  validatePluginManifest,
  generatePluginId,
  sortDrawerItems,
  filterByPermissions,
} from '../utils';
import type { IPluginManifest, IDrawerExtension } from '../types';

describe('Plugin Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('validatePluginManifest', () => {
    it('should validate complete manifest', () => {
      const manifest: IPluginManifest = {
        name: 'Test Plugin',
        pluginId: 'test-plugin',
        version: '1.0.0',
        description: 'Test plugin',
        author: 'Test Author',
        main: 'index.js',
      };

      expect(validatePluginManifest(manifest)).toBe(true);
    });

    it('should validate manifest with extension points', () => {
      const manifestWithExtensions: IPluginManifest = {
        name: 'Test Plugin',
        pluginId: 'test-plugin',
        version: '1.0.0',
        description: 'Test plugin',
        author: 'Test Author',
        main: 'index.js',
        extensionPoints: {
          routes: [
            {
              pluginId: 'test-plugin',
              path: '/test',
              component: 'TestComponent',
            },
          ],
          drawer: [
            {
              pluginId: 'test-plugin',
              label: 'Test Item',
              path: '/test',
              icon: 'test-icon',
            },
          ],
        },
      };

      expect(validatePluginManifest(manifestWithExtensions)).toBe(true);
    });

    it('should reject manifest without required fields', () => {
      const invalidManifest = {
        name: 'Test Plugin',
        // Missing pluginId, version, description, author, main
      } as unknown as IPluginManifest;

      expect(validatePluginManifest(invalidManifest)).toBe(false);
    });

    it('should reject manifest with invalid extension points', () => {
      const invalidManifest: IPluginManifest = {
        name: 'Test Plugin',
        pluginId: 'test-plugin',
        version: '1.0.0',
        description: 'Test plugin',
        author: 'Test Author',
        main: 'index.js',
        extensionPoints: {
          routes: 'not-an-array',
          drawer: 'not-an-array',
        } as unknown as IPluginManifest['extensionPoints'],
      };

      expect(validatePluginManifest(invalidManifest)).toBe(false);
    });

    it('should reject non-object input', () => {
      expect(validatePluginManifest(null as unknown as IPluginManifest)).toBe(
        false,
      );
      expect(
        validatePluginManifest(undefined as unknown as IPluginManifest),
      ).toBe(false);
      expect(
        validatePluginManifest('string' as unknown as IPluginManifest),
      ).toBe(false);
      expect(validatePluginManifest(123 as unknown as IPluginManifest)).toBe(
        false,
      );
    });

    it('should reject route extension with missing fields', () => {
      const manifest: IPluginManifest = {
        name: 'Test Plugin',
        pluginId: 'test-plugin',
        version: '1.0.0',
        description: 'Test plugin',
        author: 'Test Author',
        main: 'index.js',
        extensionPoints: {
          routes: [
            {
              pluginId: 'test-plugin',
              path: '/test',
            } as unknown as NonNullable<
              NonNullable<IPluginManifest['extensionPoints']>['routes']
            >[number],
          ],
        },
      };

      expect(validatePluginManifest(manifest)).toBe(false);
    });

    it('should reject drawer extension with missing fields', () => {
      const manifest: IPluginManifest = {
        name: 'Test Plugin',
        pluginId: 'test-plugin',
        version: '1.0.0',
        description: 'Test plugin',
        author: 'Test Author',
        main: 'index.js',
        extensionPoints: {
          drawer: [
            {
              pluginId: 'test-plugin',
              label: 'Test',
            } as unknown as NonNullable<
              NonNullable<IPluginManifest['extensionPoints']>['drawer']
            >[number],
          ],
        },
      };

      expect(validatePluginManifest(manifest)).toBe(false);
    });

    it('should reject non-array drawer extension', () => {
      const manifest: IPluginManifest = {
        name: 'Test Plugin',
        pluginId: 'test-plugin',
        version: '1.0.0',
        description: 'Test plugin',
        author: 'Test Author',
        main: 'index.js',
        extensionPoints: {
          drawer: {} as unknown as NonNullable<
            NonNullable<IPluginManifest['extensionPoints']>['drawer']
          >,
        },
      };

      expect(validatePluginManifest(manifest)).toBe(false);
    });
  });

  describe('generatePluginId', () => {
    it('should generate plugin ID from manifest', () => {
      const manifest: IPluginManifest = {
        name: 'Test Plugin',
        pluginId: 'test-plugin',
        version: '1.0.0',
        description: 'Test plugin',
        author: 'Test Author',
        main: 'index.js',
      };

      const pluginId = generatePluginId(manifest);
      expect(pluginId).toBe('test_plugin');
    });

    it('should handle manifest with special characters', () => {
      const manifest: IPluginManifest = {
        name: 'Test Plugin!@#$%',
        pluginId: 'test-plugin!@#$%',
        version: '1.0.0',
        description: 'Test plugin',
        author: 'Test Author',
        main: 'index.js',
      };

      const pluginId = generatePluginId(manifest);
      expect(pluginId).toBe('test_plugin!@#$%');
    });

    it('should handle empty manifest', () => {
      const manifest: IPluginManifest = {
        pluginId: '',
        name: '',
        version: '1.0.0',
        description: 'Test plugin',
        author: 'Test Author',
        main: 'index.js',
      };

      const pluginId = generatePluginId(manifest);
      expect(pluginId).toBe('');
    });
  });

  describe('sortDrawerItems', () => {
    it('should sort items by order property', () => {
      const items: IDrawerExtension[] = [
        { label: 'Second', order: 2, path: '/second', icon: 'second-icon' },
        { label: 'First', order: 1, path: '/first', icon: 'first-icon' },
        { label: 'Third', order: 3, path: '/third', icon: 'third-icon' },
      ];

      const sortedItems = sortDrawerItems(items);
      expect(sortedItems[0].label).toBe('First');
      expect(sortedItems[1].label).toBe('Second');
      expect(sortedItems[2].label).toBe('Third');
    });

    it('should handle items without order property', () => {
      const items: IDrawerExtension[] = [
        { label: 'No Order 2', path: '/second', icon: 'no-order-2-icon' },
        { label: 'Ordered', order: 1, path: '/first', icon: 'ordered-icon' },
        { label: 'No Order 1', path: '/third', icon: 'no-order-1-icon' },
      ];

      const sortedItems = sortDrawerItems(items);
      expect(sortedItems[0].label).toBe('Ordered');
      // Items without order should come after ordered items, in any order
      const unorderedLabels = [sortedItems[1].label, sortedItems[2].label];
      expect(unorderedLabels).toEqual(
        expect.arrayContaining(['No Order 1', 'No Order 2']),
      );
    });

    it('should handle empty array', () => {
      const items: IDrawerExtension[] = [];
      const sortedItems = sortDrawerItems(items);
      expect(sortedItems).toEqual([]);
    });

    it('should handle single item', () => {
      const items: IDrawerExtension[] = [
        { label: 'Single Item', path: '/single', icon: 'single-icon' },
      ];

      const sortedItems = sortDrawerItems(items);
      expect(sortedItems).toEqual(items);
    });
  });

  describe('filterByPermissions', () => {
    type TestItem = {
      permissions?: string[];
      isAdmin?: boolean;
    };

    it('should filter items by admin status', () => {
      const items: TestItem[] = [
        { permissions: ['user'], isAdmin: false },
        { permissions: ['admin'], isAdmin: true },
        { permissions: ['user'], isAdmin: false },
      ];

      const userItems = filterByPermissions(items, ['user'], false);
      expect(userItems).toHaveLength(2);
      expect(userItems.every((item) => !item.isAdmin)).toBe(true);

      const adminItems = filterByPermissions(items, ['admin'], true);
      expect(adminItems).toHaveLength(1);
      expect(adminItems[0].isAdmin).toBe(true);
    });

    it('should filter items by permissions', () => {
      const items: TestItem[] = [
        { permissions: ['read'] },
        { permissions: ['write'] },
        { permissions: ['read', 'write'] },
        { permissions: ['delete'] },
      ];

      const readItems = filterByPermissions(items, ['read'], false);
      expect(readItems).toHaveLength(2);
      expect(
        readItems.every((item) => item.permissions?.includes('read')),
      ).toBe(true);

      const writeItems = filterByPermissions(items, ['write'], false);
      expect(writeItems).toHaveLength(2);
      expect(
        writeItems.every((item) => item.permissions?.includes('write')),
      ).toBe(true);

      const deleteItems = filterByPermissions(items, ['delete'], false);
      expect(deleteItems).toHaveLength(1);
      expect(deleteItems[0].permissions).toEqual(['delete']);
    });

    it('should allow items without permissions', () => {
      const items: TestItem[] = [
        { permissions: ['read'] },
        { permissions: undefined },
        { permissions: [] },
        { permissions: ['write'] },
      ];

      const filteredItems = filterByPermissions(items, ['read'], false);
      expect(filteredItems).toHaveLength(3);
      // Should include items with 'read' permission, no permissions, and empty permissions
      expect(
        filteredItems.some((item) => item.permissions?.includes('read')),
      ).toBe(true);
      expect(filteredItems.some((item) => item.permissions === undefined)).toBe(
        true,
      );
      expect(filteredItems.some((item) => item.permissions?.length === 0)).toBe(
        true,
      );
    });

    it('should handle empty permissions array', () => {
      const items: TestItem[] = [
        { permissions: ['read'] },
        { permissions: ['write'] },
      ];

      const filteredItems = filterByPermissions(items, [], false);
      expect(filteredItems).toHaveLength(0);
    });

    it('should handle items with multiple permissions', () => {
      const items: TestItem[] = [
        { permissions: ['read', 'write'] },
        { permissions: ['read'] },
        { permissions: ['write', 'delete'] },
      ];

      const readItems = filterByPermissions(items, ['read'], false);
      expect(readItems).toHaveLength(2);

      const writeItems = filterByPermissions(items, ['write'], false);
      expect(writeItems).toHaveLength(2);

      const deleteItems = filterByPermissions(items, ['delete'], false);
      expect(deleteItems).toHaveLength(1);
    });

    it('should handle admin items correctly', () => {
      const items: TestItem[] = [
        { permissions: ['user'], isAdmin: false },
        { permissions: ['admin'], isAdmin: true },
        { permissions: ['user'], isAdmin: false },
      ];

      // Non-admin user should not see admin items
      const userItems = filterByPermissions(items, ['user'], false);
      expect(userItems.every((item) => !item.isAdmin)).toBe(true);

      // Admin user should see admin items
      const adminItems = filterByPermissions(items, ['admin'], true);
      expect(adminItems.some((item) => item.isAdmin)).toBe(true);
    });

    it('should handle empty items array', () => {
      const items: TestItem[] = [];
      const filteredItems = filterByPermissions(items, ['read'], false);
      expect(filteredItems).toEqual([]);
    });

    it('should exclude items when permissions do not match user permissions', () => {
      const items = [{ permissions: ['read'] }, { permissions: ['write'] }];

      const result = filterByPermissions(items, ['delete'], false);

      expect(result).toEqual([]);
    });
  });
});
