[**talawa-admin**](../../../../../README.md)

***

# Function: timeToDayJs()

> **timeToDayJs**(`time`): `Dayjs`

Defined in: [src/shared-components/EventForm/utils/timeUtils.ts:13](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/shared-components/EventForm/utils/timeUtils.ts#L13)

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
