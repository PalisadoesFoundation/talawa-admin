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

  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

  const newStatements = [];
  let modified = false;

  sourceFile.statements.forEach((node) => {
    if (
      ts.isImportDeclaration(node) &&
      ts.isStringLiteral(node.moduleSpecifier)
    ) {
      const source = node.moduleSpecifier.text;

      if (source !== MATERIAL && source !== ICONS) {
        newStatements.push(node);
        return;
      }

      // Skip type-only imports
      if (node.importClause && node.importClause.isTypeOnly) {
        newStatements.push(node);
        return;
      }

      const namedBindings =
        node.importClause && node.importClause.namedBindings;

      if (namedBindings && ts.isNamedImports(namedBindings)) {
        namedBindings.elements.forEach((element) => {
          const importedName = element.propertyName
            ? element.propertyName.text
            : element.name.text;

          const localName = element.name.text;

          const newImport = ts.factory.createImportDeclaration(
            undefined,
            ts.factory.createImportClause(
              false,
              ts.factory.createIdentifier(localName),
              undefined,
            ),
            ts.factory.createStringLiteral(`${source}/${importedName}`),
            undefined,
          );

          newStatements.push(newImport);
        });

        modified = true;
        return;
      }

      // Preserve default-only imports
      newStatements.push(node);
      return;
    }

    newStatements.push(node);
  });

  if (!modified) {
    console.log(`No changes in ${filePath}`);
    return;
  }

  const updatedSourceFile = ts.factory.updateSourceFile(
    sourceFile,
    newStatements,
  );

  const result = printer.printFile(updatedSourceFile);

  fs.writeFileSync(filePath, result, 'utf8');
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
