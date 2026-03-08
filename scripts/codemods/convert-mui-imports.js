/**
 * Converts MUI barrel imports into deep imports.
 *
 * This codemod scans the provided files and replaces imports from
 * `@mui/material` and `@mui/icons-material` with their corresponding
 * deep import paths when available.
 *
 * Example:
 *   import { Dialog } from '@mui/material';
 *
 * becomes:
 *   import Dialog from '@mui/material/Dialog';
 *
 * Imports that do not have a valid deep import path, type-only imports,
 * or wrapper-enforced components (e.g. Autocomplete, Chip, Table) are
 * preserved as barrel imports to avoid breaking changes.
 *
 * Usage:
 *   node scripts/codemods/convert-mui-imports.js --files <file1> <file2> ...
 *
 * Example:
 *   pnpm convert-mui --files src/components/Button.tsx
 */
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import ts from 'typescript';

const require = createRequire(import.meta.url);

const MATERIAL = '@mui/material';
const ICONS = '@mui/icons-material';

const WRAPPER_ENFORCED_SKIP = new Set([
  'Chip',
  'Autocomplete',
  'TextField',
  'FormControl',
  'Button',
  'Table',
  'TableBody',
  'TableCell',
  'TableContainer',
  'TableHead',
  'TableRow',
  'TablePagination',
]);

/**
 * Check whether `@mui/material/<name>` or `@mui/icons-material/<name>`
 * resolves to a real module (i.e. has its own directory/entry-point).
 * Type-only re-exports (AutocompleteProps, SvgIconTypeMap, …) and
 * utilities shipped under sub-paths (createTheme, ThemeProvider) do NOT
 * have a top-level deep-import path and must stay as barrel imports.
 */
const deepImportExistsCache = new Map();
const deepImportExists = (source, name) => {
  const key = `${source}/${name}`;
  if (deepImportExistsCache.has(key)) return deepImportExistsCache.get(key);
  try {
    require.resolve(key);
    deepImportExistsCache.set(key, true);
    return true;
  } catch {
    deepImportExistsCache.set(key, false);
    return false;
  }
};

const parseArgs = (argv) => {
  const filesFlagIndex = argv.indexOf('--files');
  const rawFiles =
    filesFlagIndex !== -1
      ? argv.slice(filesFlagIndex + 1).filter((arg) => !arg.startsWith('--'))
      : argv.filter((arg) => !arg.startsWith('--'));

  if (!rawFiles.length) {
    console.error(
      'No files provided. Usage: node scripts/codemods/convert-mui-imports.js --files <file ...>',
    );
    process.exitCode = 1;
    return [];
  }

  return [...new Set(rawFiles.map((file) => path.resolve(file)))];
};

const transformFile = (filePath) => {
  if (!fs.existsSync(filePath)) {
    console.warn(`Skipping missing file: ${filePath}`);
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');

  const sourceFile = ts.createSourceFile(
    filePath,
    content,
    ts.ScriptTarget.Latest,
    true,
    filePath.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );

  const edits = [];

  sourceFile.statements.forEach((node) => {
    if (
      ts.isImportDeclaration(node) &&
      ts.isStringLiteral(node.moduleSpecifier)
    ) {
      const source = node.moduleSpecifier.text;

      if (
        (source === MATERIAL || source === ICONS) &&
        node.importClause &&
        !node.importClause.isTypeOnly &&
        node.importClause.namedBindings &&
        ts.isNamedImports(node.importClause.namedBindings)
      ) {
        // Partition specifiers into convertible (has deep-import path)
        // and non-convertible (type-only re-exports, utilities, etc.)
        const convertible = [];
        const kept = [];

        for (const element of node.importClause.namedBindings.elements) {
          const importedName = element.propertyName
            ? element.propertyName.text
            : element.name.text;

          // Skip per-element type-only imports (`import { type Foo }`)
          if (element.isTypeOnly) {
            kept.push(element);
            continue;
          }

          // Skip wrapper-enforced components
          if (WRAPPER_ENFORCED_SKIP.has(importedName)) {
            kept.push(element);
            continue;
          }

          if (deepImportExists(source, importedName)) {
            convertible.push(element);
          } else {
            console.warn(
              `  Skipping "${importedName}" — no deep-import path at ${source}/${importedName}`,
            );
            kept.push(element);
          }
        }

        // Nothing to convert in this import
        if (convertible.length === 0) return;

        const start = node.getStart(sourceFile);
        const end = node.getEnd();

        // Build the replacement text
        const deepImports = convertible.map((element) => {
          const importedName = element.propertyName
            ? element.propertyName.text
            : element.name.text;
          const localName = element.name.text;
          return `import ${localName} from '${source}/${importedName}';`;
        });

        // If some specifiers must stay as barrel imports, keep them
        let barrelImport = '';
        if (kept.length > 0) {
          const specifiers = kept.map((element) => {
            const prefix = element.isTypeOnly ? 'type ' : '';
            if (element.propertyName) {
              return `${prefix}${element.propertyName.text} as ${element.name.text}`;
            }
            return `${prefix}${element.name.text}`;
          });
          barrelImport =
            'import { ' +
            specifiers.join(', ') +
            " } from '" +
            source +
            "';\n";
        }

        edits.push({
          start,
          end,
          text: barrelImport + deepImports.join('\n'),
        });
      }
    }
  });

  if (!edits.length) {
    console.log(`No changes in ${filePath}`);
    return;
  }

  // CRITICAL: apply in reverse order
  edits.sort((a, b) => b.start - a.start);

  let newContent = content;

  for (const edit of edits) {
    newContent =
      newContent.slice(0, edit.start) + edit.text + newContent.slice(edit.end);
  }

  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log(
    'Converted:',
    path.relative(process.cwd(), filePath),
  );
};

const main = () => {
  const files = parseArgs(process.argv.slice(2));
  if (!files.length) return;

  let errorCount = 0;

  for (const file of files) {
    try {
      transformFile(file);
    } catch (error) {
      console.error(`Error processing ${file}:`, error);
      errorCount++;
    }
  }

  if (errorCount > 0) {
    process.exitCode = 1;
  } else {
    console.log('✓ MUI import conversion completed successfully.');
  }
};

main();
