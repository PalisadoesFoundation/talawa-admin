import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import {
  InternalFileWriter,
  internalFileWriter,
  FileWriteResult,
  FileOperationResult,
} from '../services/InternalFileWriter';
import { AdminPluginManifest } from '../../utils/adminPluginInstaller';

// Mock fetch for Vite plugin API calls
global.fetch = vi.fn();

// Mock fs for Node.js environment
vi.mock('fs', () => ({
  promises: {
    mkdir: vi.fn(),
    writeFile: vi.fn(),
    readFile: vi.fn(),
    access: vi.fn(),
    readdir: vi.fn(),
    rm: vi.fn(),
  },
}));

// Mock path for Node.js environment
vi.mock('path', () => ({
  join: vi.fn((...args) => args.join('/')),
  dirname: vi.fn((path) => path.substring(0, path.lastIndexOf('/'))),
}));

const mockManifest: AdminPluginManifest = {
  name: 'Test Plugin',
  pluginId: 'TestPlugin',
  version: '1.0.0',
  description: 'A test plugin',
  author: 'Test Author',
  main: 'index.js',
};

const mockFiles: Record<string, string> = {
  'manifest.json': JSON.stringify(mockManifest),
  'index.js': 'console.log("Hello World");',
  'styles.css': 'body { color: red; }',
};

