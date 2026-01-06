[Admin Docs](/)

***

# Variable: default

> `const` **default**: `React.FC`\<`InterfaceTimePickerProps`\>

Defined in: [src/shared-components/TimePicker/TimePicker.tsx:92](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/TimePicker/TimePicker.tsx#L92)

TimePicker wrapper component that integrates MUI TimePicker with react-bootstrap styling.

This component provides a standardized time picker interface that maintains consistency
across the application by using react-bootstrap Form.Control for styling.

## Param

The component props.

## Param

Label displayed for the time picker.

## Param

Current time value.

## Param

Callback fired when the time changes.

## Param

Minimum selectable time constraint.

## Param

Maximum selectable time constraint.

## Param

Whether the time picker is disabled.

## Param

Additional CSS class name.

## Param

Test ID for testing purposes.

## Param

Additional props passed to MUI TimePicker slots.

## Param

Custom slot component overrides.

## Param

Step increments for time controls.

## Param

Whether to disable the open picker button.

## Example

```tsx
<TimePicker
  label="Select Time"
  value={selectedTime}
  onChange={setSelectedTime}
  timeSteps={{ minutes: 15 }}
/>
```
