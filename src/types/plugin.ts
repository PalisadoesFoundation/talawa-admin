export const Status = {
  ACTIVE: 'ACTIVE',
  BLOCKED: 'BLOCKED',
  DELETED: 'DELETED',
} as const;

export type Status = (typeof Status)[keyof typeof Status];

export const Type = {
  PRIVATE: 'PRIVATE',
  UNIVERSAL: 'UNIVERSAL',
} as const;

export type Type = (typeof Type)[keyof typeof Type];

export type Plugin = {
  _id: string;
  pluginCreatedBy: string;
  pluginDesc: string;
  pluginName: string;
  uninstalledOrgs?: string[]; // Optional and non-nullable
};

export type PluginField = {
  createdAt: Date;
  key: string;
  status: Status;
  value: string;
};

export type PluginFieldInput = {
  key: string;
  value: string;
};

export type PluginInput = {
  fields?: PluginFieldInput[]; // Optional and nullable
  orgId: string;
  pluginKey?: string; // Optional
  pluginName: string;
  pluginType?: Type; // Optional
};
