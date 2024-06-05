import React, { useState } from 'react';
import type { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import { WarningAmberRounded } from '@mui/icons-material';
import { toast } from 'react-toastify';

import { useMutation, useQuery } from '@apollo/client';
import { AGENDA_ITEM_CATEGORY_LIST } from 'GraphQl/Queries/Queries';
import { CREATE_AGENDA_ITEM_CATEGORY_MUTATION } from 'GraphQl/Mutations/mutations';

import type { InterfaceAgendaItemCategoryList } from 'utils/interfaces';
import AgendaCategoryContainer from 'components/AgendaCategory/AgendaCategoryContainer';
import AgendaCategoryCreateModal from './AgendaCategoryCreateModal';
import styles from './OrganizationAgendaCategory.module.css';
import Loader from 'components/Loader/Loader';

function organizationAgendaCategory(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationAgendaCategory',
  });

  const { orgId: currentUrl } = useParams();

  const [agendaCategoryCreateModalIsOpen, setAgendaCategoryCreateModalIsOpen] =
    useState<boolean>(false);

  const [formState, setFormState] = useState({
    name: '',
    description: '',
    createdBy: '',
  });

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
    variables: { organizationId: currentUrl },
    notifyOnNetworkStatusChange: true,
  });

  const [createAgendaCategory] = useMutation(
    CREATE_AGENDA_ITEM_CATEGORY_MUTATION,
  );

  const createAgendaCategoryHandler = async (
    e: ChangeEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    try {
      await createAgendaCategory({
        variables: {
          input: {
            organizationId: currentUrl,
            name: formState.name,
            description: formState.description,
          },
        },
      });
      toast.success(t('agendaCategoryCreated'));
      setFormState({ name: '', description: '', createdBy: '' });
      refetchAgendaCategory();
      hideCreateModal();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
        console.error(error.message);
      }
    }
  };

  const showCreateModal = (): void => {
    setAgendaCategoryCreateModalIsOpen(!agendaCategoryCreateModalIsOpen);
  };

  const hideCreateModal = (): void => {
    setAgendaCategoryCreateModalIsOpen(!agendaCategoryCreateModalIsOpen);
  };

  if (agendaCategoryLoading) return <Loader size="xl" />;

  if (agendaCategoryError) {
    return (
      <div className={`${styles.container} bg-white rounded-4 my-3`}>
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
    <div className={styles.organizationAgendaCategoryContainer}>
      <div className={`${styles.container} bg-white rounded-4 my-3`}>
        <div className={`pt-4 mx-4`}>
          <div className={styles.btnsContainer}>
            <div className=" d-none d-lg-inline flex-grow-1 d-flex align-items-center border bg-light-subtle rounded-3">
              {/* <input
                type="search"
                className="form-control border-0 bg-light-subtle"
                placeholder={t('searchAgendaCategories')}
                onChange={(e) => setSearchValue(e.target.value)}
                value={searchValue}
                data-testid="searchAgendaCategories"
              /> */}
            </div>

            <Button
              variant="success"
              onClick={showCreateModal}
              data-testid="createAgendaCategoryBtn"
              className={styles.createAgendaCategoryButton}
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
}

export default organizationAgendaCategory;
