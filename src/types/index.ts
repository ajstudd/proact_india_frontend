export * from "./common";
export * from "./auth";
export * from "./routes";
export * from "./colors";
export * from "./breakpoints";
export * from "./user";
export * from "./posts";

export interface IUserData {
  id: string;
  _id?: string;
  name: string;
  email?: string;
  phone?: string;
  role: "ADMIN" | "USER" | "CONTRACTOR" | "GOVERNMENT";
  photo?: string;
  isVerified: boolean;
  lastLogin?: Date;
  governmentId?: string;
  designation?: string;
  department?: string;
  contractorLicense?: string;
  contributions?: number;
  experience?: number;
  reputationScore?: number;
  createdAt?: Date;
  updatedAt?: Date;
  bookmarks?: string[];
  contractorId?: string;
}

// New interface for project search results
export interface ProjectSearchResult {
  _id: string;
  title: string;
  bannerUrl?: string;
  description: string;
  location?: {
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

export interface ProjectSearchResponse {
  projects: ProjectSearchResult[];
  total: number;
  limit: number;
  skip: number;
  hasMore: boolean;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  phone?: string;
  photo?: string;
  designation?: string;
  department?: string;
  experience?: number;
}

export interface UpdateUserResponse {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  // Include other updated fields
  photo?: string;
  role: string;
  isVerified: boolean;
  designation?: string;
  department?: string;
  experience?: number;
  reputationScore?: number;
  bookmarks?: string[];
}

export interface BookmarkResponse {
  message: string;
  bookmarks: BookmarkedProject[];
}

export interface BookmarkedProjectsResponse {
  bookmarks: BookmarkedProject[];
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

export interface ErrorResponse {
  message: string;
  code?: number;
}
