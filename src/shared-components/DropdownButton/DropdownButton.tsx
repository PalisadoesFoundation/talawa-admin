import { Dropdown } from 'react-bootstrap';
import Button from '../Button';
import styles from './DropdownButton.module.css';
import { InterfaceDropdownButtonProps } from 'types/shared-components/DropdownButton/interface';

const mapSizeToBootstrap = (
  size?: InterfaceDropdownButtonProps['size'],
): 'sm' | 'lg' | undefined => {
  if (size === 'sm' || size === 'lg') return size;
  if (size === 'xl') return 'lg';
  return undefined; // md
};

/**
 * Shared dropdown button with consistent styling and menu rendering.
 * @param props - Component props.
 * @returns - JSX.Element
 */
const DropdownButton = ({
  label,
  items,
  variant,
  size = 'md',
  disabled,
  dataTestId,
  align = 'start',
  className,
}: InterfaceDropdownButtonProps) => {
  return (
    <Dropdown className={styles.dropdown}>
      <Dropdown.Toggle
        as={Button}
        variant={variant}
        size={mapSizeToBootstrap(size)}
        disabled={disabled}
        data-testid={dataTestId}
        className={`${styles.dropdownToggle} ${className ?? ''}`}
      >
        {label}
      </Dropdown.Toggle>

      <Dropdown.Menu align={align} className={styles.dropdownMenu}>
        {items.map((item) => (
          <Dropdown.Item
            key={item.key}
            onClick={item.onClick}
            disabled={item.disabled}
            className={styles.dropdownItem}
          >
            {item.label}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default DropdownButton;
