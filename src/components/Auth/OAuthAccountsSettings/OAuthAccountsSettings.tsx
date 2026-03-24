import { useMutation, useQuery } from '@apollo/client';
import { UNLINK_OAUTH_ACCOUNT } from 'GraphQl/Mutations/mutations';
import { USER_OAUTH_ACCOUNTS } from 'GraphQl/Queries/Queries';
import { useState } from 'react';
import { Card } from 'react-bootstrap';
import { useLocation, useParams } from 'react-router';
import GitHubOAuthButton from 'components/Auth/OAuthButton/GitHubOAuthButton';
import GoogleOAuthButton from 'components/Auth/OAuthButton/GoogleOAuthButton';
import Button from 'shared-components/Button';
import LoadingState from 'shared-components/LoadingState/LoadingState';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';
import { OAuthProviderKey } from 'types/Auth/auth';
import useLocalStorage from 'utils/useLocalstorage';
import styles from './OAuthAccountsSettings.module.css';
import { useTranslation } from 'react-i18next';

/**
 * Props for {@link OAuthAccountsSettings}.
 */
type OAuthAccountsSettingsProps = {
  id?: string;
};

/**
 * Provider list used to determine missing OAuth connections.
 */
const SUPPORTED_PROVIDERS: OAuthProviderKey[] = ['GOOGLE', 'GITHUB'];

/**
 * Displays OAuth account linkage status and actions for a user.
 *
 * @param props - Component props including an optional user id.
 * @returns Account settings UI with link and unlink actions.
 */
const OAuthAccountsSettings: React.FC<OAuthAccountsSettingsProps> = ({
  id,
}): JSX.Element => {
  const location = useLocation();
  const { getItem } = useLocalStorage();
  const params = useParams();
  const [unlinkingProvider, setUnlinkingProvider] = useState<string | null>(
    null,
  );
  const { t } = useTranslation('translation', {
    keyPrefix: 'OAuthAccountsSettings',
  });

  const storedUserId = getItem('id') || getItem('userId');
  const currentId =
    (location.state?.id as string | undefined) ||
    id ||
    params.userId ||
    (storedUserId as string) ||
    '';

  const { data, loading, error, refetch } = useQuery(USER_OAUTH_ACCOUNTS, {
    variables: {
      input: {
        id: currentId,
      },
    },
    fetchPolicy: 'no-cache',
    skip: !currentId,
  });

  const [unlinkOAuthAccount] = useMutation(UNLINK_OAUTH_ACCOUNT);

  const connectedAccounts: { provider: string }[] =
    data?.user?.oauthAccounts ?? [];

  const connectedProviders = new Set(
    connectedAccounts.map((account) => account.provider?.toUpperCase()),
  );

  const missingProviders = SUPPORTED_PROVIDERS.filter(
    (provider) => !connectedProviders.has(provider),
  );

  /**
   * Unlinks the selected OAuth provider from the current user.
   *
   * @param provider - Provider to unlink.
   * @returns Promise resolved when unlink flow completes.
   */
  const handleUnlink = async (provider: OAuthProviderKey): Promise<void> => {
    try {
      setUnlinkingProvider(provider);
      await unlinkOAuthAccount({
        variables: {
          provider,
        },
      });
      await refetch();

      NotificationToast.success(t('unlinkSuccess', { provider }));
    } catch (unlinkError) {
      const message =
        unlinkError instanceof Error
          ? unlinkError.message
          : `Failed to unlink ${provider}.`;
      NotificationToast.error(message);
    } finally {
      setUnlinkingProvider(null);
    }
  };

  if (!currentId) {
    return <div className={styles.message}>{t('userIdNotAvailable')}</div>;
  }

  if (loading) {
    return (
      <Card className={styles.oauthCard}>
        <Card.Body>
          <LoadingState isLoading={true} variant="inline">
            <div />
          </LoadingState>
        </Card.Body>
      </Card>
    );
  }

  if (error) {
    return (
      <div className={styles.message}>{t('unableToLoadOAuthAccounts')}</div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <Card className={styles.oauthCard}>
        <Card.Body>
          <div className={styles.row}>
            <h6 className={styles.heading}>{t('missingOauthProviders')}</h6>
            {missingProviders.length === 0 ? (
              <p className={styles.message}>{t('bothGoogleAndGitHubLinked')}</p>
            ) : (
              <div className={styles.buttons}>
                {missingProviders.includes('GOOGLE') && (
                  <GoogleOAuthButton mode="link" size="sm" />
                )}
                {missingProviders.includes('GITHUB') && (
                  <GitHubOAuthButton mode="link" size="sm" />
                )}
              </div>
            )}
          </div>
        </Card.Body>
      </Card>

      <Card className={styles.oauthCard}>
        <Card.Body>
          <div className={styles.row}>
            <h6 className={styles.heading}>{t('connectedOauthAccounts')}</h6>
            {connectedAccounts.length === 0 ? (
              <p className={styles.message}>{t('noConnectedOauthAccounts')}</p>
            ) : (
              <div className={styles.connectedList}>
                {connectedAccounts.map((account) => {
                  const provider =
                    account.provider?.toUpperCase() as OAuthProviderKey;
                  return (
                    <div key={provider} className={styles.connectedItem}>
                      <span className={styles.providerName}>{provider}</span>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline-danger"
                        onClick={() => handleUnlink(provider)}
                        disabled={unlinkingProvider === provider}
                        isLoading={unlinkingProvider === provider}
                      >
                        {t('Unlink')}
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default OAuthAccountsSettings;
