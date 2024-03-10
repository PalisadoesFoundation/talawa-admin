/*eslint-disable*/
import { useMutation, useQuery } from '@apollo/client';
import {
  CREATE_CAMPAIGN_MUTATION,
  DELETE_CAMPAIGN_MUTATION,
  UPDATE_CAMPAIGN_MUTATION,
} from 'GraphQl/Mutations/CampaignMutation';
import { FUND_CAMPAIGN } from 'GraphQl/Queries/fundQueries';
import Loader from 'components/Loader/Loader';
import dayjs from 'dayjs';
import { ChangeEvent, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { currencySymbols } from 'utils/currency';
import {
  InterfaceCampaignInfo,
  InterfaceCreateCampaign,
  InterfaceQueryOrganizationFundCampaigns,
} from 'utils/interfaces';
import CampaignCreateModal from './CampaignCreateModal';
import CampaignDeleteModal from './CampaignDeleteModal';
import CampaignUpdateModal from './CampaignUpdateModal';
import styles from './OrganizationFundCampaign.module.css';
import { WarningAmberRounded } from '@mui/icons-material';

const orgFundCampaign = (): JSX.Element => {
  const { fundId: currentUrl } = useParams();
  const [campaignCreateModalIsOpen, setcampaignCreateModalIsOpen] =
    useState<boolean>(false);
  const [campaignUpdateModalIsOpen, setcampaignUpdateModalIsOpen] =
    useState<boolean>(false);
  const [campaignDeleteModalIsOpen, setcampaignDeleteModalIsOpen] =
    useState<boolean>(false);

  const [campaign, setCampaign] = useState<InterfaceCampaignInfo | null>(null);
  const [formState, setFormState] = useState<InterfaceCreateCampaign>({
    campaignName: '',
    campaignCurrency: 'USD',
    campaignGoal: 0,
    campaignStartDate: new Date(),
    campaignEndDate: new Date(),
  });
  const {
    data: fundCampaignData,
    loading: fundCampaignLoading,
    error: fundCampaignError,
    refetch: refetchFundCampaign,
  }: {
    data?: {
      getFundById: InterfaceQueryOrganizationFundCampaigns;
    };
    loading: boolean;
    error?: Error | undefined;
    refetch: any;
  } = useQuery(FUND_CAMPAIGN, {
    variables: {
      id: currentUrl,
    },
  });
  console.log(fundCampaignData?.getFundById);

  const [createCampaign] = useMutation(CREATE_CAMPAIGN_MUTATION);
  const [updateCampaign] = useMutation(UPDATE_CAMPAIGN_MUTATION);
  const [deleteCampaign] = useMutation(DELETE_CAMPAIGN_MUTATION);

  const showCreateCampaignModal = () => {
    setcampaignCreateModalIsOpen(!campaignCreateModalIsOpen);
  };
  const hideCreateCampaignModal = () => {
    setcampaignCreateModalIsOpen(!campaignCreateModalIsOpen);
  };
  const showUpdateCampaignModal = () => {
    setcampaignUpdateModalIsOpen(!campaignUpdateModalIsOpen);
  };
  const hideUpdateCampaignModal = () => {
    setcampaignUpdateModalIsOpen(!campaignUpdateModalIsOpen);
  };
  const showDeleteCampaignModal = () => {
    setcampaignDeleteModalIsOpen(!campaignDeleteModalIsOpen);
  };
  const hideDeleteCampaignModal = () => {
    setcampaignDeleteModalIsOpen(!campaignDeleteModalIsOpen);
  };

  const handleEditClick = (campaign: InterfaceCampaignInfo) => {
    setFormState({
      campaignName: campaign.name,
      campaignCurrency: campaign.currency,
      campaignGoal: campaign.fundingGoal,
      campaignStartDate: new Date(campaign.startDate),
      campaignEndDate: new Date(campaign.endDate),
    });
    setCampaign(campaign);
    showUpdateCampaignModal();
  };

  const createCampaignHandler = async (
    e: ChangeEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    try {
      await createCampaign({
        variables: {
          name: formState.campaignName,
          currency: formState.campaignCurrency,
          fundingGoal: formState.campaignGoal,
          startDate: dayjs(formState.campaignStartDate).format('YYYY-MM-DD'),
          endDate: dayjs(formState.campaignEndDate).format('YYYY-MM-DD'),
          fundId: currentUrl,
        },
      });
      toast.success('Campaign Created Successfully');
      setFormState({
        campaignName: '',
        campaignCurrency: 'USD',
        campaignGoal: 0,
        campaignStartDate: new Date(),
        campaignEndDate: new Date(),
      });
      refetchFundCampaign();
      hideCreateCampaignModal();
    } catch (error: unknown) {
      toast.error((error as Error).message);
      console.log(error);
    }
  };

  const updateCampaignHandler = async (
    e: ChangeEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    try {
      const updatedFields: { [key: string]: any } = {};
      if (campaign?.name !== formState.campaignName) {
        updatedFields.name = formState.campaignName;
      }
      if (campaign?.currency !== formState.campaignCurrency) {
        updatedFields.currency = formState.campaignCurrency;
      }
      if (campaign?.fundingGoal !== formState.campaignGoal) {
        updatedFields.fundingGoal = formState.campaignGoal;
      }
      if (campaign?.startDate !== formState.campaignStartDate) {
        updatedFields.startDate = dayjs(formState.campaignStartDate).format(
          'YYYY-MM-DD',
        );
      }
      if (campaign?.endDate !== formState.campaignEndDate) {
        updatedFields.endDate = dayjs(formState.campaignEndDate).format(
          'YYYY-MM-DD',
        );
      }
      await updateCampaign({
        variables: {
          id: campaign?._id,
          ...updatedFields,
        },
      });
      setFormState({
        campaignName: '',
        campaignCurrency: 'USD',
        campaignGoal: 0,
        campaignStartDate: new Date(),
        campaignEndDate: new Date(),
      });
      refetchFundCampaign();
      hideUpdateCampaignModal();
      toast.success('Campaign Updated Successfully');
    } catch (error: unknown) {
      toast.error((error as Error).message);
      console.log(error);
    }
  };

  const deleteCampaignHandler = async (): Promise<void> => {
    try {
      await deleteCampaign({
        variables: {
          id: campaign?._id,
        },
      });
      toast.success('Campaign Deleted Successfully');
      refetchFundCampaign();
      hideDeleteCampaignModal();
    } catch (error: unknown) {
      toast.error((error as Error).message);
      console.log(error);
    }
  };
  if (fundCampaignLoading) {
    return <Loader size="xl" />;
  }
  if (fundCampaignError) {
    return (
      <div className={`${styles.container} bg-white rounded-4 my-3`}>
        <div className={styles.message} data-testid="errorMsg">
          <WarningAmberRounded className={styles.errorIcon} fontSize="large" />
          <h6 className="fw-bold text-danger text-center">
            Error occured while loading Funds
            <br />
            {fundCampaignError.message}
          </h6>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.organizationFundCampaign}>
      <Button
        variant="success"
        className={styles.orgFundCampaignButton}
        onClick={showCreateCampaignModal}
      >
        <i className={'fa fa-plus me-2'} />
        Add Campaign
      </Button>
      <div className={`${styles.container} bg-white rounded-4 `}>
        <div className="mx-1 my-4 py-4">
          <div className="mx-4 shadow-sm rounded-top-4">
            <Row className="mx-0 border border-light-subtle rounded-top-4 py-3 justify-content-between">
              <Col xs={7} sm={2} md={3} lg={3} className=" fs-5 fw-bold">
                <div className="ms-2">Campaign Name</div>
              </Col>
              <Col className="fs-5 fw-bold " md={2} sm={2}>
                <div className="ms-3">StartDate</div>
              </Col>
              <Col className="fs-5 fw-bold " sm={2} md={2}>
                <div className="ms-3">EndDate</div>
              </Col>
              <Col className="fs-5 fw-bold" md={2} sm={2}>
                <div className="ms-3">Funding Goal</div>
              </Col>
              <Col xs={5} md={2} sm={2} lg={2} className="fs-5 fw-bold">
                <div className="ms-3">Options</div>
              </Col>
            </Row>
          </div>
          <div className="mx-4 bg-light-subtle border border-light-subtle border-top-0 rounded-bottom-4 shadow-sm">
            {fundCampaignData?.getFundById.campaigns.map((campaign, index) => (
              <div key={index}>
                <Row
                  className={`${index === 0 ? 'pt-3' : ' '} ms-2 mb-3 justify-content-between `}
                >
                  <Col
                    xs={7}
                    sm={2}
                    md={3}
                    lg={3}
                    className="align-self-center"
                  >
                    <div className={` ${styles.campaignInfo} cursor-pointer`}>
                      {campaign.name}
                    </div>
                  </Col>
                  <Col md={2} sm={2}>
                    <div className={`${styles.campaignInfo}`}>
                      {dayjs(campaign.startDate).format('DD/MM/YYYY')}{' '}
                    </div>
                  </Col>
                  <Col md={2} sm={2}>
                    <div className={`${styles.campaignInfo}`}>
                      {dayjs(campaign.endDate).format('DD/MM/YYYY')}{' '}
                    </div>
                  </Col>
                  <Col md={2} sm={2}>
                    <div
                      className={`  ${styles.campaignInfo} ms-3  ps-3] align-self-center`}
                    >
                      {`${currencySymbols[campaign.currency as keyof typeof currencySymbols]}${campaign.fundingGoal}`}
                    </div>
                  </Col>
                  <Col md={2} sm={2}>
                    <Button
                      data-testid="archiveFundBtn"
                      className="btn btn-sm me-2"
                      variant="outline-secondary"
                    >
                      <i className={`fa fa-undo`}></i>
                    </Button>

                    <Button
                      size="sm"
                      data-testid="editFundBtn"
                      className="me-2"
                      variant="success"
                      onClick={() => {
                        handleEditClick(campaign);
                      }}
                    >
                      {' '}
                      <i className="fas fa-edit"></i>
                    </Button>

                    <Button
                      size="sm"
                      data-testid="deleteFundBtn"
                      variant="danger"
                      onClick={() => {
                        setCampaign(campaign);
                        showDeleteCampaignModal();
                      }}
                    >
                      {' '}
                      <i className="fa fa-trash"></i>
                    </Button>
                  </Col>
                </Row>
                {fundCampaignData.getFundById.campaigns &&
                  index !==
                    fundCampaignData.getFundById.campaigns.length - 1 && (
                    <hr className="mx-3" />
                  )}
              </div>
            ))}

            {fundCampaignData?.getFundById.campaigns.length === 0 && (
              <div className="pt-2 text-center fw-semibold text-body-tertiary">
                <h5>No Campaigns Found</h5>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Campaign Modal */}
      <CampaignCreateModal
        campaignCreateModalIsOpen={campaignCreateModalIsOpen}
        hideCreateCampaignModal={hideCreateCampaignModal}
        createCampaignHandler={createCampaignHandler}
        formState={formState}
        setFormState={setFormState}
      />

      {/* Update Campaign Modal */}
      <CampaignUpdateModal
        campaignUpdateModalIsOpen={campaignUpdateModalIsOpen}
        hideUpdateCampaignModal={hideUpdateCampaignModal}
        formState={formState}
        setFormState={setFormState}
        updateCampaignHandler={updateCampaignHandler}
      />

      {/* Delete Campaign Modal */}
      <CampaignDeleteModal
        campaignDeleteModalIsOpen={campaignDeleteModalIsOpen}
        hideDeleteCampaignModal={hideDeleteCampaignModal}
        deleteCampaignHandler={deleteCampaignHandler}
      />
    </div>
  );
};
export default orgFundCampaign;
