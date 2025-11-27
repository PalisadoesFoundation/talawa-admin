import React from 'react';

interface InterfaceSimpleMockComponentProps {
  text?: string;
  children?: React.ReactNode;
}

const SimpleMockComponent: React.FC<InterfaceSimpleMockComponentProps> = ({
  text,
  children,
}) => <div>{text || children}</div>;

export default SimpleMockComponent;
