export interface TrimmedProject {
  _id: string;
  title: string;
  description: string;
  bannerUrl?: string;
  location: {
    lat: number;
    lng: number;
    place: string;
  };
  budget?: number;
  status?: string;
  contractorId?: string;
  governmentId?: string;
  contractor?: string;
  government?: string;
  createdAt: string;
  updatedAt: string;
  associatedProfiles: string[];
  likes: string[];
  dislikes: string[];
  expenditure?: number;
  comments?: string[];
}

export interface TrimmedProjectsResponse {
  projects: TrimmedProject[];
}

export interface ProjectUpdate {
  content: string;
  media?: string[];
  date: Date;
}

export interface Project {
  _id: string;
  title: string;
  bannerUrl: string;
  pdfUrl?: string;
  description?: string;
  location: {
    lat: number;
    lng: number;
    place: string;
  };
  budget: number;
  expenditure: number;
  likes: string[]; // ObjectIds as strings
  dislikes: string[]; // ObjectIds as strings
  comments: string[]; // ObjectIds as strings
  updates: ProjectUpdate[];
  associatedProfiles: string[]; // ObjectIds as strings
  contractor: string; // ObjectId as string
  government: string; // ObjectId as string
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectsResponse {
  projects: Project[];
}

export interface BookmarkedProject {
  _id: string;
  title: string;
  description?: string;
  bannerUrl: string;
  location: {
    lat: number;
    lng: number;
    place: string;
  };
  budget: number;
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

export interface BookmarkedProjectsResponse {
  bookmarks: BookmarkedProject[];
}
