/**
 * Restrictions for i18n translation keys to enforce camelCase
 */

/**
 * ESLint AST selector matching both direct t() calls and member-expression i18n.t() calls.
 */
export const tCallSelector =
  ":matches(CallExpression[callee.name='t'], CallExpression[callee.type='MemberExpression'][callee.property.name='t'])";

/**
 * Array of ESLint no-restricted-syntax rules enforcing camelCase naming for i18n translation keys.
 * Restrictions include: no spaces, must start lowercase, no dashes/underscores, alphanumeric + dots + colons only.
 */
export const i18nCamelCaseRestrictions = [
  {
    selector: `${tCallSelector} > :matches(Literal[value=/\\s/], TemplateLiteral[quasis.0.value.raw=/\\s/])`,
    message:
      'i18n Convention Violation: Translation keys should not contain spaces. Use camelCase (e.g., "myOrganizations").',
  },
  {
    selector: `${tCallSelector} > :matches(Literal[value=/^(?![a-z])/], TemplateLiteral[quasis.0.value.raw=/^(?![a-z])/])`,
    message:
      'i18n Convention Violation: Translation keys should start with a lowercase letter (camelCase).',
  },
  {
    selector: `${tCallSelector} > :matches(Literal[value=/[-_]/], TemplateLiteral[quasis.0.value.raw=/[-_]/])`,
    message:
      'i18n Convention Violation: Translation keys should not contain dashes or underscores. Use camelCase.',
  },
  {
    selector: `${tCallSelector} > :matches(Literal[value=/[^a-zA-Z0-9.:]/], TemplateLiteral[quasis.0.value.raw=/[^a-zA-Z0-9.:]/])`,
    message:
      'i18n Convention Violation: Translation keys should only contain alphanumeric characters, dots, or colons.',
  },
];
