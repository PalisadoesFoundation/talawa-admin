import fs from 'fs';
import path from 'path';
import ts from 'typescript';

const MATERIAL = '@mui/material';
const ICONS = '@mui/icons-material';

const red = (text) => `\u001b[31m${text}\u001b[0m`;
const green = (text) => `\u001b[32m${text}\u001b[0m`;
const bold = (text) => `\u001b[1m${text}\u001b[0m`;

const parseArgs = (argv) => {
  const filesFlagIndex = argv.indexOf('--files');
  const rawFiles =
    filesFlagIndex !== -1
      ? argv.slice(filesFlagIndex + 1).filter((arg) => !arg.startsWith('--'))
      : argv.filter((arg) => !arg.startsWith('--'));

  if (!rawFiles.length) {
    console.error(
      red(
        'No files provided. Usage: node scripts/convert-mui-imports.js --files <file ...>',
      ),
    );
    process.exitCode = 1;
    return [];
  }

  return [...new Set(rawFiles.map((file) => path.resolve(file)))];
};

const transformFile = (filePath) => {
  if (!fs.existsSync(filePath)) {
    console.warn(red(`Skipping missing file: ${filePath}`));
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
        const start = node.getStart(sourceFile);
        const end = node.getEnd();

        const replacements = node.importClause.namedBindings.elements.map(
          (element) => {
            const importedName = element.propertyName
              ? element.propertyName.text
              : element.name.text;

            const localName = element.name.text;

            return `import ${localName} from '${source}/${importedName}';`;
          },
        );

        edits.push({
          start,
          end,
          text: replacements.join('\n'),
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
    green('Converted:'),
    bold(path.relative(process.cwd(), filePath)),
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
      console.error(red(`Error processing ${file}:`), error);
      errorCount++;
    }
  }

  if (errorCount > 0) {
    process.exitCode = 1;
  } else {
    console.log(green('✓ MUI import conversion completed successfully.'));
  }
};

main();
