import dayjs from 'dayjs';
import type {
  InterfaceQueryFundCampaignsPledges,
  InterfaceCampaignInfoPG,
} from 'utils/interfaces';

export enum ModalState {
  SAME = 'same',
  DELETE = 'delete',
}

export const dataGridStyle = {
  '&.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
    outline: 'none !important',
  },
  '&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus-within': {
    outline: 'none',
  },
  '& .MuiDataGrid-row:hover': { backgroundColor: 'transparent' },
  '& .MuiDataGrid-row.Mui-hovered': { backgroundColor: 'transparent' },
  '& .MuiDataGrid-root': { borderRadius: '0.5rem' },
  '& .MuiDataGrid-main': { borderRadius: '0.5rem' },
};

export const processPledgesData = (
  pledgeData: { fundCampaign: InterfaceQueryFundCampaignsPledges } | undefined,
  searchTerm: string,
  sortBy: 'amount_ASC' | 'amount_DESC' | 'endDate_ASC' | 'endDate_DESC',
  tCommon: (key: string) => string,
) => {
  let totalPledged = 0;

  const pledgesList =
    pledgeData?.fundCampaign?.pledges?.edges.map((edge) => {
      const amount = edge.node.amount || 0;
      totalPledged += amount;

      const allUsers =
        'users' in edge.node && Array.isArray(edge.node.users)
          ? edge.node.users
          : [edge.node.pledger];

      return {
        id: edge.node.id,
        amount: amount,
        pledgeDate: edge.node.createdAt
          ? new Date(edge.node.createdAt)
          : new Date(),
        endDate: pledgeData.fundCampaign.endAt
          ? new Date(pledgeData.fundCampaign.endAt)
          : new Date(),
        users: allUsers.filter(Boolean),
        currency: pledgeData.fundCampaign.currencyCode || 'USD',
      };
    }) ?? [];

  const filteredPledges = searchTerm
    ? pledgesList.filter((pledge) => {
        const search = searchTerm.toLowerCase();
        return pledge.users.some((user) =>
          user.name?.toLowerCase().includes(search),
        );
      })
    : pledgesList;

  const sortedPledges = [...filteredPledges].sort((a, b) => {
    switch (sortBy) {
      case 'amount_ASC':
        return a.amount - b.amount;
      case 'amount_DESC':
        return b.amount - a.amount;
      case 'endDate_ASC':
        return a.endDate.getTime() - b.endDate.getTime();
      case 'endDate_DESC':
        return b.endDate.getTime() - a.endDate.getTime();
    }
  });

  const fundName =
    pledgeData?.fundCampaign?.pledges?.edges[0]?.node?.campaign?.fund?.name ??
    tCommon('Funds');

  return { pledges: sortedPledges, totalPledged, fundName };
};

export const isWithinCampaignDates = (
  pledgeData: { fundCampaign: InterfaceQueryFundCampaignsPledges } | undefined,
): boolean => {
  if (!pledgeData?.fundCampaign) return false;
  const now = dayjs();
  let start = dayjs(pledgeData.fundCampaign.startAt);
  let end = dayjs(pledgeData.fundCampaign.endAt);
  return now.isAfter(start) && now.isBefore(end);
};

export const getCampaignInfo = (
  pledgeData: { fundCampaign: InterfaceQueryFundCampaignsPledges } | undefined,
): InterfaceCampaignInfoPG => {
  if (!pledgeData?.fundCampaign) {
    return {
      name: '',
      goal: 0,
      startDate: new Date(),
      endDate: new Date(),
      currency: '',
    };
  }

  return {
    name: pledgeData.fundCampaign.name,
    goal: pledgeData.fundCampaign.goalAmount ?? 0,
    startDate: pledgeData.fundCampaign.startAt ?? new Date(),
    endDate: pledgeData.fundCampaign.endAt ?? new Date(),
    currency: pledgeData.fundCampaign.currencyCode ?? 'USD',
  };
};
