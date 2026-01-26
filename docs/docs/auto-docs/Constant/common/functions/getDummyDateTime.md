[Admin Docs](/)

***

# ~~Function: getDummyDateTime()~~

> **getDummyDateTime**(`time`): `string`

Defined in: [src/Constant/common.ts:115](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/Constant/common.ts#L115)

Generates a dummy date time for dayjs parsing.

## Parameters

### time

`string`

The time string (HH:mm:ss).

## Returns

`string`

The formatted ISO-like string.

## Deprecated

Use DUMMY_DATE_TIME_PREFIX directly in new code.
This function will be removed in v4.0.0.

Migration:
Replace `getDummyDateTime(time)` with `${DUMMY_DATE_TIME_PREFIX}${time}`
