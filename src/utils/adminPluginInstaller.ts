import JSZip from 'jszip';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';

import {
  UPLOAD_PLUGIN_ZIP_MUTATION,
  CREATE_PLUGIN_MUTATION,
} from '../GraphQl/Mutations/PluginMutations';
import { adminPluginFileService } from '../plugin/services/AdminPluginFileService';

export interface IAdminPluginManifest {
  name: string;
  version: string;
  description: string;
  author: string;
  main: string;
  pluginId: string;
  extensionPoints?: {
    routes?: Array<{
      pluginId: string;
      path: string;
      component: string;
      exact: boolean;
    }>;
  };
}

export interface IAdminPluginZipStructure {
  hasAdminFolder: boolean;
  hasApiFolder: boolean;
  adminManifest?: IAdminPluginManifest;
  apiManifest?: IAdminPluginManifest;
  pluginId?: string;
  files: Record<string, string>;
  apiFiles?: string[];
}

export interface IAdminPluginInstallationResult {
  success: boolean;
  pluginId: string;
  manifest: IAdminPluginManifest;
  installedComponents: string[];
  error?: string;
}

export interface IAdminPluginInstallationOptions {
  zipFile: File;
  backup?: boolean;
  apolloClient?: ApolloClient<NormalizedCacheObject>;
}

/**
 * Validates the structure of a plugin zip file (supports both admin and API)
 */
export async function validateAdminPluginZip(
  zipFile: File,
): Promise<IAdminPluginZipStructure> {
  const zip = new JSZip();
  const zipContent = await zip.loadAsync(zipFile);

  const structure: IAdminPluginZipStructure = {
    hasAdminFolder: false,
    hasApiFolder: false,
    files: {},
  };

  // Check for admin folder structure
  const adminFiles = Object.keys(zipContent.files).filter(
    (fileName) => fileName.startsWith('admin/') && !fileName.endsWith('/'),
  );

  if (adminFiles.length > 0) {
    structure.hasAdminFolder = true;

    // Load all admin files
    for (const fileName of adminFiles) {
      const file = zipContent.file(fileName);
      if (file) {
        const relativePath = fileName.substring(6); // Remove "admin/" prefix

        // Check if this is a binary asset file
        const isBinaryAsset =
          /\.(png|jpg|jpeg|gif|svg|ico|webp|pdf|zip|tar|gz)$/i.test(fileName);

        if (isBinaryAsset) {
          // Handle binary files - store as base64 for now
          const binaryContent = await file.async('base64');
          structure.files[relativePath] =
            `data:application/octet-stream;base64,${binaryContent}`;
        } else {
          // Handle text files normally
          const content = await file.async('string');
          structure.files[relativePath] = content;
        }
      }
    }

    // Check for admin manifest
    const manifestFile = zipContent.file('admin/manifest.json');
    if (manifestFile) {
      const manifestContent = await manifestFile.async('string');
      try {
        const manifest = JSON.parse(manifestContent) as IAdminPluginManifest;

        // Validate required fields
        const requiredFields = [
          'name',
          'version',
          'description',
          'author',
          'main',
          'pluginId',
        ];
        const missingFields = requiredFields.filter(
          (field) => !manifest[field as keyof IAdminPluginManifest],
        );

        if (missingFields.length > 0) {
          throw new Error(
            `Missing required fields in admin manifest.json: ${missingFields.join(', ')}`,
          );
        }

        structure.adminManifest = manifest;
        structure.pluginId = manifest.pluginId;
      } catch {
        throw new Error('Invalid admin manifest.json');
      }
    } else {
      throw new Error('admin/manifest.json not found in the plugin ZIP');
    }
  }

  // Check for API folder structure
  const apiFiles = Object.keys(zipContent.files).filter(
    (fileName) => fileName.startsWith('api/') && !fileName.endsWith('/'),
  );

  if (apiFiles.length > 0) {
    structure.hasApiFolder = true;

    // Store API file paths for display
    structure.apiFiles = apiFiles.map((fileName) => fileName.substring(4)); // Remove "api/" prefix

    // Check for API manifest
    const apiManifestFile = zipContent.file('api/manifest.json');
    if (apiManifestFile) {
      const apiManifestContent = await apiManifestFile.async('string');
      try {
        const apiManifest = JSON.parse(
          apiManifestContent,
        ) as IAdminPluginManifest;

        // Validate required fields
        const requiredFields = [
          'name',
          'version',
          'description',
          'author',
          'main',
          'pluginId',
        ];
        const missingFields = requiredFields.filter(
          (field) => !apiManifest[field as keyof IAdminPluginManifest],
        );

        if (missingFields.length > 0) {
          throw new Error(
            `Missing required fields in api manifest.json: ${missingFields.join(', ')}`,
          );
        }

        structure.apiManifest = apiManifest;

        // Ensure both manifests have the same plugin ID
        if (structure.pluginId && structure.pluginId !== apiManifest.pluginId) {
          throw new Error(
            'Admin and API manifests must have the same pluginId',
          );
        }

        if (!structure.pluginId) {
          structure.pluginId = apiManifest.pluginId;
        }
      } catch {
        throw new Error('Invalid api manifest.json');
      }
    } else {
      throw new Error('api/manifest.json not found in the plugin ZIP');
    }
  }

  return structure;
}

/**
 * Validates admin plugin structure
 */
