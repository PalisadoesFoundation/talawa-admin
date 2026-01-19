/**
 * Shared Button wrapper around react-bootstrap's Button.
 * Adds loading, icon placement, full-width option, and an `xl` size while
 * forwarding all standard Button props.
 *
 * @param props - Props passed to the Button component, forwarding react-bootstrap ButtonProps plus custom props like loading, icon placement, fullWidth, and xl sizing.
 * @returns JSX.Element - A wrapped react-bootstrap Button with loading state, icon placement, full-width, and xl size support.
 */
import { forwardRef } from 'react';
import type { ForwardedRef } from 'react';
import RBButton from 'react-bootstrap/Button';
import styles from './Button.module.css';
import type { ButtonProps, ButtonSize } from './Button.types';

const mapSizeToBootstrap = (
  size: ButtonSize | undefined,
): 'sm' | 'lg' | undefined => {
  if (size === 'sm' || size === 'lg') {
    return size;
  }
  if (size === 'xl') {
    return 'lg';
  }
  return undefined; // md/default
};

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      children,
      className,
      fullWidth,
      isLoading = false,
      loadingText,
      icon,
      iconPosition = 'start',
      size = 'md',
      disabled,
      ...rest
    },
    ref: ForwardedRef<HTMLButtonElement | HTMLAnchorElement>,
  ) => {
    const bootstrapSize = mapSizeToBootstrap(size);
    const isDisabled = disabled || isLoading;
    const showStartIcon = icon && iconPosition === 'start' && !isLoading;
    const showEndIcon = icon && iconPosition === 'end' && !isLoading;
    const content = isLoading && loadingText ? loadingText : children;
    const { variant, role, ...restProps } = rest;
    const resolvedVariant =
      variant === 'outlined' || variant === 'outline'
        ? 'outline-primary'
        : variant;
    const hasHref = 'href' in restProps && restProps.href !== undefined;

    const classes = [
      styles.button,
      fullWidth ? styles.fullWidth : '',
      size === 'xl' ? styles.sizeXl : '',
      isLoading ? styles.isLoading : '',
      className || '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <RBButton
        ref={ref}
        className={classes}
        size={bootstrapSize}
        variant={resolvedVariant}
        disabled={isDisabled}
        aria-busy={isLoading || undefined}
        aria-live={isLoading ? 'polite' : undefined}
        data-size={size}
        data-fullwidth={fullWidth ? 'true' : undefined}
        role={role ?? (hasHref ? 'link' : undefined)}
        {...restProps}
      >
        <span className={styles.content}>
          {showStartIcon && (
            <span className={`${styles.icon} ${styles.iconStart}`}>{icon}</span>
          )}
          <span className={styles.label}>
            {isLoading && (
              <span
                className={styles.spinner}
                aria-hidden="true"
                data-testid="button-spinner"
              />
            )}
            {content}
          </span>
          {showEndIcon && (
            <span className={`${styles.icon} ${styles.iconEnd}`}>{icon}</span>
          )}
        </span>
      </RBButton>
    );
  },
);

Button.displayName = 'Button';

export default Button;
