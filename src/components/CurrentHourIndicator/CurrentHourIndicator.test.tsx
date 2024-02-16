import React from 'react';
import { render } from '@testing-library/react';
import CurrentHourIndicator from './CurrentHourIndicator';

describe('Testing Current Hour Indicator', () => {
  test('Component Should be rendered properly', async () => {
    const { getByTestId } = render(<CurrentHourIndicator />);
    expect(getByTestId('container')).toBeInTheDocument();
  });
});
