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
