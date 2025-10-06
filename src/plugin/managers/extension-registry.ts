/**
 * Extension Registry Manager
 * Handles registration and management of plugin extension points
 */

import {
  IExtensionRegistry,
  IPluginManifest,
  ExtensionPointType,
} from '../types';

export class ExtensionRegistryManager {
  private extensionRegistry: IExtensionRegistry = {
    routes: [],
    drawer: [],
    RA1: [], // Route Admin Global
    RA2: [], // Route Admin Org
    RU1: [], // Route User Org
    RU2: [], // Route User Global
    DA1: [], // Drawer Admin Global
    DA2: [], // Drawer Admin Org
    DU1: [], // Drawer User Org
    DU2: [], // Drawer User Global
    G1: [], // General Injector 1
    G2: [], // General Injector 2
    G3: [], // General Injector 3 - Organization posts
    G4: [], // General Injector 4 - User portal posts
  };

  getExtensionRegistry(): IExtensionRegistry {
    return { ...this.extensionRegistry };
  }

  registerExtensionPoints(pluginId: string, manifest: IPluginManifest): void {
    this.clearRouteExtensions(pluginId);
    this.registerRouteExtensions(pluginId, manifest);

    this.clearDrawerExtensions(pluginId);
    this.registerDrawerExtensions(pluginId, manifest);

    this.clearInjectorExtensions(pluginId);
    this.registerInjectorExtensions(pluginId, manifest);
  }

  private clearRouteExtensions(pluginId: string): void {
    this.extensionRegistry.routes = this.extensionRegistry.routes.filter(
      (route) => route.pluginId !== pluginId,
    );
    this.extensionRegistry.RA1 = this.extensionRegistry.RA1.filter(
      (route) => route.pluginId !== pluginId,
    );
    this.extensionRegistry.RA2 = this.extensionRegistry.RA2.filter(
      (route) => route.pluginId !== pluginId,
    );
    this.extensionRegistry.RU1 = this.extensionRegistry.RU1.filter(
      (route) => route.pluginId !== pluginId,
    );
    this.extensionRegistry.RU2 = this.extensionRegistry.RU2.filter(
      (route) => route.pluginId !== pluginId,
    );
  }

  private registerRouteExtensions(
    pluginId: string,
    manifest: IPluginManifest,
  ): void {
    if (manifest.extensionPoints?.RA1) {
      manifest.extensionPoints.RA1.forEach((route) => {
        this.extensionRegistry.RA1.push({
          ...route,
          pluginId,
        });
      });
    }

    if (manifest.extensionPoints?.RA2) {
      manifest.extensionPoints.RA2.forEach((route) => {
        this.extensionRegistry.RA2.push({
          ...route,
          pluginId,
        });
      });
    }

    if (manifest.extensionPoints?.RU1) {
      manifest.extensionPoints.RU1.forEach((route) => {
        this.extensionRegistry.RU1.push({
          ...route,
          pluginId,
        });
      });
    }

    if (manifest.extensionPoints?.RU2) {
      manifest.extensionPoints.RU2.forEach((route) => {
        this.extensionRegistry.RU2.push({
          ...route,
          pluginId,
        });
      });
    }

    // Handle legacy routes array for backward compatibility
    if (manifest.extensionPoints?.routes) {
      manifest.extensionPoints.routes.forEach((route) => {
        this.extensionRegistry.routes.push({
          ...route,
          pluginId,
        });
      });
    }
  }

  private clearDrawerExtensions(pluginId: string): void {
    this.extensionRegistry.drawer = this.extensionRegistry.drawer.filter(
      (item) => item.pluginId !== pluginId,
    );
    this.extensionRegistry.DA1 = this.extensionRegistry.DA1.filter(
      (item) => item.pluginId !== pluginId,
    );
    this.extensionRegistry.DA2 = this.extensionRegistry.DA2.filter(
      (item) => item.pluginId !== pluginId,
    );
    this.extensionRegistry.DU1 = this.extensionRegistry.DU1.filter(
      (item) => item.pluginId !== pluginId,
    );
    this.extensionRegistry.DU2 = this.extensionRegistry.DU2.filter(
      (item) => item.pluginId !== pluginId,
    );
  }

