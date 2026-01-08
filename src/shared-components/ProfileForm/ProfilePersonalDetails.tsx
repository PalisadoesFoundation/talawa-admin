/**
 * ProfilePersonalDetails component
 *
 * This component renders the personal details section of the user profile form.
 * It includes fields for name, gender, birth date, education, employment, marital status,
 * password, and description, as well as the avatar upload functionality.
 */
import React from 'react';
import { Card, Row, Col, Badge } from 'react-bootstrap';
import Edit from '@mui/icons-material/Edit';
import styles from 'style/app-fixed.module.css';
import memberDetailStyles from './MemberDetail.module.css';
import Avatar from 'components/Avatar/Avatar';
import DynamicDropDown from 'components/DynamicDropDown/DynamicDropDown';
import DatePicker from 'shared-components/DatePicker';
import { sanitizeAvatars } from 'utils/sanitizeAvatar';
import dayjs from 'dayjs';
import {
  educationGradeEnum,
  maritalStatusEnum,
  genderEnum,
  employmentStatusEnum,
} from 'utils/formEnumFields';
import { useTranslation } from 'react-i18next';
import { IProfilePersonalDetailsProps } from './types';
import { USER_ROLES } from 'constants/userRoles';

const ProfilePersonalDetails: React.FC<IProfilePersonalDetailsProps> = ({
  formState,
  setFormState,
  handleFieldChange,
  selectedAvatar,
  fileInputRef,
  handleFileUpload,
  userRole,
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'memberDetail' });
  const { t: tCommon } = useTranslation('common');
  return (
    <Card className={`${styles.allRound}`}>
      <Card.Header
        className={`py-3 px-4 d-flex justify-content-between align-items-center ${styles.topRadius} ${memberDetailStyles.personalDetailsHeader}`}
      >
        <h3 className="m-0">{t('personalDetailsHeading')}</h3>
        <Badge
          bg="light"
          text="dark"
          className="rounded-pill fw-bolder fs-6 px-3 py-2"
        >
          {(() => {
            switch (userRole) {
              case USER_ROLES.ADMIN:
                return tCommon('Admin');
              case USER_ROLES.USER:
                return tCommon('User');
              default:
                return tCommon('User');
            }
          })()}
        </Badge>
      </Card.Header>
      <Card.Body className="py-3 px-3">
        <Col lg={12} className="mb-2">
          <div className="text-center mb-3">
            <div className="position-relative d-inline-block">
              {formState?.avatarURL ? (
                <img
                  className={`rounded-circle ${memberDetailStyles.profileImage}`}
                  src={sanitizeAvatars(selectedAvatar, formState.avatarURL)}
                  alt={tCommon('user')}
                  data-testid="profile-picture"
                  // enables credential-free CORS so the browser can load cross-origin images for use in canvas operations without tainting the canvas
                  crossOrigin="anonymous"
                />
              ) : (
                <Avatar
                  name={formState.name}
                  alt={tCommon('displayImage')}
                  size={60}
                  dataTestId="profile-picture"
                  radius={150}
                />
              )}
              <button
                type="button"
                className={`position-absolute border-0 bottom-0 right-0 p-2 bg-white rounded-circle ${memberDetailStyles.editProfileIcon}`}
                onClick={() => fileInputRef.current?.click()}
                data-testid="uploadImageBtn"
                title={`${tCommon('edit')} ${tCommon('profilePicture')}`}
                aria-label={`${tCommon('edit')} ${tCommon('profilePicture')}`}
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === 'Enter' && fileInputRef.current?.click()
                }
              >
                <Edit fontSize="small" />
              </button>
            </div>
          </div>
          <input
            accept="image/*"
            id="postphoto"
            name="photo"
            type="file"
            className={`${styles.cardControl} ${memberDetailStyles.hiddenFileInput}`}
            data-testid="fileInput"
            multiple={false}
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
        </Col>
        <Row className="g-3">
          <Col md={6}>
            <label htmlFor="name" className="form-label">
              {tCommon('name')}
            </label>
            <input
              id="name"
              value={formState.name}
              className={`form-control ${styles.inputColor}`}
              type="text"
              name="name"
              data-testid="inputName"
              onChange={(e) => handleFieldChange('name', e.target.value)}
              required
              placeholder={tCommon('name')}
            />
          </Col>
          <Col md={6} data-testid="gender">
            <label htmlFor="gender" className="form-label">
              {t('gender')}
            </label>
            <DynamicDropDown
              formState={formState}
              setFormState={setFormState}
              fieldOptions={genderEnum}
              fieldName="natalSex"
              handleChange={(e) =>
                handleFieldChange('natalSex', e.target.value)
              }
            />
          </Col>
          <Col md={6}>
            <label htmlFor="birthDate" className="form-label">
              {t('birthDate')}
            </label>
            <DatePicker
              className="w-100"
              value={formState.birthDate ? dayjs(formState.birthDate) : null}
              maxDate={dayjs()}
              onChange={(date) => {
                if (!date || !dayjs(date).isValid()) {
                  handleFieldChange('birthDate', '');
                  return;
                }
                const picked = dayjs(date);
                handleFieldChange('birthDate', picked.format('YYYY-MM-DD'));
              }}
              data-testid="birthDate"
              slotProps={{
                textField: {
                  'aria-label': t('birthDate'),
                },
              }}
            />
          </Col>
          <Col md={6}>
            <label htmlFor="grade" className="form-label">
              {t('educationGrade')}
            </label>
            <DynamicDropDown
              formState={formState}
              setFormState={setFormState}
              fieldOptions={educationGradeEnum}
              fieldName="educationGrade"
              handleChange={(e) =>
                handleFieldChange('educationGrade', e.target.value)
              }
            />
          </Col>
          <Col md={6}>
            <label htmlFor="empStatus" className="form-label">
              {t('employmentStatus')}
            </label>
            <DynamicDropDown
              formState={formState}
              setFormState={setFormState}
              fieldOptions={employmentStatusEnum}
              fieldName="employmentStatus"
              handleChange={(e) =>
                handleFieldChange('employmentStatus', e.target.value)
              }
            />
          </Col>
          <Col md={6}>
            <label htmlFor="maritalStatus" className="form-label">
              {t('maritalStatus')}
            </label>
            <DynamicDropDown
              formState={formState}
              setFormState={setFormState}
              fieldOptions={maritalStatusEnum}
              fieldName="maritalStatus"
              handleChange={(e) =>
                handleFieldChange('maritalStatus', e.target.value)
              }
            />
          </Col>
          <Col md={12}>
            <label htmlFor="password" className="form-label">
              {tCommon('password')}
            </label>
            <input
              id="password"
              value={formState.password}
              className={`form-control ${styles.inputColor}`}
              type="password"
              name="password"
              onChange={(e) => handleFieldChange('password', e.target.value)}
              data-testid="inputPassword"
              placeholder={t(
                'passwordPlaceholder',
                'Leave blank to keep current password',
              )}
            />
          </Col>
          <Col md={12}>
            <label htmlFor="description" className="form-label">
              {tCommon('description')}
            </label>
            <input
              id="description"
              value={formState.description}
              className={`form-control ${styles.inputColor}`}
              type="text"
              name="description"
              data-testid="inputDescription"
              onChange={(e) => handleFieldChange('description', e.target.value)}
              required
              placeholder={tCommon('enterDescription')}
            />
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default ProfilePersonalDetails;
