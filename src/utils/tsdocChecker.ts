import { readdir, stat, readFile } from 'fs/promises';
import { realpathSync as realpathSyncFn } from 'fs';
import path from 'path';

export const filesToSkip: readonly string[] = [
  'index.tsx',
  'EventActionItems.tsx',
  'OrgPostCard.tsx',
  'UsersTableItem.tsx',
  'FundCampaignPledge.tsx',
];

export async function findTsxFiles(dir: string): Promise<string[]> {
  let results: string[] = [];

  try {
    const entries = await readdir(dir);

    for (const entry of entries) {
      const filePath = path.join(dir, entry);
      const fileStat = await stat(filePath);

      if (fileStat.isDirectory()) {
        results = results.concat(await findTsxFiles(filePath));
        continue;
      }

      const isTsxFile = filePath.endsWith('.tsx');
      const isTestFile =
        filePath.endsWith('.test.tsx') || filePath.endsWith('.spec.tsx');
      const relativePath = path.relative(dir, filePath);
      const isSkipped = filesToSkip.includes(relativePath);

      if (isTsxFile && !isTestFile && !isSkipped) {
        results.push(filePath);
      }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Error reading directory ${dir}: ${message}`);
  }

  return results;
}

export async function containsTsDocComment(filePath: string): Promise<boolean> {
  try {
    const content = await readFile(filePath, 'utf8');
    return /\/\*\*[\s\S]*?\*\//.test(content);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Error reading file ${filePath}: ${message}`);
    return false;
  }
}

export async function run(
  directory = process.argv[2] || './src',
): Promise<void> {
  const files = await findTsxFiles(directory);
  const filesWithoutTsDoc: string[] = [];

  for (const file of files) {
    if (!(await containsTsDocComment(file))) {
      filesWithoutTsDoc.push(file);
    }
  }

  if (filesWithoutTsDoc.length > 0) {
    filesWithoutTsDoc.forEach((file) => {
      console.error(`No TSDoc comment found in file: ${file}`);
    });
    process.exit(1);
  }
}

export function shouldRunCli(
  argv: string[] = process.argv,
  resolver: (modulePath: string) => string = realpathSyncFn,
  currentModulePath?: string,
): boolean {
  const invoked = argv[1];

  if (!invoked || !currentModulePath) {
    return false;
  }

  try {
    const resolved = resolver(path.resolve(invoked));
    return resolved === currentModulePath;
  } catch {
    return false;
  }
}

export async function handleCliInvocation(
  runFn: () => Promise<void> | void = run,
  argv: string[] = process.argv,
  resolver: (modulePath: string) => string = realpathSyncFn,
  currentModulePath?: string,
): Promise<void> {
  if (!currentModulePath) {
    return;
  }

  if (!shouldRunCli(argv, resolver, currentModulePath)) {
    return;
  }

  try {
    await runFn();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`check-tsdoc failed: ${message}`);
    process.exit(1);
  }
}
