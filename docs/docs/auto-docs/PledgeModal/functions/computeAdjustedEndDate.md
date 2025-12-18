[Admin Docs](/)

***

# Function: computeAdjustedEndDate()

> **computeAdjustedEndDate**(`pledgeEndDate`, `date`): `Date`

Defined in: [src/screens/UserPortal/Campaigns/PledgeModal.tsx:121](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/UserPortal/Campaigns/PledgeModal.tsx#L121)

Ensures pledge end date is not before the selected start date.
Returns the later of the two dates.

## Parameters

### pledgeEndDate

`Date`

Current pledge end date

### date

`Dayjs`

Newly selected start date

## Returns

`Date`

Adjusted end date or the original end date if no adjustment is needed

## Example

```ts
computeAdjustedEndDate(new Date('2024-01-01'), dayjs('2024-02-01'));
// returns Date('2024-02-01')
```
