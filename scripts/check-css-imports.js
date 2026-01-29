// To check if your files contain the invalid css imports run the given command
// Run manually: pnpm exec tsx scripts/check-css-imports.js --files <file1> <file2> ...


import fs from 'fs';
import path from 'path';
import ts from 'typescript';

const CSS_EXTENSION_REGEX = /\.css$/;
const TS_EXTENSION_REGEX = /\.(ts|tsx)$/i;
const CSS_MODULE_REGEX = /\.module\.css$/i;

const EXEMPT_TS_FILES = [path.resolve('src/index.tsx')];
const EXEMPT_CSS_FILES = new Set([
  path.resolve('src/style/app-fixed.module.css'),
]);
const EXEMPT_CSS_DIR_PREFIXES = [
  'src/style/tokens/',
  'src/assets/css/',
  'src/assets/scss/',
];
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

const shouldSkipCssFile = (filePath) => {
  if (EXEMPT_CSS_FILES.has(filePath)) return true;

  const normalized = path
    .relative(process.cwd(), filePath)
    .split(path.sep)
    .join('/');

  return EXEMPT_CSS_DIR_PREFIXES.some((prefix) =>
    normalized.startsWith(prefix),
  );
};

const isLocalCssModule = (baseDir, targetPath) => {
  const relative = path.relative(baseDir, targetPath);
  return relative && !relative.startsWith('..') && !path.isAbsolute(relative);
};

const collectComposeViolations = (filePath, content) => {
  const violations = [];
  const baseDir = path.dirname(filePath);
  const composeRegex =
    /composes\s*:[^;{]*\bfrom\s+(?:['"]([^'"]+)['"]|(global))\b/gi;
  for (const match of content.matchAll(composeRegex)) {
    const matchIndex = match.index ?? 0;
    const line = content.slice(0, matchIndex).split(/\r?\n/).length;
    const importPath = match[1] ?? match[2];

    if (importPath === 'global') {
      violations.push({
        filePath,
        line,
        importedPath: 'global',
        reason:
          'composes from global is disallowed. Define styles locally instead.',
      });
      continue;
    }

    if (!importPath.startsWith('.')) {
      violations.push({
        filePath,
        line,
        importedPath: importPath,
        reason:
          'composes must use a relative path within the component. Non-relative targets are disallowed.',
      });
      continue;
    }

    const resolvedImport = path.resolve(baseDir, importPath);
    const isLocal = isLocalCssModule(baseDir, resolvedImport);

    if (!isLocal) {
      violations.push({
        filePath,
        line,
        importedPath: importPath,
        reason:
          'composes from a non-local stylesheet. Define styles locally instead.',
      });
    }
  }

  return violations;
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

const validateTsFile = (filePath, content) => {
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

  const tsImportViolations = [];
  const cssComposeViolations = [];

  for (const inputFile of files) {
    const filePath = path.resolve(inputFile);

    if (EXEMPT_TS_FILES.includes(filePath)) {
      continue;
    }

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

    if (TS_EXTENSION_REGEX.test(filePath)) {
      tsImportViolations.push(...validateTsFile(filePath, content));
      continue;
    }

    if (CSS_MODULE_REGEX.test(filePath)) {
      if (shouldSkipCssFile(filePath)) continue;
      cssComposeViolations.push(...collectComposeViolations(filePath, content));
    }
  }

  if (!tsImportViolations.length && !cssComposeViolations.length) {
    console.log('✓ CSS import check passed.');
    return;
  }

  if (tsImportViolations.length) {
    console.error(`\n${red('CSS import policy violations found:')}`);
    for (const violation of tsImportViolations) {
      const relPath = path.relative(process.cwd(), violation.filePath);
      console.error(
        `- ${bold(relPath)}:${violation.line} imported ${red(
          `"${violation.importedPath}"`,
        )} expected ${bold(`"${violation.expectedPath}"`)}`,
      );
    }
  }

  if (cssComposeViolations.length) {
    console.error(`\n${red('CSS compose policy violations found:')}`);
    for (const violation of cssComposeViolations) {
      const relPath = path.relative(process.cwd(), violation.filePath);
      console.error(
        `- ${bold(relPath)}:${violation.line} composes from ${red(
          `"${violation.importedPath}"`,
        )} ${violation.reason}`,
      );
    }
  }

  process.exitCode = 1;
};

main();
