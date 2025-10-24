import React from 'react';

/**
 * Mock Dropdown.Toggle - renders a button and forwards onClick and any props.
 * Provides a `data-testid` default of `dropdown` unless overridden. Used by
 * tests that expect a clickable toggle element.
 */
export type BtnProps = React.PropsWithChildren<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { 'data-testid'?: string }
>;

const DropdownToggle: React.FC<BtnProps> = ({ children, onClick, ...rest }) => (
  <button
    type="button"
    data-testid={
      (rest as { 'data-testid'?: string })['data-testid'] || 'dropdown'
    }
    onClick={onClick}
    {...rest}
  >
    {children}
  </button>
);

export default DropdownToggle;
