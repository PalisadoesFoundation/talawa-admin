import React from 'react';

/**
 * Mock Dropdown.Item - renders a button representing an item inside a
 * Dropdown.Menu. For tests we simply forward onClick and any provided props.
 */
export type BtnProps = React.PropsWithChildren<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { 'data-testid'?: string }
>;

const DropdownItem: React.FC<BtnProps> = ({ children, onClick, ...rest }) => (
  <button
    data-testid={(rest as { 'data-testid'?: string })['data-testid']}
    onClick={onClick}
    {...rest}
  >
    {children}
  </button>
);

export default DropdownItem;
