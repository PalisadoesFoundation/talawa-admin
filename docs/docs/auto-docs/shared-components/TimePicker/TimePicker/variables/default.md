[**talawa-admin**](../../../../README.md)

***

# Variable: default

> `const` **default**: `React.FC`\<`InterfaceTimePickerProps`\>

Defined in: [src/shared-components/TimePicker/TimePicker.tsx:80](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/shared-components/TimePicker/TimePicker.tsx#L80)

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
