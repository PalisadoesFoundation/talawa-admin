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

const fs = require("fs");
const path = require("path");

/**
 * Files with known legacy violations.
 * These will be removed incrementally as migrations land.
 */
const LEGACY_EXCEPTIONS = new Set([
  "src/components/AgendaItems/Create/AgendaItemsCreateModal.tsx",
  "src/components/AgendaItems/Create/AgendaItemsCreateModal.spec.tsx",
  "src/components/AgendaItems/Update/AgendaItemsUpdateModal.tsx",
  "src/components/AgendaItems/Update/AgendaItemsUpdateModal.spec.tsx",
  "src/components/OrgSettings/General/OrgUpdate/OrgUpdate.spec.tsx",
  "src/screens/AdminPortal/CommunityProfile/CommunityProfile.tsx",
  "src/screens/AdminPortal/CommunityProfile/CommunityProfile.spec.tsx",
  "src/screens/AdminPortal/OrgList/modal/OrganizationModal.spec.tsx",
  "src/utils/convertToBase64.ts",
  "src/utils/convertToBase64.spec.ts",
  "src/index.tsx",
  "src/index.spec.tsx",
]);

/**
 * Explicit forbidden imports.
 * Maintainer requirement: lint for apollo-upload-client imports.
 */
const FORBIDDEN_IMPORT_PATTERNS = [
  "from \"apollo-upload-client\"",
  "from 'apollo-upload-client'",
  "require(\"apollo-upload-client\")",
  "require('apollo-upload-client')",
];

/**
 * Forbidden identifiers/usages.
 */
const FORBIDDEN_IDENTIFIERS = [
  "convertToBase64",
  "createUploadLink",
];

const ROOT_DIR = path.join(process.cwd(), "src");
const violations = [];

function scanFile(filePath) {
  const relativePath = path.relative(process.cwd(), filePath);
  const content = fs.readFileSync(filePath, "utf8");

  // Check forbidden imports
  FORBIDDEN_IMPORT_PATTERNS.forEach((pattern) => {
    if (content.includes(pattern)) {
      if (!LEGACY_EXCEPTIONS.has(relativePath)) {
        violations.push({
          file: relativePath,
          reason: "apollo-upload-client import detected",
        });
      }
    }
  });

  // Check forbidden identifiers
  FORBIDDEN_IDENTIFIERS.forEach((identifier) => {
    if (content.includes(identifier)) {
      if (!LEGACY_EXCEPTIONS.has(relativePath)) {
        violations.push({
          file: relativePath,
          reason: `forbidden identifier used: ${identifier}`,
        });
      }
    }
  });
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith(".ts") || fullPath.endsWith(".tsx")) {
      scanFile(fullPath);
    }
  }
}

walk(ROOT_DIR);

if (violations.length > 0) {
  console.error("\n MinIO compliance violations found:\n");
  violations.forEach((v) => {
    console.error(`- ${v.file}: ${v.reason}`);
  });
  process.exit(1);
}

console.log(" MinIO compliance check passed");
