[**talawa-admin**](../../../../../README.md)

***

# Function: timeToDayJs()

> **timeToDayJs**(`time`): `Dayjs`

Defined in: [src/shared-components/EventForm/utils/timeUtils.ts:13](https://github.com/VanshikaSabharwal/talawa-admin/blob/b013ea08c548e04dfa8e27b7d9e9418af9419ded/src/shared-components/EventForm/utils/timeUtils.ts#L13)

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
