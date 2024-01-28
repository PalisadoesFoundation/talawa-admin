import type { Dispatch, SetStateAction } from 'react';
import React from 'react';
import { render } from '@testing-library/react';
import CurrentHourIndicator from './CurrentHourIndicator';

describe('Testing Current Hour Indicator', () => {
  test('Component Should be rendered properly', async () => {
    render(<CurrentHourIndicator />);
  });
});
