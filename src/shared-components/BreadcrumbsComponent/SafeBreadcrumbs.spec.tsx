import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import BreadcrumbsComponent from './BreadcrumbsComponent';
import SafeBreadcrumbs from './SafeBreadcrumbs';
import type { IBreadcrumbsComponentProps } from 'types/shared-components/BreadcrumbsComponent/interface';

vi.mock('./BreadcrumbsComponent', () => ({
  default: vi.fn(() => <div data-testid="breadcrumbs-component" />),
}));

describe('SafeBreadcrumbs', () => {
  const originalEnv = process.env.NODE_ENV;

  const props: IBreadcrumbsComponentProps = {
    items: [
      {
        translationKey: 'common.organizations',
        to: '/organizations',
      },
      {
        translationKey: 'common.events',
        isCurrent: true,
      },
    ],
  };

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    vi.clearAllMocks();
  });

  it('renders BreadcrumbsComponent when inside a Router context', () => {
    render(
      <BrowserRouter>
        <SafeBreadcrumbs {...props} />
      </BrowserRouter>,
    );

    expect(screen.getByTestId('breadcrumbs-component')).toBeInTheDocument();
  });

  it('returns null when rendered outside a Router context', () => {
    const { container } = render(<SafeBreadcrumbs {...props} />);
    expect(container.firstChild).toBeNull();
  });

  it('logs a warning in development mode when outside Router context', () => {
    process.env.NODE_ENV = 'development';
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    render(<SafeBreadcrumbs {...props} />);

    expect(warnSpy).toHaveBeenCalledWith(
      'SafeBreadcrumbs must be used within a Router. Breadcrumbs were not rendered.',
    );
  });

  it('does not log a warning in production mode', () => {
    process.env.NODE_ENV = 'production';
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    render(<SafeBreadcrumbs {...props} />);

    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('forwards all props to BreadcrumbsComponent', () => {
    render(
      <BrowserRouter>
        <SafeBreadcrumbs {...props} />
      </BrowserRouter>,
    );

    expect(BreadcrumbsComponent).toHaveBeenCalledWith(
      expect.objectContaining(props),
      undefined,
    );
  });
});
