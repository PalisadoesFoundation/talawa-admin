/**
 * CommunityProfile Component
 *
 * This component renders a form to manage and update the community profile.
 * It includes fields for community name, website URL, logo, and various social media links.
 * The component fetches existing community data using GraphQL queries and allows
 * users to update or reset the profile information.
 *
 * Features:
 * - Fetches community data using the `GET_COMMUNITY_DATA_PG` query.
 * - Updates community data using the `UPDATE_COMMUNITY_PG` mutation.
 * - Resets community data using the `RESET_COMMUNITY` mutation.
 * - Displays a loader while data is being fetched.
 * - Provides form validation and disables buttons when inputs are empty.
 *
 * Dependencies:
 * - React, React-Bootstrap, React-Toastify, Apollo Client, and i18next for translations.
 * - Custom components: `Loader` and `UpdateSession`.
 * - Utility functions: `convertToBase64` and `errorHandler`.
 *
 * @returns {JSX.Element} The rendered CommunityProfile component.
 *
 * @component
 * @example
 * // Usage in a parent component
 * import CommunityProfile from './CommunityProfile';
 *
 * function App() {
 *   return <CommunityProfile />;
 * }
 *
 * @remarks
 * - The component uses `useEffect` to populate the form with fetched data.
 * - Social media links are displayed with corresponding icons.
 * - Form submission and reset operations are handled asynchronously.
 */
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
import convertToBase64 from 'utils/convertToBase64';
import styles from 'style/app-fixed.module.css';
import { errorHandler } from 'utils/errorHandler';
import UpdateSession from '../../components/UpdateSession/UpdateSession';

const CommunityProfile = (): JSX.Element => {
  // Translation hooks for internationalization
  const { t } = useTranslation('translation', {
    keyPrefix: 'communityProfile',
  });
  const { t: tCommon } = useTranslation('common');

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
    setProfileVariable({ ...profileVariable, [e.target.name]: e.target.value });
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
        variables: { resetPreLoginImageryId: preLoginData?.id },
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
                onChange={async (
                  e: React.ChangeEvent<HTMLInputElement>,
                ): Promise<void> => {
                  setProfileVariable((prevInput) => ({
                    ...prevInput,
                    logo: '',
                  }));
                  const target = e.target as HTMLInputElement;
                  const file = target.files?.[0];
                  const base64file = file && (await convertToBase64(file));
                  setProfileVariable({
                    ...profileVariable,
                    logo: base64file ?? '',
                  });
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
