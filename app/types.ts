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
  Status: "DRAFT" | "PUBLISHED";
  createdAt: Date;
  desc?: string;
  catSlug?: string;
  category?: string;
  MetaDescription?: string;
  userId: string | null;
}

export interface onSaveProps {
  title: string;
  MetaDescription: string | null;
  category: string;
  content: string;
  excerpt: string;
  keywords: string;
  status: string;
  slug: string;
  id?: string;
  authorId?: string;
  createdAt?: Date;
  thumbnail?: string;
  updatedAt?: Date;
  ogImage?: string;
}
