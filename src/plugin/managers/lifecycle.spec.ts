/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { LifecycleManager } from './lifecycle';
import { PluginStatus } from '../types';

// --- Mocks ---

const mockRegisterPluginDynamically = vi.fn();
vi.mock('../registry', () => ({
  registerPluginDynamically: (...args: any[]) => mockRegisterPluginDynamically(...args),
}));

const VALID_PLUGIN_ID = 'TestPlugin_1';
const INVALID_PLUGIN_ID = 'test-plugin'; // Hyphens not allowed
const UNINSTALLED_PLUGIN_ID = 'NewPlugin';

const mockDiscoveryManager = {
  isPluginInstalled: vi.fn(),
  isPluginActivated: vi.fn(),
  loadPluginManifest: vi.fn(),
  loadPluginComponents: vi.fn(),
  syncPluginWithGraphQL: vi.fn(),
  updatePluginStatusInGraphQL: vi.fn(),
  removePluginFromGraphQL: vi.fn(),
};

const mockExtensionRegistry = {
  registerExtensionPoints: vi.fn(),
  unregisterExtensionPoints: vi.fn(),
};

const mockEventManager = {
  emit: vi.fn(),
};

function createManager() {
  return new LifecycleManager(
    mockDiscoveryManager as any,
    mockExtensionRegistry as any,
    mockEventManager as any,
  );
}

