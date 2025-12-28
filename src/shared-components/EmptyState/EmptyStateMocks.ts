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

export const emptyStateBaseForActionMock: Omit<
  InterfaceEmptyStateProps,
  'action'
> = {
  message: 'noData',
};

export const emptyStateWithAllPropsMock: Omit<
  InterfaceEmptyStateProps,
  'action'
> = {
  message: 'noResults',
  description: 'tryAdjustingFilters',
  icon: 'search',
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
