/**
 * Internal File Writer Service
 *
 * Handles file operations directly within the admin app without external server.
 * Works in both development (Vite) and production environments.
 */

import { AdminPluginManifest } from '../../utils/adminPluginInstaller';

export interface FileWriteResult {
  success: boolean;
  path: string;
  filesWritten: number;
  writtenFiles: string[];
  error?: string;
}

export interface FileOperationResult {
  success: boolean;
  error?: string;
  data?: any;
}

/**
 * Internal File Writer
 * Handles all file operations without external dependencies
 */
export class InternalFileWriter {
  private static instance: InternalFileWriter | null = null;
  private readonly pluginBasePath: string;
  private isInitialized = false;

  private constructor() {
    // Use the actual plugin directory path
    this.pluginBasePath = this.getPluginBasePath();
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
  private getPluginBasePath(): string {
    if (typeof window !== 'undefined') {
      // In browser environment, we'll use the Vite plugin API
      return '/src/plugin/available';
    } else {
      // In Node.js environment (SSR, build), use actual path
      const path = require('path');
      return path.join(process.cwd(), 'src', 'plugin', 'available');
    }
  }

  /**
   * Initialize the file writer
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
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
  ): Promise<FileWriteResult> {
    try {
      await this.initialize();

      const pluginPath = `${this.pluginBasePath}/${pluginId}`;
      const writtenFiles: string[] = [];

      // Ensure plugin directory exists
      await this.ensureDirectoryExists(pluginPath);

      // Write all files
      for (const [filePath, content] of Object.entries(files)) {
        const fullPath = `${pluginPath}/${filePath}`;

        // Ensure subdirectories exist
        const fileDir = this.getDirectoryPath(fullPath);
        await this.ensureDirectoryExists(fileDir);

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
    } catch (error) {
      console.error('Failed to write plugin files:', error);
      return {
        success: false,
        path: '',
        filesWritten: 0,
        writtenFiles: [],
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Read plugin files from filesystem
   */
  async readPluginFiles(pluginId: string): Promise<{
    success: boolean;
    files?: Record<string, string>;
    manifest?: AdminPluginManifest;
    error?: string;
  }> {
    try {
      const pluginPath = `${this.pluginBasePath}/${pluginId}`;

      // Check if plugin exists
      if (!(await this.pathExists(pluginPath))) {
        return {
          success: false,
          error: `Plugin ${pluginId} not found`,
        };
      }

      // Read all files in plugin directory
      const files = await this.readDirectoryRecursive(pluginPath);

      // Parse manifest if it exists
      let manifest: AdminPluginManifest | undefined;
      if (files['manifest.json']) {
        try {
          manifest = JSON.parse(files['manifest.json']);
        } catch (error) {
          console.error('Failed to parse manifest:', error);
        }
      }

      return {
        success: true,
        files,
        manifest,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * List all installed plugins
   */
  async listInstalledPlugins(): Promise<{
    success: boolean;
    plugins?: Array<{
      pluginId: string;
      manifest: AdminPluginManifest;
      installedAt: string;
    }>;
    error?: string;
  }> {
    try {
      await this.initialize();

      const pluginDirs = await this.listDirectories(this.pluginBasePath);
      const plugins: Array<{
        pluginId: string;
        manifest: AdminPluginManifest;
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
  async removePlugin(pluginId: string): Promise<FileOperationResult> {
    try {
      const pluginPath = `${this.pluginBasePath}/${pluginId}`;

      if (!(await this.pathExists(pluginPath))) {
        return {
          success: false,
          error: `Plugin ${pluginId} not found`,
        };
      }

      await this.removeDirectory(pluginPath);

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
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
    } else {
      // In Node.js, use fs directly
      const fs = require('fs').promises;
      await fs.mkdir(dirPath, { recursive: true });
    }
  }

  /**
   * Write file to filesystem
   */
  private async writeFile(filePath: string, content: string): Promise<void> {
    if (typeof window !== 'undefined') {
      // In browser, use Vite plugin API
      await this.callVitePlugin('writeFile', { path: filePath, content });
    } else {
      // In Node.js, use fs directly
      const fs = require('fs').promises;

      // Check if this is a base64 data URL (binary asset)
      if (content.startsWith('data:')) {
        // Extract base64 content and write as binary
        const base64Data = content.split(',')[1];
        const binaryBuffer = Buffer.from(base64Data, 'base64');
        await fs.writeFile(filePath, binaryBuffer);
      } else {
        // Write as text file
        await fs.writeFile(filePath, content, 'utf8');
      }
    }
  }

  /**
   * Read file from filesystem
   */
  private async readFile(filePath: string): Promise<string> {
    if (typeof window !== 'undefined') {
      // In browser, use Vite plugin API
      return await this.callVitePlugin('readFile', { path: filePath });
    } else {
      // In Node.js, use fs directly
      const fs = require('fs').promises;
      return await fs.readFile(filePath, 'utf8');
    }
  }

  /**
   * Check if path exists
   */
  private async pathExists(path: string): Promise<boolean> {
    if (typeof window !== 'undefined') {
      // In browser, use Vite plugin API
      return await this.callVitePlugin('pathExists', { path });
    } else {
      // In Node.js, use fs directly
      const fs = require('fs').promises;
      try {
        await fs.access(path);
        return true;
      } catch {
        return false;
      }
    }
  }

  /**
   * List directories
   */
  private async listDirectories(path: string): Promise<string[]> {
    if (typeof window !== 'undefined') {
      // In browser, use Vite plugin API
      return await this.callVitePlugin('listDirectories', { path });
    } else {
      // In Node.js, use fs directly
      const fs = require('fs').promises;
      const entries = await fs.readdir(path, { withFileTypes: true });
      return entries
        .filter((entry: any) => entry.isDirectory())
        .map((entry: any) => entry.name);
    }
  }

  /**
   * Read directory recursively
   */
  private async readDirectoryRecursive(
    dirPath: string,
  ): Promise<Record<string, string>> {
    if (typeof window !== 'undefined') {
      // In browser, use Vite plugin API
      return await this.callVitePlugin('readDirectoryRecursive', {
        path: dirPath,
      });
    } else {
      // In Node.js, use fs directly
      const fs = require('fs').promises;
      const path = require('path');
      const files: Record<string, string> = {};

      async function readDir(
        currentPath: string,
        relativePath = '',
      ): Promise<void> {
        const entries = await fs.readdir(currentPath, { withFileTypes: true });

        for (const entry of entries) {
          const fullPath = path.join(currentPath, entry.name);
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

      await readDir(dirPath);
      return files;
    }
  }

  /**
   * Remove directory recursively
   */
  private async removeDirectory(path: string): Promise<void> {
    if (typeof window !== 'undefined') {
      // In browser, use Vite plugin API
      await this.callVitePlugin('removeDirectory', { path });
    } else {
      // In Node.js, use fs directly
      const fs = require('fs').promises;
      await fs.rm(path, { recursive: true, force: true });
    }
  }

  /**
   * Get directory path from file path
   */
  private getDirectoryPath(filePath: string): string {
    if (typeof window !== 'undefined') {
      // In browser, use simple string manipulation
      return filePath.substring(0, filePath.lastIndexOf('/'));
    } else {
      // In Node.js, use path module
      const path = require('path');
      return path.dirname(filePath);
    }
  }

  /**
   * Call Vite plugin API
   */
  private async callVitePlugin(method: string, params: any): Promise<any> {
    const response = await fetch('/__vite_plugin_internal_file_writer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        method,
        params,
      }),
    });

    if (!response.ok) {
      throw new Error(`Vite plugin error: ${response.statusText}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Vite plugin operation failed');
    }

    return result.data;
  }
}

/**
 * Singleton instance export
 */
export const internalFileWriter = InternalFileWriter.getInstance();
