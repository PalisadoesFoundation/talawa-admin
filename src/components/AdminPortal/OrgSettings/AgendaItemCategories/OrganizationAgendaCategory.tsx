/**
 * Component for managing and displaying agenda item categories for an organization.
 *
 *
 * @param props - The props for the component.
 * @param orgId - The ID of the organization.
 *
 * @remarks
 * This component fetches, displays, and allows the creation of agenda item categories
 * for a specific organization. It includes a search bar for filtering categories by name
 * and a modal for creating new categories.
 *
 * requires -
 *  - useQuery - For fetching agenda item categories.
 *  - useMutation - For creating new agenda item categories.
 *  - useTranslation - For internationalization.
 *  - AgendaCategoryContainer - For displaying the list of agenda categories.
 *  - AgendaCategoryCreateModal - For creating new agenda categories.
 *
 * @example
 * ```tsx
 * <OrganizationAgendaCategory orgId="12345" />
 * ```
 *
 * @returns The rendered component.
 *
 * @throws Error If there is an error while fetching agenda item categories.
 *
 * TODO: - Add additional error handling and improve UI for error states.
 */
import React, { useState } from 'react';
import type { ChangeEvent, FC } from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'shared-components/Button';

import { WarningAmberRounded } from '@mui/icons-material';

import { useMutation, useQuery } from '@apollo/client';
import { AGENDA_ITEM_CATEGORY_LIST } from 'GraphQl/Queries/Queries';
import { CREATE_AGENDA_ITEM_CATEGORY_MUTATION } from 'GraphQl/Mutations/mutations';

import type { InterfaceAgendaItemCategoryList } from 'utils/interfaces';
import AgendaCategoryContainer from 'components/AdminPortal/AgendaCategory/AgendaCategoryContainer';
import AgendaCategoryCreateModal from './Create/AgendaCategoryCreateModal';
import styles from './OrganizationAgendaCategory.module.css';
import LoadingState from 'shared-components/LoadingState/LoadingState';
import SearchBar from 'shared-components/SearchBar/SearchBar';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';

interface InterfaceAgendaCategoryProps {
  orgId: string;
}

const organizationAgendaCategory: FC<InterfaceAgendaCategoryProps> = ({
  orgId,
}) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationAgendaCategory',
  });
  const { t: tCommon } = useTranslation('common');
  // State for managing modal visibility and form data
  const [agendaCategoryCreateModalIsOpen, setAgendaCategoryCreateModalIsOpen] =
    useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [formState, setFormState] = useState({
    name: '',
    description: '',
    createdBy: '',
  });

  /**
   * Query to fetch agenda item categories for the organization.
   */
  const {
    data: agendaCategoryData,
    loading: agendaCategoryLoading,
    error: agendaCategoryError,
    refetch: refetchAgendaCategory,
  }: {
    data: InterfaceAgendaItemCategoryList | undefined;
    loading: boolean;
    error?: unknown | undefined;
    refetch: () => void;
  } = useQuery(AGENDA_ITEM_CATEGORY_LIST, {
    variables: { organizationId: orgId, where: { name_contains: searchTerm } },
    notifyOnNetworkStatusChange: true,
  });

  /**
   * Mutation to create a new agenda item category.
   */
  const [createAgendaCategory] = useMutation(
    CREATE_AGENDA_ITEM_CATEGORY_MUTATION,
  );

  /**
   * Handler function to create a new agenda item category.
   *
   * @param e - The form submit event.
   * @returns A promise that resolves when the agenda item category is created.
   */
  const createAgendaCategoryHandler = async (
    e: ChangeEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    try {
      await createAgendaCategory({
        variables: {
          input: {
            organizationId: orgId,
            name: formState.name,
            description: formState.description,
          },
        },
      });
      NotificationToast.success(t('agendaCategoryCreated') as string);
      setFormState({ name: '', description: '', createdBy: '' });
      refetchAgendaCategory();
      hideCreateModal();
    } catch (error: unknown) {
      if (error instanceof Error) {
        NotificationToast.error(error.message);
      }
    }
  };

  /**
   * Toggles the visibility of the create agenda item category modal.
   */
  const showCreateModal = (): void => {
    setAgendaCategoryCreateModalIsOpen(!agendaCategoryCreateModalIsOpen);
  };

  /**
   * Hides the create agenda item category modal.
   */
  const hideCreateModal = (): void => {
    setAgendaCategoryCreateModalIsOpen(!agendaCategoryCreateModalIsOpen);
  };

  if (agendaCategoryError) {
    return (
      <div className={`${styles.container} bg-transparent rounded-4 my-3`}>
        <div className={styles.message}>
          <WarningAmberRounded
            className={`${styles.errorIcon} MuiSvgIcon-fontSizeLarge`}
          />
          <h6 className="fw-bold text-danger text-center">
            Error occured while loading{' '}
            {agendaCategoryError && 'Agenda Categories'}
            Data
            <br />
            {agendaCategoryError && (agendaCategoryError as Error).message}
          </h6>
        </div>
      </div>
    );
  }

  return (
    <LoadingState isLoading={agendaCategoryLoading} variant="spinner">
      <div className={`mx-4`}>
        <div className={` bg-transparent rounded-4 my-3`}>
          <div className={`mx-4`}>
            <div className={`${styles.btnsContainer} my-0`}>
              <SearchBar
                placeholder={tCommon('searchByName')}
                onSearch={setSearchTerm}
                inputTestId="searchByName"
                buttonTestId="searchBtn"
              />

              <Button
                type="button"
                variant="success"
                onClick={showCreateModal}
                data-testid="createAgendaCategoryBtn"
                className={styles.addButton}
              >
                <i className={'fa fa-plus me-2'} />
                {t('createAgendaCategory')}
              </Button>
            </div>
          </div>

          <hr />

          <AgendaCategoryContainer
            agendaCategoryConnection={'Organization'}
            agendaCategoryData={
              agendaCategoryData?.agendaItemCategoriesByOrganization
            }
            agendaCategoryRefetch={refetchAgendaCategory}
          />
        </div>
        <AgendaCategoryCreateModal
          agendaCategoryCreateModalIsOpen={agendaCategoryCreateModalIsOpen}
          hideCreateModal={hideCreateModal}
          formState={formState}
          setFormState={setFormState}
          createAgendaCategoryHandler={createAgendaCategoryHandler}
          t={t}
        />
      </div>
    </LoadingState>
  );
};

export default organizationAgendaCategory;
