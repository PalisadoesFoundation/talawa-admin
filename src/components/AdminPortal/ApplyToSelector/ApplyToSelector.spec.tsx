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
  ): ReturnType<typeof render> => {
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

  it('renders the apply to label', () => {
    renderComponent();

    expect(screen.getByText('Apply to')).toBeInTheDocument();
  });

  it('shows series radio as checked when applyTo is series', () => {
    renderComponent('series');

    const seriesRadio = screen.getByLabelText(/entire series/i);
    expect(seriesRadio).toBeChecked();
  });

  it('shows instance radio as checked when applyTo is instance', () => {
    renderComponent('instance');

    const instanceRadio = screen.getByLabelText(/this event only/i);
    expect(instanceRadio).toBeChecked();
  });

  it('calls onChange with series when series radio is clicked', async () => {
    const onChange = vi.fn();
    renderComponent('instance', onChange);

    const user = userEvent.setup();
    const seriesRadio = screen.getByLabelText(/entire series/i);
    await user.click(seriesRadio);

    expect(onChange).toHaveBeenCalledWith('series');
  });

  it('calls onChange with instance when instance radio is clicked', async () => {
    const onChange = vi.fn();
    renderComponent('series', onChange);

    const user = userEvent.setup();
    const instanceRadio = screen.getByLabelText(/this event only/i);
    await user.click(instanceRadio);

    expect(onChange).toHaveBeenCalledWith('instance');
  });

  it('renders with accessible fieldset structure', () => {
    renderComponent();

    expect(screen.getByRole('group')).toBeInTheDocument();
  });

  it('renders legend element for accessibility', () => {
    renderComponent();

    // Legend text is part of the group's accessible name
    expect(
      screen.getByRole('group', { name: /apply to/i }),
    ).toBeInTheDocument();
  });

  it('has unique IDs for radio inputs using useId', () => {
    renderComponent();

    const seriesRadio = screen.getByLabelText(/entire series/i);
    const instanceRadio = screen.getByLabelText(/this event only/i);

    expect(seriesRadio.id).toBeTruthy();
    expect(instanceRadio.id).toBeTruthy();
    expect(seriesRadio.id).not.toBe(instanceRadio.id);
  });

  it('radio buttons share the same name attribute for grouping', () => {
    renderComponent();

    const seriesRadio = screen.getByLabelText(
      /entire series/i,
    ) as HTMLInputElement;
    const instanceRadio = screen.getByLabelText(
      /this event only/i,
    ) as HTMLInputElement;

    expect(seriesRadio.name).toBe(instanceRadio.name);
  });
});
