import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import i18n from 'utils/i18nForTest';
import AssignmentTypeSelector from './AssignmentTypeSelector';
import type { AssignmentType } from 'types/AdminPortal/AssignmentTypeSelector/interface';

describe('AssignmentTypeSelector', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = (
    assignmentType: AssignmentType = 'volunteer',
    onTypeChange = vi.fn(),
    isVolunteerDisabled = false,
    isVolunteerGroupDisabled = false,
    onClearVolunteer = vi.fn(),
    onClearVolunteerGroup = vi.fn(),
  ): ReturnType<typeof render> => {
    return render(
      <I18nextProvider i18n={i18n}>
        <AssignmentTypeSelector
          assignmentType={assignmentType}
          onTypeChange={onTypeChange}
          isVolunteerDisabled={isVolunteerDisabled}
          isVolunteerGroupDisabled={isVolunteerGroupDisabled}
          onClearVolunteer={onClearVolunteer}
          onClearVolunteerGroup={onClearVolunteerGroup}
        />
      </I18nextProvider>,
    );
  };

  it('renders both chip options', () => {
    renderComponent();

    expect(screen.getByText('Volunteer')).toBeInTheDocument();
    expect(screen.getByText('Volunteer Group')).toBeInTheDocument();
  });

  it('renders the assign to label', () => {
    renderComponent();

    expect(screen.getByText('Assign To')).toBeInTheDocument();
  });

  it('shows volunteer chip as selected when assignmentType is volunteer', () => {
    renderComponent('volunteer');

    const volunteerChip = screen
      .getByText('Volunteer')
      .closest('.MuiChip-root');
    expect(volunteerChip).toHaveClass('MuiChip-filled');
  });

  it('shows volunteer group chip as selected when assignmentType is volunteerGroup', () => {
    renderComponent('volunteerGroup');

    const volunteerGroupChip = screen
      .getByText('Volunteer Group')
      .closest('.MuiChip-root');
    expect(volunteerGroupChip).toHaveClass('MuiChip-filled');
  });

  it('calls onTypeChange with volunteer when volunteer chip is clicked', async () => {
    const onTypeChange = vi.fn();
    const onClearVolunteerGroup = vi.fn();
    renderComponent(
      'volunteerGroup',
      onTypeChange,
      false,
      false,
      vi.fn(),
      onClearVolunteerGroup,
    );

    const user = userEvent.setup();
    const volunteerChip = screen
      .getByText('Volunteer')
      .closest('.MuiChip-root');
    expect(volunteerChip).toBeInTheDocument();
    await user.click(volunteerChip as HTMLElement);

    expect(onTypeChange).toHaveBeenCalledWith('volunteer');
    expect(onClearVolunteerGroup).toHaveBeenCalled();
  });

  it('calls onTypeChange with volunteerGroup when volunteer group chip is clicked', async () => {
    const onTypeChange = vi.fn();
    const onClearVolunteer = vi.fn();
    renderComponent(
      'volunteer',
      onTypeChange,
      false,
      false,
      onClearVolunteer,
      vi.fn(),
    );

    const user = userEvent.setup();
    const volunteerGroupChip = screen
      .getByText('Volunteer Group')
      .closest('.MuiChip-root');
    expect(volunteerGroupChip).toBeInTheDocument();
    await user.click(volunteerGroupChip as HTMLElement);

    expect(onTypeChange).toHaveBeenCalledWith('volunteerGroup');
    expect(onClearVolunteer).toHaveBeenCalled();
  });

  it('does not call onTypeChange when disabled volunteer chip is clicked', async () => {
    const onTypeChange = vi.fn();
    const onClearVolunteerGroup = vi.fn();
    renderComponent(
      'volunteerGroup',
      onTypeChange,
      true,
      false,
      vi.fn(),
      onClearVolunteerGroup,
    );

    const user = userEvent.setup();
    const volunteerChip = screen
      .getByText('Volunteer')
      .closest('.MuiChip-root');
    expect(volunteerChip).toBeInTheDocument();
    await user.click(volunteerChip as HTMLElement);

    expect(onTypeChange).not.toHaveBeenCalled();
    expect(onClearVolunteerGroup).not.toHaveBeenCalled();
  });

  it('does not call onTypeChange when disabled volunteer group chip is clicked', async () => {
    const onTypeChange = vi.fn();
    const onClearVolunteer = vi.fn();
    renderComponent(
      'volunteer',
      onTypeChange,
      false,
      true,
      onClearVolunteer,
      vi.fn(),
    );

    const user = userEvent.setup();
    const volunteerGroupChip = screen
      .getByText('Volunteer Group')
      .closest('.MuiChip-root');
    expect(volunteerGroupChip).toBeInTheDocument();
    await user.click(volunteerGroupChip as HTMLElement);

    expect(onTypeChange).not.toHaveBeenCalled();
    expect(onClearVolunteer).not.toHaveBeenCalled();
  });

  it('renders with disabled state styling when volunteer chip is disabled', () => {
    renderComponent('volunteerGroup', vi.fn(), true, false);

    const volunteerChip = screen
      .getByText('Volunteer')
      .closest('.MuiChip-root');
    expect(volunteerChip).toHaveAttribute('aria-disabled', 'true');
  });

  it('renders with disabled state styling when volunteer group chip is disabled', () => {
    renderComponent('volunteer', vi.fn(), false, true);

    const volunteerGroupChip = screen
      .getByText('Volunteer Group')
      .closest('.MuiChip-root');
    expect(volunteerGroupChip).toHaveAttribute('aria-disabled', 'true');
  });

  it('renders with accessible fieldset structure', () => {
    renderComponent();

    expect(screen.getByRole('group')).toBeInTheDocument();
  });

  describe('Keyboard Navigation', () => {
    it('activates volunteer chip on Enter key when not disabled', async () => {
      const onTypeChange = vi.fn();
      const onClearVolunteerGroup = vi.fn();
      renderComponent(
        'volunteerGroup',
        onTypeChange,
        false,
        false,
        vi.fn(),
        onClearVolunteerGroup,
      );

      const user = userEvent.setup();
      const volunteerChip = screen
        .getByText('Volunteer')
        .closest('.MuiChip-root');
      expect(volunteerChip).toBeInTheDocument();
      (volunteerChip as HTMLElement).focus();
      await user.keyboard('{Enter}');

      expect(onTypeChange).toHaveBeenCalledWith('volunteer');
      expect(onClearVolunteerGroup).toHaveBeenCalled();
    });

    it('activates volunteer chip on Space key when not disabled', async () => {
      const onTypeChange = vi.fn();
      const onClearVolunteerGroup = vi.fn();
      renderComponent(
        'volunteerGroup',
        onTypeChange,
        false,
        false,
        vi.fn(),
        onClearVolunteerGroup,
      );

      const user = userEvent.setup();
      const volunteerChip = screen
        .getByText('Volunteer')
        .closest('.MuiChip-root');
      expect(volunteerChip).toBeInTheDocument();
      (volunteerChip as HTMLElement).focus();
      await user.keyboard(' ');

      expect(onTypeChange).toHaveBeenCalledWith('volunteer');
      expect(onClearVolunteerGroup).toHaveBeenCalled();
    });

    it('activates volunteerGroup chip on Enter key when not disabled', async () => {
      const onTypeChange = vi.fn();
      const onClearVolunteer = vi.fn();
      renderComponent(
        'volunteer',
        onTypeChange,
        false,
        false,
        onClearVolunteer,
        vi.fn(),
      );

      const user = userEvent.setup();
      const volunteerGroupChip = screen
        .getByText('Volunteer Group')
        .closest('.MuiChip-root');
      expect(volunteerGroupChip).toBeInTheDocument();
      (volunteerGroupChip as HTMLElement).focus();
      await user.keyboard('{Enter}');

      expect(onTypeChange).toHaveBeenCalledWith('volunteerGroup');
      expect(onClearVolunteer).toHaveBeenCalled();
    });

    it('activates volunteerGroup chip on Space key when not disabled', async () => {
      const onTypeChange = vi.fn();
      const onClearVolunteer = vi.fn();
      renderComponent(
        'volunteer',
        onTypeChange,
        false,
        false,
        onClearVolunteer,
        vi.fn(),
      );

      const user = userEvent.setup();
      const volunteerGroupChip = screen
        .getByText('Volunteer Group')
        .closest('.MuiChip-root');
      expect(volunteerGroupChip).toBeInTheDocument();
      (volunteerGroupChip as HTMLElement).focus();
      await user.keyboard(' ');

      expect(onTypeChange).toHaveBeenCalledWith('volunteerGroup');
      expect(onClearVolunteer).toHaveBeenCalled();
    });

    it('does not activate volunteer chip on Enter when disabled', async () => {
      const onTypeChange = vi.fn();
      const onClearVolunteerGroup = vi.fn();
      renderComponent(
        'volunteerGroup',
        onTypeChange,
        true,
        false,
        vi.fn(),
        onClearVolunteerGroup,
      );

      const user = userEvent.setup();
      const volunteerChip = screen
        .getByText('Volunteer')
        .closest('.MuiChip-root');
      expect(volunteerChip).toBeInTheDocument();
      (volunteerChip as HTMLElement).focus();
      await user.keyboard('{Enter}');

      expect(onTypeChange).not.toHaveBeenCalled();
      expect(onClearVolunteerGroup).not.toHaveBeenCalled();
    });

    it('does not activate volunteer chip on Space when disabled', async () => {
      const onTypeChange = vi.fn();
      const onClearVolunteerGroup = vi.fn();
      renderComponent(
        'volunteerGroup',
        onTypeChange,
        true,
        false,
        vi.fn(),
        onClearVolunteerGroup,
      );

      const user = userEvent.setup();
      const volunteerChip = screen
        .getByText('Volunteer')
        .closest('.MuiChip-root');
      expect(volunteerChip).toBeInTheDocument();
      (volunteerChip as HTMLElement).focus();
      await user.keyboard(' ');

      expect(onTypeChange).not.toHaveBeenCalled();
      expect(onClearVolunteerGroup).not.toHaveBeenCalled();
    });

    it('does not activate volunteerGroup chip on Enter when disabled', async () => {
      const onTypeChange = vi.fn();
      const onClearVolunteer = vi.fn();
      renderComponent(
        'volunteer',
        onTypeChange,
        false,
        true,
        onClearVolunteer,
        vi.fn(),
      );

      const user = userEvent.setup();
      const volunteerGroupChip = screen
        .getByText('Volunteer Group')
        .closest('.MuiChip-root');
      expect(volunteerGroupChip).toBeInTheDocument();
      (volunteerGroupChip as HTMLElement).focus();
      await user.keyboard('{Enter}');

      expect(onTypeChange).not.toHaveBeenCalled();
      expect(onClearVolunteer).not.toHaveBeenCalled();
    });

    it('does not activate volunteerGroup chip on Space when disabled', async () => {
      const onTypeChange = vi.fn();
      const onClearVolunteer = vi.fn();
      renderComponent(
        'volunteer',
        onTypeChange,
        false,
        true,
        onClearVolunteer,
        vi.fn(),
      );

      const user = userEvent.setup();
      const volunteerGroupChip = screen
        .getByText('Volunteer Group')
        .closest('.MuiChip-root');
      expect(volunteerGroupChip).toBeInTheDocument();
      (volunteerGroupChip as HTMLElement).focus();
      await user.keyboard(' ');

      expect(onTypeChange).not.toHaveBeenCalled();
      expect(onClearVolunteer).not.toHaveBeenCalled();
    });
  });

  describe('No-op scenarios', () => {
    it('does not call onTypeChange when clicking already selected volunteer chip', async () => {
      const onTypeChange = vi.fn();
      const onClearVolunteer = vi.fn();
      const onClearVolunteerGroup = vi.fn();
      renderComponent(
        'volunteer',
        onTypeChange,
        false,
        false,
        onClearVolunteer,
        onClearVolunteerGroup,
      );

      const user = userEvent.setup();
      const volunteerChip = screen
        .getByText('Volunteer')
        .closest('.MuiChip-root');
      expect(volunteerChip).toBeInTheDocument();
      await user.click(volunteerChip as HTMLElement);

      // Clicking the already-selected chip should not trigger any changes
      expect(onTypeChange).not.toHaveBeenCalled();
      expect(onClearVolunteer).not.toHaveBeenCalled();
      expect(onClearVolunteerGroup).not.toHaveBeenCalled();
    });

    it('does not call onTypeChange when clicking already selected volunteerGroup chip', async () => {
      const onTypeChange = vi.fn();
      const onClearVolunteer = vi.fn();
      const onClearVolunteerGroup = vi.fn();
      renderComponent(
        'volunteerGroup',
        onTypeChange,
        false,
        false,
        onClearVolunteer,
        onClearVolunteerGroup,
      );

      const user = userEvent.setup();
      const volunteerGroupChip = screen
        .getByText('Volunteer Group')
        .closest('.MuiChip-root');
      expect(volunteerGroupChip).toBeInTheDocument();
      await user.click(volunteerGroupChip as HTMLElement);

      // Clicking the already-selected chip should not trigger any changes
      expect(onTypeChange).not.toHaveBeenCalled();
      expect(onClearVolunteer).not.toHaveBeenCalled();
      expect(onClearVolunteerGroup).not.toHaveBeenCalled();
    });
  });
});
