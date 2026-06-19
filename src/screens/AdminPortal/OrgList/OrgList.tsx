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
import { BEARER_PREFIX } from 'Constant/common';
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
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';
import { Link } from 'react-router';
// OrganizationCard replaced by inline org-card markup matching design prototype
import EmptyState from 'shared-components/EmptyState/EmptyState';
import Group from '@mui/icons-material/Group';
import Search from '@mui/icons-material/Search';
/* Alert replaced with plain div for Talawa design */
import RBButton from 'shared-components/Button';
import { CRUDModalTemplate } from 'shared-components/CRUDModalTemplate/CRUDModalTemplate';
import { useModalState } from 'shared-components/CRUDModalTemplate/hooks/useModalState';

interface InterfaceOrgFormState {
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
 * Generates a deterministic gradient color pair for an org avatar based on the org name.
 */
const AVATAR_GRADIENT_PALETTE = [
  ['#3ecf8e', '#15803d'],
  ['#3b82f6', '#2563eb'],
  ['#f97316', '#ea580c'],
  ['#a855f7', '#7c3aed'],
  ['#ef4444', '#dc2626'],
  ['#eab308', '#ca8a04'],
  ['#06b6d4', '#0891b2'],
  ['#ec4899', '#db2777'],
  ['#14b8a6', '#0d9488'],
  ['#8b5cf6', '#6d28d9'],
];

function getAvatarGradient(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const idx =
    ((hash % AVATAR_GRADIENT_PALETTE.length) + AVATAR_GRADIENT_PALETTE.length) %
    AVATAR_GRADIENT_PALETTE.length;
  const [c1, c2] = AVATAR_GRADIENT_PALETTE[idx];
  return `linear-gradient(135deg, ${c1}, ${c2})`;
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

  const [formState, setFormState] = useState<InterfaceOrgFormState>({
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
    ? { headers: { authorization: BEARER_PREFIX + token } }
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

  const createOrg = async (e: React.FormEvent<HTMLFormElement>) => {
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

  const pluginBtnClass = 'btn  btn-primary ' + styles.pluginStoreBtn;
  const storeUrl = `orgstore/id=${dialogRedirectOrgId}`;

  return (
    <div className={styles.orgListContainer}>
      {/* Email Verification Warning Banner */}
      {showEmailWarning && (
        <div
          className={styles.warningAlert}
          role="alert"
          data-testid="email-verification-warning"
          aria-live="polite"
        >
          <div className={styles.notVerifiedContainer}>
            <div>
              <strong>{tLogin('emailNotVerified')}</strong>
            </div>
            <div className={styles.warningActions}>
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
              <button
                type="button"
                className={styles.warningDismiss}
                onClick={handleDismissWarning}
                aria-label="Dismiss"
              >
                &times;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">{t('title')}</h1>
          <p className="page-subtitle">{t('managingYourOrganizations')}</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="search-bar">
          <span className="search-icon">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="text"
            placeholder={t('searchOrganizations')}
            aria-label={t('searchOrganizations')}
            value={typedValue}
            onChange={(e) => handleChangeFilter(e.target.value)}
            data-testid="searchInput"
          />
        </div>
        {role === 'administrator' && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={open}
            data-testid="createOrganizationBtn"
          >
            + {t('createOrganization')}
          </button>
        )}
      </div>

      {/* Organization Content */}
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
          {/* Loading Skeletons */}
          {isLoading && (
            <div className={styles.orgGrid}>
              {[...Array(perPageResult)].map((_, index) => (
                <div key={index} className={styles.orgCardSkeleton}>
                  <div className={styles.skeletonHeader}>
                    <div
                      className={`${styles.skeletonAvatar} ${styles.shimmerText}`}
                    />
                    <div
                      className={`${styles.skeletonName} ${styles.shimmerText}`}
                    />
                  </div>
                  <div
                    className={`${styles.skeletonDesc} ${styles.shimmerText}`}
                  />
                  <div className={styles.skeletonStats}>
                    <div
                      className={`${styles.skeletonStat} ${styles.shimmerText}`}
                    />
                    <div
                      className={`${styles.skeletonStat} ${styles.shimmerText}`}
                    />
                    <div
                      className={`${styles.skeletonStat} ${styles.shimmerText}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Organization Grid */}
          <div className={styles.orgGrid}>
            {(rowsPerPage > 0
              ? sortedOrganizations.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage,
                )
              : sortedOrganizations
            )?.map((item: InterfaceOrgInfoTypePG) => {
              const initials = item.name
                .split(/\s+/)
                .map((w) => w[0])
                .join('')
                .slice(0, 2)
                .toUpperCase();
              const avatarGradient = getAvatarGradient(item.name);
              const createdDate = new Date(item.createdAt).toLocaleDateString(
                'en-US',
                { month: 'short', year: 'numeric' },
              );
              const avatarUrl = item.avatarURL || null;
              return (
                <Link
                  key={item.id}
                  to={`/admin/orgdash/${item.id}`}
                  className={styles.orgCard}
                >
                  <div className={styles.orgCardHeader}>
                    <div
                      className={styles.orgCardAvatar}
                      style={{ background: avatarGradient }}
                    >
                      {avatarUrl ? (
                        <img src={avatarUrl} alt={initials} crossOrigin="anonymous" className={styles.orgCardAvatar}/>
                      ) : (
                        initials
                      )}
                    </div>
                    <div className={styles.orgCardName}>{item.name}</div>
                  </div>
                  <div className={styles.orgCardDesc}>
                    {item.description || ''}
                  </div>
                  <div className={styles.orgCardStats}>
                    <div className={styles.orgCardStat}>
                      <strong>{item.membersCount ?? 0}</strong> Members
                    </div>
                    <div className={styles.orgCardStat}>
                      <strong>{item.adminsCount ?? 0}</strong> Admins
                    </div>
                    <div className={styles.orgCardStat}>
                      Created {createdDate}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Pagination */}
          <div className={styles.paginationWrapper}>
            <PaginationList
              count={sortedOrganizations.length || 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </div>
        </>
      )}

      {/* Create Organization Modal */}
      <OrganizationModal
        showModal={isOpen}
        toggleModal={close}
        formState={formState}
        setFormState={setFormState}
        createOrg={createOrg}
      />

      {/* Plugin Notification Modal after Org is Created */}
      <CRUDModalTemplate
        open={dialogModalisOpen}
        onClose={toggleDialogModal}
        title={t('manageFeatures')}
        className={styles.modalHeader}
        data-testid="pluginNotificationModal"
        showFooter={false}
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
      </CRUDModalTemplate>
    </div>
  );
}
export default OrgList;
