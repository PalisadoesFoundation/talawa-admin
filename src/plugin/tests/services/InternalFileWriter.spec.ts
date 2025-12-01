import {
  describe,
  it,
  expect,
  beforeEach,
  vi,
  afterEach,
  type Mock,
  type MockInstance,
} from 'vitest';
import {
  InternalFileWriter,
  internalFileWriter,
} from '../../services/InternalFileWriter';
import { IAdminPluginManifest } from '../../../utils/adminPluginInstaller';

// Mock fetch for Vite plugin API calls
// Mock fetch for Vite plugin API calls
global.fetch = vi.fn() as unknown as typeof fetch;

// Mock fs for Node.js environment (not strictly needed by implementation, but kept)
vi.mock('node:fs', () => ({
  promises: {
    mkdir: vi.fn(),
    writeFile: vi.fn(),
    readFile: vi.fn(),
    access: vi.fn(),
    readdir: vi.fn(),
    rm: vi.fn(),
  },
}));

// Mock fs/promises for Node.js environment – shape must match real module
vi.mock('node:fs/promises', () => ({
  mkdir: vi.fn(),
  writeFile: vi.fn(),
  readFile: vi.fn(),
  access: vi.fn(),
  readdir: vi.fn(),
  rm: vi.fn(),
}));

// Mock path for Node.js environment
vi.mock('node:path', () => ({
  join: vi.fn((...args: string[]) => args.join('/')),
  dirname: vi.fn((path: string) => path.substring(0, path.lastIndexOf('/'))),
}));

// Mock path for Node.js environment
vi.mock('node:path', () => ({
  join: vi.fn((...args: string[]) => args.join('/')),
  dirname: vi.fn((path: string) => path.substring(0, path.lastIndexOf('/'))),
}));

