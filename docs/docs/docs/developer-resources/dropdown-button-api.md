---
id: dropdown-button
title: DropDownButton Shared-Component
slug: /developer-resources/dropdown-button-shared
sidebar_position: 49
---

# DropDownButton API

The `DropDownButton` component is a reusable dropdown selector from the `shared-components` library. It provides a customizable menu for selecting a single value from a list of options, supporting accessibility, keyboard navigation, and flexible customization.

---

## Import

```jsx
import DropDownButton from 'shared-components/DropDownButton';
```

---

## Usage

```jsx
<DropDownButton
  id="role-dropdown"
  buttonLabel="Select an option"
  options={[
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2', disabled: true },
  ]}
  selectedValue={selectedValue}
  onSelect={handleSelect}
  placeholder="Choose one"
  disabled={false}
  parentContainerStyle="my-dropdown-container"
  btnStyle="my-dropdown-btn"
  ariaLabel="Role selector"
  dataTestIdPrefix="dropdown"
  variant="primary"
  icon={<MyIcon />}
/>
```

---

## Props

| Prop                   | Type                                                                                                                                                                                                                                                             | Required | Default | Description                                   |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|---------|-----------------------------------------------|
| `id`                   | `string`                                                                                                                                                                                                                                                         | No       | —       | The id of the dropdown button.                |
| `buttonLabel`          | `string`                                                                                                                                                                                                                                                         | No       | —       | The label of the button.                      |
| `options`              | `InterfaceDropDownOption[]`                                                                                                                                                                                                                                      | Yes      | —       | The options to be displayed in the dropdown.  |
| `selectedValue`        | `string`                                                                                                                                                                                                                                                         | No       | —       | The currently selected value.                 |
| `onSelect`             | `(value: string) => void`                                                                                                                                                                                                                                        | Yes      | —       | Callback function when an option is selected. |
| `placeholder`          | `string`                                                                                                                                                                                                                                                         | No       | —       | Placeholder text when no option is selected.  |
| `disabled`             | `boolean`                                                                                                                                                                                                                                                        | No       | `false` | Whether the dropdown button is disabled.      |
| `parentContainerStyle` | `string`                                                                                                                                                                                                                                                         | No       | —       | Custom styles for the parent container.       |
| `btnStyle`             | `string`                                                                                                                                                                                                                                                         | No       | —       | Custom styles for the dropdown button.        |
| `ariaLabel`            | `string`                                                                                                                                                                                                                                                         | No       | —       | ARIA label for accessibility.                 |
| `dataTestIdPrefix`     | `string`                                                                                                                                                                                                                                                         | No       | —       | Data test id prefix for testing purposes.     |
| `variant`              | `'primary' \| 'secondary' \| 'success' \| 'danger' \| 'warning' \| 'info' \| 'light' \| 'dark' \| 'outline-primary' \| 'outline-secondary' \| 'outline-success' \| 'outline-danger' \| 'outline-warning' \| 'outline-info' \| 'outline-light' \| 'outline-dark'` | No       | —       | The variant/style of the button.              |
| `icon`                 | `React.ReactNode`                                                                                                                                                                                                                                                | No       | —       | The icon to be displayed on the button.       |

---


## Option Object

Each item in the `options` array should have the following shape:

```js
{
    label: 'Display Text',
    value: 'unique-value',
    disabled: false // optional
}
```

---

## Example

```jsx
const options = [
  { label: 'Admin', value: 'admin' },
  { label: 'Editor', value: 'editor', disabled: true },
  { label: 'Viewer', value: 'viewer' },
];

function RoleSelector() {
  const [role, setRole] = React.useState('');

  return (
    <DropDownButton
      id="role-dropdown"
      buttonLabel="Select Role"
      options={options}
      selectedValue={role}
      onSelect={setRole}
      placeholder="Choose a role"
      ariaLabel="Role selector"
      parentContainerStyle="role-dropdown-container"
      btnStyle="role-dropdown-btn"
      variant="primary"
      disabled={false}
    />
  );
}
```

### More Examples

#### Example: Dropdown with Icons

```jsx
import { FaUser, FaUserShield, FaUserEdit } from 'react-icons/fa';

const optionsWithIcons = [
    { label: <><FaUserShield /> Admin</>, value: 'admin' },
    { label: <><FaUserEdit /> Editor</>, value: 'editor' },
    { label: <><FaUser /> Viewer</>, value: 'viewer' },
];

function IconDropdown() {
    const [role, setRole] = React.useState('');

    return (
        <DropDownButton
            id="icon-role-dropdown"
            buttonLabel="Select Role"
            options={optionsWithIcons}
            selectedValue={role}
            onSelect={setRole}
            placeholder="Choose a role"
            variant="secondary"
            icon={<FaUser />}
        />
    );
}
```

#### Example: Disabled Dropdown

```jsx
function DisabledDropdown() {
    return (
        <DropDownButton
            id="disabled-dropdown"
            buttonLabel="Disabled"
            options={[
                { label: 'Option 1', value: '1' },
                { label: 'Option 2', value: '2' },
            ]}
            disabled={true}
            placeholder="Not selectable"
        />
    );
}
```
---

## Accessibility

- Fully keyboard navigable (Tab, Arrow keys, Enter/Escape).
- ARIA attributes for screen readers.
- Provide meaningful `ariaLabel`, `buttonLabel`, and `placeholder` for better accessibility.

---

## Customization

- Use the `parentContainerStyle` and `btnStyle` props to apply custom styles.
- Use the `variant` prop to change the button style.
- Add an `icon` to the button if needed.

---


## Notes

- Always provide a unique `value` for each option.
- The `onSelect` callback receives the selected value.
- Supports integration with forms via `id` prop.
- For advanced usage, refer to the source code or open an issue in the repository.
