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
    tags: '',
  });
  const [, setSearchByName] = useState('');

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
  const [create, { loading: loading_3 }] = useMutation(
    CREATE_ORGANIZATION_MUTATION
  );

  const {
    data: data_2,
    loading: loading_2,
    error: error_user,
  } = useQuery(USER_ORGANIZATION_LIST, {
    variables: { id: localStorage.getItem('id') },
  });

  const {
    data,
    loading,
    error: error_list,
    refetch,
  } = useQuery(ORGANIZATION_CONNECTION_LIST);

  const CreateOrg = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { name, descrip, location, visible, ispublic, tags } = formState;

    try {
      const tagsArray = tags.split(',').map((tag) => tag.trim());

      const { data } = await create({
        variables: {
          name: name,
          description: descrip,
          location: location,
          visibleInSearch: visible,
          isPublic: ispublic,
          tags: tagsArray,
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
          tags: '',
        });
      }
    } catch (error: any) {
      /* istanbul ignore next */
      toast.error(error.message);
    }
  };

  if (loading || loading_2 || loading_3) {
    return (
      <>
        <div className={styles.loader}></div>
      </>
    );
  }

  /* istanbul ignore next */
  if (error_list || error_user) {
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

  const handleSearchByName = (e: any) => {
    const { value } = e.target;
    setSearchByName(value);

    if (value.length === 0) {
      refetch({
        filter: '',
      });
    } else {
      setSearchByName(value);
      refetch({
        filter: value,
      });
    }
  };

  const debouncedHandleSearchByName = debounce(handleSearchByName);

  return (
    <>
      <ListNavbar />
      <Row>
        <Col xl={3}>
          <div className={styles.sidebar}>
            <div className={styles.sidebarsticky}>
              <h6 className={styles.logintitle}>{t('you')}</h6>
              <p>
                {t('name')}:
                <span>
                  {data_2?.user.firstName} {data_2?.user.lastName}
                </span>
              </p>
              <p>
                {t('designation')}:<span> {data_2?.user.userType}</span>
              </p>
              <p className={styles.userEmail}>
                {t('email')}:
                <p>
                  {data_2?.user.email.substring(
                    0,
                    data_2?.user.email.length / 2
                  )}
                  <span>
                    {data_2?.user.email.substring(
                      data_2?.user.email.length / 2,
                      data_2?.user.email.length
                    )}
                  </span>
                </p>
              </p>

              <h6 className={styles.searchtitle}>{t('searchByName')}</h6>
              <input
                type="name"
                id="orgname"
                placeholder="Enter Name"
                data-testid="searchByName"
                autoComplete="off"
                required
                onChange={debouncedHandleSearchByName}
              />
            </div>
          </div>
        </Col>
        <Col xl={8}>
          <div className={styles.mainpageright}>
            <Row className={styles.justifysp}>
              <p className={styles.logintitle}>{t('organizationList')}</p>
              <Button
                variant="success"
                className={styles.invitebtn}
                disabled={isSuperAdmin}
                onClick={showInviteModal}
                data-testid="createOrganizationBtn"
              >
                + {t('createOrganization')}
              </Button>
            </Row>
            <div className={styles.list_box}>
              {data &&
                (rowsPerPage > 0
                  ? data.organizationsConnection.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : data.organizationsConnection
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
                    return (
                      <SuperDashListCard
                        id={datas._id}
                        key={datas._id}
                        image={datas.image}
                        admins={datas.admins}
                        members={datas.members.length}
                        createdDate={dayjs(parseInt(datas?.createdAt)).format(
                          'DD/MM/YYYY'
                        )}
                        orgName={datas.name}
                        orgLocation={datas.location}
                      />
                    );
                  }
                )}
            </div>
            <div>
              <table>
                <tbody>
                  <tr>
                    <PaginationList
                      count={data ? data.organizationsConnection.length : 0}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Col>
      </Row>
      <Modal
        isOpen={modalisOpen}
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
                <i className="fa fa-times"></i>
              </a>
            </div>
            <Form onSubmitCapture={CreateOrg}>
              <label htmlFor="orgname">{t('name')}</label>
              <input
                type="name"
                id="orgname"
                placeholder="Enter Name"
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
                placeholder="Enter Description"
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
                placeholder="Enter Location"
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
              <label htmlFor="tags">{t('tags')}</label>
              <input
                type="text"
                id="tags"
                placeholder="Enter Tags"
                autoComplete="off"
                required
                value={formState.tags}
                onChange={(e) => {
                  setFormState({
                    ...formState,
                    tags: e.target.value,
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
                  //onChange=""
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