describe('InternalFileWriter', () => {
  let fileWriter: InternalFileWriter;
  let mockFetch: any;
  let originalWindow: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch = fetch as any;

    // Reset singleton instance
    (InternalFileWriter as any).instance = null;

    // Store original window
    originalWindow = global.window;

    // Mock successful fetch responses
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, data: 'test-data' }),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    // Restore original window
    global.window = originalWindow;
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance when getInstance is called multiple times', () => {
      const instance1 = InternalFileWriter.getInstance();
      const instance2 = InternalFileWriter.getInstance();
      expect(instance1).toBe(instance2);
    });

    it('should create a new instance only once', () => {
      const instance1 = InternalFileWriter.getInstance();
      const instance2 = InternalFileWriter.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('getPluginBasePath', () => {
    it('should return browser path when window is defined', () => {
      // Mock window object
      global.window = {} as any;

      const instance = InternalFileWriter.getInstance();
      // Access private method through any for testing
      const path = (instance as any).getPluginBasePath();
      expect(path).toBe('/src/plugin/available');
    });

    it('should return Node.js path when window is not defined', () => {
      // Mock process.cwd
      const originalCwd = process.cwd;
      process.cwd = vi.fn(() => '/test/root');

      // Remove window object
      global.window = undefined as any;

      const instance = InternalFileWriter.getInstance();
      const path = (instance as any).getPluginBasePath();
      expect(path).toBe('/test/root/src/plugin/available');

      // Restore
      process.cwd = originalCwd;
    });
  });

  describe('initialize', () => {
    it('should initialize successfully in browser environment', async () => {
      global.window = {} as any;

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      const instance = InternalFileWriter.getInstance();
      await expect(instance.initialize()).resolves.not.toThrow();
    });

    it('should not reinitialize if already initialized', async () => {
      global.window = {} as any;

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      const instance = InternalFileWriter.getInstance();
      await instance.initialize();
      await instance.initialize(); // Should not throw or reinitialize
    });

    it('should handle initialization errors', async () => {
      global.window = {} as any;

      mockFetch.mockRejectedValue(new Error('Network error'));

      const instance = InternalFileWriter.getInstance();
      await expect(instance.initialize()).rejects.toThrow('Network error');
    });
  });

  describe('writePluginFiles', () => {
    beforeEach(() => {
      global.window = {} as any;
    });

    it('should write plugin files successfully in browser environment', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        });

      const instance = InternalFileWriter.getInstance();
      const result = await instance.writePluginFiles('TestPlugin', mockFiles);

      expect(result.success).toBe(true);
      expect(result.path).toContain('TestPlugin');
      expect(result.filesWritten).toBe(3);
      expect(result.writtenFiles).toEqual([
        'manifest.json',
        'index.js',
        'styles.css',
      ]);
    });

    it('should handle write errors', async () => {
      global.window = {} as any;

      mockFetch.mockRejectedValue(new Error('Write failed'));

      const instance = InternalFileWriter.getInstance();
      const result = await instance.writePluginFiles('TestPlugin', mockFiles);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Write failed');
      expect(result.filesWritten).toBe(0);
      expect(result.writtenFiles).toEqual([]);
    });

    it('should handle initialization errors', async () => {
      global.window = {} as any;

      mockFetch.mockRejectedValue(new Error('Init failed'));

      const instance = InternalFileWriter.getInstance();
      const result = await instance.writePluginFiles('TestPlugin', mockFiles);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Init failed');
    });
  });

  describe('readPluginFiles', () => {
    beforeEach(() => {
      global.window = {} as any;
    });

    it('should read plugin files successfully in browser environment', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            data: mockFiles,
          }),
      });

      const instance = InternalFileWriter.getInstance();
      const result = await instance.readPluginFiles('TestPlugin');

      expect(result.success).toBe(true);
      expect(result.files).toEqual(mockFiles);
      expect(result.manifest).toEqual(mockManifest);
    });

    it('should handle manifest parsing errors', async () => {
      global.window = {} as any;

      const invalidManifestFiles = {
        'manifest.json': 'invalid json',
        'index.js': 'console.log("Hello");',
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            data: invalidManifestFiles,
          }),
      });

      const instance = InternalFileWriter.getInstance();
      const result = await instance.readPluginFiles('TestPlugin');

      expect(result.success).toBe(true);
      expect(result.files).toEqual(invalidManifestFiles);
      expect(result.manifest).toBeUndefined();
    });

    it('should handle read errors', async () => {
      global.window = {} as any;

      mockFetch.mockRejectedValue(new Error('Read failed'));

      const instance = InternalFileWriter.getInstance();
      const result = await instance.readPluginFiles('TestPlugin');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Read failed');
    });
  });

  describe('listInstalledPlugins', () => {
    beforeEach(() => {
      global.window = {} as any;
    });

    it('should handle list errors', async () => {
      global.window = {} as any;

      mockFetch.mockRejectedValue(new Error('List failed'));

      const instance = InternalFileWriter.getInstance();
      const result = await instance.listInstalledPlugins();

      expect(result.success).toBe(false);
      expect(result.error).toBe('List failed');
    });
  });

  describe('removePlugin', () => {
    beforeEach(() => {
      global.window = {} as any;
    });

    it('should remove plugin successfully in browser environment', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ success: true, data: true }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        });

      const instance = InternalFileWriter.getInstance();
      const result = await instance.removePlugin('TestPlugin');

      expect(result.success).toBe(true);
    });

    it('should handle remove errors', async () => {
      global.window = {} as any;

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ success: true, data: true }),
        })
        .mockRejectedValue(new Error('Remove failed'));

      const instance = InternalFileWriter.getInstance();
      const result = await instance.removePlugin('TestPlugin');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Remove failed');
    });
  });

  describe('Private Helper Methods', () => {
    beforeEach(() => {
      global.window = {} as any;
    });

    it('should call Vite plugin API correctly', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true, data: 'test-data' }),
      });

      const instance = InternalFileWriter.getInstance();
      const result = await (instance as any).callVitePlugin('testMethod', {
        param: 'value',
      });

      expect(mockFetch).toHaveBeenCalledWith(
        '/__vite_plugin_internal_file_writer',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            method: 'testMethod',
            params: { param: 'value' },
          }),
        },
      );
      expect(result).toBe('test-data');
    });

    it('should handle Vite plugin API errors', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        statusText: 'Not Found',
      });

      const instance = InternalFileWriter.getInstance();
      await expect(
        (instance as any).callVitePlugin('testMethod', {}),
      ).rejects.toThrow('Vite plugin error: Not Found');
    });

    it('should handle Vite plugin operation failures', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({ success: false, error: 'Operation failed' }),
      });

      const instance = InternalFileWriter.getInstance();
      await expect(
        (instance as any).callVitePlugin('testMethod', {}),
      ).rejects.toThrow('Operation failed');
    });

    it('should get directory path correctly in browser environment', () => {
      const instance = InternalFileWriter.getInstance();
      const result = (instance as any).getDirectoryPath('/path/to/file.txt');
      expect(result).toBe('/path/to');
    });

    it('should get directory path correctly in Node.js environment', () => {
      global.window = undefined as any;
      const instance = InternalFileWriter.getInstance();
      const result = (instance as any).getDirectoryPath('/path/to/file.txt');
      expect(result).toBe('/path/to');
    });
  });

  describe('Exported Singleton', () => {
    it('should export the singleton instance', () => {
      expect(internalFileWriter).toBeInstanceOf(InternalFileWriter);
    });
  });
});
