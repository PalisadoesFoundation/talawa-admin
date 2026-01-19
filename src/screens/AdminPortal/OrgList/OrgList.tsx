/**
 * The orgList component renders a list of organizations with search, sort, and
 * creation flows.
 *
 * @remarks
 * Features:
 * - Fetches organization data via GraphQL queries and mutations.
 * - Supports searching and sorting, with loading and error states.
 * - Provides modals for creating organizations and managing features.
 *
 * State:
 * - dialogModalisOpen: Controls the visibility of the plugin notification modal.
 * - dialogRedirectOrgId: Stores the ID of the organization to redirect after creation.
 * - isLoading: Indicates whether the organization data is loading.
 * - sortingState: Manages the sorting option and its label.
 * - searchByName: Stores the search query for filtering organizations.
 * - showModal: Controls the visibility of the organization creation modal.
 * - formState: Manages the state of the organization creation form.
 *
 * Methods:
 * - openDialogModal(redirectOrgId): Opens the plugin notification modal.
 * - closeDialogModal(): Closes the plugin notification modal.
 * - toggleDialogModal(): Toggles the plugin notification modal visibility.
 * - createOrg(e): Handles organization creation.
 * - handleChangeFilter(value): Filters organizations based on the search query.
 * - handleSortChange(value): Updates sorting state and refetches organizations.
 *
 * Error handling:
 * - Uses `errorHandler` for GraphQL and network errors.
 * - Clears local storage and redirects to the home page on critical errors.
 *
 * Dependencies:
 * - Apollo Client for GraphQL operations.
 * - react-i18next for localization.
 * - useLocalStorage for local storage data.
 * - NotificationToast and shared UI components.
 * - Material UI for buttons and icons.
 *
 * @returns The rendered organization list component.
 */
import React, { type ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { Group, Search } from '@mui/icons-material';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  CREATE_ORGANIZATION_MUTATION_PG,
  CREATE_ORGANIZATION_MEMBERSHIP_MUTATION_PG,
} from 'GraphQl/Mutations/mutations';
import {
  CURRENT_USER,
  ORGANIZATION_FILTER_LIST,
} from 'GraphQl/Queries/Queries';
import PaginationList from 'components/Pagination/PaginationList/PaginationList';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import NotificationIcon from 'components/NotificationIcon/NotificationIcon';
import BaseModal from 'shared-components/BaseModal/BaseModal';
import Button from 'shared-components/Button';
import EmptyState from 'shared-components/EmptyState/EmptyState';
import OrganizationCard from 'shared-components/OrganizationCard/OrganizationCard';
import SearchFilterBar from 'shared-components/SearchFilterBar/SearchFilterBar';
import { errorHandler } from 'utils/errorHandler';
import type {
  InterfaceCurrentUserTypePG,
  InterfaceOrgInfoTypePG,
} from 'utils/interfaces';
import useLocalStorage from 'utils/useLocalstorage';
import OrganizationModal from './modal/OrganizationModal';
import styles from './OrgList.module.css';

const { getItem } = useLocalStorage();

interface InterfaceFormStateType {
  addressLine1: string;
  addressLine2: string;
  avatar: string | null;
  city: string;
  countryCode: string;
  description: string;
  name: string;
  postalCode: string;
  state: string;
}

