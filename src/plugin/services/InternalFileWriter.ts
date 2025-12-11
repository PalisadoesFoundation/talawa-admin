/**
 * Internal File Writer Service
 *
 * Handles file operations directly within the admin app without external server.
 * Works in both development (Vite) and production environments.
 */

import type { Dirent } from 'node:fs';
import { IAdminPluginManifest } from '../../utils/adminPluginInstaller';

export interface IFileWriteResult {
  success: boolean;
  path: string;
  filesWritten: number;
  writtenFiles: string[];
  error?: string;
}

export interface IFileOperationResult {
  success: boolean;
  error?: string;
  data?: unknown;
}

interface IVitePluginResponse<T> {
  success: boolean;
  error?: string;
  data?: T;
}

/**
 * Internal File Writer
 * Handles all file operations without external dependencies
 */
export class InternalFileWriter {
  private static instance: InternalFileWriter | null = null;
  private pluginBasePath = '';
  private isInitialized = false;
  private fsModule: typeof import('node:fs/promises') | null = null;
  private pathModule: typeof import('node:path') | null = null;

  private constructor() {
    // pluginBasePath will be set during initialization
  }

  /**
   * Get singleton instance
   */
  static getInstance(): InternalFileWriter {
    if (!InternalFileWriter.instance) {
      InternalFileWriter.instance = new InternalFileWriter();
    }
    return InternalFileWriter.instance;
  }

  /**
   * Get the plugin base path
   */
  private async getPluginBasePath(): Promise<string> {
    if (typeof window !== 'undefined') {
      // In browser environment, we'll use the Vite plugin API
      return '/src/plugin/available';
    }

    const path = await this.getPathModule();
    return path.join(process.cwd(), 'src', 'plugin', 'available');
  }

  /**
   * Get fs module (cached)
   */
  private async getFsModule(): Promise<typeof import('node:fs/promises')> {
    if (!this.fsModule) {
      this.fsModule = await import('node:fs/promises');
    }
    return this.fsModule;
  }

  /**
   * Get path module (cached)
   */
  private async getPathModule(): Promise<typeof import('node:path')> {
    if (!this.pathModule) {
      this.pathModule = await import('node:path');
    }
    return this.pathModule;
  }

  /**
   * Initialize the file writer
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      if (!this.pluginBasePath) {
        this.pluginBasePath = await this.getPluginBasePath();
      }
      // Ensure plugin directory exists
      await this.ensureDirectoryExists(this.pluginBasePath);
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize InternalFileWriter:', error);
      throw error;
    }
  }

  /**
   * Write plugin files to filesystem
   */
  async writePluginFiles(
    pluginId: string,
    files: Record<string, string>,
  ): Promise<IFileWriteResult> {
    try {
      await this.initialize();

      const basePath =
        this.pluginBasePath ||
        (this.pluginBasePath = await this.getPluginBasePath());

      const pluginPath = `${basePath}/${pluginId}`;

      const writtenFiles: string[] = [];

      // Ensure plugin directory exists
      await this.ensureDirectoryExists(pluginPath);

      // Write all files
      for (const [filePath, content] of Object.entries(files)) {
        const fullPath = `${pluginPath}/${filePath}`;

        // Ensure subdirectories exist
        const dir = await this.getDirectoryPath(fullPath);
        await this.ensureDirectoryExists(dir);

        // Write file
        await this.writeFile(fullPath, content);
        writtenFiles.push(filePath);
      }

      return {
        success: true,
        path: pluginPath,
        filesWritten: writtenFiles.length,
        writtenFiles,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Failed to write plugin files:', err);
      return {
        success: false,
        path: '',
        filesWritten: 0,
        writtenFiles: [],
        error: errorMessage,
      };
    }
  }

  /**
   * Read plugin files from filesystem
   */
  async readPluginFiles(pluginId: string): Promise<{
    success: boolean;
    files?: Record<string, string>;
    manifest?: IAdminPluginManifest;
    error?: string;
  }> {
    try {
      const basePath =
        this.pluginBasePath ||
        (this.pluginBasePath = await this.getPluginBasePath());

      const pluginPath = `${basePath}/${pluginId}`;

      // Check if plugin exists
      if (!(await this.pathExists(pluginPath))) {
        return { success: false, error: `Plugin ${pluginId} not found` };
      }

      // Read all files in plugin directory
      const files = await this.readDirectoryRecursive(pluginPath);

      // Parse manifest if it exists
      let manifest: IAdminPluginManifest | undefined;
      const raw = files['manifest.json'];

      if (raw) {
        try {
          manifest = JSON.parse(raw) as IAdminPluginManifest;
        } catch (parseError) {
          console.error('Failed to parse manifest JSON:', parseError);
        }
      }

      return { success: true, files, manifest };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error',
      };
    }
  }

