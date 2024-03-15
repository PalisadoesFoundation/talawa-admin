/*eslint-disable*/
import { useMutation, useQuery } from '@apollo/client';
import { WarningAmberRounded } from '@mui/icons-material';
import {
  CREATE_CAMPAIGN_MUTATION,
  DELETE_CAMPAIGN_MUTATION,
  UPDATE_CAMPAIGN_MUTATION,
} from 'GraphQl/Mutations/CampaignMutation';
import { FUND_CAMPAIGN } from 'GraphQl/Queries/fundQueries';
import Loader from 'components/Loader/Loader';
import dayjs from 'dayjs';
import { useState, type ChangeEvent } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { currencySymbols } from 'utils/currency';
import type {
  InterfaceCampaignInfo,
  InterfaceCreateCampaign,
  InterfaceQueryOrganizationFundCampaigns,
} from 'utils/interfaces';
import CampaignCreateModal from './CampaignCreateModal';
import CampaignDeleteModal from './CampaignDeleteModal';
import CampaignUpdateModal from './CampaignUpdateModal';
import styles from './OrganizationFundCampaign.module.css';

const orgFundCampaign = (): JSX.Element => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'fundCampaign',
  });
  const navigate = useNavigate();

  const { fundId: currentUrl, orgId: orgId } = useParams();
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

  const [createCampaign] = useMutation(CREATE_CAMPAIGN_MUTATION);
  const [updateCampaign] = useMutation(UPDATE_CAMPAIGN_MUTATION);
  const [deleteCampaign] = useMutation(DELETE_CAMPAIGN_MUTATION);

  const showCreateCampaignModal = (): void => {
    setcampaignCreateModalIsOpen(!campaignCreateModalIsOpen);
  };
  const hideCreateCampaignModal = (): void => {
    setcampaignCreateModalIsOpen(!campaignCreateModalIsOpen);
  };
  const showUpdateCampaignModal = (): void => {
    setcampaignUpdateModalIsOpen(!campaignUpdateModalIsOpen);
  };
  const hideUpdateCampaignModal = (): void => {
    setcampaignUpdateModalIsOpen(!campaignUpdateModalIsOpen);
  };
  const showDeleteCampaignModal = (): void => {
    setcampaignDeleteModalIsOpen(!campaignDeleteModalIsOpen);
  };
  const hideDeleteCampaignModal = (): void => {
    setcampaignDeleteModalIsOpen(!campaignDeleteModalIsOpen);
  };

  const handleEditClick = (campaign: InterfaceCampaignInfo): void => {
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
      console.log(formState);
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
      toast.success(t('createdCampaign'));
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
      toast.success(t('updatedCampaign'));
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
      toast.success(t('deletedCampaign'));
      refetchFundCampaign();
      hideDeleteCampaignModal();
    } catch (error: unknown) {
      toast.error((error as Error).message);
      console.log(error);
    }
  };

  const handleClick = (campaignId: String) => {
    navigate(`/fundCampaignPledge/${orgId}/${campaignId}`);
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
    <div className={styles.organizationFundCampaignContainer}>
      <Button
        variant="success"
        className={styles.orgFundCampaignButton}
        onClick={showCreateCampaignModal}
        data-testid="addCampaignBtn"
      >
        <i className={'fa fa-plus me-2'} />
        {t('addCampaign')}
      </Button>
      <div className={`${styles.container} bg-white rounded-4 `}>
        <div className="mx-1 my-4 py-4">
          <Row className="mx-4 border border-light-subtle rounded-top-4 py-3 justify-content-between shadow-sm">
            <Col xs={7} sm={2} md={3} lg={3} className=" fs-5 fw-bold">
              <div className="ms-2">{t('campaignName')} </div>
            </Col>
            <Col className="fs-5 fw-bold " md={2} sm={2}>
              <div className="ms-3">{t('startDate')} </div>
            </Col>
            <Col className="fs-5 fw-bold " sm={2} md={2}>
              <div className="ms-3">{t('endDate')}</div>
            </Col>
            <Col className="fs-5 fw-bold" md={2} sm={2}>
              <div className="ms-3">{t('fundingGoal')}</div>
            </Col>
            <Col xs={5} md={2} sm={2} lg={2} className="fs-5 fw-bold">
              <div className="ms-3">{t('campaignOptions')}</div>
            </Col>
          </Row>

          <div className="mx-4 bg-light-subtle border border-light-subtle border-top-0 rounded-bottom-4 shadow-sm ">
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
                    <div
                      className={` ${styles.campaignNameInfo} text-bg-body-tertiary:hover `}
                      onClick={() => handleClick(campaign._id)}
                    >
                      {campaign.name}
                    </div>
                  </Col>
                  <Col md={2} sm={2}>
                    <div>{dayjs(campaign.startDate).format('DD/MM/YYYY')} </div>
                  </Col>
                  <Col md={2} sm={2}>
                    <div>{dayjs(campaign.endDate).format('DD/MM/YYYY')} </div>
                  </Col>
                  <Col md={2} sm={2}>
                    <div className={`  ms-3  ps-3 align-self-center`}>
                      {`${currencySymbols[campaign.currency as keyof typeof currencySymbols]}${campaign.fundingGoal}`}
                    </div>
                  </Col>
                  <Col md={2} sm={2}>
                    <Button
                      size="sm"
                      data-testid="editCampaignBtn"
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
                      data-testid="deleteCampaignBtn"
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
                <h5>{t('noCampaigns')}</h5>
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
        t={t}
      />

      {/* Update Campaign Modal */}
      <CampaignUpdateModal
        campaignUpdateModalIsOpen={campaignUpdateModalIsOpen}
        hideUpdateCampaignModal={hideUpdateCampaignModal}
        formState={formState}
        setFormState={setFormState}
        updateCampaignHandler={updateCampaignHandler}
        t={t}
      />

      {/* Delete Campaign Modal */}
      <CampaignDeleteModal
        campaignDeleteModalIsOpen={campaignDeleteModalIsOpen}
        hideDeleteCampaignModal={hideDeleteCampaignModal}
        deleteCampaignHandler={deleteCampaignHandler}
        t={t}
      />
    </div>
  );
};
export default orgFundCampaign;
