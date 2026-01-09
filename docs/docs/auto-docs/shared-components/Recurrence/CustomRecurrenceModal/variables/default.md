[Admin Docs](/)

***

# Variable: default

> `const` **default**: `React.FC`\<[`InterfaceCustomRecurrenceModalProps`](../../../../types/Recurrence/interface/interfaces/InterfaceCustomRecurrenceModalProps.md)\>

Defined in: [src/shared-components/Recurrence/CustomRecurrenceModal.tsx:69](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/Recurrence/CustomRecurrenceModal.tsx#L69)

CustomRecurrenceModal Component

A shared modal component for configuring custom recurrence rules for events.
This component is used by both Admin and User portals via the shared EventForm.

## Param

Current recurrence rule state

## Param

Function to update recurrence rule state

## Param

Event end date

## Param

Function to set event end date

## Param

Whether the modal is open

## Param

Function to hide the modal

## Param

Function to set modal open state

## Param

Translation function

## Param

Event start date

## Returns

The rendered CustomRecurrenceModal component

## Remarks

- Supports daily, weekly, monthly, and yearly recurrence frequencies
- Allows configuration of interval (every N days/weeks/months/years)
- Weekly recurrence supports day-of-week selection
- Monthly recurrence supports by-date or by-weekday options
- End conditions: never, on specific date, or after N occurrences
- Includes comprehensive ARIA attributes for accessibility
- Supports keyboard navigation for weekday selection
- Includes data-cy attributes for E2E testing

## Example

```tsx
<CustomRecurrenceModal
  recurrenceRuleState={recurrenceRule}
  setRecurrenceRuleState={setRecurrenceRule}
  endDate={eventEndDate}
  setEndDate={setEventEndDate}
  customRecurrenceModalIsOpen={isOpen}
  hideCustomRecurrenceModal={() => setIsOpen(false)}
  setCustomRecurrenceModalIsOpen={setIsOpen}
  t={t}
  startDate={eventStartDate}
/>
```
