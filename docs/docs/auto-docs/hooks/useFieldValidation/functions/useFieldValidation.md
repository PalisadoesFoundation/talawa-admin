[**talawa-admin**](../../../README.md)

***

# Function: useFieldValidation()

> **useFieldValidation**\<`T`\>(`validator`, `value`, `trigger`): [`IUseFieldValidationReturn`](../../../types/Auth/useFieldValidation/interfaces/IUseFieldValidationReturn.md)

Defined in: [src/hooks/useFieldValidation.ts:16](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/hooks/useFieldValidation.ts#L16)

Generic hook to manage field-level validation state.

## Type Parameters

### T

`T`

## Parameters

### validator

(`value`) => [`IValidationResult`](../../../types/Auth/useFieldValidation/interfaces/IValidationResult.md)

Function that validates a field value

### value

`T`

Current field value

### trigger

[`ValidationTrigger`](../../../types/Auth/useFieldValidation/type-aliases/ValidationTrigger.md) = `'onBlur'`

Validation trigger strategy

## Returns

[`IUseFieldValidationReturn`](../../../types/Auth/useFieldValidation/interfaces/IUseFieldValidationReturn.md)

Validation error state and helper functions
