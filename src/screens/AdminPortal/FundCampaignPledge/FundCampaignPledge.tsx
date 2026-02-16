import { useQuery } from '@apollo/client';
import { WarningAmberRounded } from '@mui/icons-material';
import { FUND_CAMPAIGN_PLEDGE } from 'GraphQl/Queries/fundQueries';
import LoadingState from 'shared-components/LoadingState/LoadingState';
import SearchFilterBar from 'shared-components/SearchFilterBar/SearchFilterBar';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useParams } from 'react-router';
import { currencySymbols } from 'utils/currency';
import styles from './FundCampaignPledge.module.css';
import PledgeDeleteModal from './deleteModal/PledgeDeleteModal';
import PledgeModal from './modal/PledgeModal';
import { Popover } from '@mui/material';
import Avatar from 'shared-components/Avatar/Avatar';
import BreadcrumbsComponent from 'shared-components/BreadcrumbsComponent/BreadcrumbsComponent';
import { DataGridWrapper } from 'shared-components/DataGridWrapper/DataGridWrapper';
import type {
  InterfacePledgeInfo,
  InterfaceUserInfoPG,
  InterfaceQueryFundCampaignsPledges,
  InterfaceCampaignInfoPG,
} from 'utils/interfaces';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { getPledgeColumns } from './PledgeColumns';
import Button from 'shared-components/Button';

enum ModalState {
  SAME = 'same',
  DELETE = 'delete',
}

/**
 * Renders the Fund Campaign Pledges screen with pledge management, search/sort, and progress tracking.
 */
