import React from 'react';
import type { ApolloLink } from '@apollo/client';
import { MockedProvider } from '@apollo/react-testing';
import {
  LocalizationProvider,
  AdapterDayjs,
} from 'shared-components/DateRangePicker';
import type { RenderResult } from '@testing-library/react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { store } from 'state/store';
import i18nForTest from '../../../utils/i18nForTest';
import { MOCKS, MOCKS_ERROR } from '../ActionItem.mocks';
import { StaticMockLink } from 'utils/StaticMockLink';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
import ItemDeleteModal, {
  type IItemDeleteModalProps,
} from './ActionItemDeleteModal';
import { vi, afterEach, beforeEach } from 'vitest';
vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
    dismiss: vi.fn(),
  },
}));

let successLink: StaticMockLink;
let errorLink: StaticMockLink;
const t = JSON.parse(
  JSON.stringify(
    i18nForTest.getDataByLanguage('en')?.translation.organizationActionItems,
  ),
);

const renderItemDeleteModal = (
  link: ApolloLink,
  props: IItemDeleteModalProps,
): RenderResult => {
  return render(
    <MockedProvider link={link}>
      <Provider store={store}>
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <I18nextProvider i18n={i18nForTest}>
              <ItemDeleteModal {...props} />
            </I18nextProvider>
          </LocalizationProvider>
        </BrowserRouter>
      </Provider>
    </MockedProvider>,
  );
};

