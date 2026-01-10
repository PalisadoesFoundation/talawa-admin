import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import i18n from 'utils/i18nForTest';
import ApplyToSelector from './ApplyToSelector';
import type { ApplyToType } from 'types/AdminPortal/ApplyToSelector/interface';

describe('ApplyToSelector', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  const renderComponent = (
    applyTo: ApplyToType = 'series',
    onChange = vi.fn(),
  ) => {
    return render(
      <I18nextProvider i18n={i18n}>
        <ApplyToSelector applyTo={applyTo} onChange={onChange} />
      </I18nextProvider>,
    );
  };

  it('renders both radio options', () => {
    renderComponent();

    expect(screen.getByLabelText(/entire series/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/this event only/i)).toBeInTheDocument();
  });

  it('shows series option checked when applyTo is series', () => {
    renderComponent('series');

    const seriesRadio = screen.getByLabelText(/entire series/i);
    const instanceRadio = screen.getByLabelText(/this event only/i);

    expect(seriesRadio).toBeChecked();
    expect(instanceRadio).not.toBeChecked();
  });

  it('shows instance option checked when applyTo is instance', () => {
    renderComponent('instance');

    const seriesRadio = screen.getByLabelText(/entire series/i);
    const instanceRadio = screen.getByLabelText(/this event only/i);

    expect(seriesRadio).not.toBeChecked();
    expect(instanceRadio).toBeChecked();
  });

  it('calls onChange with series when series radio is clicked', async () => {
    const onChange = vi.fn();
    renderComponent('instance', onChange);

    await userEvent.click(screen.getByLabelText(/entire series/i));

    expect(onChange).toHaveBeenCalledWith('series');
  });

  it('calls onChange with instance when instance radio is clicked', async () => {
    const onChange = vi.fn();
    renderComponent('series', onChange);

    await userEvent.click(screen.getByLabelText(/this event only/i));

    expect(onChange).toHaveBeenCalledWith('instance');
  });
});
