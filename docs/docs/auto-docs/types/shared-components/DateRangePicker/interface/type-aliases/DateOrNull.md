[**talawa-admin**](../../../../../README.md)

***

# Type Alias: DateOrNull

> **DateOrNull** = `Date` \| `null`

Defined in: [src/types/shared-components/DateRangePicker/interface.ts:20](https://github.com/BittuBarnwal7479/talawa-admin/blob/7329c220ecd98ce2ec3fc0b9fc39dd1a39bb1df4/src/types/shared-components/DateRangePicker/interface.ts#L20)

DateRangePicker shared types

## Remarks

All date values are local `Date` objects.
Timezone conversion and serialization (ISO strings, server formats)
must be handled by GraphQL middleware or API adapters.

## Example

```tsx
const [range, setRange] = useState<IDateRangeValue>({
  startDate: null,
  endDate: null,
});

<DateRangePicker value={range} onChange={setRange} />
```
