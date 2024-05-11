import { useMutation, useQuery } from '@apollo/client';
import { WarningAmberRounded } from '@mui/icons-material';
import {
  CREATE_PlEDGE,
  DELETE_PLEDGE,
  UPDATE_PLEDGE,
} from 'GraphQl/Mutations/PledgeMutation';
import { FUND_CAMPAIGN_PLEDGE } from 'GraphQl/Queries/fundQueries';
import Loader from 'components/Loader/Loader';
import dayjs from 'dayjs';
import React, { useCallback, useMemo, useState, type ChangeEvent } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { currencySymbols } from 'utils/currency';
import type {
  InterfaceCreatePledge,
  InterfacePledgeInfo,
  InterfaceQueryFundCampaignsPledges,
} from 'utils/interfaces';
import type { ApolloQueryResult } from '@apollo/client';
import useLocalStorage from 'utils/useLocalstorage';
import styles from './FundCampaignPledge.module.css';
import PledgeCreateModal from './PledgeCreateModal';
import PledgeDeleteModal from './PledgeDeleteModal';
import PledgeEditModal from './PledgeEditModal';

enum Modal {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
}

const fundCampaignPledge = (): JSX.Element => {
  const { fundCampaignId: currentUrl } = useParams();
  const { getItem } = useLocalStorage();
  const { t } = useTranslation('translation', {
    keyPrefix: 'pledges',
  });

  const [modalState, setModalState] = useState<{ [key in Modal]: boolean }>({
    [Modal.CREATE]: false,
    [Modal.UPDATE]: false,
    [Modal.DELETE]: false,
  });

  const [pledge, setPledge] = useState<InterfacePledgeInfo | null>(null);

  const [formState, setFormState] = useState<InterfaceCreatePledge>({
    pledgeAmount: 0,
    pledgeCurrency: 'USD',
    pledgeEndDate: new Date(),
    pledgeStartDate: new Date(),
  });
  const [createPledge] = useMutation(CREATE_PlEDGE);
  const [updatePledge] = useMutation(UPDATE_PLEDGE);
  const [deletePledge] = useMutation(DELETE_PLEDGE);

  const {
    data: pledgeData,
    loading: pledgeLoading,
    error: pledgeError,
    refetch: refetchPledge,
  }: {
    data?: {
      getFundraisingCampaignById: InterfaceQueryFundCampaignsPledges;
    };
    loading: boolean;
    error?: Error | undefined;
    refetch: () => Promise<
      ApolloQueryResult<{
        getFundraisingCampaignById: InterfaceQueryFundCampaignsPledges;
      }>
    >;
  } = useQuery(FUND_CAMPAIGN_PLEDGE, {
    variables: {
      id: currentUrl,
    },
  });

  const pledges = useMemo(() => {
    return pledgeData?.getFundraisingCampaignById.pledges ?? [];
  }, [pledgeData]);

  const openModal = (modal: Modal): void => {
    setModalState((prevState) => ({ ...prevState, [modal]: true }));
  };

  const closeModal = (modal: Modal): void => {
    setModalState((prevState) => ({ ...prevState, [modal]: false }));
  };

  const handleEditClick = useCallback(
    (pledge: InterfacePledgeInfo): void => {
      setFormState({
        pledgeAmount: pledge.amount,
        pledgeCurrency: pledge.currency,
        pledgeEndDate: new Date(pledge.endDate),
        pledgeStartDate: new Date(pledge.startDate),
      });
      setPledge(pledge);
      openModal(Modal.UPDATE);
    },
    [openModal],
  );
  const handleDeleteClick = useCallback(
    (pledge: InterfacePledgeInfo): void => {
      setPledge(pledge);
      openModal(Modal.DELETE);
    },
    [openModal],
  );
  const createPledgeHandler = async (
    e: ChangeEvent<HTMLFormElement>,
  ): Promise<void> => {
    try {
      e.preventDefault();
      const userId = getItem('id');
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
      await refetchPledge();
      closeModal(Modal.CREATE);
      toast.success(t('pledgeCreated'));
      setFormState({
        pledgeAmount: 0,
        pledgeCurrency: 'USD',
        pledgeEndDate: new Date(),
        pledgeStartDate: new Date(),
      });
    } catch (error: unknown) {
      toast.error((error as Error).message);
    }
  };
  const updatePledgeHandler = async (
    e: ChangeEvent<HTMLFormElement>,
  ): Promise<void> => {
    try {
      e.preventDefault();
      const updatedFields: { [key: string]: number | string | undefined } = {};
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
      await refetchPledge();
      closeModal(Modal.UPDATE);
      toast.success(t('pledgeUpdated'));
    } catch (error: unknown) {
      toast.error((error as Error).message);
    }
  };
  const deleteHandler = async (): Promise<void> => {
    try {
      await deletePledge({
        variables: {
          id: pledge?._id,
        },
      });
      await refetchPledge();
      closeModal(Modal.DELETE);
      toast.success(t('pledgeDeleted'));
    } catch (error: unknown) {
      toast.error((error as Error).message);
    }
  };
  if (pledgeLoading) return <Loader size="xl" />;
  if (pledgeError) {
    return (
      <div className={`${styles.container} bg-white rounded-4 my-3`}>
        <div className={styles.message} data-testid="errorMsg">
          <WarningAmberRounded className={styles.errorIcon} fontSize="large" />
          <h6 className="fw-bold text-danger text-center">
            Error occured while loading Funds
            <br />
            {pledgeError.message}
          </h6>
        </div>
      </div>
    );
  }
  return (
    <div className={styles.pledgeContainer}>
      <Button
        variant="success"
        className={styles.createPledgeBtn}
        onClick={() => openModal(Modal.CREATE)}
        data-testid="addPledgeBtn"
      >
        <i className={'fa fa-plus me-2'} />
        {t('addPledge')}
      </Button>
      <div className={`${styles.container} bg-white rounded-4 `}>
        <div className="mx-1 my-4 py-4">
          <Row className="mx-4 border border-light-subtle rounded-top-4 py-3 justify-content-between shadow-sm">
            <Col xs={7} sm={2} md={3} lg={3} className=" fw-bold">
              <div className="ms-2"> {t('volunteers')} </div>
            </Col>
            <Col className=" fw-bold " md={2} sm={2}>
              <div className="ms-3">{t('startDate')}</div>
            </Col>
            <Col className=" fw-bold " sm={2} md={2}>
              <div className="ms-3">{t('endDate')}</div>
            </Col>
            <Col className=" fw-bold" md={2} sm={2}>
              <div>{t('pledgeAmount')}</div>
            </Col>
            <Col xs={5} md={2} sm={2} lg={2} className=" fw-bold">
              <div className="ms-3"> {t('pledgeOptions')} </div>
            </Col>
          </Row>
          <div className="mx-4 bg-light-subtle border border-light-subtle border-top-0 rounded-bottom-4 shadow-sm">
            {pledges.map((pledge, index) => (
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
                      {dayjs(pledge.startDate).format('DD/MM/YYYY')}
                    </div>
                  </Col>
                  <Col sm={2} md={2}>
                    <div>{dayjs(pledge.endDate).format('DD/MM/YYYY')}</div>
                  </Col>
                  <Col sm={2} md={2}>
                    <div className="ms-2">
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
                      data-testid="editPledgeBtn"
                      onClick={() => handleEditClick(pledge)}
                    >
                      {' '}
                      <i className="fa fa-edit" />
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      data-testid="deletePledgeBtn"
                      onClick={() => handleDeleteClick(pledge)}
                    >
                      <i className="fa fa-trash" />
                    </Button>
                  </Col>
                </Row>
                {pledges && index !== pledges.length - 1 && (
                  <hr className="mx-3" />
                )}
              </div>
            ))}

            {pledges.length === 0 && (
              <div className="pt-2 text-center fw-semibold text-body-tertiary ">
                <h5>{t('noPledges')}</h5>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Pledge Modal */}
      <PledgeCreateModal
        createCamapignModalIsOpen={modalState[Modal.CREATE]}
        hideCreateCampaignModal={() => closeModal(Modal.CREATE)}
        formState={formState}
        setFormState={setFormState}
        createPledgeHandler={createPledgeHandler}
        startDate={pledgeData?.getFundraisingCampaignById.startDate as Date}
        endDate={pledgeData?.getFundraisingCampaignById.endDate as Date}
        t={t}
      />

      {/* Update Pledge Modal */}
      <PledgeEditModal
        updatePledgeModalIsOpen={modalState[Modal.UPDATE]}
        hideUpdatePledgeModal={() => closeModal(Modal.UPDATE)}
        formState={formState}
        setFormState={setFormState}
        updatePledgeHandler={updatePledgeHandler}
        startDate={pledgeData?.getFundraisingCampaignById.startDate as Date}
        endDate={pledgeData?.getFundraisingCampaignById.endDate as Date}
        t={t}
      />

      {/* Delete Pledge Modal */}
      <PledgeDeleteModal
        deletePledgeModalIsOpen={modalState[Modal.DELETE]}
        hideDeletePledgeModal={() => closeModal(Modal.DELETE)}
        deletePledgeHandler={deleteHandler}
        t={t}
      />
    </div>
  );
};
export default fundCampaignPledge;
