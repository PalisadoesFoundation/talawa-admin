[**talawa-admin**](../../../../../README.md)

***

# Type Alias: DateOrNull

> **DateOrNull** = `Date` \| `null`

Defined in: [src/types/shared-components/DateRangePicker/interface.ts:20](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/types/shared-components/DateRangePicker/interface.ts#L20)

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
