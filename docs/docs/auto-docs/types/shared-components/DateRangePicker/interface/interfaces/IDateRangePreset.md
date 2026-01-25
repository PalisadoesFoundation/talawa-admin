[**talawa-admin**](../../../../../README.md)

***

# Interface: IDateRangePreset

Defined in: [src/types/shared-components/DateRangePicker/interface.ts:52](https://github.com/BittuBarnwal7479/talawa-admin/blob/7329c220ecd98ce2ec3fc0b9fc39dd1a39bb1df4/src/types/shared-components/DateRangePicker/interface.ts#L52)

IDateRangePreset

Configuration for a preset date range button.

## Param

Optional reference date for relative presets.
Defaults to the current date if not provided.

## Example

```ts
{
  key: 'last7days',
  label: 'Last 7 Days',
  getRange: (refDate = new Date()) => ({
    startDate: dayjs(refDate).subtract(7, 'day').toDate(),
    endDate: refDate,
  }),
}
```

## Properties

### getRange()

> **getRange**: (`refDate?`) => [`IDateRangeValue`](IDateRangeValue.md)

Defined in: [src/types/shared-components/DateRangePicker/interface.ts:55](https://github.com/BittuBarnwal7479/talawa-admin/blob/7329c220ecd98ce2ec3fc0b9fc39dd1a39bb1df4/src/types/shared-components/DateRangePicker/interface.ts#L55)

#### Parameters

##### refDate?

`Date`

#### Returns

[`IDateRangeValue`](IDateRangeValue.md)

***

### key

> **key**: `string`

Defined in: [src/types/shared-components/DateRangePicker/interface.ts:53](https://github.com/BittuBarnwal7479/talawa-admin/blob/7329c220ecd98ce2ec3fc0b9fc39dd1a39bb1df4/src/types/shared-components/DateRangePicker/interface.ts#L53)

***

### label

> **label**: `string`

Defined in: [src/types/shared-components/DateRangePicker/interface.ts:54](https://github.com/BittuBarnwal7479/talawa-admin/blob/7329c220ecd98ce2ec3fc0b9fc39dd1a39bb1df4/src/types/shared-components/DateRangePicker/interface.ts#L54)