function orgList(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'orgList' });
  const { t: tCommon } = useTranslation('common');
  const [dialogModalisOpen, setdialogModalIsOpen] = useState(false);
  const [dialogRedirectOrgId, setDialogRedirectOrgId] = useState('<ORG_ID>');

  function openDialogModal(redirectOrgId: string): void {
    setDialogRedirectOrgId(redirectOrgId);
    setdialogModalIsOpen(true);
  }

  // localStorage helper used elsewhere in this component
  const role = getItem('role');
  const adminFor:
    | string
    | { _id: string; name: string; image: string | null }[] =
    getItem('AdminFor') || [];
  function closeDialogModal(): void {
    setdialogModalIsOpen(false);
  }

  const toggleDialogModal = (): void =>
    setdialogModalIsOpen(!dialogModalisOpen);

  useEffect(() => {
    document.title = t('title');
  }, [t]);

  const perPageResult = 8;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const [typedValue, setTypedValue] = useState('');
  const [filterName, setFilterName] = useState('');
  const [sortingState, setSortingState] = useState({
    option: 'Latest',
    selectedOption: 'Latest',
  });

  const [searchByName, setSearchByName] = useState('');
  const [showModal, setShowModal] = useState(false);

  const [formState, setFormState] = useState<InterfaceFormStateType>({
    addressLine1: '',
    addressLine2: '',
    avatar: null,
    city: '',
    countryCode: '',
    description: '',
    name: '',
    postalCode: '',
    state: '',
  });

  const toggleModal = (): void => setShowModal(!showModal);
  const [create] = useMutation(CREATE_ORGANIZATION_MUTATION_PG);
  const [createMembership] = useMutation(
    CREATE_ORGANIZATION_MEMBERSHIP_MUTATION_PG,
  );
  const token = getItem('token');
  const context = token
    ? { headers: { authorization: 'Bearer ' + token } }
    : { headers: {} };
  const {
    data: userData,
  }: {
    data: InterfaceCurrentUserTypePG | undefined;
    loading: boolean;
    error?: Error | undefined;
  } = useQuery(CURRENT_USER, {
    variables: { userId: getItem('id') },
    context,
  });

  const {
    data: allOrganizationsData,
    loading: loadingAll,
    refetch: refetchOrgs,
  } = useQuery(ORGANIZATION_FILTER_LIST, {
    variables: { filter: filterName },
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
  });

  const orgsData = allOrganizationsData?.organizations;

  // Sort and filter organizations based on sorting state
  const sortedOrganizations = useMemo(() => {
    if (!orgsData) return [];

    let result = [...orgsData];

    // Apply search filter
    if (searchByName) {
      result = result.filter((org: InterfaceOrgInfoTypePG) =>
        org.name.toLowerCase().includes(searchByName.toLowerCase()),
      );
    }

    // Apply sorting
    if (
      sortingState.option === 'Latest' ||
      sortingState.option === 'Earliest'
    ) {
      result.sort((a: InterfaceOrgInfoTypePG, b: InterfaceOrgInfoTypePG) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortingState.option === 'Latest' ? dateB - dateA : dateA - dateB;
      });
    }

    return result;
  }, [orgsData, searchByName, sortingState.option]);

  useEffect(() => {
    setIsLoading(loadingAll);
  }, [loadingAll]);

  const createOrg = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    const {
      addressLine1: _addressLine1,
      addressLine2: _addressLine2,
      avatar: _avatar,
      city: _city,
      countryCode: _countryCode,
      description: _description,
      name: _name,
      postalCode: _postalCode,
      state: _state,
    } = formState;

    const addressLine1 = _addressLine1.trim() || undefined;
    const addressLine2 = _addressLine2.trim() || undefined;
    const avatar = _avatar;
    const city = _city.trim() || undefined;
    const countryCode = _countryCode.trim() || undefined;
    const description = _description.trim() || undefined;
    const name = _name.trim();
    const postalCode = _postalCode.trim() || undefined;
    const state = _state.trim() || undefined;

    try {
      const { data } = await create({
        variables: {
          addressLine1,
          addressLine2,
          avatar,
          city,
          countryCode,
          description,
          name,
          postalCode,
          state,
        },
      });

      await createMembership({
        variables: {
          memberId: userData?.currentUser.id,
          organizationId: data?.createOrganization.id,
          role: 'administrator',
        },
      });

      if (data) {
        NotificationToast.success(t('congratulationOrgCreated'));
        refetchOrgs();
        openDialogModal(data.createOrganization.id);
        setFormState({
          addressLine1: '',
          addressLine2: '',
          avatar: null,
          city: '',
          countryCode: '',
          description: '',
          name: '',
          postalCode: '',
          state: '',
        });
        toggleModal();
      }
    } catch (error: unknown) {
      errorHandler(t, error);
    }
  };

  /**
   * Note: The explicit refetchOrgs call with a filter argument is intentional.
   * While Apollo Client auto-refetches when filterName changes, the explicit
   * call ensures immediate network request execution and avoids timing issues
   * from React's batched state updates. This pattern is used consistently
   * elsewhere (e.g., Organizations.tsx) to prevent UI state race conditions.
   */
  const handleChangeFilter = (val: string) => {
    setTypedValue(val);
    setSearchByName(val);
    setFilterName(val);
    refetchOrgs({ filter: val });
  };

  const handleSortChange = (value: string | number): void => {
    const option = String(value);
    setSortingState({
      option,
      selectedOption: option,
    });
  };

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ): void => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    const newVal = event.target.value;
    setRowsPerPage(parseInt(newVal, 10));
    setPage(0);
  };

  const shimmerClass = styles.orgImgContainer + ' shimmer';
  const shimmerBtnClass = 'shimmer ' + styles.button;
  const pluginBtnClass = 'btn  btn-primary ' + styles.pluginStoreBtn;
  const storeUrl = `orgstore/id=${dialogRedirectOrgId}`;

  return (
    <div className={styles.orgListContainer}>
      {/* Buttons Container */}
      <div className={styles.calendar__header}>
        <SearchFilterBar
          hasDropdowns={true}
          searchPlaceholder={t('searchOrganizations')}
          searchValue={typedValue}
          onSearchChange={handleChangeFilter}
          searchInputTestId="searchInput"
          searchButtonTestId="searchBtn"
          dropdowns={[
            {
              id: 'org-list-dropdown',
              label: tCommon('sort'),
              type: 'sort',
              options: [
                { label: t('Latest'), value: 'Latest' },
                { label: t('Earliest'), value: 'Earliest' },
              ],
              selectedOption: sortingState.selectedOption,
              onOptionChange: (value) => handleSortChange(value.toString()),
              dataTestIdPrefix: 'sortOrgs',
              dropdownTestId: 'sort',
            },
          ]}
          additionalButtons={
            <>
              <NotificationIcon />
              {role === 'administrator' && (
                <Button
                  className={`${styles.dropdown} ${styles.createorgdropdown}`}
                  onClick={toggleModal}
                  data-testid="createOrganizationBtn"
                >
                  <i className="fa fa-plus me-2" />
                  {t('createOrganization')}
                </Button>
              )}
            </>
          }
        />
      </div>

      {/* Text Infos for list */}

      {!isLoading &&
      (!sortedOrganizations || sortedOrganizations.length === 0) &&
      searchByName.length === 0 &&
      (!userData || adminFor.length === 0) ? (
        <EmptyState
          icon={<Group />}
          message={t('noOrgErrorTitle')}
          description={t('noOrgErrorDescription')}
          dataTestId="orglist-no-orgs-empty"
        />
      ) : !isLoading &&
        sortedOrganizations?.length === 0 &&
        searchByName.length > 0 ? (
        <EmptyState
          icon={<Search />}
          message={tCommon('noResultsFoundFor', {
            query: searchByName,
          })}
          description={tCommon('tryAdjustingFilters')}
          dataTestId="orglist-search-empty"
        />
      ) : (
        <>
          {isLoading && (
            <>
              {[...Array(perPageResult)].map((_, index) => (
                <div key={index} className={styles.itemCardOrgList}>
                  <div className={styles.loadingWrapper}>
                    <div className={styles.innerContainer}>
                      <div className={shimmerClass} />

                      <div className={styles.content}>
                        <h5 className="shimmer" title={t('orgName')}></h5>
                        <h6 className="shimmer" title={t('location')}></h6>
                        <h6 className="shimmer" title={t('admins')}></h6>
                        <h6 className="shimmer" title={t('members')}></h6>
                      </div>
                    </div>
                    <div className={shimmerBtnClass} />
                  </div>
                </div>
              ))}
            </>
          )}
          <div className={`${styles.listBoxOrgList}`}>
            {(rowsPerPage > 0
              ? sortedOrganizations.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage,
                )
              : sortedOrganizations
            )?.map((item: InterfaceOrgInfoTypePG) => {
              return (
                <div key={item.id} className={styles.itemCardOrgList}>
                  <OrganizationCard data={{ ...item, role: 'admin' }} />
                </div>
              );
            })}
          </div>
          {/* pagination */}
          <table className={styles.table_fullWidth}>
            <tbody>
              <tr>
                <PaginationList
                  count={sortedOrganizations.length || 0}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </tr>
            </tbody>
          </table>
        </>
      )}
      {/* Create Organization Modal */}
      <OrganizationModal
        showModal={showModal}
        toggleModal={toggleModal}
        formState={formState}
        setFormState={setFormState}
        createOrg={createOrg}
        t={t}
        tCommon={tCommon}
        userData={userData}
      />
      {/* Plugin Notification Modal after Org is Created */}
      <BaseModal
        show={dialogModalisOpen}
        onHide={toggleDialogModal}
        title={t('manageFeatures')}
        headerClassName={styles.modalHeader}
        dataTestId="pluginNotificationHeader"
        centered={false}
        backdrop={true}
      >
        <section id={styles.grid_wrapper}>
          <div>
            <h4 className={styles.titlemodaldialog}>
              {t('manageFeaturesInfo')}
            </h4>
            <div className={styles.pluginStoreBtnContainer}>
              <Link
                className={pluginBtnClass}
                data-testid="goToStore"
                to={storeUrl}
              >
                {t('goToStore')}
              </Link>
              <Button
                type="submit"
                className={styles.enableEverythingBtn}
                onClick={closeDialogModal}
                value="invite"
                data-testid="enableEverythingForm"
              >
                {t('enableEverything')}
              </Button>
            </div>
          </div>
        </section>
      </BaseModal>
    </div>
  );
}
export default orgList;
