/**
 * Vite Plugin for Internal File Operations
 *
 * Provides file system operations for the InternalFileWriter service
 * during development without requiring an external server.
 */

import type { Plugin } from 'vite';
import { promises as fs } from 'fs';
import { join, dirname } from 'path';

export interface InternalFileWriterPluginOptions {
  /**
   * Whether to enable the plugin
   */
  enabled?: boolean;

  /**
   * Debug mode for verbose logging
   */
  debug?: boolean;

  /**
   * Base path for plugin files
   */
  basePath?: string;
}

/**
 * Vite plugin for internal file operations
 */
export function createInternalFileWriterPlugin(
  options: InternalFileWriterPluginOptions = {},
): Plugin {
  const {
    enabled = true,
    debug = false,
    basePath = 'src/plugin/available',
  } = options;

  if (!enabled) {
    return {
      name: 'internal-file-writer-disabled',
      configResolved() {
        // Plugin is disabled
      },
    };
  }

  return {
    name: 'internal-file-writer',

    configResolved(config) {
      if (debug) {
        console.log('Internal File Writer Plugin: Initialized');
        console.log('Base path:', basePath);
      }
    },

    // Add endpoint to handle file operations
    configureServer(server) {
      server.middlewares.use(
        '/__vite_plugin_internal_file_writer',
        async (req, res) => {
          if (req.method !== 'POST') {
            res.statusCode = 405;
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({ success: false, error: 'Method not allowed' }),
            );
            return;
          }

          try {
            let body = '';
            req.on('data', (chunk) => {
              body += chunk.toString();
            });

            req.on('end', async () => {
              try {
                const { method, params } = JSON.parse(body);

                const result = await handleFileOperation(
                  method,
                  params,
                  basePath,
                  debug,
                );

                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, data: result }));
              } catch (error) {
                if (debug) {
                  console.error(
                    'Internal File Writer Plugin: Error handling request',
                    error,
                  );
                }

                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(
                  JSON.stringify({
                    success: false,
                    error:
                      error instanceof Error ? error.message : 'Unknown error',
                  }),
                );
              }
            });
          } catch (error) {
            if (debug) {
              console.error(
                'Internal File Writer Plugin: Request error',
                error,
              );
            }

            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
              }),
            );
          }
        },
      );

      // Add info endpoint
      server.middlewares.use(
        '/__vite_plugin_internal_file_writer/info',
        (req, res) => {
          if (req.method === 'GET') {
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                name: 'internal-file-writer',
                version: '1.0.0',
                enabled: true,
                basePath: basePath,
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
          }
        },
      );
    },
  };
}

/**
 * Handle file operations
 */
async function handleFileOperation(
  method: string,
  params: any,
  basePath: string,
  debug: boolean,
): Promise<any> {
  const resolvedBasePath = join(process.cwd(), basePath);

  switch (method) {
    case 'ensureDirectory':
      return await ensureDirectory(params.path, resolvedBasePath, debug);

    case 'writeFile': {
      const { path: filePath, content } = params;
      const fullPath = join(process.cwd(), filePath);

      // Ensure directory exists
      await fs.mkdir(dirname(fullPath), { recursive: true });

      // Check if this is a base64 data URL (binary asset)
      if (content.startsWith('data:')) {
        // Extract base64 content and write as binary
        const base64Data = content.split(',')[1];
        const binaryBuffer = Buffer.from(base64Data, 'base64');
        await fs.writeFile(fullPath, binaryBuffer);
      } else {
        // Write as text file
        await fs.writeFile(fullPath, content, 'utf8');
      }

      if (debug) {
        console.log('Internal File Writer Plugin: File written', {
          path: fullPath,
        });
      }

      return { path: fullPath };
    }

    case 'readFile':
      return await readFile(params.path, resolvedBasePath, debug);

    case 'pathExists':
      return await pathExists(params.path, resolvedBasePath, debug);

    case 'listDirectories':
      return await listDirectories(params.path, resolvedBasePath, debug);

    case 'readDirectoryRecursive':
      return await readDirectoryRecursive(params.path, resolvedBasePath, debug);

    case 'removeDirectory':
      return await removeDirectory(params.path, resolvedBasePath, debug);

    default:
      throw new Error(`Unknown method: ${method}`);
  }
}

/**
 * Ensure directory exists
 */
