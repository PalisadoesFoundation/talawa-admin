[Admin Docs](/)

***

# Variable: default

> `const` **default**: `React.FC`\<`InterfaceDatePickerProps`\>

Defined in: [src/shared-components/DatePicker/DatePicker.tsx:90](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/DatePicker/DatePicker.tsx#L90)

DatePicker wrapper component that integrates MUI DatePicker with react-bootstrap styling.

This component provides a standardized date picker interface that maintains consistency
across the application by using react-bootstrap Form.Control for styling.

## Param

The component props.

## Param

Label displayed for the date picker.

## Param

Current date value.

## Param

Callback fired when the date changes.

## Param

Minimum selectable date constraint.

## Param

Maximum selectable date constraint.

## Param

Whether the date picker is disabled.

## Param

Additional CSS class name.

## Param

Test ID for testing purposes.

## Param

Cypress Test ID.

## Param

Additional props passed to MUI DatePicker slots.

## Param

Custom slot component overrides.

## Example

```tsx
<DatePicker
  label="Select Date"
  value={selectedDate}
  onChange={setSelectedDate}
  minDate={dayjs()}
/>
```
