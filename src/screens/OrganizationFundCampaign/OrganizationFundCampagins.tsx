/*eslint-disable*/
import { useMutation, useQuery } from '@apollo/client';
import { Search, WarningAmberRounded } from '@mui/icons-material';
import {
  CREATE_CAMPAIGN_MUTATION,
  DELETE_CAMPAIGN_MUTATION,
  UPDATE_CAMPAIGN_MUTATION,
} from 'GraphQl/Mutations/CampaignMutation';
import { FUND_CAMPAIGN } from 'GraphQl/Queries/fundQueries';
import Loader from 'components/Loader/Loader';
import dayjs from 'dayjs';
import { useState, type ChangeEvent } from 'react';
import { Button, Col, Row, Dropdown, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { currencySymbols } from 'utils/currency';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import type {
  InterfaceCampaignInfo,
  InterfaceCreateCampaign,
  InterfaceQueryOrganizationFundCampaigns,
} from 'utils/interfaces';
import CampaignCreateModal from './CampaignCreateModal';
import CampaignDeleteModal from './CampaignDeleteModal';
import CampaignUpdateModal from './CampaignUpdateModal';
import styles from './OrganizationFundCampaign.module.css';
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
    setFormState({
      campaignName: '',
      campaignCurrency: 'USD',
      campaignGoal: 0,
      campaignStartDate: new Date(),
      campaignEndDate: new Date(),
    });
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
      if (error instanceof Error) {
        toast.error(error.message);
        console.log(error.message);
      }
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
      if (error instanceof Error) {
        toast.error(error.message);
        console.log(error.message);
      }
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
      if (error instanceof Error) {
        toast.error(error.message);
        console.log(error.message);
      }
    }
  };

  const handleClick = (campaignId: String) => {
    navigate(`/fundCampaignPledge/${orgId}/${campaignId}`);
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [searchText, setSearchText] = useState('');
  const filteredCampaigns = fundCampaignData?.getFundById.campaigns.filter(
    (campaign) =>
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (fundCampaignLoading) {
    return <Loader size="xl" />;
  }
  if (fundCampaignError) {
    return (
      <div className={`${styles.container} bg-white rounded-4 my-3`}>
        <div className={styles.message} data-testid="errorMsg">
          <WarningAmberRounded className={styles.errorIcon} fontSize="large" />
          <h6 className="fw-bold text-danger text-center">
            Error occured while loading Campaigns
            <br />
            {fundCampaignError.message}
          </h6>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.organizationFundCampaignContainer}>
      <div className={styles.btnsContainer}>
        <div className={styles.input}>
          <Form.Control
            type="name"
            placeholder={t('searchFullName')}
            autoComplete="off"
            required
            className={styles.inputField}
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
            data-testid="searchFullName"
          />
          <Button
            className={`position-absolute z-10 bottom-0 end-0  d-flex justify-content-center align-items-center `}
            onClick={() => setSearchQuery(searchText)}
            data-testid="searchBtn"
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
              className={styles.orgFundCampaignButton}
              onClick={showCreateCampaignModal}
              data-testid="addCampaignBtn"
            >
              <i className={'fa fa-plus me-2'} />
              {t('addCampaign')}
            </Button>
          </div>
        </div>
      </div>

      <div>
        {filteredCampaigns && filteredCampaigns.length > 0 ? (
          <div className="my-4">
            <TableContainer
              component={Paper}
              sx={{
                borderRadius: '16px',
              }}
            >
              <Table aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>#</StyledTableCell>
                    <StyledTableCell align="center">
                      {t('campaignName')}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {t('startDate')}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {t('endDate')}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {t('fundingGoal')}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {t('campaignOptions')}
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCampaigns.map((campaign, index) => (
                    <StyledTableRow key={campaign._id}>
                      <StyledTableCell component="th" scope="row">
                        {index + 1}
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        data-testid="campaignName"
                        onClick={() => handleClick(campaign._id)}
                      >
                        <span
                          style={{
                            color: 'rgba(23, 120, 242, 1)',
                            cursor: 'pointer',
                          }}
                        >
                          {campaign.name}
                        </span>
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        data-testid="campaignStartDate"
                      >
                        {dayjs(campaign.startDate).format('DD/MM/YYYY')}
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        data-testid="campaignEndDate"
                      >
                        {dayjs(campaign.endDate).format('DD/MM/YYYY')}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <span className={`${styles.goalButton}`}>
                          {`${currencySymbols[campaign.currency as keyof typeof currencySymbols]}${campaign.fundingGoal}`}
                        </span>
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <Button
                          size="sm"
                          data-testid="editCampaignBtn"
                          className="p-2 w-75"
                          variant="success"
                          onClick={() => {
                            // setCampaign(campaign);
                            handleEditClick(campaign);
                          }}
                        >
                          <span>Manage</span>
                        </Button>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        ) : (
          <div className="pt-4 text-center fw-semibold text-body-tertiary">
            <h5>{t('noCampaigns')}</h5>
          </div>
        )}
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
        showDeleteCampaignModal={showDeleteCampaignModal}
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
