/*eslint-disable*/
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_PlEDGE, UPDATE_PLEDGE } from 'GraphQl/Mutations/PledgeMutation';
import { FUND_CAMPAIGN_PLEDGE } from 'GraphQl/Queries/fundQueries';
import dayjs from 'dayjs';
import { useState, type ChangeEvent } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { currencySymbols } from 'utils/currency';
import {
  InterfaceCreatePledge,
  InterfacePledgeInfo,
  InterfaceQueryFundCampaignsPledges,
} from 'utils/interfaces';
import useLocalStorage from 'utils/useLocalstorage';
import styles from './FundCampaignPledge.module.css';
import PledgeCreateModal from './PledgeCreateModal';
import PledgeEditModal from './PledgeEditModal';

const fundCampaignPledge = () => {
  const { fundCampaignId: currentUrl } = useParams();
  const { getItem } = useLocalStorage();

  const [createPledgeModalIsOpen, setCreatePledgeModalIsOpen] =
    useState<boolean>(false);
  const [updatePledgeModalIsOpen, setUpdatePledgeModalIsOpen] =
    useState<boolean>(false);
  const [pledge, setPledge] = useState<InterfacePledgeInfo | null>(null);

  const [formState, setFormState] = useState<InterfaceCreatePledge>({
    pledgeAmount: 0,
    pledgeCurrency: 'USD',
    pledgeEndDate: new Date(),
    pledgeStartDate: new Date(),
  });
  const [createPledge] = useMutation(CREATE_PlEDGE);
  const [updatePledge] = useMutation(UPDATE_PLEDGE);

  const {
    data: fundCampaignPledgeData,
    loading: fundCampaignPledgeLoading,
    error: fundCampaignPledgeError,
    refetch: refetchFundCampaignPledge,
  }: {
    data?: {
      getFundraisingCampaignById: InterfaceQueryFundCampaignsPledges;
    };
    loading: boolean;
    error?: Error | undefined;
    refetch: any;
  } = useQuery(FUND_CAMPAIGN_PLEDGE, {
    variables: {
      id: currentUrl,
    },
  });
  console.log(fundCampaignPledgeData);

  const showCreatePledgeModal = (): void => {
    setCreatePledgeModalIsOpen(true);
  };
  const hideCreatePledgeModal = (): void => {
    setCreatePledgeModalIsOpen(false);
  };
  const showUpdatePledgeModal = (): void => {
    setUpdatePledgeModalIsOpen(true);
  };
  const hideUpdatePledgeModal = (): void => {
    setUpdatePledgeModalIsOpen(false);
  };
  const handleEditClick = (pledge: InterfacePledgeInfo): void => {
    setFormState({
      pledgeAmount: pledge.amount,
      pledgeCurrency: pledge.currency,
      pledgeEndDate: new Date(pledge.endDate),
      pledgeStartDate: new Date(pledge.startDate),
    });
    setPledge(pledge);
    showUpdatePledgeModal();
  };
  const createPledgeHandler = async (
    e: ChangeEvent<HTMLFormElement>,
  ): Promise<void> => {
    try {
      e.preventDefault();
      const userId = getItem('userId');
      await createPledge({
        variables: {
          campaignId: currentUrl,
          amount: formState.pledgeAmount,
          currency: formState.pledgeCurrency,
          startDate: dayjs(formState.pledgeStartDate).format('YYYY-MM-DD'),
          endDate: dayjs(formState.pledgeEndDate).format('YYYY-MM-DD'),
          userIds: [userId],
        },
      });
      await refetchFundCampaignPledge();
      hideCreatePledgeModal();
      toast.success('Pledge Created Successfully');
      setFormState({
        pledgeAmount: 0,
        pledgeCurrency: 'USD',
        pledgeEndDate: new Date(),
        pledgeStartDate: new Date(),
      });
    } catch (error: unknown) {
      toast.error((error as Error).message);
      console.log(error);
    }
  };
  const updatePledgeHandler = async (
    e: ChangeEvent<HTMLFormElement>,
  ): Promise<void> => {
    try {
      e.preventDefault();
      const userId = getItem('userId');
      const updatedFields: { [key: string]: any } = {};
      if (formState.pledgeAmount !== pledge?.amount) {
        updatedFields.amount = formState.pledgeAmount;
      }
      if (formState.pledgeCurrency !== pledge?.currency) {
        updatedFields.currency = formState.pledgeCurrency;
      }
      if (
        dayjs(formState.pledgeStartDate).format('YYYY-MM-DD') !==
        dayjs(pledge?.startDate).format('YYYY-MM-DD')
      ) {
        updatedFields.startDate = dayjs(formState.pledgeStartDate).format(
          'YYYY-MM-DD',
        );
      }
      if (
        dayjs(formState.pledgeEndDate).format('YYYY-MM-DD') !==
        dayjs(pledge?.endDate).format('YYYY-MM-DD')
      ) {
        updatedFields.endDate = dayjs(formState.pledgeEndDate).format(
          'YYYY-MM-DD',
        );
      }

      await updatePledge({
        variables: {
          id: pledge?._id,
          ...updatedFields,
        },
      });
      await refetchFundCampaignPledge();
      hideUpdatePledgeModal();
      toast.success('Pledge Updated Successfully');
    } catch (error: unknown) {
      toast.error((error as Error).message);
      console.log(error);
    }
  };

  return (
    <div className={styles.pledgeContainer}>
      <Button
        variant="success"
        className={styles.createPledgeBtn}
        onClick={showCreatePledgeModal}
        data-testid="addCampaignBtn"
      >
        <i className={'fa fa-plus me-2'} />
        Add Pledge
      </Button>
      <div className={`${styles.container} bg-white rounded-4 `}>
        <div className="mx-1 my-4 py-4">
          <Row className="mx-4 border border-light-subtle rounded-top-4 py-3 justify-content-between shadow-sm">
            <Col xs={7} sm={2} md={3} lg={3} className=" fw-bold">
              <div className="ms-2">Volunteers</div>
            </Col>
            <Col className=" fw-bold " md={2} sm={2}>
              <div className="ms-3">StartDate</div>
            </Col>
            <Col className=" fw-bold " sm={2} md={2}>
              <div className="ms-3">EndDate</div>
            </Col>
            <Col className=" fw-bold" md={2} sm={2}>
              <div className="ms-3">Pledged</div>
            </Col>
            <Col xs={5} md={2} sm={2} lg={2} className=" fw-bold">
              <div className="ms-3">Options</div>
            </Col>
          </Row>
          <div className="mx-4 bg-light-subtle border border-light-subtle border-top-0 rounded-bottom-4 shadow-sm">
            {fundCampaignPledgeData?.getFundraisingCampaignById.pledges.map(
              (pledge, index) => (
                <div key={index}>
                  <Row
                    className={`${index == 0 ? 'pt-3' : ''} mb-3 ms-2 justify-content-between `}
                  >
                    <Col xs={7} sm={2} md={3} lg={3}>
                      <div className="">
                        {pledge.users.map((user, index) => (
                          <span key={index}>
                            {user.firstName}
                            {index !== pledge.users.length - 1 && ', '}
                          </span>
                        ))}
                      </div>
                    </Col>
                    <Col sm={2} md={2}>
                      <div className="ms-1">
                        {new Date(pledge.startDate).toLocaleDateString()}
                      </div>
                    </Col>
                    <Col sm={2} md={2}>
                      <div>{new Date(pledge.endDate).toLocaleDateString()}</div>
                    </Col>
                    <Col sm={2} md={2}>
                      <div>
                        {
                          currencySymbols[
                            pledge.currency as keyof typeof currencySymbols
                          ]
                        }
                        {pledge.amount}
                      </div>
                    </Col>
                    <Col xs={5} md={2} sm={2} lg={2}>
                      <Button
                        variant="success"
                        size="sm"
                        className="me-2"
                        onClick={() => {
                          handleEditClick(pledge);
                          console.log('Edit Pledge');
                        }}
                      >
                        {' '}
                        <i className="fa fa-edit" />
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => {
                          console.log('Delete Pledge');
                        }}
                      >
                        <i className="fa fa-trash" />
                      </Button>
                    </Col>
                  </Row>
                </div>
              ),
            )}
          </div>
        </div>
      </div>

      {/* Create Pledge Modal */}
      <PledgeCreateModal
        createCamapignModalIsOpen={createPledgeModalIsOpen}
        hideCreateCampaignModal={hideCreatePledgeModal}
        formState={formState}
        setFormState={setFormState}
        createPledgeHandler={createPledgeHandler}
        startDate={
          fundCampaignPledgeData?.getFundraisingCampaignById.startDate ??
          new Date()
        }
        endDate={
          fundCampaignPledgeData?.getFundraisingCampaignById.endDate ??
          new Date()
        }
      />

      {/* Update Pledge Modal */}
      <PledgeEditModal
        updatePledgeModalIsOpen={updatePledgeModalIsOpen}
        hideUpdatePledgeModal={hideUpdatePledgeModal}
        formState={formState}
        setFormState={setFormState}
        updatePledgeHandler={updatePledgeHandler}
        startDate={
          fundCampaignPledgeData?.getFundraisingCampaignById.startDate ??
          new Date()
        }
        endDate={
          fundCampaignPledgeData?.getFundraisingCampaignById.endDate ??
          new Date()
        }
      />
    </div>
  );
};
export default fundCampaignPledge;
