import { readdir, stat, readFile } from 'fs/promises';
import { realpathSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// List of files to skip
const filesToSkip = [
    'index.tsx', 
    'EventActionItems.tsx',
    'OrgPostCard.tsx',
    'UsersTableItem.tsx',
    'FundCampaignPledge.tsx'
];

// Recursively find all .tsx files, excluding files listed in filesToSkip
async function findTsxFiles(dir) {
  let results = [];
  try {
  const list = await readdir(dir);
    for (const file of list) {
      const filePath = path.join(dir, file);
  const fileStat = await stat(filePath);
  if (fileStat.isDirectory()) {
        results = results.concat(await findTsxFiles(filePath));
      } else if (
        filePath.endsWith('.tsx') &&
        !filePath.endsWith('.test.tsx') &&
        !filePath.endsWith('.spec.tsx') &&
        !filesToSkip.includes(path.relative(dir, filePath))
      ) {
        results.push(filePath);
      }
    }
  } catch (err) {
    console.error(`Error reading directory ${dir}: ${err.message}`);
  }
  return results;
}

// Check if a file contains at least one TSDoc comment
async function containsTsDocComment(filePath) {
  try {
  const content = await readFile(filePath, 'utf8');
    return /\/\*\*[\s\S]*?\*\//.test(content);
  } catch (err) {
    console.error(`Error reading file ${filePath}: ${err.message}`);
    return false;
  }
}

// Main function to run the validation
async function run(directory = process.argv[2] || './src') {
  const files = await findTsxFiles(directory);
  const filesWithoutTsDoc = [];

  for (const file of files) {
    if (!await containsTsDocComment(file)) {
      filesWithoutTsDoc.push(file);
    }
  }

  if (filesWithoutTsDoc.length > 0) {
    filesWithoutTsDoc.forEach(file => {
      console.error(`No TSDoc comment found in file: ${file}`);
    });
    process.exit(1);
  }
}

const modulePath = realpathSync(fileURLToPath(import.meta.url));

if (process.argv[1]) {
  let invokedPath;
  try {
    invokedPath = realpathSync(path.resolve(process.argv[1]));
  } catch {
    invokedPath = null;
  }

  if (invokedPath && invokedPath === modulePath) {
    run().catch((error) => {
      console.error(`check-tsdoc failed: ${error instanceof Error ? error.message : error}`);
      process.exit(1);
    });
  }
}

export { filesToSkip, findTsxFiles, containsTsDocComment, run };