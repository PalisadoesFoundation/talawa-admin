[Admin Docs](/)

***

# Variable: RecurrenceEndOptionsSection

> `const` **RecurrenceEndOptionsSection**: `React.FC`\<[`InterfaceRecurrenceEndOptionsSectionProps`](../../../../types/shared-components/Recurrence/interface/interfaces/InterfaceRecurrenceEndOptionsSectionProps.md)\>

Defined in: [src/shared-components/Recurrence/RecurrenceEndOptionsSection.tsx:34](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/Recurrence/RecurrenceEndOptionsSection.tsx#L34)

Recurrence end options section.

Renders radio buttons and inputs for configuring when a recurring event ends:
- Never (no end date)
- On a specific date
- After a certain number of occurrences

## Param

The current recurrence frequency.

## Param

The currently selected end option.

## Param

The current recurrence rule state.

## Param

The local count value for the "ends after" option.

## Param

Callback when the end option changes.

## Param

Callback when the occurrence count changes.

## Param

Setter for the recurrence rule state.
