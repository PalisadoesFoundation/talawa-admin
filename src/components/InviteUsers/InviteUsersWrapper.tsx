import React, { useState } from "react";
import { Button } from "react-bootstrap";
import Styles from './InviteUsersWrapper.module.css'
import IconComponent from "components/IconComponent/IconComponent";
import { InviteUserModal } from "./InviteUsersModal";

type PropType = {
    eventId: string;
    orgId: string;
};

export const InviteUsersWrapper = (props: PropType): JSX.Element => {
    const [showModal, setShowModal] = useState(false);

    return (  
        <>
            <Button
                variant="light"
                className="text-secondary"
                aria-label="checkInRegistrants"
                onClick={(): void => {
                setShowModal(true);
                }}
            >
                <div className={Styles.iconWrapper}>
                    <IconComponent name="Invite Users" fill="var(--bs-secondary)" />
                </div>
                Invite Users
            </Button>

            {showModal && (
                <InviteUserModal
                    show={showModal}
                    handleClose={(): void => {
                        setShowModal(false);
                    }}
                    eventId={props.eventId}
                    orgId={props.orgId}
                />
            )}
        </>
    );
};