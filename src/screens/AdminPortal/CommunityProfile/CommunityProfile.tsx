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
 * - React,React-Bootstrap, NotificationToast, Apollo Client, and i18next for translations.
 * - Custom components: `Loader` and `UpdateSession`.
 * - Utility functions: `errorHandler`.
 *
 * @returns The rendered CommunityProfile component.
 *
 * component
 * @example
 * // Usage in a parent component
 * ```tsx
 * import CommunityProfile from './CommunityProfile';
 *
 * function App() {
 *   return <CommunityProfile />;
 * }
 *```
 * remarks
 * - The component uses `useEffect` to populate the form with fetched data.
 * - Social media links are displayed with corresponding icons.
 * - Form submission and reset operations are handled asynchronously.
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'shared-components/Button/Button';
import { useMutation, useQuery } from '@apollo/client';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import LoadingState from 'shared-components/LoadingState/LoadingState';
import { GET_COMMUNITY_DATA_PG } from 'GraphQl/Queries/Queries';
import {
  UPDATE_COMMUNITY_PG,
  RESET_COMMUNITY,
} from 'GraphQl/Mutations/mutations';
import { errorHandler } from 'utils/errorHandler';
import UpdateSession from 'components/AdminPortal/UpdateSession/UpdateSession';
import { useMinioUpload } from 'utils/MinioUpload';

