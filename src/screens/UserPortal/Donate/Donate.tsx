import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DropDownButton from 'shared-components/DropDownButton';
import { useQuery, useMutation, type ApolloError } from '@apollo/client';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

import {
  ORGANIZATION_DONATION_CONNECTION_LIST,
  ORGANIZATION_LIST,
} from 'GraphQl/Queries/Queries';
import {
  DONATE_TO_ORGANIZATION,
  DONATE_TO_ORGANIZATION_WITH_CURRENCY,
} from 'GraphQl/Mutations/mutations';
import styles from './Donate.module.css';
import useLocalStorage from 'utils/useLocalstorage';
import { errorHandler } from 'utils/errorHandler';
import type { InterfaceDonation } from 'types/UserPortal/Donation/interface';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';

const currencies = ['USD', 'INR', 'EUR'];
const currencyOptions = currencies.map((c) => ({ value: c, label: c }));
const presetAmounts = [10, 25, 50, 100];

export default function Donate(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'donate' });
  const { getItem } = useLocalStorage();
  const userId = getItem('userId');
  const userName = getItem('name');
  const { orgId: organizationId } = useParams();

  const [amount, setAmount] = useState('');
  const [organizationDetails, setOrganizationDetails] = useState<{
    name: string;
  }>({ name: '' });
  const [donations, setDonations] = useState<InterfaceDonation[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  const {
    data: donationData,
    loading,
    refetch,
  } = useQuery(ORGANIZATION_DONATION_CONNECTION_LIST, {
    variables: { orgId: organizationId },
  });
  const { data } = useQuery(ORGANIZATION_LIST, {
    variables: { id: organizationId },
  });
  const [donate] = useMutation(DONATE_TO_ORGANIZATION);
  const [donateWithCurrency] = useMutation(
    DONATE_TO_ORGANIZATION_WITH_CURRENCY,
  );

  useEffect(() => {
    if (data?.organizations?.length) {
      setOrganizationDetails(data.organizations[0]);
    }
  }, [data]);

  useEffect(() => {
    if (donationData?.getDonationByOrgIdConnection) {
      setDonations(donationData.getDonationByOrgIdConnection);
    }
  }, [donationData]);

  const shouldFallbackToLegacyDonationMutation = (error: unknown): boolean => {
    const apolloError = error as ApolloError;
    const combinedMessage = [
      apolloError?.message,
      ...(apolloError?.graphQLErrors?.map((e) => e?.message) ?? []),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return (
      combinedMessage.includes('unknown argument "currencycode"') ||
      combinedMessage.includes('unknown type "iso4217currencycode"') ||
      combinedMessage.includes(
        'field "createdonation" argument "currencycode" is not defined',
      )
    );
  };

  const donateToOrg = async (): Promise<void> => {
    if (!userId || !organizationId || !userName) return;
    if (amount === '' || Number.isNaN(Number(amount))) {
      NotificationToast.error(t('invalidAmount'));
      return;
    }
    if (Number(amount) < 1 || Number(amount) > 10000000) {
      NotificationToast.error(
        t('donationOutOfRange', { min: 1, max: 10000000 }),
      );
      return;
    }
    try {
      try {
        await donateWithCurrency({
          variables: {
            userId,
            createDonationOrgId2: organizationId,
            payPalId: 'paypalId',
            nameOfUser: userName,
            amount: Number(amount),
            nameOfOrg: organizationDetails.name,
            currencyCode: selectedCurrency,
          },
        });
      } catch (error) {
        if (shouldFallbackToLegacyDonationMutation(error)) {
          await donate({
            variables: {
              userId,
              createDonationOrgId2: organizationId,
              payPalId: 'paypalId',
              nameOfUser: userName,
              amount: Number(amount),
              nameOfOrg: organizationDetails.name,
            },
          });
        } else {
          throw error;
        }
      }
      await refetch();
      setAmount('');
      NotificationToast.success(t('success') as string);
    } catch (error) {
      errorHandler(t, error);
    }
  };

  return (
    <div>
      {/* Two-column: donation form + history side by side */}
      <div className={styles.layout}>
        {/* Left: Donation form */}
        <div className={styles.donateHero}>
          <p className={styles.heroSubtitle}>
            Support {organizationDetails.name} with a contribution.
          </p>

          {/* Quick presets */}
          <div className={styles.presets}>
            {presetAmounts.map((preset) => (
              <button
                key={preset}
                className={`${styles.presetBtn} ${amount === String(preset) ? styles.presetBtnActive : ''}`}
                onClick={() => setAmount(String(preset))}
              >
                ${preset}
              </button>
            ))}
          </div>

          {/* Currency + amount */}
          <div className={styles.amountRow}>
            <DropDownButton
              id="currency-dropdown"
              options={currencyOptions}
              selectedValue={selectedCurrency}
              onSelect={(c) => setSelectedCurrency(c)}
              dataTestIdPrefix="currency-dropdown"
              buttonLabel={selectedCurrency}
              ariaLabel={t('selectCurrency')}
              showCaret
              btnStyle={styles.dropdown}
            />
            <div className={styles.amountInput}>
              <label htmlFor="donationAmountInput" className={styles.srOnly}>
                {t('amount')}
              </label>
              <input
                id="donationAmountInput"
                type="text"
                className="form-input"
                data-testid="donationAmount"
                placeholder={t('amount')}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <button
            className={styles.donateBtn}
            data-testid="donateBtn"
            onClick={donateToOrg}
          >
            {t('donate')}
          </button>
        </div>

        {/* Right: Donation history */}
        <div className={styles.historyPanel}>
          {loading ? (
            <div
              style={{
                textAlign: 'center',
                padding: 32,
                color: 'var(--gray-400)',
              }}
            >
              <HourglassBottomIcon /> {t('loading')}
            </div>
          ) : donations.length === 0 ? (
            <div className={styles.emptyHistory}>
              <div className={styles.emptyIcon}>{'💝'}</div>
              <p className={styles.emptyText}>No donations yet</p>
              <p className={styles.emptySubtext}>
                Your history will appear here after your first contribution.
              </p>
            </div>
          ) : (
            <>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>
                  {t('yourPreviousDonations')}
                </h3>
                <span className={styles.donationCount}>
                  {donations.length}{' '}
                  {donations.length === 1 ? 'donation' : 'donations'}
                </span>
              </div>
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>{t('donor')}</th>
                      <th>{t('amount')}</th>
                      <th>{t('date')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donations.map((d) => (
                      <tr key={d._id} data-testid="donationCard">
                        <td style={{ fontWeight: 500 }}>{d.nameOfUser}</td>
                        <td>${Number(d.amount).toLocaleString()}</td>
                        <td>{dayjs(d.updatedAt).format('MMM D, YYYY')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
