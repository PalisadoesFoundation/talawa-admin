import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Card, Form } from 'react-bootstrap';
import { useMutation, useQuery } from '@apollo/client';
import { toast } from 'react-toastify';

import Loader from 'components/Loader/Loader';
import { GET_COMMUNITY_DATA } from 'GraphQl/Queries/Queries';
import { UPDATE_COMMUNITY, RESET_COMMUNITY } from 'GraphQl/Mutations/mutations';
import {
  FacebookLogo,
  InstagramLogo,
  TwitterLogo,
  LinkedInLogo,
  GithubLogo,
  YoutubeLogo,
  RedditLogo,
  SlackLogo,
} from 'assets/svgs/social-icons';
import convertToBase64 from 'utils/convertToBase64';
import styles from './CommunityProfile.module.css';
import { errorHandler } from 'utils/errorHandler';

const CommunityProfile = (): JSX.Element => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'communityProfile',
  });

  document.title = t('title');

  type PreLoginImageryDataType = {
    _id: string;
    name: string | undefined;
    websiteLink: string | undefined;
    logoUrl: string | undefined;
    socialMediaUrls: {
      facebook: string | undefined;
      instagram: string | undefined;
      twitter: string | undefined;
      linkedIn: string | undefined;
      gitHub: string | undefined;
      youTube: string | undefined;
      reddit: string | undefined;
      slack: string | undefined;
    };
  };

  const [profileVariable, setProfileVariable] = React.useState({
    name: '',
    websiteLink: '',
    logoUrl: '',
    facebook: '',
    instagram: '',
    twitter: '',
    linkedIn: '',
    github: '',
    youtube: '',
    reddit: '',
    slack: '',
  });

  const { data, loading } = useQuery(GET_COMMUNITY_DATA);
  const [uploadPreLoginImagery] = useMutation(UPDATE_COMMUNITY);
  const [resetPreLoginImagery] = useMutation(RESET_COMMUNITY);

  React.useEffect(() => {
    const preLoginData: PreLoginImageryDataType | undefined =
      data?.getCommunityData;
    preLoginData &&
      setProfileVariable({
        name: preLoginData.name ?? '',
        websiteLink: preLoginData.websiteLink ?? '',
        logoUrl: preLoginData.logoUrl ?? '',
        facebook: preLoginData.socialMediaUrls.facebook ?? '',
        instagram: preLoginData.socialMediaUrls.instagram ?? '',
        twitter: preLoginData.socialMediaUrls.twitter ?? '',
        linkedIn: preLoginData.socialMediaUrls.linkedIn ?? '',
        github: preLoginData.socialMediaUrls.gitHub ?? '',
        youtube: preLoginData.socialMediaUrls.youTube ?? '',
        reddit: preLoginData.socialMediaUrls.reddit ?? '',
        slack: preLoginData.socialMediaUrls.slack ?? '',
      });
  }, [data]);

  const handleOnChange = (e: any): void => {
    setProfileVariable({
      ...profileVariable,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    try {
      await uploadPreLoginImagery({
        variables: {
          data: {
            name: profileVariable.name,
            websiteLink: profileVariable.websiteLink,
            logo: profileVariable.logoUrl,
            socialMediaUrls: {
              facebook: profileVariable.facebook,
              instagram: profileVariable.instagram,
              twitter: profileVariable.twitter,
              linkedIn: profileVariable.linkedIn,
              gitHub: profileVariable.github,
              youTube: profileVariable.youtube,
              reddit: profileVariable.reddit,
              slack: profileVariable.slack,
            },
          },
        },
      });
      toast.success(t('profileChangedMsg'));
    } catch (error: any) {
      /* istanbul ignore next */
      errorHandler(t, error);
    }
  };

  const resetData = async (): Promise<void> => {
    const preLoginData: PreLoginImageryDataType | undefined =
      data?.getCommunityData;
    try {
      setProfileVariable({
        name: '',
        websiteLink: '',
        logoUrl: '',
        facebook: '',
        instagram: '',
        twitter: '',
        linkedIn: '',
        github: '',
        youtube: '',
        reddit: '',
        slack: '',
      });

      await resetPreLoginImagery({
        variables: {
          resetPreLoginImageryId: preLoginData?._id,
        },
      });
      toast.success(t(`resetData`));
    } catch (error: any) {
      /* istanbul ignore next */
      errorHandler(t, error);
    }
  };

  const isDisabled = (): boolean => {
    if (
      profileVariable.name == '' &&
      profileVariable.websiteLink == '' &&
      profileVariable.logoUrl == ''
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
              className="mb-3"
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
              id="websiteLink"
              name="websiteLink"
              value={profileVariable.websiteLink}
              onChange={handleOnChange}
              className="mb-3"
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
                const file = target.files && target.files[0];
                const base64file = file && (await convertToBase64(file));
                setProfileVariable({
                  ...profileVariable,
                  logoUrl: base64file ?? '',
                });
              }}
              className="mb-3"
              autoComplete="off"
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label className={styles.formLabel}>{t('social')}</Form.Label>
            <div className="mb-3 d-flex align-items-center gap-3">
              <img src={FacebookLogo} alt="Facebook Logo" />
              <Form.Control
                type="url"
                id="facebook"
                name="facebook"
                data-testid="facebook"
                className={styles.socialInput}
                value={profileVariable.facebook}
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
                name="instagram"
                data-testid="instagram"
                className={styles.socialInput}
                value={profileVariable.instagram}
                onChange={handleOnChange}
                placeholder={t('url')}
                autoComplete="off"
              />
            </div>
            <div className="mb-3 d-flex align-items-center gap-3">
              <img src={TwitterLogo} alt="Twitter Logo" />
              <Form.Control
                type="url"
                id="twitter"
                name="twitter"
                data-testid="twitter"
                className={styles.socialInput}
                value={profileVariable.twitter}
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
                name="linkedIn"
                data-testid="linkedIn"
                className={styles.socialInput}
                value={profileVariable.linkedIn}
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
                name="github"
                data-testid="github"
                className={styles.socialInput}
                value={profileVariable.github}
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
                name="youtube"
                data-testid="youtube"
                className={styles.socialInput}
                value={profileVariable.youtube}
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
                name="reddit"
                data-testid="reddit"
                className={styles.socialInput}
                value={profileVariable.reddit}
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
                name="slack"
                data-testid="slack"
                className={styles.socialInput}
                value={profileVariable.slack}
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
              variant="outline-success"
              onClick={resetData}
              data-testid="resetChangesBtn"
              disabled={isDisabled()}
            >
              Reset Changes
            </Button>
            <Button
              type="submit"
              data-testid="saveChangesBtn"
              disabled={isDisabled()}
            >
              Save Changes
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default CommunityProfile;
