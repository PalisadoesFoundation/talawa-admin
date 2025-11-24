/**
 * Core utilities for the VS Code-inspired plugin system
 */

import { IPluginManifest, IDrawerExtension } from './types';

export function validatePluginManifest(manifest: unknown): boolean {
  if (!manifest || typeof manifest !== 'object') return false;

  // Type guard to narrow the type
  const manifestObj = manifest as Record<string, unknown>;

  const hasBasicFields =
    typeof manifestObj.name === 'string' &&
    typeof manifestObj.pluginId === 'string' &&
    typeof manifestObj.version === 'string' &&
    typeof manifestObj.description === 'string' &&
    typeof manifestObj.author === 'string' &&
    typeof manifestObj.main === 'string';

  if (!hasBasicFields) {
    return false;
  }

  // Validate extension points if they exist
  if (manifestObj.extensionPoints) {
    const extensionPoints = manifestObj.extensionPoints as Record<
      string,
      unknown
    >;
    const { routes, drawer } = extensionPoints;

    // Validate routes if they exist
    if (routes && !Array.isArray(routes)) {
      return false;
    }

    // Validate drawer items if they exist
    if (drawer && !Array.isArray(drawer)) {
      return false;
    }

    // Validate each route extension
    if (routes && Array.isArray(routes)) {
      for (const route of routes) {
        const routeObj = route as Record<string, unknown>;
        if (!routeObj.pluginId || !routeObj.path || !routeObj.component) {
          return false;
        }
      }
    }

    // Validate each drawer extension
    if (drawer && Array.isArray(drawer)) {
      for (const item of drawer) {
        const itemObj = item as Record<string, unknown>;
        if (!itemObj.pluginId || !itemObj.label || !itemObj.path) {
          return false;
        }
      }
    }
  }

  return true;
}

export function generatePluginId(manifest: IPluginManifest): string {
  return manifest.name.toLowerCase().replace(/\s+/g, '_');
}

export function sortDrawerItems(items: IDrawerExtension[]): IDrawerExtension[] {
  return items.sort((a, b) => (a.order || 999) - (b.order || 999));
}

export function filterByPermissions<
  T extends { permissions?: string[]; isAdmin?: boolean },
>(items: T[], userPermissions: string[], isAdmin: boolean = false): T[] {
  return items.filter((item) => {
    // Admin items are only for admin users
    if (item.isAdmin && !isAdmin) {
      return false;
    }

    // Check permissions - if no permissions required, allow access
    if (!item.permissions || item.permissions.length === 0) {
      return true;
    }

    // Check if user has required permissions
    return item.permissions.some((permission) =>
      userPermissions.includes(permission),
    );
  });
}

/**
 * Dynamically imports a plugin module
 * Extracted for better testability
 */
export const dynamicImportPlugin = (pluginId: string) => {
  return import(/* @vite-ignore */ `/plugins/${pluginId}/index.ts`);
};
