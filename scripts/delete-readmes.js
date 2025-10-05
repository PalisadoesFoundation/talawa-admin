
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const directory = 'docs/docs/auto-docs';

export function deleteReadmeFiles(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`Directory not found: ${dir}`);
    return;
  }

  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.lstatSync(filePath);

    if (stat.isDirectory()) {
      deleteReadmeFiles(filePath);
    } else if (path.basename(filePath) === 'README.md') {
      fs.unlinkSync(filePath);
      console.log(`Deleted: ${filePath}`);
    }
  });
}

const isExecutedDirectly = (() => {
  if (typeof process === 'undefined' || !Array.isArray(process.argv)) {
    return false;
  }

  const currentFilePath = fileURLToPath(import.meta.url);
  const executedPath = process.argv[1] ? path.resolve(process.argv[1]) : '';

  return currentFilePath === executedPath;
})();

if (isExecutedDirectly) {
  deleteReadmeFiles(directory);
}
