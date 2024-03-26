import React, {useState} from "react";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "@apollo/client";
import { INVITE_USER } from "GraphQl/Mutations/EventAttendeeMutations";
import styles from './InviteUserModal.module.css'
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { GET_EVENT_ATTENDEE, MEMBERS_LIST } from "GraphQl/Queries/Queries";

type ModalPropType = {
    show: boolean;
    eventId: string;
    orgId: string;
    handleClose: () => void;
};

interface InterfaceUser {
    _id: string;
    firstName: string;
    lastName: string;
}

export const InviteUserModal = (props: ModalPropType): JSX.Element => {
    const [member, setMember] = useState<InterfaceUser | null>(null);

    const [inviteUsersMutation] = useMutation(INVITE_USER);

    const {
        data: invitedUserData,
        loading: invitedUserLoading,
        refetch: invitedUsersRefectch,
    } = useQuery(GET_EVENT_ATTENDEE, {
        variables: { id: props.eventId },
    });

    const { data: memberData, loading: memberLoading } = useQuery(MEMBERS_LIST, {
        variables: { id: props.orgId },
    });

    const InviteEventAttendee = (): void => {
        if(member === null) {
            toast.warning(`Please choose an user to Invite first!`);
            return;
        }
        toast.warn(`Inviting the attendee...`);
        inviteUsersMutation({
            variables: {
                userId: member._id,
                eventId: props.eventId,
            },
        })
        .then(() => {
            toast.success(`Invited the Attendee successfully!`);
            invitedUsersRefectch();
        })
        .catch((err) => {
            toast.error('There was an error in adding the attendee!');
            toast.error(err.message);
        });
    };

    // Render the loading screen
    if (invitedUserLoading || memberLoading) {
        return (
        <>
            <div className={styles.loader}></div>
        </>
        );
    }
    
    return (
        <>
        <Modal
            show={props.show}
            onHide={props.handleClose}
            backdrop="static"
            centered
        >
            <Modal.Header closeButton className="bg-primary">
                <Modal.Title className="text-white">Invite Event Attendee</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5 className="mb-2">Registered Registrants</h5>
                {invitedUserData.event.attendee.length == 0
                    ? `There are no registered attendee for this event.`
                    : null}
                <Stack direction="row" className="flex-wrap gap-2">
                    {invitedUserData.event.attendee.map((invitedAttendee: InterfaceUser) => {
                        <Chip
                            avatar={
                                <Avatar>{`${invitedAttendee.firstName[0]} ${invitedAttendee.lastName[0]}`}</Avatar>
                            }
                            label={`${invitedAttendee.firstName} ${invitedAttendee.lastName}`}
                            variant="outlined"
                            key={invitedAttendee._id}
                        />
                    })}
                </Stack>
                <br/>
                <Autocomplete
                    id="inviteAttendee"
                    onChange={(_, member): void => {
                        setMember(member);
                    }}
                    options={memberData.organizations[0].members}
                    getOptionLabel={(member: InterfaceUser): string =>
                    `${member.firstName} ${member.lastName}`
                    }
                    renderInput={(params): React.ReactNode => (
                        <TextField
                            {...params}
                            label="Add an Registrant"
                            placeholder="Choose the user that you want to add"
                        />
                    )}
                />
                <br/>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="success" onClick={InviteEventAttendee}>
                    Invite Attendee
                </Button>
            </Modal.Footer>
        </Modal>
        </>
    )
}