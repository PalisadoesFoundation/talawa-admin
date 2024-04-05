import { useMutation, useQuery } from '@apollo/client';
import { Search } from '@mui/icons-material';
<<<<<<< HEAD
import SortIcon from '@mui/icons-material/Sort';
import {
  CREATE_ORGANIZATION_MUTATION,
  CREATE_SAMPLE_ORGANIZATION_MUTATION,
} from 'GraphQl/Mutations/mutations';
=======
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import { CREATE_ORGANIZATION_MUTATION } from 'GraphQl/Mutations/mutations';
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
import {
  ORGANIZATION_CONNECTION_LIST,
  USER_ORGANIZATION_LIST,
} from 'GraphQl/Queries/Queries';

<<<<<<< HEAD
import OrgListCard from 'components/OrgListCard/OrgListCard';
import type { ChangeEvent } from 'react';
import React, { useEffect, useState } from 'react';
import { Dropdown, Form } from 'react-bootstrap';
=======
import { CREATE_SAMPLE_ORGANIZATION_MUTATION } from 'GraphQl/Mutations/mutations';

import OrgListCard from 'components/OrgListCard/OrgListCard';
import SuperAdminScreen from 'components/SuperAdminScreen/SuperAdminScreen';
import type { ChangeEvent } from 'react';
import React, { useEffect, useState } from 'react';
import { Col, Dropdown, Form, Row } from 'react-bootstrap';
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
<<<<<<< HEAD
=======
import convertToBase64 from 'utils/convertToBase64';
import debounce from 'utils/debounce';
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
import { errorHandler } from 'utils/errorHandler';
import type {
  InterfaceOrgConnectionInfoType,
  InterfaceOrgConnectionType,
  InterfaceUserType,
} from 'utils/interfaces';
<<<<<<< HEAD
import useLocalStorage from 'utils/useLocalstorage';
import styles from './OrgList.module.css';
import OrganizationModal from './OrganizationModal';
=======
import styles from './OrgList.module.css';
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

function orgList(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'orgList' });
  const [dialogModalisOpen, setdialogModalIsOpen] = useState(false);
  const [dialogRedirectOrgId, setDialogRedirectOrgId] = useState('<ORG_ID>');
