/**
 * Component for managing and displaying agenda items for a specific event.
 *
 *
 * @remarks
 * This component fetches and displays agenda items associated with a specific event.
 * It also allows users to create new agenda items using a modal form.
 *
 * - `useQuery` from `@apollo/client` for fetching agenda categories and agenda items.
 * - `useMutation` from `@apollo/client` for creating new agenda items.
 * - `useTranslation` from `react-i18next` for internationalization.
 * - `react-toastify` for displaying success and error notifications.
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
import { Button } from '../../../../shared-components/Button';

import { WarningAmberRounded } from '@mui/icons-material';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';

import { useMutation, useQuery } from '@apollo/client';
import {
  AGENDA_ITEM_CATEGORY_LIST,
  AGENDA_FOLDER_LIST,
} from 'GraphQl/Queries/Queries';
import {
  CREATE_AGENDA_FOLDER_MUTATION,
  CREATE_AGENDA_ITEM_MUTATION,
} from 'GraphQl/Mutations/mutations';

import type {
  InterfaceAgendaItemCategoryList,
  InterfaceAgendaFolderList,
} from 'types/Agenda/interface';
import AgendaFolderContainer from 'components/AgendaFolder/AgendaFolderContainer';
import AgendaFolderCreateModal from 'components/AgendaFolder/Create/AgendaFolderCreateModal';
import AgendaItemsCreateModal from 'components/AgendaItems/Create/AgendaItemsCreateModal';
import LoadingState from 'shared-components/LoadingState/LoadingState';
import styles from 'style/app-fixed.module.css';
import { useParams } from 'react-router';
import { InterfaceCreateFormStateType } from 'types/Agenda/interface';

function EventAgendaFolder(props: { eventId: string }): JSX.Element {
  const { eventId } = props;
  const { orgId } = useParams();

  const { t } = useTranslation('translation', { keyPrefix: 'agendaItems' });

  // State to manage the create agenda item modal visibility
  const [agendaFolderCreateModalIsOpen, setAgendaFolderCreateModalIsOpen] =
    useState<boolean>(false);
  // State to manage the create agenda item modal visibility
  const [agendaItemCreateModalIsOpen, setAgendaItemCreateModalIsOpen] =
    useState<boolean>(false);

  // State to manage form values
  const [formState, setFormState] = useState({
    id: '',
    name: '',
    description: '',
    creator: {
      name: '',
    },
  });

  // State to manage form values
  const [agendaItemFormState, setAgendaItemFormState] =
    useState<InterfaceCreateFormStateType>({
      id: '',
      title: '',
      description: '',
      duration: '',
      creator: {
        name: '',
      },
      urls: [] as string[],
      attachments: [] as {
        mimeType: string;
        fileHash: string;
        objectName: string;
      }[],
      folderId: '',
      categoryId: '',
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
    variables: {
      eventId,
    },
    notifyOnNetworkStatusChange: true,
  });

  //Query for agenda folders.
  const {
    data: agendaFolderData,
    loading: agendaFolderLoading,
    error: agendaFolderError,
    refetch: refetchAgendaFolder,
  }: {
    data: InterfaceAgendaFolderList | undefined;
    loading: boolean;
    error?: unknown | undefined;
    refetch: () => void;
  } = useQuery(AGENDA_FOLDER_LIST, {
    variables: { eventId },
    notifyOnNetworkStatusChange: true,
  });

  // Mutation for creating an agenda item
  const [createAgendaItem] = useMutation(CREATE_AGENDA_ITEM_MUTATION);

  // Mutation for creating an agenda item
  const [createAgendaFolder] = useMutation(CREATE_AGENDA_FOLDER_MUTATION);

  /**
   * Handler for creating a new agenda item.
   *
   * @param  e - The form submit event.
   */
  const createAgendaItemHandler = async (
    e: ChangeEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    const selectedFolder = agendaFolderData?.agendaFoldersByEventId?.find(
      (folder) => folder.id === agendaItemFormState.folderId,
    );
    const folderItems = selectedFolder?.items?.edges ?? [];
    const maxSequence = folderItems.reduce(
      (max, edge) => Math.max(max, edge.node.sequence ?? 0),
      0,
    );
    const nextSequence = maxSequence + 1;
    try {
      await createAgendaItem({
        variables: {
          input: {
            name: agendaItemFormState.title,
            description: agendaItemFormState.description,
            eventId: eventId,
            sequence: nextSequence, // Assign sequence based on current length
            duration: agendaItemFormState.duration,
            folderId: agendaItemFormState.folderId,
            categoryId: agendaItemFormState.categoryId,
            attachments:
              agendaItemFormState.attachments.length > 0
                ? agendaItemFormState.attachments.map((att) => ({
                    mimeType: att.mimeType,
                    fileHash: att.fileHash,
                    objectName: att.objectName,
                  }))
                : undefined,
            type: 'general',
            //key:
            url:
              agendaItemFormState.urls.length > 0
                ? agendaItemFormState.urls.map((u) => ({
                    url: u,
                  }))
                : undefined,
          },
        },
      });

      // Reset form state and hide modal
      setAgendaItemFormState({
        id: '',
        title: '',
        description: '',
        duration: '',
        folderId: null,
        attachments: [] as {
          mimeType: string;
          fileHash: string;
          objectName: string;
        }[],
        urls: [] as string[],
        creator: {
          name: '',
        },
        categoryId: '',
      });
      hideItemCreateModal();
      refetchAgendaFolder();
      NotificationToast.success(t('agendaItemCreated') as string);
    } catch (error: unknown) {
      if (error instanceof Error) {
        NotificationToast.error(error.message);
      }
    }
  };

  /**
   * Handler for creating a new agenda item.
   *
   * @param  e - The form submit event.
   */
  const createAgendaFolderHandler = async (
    e: ChangeEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    const agendaFolders = Array.isArray(
      agendaFolderData?.agendaFoldersByEventId,
    )
      ? agendaFolderData?.agendaFoldersByEventId
      : [];
    const maxSequence = agendaFolders.reduce(
      (max, folder) => Math.max(max, folder.sequence ?? 0),
      0,
    );
    const nextSequence = maxSequence + 1;
    try {
      await createAgendaFolder({
        variables: {
          input: {
            name: formState.name,
            description: formState.description,
            eventId: eventId,
            sequence: nextSequence, // Assign sequence based on current length
            organizationId: orgId,
          },
        },
      });

      // Reset form state and hide modal
      setFormState({
        id: '',
        name: '',
        description: '',
        creator: {
          name: '',
        },
      });
      hideCreateModal();
      refetchAgendaFolder();
      NotificationToast.success(t('agendaFolderCreated') as string);
    } catch (error: unknown) {
      if (error instanceof Error) {
        NotificationToast.error(error.message);
      }
    }
  };

  /**
   * Toggles the visibility of the create agenda folder modal.
   */
  const showCreateModal = (): void => {
    setAgendaFolderCreateModalIsOpen(!agendaFolderCreateModalIsOpen);
  };

  /**
   * Toggles the visibility of the create agenda item modal.
   */
  const showItemsCreateModal = (): void => {
    setAgendaItemCreateModalIsOpen(!agendaItemCreateModalIsOpen);
  };

  /**
   * Hides the create agenda folder modal.
   */
  const hideCreateModal = (): void => {
    setAgendaFolderCreateModalIsOpen(!agendaFolderCreateModalIsOpen);
  };

  /**
   * Hides the create agenda agenda modal.
   */
  const hideItemCreateModal = (): void => {
    setAgendaItemCreateModalIsOpen(!agendaItemCreateModalIsOpen);
  };

  // Show error message if there is an error loading data
  if (agendaFolderError || agendaCategoryError) {
    const errorMessage =
      (agendaFolderError as Error | undefined)?.message ||
      agendaCategoryError?.message ||
      'Unknown error';

    return (
      <div className={`${styles.container} bg-white rounded-4 my-3`}>
        <div className={styles.message}>
          <WarningAmberRounded className={styles.errorIcon} />
          <h6 className="fw-bold text-danger text-center">
            Error occurred while loading{' '}
            {agendaFolderError ? 'Agenda Folders' : 'Agenda Items'} Data
            <br />
            {errorMessage}
          </h6>
        </div>
      </div>
    );
  }

  return (
    <LoadingState
      isLoading={agendaFolderLoading || agendaCategoryLoading}
      variant="spinner"
    >
      <div className={styles.eventAgendaItemContainer}>
        <div className={`bg-white rounded-4 my-3`}>
          <div className={`pt-4 mx-4`}>
            <div className={styles.btnsContainer}>
              <div className=" d-none d-lg-inline grow d-flex align-items-center border bg-light-subtle rounded-3">
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
                onClick={showItemsCreateModal}
                data-testid="createAgendaItemBtn"
                className={styles.createAgendaItemButton}
              >
                {t('createAgendaItem')}
              </Button>
              <Button
                onClick={showCreateModal}
                data-testid="createAgendaFolderBtn"
                className={styles.createAgendaItemButton}
              >
                {t('createAgendaFolder')}
              </Button>
            </div>
          </div>

          <hr />

          <AgendaFolderContainer
            agendaFolderConnection={`Event`}
            agendaFolderData={agendaFolderData?.agendaFoldersByEventId}
            refetchAgendaFolder={refetchAgendaFolder}
            agendaItemCategories={agendaCategoryData?.agendaCategoriesByEventId}
          />
        </div>

        <AgendaFolderCreateModal
          agendaFolderCreateModalIsOpen={agendaFolderCreateModalIsOpen}
          hideCreateModal={hideCreateModal}
          formState={formState}
          setFormState={setFormState}
          createAgendaFolderHandler={createAgendaFolderHandler}
          t={t}
        />
        <AgendaItemsCreateModal
          agendaItemCreateModalIsOpen={agendaItemCreateModalIsOpen}
          hideItemCreateModal={hideItemCreateModal}
          agendaItemFormState={agendaItemFormState}
          setAgendaItemFormState={setAgendaItemFormState}
          createAgendaItemHandler={createAgendaItemHandler}
          t={t}
          agendaItemCategories={agendaCategoryData?.agendaCategoriesByEventId}
          agendaFolderData={agendaFolderData?.agendaFoldersByEventId}
        />
      </div>
    </LoadingState>
  );
}

export default EventAgendaFolder;
