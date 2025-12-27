[**talawa-admin**](README.md)

***

# Function: useFieldValidation()

> **useFieldValidation**\<`T`\>(`validator`, `value`, `trigger`): [`IUseFieldValidationReturn`](types\Auth\useFieldValidation\README\interfaces\IUseFieldValidationReturn.md)

Defined in: [src/hooks/useFieldValidation.ts:16](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/hooks/useFieldValidation.ts#L16)

Generic hook to manage field-level validation state.

## Type Parameters

### T

`T`

## Parameters

### validator

(`value`) => [`IValidationResult`](types\Auth\useFieldValidation\README\interfaces\IValidationResult.md)

Function that validates a field value

### value

`T`

Current field value

### trigger

[`ValidationTrigger`](types\Auth\useFieldValidation\README\type-aliases\ValidationTrigger.md) = `'onBlur'`

Validation trigger strategy

## Returns

[`IUseFieldValidationReturn`](types\Auth\useFieldValidation\README\interfaces\IUseFieldValidationReturn.md)

Validation error state and helper functions
