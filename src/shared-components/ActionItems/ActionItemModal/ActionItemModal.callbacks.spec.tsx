import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import dayjs from 'dayjs';
import ItemModal from './ActionItemModal';
import type { IActionItemInfo } from 'types/shared-components/ActionItems/interface';
import { ACTION_ITEM_CATEGORY_LIST } from 'GraphQl/Queries/ActionItemCategoryQueries';
import {
  GET_EVENT_VOLUNTEERS,
  GET_EVENT_VOLUNTEER_GROUPS,
} from 'GraphQl/Queries/EventVolunteerQueries';
import {
  CREATE_ACTION_ITEM_MUTATION,
  UPDATE_ACTION_ITEM_MUTATION,
  UPDATE_ACTION_ITEM_FOR_INSTANCE,
} from 'GraphQl/Mutations/ActionItemMutations';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('shared-components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

function ModalStub({ children }: { children: React.ReactNode }): JSX.Element {
  return <form data-testid="actionItemModal">{children}</form>;
}

vi.mock('shared-components/CRUDModalTemplate/CreateModal', () => ({
  CreateModal: ModalStub,
}));

vi.mock('shared-components/CRUDModalTemplate/EditModal', () => ({
  EditModal: ModalStub,
}));

vi.mock('shared-components/DatePicker/DatePicker', () => ({
  default: ({
    onChange,
    'data-testid': dataTestId,
  }: {
    onChange?: (date: unknown) => void;
    'data-testid'?: string;
  }) => {
    React.useEffect(() => {
      onChange?.(dayjs());
    }, []);
    return <input data-testid={dataTestId || 'assignmentDate'} />;
  },
}));

vi.mock('@mui/material/Autocomplete', () => ({
  default: (props: {
    options?: unknown[];
    value?: unknown;
    isOptionEqualToValue?: (option: unknown, value: unknown) => boolean;
    getOptionLabel?: (option: unknown) => string;
    onChange?: (event: unknown, value: unknown) => void;
    renderInput?: (params: {
      InputProps: {
        ref: React.RefCallback<HTMLDivElement>;
        className?: string;
        startAdornment?: React.ReactNode;
        endAdornment?: React.ReactNode;
        onMouseDown?: React.MouseEventHandler<HTMLDivElement>;
      };
      inputProps: { className?: string };
    }) => React.ReactNode;
    'data-testid'?: string;
  }) => {
    React.useEffect(() => {
      if (props.options && props.options.length > 0) {
        const first = props.options[0];
        props.isOptionEqualToValue?.(first, props.value ?? first);
        props.getOptionLabel?.(first);
      }

      // Exercise fallback path: volunteer.user?.name || t('unknownVolunteer')
      if (props['data-testid'] === 'volunteerSelect') {
        props.getOptionLabel?.({ id: 'unknown', user: null });
      }

      // Exercise null path: newCategory?.id ?? ''
      if (props['data-testid'] === 'categorySelect') {
        props.onChange?.(null, null);
      }
    }, []);

    return (
      <div data-testid={props['data-testid']}>
        {props.renderInput?.({
          InputProps: { ref: () => undefined },
          inputProps: {},
        })}
      </div>
    );
  },
}));

vi.mock('@apollo/client', async (importOriginal) => {
  const actual = (await importOriginal()) as object;
  const categoriesData = {
    actionCategoriesByOrganization: [
      { id: 'cat1', name: 'Category 1', description: '', isDisabled: false },
    ],
  };
  const volunteersData = {
    event: {
      volunteers: [
        {
          id: 'volunteer1',
          isTemplate: true,
          user: { id: 'user1', name: 'John Doe' },
        },
      ],
    },
  };
  const volunteerGroupsData = {
    event: {
      volunteerGroups: [{ id: 'group1', name: 'Group 1', isTemplate: true }],
    },
  };

  return {
    ...actual,
    useQuery: (query: unknown) => {
      if (query === ACTION_ITEM_CATEGORY_LIST) {
        return { data: categoriesData };
      }
      if (query === GET_EVENT_VOLUNTEERS) {
        return { data: volunteersData };
      }
      if (query === GET_EVENT_VOLUNTEER_GROUPS) {
        return { data: volunteerGroupsData };
      }
      return { data: {} };
    },
    useMutation: (mutation: unknown) => {
      if (
        mutation === CREATE_ACTION_ITEM_MUTATION ||
        mutation === UPDATE_ACTION_ITEM_MUTATION ||
        mutation === UPDATE_ACTION_ITEM_FOR_INSTANCE
      ) {
        return [vi.fn().mockResolvedValue({ data: {} })];
      }
      return [vi.fn()];
    },
  };
});

afterEach(() => {
  vi.clearAllMocks();
});

const baseProps = {
  isOpen: true,
  hide: vi.fn(),
  orgId: 'orgId',
  eventId: 'eventId',
  actionItemsRefetch: vi.fn(),
};

const groupActionItem: IActionItemInfo = {
  id: 'a1',
  organizationId: 'orgId',
  creatorId: 'c1',
  updaterId: null,
  volunteerId: null,
  volunteerGroupId: 'group1',
  categoryId: 'cat1',
  eventId: 'eventId',
  recurringEventInstanceId: null,
  assignedAt: new Date(),
  completionAt: null,
  createdAt: new Date(),
  updatedAt: null,
  isCompleted: false,
  preCompletionNotes: '',
  postCompletionNotes: null,
  isTemplate: true,
  isInstanceException: false,
  volunteer: null,
  volunteerGroup: {
    id: 'group1',
    name: 'Group 1',
    description: '',
    volunteersRequired: 1,
    leader: { id: 'u1', name: 'Lead', avatarURL: '' },
    volunteers: [],
  },
  creator: {
    id: 'c1',
    name: 'Creator',
    avatarURL: '',
    emailAddress: 'c@x.com',
  },
  event: null,
  recurringEventInstance: null,
  category: {
    id: 'cat1',
    name: 'Category 1',
    description: '',
    isDisabled: false,
    createdAt: dayjs().toISOString(),
    organizationId: 'orgId',
  },
};

describe('ActionItemModal callback coverage', () => {
  it('covers category/volunteer comparator callbacks and DatePicker create-mode onChange', () => {
    render(
      <ItemModal
        {...baseProps}
        editMode={false}
        actionItem={null}
        isRecurring={false}
      />,
    );
    expect(screen.getByTestId('actionItemModal')).toBeInTheDocument();
    expect(screen.getByTestId('categorySelect')).toBeInTheDocument();
    expect(screen.getByTestId('volunteerSelect')).toBeInTheDocument();
  });

  it('covers volunteer-group comparator callback and DatePicker edit-mode guard', () => {
    render(
      <ItemModal
        {...baseProps}
        editMode={true}
        actionItem={groupActionItem}
        isRecurring={true}
      />,
    );
    expect(screen.getByTestId('actionItemModal')).toBeInTheDocument();
    expect(screen.getByTestId('volunteerGroupSelect')).toBeInTheDocument();
  });
});