const mockManifest: IAdminPluginManifest = {
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

function createMockResponse(data: unknown, ok = true): Response {
  return {
    ok,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
  } as unknown as Response;
}

describe('InternalFileWriter', () => {
  let mockFetch: MockInstance;
  let originalWindow: unknown;

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch = fetch as unknown as MockInstance;

    // Reset singleton instance
    (
      InternalFileWriter as unknown as { instance: InternalFileWriter | null }
    ).instance = null;

    // Store original window
    originalWindow = (global as unknown as { window?: unknown }).window;

    mockFetch.mockResolvedValue(
      createMockResponse({ success: true, data: 'test-data' }),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
    // Restore original window
    (global as unknown as { window?: unknown }).window = originalWindow;
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

    it('should return existing instance on subsequent calls', () => {
      // Reset singleton for this test
      (
        InternalFileWriter as unknown as { instance: InternalFileWriter | null }
      ).instance = null;

      const instance1 = InternalFileWriter.getInstance();
      const instance2 = InternalFileWriter.getInstance();
      const instance3 = InternalFileWriter.getInstance();

      expect(instance1).toBe(instance2);
      expect(instance2).toBe(instance3);
      expect(instance1).toBe(instance3);
    });
  });

  describe('getPluginBasePath', () => {
    it('should return browser path when window is defined', async () => {
      (global as unknown as { window?: unknown }).window = {};

      const instance = InternalFileWriter.getInstance();
      const withPriv = instance as unknown as {
        getPluginBasePath: () => Promise<string>;
      };

      const path = await withPriv.getPluginBasePath();
      expect(path).toBe('/src/plugin/available');
    });

    it('should return Node.js path when window is not defined', async () => {
      const originalCwd = process.cwd;
      (process as unknown as { cwd: () => string }).cwd = vi.fn(
        () => '/test/root',
      );

      (global as unknown as { window?: unknown }).window = undefined;

      const instance = InternalFileWriter.getInstance();
      const withPriv = instance as unknown as {
        getPluginBasePath: () => Promise<string>;
      };

      const path = await withPriv.getPluginBasePath();
      expect(path).toBe('/test/root/src/plugin/available');

      // Restore
      (process as unknown as { cwd: () => string }).cwd = originalCwd;
    });
  });

  describe('initialize', () => {
    it('should initialize successfully in browser environment', async () => {
      (global as unknown as { window?: unknown }).window = {};

      mockFetch.mockResolvedValue(createMockResponse({ success: true }));

      const instance = InternalFileWriter.getInstance();
      await expect(instance.initialize()).resolves.not.toThrow();
    });

    it('should not reinitialize if already initialized', async () => {
      (global as unknown as { window?: unknown }).window = {};

      mockFetch.mockResolvedValue(createMockResponse({ success: true }));

      const instance = InternalFileWriter.getInstance();
      await instance.initialize();
      await instance.initialize(); // Should not throw or reinitialize
    });

    it('should handle initialization errors', async () => {
      (global as unknown as { window?: unknown }).window = {};

      mockFetch.mockRejectedValue(new Error('Network error'));

      const instance = InternalFileWriter.getInstance();
      await expect(instance.initialize()).rejects.toThrow('Network error');
    });
  });

  describe('writePluginFiles', () => {
    beforeEach(() => {
      (global as unknown as { window?: unknown }).window = {};
    });

    it('should write plugin files successfully in browser environment', async () => {
      mockFetch
        .mockResolvedValueOnce(createMockResponse({ success: true }))
        .mockResolvedValueOnce(createMockResponse({ success: true }))
        .mockResolvedValueOnce(createMockResponse({ success: true }));

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
      (global as unknown as { window?: unknown }).window = {};

      mockFetch.mockRejectedValue(new Error('Write failed'));

      const instance = InternalFileWriter.getInstance();
      const result = await instance.writePluginFiles('TestPlugin', mockFiles);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Write failed');
      expect(result.filesWritten).toBe(0);
      expect(result.writtenFiles).toEqual([]);
    });

    it('should handle initialization errors', async () => {
      (global as unknown as { window?: unknown }).window = {};

      mockFetch.mockRejectedValue(new Error('Init failed'));

      const instance = InternalFileWriter.getInstance();
      const result = await instance.writePluginFiles('TestPlugin', mockFiles);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Init failed');
    });

    it('should handle base64 content correctly', async () => {
      (global as unknown as { window?: unknown }).window = {};

      const filesWithBase64: Record<string, string> = {
        ...mockFiles,
        'image.png':
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      };

      mockFetch.mockResolvedValue(createMockResponse({ success: true }));

      const instance = InternalFileWriter.getInstance();
      const result = await instance.writePluginFiles(
        'TestPlugin',
        filesWithBase64,
      );

      expect(result.success).toBe(true);
      expect(result.filesWritten).toBe(4);
    });
  });

  describe('readPluginFiles', () => {
    beforeEach(() => {
      (global as unknown as { window?: unknown }).window = {};
    });

    it('should read plugin files successfully', async () => {
      mockFetch.mockResolvedValue(
        createMockResponse({
          success: true,
          data: {
            'manifest.json': JSON.stringify(mockManifest),
            'index.js': 'console.log("Hello");',
          },
        }),
      );

      const instance = InternalFileWriter.getInstance();
      const result = await instance.readPluginFiles('TestPlugin');

      expect(result.success).toBe(true);
      expect(result.files).toBeDefined();
      expect(result.manifest).toEqual(mockManifest);
    });

    it('should handle plugin not found', async () => {
      mockFetch.mockResolvedValue(
        createMockResponse({
          success: false,
          error: 'Plugin not found',
        }),
      );

      const instance = InternalFileWriter.getInstance();
      const result = await instance.readPluginFiles('NonExistentPlugin');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Plugin not found');
    });

    it('should handle invalid manifest JSON', async () => {
      mockFetch.mockResolvedValue(
        createMockResponse({
          success: true,
          data: {
            'manifest.json': '{invalid json}',
            'index.js': 'console.log("Hello");',
          },
        }),
      );

      const instance = InternalFileWriter.getInstance();
      const result = await instance.readPluginFiles('TestPlugin');

      expect(result.success).toBe(true);
      expect(result.files).toBeDefined();
      expect(result.manifest).toBeUndefined();
    });

    it('should handle read errors', async () => {
      mockFetch.mockRejectedValue(new Error('Read failed'));

      const instance = InternalFileWriter.getInstance();
      const result = await instance.readPluginFiles('TestPlugin');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Read failed');
    });
  });

  describe('listInstalledPlugins', () => {
    beforeEach(() => {
      (global as unknown as { window?: unknown }).window = {};
    });

    it('should list installed plugins successfully', async () => {
      const instance = InternalFileWriter.getInstance();
      const withPriv = instance as unknown as {
        initialize: () => Promise<void>;
        listDirectories: (path: string) => Promise<string[]>;
        readPluginFiles: (
          pluginId: string,
        ) => Promise<{ success: boolean; manifest?: IAdminPluginManifest }>;
      };

      (vi.spyOn(withPriv, 'initialize') as MockInstance).mockResolvedValue(
        undefined,
      );
      (vi.spyOn(withPriv, 'listDirectories') as MockInstance).mockResolvedValue(
        ['TestPlugin', 'AnotherPlugin'],
      );
      (vi.spyOn(withPriv, 'readPluginFiles') as MockInstance)
        .mockResolvedValueOnce({
          success: true,
          manifest: mockManifest,
        })
        .mockResolvedValueOnce({
          success: true,
          manifest: { ...mockManifest, pluginId: 'AnotherPlugin' },
        });

      const result = await instance.listInstalledPlugins();

      expect(result.success).toBe(true);
      expect(result.plugins).toHaveLength(2);
      expect(result.plugins?.[0].pluginId).toBe('TestPlugin');
      expect(result.plugins?.[1].pluginId).toBe('AnotherPlugin');
    });

    it('should handle empty plugin list', async () => {
      const instance = InternalFileWriter.getInstance();
      const withPriv = instance as unknown as {
        initialize: () => Promise<void>;
        listDirectories: (path: string) => Promise<string[]>;
      };

      (vi.spyOn(withPriv, 'initialize') as MockInstance).mockResolvedValue(
        undefined,
      );
      (vi.spyOn(withPriv, 'listDirectories') as MockInstance).mockResolvedValue(
        [],
      );

      const result = await instance.listInstalledPlugins();

      expect(result.success).toBe(true);
      expect(result.plugins).toEqual([]);
    });

    it('should handle plugins without valid manifests', async () => {
      const instance = InternalFileWriter.getInstance();
      const withPriv = instance as unknown as {
        initialize: () => Promise<void>;
        listDirectories: (path: string) => Promise<string[]>;
        readPluginFiles: (
          pluginId: string,
        ) => Promise<{ success: boolean; manifest?: IAdminPluginManifest }>;
      };

      (vi.spyOn(withPriv, 'initialize') as MockInstance).mockResolvedValue(
        undefined,
      );
      (vi.spyOn(withPriv, 'listDirectories') as MockInstance).mockResolvedValue(
        ['TestPlugin'],
      );
      (
        vi.spyOn(withPriv, 'readPluginFiles') as MockInstance
      ).mockResolvedValueOnce({
        success: false,
      });

      const result = await instance.listInstalledPlugins();

      expect(result.success).toBe(true);
      expect(result.plugins).toEqual([]);
    });

    it('should handle list errors', async () => {
      const instance = InternalFileWriter.getInstance();
      const withPriv = instance as unknown as {
        initialize: () => Promise<void>;
      };

      (vi.spyOn(withPriv, 'initialize') as MockInstance).mockRejectedValue(
        new Error('List failed'),
      );

      const result = await instance.listInstalledPlugins();

      expect(result.success).toBe(false);
      expect(result.error).toBe('List failed');
    });
  });

  describe('removePlugin', () => {
    beforeEach(() => {
      (global as unknown as { window?: unknown }).window = {};
    });

    it('should remove plugin successfully', async () => {
      const instance = InternalFileWriter.getInstance();
      const withPriv = instance as unknown as {
        pathExists: (p: string) => Promise<boolean>;
        removeDirectory: (p: string) => Promise<void>;
      };

      (vi.spyOn(withPriv, 'pathExists') as MockInstance).mockResolvedValue(
        true,
      );
      (vi.spyOn(withPriv, 'removeDirectory') as MockInstance).mockResolvedValue(
        undefined,
      );

      const result = await instance.removePlugin('TestPlugin');

      expect(result.success).toBe(true);
    });

    it('should handle plugin not found', async () => {
      const instance = InternalFileWriter.getInstance();
      const withPriv = instance as unknown as {
        pathExists: (p: string) => Promise<boolean>;
      };

      (vi.spyOn(withPriv, 'pathExists') as MockInstance).mockResolvedValue(
        false,
      );

      const result = await instance.removePlugin('NonExistentPlugin');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Plugin NonExistentPlugin not found');
    });

    it('should handle removal errors', async () => {
      const instance = InternalFileWriter.getInstance();
      const withPriv = instance as unknown as {
        pathExists: (p: string) => Promise<boolean>;
        removeDirectory: (p: string) => Promise<void>;
      };

      (vi.spyOn(withPriv, 'pathExists') as MockInstance).mockResolvedValue(
        true,
      );
      (vi.spyOn(withPriv, 'removeDirectory') as MockInstance).mockRejectedValue(
        new Error('Removal failed'),
      );

      const result = await instance.removePlugin('TestPlugin');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Removal failed');
    });
  });

  describe('callVitePlugin', () => {
    beforeEach(() => {
      (global as unknown as { window?: unknown }).window = {};
    });

    it('should call Vite plugin successfully', async () => {
      mockFetch.mockResolvedValue(
        createMockResponse({ success: true, data: 'test-data' }),
      );

      const instance = InternalFileWriter.getInstance();
      const withPriv = instance as unknown as {
        callVitePlugin: (method: string, params: unknown) => Promise<string>;
      };

      const result = await withPriv.callVitePlugin('testMethod', {
        param: 'value',
      });

      expect(result).toBe('test-data');
    });

    it('should handle Vite plugin errors', async () => {
      mockFetch.mockRejectedValue(new Error('Plugin error'));

      const instance = InternalFileWriter.getInstance();
      const withPriv = instance as unknown as {
        callVitePlugin: (method: string, params: unknown) => Promise<unknown>;
      };

      await expect(withPriv.callVitePlugin('testMethod', {})).rejects.toThrow(
        'Plugin error',
      );
    });
  });

  describe('internalFileWriter singleton', () => {
    it('should provide singleton instance', () => {
      expect(internalFileWriter).toBeDefined();
      expect(typeof internalFileWriter.writePluginFiles).toBe('function');
      expect(typeof internalFileWriter.readPluginFiles).toBe('function');
      expect(typeof internalFileWriter.listInstalledPlugins).toBe('function');
      expect(typeof internalFileWriter.removePlugin).toBe('function');
    });
  });
});

