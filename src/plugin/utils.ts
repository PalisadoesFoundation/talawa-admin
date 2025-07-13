/**
 * Core utilities for the VS Code-inspired plugin system
 */

import { IPluginManifest, IDrawerExtension } from './types';

export function validatePluginManifest(manifest: any): boolean {
  if (!manifest || typeof manifest !== 'object') return false;
  const hasBasicFields =
    typeof manifest === 'object' &&
    typeof manifest.name === 'string' &&
    typeof manifest.pluginId === 'string' &&
    typeof manifest.version === 'string' &&
    typeof manifest.description === 'string' &&
    typeof manifest.author === 'string' &&
    typeof manifest.main === 'string';

  if (!hasBasicFields) {
    return false;
  }

  // Validate extension points if they exist
  if (manifest.extensionPoints) {
    const { routes, drawer } = manifest.extensionPoints;

    // Validate routes if they exist
    if (routes && !Array.isArray(routes)) {
      return false;
    }

    // Validate drawer items if they exist
    if (drawer && !Array.isArray(drawer)) {
      return false;
    }

    // Validate each route extension
    if (routes) {
      for (const route of routes) {
        if (!route.pluginId || !route.path || !route.component) {
          return false;
        }
      }
    }

    // Validate each drawer extension
    if (drawer) {
      for (const item of drawer) {
        if (!item.pluginId || !item.label || !item.path) {
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
