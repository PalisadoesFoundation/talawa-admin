import React from 'react';
import type { InterfaceEmptyStateProps } from 'types/shared-components/EmptyState/interface';

export const emptyStateBaseMock: InterfaceEmptyStateProps = {
  message: 'noData',
};

export const emptyStateWithDescriptionMock: InterfaceEmptyStateProps = {
  message: 'noCampaigns',
  description: 'createYourFirstCampaign',
};

export const emptyStateWithIconMock: InterfaceEmptyStateProps = {
  message: 'noUsers',
  icon: 'person',
};

export const emptyStateWithCustomIconMock: InterfaceEmptyStateProps = {
  message: 'customIcon',
  icon: React.createElement('div', { 'data-testid': 'custom-icon' }, '🎉'),
};

export const emptyStateWithActionMock: InterfaceEmptyStateProps = {
  message: 'noData',
  action: {
    label: 'createNew',
    onClick: vi.fn(),
    variant: 'primary',
  },
};

export const emptyStateWithAllPropsMock: InterfaceEmptyStateProps = {
  message: 'noResults',
  description: 'tryAdjustingFilters',
  icon: 'search',
  action: {
    label: 'resetFilters',
    onClick: vi.fn(),
    variant: 'secondary',
  },
  className: 'custom-class',
  dataTestId: 'custom-empty-state',
};

export const emptyStateWithCustomCSSMock: InterfaceEmptyStateProps = {
  message: 'styledEmptyState',
  className: 'custom-css-class',
};

export const emptyStateWithCustomDataTestIdMock: InterfaceEmptyStateProps = {
  message: 'dataTestIdExample',
  dataTestId: 'my-empty-state',
};
