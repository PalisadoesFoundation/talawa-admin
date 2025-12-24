import React from 'react';
import { render, act } from '@testing-library/react';
import { describe, it } from 'vitest';

import PeopleCard, { InterfacePeopleCardProps } from './PeopleCard';
import { TestWrapper } from 'components/test-utils/TestWrapper';

const wait = async (ms = 100): Promise<void> => {
  await act(async (): Promise<void> => {
    await new Promise<void>((resolve) => {
      setTimeout(resolve, ms);
    });
  });
};

const baseProps: InterfacePeopleCardProps = {
  id: '1',
  name: 'First Last',
  image: '',
  email: 'first@last.com',
  role: 'Admin',
  sno: '1',
};

describe('Testing PeopleCard Component [User Portal]', () => {
  it('Component renders without image', async () => {
    render(
      <TestWrapper>
        <PeopleCard {...baseProps} />
      </TestWrapper>,
    );

    await wait();
  });

  it('Component renders with image', async () => {
    render(
      <TestWrapper>
        <PeopleCard {...baseProps} image="personImage" />
      </TestWrapper>,
    );

    await wait();
  });
});
