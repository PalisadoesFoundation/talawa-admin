/*eslint-disable*/
import { useMutation, useQuery } from '@apollo/client';
import { Search, WarningAmberRounded } from '@mui/icons-material';
import {
  CREATE_FUND_MUTATION,
  REMOVE_FUND_MUTATION,
  UPDATE_FUND_MUTATION,
} from 'GraphQl/Mutations/FundMutation';
import Loader from 'components/Loader/Loader';
import { useState, type ChangeEvent } from 'react';
import { Button, Col, Dropdown, Form, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import type {
  InterfaceCreateFund,
  InterfaceFundInfo,
  InterfaceQueryOrganizationFunds,
} from 'utils/interfaces';
import FundCreateModal from './FundCreateModal';
import FundUpdateModal from './FundUpdateModal';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import styles from './OrganizationFunds.module.css';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  styled,
  tableCellClasses,
} from '@mui/material';
import dayjs from 'dayjs';
import { FUND_LIST } from 'GraphQl/Queries/fundQueries';

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

const organizationFunds = (): JSX.Element => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'funds',
  });

  const { orgId: currentUrl } = useParams();
  const navigate = useNavigate();
  const [fundCreateModalIsOpen, setFundCreateModalIsOpen] =
    useState<boolean>(false);
  const [fundUpdateModalIsOpen, setFundUpdateModalIsOpen] =
    useState<boolean>(false);

  const [taxDeductible, setTaxDeductible] = useState<boolean>(true);
  const [isArchived, setIsArchived] = useState<boolean>(false);
  const [isDefault, setIsDefault] = useState<boolean>(false);
  const [fund, setFund] = useState<InterfaceFundInfo | null>(null);
  const [formState, setFormState] = useState<InterfaceCreateFund>({
    fundName: '',
    fundRef: '',
  });

  const {
    data: fundData,
    loading: fundLoading,
    error: fundError,
    refetch: refetchFunds,
  }: {
    data?: {
      fundsByOrganization: InterfaceQueryOrganizationFunds[];
    };
    loading: boolean;
    error?: Error | undefined;
    refetch: any;
  } = useQuery(FUND_LIST, {
    variables: {
      organizationId: currentUrl,
    },
  });

  const [fullName, setFullName] = useState('');
  const handleSearch = (): void => {
    refetchFunds({ organizationId: currentUrl, filter: fullName });
  };

  const [createFund] = useMutation(CREATE_FUND_MUTATION);
  const [updateFund] = useMutation(UPDATE_FUND_MUTATION);
  const [deleteFund] = useMutation(REMOVE_FUND_MUTATION);

  const showCreateModal = (): void => {
    setFundCreateModalIsOpen(!fundCreateModalIsOpen);
  };
  const hideCreateModal = (): void => {
    setFundCreateModalIsOpen(!fundCreateModalIsOpen);
  };
  const showUpdateModal = (): void => {
    setFundUpdateModalIsOpen(!fundUpdateModalIsOpen);
  };
  const hideUpdateModal = (): void => {
    setFundUpdateModalIsOpen(!fundUpdateModalIsOpen);
  };
  const toggleDeleteModal = (): void => {
    setFundUpdateModalIsOpen(!fundUpdateModalIsOpen);
  };
  const handleEditClick = (fund: InterfaceFundInfo): void => {
    setFormState({
      fundName: fund.name,
      fundRef: fund.refrenceNumber,
    });
    setTaxDeductible(fund.taxDeductible);
    setIsArchived(fund.isArchived);
    setIsDefault(fund.isDefault);
    setFund(fund);
    showUpdateModal();
  };
  const createFundHandler = async (
    e: ChangeEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    try {
      await createFund({
        variables: {
          name: formState.fundName,
          refrenceNumber: formState.fundRef,
          organizationId: currentUrl,
          taxDeductible: taxDeductible,
          isArchived: isArchived,
          isDefault: isDefault,
        },
      });

      setFormState({
        fundName: '',
        fundRef: '',
      });
      toast.success(t('fundCreated'));
      refetchFunds();
      hideCreateModal();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
        console.log(error.message);
      }
    }
  };
  const updateFundHandler = async (
    e: ChangeEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    try {
      const updatedFields: { [key: string]: any } = {};
      if (formState.fundName != fund?.name) {
        updatedFields.name = formState.fundName;
      }
      if (formState.fundRef != fund?.refrenceNumber) {
        updatedFields.refrenceNumber = formState.fundRef;
      }
      if (taxDeductible != fund?.taxDeductible) {
        updatedFields.taxDeductible = taxDeductible;
      }
      if (isArchived != fund?.isArchived) {
        updatedFields.isArchived = isArchived;
      }
      if (isDefault != fund?.isDefault) {
        updatedFields.isDefault = isDefault;
      }

      await updateFund({
        variables: {
          id: fund?._id,
          ...updatedFields,
        },
      });
      setFormState({
        fundName: '',
        fundRef: '',
      });
      refetchFunds();
      hideUpdateModal();
      toast.success(t('fundUpdated'));
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
        console.log(error.message);
      }
    }
  };
  const deleteFundHandler = async (): Promise<void> => {
    try {
      await deleteFund({
        variables: {
          id: fund?._id,
        },
      });
      refetchFunds();
      toggleDeleteModal();
      toast.success(t('fundDeleted'));
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
        console.log(error.message);
      }
    }
  };

  const handleClick = (fundId: String) => {
    navigate(`/orgfundcampaign/${currentUrl}/${fundId}`);
  };

  if (fundLoading) {
    return <Loader size="xl" />;
  }
  if (fundError) {
    return (
      <div className={`${styles.container} bg-white rounded-4 my-3`}>
        <div className={styles.message} data-testid="errorMsg">
          <WarningAmberRounded className={styles.errorIcon} fontSize="large" />
          <h6 className="fw-bold text-danger text-center">
            Error occured while loading Funds
            <br />
            {fundError.message}
          </h6>
        </div>
      </div>
    );
  }

  return (
    <>
      <Row>
        <div className={styles.mainpageright}>
          <div className={styles.btnsContainer}>
            <div className={styles.input}>
              <Form.Control
                type="name"
                placeholder={t('searchFullName')}
                autoComplete="off"
                required
                className={styles.inputField}
                value={fullName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setFullName(e.target.value);
                }}
                data-testid="searchFullName"
              />
              <Button
                className={`position-absolute z-10 bottom-0 end-0  d-flex justify-content-center align-items-center `}
                onClick={handleSearch}
                data-testid="searchBtn"
                style={{ marginBottom: '10px' }}
              >
                <Search />
              </Button>
            </div>
            <div className={styles.btnsBlock}>
              <div className="d-flex justify-space-between">
                <Dropdown>
                  <Dropdown.Toggle
                    variant="success"
                    id="dropdown-basic"
                    className={styles.dropdown}
                    data-testid="filter"
                  >
                    <FilterAltOutlinedIcon className={'me-1'} />
                    {t('filter')}
                  </Dropdown.Toggle>
                </Dropdown>
              </div>
              <div>
                <Button
                  variant="success"
                  onClick={showCreateModal}
                  data-testid="createFundBtn"
                  className={styles.createFundBtn}
                >
                  <i className={'fa fa-plus me-2'} />
                  {t('createFund')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Row>
      <div className={styles.mainpageright}>
        <div className={`${styles.list_box}  bg-white rounded-4 my-3`}>
          {fundData?.fundsByOrganization &&
          fundData.fundsByOrganization.length > 0 ? (
            <div className={styles.list_box} data-testid="orgFunds">
              <TableContainer component={Paper} sx={{ minWidth: '820px' }}>
                <Table aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>#</StyledTableCell>
                      <StyledTableCell align="center">
                        {t('fundName')}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {t('createdBy')}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {t('createdOn')}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {t('status')}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {t('manageFund')}
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {fundData.fundsByOrganization.map(
                      (fund: any, index: number) => (
                        <StyledTableRow key={fund._id}>
                          <StyledTableCell component="th" scope="row">
                            {index + 1}
                          </StyledTableCell>
                          <StyledTableCell
                            align="center"
                            data-testid="fundName"
                            onClick={() => handleClick(fund._id)}
                          >
                            <span
                              style={{
                                color: 'rgba(23, 120, 242, 1)',
                                cursor: 'pointer',
                              }}
                            >
                              {fund.name}
                            </span>
                          </StyledTableCell>
                          <StyledTableCell
                            align="center"
                            data-testid="fundCreatedBy"
                          >
                            {fund.creator.firstName} {fund.creator.lastName}
                          </StyledTableCell>
                          <StyledTableCell
                            align="center"
                            data-testid="fundCreatedAt"
                          >
                            {dayjs(fund.createdAt).format('DD/MM/YYYY')}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            <Button
                              variant="outline-success"
                              disabled={true}
                              data-testid="fundtype"
                            >
                              {fund.isArchived
                                ? t('archived')
                                : t('nonArchive')}
                            </Button>
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            <Button
                              variant="success"
                              data-testid="editFundBtn"
                              onClick={() => handleEditClick(fund)}
                            >
                              Manage
                            </Button>
                          </StyledTableCell>
                        </StyledTableRow>
                      ),
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          ) : (
            <div>
              <h6 className="text-center text-danger">{t('noFundsFound')}</h6>
            </div>
          )}
        </div>
        {/* <FundCreateModal*/}
        <FundCreateModal
          fundCreateModalIsOpen={fundCreateModalIsOpen}
          hideCreateModal={hideCreateModal}
          formState={formState}
          setFormState={setFormState}
          createFundHandler={createFundHandler}
          taxDeductible={taxDeductible}
          setTaxDeductible={setTaxDeductible}
          isDefault={isDefault}
          setIsDefault={setIsDefault}
          t={t}
        />

        {/* <FundUpdateModal*/}
        <FundUpdateModal
          fundUpdateModalIsOpen={fundUpdateModalIsOpen}
          hideUpdateModal={hideUpdateModal}
          formState={formState}
          setFormState={setFormState}
          updateFundHandler={updateFundHandler}
          taxDeductible={taxDeductible}
          setTaxDeductible={setTaxDeductible}
          isArchived={isArchived}
          deleteFundHandler={deleteFundHandler}
          setIsArchived={setIsArchived}
          isDefault={isDefault}
          setIsDefault={setIsDefault}
          t={t}
        />
      </div>
    </>
  );
};

export default organizationFunds;
