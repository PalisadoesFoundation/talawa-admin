import type { IPackageStatus } from '../../types';
import { checkVersion, commandExists } from '../exec';

export async function checkGit(): Promise<IPackageStatus> {
  const exists = await commandExists('git');
  if (!exists) {
    return { name: 'git', installed: false };
  }
  const version = await checkVersion('git');
  return { name: 'git', installed: true, version: version || undefined };
}
