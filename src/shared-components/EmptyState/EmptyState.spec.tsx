import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import EmptyState from './EmptyState';
import type { InterfaceEmptyStateProps } from 'types/shared-components/EmptyState/interface';
import {
  emptyStateBaseMock,
  emptyStateWithDescriptionMock,
  emptyStateWithIconMock,
  emptyStateWithCustomIconMock,
  emptyStateBaseForActionMock,
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
  afterEach(() => {
    vi.clearAllMocks(); // Clear call history
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

  it('applies action props correctly and test onClick action prop', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    renderEmptyState({
      ...emptyStateBaseForActionMock,
      action: {
        label: 'createNew',
        onClick: handleClick,
        variant: 'primary',
      },
    });
    const button = screen.getByRole('button', { name: 'createNew' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('btn-contained');
    await user.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('has proper accessibility attributes', () => {
    renderEmptyState(emptyStateBaseMock);
    const container = screen.getByRole('status');
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

  it('renders correctly with all props', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    renderEmptyState({
      ...emptyStateWithAllPropsMock,
      action: {
        label: 'resetFilters',
        onClick: handleClick,
        variant: 'secondary',
      },
    });
    const button = screen.getByRole('button', { name: 'resetFilters' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('btn-text');
    await user.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(screen.getByText('noResults')).toBeInTheDocument();
    expect(screen.getByText('tryAdjustingFilters')).toBeInTheDocument();
    expect(screen.getByTestId('custom-empty-state-icon')).toBeInTheDocument();
    expect(screen.getByTestId('custom-empty-state-action')).toBeInTheDocument();
    expect(screen.getByTestId('custom-empty-state')).toHaveClass(
      'custom-class',
    );
  });
  it('renders action button with secondary variant', () => {
    renderEmptyState({
      message: 'Test',
      action: {
        label: 'Secondary Action',
        onClick: vi.fn(),
        variant: 'secondary',
      },
    });

    const button = screen.getByRole('button', {
      name: 'Secondary Action',
    });

    expect(button).toHaveClass('btn-text');
  });

  it('renders action button with outlined variant', () => {
    renderEmptyState({
      message: 'Test',
      action: {
        label: 'Outlined Action',
        onClick: vi.fn(),
        variant: 'outlined',
      },
    });

    const button = screen.getByRole('button', {
      name: 'Outlined Action',
    });

    expect(button).toHaveClass('btn-outline-primary');
  });
  it('renders action button with default variant when variant is undefined', () => {
    renderEmptyState({
      message: 'Test',
      action: {
        label: 'Default Action',
        onClick: vi.fn(),
      },
    });

    const button = screen.getByRole('button', {
      name: 'Default Action',
    });

    expect(button).toHaveClass('btn-contained');
  });
});

describe('EmptyState – i18n failure fallback', () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });
  it('falls back to raw text when translation throws', async () => {
    vi.resetModules();

    vi.doMock('react-i18next', () => ({
      useTranslation: () => ({
        t: () => {
          throw new Error('i18n crashed');
        },
      }),
    }));

    const { default: EmptyStateComponent } = await import('./EmptyState');
    render(<EmptyStateComponent message="Fallback Text" />);

    expect(screen.getByText('Fallback Text')).toBeInTheDocument();
  });
});
