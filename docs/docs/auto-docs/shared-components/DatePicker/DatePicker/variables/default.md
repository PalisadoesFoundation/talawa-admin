[**talawa-admin**](../../../../README.md)

***

# Variable: default

> `const` **default**: `React.FC`\<`InterfaceDatePickerProps`\>

Defined in: [src/shared-components/DatePicker/DatePicker.tsx:79](https://github.com/ad1tyayadav/talawa-admin/blob/113d6bb4150eecf2f42bfd13d7ecd3aa2d021635/src/shared-components/DatePicker/DatePicker.tsx#L79)

DatePicker wrapper component that integrates MUI DatePicker with react-bootstrap styling.

This component provides a standardized date picker interface that maintains consistency
across the application by using react-bootstrap Form.Control for styling.

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