<<<<<<< HEAD

  function openDialogModal(redirectOrgId: string): void {
=======
  /* eslint-disable @typescript-eslint/explicit-function-return-type */
  function openDialogModal(redirectOrgId: string) {
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    setDialogRedirectOrgId(redirectOrgId);
    // console.log(redirectOrgId, dialogRedirectOrgId);
    setdialogModalIsOpen(true);
  }

<<<<<<< HEAD
  const { getItem } = useLocalStorage();
  const superAdmin = getItem('SuperAdmin');
  const adminFor = getItem('AdminFor');

  function closeDialogModal(): void {
    setdialogModalIsOpen(false);
  }
  const toggleDialogModal = /* istanbul ignore next */ (): void =>
=======
  /* eslint-disable @typescript-eslint/explicit-function-return-type */
  function closeDialogModal() {
    setdialogModalIsOpen(false);
  }
  const toggleDialogModal = (): void =>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    setdialogModalIsOpen(!dialogModalisOpen);
  document.title = t('title');

  const perPageResult = 8;
  const [isLoading, setIsLoading] = useState(true);
<<<<<<< HEAD
  const [sortingState, setSortingState] = useState({
    option: '',
    selectedOption: t('sort'),
  });
=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  const [hasMore, sethasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchByName, setSearchByName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    descrip: '',
<<<<<<< HEAD
    userRegistrationRequired: true,
    visible: false,
    address: {
      city: '',
      countryCode: '',
      dependentLocality: '',
      line1: '',
      line2: '',
      postalCode: '',
      sortingCode: '',
      state: '',
    },
=======
    ispublic: true,
    visible: false,
    location: '',
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    image: '',
  });

  const toggleModal = (): void => setShowModal(!showModal);

  const [create] = useMutation(CREATE_ORGANIZATION_MUTATION);

  const [createSampleOrganization] = useMutation(
<<<<<<< HEAD
    CREATE_SAMPLE_ORGANIZATION_MUTATION,
=======
    CREATE_SAMPLE_ORGANIZATION_MUTATION
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  );

  const {
    data: userData,
    error: errorUser,
  }: {
    data: InterfaceUserType | undefined;
    loading: boolean;
    error?: Error | undefined;
  } = useQuery(USER_ORGANIZATION_LIST, {
<<<<<<< HEAD
    variables: { userId: getItem('id') },
    context: {
      headers: { authorization: `Bearer ${getItem('token')}` },
    },
=======
    variables: { id: localStorage.getItem('id') },
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  });

  const {
    data: orgsData,
    loading,
    error: errorList,
    refetch: refetchOrgs,
    fetchMore,
  }: {
    data: InterfaceOrgConnectionType | undefined;
    loading: boolean;
    error?: Error | undefined;
    refetch: any;
    fetchMore: any;
  } = useQuery(ORGANIZATION_CONNECTION_LIST, {
    variables: {
      first: perPageResult,
      skip: 0,
      filter: searchByName,
<<<<<<< HEAD
      orderBy:
        sortingState.option === 'Latest' ? 'createdAt_DESC' : 'createdAt_ASC',
=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    },
    notifyOnNetworkStatusChange: true,
  });

  // To clear the search field and form fields on unmount
  useEffect(() => {
    return () => {
      setSearchByName('');
      setFormState({
        name: '',
        descrip: '',
<<<<<<< HEAD
        userRegistrationRequired: true,
        visible: false,
        address: {
          city: '',
          countryCode: '',
          dependentLocality: '',
          line1: '',
          line2: '',
          postalCode: '',
          sortingCode: '',
          state: '',
        },
=======
        ispublic: true,
        visible: false,
        location: '',
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
        image: '',
      });
    };
  }, []);

  useEffect(() => {
    setIsLoading(loading && isLoadingMore);
  }, [loading]);

  /* istanbul ignore next */
  const isAdminForCurrentOrg = (
<<<<<<< HEAD
    currentOrg: InterfaceOrgConnectionInfoType,
  ): boolean => {
    if (adminFor.length === 1) {
      // If user is admin for one org only then check if that org is current org
      return adminFor[0]._id === currentOrg._id;
    } else {
      // If user is admin for more than one org then check if current org is present in adminFor array
      return (
        adminFor.some(
          (org: { _id: string; name: string; image: string | null }) =>
            org._id === currentOrg._id,
=======
    currentOrg: InterfaceOrgConnectionInfoType
  ): boolean => {
    if (userData?.user?.adminFor.length === 1) {
      // If user is admin for one org only then check if that org is current org
      return userData?.user?.adminFor[0]._id === currentOrg._id;
    } else {
      // If user is admin for more than one org then check if current org is present in adminFor array
      return (
        userData?.user?.adminFor.some(
          (org: { _id: string; name: string; image: string | null }) =>
            org._id === currentOrg._id
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
        ) ?? false
      );
    }
  };

<<<<<<< HEAD
  const triggerCreateSampleOrg = (): void => {
=======
  const triggerCreateSampleOrg = () => {
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    createSampleOrganization()
      .then(() => {
        toast.success(t('sampleOrgSuccess'));
        window.location.reload();
      })
      .catch(() => {
        toast.error(t('sampleOrgDuplicate'));
      });
  };

  const createOrg = async (e: ChangeEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    const {
      name: _name,
      descrip: _descrip,
<<<<<<< HEAD
      address: _address,
      visible,
      userRegistrationRequired,
=======
      location: _location,
      visible,
      ispublic,
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
      image,
    } = formState;

    const name = _name.trim();
    const descrip = _descrip.trim();
<<<<<<< HEAD
    const address = _address;
=======
    const location = _location.trim();
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

    try {
      const { data } = await create({
        variables: {
          name: name,
          description: descrip,
<<<<<<< HEAD
          address: address,
          visibleInSearch: visible,
          userRegistrationRequired: userRegistrationRequired,
=======
          location: location,
          visibleInSearch: visible,
          isPublic: ispublic,
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
          image: image,
        },
      });

      /* istanbul ignore next */
      if (data) {
        toast.success('Congratulation the Organization is created');
        refetchOrgs();
        openDialogModal(data.createOrganization._id);
        setFormState({
          name: '',
          descrip: '',
<<<<<<< HEAD
          userRegistrationRequired: true,
          visible: false,
          address: {
            city: '',
            countryCode: '',
            dependentLocality: '',
            line1: '',
            line2: '',
            postalCode: '',
            sortingCode: '',
            state: '',
          },
=======
          ispublic: true,
          visible: false,
          location: '',
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
          image: '',
        });
        toggleModal();
      }
    } catch (error: any) {
      /* istanbul ignore next */
      errorHandler(t, error);
    }
  };

  /* istanbul ignore next */
  if (errorList || errorUser) {
    window.location.assign('/');
  }

  /* istanbul ignore next */
  const resetAllParams = (): void => {
    refetchOrgs({
      filter: '',
      first: perPageResult,
      skip: 0,
<<<<<<< HEAD
      orderBy:
        sortingState.option === 'Latest' ? 'createdAt_DESC' : 'createdAt_ASC',
=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    });
    sethasMore(true);
  };

  /* istanbul ignore next */
<<<<<<< HEAD
  const handleSearch = (value: string): void => {
    setSearchByName(value);
    if (value === '') {
=======
  const handleSearchByName = (e: any): void => {
    const { value } = e.target;
    setSearchByName(value);
    if (value == '') {
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
      resetAllParams();
      return;
    }
    refetchOrgs({
      filter: value,
    });
  };

<<<<<<< HEAD
  const handleSearchByEnter = (e: any): void => {
    if (e.key === 'Enter') {
      const { value } = e.target;
      handleSearch(value);
    }
  };

  const handleSearchByBtnClick = (): void => {
    const inputElement = document.getElementById(
      'searchOrgname',
    ) as HTMLInputElement;
    const inputValue = inputElement?.value || '';
    handleSearch(inputValue);
  };
=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  /* istanbul ignore next */
  const loadMoreOrganizations = (): void => {
    console.log('loadMoreOrganizations');
    setIsLoadingMore(true);
    fetchMore({
      variables: {
        skip: orgsData?.organizationsConnection.length || 0,
      },
      updateQuery: (
        prev:
          | { organizationsConnection: InterfaceOrgConnectionType[] }
          | undefined,
        {
          fetchMoreResult,
        }: {
          fetchMoreResult:
            | { organizationsConnection: InterfaceOrgConnectionType[] }
            | undefined;
<<<<<<< HEAD
        },
=======
        }
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
      ):
        | { organizationsConnection: InterfaceOrgConnectionType[] }
        | undefined => {
        setIsLoadingMore(false);
        if (!fetchMoreResult) return prev;
        if (fetchMoreResult.organizationsConnection.length < perPageResult) {
          sethasMore(false);
        }
        return {
          organizationsConnection: [
            ...(prev?.organizationsConnection || []),
            ...(fetchMoreResult.organizationsConnection || []),
          ],
        };
      },
    });
  };

<<<<<<< HEAD
  const handleSorting = (option: string): void => {
    setSortingState({
      option,
      selectedOption: t(option),
    });

    const orderBy = option === 'Latest' ? 'createdAt_DESC' : 'createdAt_ASC';

    refetchOrgs({
      first: perPageResult,
      skip: 0,
      filter: searchByName,
      orderBy,
    });
  };

  return (
    <>
      {/* Buttons Container */}
      <div className={styles.btnsContainer}>
        <div className={styles.input}>
          <Form.Control
            type="name"
            id="searchOrgname"
            className="bg-white"
            placeholder={t('searchByName')}
            data-testid="searchByName"
            autoComplete="off"
            required
            onKeyUp={handleSearchByEnter}
          />
          <Button
            tabIndex={-1}
            className={`position-absolute z-10 bottom-0 end-0 h-100 d-flex justify-content-center align-items-center`}
            onClick={handleSearchByBtnClick}
            data-testid="searchBtn"
          >
            <Search />
          </Button>
        </div>
        <div className={styles.btnsBlock}>
          <div className="d-flex">
            <Dropdown
              aria-expanded="false"
              title="Sort organizations"
              data-testid="sort"
            >
              <Dropdown.Toggle
                variant={
                  sortingState.option === '' ? 'outline-success' : 'success'
                }
                data-testid="sortOrgs"
              >
                <SortIcon className={'me-1'} />
                {sortingState.selectedOption}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={(): void => handleSorting('Latest')}
                  data-testid="latest"
                >
                  {t('Latest')}
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={(): void => handleSorting('Earliest')}
                  data-testid="oldest"
                >
                  {t('Earliest')}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          {superAdmin && (
            <Button
              variant="success"
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
      (!orgsData?.organizationsConnection ||
        orgsData.organizationsConnection.length === 0) &&
      searchByName.length === 0 &&
      (!userData || adminFor.length === 0 || superAdmin) ? (
        <div className={styles.notFound}>
          <h3 className="m-0">{t('noOrgErrorTitle')}</h3>
          <h6 className="text-secondary">{t('noOrgErrorDescription')}</h6>
        </div>
      ) : !isLoading &&
        orgsData?.organizationsConnection.length == 0 &&
        /* istanbul ignore next */
        searchByName.length > 0 ? (
        /* istanbul ignore next */
        <div className={styles.notFound} data-testid="noResultFound">
          <h4 className="m-0">
            {t('noResultsFoundFor')} &quot;{searchByName}&quot;
          </h4>
        </div>
      ) : (
        <>
          <InfiniteScroll
            dataLength={orgsData?.organizationsConnection?.length ?? 0}
            next={loadMoreOrganizations}
            loader={
              <>
                {[...Array(perPageResult)].map((_, index) => (
                  <div key={index} className={styles.itemCard}>
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
            className={styles.listBox}
            data-testid="organizations-list"
            endMessage={
              <div className={'w-100 text-center my-4'}>
                <h5 className="m-0 ">{t('endOfResults')}</h5>
              </div>
            }
          >
            {userData && superAdmin
              ? orgsData?.organizationsConnection.map((item) => {
=======
  const debouncedHandleSearchByName = debounce(handleSearchByName);
  return (
    <>
      <SuperAdminScreen title={t('organizations')} screenName="Organizations">
        {/* Buttons Container */}
        <div className={styles.btnsContainer}>
          <div className={styles.input}>
            <Form.Control
              type="name"
              id="orgname"
              className="bg-white"
              placeholder={t('searchByName')}
              data-testid="searchByName"
              autoComplete="off"
              required
              onChange={debouncedHandleSearchByName}
            />
            <Button
              tabIndex={-1}
              className={`position-absolute z-10 bottom-0 end-0 h-100 d-flex justify-content-center align-items-center`}
            >
              <Search />
            </Button>
          </div>
          <div className={styles.btnsBlock}>
            <div className="d-flex">
              <Dropdown aria-expanded="false" title="Sort organizations">
                <Dropdown.Toggle variant="outline-success">
                  <SortIcon className={'me-1'} />
                  {t('sort')}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item href="#/action-1">Action 1</Dropdown.Item>
                  <Dropdown.Item href="#/action-2">Action 2</Dropdown.Item>
                  <Dropdown.Item href="#/action-3">Action 3</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <Dropdown aria-expanded="false" title="Filter organizations">
                <Dropdown.Toggle variant="outline-success">
                  <FilterListIcon className={'me-1'} />
                  {t('filter')}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item href="#/action-1">Action 1</Dropdown.Item>
                  <Dropdown.Item href="#/action-2">Action 2</Dropdown.Item>
                  <Dropdown.Item href="#/action-3">Action 3</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            {userData && userData.user.userType === 'SUPERADMIN' && (
              <Button
                variant="success"
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
        ((orgsData?.organizationsConnection.length === 0 &&
          searchByName.length == 0) ||
          (userData &&
            userData.user.userType === 'ADMIN' &&
            userData.user.adminFor.length === 0)) ? (
          // eslint-disable-next-line
          <div className={styles.notFound}>
            <h3 className="m-0">{t('noOrgErrorTitle')}</h3>
            <h6 className="text-secondary">{t('noOrgErrorDescription')}</h6>
          </div>
        ) : !isLoading &&
          orgsData?.organizationsConnection.length == 0 &&
          /* istanbul ignore next */
          searchByName.length > 0 ? (
          /* istanbul ignore next */
          // eslint-disable-next-line
          <div className={styles.notFound} data-testid="noResultFound">
            <h4 className="m-0">
              {t('noResultsFoundFor')} &quot;{searchByName}&quot;
            </h4>
          </div>
        ) : (
          <>
            <InfiniteScroll
              dataLength={orgsData?.organizationsConnection?.length ?? 0}
              next={loadMoreOrganizations}
              loader={
                <>
                  {[...Array(perPageResult)].map((_, index) => (
                    <div key={index} className={styles.itemCard}>
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
              className={styles.listBox}
              data-testid="organizations-list"
              endMessage={
                <div className={'w-100 text-center my-4'}>
                  <h5 className="m-0 ">{t('endOfResults')}</h5>
                </div>
              }
            >
              {isLoading ? (
                <>
                  {[...Array(perPageResult)].map((_, index) => (
                    <div key={index} className={styles.itemCard}>
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
              ) : userData && userData.user.userType == 'SUPERADMIN' ? (
                orgsData?.organizationsConnection.map((item) => {
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
                  return (
                    <div key={item._id} className={styles.itemCard}>
                      <OrgListCard data={item} />
                    </div>
                  );
                })
<<<<<<< HEAD
              : userData &&
                adminFor.length > 0 &&
=======
              ) : (
                userData &&
                userData.user.userType == 'ADMIN' &&
                userData.user.adminFor.length > 0 &&
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
                orgsData?.organizationsConnection.map((item) => {
                  if (isAdminForCurrentOrg(item)) {
                    return (
                      <div key={item._id} className={styles.itemCard}>
                        <OrgListCard data={item} />
                      </div>
                    );
                  }
<<<<<<< HEAD
                })}
          </InfiniteScroll>
          {isLoading && (
            <>
              {[...Array(perPageResult)].map((_, index) => (
                <div key={index} className={styles.itemCard}>
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
       * @param triggerCreateSampleOrg - A function to trigger the creation of a sample organization.
       * @returns JSX element representing the `OrganizationModal`.
       */}
      <OrganizationModal
        showModal={showModal}
        toggleModal={toggleModal}
        formState={formState}
        setFormState={setFormState}
        createOrg={createOrg}
        t={t}
        userData={userData}
        triggerCreateSampleOrg={triggerCreateSampleOrg}
      />
      {/* Plugin Notification Modal after Org is Created */}
      <Modal show={dialogModalisOpen} onHide={toggleDialogModal}>
        <Modal.Header
          className="bg-primary"
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
                  className={`btn btn-primary ${styles.pluginStoreBtn}`}
                  data-testid="goToStore"
                  to={`orgstore/id=${dialogRedirectOrgId}`}
                >
                  {t('goToStore')}
                </Link>
                {/* </button> */}
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
=======
                })
              )}
            </InfiniteScroll>
          </>
        )}
        {/* Create Organization Modal */}
        <Modal
          show={showModal}
          onHide={toggleModal}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header
            className="bg-primary"
            closeButton
            data-testid="modalOrganizationHeader"
          >
            <Modal.Title className="text-white">
              {t('createOrganization')}
            </Modal.Title>
          </Modal.Header>
          <Form onSubmitCapture={createOrg}>
            <Modal.Body>
              <Form.Label htmlFor="orgname">{t('name')}</Form.Label>
              <Form.Control
                type="name"
                id="orgname"
                className="mb-3"
                placeholder={t('enterName')}
                data-testid="modalOrganizationName"
                autoComplete="off"
                required
                value={formState.name}
                onChange={(e): void => {
                  setFormState({
                    ...formState,
                    name: e.target.value,
                  });
                }}
              />
              <Form.Label htmlFor="descrip">{t('description')}</Form.Label>
              <Form.Control
                type="descrip"
                id="descrip"
                className="mb-3"
                placeholder={t('description')}
                autoComplete="off"
                required
                value={formState.descrip}
                onChange={(e): void => {
                  setFormState({
                    ...formState,
                    descrip: e.target.value,
                  });
                }}
              />
              <Form.Label htmlFor="location">{t('location')}</Form.Label>
              <Form.Control
                type="text"
                id="location"
                className="mb-3"
                placeholder={t('location')}
                autoComplete="off"
                required
                value={formState.location}
                onChange={(e): void => {
                  setFormState({
                    ...formState,
                    location: e.target.value,
                  });
                }}
              />

              <Row className="mb-3">
                <Col>
                  <Form.Label htmlFor="ispublic">{t('isPublic')}</Form.Label>
                  <Form.Switch
                    id="ispublic"
                    data-testid="isPublic"
                    type="checkbox"
                    defaultChecked={formState.ispublic}
                    onChange={(): void =>
                      setFormState({
                        ...formState,
                        ispublic: !formState.ispublic,
                      })
                    }
                  />
                </Col>
                <Col>
                  <Form.Label htmlFor="visibleInSearch">
                    {t('visibleInSearch')}
                  </Form.Label>
                  <Form.Switch
                    id="visibleInSearch"
                    data-testid="visibleInSearch"
                    type="checkbox"
                    defaultChecked={formState.visible}
                    onChange={(): void =>
                      setFormState({
                        ...formState,
                        visible: !formState.visible,
                      })
                    }
                  />
                </Col>
              </Row>
              <Form.Label htmlFor="orgphoto">{t('displayImage')}</Form.Label>
              <Form.Control
                accept="image/*"
                id="orgphoto"
                className="mb-3"
                name="photo"
                type="file"
                multiple={false}
                onChange={async (e: React.ChangeEvent): Promise<void> => {
                  const target = e.target as HTMLInputElement;
                  const file = target.files && target.files[0];
                  /* istanbul ignore else */
                  if (file)
                    setFormState({
                      ...formState,
                      image: await convertToBase64(file),
                    });
                }}
                data-testid="organisationImage"
              />
              <Col className={styles.sampleOrgSection}>
                <Button
                  className={styles.orgCreationBtn}
                  type="submit"
                  value="invite"
                  data-testid="submitOrganizationForm"
                >
                  {t('createOrganization')}
                </Button>

                <div className="position-relative">
                  <hr />
                  <span className={styles.orText}>{t('OR')}</span>
                </div>
                {userData &&
                  ((userData.user.userType === 'ADMIN' &&
                    userData.user.adminFor.length > 0) ||
                    userData.user.userType === 'SUPERADMIN') && (
                    <div className={styles.sampleOrgSection}>
                      <Button
                        className={styles.sampleOrgCreationBtn}
                        onClick={() => triggerCreateSampleOrg()}
                        data-testid="createSampleOrganizationBtn"
                      >
                        {t('createSampleOrganization')}
                      </Button>
                    </div>
                  )}
              </Col>
            </Modal.Body>
          </Form>
        </Modal>{' '}
        {/* Plugin Notification Modal after Org is Created */}
        <Modal show={dialogModalisOpen} onHide={toggleDialogModal}>
          <Modal.Body>
            <section id={styles.grid_wrapper}>
              <div>
                <div className={styles.flexdir}>
                  <p className={styles.titlemodal}>{t('manageFeatures')}</p>
                  <a
                    onClick={toggleDialogModal}
                    className={styles.cancel}
                    data-testid="closeOrganizationModal"
                  >
                    <i
                      className="fa fa-times"
                      style={{
                        cursor: 'pointer',
                      }}
                    ></i>
                  </a>
                  <Button
                    variant="secondary"
                    onClick={(): void => toggleModal()}
                    data-testid="closeOrganizationModal"
                  >
                    {t('cancel')}
                  </Button>
                </div>
                <h4 className={styles.titlemodaldialog}>
                  {t('manageFeaturesInfo')}
                </h4>

                <div className={styles.pluginStoreBtnContainer}>
                  <Link
                    className={styles.secondbtn}
                    data-testid="submitOrganizationForm"
                    to={`orgstore/id=${dialogRedirectOrgId}`}
                  >
                    {t('goToStore')}
                  </Link>
                  {/* </button> */}
                  <button
                    type="submit"
                    className={styles.greenregbtn}
                    onClick={closeDialogModal}
                    value="invite"
                    data-testid="submitOrganizationForm"
                  >
                    {t('enableEverything')}
                  </button>
                </div>
              </div>
            </section>
          </Modal.Body>
        </Modal>
      </SuperAdminScreen>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    </>
  );
}
export default orgList;
