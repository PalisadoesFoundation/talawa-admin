/**
 * The `orgList` component is responsible for rendering a list of organizations
 * and providing functionality for searching, sorting, and creating new organizations.
 * It also includes modals for creating organizations and managing features after creation.
 *
 * @component
 * @returns {JSX.Element} The rendered organization list component.
 *
 * @remarks
 * - Utilizes GraphQL queries and mutations for fetching and managing organization data.
 * - Includes search and sorting functionality for better user experience.
 * - Displays loading states and handles errors gracefully.
 *
 * @dependencies
 * - `useQuery` and `useMutation` from `@apollo/client` for GraphQL operations.
 * - `useTranslation` from `react-i18next` for localization.
 * - `useLocalStorage` for accessing local storage data.
 * - `OrgListCard`, `SortingButton`, `SearchBar`, and `OrganizationModal` for UI components.
 * - `react-toastify` for notifications.
 * - `react-bootstrap` and `@mui/material` for modal and button components.
 *
 * @state
 * - `dialogModalisOpen` - Controls the visibility of the plugin notification modal.
 * - `dialogRedirectOrgId` - Stores the ID of the organization to redirect after creation.
 * - `isLoading` - Indicates whether the organization data is loading.
 * - `sortingState` - Manages the sorting option and its label.
 * - `searchByName` - Stores the search query for filtering organizations.
 * - `showModal` - Controls the visibility of the organization creation modal.
 * - `formState` - Manages the state of the organization creation form.
 *
 * @methods
 * - `openDialogModal(redirectOrgId: string): void` - Opens the plugin notification modal.
 * - `closeDialogModal(): void` - Closes the plugin notification modal.
 * - `toggleDialogModal(): void` - Toggles the plugin notification modal visibility.
 * - `createOrg(e: ChangeEvent<HTMLFormElement>): Promise<void>` - Handles organization creation.
 * - `handleSearch(value: string): void` - Filters organizations based on the search query.
 * - `handleSortChange(value: string): void` - Updates sorting state and refetches organizations.
 *
 * @errorHandling
 * - Handles errors from GraphQL queries and mutations using `errorHandler`.
 * - Clears local storage and redirects to the home page on critical errors.
 *
 * @modals
 * - `OrganizationModal` - For creating new organizations.
 * - `Modal` - For managing features after organization creation.
 */
import React, { useEffect, useState, useMemo } from 'react';
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
import useDebounce from 'utils/useDebounce';
import styles from 'style/app-fixed.module.css';
import SortingButton from 'subComponents/SortingButton';
import { Button } from '@mui/material';
import OrganizationModal from './modal/OrganizationModal';
import { toast } from 'react-toastify';
import { Link } from 'react-router';
import { Modal } from 'react-bootstrap';
import type { ChangeEvent } from 'react';
import NotificationIcon from 'components/NotificationIcon/NotificationIcon';
import OrganizationCard from 'shared-components/OrganizationCard/OrganizationCard';
import SearchBar from 'shared-components/SearchBar/SearchBar';

const { getItem } = useLocalStorage();