describe('LifecycleManager Coverage Suite', () => {
  let originalFetch: any;

  beforeEach(() => {
    vi.clearAllMocks();
    // Capture original fetch to restore it later (CodeRabbit Fix)
    originalFetch = global.fetch;
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
    }) as any;
  });

  afterEach(() => {
    // Restore original implementations (CodeRabbit Fix)
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  // ----------------------------------------------------------------
  // 1. Validation Logic
  // ----------------------------------------------------------------
  describe('Input Validation', () => {
    // Refactored to it.each for better reporting (CodeRabbit Fix)
    it.each([
      ['hyphenated ID', INVALID_PLUGIN_ID],
      ['empty string', ''],
      ['null', null as any],
      ['number', 123 as any],
    ])('rejects operations with invalid input: %s', async (_label, input) => {
      const manager = createManager();
      expect(manager.getLoadedPlugin(input)).toBeUndefined();
      expect(manager.getPluginComponent(input, 'Comp')).toBeUndefined();
      await expect(manager.loadPlugin(input)).resolves.toBe(false);
      await expect(manager.unloadPlugin(input)).resolves.toBe(false);
      await expect(manager.activatePlugin(input)).resolves.toBe(false);
      await expect(manager.deactivatePlugin(input)).resolves.toBe(false);
      await expect(manager.installPlugin(input)).resolves.toBe(false);
      await expect(manager.uninstallPlugin(input)).resolves.toBe(false);
    });

    it('rejects getPluginComponent for valid ID but empty component name', () => {
      const manager = createManager();
      expect(manager.getPluginComponent(VALID_PLUGIN_ID, '')).toBeUndefined();
    });
  });

  // ----------------------------------------------------------------
  // 2. loadPlugin Coverage
  // ----------------------------------------------------------------
  describe('loadPlugin', () => {
    it('skips loading if plugin is not installed', async () => {
      mockDiscoveryManager.isPluginInstalled.mockReturnValue(false);
      const manager = createManager();
      const result = await manager.loadPlugin(UNINSTALLED_PLUGIN_ID);
      expect(result).toBe(false);
    });

    it('handles "Dead Code" race condition (Installed check passes, then fails)', async () => {
        // This covers the unreachable branch in determineInitialPluginStatus (lines 289-290)
        mockDiscoveryManager.isPluginInstalled
            .mockReturnValueOnce(true)  // 1. Passed check in loadPlugin
            .mockReturnValueOnce(false); // 2. Failed check in determineInitialPluginStatus
            
        mockDiscoveryManager.loadPluginManifest.mockResolvedValue({ pluginId: VALID_PLUGIN_ID });
        mockDiscoveryManager.loadPluginComponents.mockResolvedValue({});

        const manager = createManager();
        await manager.loadPlugin(VALID_PLUGIN_ID);

        const plugin = manager.getLoadedPlugin(VALID_PLUGIN_ID);
        expect(plugin?.status).toBe(PluginStatus.INACTIVE);
        // Verify both calls were actually made, ensuring we hit the second branch
        expect(mockDiscoveryManager.isPluginInstalled).toHaveBeenCalledTimes(2);
    });

    it('handles full load success (Installed AND Active)', async () => {
      mockDiscoveryManager.isPluginInstalled.mockReturnValue(true);
      mockDiscoveryManager.isPluginActivated.mockReturnValue(true);
      mockDiscoveryManager.loadPluginManifest.mockResolvedValue({ pluginId: VALID_PLUGIN_ID });
      mockDiscoveryManager.loadPluginComponents.mockResolvedValue({});

      const manager = createManager();
      await manager.loadPlugin(VALID_PLUGIN_ID);

      const plugin = manager.getLoadedPlugin(VALID_PLUGIN_ID);
      expect(plugin?.status).toBe(PluginStatus.ACTIVE);
      expect(mockExtensionRegistry.registerExtensionPoints).toHaveBeenCalled();
    });

    it('catches generic errors (Error Object) and sets ERROR status', async () => {
      mockDiscoveryManager.isPluginInstalled.mockReturnValue(true);
      mockDiscoveryManager.loadPluginManifest.mockRejectedValue(new Error('Manifest missing'));

      const manager = createManager();
      const result = await manager.loadPlugin(VALID_PLUGIN_ID);

      expect(result).toBe(false);
      const plugin = manager.getLoadedPlugin(VALID_PLUGIN_ID);
      expect(plugin?.status).toBe(PluginStatus.ERROR);
      expect(plugin?.errorMessage).toBe('Manifest missing');
      expect(mockEventManager.emit).toHaveBeenCalledWith('plugin:error', expect.anything(), expect.anything());
    });

    it('catches non-Error throws and sets Unknown Error status', async () => {
        mockDiscoveryManager.isPluginInstalled.mockReturnValue(true);
        mockDiscoveryManager.loadPluginManifest.mockRejectedValue('String Error'); 
  
        const manager = createManager();
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        await manager.loadPlugin(VALID_PLUGIN_ID);
  
        const plugin = manager.getLoadedPlugin(VALID_PLUGIN_ID);
        expect(plugin?.status).toBe(PluginStatus.ERROR);
        expect(plugin?.errorMessage).toBe('Unknown error');
        
        consoleSpy.mockRestore();
      });
  });

  // ----------------------------------------------------------------
  // 3. Lifecycle Hooks & Toggles
  // ----------------------------------------------------------------
  describe('Lifecycle Hooks & State Toggles', () => {
    let manager: LifecycleManager;
    let mockHooks: any;

    beforeEach(async () => {
      mockHooks = {
        onActivate: vi.fn(),
        onDeactivate: vi.fn(),
        onInstall: vi.fn(),
        onUninstall: vi.fn(),
      };

      mockDiscoveryManager.isPluginInstalled.mockReturnValue(true);
      mockDiscoveryManager.isPluginActivated.mockReturnValue(false);
      mockDiscoveryManager.loadPluginManifest.mockResolvedValue({ pluginId: VALID_PLUGIN_ID });
      
      mockDiscoveryManager.loadPluginComponents.mockResolvedValue({
        default: mockHooks
      } as any);

      manager = createManager();
      await manager.loadPlugin(VALID_PLUGIN_ID);
    });

    it('executes onActivate hook and registers dynamic plugins', async () => {
      const result = await manager.togglePluginStatus(VALID_PLUGIN_ID, 'active');

      expect(result).toBe(true);
      expect(mockHooks.onActivate).toHaveBeenCalled();
      expect(mockDiscoveryManager.updatePluginStatusInGraphQL).toHaveBeenCalledWith(VALID_PLUGIN_ID, 'active');
      expect(mockRegisterPluginDynamically).toHaveBeenCalledWith(VALID_PLUGIN_ID);
      expect(manager.getLoadedPlugin(VALID_PLUGIN_ID)?.status).toBe(PluginStatus.ACTIVE);
    });

    it('executes onDeactivate hook and unregisters extensions', async () => {
      await manager.activatePlugin(VALID_PLUGIN_ID);
      
      // Targeted mock cleanup (CodeRabbit Fix)
      mockHooks.onDeactivate.mockClear();
      mockExtensionRegistry.unregisterExtensionPoints.mockClear();

      const result = await manager.togglePluginStatus(VALID_PLUGIN_ID, 'inactive');

      expect(result).toBe(true);
      expect(mockHooks.onDeactivate).toHaveBeenCalled();
      expect(mockExtensionRegistry.unregisterExtensionPoints).toHaveBeenCalledWith(VALID_PLUGIN_ID);
      expect(manager.getLoadedPlugin(VALID_PLUGIN_ID)?.status).toBe(PluginStatus.INACTIVE);
    });

    it('handles onActivate failure gracefully', async () => {
      mockHooks.onActivate.mockRejectedValue(new Error('Activate Failed'));
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = await manager.activatePlugin(VALID_PLUGIN_ID);

      expect(result).toBe(true);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error calling onActivate'),
        expect.anything()
      );
      consoleSpy.mockRestore();
    });

    it('handles onDeactivate failure gracefully', async () => {
      await manager.activatePlugin(VALID_PLUGIN_ID);
      mockHooks.onDeactivate.mockRejectedValue(new Error('Deactivate Failed'));
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = await manager.deactivatePlugin(VALID_PLUGIN_ID);

      expect(result).toBe(true);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error calling onDeactivate'),
        expect.anything()
      );
      consoleSpy.mockRestore();
    });

    it('handles Dynamic Import failure gracefully during activation', async () => {
      mockRegisterPluginDynamically.mockRejectedValueOnce(new Error('Import failed'));
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      await manager.activatePlugin(VALID_PLUGIN_ID);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Failed to register plugin'),
        expect.anything()
      );
      consoleSpy.mockRestore();
    });

    it('handles missing manifest during activation (skips extension registration)', async () => {
        const managerNoManifest = createManager();
        mockDiscoveryManager.isPluginInstalled.mockReturnValue(true);
        mockDiscoveryManager.loadPluginManifest.mockResolvedValue(null as any);
        mockDiscoveryManager.loadPluginComponents.mockResolvedValue({});
        
        await managerNoManifest.loadPlugin('NoManifestPlugin');
        await managerNoManifest.activatePlugin('NoManifestPlugin');

        expect(mockExtensionRegistry.registerExtensionPoints).not.toHaveBeenCalled();
    });

    it('returns false when activating a non-existent loaded plugin', async () => {
        const emptyManager = createManager();
        expect(await emptyManager.activatePlugin(VALID_PLUGIN_ID)).toBe(false);
        expect(await emptyManager.deactivatePlugin(VALID_PLUGIN_ID)).toBe(false);
    });
  });

  // ----------------------------------------------------------------
  // 4. Install & Uninstall Coverage
  // ----------------------------------------------------------------
  describe('Install & Uninstall', () => {
    it('installs a fresh plugin successfully', async () => {
        const manager = createManager();
        const mockHooks = { onInstall: vi.fn() };
        
        mockDiscoveryManager.loadPluginManifest.mockResolvedValue({ pluginId: 'NewId' });
        mockDiscoveryManager.loadPluginComponents.mockResolvedValue({ default: mockHooks } as any);

        const result = await manager.installPlugin('NewId');

        expect(result).toBe(true);
        expect(mockHooks.onInstall).toHaveBeenCalled();
        expect(mockEventManager.emit).toHaveBeenCalledWith('plugin:installed', 'NewId');
    });

    it('handles install on an already loaded plugin', async () => {
      mockDiscoveryManager.isPluginInstalled.mockReturnValue(true);
      mockDiscoveryManager.loadPluginManifest.mockResolvedValue({ pluginId: VALID_PLUGIN_ID });
      const mockHooks = { onInstall: vi.fn() };
      mockDiscoveryManager.loadPluginComponents.mockResolvedValue({ default: mockHooks } as any);

      const manager = createManager();
      await manager.loadPlugin(VALID_PLUGIN_ID);
      
      const result = await manager.installPlugin(VALID_PLUGIN_ID);

      expect(result).toBe(true);
      expect(mockHooks.onInstall).toHaveBeenCalled();
      expect(mockDiscoveryManager.loadPluginManifest).toHaveBeenCalledTimes(1); 
    });

    it('handles install failure (verifies INNER catch block lines 208-209)', async () => {
        const manager = createManager();
        mockDiscoveryManager.loadPluginManifest.mockRejectedValue(new Error('Disk err'));
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        const result = await manager.installPlugin('FailId');

        expect(result).toBe(false);
        
        expect(consoleSpy).toHaveBeenCalledWith(
            expect.stringContaining('Failed to load plugin files for'), 
            expect.anything()
        );
        
        expect(consoleSpy).toHaveBeenCalledWith(
            expect.stringContaining('Failed to install plugin'), 
            expect.anything()
        );
        consoleSpy.mockRestore();
    });

    it('handles onInstall hook failure gracefully', async () => {
      const manager = createManager();
      const mockHooks = { 
        onInstall: vi.fn().mockRejectedValue(new Error('Install Hook Crash')) 
      };
      
      mockDiscoveryManager.loadPluginManifest.mockResolvedValue({ pluginId: 'NewId' });
      mockDiscoveryManager.loadPluginComponents.mockResolvedValue({ default: mockHooks } as any);
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      await manager.installPlugin('NewId');

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error calling onInstall'),
        expect.anything()
      );
      consoleSpy.mockRestore();
    });

    it('uninstalls successfully', async () => {
        const manager = createManager();
        const onUninstall = vi.fn();
        
        mockDiscoveryManager.isPluginInstalled.mockReturnValue(true);
        mockDiscoveryManager.loadPluginManifest.mockResolvedValue({ pluginId: VALID_PLUGIN_ID });
        mockDiscoveryManager.loadPluginComponents.mockResolvedValue({ 
            default: { onUninstall } 
        } as any);
        
        await manager.loadPlugin(VALID_PLUGIN_ID);

        const result = await manager.uninstallPlugin(VALID_PLUGIN_ID);

        expect(result).toBe(true);
        expect(onUninstall).toHaveBeenCalled();
    });

    it('handles onUninstall hook failure gracefully', async () => {
        const manager = createManager();
        const onUninstall = vi.fn().mockRejectedValue(new Error('Uninstall Hook Crash'));
        
        mockDiscoveryManager.isPluginInstalled.mockReturnValue(true);
        mockDiscoveryManager.loadPluginManifest.mockResolvedValue({ pluginId: VALID_PLUGIN_ID });
        mockDiscoveryManager.loadPluginComponents.mockResolvedValue({ 
            default: { onUninstall } 
        } as any);
        
        await manager.loadPlugin(VALID_PLUGIN_ID);
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        await manager.uninstallPlugin(VALID_PLUGIN_ID);

        expect(consoleSpy).toHaveBeenCalledWith(
          expect.stringContaining('Error calling onUninstall'),
          expect.anything()
        );
        consoleSpy.mockRestore();
    });

    it('returns false when uninstalling unknown plugin', async () => {
        const manager = createManager();
        expect(await manager.uninstallPlugin('Unknown')).toBe(false);
    });
  });

  // ----------------------------------------------------------------
  // 5. Component & Safety Checks
  // ----------------------------------------------------------------
  describe('Safety Checks & Malformed Exports', () => {
      it('skips hook execution if components are undefined', async () => {
          const manager = createManager();
          mockDiscoveryManager.isPluginInstalled.mockReturnValue(true);
          mockDiscoveryManager.loadPluginManifest.mockResolvedValue({ pluginId: VALID_PLUGIN_ID });
          mockDiscoveryManager.loadPluginComponents.mockResolvedValue(null as any);
          
          await manager.loadPlugin(VALID_PLUGIN_ID);
          await manager.activatePlugin(VALID_PLUGIN_ID); 
          expect(manager.getPluginCount()).toBeGreaterThan(0);
      });

      // Fixed: Removed tautological assertion (CodeRabbit Fix)
      it('skips hook execution if default export is malformed', async () => {
        const manager = createManager();
        mockDiscoveryManager.isPluginInstalled.mockReturnValue(true);
        mockDiscoveryManager.loadPluginManifest.mockResolvedValue({ pluginId: 'Malformed' });
        
        mockDiscoveryManager.loadPluginComponents.mockResolvedValue({ default: "I am a string" } as any);
        const result = await manager.installPlugin('Malformed'); 

        // Asserting the result proves the code ran without error
        expect(result).toBe(true);
      });

      it('returns undefined component if plugin is not ACTIVE', async () => {
          const manager = createManager();
          mockDiscoveryManager.isPluginInstalled.mockReturnValue(true);
          mockDiscoveryManager.isPluginActivated.mockReturnValue(false); 
          mockDiscoveryManager.loadPluginManifest.mockResolvedValue({ pluginId: 'InactiveP' });
          mockDiscoveryManager.loadPluginComponents.mockResolvedValue({});
          
          await manager.loadPlugin('InactiveP');

          expect(manager.getPluginComponent('InactiveP', 'MyComp')).toBeUndefined();
      });

      it('returns undefined component if plugin is NOT LOADED (Valid ID)', async () => {
        const manager = createManager();
        expect(manager.getPluginComponent(VALID_PLUGIN_ID, 'MyComp')).toBeUndefined();
      });

      it('returns list of loaded plugins', async () => {
        const manager = createManager();
        mockDiscoveryManager.isPluginInstalled.mockReturnValue(true);
        mockDiscoveryManager.loadPluginManifest.mockResolvedValue({ pluginId: VALID_PLUGIN_ID });
        mockDiscoveryManager.loadPluginComponents.mockResolvedValue({});
        
        await manager.loadPlugin(VALID_PLUGIN_ID);
        
        const plugins = manager.getLoadedPlugins();
        expect(plugins).toHaveLength(1);
        expect(plugins[0].id).toBe(VALID_PLUGIN_ID);
      });
  });

  // ----------------------------------------------------------------
  // 6. Network Edge Cases
  // ----------------------------------------------------------------
  describe('Network Edge Cases', () => {
      it('logs warning when plugin directory deletion fails (404)', async () => {
          const manager = createManager();
          mockDiscoveryManager.isPluginInstalled.mockReturnValue(true);
          mockDiscoveryManager.loadPluginManifest.mockResolvedValue({ pluginId: VALID_PLUGIN_ID });
          mockDiscoveryManager.loadPluginComponents.mockResolvedValue({});
          await manager.loadPlugin(VALID_PLUGIN_ID);

          (global.fetch as any).mockResolvedValue({ ok: false, status: 404 });
          const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

          await manager.unloadPlugin(VALID_PLUGIN_ID);

          expect(consoleSpy).toHaveBeenCalledWith(
              expect.stringContaining('deletion returned HTTP 404')
          );
          consoleSpy.mockRestore();
      });

      it('logs warning when fetch throws network error', async () => {
        const manager = createManager();
        mockDiscoveryManager.isPluginInstalled.mockReturnValue(true);
        mockDiscoveryManager.loadPluginManifest.mockResolvedValue({ pluginId: VALID_PLUGIN_ID });
        mockDiscoveryManager.loadPluginComponents.mockResolvedValue({});
        await manager.loadPlugin(VALID_PLUGIN_ID);

        (global.fetch as any).mockRejectedValue(new Error('Net Down'));
        const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        await manager.unloadPlugin(VALID_PLUGIN_ID);

        expect(consoleSpy).toHaveBeenCalledWith(
            expect.stringContaining('Could not delete plugin directory'),
            expect.anything()
        );
        consoleSpy.mockRestore();
    });
  });
});
