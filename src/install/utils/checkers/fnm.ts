import type { IPackageStatus } from '../../types';
import { checkVersion, commandExists } from '../exec';

export async function checkFnm(): Promise<IPackageStatus> {
  const exists = await commandExists('fnm');
  if (!exists) {
    return { name: 'fnm', installed: false };
  }
  const version = await checkVersion('fnm');
  return { name: 'fnm', installed: true, version: version || undefined };
}
