import React from 'react';
import type { ApolloLink } from '@apollo/client';
import { MockedProvider } from '@apollo/react-testing';
import { LocalizationProvider } from '@mui/x-date-pickers';
import type { RenderResult } from '@testing-library/react';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  act,
} from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { store } from 'state/store';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import i18nForTest from '../../../utils/i18nForTest';
import { MOCKS, MOCKS_ERROR } from '../OrganizationActionItem.mocks';
import { StaticMockLink } from 'utils/StaticMockLink';
import { toast } from 'react-toastify';
import ItemDeleteModal, {
  type IItemDeleteModalProps,
} from './ActionItemDeleteModal';
import { vi } from 'vitest';

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const link1 = new StaticMockLink(MOCKS);
const link2 = new StaticMockLink(MOCKS_ERROR);
const t = JSON.parse(
  JSON.stringify(
    i18nForTest.getDataByLanguage('en')?.translation.organizationActionItems,
  ),
);

// Updated itemProps to match the new interface
const itemProps: IItemDeleteModalProps = {
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
    assignedAt: new Date('2024-08-27'),
    completionAt: new Date('2044-09-03'),
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: null,
    isCompleted: true,
    preCompletionNotes: 'Notes 1',
    postCompletionNotes: 'Cmp Notes 1',
    isInstanceException: false,

    // Related entities updated according to the new interfaces
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
      description: null, // Added required field
      isDisabled: false, // Added required field
      createdAt: '2024-01-01T00:00:00.000Z', // Added required field
      organizationId: 'orgId1', // Added required field
    },
  },
};

