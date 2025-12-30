import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEPRECATED_PATTERNS = /Form\.(Group|Control|Label|Check)/;
const SCREENS_DIR = path.join(__dirname, '..', 'src', 'screens');

function checkDirectory(dir) {
  const violations = [];

  if (!fs.existsSync(dir)) {
    console.log('src/screens directory not found, skipping check');
    return violations;
  }

  function scanDir(directory) {
    const files = fs.readdirSync(directory);

    for (const file of files) {
      const filePath = path.join(directory, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        scanDir(filePath);
      } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n');

        lines.forEach((line, index) => {
          if (DEPRECATED_PATTERNS.test(line)) {
            const relativePath = path.relative(process.cwd(), filePath);
            violations.push(`${relativePath}:${index + 1}: ${line.trim()}`);
          }
        });
      }
    }
  }

  scanDir(dir);
  return violations;
}

const violations = checkDirectory(SCREENS_DIR);

if (violations.length > 0) {
  console.error('\n=== Found deprecated Form usage in src/screens/: ===\n');
  violations.forEach(v => console.error(`  ${v}`));
  console.error('\n=== Please migrate to FormFieldGroup components ===');
  console.error('=> See: src/shared-components/FormFieldGroup/README.md\n');
  process.exit(1);
} else {
  console.log('No deprecated Form usage found');
}
