/**
 * Shared Button — native implementation using design system classes.
 *
 * Replaces react-bootstrap Button. Same props interface, no Bootstrap dependency.
 * Uses the `.btn` / `.btn-primary` / etc. classes from the design system.
 */
/* eslint-disable no-restricted-syntax */
import { forwardRef } from 'react';
import type { ForwardedRef } from 'react';
import styles from './Button.module.css';
import type { ButtonProps, ButtonVariant } from './Button.types';

const VARIANT_CLASS: Record<string, string> = {
  plain: 'plain',
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  success: 'btn-primary', // map to green primary
  danger: 'btn-danger',
  warning: 'btn-secondary',
  info: 'btn-secondary',
  light: 'btn-ghost',
  dark: 'btn-secondary',
  link: 'btn-ghost',
  contained: 'btn-primary',
  outlined: 'btn-secondary',
  outline: 'btn-secondary',
  'outline-primary': 'btn-secondary',
  'outline-secondary': 'btn-secondary',
  'outline-success': 'btn-secondary',
  'outline-danger': 'btn-danger',
  'outline-warning': 'btn-secondary',
  'outline-info': 'btn-secondary',
  'outline-light': 'btn-ghost',
  'outline-dark': 'btn-secondary',
  text: 'btn-ghost',
  toolbar: 'btn-secondary',
  'toolbar-action': 'btn-secondary',
};

const SIZE_CLASS: Record<string, string> = {
  sm: 'btn-sm',
  xl: styles.sizeXl,
};

const resolveVariantClass = (variant: ButtonVariant | undefined): string => {
  if (!variant) return 'btn-primary';
  return VARIANT_CLASS[variant] || 'btn-primary';
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
      type = 'button',
      ...rest
    },
    ref: ForwardedRef<HTMLButtonElement | HTMLAnchorElement>,
  ) => {
    const isDisabled = disabled || isLoading;
    const showStartIcon = icon && iconPosition === 'start' && !isLoading;
    const showEndIcon = icon && iconPosition === 'end' && !isLoading;
    const content = isLoading && loadingText ? loadingText : children;
    const { variant, role, ...restProps } = rest;
    const hasHref = 'href' in restProps && restProps.href !== undefined;

    const classes = [
      variant !== 'plain' && 'btn',
      variant !== 'plain' && resolveVariantClass(variant),
      SIZE_CLASS[size] || '',
      fullWidth ? styles.fullWidth : '',
      isLoading ? styles.isLoading : '',
      className || '',
    ]
      .filter(Boolean)
      .join(' ');

    const inner = (
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
    );

    if (hasHref) {
      return (
        <a
          ref={ref as ForwardedRef<HTMLAnchorElement>}
          className={classes}
          aria-busy={isLoading || undefined}
          aria-live={isLoading ? 'polite' : undefined}
          data-size={size}
          data-fullwidth={fullWidth ? 'true' : undefined}
          role={role ?? 'link'}
          {...(restProps as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {inner}
        </a>
      );
    }

    return (
      <button
        ref={ref as ForwardedRef<HTMLButtonElement>}
        className={classes}
        type={type}
        disabled={isDisabled}
        aria-busy={isLoading || undefined}
        aria-live={isLoading ? 'polite' : undefined}
        data-size={size}
        data-fullwidth={fullWidth ? 'true' : undefined}
        role={role}
        {...(restProps as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {inner}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
