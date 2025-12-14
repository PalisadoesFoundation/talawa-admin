export interface InterfaceOrgPeopleListCardProps {
  id: string | undefined;
  toggleRemoveModal: () => void;
}

export interface InterfaceOrganizationCardStartProps {
  image: string;
  id: string;
  name: string;
}

export interface InterfaceOrgPostCardProps {
  postID: string;
  id: string;
  postTitle: string;
  postInfo: string;
  postAuthor: string;
  postPhoto: string | null;
  postVideo: string | null;
  pinned: boolean;
}
