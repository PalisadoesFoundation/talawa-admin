[Admin Docs](/)

***

# Variable: DONATE\_TO\_ORGANIZATION\_WITH\_CURRENCY

> `const` **DONATE\_TO\_ORGANIZATION\_WITH\_CURRENCY**: `DocumentNode`

Defined in: [src/GraphQl/Mutations/mutations.ts:630](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/GraphQl/Mutations/mutations.ts#L630)

DONATE_TO_ORGANIZATION_WITH_CURRENCY is the currency-aware variant of DONATE_TO_ORGANIZATION for donations with explicit currency.
Accepts an ISO 4217 `currencyCode` (Iso4217CurrencyCode) while preserving the same returned fields: `_id`, `amount`, `nameOfUser`, and `nameOfOrg`.
