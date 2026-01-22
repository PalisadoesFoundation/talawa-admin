// To check if your files contain the invalid css imports run the given command
// Run manually: pnpm exec tsx scripts/check-css-imports.js --files <file1> <file2> ...


import fs from 'fs';
import path from 'path';
import ts from 'typescript';

const CSS_EXTENSION_REGEX = /\.css$/;
const TS_EXTENSION_REGEX = /\.(ts|tsx)$/i;
const EXEMPT_FILES = [path.resolve('src/index.tsx')];
const red = (text) => `\u001b[31m${text}\u001b[0m`;
const bold = (text) => `\u001b[1m${text}\u001b[0m`;

const parseArgs = (argv) => {
  const filesFlagIndex = argv.indexOf('--files');
  const rawFiles =
    filesFlagIndex !== -1
      ? argv.slice(filesFlagIndex + 1).filter((arg) => !arg.startsWith('--'))
      : argv.filter((arg) => !arg.startsWith('--'));

  if (!rawFiles.length) {
    console.error(
      'No files provided. Usage: pnpm exec tsx scripts/check-css-imports.js --files <file ...>',
    );
    process.exitCode = 1;
    return [];
  }

  return [...new Set(rawFiles.map((file) => path.resolve(file)))];
};

const collectCssImports = (filePath, content) => {
  const sourceFile = ts.createSourceFile(
    filePath,
    content,
    ts.ScriptTarget.Latest,
    true,
    filePath.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );

  const imports = [];

  sourceFile.forEachChild(function walk(node) {
    if (ts.isImportDeclaration(node)) {
      const specifier = node.moduleSpecifier;
      if (ts.isStringLiteral(specifier) && CSS_EXTENSION_REGEX.test(specifier.text)) {
        const { line } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
        imports.push({ importPath: specifier.text, line: line + 1 });
      }
    }
    ts.forEachChild(node, walk);
  });

  return imports;
};

const validateFile = (filePath, content) => {
  const fileName = path.basename(filePath);
  const baseName = fileName
    .replace(TS_EXTENSION_REGEX, '')
    .replace(/(\.spec|\.test)$/, '');
  // i18n-ignore-next-line: technical file path pattern, not user-facing text
  const expectedPath = `./${baseName}.module.css`;

  const violations = [];
  const cssImports = collectCssImports(filePath, content);

  for (const cssImport of cssImports) {
    if (cssImport.importPath !== expectedPath) {
      violations.push({
        filePath,
        line: cssImport.line,
        importedPath: cssImport.importPath,
        expectedPath,
      });
    }
  }

  return violations;
};

const main = () => {
  const files = parseArgs(process.argv.slice(2));
  if (!files.length) {
    return;
  }

  const violations = [];

  for (const inputFile of files) {
    const filePath = path.resolve(inputFile);

    if (EXEMPT_FILES.includes(filePath)) {
      continue;
    }

    if (!TS_EXTENSION_REGEX.test(filePath)) continue;

    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      console.error(`Skipping missing file: ${filePath}`);
      continue;
    }

    let content;
    try {
      content = fs.readFileSync(filePath, 'utf8');
    } catch (error) {
      console.error(`Error reading ${filePath}:`, error);
      process.exitCode = 1;
      continue;
    }

    violations.push(...validateFile(filePath, content));
  }

  if (!violations.length) {
    console.log('✓ CSS import check passed.');
    return;
  }

  console.error(`\n${red('CSS import policy violations found:')}`);
  for (const violation of violations) {
    const relPath = path.relative(process.cwd(), violation.filePath);
    console.error(
      `- ${bold(relPath)}:${violation.line} imported ${red(
        `"${violation.importedPath}"`,
      )} expected ${bold(`"${violation.expectedPath}"`)}`,
    );
  }

  process.exitCode = 1;
};

main();
