[**talawa-admin**](../../../../README.md)

***

# Variable: default

> `const` **default**: `React.FC`\<`InterfaceTimePickerProps`\>

Defined in: [src/shared-components/TimePicker/TimePicker.tsx:80](https://github.com/BittuBarnwal7479/talawa-admin/blob/7329c220ecd98ce2ec3fc0b9fc39dd1a39bb1df4/src/shared-components/TimePicker/TimePicker.tsx#L80)

TimePicker wrapper component that integrates MUI TimePicker with react-bootstrap styling.

This component provides a standardized time picker interface that maintains consistency
across the application by using react-bootstrap Form.Control for styling.

## Param

The component props.

## Example

```tsx
<TimePicker
  label="Select Time"
  value={selectedTime}
  onChange={setSelectedTime}
  timeSteps={{ minutes: 15 }}
/>
```
