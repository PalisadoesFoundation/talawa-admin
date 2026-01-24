[Admin Docs](/)

***

# Variable: securityRestrictions

> `const` **securityRestrictions**: `object`[]

Defined in: [src/test-utils/eslint-rule-data.ts:158](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/test-utils/eslint-rule-data.ts#L158)

Security-related syntax restrictions that apply everywhere

## Type Declaration

### message

> **message**: `string` = `"Security Risk: Do not use getItem('token') directly inside authorization headers. Extract it to a variable first to handle null values."`

### selector

> **selector**: `string` = `"Property[key.name='authorization'][value.type='CallExpression'][value.callee.type='MemberExpression'][value.callee.property.name='getItem'][value.arguments.0.value='token']"`
