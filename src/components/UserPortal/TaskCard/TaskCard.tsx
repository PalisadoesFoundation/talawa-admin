import React from 'react';
import styles from './TaskCard.module.css';
import TimerIcon from '@mui/icons-material/Timer';
import DescriptionIcon from '@mui/icons-material/Description';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import CreateIcon from '@mui/icons-material/Create';
import EventIcon from '@mui/icons-material/Event';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import { Badge } from 'react-bootstrap';
import { Tooltip } from '@mui/material';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

interface InterfaceTaskCardProps {
  id: string;
  title: string;
  deadline: string;
  description: string;
  volunteers: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  }[];
  creator: {
    id: string;
    firstName: string;
    lastName: string;
  };
  event: {
    id: string;
    title: string;
    organization: {
      id: string;
      name: string;
      image: string | null;
    };
  };
  createdAt: string;
  completed: boolean;
}

function taskCard(props: InterfaceTaskCardProps): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'userTaskCard',
  });

  const creatorName = `${props.creator.firstName} ${props.creator.lastName}`;

  return (
    <div className={styles.mainContainer}>
      <div className={styles.cardDetails}>
        <h5>
          <b>{props.title}</b>
        </h5>

        <div className={styles.cardDetail}>
          <Tooltip title={t('event')}>
            <EventIcon className={styles.fillPrimary} />
          </Tooltip>{' '}
          {props.event.title}
        </div>

        <div className={styles.cardDetail}>
          <Tooltip title={t('organization')}>
            <CorporateFareIcon className={styles.fillPrimary} />
          </Tooltip>{' '}
          {props.event.organization.name}
        </div>

        <div className={styles.cardDetail}>
          <Tooltip title={t('description')}>
            <DescriptionIcon className={styles.fillPrimary} />
          </Tooltip>{' '}
          {props.description}
        </div>

        <div className={styles.cardDetail}>
          <Tooltip title={t('deadline')}>
            <TimerIcon className={styles.fillPrimary} />
          </Tooltip>{' '}
          {dayjs(props.deadline).format('llll')}
        </div>

        <div className={styles.cardDetail}>
          <Tooltip title={t('created')}>
            <CreateIcon className={styles.fillPrimary} />
          </Tooltip>{' '}
          {`${dayjs(props.createdAt).format('llll')} by ${creatorName}`}
        </div>

        <div className={styles.cardDetail}>
          <Tooltip title={t('assignees')}>
            <AssignmentIndIcon className={styles.fillPrimary} />
          </Tooltip>
          {props.volunteers.map((volunteer: any, index) => {
            const name = `${volunteer.firstName} ${volunteer.lastName}`;

            return (
              <Tooltip key={index} title={volunteer.email}>
                <Badge className={styles.badge}>{name}</Badge>
              </Tooltip>
            );
          })}
        </div>

        {props.completed ? (
          <Tooltip title={t('taskCompleted')}>
            <Badge
              bg="success"
              className={`${styles.fitContent} ${styles.marginTop}`}
            >
              {t('completed')}
            </Badge>
          </Tooltip>
        ) : (
          <Tooltip title={t('taskNotCompleted')}>
            <Badge
              bg="danger"
              className={`${styles.fitContent} ${styles.marginTop}`}
            >
              {t('incomplete')}
            </Badge>
          </Tooltip>
        )}
      </div>
    </div>
  );
}

export default taskCard;
