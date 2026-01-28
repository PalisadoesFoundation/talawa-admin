[**talawa-admin**](../../../../../README.md)

***

# Function: timeToDayJs()

> **timeToDayJs**(`time`): `Dayjs`

Defined in: [src/shared-components/EventForm/utils/timeUtils.ts:13](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/shared-components/EventForm/utils/timeUtils.ts#L13)

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
