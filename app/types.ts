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

export interface User {
  id: string;
  name?: string;
  email: string;
  image?: string;
  username?: string;
  role?: string;
  createdAt: Date;
}

export interface Post {
  id: string;
  title: string;
  slug?: string;
  thumbnail?: string;
  content: string;
  excerpt?: string;
  keywords?: string;
  Status?: string;
  createdAt: Date;
  desc?: string;
  catSlug?:string
}
