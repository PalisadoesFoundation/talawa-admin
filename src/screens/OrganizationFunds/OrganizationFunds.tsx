/*eslint-disable*/
import { useMutation, useQuery } from '@apollo/client';
import { WarningAmberRounded } from '@mui/icons-material';
import {
  CREATE_FUND_MUTATION,
  REMOVE_FUND_MUTATION,
  UPDATE_FUND_MUTATION,
} from 'GraphQl/Mutations/FundMutation';
import { ORGANIZATION_FUNDS } from 'GraphQl/Queries/OrganizationQueries';
import Loader from 'components/Loader/Loader';
import { useEffect, useState, type ChangeEvent } from 'react';
import { Button, Col, Dropdown, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import type {
  InterfaceCreateFund,
  InterfaceFundInfo,
  InterfaceQueryOrganizationFunds,
} from 'utils/interfaces';
import FundArchiveModal from './FundArchiveModal';
import FundCreateModal from './FundCreateModal';
import FundDeleteModal from './FundDeleteModal';
import FundUpdateModal from './FundUpdateModal';
import styles from './OrganizationFunds.module.css';

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
  const [fundDeleteModalIsOpen, setFundDeleteModalIsOpen] =
    useState<boolean>(false);
  const [fundArchivedModalIsOpen, setFundArchivedModalIsOpen] =
    useState<boolean>(false);

  const [taxDeductible, setTaxDeductible] = useState<boolean>(true);
  const [isArchived, setIsArchived] = useState<boolean>(false);
  const [isDefault, setIsDefault] = useState<boolean>(false);
  const [fund, setFund] = useState<InterfaceFundInfo | null>(null);
  const [fundType, setFundType] = useState<string>('Non-Archived');
  const [click, setClick] = useState<boolean>(false);
  const [initialRender, setInitialRender] = useState(true);
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
      organizations: InterfaceQueryOrganizationFunds[];
    };
    loading: boolean;
    error?: Error | undefined;
    refetch: any;
  } = useQuery(ORGANIZATION_FUNDS, {
    variables: {
      id: currentUrl,
    },
  });
  console.log(fundData);

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
    setFundDeleteModalIsOpen(!fundDeleteModalIsOpen);
  };
  const toggleArchivedModal = (): void => {
    setFundArchivedModalIsOpen(!fundArchivedModalIsOpen);
  };
  const handleFundType = (type: string): void => {
    setFundType(type);
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
      toast.error((error as Error).message);
      console.log(error);
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
      toast.error((error as Error).message);
      console.log(error);
    }
  };
  const archiveFundHandler = async (): Promise<void> => {
    try {
      console.log('herere');
      await updateFund({
        variables: {
          id: fund?._id,
          isArchived: !fund?.isArchived,
        },
      });
      if (fundType == 'Non-Archived') toggleArchivedModal();
      refetchFunds();
      fund?.isArchived
        ? toast.success(t('fundUnarchived'))
        : toast.success(t('fundArchived'));
    } catch (error: unknown) {
      toast.error((error as Error).message);
      console.log(error);
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
      toast.error((error as Error).message);
      console.log(error);
    }
  };
  //it is used to rerender the component to use updated Fund in setState
  useEffect(() => {
    //do not execute it on initial render
    if (!initialRender) {
      archiveFundHandler();
    } else {
      setInitialRender(false);
    }
  }, [click]);

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
    <div className={styles.organizationFundContainer}>
      <Button
        variant="success"
        className={styles.createFundButton}
        onClick={showCreateModal}
        data-testid="createFundBtn"
      >
        <i className={'fa fa-plus me-2'} />
        {t('createFund')}
      </Button>

      <div className={`${styles.container}  bg-white rounded-4 my-3`}>
        <div className="mx-4 pt-4">
          <Dropdown
            aria-expanded="false"
            data-testid="type"
            className="d-flex mb-0"
          >
            <Dropdown.Toggle variant="outline-success" data-testid="fundtype">
              {fundType == 'Archived' ? 'Archived' : 'Non-Archived'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item
                onClick={(): void => handleFundType('Archived')}
                data-testid="Archived"
              >
                {t('archived')}
              </Dropdown.Item>
              <Dropdown.Item
                onClick={(): void => handleFundType('Non-Archived')}
                data-testid="Non-Archived"
              >
                {t('nonArchive')}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div className="mx-1 my-4">
          <div className="mx-4 shadow-sm rounded-top-4">
            <Row className="mx-0 border border-light-subtle rounded-top-4 py-3 justify-content-between">
              <Col xs={7} sm={4} md={3} lg={3} className=" fs-5 fw-bold">
                <div className="ms-2">{t('fundName')}</div>
              </Col>

              <Col xs={5} sm={3} lg={2} className="fs-5 fw-bold">
                <div className="ms-3">{t('fundOptions')}</div>
              </Col>
            </Row>
          </div>

          <div className="mx-4 bg-light-subtle border border-light-subtle border-top-0 rounded-bottom-4 shadow-md">
            {fundData?.organizations[0].funds
              ?.filter((fund) =>
                fundType === 'Archived' ? fund.isArchived : !fund.isArchived,
              )
              .map((fundd, index) => (
                <div key={index}>
                  <Row
                    className={`${index === 0 ? 'pt-3' : ''} mb-3 ms-2 justify-content-between `}
                  >
                    <Col
                      sm={4}
                      xs={7}
                      md={3}
                      lg={3}
                      className={`align-self-center fw-bold ${styles.fundName}`}
                    >
                      <div
                        className="fw-bold cursor-pointer"
                        onClick={() => {
                          handleClick(fundd._id);
                        }}
                      >
                        {fundd.name}
                      </div>
                    </Col>

                    <Col xs={5} sm={3} lg={2} className="p-0">
                      <Button
                        data-testid="archiveFundBtn"
                        className="btn btn-sm me-2"
                        variant="outline-secondary"
                        onClick={async () => {
                          setFund(fundd);
                          if (fundType === 'Non-Archived') {
                            toggleArchivedModal();
                          } else {
                            setClick(!click);
                          }
                        }}
                      >
                        <i
                          className={`${fundType == 'Archived' ? 'fa fa-undo' : 'fa fa-archive'}`}
                        ></i>
                      </Button>

                      {fundType === 'Non-Archived' ? (
                        <Button
                          size="sm"
                          data-testid="editFundBtn"
                          onClick={() => handleEditClick(fundd)}
                          className="me-2"
                          variant="success"
                        >
                          {' '}
                          <i className="fas fa-edit"></i>
                        </Button>
                      ) : null}
                      <Button
                        size="sm"
                        data-testid="deleteFundBtn"
                        variant="danger"
                        onClick={() => {
                          setFund(fundd);
                          toggleDeleteModal();
                        }}
                      >
                        {' '}
                        <i className="fa fa-trash"></i>
                      </Button>
                    </Col>
                  </Row>

                  {fundData?.organizations[0]?.funds &&
                    index !== fundData.organizations[0].funds.length - 1 && (
                      <hr className="mx-3" />
                    )}
                </div>
              ))}

            {fundData?.organizations[0].funds?.length === 0 && (
              <div className="lh-lg text-center fw-semibold text-body-tertiary">
                {t('noFunds')}
              </div>
            )}
          </div>
        </div>
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
        setIsArchived={setIsArchived}
        isDefault={isDefault}
        setIsDefault={setIsDefault}
        t={t}
      />

      {/* <FundDeleteModal*/}
      <FundDeleteModal
        fundDeleteModalIsOpen={fundDeleteModalIsOpen}
        deleteFundHandler={deleteFundHandler}
        toggleDeleteModal={toggleDeleteModal}
        t={t}
      />

      {/* <FundArchiveModal*/}
      <FundArchiveModal
        fundArchiveModalIsOpen={fundArchivedModalIsOpen}
        archiveFundHandler={archiveFundHandler}
        toggleArchiveModal={toggleArchivedModal}
        t={t}
      />
    </div>
  );
};

export default organizationFunds;
