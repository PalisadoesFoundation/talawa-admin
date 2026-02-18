/**
 * Tests for VisibilitySelector sub-component.
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import VisibilitySelector from './VisibilitySelector';

const mockTCommon = vi.fn((key: string) => key);

describe('VisibilitySelector', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders all three visibility options', () => {
    render(
      <VisibilitySelector
        visibility="ORGANIZATION"
        setVisibility={vi.fn()}
        tCommon={mockTCommon}
      />,
    );

    expect(screen.getByTestId('visibilityPublicRadio')).toBeInTheDocument();
    expect(screen.getByTestId('visibilityOrgRadio')).toBeInTheDocument();
    expect(screen.getByTestId('visibilityInviteRadio')).toBeInTheDocument();
  });

  it('shows PUBLIC as checked when visibility is PUBLIC', () => {
    render(
      <VisibilitySelector
        visibility="PUBLIC"
        setVisibility={vi.fn()}
        tCommon={mockTCommon}
      />,
    );

    expect(screen.getByTestId('visibilityPublicRadio')).toBeChecked();
    expect(screen.getByTestId('visibilityOrgRadio')).not.toBeChecked();
    expect(screen.getByTestId('visibilityInviteRadio')).not.toBeChecked();
  });

  it('shows ORGANIZATION as checked when visibility is ORGANIZATION', () => {
    render(
      <VisibilitySelector
        visibility="ORGANIZATION"
        setVisibility={vi.fn()}
        tCommon={mockTCommon}
      />,
    );

    expect(screen.getByTestId('visibilityOrgRadio')).toBeChecked();
  });

  it('shows INVITE_ONLY as checked when visibility is INVITE_ONLY', () => {
    render(
      <VisibilitySelector
        visibility="INVITE_ONLY"
        setVisibility={vi.fn()}
        tCommon={mockTCommon}
      />,
    );

    expect(screen.getByTestId('visibilityInviteRadio')).toBeChecked();
  });

  it('calls setVisibility with PUBLIC when public radio is clicked', async () => {
    const user = userEvent.setup();
    const setVisibility = vi.fn();
    render(
      <VisibilitySelector
        visibility="ORGANIZATION"
        setVisibility={setVisibility}
        tCommon={mockTCommon}
      />,
    );

    await user.click(screen.getByTestId('visibilityPublicRadio'));
    expect(setVisibility).toHaveBeenCalledWith('PUBLIC');
  });

  it('calls setVisibility with ORGANIZATION when org radio is clicked', async () => {
    const user = userEvent.setup();
    const setVisibility = vi.fn();
    render(
      <VisibilitySelector
        visibility="PUBLIC"
        setVisibility={setVisibility}
        tCommon={mockTCommon}
      />,
    );

    await user.click(screen.getByTestId('visibilityOrgRadio'));
    expect(setVisibility).toHaveBeenCalledWith('ORGANIZATION');
  });

  it('calls setVisibility with INVITE_ONLY when invite radio is clicked', async () => {
    const user = userEvent.setup();
    const setVisibility = vi.fn();
    render(
      <VisibilitySelector
        visibility="PUBLIC"
        setVisibility={setVisibility}
        tCommon={mockTCommon}
      />,
    );

    await user.click(screen.getByTestId('visibilityInviteRadio'));
    expect(setVisibility).toHaveBeenCalledWith('INVITE_ONLY');
  });

  it('calls tCommon for each translation key', () => {
    render(
      <VisibilitySelector
        visibility="ORGANIZATION"
        setVisibility={vi.fn()}
        tCommon={mockTCommon}
      />,
    );

    expect(mockTCommon).toHaveBeenCalledWith('eventVisibility');
    expect(mockTCommon).toHaveBeenCalledWith('publicEvent');
    expect(mockTCommon).toHaveBeenCalledWith('publicEventDescription');
    expect(mockTCommon).toHaveBeenCalledWith('organizationEvent');
    expect(mockTCommon).toHaveBeenCalledWith('organizationEventDescription');
    expect(mockTCommon).toHaveBeenCalledWith('inviteOnlyEvent');
    expect(mockTCommon).toHaveBeenCalledWith('inviteOnlyEventDescription');
  });
});
