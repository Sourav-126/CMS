export interface SessionUser {
  id: string;
  name: string;
  email: string;
  image: string;
  username: string;
  role?: string;
}

export interface Session {
  user: SessionUser;
}
