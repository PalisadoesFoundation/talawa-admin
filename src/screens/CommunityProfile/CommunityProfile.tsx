import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Card, Form } from 'react-bootstrap';
import { useMutation, useQuery } from '@apollo/client';
import { toast } from 'react-toastify';

import Loader from 'components/Loader/Loader';
import { GET_COMMUNITY_DATA_PG } from 'GraphQl/Queries/Queries';
import {
  UPDATE_COMMUNITY_PG,
  RESET_COMMUNITY,
} from 'GraphQl/Mutations/mutations';
import {
  FacebookLogo,
  InstagramLogo,
  XLogo,
  LinkedInLogo,
  GithubLogo,
  YoutubeLogo,
  RedditLogo,
  SlackLogo,
} from 'assets/svgs/social-icons';
import { useMinioUpload } from 'utils/MinioUpload';
import styles from '../../style/app-fixed.module.css';
import { errorHandler } from 'utils/errorHandler';
import UpdateSession from '../../components/UpdateSession/UpdateSession';

/**
 * `CommunityProfile` component allows users to view and update their community profile details.
 *
 * It includes functionalities to:
 * - Display current community profile information
 * - Update profile details including social media links and logo
 * - Reset profile changes to the initial state
 *
 * @returns JSX.Element - The `CommunityProfile` component.
 *
 * @example
 * ```tsx
 * <CommunityProfile />
 * ```
 *
 * ## CSS Strategy Explanation:
 *
 * To ensure consistency across the application and reduce duplication, common styles
 * (such as button styles) have been moved to the global CSS file. Instead of using
 * component-specific classes (e.g., `.greenregbtnOrganizationFundCampaign`, `.greenregbtnPledge`), a single reusable
 * class (e.g., .addButton) is now applied.
 *
 * ### Benefits:
 * - **Reduces redundant CSS code.
 * - **Improves maintainability by centralizing common styles.
 * - **Ensures consistent styling across components.
 *
 * ### Global CSS Classes used:
 * - `.inputField`
 * - `.outlineButton`
 * - `.addButton`
 *
 * For more details on the reusable classes, refer to the global CSS file.
 */
