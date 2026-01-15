[**talawa-admin**](../../../../../README.md)

***

# Type Alias: DateOrNull

> **DateOrNull** = `Date` \| `null`

Defined in: [src/types/shared-components/DateRangePicker/interface.ts:20](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/types/shared-components/DateRangePicker/interface.ts#L20)

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
