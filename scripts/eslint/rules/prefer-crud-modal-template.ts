import { TSESTree, AST_NODE_TYPES, TSESLint } from '@typescript-eslint/utils';
import path from 'node:path';

type MessageIds = 'preferCrud';

export interface InterfaceRuleOptions {
  keywords?: string[];
  variants?: string[];
  ignorePaths?: string[];
  importPathPatterns?: string[];
}

type Options = [InterfaceRuleOptions?];

const DEFAULT_KEYWORDS = ['onSubmit', 'onConfirm', 'onPrimary', 'onSave'];
const DEFAULT_VARIANTS = ['BaseModal'];
const CRUD_IMPORT_PATH =
  'shared-components/CRUDModalTemplate/CRUDModalTemplate';

/**
 * Simple glob matcher for file paths and patterns
 */
const escapeRegExp = (input: string): string =>
  input.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&');

const matchesGlob = (str: string, pattern: string): boolean => {
  const escapedPattern = escapeRegExp(pattern);

  const regexPattern = escapedPattern
    .replace(/\\\*\\\*/g, '__DOUBLE_STAR__')
    .replace(/\\\*/g, '[^/]*')
    .replace(/__DOUBLE_STAR__/g, '.*')
    .replace(/\\\?/g, '.');

  const regex = new RegExp(`^${regexPattern}$`);
  return regex.test(str);
};

/**
 * ESLint rule to prefer CRUDModalTemplate over BaseModal in CRUD contexts.
 * Detects BaseModal imports (default/named/aliased) and JSX usage.
 * Flags violations when handler props (onSubmit, onConfirm, onPrimary, onSave)
 * are present, or when form elements exist within the modal children.
 *
 * Options:
 * - keywords: Array of prop names that indicate CRUD context (default: ['onSubmit', 'onConfirm', 'onPrimary', 'onSave'])
 * - variants: Array of component names to check (default: ['BaseModal'])
 * - ignorePaths: Array of glob patterns for files to ignore
 * - importPathPatterns: Array of import path patterns to match
 */
