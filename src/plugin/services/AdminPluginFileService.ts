/**
 * Production-First Admin Plugin File Service
 *
 * Professional internal service that writes actual files to the filesystem
 * for production-ready plugin management.
 *
 * Features:
 * - Production-first: writes actual files to src/plugin/available/
 * - Clean integration with plugin store
 * - Professional validation and error handling
 * - No external server dependencies
 * - Works in both development and production
 */

import { IAdminPluginManifest } from '../../utils/adminPluginInstaller';
import { internalFileWriter } from './InternalFileWriter';
import type { IPluginDetails } from '../types';

export interface IPluginFileValidationResult {
  valid: boolean;
  error?: string;
  manifest?: IAdminPluginManifest;
}

export interface IPluginInstallationResult {
  success: boolean;
  pluginId: string;
  path: string;
  filesWritten: number;
  writtenFiles: string[];
  manifest: IAdminPluginManifest;
  error?: string;
}

export interface IInstalledPlugin {
  pluginId: string;
  manifest: IAdminPluginManifest;
  installedAt: string;
  lastUpdated: string;
}

/**
 * Production-First Plugin File Service
 * Writes actual files to the filesystem for production deployment
 */
export class AdminPluginFileService {
  private static instance: AdminPluginFileService | null = null;

  private constructor() {}

  /**
   * Get singleton instance
   */
  static getInstance(): AdminPluginFileService {
    if (!AdminPluginFileService.instance) {
      AdminPluginFileService.instance = new AdminPluginFileService();
    }
    return AdminPluginFileService.instance;
  }

  /**
   * Validate plugin files structure
   */
  validatePluginFiles(
    files: Record<string, string>,
  ): IPluginFileValidationResult {
    if (
      !files ||
      typeof files !== 'object' ||
      Object.keys(files).length === 0
    ) {
      return {
        valid: false,
        error: 'No files provided for installation',
      };
    }

    // Check for required manifest.json
    if (!files['manifest.json']) {
      return {
        valid: false,
        error: 'manifest.json is required',
      };
    }

    // Parse and validate manifest
    let manifest: IAdminPluginManifest;
    try {
      manifest = JSON.parse(files['manifest.json']);
    } catch {
      return {
        valid: false,
        error: 'Invalid manifest.json format',
      };
    }

    // Validate required manifest fields
    const requiredFields = [
      'name',
      'pluginId',
      'version',
      'description',
      'author',
      'main',
    ];
    for (const field of requiredFields) {
      if (!manifest[field as keyof IAdminPluginManifest]) {
        return {
          valid: false,
          error: `Missing required field in manifest: ${field}`,
        };
      }
    }

    // Check if main file exists
    if (!files[manifest.main]) {
      return {
        valid: false,
        error: `Main file not found: ${manifest.main}`,
      };
    }

    // Validate all file paths (no directory traversal)
    for (const filePath of Object.keys(files)) {
      if (
        filePath.includes('..') ||
        filePath.startsWith('/') ||
        filePath.includes('\\')
      ) {
        return {
          valid: false,
          error: `Invalid file path: ${filePath}`,
        };
      }
    }

    return { valid: true, manifest };
  }

  /**
   * Validate plugin ID
   */
  validatePluginId(pluginId: string): { valid: boolean; error?: string } {
    if (!pluginId || typeof pluginId !== 'string') {
      return { valid: false, error: 'Plugin ID is required' };
    }

    // Plugin ID should be camelCase, PascalCase, or underscore format
    // Must start with a letter, can contain letters, numbers, and underscores
    // No hyphens allowed since plugin IDs will be prefixed to GraphQL queries/mutations
    const pluginIdRegex = /^[a-zA-Z][a-zA-Z0-9_]*$/;
    if (!pluginIdRegex.test(pluginId)) {
      return {
        valid: false,
        error:
          'Plugin ID must start with a letter and contain only letters, numbers, and underscores (no hyphens)',
      };
    }

    if (pluginId.length < 3 || pluginId.length > 50) {
      return {
        valid: false,
        error: 'Plugin ID must be between 3 and 50 characters',
      };
    }

    return { valid: true };
  }

