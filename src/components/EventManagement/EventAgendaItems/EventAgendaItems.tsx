import React, { useState } from 'react';
import type { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-bootstrap';

import { WarningAmberRounded } from '@mui/icons-material';
import { toast } from 'react-toastify';

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
import AgendaItemsContainer from 'components/AgendaItems/AgendaItemsContainer';
import AgendaItemsCreateModal from 'components/AgendaItems/AgendaItemsCreateModal';

import styles from '../../../style/app.module.css';
import Loader from 'components/Loader/Loader';

/**
 * Component to manage and display agenda items for a specific event.
 *
 * @param  props - The component props.
 * @param eventId - The ID of the event to manage agenda items for.
 * @returns  The rendered component.
 */
function EventAgendaItems(props: { eventId: string }): JSX.Element {
  const { eventId } = props;

  const { t } = useTranslation('translation', {
    keyPrefix: 'agendaItems',
  });

  // Extract organization ID from URL
  const url: string = window.location.href;
  const startIdx: number = url.indexOf('/event/') + '/event/'.length;
  const orgId: string = url.slice(startIdx, url.indexOf('/', startIdx));

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
    try {
      await createAgendaItem({
        variables: {
          input: {
            title: formState.title,
            description: formState.description,
            relatedEventId: eventId,
            organizationId: orgId,
            sequence: (agendaItemData?.agendaItemByEvent.length || 0) + 1 || 1, // Assign sequence based on current length
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
      toast.success(t('agendaItemCreated') as string);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
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

  // Show loader while data is loading
  if (agendaItemLoading || agendaCategoryLoading) return <Loader size="xl" />;

  // Show error message if there is an error loading data
  if (agendaItemError || agendaCategoryError) {
    const errorMessage =
      agendaCategoryError?.message ||
      (agendaItemError as Error)?.message ||
      'Unknown error';

    return (
      <div className={`${styles.container} bg-white rounded-4 my-3`}>
        <div className={styles.message}>
          <WarningAmberRounded className={styles.errorIcon} fontSize="large" />
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
          agendaItemConnection={`Event`}
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
  );
}

export default EventAgendaItems;
