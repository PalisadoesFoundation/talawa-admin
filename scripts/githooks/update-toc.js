import fs from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '../..');

const markdownFiles = fs
  .readdirSync(projectRoot)
  .filter((file) => file.endsWith('.md'));

// Check if markdown-toc is available locally
let markdownTocAvailable = false;
try {
  // Try to find markdown-toc in node_modules
  const nodeModulesPath = join(projectRoot, 'node_modules', 'markdown-toc');
  if (fs.existsSync(nodeModulesPath)) {
    markdownTocAvailable = true;
  }
} catch (error) {
  // If we can't check, assume it's not available
  markdownTocAvailable = false;
}

if (!markdownTocAvailable) {
  console.warn(
    'Warning: markdown-toc is not installed locally. Skipping TOC update to avoid network requests.',
  );
  console.warn(
    'To fix this, run: npm install --save-dev markdown-toc',
  );
  console.warn(
    'Or if you have network issues, you can skip this step for now.',
  );
  process.exit(0);
}

markdownFiles.forEach((file) => {
  try {
    const filePath = join(projectRoot, file);
    // Use local installation directly
    const command = `node "${join(
      projectRoot,
      'node_modules',
      '.bin',
      'markdown-toc',
    )}" -i "${filePath}" --bullets "-"`;
    execSync(command, {
      stdio: 'inherit',
      cwd: projectRoot,
    });
  } catch (error) {
    // If update fails, log warning but don't fail the commit
    console.warn(
      `Warning: Could not update TOC for ${file}: ${error.message}`,
    );
  }
});

console.log('Table of contents updated successfully.');