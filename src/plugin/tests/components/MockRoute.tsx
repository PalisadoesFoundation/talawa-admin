import React from 'react';

const MockRoute = ({
  path,
  element,
}: {
  path: string;
  element: React.ReactNode;
}) => (
  <div data-testid={`route-${path}`} data-path={path}>
    {element}
  </div>
);

export default MockRoute;
