/* eslint-disable */
import { useMutation, useQuery } from '@apollo/client';
import {
  CREATE_FUND_MUTATION,
  UPDATE_FUND_MUTATION,
} from 'GraphQl/Mutations/FundMutation';
import { ORGANIZATION_FUNDS } from 'GraphQl/Queries/OrganizationQueries';
import Loader from 'components/Loader/Loader';
import OrganizationScreen from 'components/OrganizationScreen/OrganizationScreen';
import { ChangeEvent, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import {
  InterfaceCreateFund,
  InterfaceFundInfo,
  InterfaceQueryOrganizationFunds,
} from 'utils/interfaces';
import FundCreateModal from './FundCreateModal';
import FundUpdateModal from './FundUpdateModal';
import styles from './OrganizationFunds.module.css';

const organizationFunds = (): JSX.Element => {
  const currentUrl = window.location.href.split('=')[1];

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

  const [createFund] = useMutation(CREATE_FUND_MUTATION);
  const [updateFund] = useMutation(UPDATE_FUND_MUTATION);

  const createFundHandler = async (
    e: ChangeEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    try {
      await createFund({
        variables: {
          name: formState.fundName,
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
      refetchFunds();
      hideCreateModal();
      toast.success('Fund Created Successfully');
    } catch (error: unknown) {
      console.error(error);
      toast.error((error as Error).message);
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
      toast.success('Fund Updated Successfully');
    } catch (error: unknown) {
      console.error(error);
      toast.error((error as Error).message);
    }
  };

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
  const handleEditClick = (fund: InterfaceFundInfo) => {
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

  if (fundLoading) {
    return <Loader size="xl" />;
  }
  return (
    <div className={styles.organizationFundContainer}>
      <OrganizationScreen screenName="OrganizationFunds" title="Funds">
        <Button
          variant="success"
          className={styles.createFundButton}
          onClick={showCreateModal}
        >
          <i className={'fa fa-plus me-2'} />
          Create
        </Button>
        <div className={`${styles.container}  bg-white rounded-4 my-3`}>
          <div className="mx-1 my-4">
            <div className="mx-4 shadow-sm rounded-top-4">
              <Row className="mx-0 border border-light-subtle rounded-top-4 py-3 justify-content-between">
                <Col xs={7} sm={4} md={3} lg={3} className=" fs-5 fw-bold">
                  <div className="ms-2">Name</div>
                </Col>

                <Col xs={5} sm={3} lg={2} className="fs-5 fw-bold">
                  <div className="ms-3">Options</div>
                </Col>
              </Row>
            </div>

            <div className="mx-4 bg-light-subtle border border-light-subtle border-top-0 rounded-bottom-4 shadow-sm">
              {fundData?.organizations[0].funds
                ?.filter((fund) => !fund.isArchived)
                .map((fund, index) => (
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
                        <div className="fw-bold cursor-pointer">
                          {fund.name}
                        </div>
                      </Col>

                      <Col xs={5} sm={3} lg={2} className="p-0">
                        <Button
                          data-testid="previewActionItemModalBtn"
                          className="btn btn-sm me-2"
                          variant="outline-secondary"
                          // onClick={() => showPreviewModal(actionItem)}
                        >
                          <i className="fa fa-archive"></i>
                        </Button>
                        <Button
                          size="sm"
                          data-testid="editActionItemModalBtn"
                          onClick={() => handleEditClick(fund)}
                          className="me-2"
                          variant="success"
                        >
                          {' '}
                          <i className="fas fa-edit"></i>
                        </Button>
                        <Button
                          size="sm"
                          data-testid="deleteActionItemModalBtn"
                          variant="danger"
                          // onClick={() => {
                          //   setActionItemId(actionItem._id);
                          //   toggleDeleteModal();
                          // }}
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
                  No funds found
                </div>
              )}
            </div>
          </div>
        </div>
      </OrganizationScreen>

      {/* <FundCreateModal*/}
      <FundCreateModal
        fundCreateModalIsOpen={fundCreateModalIsOpen}
        hideCreateModal={hideCreateModal}
        formState={formState}
        setFormState={setFormState}
        createFundHandler={createFundHandler}
        taxDeductible={taxDeductible}
        setTaxDeductible={setTaxDeductible}
        isArchived={isArchived}
        setIsArchived={setIsArchived}
        isDefault={isDefault}
        setIsDefault={setIsDefault}
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
      />
    </div>
  );
};

export default organizationFunds;
