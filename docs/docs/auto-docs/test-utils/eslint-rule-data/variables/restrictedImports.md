[Admin Docs](/)

***

# Variable: restrictedImports

> `const` **restrictedImports**: (\{ `id`: `string`; `importNames?`: `undefined`; `message`: `string`; `name`: `string`; \} \| \{ `id`: `string`; `importNames`: `string`[]; `message`: `string`; `name`: `string`; \} \| \{ `id?`: `undefined`; `importNames`: `string`[]; `message`: `string`; `name`: `string`; \} \| \{ `id?`: `undefined`; `importNames?`: `undefined`; `message`: `string`; `name`: `string`; \})[]

Defined in: [src/test-utils/eslint-rule-data.ts:12](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/test-utils/eslint-rule-data.ts#L12)

Central registry for restricted imports used by the base rule and overrides.
Add new restrictions here, then allow them in specific folders via IDs.
For more details refer `docs/docs/docs/developer-resources/reusable-components.md`
