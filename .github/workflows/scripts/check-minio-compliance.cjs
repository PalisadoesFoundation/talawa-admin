/**
 * MinIO Compliance Enforcement Script
 *
 * Purpose:
 * Enforce the documented MinIO presigned URL file upload approach by
 * preventing legacy or unsupported upload patterns from being introduced.
 *
 * Enforced Rules:
 * - Disallow Base64-based uploads (convertToBase64)
 * - Disallow apollo-upload-client imports
 * - Disallow createUploadLink usage
 *
 * Behavior:
 * - Existing known violations are temporarily exempted via LEGACY_EXCEPTIONS
 * - Any NEW violations will cause the script to exit non-zero
 *
 * Related Issue:
 * Standardize MinIO File Management - All operations (MVP) #3966
 */

const fs = require('fs');
const path = require('path');

/**
 * Files with known legacy violations.
 * These will be removed incrementally as migrations land.
 */
const LEGACY_EXCEPTIONS = new Set([
  'src/components/AdminPortal/AgendaItems/Create/AgendaItemsCreateModal.tsx',
  'src/components/AdminPortal/AgendaItems/Create/AgendaItemsCreateModal.spec.tsx',
  'src/components/AdminPortal/AgendaItems/Update/AgendaItemsUpdateModal.tsx',
  'src/components/AdminPortal/AgendaItems/Update/AgendaItemsUpdateModal.spec.tsx',
  'src/components/AdminPortal/OrgSettings/General/OrgUpdate/OrgUpdate.spec.tsx',
  'src/screens/AdminPortal/CommunityProfile/CommunityProfile.tsx',
  'src/screens/AdminPortal/CommunityProfile/CommunityProfile.spec.tsx',
  'src/screens/AdminPortal/OrgList/modal/OrganizationModal.spec.tsx',
  'src/utils/convertToBase64.ts',
  'src/utils/convertToBase64.spec.ts',
  'src/index.tsx',
  'src/index.spec.tsx',
]);

/**
 * Explicit forbidden imports.
 * Maintainer requirement: lint for apollo-upload-client imports.
 * Uses regex patterns to avoid false positives from comments and strings.
 */
const FORBIDDEN_IMPORT_PATTERNS = [
  /from\s+["']apollo-upload-client["']/,
  /require\s*\(\s*["']apollo-upload-client["']\s*\)/,
];

/**
 * Forbidden identifiers/usages.
 * Uses word boundaries to match whole identifiers only.
 */
const FORBIDDEN_IDENTIFIERS = [/\bconvertToBase64\b/, /\bcreateUploadLink\b/];

const ROOT_DIR = path.join(process.cwd(), 'src');
const violations = [];

function scanFile(filePath) {
  const relativePath = path
    .relative(process.cwd(), filePath)
    .replace(/\\/g, '/');

  let content;
  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.warn(`Warning: Could not read ${relativePath}: ${error.message}`);
    return;
  }

  // Check forbidden imports
  FORBIDDEN_IMPORT_PATTERNS.forEach((pattern) => {
    if (pattern.test(content)) {
      if (!LEGACY_EXCEPTIONS.has(relativePath)) {
        violations.push({
          file: relativePath,
          reason: 'apollo-upload-client import detected',
        });
      }
    }
  });

  // Check forbidden identifiers
  FORBIDDEN_IDENTIFIERS.forEach((identifier) => {
    if (identifier.test(content)) {
      if (!LEGACY_EXCEPTIONS.has(relativePath)) {
        const match = content.match(identifier);
        violations.push({
          file: relativePath,
          reason: `forbidden identifier used: ${match[0]}`,
        });
      }
    }
  });
}

const EXCLUDED_DIRS = new Set([
  'node_modules',
  'dist',
  'build',
  '__mocks__',
  'coverage',
]);
const visitedPaths = new Set();

function walk(dir) {
  // Protect against symlink loops
  let realPath;
  try {
    realPath = fs.realpathSync(dir);
  } catch (error) {
    console.warn(`Warning: Could not resolve ${dir}: ${error.message}`);
    return;
  }

  if (visitedPaths.has(realPath)) {
    return;
  }
  visitedPaths.add(realPath);

  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (error) {
    console.warn(`Warning: Could not read directory ${dir}: ${error.message}`);
    return;
  }

  for (const entry of entries) {
    // Skip common build/dependency directories
    if (entry.isDirectory() && EXCLUDED_DIRS.has(entry.name)) {
      continue;
    }

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && !entry.isSymbolicLink()) {
      walk(fullPath);
    } else if (
      (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) &&
      !entry.isSymbolicLink()
    ) {
      scanFile(fullPath);
    }
  }
}

try {
  walk(ROOT_DIR);
} catch (error) {
  console.error(`\nMinIO compliance check failed with error: ${error.message}`);
  process.exit(2); // Exit with different code to distinguish from violations
}

if (violations.length > 0) {
  console.error('\nMinIO compliance violations found:\n');
  violations.forEach((v) => {
    console.error(`- ${v.file}: ${v.reason}`);
  });
  process.exit(1);
}

console.log('MinIO compliance check passed');
