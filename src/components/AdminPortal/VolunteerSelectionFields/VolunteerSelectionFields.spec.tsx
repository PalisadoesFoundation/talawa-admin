import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import i18n from 'utils/i18nForTest';
import VolunteerSelectionFields from './VolunteerSelectionFields';
import type { InterfaceEventVolunteerInfo } from 'types/Volunteer/interface';
import type { IEventVolunteerGroup } from 'types/shared-components/ActionItems/interface';
import type { AssignmentType } from 'types/AdminPortal/AssignmentTypeSelector/interface';

describe('VolunteerSelectionFields', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const mockVolunteers: InterfaceEventVolunteerInfo[] = [
    {
      id: 'vol1',
      user: { id: 'user1', name: 'John Doe' },
      isTemplate: false,
    } as InterfaceEventVolunteerInfo,
    {
      id: 'vol2',
      user: { id: 'user2', name: 'Jane Smith' },
      isTemplate: true,
    } as InterfaceEventVolunteerInfo,
    {
      id: 'vol3',
      user: { id: 'user3', name: 'Bob Wilson' },
      isTemplate: false,
    } as InterfaceEventVolunteerInfo,
  ];

  const mockVolunteerGroups: IEventVolunteerGroup[] = [
    {
      id: 'group1',
      name: 'Group Alpha',
      isTemplate: false,
    } as IEventVolunteerGroup,
    {
      id: 'group2',
      name: 'Group Beta',
      isTemplate: true,
    } as IEventVolunteerGroup,
    {
      id: 'group3',
      name: 'Group Gamma',
      isTemplate: false,
    } as IEventVolunteerGroup,
  ];

  const renderComponent = (
    assignmentType: AssignmentType = 'volunteer',
    volunteers: InterfaceEventVolunteerInfo[] = mockVolunteers,
    volunteerGroups: IEventVolunteerGroup[] = mockVolunteerGroups,
    selectedVolunteer: InterfaceEventVolunteerInfo | null = null,
    selectedVolunteerGroup: IEventVolunteerGroup | null = null,
    onVolunteerChange = vi.fn(),
    onVolunteerGroupChange = vi.fn(),
  ): ReturnType<typeof render> => {
    return render(
      <I18nextProvider i18n={i18n}>
        <VolunteerSelectionFields
          assignmentType={assignmentType}
          volunteers={volunteers}
          volunteerGroups={volunteerGroups}
          selectedVolunteer={selectedVolunteer}
          selectedVolunteerGroup={selectedVolunteerGroup}
          onVolunteerChange={onVolunteerChange}
          onVolunteerGroupChange={onVolunteerGroupChange}
        />
      </I18nextProvider>,
    );
  };

  describe('Volunteer Selection Mode', () => {
    it('renders volunteer autocomplete when assignmentType is volunteer', () => {
      renderComponent('volunteer');

      expect(screen.getByTestId('volunteerSelect')).toBeInTheDocument();
      expect(
        screen.queryByTestId('volunteerGroupSelect'),
      ).not.toBeInTheDocument();
    });

    it('renders the volunteer label', () => {
      renderComponent('volunteer');

      expect(screen.getByLabelText(/volunteer/i)).toBeInTheDocument();
    });

    it('shows selected volunteer when provided', () => {
      renderComponent(
        'volunteer',
        mockVolunteers,
        mockVolunteerGroups,
        mockVolunteers[0],
        null,
      );

      expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    });

    it('shows empty input when no volunteer selected', () => {
      renderComponent('volunteer');

      const input = screen.getByRole('combobox');
      expect(input).toHaveValue('');
    });

    it('opens dropdown and shows volunteer options when clicked', async () => {
      renderComponent('volunteer');

      const user = userEvent.setup();
      const input = screen.getByRole('combobox');
      await user.click(input);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        expect(screen.getByText('Bob Wilson')).toBeInTheDocument();
      });
    });

    it('calls onVolunteerChange when a volunteer is selected', async () => {
      const onVolunteerChange = vi.fn();
      renderComponent(
        'volunteer',
        mockVolunteers,
        mockVolunteerGroups,
        null,
        null,
        onVolunteerChange,
      );

      const user = userEvent.setup();
      const input = screen.getByRole('combobox');
      await user.click(input);

      await waitFor(() => {
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Jane Smith'));

      expect(onVolunteerChange).toHaveBeenCalledWith(mockVolunteers[1]);
    });

    it('calls onVolunteerChange with null when volunteer is cleared', async () => {
      const onVolunteerChange = vi.fn();
      renderComponent(
        'volunteer',
        mockVolunteers,
        mockVolunteerGroups,
        mockVolunteers[0],
        null,
        onVolunteerChange,
      );

      const user = userEvent.setup();
      const clearButton = screen.getByTitle('Clear');
      await user.click(clearButton);

      expect(onVolunteerChange).toHaveBeenCalledWith(null);
    });

    it('filters volunteer options based on input text', async () => {
      renderComponent('volunteer');

      const user = userEvent.setup();
      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.type(input, 'Jane');

      await waitFor(() => {
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
        expect(screen.queryByText('Bob Wilson')).not.toBeInTheDocument();
      });
    });

    it('renders with empty volunteers array', () => {
      renderComponent('volunteer', []);

      expect(screen.getByTestId('volunteerSelect')).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('shows no options message when volunteers are empty and dropdown is opened', async () => {
      renderComponent('volunteer', []);

      const user = userEvent.setup();
      const input = screen.getByRole('combobox');
      await user.click(input);

      await waitFor(() => {
        expect(screen.getByText('No options')).toBeInTheDocument();
      });
    });

    it('has required attribute on volunteer input', () => {
      renderComponent('volunteer');

      const input = screen.getByRole('combobox');
      expect(input).toBeRequired();
    });

    it('allows keyboard interaction on volunteer combobox', async () => {
      renderComponent('volunteer');

      const user = userEvent.setup();
      const input = screen.getByRole('combobox');

      await user.click(input);
      await user.keyboard('{ArrowDown}');

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
      });
    });

    it('closes dropdown with Escape key', async () => {
      renderComponent('volunteer');

      const user = userEvent.setup();
      const input = screen.getByRole('combobox');
      await user.click(input);

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      });
    });

    it('uses correct test id for volunteer integration testing', () => {
      renderComponent('volunteer');

      const autocomplete = screen.getByTestId('volunteerSelect');
      expect(autocomplete).toBeInTheDocument();
      expect(autocomplete).toHaveAttribute('data-cy', 'volunteerSelect');
    });
  });

  describe('Volunteer Group Selection Mode', () => {
    it('renders volunteer group autocomplete when assignmentType is volunteerGroup', () => {
      renderComponent('volunteerGroup');

      expect(screen.getByTestId('volunteerGroupSelect')).toBeInTheDocument();
      expect(screen.queryByTestId('volunteerSelect')).not.toBeInTheDocument();
    });

    it('renders the volunteer group label', () => {
      renderComponent('volunteerGroup');

      expect(screen.getByLabelText(/volunteer group/i)).toBeInTheDocument();
    });

    it('shows selected volunteer group when provided', () => {
      renderComponent(
        'volunteerGroup',
        mockVolunteers,
        mockVolunteerGroups,
        null,
        mockVolunteerGroups[0],
      );

      expect(screen.getByDisplayValue('Group Alpha')).toBeInTheDocument();
    });

    it('shows empty input when no volunteer group selected', () => {
      renderComponent('volunteerGroup');

      const input = screen.getByRole('combobox');
      expect(input).toHaveValue('');
    });

    it('opens dropdown and shows volunteer group options when clicked', async () => {
      renderComponent('volunteerGroup');

      const user = userEvent.setup();
      const input = screen.getByRole('combobox');
      await user.click(input);

      await waitFor(() => {
        expect(screen.getByText('Group Alpha')).toBeInTheDocument();
        expect(screen.getByText('Group Beta')).toBeInTheDocument();
        expect(screen.getByText('Group Gamma')).toBeInTheDocument();
      });
    });

    it('calls onVolunteerGroupChange when a volunteer group is selected', async () => {
      const onVolunteerGroupChange = vi.fn();
      renderComponent(
        'volunteerGroup',
        mockVolunteers,
        mockVolunteerGroups,
        null,
        null,
        vi.fn(),
        onVolunteerGroupChange,
      );

      const user = userEvent.setup();
      const input = screen.getByRole('combobox');
      await user.click(input);

      await waitFor(() => {
        expect(screen.getByText('Group Beta')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Group Beta'));

      expect(onVolunteerGroupChange).toHaveBeenCalledWith(
        mockVolunteerGroups[1],
      );
    });

    it('calls onVolunteerGroupChange with null when volunteer group is cleared', async () => {
      const onVolunteerGroupChange = vi.fn();
      renderComponent(
        'volunteerGroup',
        mockVolunteers,
        mockVolunteerGroups,
        null,
        mockVolunteerGroups[0],
        vi.fn(),
        onVolunteerGroupChange,
      );

      const user = userEvent.setup();
      const clearButton = screen.getByTitle('Clear');
      await user.click(clearButton);

      expect(onVolunteerGroupChange).toHaveBeenCalledWith(null);
    });

    it('filters volunteer group options based on input text', async () => {
      renderComponent('volunteerGroup');

      const user = userEvent.setup();
      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.type(input, 'Beta');

      await waitFor(() => {
        expect(screen.getByText('Group Beta')).toBeInTheDocument();
        expect(screen.queryByText('Group Alpha')).not.toBeInTheDocument();
        expect(screen.queryByText('Group Gamma')).not.toBeInTheDocument();
      });
    });

    it('renders with empty volunteer groups array', () => {
      renderComponent('volunteerGroup', mockVolunteers, []);

      expect(screen.getByTestId('volunteerGroupSelect')).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('shows no options message when volunteer groups are empty and dropdown is opened', async () => {
      renderComponent('volunteerGroup', mockVolunteers, []);

      const user = userEvent.setup();
      const input = screen.getByRole('combobox');
      await user.click(input);

      await waitFor(() => {
        expect(screen.getByText('No options')).toBeInTheDocument();
      });
    });

    it('has required attribute on volunteer group input', () => {
      renderComponent('volunteerGroup');

      const input = screen.getByRole('combobox');
      expect(input).toBeRequired();
    });

    it('allows keyboard interaction on volunteer group combobox', async () => {
      renderComponent('volunteerGroup');

      const user = userEvent.setup();
      const input = screen.getByRole('combobox');

      await user.click(input);
      await user.keyboard('{ArrowDown}');

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(screen.getByDisplayValue('Group Alpha')).toBeInTheDocument();
      });
    });

    it('closes dropdown with Escape key', async () => {
      renderComponent('volunteerGroup');

      const user = userEvent.setup();
      const input = screen.getByRole('combobox');
      await user.click(input);

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      });
    });

    it('uses correct test id for volunteer group integration testing', () => {
      renderComponent('volunteerGroup');

      const autocomplete = screen.getByTestId('volunteerGroupSelect');
      expect(autocomplete).toBeInTheDocument();
      expect(autocomplete).toHaveAttribute('data-cy', 'volunteerGroupSelect');
    });
  });

  describe('Mode Switching', () => {
    it('does not call onVolunteerGroupChange when in volunteer mode', async () => {
      const onVolunteerChange = vi.fn();
      const onVolunteerGroupChange = vi.fn();
      renderComponent(
        'volunteer',
        mockVolunteers,
        mockVolunteerGroups,
        null,
        null,
        onVolunteerChange,
        onVolunteerGroupChange,
      );

      const user = userEvent.setup();
      const input = screen.getByRole('combobox');
      await user.click(input);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      await user.click(screen.getByText('John Doe'));

      expect(onVolunteerChange).toHaveBeenCalled();
      expect(onVolunteerGroupChange).not.toHaveBeenCalled();
    });

    it('does not call onVolunteerChange when in volunteerGroup mode', async () => {
      const onVolunteerChange = vi.fn();
      const onVolunteerGroupChange = vi.fn();
      renderComponent(
        'volunteerGroup',
        mockVolunteers,
        mockVolunteerGroups,
        null,
        null,
        onVolunteerChange,
        onVolunteerGroupChange,
      );

      const user = userEvent.setup();
      const input = screen.getByRole('combobox');
      await user.click(input);

      await waitFor(() => {
        expect(screen.getByText('Group Alpha')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Group Alpha'));

      expect(onVolunteerGroupChange).toHaveBeenCalled();
      expect(onVolunteerChange).not.toHaveBeenCalled();
    });
  });
});
