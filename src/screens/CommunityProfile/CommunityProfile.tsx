import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Card, Form } from 'react-bootstrap';
import { useMutation } from '@apollo/client';

import { UPLOAD_PRELOGIN_IMAGERY } from 'GraphQl/Mutations/mutations';
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

const CommunityProfile = (): JSX.Element => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'communityProfile',
  });

  document.title = t('title');

  const [profileVariable, setProfileVariable] = React.useState({
    name: '',
    websiteLink: '',
    logo: '',
    facebookUrl: '',
    instagramUrl: '',
    twitterUrl: '',
    linkedInUrl: '',
    githubUrl: '',
    youtubeUrl: '',
    redditUrl: '',
    slackUrl: '',
  });

  const [upload] = useMutation(UPLOAD_PRELOGIN_IMAGERY);

  const handleOnChange = (e: any): void => {
    setProfileVariable({
      ...profileVariable,
      [e.target.name]: e.target.value,
    });
  };
  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    upload({
      variables: {
        data: {
          id: '2',
          name: profileVariable.name,
          websiteLink: profileVariable.websiteLink,
          logo: profileVariable.logo,
          facebookUrl: profileVariable.facebookUrl,
          instagramUrl: profileVariable.instagramUrl,
          twitterUrl: profileVariable.twitterUrl,
          linkedInUrl: profileVariable.linkedInUrl,
          githubUrl: profileVariable.githubUrl,
          youtubeUrl: profileVariable.youtubeUrl,
          redditUrl: profileVariable.redditUrl,
          slackUrl: profileVariable.slackUrl,
        },
      },
    });
  };

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
                const file = e.target.files?.[0];
                const base64file = file ? await convertToBase64(file) : '';
                setProfileVariable({
                  ...profileVariable,
                  logo: base64file,
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
                name="facebookUrl"
                data-testid="facebook"
                className={styles.socialInput}
                value={profileVariable.facebookUrl}
                onChange={handleOnChange}
                placeholder={t('url')}
                autoComplete="off"
                required
              />
            </div>
            <div className="mb-3 d-flex align-items-center gap-3">
              <img src={InstagramLogo} alt="Instagram Logo" />
              <Form.Control
                type="url"
                id="instagram"
                name="instagramUrl"
                data-testid="instagram"
                className={styles.socialInput}
                value={profileVariable.instagramUrl}
                onChange={handleOnChange}
                placeholder={t('url')}
                autoComplete="off"
                required
              />
            </div>
            <div className="mb-3 d-flex align-items-center gap-3">
              <img src={TwitterLogo} alt="Twitter Logo" />
              <Form.Control
                type="url"
                id="twitter"
                name="twitterUrl"
                data-testid="twitter"
                className={styles.socialInput}
                value={profileVariable.twitterUrl}
                onChange={handleOnChange}
                placeholder={t('url')}
                autoComplete="off"
                required
              />
            </div>
            <div className="mb-3 d-flex align-items-center gap-3">
              <img src={LinkedInLogo} alt="LinkedIn Logo" />
              <Form.Control
                type="url"
                id="linkedIn"
                name="linkedInUrl"
                data-testid="linkedIn"
                className={styles.socialInput}
                value={profileVariable.linkedInUrl}
                onChange={handleOnChange}
                placeholder={t('url')}
                autoComplete="off"
                required
              />
            </div>
            <div className="mb-3 d-flex align-items-center gap-3">
              <img src={GithubLogo} alt="Github Logo" />
              <Form.Control
                type="url"
                id="github"
                name="githubUrl"
                data-testid="github"
                className={styles.socialInput}
                value={profileVariable.githubUrl}
                onChange={handleOnChange}
                placeholder={t('url')}
                autoComplete="off"
                required
              />
            </div>
            <div className="mb-3 d-flex align-items-center gap-3">
              <img src={YoutubeLogo} alt="Youtube Logo" />
              <Form.Control
                type="url"
                id="youtube"
                name="youtubeUrl"
                data-testid="youtube"
                className={styles.socialInput}
                value={profileVariable.youtubeUrl}
                onChange={handleOnChange}
                placeholder={t('url')}
                autoComplete="off"
                required
              />
            </div>
            <div className="mb-3 d-flex align-items-center gap-3">
              <img src={RedditLogo} alt="Reddit Logo" />
              <Form.Control
                type="url"
                id="reddit"
                name="redditUrl"
                data-testid="reddit"
                className={styles.socialInput}
                value={profileVariable.redditUrl}
                onChange={handleOnChange}
                placeholder={t('url')}
                autoComplete="off"
                required
              />
            </div>
            <div className="mb-3 d-flex align-items-center gap-3">
              <img src={SlackLogo} alt="Slack Logo" />
              <Form.Control
                type="url"
                id="slack"
                name="slackUrl"
                data-testid="slack"
                className={styles.socialInput}
                value={profileVariable.slackUrl}
                onChange={handleOnChange}
                placeholder={t('url')}
                autoComplete="off"
                required
              />
            </div>
          </Form.Group>
          <div
            className={`${styles.btn} d-flex justify-content-end gap-3 my-3`}
          >
            <Button
              variant="outline-success"
              onClick={() =>
                setProfileVariable({
                  name: '',
                  websiteLink: '',
                  logo: '',
                  facebookUrl: '',
                  instagramUrl: '',
                  twitterUrl: '',
                  linkedInUrl: '',
                  githubUrl: '',
                  youtubeUrl: '',
                  redditUrl: '',
                  slackUrl: '',
                })
              }
            >
              Reset Changes
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default CommunityProfile;
