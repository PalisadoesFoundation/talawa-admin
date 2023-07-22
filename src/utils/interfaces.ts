export interface InterfaceUserType {
  user: {
    firstName: string;
    lastName: string;
    image: string;
    email: string;
    userType: string;
    adminFor: {
      _id: string;
      name: string;
      image: string;
    }[];
  };
}

export interface InterfaceOrgConnectionInfoType {
  _id: string;
  image: string;
  creator: {
    firstName: string;
    lastName: string;
  };
  name: string;
  members: {
    _id: string;
  }[];
  admins: {
    _id: string;
  }[];
  createdAt: string;
  location: string;
}
export interface InterfaceOrgConnectionType {
  organizationsConnection: InterfaceOrgConnectionInfoType[];
}
