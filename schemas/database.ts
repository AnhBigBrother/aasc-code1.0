type UserSession = {
  access_token: string;
  expires: number;
  expires_in: number;
  refresh_token: string;
  member_id: string;
  user_id: string;
  client_endpoint: string;
  server_endpoint: string;
  scope: string;
  domain: string;
  status: string;
};

type Database = {
  [user: string]: UserSession;
};

export { type UserSession, type Database };
