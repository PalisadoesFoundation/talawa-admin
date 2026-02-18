import { readFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import { parse } from '@typescript-eslint/parser';
import { AST_NODE_TYPES, TSESTree } from '@typescript-eslint/utils';

const DEFAULT_ALLOWED_PREFIXES = ['/admin', '/user', '/auth'];
const DEFAULT_ALLOWED_EXACT = [
  '/',
  '/register',
  '/forgotPassword',
  '/verify-email',
];
const DEFAULT_ALLOWED_PATTERNS = ['^/event/invitation(?:/|$)'];
const DEFAULT_ROUTE_COMPONENTS = ['Route'];
const DEFAULT_NAV_COMPONENTS = [
  'Link',
  'NavLink',
  'Navigate',
  'SidebarNavItem',
];
const DEFAULT_NAVIGATE_FUNCTIONS = ['navigate'];
const DEFAULT_LOCATION_METHODS = ['assign', 'replace'];
const allowedPatternRegexes = DEFAULT_ALLOWED_PATTERNS.map(
  (pattern) => new RegExp(pattern),
);

const args = process.argv.slice(2);
const scanEntireRepo = args.includes('--scan-entire-repo');

const stripQueryAndHash = (value: string): string => value.split(/[?#]/)[0];

const isExternalTarget = (value: string): boolean => {
  if (value.startsWith('//')) {
    return true;
  }
  return /^[a-zA-Z][a-zA-Z+.-]*:/.test(value);
};

const getJsxName = (name: TSESTree.JSXTagNameExpression): string | null => {
  if (name.type === AST_NODE_TYPES.JSXIdentifier) {
    return name.name;
  }
  if (name.type === AST_NODE_TYPES.JSXMemberExpression) {
    return name.property.name;
  }
  return null;
};

const getTemplateLiteralPrefix = (
  node: TSESTree.TemplateLiteral,
): string | null => {
  if (node.quasis.length === 0) {
    return null;
  }
  if (node.expressions.length === 0) {
    return node.quasis.map((quasi) => quasi.value.cooked ?? '').join('');
  }
  const head = node.quasis[0]?.value.cooked ?? '';
  return head.length > 0 ? head : null;
};

const unwrapExpression = (
  expression: TSESTree.Expression,
): TSESTree.Expression => {
  if (
    expression.type === AST_NODE_TYPES.TSAsExpression ||
    expression.type === AST_NODE_TYPES.TSTypeAssertion ||
    expression.type === AST_NODE_TYPES.TSNonNullExpression ||
    expression.type === AST_NODE_TYPES.ChainExpression
  ) {
    return unwrapExpression(expression.expression);
  }
  return expression;
};

const getPathFromExpression = (
  expression: TSESTree.Expression,
): { value: string; node: TSESTree.Node } | null => {
  const resolved = unwrapExpression(expression);

  if (resolved.type === AST_NODE_TYPES.Literal) {
    return typeof resolved.value === 'string'
      ? { value: resolved.value, node: resolved }
      : null;
  }

  if (resolved.type === AST_NODE_TYPES.TemplateLiteral) {
    const prefix = getTemplateLiteralPrefix(resolved);
    return prefix ? { value: prefix, node: resolved } : null;
  }

  if (resolved.type === AST_NODE_TYPES.ObjectExpression) {
    for (const property of resolved.properties) {
      if (property.type !== AST_NODE_TYPES.Property) {
        continue;
      }
      const keyName =
        property.key.type === AST_NODE_TYPES.Identifier
          ? property.key.name
          : property.key.type === AST_NODE_TYPES.Literal &&
              typeof property.key.value === 'string'
            ? property.key.value
            : null;
      if (!keyName || (keyName !== 'pathname' && keyName !== 'path')) {
        continue;
      }
      if (property.value.type === AST_NODE_TYPES.SpreadElement) {
        continue;
      }
      return getPathFromExpression(property.value);
    }
  }

  return null;
};

const getPathFromAttribute = (
  attribute: TSESTree.JSXAttribute,
): { value: string; node: TSESTree.Node } | null => {
  if (!attribute.value) {
    return null;
  }
  if (attribute.value.type === AST_NODE_TYPES.Literal) {
    return typeof attribute.value.value === 'string'
      ? { value: attribute.value.value, node: attribute.value }
      : null;
  }
  if (
    attribute.value.type === AST_NODE_TYPES.JSXExpressionContainer &&
    attribute.value.expression.type !== AST_NODE_TYPES.JSXEmptyExpression
  ) {
    return getPathFromExpression(attribute.value.expression);
  }
  return null;
};

const isLocationCall = (
  callee: TSESTree.LeftHandSideExpression,
  locationMethods: string[],
): boolean => {
  if (callee.type !== AST_NODE_TYPES.MemberExpression) {
    return false;
  }
  if (callee.property.type !== AST_NODE_TYPES.Identifier) {
    return false;
  }
  if (!locationMethods.includes(callee.property.name)) {
    return false;
  }
  if (callee.object.type === AST_NODE_TYPES.Identifier) {
    return callee.object.name === 'location';
  }
  if (callee.object.type === AST_NODE_TYPES.MemberExpression) {
    return (
      callee.object.object.type === AST_NODE_TYPES.Identifier &&
      callee.object.object.name === 'window' &&
      callee.object.property.type === AST_NODE_TYPES.Identifier &&
      callee.object.property.name === 'location'
    );
  }
  return false;
};

const isAllowedPath = (rawPath: string): boolean => {
  if (isExternalTarget(rawPath)) {
    return true;
  }
  if (!rawPath.startsWith('/')) {
    return true;
  }
  const normalized = stripQueryAndHash(rawPath);
  if (DEFAULT_ALLOWED_EXACT.includes(normalized)) {
    return true;
  }
  const matchesPrefix = DEFAULT_ALLOWED_PREFIXES.some((prefix) => {
    return normalized === prefix || normalized.startsWith(`${prefix}/`);
  });
  if (matchesPrefix) {
    return true;
  }
  return allowedPatternRegexes.some((pattern) => pattern.test(normalized));
};

const getFiles = (): string[] => {
  const options = { encoding: 'utf-8' as const };
  const command = scanEntireRepo
    ? 'git ls-files'
    : 'git diff --cached --name-only';
  const output = execSync(command, options).trim();
  if (!output) {
    return [];
  }
  return output
    .split('\n')
    .map((file) => file.trim())
    .filter(Boolean)
    .filter((file) => !file.includes('__tests__'))
    .filter(
      (file) =>
        (file.endsWith('.ts') || file.endsWith('.tsx')) &&
        !file.endsWith('.d.ts') &&
        !file.endsWith('.spec.ts') &&
        !file.endsWith('.spec.tsx') &&
        !file.endsWith('.test.ts') &&
        !file.endsWith('.test.tsx'),
    );
};

type Violation = {
  file: string;
  line: number;
  column: number;
  path: string;
};

const collectViolations = (file: string, code: string): Violation[] => {
  const violations: Violation[] = [];
  const isTsx = file.endsWith('.tsx');
  const ast = parse(code, {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: isTsx },
    loc: true,
  });

  const reportIfNeeded = (node: TSESTree.Node, pathValue: string) => {
    if (!pathValue.startsWith('/')) {
      return;
    }
    if (isAllowedPath(pathValue)) {
      return;
    }
    const loc = node.loc?.start;
    violations.push({
      file,
      line: loc?.line ?? 0,
      column: (loc?.column ?? 0) + 1,
      path: pathValue,
    });
  };

  const routeComponentAliases = new Set(DEFAULT_ROUTE_COMPONENTS);
  const navComponentAliases = new Set(DEFAULT_NAV_COMPONENTS);
  const navigateFunctionAliases = new Set(DEFAULT_NAVIGATE_FUNCTIONS);

  const trackAliasFromName = (localName: string, sourceName: string) => {
    if (routeComponentAliases.has(sourceName)) {
      routeComponentAliases.add(localName);
    }
    if (navComponentAliases.has(sourceName)) {
      navComponentAliases.add(localName);
    }
    if (navigateFunctionAliases.has(sourceName)) {
      navigateFunctionAliases.add(localName);
    }
  };

  const resolveAliasSource = (
    expression: TSESTree.Expression,
  ): string | null => {
    const resolved = unwrapExpression(expression);
    if (resolved.type === AST_NODE_TYPES.Identifier) {
      return resolved.name;
    }
    if (
      resolved.type === AST_NODE_TYPES.MemberExpression &&
      resolved.property.type === AST_NODE_TYPES.Identifier
    ) {
      return resolved.property.name;
    }
    return null;
  };

  const resolvePatternIdentifier = (node: TSESTree.Pattern): string | null => {
    if (node.type === AST_NODE_TYPES.Identifier) {
      return node.name;
    }
    if (
      node.type === AST_NODE_TYPES.AssignmentPattern &&
      node.left.type === AST_NODE_TYPES.Identifier
    ) {
      return node.left.name;
    }
    return null;
  };

  const visit = (node: TSESTree.Node) => {
    if (node.type === AST_NODE_TYPES.ImportDeclaration) {
      node.specifiers.forEach((specifier) => {
        if (
          specifier.type === AST_NODE_TYPES.ImportSpecifier &&
          specifier.imported.type === AST_NODE_TYPES.Identifier
        ) {
          trackAliasFromName(specifier.local.name, specifier.imported.name);
        }
      });
    }

    if (node.type === AST_NODE_TYPES.VariableDeclarator) {
      const init = node.init && unwrapExpression(node.init);
      if (node.id.type === AST_NODE_TYPES.Identifier && init) {
        const sourceName = resolveAliasSource(init);
        if (sourceName) {
          trackAliasFromName(node.id.name, sourceName);
        }
      }
      if (node.id.type === AST_NODE_TYPES.ObjectPattern) {
        node.id.properties.forEach((property) => {
          if (property.type !== AST_NODE_TYPES.Property) {
            return;
          }
          if (property.key.type !== AST_NODE_TYPES.Identifier) {
            return;
          }
          const aliasName = resolvePatternIdentifier(property.value);
          if (aliasName) {
            trackAliasFromName(aliasName, property.key.name);
          }
        });
      }
    }

    if (node.type === AST_NODE_TYPES.JSXOpeningElement) {
      const elementName = getJsxName(node.name);
      if (elementName) {
        const isRouteComponent = routeComponentAliases.has(elementName);
        const isNavComponent = navComponentAliases.has(elementName);
        if (isRouteComponent || isNavComponent) {
          const targetAttributeName = isRouteComponent ? 'path' : 'to';
          const targetAttribute = node.attributes.find(
            (attr) =>
              attr.type === AST_NODE_TYPES.JSXAttribute &&
              attr.name.type === AST_NODE_TYPES.JSXIdentifier &&
              attr.name.name === targetAttributeName,
          ) as TSESTree.JSXAttribute | undefined;

          if (targetAttribute) {
            const pathInfo = getPathFromAttribute(targetAttribute);
            if (pathInfo) {
              reportIfNeeded(pathInfo.node, pathInfo.value);
            }
          }
        }
      }
    }

    if (node.type === AST_NODE_TYPES.CallExpression) {
      const callee = node.callee;
      const isNavigateCall =
        callee.type === AST_NODE_TYPES.Identifier &&
        navigateFunctionAliases.has(callee.name);
      const isLocationNavigation = isLocationCall(
        callee,
        DEFAULT_LOCATION_METHODS,
      );
      if (isNavigateCall || isLocationNavigation) {
        const firstArg = node.arguments[0];
        if (firstArg && firstArg.type !== AST_NODE_TYPES.SpreadElement) {
          const pathInfo = getPathFromExpression(firstArg);
          if (pathInfo) {
            reportIfNeeded(pathInfo.node, pathInfo.value);
          }
        }
      }
    }
  };

  const walk = (node: TSESTree.Node) => {
    visit(node);
    for (const key of Object.keys(node)) {
      if (key === 'parent') {
        continue;
      }
      const value = (node as Record<string, unknown>)[key];
      if (Array.isArray(value)) {
        value.forEach((child) => {
          if (child && typeof child === 'object' && 'type' in child) {
            walk(child as TSESTree.Node);
          }
        });
      } else if (value && typeof value === 'object' && 'type' in value) {
        walk(value as TSESTree.Node);
      }
    }
  };

  walk(ast as TSESTree.Node);
  return violations;
};

const files = getFiles();
if (files.length === 0) {
  console.log('Skipping route prefix check (no matching files).');
  process.exit(0);
}

const allViolations: Violation[] = [];
for (const file of files) {
  const normalized = path.normalize(file);
  if (!existsSync(normalized)) {
    continue;
  }
  const code = readFileSync(normalized, 'utf-8');
  try {
    allViolations.push(...collectViolations(normalized, code));
  } catch (error) {
    console.error(
      `Error parsing ${normalized}:`,
      error instanceof Error ? error.message : error,
    );
    process.exit(1);
  }
}

if (allViolations.length > 0) {
  console.error('\nError: Found routes without allowed prefixes.\n');
  allViolations.forEach((violation) => {
    const location = violation.line
      ? `${violation.file}:${violation.line}:${violation.column}`
      : violation.file;
    console.error(`${location} -> ${violation.path}`);
  });
  console.error(`\nAllowed prefixes: ${DEFAULT_ALLOWED_PREFIXES.join(', ')}`);
  console.error(`Allowed public routes: ${DEFAULT_ALLOWED_EXACT.join(', ')}`);
  console.error(`Allowed patterns: ${DEFAULT_ALLOWED_PATTERNS.join(', ')}`);
  process.exit(1);
}

console.log('Route prefix check passed.');
