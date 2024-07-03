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

import styles from './EventAgendaItems.module.css';
import Loader from 'components/Loader/Loader';

function EventAgendaItems(props: { eventId: string }): JSX.Element {
  const { eventId } = props;

  const { t } = useTranslation('translation', {
    keyPrefix: 'agendaItems',
  });

  const url: string = window.location.href;
  const startIdx: number = url.indexOf('/event/') + '/event/'.length;
  const orgId: string = url.slice(startIdx, url.indexOf('/', startIdx));

  const [agendaItemCreateModalIsOpen, setAgendaItemCreateModalIsOpen] =
    useState<boolean>(false);

  const [formState, setFormState] = useState({
    agendaItemCategoryIds: [''],
    title: '',
    description: '',
    duration: '',
    attachments: [''],
    urls: [''],
  });

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

  const [createAgendaItem] = useMutation(CREATE_AGENDA_ITEM_MUTATION);

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
      toast.success(t('agendaItemCreated'));
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  const showCreateModal = (): void => {
    setAgendaItemCreateModalIsOpen(!agendaItemCreateModalIsOpen);
  };

  const hideCreateModal = (): void => {
    setAgendaItemCreateModalIsOpen(!agendaItemCreateModalIsOpen);
  };

  if (agendaItemLoading || agendaCategoryLoading) return <Loader size="xl" />;

  if (agendaItemError || agendaCategoryError) {
    return (
      <div className={`${styles.container} bg-white rounded-4 my-3`}>
        <div className={styles.message}>
          <WarningAmberRounded className={styles.errorIcon} fontSize="large" />
          <h6 className="fw-bold text-danger text-center">
            Error occurred while loading{' '}
            {agendaCategoryError
              ? 'Agenda Categories'
              : agendaItemError && 'Agenda Items'}
            Data
            <br />
            {agendaCategoryError
              ? agendaCategoryError.message
              : agendaItemError && (agendaItemError as Error).message}
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