async function ensureDirectory(
  path: string,
  basePath: string,
  debug: boolean,
): Promise<void> {
  const resolvedPath = path.startsWith('/')
    ? join(process.cwd(), path.substring(1))
    : join(basePath, path);

  if (debug) {
    console.log('Ensuring directory exists:', resolvedPath);
  }

  await fs.mkdir(resolvedPath, { recursive: true });
}

/**
 * Write file
 */
async function writeFile(
  path: string,
  content: string,
  basePath: string,
  debug: boolean,
): Promise<void> {
  const resolvedPath = path.startsWith('/')
    ? join(process.cwd(), path.substring(1))
    : join(basePath, path);

  if (debug) {
    console.log('Writing file:', resolvedPath);
  }

  // Ensure directory exists
  await fs.mkdir(dirname(resolvedPath), { recursive: true });

  // Write file
  await fs.writeFile(resolvedPath, content, 'utf8');
}

/**
 * Read file
 */
async function readFile(
  path: string,
  basePath: string,
  debug: boolean,
): Promise<string> {
  const resolvedPath = path.startsWith('/')
    ? join(process.cwd(), path.substring(1))
    : join(basePath, path);

  if (debug) {
    console.log('Reading file:', resolvedPath);
  }

  return await fs.readFile(resolvedPath, 'utf8');
}

/**
 * Check if path exists
 */
async function pathExists(
  path: string,
  basePath: string,
  debug: boolean,
): Promise<boolean> {
  const resolvedPath = path.startsWith('/')
    ? join(process.cwd(), path.substring(1))
    : join(basePath, path);

  if (debug) {
    console.log('Checking path exists:', resolvedPath);
  }

  try {
    await fs.access(resolvedPath);
    return true;
  } catch {
    return false;
  }
}

/**
 * List directories
 */
async function listDirectories(
  path: string,
  basePath: string,
  debug: boolean,
): Promise<string[]> {
  const resolvedPath = path.startsWith('/')
    ? join(process.cwd(), path.substring(1))
    : join(basePath, path);

  if (debug) {
    console.log('Listing directories:', resolvedPath);
  }

  const entries = await fs.readdir(resolvedPath, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

/**
 * Read directory recursively
 */
async function readDirectoryRecursive(
  path: string,
  basePath: string,
  debug: boolean,
): Promise<Record<string, string>> {
  const resolvedPath = path.startsWith('/')
    ? join(process.cwd(), path.substring(1))
    : join(basePath, path);

  if (debug) {
    console.log('Reading directory recursively:', resolvedPath);
  }

  const files: Record<string, string> = {};

  async function readDir(
    currentPath: string,
    relativePath = '',
  ): Promise<void> {
    const entries = await fs.readdir(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(currentPath, entry.name);
      const relativeFilePath = relativePath
        ? `${relativePath}/${entry.name}`
        : entry.name;

      if (entry.isDirectory()) {
        await readDir(fullPath, relativeFilePath);
      } else {
        files[relativeFilePath] = await fs.readFile(fullPath, 'utf8');
      }
    }
  }

  await readDir(resolvedPath);
  return files;
}

/**
 * Remove directory recursively
 */
async function removeDirectory(
  path: string,
  basePath: string,
  debug: boolean,
): Promise<void> {
  const resolvedPath = path.startsWith('/')
    ? join(process.cwd(), path.substring(1))
    : join(basePath, path);

  if (debug) {
    console.log('Removing directory:', resolvedPath);
  }

  await fs.rm(resolvedPath, { recursive: true, force: true });
}

/**
 * Copy directory recursively
 */
async function copyDirectory(
  source: string,
  destination: string,
  basePath: string,
  debug: boolean,
): Promise<void> {
  const resolvedSource = source.startsWith('/')
    ? join(process.cwd(), source.substring(1))
    : join(basePath, source);
  const resolvedDestination = destination.startsWith('/')
    ? join(process.cwd(), destination.substring(1))
    : join(basePath, destination);

  if (debug) {
    console.log(
      'Copying directory:',
      resolvedSource,
      'to',
      resolvedDestination,
    );
  }

  await fs.mkdir(resolvedDestination, { recursive: true });

  const entries = await fs.readdir(resolvedSource, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = join(resolvedSource, entry.name);
    const destPath = join(resolvedDestination, entry.name);

    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath, '', debug);
    } else {
      const content = await fs.readFile(srcPath);
      await fs.writeFile(destPath, content);
    }
  }
}

/**
 * Default export for convenience
 */
export default createInternalFileWriterPlugin;
