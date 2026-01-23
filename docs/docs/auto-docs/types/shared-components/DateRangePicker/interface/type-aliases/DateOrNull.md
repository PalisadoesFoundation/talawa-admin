[**talawa-admin**](../../../../../README.md)

***

# Type Alias: DateOrNull

> **DateOrNull** = `Date` \| `null`

Defined in: [src/types/shared-components/DateRangePicker/interface.ts:20](https://github.com/VanshikaSabharwal/talawa-admin/blob/b013ea08c548e04dfa8e27b7d9e9418af9419ded/src/types/shared-components/DateRangePicker/interface.ts#L20)

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