const fundCampaignPledge = (): JSX.Element => {
  const { t } = useTranslation('translation');
  const { t: tCommon } = useTranslation('common');
  const { t: tErrors } = useTranslation('errors');

  const { fundCampaignId, orgId } = useParams();
  if (!fundCampaignId || !orgId) {
    return <Navigate to={'/'} replace />;
  }

  const [campaignInfo, setCampaignInfo] = useState<InterfaceCampaignInfoPG>({
    name: '',
    goal: 0,
    startDate: new Date(),
    endDate: new Date(),
    currency: '',
  });

  const [modalState, setModalState] = useState<{
    [key in ModalState]: boolean;
  }>({ [ModalState.SAME]: false, [ModalState.DELETE]: false });

  const [extraUsers, setExtraUsers] = useState<InterfaceUserInfoPG[]>([]);
  const [progressIndicator, setProgressIndicator] = useState<
    'raised' | 'pledged'
  >('pledged');
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popup' : undefined;
  const [pledgeModalMode, setPledgeModalMode] = useState<'edit' | 'create'>(
    'create',
  );
  const [pledge, setPledge] = useState<InterfacePledgeInfo | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [sortBy, setSortBy] = useState<
    'amount_ASC' | 'amount_DESC' | 'endDate_ASC' | 'endDate_DESC'
  >('endDate_DESC');

  const {
    data: pledgeData,
    loading: pledgeLoading,
    error: pledgeError,
    refetch: refetchPledge,
  } = useQuery<{ fundCampaign: InterfaceQueryFundCampaignsPledges }>(
    FUND_CAMPAIGN_PLEDGE,
    {
      variables: { input: { id: fundCampaignId } },
    },
  );

  const { pledges, totalPledged, totalRaised, fundName, fundId } =
    useMemo(() => {
      let totalPledged = 0;
      let totalRaised = 0;

      const pledgesList =
        pledgeData?.fundCampaign?.pledges?.edges.map((edge) => {
          const amount = edge.node.amount || 0;
          totalPledged += amount;
          // Assuming there's no raised amount for now,
          // this should be updated when raised amount data is available
          totalRaised += 0;

          const allUsers =
            'users' in edge.node && Array.isArray(edge.node.users)
              ? edge.node.users
              : [edge.node.pledger];

          return {
            id: edge.node.id,
            amount: amount,
            pledgeDate: edge.node.createdAt
              ? new Date(edge.node.createdAt)
              : new Date(),
            endDate: pledgeData.fundCampaign.endAt
              ? new Date(pledgeData.fundCampaign.endAt)
              : new Date(),
            users: allUsers.filter(Boolean),
            currency: pledgeData.fundCampaign.currencyCode || 'USD',
          };
        }) ?? [];

      const filteredPledges = searchTerm
        ? pledgesList.filter((pledge) => {
            const search = searchTerm.toLowerCase();
            return pledge.users.some((user) =>
              user.name?.toLowerCase().includes(search),
            );
          })
        : pledgesList;

      const sortedPledges = [...filteredPledges].sort((a, b) => {
        switch (sortBy) {
          case 'amount_ASC':
            return a.amount - b.amount;
          case 'amount_DESC':
            return b.amount - a.amount;
          case 'endDate_ASC':
            return a.endDate.getTime() - b.endDate.getTime();
          case 'endDate_DESC':
            return b.endDate.getTime() - a.endDate.getTime();
        }
      });

      // Get fund info from the campaign's fund property
      const fundInfo =
        pledgeData?.fundCampaign?.pledges?.edges[0]?.node?.campaign?.fund;
      const fundName = fundInfo?.name ?? tCommon('funds');
      const fundId = fundInfo?.id ?? null;
      return {
        pledges: sortedPledges,
        totalPledged,
        totalRaised,
        fundName,
        fundId,
      };
    }, [pledgeData, searchTerm, sortBy, tCommon]);

  useEffect(() => {
    if (pledgeData?.fundCampaign) {
      setCampaignInfo({
        name: pledgeData.fundCampaign.name,
        goal: pledgeData.fundCampaign.goalAmount ?? 0,
        startDate: pledgeData.fundCampaign.startAt ?? new Date(),
        endDate: pledgeData.fundCampaign.endAt ?? new Date(),
        currency: pledgeData.fundCampaign.currencyCode ?? 'USD',
      });
    }
  }, [pledgeData]);

  useEffect(() => {
    refetchPledge();
  }, [sortBy, refetchPledge]);

  const openModal = (modal: ModalState): void => {
    setModalState((prevState) => ({ ...prevState, [modal]: true }));
  };

  const closeModal = (modal: ModalState): void => {
    setModalState((prevState) => ({ ...prevState, [modal]: false }));
  };

  const handleOpenModal = useCallback(
    (pledge: InterfacePledgeInfo | null, mode: 'edit' | 'create'): void => {
      setPledge(pledge);
      setPledgeModalMode(mode);
      openModal(ModalState.SAME);
    },
    [openModal],
  );

  const handleDeleteClick = useCallback(
    (pledge: InterfacePledgeInfo): void => {
      setPledge(pledge);
      openModal(ModalState.DELETE);
    },
    [openModal],
  );

  const handleClick = (
    event:
      | React.MouseEvent<HTMLDivElement>
      | React.KeyboardEvent<HTMLDivElement>,
    users: InterfaceUserInfoPG[],
  ): void => {
    setExtraUsers(users);
    setAnchorEl(event.currentTarget);
  };

  const isWithinCampaignDates = useMemo(() => {
    if (!pledgeData?.fundCampaign) return false;

    const now = dayjs();
    let start = dayjs(pledgeData.fundCampaign.startAt);
    let end = dayjs(pledgeData.fundCampaign.endAt);

    return now.isAfter(start) && now.isBefore(end);
  }, [pledgeData]);

  if (pledgeError) {
    return (
      <div className={`${styles.container} bg-white rounded-4 my-3`}>
        <div className={styles.message} data-testid="errorMsg">
          <WarningAmberRounded className={styles.errorIcon} />
          <h6 className="fw-bold text-danger text-center">
            {tErrors('errorLoading', {
              entity: t('pledges.pledges'),
            })}
            <br />
            {pledgeError.message}
          </h6>
        </div>
      </div>
    );
  }

  const columns = getPledgeColumns({
    t,
    tCommon,
    id,
    handleClick,
    handleOpenModal,
    handleDeleteClick,
  });

  return (
    <LoadingState isLoading={pledgeLoading} variant="spinner">
      <div>
        <BreadcrumbsComponent
          items={[
            { label: fundName, to: `/admin/orgfunds/${orgId}` },
            fundId
              ? {
                  label: campaignInfo?.name,
                  to: `/admin/orgfundcampaign/${orgId}/${fundId}`,
                }
              : { label: campaignInfo?.name },
            { translationKey: 'pledges.pledges', isCurrent: true },
          ]}
        />
        <div className={styles.overviewContainer}>
          <div className={styles.titleContainer}>
            <h3>{campaignInfo?.name}</h3>
            <span>
              {t('pledges.endsOn')}{' '}
              {dayjs(campaignInfo?.endDate).format('DD/MM/YYYY')}
            </span>
          </div>
          <div className={styles.progressContainer}>
            <div className="d-flex justify-content-center">
              <fieldset
                className={`btn-group ${styles.toggleGroup}`}
                aria-label={tCommon('togglePledgedRaised')}
              >
                <input
                  type="radio"
                  className={`btn-check ${styles.toggleBtnPledge}`}
                  name="btnradio"
                  id="pledgedRadio"
                  checked={progressIndicator === 'pledged'}
                  onChange={() => {
                    setProgressIndicator('pledged');
                  }}
                />
                <label
                  className={`btn btn-outline-primary ${styles.toggleBtnPledge}`}
                  htmlFor="pledgedRadio"
                >
                  {t('pledges.pledgedAmount')}
                </label>

                <input
                  type="radio"
                  className={`btn-check ${styles.toggleBtnPledge}`}
                  name="btnradio"
                  id="raisedRadio"
                  onChange={() => setProgressIndicator('raised')}
                  checked={progressIndicator === 'raised'}
                />
                <label
                  className={`btn btn-outline-primary ${styles.toggleBtnPledge}`}
                  htmlFor="raisedRadio"
                >
                  {t('pledges.raisedAmount')}
                </label>
              </fieldset>
            </div>

            <div className={styles.progress}>
              <ProgressBar
                now={
                  progressIndicator === 'pledged'
                    ? (totalPledged / (campaignInfo?.goal || 1)) * 100
                    : (totalRaised / (campaignInfo?.goal || 1)) * 100
                }
                label={`${
                  currencySymbols[
                    campaignInfo?.currency as keyof typeof currencySymbols
                  ] || '$'
                }${progressIndicator === 'pledged' ? totalPledged.toLocaleString('en-US') : totalRaised.toLocaleString('en-US')}`}
                max={100}
                data-testid="progressBar"
                className={`${styles.progressBar} ${styles.progressBarHeight}`}
              />
              <div className={styles.endpoints}>
                <div className={styles.start}>
                  {currencySymbols[
                    campaignInfo?.currency as keyof typeof currencySymbols
                  ] || '$'}
                  0
                </div>
                <div className={styles.end}>
                  {currencySymbols[
                    campaignInfo?.currency as keyof typeof currencySymbols
                  ] || '$'}
                  {campaignInfo?.goal.toLocaleString('en-US')}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={`${styles.btnsContainerPledge} align-items-center`}>
          <SearchFilterBar
            searchPlaceholder={t('pledges.searchPledger')}
            searchValue={searchTerm}
            onSearchChange={(value) => setSearchTerm(value.trim())}
            onSearchSubmit={(value: string) => {
              setSearchTerm(value.trim());
            }}
            searchInputTestId="searchPledger"
            searchButtonTestId="searchBtn"
            hasDropdowns={true}
            dropdowns={[
              {
                id: 'sort-pledges',
                label: tCommon('sort'),
                title: tCommon('sort'),
                dataTestIdPrefix: 'filter',
                selectedOption: sortBy,
                onOptionChange: (value) =>
                  setSortBy(
                    value as
                      | 'amount_ASC'
                      | 'amount_DESC'
                      | 'endDate_ASC'
                      | 'endDate_DESC',
                  ),
                options: [
                  { label: t('pledges.lowestAmount'), value: 'amount_ASC' },
                  { label: t('pledges.highestAmount'), value: 'amount_DESC' },
                  { label: t('pledges.latestEndDate'), value: 'endDate_DESC' },
                  { label: t('pledges.earliestEndDate'), value: 'endDate_ASC' },
                ],
                type: 'sort',
              },
            ]}
            additionalButtons={
              <Button
                variant="success"
                className={styles.dropdown}
                disabled={!isWithinCampaignDates}
                onClick={() => handleOpenModal(null, 'create')}
                data-testid="addPledgeBtn"
                title={
                  !isWithinCampaignDates ? t('pledges.campaignNotActive') : ''
                }
              >
                <i className={'fa fa-plus me-2'} />
                {t('pledges.addPledge')}
              </Button>
            }
          />
        </div>
        <DataGridWrapper
          rows={pledges.map((pledge) => ({
            id: pledge.id,
            users: pledge.users,
            endDate: pledge.endDate,
            pledgeDate: pledge.pledgeDate,
            amount: pledge.amount,
            currency: pledge.currency,
          }))}
          columns={columns}
          loading={pledgeLoading}
          emptyStateProps={{
            icon: 'volunteer_activism',
            message: t('pledges.noPledges'),
            dataTestId: 'fund-campaign-pledge-empty-state',
          }}
          paginationConfig={{
            enabled: false,
          }}
        />
        <PledgeModal
          isOpen={modalState[ModalState.SAME]}
          hide={() => closeModal(ModalState.SAME)}
          campaignId={fundCampaignId}
          orgId={orgId}
          pledge={pledge}
          refetchPledge={refetchPledge}
          endDate={pledgeData?.fundCampaign?.endAt as Date}
          mode={pledgeModalMode}
        />
        <PledgeDeleteModal
          isOpen={modalState[ModalState.DELETE]}
          hide={() => closeModal(ModalState.DELETE)}
          pledge={pledge}
          refetchPledge={refetchPledge}
        />
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <div
            className={`${styles.popup} ${extraUsers.length > 4 ? styles.popupExtra : ''}`}
            data-testid="extra-users-popup"
          >
            {extraUsers.map((user: InterfaceUserInfoPG, index: number) => (
              <div
                className={styles.pledgerContainer}
                key={user.id}
                data-testid={`extraUser-${index}`}
              >
                {user.avatarURL ? (
                  <img
                    src={user.avatarURL}
                    alt={user.name}
                    className={styles.TableImagePledge}
                  />
                ) : (
                  <Avatar
                    containerStyle={styles.imageContainerPledge}
                    avatarStyle={styles.TableImagePledge}
                    name={user.name}
                    alt={user.name}
                  />
                )}
                <span>{user.name}</span>
              </div>
            ))}
          </div>
        </Popover>
      </div>
    </LoadingState>
  );
};
export default fundCampaignPledge;
