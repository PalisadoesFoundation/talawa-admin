import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const DEPRECATED_PATTERNS = /Form\.(Group|Control|Label|Check)/;

function checkDirectory(dir, fsModule = fs, pathModule = path) {
  const violations = [];

  if (!fsModule.existsSync(dir)) {
    console.log('src/screens directory not found, skipping check');
    return violations;
  }

  function scanDir(directory) {
    const files = fsModule.readdirSync(directory);

    for (const file of files) {
      const filePath = pathModule.join(directory, file);
      const stat = fsModule.statSync(filePath);

      if (stat.isDirectory()) {
        scanDir(filePath);
      } else if (
        (file.endsWith('.tsx') || file.endsWith('.ts')) &&
        !file.endsWith('.test.ts') &&
        !file.endsWith('.test.tsx') &&
        !file.endsWith('.spec.tsx') &&
        !file.endsWith('.spec.ts') &&
        !file.endsWith('.md') &&
        !file.includes('README')
      ) {
        const content = fsModule.readFileSync(filePath, 'utf8');
        const lines = content.split('\n');

        lines.forEach((line, index) => {
          const trimmedLine = line.trim();
          if (
            trimmedLine.startsWith('//') ||
            trimmedLine.startsWith('/*') ||
            trimmedLine.startsWith('*')
          ) {
            return;
          }

          // Don't match if inside strings
          if (
            DEPRECATED_PATTERNS.test(line) &&
            !line.match(/['"`].*Form\.(Group|Control|Label|Check).*['"`]/)
          ) {
            const relativePath = pathModule.relative(process.cwd(), filePath);
            violations.push(`${relativePath}:${index + 1}: ${line.trim()}`);
          }
        });
      }
    }
  }

  scanDir(dir);
  return violations;
}

export function checkFormUsage(fsModule = fs, pathModule = path) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = pathModule.dirname(__filename);
  const SCREENS_DIR = pathModule.join(__dirname, '..', 'src', 'screens');

  const violations = checkDirectory(SCREENS_DIR, fsModule, pathModule);

  if (violations.length > 0) {
    console.error('\n=== Found deprecated Form usage in src/screens/: ===\n');
    violations.forEach((v) => console.error(`  ${v}`));
    console.error('\n=== Please migrate to FormFieldGroup components ===');
    console.error('=> See: src/shared-components/FormFieldGroup/README.md\n');
    process.exit(1);
  } else {
    console.log('No deprecated Form usage found');
  }
}

if (import.meta.url.startsWith('file://')) {
  const modulePath = fileURLToPath(import.meta.url);
  const scriptPath = process.argv[1];
  if (modulePath === scriptPath) {
    checkFormUsage();
  }
}
