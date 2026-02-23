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
 * <EventAgenda eventId="12345" />
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
import { useTranslation } from 'react-i18next';
import { Button } from '../../../../shared-components/Button';

import { WarningAmberRounded } from '@mui/icons-material';

import { useQuery } from '@apollo/client';
import {
  AGENDA_ITEM_CATEGORY_LIST,
  AGENDA_FOLDER_LIST,
} from 'GraphQl/Queries/Queries';

import type {
  InterfaceAgendaItemCategoryList,
  InterfaceAgendaFolderList,
} from 'types/AdminPortal/Agenda/interface';
import { useModalState } from 'shared-components/CRUDModalTemplate';
import AgendaFolderContainer from 'components/AdminPortal/AgendaFolder/AgendaFolderContainer';
import AgendaFolderCreateModal from 'components/AdminPortal/AgendaFolder/Create/AgendaFolderCreateModal';
import AgendaItemsCreateModal from 'components/AdminPortal/AgendaItems/Create/AgendaItemsCreateModal';
import LoadingState from 'shared-components/LoadingState/LoadingState';
import styles from './EventAgenda.module.css';

function EventAgenda(props: { eventId: string }): JSX.Element {
  const { eventId } = props;

  const { t } = useTranslation('translation', { keyPrefix: 'agendaSection' });
  const agendaFolderCreateModal = useModalState();
  const agendaItemCreateModal = useModalState();

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
    error?: Error | undefined;
    refetch: () => void;
  } = useQuery(AGENDA_FOLDER_LIST, {
    variables: { eventId },
    notifyOnNetworkStatusChange: true,
  });

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
            {agendaFolderError ? 'Agenda Folders' : 'Agenda Items'}
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
              <div className=" d-none d-lg-inline grow d-flex align-items-center bg-light-subtle rounded-3">
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
                onClick={agendaItemCreateModal.open}
                data-testid="createAgendaItemBtn"
                className={styles.createAgendaItemButton}
              >
                {t('createAgendaItem')}
              </Button>
              <Button
                onClick={agendaFolderCreateModal.open}
                data-testid="createAgendaFolderBtn"
                className={styles.createAgendaItemButton}
              >
                {t('createAgendaFolder')}
              </Button>
            </div>
          </div>

          <hr />

          <AgendaFolderContainer
            // i18n-ignore-next-line
            agendaFolderConnection={`Event`}
            agendaFolderData={agendaFolderData?.agendaFoldersByEventId}
            refetchAgendaFolder={refetchAgendaFolder}
            agendaItemCategories={agendaCategoryData?.agendaCategoriesByEventId}
          />
        </div>

        <AgendaFolderCreateModal
          isOpen={agendaFolderCreateModal.isOpen}
          hide={agendaFolderCreateModal.close}
          eventId={eventId}
          agendaFolderData={agendaFolderData}
          refetchAgendaFolder={refetchAgendaFolder}
        />
        <AgendaItemsCreateModal
          isOpen={agendaItemCreateModal.isOpen}
          hide={agendaItemCreateModal.close}
          eventId={eventId}
          refetchAgendaFolder={refetchAgendaFolder}
          agendaItemCategories={agendaCategoryData?.agendaCategoriesByEventId}
          agendaFolderData={agendaFolderData?.agendaFoldersByEventId}
        />
      </div>
    </LoadingState>
  );
}

export default EventAgenda;
