import JSZip from 'jszip';
import {
  UPLOAD_PLUGIN_ZIP_MUTATION,
  CREATE_PLUGIN_MUTATION,
} from '../GraphQl/Mutations/PluginMutations';
import { adminPluginFileService } from 'plugin/services/AdminPluginFileService';

interface IUploadPluginZipResponse {
  data?: {
    uploadPluginZip?: boolean;
  };
}

// Shared list of required manifest fields
const REQUIRED_MANIFEST_FIELDS: Array<keyof IAdminPluginManifest> = [
  'name',
  'version',
  'description',
  'author',
  'main',
  'pluginId',
];

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
  manifest?: IAdminPluginManifest;
  installedComponents: string[];
  error?: string;
}

export interface IAdminApolloClient {
  mutate(options: {
    mutation: unknown;
    variables?: Record<string, unknown>;
  }): Promise<{ data?: unknown }>;
}

export interface IAdminPluginInstallationOptions {
  zipFile: File;
  apolloClient?: IAdminApolloClient;
}

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

  // ADMIN FOLDER
  const adminFiles = Object.keys(zipContent.files).filter(
    (f) => f.startsWith('admin/') && !f.endsWith('/'),
  );

  if (adminFiles.length > 0) {
    structure.hasAdminFolder = true;

    for (const fileName of adminFiles) {
      const file = zipContent.file(fileName);
      if (file) {
        const rel = fileName.substring(6);
        const isBinary =
          /\.(png|jpg|jpeg|gif|svg|ico|webp|pdf|zip|tar|gz)$/i.test(fileName);

        structure.files[rel] = isBinary
          ? `data:application/octet-stream;base64,${await file.async('base64')}`
          : await file.async('string');
      }
    }

    // MANIFEST
    const manifestFile = zipContent.file('admin/manifest.json');
    if (!manifestFile) {
      throw new Error('admin/manifest.json not found in the plugin ZIP');
    }

    try {
      const manifestJson = await manifestFile.async('string');
      const manifest = JSON.parse(manifestJson) as IAdminPluginManifest;

      const missing = REQUIRED_MANIFEST_FIELDS.filter((k) => !manifest[k]);

      if (missing.length > 0) {
        throw new Error(
          `Missing required fields in admin manifest.json: ${missing.join(
            ', ',
          )}`,
        );
      }

      structure.adminManifest = manifest;
      structure.pluginId = manifest.pluginId;
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Invalid admin manifest.json: ${msg}`);
    }
  }

  // API FOLDER
  const apiFiles = Object.keys(zipContent.files).filter(
    (f) => f.startsWith('api/') && !f.endsWith('/'),
  );

  if (apiFiles.length > 0) {
    structure.hasApiFolder = true;
    structure.apiFiles = apiFiles.map((f) => f.substring(4));

    const apiManifestFile = zipContent.file('api/manifest.json');
    if (!apiManifestFile) {
      throw new Error('api/manifest.json not found in the plugin ZIP');
    }

    try {
      const manifestJson = await apiManifestFile.async('string');
      const apiManifest = JSON.parse(manifestJson) as IAdminPluginManifest;

      const missing = REQUIRED_MANIFEST_FIELDS.filter((k) => !apiManifest[k]);

      if (missing.length > 0) {
        throw new Error(
          `Missing required fields in api manifest.json: ${missing.join(', ')}`,
        );
      }

      structure.apiManifest = apiManifest;

      // Ensure IDs match
      if (structure.pluginId && structure.pluginId !== apiManifest.pluginId) {
        throw new Error('Admin and API manifests must have the same pluginId');
      }

      if (!structure.pluginId) {
        structure.pluginId = apiManifest.pluginId;
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Invalid api manifest.json: ${msg}`);
    }
  }

  return structure;
}

