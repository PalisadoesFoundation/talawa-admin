import { useMutation, useQuery } from '@apollo/client';
import { Search } from '@mui/icons-material';
import SortIcon from '@mui/icons-material/Sort';
import {
  CREATE_ORGANIZATION_MUTATION,
  CREATE_SAMPLE_ORGANIZATION_MUTATION,
} from 'GraphQl/Mutations/mutations';
import {
  ORGANIZATION_CONNECTION_LIST,
  USER_ORGANIZATION_LIST,
} from 'GraphQl/Queries/Queries';

import OrgListCard from 'components/OrgListCard/OrgListCard';
import type { ChangeEvent } from 'react';
import React, { useEffect, useState } from 'react';
import { Dropdown, Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { errorHandler } from 'utils/errorHandler';
import type {
  InterfaceOrgConnectionInfoType,
  InterfaceOrgConnectionType,
  InterfaceUserType,
} from 'utils/interfaces';
import useLocalStorage from 'utils/useLocalstorage';
import styles from '../../style/app.module.css';
import OrganizationModal from './OrganizationModal';

function orgList(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'orgList' });
  const { t: tCommon } = useTranslation('common');
  const [dialogModalisOpen, setdialogModalIsOpen] = useState(false);
  const [dialogRedirectOrgId, setDialogRedirectOrgId] = useState('<ORG_ID>');

  function openDialogModal(redirectOrgId: string): void {
    setDialogRedirectOrgId(redirectOrgId);
    // console.log(redirectOrgId, dialogRedirectOrgId);
    setdialogModalIsOpen(true);
  }

  const { getItem } = useLocalStorage();
  const superAdmin = getItem('SuperAdmin');
  const adminFor = getItem('AdminFor');

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
  const [hasMore, sethasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchByName, setSearchByName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    descrip: '',
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
    image: '',
  });

  const toggleModal = (): void => setShowModal(!showModal);

  const [create] = useMutation(CREATE_ORGANIZATION_MUTATION);

  const [createSampleOrganization] = useMutation(
    CREATE_SAMPLE_ORGANIZATION_MUTATION,
  );

  const {
    data: userData,
    error: errorUser,
  }: {
    data: InterfaceUserType | undefined;
    loading: boolean;
    error?: Error | undefined;
  } = useQuery(USER_ORGANIZATION_LIST, {
    variables: { userId: getItem('id') },
    context: {
      headers: { authorization: `Bearer ${getItem('token')}` },
    },
  });

  const {
    data: orgsData,
    loading,
    error: errorList,
    refetch: refetchOrgs,
    fetchMore,
  } = useQuery(ORGANIZATION_CONNECTION_LIST, {
    variables: {
      first: perPageResult,
      skip: 0,
      filter: searchByName,
      orderBy:
        sortingState.option === 'Latest' ? 'createdAt_DESC' : 'createdAt_ASC',
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
        image: '',
      });
    };
  }, []);

  useEffect(() => {
    setIsLoading(loading && isLoadingMore);
  }, [loading]);

  const isAdminForCurrentOrg = (
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
        ) ?? false
      );
    }
  };

  const triggerCreateSampleOrg = (): void => {
    createSampleOrganization()
      .then(() => {
        toast.success(t('sampleOrgSuccess') as string);
        window.location.reload();
      })
      .catch(() => {
        toast.error(t('sampleOrgDuplicate') as string);
      });
  };

  const createOrg = async (e: ChangeEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    const {
      name: _name,
      descrip: _descrip,
      address: _address,
      visible,
      userRegistrationRequired,
      image,
    } = formState;

    const name = _name.trim();
    const descrip = _descrip.trim();
    const address = _address;

    try {
      const { data } = await create({
        variables: {
          name: name,
          description: descrip,
          address: address,
          visibleInSearch: visible,
          userRegistrationRequired: userRegistrationRequired,
          image: image,
        },
      });

      if (data) {
        toast.success('Congratulation the Organization is created');
        refetchOrgs();
        openDialogModal(data.createOrganization._id);
        setFormState({
          name: '',
          descrip: '',
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
          image: '',
        });
        toggleModal();
      }
    } catch (error: unknown) {
      errorHandler(t, error);
    }
  };

  if (errorList || errorUser) {
    window.location.assign('/');
  }

  const resetAllParams = (): void => {
    refetchOrgs({
      filter: '',
      first: perPageResult,
      skip: 0,
      orderBy:
        sortingState.option === 'Latest' ? 'createdAt_DESC' : 'createdAt_ASC',
    });
    sethasMore(true);
  };

  const handleSearch = (value: string): void => {
    setSearchByName(value);
    if (value === '') {
      resetAllParams();
      return;
    }
    refetchOrgs({
      filter: value,
    });
  };

  const handleSearchByEnter = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ): void => {
    if (e.key === 'Enter') {
      const { value } = e.currentTarget;
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
        },
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
            className={'bg-white'}
            placeholder={tCommon('searchByName')}
            data-testid="searchByName"
            autoComplete="off"
            required
            onKeyUp={handleSearchByEnter}
          />
          <Button
            tabIndex={-1}
            className={styles.search}
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
                className={styles.dropdown}
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
        searchByName.length > 0 ? (
        <div className={styles.notFound} data-testid="noResultFound">
          <h4 className="m-0">
            {tCommon('noResultsFoundFor')} &quot;{searchByName}&quot;
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
                <h5 className="m-0 ">{tCommon('endOfResults')}</h5>
              </div>
            }
          >
            {userData && superAdmin
              ? orgsData?.organizationsConnection.map(
                  (item: InterfaceOrgConnectionInfoType) => {
                    return (
                      <div key={item._id} className={styles.itemCard}>
                        <OrgListCard data={item} />
                      </div>
                    );
                  },
                )
              : userData &&
                adminFor.length > 0 &&
                orgsData?.organizationsConnection.map(
                  (item: InterfaceOrgConnectionInfoType) => {
                    if (isAdminForCurrentOrg(item)) {
                      return (
                        <div key={item._id} className={styles.itemCard}>
                          <OrgListCard data={item} />
                        </div>
                      );
                    }
                  },
                )}
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
        tCommon={tCommon}
        userData={userData}
        triggerCreateSampleOrg={triggerCreateSampleOrg}
      />
      {/* Plugin Notification Modal after Org is Created */}
      <Modal show={dialogModalisOpen} onHide={toggleDialogModal}>
        <Modal.Header
          className={styles.createButton}
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
                  className={`btn  ${styles.pluginStoreBtn}`}
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
    </>
  );
}
export default orgList;
