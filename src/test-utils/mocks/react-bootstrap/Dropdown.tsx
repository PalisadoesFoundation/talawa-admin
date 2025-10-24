/**
 * Lightweight test mock of react-bootstrap's Dropdown component.
 * Exports a `Dropdown` component with `Toggle`, `Menu` and `Item` subcomponents.
 * This file composes the individual component implementations from the
 * `components/` folder so ESLint's one-component-per-file rule is satisfied.
 */
import type { InterfaceDropdown } from './types';
import DropdownBase from './components/DropdownBase';
import DropdownToggle from './components/DropdownToggle';
import DropdownMenu from './components/DropdownMenu';
import DropdownItem from './components/DropdownItem';

const Dropdown = DropdownBase as InterfaceDropdown;
Dropdown.Toggle = DropdownToggle;
Dropdown.Menu = DropdownMenu;
Dropdown.Item = DropdownItem;

export { Dropdown };
