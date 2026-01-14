import type { IPackageStatus } from '../../types';
import { checkVersion, commandExists } from '../exec';

export async function checkTypeScript(): Promise<IPackageStatus> {
  const exists = await commandExists('tsc');
  if (!exists) {
    return { name: 'typescript', installed: false };
  }
  const version = await checkVersion('tsc');
  return {
    name: 'typescript',
    installed: true,
    version: version || undefined,
  };
}
