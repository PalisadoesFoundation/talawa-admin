import { ReactJSX } from '@emotion/react/dist/declarations/src/jsx-namespace';
import React from 'react';

export const AsyncComponent = (): ReactJSX.Element => {
  const [text, setText] = React.useState('Loading');

  React.useEffect(() => {
    setTimeout(() => {
      setText('Loaded');
    }, 0);
  }, []);

  return <div data-testid="async-component">{text}</div>;
};
