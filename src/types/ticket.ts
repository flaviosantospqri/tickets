export interface JiraTicket {
  id: string;
  key: string;
  fields: {
    summary: string;
    status: {
      name: string;
      statusCategory: {
        key: string;
      };
    };
    assignee: {
      displayName: string;
      emailAddress: string;
      avatarUrls: {
        '48x48': string;
      };
    } | null;
    creator: {
      displayName: string;
      emailAddress: string;
    };
    created: string;
    updated: string;
    priority: {
      name: string;
    };
    issuetype: {
      name: string;
      iconUrl: string;
    };
    description?: string;
  };
}

export interface JiraIssue {
  key: string;
  summary: string;
  status: string;
  priority: string;
  assignee?: string;
  created?: string;
  updated?: string;
}

export interface Assignee {
  displayName?: string,
  avatarUrls?: unknown,
  emailAddress?: string

}

export interface DashboardStats {
  total: number;
  inProgress: number;
  completed: number;
  pending: number;
  aguardando: number;
  liberado: number;
  cancelado: number;
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}


export interface JiraUser {
  displayName?: string;
  emailAddress?: string;
  avatarUrls?: {
    '16x16'?: string;
    '48x48'?: string;
  };
}

export interface JiraFields {
  key: string;
  jira: string;
  summary: string;
  status: string;
  statusCategory: string;
  assignee?: JiraUser | null;
  creator?: JiraUser;
  created: string;
  updated: string;
  priority?: {
    name?: string;
  };
  type: string;
  typeIcon: string;
  description?: string;
  itemJira?: string;
}

export interface TicketData {
  id: string;
  key: string;
  jira: string;
  fields: JiraFields;
  status: string;
  assignee?: JiraUser | null;
  creator?: JiraUser;
  created: string;
  updated: string;
  priority?: {
    name?: string;
  };
  type: string;
  description?: string;
}
