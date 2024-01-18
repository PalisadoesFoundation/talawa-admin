import React from 'react';
import UserNavbar from 'components/UserPortal/UserNavbar/UserNavbar';
import TaskCard from 'components/UserPortal/TaskCard/TaskCard';
import UserSidebar from 'components/UserPortal/UserSidebar/UserSidebar';
import PaginationList from 'components/PaginationList/PaginationList';
import { USER_TASKS_LIST } from 'GraphQl/Queries/Queries';
import { useQuery } from '@apollo/client';
import styles from './Tasks.module.css';
import { useTranslation } from 'react-i18next';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';

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

export default function tasks(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'userTasks',
  });

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [tasks, setTasks] = React.useState([]);

  const userId: string | null = localStorage.getItem('userId');

  const { data: tasksData, loading: loadingTasks } = useQuery(USER_TASKS_LIST, {
    variables: { id: userId },
  });

  /* istanbul ignore next */
  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ): void => {
    setPage(newPage);
  };

  /* istanbul ignore next */
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    const newRowsPerPage = event.target.value;

    setRowsPerPage(parseInt(newRowsPerPage, 10));
    setPage(0);
  };

  /* istanbul ignore next */
  React.useEffect(() => {
    if (tasksData) {
      setTasks(tasksData.user.assignedTasks);
    }
  }, [tasksData]);

  return (
    <>
      <UserNavbar />
      <div className={`d-flex flex-row ${styles.containerHeight}`}>
        <UserSidebar />
        <div className={`${styles.colorLight} ${styles.mainContainer}`}>
          <h3>{t('yourAssignedTasks')}</h3>
          <div
            className={`d-flex flex-column justify-content-between ${styles.content}`}
          >
            <div
              className={`d-flex flex-column ${styles.gap} ${styles.paddingY}`}
            >
              {loadingTasks ? (
                <div className={`d-flex flex-row justify-content-center`}>
                  <HourglassBottomIcon /> <span>Loading...</span>
                </div>
              ) : (
                <>
                  {tasks && tasks.length > 0 ? (
                    (rowsPerPage > 0
                      ? tasks.slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage,
                        )
                      : /* istanbul ignore next */
                        tasks
                    ).map((task: any, index) => {
                      const volunteers: any = task.volunteers.map(
                        (volunteer: any) => {
                          return {
                            id: volunteer._id,
                            firstName: volunteer.firstName,
                            lastName: volunteer.lastName,
                            email: volunteer.email,
                          };
                        },
                      );

                      const cardProps: InterfaceTaskCardProps = {
                        title: task.title,
                        id: task._id,
                        description: task.description,
                        deadline: task.deadline,
                        volunteers,
                        createdAt: task.createdAt,
                        completed: task.completed,
                        creator: {
                          id: task.creator._id,
                          firstName: task.creator.firstName,
                          lastName: task.creator.lastName,
                        },
                        event: {
                          id: task.event._id,
                          title: task.event.title,
                          organization: {
                            id: task.event.organization._id,
                            name: task.event.organization.name,
                            image: task.event.organization.image,
                          },
                        },
                      };

                      return <TaskCard key={index} {...cardProps} />;
                    })
                  ) : (
                    <span>{t('nothingToShow')}</span>
                  )}
                </>
              )}
            </div>
            <table>
              <tbody>
                <tr>
                  <PaginationList
                    count={
                      /* istanbul ignore next */
                      tasks ? tasks.length : 0
                    }
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
