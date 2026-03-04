import Button from 'shared-components/Button';
import type { ButtonProps } from 'shared-components/Button';
import styles from './StandardHeaderButton.module.css';

//Button types

export type StandardHeaderButtonVariant = 'default' | 'primary';

//StandardHeaderButtonProps Button function props that extends the ButtonProps

export interface IStandardHeaderButtonProps extends ButtonProps {
  variant?: StandardHeaderButtonVariant;
}

//Button Function

function StandardHeaderButton({
  variant = 'default',
  size = 'sm',
  children,
  className,
  ...rest
}: IStandardHeaderButtonProps) {
  const mappedVariant = variant === 'primary' ? 'primary' : 'outline-secondary';

  const classes = [styles.headerButton, className].filter(Boolean).join(' ');

  return (
    <Button variant={mappedVariant} size={size} className={classes} {...rest}>
      {children}
    </Button>
  );
}

StandardHeaderButton.displayName = 'StandardHeaderButton';

export default StandardHeaderButton;