const CommunityProfile = (): JSX.Element => {
  // Translation hooks for internationalization
  const { t } = useTranslation('translation', {
    keyPrefix: 'communityProfile',
  });
  const { t: tCommon } = useTranslation('common');
  // Add MinIO hook
  const { uploadFileToMinio } = useMinioUpload();

  document.title = t('title'); // Set document title

  // Define the type for pre-login imagery data
  type PreLoginImageryDataType = {
    id: string;
    name: string | undefined;
    websiteURL: string | undefined;
    logo: string | undefined;
    inactivityTimeoutDuration: number;
    facebookURL: string | undefined;
    instagramURL: string | undefined;
    xURL: string | undefined;
    linkedInURL: string | undefined;
    githubURL: string | undefined;
    youtubeURL: string | undefined;
    redditURL: string | undefined;
    slackURL: string | undefined;
  };

  // State hook for managing profile variables
  const [profileVariable, setProfileVariable] = React.useState({
    name: '',
    websiteURL: '',
    logo: '',
    facebookURL: '',
    instagramURL: '',
    inactivityTimeoutDuration: 0,
    xURL: '',
    linkedInURL: '',
    githubURL: '',
    youtubeURL: '',
    redditURL: '',
    slackURL: '',
  });

  // Query to fetch community data
  const { data, loading } = useQuery(GET_COMMUNITY_DATA_PG);

  // Mutations for updating and resetting community data
  const [uploadPreLoginImagery] = useMutation(UPDATE_COMMUNITY_PG);
  const [resetPreLoginImagery] = useMutation(RESET_COMMUNITY);

  // Effect to set profile data from fetched data
  React.useEffect(() => {
    const preLoginData: PreLoginImageryDataType | undefined = data?.community;
    if (preLoginData) {
      setProfileVariable({
        name: preLoginData.name ?? '',
        websiteURL: preLoginData.websiteURL ?? '',
        logo: preLoginData.logo ?? '',
        facebookURL: preLoginData.facebookURL ?? '',
        inactivityTimeoutDuration: preLoginData.inactivityTimeoutDuration,
        instagramURL: preLoginData.instagramURL ?? '',
        xURL: preLoginData.xURL ?? '',
        linkedInURL: preLoginData.linkedInURL ?? '',
        githubURL: preLoginData.githubURL ?? '',
        youtubeURL: preLoginData.youtubeURL ?? '',
        redditURL: preLoginData.redditURL ?? '',
        slackURL: preLoginData.slackURL ?? '',
      });
    }
  }, [data]);

  /**
   * Handles change events for form inputs.
   *
   * @param e - Change event for input elements
   */
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setProfileVariable({
      ...profileVariable,
      [e.target.name]: e.target.value,
    });
  };

  /**
   * Handles form submission to update community profile.
   *
   * @param e - Form submit event
   */
  const handleOnSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    try {
      await uploadPreLoginImagery({
        variables: {
          name: profileVariable.name,
          websiteURL: profileVariable.websiteURL,
          inactivityTimeoutDuration: data?.community?.inactivityTimeoutDuration,
          facebookURL: profileVariable.facebookURL || undefined,
          instagramURL: profileVariable.instagramURL || undefined,
          xURL: profileVariable.xURL || undefined,
          linkedinURL: profileVariable.linkedInURL || undefined,
          githubURL: profileVariable.githubURL || undefined,
          youtubeURL: profileVariable.youtubeURL || undefined,
          redditURL: profileVariable.redditURL || undefined,
          slackURL: profileVariable.slackURL || undefined,
          // Add logo to the mutation
          logo: profileVariable.logo || undefined,
        },
      });
      toast.success(t('profileChangedMsg') as string);
    } catch (error: unknown) {
      errorHandler(t, error as Error);
    }
  };

  /**
   * Resets profile data to initial values and performs a reset operation.
   */
  const resetData = async (): Promise<void> => {
    const preLoginData: PreLoginImageryDataType | undefined = data?.community;
    try {
      setProfileVariable({
        name: '',
        websiteURL: '',
        logo: '',
        facebookURL: '',
        instagramURL: '',
        inactivityTimeoutDuration: 0,
        xURL: '',
        linkedInURL: '',
        githubURL: '',
        youtubeURL: '',
        redditURL: '',
        slackURL: '',
      });

      await resetPreLoginImagery({
        variables: {
          resetPreLoginImageryId: preLoginData?.id,
        },
      });
      toast.success(t(`resetData`) as string);
    } catch (error: unknown) {
      errorHandler(t, error as Error);
    }
  };

  /**
   * Determines whether the save and reset buttons should be disabled.
   *
   * @returns boolean - True if buttons should be disabled, otherwise false
   */
  const isDisabled = (): boolean => {
    if (
      profileVariable.name == '' &&
      profileVariable.websiteURL == '' &&
      profileVariable.logo == ''
    ) {
      return true;
    } else {
      return false;
    }
  };

  if (loading) {
    <Loader />;
  }

  return (
    <>
      <Card border="0" className={`${styles.card} "rounded-4 my-4 shadow-sm"`}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitle}>{t('editProfile')}</div>
        </div>
        <Card.Body>
          <div className="mb-3">{t('communityProfileInfo')}</div>
          <Form onSubmit={handleOnSubmit}>
            <Form.Group>
              <Form.Label className={styles.formLabel}>
                {t('communityName')}
              </Form.Label>
              <Form.Control
                type="text"
                id="communityName"
                name="name"
                value={profileVariable.name}
                onChange={handleOnChange}
                className={`mb-3 ${styles.inputField}`}
                placeholder={t('communityName')}
                autoComplete="off"
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className={styles.formLabel}>
                {t('wesiteLink')}
              </Form.Label>
              <Form.Control
                type="url"
                id="websiteURL"
                name="websiteURL"
                value={profileVariable.websiteURL}
                onChange={handleOnChange}
                className={`mb-3 ${styles.inputField}`}
                placeholder={t('wesiteLink')}
                autoComplete="off"
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className={styles.formLabel}>{t('logo')}</Form.Label>
              <Form.Control
                accept="image/*"
                multiple={false}
                type="file"
                id="logo"
                name="logo"
                data-testid="fileInput"
                onChange={async (e: React.ChangeEvent) => {
                  const target = e.target as HTMLInputElement;
                  const file = target.files?.[0];

                  if (file) {
                    try {
                      // Upload to MinIO instead of converting to base64
                      const { objectName } = await uploadFileToMinio(
                        file,
                        'community',
                      );

                      // Use functional state update to ensure we have the latest state
                      setProfileVariable((prevState) => ({
                        ...prevState,
                        logo: objectName,
                      }));
                    } catch (error) {
                      // Show user-friendly error message
                      toast.error(t('logoUploadFailed') as string);

                      // In production, we could use a structured logger instead
                      if (process.env.NODE_ENV !== 'production') {
                        console.error('Upload error:', error);
                      }
                    }
                  }
                }}
                className={`mb-3 ${styles.inputField}`}
                autoComplete="off"
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className={styles.formLabel}>
                {t('social')}
              </Form.Label>
              {/* Social media inputs */}
              <div className="mb-3 d-flex align-items-center gap-3">
                <img src={FacebookLogo} alt="Facebook Logo" />
                <Form.Control
                  type="url"
                  id="facebook"
                  name="facebookURL"
                  data-testid="facebook"
                  className={`mb-0 mt-0 ${styles.inputField}`}
                  value={profileVariable.facebookURL}
                  onChange={handleOnChange}
                  placeholder={t('url')}
                  autoComplete="off"
                />
              </div>
              <div className="mb-3 d-flex align-items-center gap-3">
                <img src={InstagramLogo} alt="Instagram Logo" />
                <Form.Control
                  type="url"
                  id="instagram"
                  name="instagramURL"
                  data-testid="instagram"
                  className={`mb-0 mt-0 ${styles.inputField}`}
                  value={profileVariable.instagramURL}
                  onChange={handleOnChange}
                  placeholder={t('url')}
                  autoComplete="off"
                />
              </div>
              <div className="mb-3 d-flex align-items-center gap-3">
                <img src={XLogo} alt="X Logo" />
                <Form.Control
                  type="url"
                  id="X"
                  name="xURL"
                  data-testid="X"
                  className={`mb-0 mt-0 ${styles.inputField}`}
                  value={profileVariable.xURL}
                  onChange={handleOnChange}
                  placeholder={t('url')}
                  autoComplete="off"
                />
              </div>
              <div className="mb-3 d-flex align-items-center gap-3">
                <img src={LinkedInLogo} alt="LinkedIn Logo" />
                <Form.Control
                  type="url"
                  id="linkedIn"
                  name="linkedInURL"
                  data-testid="linkedIn"
                  className={`mb-0 mt-0 ${styles.inputField}`}
                  value={profileVariable.linkedInURL}
                  onChange={handleOnChange}
                  placeholder={t('url')}
                  autoComplete="off"
                />
              </div>
              <div className="mb-3 d-flex align-items-center gap-3">
                <img src={GithubLogo} alt="Github Logo" />
                <Form.Control
                  type="url"
                  id="github"
                  name="githubURL"
                  data-testid="github"
                  className={`mb-0 mt-0 ${styles.inputField}`}
                  value={profileVariable.githubURL}
                  onChange={handleOnChange}
                  placeholder={t('url')}
                  autoComplete="off"
                />
              </div>
              <div className="mb-3 d-flex align-items-center gap-3">
                <img src={YoutubeLogo} alt="Youtube Logo" />
                <Form.Control
                  type="url"
                  id="youtube"
                  name="youtubeURL"
                  data-testid="youtube"
                  className={`mb-0 mt-0 ${styles.inputField}`}
                  value={profileVariable.youtubeURL}
                  onChange={handleOnChange}
                  placeholder={t('url')}
                  autoComplete="off"
                />
              </div>
              <div className="mb-3 d-flex align-items-center gap-3">
                <img src={RedditLogo} alt="Reddit Logo" />
                <Form.Control
                  type="url"
                  id="reddit"
                  name="redditURL"
                  data-testid="reddit"
                  className={`mb-0 mt-0 ${styles.inputField}`}
                  value={profileVariable.redditURL}
                  onChange={handleOnChange}
                  placeholder={t('url')}
                  autoComplete="off"
                />
              </div>
              <div className="mb-3 d-flex align-items-center gap-3">
                <img src={SlackLogo} alt="Slack Logo" />
                <Form.Control
                  type="url"
                  id="slack"
                  name="slackURL"
                  data-testid="slack"
                  className={`mb-0 mt-0 ${styles.inputField}`}
                  value={profileVariable.slackURL}
                  onChange={handleOnChange}
                  placeholder={t('url')}
                  autoComplete="off"
                />
              </div>
            </Form.Group>
            <div
              className={`${styles.btn} d-flex justify-content-end gap-3 my-3`}
            >
              <Button
                className={styles.outlineBtn}
                onClick={resetData}
                data-testid="resetChangesBtn"
                disabled={isDisabled()}
              >
                {tCommon('resetChanges')}
              </Button>
              <Button
                type="submit"
                data-testid="saveChangesBtn"
                disabled={isDisabled()}
                className={styles.addButton}
              >
                {tCommon('saveChanges')}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      <UpdateSession />
    </>
  );
};

export default CommunityProfile;
