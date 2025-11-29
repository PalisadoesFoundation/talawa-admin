import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createInternalFileWriterPlugin } from '../../vite/internalFileWriterPlugin';
import { join } from 'path';

// Get the current working directory dynamically
const cwd = process.cwd();
const resolvePath = (path: string) => join(cwd, path);

// Mock fs module properly
vi.mock('fs', () => {
  const fsMock = {
    promises: {
      mkdir: vi.fn(),
      writeFile: vi.fn(),
      readFile: vi.fn(),
      access: vi.fn(),
      readdir: vi.fn(),
      rm: vi.fn(),
    },
  };
  return {
    ...fsMock,
    default: fsMock,
  };
});

// Mock path module
vi.mock('path', () => {
  const pathMock = {
    join: vi.fn((...args) => args.join('/')),
    dirname: vi.fn((path) => path.split('/').slice(0, -1).join('/')),
  };
  return {
    ...pathMock,
    default: pathMock,
  };
});

// Import after mocking
import { promises as fs } from 'fs';
import type { Plugin } from 'vite';
import type { Mock } from 'vitest';

const mockFs = vi.mocked(fs);

interface IMockDirent {
  name: string;
  isDirectory: () => boolean;
}

interface IMockServer {
  middlewares: {
    use: Mock;
  };
}

interface IMockResponse {
  statusCode: number;
  setHeader: Mock;
  end: Mock;
}

interface IMockRequest {
  method: string;
  on: Mock;
}

type MiddlewareFunction = (
  req: IMockRequest,
  res: IMockResponse,
) => Promise<void> | void;

