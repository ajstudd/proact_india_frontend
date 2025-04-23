import { Role } from "./auth";

export interface IUser {
  name: string;
  password: string;
  phone: string;
  photo: string;
  email: string;
}

export interface TUser {
  _id?: string;
  phone: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  photo?: string;
  id?: string;
  email: string;
  bookmarks?: string[];
  isVerified?: boolean;
  contractorLicense?: string;
  contractorId?: string;
  governmentId?: string;
}

export interface ToUser {
  _id: string;
  role: String;
  phone: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  photo: string;
  id: string;
  email: string;
  bookmarks?: string[];
}

export interface IUserData {
  user: TUser;
}

export type UpdateUserPayload = Partial<IUser>;

export interface UpdateUserResponse {
  _id: string;
  email: string;
  role: Role;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  id: string;
  subscription: string;
  bookmarks?: string[];
  isVerified?: boolean;
  photo?: string;
  phone?: string;
  governmentId?: string;
  contractorLicense?: string;
}

export interface UserProfileResponse {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  photo?: string;
  isVerified?: boolean;
  createdAt: Date;
  updatedAt: Date;
  id: string;
  contractorLicense?: string;
  contractorId?: string;
  governmentId?: string;
  unreadNotificationsCount?: number;
  totalNotificationsCount?: number;
}

export interface EmailVerificationPayload {
  token: string;
  email: string;
}

export interface EmailVerificationResponse {
  message: string;
  user: UserProfileResponse;
}

// For user comments
export interface Comment {
  _id: string;
  content: string;
  user: {
    _id: string;
    name: string;
    photo?: string;
  };
  project: {
    _id: string;
    title: string;
    bannerUrl?: string;
    location: {
      place: string;
      coordinates?: [number, number];
    };
    government?: {
      _id: string;
      name: string;
    };
  };
  likes: string[];
  dislikes: string[];
  replies: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface UserCommentsResponse {
  comments: Comment[];
}

export interface BookmarkedProject {
  _id: string;
  title: string;
  bannerUrl?: string;
  description: string;
  location: {
    place: string;
    coordinates?: [number, number];
  };
  budget?: number;
  contractor?: {
    _id: string;
    name: string;
  };
  government?: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface BookmarkResponse {
  message: string;
  bookmarks: BookmarkedProject[];
}

export interface BookmarkedProjectsResponse {
  bookmarks: BookmarkedProject[];
}
