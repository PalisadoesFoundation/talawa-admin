export type Donation = {
  _id: string;
  amount: number;
  createdAt: Date;
  nameOfOrg: string;
  nameOfUser: string;
  orgId: string;
  payPalId: string;
  updatedAt: Date;
  userId: string;
};

export type DonationWhereInput = {
  id?: string; //optional
  id_contains?: string; //optional
  id_in?: string[]; //non-null elements
  id_not?: string; //optional
  id_not_in?: string[]; //non-null elements
  id_starts_with?: string; //optional
  name_of_user?: string; //optional
  name_of_user_contains?: string; //optional
  name_of_user_in?: string[]; //non-null elements
  name_of_user_not?: string; //optional
  name_of_user_not_in?: string[]; //non-null elements
  name_of_user_starts_with?: string; //optional
};
