import React, { useEffect, useState, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  CREATE_ORGANIZATION_MUTATION_PG,
  CREATE_ORGANIZATION_MEMBERSHIP_MUTATION_PG,
  RESEND_VERIFICATION_EMAIL_MUTATION,
} from 'GraphQl/Mutations/mutations';
import {
  CURRENT_USER,
  ORGANIZATION_FILTER_LIST,
} from 'GraphQl/Queries/Queries';

import PaginationList from 'shared-components/PaginationList/PaginationList';
import { useTranslation } from 'react-i18next';
import { errorHandler } from 'utils/errorHandler';
import type { InterfaceOrgInfoTypePG } from 'utils/interfaces';

interface InterfaceCurrentUserType {
  user: {
    id: string;
    name: string;
    role: string;
    emailAddress: string;
    isEmailAddressVerified: boolean;
  };
}
import {
  getItem as getItemStatic,
  setItem as setItemStatic,
  removeItem as removeItemStatic,
  PREFIX,
} from 'utils/useLocalstorage';
import styles from './OrgList.module.css';

import OrganizationModal from './modal/OrganizationModal';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { Link } from 'react-router';
import type { ChangeEvent } from 'react';
import OrganizationCard from 'shared-components/OrganizationCard/OrganizationCard';
import EmptyState from 'shared-components/EmptyState/EmptyState';
import { Group, Search } from '@mui/icons-material';
import SearchFilterBar from 'shared-components/SearchFilterBar/SearchFilterBar';
import { Alert } from 'react-bootstrap';
import RBButton from 'shared-components/Button';
import BaseModal from 'shared-components/BaseModal/BaseModal';
import { useModalState } from 'shared-components/CRUDModalTemplate';

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

/**
 * OrgList component displays a list of organizations and allows administrators to create new ones.
 * It also handles the email verification warning banner.
 *
 * @returns The rendered OrgList component.
 */
function OrgList(): JSX.Element {
  const { getItem, setItem, removeItem } = useMemo(
    () => ({
      getItem: function <T>(key: string) {
        return getItemStatic<T>(PREFIX, key);
      },
      setItem: (key: string, value: unknown) =>
        setItemStatic(PREFIX, key, value),
      removeItem: (key: string) => removeItemStatic(PREFIX, key),
    }),
    [],
  );
  const { t } = useTranslation('translation', { keyPrefix: 'orgList' });
  const { t: tCommon } = useTranslation('common');
  const { t: tLogin } = useTranslation('translation', {
    keyPrefix: 'loginPage',
  });
  const [dialogModalisOpen, setdialogModalIsOpen] = useState(false);
  const [dialogRedirectOrgId, setDialogRedirectOrgId] = useState('<ORG_ID>');

  // Email verification warning state
  const [showEmailWarning, setShowEmailWarning] = useState(false);

  const [resendVerificationEmail, { loading: resendLoading }] = useMutation(
    RESEND_VERIFICATION_EMAIL_MUTATION,
  );

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

  const handleDismissWarning = (): void => {
    setShowEmailWarning(false);
    removeItem('emailNotVerified');
    removeItem('unverifiedEmail');
  };

  const handleResendVerification = async (): Promise<void> => {
    try {
      const { data } = await resendVerificationEmail();

      if (data?.sendVerificationEmail?.success) {
        NotificationToast.success(tLogin('emailResent'));
      } else {
        NotificationToast.error(
          data?.sendVerificationEmail?.message || tLogin('resendFailed'),
        );
      }
    } catch (error: unknown) {
      errorHandler(tLogin, error);
    }
  };

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
  const { isOpen, open, close } = useModalState();

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

  const [create] = useMutation(CREATE_ORGANIZATION_MUTATION_PG);
  const [createMembership] = useMutation(
    CREATE_ORGANIZATION_MEMBERSHIP_MUTATION_PG,
  );
  const token = getItem('token');
  const context = token
    ? { headers: { authorization: 'Bearer ' + token } }
    : { headers: {} };
  // Fetch current user status (consolidated query with network-only for fresh data)
  const {
    data: userData,
  }: {
    data: InterfaceCurrentUserType | undefined;
    loading: boolean;
    error?: Error | undefined;
  } = useQuery(CURRENT_USER, {
    fetchPolicy: 'network-only',
    context,
  });

  // Check for email verification status on component mount and sync with backend
  useEffect(() => {
    // Priority: API data > LocalStorage
    if (userData?.user) {
      if (userData.user.isEmailAddressVerified) {
        setShowEmailWarning(false);
        // Clean up legacy flags
        removeItem('emailNotVerified');
        removeItem('unverifiedEmail');
      } else {
        setShowEmailWarning(true);
        // Ensure flags are consistent
        setItem('emailNotVerified', 'true');
        if (userData.user.emailAddress) {
          setItem('unverifiedEmail', userData.user.emailAddress);
        }
      }
    } else {
      // Fallback to local storage if API data not yet available
      const emailNotVerified = getItem('emailNotVerified');
      const email = getItem('unverifiedEmail');
      if (emailNotVerified === 'true' && typeof email === 'string') {
        setShowEmailWarning(true);
      }
    }
  }, [userData, getItem, setItem, removeItem]);

  const {
    data: allOrganizationsData,
    loading: loadingAll,
    refetch: refetchOrgs,
  } = useQuery(ORGANIZATION_FILTER_LIST, {
    variables: { filter: filterName },
    fetchPolicy: 'cache-and-network',
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
          memberId: userData?.user.id,
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
        close();
      }
    } catch (error: unknown) {
      errorHandler(t, error);
    }
  };

  /**
   * Note: The explicit refetchOrgs(\{filter: val \}) call is intentional.
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
      {/* Email Verification Warning Banner */}
      {showEmailWarning && (
        <Alert
          variant="warning"
          dismissible
          onClose={handleDismissWarning}
          className="mb-3"
          data-testid="email-verification-warning"
          aria-live="polite"
        >
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <strong>{tLogin('emailNotVerified')}</strong>
            </div>
            <RBButton
              variant="outline-primary"
              size="sm"
              onClick={handleResendVerification}
              disabled={resendLoading}
              data-testid="resend-verification-btn"
            >
              {resendLoading
                ? tCommon('loading')
                : tLogin('resendVerification')}
            </RBButton>
          </div>
        </Alert>
      )}

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
              {role === 'administrator' && (
                <RBButton
                  className={`${styles.dropdown} ${styles.createorgdropdown}`}
                  onClick={open}
                  data-testid="createOrganizationBtn"
                >
                  <i className="fa fa-plus me-2" />
                  {t('createOrganization')}
                </RBButton>
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
        showModal={isOpen}
        toggleModal={close}
        formState={formState}
        setFormState={setFormState}
        createOrg={createOrg}
        t={t}
        tCommon={tCommon}
      />
      {/* Plugin Notification Modal after Org is Created */}
      <BaseModal
        show={dialogModalisOpen}
        onHide={toggleDialogModal}
        title={t('manageFeatures')}
        headerClassName={styles.modalHeader}
        headerTestId="pluginNotificationHeader"
        dataTestId="pluginNotificationModal"
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
              <RBButton
                type="submit"
                className={styles.enableEverythingBtn}
                onClick={closeDialogModal}
                value="invite"
                data-testid="enableEverythingForm"
              >
                {t('enableEverything')}
              </RBButton>
            </div>
          </div>
        </section>
      </BaseModal>
    </div>
  );
}
export default OrgList;
