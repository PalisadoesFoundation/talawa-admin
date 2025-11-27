import React from 'react';

export const createMockComponent = (id: string) => {
  const MockComponentWithId = () => <div>{id}</div>;
  return MockComponentWithId;
};
