import type { IPackageStatus } from '../../types';
import { checkVersion, commandExists } from '../exec';

export async function checkNode(): Promise<IPackageStatus> {
  const exists = await commandExists('node');
  // const exists = false;
  if (!exists) {
    return { name: 'node', installed: false };
  }
  const version = await checkVersion('node');
  return { name: 'node', installed: true, version: version || undefined };
}
