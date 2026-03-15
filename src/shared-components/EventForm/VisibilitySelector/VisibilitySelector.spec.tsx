import React from 'react';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import i18n from 'utils/i18nForTest';
import VisibilitySelector from './VisibilitySelector';

describe('VisibilitySelector', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  const renderComponent = (
    props: React.ComponentProps<typeof VisibilitySelector>,
  ) =>
    render(
      <I18nextProvider i18n={i18n}>
        <VisibilitySelector {...props} />
      </I18nextProvider>,
    );

  it('renders all three visibility options', () => {
    renderComponent({
      visibility: 'ORGANIZATION',
      setVisibility: vi.fn(),
    });

    expect(screen.getByTestId('visibilityPublicRadio')).toBeInTheDocument();
    expect(screen.getByTestId('visibilityOrgRadio')).toBeInTheDocument();
    expect(screen.getByTestId('visibilityInviteRadio')).toBeInTheDocument();
  });

  it('shows PUBLIC as checked when visibility is PUBLIC', () => {
    renderComponent({ visibility: 'PUBLIC', setVisibility: vi.fn() });

    expect(screen.getByTestId('visibilityPublicRadio')).toBeChecked();
    expect(screen.getByTestId('visibilityOrgRadio')).not.toBeChecked();
    expect(screen.getByTestId('visibilityInviteRadio')).not.toBeChecked();
  });

  it('shows ORGANIZATION as checked when visibility is ORGANIZATION', () => {
    renderComponent({
      visibility: 'ORGANIZATION',
      setVisibility: vi.fn(),
    });

    expect(screen.getByTestId('visibilityOrgRadio')).toBeChecked();
  });

  it('shows INVITE_ONLY as checked when visibility is INVITE_ONLY', () => {
    renderComponent({
      visibility: 'INVITE_ONLY',
      setVisibility: vi.fn(),
    });

    expect(screen.getByTestId('visibilityInviteRadio')).toBeChecked();
  });

  it('calls setVisibility with PUBLIC when public radio is clicked', async () => {
    const user = userEvent.setup();
    const setVisibility = vi.fn();
    renderComponent({
      visibility: 'ORGANIZATION',
      setVisibility: setVisibility,
    });

    await user.click(screen.getByTestId('visibilityPublicRadio'));
    await waitFor(() => {
      expect(setVisibility).toHaveBeenCalledWith('PUBLIC');
    });
  });

  it('calls setVisibility with ORGANIZATION when org radio is clicked', async () => {
    const user = userEvent.setup();
    const setVisibility = vi.fn();
    renderComponent({
      visibility: 'PUBLIC',
      setVisibility: setVisibility,
    });

    await user.click(screen.getByTestId('visibilityOrgRadio'));
    await waitFor(() => {
      expect(setVisibility).toHaveBeenCalledWith('ORGANIZATION');
    });
  });

  it('calls setVisibility with INVITE_ONLY when invite radio is clicked', async () => {
    const user = userEvent.setup();
    const setVisibility = vi.fn();
    renderComponent({
      visibility: 'PUBLIC',
      setVisibility: setVisibility,
    });

    await user.click(screen.getByTestId('visibilityInviteRadio'));
    await waitFor(() => {
      expect(setVisibility).toHaveBeenCalledWith('INVITE_ONLY');
    });
  });

  it('renders correct translation labels', () => {
    renderComponent({
      visibility: 'ORGANIZATION',
      setVisibility: vi.fn(),
    });

    expect(screen.getByText('Event Visibility')).toBeInTheDocument();
    expect(screen.getByText('Public (Community Visible)')).toBeInTheDocument();
    expect(
      screen.getByText('Visible to everyone in the community'),
    ).toBeInTheDocument();
    expect(screen.getByText('Organization Members')).toBeInTheDocument();
    expect(
      screen.getByText('Visible to all members of the organization'),
    ).toBeInTheDocument();
    expect(screen.getByText('Invite Only')).toBeInTheDocument();
    expect(
      screen.getByText('Visible only to invited members and event admins'),
    ).toBeInTheDocument();
  });

  it('disables all radio inputs when disabled prop is true', () => {
    renderComponent({
      visibility: 'PUBLIC',
      setVisibility: vi.fn(),
      disabled: true,
    });

    expect(screen.getByTestId('visibilityPublicRadio')).toBeDisabled();
    expect(screen.getByTestId('visibilityOrgRadio')).toBeDisabled();
    expect(screen.getByTestId('visibilityInviteRadio')).toBeDisabled();
  });
});
