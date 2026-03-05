[Admin Docs](/)

***

# Variable: default

> `const` **default**: `React.FC`\<[`InterfaceTimePickerProps`](../../../../types/shared-components/TimePicker/interface/interfaces/InterfaceTimePickerProps.md)\>

Defined in: [src/shared-components/TimePicker/TimePicker.tsx:30](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/TimePicker/TimePicker.tsx#L30)

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
