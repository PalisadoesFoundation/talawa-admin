/**
 * Component for managing and displaying agenda items for a specific event.
 *
 * component
 * @param props - Component props.
 * @param eventId - The ID of the event for which agenda items are managed.
 *
 * @remarks
 * This component fetches and displays agenda items associated with a specific event.
 * It also allows users to create new agenda items using a modal form.
 *
 * requires-
 * - `useQuery` from `@apollo/client` for fetching agenda categories and agenda items.
 * - `useMutation` from `@apollo/client` for creating new agenda items.
 * - `useTranslation` from `react-i18next` for internationalization.
 * - `react-bootstrap` for UI components.
 * - `@mui/icons-material` for displaying error icons.
 *
 * @returns A JSX element containing the agenda items management UI.
 *
 * @example
 * ```tsx
 * <EventAgendaItems eventId="12345" />
 * ```
 *
 * @remarks
 * The component handles:
 * - Fetching agenda categories and agenda items using GraphQL queries.
 * - Displaying a loader while data is being fetched.
 * - Showing error messages if data fetching fails.
 * - Managing the state of the create agenda item modal.
 * - Submitting new agenda items via a GraphQL mutation.
 *
 * @throws Will display an error message if data fetching or mutation fails.
 */
import React, { useState } from 'react';
import type { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'shared-components/Button';

import { WarningAmberRounded } from '@mui/icons-material';

import { useMutation, useQuery } from '@apollo/client';
import {
  AGENDA_ITEM_CATEGORY_LIST,
  AgendaItemByEvent,
} from 'GraphQl/Queries/Queries';
import { CREATE_AGENDA_ITEM_MUTATION } from 'GraphQl/Mutations/mutations';

import type {
  InterfaceAgendaItemCategoryList,
  InterfaceAgendaItemList,
} from 'utils/interfaces';
import AgendaItemsContainer from 'components/AdminPortal/AgendaItems/AgendaItemsContainer';
import AgendaItemsCreateModal from 'components/AdminPortal/AgendaItems/Create/AgendaItemsCreateModal';

import styles from './EventAgendaItems.module.css';
import LoadingState from 'shared-components/LoadingState/LoadingState';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { useParams } from 'react-router';

function EventAgendaItems(props: { eventId: string }): JSX.Element {
  const { eventId } = props;
  const { orgId } = useParams();

  const { t } = useTranslation('translation', { keyPrefix: 'agendaItems' });

  if (!orgId) {
    // Avoid malformed orgId usage when the route is unexpected.
    console.error('EventAgendaItems: missing orgId in route params.');
    return <p>{t('errorLoadingAgendaCategories')}</p>;
  }

  // State to manage the create agenda item modal visibility
  const [agendaItemCreateModalIsOpen, setAgendaItemCreateModalIsOpen] =
    useState<boolean>(false);

  // State to manage form values
  const [formState, setFormState] = useState({
    agendaItemCategoryIds: [''],
    title: '',
    description: '',
    duration: '',
    attachments: [''],
    urls: [''],
  });

  // Query for agenda item categories
  const {
    data: agendaCategoryData,
    loading: agendaCategoryLoading,
    error: agendaCategoryError,
  }: {
    data: InterfaceAgendaItemCategoryList | undefined;
    loading: boolean;
    error?: Error | undefined;
  } = useQuery(AGENDA_ITEM_CATEGORY_LIST, {
    variables: { organizationId: orgId },
    notifyOnNetworkStatusChange: true,
  });

  // Query for agenda items by event
  const {
    data: agendaItemData,
    loading: agendaItemLoading,
    error: agendaItemError,
    refetch: refetchAgendaItem,
  }: {
    data: InterfaceAgendaItemList | undefined;
    loading: boolean;
    error?: unknown | undefined;
    refetch: () => void;
  } = useQuery(AgendaItemByEvent, {
    variables: { relatedEventId: eventId }, //eventId
    notifyOnNetworkStatusChange: true,
  });

  // Mutation for creating an agenda item
  const [createAgendaItem] = useMutation(CREATE_AGENDA_ITEM_MUTATION);

  /**
   * Handler for creating a new agenda item.
   *
   * @param  e - The form submit event.
   */
  const createAgendaItemHandler = async (
    e: ChangeEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    const agendaItems = Array.isArray(agendaItemData?.agendaItemByEvent)
      ? agendaItemData?.agendaItemByEvent
      : [];
    const nextSequence = agendaItems.length + 1;
    try {
      await createAgendaItem({
        variables: {
          input: {
            title: formState.title,
            description: formState.description,
            relatedEventId: eventId,
            organizationId: orgId,
            sequence: nextSequence, // Assign sequence based on current length
            duration: formState.duration,
            categories: formState.agendaItemCategoryIds,
            attachments: formState.attachments,
            urls: formState.urls,
          },
        },
      });

      // Reset form state and hide modal
      setFormState({
        title: '',
        description: '',
        duration: '',
        agendaItemCategoryIds: [''],
        attachments: [''],
        urls: [''],
      });
      hideCreateModal();
      refetchAgendaItem();
      NotificationToast.success(t('agendaItemCreated') as string);
    } catch (error: unknown) {
      if (error instanceof Error) {
        NotificationToast.error(error.message);
      }
    }
  };

  /**
   * Toggles the visibility of the create agenda item modal.
   */
  const showCreateModal = (): void => {
    setAgendaItemCreateModalIsOpen(!agendaItemCreateModalIsOpen);
  };

  /**
   * Hides the create agenda item modal.
   */
  const hideCreateModal = (): void => {
    setAgendaItemCreateModalIsOpen(!agendaItemCreateModalIsOpen);
  };

  // Show error message if there is an error loading data
  if (agendaItemError || agendaCategoryError) {
    const errorMessage =
      agendaCategoryError?.message ||
      (agendaItemError as Error)?.message ||
      'Unknown error';

    return (
      <div className={`${styles.container} bg-white rounded-4 my-3`}>
        <div className={styles.message}>
          <WarningAmberRounded className={`${styles.errorIcon} fs-3`} />
          <h6 className="fw-bold text-danger text-center">
            Error occurred while loading{' '}
            {agendaCategoryError ? 'Agenda Categories' : 'Agenda Items'} Data
            <br />
            {errorMessage}
          </h6>
        </div>
      </div>
    );
  }

  return (
    <LoadingState
      isLoading={agendaItemLoading || agendaCategoryLoading}
      variant="spinner"
    >
      <div className={styles.eventAgendaItemContainer}>
        <div className={`bg-white rounded-4 my-3`}>
          <div className={`pt-4 mx-4`}>
            <div className={styles.btnsContainer}>
              <div className=" d-none d-lg-inline flex-grow-1 d-flex align-items-center border bg-light-subtle rounded-3">
                {/* <input
                type="search"
                className="form-control border-0 bg-light-subtle"
                placeholder={t('search')}
                onChange={(e) => setSearchValue(e.target.value)}
                value={searchValue}
                data-testid="search"
                /> */}
              </div>

              <Button
                type="button"
                variant="success"
                onClick={showCreateModal}
                data-testid="createAgendaItemBtn"
                className={styles.createAgendaItemButton}
              >
                {t('createAgendaItem')}
              </Button>
            </div>
          </div>

          <hr />

          <AgendaItemsContainer
            agendaItemConnection={'Event'}
            agendaItemData={agendaItemData?.agendaItemByEvent}
            agendaItemRefetch={refetchAgendaItem}
            agendaItemCategories={
              agendaCategoryData?.agendaItemCategoriesByOrganization
            }
          />
        </div>

        <AgendaItemsCreateModal
          agendaItemCreateModalIsOpen={agendaItemCreateModalIsOpen}
          hideCreateModal={hideCreateModal}
          formState={formState}
          setFormState={setFormState}
          createAgendaItemHandler={createAgendaItemHandler}
          t={t}
          agendaItemCategories={
            agendaCategoryData?.agendaItemCategoriesByOrganization
          }
        />
      </div>
    </LoadingState>
  );
}

export default EventAgendaItems;