// useDebounce moved to src/utils/useDebounce

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

  document.title = t('title');

  const perPageResult = 8;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const [typedValue, setTypedValue] = useState('');
  const [filterName, setFilterName] = useState('');
  const [sortingState, setSortingState] = useState({
    option: '',
    selectedOption: t('sort'),
  });

  // const [hasMore, sethasMore] = useState(true);
  // const [isLoadingMore, setIsLoadingMore] = useState(false);
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

  const {
    data: userData,
  }: {
    data: InterfaceCurrentUserTypePG | undefined;
    loading: boolean;
    error?: Error | undefined;
  } = useQuery(CURRENT_USER, {
    variables: { userId: getItem('id') },
    context: { headers: { authorization: `Bearer ${getItem('token')}` } },
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

  const createOrg = async (e: ChangeEvent<HTMLFormElement>): Promise<void> => {
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

    const addressLine1 = _addressLine1.trim();
    const addressLine2 = _addressLine2.trim();
    const avatar = _avatar;
    const city = _city.trim();
    const countryCode = _countryCode.trim();
    const description = _description.trim();
    const name = _name.trim();
    const postalCode = _postalCode.trim();
    const state = _state.trim();

    try {
      const { data } = await create({
        variables: {
          addressLine1: addressLine1,
          addressLine2: addressLine2,
          avatar: avatar,
          city: city,
          countryCode: countryCode,
          description: description,
          name: name,
          postalCode: postalCode,
          state: state,
        },
      });

      await createMembership({
        variables: {
          memberId: userData?.currentUser.id,
          organizationId: data?.createOrganization.id,
          role: 'administrator',
        },
      });

      //     toggleModal;
      if (data) {
        toast.success('Congratulation the Organization is created');
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

  const doSearch = (value: string): void => {
    setFilterName(value);
    refetchOrgs({ filter: value });
  };

  const { debouncedCallback: debouncedSearch } = useDebounce(doSearch, 300);

  const handleChangeFilter = (val: string) => {
    setTypedValue(val);
    setSearchByName(val);
    debouncedSearch(val);
  };

  const handleSortChange = (value: string | number): void => {
    setSortingState({
      option: String(value),
      selectedOption: t(String(value)),
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

  return (
    <div style={{ paddingLeft: '40px', paddingRight: '30px' }}>
      {/* Buttons Container */}
      <div className={styles.btnsContainerSearchBar}>
        <div className={styles.searchWrapper}>
          <div className={styles.inputOrgList}>
            <SearchBar
              placeholder={t('searchOrganizations')}
              value={typedValue}
              onChange={handleChangeFilter}
              onSearch={doSearch}
              className={styles.maxWidth}
              inputTestId="searchInput"
              buttonTestId="searchBtn"
              buttonAriaLabel={t('search')}
            />
          </div>

          <div className={styles.btnsBlock}>
            <NotificationIcon />

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div className={styles.btnsBlockSearchBar}>
                <SortingButton
                  title={t('sortOrganizations')}
                  sortingOptions={[
                    { label: t('Latest'), value: 'Latest' },
                    { label: t('Earliest'), value: 'Earliest' },
                  ]}
                  selectedOption={sortingState.selectedOption}
                  onSortChange={handleSortChange}
                  dataTestIdPrefix="sortOrgs"
                  dropdownTestId="sort"
                />
              </div>

              {role === 'administrator' && (
                <div className={styles.btnsBlock}>
                  <Button
                    className={`${styles.dropdown} ${styles.createorgdropdown}`}
                    onClick={toggleModal}
                    data-testid="createOrganizationBtn"
                  >
                    <i className="fa fa-plus me-2" />
                    {t('createOrganization')}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Text Infos for list */}

      {!isLoading &&
      (!sortedOrganizations || sortedOrganizations.length === 0) &&
      searchByName.length === 0 &&
      (!userData || adminFor.length === 0) ? (
        <div className={styles.notFound}>
          <h3 className="m-0">{t('noOrgErrorTitle')}</h3>
          <h6 className="text-secondary">{t('noOrgErrorDescription')}</h6>
        </div>
      ) : !isLoading &&
        sortedOrganizations?.length == 0 &&
        searchByName.length > 0 ? (
        <div className={styles.notFound} data-testid="noResultFound">
          <h4 className="m-0">
            {tCommon('noResultsFoundFor')} &quot;{searchByName}&quot;
          </h4>
        </div>
      ) : (
        <>
          {isLoading && (
            <>
              {[...Array(perPageResult)].map((_, index) => (
                <div key={index} className={styles.itemCardOrgList}>
                  <div className={styles.loadingWrapper}>
                    <div className={styles.innerContainer}>
                      <div className={`${styles.orgImgContainer} shimmer`} />

                      <div className={styles.content}>
                        <h5 className="shimmer" title="Org name"></h5>
                        <h6 className="shimmer" title="Location"></h6>
                        <h6 className="shimmer" title="Admins"></h6>
                        <h6 className="shimmer" title="Members"></h6>
                      </div>
                    </div>
                    <div className={`shimmer ${styles.button}`} />
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
          <table style={{ width: '100%' }}>
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
        userData={userData}
      />
      {/* Plugin Notification Modal after Org is Created */}
      <Modal show={dialogModalisOpen} onHide={toggleDialogModal}>
        <Modal.Header
          className={styles.modalHeader}
          closeButton
          data-testid="pluginNotificationHeader"
        >
          <Modal.Title className="text-white">
            {t('manageFeatures')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <section id={styles.grid_wrapper}>
            <div>
              <h4 className={styles.titlemodaldialog}>
                {t('manageFeaturesInfo')}
              </h4>

              <div className={styles.pluginStoreBtnContainer}>
                <Link
                  className={`btn  btn-primary ${styles.pluginStoreBtn}`}
                  data-testid="goToStore"
                  to={`orgstore/id=${dialogRedirectOrgId}`}
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
        </Modal.Body>
      </Modal>
    </div>
  );
}
export default orgList;
