import React, { useState } from 'react';
import type { ChangeEvent, FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Form } from 'react-bootstrap';

import { WarningAmberRounded, Search } from '@mui/icons-material';
import { toast } from 'react-toastify';

import { useMutation, useQuery } from '@apollo/client';
import { AGENDA_ITEM_CATEGORY_LIST } from 'GraphQl/Queries/Queries';
import { CREATE_AGENDA_ITEM_CATEGORY_MUTATION } from 'GraphQl/Mutations/mutations';

import type { InterfaceAgendaItemCategoryList } from 'utils/interfaces';
import AgendaCategoryContainer from 'components/AgendaCategory/AgendaCategoryContainer';
import AgendaCategoryCreateModal from './AgendaCategoryCreateModal';
import styles from 'style/app.module.css';
import Loader from 'components/Loader/Loader';

interface InterfaceAgendaCategoryProps {
  orgId: string;
}

/**
 * Component for managing and displaying agenda item categories within an organization.
 *
 * This component allows users to view, create, and manage agenda item categories. It includes functionality for displaying categories, handling creation, and managing modal visibility.
 *
 * @returns The rendered component.
 */

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
  const [searchValue, setSearchValue] = useState<string>('');
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
    variables: {
      organizationId: orgId,
      where: {
        name_contains: searchTerm,
      },
    },
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
      toast.success(t('agendaCategoryCreated') as string);
      setFormState({ name: '', description: '', createdBy: '' });
      refetchAgendaCategory();
      hideCreateModal();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
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

  if (agendaCategoryLoading) return <Loader size="xl" />;

  if (agendaCategoryError) {
    return (
      <div className={`${styles.container} bg-transparent rounded-4 my-3`}>
        <div className={styles.message}>
          <WarningAmberRounded className={styles.errorIcon} fontSize="large" />
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
    <div className={`mx-4`}>
      <div className={` bg-transparent rounded-4 my-3`}>
        <div className={`mx-4`}>
          <div className={`${styles.btnsContainer} my-0`}>
            <div className={`${styles.input} mb-1`}>
              <Form.Control
                type="name"
                placeholder={tCommon('searchByName')}
                autoComplete="off"
                required
                className={styles.inputField}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyUp={(e) => {
                  if (e.key === 'Enter') {
                    setSearchTerm(searchValue);
                  } else if (e.key === 'Backspace' && searchValue === '') {
                    setSearchTerm('');
                  }
                }}
                data-testid="searchByName"
              />
              <Button
                tabIndex={-1}
                className={styles.searchButton}
                onClick={() => setSearchTerm(searchValue)}
                data-testid="searchBtn"
              >
                <Search />
              </Button>
            </div>

            <Button
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
          agendaCategoryConnection={`Organization`}
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
  );
};

export default organizationAgendaCategory;
