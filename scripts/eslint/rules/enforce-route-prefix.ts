import { AST_NODE_TYPES, TSESLint, TSESTree } from '@typescript-eslint/utils';

type MessageIds = 'missingPrefix';

interface InterfaceRuleOptions {
  allowedPrefixes?: string[];
  allowedExact?: string[];
  allowedPatterns?: string[];
  routeComponentNames?: string[];
  navigationComponentNames?: string[];
  navigateFunctionNames?: string[];
  locationMethods?: string[];
}

type Options = [InterfaceRuleOptions?];

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

const normalizeOptions = (
  options: InterfaceRuleOptions | undefined,
): Required<InterfaceRuleOptions> => ({
  allowedPrefixes: options?.allowedPrefixes ?? DEFAULT_ALLOWED_PREFIXES,
  allowedExact: options?.allowedExact ?? DEFAULT_ALLOWED_EXACT,
  allowedPatterns: options?.allowedPatterns ?? DEFAULT_ALLOWED_PATTERNS,
  routeComponentNames: options?.routeComponentNames ?? DEFAULT_ROUTE_COMPONENTS,
  navigationComponentNames:
    options?.navigationComponentNames ?? DEFAULT_NAV_COMPONENTS,
  navigateFunctionNames:
    options?.navigateFunctionNames ?? DEFAULT_NAVIGATE_FUNCTIONS,
  locationMethods: options?.locationMethods ?? DEFAULT_LOCATION_METHODS,
});

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

const getPathFromExpression = (
  expression: TSESTree.Expression,
): { value: string; node: TSESTree.Node } | null => {
  if (expression.type === AST_NODE_TYPES.Literal) {
    return typeof expression.value === 'string'
      ? { value: expression.value, node: expression }
      : null;
  }

  if (expression.type === AST_NODE_TYPES.TemplateLiteral) {
    const prefix = getTemplateLiteralPrefix(expression);
    return prefix ? { value: prefix, node: expression } : null;
  }

  if (expression.type === AST_NODE_TYPES.ObjectExpression) {
    for (const property of expression.properties) {
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

const rule: TSESLint.RuleModule<MessageIds, Options> = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Enforce standardized /admin, /user, and /auth prefixes for routes',
    },
    messages: {
      missingPrefix:
        'Route path "{{path}}" should start with {{prefixes}} or be an approved public route.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          allowedPrefixes: { type: 'array', items: { type: 'string' } },
          allowedExact: { type: 'array', items: { type: 'string' } },
          allowedPatterns: { type: 'array', items: { type: 'string' } },
          routeComponentNames: { type: 'array', items: { type: 'string' } },
          navigationComponentNames: {
            type: 'array',
            items: { type: 'string' },
          },
          navigateFunctionNames: {
            type: 'array',
            items: { type: 'string' },
          },
          locationMethods: { type: 'array', items: { type: 'string' } },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context: TSESLint.RuleContext<MessageIds, Options>) {
    const options = normalizeOptions(context.options[0]);
    const allowedPatterns = options.allowedPatterns.map(
      (pattern) => new RegExp(pattern),
    );

    const isAllowedPath = (rawPath: string): boolean => {
      if (isExternalTarget(rawPath)) {
        return true;
      }
      if (!rawPath.startsWith('/')) {
        return true;
      }
      const normalized = stripQueryAndHash(rawPath);
      if (options.allowedExact.includes(normalized)) {
        return true;
      }
      const matchesPrefix = options.allowedPrefixes.some((prefix) => {
        return normalized === prefix || normalized.startsWith(`${prefix}/`);
      });
      if (matchesPrefix) {
        return true;
      }
      return allowedPatterns.some((pattern) => pattern.test(normalized));
    };

    const reportIfNeeded = (node: TSESTree.Node, pathValue: string) => {
      if (!pathValue.startsWith('/')) {
        return;
      }
      if (isAllowedPath(pathValue)) {
        return;
      }
      context.report({
        node,
        messageId: 'missingPrefix',
        data: {
          path: pathValue,
          prefixes: options.allowedPrefixes.join(', '),
        },
      });
    };

    return {
      JSXOpeningElement(node) {
        const elementName = getJsxName(node.name);
        if (!elementName) {
          return;
        }
        const isRouteComponent =
          options.routeComponentNames.includes(elementName);
        const isNavComponent =
          options.navigationComponentNames.includes(elementName);

        if (!isRouteComponent && !isNavComponent) {
          return;
        }

        const targetAttributeName = isRouteComponent ? 'path' : 'to';
        const targetAttribute = node.attributes.find(
          (attr) =>
            attr.type === AST_NODE_TYPES.JSXAttribute &&
            attr.name.type === AST_NODE_TYPES.JSXIdentifier &&
            attr.name.name === targetAttributeName,
        ) as TSESTree.JSXAttribute | undefined;

        if (!targetAttribute) {
          return;
        }
        const pathInfo = getPathFromAttribute(targetAttribute);
        if (!pathInfo) {
          return;
        }
        reportIfNeeded(pathInfo.node, pathInfo.value);
      },
      CallExpression(node) {
        const callee = node.callee;
        const isNavigateCall =
          callee.type === AST_NODE_TYPES.Identifier &&
          options.navigateFunctionNames.includes(callee.name);
        const isLocationNavigation = isLocationCall(
          callee,
          options.locationMethods,
        );
        if (!isNavigateCall && !isLocationNavigation) {
          return;
        }
        const firstArg = node.arguments[0];
        if (!firstArg || firstArg.type === AST_NODE_TYPES.SpreadElement) {
          return;
        }
        const pathInfo = getPathFromExpression(firstArg);
        if (!pathInfo) {
          return;
        }
        reportIfNeeded(pathInfo.node, pathInfo.value);
      },
    };
  },
};

export default rule;
