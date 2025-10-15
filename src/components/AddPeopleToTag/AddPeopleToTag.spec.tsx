import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { toast } from 'react-toastify';
import AddPeopleToTag from './AddPeopleToTag';
import {
  MOCKS,
  MOCKS_ERROR,
  MOCK_EMPTY,
  MOCK_NON_ERROR,
  MOCK_NULL_FETCH_MORE,
  MOCK_NO_DATA,
} from './AddPeopleToTagsMocks';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';

// Mock react-toastify
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock react-router
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useParams: () => ({ tagId: '1' }),
  };
});

const mockT = (key: string): string => key;
const mockTCommon = (key: string): string => key;

describe('AddPeopleToTag Component', () => {
  const defaultProps = {
    addPeopleToTagModalIsOpen: true,
    hideAddPeopleToTagModal: vi.fn(),
    refetchAssignedMembersData: vi.fn(),
    t: mockT,
    tCommon: mockTCommon,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('should render modal with correct header when open', async () => {
    const link = new StaticMockLink(MOCKS, true);

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <AddPeopleToTag {...defaultProps} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('addPeople')).toBeInTheDocument();
    });
  });

  test('should not render modal when closed', () => {
    const link = new StaticMockLink(MOCKS, true);

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <AddPeopleToTag
              {...defaultProps}
              addPeopleToTagModalIsOpen={false}
            />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(screen.queryByText('addPeople')).not.toBeInTheDocument();
  });

  test('should display loading state initially', async () => {
    const link = new StaticMockLink(MOCKS, true);

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <AddPeopleToTag {...defaultProps} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(screen.getByText('addPeople')).toBeInTheDocument();
  });

  test('should display members in DataGrid after loading', async () => {
    const link = new StaticMockLink(MOCKS, true);

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <AddPeopleToTag {...defaultProps} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(
      () => {
        expect(screen.getByText('member 1')).toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    expect(screen.getByText('member 2')).toBeInTheDocument();
  });

  test('should display error state when query fails', async () => {
    const link = new StaticMockLink(MOCKS_ERROR, true);

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <AddPeopleToTag {...defaultProps} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(
      () => {
        expect(
          screen.getByText('errorOccurredWhileLoadingMembers'),
        ).toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    expect(screen.getByText(/Mock Graphql Error/i)).toBeInTheDocument();
  });

  test('should handle member selection', async () => {
    const link = new StaticMockLink(MOCKS, true);

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <AddPeopleToTag {...defaultProps} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(
      () => {
        expect(screen.getByText('member 1')).toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    const selectButtons = screen.getAllByTestId('selectMemberBtn');
    await userEvent.click(selectButtons[0]);

    await waitFor(() => {
      expect(screen.getByTestId('deselectMemberBtn')).toBeInTheDocument();
    });

    expect(screen.getByText('member 1')).toBeInTheDocument();
  });

  test('should handle member deselection', async () => {
    const link = new StaticMockLink(MOCKS, true);

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <AddPeopleToTag {...defaultProps} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(
      () => {
        expect(screen.getByText('member 1')).toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    const selectButtons = screen.getAllByTestId('selectMemberBtn');
    await userEvent.click(selectButtons[0]);

    await waitFor(() => {
      expect(screen.getByTestId('deselectMemberBtn')).toBeInTheDocument();
    });

    const deselectButton = screen.getByTestId('deselectMemberBtn');
    await userEvent.click(deselectButton);

    await waitFor(() => {
      expect(screen.queryByTestId('deselectMemberBtn')).not.toBeInTheDocument();
    });
  });

  test('should remove member from selected list using badge', async () => {
    const link = new StaticMockLink(MOCKS, true);

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <AddPeopleToTag {...defaultProps} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(
      () => {
        expect(screen.getByText('member 1')).toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    const selectButtons = screen.getAllByTestId('selectMemberBtn');
    await userEvent.click(selectButtons[0]);

    await waitFor(() => {
      expect(screen.getByTestId('clearSelectedMember')).toBeInTheDocument();
    });

    const clearButton = screen.getByTestId('clearSelectedMember');
    await userEvent.click(clearButton);

    await waitFor(() => {
      expect(
        screen.queryByTestId('clearSelectedMember'),
      ).not.toBeInTheDocument();
    });
  });

  test('should display "noOneSelected" when no members are selected', async () => {
    const link = new StaticMockLink(MOCKS, true);

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <AddPeopleToTag {...defaultProps} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(
      () => {
        expect(screen.getByText('noOneSelected')).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });

  test('should filter members by first name', async () => {
    const link = new StaticMockLink(MOCKS, true);

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <AddPeopleToTag {...defaultProps} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(
      () => {
        expect(screen.getByText('member 1')).toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    const firstNameInput = screen.getByTestId('searchByFirstName');
    await userEvent.type(firstNameInput, 'usersToAssignTo');

    await waitFor(
      () => {
        expect(screen.getByText('usersToAssignTo user1')).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });

  test('should filter members by last name', async () => {
    const link = new StaticMockLink(MOCKS, true);

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <AddPeopleToTag {...defaultProps} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(
      () => {
        expect(screen.getByText('member 1')).toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    const lastNameInput = screen.getByTestId('searchByLastName');
    await userEvent.type(lastNameInput, 'userToAssignTo');

    await waitFor(
      () => {
        expect(screen.getByText('first userToAssignTo')).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });

  test('should handle form submission with selected members', async () => {
    const link = new StaticMockLink(MOCKS, true);

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <AddPeopleToTag {...defaultProps} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(
      () => {
        expect(screen.getByText('member 1')).toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    // Select members with IDs 1, 3, 5
    const selectButtons = screen.getAllByTestId('selectMemberBtn');
    await userEvent.click(selectButtons[0]); // member 1
    await userEvent.click(selectButtons[2]); // member 3
    await userEvent.click(selectButtons[4]); // member 5

    await waitFor(() => {
      expect(screen.getAllByTestId('clearSelectedMember')).toHaveLength(3);
    });

    const assignButton = screen.getByTestId('assignPeopleBtn');
    await userEvent.click(assignButton);

    await waitFor(
      () => {
        expect(toast.success).toHaveBeenCalledWith(
          'successfullyAssignedToPeople',
        );
        expect(defaultProps.refetchAssignedMembersData).toHaveBeenCalled();
        expect(defaultProps.hideAddPeopleToTagModal).toHaveBeenCalled();
      },
      { timeout: 3000 },
    );
  });

  test('should show error toast when submitting without selecting members', async () => {
    const link = new StaticMockLink(MOCKS, true);

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <AddPeopleToTag {...defaultProps} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(
      () => {
        expect(screen.getByText('member 1')).toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    const assignButton = screen.getByTestId('assignPeopleBtn');
    await userEvent.click(assignButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('noOneSelected');
    });
  });

  test('should handle mutation error with Error instance', async () => {
    const link = new StaticMockLink(MOCK_NON_ERROR, true);

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <AddPeopleToTag {...defaultProps} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(
      () => {
        expect(screen.getByText('Test User')).toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    const selectButton = screen.getByTestId('selectMemberBtn');
    await userEvent.click(selectButton);

    await waitFor(() => {
      expect(screen.getByTestId('deselectMemberBtn')).toBeInTheDocument();
    });

    const assignButton = screen.getByTestId('assignPeopleBtn');
    await userEvent.click(assignButton);

    await waitFor(
      () => {
        expect(toast.error).toHaveBeenCalled();
      },
      { timeout: 3000 },
    );
  });

  test('should handle mutation error with non-Error instance', async () => {
    const MOCK_NON_ERROR_INSTANCE = [
      {
        request: {
          query: MOCKS[0].request.query,
          variables: MOCKS[0].request.variables,
        },
        result: MOCKS[0].result,
      },
      {
        request: {
          query: MOCKS[4].request.query,
          variables: {
            tagId: '1',
            userIds: ['1'],
          },
        },
        error: 'String error' as unknown as Error,
      },
    ];

    const link = new StaticMockLink(MOCK_NON_ERROR_INSTANCE, true);

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <AddPeopleToTag {...defaultProps} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(
      () => {
        expect(screen.getByText('member 1')).toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    const selectButton = screen.getAllByTestId('selectMemberBtn')[0];
    await userEvent.click(selectButton);

    await waitFor(() => {
      expect(screen.getByTestId('deselectMemberBtn')).toBeInTheDocument();
    });

    const assignButton = screen.getByTestId('assignPeopleBtn');
    await userEvent.click(assignButton);

    await waitFor(
      () => {
        expect(toast.error).toHaveBeenCalledWith('unknownError');
      },
      { timeout: 3000 },
    );
  });

  test('should handle null data from mutation', async () => {
    const link = new StaticMockLink(MOCK_NO_DATA, true);

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <AddPeopleToTag {...defaultProps} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(
      () => {
        expect(screen.getByText('NoData Test')).toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    const selectButton = screen.getByTestId('selectMemberBtn');
    await userEvent.click(selectButton);

    await waitFor(() => {
      expect(screen.getByTestId('deselectMemberBtn')).toBeInTheDocument();
    });

    const assignButton = screen.getByTestId('assignPeopleBtn');
    await userEvent.click(assignButton);

    // Should not call success callbacks when data is null
    await waitFor(() => {
      expect(defaultProps.refetchAssignedMembersData).not.toHaveBeenCalled();
      expect(defaultProps.hideAddPeopleToTagModal).not.toHaveBeenCalled();
    });
  });

  test('should close modal when close button is clicked', async () => {
    const link = new StaticMockLink(MOCKS, true);

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <AddPeopleToTag {...defaultProps} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('addPeople')).toBeInTheDocument();
    });

    const closeButton = screen.getByTestId('closeAddPeopleToTagModal');
    await userEvent.click(closeButton);

    expect(defaultProps.hideAddPeopleToTagModal).toHaveBeenCalled();
  });

  test('should reset search filters when modal reopens', async () => {
    const link = new StaticMockLink(MOCKS, true);

    const { rerender } = render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <AddPeopleToTag {...defaultProps} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(
      () => {
        expect(screen.getByText('member 1')).toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    const firstNameInput = screen.getByTestId(
      'searchByFirstName',
    ) as HTMLInputElement;
    await userEvent.type(firstNameInput, 'test');

    // Close modal
    rerender(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <AddPeopleToTag
              {...defaultProps}
              addPeopleToTagModalIsOpen={false}
            />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    // Reopen modal
    rerender(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <AddPeopleToTag {...defaultProps} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      const reopenedFirstNameInput = screen.getByTestId(
        'searchByFirstName',
      ) as HTMLInputElement;
      expect(reopenedFirstNameInput.value).toBe('');
    });
  });

  test('should load more members when scrolling', async () => {
    const link = new StaticMockLink(MOCKS, true);

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <AddPeopleToTag {...defaultProps} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(
      () => {
        expect(screen.getByText('member 1')).toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    expect(screen.getByText('member 10')).toBeInTheDocument();

    // Trigger infinite scroll
    const scrollableDiv = screen.getByTestId('addPeopleToTagScrollableDiv');
    fireEvent.scroll(scrollableDiv, { target: { scrollY: 1000 } });

    await waitFor(
      () => {
        expect(screen.getByText('member 11')).toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    expect(screen.getByText('member 12')).toBeInTheDocument();
  });

  test('should handle null fetchMore result', async () => {
    const link = new StaticMockLink(MOCK_NULL_FETCH_MORE, true);

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <AddPeopleToTag {...defaultProps} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(
      () => {
        expect(screen.getByText('member 1')).toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    // Trigger infinite scroll
    const scrollableDiv = screen.getByTestId('addPeopleToTagScrollableDiv');
    fireEvent.scroll(scrollableDiv, { target: { scrollY: 1000 } });

    // Should still show the first member after null fetchMore
    await waitFor(() => {
      expect(screen.getByText('member 1')).toBeInTheDocument();
    });
  });

  test('should display "noMoreMembersFound" when no members are available', async () => {
    const link = new StaticMockLink(MOCK_EMPTY, true);

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <AddPeopleToTag {...defaultProps} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(
      () => {
        expect(screen.getByText('noMoreMembersFound')).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });
});
