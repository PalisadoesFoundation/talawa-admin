import React from 'react';

type DivProps = React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>;
type BtnProps = React.PropsWithChildren<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { 'data-testid'?: string }
>;

interface InterfaceDropdown extends React.FC<DivProps> {
  Toggle: React.FC<BtnProps>;
  Menu: React.FC<DivProps>;
  Item: React.FC<BtnProps>;
}

const Dropdown = (({ children, ...rest }: DivProps) => (
  <div {...rest}>{children}</div>
)) as InterfaceDropdown;

Dropdown.Toggle = ({ children, onClick, ...rest }: BtnProps) => (
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

Dropdown.Menu = ({ children, ...rest }: DivProps) => (
  <div {...rest}>{children}</div>
);

Dropdown.Item = ({ children, onClick, ...rest }: BtnProps) => (
  <button
    data-testid={(rest as { 'data-testid'?: string })['data-testid']}
    onClick={onClick}
    {...rest}
  >
    {children}
  </button>
);

export { Dropdown };