  /**
   * Install plugin files to filesystem (Production-First)
   */
  async installPlugin(
    pluginId: string,
    files: Record<string, string>,
  ): Promise<IPluginInstallationResult> {
    try {
      // Validate plugin files
      const filesValidation = this.validatePluginFiles(files);
      if (!filesValidation.valid) {
        return {
          success: false,
          pluginId,
          path: '',
          filesWritten: 0,
          writtenFiles: [],
          manifest: {} as IAdminPluginManifest,
          error: filesValidation.error,
        };
      }

      const manifest = filesValidation.manifest;
      if (!manifest) {
        return {
          success: false,
          pluginId,
          path: '',
          filesWritten: 0,
          writtenFiles: [],
          manifest: {} as IAdminPluginManifest,
          error: 'Manifest is missing',
        };
      }

      // Ensure pluginId matches manifest
      if (pluginId !== manifest.pluginId) {
        return {
          success: false,
          pluginId,
          path: '',
          filesWritten: 0,
          writtenFiles: [],
          manifest: {} as IAdminPluginManifest,
          error: 'Plugin ID does not match manifest pluginId',
        };
      }

      // Validate plugin ID
      const pluginIdValidation = this.validatePluginId(pluginId);
      if (!pluginIdValidation.valid) {
        return {
          success: false,
          pluginId,
          path: '',
          filesWritten: 0,
          writtenFiles: [],
          manifest: {} as IAdminPluginManifest,
          error: pluginIdValidation.error,
        };
      }

      // Write files to filesystem via API
      const response = await this.writeFilesToFilesystem(pluginId, files);

      if (!response.success) {
        return {
          success: false,
          pluginId,
          path: '',
          filesWritten: 0,
          writtenFiles: [],
          manifest: {} as IAdminPluginManifest,
          error: response.error || 'Failed to write files to filesystem',
        };
      }

      return {
        success: true,
        pluginId,
        path: response.path,
        filesWritten: response.filesWritten,
        writtenFiles: response.writtenFiles,
        manifest,
      };
    } catch (error) {
      console.error('Plugin installation failed:', error);
      return {
        success: false,
        pluginId,
        path: '',
        filesWritten: 0,
        writtenFiles: [],
        manifest: {} as IAdminPluginManifest,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Write files to filesystem using internal file writer (Production-First)
   */
  private async writeFilesToFilesystem(
    pluginId: string,
    files: Record<string, string>,
  ): Promise<{
    success: boolean;
    path: string;
    filesWritten: number;
    writtenFiles: string[];
    error?: string;
  }> {
    try {
      const result = await internalFileWriter.writePluginFiles(pluginId, files);
      return result;
    } catch (error) {
      return {
        success: false,
        path: '',
        filesWritten: 0,
        writtenFiles: [],
        error:
          error instanceof Error ? error.message : 'Internal file writer error',
      };
    }
  }

  /**
   * Get all installed plugins from filesystem
   */
  async getInstalledPlugins(): Promise<IInstalledPlugin[]> {
    try {
      const result = await internalFileWriter.listInstalledPlugins();

      if (!result.success) {
        throw new Error(result.error || 'Failed to get plugins');
      }

      return (
        result.plugins?.map((plugin) => ({
          pluginId: plugin.pluginId,
          manifest: plugin.manifest,
          installedAt: plugin.installedAt,
          lastUpdated: plugin.installedAt, // Use installedAt as lastUpdated for compatibility
        })) || []
      );
    } catch (error) {
      console.error('Failed to get installed plugins:', error);
      return [];
    }
  }

  /**
   * Get specific plugin from filesystem
   */
  async getPlugin(pluginId: string): Promise<IInstalledPlugin | null> {
    try {
      const result = await internalFileWriter.readPluginFiles(pluginId);

      if (!result.success || !result.manifest) {
        return null;
      }

      return {
        pluginId: pluginId,
        manifest: result.manifest,
        installedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      };
    } catch (error) {
      console.error(`Failed to get plugin ${pluginId}:`, error);
      return null;
    }
  }

  /**
   * Remove plugin from filesystem
   */
  async removePlugin(pluginId: string): Promise<boolean> {
    try {
      const result = await internalFileWriter.removePlugin(pluginId);
      return result.success;
    } catch (error) {
      console.error(`Failed to remove plugin ${pluginId}:`, error);
      return false;
    }
  }

  /**
   * Health check for the service
   */
  async healthCheck(): Promise<{
    status: 'healthy' | 'error';
    message: string;
  }> {
    try {
      const plugins = await this.getInstalledPlugins();

      return {
        status: 'healthy',
        message: `Internal file writer healthy. ${plugins.length} plugins installed.`,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get comprehensive plugin details from local files
   */
  static async getPluginDetails(
    pluginId: string,
  ): Promise<IPluginDetails | null> {
    try {
      // Read all plugin files including manifest, info, and README
      const pluginFilesResult =
        await internalFileWriter.readPluginFiles(pluginId);
      if (!pluginFilesResult.success) {
        console.error(
          `Failed to read plugin files for ${pluginId}:`,
          pluginFilesResult.error,
        );
        return null;
      }

      const manifest = pluginFilesResult.manifest;
      if (!manifest) {
        console.error(`No manifest found for plugin ${pluginId}`);
        return null;
      }

      // Parse info.json if it exists
      let pluginInfo: {
        features?: string[];
        homepage?: string;
        license?: string;
        tags?: string[];
        screenshots?: string[];
        changelog?: { version: string; date: string; changes: string[] }[];
      } = {};
      if (pluginFilesResult.files?.['info.json']) {
        try {
          pluginInfo = JSON.parse(pluginFilesResult.files['info.json']);
        } catch (error) {
          console.error(
            `Failed to parse info.json for plugin ${pluginId}:`,
            error,
          );
        }
      }

      // Get README content if it exists
      const readmeContent = pluginFilesResult.files?.['README.md'] || '';

      // Extract features from README if not in info.json
      let features = pluginInfo.features || [];
      if (!features.length && readmeContent) {
        features =
          readmeContent
            .split('Features:')[1]
            ?.split('\n')
            .filter((line: string) => line.trim().startsWith('-'))
            .map((line: string) => line.replace('-', '').trim()) || [];
      }

      // Create plugin details object combining manifest and info
      const pluginDetails: IPluginDetails = {
        id: manifest.pluginId || pluginId,
        name: manifest.name || pluginId,
        description: manifest.description || 'No description available',
        author: manifest.author || 'Unknown',
        version: manifest.version || '1.0.0',
        icon:
          (manifest as unknown as { icon: string }).icon ||
          '/images/logo512.png',
        homepage: pluginInfo.homepage || '',
        license: pluginInfo.license || 'MIT',
        tags: pluginInfo.tags || [],
        cdnUrl: '', // No longer used - keeping for compatibility
        readme: readmeContent,
        screenshots: (pluginInfo.screenshots || []).map((screenshot: string) =>
          screenshot.startsWith('assets/')
            ? `/src/plugin/available/${pluginId}/${screenshot}`
            : screenshot,
        ),
        features: features,
        changelog: pluginInfo.changelog || [],
      };

      return pluginDetails;
    } catch (error) {
      console.error(`Failed to get plugin details for ${pluginId}:`, error);
      return null;
    }
  }
}

/**
 * Singleton instance export
 */
export const adminPluginFileService = AdminPluginFileService.getInstance();