describe('Node.js specific and error coverage', () => {
  let originalWindow: unknown;
  let originalConsoleError: (typeof console)['error'];
  let mockPath: typeof import('node:path');

  beforeEach(async () => {
    originalWindow = (global as unknown as { window?: unknown }).window;
    (global as unknown as { window?: unknown }).window = undefined;

    originalConsoleError = console.error;
    console.error = vi.fn();

    // These imports resolve to mocked modules
    const pathModule = await import('node:path');
    mockPath = pathModule;
  });

  afterEach(() => {
    (global as unknown as { window?: unknown }).window = originalWindow;
    console.error = originalConsoleError;
    vi.clearAllMocks();
  });

  it('should handle errors in writePluginFiles (Node.js) and call console.error', async () => {
    const instance = InternalFileWriter.getInstance();
    const fsModule = await import('node:fs/promises');

    (vi.spyOn(fsModule, 'mkdir') as MockInstance).mockRejectedValueOnce(
      new Error('mkdir fail'),
    );

    const result = await instance.writePluginFiles('TestPlugin', {
      'a.txt': 'abc',
    });
    expect(result.success).toBe(false);
    expect(result.error).toBe('mkdir fail');
    expect(console.error).toHaveBeenCalledWith(
      'Failed to write plugin files:',
      expect.any(Error),
    );
  });

  it('should use path.dirname in getDirectoryPath (Node.js)', async () => {
    const instance = InternalFileWriter.getInstance();
    const pathModule = await import('node:path');
    const spy = vi.spyOn(pathModule, 'dirname') as MockInstance;
    const filePath = '/foo/bar/baz.txt';

    const withPriv = instance as unknown as {
      getDirectoryPath: (p: string) => Promise<string>;
    };

    const dir = await withPriv.getDirectoryPath(filePath);
    expect(spy).toHaveBeenCalledWith(filePath);
    expect(dir).toBe('/foo/bar');
  });

  it('should throw error if Vite plugin returns success: false', async () => {
    (global as unknown as { window?: unknown }).window = {};
    const fetchMock = fetch as unknown as Mock;
    fetchMock.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: false, error: 'Some error' }),
    });

    const instance = InternalFileWriter.getInstance();
    const withPriv = instance as unknown as {
      callVitePlugin: (m: string, p: unknown) => Promise<unknown>;
    };

    await expect(withPriv.callVitePlugin('test', {})).rejects.toThrow(
      'Some error',
    );
  });

  it('should handle Node.js readDirectoryRecursive with nested directories', async () => {
    const instance = InternalFileWriter.getInstance();
    const fsModule = await import('node:fs/promises');

    const mockEntries = [{ name: 'file1.txt', isDirectory: () => false }];

    (vi.spyOn(fsModule, 'readdir') as MockInstance).mockResolvedValue(
      mockEntries as unknown as Awaited<ReturnType<typeof fsModule.readdir>>,
    );
    (vi.spyOn(fsModule, 'readFile') as MockInstance).mockResolvedValue(
      'test content',
    );

    const withPriv = instance as unknown as {
      readDirectoryRecursive: (p: string) => Promise<Record<string, string>>;
    };

    const result = await withPriv.readDirectoryRecursive('/test/path');

    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
    expect(fsModule.readdir).toHaveBeenCalled();
  });

  it('should return data from callVitePlugin on success', async () => {
    (global as unknown as { window?: unknown }).window = {};
    const mockData = { files: ['test.txt'], content: 'test' };
    const fetchMock = fetch as unknown as Mock;
    fetchMock.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, data: mockData }),
    });
    const instance = InternalFileWriter.getInstance();
    const withPriv = instance as unknown as {
      callVitePlugin: (m: string, p: unknown) => Promise<unknown>;
    };

    const result = await withPriv.callVitePlugin('readFile', {
      path: '/test',
    });
    expect(result).toEqual(mockData);
  });

  it('should handle Node.js removeDirectory', async () => {
    const instance = InternalFileWriter.getInstance();
    const fsModule = await import('node:fs/promises');
    (vi.spyOn(fsModule, 'rm') as MockInstance).mockResolvedValue(undefined);

    const withPriv = instance as unknown as {
      removeDirectory: (p: string) => Promise<void>;
    };

    await withPriv.removeDirectory('/test/path');

    expect(fsModule.rm).toHaveBeenCalledWith('/test/path', {
      recursive: true,
      force: true,
    });
  });

  it('should handle Node.js readDirectoryRecursive with nested directories and files', async () => {
    const instance = InternalFileWriter.getInstance();
    const fsModule = await import('node:fs/promises');
    const pathModule = await import('node:path');

    const mockEntries = [
      { name: 'file1.txt', isDirectory: () => false },
      { name: 'file2.txt', isDirectory: () => false },
    ];

    (vi.spyOn(fsModule, 'readdir') as MockInstance).mockResolvedValue(
      mockEntries as unknown as Awaited<ReturnType<typeof fsModule.readdir>>,
    );
    (vi.spyOn(fsModule, 'readFile') as MockInstance)
      .mockResolvedValueOnce('file1 content')
      .mockResolvedValueOnce('file2 content');
    (vi.spyOn(pathModule, 'join') as MockInstance).mockImplementation(
      (...args: string[]) => args.join('/'),
    );

    const withPriv = instance as unknown as {
      readDirectoryRecursive: (p: string) => Promise<Record<string, string>>;
    };

    const result = await withPriv.readDirectoryRecursive('/test/path');

    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
    expect(result['file1.txt']).toBe('file1 content');
    expect(result['file2.txt']).toBe('file2 content');
    expect(fsModule.readdir).toHaveBeenCalledTimes(1);
  });

  it('should handle Node.js readDirectoryRecursive with empty directory', async () => {
    const instance = InternalFileWriter.getInstance();
    const fsModule = await import('node:fs/promises');

    (vi.spyOn(fsModule, 'readdir') as MockInstance).mockResolvedValue([]);

    const withPriv = instance as unknown as {
      readDirectoryRecursive: (p: string) => Promise<Record<string, string>>;
    };

    const result = await withPriv.readDirectoryRecursive('/test/path');

    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
    expect(Object.keys(result)).toHaveLength(0);
  });

  it('should handle callVitePlugin with non-ok response', async () => {
    (global as unknown as { window?: unknown }).window = {};
    const fetchMock = fetch as unknown as Mock;
    fetchMock.mockResolvedValue({
      ok: false,
      statusText: 'Not Found',
    });

    const instance = InternalFileWriter.getInstance();
    const withPriv = instance as unknown as {
      callVitePlugin: (m: string, p: unknown) => Promise<unknown>;
    };

    await expect(withPriv.callVitePlugin('test', {})).rejects.toThrow(
      'Vite plugin error: Not Found',
    );
  });

  it('should handle callVitePlugin with success: false response', async () => {
    (global as unknown as { window?: unknown }).window = {};
    const fetchMock = fetch as unknown as Mock;
    fetchMock.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: false, error: 'Custom error' }),
    });

    const instance = InternalFileWriter.getInstance();
    const withPriv = instance as unknown as {
      callVitePlugin: (m: string, p: unknown) => Promise<unknown>;
    };

    await expect(withPriv.callVitePlugin('test', {})).rejects.toThrow(
      'Custom error',
    );
  });

  it('should handle callVitePlugin with success: false but no error message', async () => {
    (global as unknown as { window?: unknown }).window = {};
    const fetchMock = fetch as unknown as Mock;
    fetchMock.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: false }),
    });

    const instance = InternalFileWriter.getInstance();
    const withPriv = instance as unknown as {
      callVitePlugin: (m: string, p: unknown) => Promise<unknown>;
    };

    await expect(withPriv.callVitePlugin('test', {})).rejects.toThrow(
      'Vite plugin operation failed',
    );
  });

  it('should handle Node.js ensureDirectoryExists', async () => {
    const instance = InternalFileWriter.getInstance();
    const fsModule = await import('node:fs/promises');
    (vi.spyOn(fsModule, 'mkdir') as MockInstance).mockResolvedValue(undefined);

    const withPriv = instance as unknown as {
      ensureDirectoryExists: (p: string) => Promise<void>;
    };

    await withPriv.ensureDirectoryExists('/test/dir');

    expect(fsModule.mkdir).toHaveBeenCalledWith('/test/dir', {
      recursive: true,
    });
  });

  it('should handle Node.js writeFile with base64 content', async () => {
    const instance = InternalFileWriter.getInstance();
    const fsModule = await import('node:fs/promises');
    (vi.spyOn(fsModule, 'writeFile') as MockInstance).mockResolvedValue(
      undefined,
    );

    const base64Content =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

    const withPriv = instance as unknown as {
      writeFile: (p: string, c: string) => Promise<void>;
    };

    await withPriv.writeFile('/test/file.png', base64Content);

    expect(fsModule.writeFile).toHaveBeenCalledWith(
      '/test/file.png',
      expect.any(Buffer),
    );
  });

  it('should handle Node.js writeFile with text content', async () => {
    const instance = InternalFileWriter.getInstance();
    const fsModule = await import('node:fs/promises');
    (vi.spyOn(fsModule, 'writeFile') as MockInstance).mockResolvedValue(
      undefined,
    );

    const withPriv = instance as unknown as {
      writeFile: (p: string, c: string) => Promise<void>;
    };

    await withPriv.writeFile('/test/file.txt', 'Hello World');

    expect(fsModule.writeFile).toHaveBeenCalledWith(
      '/test/file.txt',
      'Hello World',
      'utf8',
    );
  });

  it('should handle Node.js readFile', async () => {
    const instance = InternalFileWriter.getInstance();
    const fsModule = await import('node:fs/promises');
    (vi.spyOn(fsModule, 'readFile') as MockInstance).mockResolvedValue(
      'file content',
    );

    const withPriv = instance as unknown as {
      readFile: (p: string) => Promise<string>;
    };

    const result = await withPriv.readFile('/test/file.txt');

    expect(result).toBe('file content');
    expect(fsModule.readFile).toHaveBeenCalledWith('/test/file.txt', 'utf8');
  });

  it('should handle Node.js pathExists with existing path', async () => {
    const instance = InternalFileWriter.getInstance();
    const fsModule = await import('node:fs/promises');
    (vi.spyOn(fsModule, 'access') as MockInstance).mockResolvedValue(undefined);

    const withPriv = instance as unknown as {
      pathExists: (p: string) => Promise<boolean>;
    };

    const result = await withPriv.pathExists('/test/path');

    expect(result).toBe(true);
    expect(fsModule.access).toHaveBeenCalledWith('/test/path');
  });

  it('should handle Node.js pathExists with non-existing path', async () => {
    const instance = InternalFileWriter.getInstance();
    const fsModule = await import('node:fs/promises');
    (vi.spyOn(fsModule, 'access') as MockInstance).mockRejectedValue(
      new Error('ENOENT'),
    );

    const withPriv = instance as unknown as {
      pathExists: (p: string) => Promise<boolean>;
    };

    const result = await withPriv.pathExists('/test/path');

    expect(result).toBe(false);
  });

  it('should handle Node.js listDirectories', async () => {
    const instance = InternalFileWriter.getInstance();
    const fsModule = await import('node:fs/promises');

    const mockEntries = [
      { name: 'dir1', isDirectory: () => true },
      { name: 'file1.txt', isDirectory: () => false },
      { name: 'dir2', isDirectory: () => true },
    ];

    (vi.spyOn(fsModule, 'readdir') as MockInstance).mockResolvedValue(
      mockEntries as unknown as Awaited<ReturnType<typeof fsModule.readdir>>,
    );

    const withPriv = instance as unknown as {
      listDirectories: (p: string) => Promise<string[]>;
    };

    const result = await withPriv.listDirectories('/test/path');

    expect(result).toEqual(['dir1', 'dir2']);
    expect(fsModule.readdir).toHaveBeenCalledWith('/test/path', {
      withFileTypes: true,
    });
  });

  it('should handle readPluginFiles when plugin directory does not exist', async () => {
    const instance = InternalFileWriter.getInstance();
    const withPriv = instance as unknown as {
      pathExists: (p: string) => Promise<boolean>;
    };

    const pathExistsSpy = (
      vi.spyOn(withPriv, 'pathExists') as MockInstance
    ).mockResolvedValue(false);

    const result = await instance.readPluginFiles('MissingPlugin');

    expect(pathExistsSpy).toHaveBeenCalled();
    expect(result.success).toBe(false);
    expect(result.error).toBe('Plugin MissingPlugin not found');
  });

  it('should handle Node.js getDirectoryPath', async () => {
    const instance = InternalFileWriter.getInstance();
    const spy = vi.spyOn(mockPath, 'dirname') as MockInstance;
    const filePath = '/foo/bar/baz.txt';

    const withPriv = instance as unknown as {
      getDirectoryPath: (p: string) => Promise<string>;
    };

    const dir = await withPriv.getDirectoryPath(filePath);
    expect(spy).toHaveBeenCalledWith(filePath);
    expect(dir).toBe('/foo/bar');
  });

  it('should handle non-Error exceptions in writePluginFiles', async () => {
    const instance = InternalFileWriter.getInstance();
    const withPriv = instance as unknown as {
      initialize: () => Promise<void>;
    };

    (vi.spyOn(withPriv, 'initialize') as MockInstance).mockRejectedValue(
      'String error',
    );

    const result = await instance.writePluginFiles('TestPlugin', {
      'test.txt': 'content',
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Unknown error');
  });

  it('should handle non-Error exceptions in readPluginFiles', async () => {
    const instance = InternalFileWriter.getInstance();
    const withPriv = instance as unknown as {
      pathExists: (p: string) => Promise<boolean>;
      readDirectoryRecursive: (p: string) => Promise<Record<string, string>>;
    };

    (vi.spyOn(withPriv, 'pathExists') as MockInstance).mockResolvedValue(true);
    (
      vi.spyOn(withPriv, 'readDirectoryRecursive') as MockInstance
    ).mockRejectedValue('String error');

    const result = await instance.readPluginFiles('TestPlugin');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Unknown error');
  });

  it('should handle non-Error exceptions in removePlugin', async () => {
    const instance = InternalFileWriter.getInstance();
    const withPriv = instance as unknown as {
      pathExists: (p: string) => Promise<boolean>;
      removeDirectory: (p: string) => Promise<void>;
    };

    (vi.spyOn(withPriv, 'pathExists') as MockInstance).mockResolvedValue(true);
    (vi.spyOn(withPriv, 'removeDirectory') as MockInstance).mockRejectedValue(
      'String error',
    );

    const result = await instance.removePlugin('TestPlugin');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Unknown error');
  });

  it('should handle browser environment getDirectoryPath', async () => {
    (global as unknown as { window?: unknown }).window = {};
    const instance = InternalFileWriter.getInstance();

    const withPriv = instance as unknown as {
      getDirectoryPath: (p: string) => Promise<string>;
    };

    const filePath = '/foo/bar/baz.txt';
    const dir = await withPriv.getDirectoryPath(filePath);
    expect(dir).toBe('/foo/bar');
  });

  it('should handle browser environment ensureDirectoryExists', async () => {
    (global as unknown as { window?: unknown }).window = {};
    const instance = InternalFileWriter.getInstance();
    const withPriv = instance as unknown as {
      ensureDirectoryExists: (p: string) => Promise<void>;
      callVitePlugin: (m: string, p: unknown) => Promise<unknown>;
    };

    const spy = vi
      .spyOn(withPriv, 'callVitePlugin')
      .mockResolvedValue(undefined);

    await withPriv.ensureDirectoryExists('/test/dir');

    expect(spy).toHaveBeenCalledWith('ensureDirectory', {
      path: '/test/dir',
    });
  });

  it('should handle browser environment writeFile with text content', async () => {
    (global as unknown as { window?: unknown }).window = {};
    const instance = InternalFileWriter.getInstance();
    const withPriv = instance as unknown as {
      writeFile: (p: string, c: string) => Promise<void>;
      callVitePlugin: (m: string, p: unknown) => Promise<unknown>;
    };

    const spy = vi
      .spyOn(withPriv, 'callVitePlugin')
      .mockResolvedValue(undefined);

    await withPriv.writeFile('/test/file.txt', 'Hello World');

    expect(spy).toHaveBeenCalledWith('writeFile', {
      path: '/test/file.txt',
      content: 'Hello World',
    });
  });

  it('should handle browser environment writeFile with base64 content', async () => {
    (global as unknown as { window?: unknown }).window = {};
    const instance = InternalFileWriter.getInstance();
    const withPriv = instance as unknown as {
      writeFile: (p: string, c: string) => Promise<void>;
      callVitePlugin: (m: string, p: unknown) => Promise<unknown>;
    };

    const base64Content =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

    const spy = vi
      .spyOn(withPriv, 'callVitePlugin')
      .mockResolvedValue(undefined);

    await withPriv.writeFile('/test/file.png', base64Content);

    expect(spy).toHaveBeenCalledWith('writeFile', {
      path: '/test/file.png',
      content: base64Content,
    });
  });

  it('should handle browser environment readFile', async () => {
    (global as unknown as { window?: unknown }).window = {};
    const instance = InternalFileWriter.getInstance();
    const withPriv = instance as unknown as {
      readFile: (p: string) => Promise<string>;
      callVitePlugin: (m: string, p: unknown) => Promise<string>;
    };

    const spy = vi
      .spyOn(withPriv, 'callVitePlugin')
      .mockResolvedValue('file content');

    const result = await withPriv.readFile('/test/file.txt');

    expect(result).toBe('file content');
    expect(spy).toHaveBeenCalledWith('readFile', {
      path: '/test/file.txt',
    });
  });

  it('should handle browser environment pathExists', async () => {
    (global as unknown as { window?: unknown }).window = {};
    const instance = InternalFileWriter.getInstance();
    const withPriv = instance as unknown as {
      pathExists: (p: string) => Promise<boolean>;
      callVitePlugin: (m: string, p: unknown) => Promise<boolean>;
    };

    (vi.spyOn(withPriv, 'callVitePlugin') as MockInstance).mockResolvedValue(
      true,
    );

    const result = await withPriv.pathExists('/test/path');

    expect(result).toBe(true);
  });

  it('should handle browser environment listDirectories', async () => {
    (global as unknown as { window?: unknown }).window = {};
    const instance = InternalFileWriter.getInstance();
    const withPriv = instance as unknown as {
      listDirectories: (p: string) => Promise<string[]>;
      callVitePlugin: (m: string, p: unknown) => Promise<string[]>;
    };

    const spy = vi
      .spyOn(withPriv, 'callVitePlugin')
      .mockResolvedValue(['dir1', 'dir2']);

    const result = await withPriv.listDirectories('/test/path');

    expect(result).toEqual(['dir1', 'dir2']);
    expect(spy).toHaveBeenCalledWith('listDirectories', {
      path: '/test/path',
    });
  });

  it('should handle listInstalledPlugins with initialization error', async () => {
    const instance = InternalFileWriter.getInstance();
    const withPriv = instance as unknown as {
      initialize: () => Promise<void>;
    };

    (vi.spyOn(withPriv, 'initialize') as MockInstance).mockRejectedValue(
      new Error('Init failed'),
    );

    const result = await instance.listInstalledPlugins();

    expect(result.success).toBe(false);
    expect(result.error).toBe('Init failed');
  });

  it('should handle listInstalledPlugins with readPluginFiles error', async () => {
    const instance = InternalFileWriter.getInstance();
    const withPriv = instance as unknown as {
      initialize: () => Promise<void>;
      listDirectories: (p: string) => Promise<string[]>;
      readPluginFiles: (id: string) => Promise<{ success: boolean }>;
    };

    (vi.spyOn(withPriv, 'initialize') as MockInstance).mockResolvedValue(
      undefined,
    );
    (vi.spyOn(withPriv, 'listDirectories') as MockInstance).mockResolvedValue([
      'TestPlugin',
    ]);
    (vi.spyOn(withPriv, 'readPluginFiles') as MockInstance).mockResolvedValue({
      success: false,
      error: 'Read failed',
    } as { success: boolean });

    const result = await instance.listInstalledPlugins();

    expect(result.success).toBe(true);
    expect(result.plugins).toEqual([]);
  });

  it('should handle listInstalledPlugins with listDirectories error', async () => {
    const instance = InternalFileWriter.getInstance();
    const withPriv = instance as unknown as {
      initialize: () => Promise<void>;
      listDirectories: (p: string) => Promise<string[]>;
    };

    (vi.spyOn(withPriv, 'initialize') as MockInstance).mockResolvedValue(
      undefined,
    );
    (vi.spyOn(withPriv, 'listDirectories') as MockInstance).mockRejectedValue(
      new Error('List failed'),
    );

    const result = await instance.listInstalledPlugins();

    expect(result.success).toBe(false);
    expect(result.error).toBe('List failed');
  });

  it('should handle non-Error exceptions in listInstalledPlugins', async () => {
    const instance = InternalFileWriter.getInstance();
    const withPriv = instance as unknown as {
      initialize: () => Promise<void>;
    };

    (vi.spyOn(withPriv, 'initialize') as MockInstance).mockRejectedValue(
      'String error',
    );

    const result = await instance.listInstalledPlugins();

    expect(result.success).toBe(false);
    expect(result.error).toBe('Unknown error');
  });

  it('should handle non-Error exceptions in initialize', async () => {
    const instance = InternalFileWriter.getInstance();
    const withPriv = instance as unknown as {
      ensureDirectoryExists: (p: string) => Promise<void>;
    };

    (
      vi.spyOn(withPriv, 'ensureDirectoryExists') as MockInstance
    ).mockRejectedValue('String error');

    await expect(instance.initialize()).rejects.toThrow('String error');
  });

  it('should handle non-Error exceptions in readDirectoryRecursive', async () => {
    const instance = InternalFileWriter.getInstance();
    const fsModule = await import('node:fs/promises');
    (vi.spyOn(fsModule, 'readdir') as MockInstance).mockRejectedValue(
      'String error',
    );

    const withPriv = instance as unknown as {
      readDirectoryRecursive: (p: string) => Promise<Record<string, string>>;
    };

    await expect(withPriv.readDirectoryRecursive('/test/path')).rejects.toThrow(
      'String error',
    );
  });

  it('should handle non-Error exceptions in removeDirectory', async () => {
    const instance = InternalFileWriter.getInstance();
    const fsModule = await import('node:fs/promises');
    (vi.spyOn(fsModule, 'rm') as MockInstance).mockRejectedValue(
      'String error',
    );

    const withPriv = instance as unknown as {
      removeDirectory: (p: string) => Promise<void>;
    };

    await expect(withPriv.removeDirectory('/test/path')).rejects.toThrow(
      'String error',
    );
  });

  it('should handle non-Error exceptions in ensureDirectoryExists', async () => {
    const instance = InternalFileWriter.getInstance();
    const fsModule = await import('node:fs/promises');
    (vi.spyOn(fsModule, 'mkdir') as MockInstance).mockRejectedValue(
      'String error',
    );

    const withPriv = instance as unknown as {
      ensureDirectoryExists: (p: string) => Promise<void>;
    };

    await expect(withPriv.ensureDirectoryExists('/test/dir')).rejects.toThrow(
      'String error',
    );
  });

  it('should handle non-Error exceptions in writeFile', async () => {
    const instance = InternalFileWriter.getInstance();
    const fsModule = await import('node:fs/promises');
    (vi.spyOn(fsModule, 'writeFile') as MockInstance).mockRejectedValue(
      'String error',
    );

    const withPriv = instance as unknown as {
      writeFile: (p: string, c: string) => Promise<void>;
    };

    await expect(
      withPriv.writeFile('/test/file.txt', 'content'),
    ).rejects.toThrow('String error');
  });
});
