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
