/**
 * The `orgList` component is responsible for rendering a list of organizations
 * and providing functionality for searching, sorting, and creating new organizations.
 * It also includes modals for creating organizations and managing features after creation.
 *
 * @returns The rendered organization list component.
 *
 * @remarks
 * - Utilizes GraphQL queries and mutations for fetching and managing organization data.
 * - Includes search and sorting functionality for better user experience.
 * - Displays loading states and handles errors gracefully.
 *
 * Dependencies:
 * - `useQuery` and `useMutation` from `@apollo/client` for GraphQL operations.
 * - `useTranslation` from `react-i18next` for localization.
 * - `useLocalStorage` for accessing local storage data.
 * - `OrgListCard`, `SortingButton`, `SearchBar`, and `OrganizationModal` for UI components.
 * - `NotificationToast` for notifications.
 * - `react-bootstrap` and `@mui/material` for modal and button components.
 *
 * State:
 * - `dialogModalisOpen` - Controls the visibility of the plugin notification modal.
 * - `dialogRedirectOrgId` - Stores the ID of the organization to redirect after creation.
 * - `isLoading` - Indicates whether the organization data is loading.
 * - `sortingState` - Manages the sorting option and its label.
 * - `searchByName` - Stores the search query for filtering organizations.
 * - `showModal` - Controls the visibility of the organization creation modal.
 * - `formState` - Manages the state of the organization creation form.
 *
 * Methods:
 * - `openDialogModal(redirectOrgId: string): void` - Opens the plugin notification modal.
 * - `closeDialogModal(): void` - Closes the plugin notification modal.
 * - `toggleDialogModal(): void` - Toggles the plugin notification modal visibility.
 * - `createOrg(e: ChangeEvent<HTMLFormElement>): Promise<void>` - Handles organization creation.
 * - `handleSearch(value: string): void` - Filters organizations based on the search query.
 * - `handleSortChange(value: string): void` - Updates sorting state and refetches organizations.
 *
 * ErrorHandling:
 * - Handles errors from GraphQL queries and mutations using `errorHandler`.
 * - Clears local storage and redirects to the home page on critical errors.
 *
 * Modals:
 * - `OrganizationModal` - For creating new organizations.
 * - `Modal` - For managing features after organization creation.
 */
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  CREATE_ORGANIZATION_MUTATION_PG,
  CREATE_ORGANIZATION_MEMBERSHIP_MUTATION_PG,
} from 'GraphQl/Mutations/mutations';
import {
  CURRENT_USER,
  ORGANIZATION_FILTER_LIST,
} from 'GraphQl/Queries/Queries';

import PaginationList from 'components/Pagination/PaginationList/PaginationList';
import { useTranslation } from 'react-i18next';
import { errorHandler } from 'utils/errorHandler';
import type {
  InterfaceCurrentUserTypePG,
  InterfaceOrgInfoTypePG,
} from 'utils/interfaces';
import useLocalStorage from 'utils/useLocalstorage';
import styles from 'style/app-fixed.module.css';
import { Button } from '@mui/material';
import OrganizationModal from './modal/OrganizationModal';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { Link } from 'react-router';
import BaseModal from 'shared-components/BaseModal/BaseModal';
import type { ChangeEvent } from 'react';
import NotificationIcon from 'components/NotificationIcon/NotificationIcon';
import OrganizationCard from 'shared-components/OrganizationCard/OrganizationCard';
import EmptyState from 'shared-components/EmptyState/EmptyState';
import style from './OrgList.module.css';
import { Group, Search } from '@mui/icons-material';
import SearchFilterBar from 'shared-components/SearchFilterBar/SearchFilterBar';

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
  const refetchDebounceRef = useRef<number | undefined>(undefined);

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

  useEffect(() => {
    // Cleanup debounce timer on unmount
    return () => {
      if (refetchDebounceRef.current) {
        window.clearTimeout(refetchDebounceRef.current);
      }
    };
  }, []);

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
   * Filters organizations by name and debounces the network refetch.
   * The explicit refetchOrgs({ filter: val }) call is debounced to prevent
   * network flooding on every keystroke. The 250ms delay provides immediate UX feedback
   * (via setTypedValue) while batching network requests. This pattern prevents jittery
   * UI behavior under latency while maintaining Apollo Client's auto-refetch benefits.
   */
  const handleChangeFilter = (val: string) => {
    setTypedValue(val);
    setSearchByName(val);
    setFilterName(val);

    // Debounce the refetch to avoid flooding the network
    if (refetchDebounceRef.current) {
      window.clearTimeout(refetchDebounceRef.current);
    }
    refetchDebounceRef.current = window.setTimeout(() => {
      refetchOrgs({ filter: val });
    }, 250);
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
          <table className={style.table_fullWidth}>
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
      {/**
       * Renders the `OrganizationModal` component.
       *
       * @param showModal - A boolean indicating whether the modal should be displayed.
       * @param toggleModal - A function to toggle the visibility of the modal.
       * @param formState - The state of the form in the organization modal.
       * @param setFormState - A function to update the state of the form in the organization modal.
       * @param createOrg - A function to handle the submission of the organization creation form.
       * @param t - A translation function for localization.
       * @param userData - Information about the current user.
       * @returns JSX element representing the `OrganizationModal`.
       */}

      <OrganizationModal
        showModal={showModal}
        toggleModal={toggleModal}
        formState={formState}
        setFormState={setFormState}
        createOrg={createOrg}
        t={t}
        tCommon={tCommon}
      />
      {/* Plugin Notification Modal after Org is Created */}
      <BaseModal
        title={t('manageFeatures')}
        show={dialogModalisOpen}
        onHide={closeDialogModal}
        dataTestId="pluginNotificationModal"
        headerClassName={styles.modalHeader}
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
