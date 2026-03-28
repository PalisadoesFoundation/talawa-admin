import { useQuery } from '@apollo/client';
import WarningAmberRounded from '@mui/icons-material/WarningAmberRounded';
import { FUND_CAMPAIGN_PLEDGE } from 'GraphQl/Queries/fundQueries';
import LoadingState from 'shared-components/LoadingState/LoadingState';
import SearchFilterBar from 'shared-components/SearchFilterBar/SearchFilterBar';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useParams } from 'react-router';
import { currencySymbols } from 'utils/currency';
import styles from './FundCampaignPledge.module.css';
import PledgeModal from './modal/PledgeModal';
import Popover from '@mui/material/Popover';
import Avatar from 'shared-components/Avatar/Avatar';
import BreadcrumbsComponent from 'shared-components/BreadcrumbsComponent/BreadcrumbsComponent';
import { DataTable } from 'shared-components/DataTable/DataTable';
import { useTableData } from 'shared-components/DataTable/hooks/useTableData';
import EmptyState from 'shared-components/EmptyState/EmptyState';
import type {
  InterfacePledgeInfo,
  InterfaceUserInfoPG,
  InterfaceQueryFundCampaignsPledges,
  InterfaceCampaignInfoPG,
} from 'utils/interfaces';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { getPledgeColumns } from './PledgeColumns';
import type { InterfacePledgeTableRow } from './PledgeColumns';
import Button from 'shared-components/Button';
import { useModalState } from 'shared-components/CRUDModalTemplate';

/**
 * Renders the Fund Campaign Pledges screen with pledge management, search/sort, and progress tracking.
 */
const fundCampaignPledge = (): JSX.Element => {
  type FundCampaignPledgeNode =
    InterfaceQueryFundCampaignsPledges['pledges']['edges'][number]['node'] & {
      users?: InterfaceUserInfoPG[];
      note?: string | null;
      updatedAt?: string;
    };

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

  const pledgeModal = useModalState();

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

  const pledgeQueryResult = useQuery<{
    fundCampaign: InterfaceQueryFundCampaignsPledges;
  }>(FUND_CAMPAIGN_PLEDGE, {
    variables: { input: { id: fundCampaignId } },
  });

  const {
    rows: pledgeRows,
    loading: pledgeLoading,
    error: pledgeError,
  } = useTableData<
    FundCampaignPledgeNode,
    InterfacePledgeTableRow,
    { fundCampaign: InterfaceQueryFundCampaignsPledges }
  >(pledgeQueryResult, {
    path: (data) => data.fundCampaign?.pledges,
    transformNode: (node) => {
      const allUsers =
        'users' in node && Array.isArray(node.users)
          ? node.users
          : [node.pledger];

      return {
        id: node.id,
        original: {
          id: node.id,
          campaign: {
            id: node.campaign?.id ?? '',
            name: node.campaign?.name ?? '',
            endAt: pledgeQueryResult.data?.fundCampaign?.endAt ?? new Date(),
            currencyCode:
              pledgeQueryResult.data?.fundCampaign?.currencyCode ?? 'USD',
            goalAmount: pledgeQueryResult.data?.fundCampaign?.goalAmount ?? 0,
          },
          amount: node.amount || 0,
          note: node.note,
          currency: pledgeQueryResult.data?.fundCampaign?.currencyCode || 'USD',
          createdAt: node.createdAt ?? new Date().toISOString(),
          updatedAt: node.updatedAt,
          pledger: node.pledger,
          users: allUsers.filter(Boolean),
        },
        amount: node.amount || 0,
        pledgeDate: node.createdAt ? new Date(node.createdAt) : new Date(),
        endDate: pledgeQueryResult.data?.fundCampaign?.endAt
          ? new Date(pledgeQueryResult.data.fundCampaign.endAt)
          : new Date(),
        users: allUsers.filter(Boolean),
        currency: pledgeQueryResult.data?.fundCampaign?.currencyCode || 'USD',
      };
    },
    deps: [pledgeQueryResult.data?.fundCampaign?.endAt],
  });

  const { data: pledgeData, refetch: refetchPledge } = pledgeQueryResult;

  const filteredPledges = useMemo(() => {
    if (!searchTerm) return pledgeRows;

    const search = searchTerm.toLowerCase();
    return pledgeRows.filter((pledge) =>
      pledge.users.some((user) => user.name?.toLowerCase().includes(search)),
    );
  }, [pledgeRows, searchTerm]);

  const { totalPledged, totalRaised } = useMemo(() => {
    const totalPledged = pledgeRows.reduce(
      (total, pledge) => total + (pledge.amount || 0),
      0,
    );

    // Raised amount data is not available yet in this query response.
    const totalRaised = 0;

    return { totalPledged, totalRaised };
  }, [pledgeRows]);

  const { fundName, fundId } = useMemo(() => {
    const fundInfo =
      pledgeData?.fundCampaign?.pledges?.edges[0]?.node?.campaign?.fund;

    return {
      fundName: fundInfo?.name ?? tCommon('funds'),
      fundId: fundInfo?.id ?? null,
    };
  }, [pledgeData, tCommon]);

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

  const handleOpenModal = useCallback(
    (
      selectedPledge: InterfacePledgeInfo | null,
      mode: 'edit' | 'create',
    ): void => {
      setPledge(selectedPledge);
      setPledgeModalMode(mode);
      pledgeModal.open();
    },
    [],
  );

  const handleClick = (
    event:
      | React.MouseEvent<HTMLSpanElement>
      | React.KeyboardEvent<HTMLSpanElement>,
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
    labels: {
      pledgers: t('pledges.pledgers'),
      pledgeDate: t('pledges.pledgeDate'),
      pledged: t('pledges.pledged'),
      donated: t('pledges.donated'),
      action: tCommon('action'),
      edit: tCommon('edit'),
    },
    getMoreCountLabel: (count: number) => tCommon('moreCount', { count }),
    id,
    handleClick,
    handleOpenModal,
  });

  return (
    <LoadingState isLoading={pledgeLoading} variant="spinner">
      <div className={styles.pageContainer}>
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
            dropdowns={[]}
            additionalButtons={
              <Button
                variant="success"
                className={`${styles.createButton} ${styles.buttonNoWrap} ${styles.buttonMarginReset}`}
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
        <div className={styles.listBox}>
          {filteredPledges.length === 0 ? (
            searchTerm ? (
              <EmptyState
                icon="search"
                message="noResultsFound"
                description={tCommon('noResultsFoundFor', {
                  query: `"${searchTerm}"`,
                })}
                dataTestId="fund-campaign-pledge-search-empty-state"
              />
            ) : (
              <EmptyState
                icon="volunteer_activism"
                message={t('pledges.noPledges')}
                dataTestId="fund-campaign-pledge-empty-state"
              />
            )
          ) : (
            <>
              <DataTable
                data={filteredPledges}
                columns={columns}
                rowKey="id"
                loading={pledgeLoading}
                paginationMode="client"
                pageSize={10}
                tableClassName={styles.listTable}
                emptyMessage={t('pledges.noPledges')}
                ariaLabel={t('pledges.pledges')}
              />
              <div className={'w-100 text-center my-4'}>
                <h5 className="m-0">{tCommon('endOfResults')}</h5>
              </div>
            </>
          )}
        </div>
        <PledgeModal
          isOpen={pledgeModal.isOpen}
          hide={pledgeModal.close}
          campaignId={fundCampaignId}
          orgId={orgId}
          pledge={pledge}
          refetchPledge={refetchPledge}
          endDate={pledgeData?.fundCampaign?.endAt as Date}
          mode={pledgeModalMode}
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
