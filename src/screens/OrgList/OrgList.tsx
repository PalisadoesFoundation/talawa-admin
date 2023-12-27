import { useMutation, useQuery } from '@apollo/client';
import { Search } from '@mui/icons-material';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import { CREATE_ORGANIZATION_MUTATION } from 'GraphQl/Mutations/mutations';
import {
  ORGANIZATION_CONNECTION_LIST,
  USER_ORGANIZATION_LIST,
} from 'GraphQl/Queries/Queries';

import { CREATE_SAMPLE_ORGANIZATION_MUTATION } from 'GraphQl/Mutations/mutations';

import OrgListCard from 'components/OrgListCard/OrgListCard';
import SuperAdminScreen from 'components/SuperAdminScreen/SuperAdminScreen';
import type { ChangeEvent } from 'react';
import React, { useEffect, useState } from 'react';
import { Col, Dropdown, Form, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import convertToBase64 from 'utils/convertToBase64';
import { errorHandler } from 'utils/errorHandler';
import type {
  InterfaceOrgConnectionInfoType,
  InterfaceOrgConnectionType,
  InterfaceUserType,
} from 'utils/interfaces';
import styles from './OrgList.module.css';

function orgList(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'orgList' });
  const [dialogModalisOpen, setdialogModalIsOpen] = useState(false);
  const [dialogRedirectOrgId, setDialogRedirectOrgId] = useState('<ORG_ID>');
  /* eslint-disable @typescript-eslint/explicit-function-return-type */
  function openDialogModal(redirectOrgId: string) {
    setDialogRedirectOrgId(redirectOrgId);
    // console.log(redirectOrgId, dialogRedirectOrgId);
    setdialogModalIsOpen(true);
  }

  /* eslint-disable @typescript-eslint/explicit-function-return-type */
  function closeDialogModal() {
    setdialogModalIsOpen(false);
  }
  const toggleDialogModal = (): void =>
    setdialogModalIsOpen(!dialogModalisOpen);
  document.title = t('title');

  const perPageResult = 8;
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, sethasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchByName, setSearchByName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    descrip: '',
    ispublic: true,
    visible: false,
    location: '',
    image: '',
  });

  const toggleModal = (): void => setShowModal(!showModal);

  const [create] = useMutation(CREATE_ORGANIZATION_MUTATION);

  const [createSampleOrganization] = useMutation(
    CREATE_SAMPLE_ORGANIZATION_MUTATION
  );

  const {
    data: userData,
    error: errorUser,
  }: {
    data: InterfaceUserType | undefined;
    loading: boolean;
    error?: Error | undefined;
  } = useQuery(USER_ORGANIZATION_LIST, {
    variables: { id: localStorage.getItem('id') },
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
        ispublic: true,
        visible: false,
        location: '',
        image: '',
      });
    };
  }, []);

  useEffect(() => {
    setIsLoading(loading && isLoadingMore);
  }, [loading]);

  /* istanbul ignore next */
  const isAdminForCurrentOrg = (
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
        ) ?? false
      );
    }
  };

  const triggerCreateSampleOrg = () => {
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
      location: _location,
      visible,
      ispublic,
      image,
    } = formState;

    const name = _name.trim();
    const descrip = _descrip.trim();
    const location = _location.trim();

    try {
      const { data } = await create({
        variables: {
          name: name,
          description: descrip,
          location: location,
          visibleInSearch: visible,
          isPublic: ispublic,
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
          ispublic: true,
          visible: false,
          location: '',
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
    });
    sethasMore(true);
  };

  /* istanbul ignore next */
  const handleSearchByName = (e: any): void => {
    if (e.key === 'Enter') {
      const { value } = e.target;
      setSearchByName(value);
      if (value == '') {
        resetAllParams();
        return;
      }
      refetchOrgs({
        filter: value,
      });
    }
  };

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
        }
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

  return (
    <>
      <SuperAdminScreen
        title={t('my organizations')}
        screenName="My Organizations"
      >
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
              onKeyUp={handleSearchByName}
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
                  return (
                    <div key={item._id} className={styles.itemCard}>
                      <OrgListCard data={item} />
                    </div>
                  );
                })
              ) : (
                userData &&
                userData.user.userType == 'ADMIN' &&
                userData.user.adminFor.length > 0 &&
                orgsData?.organizationsConnection.map((item) => {
                  if (isAdminForCurrentOrg(item)) {
                    return (
                      <div key={item._id} className={styles.itemCard}>
                        <OrgListCard data={item} />
                      </div>
                    );
                  }
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
    </>
  );
}
export default orgList;
