import React from 'react';
import { Table, Button } from 'react-bootstrap';

interface InterfaceMember {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  birthDate: Date;
}

interface CollapsibleTableProps {
  isTableCollapsed: boolean;
  clickedData: InterfaceMember[];
  onToggle: () => void;
}

const CollapsibleTable: React.FC<CollapsibleTableProps> = ({
  isTableCollapsed,
  clickedData,
  onToggle,
}) => {
  if (isTableCollapsed) {
    return (
      <Button variant="outline-success" onClick={onToggle}>
        Show Attendees
      </Button>
    );
  }

  return (
    <div className="mt-3">
      <Button variant="outline-success" onClick={onToggle} className="mb-2">
        Hide Attendees
      </Button>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Gender</th>
            <th>Birth Date</th>
          </tr>
        </thead>
        <tbody>
          {clickedData.map((member) => (
            <tr key={member._id}>
              <td>{`${member.firstName} ${member.lastName}`}</td>
              <td>{member.email}</td>
              <td>{member.gender}</td>
              <td>{new Date(member.birthDate).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default CollapsibleTable;