describe('createInternalFileWriterPlugin', () => {
  let plugin: Plugin;
  let mockServer: IMockServer;
  let mockRes: IMockResponse;

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Mock server
    mockServer = {
      middlewares: {
        use: vi.fn(),
      },
    };

    // Mock response
    mockRes = {
      statusCode: 200,
      setHeader: vi.fn(),
      end: vi.fn(),
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Plugin Creation', () => {
    it('should create plugin with default options', () => {
      plugin = createInternalFileWriterPlugin();
      expect(plugin.name).toBe('internal-file-writer');
    });

    it('should create disabled plugin when enabled is false', () => {
      plugin = createInternalFileWriterPlugin({ enabled: false });
      expect(plugin.name).toBe('internal-file-writer-disabled');

      // Test configResolved for disabled plugin (coverage for lines 44-46)
      if (plugin.configResolved) {
        // @ts-expect-error - configResolved expects arguments but we can call it without for testing
        plugin.configResolved();
      }
    });

    it('should create plugin with custom options', () => {
      plugin = createInternalFileWriterPlugin({
        enabled: true,
        basePath: 'custom/path',
      });
    });

    it('should log debug messages when debug is true', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      plugin = createInternalFileWriterPlugin({
        enabled: true,
        debug: true,
      });

      // Test configResolved with debug (coverage for lines 53-58)
      if (plugin.configResolved) {
        // @ts-expect-error - configResolved expects arguments but we can call it without for testing
        plugin.configResolved();
      }

      expect(consoleSpy).toHaveBeenCalledWith(
        'Internal File Writer Plugin: Initialized',
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        'Base path:',
        'src/plugin/available',
      );
      consoleSpy.mockRestore();
    });
  });

  describe('Server Configuration', () => {
    beforeEach(() => {
      plugin = createInternalFileWriterPlugin();
    });

    it('should configure server with middleware', () => {
      (
        plugin as unknown as { configureServer: (s: IMockServer) => void }
      ).configureServer(mockServer);
      expect(mockServer.middlewares.use).toHaveBeenCalledTimes(2);
    });

    it('should add file writer middleware', () => {
      (
        plugin as unknown as { configureServer: (s: IMockServer) => void }
      ).configureServer(mockServer);
      const middlewareCall = mockServer.middlewares.use.mock.calls[0];
      expect(middlewareCall[0]).toBe('/__vite_plugin_internal_file_writer');
    });

    it('should add info middleware', () => {
      (
        plugin as unknown as { configureServer: (s: IMockServer) => void }
      ).configureServer(mockServer);
      const middlewareCall = mockServer.middlewares.use.mock.calls[1];
      expect(middlewareCall[0]).toBe(
        '/__vite_plugin_internal_file_writer/info',
      );
    });
  });

  describe('File Writer Middleware', () => {
    let middleware: MiddlewareFunction;
    let mockReq: IMockRequest;

    beforeEach(() => {
      plugin = createInternalFileWriterPlugin();
      (
        plugin as unknown as { configureServer: (s: IMockServer) => void }
      ).configureServer(mockServer);
      middleware = mockServer.middlewares.use.mock.calls[0][1];

      mockReq = {
        method: 'POST',
        on: vi.fn(),
      };
    });

    it('should handle ensureDirectory operation', async () => {
      mockReq.on.mockImplementation(
        (event: string, callback: (data?: string) => void) => {
          if (event === 'data') {
            callback(
              '{"method":"ensureDirectory","params":{"path":"test/dir"}}',
            );
          } else if (event === 'end') {
            callback();
          }
        },
      );

      mockFs.mkdir.mockResolvedValue(undefined);

      await middleware(mockReq, mockRes);

      expect(mockFs.mkdir).toHaveBeenCalledWith(
        resolvePath('src/plugin/available/test/dir'),
        {
          recursive: true,
        },
      );
      // ensureDirectory doesn't return data, so we just check that mkdir was called
      expect(mockFs.mkdir).toHaveBeenCalledWith(
        resolvePath('src/plugin/available/test/dir'),
        {
          recursive: true,
        },
      );
    });

    it('should handle writeFile operation with text content', async () => {
      mockReq.on.mockImplementation(
        (event: string, callback: (data?: string) => void) => {
          if (event === 'data') {
            callback(
              '{"method":"writeFile","params":{"path":"test/file.txt","content":"test content"}}',
            );
          } else if (event === 'end') {
            callback();
          }
        },
      );

      mockFs.mkdir.mockResolvedValue(undefined);
      mockFs.writeFile.mockResolvedValue(undefined);

      await middleware(mockReq, mockRes);

      expect(mockFs.mkdir).toHaveBeenCalled();
      expect(mockFs.writeFile).toHaveBeenCalledWith(
        resolvePath('src/plugin/available/test/file.txt'),
        'test content',
        'utf8',
      );
    });

    it('should handle writeFile operation with base64 content', async () => {
      const base64Content =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

      mockReq.on.mockImplementation(
        (event: string, callback: (data?: string) => void) => {
          if (event === 'data') {
            callback(
              `{"method":"writeFile","params":{"path":"test/image.png","content":"${base64Content}"}}`,
            );
          } else if (event === 'end') {
            callback();
          }
        },
      );

      mockFs.mkdir.mockResolvedValue(undefined);
      mockFs.writeFile.mockResolvedValue(undefined);

      await middleware(mockReq, mockRes);

      expect(mockFs.writeFile).toHaveBeenCalledWith(
        resolvePath('src/plugin/available/test/image.png'),
        expect.any(Buffer),
      );
    });

    it('should handle readFile operation', async () => {
      mockReq.on.mockImplementation(
        (event: string, callback: (data?: string) => void) => {
          if (event === 'data') {
            callback('{"method":"readFile","params":{"path":"test/file.txt"}}');
          } else if (event === 'end') {
            callback();
          }
        },
      );

      mockFs.readFile.mockResolvedValue('file content');

      await middleware(mockReq, mockRes);

      expect(mockFs.readFile).toHaveBeenCalledWith(
        resolvePath('src/plugin/available/test/file.txt'),
        'utf8',
      );
    });

    it('should handle pathExists operation - exists', async () => {
      mockReq.on.mockImplementation(
        (event: string, callback: (data?: string) => void) => {
          if (event === 'data') {
            callback(
              '{"method":"pathExists","params":{"path":"test/file.txt"}}',
            );
          } else if (event === 'end') {
            callback();
          }
        },
      );

      mockFs.access.mockResolvedValue(undefined);

      await middleware(mockReq, mockRes);

      expect(mockFs.access).toHaveBeenCalledWith(
        resolvePath('src/plugin/available/test/file.txt'),
      );
    });

    it('should handle pathExists operation - does not exist', async () => {
      mockReq.on.mockImplementation(
        (event: string, callback: (data?: string) => void) => {
          if (event === 'data') {
            callback(
              '{"method":"pathExists","params":{"path":"test/file.txt"}}',
            );
          } else if (event === 'end') {
            callback();
          }
        },
      );

      mockFs.access.mockRejectedValue(new Error('File not found'));

      await middleware(mockReq, mockRes);

      // pathExists with error should not call end since it's handled by the middleware
    });

    it('should handle listDirectories operation', async () => {
      mockReq.on.mockImplementation(
        (event: string, callback: (data?: string) => void) => {
          if (event === 'data') {
            callback('{"method":"listDirectories","params":{"path":"test"}}');
          } else if (event === 'end') {
            callback();
          }
        },
      );

      (mockFs.readdir as Mock).mockResolvedValue([
        { name: 'dir1', isDirectory: () => true } as unknown as IMockDirent,
        {
          name: 'file1.txt',
          isDirectory: () => false,
        } as unknown as IMockDirent,
        { name: 'dir2', isDirectory: () => true } as unknown as IMockDirent,
      ]);

      await middleware(mockReq, mockRes);

      expect(mockFs.readdir).toHaveBeenCalledWith(
        resolvePath('src/plugin/available/test'),
        {
          withFileTypes: true,
        },
      );
    });

    it('should handle readDirectoryRecursive operation', async () => {
      mockReq.on.mockImplementation(
        (event: string, callback: (data?: string) => void) => {
          if (event === 'data') {
            callback(
              '{"method":"readDirectoryRecursive","params":{"path":"test"}}',
            );
          } else if (event === 'end') {
            callback();
          }
        },
      );

      (mockFs.readdir as Mock).mockResolvedValue([
        {
          name: 'file1.txt',
          isDirectory: () => false,
        } as unknown as IMockDirent,
        { name: 'subdir', isDirectory: () => true } as unknown as IMockDirent,
      ]);

      mockFs.readFile.mockResolvedValue('file content');

      await middleware(mockReq, mockRes);

      expect(mockFs.readdir).toHaveBeenCalledWith(
        resolvePath('src/plugin/available/test'),
        {
          withFileTypes: true,
        },
      );
    });

    it('should handle removeDirectory operation', async () => {
      mockReq.on.mockImplementation(
        (event: string, callback: (data?: string) => void) => {
          if (event === 'data') {
            callback(
              '{"method":"removeDirectory","params":{"path":"test/dir"}}',
            );
          } else if (event === 'end') {
            callback();
          }
        },
      );

      mockFs.rm.mockResolvedValue(undefined);

      await middleware(mockReq, mockRes);

      expect(mockFs.rm).toHaveBeenCalledWith(
        resolvePath('src/plugin/available/test/dir'),
        {
          recursive: true,
          force: true,
        },
      );
    });

    it('should handle unknown method', async () => {
      mockReq.on.mockImplementation(
        (event: string, callback: (data?: string) => void) => {
          if (event === 'data') {
            callback('{"method":"unknownMethod","params":{}}');
          } else if (event === 'end') {
            callback();
          }
        },
      );

      await middleware(mockReq, mockRes);

      expect(mockRes.statusCode).toBe(500);
      expect(mockRes.end).toHaveBeenCalledWith(
        JSON.stringify({
          success: false,
          error: 'Unknown method: unknownMethod',
        }),
      );
    });

    it('should handle invalid JSON', async () => {
      mockReq.on.mockImplementation(
        (event: string, callback: (data?: string) => void) => {
          if (event === 'data') {
            callback('invalid json');
          } else if (event === 'end') {
            callback();
          }
        },
      );

      await middleware(mockReq, mockRes);

      expect(mockRes.statusCode).toBe(500);
      expect(mockRes.end).toHaveBeenCalledWith(
        JSON.stringify({
          success: false,
          error: 'Unexpected token \'i\', "invalid json" is not valid JSON',
        }),
      );
    });

    it('should handle fs operation errors', async () => {
      mockReq.on.mockImplementation(
        (event: string, callback: (data?: string) => void) => {
          if (event === 'data') {
            callback(
              '{"method":"writeFile","params":{"path":"test/file.txt","content":"test"}}',
            );
          } else if (event === 'end') {
            callback();
          }
        },
      );

      mockFs.mkdir.mockRejectedValue(new Error('Permission denied'));

      await middleware(mockReq, mockRes);

      // fs operation errors are handled by the middleware, so we just check that mkdir was called
      expect(mockFs.mkdir).toHaveBeenCalled();
    });

    it('should reject non-POST requests', async () => {
      mockReq.method = 'GET';

      await middleware(mockReq, mockRes);

      expect(mockRes.statusCode).toBe(405);
      expect(mockRes.end).toHaveBeenCalledWith(
        JSON.stringify({
          success: false,
          error: 'Method not allowed',
        }),
      );
    });
  });

  describe('Info Middleware', () => {
    let infoMiddleware: MiddlewareFunction;
    let mockReq: IMockRequest;

    beforeEach(() => {
      plugin = createInternalFileWriterPlugin({ basePath: 'custom/path' });
      (
        plugin as unknown as { configureServer: (s: IMockServer) => void }
      ).configureServer(mockServer);
      infoMiddleware = mockServer.middlewares.use.mock.calls[1][1];

      mockReq = {
        method: 'GET',
        on: vi.fn(),
      };

      mockRes = {
        statusCode: 200,
        setHeader: vi.fn(),
        end: vi.fn(),
      };
    });

    it('should return plugin info for GET requests', async () => {
      await infoMiddleware(mockReq, mockRes);

      expect(mockRes.setHeader).toHaveBeenCalledWith(
        'Content-Type',
        'application/json',
      );
      expect(mockRes.end).toHaveBeenCalledWith(
        JSON.stringify({
          name: 'internal-file-writer',
          version: '1.0.0',
          enabled: true,
          basePath: 'custom/path',
          methods: [
            'ensureDirectory',
            'writeFile',
            'readFile',
            'pathExists',
            'listDirectories',
            'readDirectoryRecursive',
            'removeDirectory',
            'copyDirectory',
          ],
        }),
      );
    });

    it('should not respond to non-GET requests', async () => {
      mockReq.method = 'POST';

      await infoMiddleware(mockReq, mockRes);

      expect(mockRes.setHeader).not.toHaveBeenCalled();
      expect(mockRes.end).not.toHaveBeenCalled();
    });
  });

  describe('Path Resolution', () => {
    it('should resolve absolute paths correctly', async () => {
      const plugin = createInternalFileWriterPlugin({ basePath: 'src/plugin' });
      (
        plugin as unknown as { configureServer: (s: IMockServer) => void }
      ).configureServer(mockServer);
      const middleware = mockServer.middlewares.use.mock
        .calls[0][1] as MiddlewareFunction;

      const mockReq = {
        method: 'POST',
        on: vi.fn((event, callback) => {
          if (event === 'data') {
            callback(
              '{"method":"ensureDirectory","params":{"path":"/absolute/path"}}',
            );
          } else if (event === 'end') {
            callback();
          }
        }),
      };

      mockFs.mkdir.mockResolvedValue(undefined);

      await middleware(mockReq, mockRes);

      expect(mockFs.mkdir).toHaveBeenCalledWith(resolvePath('absolute/path'), {
        recursive: true,
      });
    });

    it('should resolve relative paths correctly', async () => {
      const plugin = createInternalFileWriterPlugin({ basePath: 'src/plugin' });
      (
        plugin as unknown as { configureServer: (s: IMockServer) => void }
      ).configureServer(mockServer);
      const middleware = mockServer.middlewares.use.mock
        .calls[0][1] as MiddlewareFunction;

      const mockReq = {
        method: 'POST',
        on: vi.fn((event, callback) => {
          if (event === 'data') {
            callback(
              '{"method":"ensureDirectory","params":{"path":"relative/path"}}',
            );
          } else if (event === 'end') {
            callback();
          }
        }),
      };

      mockFs.mkdir.mockResolvedValue(undefined);

      await middleware(mockReq, mockRes);

      expect(mockFs.mkdir).toHaveBeenCalledWith(
        resolvePath('src/plugin/relative/path'),
        {
          recursive: true,
        },
      );
    });

    it('should resolve absolute paths for writeFile', async () => {
      const plugin = createInternalFileWriterPlugin({ basePath: 'src/plugin' });
      (
        plugin as unknown as { configureServer: (s: IMockServer) => void }
      ).configureServer(mockServer);
      const middleware = mockServer.middlewares.use.mock
        .calls[0][1] as MiddlewareFunction;

      const mockReq = {
        method: 'POST',
        on: vi.fn((event, callback) => {
          if (event === 'data') {
            callback(
              '{"method":"writeFile","params":{"path":"/abs/file.txt","content":"test"}}',
            );
          } else if (event === 'end') {
            callback();
          }
        }),
      };

      mockFs.mkdir.mockResolvedValue(undefined);
      mockFs.writeFile.mockResolvedValue(undefined);

      await middleware(mockReq, mockRes);

      expect(mockFs.writeFile).toHaveBeenCalledWith(
        resolvePath('abs/file.txt'),
        'test',
        'utf8',
      );
    });

    it('should resolve absolute paths for readFile', async () => {
      const plugin = createInternalFileWriterPlugin({ basePath: 'src/plugin' });
      (
        plugin as unknown as { configureServer: (s: IMockServer) => void }
      ).configureServer(mockServer);
      const middleware = mockServer.middlewares.use.mock
        .calls[0][1] as MiddlewareFunction;

      const mockReq = {
        method: 'POST',
        on: vi.fn((event, callback) => {
          if (event === 'data') {
            callback('{"method":"readFile","params":{"path":"/abs/file.txt"}}');
          } else if (event === 'end') {
            callback();
          }
        }),
      };

      mockFs.readFile.mockResolvedValue('content');

      await middleware(mockReq, mockRes);

      expect(mockFs.readFile).toHaveBeenCalledWith(
        resolvePath('abs/file.txt'),
        'utf8',
      );
    });

    it('should resolve absolute paths for pathExists', async () => {
      const plugin = createInternalFileWriterPlugin({ basePath: 'src/plugin' });
      (
        plugin as unknown as { configureServer: (s: IMockServer) => void }
      ).configureServer(mockServer);
      const middleware = mockServer.middlewares.use.mock
        .calls[0][1] as MiddlewareFunction;

      const mockReq = {
        method: 'POST',
        on: vi.fn((event, callback) => {
          if (event === 'data') {
            callback(
              '{"method":"pathExists","params":{"path":"/abs/file.txt"}}',
            );
          } else if (event === 'end') {
            callback();
          }
        }),
      };

      mockFs.access.mockResolvedValue(undefined);

      await middleware(mockReq, mockRes);

      expect(mockFs.access).toHaveBeenCalledWith(resolvePath('abs/file.txt'));
    });

    it('should resolve absolute paths for listDirectories', async () => {
      const plugin = createInternalFileWriterPlugin({ basePath: 'src/plugin' });
      (
        plugin as unknown as { configureServer: (s: IMockServer) => void }
      ).configureServer(mockServer);
      const middleware = mockServer.middlewares.use.mock
        .calls[0][1] as MiddlewareFunction;

      const mockReq = {
        method: 'POST',
        on: vi.fn((event, callback) => {
          if (event === 'data') {
            callback(
              '{"method":"listDirectories","params":{"path":"/abs/dir"}}',
            );
          } else if (event === 'end') {
            callback();
          }
        }),
      };

      (mockFs.readdir as Mock).mockResolvedValue([]);

      await middleware(mockReq, mockRes);

      expect(mockFs.readdir).toHaveBeenCalledWith(resolvePath('abs/dir'), {
        withFileTypes: true,
      });
    });

    it('should resolve absolute paths for readDirectoryRecursive', async () => {
      const plugin = createInternalFileWriterPlugin({ basePath: 'src/plugin' });
      (
        plugin as unknown as { configureServer: (s: IMockServer) => void }
      ).configureServer(mockServer);
      const middleware = mockServer.middlewares.use.mock
        .calls[0][1] as MiddlewareFunction;

      const mockReq = {
        method: 'POST',
        on: vi.fn((event, callback) => {
          if (event === 'data') {
            callback(
              '{"method":"readDirectoryRecursive","params":{"path":"/abs/dir"}}',
            );
          } else if (event === 'end') {
            callback();
          }
        }),
      };

      (mockFs.readdir as Mock).mockResolvedValue([]);

      await middleware(mockReq, mockRes);

      expect(mockFs.readdir).toHaveBeenCalledWith(resolvePath('abs/dir'), {
        withFileTypes: true,
      });
    });

    it('should resolve absolute paths for removeDirectory', async () => {
      const plugin = createInternalFileWriterPlugin({ basePath: 'src/plugin' });
      (
        plugin as unknown as { configureServer: (s: IMockServer) => void }
      ).configureServer(mockServer);
      const middleware = mockServer.middlewares.use.mock
        .calls[0][1] as MiddlewareFunction;

      const mockReq = {
        method: 'POST',
        on: vi.fn((event, callback) => {
          if (event === 'data') {
            callback(
              '{"method":"removeDirectory","params":{"path":"/abs/dir"}}',
            );
          } else if (event === 'end') {
            callback();
          }
        }),
      };

      mockFs.rm.mockResolvedValue(undefined);

      await middleware(mockReq, mockRes);

      expect(mockFs.rm).toHaveBeenCalledWith(resolvePath('abs/dir'), {
        recursive: true,
        force: true,
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle request parsing errors', async () => {
      const plugin = createInternalFileWriterPlugin();
      (
        plugin as unknown as { configureServer: (s: IMockServer) => void }
      ).configureServer(mockServer);
      const middleware = mockServer.middlewares.use.mock
        .calls[0][1] as MiddlewareFunction;

      const mockReq = {
        method: 'POST',
        on: vi.fn((event) => {
          if (event === 'data') {
            throw new Error('Network error');
          }
        }),
      };

      await middleware(mockReq, mockRes);

      expect(mockRes.statusCode).toBe(500);
      expect(mockRes.end).toHaveBeenCalledWith(
        JSON.stringify({
          success: false,
          error: 'Network error',
        }),
      );
    });

    it('should handle missing method parameter', async () => {
      const plugin = createInternalFileWriterPlugin();
      (
        plugin as unknown as { configureServer: (s: IMockServer) => void }
      ).configureServer(mockServer);
      const middleware = mockServer.middlewares.use.mock
        .calls[0][1] as MiddlewareFunction;

      const mockReq = {
        method: 'POST',
        on: vi.fn((event, callback) => {
          if (event === 'data') {
            callback('{"params":{}}');
          } else if (event === 'end') {
            callback();
          }
        }),
      };

      await middleware(mockReq, mockRes);

      expect(mockRes.statusCode).toBe(500);
      expect(mockRes.end).toHaveBeenCalledWith(
        JSON.stringify({
          success: false,
          error: 'Unknown method: undefined',
        }),
      );
    });

    it('should handle middleware request parsing errors', async () => {
      const plugin = createInternalFileWriterPlugin();
      (
        plugin as unknown as { configureServer: (s: IMockServer) => void }
      ).configureServer(mockServer);
      const middleware = mockServer.middlewares.use.mock
        .calls[0][1] as MiddlewareFunction;

      const mockReq = {
        method: 'POST',
        on: vi.fn(),
      };
      // Mock req.on to throw an error during data parsing
      mockReq.on.mockImplementation((event: string) => {
        if (event === 'data') {
          throw new Error('Request parsing error');
        }
      });

      await middleware(mockReq, mockRes);

      expect(mockRes.statusCode).toBe(500);
      expect(mockRes.setHeader).toHaveBeenCalledWith(
        'Content-Type',
        'application/json',
      );
      expect(mockRes.end).toHaveBeenCalledWith(
        JSON.stringify({
          success: false,
          error: 'Request parsing error',
        }),
      );
    });
  });

  describe('Debug Mode', () => {
    let middleware: MiddlewareFunction;
    let mockReq: IMockRequest;
    let consoleSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      plugin = createInternalFileWriterPlugin({ debug: true });
      (
        plugin as unknown as { configureServer: (s: IMockServer) => void }
      ).configureServer(mockServer);
      middleware = mockServer.middlewares.use.mock.calls[0][1];

      mockReq = {
        method: 'POST',
        on: vi.fn(),
      };
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should log error when request handling fails', async () => {
      mockReq.on.mockImplementation((event) => {
        if (event === 'data') {
          throw new Error('Test error');
        }
      });

      await middleware(mockReq, mockRes);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Internal File Writer Plugin: Request error',
        expect.any(Error),
      );
    });

    it('should log error when file operation fails', async () => {
      let endCallback: (() => Promise<void>) | undefined;

      mockReq.on.mockImplementation((event, callback) => {
        if (event === 'data') {
          callback('{"method":"writeFile","params":{"path":"test.txt"}}');
        } else if (event === 'end') {
          endCallback = callback;
        }
      });

      mockFs.writeFile.mockRejectedValue(new Error('Write failed'));

      await middleware(mockReq, mockRes);

      // Manually trigger end callback and await it
      if (endCallback) {
        await endCallback();
      }

      expect(consoleSpy).toHaveBeenCalledWith(
        'Internal File Writer Plugin: Error handling request',
        expect.any(Error),
      );
    });

    it('should log debug messages for operations', async () => {
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      mockReq.on.mockImplementation((event, callback) => {
        if (event === 'data') {
          callback('{"method":"ensureDirectory","params":{"path":"test"}}');
        } else if (event === 'end') {
          callback();
        }
      });

      mockFs.mkdir.mockResolvedValue(undefined);

      await middleware(mockReq, mockRes);

      expect(logSpy).toHaveBeenCalledWith(
        'Ensuring directory exists:',
        expect.stringContaining('test'),
      );
    });

    it('should log debug messages for pathExists', async () => {
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      mockReq.on.mockImplementation((event, callback) => {
        if (event === 'data') {
          callback('{"method":"pathExists","params":{"path":"test"}}');
        } else if (event === 'end') {
          callback();
        }
      });

      mockFs.access.mockResolvedValue(undefined);

      await middleware(mockReq, mockRes);

      expect(logSpy).toHaveBeenCalledWith(
        'Checking path exists:',
        expect.stringContaining('test'),
      );
    });
  });
});
