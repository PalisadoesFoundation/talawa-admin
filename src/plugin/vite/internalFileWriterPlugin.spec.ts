import { describe, it, expect } from 'vitest';
import {
  createInternalFileWriterPlugin,
  type InternalFileWriterPluginOptions,
} from './internalFileWriterPlugin';

describe('createInternalFileWriterPlugin', () => {
  it('should create a plugin with default options', () => {
    const plugin = createInternalFileWriterPlugin();
    expect(plugin).toBeDefined();
    expect(plugin.name).toBe('internal-file-writer');
    expect(typeof plugin.configureServer).toBe('function');
    expect(typeof plugin.configResolved).toBe('function');
  });

  it('should create a disabled plugin when enabled is false', () => {
    const plugin = createInternalFileWriterPlugin({ enabled: false });
    expect(plugin).toBeDefined();
    expect(plugin.name).toBe('internal-file-writer-disabled');
    expect(typeof plugin.configResolved).toBe('function');
  });

  it('should use custom options', () => {
    const options: InternalFileWriterPluginOptions = {
      enabled: true,
      debug: true,
      basePath: 'custom/path',
    };
    const plugin = createInternalFileWriterPlugin(options);
    expect(plugin).toBeDefined();
    expect(plugin.name).toBe('internal-file-writer');
  });
});