const CommunityProfile = (): JSX.Element => {
  // Translation hooks for internationalization
  const { t } = useTranslation('translation', {
    keyPrefix: 'communityProfile',
  });
  const { t: tCommon } = useTranslation('common');

  React.useEffect(() => {
    document.title = t('title'); // Set document title
  }, [t]);

  // Define the type for pre-login imagery data
  type PreLoginImageryDataType = {
    id: string;
    name: string | undefined;
    websiteURL: string | undefined;
    logoURL: string | undefined;
    logoMimeType: string | undefined;
    inactivityTimeoutDuration: number;
    facebookURL: string | undefined;
    instagramURL: string | undefined;
    xURL: string | undefined;
    linkedinURL: string | undefined;
    githubURL: string | undefined;
    youtubeURL: string | undefined;
    redditURL: string | undefined;
    slackURL: string | undefined;
  };

  // State hook for managing profile variables
  const [profileVariable, setProfileVariable] = React.useState({
    name: '',
    websiteURL: '',
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

  interface InterfaceLogoMetadata {
    objectName: string;
    fileHash: string;
    mimetype: string;
    name: string;
  }
  // State for logo metadata (uploaded via MinIO presigned URL)
  const [logoMetadata, setLogoMetadata] =
    React.useState<InterfaceLogoMetadata | null>(null);

  // Track if logo upload is in progress
  const [isLogoUploading, setIsLogoUploading] = React.useState(false);

  // Ref for logo file input to keep DOM and state in sync
  const logoInputRef = React.useRef<HTMLInputElement>(null);

  // MinIO upload hook
  const { uploadFileToMinio } = useMinioUpload();

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
        facebookURL: preLoginData.facebookURL ?? '',
        inactivityTimeoutDuration: preLoginData.inactivityTimeoutDuration,
        instagramURL: preLoginData.instagramURL ?? '',
        xURL: preLoginData.xURL ?? '',
        linkedInURL: preLoginData.linkedinURL ?? '',
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

    if (isLogoUploading) {
      return;
    }

    try {
      await uploadPreLoginImagery({
        variables: {
          logo: logoMetadata || undefined,
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
      NotificationToast.success(t('profileChangedMsg') as string);
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
      setLogoMetadata(null);
      // Clear the file input DOM element
      if (logoInputRef.current) {
        logoInputRef.current.value = '';
      }

      await resetPreLoginImagery({
        variables: { resetPreLoginImageryId: preLoginData?.id },
      });
      NotificationToast.success(t(`resetData`) as string);
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
      (profileVariable.name == '' &&
        profileVariable.websiteURL == '' &&
        logoMetadata === null) ||
      isLogoUploading
    ) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <LoadingState isLoading={loading} variant="spinner">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">{t('title')}</h1>
          <p className="page-subtitle">{t('communityProfileInfo')}</p>
        </div>
      </div>

      <div className="form-card">
        <form onSubmit={handleOnSubmit}>
          {/* Community Info */}
          <div className="form-section">
            <h2>{t('communityName')}</h2>
            <p className="form-section-desc">{t('communityProfileInfo')}</p>
            <div className="form-group">
              <label className="field-label" htmlFor="community-name">
                {t('communityName')}
              </label>
              <input
                type="text"
                id="community-name"
                name="name"
                className="form-input"
                placeholder={t('communityName')}
                value={profileVariable.name}
                onChange={handleOnChange}
                aria-label="Community name"
                autoComplete="off"
              />
            </div>
            <div className="form-group">
              <label className="field-label" htmlFor="community-desc">
                {tCommon('description')}
              </label>
              <textarea
                id="community-desc"
                className="form-input"
                placeholder={tCommon('description')}
                aria-label="Community description"
                data-testid="community-desc"
              />
            </div>
            <div className="form-group">
              <label className="field-label" htmlFor="community-url">
                {t('wesiteLink')}
              </label>
              <input
                type="url"
                id="community-url"
                name="websiteURL"
                className="form-input"
                placeholder="https://example.com"
                value={profileVariable.websiteURL}
                onChange={handleOnChange}
                aria-label="Website URL"
                autoComplete="off"
              />
            </div>
          </div>

          {/* Branding */}
          <div className="form-section">
            <h2>{t('logo')}</h2>
            <p className="form-section-desc">{t('communityProfileInfo')}</p>
            <div className="form-group">
              <label className="field-label">{t('logo')}</label>
              <div
                className="upload-area"
                role="button"
                tabIndex={0}
                aria-label="Upload logo image"
                onClick={() => logoInputRef.current?.click()}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    logoInputRef.current?.click();
                  }
                }}
              >
                <div className="upload-area-icon">
                  <svg
                    aria-hidden="true"
                    width="36"
                    height="36"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <div className="upload-area-text">
                  Click to upload or drag and drop
                </div>
                <div className="upload-area-hint">SVG, PNG or JPG, max 2MB</div>
              </div>
              <input
                type="file"
                id="logo"
                name="logo"
                accept="image/*"
                data-testid="fileInput"
                ref={logoInputRef}
                style={{ display: 'none' }}
                onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    try {
                      setIsLogoUploading(true);
                      const { objectName, fileHash } = await uploadFileToMinio(
                        file,
                        'community',
                      );
                      setLogoMetadata({
                        objectName,
                        fileHash,
                        mimetype: file.type,
                        name: file.name,
                      });
                    } catch (error) {
                      console.error('Error uploading logo:', error);
                      NotificationToast.error({
                        key: 'imageUploadError',
                        namespace: 'errors',
                      });
                      setLogoMetadata(null);
                    } finally {
                      setIsLogoUploading(false);
                    }
                  } else {
                    setLogoMetadata(null);
                  }
                }}
                autoComplete="off"
              />
            </div>
            <div className="form-group">
              <label className="field-label" htmlFor="primary-color">
                Primary Color
              </label>
              <div className="color-picker-row">
                <div
                  className="color-swatch"
                  style={{ background: '#3ecf8e' }}
                  title="Primary color preview"
                ></div>
                <input
                  type="text"
                  id="primary-color"
                  className="form-input color-hex-input"
                  defaultValue="#3ecf8e"
                  aria-label="Primary color hex value"
                />
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="form-section">
            <h2>{t('social')}</h2>
            <p className="form-section-desc">{t('communityProfileInfo')}</p>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="field-label" htmlFor="social-facebook">
                  Facebook URL
                </label>
                <input
                  type="url"
                  id="social-facebook"
                  name="facebookURL"
                  data-testid="facebook"
                  className="form-input"
                  placeholder="https://facebook.com/..."
                  value={profileVariable.facebookURL}
                  onChange={handleOnChange}
                  aria-label="Facebook URL"
                  autoComplete="off"
                />
              </div>

              <div className="form-group">
                <label className="field-label" htmlFor="social-twitter">
                  X (Twitter) URL
                </label>
                <input
                  type="url"
                  id="social-twitter"
                  name="xURL"
                  data-testid="x"
                  className="form-input"
                  placeholder="https://x.com/..."
                  value={profileVariable.xURL}
                  onChange={handleOnChange}
                  aria-label="X Twitter URL"
                  autoComplete="off"
                />
              </div>

              <div className="form-group">
                <label className="field-label" htmlFor="social-github">
                  GitHub URL
                </label>
                <input
                  type="url"
                  id="social-github"
                  name="githubURL"
                  data-testid="github"
                  className="form-input"
                  placeholder="https://github.com/..."
                  value={profileVariable.githubURL}
                  onChange={handleOnChange}
                  aria-label="GitHub URL"
                  autoComplete="off"
                />
              </div>

              <div className="form-group">
                <label className="field-label" htmlFor="social-linkedin">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  id="social-linkedin"
                  name="linkedInURL"
                  data-testid="linkedIn"
                  className="form-input"
                  placeholder="https://linkedin.com/company/..."
                  value={profileVariable.linkedInURL}
                  onChange={handleOnChange}
                  aria-label="LinkedIn URL"
                  autoComplete="off"
                />
              </div>

              <div className="form-group">
                <label className="field-label" htmlFor="social-instagram">
                  Instagram URL
                </label>
                <input
                  type="url"
                  id="social-instagram"
                  name="instagramURL"
                  data-testid="instagram"
                  className="form-input"
                  placeholder="https://instagram.com/..."
                  value={profileVariable.instagramURL}
                  onChange={handleOnChange}
                  aria-label="Instagram URL"
                  autoComplete="off"
                />
              </div>

              <div className="form-group">
                <label className="field-label" htmlFor="social-youtube">
                  YouTube URL
                </label>
                <input
                  type="url"
                  id="social-youtube"
                  name="youtubeURL"
                  data-testid="youtube"
                  className="form-input"
                  placeholder="https://youtube.com/@..."
                  value={profileVariable.youtubeURL}
                  onChange={handleOnChange}
                  aria-label="YouTube URL"
                  autoComplete="off"
                />
              </div>

              <div className="form-group">
                <label className="field-label" htmlFor="social-reddit">
                  Reddit URL
                </label>
                <input
                  type="url"
                  id="social-reddit"
                  name="redditURL"
                  data-testid="reddit"
                  className="form-input"
                  placeholder="https://reddit.com/r/..."
                  value={profileVariable.redditURL}
                  onChange={handleOnChange}
                  aria-label="Reddit URL"
                  autoComplete="off"
                />
              </div>

              <div className="form-group">
                <label className="field-label" htmlFor="social-slack">
                  Slack URL
                </label>
                <input
                  type="url"
                  id="social-slack"
                  name="slackURL"
                  data-testid="slack"
                  className="form-input"
                  placeholder="https://your-workspace.slack.com"
                  value={profileVariable.slackURL}
                  onChange={handleOnChange}
                  aria-label="Slack URL"
                  autoComplete="off"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="form-footer">
            <Button
              className="btn btn-secondary"
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
              className="btn btn-primary"
            >
              {tCommon('saveChanges')}
            </Button>
          </div>
        </form>
      </div>

      <UpdateSession />
    </LoadingState>
  );
};

export default CommunityProfile;
