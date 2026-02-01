[Admin Docs](/)

***

# Variable: default

> `const` **default**: `React.FC`\<[`InterfaceDatePickerProps`](../../../../types/shared-components/DatePicker/interface/interfaces/InterfaceDatePickerProps.md)\>

Defined in: [src/shared-components/DatePicker/DatePicker.tsx:78](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/DatePicker/DatePicker.tsx#L78)

DatePicker wrapper component that integrates MUI DatePicker with custom styling.

This component provides a standardized date picker interface that maintains consistency
across the application using design tokens for styling.

## Param

The component props.

## Example

```tsx
<DatePicker
  label="Select Date"
  value={selectedDate}
  onChange={setSelectedDate}
  minDate={dayjs()}
/>
```
Defined in: [src/shared-components/DatePicker/DatePicker.tsx:25](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/DatePicker/DatePicker.tsx#L25)
