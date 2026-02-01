/**
 * Restrictions for i18n translation keys to enforce camelCase
 */
export const i18nCamelCaseRestrictions = [
  {
    selector:
      "CallExpression[callee.name='t'] > Literal[value=/\\s/], CallExpression[callee.type='MemberExpression'][callee.object.name='i18n'][callee.property.name='t'] > Literal[value=/\\s/]",
    message:
      'i18n Convention Violation: Translation keys should not contain spaces. Use camelCase (e.g., "myOrganizations").',
  },
  {
    selector:
      "CallExpression[callee.name='t'] > Literal[value=/^(?![a-z])/], CallExpression[callee.type='MemberExpression'][callee.object.name='i18n'][callee.property.name='t'] > Literal[value=/^(?![a-z])/]",
    message:
      'i18n Convention Violation: Translation keys should start with a lowercase letter (camelCase).',
  },
  {
    selector:
      "CallExpression[callee.name='t'] > Literal[value=/[-_]/], CallExpression[callee.type='MemberExpression'][callee.object.name='i18n'][callee.property.name='t'] > Literal[value=/[-_]/]",
    message:
      'i18n Convention Violation: Translation keys should not contain dashes or underscores. Use camelCase.',
  },
  {
    selector:
      "CallExpression[callee.name='t'] > Literal[value=/[^a-zA-Z0-9.:]/], CallExpression[callee.type='MemberExpression'][callee.object.name='i18n'][callee.property.name='t'] > Literal[value=/[^a-zA-Z0-9.:]/]",
    message:
      'i18n Convention Violation: Translation keys should only contain alphanumeric characters, dots, or colons.',
  },
];
