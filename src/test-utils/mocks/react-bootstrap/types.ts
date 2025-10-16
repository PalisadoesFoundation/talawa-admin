import React from 'react';

export type DivProps = React.PropsWithChildren<
  React.HTMLAttributes<HTMLDivElement>
>;
export type BtnProps = React.PropsWithChildren<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { 'data-testid'?: string }
>;

export interface InterfaceDropdown extends React.FC<DivProps> {
  Toggle: React.FC<BtnProps>;
  Menu: React.FC<DivProps>;
  Item: React.FC<BtnProps>;
}
