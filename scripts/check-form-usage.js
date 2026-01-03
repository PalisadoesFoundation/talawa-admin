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
    let files;
    try {
      files = fsModule.readdirSync(directory);
    } catch (error) {
      console.warn(
        `Warning: Could not read directory ${directory}: ${error.message}`,
      );
      return;
    }

    for (const file of files) {
      const filePath = pathModule.join(directory, file);
      let stat;
      try {
        stat = fsModule.statSync(filePath);
      } catch (error) {
        console.warn(
          `Warning: Could not stat file ${filePath}: ${error.message}`,
        );
        continue;
      }

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
        let content;
        try {
          content = fsModule.readFileSync(filePath, 'utf8');
        } catch (error) {
          console.warn(
            `Warning: Could not read file ${filePath}: ${error.message}`,
          );
          continue;
        }
        const lines = content.split('\n');

        let inBlockComment = false;

        lines.forEach((line, index) => {
          const trimmedLine = line.trim();

          // Track block comment state
          if (inBlockComment) {
            if (trimmedLine.includes('*/')) {
              inBlockComment = false;
            }
            return; // Skip lines inside block comments
          }

          if (trimmedLine.includes('/*')) {
            inBlockComment = true;
            if (trimmedLine.includes('*/')) {
              inBlockComment = false; // Single-line block comment
            }
          }
          if (trimmedLine.startsWith('//') || trimmedLine.startsWith('*')) {
            return;
          }
          const codeBeforeComment = line.split('//')[0];
          // Don't match if inside strings
          // Don't match if inside strings (basic heuristic)
          // Count quotes before the match to determine if inside string
          const match = DEPRECATED_PATTERNS.exec(codeBeforeComment);
          if (match) {
            const beforeMatch = line.substring(0, match.index);
            const singleQuotes = (beforeMatch.match(/'/g) || []).length;
            const doubleQuotes = (beforeMatch.match(/"/g) || []).length;
            const backticks = (beforeMatch.match(/`/g) || []).length;

            // If odd number of quotes before match, likely inside string
            const likelyInString =
              singleQuotes % 2 !== 0 ||
              doubleQuotes % 2 !== 0 ||
              backticks % 2 !== 0;

            if (!likelyInString) {
              const relativePath = pathModule.relative(process.cwd(), filePath);
              violations.push(`${relativePath}:${index + 1}: ${line.trim()}`);
            }
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