const renderItemDeleteModal = (
  link: ApolloLink,
  props: IItemDeleteModalProps,
): RenderResult => {
  return render(
    <MockedProvider link={link} addTypename={false}>
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
  it('should render ItemDeleteModal', () => {
    renderItemDeleteModal(link1, itemProps);
    expect(screen.getByText(t.deleteActionItem)).toBeInTheDocument();
  });

  it('should successfully Delete Action Item', async () => {
    renderItemDeleteModal(link1, itemProps);
    expect(screen.getByTestId('deleteyesbtn')).toBeInTheDocument();

    await act(() => {
      fireEvent.click(screen.getByTestId('deleteyesbtn'));
    });

    await waitFor(() => {
      expect(itemProps.actionItemsRefetch).toHaveBeenCalled();
      expect(itemProps.hide).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith(t.successfulDeletion);
    });
  });

  it('should fail to Delete Action Item', async () => {
    renderItemDeleteModal(link2, itemProps);
    expect(screen.getByTestId('deleteyesbtn')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('deleteyesbtn'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Mock Graphql Error');
    });
  });

  describe('Conditional Logic for Recurring Events', () => {
    it('should not render applyTo radio buttons when eventId is not provided', () => {
      const propsWithoutEventId: IItemDeleteModalProps = {
        ...itemProps,
        eventId: undefined,
        isRecurring: true,
      };

      renderItemDeleteModal(link1, propsWithoutEventId);

      // Radio buttons should not be present
      expect(screen.queryByText(t.entireSeries)).not.toBeInTheDocument();
      expect(screen.queryByText(t.thisEventOnly)).not.toBeInTheDocument();
    });

    it('should not render applyTo radio buttons when isRecurring is false', () => {
      const propsNotRecurring: IItemDeleteModalProps = {
        ...itemProps,
        eventId: 'event123',
        isRecurring: false,
      };

      renderItemDeleteModal(link1, propsNotRecurring);

      // Radio buttons should not be present
      expect(screen.queryByText(t.entireSeries)).not.toBeInTheDocument();
      expect(screen.queryByText(t.thisEventOnly)).not.toBeInTheDocument();
    });

    it('should render applyTo radio buttons when eventId and isRecurring are provided', () => {
      const propsWithRecurring: IItemDeleteModalProps = {
        ...itemProps,
        actionItem: {
          ...itemProps.actionItem,
          isTemplate: true,
        },
        eventId: 'event123',
        isRecurring: true,
      };

      renderItemDeleteModal(link1, propsWithRecurring);

      // Radio buttons should be present
      expect(screen.getByText(t.entireSeries)).toBeInTheDocument();
      expect(screen.getByText(t.thisEventOnly)).toBeInTheDocument();

      // Series should be selected by default
      expect(screen.getByTestId('deleteApplyToSeries')).toBeChecked();
      expect(screen.getByTestId('deleteApplyToInstance')).not.toBeChecked();
    });

    it('should allow switching between series and instance options', () => {
      const propsWithRecurring: IItemDeleteModalProps = {
        ...itemProps,
        actionItem: {
          ...itemProps.actionItem,
          isTemplate: true,
        },
        eventId: 'event123',
        isRecurring: true,
      };

      renderItemDeleteModal(link1, propsWithRecurring);

      const seriesRadio = screen.getByTestId('deleteApplyToSeries');
      const instanceRadio = screen.getByTestId('deleteApplyToInstance');

      // Initially series should be selected
      expect(seriesRadio).toBeChecked();
      expect(instanceRadio).not.toBeChecked();

      // Click instance radio
      fireEvent.click(instanceRadio);
      expect(seriesRadio).not.toBeChecked();
      expect(instanceRadio).toBeChecked();

      // Click series radio again
      fireEvent.click(seriesRadio);
      expect(seriesRadio).toBeChecked();
      expect(instanceRadio).not.toBeChecked();
    });

    it('should use DELETE_ACTION_ITEM_MUTATION when applyTo is series', async () => {
      const propsWithRecurring: IItemDeleteModalProps = {
        ...itemProps,
        actionItem: {
          ...itemProps.actionItem,
          isTemplate: true,
        },
        eventId: 'event123',
        isRecurring: true,
      };

      renderItemDeleteModal(link1, propsWithRecurring);

      // Ensure series is selected (default)
      const seriesRadio = screen.getByTestId('deleteApplyToSeries');
      expect(seriesRadio).toBeChecked();

      // Click delete button
      await act(() => {
        fireEvent.click(screen.getByTestId('deleteyesbtn'));
      });

      await waitFor(() => {
        expect(itemProps.actionItemsRefetch).toHaveBeenCalled();
        expect(itemProps.hide).toHaveBeenCalled();
        expect(toast.success).toHaveBeenCalledWith(t.successfulDeletion);
      });
    });

    it('should use DELETE_ACTION_FOR_INSTANCE when applyTo is instance', async () => {
      const propsWithRecurring: IItemDeleteModalProps = {
        ...itemProps,
        actionItem: {
          ...itemProps.actionItem,
          isTemplate: true,
        },
        eventId: 'event123',
        isRecurring: true,
      };

      renderItemDeleteModal(link1, propsWithRecurring);

      // Switch to instance
      const instanceRadio = screen.getByTestId('deleteApplyToInstance');
      fireEvent.click(instanceRadio);
      expect(instanceRadio).toBeChecked();

      // Click delete button
      await act(() => {
        fireEvent.click(screen.getByTestId('deleteyesbtn'));
      });

      await waitFor(() => {
        expect(itemProps.actionItemsRefetch).toHaveBeenCalled();
        expect(itemProps.hide).toHaveBeenCalled();
        expect(toast.success).toHaveBeenCalledWith(t.successfulDeletion);
      });
    });

    it('should use DELETE_ACTION_ITEM_MUTATION for non-recurring events', async () => {
      const propsNonRecurring: IItemDeleteModalProps = {
        ...itemProps,
        eventId: 'event123',
        isRecurring: false,
      };

      renderItemDeleteModal(link1, propsNonRecurring);

      // No radio buttons should be present
      expect(screen.queryByText(t.entireSeries)).not.toBeInTheDocument();

      // Click delete button
      await act(() => {
        fireEvent.click(screen.getByTestId('deleteyesbtn'));
      });

      await waitFor(() => {
        expect(itemProps.actionItemsRefetch).toHaveBeenCalled();
        expect(itemProps.hide).toHaveBeenCalled();
        expect(toast.success).toHaveBeenCalledWith(t.successfulDeletion);
      });
    });

    it('should use DELETE_ACTION_ITEM_MUTATION when eventId is not provided', async () => {
      const propsWithoutEventId: IItemDeleteModalProps = {
        ...itemProps,
        eventId: undefined,
        isRecurring: true,
      };

      renderItemDeleteModal(link1, propsWithoutEventId);

      // No radio buttons should be present
      expect(screen.queryByText(t.entireSeries)).not.toBeInTheDocument();

      // Click delete button
      await act(() => {
        fireEvent.click(screen.getByTestId('deleteyesbtn'));
      });

      await waitFor(() => {
        expect(itemProps.actionItemsRefetch).toHaveBeenCalled();
        expect(itemProps.hide).toHaveBeenCalled();
        expect(toast.success).toHaveBeenCalledWith(t.successfulDeletion);
      });
    });

    it('should handle error when deleting instance fails', async () => {
      const propsWithRecurring: IItemDeleteModalProps = {
        ...itemProps,
        actionItem: {
          ...itemProps.actionItem,
          isTemplate: true,
        },
        eventId: 'event123',
        isRecurring: true,
      };

      renderItemDeleteModal(link2, propsWithRecurring);

      // Switch to instance
      const instanceRadio = screen.getByTestId('deleteApplyToInstance');
      fireEvent.click(instanceRadio);

      // Click delete button
      fireEvent.click(screen.getByTestId('deleteyesbtn'));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Mock Graphql Error');
      });
    });
  });
});
