import { describe, it, expect, beforeEach } from 'vitest';
import { ExtensionRegistryManager } from '../../managers/extension-registry';
import {
  IPluginManifest,
  ExtensionPointType,
  IRouteExtension,
  IDrawerExtension,
  IInjectorExtension,
} from '../../types';

describe('ExtensionRegistryManager', () => {
  let manager: ExtensionRegistryManager;

  const mockManifest: IPluginManifest = {
    name: 'Test Plugin',
    pluginId: 'test-plugin',
    version: '1.0.0',
    description: 'A test plugin',
    author: 'Test Author',
    main: 'index.ts',
    extensionPoints: {
      routes: [
        {
          path: '/test-route',
          component: 'TestComponent',
          exact: true,
          permissions: ['read'],
        },
      ],
      drawer: [
        {
          label: 'Test Item',
          icon: 'test-icon',
          path: '/test',
          permissions: ['read'],
          order: 1,
        },
      ],
      RA1: [
        {
          path: '/admin-global',
          component: 'AdminGlobalComponent',
          exact: true,
          permissions: ['admin'],
        },
      ],
      RA2: [
        {
          path: '/admin-org',
          component: 'AdminOrgComponent',
          exact: false,
          permissions: ['admin', 'org'],
        },
      ],
      RU1: [
        {
          path: '/user-org',
          component: 'UserOrgComponent',
          exact: true,
          permissions: ['user'],
        },
      ],
      RU2: [
        {
          path: '/user-global',
          component: 'UserGlobalComponent',
          exact: false,
          permissions: ['user'],
        },
      ],
      DA1: [
        {
          label: 'Admin Global',
          icon: 'admin-icon',
          path: '/admin-global',
          permissions: ['admin'],
          order: 1,
        },
      ],
      DA2: [
        {
          label: 'Admin Org',
          icon: 'admin-org-icon',
          path: '/admin-org',
          permissions: ['admin', 'org'],
          order: 2,
        },
      ],
      DU1: [
        {
          label: 'User Org',
          icon: 'user-org-icon',
          path: '/user-org',
          permissions: ['user'],
          order: 3,
        },
      ],
      DU2: [
        {
          label: 'User Global',
          icon: 'user-global-icon',
          path: '/user-global',
          permissions: ['user'],
          order: 4,
        },
      ],
      G1: [
        {
          injector: 'TestInjector1',
          description: 'Test injector 1',
          target: 'header',
          order: 1,
        },
      ],
      G2: [
        {
          injector: 'TestInjector2',
          description: 'Test injector 2',
          target: 'footer',
          order: 2,
        },
      ],
      G3: [
        {
          injector: 'TestInjector3',
          description: 'Test injector 3',
          target: 'sidebar',
          order: 3,
        },
      ],
      // Add G4 to cover new registry type
      G4: [
        {
          injector: 'TestInjector4',
          description: 'Test injector 4',
          target: 'content',
          order: 4,
        },
      ],
    },
  };

  beforeEach(() => {
    manager = new ExtensionRegistryManager();
  });

  describe('Constructor and Initialization', () => {
    it('should initialize with empty extension registry', () => {
      const registry = manager.getExtensionRegistry();

      expect(registry.routes).toEqual([]);
      expect(registry.drawer).toEqual([]);
      expect(registry.RA1).toEqual([]);
      expect(registry.RA2).toEqual([]);
      expect(registry.RU1).toEqual([]);
      expect(registry.RU2).toEqual([]);
      expect(registry.DA1).toEqual([]);
      expect(registry.DA2).toEqual([]);
      expect(registry.DU1).toEqual([]);
      expect(registry.DU2).toEqual([]);
      expect(registry.G1).toEqual([]);
      expect(registry.G2).toEqual([]);
      expect(registry.G3).toEqual([]);
    });

    it('should return a copy of the extension registry', () => {
      const registry1 = manager.getExtensionRegistry();
      const registry2 = manager.getExtensionRegistry();

      expect(registry1).not.toBe(registry2);
      expect(registry1).toEqual(registry2);
    });
  });

  describe('Extension Point Registration', () => {
    it('should register all extension points from manifest', () => {
      manager.registerExtensionPoints('test-plugin', mockManifest);
      const registry = manager.getExtensionRegistry();

      // Check routes
      expect(registry.routes).toHaveLength(1);
      expect(registry.routes[0]).toEqual({
        ...mockManifest.extensionPoints?.routes?.[0],
        pluginId: 'test-plugin',
      });

      // Check drawer
      expect(registry.drawer).toHaveLength(1);
      expect(registry.drawer[0]).toEqual({
        ...mockManifest.extensionPoints?.drawer?.[0],
        pluginId: 'test-plugin',
      });

      // Check RA1
      expect(registry.RA1).toHaveLength(1);
      expect(registry.RA1[0]).toEqual({
        ...mockManifest.extensionPoints?.RA1?.[0],
        pluginId: 'test-plugin',
      });

      // Check all other extension points
      expect(registry.RA2).toHaveLength(1);
      expect(registry.RU1).toHaveLength(1);
      expect(registry.RU2).toHaveLength(1);
      expect(registry.DA1).toHaveLength(1);
      expect(registry.DA2).toHaveLength(1);
      expect(registry.DU1).toHaveLength(1);
      expect(registry.DU2).toHaveLength(1);
      expect(registry.G1).toHaveLength(1);
      expect(registry.G2).toHaveLength(1);
      expect(registry.G3).toHaveLength(1);
      expect(registry.G4).toHaveLength(1);
    });

    it('should handle manifest without extension points', () => {
      const emptyManifest: IPluginManifest = {
        name: 'Empty Plugin',
        pluginId: 'empty-plugin',
        version: '1.0.0',
        description: 'Empty plugin',
        author: 'Test Author',
        main: 'index.ts',
      };

      manager.registerExtensionPoints('empty-plugin', emptyManifest);
      const registry = manager.getExtensionRegistry();

      expect(registry.routes).toEqual([]);
      expect(registry.drawer).toEqual([]);
      expect(registry.RA1).toEqual([]);
      expect(registry.RA2).toEqual([]);
      expect(registry.RU1).toEqual([]);
      expect(registry.RU2).toEqual([]);
      expect(registry.DA1).toEqual([]);
      expect(registry.DA2).toEqual([]);
      expect(registry.DU1).toEqual([]);
      expect(registry.DU2).toEqual([]);
      expect(registry.G1).toEqual([]);
      expect(registry.G2).toEqual([]);
      expect(registry.G3).toEqual([]);
    });

    it('should handle partial extension points', () => {
      const partialManifest: IPluginManifest = {
        name: 'Partial Plugin',
        pluginId: 'partial-plugin',
        version: '1.0.0',
        description: 'Partial plugin',
        author: 'Test Author',
        main: 'index.ts',
        extensionPoints: {
          RA1: [
            {
              path: '/partial',
              component: 'PartialComponent',
            },
          ],
          G1: [
            {
              injector: 'PartialInjector',
            },
          ],
        },
      };

      manager.registerExtensionPoints('partial-plugin', partialManifest);
      const registry = manager.getExtensionRegistry();

      expect(registry.RA1).toHaveLength(1);
      expect(registry.G1).toHaveLength(1);
      expect(registry.routes).toEqual([]);
      expect(registry.drawer).toEqual([]);
      expect(registry.RA2).toEqual([]);
      // Ensure G4 remains empty when not provided
      expect(registry.G4).toEqual([]);
    });

    it('should clear existing extensions before registering new ones', () => {
      // Register first time
      manager.registerExtensionPoints('test-plugin', mockManifest);

      // Modify manifest
      const modifiedManifest: IPluginManifest = {
        ...mockManifest,
        extensionPoints: {
          RA1: [
            {
              path: '/new-admin-global',
              component: 'NewAdminGlobalComponent',
            },
          ],
          G4: [
            {
              injector: 'ModifiedG4',
            },
          ],
        },
      };

      // Register again
      manager.registerExtensionPoints('test-plugin', modifiedManifest);
      const registry = manager.getExtensionRegistry();

      // Should only have the new RA1 extension
      expect(registry.RA1).toHaveLength(1);
      expect(registry.RA1[0].path).toBe('/new-admin-global');

      // All other extensions should be cleared
      expect(registry.routes).toEqual([]);
      expect(registry.drawer).toEqual([]);
      expect(registry.RA2).toEqual([]);
      expect(registry.G1).toEqual([]);
      // G4 should now reflect the new registration
      expect(registry.G4).toHaveLength(1);
    });

    it('should handle multiple extensions of the same type', () => {
      const multiManifest: IPluginManifest = {
        name: 'Multi Plugin',
        pluginId: 'multi-plugin',
        version: '1.0.0',
        description: 'Multi plugin',
        author: 'Test Author',
        main: 'index.ts',
        extensionPoints: {
          RA1: [
            {
              path: '/admin1',
              component: 'Admin1Component',
            },
            {
              path: '/admin2',
              component: 'Admin2Component',
            },
          ],
          G1: [
            {
              injector: 'Injector1',
            },
            {
              injector: 'Injector2',
            },
            {
              injector: 'Injector3',
            },
          ],
          G4: [{ injector: 'G4-1' }, { injector: 'G4-2' }],
        },
      };

      manager.registerExtensionPoints('multi-plugin', multiManifest);
      const registry = manager.getExtensionRegistry();

      expect(registry.RA1).toHaveLength(2);
      expect(registry.G1).toHaveLength(3);
      expect(registry.G4).toHaveLength(2);
    });
  });

  describe('Extension Point Unregistration', () => {
    beforeEach(() => {
      manager.registerExtensionPoints('test-plugin', mockManifest);
    });

    it('should unregister all extension points for a plugin', () => {
      manager.unregisterExtensionPoints('test-plugin');
      const registry = manager.getExtensionRegistry();

      expect(registry.routes).toEqual([]);
      expect(registry.drawer).toEqual([]);
      expect(registry.RA1).toEqual([]);
      expect(registry.RA2).toEqual([]);
      expect(registry.RU1).toEqual([]);
      expect(registry.RU2).toEqual([]);
      expect(registry.DA1).toEqual([]);
      expect(registry.DA2).toEqual([]);
      expect(registry.DU1).toEqual([]);
      expect(registry.DU2).toEqual([]);
      expect(registry.G1).toEqual([]);
      expect(registry.G2).toEqual([]);
      expect(registry.G3).toEqual([]);
      expect(registry.G4).toEqual([]);
    });

    it('should only unregister extensions for specified plugin', () => {
      // Register another plugin
      const anotherManifest: IPluginManifest = {
        name: 'Another Plugin',
        pluginId: 'another-plugin',
        version: '1.0.0',
        description: 'Another plugin',
        author: 'Test Author',
        main: 'index.ts',
        extensionPoints: {
          RA1: [
            {
              path: '/another-admin',
              component: 'AnotherAdminComponent',
            },
          ],
        },
      };

      manager.registerExtensionPoints('another-plugin', anotherManifest);

      // Unregister only test-plugin
      manager.unregisterExtensionPoints('test-plugin');
      const registry = manager.getExtensionRegistry();

      // another-plugin extensions should remain
      expect(registry.RA1).toHaveLength(1);
      expect(registry.RA1[0].pluginId).toBe('another-plugin');
    });

    it('should handle unregistering non-existent plugin gracefully', () => {
      const registryBefore = manager.getExtensionRegistry();

      manager.unregisterExtensionPoints('non-existent-plugin');

      const registryAfter = manager.getExtensionRegistry();
      expect(registryAfter).toEqual(registryBefore);
    });
  });

  describe('Getting Extension Points', () => {
    beforeEach(() => {
      manager.registerExtensionPoints('test-plugin', mockManifest);
    });

    it('should return specific extension point arrays', () => {
      expect(manager.getExtensionPoints('RA1')).toHaveLength(1);
      expect(manager.getExtensionPoints('RA2')).toHaveLength(1);
      expect(manager.getExtensionPoints('RU1')).toHaveLength(1);
      expect(manager.getExtensionPoints('RU2')).toHaveLength(1);
      expect(manager.getExtensionPoints('DA1')).toHaveLength(1);
      expect(manager.getExtensionPoints('DA2')).toHaveLength(1);
      expect(manager.getExtensionPoints('DU1')).toHaveLength(1);
      expect(manager.getExtensionPoints('DU2')).toHaveLength(1);
      expect(manager.getExtensionPoints('G1')).toHaveLength(1);
      expect(manager.getExtensionPoints('G2')).toHaveLength(1);
      expect(manager.getExtensionPoints('G3')).toHaveLength(1);
      // Explicitly cover special-case branch for G4
      expect(manager.getExtensionPoints('G4')).toHaveLength(1);
    });

    it('should handle legacy route extension point type', () => {
      const routes = manager.getExtensionPoints(ExtensionPointType.ROUTES);
      expect(routes).toHaveLength(1);
      expect(routes[0].path).toBe('/test-route');
    });

    it('should handle legacy drawer extension point type', () => {
      const drawer = manager.getExtensionPoints(ExtensionPointType.DRAWER);
      expect(drawer).toHaveLength(1);
      expect(drawer[0].label).toBe('Test Item');
    });

    it('should return correct extension point data', () => {
      const ra1Extensions = manager.getExtensionPoints('RA1');
      expect(ra1Extensions[0]).toEqual({
        path: '/admin-global',
        component: 'AdminGlobalComponent',
        exact: true,
        permissions: ['admin'],
        pluginId: 'test-plugin',
      });

      const g1Extensions = manager.getExtensionPoints('G1');
      expect(g1Extensions[0]).toEqual({
        injector: 'TestInjector1',
        description: 'Test injector 1',
        target: 'header',
        order: 1,
        pluginId: 'test-plugin',
      });

      // Verify G4 branch returns correct data
      const g4Extensions = manager.getExtensionPoints('G4');
      expect(g4Extensions[0]).toEqual({
        injector: 'TestInjector4',
        description: 'Test injector 4',
        target: 'content',
        order: 4,
        pluginId: 'test-plugin',
      });
    });

    it('should return empty array for extension points with no registrations', () => {
      manager.unregisterExtensionPoints('test-plugin');

      expect(manager.getExtensionPoints('RA1')).toEqual([]);
      expect(manager.getExtensionPoints('G1')).toEqual([]);
      expect(manager.getExtensionPoints(ExtensionPointType.ROUTES)).toEqual([]);
    });

    it('should handle userPermissions parameter (for future use)', () => {
      // Currently the method accepts but doesn't use these parameters
      // This test ensures the method signature is correct for future enhancements
      const extensions = manager.getExtensionPoints('RA1');
      expect(extensions).toHaveLength(1);
    });
  });

  describe('Extension Registry Isolation', () => {
    it('should maintain separate extension arrays for different plugins', () => {
      const plugin1Manifest: IPluginManifest = {
        name: 'Plugin 1',
        pluginId: 'plugin-1',
        version: '1.0.0',
        description: 'Plugin 1',
        author: 'Test Author',
        main: 'index.ts',
        extensionPoints: {
          RA1: [
            {
              path: '/plugin1-admin',
              component: 'Plugin1AdminComponent',
            },
          ],
        },
      };

      const plugin2Manifest: IPluginManifest = {
        name: 'Plugin 2',
        pluginId: 'plugin-2',
        version: '1.0.0',
        description: 'Plugin 2',
        author: 'Test Author',
        main: 'index.ts',
        extensionPoints: {
          RA1: [
            {
              path: '/plugin2-admin',
              component: 'Plugin2AdminComponent',
            },
          ],
        },
      };

      manager.registerExtensionPoints('plugin-1', plugin1Manifest);
      manager.registerExtensionPoints('plugin-2', plugin2Manifest);

      const extensions = manager.getExtensionPoints('RA1');
      expect(extensions).toHaveLength(2);
      expect(extensions.find((e) => e.pluginId === 'plugin-1')).toBeTruthy();
      expect(extensions.find((e) => e.pluginId === 'plugin-2')).toBeTruthy();
    });

    it('should handle complex scenarios with multiple plugins and extension types', () => {
      // Register multiple plugins with overlapping extension types
      const plugins = [
        {
          id: 'plugin-a',
          manifest: {
            name: 'Plugin A',
            pluginId: 'plugin-a',
            version: '1.0.0',
            description: 'Plugin A',
            author: 'Test Author',
            main: 'index.ts',
            extensionPoints: {
              RA1: [{ path: '/a-admin', component: 'AAdminComponent' }],
              G1: [{ injector: 'AInjector' }],
            },
          },
        },
        {
          id: 'plugin-b',
          manifest: {
            name: 'Plugin B',
            pluginId: 'plugin-b',
            version: '1.0.0',
            description: 'Plugin B',
            author: 'Test Author',
            main: 'index.ts',
            extensionPoints: {
              RA1: [{ path: '/b-admin', component: 'BAdminComponent' }],
              RA2: [{ path: '/b-org', component: 'BOrgComponent' }],
            },
          },
        },
        {
          id: 'plugin-c',
          manifest: {
            name: 'Plugin C',
            pluginId: 'plugin-c',
            version: '1.0.0',
            description: 'Plugin C',
            author: 'Test Author',
            main: 'index.ts',
            extensionPoints: {
              G1: [{ injector: 'CInjector' }],
              G2: [{ injector: 'C2Injector' }],
            },
          },
        },
      ];

      plugins.forEach((plugin) => {
        manager.registerExtensionPoints(plugin.id, plugin.manifest);
      });

      // Verify registrations
      expect(manager.getExtensionPoints('RA1')).toHaveLength(2); // plugin-a, plugin-b
      expect(manager.getExtensionPoints('RA2')).toHaveLength(1); // plugin-b
      expect(manager.getExtensionPoints('G1')).toHaveLength(2); // plugin-a, plugin-c
      expect(manager.getExtensionPoints('G2')).toHaveLength(1); // plugin-c

      // Unregister one plugin
      manager.unregisterExtensionPoints('plugin-b');

      expect(manager.getExtensionPoints('RA1')).toHaveLength(1); // plugin-a only
      expect(manager.getExtensionPoints('RA2')).toHaveLength(0); // none
      expect(manager.getExtensionPoints('G1')).toHaveLength(2); // plugin-a, plugin-c still
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle empty extension point arrays', () => {
      const emptyExtensionsManifest: IPluginManifest = {
        name: 'Empty Extensions Plugin',
        pluginId: 'empty-extensions',
        version: '1.0.0',
        description: 'Empty extensions plugin',
        author: 'Test Author',
        main: 'index.ts',
        extensionPoints: {
          RA1: [],
          G1: [],
        },
      };

      manager.registerExtensionPoints(
        'empty-extensions',
        emptyExtensionsManifest,
      );
      const registry = manager.getExtensionRegistry();

      expect(registry.RA1).toEqual([]);
      expect(registry.G1).toEqual([]);
    });

    it('should handle undefined extension point arrays', () => {
      const undefinedExtensionsManifest: IPluginManifest = {
        name: 'Undefined Extensions Plugin',
        pluginId: 'undefined-extensions',
        version: '1.0.0',
        description: 'Undefined extensions plugin',
        author: 'Test Author',
        main: 'index.ts',
        extensionPoints: {
          RA1: undefined,
          G1: undefined,
        },
      };

      expect(() => {
        manager.registerExtensionPoints(
          'undefined-extensions',
          undefinedExtensionsManifest,
        );
      }).not.toThrow();
    });

    it('should handle malformed extension objects gracefully', () => {
      const malformedManifest: IPluginManifest = {
        name: 'Malformed Plugin',
        pluginId: 'malformed-plugin',
        version: '1.0.0',
        description: 'Malformed plugin',
        author: 'Test Author',
        main: 'index.ts',
        extensionPoints: {
          RA1: [
            {
              path: '/malformed',
              component: 'MalformedComponent',
              // Missing some optional properties
            },
          ],
          G1: [
            {
              injector: 'MalformedInjector',
              // Missing optional properties
            },
          ],
        },
      };

      expect(() => {
        manager.registerExtensionPoints('malformed-plugin', malformedManifest);
      }).not.toThrow();

      const registry = manager.getExtensionRegistry();
      expect(registry.RA1).toHaveLength(1);
      expect(registry.G1).toHaveLength(1);
    });

    it('should handle re-registration of the same plugin', () => {
      // Register plugin
      manager.registerExtensionPoints('test-plugin', mockManifest);
      let registry = manager.getExtensionRegistry();
      expect(registry.RA1).toHaveLength(1);

      // Re-register same plugin with different extensions
      const newManifest: IPluginManifest = {
        ...mockManifest,
        extensionPoints: {
          RA1: [
            {
              path: '/new-path-1',
              component: 'NewComponent1',
            },
            {
              path: '/new-path-2',
              component: 'NewComponent2',
            },
          ],
        },
      };

      manager.registerExtensionPoints('test-plugin', newManifest);
      registry = manager.getExtensionRegistry();

      // Should have the new extensions, not the old ones
      expect(registry.RA1).toHaveLength(2);
      expect(registry.RA1[0].path).toBe('/new-path-1');
      expect(registry.RA1[1].path).toBe('/new-path-2');
    });
  });

  describe('Type Safety and Return Values', () => {
    it('should return correctly typed extension arrays', () => {
      manager.registerExtensionPoints('test-plugin', mockManifest);

      const routes: IRouteExtension[] = manager.getExtensionPoints('RA1');
      const drawer: IDrawerExtension[] = manager.getExtensionPoints('DA1');
      const injectors: IInjectorExtension[] = manager.getExtensionPoints('G1');

      expect(routes[0]).toHaveProperty('path');
      expect(routes[0]).toHaveProperty('component');
      expect(drawer[0]).toHaveProperty('label');
      expect(drawer[0]).toHaveProperty('icon');
      expect(injectors[0]).toHaveProperty('injector');
    });

    it('should handle legacy extension point types correctly', () => {
      manager.registerExtensionPoints('test-plugin', mockManifest);

      const legacyRoutes = manager.getExtensionPoints(
        ExtensionPointType.ROUTES,
      );
      const legacyDrawer = manager.getExtensionPoints(
        ExtensionPointType.DRAWER,
      );

      expect(Array.isArray(legacyRoutes)).toBe(true);
      expect(Array.isArray(legacyDrawer)).toBe(true);
      expect(legacyRoutes).toHaveLength(1);
      expect(legacyDrawer).toHaveLength(1);
    });
  });
});
