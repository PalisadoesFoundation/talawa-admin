[**talawa-admin**](../../../../README.md)

***

# Variable: DONATE\_TO\_ORGANIZATION\_WITH\_CURRENCY

> `const` **DONATE\_TO\_ORGANIZATION\_WITH\_CURRENCY**: `DocumentNode`

Defined in: [src/GraphQl/Mutations/mutations.ts:631](https://github.com/yb175/talawa-admin/blob/fce1167047be7ffe368e3ca73cbf38141b19703e/src/GraphQl/Mutations/mutations.ts#L631)

DONATE_TO_ORGANIZATION_WITH_CURRENCY is the currency-aware variant of DONATE_TO_ORGANIZATION for donations with explicit currency.
Accepts an ISO 4217 `currencyCode` (Iso4217CurrencyCode) while preserving the same returned fields: `_id`, `amount`, `nameOfUser`, and `nameOfOrg`.