export function validateAdminPluginStructure(files: Record<string, string>): {
  valid: boolean;
  error?: string;
} {
  // Check for required manifest.json
  if (!files['manifest.json']) {
    return {
      valid: false,
      error: 'manifest.json is required',
    };
  }

  // Validate manifest.json format
  try {
    const manifest = JSON.parse(files['manifest.json']);

    const requiredFields = [
      'name',
      'pluginId',
      'version',
      'description',
      'author',
      'main',
    ];
    for (const field of requiredFields) {
      if (!manifest[field]) {
        return {
          valid: false,
          error: `Missing required field in manifest.json: ${field}`,
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

    return { valid: true };
  } catch {
    return {
      valid: false,
      error: 'Invalid manifest.json format',
    };
  }
}

/**
 * Installs a plugin from a zip file (supports both admin and API)
 * Flow: 1) Create plugin in DB, 2) Install files, 3) Installation is handled separately
 */
export async function installAdminPluginFromZip({
  zipFile,
  apolloClient,
}: IAdminPluginInstallationOptions): Promise<IAdminPluginInstallationResult> {
  try {
    // Validate zip structure
    const structure = await validateAdminPluginZip(zipFile);

    // Validate that the zip contains at least admin or API folder
    if (!structure.hasAdminFolder && !structure.hasApiFolder) {
      return {
        success: false,
        pluginId: '',
        manifest: {} as IAdminPluginManifest,
        installedComponents: [],
        error:
          "Zip file must contain either 'admin' or 'api' folder with valid plugin structure",
      };
    }

    const pluginId = structure.pluginId;
    const manifest = structure.adminManifest || structure.apiManifest;

    if (!pluginId || !manifest) {
      return {
        success: false,
        pluginId: '',
        manifest: {} as IAdminPluginManifest,
        installedComponents: [],
        error: 'Invalid plugin structure: missing pluginId or manifest',
      };
    }
    const installedComponents: string[] = [];

    // STEP 1: Create plugin in database first (basic entry with isInstalled: false)
    if (apolloClient) {
      try {
        await apolloClient.mutate({
          mutation: CREATE_PLUGIN_MUTATION,
          variables: {
            input: {
              pluginId: pluginId,
            },
          },
        });
      } catch (error) {
        console.error('Failed to create plugin in database:', error);
        // If plugin already exists in DB, that's okay, continue
        if (
          !(error instanceof Error) ||
          !error.message?.includes('already exists')
        ) {
          throw new Error(
            `Failed to create plugin in database: ${error instanceof Error ? error.message : 'Unknown error'}`,
          );
        }
      }
    }

    // STEP 2: Install API component if present (this will handle file upload)
    if (structure.hasApiFolder && apolloClient) {
      try {
        const result = await apolloClient.mutate({
          mutation: UPLOAD_PLUGIN_ZIP_MUTATION,
          variables: {
            input: {
              pluginZip: zipFile,
              activate: false, // Don't activate yet
            },
          },
        });

        if (result.data?.uploadPluginZip) {
          installedComponents.push('API');
        }
      } catch (error) {
        console.error('Failed to install API component:', error);
        throw new Error(
          `Failed to install API component: ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
      }
    }

    // STEP 3: Install admin component if present (write files to available folder via server)
    if (structure.hasAdminFolder) {
      try {
        // Validate admin plugin structure
        const validation = validateAdminPluginStructure(structure.files);
        if (!validation.valid) {
          throw new Error(
            `Invalid admin plugin structure: ${validation.error}`,
          );
        }

        // Use internal plugin file service to write files
        const result = await adminPluginFileService.installPlugin(
          pluginId,
          structure.files,
        );

        if (!result.success) {
          throw new Error(`Failed to install admin plugin: ${result.error}`);
        }

        // Plugin manager will automatically discover this plugin via GraphQL
        // and load it from the available folder
        installedComponents.push('Admin');
      } catch (error) {
        console.error('Failed to install admin component:', error);
        throw error;
      }
    }

    return {
      success: true,
      pluginId,
      manifest,
      installedComponents,
    };
  } catch (error) {
    console.error('Plugin upload failed:', error);
    return {
      success: false,
      pluginId: '',
      manifest: {} as IAdminPluginManifest,
      installedComponents: [],
      error: error instanceof Error ? error.message : 'Failed to upload plugin',
    };
  }
}

/**
 * Gets all installed admin plugins from the file system via server API
 */
export async function getInstalledAdminPlugins(): Promise<
  Array<{
    pluginId: string;
    manifest: IAdminPluginManifest;
    installedAt: string;
  }>
> {
  try {
    const plugins = await adminPluginFileService.getInstalledPlugins();
    return plugins.map((plugin) => ({
      pluginId: plugin.pluginId,
      manifest: plugin.manifest,
      installedAt: plugin.installedAt,
    }));
  } catch (error) {
    console.error('Failed to get installed admin plugins:', error);
    return [];
  }
}

/**
 * Removes an admin plugin from the file system via server API
 */
export async function removeAdminPlugin(pluginId: string): Promise<boolean> {
  try {
    const success = await adminPluginFileService.removePlugin(pluginId);

    if (success) {
      return true;
    } else {
      console.error(`Failed to remove admin plugin ${pluginId}`);
      return false;
    }
  } catch (error) {
    console.error(`Failed to remove admin plugin ${pluginId}:`, error);
    return false;
  }
}