  private registerDrawerExtensions(
    pluginId: string,
    manifest: IPluginManifest,
  ): void {
    if (manifest.extensionPoints?.DA1) {
      manifest.extensionPoints.DA1.forEach((item) => {
        this.extensionRegistry.DA1.push({
          ...item,
          pluginId,
        });
      });
    }

    if (manifest.extensionPoints?.DA2) {
      manifest.extensionPoints.DA2.forEach((item) => {
        this.extensionRegistry.DA2.push({
          ...item,
          pluginId,
        });
      });
    }

    if (manifest.extensionPoints?.DU1) {
      manifest.extensionPoints.DU1.forEach((item) => {
        this.extensionRegistry.DU1.push({
          ...item,
          pluginId,
        });
      });
    }

    if (manifest.extensionPoints?.DU2) {
      manifest.extensionPoints.DU2.forEach((item) => {
        this.extensionRegistry.DU2.push({
          ...item,
          pluginId,
        });
      });
    }

    // Handle legacy drawer array for backward compatibility
    if (manifest.extensionPoints?.drawer) {
      manifest.extensionPoints.drawer.forEach((item) => {
        this.extensionRegistry.drawer.push({
          ...item,
          pluginId,
        });
      });
    }
  }

  private clearInjectorExtensions(pluginId: string): void {
    this.extensionRegistry.G1 = this.extensionRegistry.G1.filter(
      (item) => item.pluginId !== pluginId,
    );
    this.extensionRegistry.G2 = this.extensionRegistry.G2.filter(
      (item) => item.pluginId !== pluginId,
    );
    this.extensionRegistry.G3 = this.extensionRegistry.G3.filter(
      (item) => item.pluginId !== pluginId,
    );
    this.extensionRegistry.G4 = this.extensionRegistry.G4.filter(
      (item) => item.pluginId !== pluginId,
    );
  }

  private registerInjectorExtensions(
    pluginId: string,
    manifest: IPluginManifest,
  ): void {
    if (manifest.extensionPoints?.G1) {
      manifest.extensionPoints.G1.forEach((item) => {
        this.extensionRegistry.G1.push({
          ...item,
          pluginId,
        });
      });
    }

    if (manifest.extensionPoints?.G2) {
      manifest.extensionPoints.G2.forEach((item) => {
        this.extensionRegistry.G2.push({
          ...item,
          pluginId,
        });
      });
    }

    if (manifest.extensionPoints?.G3) {
      manifest.extensionPoints.G3.forEach((item) => {
        this.extensionRegistry.G3.push({
          ...item,
          pluginId,
        });
      });
    }

    if (manifest.extensionPoints?.G4) {
      manifest.extensionPoints.G4.forEach((item) => {
        this.extensionRegistry.G4.push({
          ...item,
          pluginId,
        });
      });
    }
  }

  unregisterExtensionPoints(pluginId: string): void {
    this.clearRouteExtensions(pluginId);
    this.clearDrawerExtensions(pluginId);
    this.clearInjectorExtensions(pluginId);
  }

  getExtensionPoints<T extends keyof IExtensionRegistry>(
    type: T,
  ): IExtensionRegistry[T] {
    // Return the appropriate array based on type
    if (type === 'RA1') {
      return this.extensionRegistry.RA1 as IExtensionRegistry[T];
    }
    if (type === 'RA2') {
      return this.extensionRegistry.RA2 as IExtensionRegistry[T];
    }
    if (type === 'RU1') {
      return this.extensionRegistry.RU1 as IExtensionRegistry[T];
    }
    if (type === 'RU2') {
      return this.extensionRegistry.RU2 as IExtensionRegistry[T];
    }
    if (type === 'DA1') {
      return this.extensionRegistry.DA1 as IExtensionRegistry[T];
    }
    if (type === 'DA2') {
      return this.extensionRegistry.DA2 as IExtensionRegistry[T];
    }
    if (type === 'DU1') {
      return this.extensionRegistry.DU1 as IExtensionRegistry[T];
    }
    if (type === 'DU2') {
      return this.extensionRegistry.DU2 as IExtensionRegistry[T];
    }
    if (type === 'G1') {
      return this.extensionRegistry.G1 as IExtensionRegistry[T];
    }
    if (type === 'G2') {
      return this.extensionRegistry.G2 as IExtensionRegistry[T];
    }
    if (type === 'G3') {
      return this.extensionRegistry.G3 as IExtensionRegistry[T];
    }
    if (type === 'G4') {
      return this.extensionRegistry.G4 as IExtensionRegistry[T];
    }

    // Legacy support for routes and drawer
    if (type === ExtensionPointType.ROUTES) {
      return this.extensionRegistry.routes as IExtensionRegistry[T];
    }

    if (type === ExtensionPointType.DRAWER) {
      return this.extensionRegistry.drawer as IExtensionRegistry[T];
    }

    return this.extensionRegistry[type];
  }
}
