import { Dropdown } from 'react-bootstrap';
import Button from '../Button';
import styles from 'shared-components/common/css/dropdown.module.css';
import type { DropdownButtonProps } from 'shared-components/DropdownButton/DropdownButton.types';

const mapSizeToBootstrap = (
  size?: DropdownButtonProps['size'],
): 'sm' | 'lg' | undefined => {
  if (size === 'sm' || size === 'lg') return size;
  if (size === 'xl') return 'lg';
  return undefined; // md
};

const DropdownButton = ({
  label,
  items,
  variant,
  size = 'md',
  disabled,
  dataTestId,
  align = 'start',
  className,
}: DropdownButtonProps) => {
  return (
    <Dropdown>
      <Dropdown.Toggle
        as={Button}
        variant={variant}
        size={mapSizeToBootstrap(size)}
        disabled={disabled}
        data-testid={dataTestId}
        className={`${styles.toggle} ${className ?? ''}`}
      >
        {label}
      </Dropdown.Toggle>

      <Dropdown.Menu align={align}>
        {items.map((item) => (
          <Dropdown.Item
            key={item.key}
            onClick={item.onClick}
            disabled={item.disabled}
          >
            {item.label}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default DropdownButton;
