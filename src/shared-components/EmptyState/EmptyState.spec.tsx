import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import EmptyState from './EmptyState';
import type { InterfaceEmptyStateProps } from 'types/shared-components/EmptyState/interface';
import {
  emptyStateBaseMock,
  emptyStateWithDescriptionMock,
  emptyStateWithIconMock,
  emptyStateWithCustomIconMock,
  emptyStateWithActionMock,
  emptyStateWithAllPropsMock,
  emptyStateWithCustomCSSMock,
  emptyStateWithCustomDataTestIdMock,
} from './EmptyStateMocks';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const renderEmptyState = (props: InterfaceEmptyStateProps) => {
  return render(<EmptyState {...props} />);
};

describe('EmptyState Component', () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Clear call history
  });

  afterEach(() => {
    vi.restoreAllMocks(); // Restore original implementations
  });

  it('renders with message only', () => {
    renderEmptyState(emptyStateBaseMock);
    expect(screen.getByText('noData')).toBeInTheDocument();
  });

  it('renders with icon (string)', () => {
    renderEmptyState(emptyStateWithIconMock);
    expect(screen.getByTestId('empty-state-icon')).toBeInTheDocument();
  });

  it('renders with custom icon (ReactNode)', () => {
    renderEmptyState(emptyStateWithCustomIconMock);
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('renders with description', () => {
    renderEmptyState(emptyStateWithDescriptionMock);
    expect(screen.getByText('createYourFirstCampaign')).toBeInTheDocument();
  });

  it('applies action props correctly', () => {
    renderEmptyState(emptyStateWithActionMock);
    const button = screen.getByRole('button', { name: 'createNew' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('MuiButton-contained');
  });

  it('renders action button and handles click', () => {
    const handleClick = vi.fn();
    renderEmptyState({
      message: 'No data',
      action: {
        label: 'Create New',
        onClick: handleClick,
        variant: 'outlined',
      },
    });

    const button = screen.getByRole('button', { name: 'Create New' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('MuiButton-outlined');
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('has proper accessibility attributes', () => {
    renderEmptyState(emptyStateBaseMock);
    const container = screen.getByRole('alert');
    expect(container).toHaveAttribute('aria-label', 'noData');
  });

  it('applies custom className', () => {
    renderEmptyState(emptyStateWithCustomCSSMock);
    const container = screen.getByTestId('empty-state');
    expect(container).toHaveClass('custom-css-class');
  });

  it('uses custom dataTestId', () => {
    renderEmptyState(emptyStateWithCustomDataTestIdMock);
    expect(screen.getByTestId('my-empty-state')).toBeInTheDocument();
  });

  it('renders correctly with all props', () => {
    const { getByText, getByTestId } = renderEmptyState(
      emptyStateWithAllPropsMock,
    );
    expect(getByText('noResults')).toBeInTheDocument();
    expect(getByText('tryAdjustingFilters')).toBeInTheDocument();
    expect(getByTestId('custom-empty-state-icon')).toBeInTheDocument();
    expect(getByTestId('custom-empty-state-action')).toBeInTheDocument();
    expect(getByTestId('custom-empty-state')).toHaveClass('custom-class');
  });
});

describe('EmptyState – i18n failure fallback', () => {
  it('falls back to raw text when translation throws', async () => {
    vi.resetModules();

    vi.doMock('react-i18next', () => ({
      useTranslation: () => ({
        t: () => {
          throw new Error('i18n crashed');
        },
      }),
    }));

    render(<EmptyState message="Fallback Text" />);

    expect(screen.getByText('Fallback Text')).toBeInTheDocument();
  });
});
