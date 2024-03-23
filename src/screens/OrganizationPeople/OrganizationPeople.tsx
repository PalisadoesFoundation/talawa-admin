import { useLazyQuery } from '@apollo/client';
import { Search, Sort } from '@mui/icons-material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import {
  ORGANIZATIONS_MEMBER_CONNECTION_LIST,
  USER_LIST,
} from 'GraphQl/Queries/Queries';
import Loader from 'components/Loader/Loader';
import NotFound from 'components/NotFound/NotFound';
import OrgAdminListCard from 'components/OrgAdminListCard/OrgAdminListCard';
import OrgPeopleListCard from 'components/OrgPeopleListCard/OrgPeopleListCard';
import UserListCard from 'components/UserListCard/UserListCard';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Button, Dropdown, Form } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import AddMember from './AddMember';
import styles from './OrganizationPeople.module.css';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: ['#31bb6b', '!important'],
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(() => ({
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function organizationPeople(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationPeople',
  });

  document.title = t('title');

  const location = useLocation();
  const role = location?.state;

  const { orgId: currentUrl } = useParams();

  const [state, setState] = useState(role?.role || 0);

  const [filterData, setFilterData] = useState({
    firstName_contains: '',
    lastName_contains: '',
  });

  const [fullName, setFullName] = useState('');

  const {
    data: memberData,
    loading: memberLoading,
    error: memberError,
    refetch: memberRefetch,
  } = useLazyQuery(ORGANIZATIONS_MEMBER_CONNECTION_LIST, {
    variables: {
      firstName_contains: '',
      lastName_contains: '',
      orgId: currentUrl,
    },
  })[1];

  const {
    data: adminData,
    loading: adminLoading,
    error: adminError,
    refetch: adminRefetch,
  } = useLazyQuery(ORGANIZATIONS_MEMBER_CONNECTION_LIST, {
    variables: {
      firstName_contains: '',
      lastName_contains: '',
      orgId: currentUrl,
      admin_for: currentUrl,
    },
  })[1];

  const {
    data: usersData,
    loading: usersLoading,
    error: usersError,
    refetch: usersRefetch,
  } = useLazyQuery(USER_LIST, {
    variables: {
      firstName_contains: '',
      lastName_contains: '',
    },
  })[1];

  useEffect(() => {
    if (state === 0) {
      memberRefetch({
        ...filterData,
        orgId: currentUrl,
      });
    } else if (state === 1) {
      adminRefetch({
        ...filterData,
        orgId: currentUrl,
        admin_for: currentUrl,
      });
    } else {
      usersRefetch({
        ...filterData,
      });
    }
  }, [state]);

  /* istanbul ignore next */
  if (memberError || usersError || adminError) {
    const error = memberError ?? usersError ?? adminError;
    toast.error(error?.message);
  }

  const handleFullNameSearchChange = (e: any): void => {
    /* istanbul ignore next */
    if (e.key === 'Enter') {
      const [firstName, lastName] = fullName.split(' ');

      const newFilterData = {
        firstName_contains: firstName ?? '',
        lastName_contains: lastName ?? '',
      };

      setFilterData(newFilterData);

      if (state === 0) {
        memberRefetch({
          ...newFilterData,
          orgId: currentUrl,
        });
      } else if (state === 1) {
        adminRefetch({
          ...newFilterData,
          orgId: currentUrl,
          admin_for: currentUrl,
        });
      } else {
        usersRefetch({
          ...newFilterData,
        });
      }
    }
  };

  return (
    <>
      <Row className={styles.head}>
        <div className={styles.mainpageright}>
          <div className={styles.btnsContainer}>
            <div className={styles.input}>
              <Form.Control
                type="name"
                id="searchLastName"
                placeholder={t('searchFullName')}
                autoComplete="off"
                required
                className={styles.inputField}
                value={fullName}
                onChange={(e): void => {
                  const { value } = e.target;
                  setFullName(value);
                  handleFullNameSearchChange(value);
                }}
                onKeyUp={handleFullNameSearchChange}
              />
              <Button
                className={`position-absolute z-10 bottom-0 end-0  d-flex justify-content-center align-items-center `}
                onClick={handleFullNameSearchChange}
                style={{ marginBottom: '10px' }}
              >
                <Search />
              </Button>
            </div>
            <div className={styles.btnsBlock}>
              <Dropdown>
                <Dropdown.Toggle
                  variant="success"
                  id="dropdown-basic"
                  className={styles.dropdown}
                  data-testid="role"
                >
                  <Sort />
                  {t('sort')}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    inline
                    id="userslist"
                    value="userslist"
                    name="displaylist"
                    data-testid="users"
                    defaultChecked={state == 2 ? true : false}
                    onClick={(): void => {
                      setState(2);
                    }}
                  >
                    <Form.Label htmlFor="userslist">{t('users')}</Form.Label>
                  </Dropdown.Item>
                  <Dropdown.Item
                    inline
                    id="memberslist"
                    value="memberslist"
                    name="displaylist"
                    data-testid="members"
                    defaultChecked={state == 0 ? true : false}
                    onClick={(): void => {
                      setState(0);
                    }}
                  >
                    <label htmlFor="memberslist">{t('members')}</label>
                  </Dropdown.Item>
                  <Dropdown.Item
                    inline
                    id="adminslist"
                    value="adminslist"
                    name="displaylist"
                    data-testid="admins"
                    defaultChecked={state == 1 ? true : false}
                    onClick={(): void => {
                      setState(1);
                    }}
                  >
                    <label htmlFor="adminslist">{t('admins')}</label>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className={styles.btnsBlock}>
              <AddMember></AddMember>
            </div>
          </div>
        </div>
      </Row>
      <Col sm={9}>
        <div className={styles.mainpageright}>
          {memberLoading || usersLoading || adminLoading ? (
            <>
              <Loader />
            </>
          ) : (
            /* istanbul ignore next */
            <div className={styles.list_box} data-testid="orgpeoplelist">
              <Col sm={5}>
                <TableContainer component={Paper} sx={{ minWidth: '820px' }}>
                  <Table aria-label="customized table">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>#</StyledTableCell>
                        <StyledTableCell align="center">
                          Profile
                        </StyledTableCell>
                        <StyledTableCell align="center">Name</StyledTableCell>
                        <StyledTableCell align="center">Email</StyledTableCell>
                        <StyledTableCell align="center">Joined</StyledTableCell>
                        <StyledTableCell align="center">
                          Actions
                        </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {
                        /* istanbul ignore next */
                        state === 0 &&
                        memberData &&
                        memberData.organizationsMemberConnection.edges.length >
                          0 ? (
                          memberData.organizationsMemberConnection.edges.map(
                            (datas: any, index: number) => (
                              <StyledTableRow key={datas._id}>
                                <StyledTableCell component="th" scope="row">
                                  {index + 1}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                  {datas.image ? (
                                    <img
                                      src={datas.image}
                                      alt="memberImage"
                                      className="TableImage"
                                    />
                                  ) : (
                                    <img
                                      src="/images/svg/profiledefault.svg"
                                      alt="memberImage"
                                      className="TableImage"
                                    />
                                  )}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                  <Link
                                    className={styles.membername}
                                    to={`/member/${currentUrl}`}
                                    state={{ id: datas._id }}
                                  >
                                    {datas.firstName + ' ' + datas.lastName}
                                  </Link>
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                  {datas.email}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                  {dayjs(datas.createdAt).format('DD/MM/YYYY')}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                  <OrgPeopleListCard
                                    key={index}
                                    id={datas._id}
                                  />
                                </StyledTableCell>
                              </StyledTableRow>
                            ),
                          )
                        ) : /* istanbul ignore next */
                        state === 1 &&
                          adminData &&
                          adminData.organizationsMemberConnection.edges.length >
                            0 ? (
                          adminData.organizationsMemberConnection.edges.map(
                            (datas: any, index: number) => (
                              <StyledTableRow key={datas._id}>
                                <StyledTableCell component="th" scope="row">
                                  {index + 1}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                  {datas.image ? (
                                    <img
                                      src={datas.image}
                                      alt="memberImage"
                                      className="TableImage"
                                    />
                                  ) : (
                                    <img
                                      src="/images/svg/profiledefault.svg"
                                      alt="memberImage"
                                      className="TableImage"
                                    />
                                  )}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                  <Link
                                    className={styles.membername}
                                    to={`/member/${currentUrl}`}
                                    state={{ id: datas._id }}
                                  >
                                    {datas.firstName + ' ' + datas.lastName}
                                  </Link>
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                  {datas.email}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                  {dayjs(datas.createdAt).format('DD/MM/YYYY')}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                  <OrgAdminListCard
                                    key={index}
                                    id={datas._id}
                                  />
                                </StyledTableCell>
                              </StyledTableRow>
                            ),
                          )
                        ) : state === 2 &&
                          usersData &&
                          usersData.users.length > 0 ? (
                          usersData.users.map((datas: any, index: number) => (
                            <StyledTableRow key={datas._id}>
                              <StyledTableCell component="th" scope="row">
                                {index + 1}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {datas.image ? (
                                  <img
                                    src={datas.image}
                                    alt="memberImage"
                                    className="TableImage"
                                  />
                                ) : (
                                  <img
                                    src="/images/svg/profiledefault.svg"
                                    alt="memberImage"
                                    className="TableImage"
                                  />
                                )}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                <Link
                                  className={styles.membername}
                                  to={`/member/${currentUrl}`}
                                  state={{ id: datas._id }}
                                >
                                  {datas.firstName + ' ' + datas.lastName}
                                </Link>
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {datas.email}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {dayjs(datas.createdAt).format('DD/MM/YYYY')}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                <UserListCard key={index} id={datas._id} />
                              </StyledTableCell>
                            </StyledTableRow>
                          ))
                        ) : (
                          /* istanbul ignore next */
                          <NotFound
                            title={
                              state === 0
                                ? 'member'
                                : state === 1
                                  ? 'admin'
                                  : 'user'
                            }
                            keyPrefix="userNotFound"
                          />
                        )
                      }
                    </TableBody>
                  </Table>
                </TableContainer>
              </Col>
            </div>
          )}
        </div>
      </Col>
    </>
  );
}

export default organizationPeople;
