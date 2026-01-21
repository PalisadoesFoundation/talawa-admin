import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import dayjs from 'dayjs';
import Avatar from 'shared-components/Avatar/Avatar';
import DynamicDropDown from 'components/DynamicDropDown/DynamicDropDown';
import DatePicker from 'shared-components/DatePicker';
import Button from 'shared-components/Button/Button';
import { sanitizeAvatars } from 'utils/sanitizeAvatar';
import {
  educationGradeEnum,
  maritalStatusEnum,
  genderEnum,
  employmentStatusEnum,
} from 'utils/formEnumFields';
import { IPersonalDetailsCardProps } from '../../types/shared-components/ProfileForm/interface';
import styles from './PersonalDetailsCard.module.css';

const PersonalDetailsCard: React.FC<IPersonalDetailsCardProps> = ({
  formState,
  userData,
  t,
  tCommon,
  fileInputRef,
  selectedAvatar,
  handleFileUpload,
  handleFieldChange,
}) => {
  return (
    <Card className={styles.allRound}>
      <Card.Header
        className={`py-3 px-4 d-flex justify-content-between align-items-center ${styles.topRadius} ${styles.personalDetailsHeader}`}
      >
        <h3 className="m-0">{t('personalDetailsHeading')}</h3>
        <Button
          variant="light"
          size="sm"
          disabled
          className="rounded-pill fw-bolder"
        >
          {userData?.user?.role === 'administrator'
            ? tCommon('Admin')
            : tCommon('User')}
        </Button>
      </Card.Header>
      <Card.Body className="py-3 px-3">
        <Col lg={12} className="mb-2">
          <div className="text-center mb-3">
            <div className="position-relative d-inline-block">
              {formState?.avatarURL ? (
                <img
                  className={`rounded-circle ${styles.profileImage}`}
                  src={sanitizeAvatars(selectedAvatar, formState.avatarURL)}
                  alt={tCommon('user')}
                  data-testid="profile-picture"
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
                className={`fas fa-edit position-absolute border-0 p-2 bg-white rounded-circle ${styles.editProfileIcon}`}
                onClick={() => fileInputRef.current?.click()}
                data-testid="uploadImageBtn"
                title={`${tCommon('edit')} ${tCommon('profilePicture')}`}
                aria-label={`${tCommon('edit')} ${tCommon('profilePicture')}`}
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === 'Enter' && fileInputRef.current?.click()
                }
              />
            </div>
          </div>
          <input
            accept="image/*"
            id="postphoto"
            name="photo"
            type="file"
            className={`form-control ${styles.hiddenFileInput}`}
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
              setFormState={() => {}}
              fieldOptions={genderEnum}
              fieldName="natalSex"
              handleChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
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
              onChange={(date: dayjs.Dayjs | null) => {
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
              setFormState={() => {}}
              fieldOptions={educationGradeEnum}
              fieldName="educationGrade"
              handleChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
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
              setFormState={() => {}}
              fieldOptions={employmentStatusEnum}
              fieldName="employmentStatus"
              handleChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
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
              setFormState={() => {}}
              fieldOptions={maritalStatusEnum}
              fieldName="maritalStatus"
              handleChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
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
              placeholder="* * * * * * * *"
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

export default PersonalDetailsCard;
