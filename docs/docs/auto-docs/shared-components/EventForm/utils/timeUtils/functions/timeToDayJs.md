[**talawa-admin**](../../../../../README.md)

***

# Function: timeToDayJs()

> **timeToDayJs**(`time`): `Dayjs`

Defined in: [src/shared-components/EventForm/utils/timeUtils.ts:13](https://github.com/BittuBarnwal7479/talawa-admin/blob/7329c220ecd98ce2ec3fc0b9fc39dd1a39bb1df4/src/shared-components/EventForm/utils/timeUtils.ts#L13)

Converts a time string (HH:mm:ss) to a dayjs object.

## Parameters

### time

`string`

Time string in HH:mm:ss format

## Returns

`Dayjs`

A dayjs object with the specified time set on today's date

## Example

```ts
timeToDayJs('14:30:00') // Returns dayjs object for 2:30 PM today
```
