import { TSESTree, AST_NODE_TYPES, TSESLint } from '@typescript-eslint/utils';
type MessageIds = 'preferCrud';
type Options = [];

/**
 * ESLint rule to prefer CRUDModalTemplate over BaseModal in CRUD contexts.
 * Detects BaseModal imports (default/named/aliased) and JSX usage.
 * Flags violations when handler props (onSubmit, onConfirm, onPrimary, onSave)
 * are present, or when form elements exist within the modal children.
 */
const rule: TSESLint.RuleModule<MessageIds, Options> = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prefer CRUDModalTemplate over BaseModal in CRUD contexts',
      //docs does not exists yet
      url: 'docs/developer-resources/linting.md',
    },
    messages: {
      preferCrud:
        'Prefer CRUDModalTemplate over BaseModal when using CRUD-related props or form elements.',
    },
    schema: [],
  },

  create(context: TSESLint.RuleContext<MessageIds, Options>) {
    // Track BaseModal local names (handles default, named, and aliased imports)
    const baseModalNames = new Set<string>();

    return {
      // Collect BaseModal imports
      ImportDeclaration(node: TSESTree.ImportDeclaration) {
        if (typeof node.source.value !== 'string') return;

        const importPath = node.source.value;

        node.specifiers.forEach((specifier) => {
          // Handle named imports: import { BaseModal } from './components'
          // Also handles aliased imports: import { BaseModal as MyModal } from './components'
          if (specifier.type === AST_NODE_TYPES.ImportSpecifier) {
            const importedName =
              specifier.imported.type === AST_NODE_TYPES.Identifier
                ? specifier.imported.name
                : null;
            if (importedName === 'BaseModal') {
              baseModalNames.add(specifier.local.name);
            }
          }
          // Handle default imports: import BaseModal from './BaseModal'
          // Only track if the import path explicitly targets BaseModal module
          else if (specifier.type === AST_NODE_TYPES.ImportDefaultSpecifier) {
            const isBaseModalPath =
              importPath === 'BaseModal' ||
              importPath.endsWith('/BaseModal') ||
              importPath === 'shared-components/BaseModal' ||
              importPath.endsWith('/BaseModal/index');
            if (isBaseModalPath) {
              baseModalNames.add(specifier.local.name);
            }
          }
        });
      },

      // Check JSX usage
      JSXOpeningElement(node: TSESTree.JSXOpeningElement) {
        // Get the component name from JSX element
        const elementName =
          node.name.type === AST_NODE_TYPES.JSXIdentifier
            ? node.name.name
            : null;

        // Check if this is a BaseModal usage (including aliased names)
        if (!elementName || !baseModalNames.has(elementName)) {
          return;
        }

        // Check for CRUD-related handler props
        const crudHandlerProps = [
          'onSubmit',
          'onConfirm',
          'onPrimary',
          'onSave',
        ];

        const hasCrudHandler = node.attributes.some((attr) => {
          if (attr.type === AST_NODE_TYPES.JSXAttribute) {
            const attrName =
              attr.name.type === AST_NODE_TYPES.JSXIdentifier
                ? attr.name.name
                : null;
            return attrName && crudHandlerProps.includes(attrName);
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
            : parent?.type === AST_NODE_TYPES.JSXFragment
              ? hasFormElement(parent.children)
              : false;

        // Flag when CRUD handler props OR form elements are present
        if (hasCrudHandler || hasFormInChildren) {
          context.report({
            node: node,
            messageId: 'preferCrud',
          });
        }
      },
    };
  },
};

export default rule;
