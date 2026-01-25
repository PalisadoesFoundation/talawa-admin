/**
 * Security-related syntax restrictions that apply everywhere
 */
export const securityRestrictions = [
  {
    selector:
      "Property[key.name='authorization'][value.type='CallExpression'][value.callee.type='MemberExpression'][value.callee.property.name='getItem'][value.arguments.0.value='token']",
    message:
      "Security Risk: Do not use getItem('token') directly inside authorization headers. Extract it to a variable first to handle null values.",
  },
  {
    selector: "ImportSpecifier[imported.name='REVOKE_REFRESH_TOKEN']",
    message:
      'HTTP-Only Cookie Violation: Do not use REVOKE_REFRESH_TOKEN for logout. Use LOGOUT_MUTATION instead, which correctly reads refresh tokens from HTTP-only cookies.',
  },
  {
    selector:
      "Property[key.name='variables'] Property[key.name='refreshToken']",
    message:
      'HTTP-Only Cookie Violation: Do not pass refreshToken as a variable. The API reads refresh tokens from HTTP-only cookies automatically.',
  },
];