  /**
   * List installed plugin metadata
   */
  async listInstalledPlugins(): Promise<{
    success: boolean;
    plugins?: Array<{
      pluginId: string;
      manifest: IAdminPluginManifest;
      installedAt: string;
    }>;
    error?: string;
  }> {
    try {
      await this.initialize();

      const pluginDirs = await this.listDirectories(this.pluginBasePath);
      const plugins: Array<{
        pluginId: string;
        manifest: IAdminPluginManifest;
        installedAt: string;
      }> = [];

      for (const pluginId of pluginDirs) {
        const pluginResult = await this.readPluginFiles(pluginId);

        if (pluginResult.success && pluginResult.manifest) {
          plugins.push({
            pluginId,
            manifest: pluginResult.manifest,
            installedAt: new Date().toISOString(), // We don't track exact install time
          });
        }
      }

      return {
        success: true,
        plugins,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Remove plugin from filesystem
   */
  async removePlugin(pluginId: string): Promise<IFileOperationResult> {
    try {
      const basePath =
        this.pluginBasePath ||
        (this.pluginBasePath = await this.getPluginBasePath());

      const pluginPath = `${basePath}/${pluginId}`;

      if (!(await this.pathExists(pluginPath))) {
        return { success: false, error: `Plugin ${pluginId} not found` };
      }

      await this.removeDirectory(pluginPath);

      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error',
      };
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PRIVATE HELPER METHODS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Ensure directory exists
   */
  private async ensureDirectoryExists(dirPath: string): Promise<void> {
    if (typeof window !== 'undefined') {
      // In browser, use Vite plugin API
      await this.callVitePlugin('ensureDirectory', { path: dirPath });
      return;
    }
    // In Node.js, use fs directly
    const fs = await this.getFsModule();
    await fs.mkdir(dirPath, { recursive: true });
  }

  /**
   * Write file to filesystem
   */
  private async writeFile(filePath: string, content: string): Promise<void> {
    if (typeof window !== 'undefined') {
      // In browser, use Vite plugin API
      await this.callVitePlugin('writeFile', { path: filePath, content });
      return;
    }
    // In Node.js, use fs directly
    const fs = await this.getFsModule();

    // Check if this is a base64 data URL (binary asset)
    if (content.startsWith('data:')) {
      // Extract base64 content and write as binary
      const base64 = content.split(',')[1] ?? '';
      const buffer = Buffer.from(base64, 'base64');
      await fs.writeFile(filePath, buffer);
    } else {
      // Write as text file
      await fs.writeFile(filePath, content, 'utf8');
    }
  }

  /**
   * Read file from filesystem
   */
  private async readFile(filePath: string): Promise<string> {
    if (typeof window !== 'undefined') {
      // In browser, use Vite plugin API
      return this.callVitePlugin<string>('readFile', { path: filePath });
    }
    // In Node.js, use fs directly
    const fs = await this.getFsModule();
    return fs.readFile(filePath, 'utf8');
  }

  /**
   * Check if path exists
   */
  private async pathExists(path: string): Promise<boolean> {
    if (typeof window !== 'undefined') {
      // In browser, use Vite plugin API
      return this.callVitePlugin<boolean>('pathExists', { path });
    }
    // In Node.js, use fs directly
    const fs = await this.getFsModule();
    try {
      await fs.access(path);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * List directories
   */
  private async listDirectories(path: string): Promise<string[]> {
    if (typeof window !== 'undefined') {
      // In browser, use Vite plugin API
      return this.callVitePlugin<string[]>('listDirectories', { path });
    }
    // In Node.js, use fs directly
    const fs = await this.getFsModule();
    const entries: Dirent[] = await fs.readdir(path, { withFileTypes: true });

    return entries.filter((e) => e.isDirectory()).map((e) => e.name);
  }

  /**
   * Read directory recursively
   */
  private async readDirectoryRecursive(
    dirPath: string,
  ): Promise<Record<string, string>> {
    if (typeof window !== 'undefined') {
      // In browser, use Vite plugin API
      return this.callVitePlugin<Record<string, string>>(
        'readDirectoryRecursive',
        { path: dirPath },
      );
    }
    // In Node.js, use fs directly
    const fs = await this.getFsModule();
    const pathModule = await this.getPathModule();
    const output: Record<string, string> = {};

    const walk = async (current: string, relative = ''): Promise<void> => {
      const entries: Dirent[] = await fs.readdir(current, {
        withFileTypes: true,
      });

      for (const entry of entries) {
        const full = pathModule.join(current, entry.name);
        const rel = relative ? `${relative}/${entry.name}` : entry.name;

        if (entry.isDirectory()) {
          await walk(full, rel);
        } else {
          output[rel] = await fs.readFile(full, 'utf8');
        }
      }
    };

    await walk(dirPath);
    return output;
  }

  /**
   * Remove directory recursively
   */
  private async removeDirectory(path: string): Promise<void> {
    if (typeof window !== 'undefined') {
      // In browser, use Vite plugin API
      await this.callVitePlugin('removeDirectory', { path });
      return;
    }
    // In Node.js, use fs directly
    const fs = await this.getFsModule();
    await fs.rm(path, { recursive: true, force: true });
  }

  /**
   * Get directory path from file path
   */
  private async getDirectoryPath(filePath: string): Promise<string> {
    if (typeof window !== 'undefined') {
      // In browser, use simple string manipulation
      return filePath.substring(0, filePath.lastIndexOf('/'));
    }
    // In Node.js, use path module
    const path = await this.getPathModule();
    return path.dirname(filePath);
  }

  /**
   * Call Vite plugin API
   */
  private async callVitePlugin<T>(method: string, params: unknown): Promise<T> {
    const response = await fetch('/__vite_plugin_internal_file_writer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ method, params }),
    });

    if (!response.ok) {
      throw new Error(`Vite plugin error: ${response.statusText}`);
    }

    const result = (await response.json()) as IVitePluginResponse<T>;

    if (!result.success) {
      throw new Error(result.error ?? 'Vite plugin operation failed');
    }

    return result.data as T;
  }
}

/**
 * Singleton instance export
 */
export const internalFileWriter = InternalFileWriter.getInstance();
