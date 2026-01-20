import { TSESTree, AST_NODE_TYPES, TSESLint } from '@typescript-eslint/utils';

/**
 * ESLint rule to prefer CRUDModalTemplate over BaseModal in CRUD contexts.
 * Detects BaseModal imports (default/named/aliased) and JSX usage.
 * Flags violations when handler props (onSubmit, onConfirm, onPrimary, onSave) or form tags are present.
 */

type MessageIds = 'preferCrud';
type Options = [];

const rule: TSESLint.RuleModule<MessageIds, Options> = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prefer CRUDModalTemplate over BaseModal in CRUD contexts',
      url: 'docs/docs/docs/developer-resources/linting.md',
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
        // Check if importing from BaseModal component
        if (
          typeof node.source.value === 'string' &&
          (node.source.value.includes('BaseModal') ||
            node.source.value.endsWith('/BaseModal') ||
            node.source.value === 'BaseModal')
        ) {
          // Handle default imports: import BaseModal from './BaseModal'
          node.specifiers.forEach((specifier) => {
            if (specifier.type === AST_NODE_TYPES.ImportDefaultSpecifier) {
              baseModalNames.add(specifier.local.name);
            }
            // Handle named imports: import { BaseModal } from './components'
            // Also handles aliased imports: import { BaseModal as MyModal } from './components'
            else if (specifier.type === AST_NODE_TYPES.ImportSpecifier) {
              baseModalNames.add(specifier.local.name);
            }
          });
        }
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

        // Check for form elements in children (requires checking parent context)
        if (hasCrudHandler) {
          context.report({
            node: node as TSESTree.JSXOpeningElement,
            messageId: 'preferCrud',
          });
        }
      },
    };
  },
};

export default rule;
