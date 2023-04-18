import React, { ChangeEvent, useState } from 'react';
import Modal from 'react-modal';
import { Form } from 'antd';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useMutation, useQuery } from '@apollo/client';
import Button from 'react-bootstrap/Button';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import styles from './OrgList.module.css';
import SuperDashListCard from 'components/SuperDashListCard/SuperDashListCard';
import {
  ORGANIZATION_CONNECTION_LIST,
  USER_ORGANIZATION_LIST,
} from 'GraphQl/Queries/Queries';
import { CREATE_ORGANIZATION_MUTATION } from 'GraphQl/Mutations/mutations';
import ListNavbar from 'components/ListNavbar/ListNavbar';
import PaginationList from 'components/PaginationList/PaginationList';
import debounce from 'utils/debounce';
import convertToBase64 from 'utils/convertToBase64';
import AdminDashListCard from 'components/AdminDashListCard/AdminDashListCard';
import { Alert, AlertTitle } from '@mui/material';
import { errorHandler } from 'utils/errorHandler';

function OrgList(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'orgList' });

  document.title = t('title');

  const [modalisOpen, setmodalIsOpen] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    descrip: '',
    ispublic: true,
    visible: false,
    location: '',
    image: '',
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const isSuperAdmin = localStorage.getItem('UserType') !== 'SUPERADMIN';

  const showInviteModal = () => {
    setmodalIsOpen(true);
  };
  const hideInviteModal = () => {
    setmodalIsOpen(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [create, { loading: createOrgLoading }] = useMutation(
    CREATE_ORGANIZATION_MUTATION
  );

  const {
    data: userOrgListData,
    loading: userOrgListLoading,
    error: userOrgListError,
  } = useQuery(USER_ORGANIZATION_LIST, {
    variables: { id: localStorage.getItem('id') },
  });

  const {
    data: orgListData,
    loading: orgListLoading,
    error: orgListError,
    refetch,
  } = useQuery(ORGANIZATION_CONNECTION_LIST);
  /*istanbul ignore next*/
  interface UserType {
    adminFor: Array<{
      _id: string;
    }>;
  }
  /*istanbul ignore next*/
  interface CurrentOrgType {
    _id: string;
  }
  /*istanbul ignore next*/
  const isAdminForCurrentOrg = (
    user: UserType | undefined,
    currentOrg: CurrentOrgType
  ): boolean => {
    return (
      user?.adminFor.length === 1 && user?.adminFor[0]._id === currentOrg._id
    );
  };

  const CreateOrg = async (e: ChangeEvent<HTMLFormElement>) => {
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
        setmodalIsOpen(false);
      }
    } catch (error: any) {
      /* istanbul ignore next */
      errorHandler(t, error);
    }
  };

  if (orgListLoading || userOrgListLoading || createOrgLoading) {
    return (
      <>
        <div className={styles.loader}></div>
      </>
    );
  }

  /* istanbul ignore next */
  if (orgListError || userOrgListError) {
    window.location.assign('/');
  }

  /* istanbul ignore next */
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  /* istanbul ignore next */
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  /* istanbul ignore next */
  const handleSearchByName = (e: any) => {
    const { value } = e.target;
    refetch({
      filter: value,
    });
  };
  let dataRevOrg;
  const debouncedHandleSearchByName = debounce(handleSearchByName);
  if (orgListData) {
    dataRevOrg = orgListData.organizationsConnection.slice().reverse();
  }
  return (
    <>
      <ListNavbar />
      <Row>
        <Col xl={3}>
          <div className={styles.sidebar}>
            <div className={`${styles.mainpageright} ${styles.sidebarsticky}`}>
              <h6 className={`${styles.logintitle} ${styles.youheader}`}>
                {t('you')}
              </h6>
              <p>
                {t('name')}:
                <span>
                  {userOrgListData?.user.firstName}{' '}
                  {userOrgListData?.user.lastName}
                </span>
              </p>
              <p>
                {t('designation')}:
                <span> {userOrgListData?.user.userType}</span>
              </p>
              <div className={styles.userEmail}>
                {t('email')}:
                <p>
                  {(userOrgListData?.user.email || '').substring(
                    0,
                    (userOrgListData?.user.email || '').length / 2
                  )}
                  <span>
                    {userOrgListData?.user.email.substring(
                      userOrgListData?.user.email.length / 2,
                      userOrgListData?.user.email.length
                    )}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </Col>
        <Col xl={8} className={styles.mainpagerightContainer}>
          <div className={styles.mainpageright} data-testid="mainpageright">
            <div className={styles.justifysp}>
              <p className={styles.logintitle}>{t('organizationList')}</p>
            </div>
            <div className={styles.search}>
              <Button
                variant="success"
                className={styles.invitebtn}
                disabled={isSuperAdmin}
                onClick={showInviteModal}
                data-testid="createOrganizationBtn"
                style={{ display: isSuperAdmin ? 'none' : 'block' }}
              >
                + {t('createOrganization')}
              </Button>
              <input
                type="name"
                id="orgname"
                placeholder="Search Organization"
                data-testid="searchByName"
                autoComplete="off"
                required
                onChange={debouncedHandleSearchByName}
                style={{
                  display:
                    userOrgListData &&
                    userOrgListData.user.userType !== 'SUPERADMIN'
                      ? 'none'
                      : 'block',
                }}
              />
            </div>
            <div className={styles.list_box} data-testid="organizations-list">
              {orgListData?.organizationsConnection.length > 0 ? (
                (rowsPerPage > 0
                  ? dataRevOrg.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : orgListData.organizationsConnection
                ).map(
                  (datas: {
                    _id: string;
                    image: string;
                    name: string;
                    admins: any;
                    members: any;
                    createdAt: string;
                    location: string | null;
                  }) => {
                    if (
                      userOrgListData &&
                      userOrgListData.user.userType == 'SUPERADMIN'
                    ) {
                      return (
                        <SuperDashListCard
                          id={datas._id}
                          key={datas._id}
                          image={datas.image}
                          admins={datas.admins}
                          members={datas.members.length}
                          createdDate={dayjs(datas?.createdAt).format(
                            'MMMM D, YYYY'
                          )}
                          orgName={datas.name}
                          orgLocation={datas.location}
                        />
                      );
                    } else if (
                      isAdminForCurrentOrg(userOrgListData?.user, datas)
                    ) {
                      /* istanbul ignore next */
                      return (
                        <AdminDashListCard
                          id={datas._id}
                          key={datas._id}
                          image={datas.image}
                          admins={datas.admins}
                          members={datas.members.length}
                          createdDate={dayjs(datas?.createdAt).format(
                            'MMMM D, YYYY'
                          )}
                          orgName={datas.name}
                          orgLocation={datas.location}
                        />
                      );
                    } else {
                      return null;
                    }
                  }
                )
              ) : (
                <div>
                  <Alert variant="filled" severity="error">
                    <AlertTitle>{t('noOrgErrorTitle')}</AlertTitle>
                    {t('noOrgErrorDescription')}
                  </Alert>
                </div>
              )}
            </div>
            <div>
              <table
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <tbody>
                  {userOrgListData?.user.userType === 'SUPERADMIN' && (
                    <tr data-testid="rowsPPSelect">
                      <PaginationList
                        count={
                          orgListData
                            ? orgListData.organizationsConnection.length
                            : 0
                        }
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                      />
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Col>
      </Row>
      <Modal
        isOpen={modalisOpen}
        onRequestClose={() => setmodalIsOpen(false)}
        style={{
          overlay: { backgroundColor: 'grey' },
        }}
        className={styles.modalbody}
        ariaHideApp={false}
      >
        <section id={styles.grid_wrapper}>
          <div className={styles.form_wrapper}>
            <div className={styles.flexdir}>
              <p className={styles.titlemodal}>{t('createOrganization')}</p>
              <a
                onClick={hideInviteModal}
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
            </div>
            <Form onSubmitCapture={CreateOrg}>
              <label htmlFor="orgname">{t('name')}</label>
              <input
                type="name"
                id="orgname"
                placeholder={t('enterName')}
                data-testid="modalOrganizationName"
                autoComplete="off"
                required
                value={formState.name}
                onChange={(e) => {
                  setFormState({
                    ...formState,
                    name: e.target.value,
                  });
                }}
              />
              <label htmlFor="descrip">{t('description')}</label>
              <input
                type="descrip"
                id="descrip"
                placeholder={t('description')}
                autoComplete="off"
                required
                value={formState.descrip}
                onChange={(e) => {
                  setFormState({
                    ...formState,
                    descrip: e.target.value,
                  });
                }}
              />
              <label htmlFor="location">{t('location')}</label>
              <input
                type="text"
                id="location"
                placeholder={t('location')}
                autoComplete="off"
                required
                value={formState.location}
                onChange={(e) => {
                  setFormState({
                    ...formState,
                    location: e.target.value,
                  });
                }}
              />

              <div className={styles.checkboxdiv}>
                <div className={styles.dispflex}>
                  <label htmlFor="ispublic">{t('isPublic')}:</label>
                  <input
                    id="ispublic"
                    type="checkbox"
                    defaultChecked={formState.ispublic}
                    onChange={() =>
                      setFormState({
                        ...formState,
                        ispublic: !formState.ispublic,
                      })
                    }
                  />
                </div>
                <div className={styles.dispflex}>
                  <label htmlFor="visible">{t('visibleInSearch')}: </label>
                  <input
                    id="visible"
                    type="checkbox"
                    defaultChecked={formState.visible}
                    onChange={() =>
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
                <input
                  accept="image/*"
                  id="orgphoto"
                  name="photo"
                  type="file"
                  multiple={false}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file)
                      setFormState({
                        ...formState,
                        image: await convertToBase64(file),
                      });
                  }}
                  data-testid="organisationImage"
                />
              </label>
              <button
                type="submit"
                className={styles.greenregbtn}
                value="invite"
                data-testid="submitOrganizationForm"
              >
                {t('createOrganization')}
              </button>
            </Form>
          </div>
        </section>
      </Modal>
    </>
  );
}

export default OrgList;
