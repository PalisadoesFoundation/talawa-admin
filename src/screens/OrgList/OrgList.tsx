import React, { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  CREATE_ORGANIZATION_MUTATION_PG,
  CREATE_ORGANIZATION_MEMBERSHIP_MUTATION_PG,
} from 'GraphQl/Mutations/mutations';
import { ALL_ORGANIZATIONS_PG, CURRENT_USER } from 'GraphQl/Queries/Queries';

import OrgListCard from 'components/OrgListCard/OrgListCard';
import { useTranslation } from 'react-i18next';
import { errorHandler } from 'utils/errorHandler';
import type {
  InterfaceCurrentUserTypePG,
  InterfaceOrgInfoTypePG,
} from 'utils/interfaces';
import useLocalStorage from 'utils/useLocalstorage';
import styles from 'style/app-fixed.module.css';
import SortingButton from 'subComponents/SortingButton';
import SearchBar from 'subComponents/SearchBar';
import { Button } from '@mui/material';
import OrganizationModal from './modal/OrganizationModal';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import type { ChangeEvent } from 'react';

/**
 * ## CSS Strategy Explanation:
 *
 * To ensure consistency across the application and reduce duplication, common styles
 * (such as button styles) have been moved to the global CSS file. Instead of using
 * component-specific classes (e.g., `.greenregbtnOrganizationFundCampaign`, `.greenregbtnPledge`), a single reusable
 * class (e.g., .addButton) is now applied.
 *
 * ### Benefits:
 * - **Reduces redundant CSS code.
 * - **Improves maintainability by centralizing common styles.
 * - **Ensures consistent styling across components.
 *
 * ### Global CSS Classes used:
 * - `.inputField`
 * - `.searchButton`
 * - `.btnsContainer`
 * - `.input`
 * - `.btnsBlock`
 * - `.dropdown`
 * - `.modalHeader`
 *
 * For more details on the reusable classes, refer to the global CSS file.
 */

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

  const { getItem } = useLocalStorage();
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
  const [isLoading, setIsLoading] = useState(true);
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
    error: errorUser,
  }: {
    data: InterfaceCurrentUserTypePG | undefined;
    loading: boolean;
    error?: Error | undefined;
  } = useQuery(CURRENT_USER, {
    variables: { userId: getItem('id') },
    context: { headers: { authorization: `Bearer ${getItem('token')}` } },
  });

  const {
    data: UsersOrgsData,
    loading,
    error: errorList,
    refetch: refetchOrgs,
  } = useQuery(ALL_ORGANIZATIONS_PG, { notifyOnNetworkStatusChange: true });

  const orgsData = UsersOrgsData?.organizations;

  // To clear the search field and form fields on unmount
  // useEffect(() => {
  //   return () => {
  //     setSearchByName('');
  //     setFormState({
  //       name: '',
  //       descrip: '',
  //       userRegistrationRequired: true,
  //       visible: false,
  //       address: {
  //         city: '',
  //         countryCode: '',
  //         dependentLocality: '',
  //         line1: '',
  //         line2: '',
  //         postalCode: '',
  //         sortingCode: '',
  //         state: '',
  //       },
  //       image: '',
  //     });
  //   };
  // }, []);

  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

  // const isAdminForCurrentOrg = (
  //   currentOrg: InterfaceOrgConnectionInfoType,
  // ): boolean => {
  //   if (adminFor.length === 1) {
  //     // If user is admin for one org only then check if that org is current org
  //     return adminFor[0]._id === currentOrg._id;
  //   } else {
  //     // If user is admin for more than one org then check if current org is present in adminFor array
  //     return (
  //       adminFor.some(
  //         (org: { _id: string; name: string; image: string | null }) =>
  //           org._id === currentOrg._id,
  //       ) ?? false
  //     );
  //   }
  // };

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

  if (errorList || errorUser) {
    errorHandler(t, errorList || errorUser);
    localStorage.clear();
    window.location.assign('/');
  }

  // const resetAllParams = (): void => {
  //   refetchOrgs({
  //     filter: '',
  //     first: perPageResult,
  //     skip: 0,
  //     orderBy:
  //       sortingState.option === 'Latest' ? 'createdAt_DESC' : 'createdAt_ASC',
  //   });
  //   sethasMore(true);
  // };

  const handleSearch = (value: string): void => {
    setSearchByName(value);
    // if (value == '') {
    //    resetAllParams();
    //   return;
    // }
    // refetchOrgs({
    //   filter: value,
    // });
  };

  // const loadMoreOrganizations = (): void => {
  //   if (!isLoadingMore || hasMore) setIsLoadingMore(true);
  //   fetchMore({
  //     variables: {
  //       skip: orgsData?.length || 0,
  //     },
  //     updateQuery: (prev, { fetchMoreResult }) => {
  //       setIsLoadingMore(false);

  //       if (!fetchMoreResult || !fetchMoreResult.user) {
  //         return prev; // Prevents breaking the UI
  //       }

  //       return {
  //         user: {
  //           organizationsWhereMember: {
  //             pageInfo: fetchMoreResult.user.organizationsWhereMember.pageInfo,
  //             edges: [
  //               ...(prev?.user.organizationsWhereMember.edges || []),
  //               ...fetchMoreResult.user.organizationsWhereMember.edges,
  //             ],
  //           },
  //         },
  //       };
  //     },
  //   });
  // };

  const handleSortChange = (value: string): void => {
    // Update the sorting state and refetch organizations based on the selected sorting option
    setSortingState({ option: value, selectedOption: t(value) });
    // const orderBy = value === 'Latest' ? 'createdAt_DESC' : 'createdAt_ASC';
    // refetchOrgs({
    //   first: perPageResult,
    //   skip: 0,
    //   filter: searchByName,
    //   orderBy,
    // });
  };

  return (
    <>
      {/* Buttons Container */}
      <div className={styles.btnsContainerSearchBar}>
        <SearchBar
          placeholder={tCommon('searchByName')}
          onSearch={handleSearch}
          inputTestId="searchByName"
          buttonTestId="searchBtn"
        />
        <div className={styles.btnsBlockSearchBar}>
          <SortingButton
            title="Sort organizations"
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
        <div className={styles.btnsBlock}>
          {role === 'administrator' && (
            <Button
              className={`${styles.dropdown} ${styles.createorgdropdown}`}
              onClick={toggleModal}
              data-testid="createOrganizationBtn"
            >
              <i className={'fa fa-plus me-2'} />
              {t('createOrganization')}
            </Button>
          )}
        </div>
      </div>

      {/* Text Infos for list */}

      {!isLoading &&
      (!orgsData || orgsData.length === 0) &&
      searchByName.length === 0 &&
      (!userData || adminFor.length === 0) ? (
        <div className={styles.notFound}>
          <h3 className="m-0">{t('noOrgErrorTitle')}</h3>
          <h6 className="text-secondary">{t('noOrgErrorDescription')}</h6>
        </div>
      ) : !isLoading && orgsData.length == 0 && searchByName.length > 0 ? (
        <div className={styles.notFound} data-testid="noResultFound">
          <h4 className="m-0">
            {tCommon('noResultsFoundFor')} &quot;{searchByName}&quot;
          </h4>
        </div>
      ) : (
        <>
          {/* Infinite scroll can be added when query supports infinitescroll*/}
          {/* <InfiniteScroll
            dataLength={orgsData?.length ?? 0}

            next={loadMoreOrganizations}
            loader={
              <>
                {[...Array(perPageResult)].map((_, index) => (
                  <div key={index} className={styles.itemCardOrgList}>
                    <div className={styles.loadingWrapper}>
                      <div className={styles.innerContainer}>
                        <div
                          className={`${styles.orgImgContainer} shimmer`}
                        ></div>
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
            }
            hasMore={hasMore}
            className={styles.listBoxOrgList}
            data-testid="organizations-list"
            endMessage={
              <div className={'w-100 text-center my-4'}>
                <h5 className="m-0 ">{tCommon('endOfResults')}</h5>
              </div>
            }
          >
            {orgsData?.map(
                  (item: any) => {
                    return (
                      <div
                        key={item.id}
                        className={styles.itemCardOrgList}
                      >
                        <OrgListCard data={item} />
                      </div>
                    );
                  },
                )}
          </InfiniteScroll> */}
          {isLoading && (
            <>
              {[...Array(perPageResult)].map((_, index) => (
                <div key={index} className={styles.itemCardOrgList}>
                  <div className={styles.loadingWrapper}>
                    <div className={styles.innerContainer}>
                      <div
                        className={`${styles.orgImgContainer} shimmer`}
                      ></div>

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
            {orgsData
              ?.filter((org: InterfaceOrgInfoTypePG) =>
                searchByName
                  ? org.name.toLowerCase().includes(searchByName.toLowerCase())
                  : org,
              )
              .map((item: InterfaceOrgInfoTypePG) => {
                return (
                  <div key={item.id} className={styles.itemCardOrgList}>
                    <OrgListCard data={item} />
                  </div>
                );
              })}
          </div>
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
    </>
  );
}
export default orgList;
