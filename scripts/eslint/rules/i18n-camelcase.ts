/**
 * Restrictions for i18n translation keys to enforce camelCase
 */
export const tCallSelector =
  ":matches(CallExpression[callee.name='t'], CallExpression[callee.type='MemberExpression'][callee.property.name='t'])";

export const i18nCamelCaseRestrictions = [
  {
    selector: `${tCallSelector} > Literal[value=/\\s/]`,
    message:
      'i18n Convention Violation: Translation keys should not contain spaces. Use camelCase (e.g., "myOrganizations").',
  },
  {
    selector: `${tCallSelector} > Literal[value=/^(?![a-z])/]`,
    message:
      'i18n Convention Violation: Translation keys should start with a lowercase letter (camelCase).',
  },
  {
    selector: `${tCallSelector} > Literal[value=/[-_]/]`,
    message:
      'i18n Convention Violation: Translation keys should not contain dashes or underscores. Use camelCase.',
  },
  {
    selector: `${tCallSelector} > Literal[value=/[^a-zA-Z0-9.:]/]`,
    message:
      'i18n Convention Violation: Translation keys should only contain alphanumeric characters, dots, or colons.',
  },
];
