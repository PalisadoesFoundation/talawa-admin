import type { IPackageStatus } from '../../types';
import { checkVersion, commandExists } from '../exec';

export async function checkDocker(): Promise<IPackageStatus> {
  const exists = await commandExists('docker');
  // const exists = false;
  if (!exists) {
    return { name: 'docker', installed: false };
  }
  const version = await checkVersion('docker');
  return { name: 'docker', installed: true, version: version || undefined };
}
