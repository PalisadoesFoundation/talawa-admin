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
import LeftDrawer from 'components/LeftDrawer/LeftDrawer';
import Loader from 'components/Loader/Loader';
import PaginationList from 'components/PaginationList/PaginationList';
import SuperDashListCard from 'components/SuperDashListCard/SuperDashListCard';
import dayjs from 'dayjs';
import type { ChangeEvent } from 'react';
import React, { useState } from 'react';
import { Card, Col, Form } from 'react-bootstrap';
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
import MenuIcon from '@mui/icons-material/Menu';

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  if (loading || loading2 || loading3) {
    return <Loader />;
  }

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
          <h2>{t('organizationList')}</h2>
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
              <Button className={styles.sortBtn} variant="outline-success">
                <SortIcon className={'me-1'} />
                Sort
              </Button>
              <Button variant="outline-success" className={styles.sortBtn}>
                <FilterListIcon className={'me-1'} />
                Filter
              </Button>
            </div>
            <Button
              variant="success"
              className={styles.createOrgBtn}
              disabled={isSuperAdmin}
              onClick={toggleModal}
              data-testid="createOrganizationBtn"
              style={{ display: isSuperAdmin ? 'none' : 'block' }}
            >
              <i className={'fa fa-plus me-1'} />
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
                  <Col key={item._id} sm={12} xl={6} xs={12}>
                    <AdminDashListCard data={item} />
                  </Col>
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
      <Modal show={showModal} onHide={toggleModal}>
        <Modal.Header>
          <p className={styles.titlemodal}>{t('createOrganization')}</p>
          <Button
            variant="danger"
            onClick={toggleModal}
            data-testid="closeOrganizationModal"
          >
            <i
              className="fa fa-times"
              style={{
                cursor: 'pointer',
              }}
            ></i>
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmitCapture={createOrg}>
            <label htmlFor="orgname">{t('name')}</label>
            <Form.Control
              type="name"
              id="orgname"
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
            <label htmlFor="descrip">{t('description')}</label>
            <Form.Control
              type="descrip"
              id="descrip"
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
            <label htmlFor="location">{t('location')}</label>
            <Form.Control
              type="text"
              id="location"
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

            <div className={styles.checkboxdiv}>
              <div className={styles.dispflex}>
                <label htmlFor="ispublic">{t('isPublic')}:</label>
                <Form.Switch
                  id="ispublic"
                  type="checkbox"
                  className={'ms-3'}
                  defaultChecked={formState.ispublic}
                  onChange={(): void =>
                    setFormState({
                      ...formState,
                      ispublic: !formState.ispublic,
                    })
                  }
                />
              </div>
              <div className={styles.dispflex}>
                <label htmlFor="visible">{t('visibleInSearch')}: </label>
                <Form.Switch
                  id="visible"
                  type="checkbox"
                  className={'ms-3'}
                  defaultChecked={formState.visible}
                  onChange={(): void =>
                    setFormState({
                      ...formState,
                      visible: !formState.visible,
                    })
                  }
                />
              </div>
            </div>
            <label htmlFor="orgphoto" className={styles.orgphoto}>
              {t('displayImage')}:
              <Form.Control
                accept="image/*"
                id="orgphoto"
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
            </label>
            <Button
              type="submit"
              className={styles.greenregbtn}
              value="invite"
              data-testid="submitOrganizationForm"
            >
              {t('createOrganization')}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default orgList;
