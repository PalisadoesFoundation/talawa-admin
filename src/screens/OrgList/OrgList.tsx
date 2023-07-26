import { useMutation, useQuery } from '@apollo/client';
import { Search } from '@mui/icons-material';
import FilterListIcon from '@mui/icons-material/FilterList';
import MenuIcon from '@mui/icons-material/Menu';
import SortIcon from '@mui/icons-material/Sort';
import { CREATE_ORGANIZATION_MUTATION } from 'GraphQl/Mutations/mutations';
import {
  ORGANIZATION_CONNECTION_LIST,
  USER_ORGANIZATION_LIST,
} from 'GraphQl/Queries/Queries';
import AdminDashListCard from 'components/AdminDashListCard/AdminDashListCard';
import LeftDrawer from 'components/LeftDrawer/LeftDrawer';
import Loader from 'components/Loader/Loader';
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
  InterfaceOrgConnectionType,
  InterfaceUserType,
} from 'utils/interfaces';
import styles from './OrgList.module.css';

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

  const [showDrawer, setShowDrawer] = useState(true);
  const isSuperAdmin = localStorage.getItem('UserType') !== 'SUPERADMIN';

  const toggleModal = (): void => setShowModal(!showModal);

  const [create, { loading: loading3 }] = useMutation(
    CREATE_ORGANIZATION_MUTATION
  );

  const {
    data: userData,
    loading: loading2,
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

  const isAdminForCurrentOrg = (): boolean => {
    return (
      userData?.user?.adminFor.length === 1 &&
      userData.user.adminFor[0]._id === orgsData?.organizationsConnection[0]._id
    );
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
  let dataRevOrg;
  const debouncedHandleSearchByName = debounce(handleSearchByName);
  if (orgsData) {
    dataRevOrg = orgsData.organizationsConnection.slice().reverse();
  }
  return (
    <>
      <LeftDrawer
        data={userData}
        showDrawer={showDrawer}
        setShowDrawer={setShowDrawer}
      />
      <div
        className={`${styles.pageContainer} ${
          showDrawer ? styles.contract : styles.expand
        } `}
        data-testid="mainpageright"
      >
        <div className="d-flex justify-content-between align-items-center">
          <h2>{t('organizations')}</h2>
          <Button
            onClick={(): void => {
              setShowDrawer(!showDrawer);
            }}
          >
            <MenuIcon fontSize="medium" />
          </Button>
        </div>
        {/* Buttons Container */}
        <div className={styles.btnsContainer}>
          <div className={`${styles.input} position-relative`}>
            <Form.Control
              type="name"
              id="orgname"
              className="bg-white"
              placeholder="Search Organization"
              data-testid="searchByName"
              autoComplete="off"
              required
              onChange={debouncedHandleSearchByName}
              style={{
                display:
                  userData && userData.user.userType !== 'SUPERADMIN'
                    ? 'none'
                    : 'block',
              }}
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
                  Sort
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
                  Filter
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
              disabled={isSuperAdmin}
              onClick={toggleModal}
              data-testid="createOrganizationBtn"
              style={{ display: isSuperAdmin ? 'none' : 'block' }}
            >
              <i className={'fa fa-plus me-2'} />
              {t('createOrganization')}
            </Button>
          </div>
        </div>
        {/* Organizations List */}
        <div className={styles.listBox} data-testid="organizations-list">
          {orgsData?.organizationsConnection?.length &&
          orgsData?.organizationsConnection?.length > 0 ? (
            orgsData?.organizationsConnection.map((item) => {
              if (userData && userData.user.userType == 'SUPERADMIN') {
                return (
                  <div key={item._id} className={styles.itemCard}>
                    <SuperDashListCard data={item} />
                  </div>
                );
              } else if (isAdminForCurrentOrg()) {
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
            <Button variant="secondary" onClick={(): void => toggleModal()}>
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
    </>
  );
}

export default orgList;
