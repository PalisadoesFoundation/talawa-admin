/**
 * Core utilities for the VS Code-inspired plugin system
 */

import { IPluginManifest, IDrawerExtension } from './types';

export function validatePluginManifest(
  manifest: any,
): manifest is IPluginManifest {
  return (
    typeof manifest === 'object' &&
    typeof manifest.name === 'string' &&
    typeof manifest.version === 'string' &&
    typeof manifest.description === 'string' &&
    typeof manifest.author === 'string' &&
    typeof manifest.main === 'string'
  );
}

export function generatePluginId(manifest: IPluginManifest): string {
  return manifest.name.toLowerCase().replace(/\s+/g, '-');
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