describe('Testing ItemDeleteModal', () => {
  let testItemProps: IItemDeleteModalProps;

  beforeEach(() => {
    // Create fresh mocks for each test
    vi.clearAllMocks();
    testItemProps = {
      isOpen: true,
      hide: vi.fn(),
      actionItemsRefetch: vi.fn(),
      actionItem: {
        id: 'actionItemId1',
        volunteerId: null,
        volunteerGroupId: null,
        categoryId: 'categoryId1',
        eventId: null,
        recurringEventInstanceId: null,
        organizationId: 'orgId1',
        creatorId: 'userId2',
        updaterId: null,
        assignedAt: dayjs.utc().toDate(),
        completionAt: dayjs.utc().add(20, 'year').toDate(),
        createdAt: dayjs.utc().subtract(1, 'year').toDate(),
        updatedAt: null,
        isCompleted: true,
        preCompletionNotes: 'Notes 1',
        postCompletionNotes: 'Cmp Notes 1',
        isInstanceException: false,
        volunteer: null,
        volunteerGroup: null,
        creator: {
          id: 'userId2',
          name: 'Wilt Shepherd',
          emailAddress: '',
          avatarURL: '',
        },
        event: null,
        recurringEventInstance: null,
        category: {
          id: 'categoryId1',
          name: 'Category 1',
          description: null,
          isDisabled: false,
          createdAt: dayjs.utc().subtract(1, 'year').toISOString(),
          organizationId: 'orgId1',
        },
      },
    };

    successLink = new StaticMockLink(MOCKS);
    errorLink = new StaticMockLink(MOCKS_ERROR);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render ItemDeleteModal', () => {
    renderItemDeleteModal(successLink, testItemProps);
    expect(screen.getByText(t.deleteActionItem)).toBeInTheDocument();
  });

  it('should successfully Delete Action Item', async () => {
    const user = userEvent.setup();
    renderItemDeleteModal(successLink, testItemProps);
    expect(screen.getByTestId('modal-delete-btn')).toBeInTheDocument();

    await act(() => user.click(screen.getByTestId('modal-delete-btn')));

    await waitFor(() => {
      expect(testItemProps.actionItemsRefetch).toHaveBeenCalled();
      expect(testItemProps.hide).toHaveBeenCalled();
      expect(NotificationToast.success).toHaveBeenCalledWith(
        t.successfulDeletion,
      );
    });
  });

  it('should fail to Delete Action Item', async () => {
    const user = userEvent.setup();
    renderItemDeleteModal(errorLink, testItemProps);
    expect(screen.getByTestId('modal-delete-btn')).toBeInTheDocument();
    await user.click(screen.getByTestId('modal-delete-btn'));

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith(
        'Mock Graphql Error',
      );
    });
  });

  describe('Conditional Logic for Recurring Events', () => {
    it('should not render applyTo radio buttons when eventId is not provided', () => {
      const propsWithoutEventId: IItemDeleteModalProps = {
        ...testItemProps,
        eventId: undefined,
        isRecurring: true,
      };

      renderItemDeleteModal(successLink, propsWithoutEventId);

      // Radio buttons should not be present
      expect(screen.queryByText(t.entireSeries)).not.toBeInTheDocument();
      expect(screen.queryByText(t.thisEventOnly)).not.toBeInTheDocument();
    });

    it('should not render applyTo radio buttons when isRecurring is false', () => {
      const propsNotRecurring: IItemDeleteModalProps = {
        ...testItemProps,
        eventId: 'event123',
        isRecurring: false,
      };

      renderItemDeleteModal(successLink, propsNotRecurring);

      // Radio buttons should not be present
      expect(screen.queryByText(t.entireSeries)).not.toBeInTheDocument();
      expect(screen.queryByText(t.thisEventOnly)).not.toBeInTheDocument();
    });

    it('should render applyTo radio buttons when eventId and isRecurring are provided', () => {
      const propsWithRecurring: IItemDeleteModalProps = {
        ...testItemProps,
        actionItem: {
          ...testItemProps.actionItem,
          isTemplate: true,
        },
        eventId: 'event123',
        isRecurring: true,
      };

      renderItemDeleteModal(successLink, propsWithRecurring);

      // Radio buttons should be present
      expect(screen.getByText(t.entireSeries)).toBeInTheDocument();
      expect(screen.getByText(t.thisEventOnly)).toBeInTheDocument();

      // Series should be selected by default
      expect(screen.getByTestId('deleteApplyToSeries')).toBeChecked();
      expect(screen.getByTestId('deleteApplyToInstance')).not.toBeChecked();
    });

    it('should allow switching between series and instance options', async () => {
      const user = userEvent.setup();
      const propsWithRecurring: IItemDeleteModalProps = {
        ...testItemProps,
        actionItem: {
          ...testItemProps.actionItem,
          isTemplate: true,
        },
        eventId: 'event123',
        isRecurring: true,
      };

      renderItemDeleteModal(successLink, propsWithRecurring);

      const seriesRadio = screen.getByTestId('deleteApplyToSeries');
      const instanceRadio = screen.getByTestId('deleteApplyToInstance');

      // Initially series should be selected
      expect(seriesRadio).toBeChecked();
      expect(instanceRadio).not.toBeChecked();

      // Click instance radio
      await user.click(instanceRadio);
      expect(seriesRadio).not.toBeChecked();
      expect(instanceRadio).toBeChecked();

      // Click series radio again
      await user.click(seriesRadio);
      expect(seriesRadio).toBeChecked();
      expect(instanceRadio).not.toBeChecked();
    });

    it('should use DELETE_ACTION_ITEM_MUTATION when applyTo is series', async () => {
      const user = userEvent.setup();
      const propsWithRecurring: IItemDeleteModalProps = {
        ...testItemProps,
        actionItem: {
          ...testItemProps.actionItem,
          isTemplate: true,
        },
        eventId: 'event123',
        isRecurring: true,
      };

      renderItemDeleteModal(successLink, propsWithRecurring);

      // Ensure series is selected (default)
      const seriesRadio = screen.getByTestId('deleteApplyToSeries');
      expect(seriesRadio).toBeChecked();

      // Click delete button
      await act(() => user.click(screen.getByTestId('modal-delete-btn')));

      await waitFor(() => {
        expect(testItemProps.actionItemsRefetch).toHaveBeenCalled();
        expect(testItemProps.hide).toHaveBeenCalled();
        expect(NotificationToast.success).toHaveBeenCalledWith(
          t.successfulDeletion,
        );
      });
    });

    it('should use DELETE_ACTION_FOR_INSTANCE when applyTo is instance', async () => {
      const user = userEvent.setup();
      const propsWithRecurring: IItemDeleteModalProps = {
        ...testItemProps,
        actionItem: {
          ...testItemProps.actionItem,
          isTemplate: true,
        },
        eventId: 'event123',
        isRecurring: true,
      };

      renderItemDeleteModal(successLink, propsWithRecurring);

      // Switch to instance
      const instanceRadio = screen.getByTestId('deleteApplyToInstance');
      await user.click(instanceRadio);
      expect(instanceRadio).toBeChecked();

      // Click delete button
      await act(() => user.click(screen.getByTestId('modal-delete-btn')));

      await waitFor(() => {
        expect(testItemProps.actionItemsRefetch).toHaveBeenCalled();
        expect(testItemProps.hide).toHaveBeenCalled();
        expect(NotificationToast.success).toHaveBeenCalledWith(
          t.successfulDeletion,
        );
      });
    });

    it('should use DELETE_ACTION_ITEM_MUTATION for non-recurring events', async () => {
      const user = userEvent.setup();
      const propsNonRecurring: IItemDeleteModalProps = {
        ...testItemProps,
        eventId: 'event123',
        isRecurring: false,
      };

      renderItemDeleteModal(successLink, propsNonRecurring);

      // No radio buttons should be present
      expect(screen.queryByText(t.entireSeries)).not.toBeInTheDocument();

      // Click delete button
      await act(() => user.click(screen.getByTestId('modal-delete-btn')));

      await waitFor(() => {
        expect(testItemProps.actionItemsRefetch).toHaveBeenCalled();
        expect(testItemProps.hide).toHaveBeenCalled();
        expect(NotificationToast.success).toHaveBeenCalledWith(
          t.successfulDeletion,
        );
      });
    });

    it('should use DELETE_ACTION_ITEM_MUTATION when eventId is not provided', async () => {
      const user = userEvent.setup();
      const propsWithoutEventId: IItemDeleteModalProps = {
        ...testItemProps,
        eventId: undefined,
        isRecurring: true,
      };

      renderItemDeleteModal(successLink, propsWithoutEventId);

      // No radio buttons should be present
      expect(screen.queryByText(t.entireSeries)).not.toBeInTheDocument();

      // Click delete button
      await act(() => user.click(screen.getByTestId('modal-delete-btn')));

      await waitFor(() => {
        expect(testItemProps.actionItemsRefetch).toHaveBeenCalled();
        expect(testItemProps.hide).toHaveBeenCalled();
        expect(NotificationToast.success).toHaveBeenCalledWith(
          t.successfulDeletion,
        );
      });
    });

    it('should handle error when deleting instance fails', async () => {
      const user = userEvent.setup();
      const propsWithRecurring: IItemDeleteModalProps = {
        ...testItemProps,
        actionItem: {
          ...testItemProps.actionItem,
          isTemplate: true,
        },
        eventId: 'event123',
        isRecurring: true,
      };

      renderItemDeleteModal(errorLink, propsWithRecurring);

      const instanceRadio = screen.getByTestId('deleteApplyToInstance');
      await user.click(instanceRadio);

      await user.click(screen.getByTestId('modal-delete-btn'));

      await waitFor(() => {
        expect(NotificationToast.error).toHaveBeenCalledWith(
          'Mock Graphql Error',
        );
      });
    });
  });
});
