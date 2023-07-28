import { useMutation, useQuery } from '@apollo/client';
import { Search } from '@mui/icons-material';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import { CREATE_ORGANIZATION_MUTATION } from 'GraphQl/Mutations/mutations';
import {
  ORGANIZATION_CONNECTION_LIST,
  USER_ORGANIZATION_LIST,
} from 'GraphQl/Queries/Queries';
import AdminDashListCard from 'components/AdminDashListCard/AdminDashListCard';
import SuperDashListCard from 'components/SuperDashListCard/SuperDashListCard';
import type { ChangeEvent } from 'react';
import React, { useState } from 'react';
import { Col, Dropdown, Form, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import convertToBase64 from 'utils/convertToBase64';
import debounce from 'utils/debounce';
import { errorHandler } from 'utils/errorHandler';
import type {
  InterfaceOrgConnectionInfoType,
  InterfaceOrgConnectionType,
  InterfaceUserType,
} from 'utils/interfaces';
import styles from './OrgList.module.css';
import SuperAdminScreen from 'components/SuperAdminScreen/SuperAdminScreen';

function orgList(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'orgList' });

  document.title = t('title');

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
    refetch,
  }: {
    data: InterfaceOrgConnectionType | undefined;
    loading: boolean;
    error?: Error | undefined;
    refetch: any;
  } = useQuery(ORGANIZATION_CONNECTION_LIST);

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
        refetch();
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

  const handleSearchByName = (e: any): void => {
    const { value } = e.target;
    refetch({
      filter: value,
    });
  };

  const debouncedHandleSearchByName = debounce(handleSearchByName);
  return (
    <>
      <SuperAdminScreen
        data={userData}
        title={t('organizations')}
        screenName="Organizations"
      >
        {/* Buttons Container */}
        <div className={styles.btnsContainer}>
          <div
            className={styles.input}
            style={{
              display:
                userData && userData.user.userType === 'SUPERADMIN'
                  ? 'block'
                  : 'none',
            }}
          >
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
            <Button
              variant="success"
              className={styles.createOrgBtn}
              onClick={toggleModal}
              data-testid="createOrganizationBtn"
              style={{
                display:
                  userData && userData.user.userType === 'SUPERADMIN'
                    ? 'block'
                    : 'none',
              }}
            >
              <i className={'fa fa-plus me-2'} />
              {t('createOrganization')}
            </Button>
          </div>
        </div>
        {/* Organizations List */}
        <div className={styles.listBox} data-testid="organizations-list">
          {loading ? (
            <>
              {[...Array(8)].map((_, index) => (
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
          ) : orgsData?.organizationsConnection?.length &&
            orgsData?.organizationsConnection?.length > 0 ? (
            orgsData?.organizationsConnection.map((item) => {
              if (userData && userData.user.userType == 'SUPERADMIN') {
                return (
                  <div key={item._id} className={styles.itemCard}>
                    <SuperDashListCard data={item} />
                  </div>
                );
              } else if (isAdminForCurrentOrg(item)) {
                /* istanbul ignore next */
                return (
                  <div key={item._id} className={styles.itemCard}>
                    <AdminDashListCard data={item} />
                  </div>
                );
              } else {
                return null;
              }
            })
          ) : (
            <div className={styles.notFound}>
              <h3 className="m-0">{t('noOrgErrorTitle')}</h3>
              <h6 className="text-secondary">{t('noOrgErrorDescription')}</h6>
            </div>
          )}
        </div>
        {/* Create Organization Modal */}
        <Modal
          show={showModal}
          onHide={toggleModal}
          backdrop="static"
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
                  if (file)
                    setFormState({
                      ...formState,
                      image: await convertToBase64(file),
                    });
                }}
                data-testid="organisationImage"
              />
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={(): void => toggleModal()}
                data-testid="closeOrganizationModal"
              >
                {t('cancel')}
              </Button>
              <Button
                type="submit"
                value="invite"
                data-testid="submitOrganizationForm"
              >
                {t('createOrganization')}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </SuperAdminScreen>
    </>
  );
}

export default orgList;