const preferCrudModalTemplate: TSESLint.RuleModule<MessageIds, Options> = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prefer CRUDModalTemplate over BaseModal in CRUD contexts',
      url: 'https://docs-admin.talawa.io/docs/developer-resources/linting',
    },
    messages: {
      preferCrud:
        'Prefer CRUDModalTemplate over BaseModal when using CRUD-related props or form elements.',
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          keywords: {
            type: 'array',
            items: { type: 'string' },
            description: 'Prop names that indicate CRUD context',
          },
          variants: {
            type: 'array',
            items: { type: 'string' },
            description: 'Component names to check',
          },
          ignorePaths: {
            type: 'array',
            items: { type: 'string' },
            description: 'Glob patterns for files to ignore',
          },
          importPathPatterns: {
            type: 'array',
            items: { type: 'string' },
            description: 'Import path patterns to match',
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context: TSESLint.RuleContext<MessageIds, Options>) {
    const options = context.options[0] || {};
    const keywords = options.keywords || DEFAULT_KEYWORDS;
    const variants = options.variants || DEFAULT_VARIANTS;
    const ignorePaths = options.ignorePaths || [];
    const importPathPatterns = options.importPathPatterns || [];

    // Check if current file should be ignored
    const rawFilename = context.filename ?? context.getFilename();
    const relativeFilename =
      rawFilename === '<input>'
        ? rawFilename
        : path.relative(context.getCwd(), rawFilename);
    const filename = relativeFilename.replace(/\\/g, '/');
    const normalizedIgnorePaths = ignorePaths.map((pattern) =>
      pattern.replace(/\\/g, '/'),
    );
    if (
      normalizedIgnorePaths.some((pattern) => matchesGlob(filename, pattern))
    ) {
      return {};
    }

    // Track BaseModal local names and their import declarations
    const baseModalNames = new Set<string>();
    const importDeclarations = new Map<string, TSESTree.ImportDeclaration>();

    /**
     * Checks if an import path matches BaseModal patterns
     */
    const isTargetModalPath = (importPath: string): boolean => {
      // Check against custom import path patterns if provided
      if (importPathPatterns.length > 0) {
        return importPathPatterns.some((pattern) => {
          if (pattern.includes('*')) {
            return matchesGlob(importPath, pattern);
          }
          return (
            importPath === pattern ||
            importPath.endsWith(`/${pattern}`) ||
            importPath.includes(`/${pattern}/`)
          );
        });
      }

      // Default behavior: check against variants
      return variants.some((variant) => {
        return (
          importPath === variant ||
          importPath.endsWith(`/${variant}`) ||
          importPath === `shared-components/${variant}` ||
          importPath.endsWith(`/${variant}/index`)
        );
      });
    };
    /**
     * Converts an ImportSpecifier to its string representation
     */
    const specifierToString = (spec: TSESTree.ImportSpecifier): string => {
      const imported =
        spec.imported.type === AST_NODE_TYPES.Identifier
          ? spec.imported.name
          : '';
      const local = spec.local.name;
      const typePrefix = spec.importKind === 'type' ? 'type ' : '';
      return imported === local
        ? `${typePrefix}${local}`
        : `${typePrefix}${imported} as ${local}`;
    };
    return {
      // Collect BaseModal imports
      ImportDeclaration(node: TSESTree.ImportDeclaration) {
        if (typeof node.source.value !== 'string') return;

        const importPath = node.source.value;
        if (!isTargetModalPath(importPath)) return;

        node.specifiers.forEach((specifier) => {
          // Handle named imports: import { BaseModal } from './components'
          // Also handles aliased imports: import { BaseModal as MyModal } from './components'
          if (specifier.type === AST_NODE_TYPES.ImportSpecifier) {
            const importedName =
              specifier.imported.type === AST_NODE_TYPES.Identifier
                ? specifier.imported.name
                : null;
            if (importedName && variants.includes(importedName)) {
              const localName = specifier.local.name;
              baseModalNames.add(localName);
              importDeclarations.set(localName, node);
            }
          }
          // Handle default imports: import BaseModal from './BaseModal'
          // Note: ImportDefaultSpecifier from target paths are added to baseModalNames/importDeclarations
          // without variants validation, treating any default import as an intentional BaseModal alias
          else if (specifier.type === AST_NODE_TYPES.ImportDefaultSpecifier) {
            const localName = specifier.local.name;
            baseModalNames.add(localName);
            importDeclarations.set(localName, node);
          }
        });
      },

      // Check JSX usage
      JSXOpeningElement(node: TSESTree.JSXOpeningElement) {
        // Get the component name from JSX element
        // Handle both JSXIdentifier (BaseModal) and JSXMemberExpression (UI.BaseModal)
        const elementName =
          node.name.type === AST_NODE_TYPES.JSXIdentifier
            ? node.name.name
            : node.name.type === AST_NODE_TYPES.JSXMemberExpression
              ? node.name.property.name
              : null;

        // Check if this is a BaseModal usage (including aliased names)
        if (!elementName || !baseModalNames.has(elementName)) {
          return;
        }

        // Check for CRUD-related handler props using configured keywords
        const hasCrudHandler = node.attributes.some((attr) => {
          if (attr.type === AST_NODE_TYPES.JSXAttribute) {
            const attrName =
              attr.name.type === AST_NODE_TYPES.JSXIdentifier
                ? attr.name.name
                : null;
            return attrName && keywords.includes(attrName);
          }
          return false;
        });

        const hasFormInExpression = (expr: TSESTree.Expression): boolean => {
          if (expr.type === AST_NODE_TYPES.JSXElement) {
            const childName =
              expr.openingElement.name.type === AST_NODE_TYPES.JSXIdentifier
                ? expr.openingElement.name.name
                : null;
            if (childName === 'form' || childName === 'Form') return true;
            return hasFormElement(expr.children);
          }
          if (expr.type === AST_NODE_TYPES.JSXFragment) {
            return hasFormElement(expr.children);
          }
          if (expr.type === AST_NODE_TYPES.LogicalExpression) {
            return (
              hasFormInExpression(expr.left) || hasFormInExpression(expr.right)
            );
          }
          if (expr.type === AST_NODE_TYPES.ConditionalExpression) {
            return (
              hasFormInExpression(expr.consequent) ||
              hasFormInExpression(expr.alternate)
            );
          }
          return false;
        };

        const hasFormElement = (children: TSESTree.JSXChild[]): boolean =>
          children.some((child) => {
            if (child.type === AST_NODE_TYPES.JSXElement) {
              const childName =
                child.openingElement.name.type === AST_NODE_TYPES.JSXIdentifier
                  ? child.openingElement.name.name
                  : null;
              if (childName === 'form' || childName === 'Form') return true;
              return hasFormElement(child.children);
            }
            if (child.type === AST_NODE_TYPES.JSXFragment) {
              return hasFormElement(child.children);
            }
            if (child.type === AST_NODE_TYPES.JSXExpressionContainer) {
              return (
                child.expression.type !== AST_NODE_TYPES.JSXEmptyExpression &&
                hasFormInExpression(child.expression)
              );
            }
            return false;
          });

        const parent = node.parent;
        const hasFormInChildren =
          parent?.type === AST_NODE_TYPES.JSXElement
            ? hasFormElement(parent.children)
            : false;

        // Flag when CRUD handler props OR form elements are present
        if (hasCrudHandler || hasFormInChildren) {
          const importDecl = importDeclarations.get(elementName);

          context.report({
            node: node,
            messageId: 'preferCrud',
            fix: importDecl
              ? (fixer) => {
                  const localName = elementName;

                  // Check if import has multiple specifiers
                  const hasMultipleSpecifiers =
                    importDecl.specifiers.length > 1;

                  if (hasMultipleSpecifiers) {
                    // Preserve other imports, only remove/replace the matched variant component
                    const otherSpecifiers = importDecl.specifiers.filter(
                      (spec) => {
                        if (spec.type === AST_NODE_TYPES.ImportSpecifier) {
                          return spec.local.name !== elementName;
                        }
                        if (
                          spec.type === AST_NODE_TYPES.ImportDefaultSpecifier
                        ) {
                          return spec.local.name !== elementName;
                        }
                        return true;
                      },
                    );

                    // Build new import preserving other specifiers
                    const rawImportSource = importDecl.source.value;
                    const originalImportPath =
                      typeof rawImportSource === 'string'
                        ? rawImportSource
                        : String(rawImportSource);
                    const preservedImports = otherSpecifiers
                      .map((spec) => {
                        if (
                          spec.type === AST_NODE_TYPES.ImportDefaultSpecifier
                        ) {
                          return spec.local.name;
                        }
                        if (spec.type === AST_NODE_TYPES.ImportSpecifier) {
                          return specifierToString(spec);
                        }
                        if (
                          spec.type === AST_NODE_TYPES.ImportNamespaceSpecifier
                        ) {
                          return `* as ${spec.local.name}`;
                        }
                        return '';
                      })
                      .filter(Boolean)
                      .join(', ');

                    const hasDefault = otherSpecifiers.some(
                      (s) => s.type === AST_NODE_TYPES.ImportDefaultSpecifier,
                    );
                    const hasNamed = otherSpecifiers.some(
                      (s) => s.type === AST_NODE_TYPES.ImportSpecifier,
                    );
                    const hasNamespace = otherSpecifiers.some(
                      (s) => s.type === AST_NODE_TYPES.ImportNamespaceSpecifier,
                    );

                    let preservedImportStmt = '';
                    if (hasDefault && hasNamed) {
                      const defaultSpec = otherSpecifiers.find(
                        (s) => s.type === AST_NODE_TYPES.ImportDefaultSpecifier,
                      );
                      const namedSpecs = otherSpecifiers
                        .filter(
                          (s) => s.type === AST_NODE_TYPES.ImportSpecifier,
                        )
                        .map((spec) =>
                          specifierToString(spec as TSESTree.ImportSpecifier),
                        )
                        .join(', ');
                      preservedImportStmt = `import ${defaultSpec?.local.name}, { ${namedSpecs} } from '${originalImportPath}';`;
                    } else if (hasDefault) {
                      preservedImportStmt = `import ${preservedImports} from '${originalImportPath}';`;
                    } else if (hasNamespace && !hasNamed) {
                      const namespaceSpec = otherSpecifiers.find(
                        (s) =>
                          s.type === AST_NODE_TYPES.ImportNamespaceSpecifier,
                      ) as TSESTree.ImportNamespaceSpecifier;
                      preservedImportStmt = `import * as ${namespaceSpec.local.name} from '${originalImportPath}';`;
                    } else {
                      preservedImportStmt = `import { ${preservedImports} } from '${originalImportPath}';`;
                    }

                    const newImport = `import { CRUDModalTemplate as ${localName} } from '${CRUD_IMPORT_PATH}';\n${preservedImportStmt}`;
                    return fixer.replaceText(importDecl, newImport);
                  } else {
                    // Single specifier: replace entire import
                    const newImport = `import { CRUDModalTemplate as ${localName} } from '${CRUD_IMPORT_PATH}';`;
                    return fixer.replaceText(importDecl, newImport);
                  }
                }
              : undefined,
          });
        }
      },
    };
  },
};

export default preferCrudModalTemplate;
