import React, { useState } from 'react';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { green } from '@mui/material/colors';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { UpdateTaskModal } from './TaskModals/UpdateTaskModal';

interface UserInterface {
  _id: string;
  firstName: string;
  lastName: string;
}
interface TaskInterface {
  _id: string;
  title: string;
  deadline: string;
  description: string;
  volunteers: [UserInterface];
}

interface PropType {
  task: TaskInterface;
  refetchData: () => void;
  organization: {
    _id: string;
    members: [UserInterface];
  };
}

export const TaskListItem = ({ task, refetchData }: PropType) => {
  const [showUpdateTaskModal, setShowUpdateTaskModal] = useState(false);

  return (
    <>
      <div>
        <ListItem alignItems="flex-start">
          <ListItemAvatar>
            <Avatar
              sx={{
                bgcolor: green[500],
                width: 36,
                height: 36,
              }}
              variant="rounded"
            >
              {' '}
              <AssignmentIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={task.title}
            secondary={
              <React.Fragment>
                <Typography
                  sx={{ display: 'inline' }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                  {task.description}
                </Typography>
              </React.Fragment>
            }
          />
          <Chip
            icon={<EditOutlinedIcon fontSize="small" />}
            label="View"
            variant="outlined"
            onClick={() => {
              setShowUpdateTaskModal(true);
            }}
          />
        </ListItem>
        <Divider component="li" />
        <div>
          {/* Wrapper Div for all the relevant modals */}
          <UpdateTaskModal
            show={showUpdateTaskModal}
            handleClose={() => {
              setShowUpdateTaskModal(false);
            }}
            task={task}
            refetchData={refetchData}
          />
        </div>
      </div>
    </>
  );
};