export function validateAdminPluginStructure(files: Record<string, string>) {
  if (!files['manifest.json']) {
    return { valid: false, error: 'manifest.json is required' };
  }

  try {
    const manifest = JSON.parse(files['manifest.json']);

    const required = [
      'name',
      'pluginId',
      'version',
      'description',
      'author',
      'main',
    ];

    for (const f of required) {
      if (!manifest[f]) {
        return { valid: false, error: `Missing required field: ${f}` };
      }
    }

    if (!files[manifest.main]) {
      return { valid: false, error: `Main file not found: ${manifest.main}` };
    }

    return { valid: true };
  } catch {
    return { valid: false, error: 'Invalid manifest.json format' };
  }
}

export async function installAdminPluginFromZip(
  options: IAdminPluginInstallationOptions,
): Promise<IAdminPluginInstallationResult> {
  const { zipFile, apolloClient } = options;

  try {
    const structure = await validateAdminPluginZip(zipFile);

    if (!structure.pluginId) {
      throw new Error('pluginId missing in plugin ZIP');
    }

    const pluginId = structure.pluginId;

    // Choose manifest defensively; if none, fail early.
    const manifest = structure.adminManifest ?? structure.apiManifest;

    const installedComponents: string[] = [];

    // STEP 1: Create plugin in DB
    if (apolloClient) {
      try {
        await apolloClient.mutate({
          mutation: CREATE_PLUGIN_MUTATION,
          variables: { input: { pluginId } },
        });
      } catch (error) {
        const msg = error instanceof Error ? error.message : '';
        if (!msg.includes('already exists')) {
          throw new Error(
            `Failed to create plugin in database: ${msg || 'Unknown error'}`,
          );
        }
      }
    }

    // STEP 2: Install API part
    if (structure.hasApiFolder && apolloClient) {
      try {
        const resp = (await apolloClient.mutate({
          mutation: UPLOAD_PLUGIN_ZIP_MUTATION,
          variables: { input: { pluginZip: zipFile, activate: false } },
        })) as IUploadPluginZipResponse;

        if (resp.data?.uploadPluginZip) {
          installedComponents.push('API');
        }
      } catch (error) {
        const msg = error instanceof Error ? error.message : '';
        throw new Error(`Failed to install API component: ${msg}`);
      }
    }

    // STEP 3: Install Admin part
    if (structure.hasAdminFolder) {
      const validation = validateAdminPluginStructure(structure.files);

      if (!validation.valid) {
        throw new Error(`Invalid admin structure: ${validation.error}`);
      }

      const result = await adminPluginFileService.installPlugin(
        pluginId,
        structure.files,
      );

      if (!result.success) {
        throw new Error(`Failed to install admin plugin: ${result.error}`);
      }

      installedComponents.push('Admin');
    }

    return {
      success: true,
      pluginId,
      manifest,
      installedComponents,
    };
  } catch (err) {
    return {
      success: false,
      pluginId: '',
      manifest: undefined,
      installedComponents: [],
      error: err instanceof Error ? err.message : 'Failed to upload plugin',
    };
  }
}

export async function getInstalledAdminPlugins() {
  try {
    const plugins = await adminPluginFileService.getInstalledPlugins();

    return plugins.map((p) => ({
      pluginId: p.pluginId,
      manifest: p.manifest,
      installedAt: p.installedAt,
    }));
  } catch (error) {
    console.error('Failed to get installed plugins:', error);
    return [];
  }
}

export async function removeAdminPlugin(pluginId: string) {
  try {
    return await adminPluginFileService.removePlugin(pluginId);
  } catch (error) {
    console.error(`Failed to remove plugin ${pluginId}:`, error);
    return false;
  }
}

// Backward compatibility for old imports
/** @deprecated Use IAdminPluginManifest instead */
export type AdminPluginManifest = IAdminPluginManifest;
/** @deprecated Use IAdminPluginZipStructure instead */
export type AdminPluginZipStructure = IAdminPluginZipStructure;
/** @deprecated Use IAdminPluginInstallationResult instead */
export type AdminPluginInstallationResult = IAdminPluginInstallationResult;
/** @deprecated Use IAdminPluginInstallationOptions instead */
export type AdminPluginInstallationOptions = IAdminPluginInstallationOptions;
