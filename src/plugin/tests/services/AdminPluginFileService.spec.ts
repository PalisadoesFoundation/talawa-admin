import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import {
  AdminPluginFileService,
  PluginFileValidationResult,
  PluginInstallationResult,
  InstalledPlugin,
} from '../../services/AdminPluginFileService';
import { AdminPluginManifest } from '../../../utils/adminPluginInstaller';
import { internalFileWriter } from '../../services/InternalFileWriter';
import type { IPluginDetails } from '../../types';

// Mock InternalFileWriter
vi.mock('../../services/InternalFileWriter', () => ({
  internalFileWriter: {
    writePluginFiles: vi.fn(),
    listInstalledPlugins: vi.fn(),
    readPluginFiles: vi.fn(),
    removePlugin: vi.fn(),
  },
}));

const validManifest: AdminPluginManifest = {
  name: 'Test Plugin',
  pluginId: 'TestPlugin',
  version: '1.0.0',
  description: 'A test plugin',
  author: 'Test Author',
  main: 'index.js',
};

const validFiles: Record<string, string> = {
  'manifest.json': JSON.stringify(validManifest),
  'index.js': 'console.log("Hello World");',
};

describe('AdminPluginFileService', () => {
  let service: AdminPluginFileService;
  const mockInternalFileWriter = vi.mocked(internalFileWriter);

  beforeEach(() => {
    service = AdminPluginFileService.getInstance();
    vi.clearAllMocks();
  });

  describe('validatePluginFiles', () => {
    it('should return valid for correct files', () => {
      const result = service.validatePluginFiles(validFiles);
      expect(result.valid).toBe(true);
      expect(result.manifest).toBeDefined();
    });

    it('should fail if no files provided', () => {
      const result = service.validatePluginFiles({});
      expect(result.valid).toBe(false);
      expect(result.error).toMatch(/No files provided/);
    });

    it('should fail if manifest.json is missing', () => {
      const files = { ...validFiles };
      delete files['manifest.json'];
      const result = service.validatePluginFiles(files);
      expect(result.valid).toBe(false);
      expect(result.error).toMatch(/manifest.json is required/);
    });

    it('should fail if manifest.json is invalid JSON', () => {
      const files = { ...validFiles, 'manifest.json': '{invalid}' };
      const result = service.validatePluginFiles(files);
      expect(result.valid).toBe(false);
      expect(result.error).toMatch(/Invalid manifest.json format/);
    });

    it('should fail if required manifest fields are missing', () => {
      const badManifest = { ...validManifest };
      delete (badManifest as any).main;
      const files = {
        ...validFiles,
        'manifest.json': JSON.stringify(badManifest),
      };
      const result = service.validatePluginFiles(files);
      expect(result.valid).toBe(false);
      expect(result.error).toMatch(/Missing required field/);
    });

    it('should fail if main file is missing', () => {
      const files = { ...validFiles };
      delete files['index.js'];
      const result = service.validatePluginFiles(files);
      expect(result.valid).toBe(false);
      expect(result.error).toMatch(/Main file not found/);
    });

    it('should fail if file path is invalid', () => {
      const files = { ...validFiles, '../hack.js': 'bad' };
      const result = service.validatePluginFiles(files);
      expect(result.valid).toBe(false);
      expect(result.error).toMatch(/Invalid file path/);
    });

    it('should fail for null files', () => {
      const result = service.validatePluginFiles(null as any);
      expect(result.valid).toBe(false);
      expect(result.error).toMatch(/No files provided/);
    });

    it('should fail for non-object files', () => {
      const result = service.validatePluginFiles('not an object' as any);
      expect(result.valid).toBe(false);
      expect(result.error).toMatch(/No files provided/);
    });
  });

  describe('validatePluginId', () => {
    it('should validate correct pluginId', () => {
      const result = service.validatePluginId('ValidPlugin_123');
      expect(result.valid).toBe(true);
    });

    it('should fail for empty pluginId', () => {
      const result = service.validatePluginId('');
      expect(result.valid).toBe(false);
    });

    it('should fail for null pluginId', () => {
      const result = service.validatePluginId(null as any);
      expect(result.valid).toBe(false);
    });

    it('should fail for pluginId with hyphens', () => {
      const result = service.validatePluginId('bad-plugin');
      expect(result.valid).toBe(false);
      expect(result.error).toMatch(/no hyphens/);
    });

    it('should fail for pluginId too short', () => {
      const result = service.validatePluginId('ab');
      expect(result.valid).toBe(false);
    });

    it('should fail for pluginId too long', () => {
      const result = service.validatePluginId('a'.repeat(51));
      expect(result.valid).toBe(false);
    });

    it('should fail for pluginId starting with number', () => {
      const result = service.validatePluginId('1InvalidPlugin');
      expect(result.valid).toBe(false);
    });
  });

  describe('installPlugin', () => {
    it('should fail if plugin files are invalid', async () => {
      const result = await service.installPlugin('TestPlugin', {});
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should fail if pluginId does not match manifest', async () => {
      const files = {
        ...validFiles,
        'manifest.json': JSON.stringify({
          ...validManifest,
          pluginId: 'OtherPlugin',
        }),
      };
      const result = await service.installPlugin('TestPlugin', files);
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/does not match/);
    });

    it('should fail if pluginId validation fails', async () => {
      // Use a valid manifest with a valid pluginId, but pass an invalid pluginId parameter
      // that will pass the manifest check but fail the validation
      const validManifestForTest = { ...validManifest, pluginId: 'ab' };
      const files = {
        ...validFiles,
        'manifest.json': JSON.stringify(validManifestForTest),
      };
      const result = await service.installPlugin('ab', files);
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/Plugin ID must be between/);
    });

    it('should succeed with valid files and pluginId', async () => {
      mockInternalFileWriter.writePluginFiles.mockResolvedValue({
        success: true,
        path: '/test/path',
        filesWritten: 2,
        writtenFiles: ['manifest.json', 'index.js'],
      });

      const result = await service.installPlugin('TestPlugin', validFiles);
      expect(result.success).toBe(true);
      expect(result.pluginId).toBe('TestPlugin');
      expect(result.path).toBe('/test/path');
      expect(result.filesWritten).toBe(2);
      expect(result.writtenFiles).toEqual(['manifest.json', 'index.js']);
    });

    it('should handle file writing errors', async () => {
      mockInternalFileWriter.writePluginFiles.mockResolvedValue({
        success: false,
        path: '',
        filesWritten: 0,
        writtenFiles: [],
        error: 'Write failed',
      });

      const result = await service.installPlugin('TestPlugin', validFiles);
      expect(result.success).toBe(false);
      expect(result.error).toBe('Write failed');
    });

    it('should handle exceptions during installation', async () => {
      mockInternalFileWriter.writePluginFiles.mockRejectedValue(
        new Error('Network error'),
      );

      const result = await service.installPlugin('TestPlugin', validFiles);
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/Network error/);
    });
  });

  describe('getInstalledPlugins', () => {
    it('should return plugins when successful', async () => {
      const mockPlugins = [
        {
          pluginId: 'TestPlugin',
          manifest: validManifest,
          installedAt: '2023-01-01T00:00:00Z',
        },
      ];

      mockInternalFileWriter.listInstalledPlugins.mockResolvedValue({
        success: true,
        plugins: mockPlugins,
      });

      const result = await service.getInstalledPlugins();
      expect(result).toHaveLength(1);
      expect(result[0].pluginId).toBe('TestPlugin');
      expect(result[0].manifest).toEqual(validManifest);
    });

    it('should return empty array when listInstalledPlugins fails', async () => {
      mockInternalFileWriter.listInstalledPlugins.mockResolvedValue({
        success: false,
        error: 'Failed to list plugins',
      });

      const result = await service.getInstalledPlugins();
      expect(result).toEqual([]);
    });

    it('should return empty array when listInstalledPlugins throws', async () => {
      mockInternalFileWriter.listInstalledPlugins.mockRejectedValue(
        new Error('Network error'),
      );

      const result = await service.getInstalledPlugins();
      expect(result).toEqual([]);
    });

    it('should handle null plugins array', async () => {
      mockInternalFileWriter.listInstalledPlugins.mockResolvedValue({
        success: true,
        plugins: undefined,
      });

      const result = await service.getInstalledPlugins();
      expect(result).toEqual([]);
    });
  });

  describe('getPlugin', () => {
    it('should return plugin when found', async () => {
      mockInternalFileWriter.readPluginFiles.mockResolvedValue({
        success: true,
        manifest: validManifest,
        files: validFiles,
      });

      const result = await service.getPlugin('TestPlugin');
      expect(result).not.toBeNull();
      expect(result?.pluginId).toBe('TestPlugin');
      expect(result?.manifest).toEqual(validManifest);
    });

    it('should return null when plugin not found', async () => {
      mockInternalFileWriter.readPluginFiles.mockResolvedValue({
        success: false,
        error: 'Plugin not found',
      });

      const result = await service.getPlugin('NonExistentPlugin');
      expect(result).toBeNull();
    });

    it('should return null when manifest is missing', async () => {
      mockInternalFileWriter.readPluginFiles.mockResolvedValue({
        success: true,
        manifest: undefined,
        files: {},
      });

      const result = await service.getPlugin('TestPlugin');
      expect(result).toBeNull();
    });

    it('should return null when readPluginFiles throws', async () => {
      mockInternalFileWriter.readPluginFiles.mockRejectedValue(
        new Error('Network error'),
      );

      const result = await service.getPlugin('TestPlugin');
      expect(result).toBeNull();
    });
  });

  describe('removePlugin', () => {
    it('should return true when removal succeeds', async () => {
      mockInternalFileWriter.removePlugin.mockResolvedValue({
        success: true,
      });

      const result = await service.removePlugin('TestPlugin');
      expect(result).toBe(true);
    });

    it('should return false when removal fails', async () => {
      mockInternalFileWriter.removePlugin.mockResolvedValue({
        success: false,
        error: 'Plugin not found',
      });

      const result = await service.removePlugin('NonExistentPlugin');
      expect(result).toBe(false);
    });

    it('should return false when removePlugin throws', async () => {
      mockInternalFileWriter.removePlugin.mockRejectedValue(
        new Error('Network error'),
      );

      const result = await service.removePlugin('TestPlugin');
      expect(result).toBe(false);
    });
  });

  describe('healthCheck', () => {
    it('should return healthy status when successful', async () => {
      mockInternalFileWriter.listInstalledPlugins.mockResolvedValue({
        success: true,
        plugins: [
          {
            pluginId: 'TestPlugin',
            manifest: validManifest,
            installedAt: '2023-01-01T00:00:00Z',
          },
        ],
      });

      const result = await service.healthCheck();
      expect(result.status).toBe('healthy');
      expect(result.message).toMatch(/1 plugins installed/);
    });

    it('should return healthy status even when getInstalledPlugins fails', async () => {
      mockInternalFileWriter.listInstalledPlugins.mockResolvedValue({
        success: false,
        error: 'Failed to list plugins',
      });

      const result = await service.healthCheck();
      expect(result.status).toBe('healthy');
      expect(result.message).toMatch(/0 plugins installed/);
    });

    it('should return healthy status even when getInstalledPlugins throws', async () => {
      mockInternalFileWriter.listInstalledPlugins.mockRejectedValue(
        new Error('Network error'),
      );

      const result = await service.healthCheck();
      expect(result.status).toBe('healthy');
      expect(result.message).toMatch(/0 plugins installed/);
    });
  });

  describe('getPluginDetails (static)', () => {
    it('should return plugin details when successful', async () => {
      const mockFiles = {
        'manifest.json': JSON.stringify(validManifest),
        'info.json': JSON.stringify({
          homepage: 'https://example.com',
          license: 'MIT',
          tags: ['test'],
          screenshots: ['assets/screenshot.png'],
          features: ['Feature 1', 'Feature 2'],
          changelog: [{ version: '1.0.0', changes: ['Initial release'] }],
        }),
        'README.md': '# Test Plugin\n\nFeatures:\n- Feature 1\n- Feature 2',
      };

      mockInternalFileWriter.readPluginFiles.mockResolvedValue({
        success: true,
        manifest: validManifest,
        files: mockFiles,
      });

      const result =
        await AdminPluginFileService.getPluginDetails('TestPlugin');
      expect(result).not.toBeNull();
      expect(result?.id).toBe('TestPlugin');
      expect(result?.name).toBe('Test Plugin');
      expect(result?.homepage).toBe('https://example.com');
      expect(result?.license).toBe('MIT');
      expect(result?.tags).toEqual(['test']);
      expect(result?.screenshots).toEqual([
        '/src/plugin/available/TestPlugin/assets/screenshot.png',
      ]);
      expect(result?.features).toEqual(['Feature 1', 'Feature 2']);
      expect(result?.changelog).toEqual([
        { version: '1.0.0', changes: ['Initial release'] },
      ]);
      expect(result?.readme).toContain('# Test Plugin');
    });

    it('should return null when readPluginFiles fails', async () => {
      mockInternalFileWriter.readPluginFiles.mockResolvedValue({
        success: false,
        error: 'Plugin not found',
      });

      const result =
        await AdminPluginFileService.getPluginDetails('NonExistentPlugin');
      expect(result).toBeNull();
    });

    it('should return null when manifest is missing', async () => {
      mockInternalFileWriter.readPluginFiles.mockResolvedValue({
        success: true,
        manifest: undefined,
        files: {},
      });

      const result =
        await AdminPluginFileService.getPluginDetails('TestPlugin');
      expect(result).toBeNull();
    });

    it('should handle invalid info.json', async () => {
      const mockFiles = {
        'manifest.json': JSON.stringify(validManifest),
        'info.json': 'invalid json',
        'README.md': '# Test Plugin',
      };

      mockInternalFileWriter.readPluginFiles.mockResolvedValue({
        success: true,
        manifest: validManifest,
        files: mockFiles,
      });

      const result =
        await AdminPluginFileService.getPluginDetails('TestPlugin');
      expect(result).not.toBeNull();
      expect(result?.features).toEqual([]);
    });

    it('should extract features from README when not in info.json', async () => {
      const mockFiles = {
        'manifest.json': JSON.stringify(validManifest),
        'README.md':
          '# Test Plugin\n\nFeatures:\n- Feature 1\n- Feature 2\n- Feature 3',
      };

      mockInternalFileWriter.readPluginFiles.mockResolvedValue({
        success: true,
        manifest: validManifest,
        files: mockFiles,
      });

      const result =
        await AdminPluginFileService.getPluginDetails('TestPlugin');
      expect(result).not.toBeNull();
      expect(result?.features).toEqual(['Feature 1', 'Feature 2', 'Feature 3']);
    });

    it('should handle missing info.json and README', async () => {
      const mockFiles = {
        'manifest.json': JSON.stringify(validManifest),
      };

      mockInternalFileWriter.readPluginFiles.mockResolvedValue({
        success: true,
        manifest: validManifest,
        files: mockFiles,
      });

      const result =
        await AdminPluginFileService.getPluginDetails('TestPlugin');
      expect(result).not.toBeNull();
      expect(result?.features).toEqual([]);
      expect(result?.readme).toBe('');
    });

    it('should handle exceptions in getPluginDetails', async () => {
      mockInternalFileWriter.readPluginFiles.mockRejectedValue(
        new Error('Network error'),
      );

      const result =
        await AdminPluginFileService.getPluginDetails('TestPlugin');
      expect(result).toBeNull();
    });

    it('should handle missing manifest fields gracefully', async () => {
      const minimalManifest = {
        pluginId: 'TestPlugin',
        name: 'Test Plugin',
        version: '1.0.0',
        description: 'A minimal test plugin',
        author: 'Test Author',
        main: 'index.js',
      };

      const mockFiles = {
        'manifest.json': JSON.stringify(minimalManifest),
      };

      mockInternalFileWriter.readPluginFiles.mockResolvedValue({
        success: true,
        manifest: minimalManifest,
        files: mockFiles,
      });

      const result =
        await AdminPluginFileService.getPluginDetails('TestPlugin');
      expect(result).not.toBeNull();
      expect(result?.description).toBe('A minimal test plugin');
      expect(result?.author).toBe('Test Author');
      expect(result?.version).toBe('1.0.0');
      expect(result?.icon).toBe('/images/logo512.png');
    });
  });

  describe('Singleton pattern', () => {
    it('should return the same instance', () => {
      const instance1 = AdminPluginFileService.getInstance();
      const instance2 = AdminPluginFileService.getInstance();
      expect(instance1).toBe(instance2);
    });
  });
});
